<template>
  <div class="relative w-full min-h-screen max-w-[700px]">
    <img :src="activity.headImg" width="100%" class="absolute top-0 z-0 w-full max-w-[700px]" />
    <div class="relative top-0 text-center w-full pt-[70px] px-5 flex flex-col items-center">
      <span class="text-[38px] text-white font-extrabold">{{ activity.title }}</span>
      <!-- <span class="text-white text-[22px] tracking-widest mt-4">{{ activity.description }}</span> -->
      <div class="flex flex-col mt-6">
        <span
          v-for="(item, index) in activity.projectEntities"
          :key="index"
          class="text-[14px] text-white"
          >用户<span>{{ item.lookTime }}</span
          >领取了<span class="text-[#FFEA00]">{{ item.name }}</span
          >优惠</span
        >
      </div>
      <img
        src="../../../../assets/images/slice.png"
        alt="房匠优势"
        width="100%"
        class="object-cover w-full mt-20"
      />
      <div class="relative flex flex-col items-center w-full mt-8 rounded-lg shadow-lg">
        <div
          class="
            absolute
            top-[-20px]
            px-4
            rounded-[6px]
            flex flex-row
            h-10
            items-center
            bg-gradient-to-b
            space-x-4
            from-[#FF5723]
            to-[#FF0013]
          "
        >
          <img
            src="../../../../assets/images/circle.png"
            alt=""
            height="100%"
            class="h-[16px] object-cover"
          />
          <span class="text-[#FFF9EF] text-[16px]">
            <span v-if="activity.sort === '1'">特价楼盘</span>
            <span v-if="activity.sort === '2'">限时折扣</span>
            <span v-if="activity.sort === '3'">特惠补贴</span>
            <span v-if="activity.sort === '4'">成交好礼</span>
            <span v-if="activity.sort === '5'">推荐楼盘</span>
            <span v-if="activity.sort === '6'">专车接送</span>
          </span>
          <img
            src="../../../../assets/images/circle.png"
            alt=""
            height="100%"
            class="h-[16px] object-cover"
          />
        </div>
        <div class="bg-[#FFF9EF] rounded-[12px] pt-[60px] px-2 w-full">
          <div
            v-for="(item, index) in activity.projectEntities"
            :key="index"
            class="flex flex-col items-center"
          >
            <div class="flex flex-row w-full">
              <img
                v-if="item.firstImg && item.firstImg.address"
                :src="item.firstImg.address"
                alt="楼盘首图"
                class="w-2/5 h-24 rounded-[8px]"
              />
              <div class="relative w-full ml-4 overflow-hidden">
                <div class="w-full text-left">
                  <span class="text-[#333333] text-[16px] w-full mt-0">{{ item.name }}</span>
                  <span class="absolute right-0 text-right top-1">
                    <span
                      v-if="item.saleState === '1'"
                      class="border border-[#333333] rounded-full px-2"
                      >在售</span
                    >
                    <span
                      v-if="item.saleState === '2'"
                      class="border border-[#333333] rounded-full px-2"
                      >待售</span
                    >
                    <span
                      v-if="item.saleState === '3'"
                      class="border border-[#333333] rounded-full px-2"
                      >售罄</span
                    >
                  </span>
                </div>
                <div>
                  <div class="flex flex-row items-center">
                    <svg
                      version="1.1"
                      class="w-4 h-4 text-gray-400 icon"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="48px"
                      height="48px"
                      viewBox="0 0 48 48"
                      enable-background="new 0 0 48 48"
                      xml:space="preserve"
                    >
                      <image
                        id="image0"
                        width="48"
                        height="48"
                        x="0"
                        y="0"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                      AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN
                      RQflCgoAJiRQjb+hAAACXUlEQVRYw+2YMWgTURjHf5cciUmhIhYFQwsdLFIUBKGDHURcpItQ3dT5
                      6WA6SOMm6qYubvIG6SZUEBSDCCqCgw4i0kF0EkQipCiI2l6b9HIO6TPX3CX33l0iGfwv9967777f
                      9733cu/LWR5KYo7j5HGJVhqHRbmgYYnVBAiLMjM6D/h0V57WB8xxC4Dn/GCDVJcnXGwmmQTglLwf
                      BbA3rxeANWbkC73gRYnrQJFIgIq1ANzRdQ/yBq+BXdGWCrAOPNZ1D8ACMCJyugAb+GoE+Azkuq7W
                      FkA8NfCiTBTAM4ZpWifLwBBgDR7Ak6smgBjhBbepaAvT9rXNMxhiSbhtQaZFnadck9+CAHNZ7A0d
                      38dJMSFXkgNqSNZ8PhrYjDIL7OEyl5JN0TKwIovBG+IED4AzQYCmxEF24jAFZMUxHPJ8kJXWfflQ
                      3GSeHc1enAwkU5utPM8AuMqVLRZPmKfebMbZpsOBkXxb/yeQjp9BiVFqvn6Ol20W9VYzBkA+ijRJ
                      t5r/9GXn9BuQ7QdArUENuCe+d4BYwKz8mATgAmOMdbEcSZZBGnhPlW0dM6gmA2SAs/JdPCc6AAXR
                      lsiyHYffMqKu8FcVRgCO8ImlDlMaAjBXhiHG+1l4bQC/9AsvGMiyxRDQF/3PYLAyiNzT2mqEA3qX
                      jW+y47+Lumm4lYUCpIDpngGOtjwrwDJwUUwYOKkAjbA/IOIAJf4eUOo8KFMkxxsh+YKlsRrr7Ady
                      osSq70xxSTHOObJAuTmkvlXs5i2Fnk0RVDgkqz4AiAK3OUzGYLN6hP04LWq84ryqt/8AjaKFO12a
                      KAsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMTAtMDlUMTY6Mzg6MzYrMDg6MDA8nDXCAAAAJXRF
                      WHRkYXRlOm1vZGlmeQAyMDIxLTEwLTA5VDE2OjM4OjM2KzA4OjAwTcGNfgAAACB0RVh0c29mdHdh
                      cmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2dAAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBh
                      Z2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6OkhlaWdodAA0OIdghy0AAAAWdEVYdFRodW1i
                      OjpJbWFnZTo6V2lkdGgANDh/z0egAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JW
                      TgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MzM3Njg3MTYfrg0bAAAAEnRFWHRUaHVtYjo6U2l6ZQAx
                      NjgyQkKYWsBsAAAARnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3Zp
                      ZXcyXzlfMTYzMTU5MjMzNzY3ODc4MzRfNzlfWzBdjI0y0QAAAABJRU5ErkJggg=="
                      />
                    </svg>
                    <span class="overflow-hidden text-[#666666] text-[8px]"
                      >{{ minRoom }}/{{ maxRoom }}室</span
                    >
                    <span class="ml-2 overflow-hidden text-[#666666] text-[8px]"
                      >{{ minArea }}/{{ maxArea }}㎡</span
                    >
                  </div>
                  <div class="flex flex-row items-center">
                    <svg
                      version="1.1"
                      class="w-4 h-4 text-gray-400 icon"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      width="48px"
                      height="48px"
                      viewBox="0 0 48 48"
                      enable-background="new 0 0 48 48"
                      xml:space="preserve"
                    >
                      <image
                        id="image0"
                        width="48"
                        height="48"
                        x="0"
                        y="0"
                        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                      AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElN
                      RQflCgoAJiq3NZKmAAAEB0lEQVRYw6XXW4hWVRQH8J/mjSQvE6b5ohRMOuKDouaAhWSoiRqZkkJK
                      grUxRUEfDKXUHrKhTBCKdj4YmlRgRmMoAwqSQk0OSKRmgrcHE4McJQLv9fAdx/Od73y3XC/nnL3W
                      //9fe+191j6n279qsdDNGKM1GoCrTvvVsVgTtFv1qDDZayYblhm+4JDP46EHFAgzrPFshYAftMR9
                      /1Mg9BQt7nq85aRj/kFfYzTp2eXZLsRbdQuEEb41InlotcOP8Y+Ud6hmi8xOHk95KZ6qSyBMdFgP
                      8I318USZJEbZ6GVw2zPxp5oFwuPO6wXeiNtUtPC6z8BNw+OlUn/3XFRbQj+9Gj1xm+mgl7Y8f45A
                      2GI0mBbb1GCxzTQwOmypoUShyYnaipNbqFHxZLUZbAUH6qEnbnMghS4vEBpNAYvqoU8hpoTG4uEe
                      mbBlYHfefgijzDUOHXaXbtx4Kew2F8usrFSieeDTHPotjttgppk2OJ63nAlqXvFg0SKHkU7iSny0
                      hP67rrf2nrXGF0ui/tKApvhbuRlMBO0lwHtN4ah11jkKZofSdWpPseSuQaH3dJQAW8BXcQF4L3xp
                      PlrsyMR1eKGLJXcGhZ5/NpN/syG4mNAjLnARQ0JzRuBsiiVX4GFwJwMbBY4UjR1Jee7bnRRLrkAh
                      4G4Gdhv0KRrrk/Lct7ulCRYLXAGDMrDCok4OfbuK1tfklOe+DUqx5Ar8AjKVjSecQn+toR+Eflr1
                      x6mS1605xZJY8S4qHBmTZG2VfXjO6dCGaQYno1mblGLJncExlzE0TMjMYb9NYLBFFiX0m+L+4qgw
                      wVBcdqysQLyV9MSF2dTiWitTtb1iZVxbkn8BdaD4AyBzHoRZWnEtDiiBC/3N8RR+tydey/Ff1R+z
                      495KAg/p9AgWxi/UZeFVO/G3gbHCNhXv2AXero++C7ErZl7T0hPtQ9AYZtSV/wyNKXQlgXjGQfBB
                      XfkXog/GM1UFsAI0hTk15z9HUwpZZPkfXnvNxBWD421VLfRwWQO+j7NKvfkfXoVTtSE5B6pZi4YU
                      qpYZED72JngynlXRwhMKdf8kLsvzdy+DW+0G+Lpq/oWIG1bnu8sIxOuWgnFhecX8lxsHlsbr+RGV
                      fkDaFZre8HihTMQw58HP8elyLOVKBPOT656yEXsykfUJxHNJmcaGzbn5bzY2Kc+58izVfgIPJN+q
                      Jc0vaW4cjM9XYqhUIpihE+wM44voxyf0nar0rCoC8aapye3hMLKLfqTDye3UePOBBIgdloDe2sMY
                      CGO06w2WxI5q+Br+9AkbrE9u38G7yf3GuKE6tiYBwvvWZIZa4lu1IGsUIKyS3qyr40e14WoWILxi
                      q8fwpxWxeo+qX4Aw0GJsj521Y/4DSPcta79rLVoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMTAt
                      MDlUMTY6Mzg6NDIrMDg6MDDCFhjIAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTEwLTA5VDE2OjM4
                      OjQyKzA4OjAws0ugdAAAACB0RVh0c29mdHdhcmUAaHR0cHM6Ly9pbWFnZW1hZ2ljay5vcme8zx2d
                      AAAAGHRFWHRUaHVtYjo6RG9jdW1lbnQ6OlBhZ2VzADGn/7svAAAAF3RFWHRUaHVtYjo6SW1hZ2U6
                      OkhlaWdodAA0OIdghy0AAAAWdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANDh/z0egAAAAGXRFWHRU
                      aHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE2MzM3Njg3
                      MjIz7prBAAAAEnRFWHRUaHVtYjo6U2l6ZQAyMTI1QkLGHJgzAAAARnRFWHRUaHVtYjo6VVJJAGZp
                      bGU6Ly8vYXBwL3RtcC9pbWFnZWxjL2ltZ3ZpZXcyXzlfMTYzMTc1NzUyNjc1MjE3NjJfODRfWzBd
                      eTPfkgAAAABJRU5ErkJggg=="
                      />
                    </svg>
                    <span
                      v-if="item.address"
                      class="text-[#666666] text-[8px]"
                      style="overflow: hidden; white-space: nowrap; text-overflow: ellipsis"
                      >{{ item.address }}</span
                    >
                  </div>
                </div>
                <div class="text-left">
                  <span class="text-[14px] text-[#FF0614]"
                    >{{ item.price }}<span class="text-[12px] text-black">元/㎡</span></span
                  >
                </div>
                <div class="space-x-2 text-left">
                  <span
                    v-for="(label, e) in item.sysDictDetailBeans"
                    :key="e"
                    class="rounded text-[8px] bg-[#FB3E48] px-1 text-white"
                    >{{ label.value }}</span
                  >
                </div>
              </div>
            </div>
            <div class="w-full my-4">
              <button
                class="
                  w-full
                  h-[35px]
                  text-[16px] text-white
                  bg-gradient-to-b
                  from-[#FF782E]
                  to-[#FD4721]
                  rounded-full
                "
                @click="clickOpen(item.id, item.lookTime, activity.cityId)"
                >立即领取</button
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="mt-8 w-full rounded-lg flex flex-col items-center bg-[#FFF9EF] px-2 py-4 shadow-lg"
      >
        <div class="rounded-full bg-[#FFECC5]">
          <button
            :class="
              step === '2'
                ? 'text-white bg-gradient-to-b from-[#FF782E] to-[#FD4721] h-full rounded-full'
                : 'text-fjYellow-100'
            "
            class="px-3 py-2 text-[16px]"
            @click="clickButton('2')"
            >帮我找房</button
          >
          <button
            :class="
              step === '4'
                ? 'text-white bg-gradient-to-b from-[#FF782E] to-[#FD4721] h-full rounded-full'
                : 'text-fjYellow-100'
            "
            class="px-3 py-2 text-[16px]"
            @click="clickButton('4')"
            >免费专车</button
          >
          <button
            :class="
              step === '3'
                ? 'text-white bg-gradient-to-b from-[#FF782E] to-[#FD4721] h-full rounded-full'
                : 'text-fjYellow-100'
            "
            class="px-3 py-2 text-[16px]"
            @click="clickButton('3')"
            >预约看房</button
          >
        </div>
        <div class="w-full mt-4 text-left">
          <span class="text-[#FF0614] text-[12px] flex-none text-left leading-tight"
            >已帮助1200人找到理想房源，省心安心买好房。让您买房变得简单——做您买房路上的自己人。</span
          >
        </div>
        <div class="w-full mt-1 space-x-1 text-left">
          <span class="text-white text-[8px] bg-[#FF0614] px-1 rounded">低价购房</span>
          <span class="text-white text-[8px] bg-[#FF0614] px-1 rounded">优质房源</span>
        </div>
        <div class="w-full mt-4" @click="helpOpen">
          <input
            type="text"
            class="
              px-4
              w-full
              h-[35px]
              rounded-full
              border border-fjYellow-100
              placeholder-[#999999] placeholder-[12px]
            "
            placeholder="&nbsp;&nbsp;&nbsp;&nbsp;请输入手机号，方便经纪人联系您"
          />
          <button
            class="
              text-white text-[16px]
              mt-2
              w-full
              bg-gradient-to-b
              from-[#FF782E]
              to-[#FD4721]
              rounded-full
              h-[35px]
            "
            >预约房产咨询师帮我找房</button
          >
        </div>
      </div>
      <div class="w-full mt-4 text-center">
        <span class="text-white text-[12px]"
          >河北房匠网络科技有限公司 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;冀ICP备19024434号</span
        >
      </div>
    </div>
    <div
      class="
        fixed
        bottom-0
        flex flex-row
        items-stretch
        justify-end
        w-full
        max-w-[700px]
        h-11
        px-5
        py-1
        bg-white
      "
    >
      <div
        class="absolute bottom-0 left-0 flex flex-col items-center object-left w-1/6"
        @click="helpOpen"
      >
        <img src="../../../../assets/images/help.png" class="w-[22px] h-[22px]" alt="帮我找房" />
        <span class="text-[#333333] text-[12px]">帮我找房</span>
      </div>
      <div
        class="
          ml-4
          mr-2
          bg-gradient-to-b
          space-x-2
          from-[#FF782E]
          to-[#FD4721]
          rounded-full
          px-2
          py-1
          flex flex-row
          items-center
        "
        @click="clickOpen()"
      >
        <img src="../../../../assets/images/car.png" alt="专车看房" />
        <span class="text-white text-[14px]">预约专车看房</span>
      </div>
      <div
        class="
          text-right
          bg-gradient-to-b
          space-x-2
          from-[#FE8088]
          to-[#FF0614]
          rounded-full
          px-2
          py-1
          flex flex-row
          items-center
        "
        @click="clickOpen()"
      >
        <img src="../../../../assets/images/hui.png" alt="更多优惠" />
        <span class="text-white text-[14px]">获取更多优惠</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onMounted, reactive, ref, UnwrapRef, watch } from 'vue';
  import { HostModel } from '/@/api/host/project/model/projectModel';
  import { getById } from '/@/api/marketing/clueActivity/clueActivity';
  import { clueActivityModel } from '/@/api/marketing/clueActivity/model/clueActivityModel';

  export default defineComponent({
    name: 'PreviewActivity',
    components: {},
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const activity: UnwrapRef<clueActivityModel> = reactive({});
      //类型
      let step = ref('2');
      const clickButton = (type: string) => {
        step.value = type;
      };
      //初始加载
      let minRoom = ref();
      let maxRoom = ref();
      let minArea = ref();
      let maxArea = ref();
      onMounted(async () => {
        if (props.id) {
          try {
            const { content } = await getById(props.id);
            Object.assign(activity, content);
            if (activity.projectEntities) {
              activity.projectEntities.forEach((item: HostModel) => {
                if (!item.address) {
                  item.address = '暂无数据';
                }
                if (!item.price) {
                  item.price = '暂无数据' as unknown as number;
                }
                if (item.hLayoutsById) {
                  let i = 0;
                  for (i; i < item.hLayoutsById.length; i++) {
                    if ((item.hLayoutsById[i + 1]?.room || 0) > (item.hLayoutsById[i]?.room || 0)) {
                      maxRoom.value = item.hLayoutsById[i + 1].room || 0;
                    }
                    if ((item.hLayoutsById[i + 1]?.area || 0) > (item.hLayoutsById[i]?.area || 0)) {
                      maxArea.value = item.hLayoutsById[i + 1].area;
                    }
                  }
                  let j = 0;
                  for (j; j < item.hLayoutsById.length; j++) {
                    if ((item.hLayoutsById[j + 1]?.room || 0) < (item.hLayoutsById[j]?.room || 0)) {
                      if (item.hLayoutsById[j + 1]?.room) {
                        minRoom.value = item.hLayoutsById[j + 1].room;
                      }
                    }
                    if ((item.hLayoutsById[j + 1]?.area || 0) < (item.hLayoutsById[j]?.area || 0)) {
                      if (item.hLayoutsById[j + 1]?.area) {
                        minArea.value = item.hLayoutsById[j + 1].area;
                      }
                    }
                  }
                }
              });
            }
          } catch (error) {
            // failed('失败', '获取当前活动失败');
            console.log(error);
          }
        }
      });
      watch(
        () => step.value,
        (_v1) => {}
      );
      watch(
        () => minRoom.value,
        (_v1) => {}
      );
      watch(
        () => minArea.value,
        (_v1) => {}
      );
      watch(
        () => maxArea.value,
        (_v1) => {}
      );
      watch(
        () => maxRoom.value,
        (_v1) => {}
      );
      let openingHelp = ref(false);
      let cityId = ref('');
      let lookTime = ref();
      let projectId = ref('');
      let opening = ref(false);
      const helpOpen = () => {
        openingHelp.value = true;
      };
      const clickOpen = (id?: string, look?: number, city?: string) => {
        cityId.value = city || '';
        lookTime.value = look || 0;
        projectId.value = id || '';
        opening.value = true;
      };
      const closeOpen = () => {
        opening.value = false;
        openingHelp.value = false;
      };
      return {
        activity,
        clickButton,
        step,
        minRoom,
        maxRoom,
        minArea,
        maxArea,
        openingHelp,
        cityId,
        lookTime,
        projectId,
        opening,
        helpOpen,
        clickOpen,
        closeOpen,
      };
    },
  });
</script>
