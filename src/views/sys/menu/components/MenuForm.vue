<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="menuConst._MENU_RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="parentName" :label="t('model.perms.parentName')" name="parentName">
        <Input
          :disabled="isUpdate && !updateFields.includes('parentId')"
          v-model:value="parentName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="menuName" :label="t('model.perms.menuName')" name="menuName">
        <Input
          :disabled="isUpdate && !updateFields.includes('menuName')"
          v-model:value="formState.menuName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="path" :label="t('model.perms.path')" name="path">
        <Input
          :disabled="isUpdate && !updateFields.includes('path')"
          v-model:value="formState.path"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="component" :label="t('model.perms.component')" name="component">
        <Input
          :disabled="isUpdate && !updateFields.includes('component')"
          v-model:value="formState.component"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="perms" :label="t('model.perms.perms')" name="perms">
        <Input
          :disabled="isUpdate && !updateFields.includes('perms')"
          v-model:value="formState.perms"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="icon" :label="t('model.perms.icon')" name="icon">
        <Input
          :disabled="isUpdate && !updateFields.includes('icon')"
          v-model:value="formState.icon"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="type" :label="t('model.perms.type')" name="type">
        <Select
          :disabled="isUpdate && !updateFields.includes('type')"
          ref="select"
          v-model:value="formState.type"
          style="width: 120px"
          :options="menuConst._TYPE"
        />
      </FormItem>
      <FormItem ref="orderNum" :label="t('model.perms.orderNum')" name="orderNum">
        <Input
          :disabled="isUpdate && !updateFields.includes('orderNum')"
          v-model:value="formState.orderNum"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="createTime" :label="t('model.perms.createTime')" name="createTime">
        <DatePicker
          showTime
          :disabled="isUpdate && !updateFields.includes('createTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.createTime"
          @change="change"
        />
      </FormItem>
      <FormItem ref="updateTime" :label="t('model.perms.updateTime')" name="updateTime">
        <DatePicker
          showTime
          :disabled="isUpdate && !updateFields.includes('updateTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.updateTime"
          @change="update"
        />
      </FormItem>
      <FormItem ref="createBy" :label="t('model.perms.createBy')" name="createBy">
        <Input
          :disabled="isUpdate && !updateFields.includes('createBy')"
          v-model:value="formState.value"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.perms.state')" name="state">
        <Select
          :disabled="isUpdate && !updateFields.includes('state')"
          ref="select"
          v-model:value="formState.state"
          style="width: 120px"
          :options="menuConst.STATES"
        />
      </FormItem>
      <FormItem :wrapper-col="{ span: 14, offset: 4 }">
        <Button v-if="isUpdate" type="primary" @click="onSubmit">{{
          t('model.perms.updateMenu')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.perms.addMenu') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.perms.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addMenu, updateMenu, getMenu, getParentMenu } from '/@/api/sys/menu/menu';
  import { MenuConst, MenuModel } from '/@/api/sys/menu/model/menuModel';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button, Form, FormItem, Input, DatePicker } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { ValidateErrorEntity } from 'ant-design-vue/lib/form/interface';
  import { Loading } from '/@/components/Loading';
  export default defineComponent({
    name: 'MenuForm',
    components: {
      Select,
      Button,
      DatePicker,
      Form,
      FormItem,
      Input,
      Loading,
    },
    props: {
      //传递过来的分组编号和当前详情的编号
      id: {
        type: String,
        require: true,
      },
      parentId: {
        type: String,
        require: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('menu');
      const menuConst = ref(MenuConst);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');
      const formRef = ref();
      let isUpdate = ref<boolean>(false);
      if (props.id && props.id !== '') {
        isUpdate.value = true;
      }
      let parentName = ref();
      const formState: UnwrapRef<MenuModel> = reactive({
        id: '',
        // parentId: props.parentId || '',
        parentId: props.parentId || '',
        menuName: '',
        path: '',
        component: '',
        perms: '',
        icon: '',
        type: '',
        orderNum: '',
        createTime: '',
        updateTime: '',
        createBy: '',
        state: '',
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(async () => {
            loading.value = true;
            if (props.id) {
              try {
                const { content } = await updateMenu(formState);
                success(t('model.perms.updateMenu'), t('model.perms.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.perms.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addMenu(formState);
                success(t('model.perms.addMenu'), t('model.perms.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.perms.fail'));
              } finally {
                loading.value = false;
              }
            }
          })
          .catch((error: ValidateErrorEntity<MenuModel>) => {
            console.log('error', error);
          });
      };

      const change = (_date: any | string, dateString: string) => {
        formState.createTime = dateString;
      };
      const update = (_date: any | string, dateString: string) => {
        formState.updateTime = dateString;
      };
      const resetForm = async () => {
        if (props.id) {
          loading.value = true;
          try {
            const { content } = await getMenu({ id: props.id });
            if (content) {
              Object.assign(formState, content);
            }
          } catch (error) {
          } finally {
            loading.value = false;
          }
        } else {
          formRef.value.resetFields();
        }
        loading.value = false;
      };
      onMounted(async () => {
        loading.value = true;
        //添加一级菜单
        if (props.id === '' && props.parentId === '') {
          parentName.value = '';
        }
        //更新
        if (props.id) {
          const { content } = await getMenu({ id: props.id });
          if (content) {
            Object.assign(formState, content);
            //判断更新的是不是一级菜单，是的话，上级名称为空
            const allMenu = await getParentMenu({});
            const ids = [''];
            allMenu.content.forEach((e) => {
              if (e.id) {
                ids.push(e.id);
              }
            });
            if (content.id) {
              if (ids.includes(content.id)) {
                parentName.value = '';
              } else {
                const result = await getMenu({ id: content.parentId });
                parentName.value = result.content.menuName;
              }
            }
          }
        }
        // 将上级路径添加到输入框
        if (props.parentId) {
          const { content } = await getMenu({ id: props.parentId });
          if (content) {
            formState.path = content.path + '/';
            parentName.value = content.menuName;
          }
        }
        loading.value = false;
      });

      const success = (message: any, description: any) => {
        notification.success({
          message: message,
          description: description,
          duration: 3,
        });
      };

      const failed = (title: any, content: any) => {
        createErrorModal({
          title: title || t('sys.api.errorTip'),
          content: content || t('sys.api.networkExceptionMsg'),
          getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
        });
      };

      return {
        t,
        props,
        isUpdate,
        parentName,
        prefixCls,
        menuConst,
        tip,
        updateFields: MenuConst._UPDATE_MENU_FIELDS,
        loading,
        change,
        update,
        onSubmit,
        resetForm,
        formRef,
        formState,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
      };
    },
  });
</script>
