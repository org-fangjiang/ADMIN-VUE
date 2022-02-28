<template>
  <div class="p-4">
    <div v-if="follows && follows.length > 0" class="text-[18px]">
      <Badge
        v-for="item in follows"
        :key="item.content.description"
        :status="'success'"
        :text="item.content.description"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import moment from 'moment';
  import { defineComponent, onMounted, reactive } from 'vue';
  import { getNextFollowInDay } from '/@/api/customer/crmFollow/follow';
  import { Badge } from 'ant-design-vue';

  export default defineComponent({
    name: 'FollowForm',
    components: {
      Badge,
    },
    props: {
      id: {
        type: moment,
        required: true,
      },
    },
    setup(props) {
      let follows: any[] = reactive([]);
      onMounted(async () => {
        const result = await getNextFollowInDay(props.id);
        if (result.content && result.content.length > 0) {
          result.content.forEach((item) => {
            follows.push(item);
          });
        }
      });
      return {
        follows,
      };
    },
  });
</script>
