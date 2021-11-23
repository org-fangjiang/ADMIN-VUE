<template>
  <Select
    v-model:value="props.licenseId"
    label-in-value
    placeholder=""
    style="width: 185.95px"
    :filter-option="false"
    :options="data"
    @change="change"
  >
    设置预售证
  </Select>
  <Button @click="save">保存</Button>
</template>
<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { Select, Button } from 'ant-design-vue';
  import { getLicensesAll } from '/@/api/host/license/license';
  import { BuildModel } from '/@/api/host/build/model/buildModel';
  import { updateBuild } from '/@/api/host/build/build';
  interface Option {
    value: string;
    label: string;
  }

  export default defineComponent({
    name: 'FLicense',
    components: {
      Select,
      Button,
    },
    props: {
      projectId: {
        type: String,
        required: true,
      },
      licenseId: {
        type: String,
        required: false,
      },
      buildId: {
        type: String,
        required: true,
      },
    },
    emits: ['setBuildLicense'],
    setup(props, { emit }) {
      const data = ref<Option[]>([]);

      const formState: UnwrapRef<BuildModel> = reactive({});
      let licenseName = ref('');

      onMounted(async () => {
        const { content } = await getLicensesAll({ projectId: props.projectId });
        if (content && content.length > 0) {
          content.forEach((item) => {
            data.value.push({ value: item.id || '', label: item.number || '' });
          });
        }
      });

      const change = (value) => {
        licenseName.value = value.label;
        formState.licenseId = value.value;
        formState.projectId = props.projectId;
        formState.id = props.buildId;
      };

      const save = async () => {
        if (formState.id) {
          await updateBuild(formState);
          emit('setBuildLicense', formState);
        } else {
          debugger;
          emit('setBuildLicense', { formState, licenseName });
        }
      };

      return {
        change,
        data,
        props,
        save,
        licenseName,
      };
    },
  });
</script>
