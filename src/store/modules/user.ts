import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { PageEnum } from '/@/enums/pageEnum';
import { ACCESS_TOKEN_KEY, USER_INFO_KEY, REFRESH_TOKEN_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { LoginParams, LoginResultModel, UserInfoModel } from '/@/api/sys/model/userModel';
import { doLogout, getUserInfo, loginApi, refreshTokenApi } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { tokenInfoModel } from '/@/api/sys/model/tokenModel';
import { MenuConst } from '../../api/sys/menu/model/permsModel';

interface UserState {
  userInfo: Nullable<UserInfo>;
  perms: string[];
  access_token: string | undefined;
  expires_in: number;
  refresh_token: string | undefined;
  scope: string[];
  token_type: string;
  sessionTimeout?: boolean;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    perms: [],
    // token
    access_token: undefined,
    expires_in: 0,
    refresh_token: undefined,
    scope: [],
    token_type: '',
    // Whether the login expired
    sessionTimeout: false,
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getPerms(): string[] {
      return this.perms;
    },
    getAccessToken(): string {
      return this.access_token || getAuthCache<string>(ACCESS_TOKEN_KEY);
    },
    getRefreshToken(): string {
      return this.access_token || getAuthCache<string>(REFRESH_TOKEN_KEY);
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
  },
  actions: {
    setTokenInfo(tokenInfo: tokenInfoModel) {
      this.setAccessToken(tokenInfo.token_type + ' ' + tokenInfo.access_token);
      this.setExpiresIn(tokenInfo.expires_in);
      this.setRefreshToken(tokenInfo.refresh_token);
      this.setScope(tokenInfo.scope);
      this.setTokenType(tokenInfo.token_type);
    },
    setAccessToken(info: string | undefined) {
      this.access_token = info;
      setAuthCache(ACCESS_TOKEN_KEY, info);
    },
    setExpiresIn(info: number) {
      this.expires_in = info;
    },
    setRefreshToken(info: string | undefined) {
      this.refresh_token = info;
      setAuthCache(REFRESH_TOKEN_KEY, info);
    },
    setScope(info: string[]) {
      this.scope = info;
    },
    setTokenType(info: string) {
      this.token_type = info;
    },
    setUserInfo(info: UserInfo) {
      this.userInfo = info;
      setAuthCache(USER_INFO_KEY, info);
    },
    setPerms(info: string[]) {
      this.perms = info;
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.perms = [];
      this.access_token = '';
      this.expires_in = 0;
      this.refresh_token = '';
      this.scope = [];
      this.token_type = '';
      this.sessionTimeout = false;
    },
    async refreshToken() {
      const refresh = this.getRefreshToken;
      if (!refresh) {
        return;
      }
      const tokenInfo: LoginResultModel = await refreshTokenApi({
        grant_type: 'refresh_token',
        refresh_token: refresh,
        client_id: 'fangjiang',
        client_secret: '123456',
        scope: 'all',
      });
      this.setTokenInfo(tokenInfo);
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      }
    ): Promise<UserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        // save token
        this.setTokenInfo(data);
        // get user info
        const userInfo = await this.getUserInfoAction();

        const sessionTimeout = this.sessionTimeout;
        if (sessionTimeout) {
          this.setSessionTimeout(false);
        } else if (goHome) {
          const permissionStore = usePermissionStore();
          if (!permissionStore.isDynamicAddedRoute) {
            const routes = await permissionStore.buildRoutesAction();
            routes.forEach((route) => {
              router.addRoute(route as unknown as RouteRecordRaw);
            });
            router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
            permissionStore.setDynamicAddedRoute(true);
          }
          await router.replace(PageEnum.BASE_HOME);
        }
        return userInfo;
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getUserInfoAction(): Promise<UserInfo> {
      const userInfo = await getUserInfo();
      this.setUserInfo(userInfo);
      const roleId = userInfo.roleId;
      const roleList = userInfo.sysRoleBeans.filter((roleInfo) => {
        return roleInfo.id === roleId;
      });
      if (roleList.length > 0) {
        const perms: string[] = [];
        roleList[0].menus.forEach((menu) => {
          if (menu.type === MenuConst.EFFECTIVE && menu.perms) {
            perms.push(menu.perms);
          }
        });
        this.setPerms(perms);
      }
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      try {
        await doLogout();
      } catch {
        console.log('注销Token失败');
      }
      this.setAccessToken(undefined);
      this.setSessionTimeout(false);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: t('sys.app.logoutTip'),
        content: t('sys.app.logoutMessage'),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
