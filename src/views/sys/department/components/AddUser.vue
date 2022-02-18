<template>
  <div>
    <Button :class="`${prefixCls}-select`" @click="addUser">确定</Button>
    <!-- 状态筛选 -->
    <Select
      ref="select"
      :allowClear="true"
      v-model:value="condition.state"
      style="width: 120px"
      @change="stateHandleChange"
      :options="userConst.STATES"
      :pagination="false"
      :class="`${prefixCls}-select`"
    />
    <Table
      :rowSelection="{ selectedRowKeys: selected, onChange: onSelectChange, type: 'radio' }"
      :columns="columns"
      :data-source="list"
      rowKey="id"
      :pagination="false"
    >
      <template #sysUserRolesById="{ text: sysUserRolesById }">
        <span v-for="item in sysUserRolesById" :key="item.id">
          <Tag :color="userConst.STATES[0].color">
            {{ item.roleName }}
          </Tag>
        </span>
      </template>
      <template #state="{ text: state }">
        <span>
          <Tag :color="userConst.STATES[state].color">
            {{ userConst.STATES[state].label }}
          </Tag>
        </span>
      </template>
    </Table>
    <Pagination
      show-size-changer
      size="large"
      :show-total="(total) => t('component.table.total', { total })"
      :pageSizeOptions="pageSizeList"
      :current="pageParam.number"
      :pageSize="pageParam.size"
      :total="pageParam.totalElements"
      @change="onChange"
      @showSizeChange="onShowSizeChange"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { BasePageResult, PageSizeList } from '/@/api/model/baseModel';
  import { GetUserModel, _Component_Columns, _Const } from '/@/api/sys/user/model/userModel';
  import { getUsers, setUserDeptId } from '/@/api/sys/user/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { processList, success, failed } from '/@/hooks/web/useList';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Table, Pagination, Tag, Button, Select } from 'ant-design-vue';

  export default defineComponent({
    name: 'AddUser',
    components: {
      Table,
      Pagination,
      Tag,
      Button,
      Select,
    },
    props: {
      id: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { t } = useI18n();
      const { createErrorModal } = useMessage();
      const { prefixCls } = useDesign('user');
      const userConst = ref(_Const);
      let loading = ref<boolean>(true);
      let tip = ref<string>('加载中...');

      const columns = reactive(_Component_Columns);

      const pageSizeList = ref<string[]>(PageSizeList);
      let pageParam = reactive({
        size: 10,
        number: 1,
        numberOfElements: 0,
        totalPages: 0,
        totalElements: 0,
      });

      const condition = reactive({
        deptId: '',
        state: '1',
        mobile: '',
        companyId: '',
        roleId: '',
      });

      //根据状态筛选
      const stateHandleChange = async (value) => {
        condition.state = value;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      const users: GetUserModel[] = [];
      let list = reactive(users);
      //获取列表数据
      const getList = async () => {
        loading.value = true;
        let result: BasePageResult<GetUserModel> | undefined;
        try {
          result = await getUsers(condition, {
            pageSize: pageParam.size,
            pageNum: pageParam.number,
          });
        } catch (error: any) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error?.response?.data?.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
        return result;
      };
      //加载
      onMounted(async () => {
        const result = await getList();
        processList(result, list, pageParam);
      });

      //页码改变
      const onChange = async (page) => {
        pageParam.number = page;
        const result = await getList();
        processList(result, list, pageParam);
      };
      //每页条数改变
      const onShowSizeChange = async (current, size) => {
        console.log(current);
        pageParam.size = size;
        pageParam.number = 1;
        const result = await getList();
        processList(result, list, pageParam);
      };

      let selected = ref<string[]>([]); //选中的数据

      //选中的数据发生改变时
      const onSelectChange = (selectedRowKeys) => {
        selected.value.splice(0);
        selectedRowKeys.forEach((item) => {
          selected.value.push(item);
        });
      };

      // 确认添加
      const addUser = async () => {
        if (selected.value && selected.value.length > 0) {
          try {
            await setUserDeptId(selected.value[0], props.id);
            success('成功', '部门添加人员成功');
          } catch (error) {
            failed('失败', '部门添加人员失败');
          }
        }
      };

      return {
        t,
        prefixCls,
        userConst,
        tip,
        columns,
        condition,
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
        loading,
        pageSizeList,
        pageParam,
        list,
        stateHandleChange,
        onChange,
        onShowSizeChange,
        selected,
        onSelectChange,
        addUser,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-user';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
    }
  }

  .@{prefix-cls} {
    &-action-menu-item {
      text-align: center;
    }

    &-select {
      margin-right: 10px;
      margin-bottom: 20px;
    }
  }
</style>
