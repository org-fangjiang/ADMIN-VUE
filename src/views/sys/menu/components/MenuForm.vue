<template>
  <div>
    <Form
      ref="formRef"
      :model="formState"
      :rules="menuConst._MENU_RULES"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <FormItem ref="id" :label="t('model.menu.id')" name="id">
        <Input
          :disabled="isUpdate && !updateFields.includes('id')"
          v-model:value="formState.id"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="parentId" :label="t('model.menu.parentId')" name="parentId">
        <Input
          :disabled="isUpdate && !updateFields.includes('parentId')"
          v-model:value="formState.parentId"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="menuName" :label="t('model.menu.menuName')" name="menuName">
        <Input
          :disabled="isUpdate && !updateFields.includes('menuName')"
          v-model:value="formState.menuName"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="path" :label="t('model.menu.path')" name="path">
        <Input
          :disabled="isUpdate && !updateFields.includes('path')"
          v-model:value="formState.path"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="component" :label="t('model.menu.component')" name="component">
        <Input
          :disabled="isUpdate && !updateFields.includes('component')"
          v-model:value="formState.component"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="perms" :label="t('model.menu.perms')" name="perms">
        <Input
          :disabled="isUpdate && !updateFields.includes('perms')"
          v-model:value="formState.perms"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="icon" :label="t('model.menu.icon')" name="icon">
        <Input
          :disabled="isUpdate && !updateFields.includes('icon')"
          v-model:value="formState.icon"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="type" :label="t('model.menu.type')" name="type">
        <Select
          :disabled="isUpdate && !updateFields.includes('type')"
          ref="select"
          v-model:value="formState.type"
          style="width: 120px"
          :options="menuConst._TYPE"
        />
      </FormItem>
      <FormItem ref="orderNum" :label="t('model.menu.orderNum')" name="orderNum">
        <Input
          :disabled="isUpdate && !updateFields.includes('orderNum')"
          v-model:value="formState.orderNum"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="createTime" :label="t('model.menu.createTime')" name="createTime">
        <DatePicker
          showTime
          :disabled="isUpdate && !updateFields.includes('createTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.createTime"
          @change="change"
        />
      </FormItem>
      <FormItem ref="updateTime" :label="t('model.menu.updateTime')" name="updateTime">
        <!-- <Input
          :disabled="isUpdate && !updateFields.includes('updateTime')"
          v-model:value="formState.value"
          autoComplete="off"
        /> -->
        <DatePicker
          showTime
          :disabled="isUpdate && !updateFields.includes('updateTime')"
          format="YYYY-MM-DD HH:mm:ss"
          :value="formState.updateTime"
          @change="update"
        />
      </FormItem>
      <FormItem ref="createBy" :label="t('model.menu.createBy')" name="createBy">
        <Input
          :disabled="isUpdate && !updateFields.includes('createBy')"
          v-model:value="formState.value"
          autoComplete="off"
        />
      </FormItem>
      <FormItem ref="state" :label="t('model.menu.state')" name="state">
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
          t('model.menu.updateMenu')
        }}</Button>
        <Button v-else type="primary" @click="onSubmit">{{ t('model.menu.addMenu') }}</Button>
        <Button style="margin-left: 10px" @click="resetForm">{{ t('model.menu.reset') }}</Button>
      </FormItem>
    </Form>
    <Loading :loading="loading" :absolute="false" :tip="tip" />
  </div>
</template>
<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { addMenu, updateMenu, getMenu } from '/@/api/sys/menu/menu';
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
                success(t('model.menu.updateMenu'), t('model.menu.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.menu.fail'));
              } finally {
                loading.value = false;
              }
            } else {
              try {
                const { content } = await addMenu(formState);
                success(t('model.menu.addMenu'), t('model.menu.success'));
                Object.assign(formState, content);
              } catch (error) {
                failed(error?.response?.data?.message, t('model.menu.fail'));
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
        // console.log('id:', props.id);
        // console.log('groupid:', props.parentId);
        if (props.id) {
          const { content } = await getMenu({ id: props.id });
          if (content) {
            Object.assign(formState, content);
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
