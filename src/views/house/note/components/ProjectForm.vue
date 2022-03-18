<template>
  <div class="lg:w-[375px] sm:w-full h-full relative">
    <div class="absolute top-0 right-0 w-full h-[400px] rounded-b-full bg-blue-600 z-10"></div>
    <div class="absolute p-2 px-3 z-20 w-full">
      <!-- 第一块，标题描述 -->
      <div>
        <div class="text-white mb-[16px] text-[24px]">{{ formState.name }}</div>
        <div class="text-white text-[12px] my-[10px]">{{ formState.description }}</div>
        <div class="text-white text-[12px]" v-if="formState.updateTime">
          <span>{{ formState?.updateTime?.replace('T', ' ')?.replace('.000+08:00', '') }}</span>
          <span class="ml-3">更新 <span class="ml-3"></span></span>
          <span v-for="item in formStateChannel.channelCaseEntities" :key="item" class="ml-3">{{
            item.name
          }}</span>
        </div>
        <div class="text-white text-[12px]" v-else
          ><span>{{ formState?.createTime?.replace('T', ' ')?.replace('.000+08:00', '') }}</span
          ><span class="ml-3">更新 <span class="ml-3"></span></span>
          <span v-for="item in formStateChannel.channelCaseEntities" :key="item" class="ml-3">{{
            item.name
          }}</span>
        </div>
        <div class="flex flex-row space-x-4 my-2">
          <div class="p-2 text-white text-[12px]">
            <span
              class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded"
              v-if="formState.saleState === '1'"
              >在售</span
            >
            <span
              class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded"
              v-if="formState.saleState === '2'"
              >待售</span
            >
            <span
              class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded"
              v-if="formState.saleState === '3'"
              >售罄</span
            >
          </div>
          <div class="col-span-2 ml-3 p-2 text-white text-[12px]">
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '1'"
              >住宅</span
            >
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '2'"
              >公寓</span
            >
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '3'"
              >商铺</span
            >
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '4'"
              >写字楼</span
            >
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '5'"
              >仓库</span
            >
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '6'"
              >别墅</span
            >
            <span class="w-[100px] bg-[#80ADEF] px-2 py-1 rounded" v-if="formState.type === '7'"
              >商业</span
            >
          </div>
        </div>
      </div>
      <!-- 第二块 -->
      <div class="bg-white rounded-[10px] w-full shadow-lg p-4">
        <div class="grid grid-cols-2 justify-between items-center border-b pb-4 border-b-[#EFEFEF]">
          <div>
            <div class="text-[#333333]"
              ><span class="text-[20px] font-medium">{{ formState.price }}</span
              ><span class="text-[18px]">元/m²</span></div
            >
            <div class="text-[#999999] text-[12px]">参考单价</div>
          </div>
          <div>
            <div v-if="formState.lowTotalPrice && formState.highTotalPrice" class="text-[#333333]"
              ><span class="text-[20px] font-medium"
                >{{ formState.lowTotalPrice }}-{{ formState.highTotalPrice }}</span
              ><span class="text-[18px]">万/套</span></div
            >
            <div v-else class="text-[18px]">暂无数据</div>
            <div class="text-[#999999] text-[12px]">总价区间</div>
          </div>
        </div>
        <div
          class="py-4 border-b border-b-[#EFEFEF] text-[#333333] text-[12px] grid grid-cols-3 gap-4"
        >
          <div class="col-span-3">别名： {{ formState.aliasName }}</div>
          <div class="col-span-2">
            用途：
            <span v-if="formState.type === '1'">住宅</span>
            <span v-if="formState.type === '2'">公寓</span>
            <span v-if="formState.type === '3'">商铺</span>
            <span v-if="formState.type === '4'">写字楼</span>
            <span v-if="formState.type === '5'">仓库</span>
            <span v-if="formState.type === '6'">别墅</span>
            <span v-if="formState.type === '7'">商业</span>
          </div>
          <div>产权： {{ formState.property }}年</div>
          <div class="col-span-2"
            >户型：{{ minarea }}-{{ maxarea }}㎡ {{ minroom }}-{{ maxroom }}居
          </div>
          <div>
            装修：
            <span v-if="formState.decorationType === '1'">毛坯</span>
            <span v-if="formState.decorationType === '2'">简装</span>
            <span v-if="formState.decorationType === '3'">精装</span>
            <span v-if="formState.decorationType === '4'">毛坯与简装</span>
            <span v-if="formState.decorationType === '5'">毛坯与精装</span>
          </div>
          <div class="col-span-3"
            >位置： {{ formState?.sysProvinceByProvinceId?.name }}·{{
              formState?.sysCityByCityId?.name
            }}·{{ formState?.sysAreaByAreaId?.name }}·{{ formState.address }}</div
          >
          <div class="col-span-3">售楼处： {{ formState.saleAddress }}</div>
        </div>
        <div class="text-[#0299C4] text-[10px] space-x-3 flex flex-row mt-3">
          <span
            v-for="item in formState.sysDictDetailBeans"
            :key="item"
            class="space-x-1 flex flex-row items-center justify-items-center"
          >
            <img src="../../../../assets/images/selected.png" alt="" class="w-[10px] h-[10px]" />
            <span>{{ item.value }}</span>
          </span>
        </div>
      </div>
      <!--  -->
      <div class="mt-8 bg-gradient-to-b from-[#FFF6F4] rounded-[5px] p-4">
        <div class="text-[#F9795D] text-[16px]">最新动态</div>
        <div v-if="dyList && dyList.length > 0" class="text-[14px] text-[333333]">
          <div v-for="(item, index) in dyList" :key="index" v-show="index < 1 || dyHidden">
            <div class="flex flex-row justify-between">
              <div>{{ item.title }}</div>
              <div class="text-[#999999]">{{
                item.createTime.replace('T', ' ').replace('.000+08:00', '')
              }}</div>
            </div>
            <div>{{ item.description }}</div>
          </div>
          <div
            class="w-full flex flex-row justify-center items-center text-[#999999] text-[12px]"
            @click="dyVisible"
          >
            <div v-if="!dyHidden">展开全部</div>
            <div v-else>合并动态</div>
            <img
              src="../../../../assets/images/bottom.png"
              alt=""
              class="w-[8px] h-[4px]"
              :class="dyHidden ? 'rotate-180' : 'transform-none'"
            />
          </div>
        </div>
      </div>
      <div class="mt-5">
        <div class="">
          <div class="text-[18px]">规则须知</div>
          <!-- <div>合作中 （） </div> -->
        </div>
        <div class="flex flex-row mt-6">
          <div class="bg-[#E0F0FF] text-blue-500 px-3 py-2 rounded-[6px] text-[12px]"
            >报备/带看</div
          >
          <!-- <div class="bg-[#F8F8F8] text-black px-3 py-2 ml-3 rounded-[6px] text-[12px]"
            >判客及确客</div
          > -->
        </div>
        <div class="mt-6">
          <div class="grid grid-cols-3 text-[#333333] text-[12px] gap-3">
            <div>
              <span class="text-[#999999]">要求全号：</span>
              <span v-if="formStateRule.isFullNumber === 0">否</span>
              <span v-if="formStateRule.isFullNumber === 1">是</span>
            </div>
            <div>
              <span class="text-[#999999]">人脸识别：</span>
              <span v-if="formStateRule.isHasFace === 0">否</span>
              <span v-if="formStateRule.isHasFace === 1">是</span>
            </div>
            <div>
              <span class="text-[#999999]">重复报备：</span>
              <span v-if="formStateRule.isHasFace === 0">不允许</span>
              <span v-if="formStateRule.isHasFace === 1">允许</span>
            </div>
            <div>
              <span class="text-[#999999]">报备保护期：</span>
              <span>{{ formStateRule.reportProtectTime }}天</span>
            </div>
            <div>
              <span class="text-[#999999]">带看保护期：</span>
              <span>{{ formStateRule.visitProtectTime }}天</span>
            </div>
            <div>
              <span class="text-[#999999]">复访保护期：</span>
              <span>{{ formStateRule.revisitProtectTime }}天</span>
            </div>
            <div class="col-span-2">
              <span class="text-[#999999]">案场接待时间：</span>
              <span>{{ formStateRule.receiveTimeStart }}-{{ formStateRule.receiveTimeEnd }}</span>
            </div>
            <div>
              <span class="text-[#999999]">报备后多久允许带看：</span>
              <span>{{ formStateRule.reportAfterLook }}分钟</span>
            </div>
            <div class="col-span-3">
              <span class="text-[#999999]">详情：</span>
              <span>{{ formStateRule.details }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 户型 -->
      <div class="mt-5">
        <div class="text-[#333333] text-[18px]"
          >户型&nbsp;&nbsp;<span class="text-[16px]">({{ allLayout }})</span></div
        >
        <div class="flex flex-row text-[#333333] text-[16px] space-x-4">
          <div :class="saleType === '1' ? 'text-[#015EEA]' : ''" @click="clickSaleType('1')"
            >在售（{{ onSale }}）</div
          >
          <div :class="saleType === '2' ? 'text-[#015EEA]' : ''" @click="clickSaleType('2')"
            >待售（{{ offSale }}）</div
          >
        </div>
        <div
          v-if="formState.hLayoutsById && formState.hLayoutsById.length > 0"
          class="grid grid-cols-2 gap-3 mt-4"
        >
          <span
            v-for="i in formState.hLayoutsById"
            :key="i"
            :class="i.saleState !== saleType ? 'hidden' : ''"
          >
            <div v-if="i.saleState === saleType">
              <img
                v-if="i.saleState === saleType"
                :src="i?.hResourceByResourceId?.address"
                alt=""
                class="w-[160px] h-[122px] rounded-[10px] shadow"
              />
            </div>
          </span>
        </div>
      </div>
      <!-- 区域配套 -->
      <div class="mt-5">
        <div class="text-[#333333] text-[18px]">区域配套</div>
        <div class="text-[12px] text-[#333333] mt-3">
          <div><span class="text-[#999999]">教育配套： </span> {{ formState.educationInfo }}</div>
          <div><span class="text-[#999999]">交通配套： </span> {{ formState.trafficInfo }}</div>
          <div><span class="text-[#999999]">公园配套： </span> {{ formState.otherInfo }}</div>
          <div><span class="text-[#999999]">商业配套： </span> {{ formState.matchingInfo }}</div>
          <div><span class="text-[#999999]">医疗配套： </span> {{ formState.matchingInfo }}</div>
        </div>
        <div class="mt-5">
          <div class="grid grid-cols-4 gap-2">
            <div
              @click="changeInfoType('1')"
              class="rounded px-3 py-2 text-[#333333]"
              :class="infoType === '1' ? 'bg-[#E0F0FF] text-[#015EEA]' : 'bg-[#F8F8F8] '"
              >交通({{ trafficArray.length }})</div
            >
            <div
              @click="changeInfoType('2')"
              class="rounded px-3 py-2 text-[#333333]"
              :class="infoType === '2' ? 'bg-[#E0F0FF] text-[#015EEA]' : 'bg-[#F8F8F8] '"
              >教育({{ eduArray.length }})</div
            >
            <div
              @click="changeInfoType('3')"
              class="rounded px-3 py-2 text-[#333333]"
              :class="infoType === '3' ? 'bg-[#E0F0FF] text-[#015EEA]' : 'bg-[#F8F8F8] '"
              >商业({{ matchArray.length }})</div
            >
            <div
              @click="changeInfoType('4')"
              class="rounded px-3 py-2 text-[#333333]"
              :class="infoType === '4' ? 'bg-[#E0F0FF] text-[#015EEA]' : 'bg-[#F8F8F8] '"
              >医疗({{ medicalArray.length }})</div
            >
            <div
              @click="changeInfoType('5')"
              class="rounded px-3 py-2 text-[#333333]"
              :class="infoType === '5' ? 'bg-[#E0F0FF] text-[#015EEA]' : 'bg-[#F8F8F8] '"
              >住宅({{ houseArray.length }})</div
            >
          </div>
          <div v-if="infoType === '1'" class="mt-4">
            <div
              v-for="(item, index) in trafficArray"
              :key="index"
              v-show="index < 4 || infoMore"
              class="text-[12px] text-[#333333] flex flex-row justify-between"
            >
              <span
                class="text-left leading-5"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >{{ item.name }}</span
              >
              <span class="text-right text-[#999999] flex-shrink-0">{{ item.distance }}m</span>
            </div>
          </div>
          <div v-if="infoType === '2'" class="mt-4">
            <div
              v-for="(item, index) in eduArray"
              :key="index"
              v-show="index < 4 || infoMore"
              class="text-[12px] text-[#333333] flex flex-row justify-between"
            >
              <span
                class="text-left leading-5"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >{{ item.name }}</span
              >
              <span class="text-right text-[#999999] flex-shrink-0">{{ item.distance }}m</span>
            </div>
          </div>
          <div v-if="infoType === '3'" class="mt-4">
            <div
              v-for="(item, index) in matchArray"
              :key="index"
              v-show="index < 4 || infoMore"
              class="text-[12px] text-[#333333] flex flex-row justify-between"
            >
              <span
                class="text-left leading-5"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >{{ item.name }}</span
              >
              <span class="text-right text-[#999999] flex-shrink-0">{{ item.distance }}m</span>
            </div>
          </div>
          <div v-if="infoType === '4'" class="mt-4">
            <div
              v-for="(item, index) in medicalArray"
              :key="index"
              v-show="index < 4 || infoMore"
              class="text-[12px] text-[#333333] flex flex-row justify-between"
            >
              <span
                class="text-left leading-5"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >{{ item.name }}</span
              >
              <span class="text-right text-[#999999] flex-shrink-0">{{ item.distance }}m</span>
            </div>
          </div>
          <div v-if="infoType === '5'" class="mt-4">
            <div
              v-for="(item, index) in houseArray"
              :key="index"
              v-show="index < 4 || infoMore"
              class="text-[12px] text-[#333333] flex flex-row justify-between"
            >
              <span
                class="text-left leading-5"
                style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
                >{{ item.name }}</span
              >
              <span class="text-right text-[#999999] flex-shrink-0">{{ item.distance }}m</span>
            </div>
          </div>
          <div
            class="w-full text-center flex flex-row justify-center items-center"
            @click="clickInfoMore"
          >
            <div v-if="!infoMore" class="text-sm text-[#999999]">查看全部配套</div>
            <div v-else class="text-sm text-[#999999]">收起配套信息</div>
            <div
              ><img
                src="../../../../assets/images/bottom.png"
                alt=""
                class="w-[8px] h-1 ml-2"
                :class="infoMore ? 'rotate-180' : 'transform-none'"
            /></div>
          </div>
        </div>
      </div>
      <!-- 小区概况 -->
      <div class="mt-5">
        <div class="text-[18px] text-[#333333]">小区概况</div>
        <div class="grid grid-cols-3 justify-between mt-3 gap-3">
          <div class="border-r border-r-[#EFEFEF]">
            <div class="text-[18px] text-[#333333]">{{ formState.volumeRate || '暂无数据' }}</div>
            <div class="text-[#999999] text-[12px]">容积率</div>
          </div>
          <div class="border-r border-r-[#EFEFEF]">
            <div class="text-[18px] text-[#333333]">{{ formState.greenRate || '暂无数据' }}</div>
            <div class="text-[#999999] text-[12px]">绿化率</div>
          </div>
          <div class="">
            <div class="text-[18px] text-[#333333]">{{ formState.parkingRatio || '暂无数据' }}</div>
            <div class="text-[#999999] text-[12px]">车位配比</div>
          </div>
          <div class="border-r border-r-[#EFEFEF]">
            <div class="text-[16px] text-[#333333]">
              <span v-if="formState.divideCar === '1'">是</span>
              <span v-else-if="formState.divideCar === '0'">否</span>
              <span v-else>暂无数据</span>
            </div>
            <div class="text-[#999999] text-[12px]">人车分流</div>
          </div>
          <div class="border-r border-r-[#EFEFEF]">
            <div class="text-[16px] text-[#333333]">
              <span v-if="formState.heatMethod === '1'">市政供暖</span>
              <span v-else-if="formState.heatMethod === '0'">未知</span>
              <span v-else-if="formState.heatMethod === '2'">集体供暖</span>
              <span v-else>暂无数据</span>
            </div>
            <div class="text-[#999999] text-[12px]">供暖方式</div>
          </div>
          <div class="">
            <div class="text-[16px] text-[#333333]">
              <span v-if="formState.cng === '1'">是</span>
              <span v-else-if="formState.cng === '0'">否</span>
              <span v-else>暂无数据</span>
            </div>
            <div class="text-[#999999] text-[12px]">是否有燃气</div>
          </div>
        </div>
        <div class="grid grid-cols-2 mt-3">
          <div class="text-[#999999] text-[14px]">
            <span>占地面积：</span>
            <span class="text-[#333333]">{{ formState.landArea }}㎡</span>
          </div>
          <div class="text-[#999999] text-[14px]">
            <span>建筑面积：</span>
            <span class="text-[#333333]">{{ formState.buildArea }}㎡</span>
          </div>
          <div class="text-[#999999] text-[14px]">
            <span>规划栋数：</span>
            <span class="text-[#333333]">{{ formState.buildingTotal }}栋</span>
          </div>
          <div class="text-[#999999] text-[14px]">
            <span>规划户数：</span>
            <span class="text-[#333333]">{{ formState.houseTotal }}户</span>
          </div>
          <div class="text-[#999999] text-[14px]">
            <span>建筑类型：</span>
            <span v-if="formState.buildType === '1'" class="text-[#333333]">被动式</span>
            <span v-else-if="formState.buildType === '2'" class="text-[#333333]">装配式</span>
            <span v-else-if="formState.buildType === '3'" class="text-[#333333]">浇注式</span>
            <span v-else-if="formState.buildType === '4'" class="text-[#333333]">部分装配式</span>
            <span v-else-if="formState.buildType === '5'" class="text-[#333333]">部分浇筑式</span>
            <span v-else class="text-[#333333]">暂无数据</span>
          </div>
          <div class="text-[#999999] text-[14px]">
            <span>供水/电：</span>
            <span v-if="formState.waterMethod === '0'" class="text-[#333333]">未知</span>
            <span v-else-if="formState.waterMethod === '1'" class="text-[#333333]">民水</span>
            <span v-else-if="formState.waterMethod === '2'" class="text-[#333333]">商水</span>
            <span v-else class="text-[#333333]">暂无</span>
            <span v-if="formState.electricityMethod === '0'" class="text-[#333333]">/未知</span>
            <span v-else-if="formState.electricityMethod === '1'" class="text-[#333333]"
              >/民电</span
            >
            <span v-else-if="formState.electricityMethod === '2'" class="text-[#333333]"
              >/商电</span
            >
            <span v-else class="text-[#333333]">暂无</span>
          </div>
          <div class="text-[#999999] text-[14px] col-span-2">
            <span>物业费用：</span>
            <span class="text-[#333333]">{{ formState.estatePrice }}元/月/㎡</span>
          </div>
        </div>
        <div v-if="formState.firstImg?.address" class="mt-4 w-full h-[180px] rounded-md">
          <img
            :src="formState.firstImg.address"
            alt=""
            class="rounded-md"
            style="width: 100%; height: 100%"
          />
        </div>
      </div>
      <!-- 楼栋 -->
      <div class="mt-5">
        <div class="text-[18px] text-[#333333] font-normal">楼栋</div>
        <div v-if="formState.sandImg?.address" class="w-full h-[180px] rounded-md">
          <img
            :src="formState.sandImg.address"
            alt=""
            class="rounded-md"
            style="width: 100%; height: 100%"
          />
        </div>
        <div class="mt-3 flex flex-row space-x-3">
          <div @click="changeBuildType('1')" class="flex flex-row items-center">
            <div
              class="w-[10px] h-[10px] rounded-sm"
              :class="buildType === '1' ? 'bg-[#135CE3]' : 'bg-[#999999]'"
            ></div>
            <span
              class="ml-1 text-[10px]"
              :class="buildType === '1' ? 'text-[#135CE3]' : 'text-[#999999]'"
              >在售楼栋</span
            >
          </div>
          <div @click="changeBuildType('2')" class="flex flex-row items-center">
            <div
              class="w-[10px] h-[10px] rounded-sm"
              :class="buildType === '2' ? 'bg-[#135CE3]' : 'bg-[#999999]'"
            ></div>
            <span
              class="ml-1 text-[10px]"
              :class="buildType === '2' ? 'text-[#135CE3]' : 'text-[#999999]'"
              >待售楼栋</span
            >
          </div>
          <div @click="changeBuildType('3')" class="flex flex-row items-center">
            <div
              class="w-[10px] h-[10px] rounded-sm"
              :class="buildType === '3' ? 'bg-[#135CE3]' : 'bg-[#999999]'"
            ></div>
            <span
              class="ml-1 text-[10px]"
              :class="buildType === '3' ? 'text-[#135CE3]' : 'text-[#999999]'"
              >售罄楼栋</span
            >
          </div>
        </div>
        <div class="grid grid-cols-6 mt-4">
          <div
            @click="changeBuildId(item.number)"
            class="px-2 rounded-full text-center"
            v-for="item in formState.hBuildsById"
            :key="item.id"
            :class="item.number === buildId ? 'bg-[#135CE3] text-white' : ''"
            v-show="item.saleState === buildType && item.state === '1'"
            >{{ item.number }}号楼</div
          >
        </div>
        <div
          v-for="e in formState.hBuildsById"
          :key="e.id"
          v-show="e.state === '1' && e.number === buildId"
          class="bg-[#F9F9F9] grid grid-cols-2 text-[#333333] text-[12px] gap-2 mt-3 p-2"
          style="background-color: #f9f9f9"
        >
          <div><span class="text-[#999999]">开盘：</span>{{ e?.openTime || '暂无数据' }}</div>
          <div><span class="text-[#999999]">交房：</span>{{ e?.payTime || '暂无数据' }}</div>
          <div
            ><span class="text-[#999999]">单元：</span
            ><span v-if="e?.unitNumber">{{ e?.unitNumber }}单元</span
            ><span v-else>暂无数据</span></div
          >
          <div
            ><span class="text-[#999999]">层数：</span
            ><span v-if="e?.floors">{{ e?.floors }}层</span><span v-else>暂无数据</span></div
          >
          <div
            ><span class="text-[#999999]">户数：</span
            ><span v-if="e?.houseNumber">{{ e?.houseNumber }}户</span
            ><span v-else>暂无数据</span></div
          >
          <div
            ><span class="text-[#999999]">梯户比：</span
            >{{ e?.ladderHouseRatio || '暂无数据' }}</div
          >
          <div class="relative"
            ><span class="text-[#999999] col-span-2">预售证：</span
            ><button @click="seeLicense(e.licenseId)">查看预售证</button>
            <div class="absolute bottom-5 w-[100px] h-[60px]">
              <img
                v-if="licenseNumber"
                class="w-full h-full border-0"
                :src="licenseNumber"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <!-- 开发商与物业 -->
      <div class="mt-5">
        <div class="text-[#333333] text-[18px]">开发商与物业</div>
        <div class="mt-4">
          <div class="text-[14px] text-[#333333]">开发商简介</div>
          <div class="mt-2 bg-[#F9F9F9] p-2">
            <span
              ref="estate"
              class="line-clamp-3 text-ellipsis"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              "
            >
              {{ formState?.hDeveloperByDeveloperId?.description || '暂无数据' }}
            </span>
          </div>
        </div>
        <div class="mt-4">
          <div class="text-[14px] text-[#333333]">物业简介</div>
          <div>
            <span class="text-[#999999]">物业公司：</span>
            <span>{{ formState?.estateCompanyById?.name || '暂无数据' }}</span>
          </div>
          <div>
            <span class="text-[#999999]">物业费用：</span>
            <span>{{ formState?.estatePrice || '暂无数据' }}元/月</span>
          </div>
          <div class="text-[#999999]">物业描述：</div>
          <div class="mt-2 bg-[#F9F9F9] p-2">
            <span
              ref="estate"
              class="line-clamp-3 text-ellipsis"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              "
            >
              {{ formState?.estateDescription || '暂无数据' }}
            </span>
          </div>
        </div>
      </div>
      <!-- 驻场与渠道信息 -->
      <div class="mt-5">
        <div class="text-[18px] text-[#333333]">渠道与驻场信息</div>
        <div class="mt-3 text-[14px] text-[#333333]">驻场信息</div>
        <div
          class="mt-3 text-[#999999] text-[12px] space-y-2"
          v-for="(item, index) in formStateChannel.channelCaseEntities"
          :key="item.id"
          v-show="index < 3 || channelMore"
        >
          <div class="grid grid-cols-2 bg-[#F9F9F9] py-3 px-2">
            <span
              >姓名：<span class="text-[#333333]">{{ item.name }}</span></span
            >
            <span
              >电话：<span class="text-[#015EEA]">{{ item.contact }}</span></span
            >
          </div>
        </div>
        <div
          class="mt-2 w-full flex flex-row justify-center items-center text-[#999999] text-[12px]"
          @click="clickChannel"
        >
          <div v-if="!channelMore">展开全部驻场</div>
          <div v-else>合并驻场信息</div>
          <img
            src="../../../../assets/images/bottom.png"
            alt=""
            class="w-[8px] h-[4px] ml-1"
            :class="channelMore ? 'rotate-180' : 'transform-none'"
          />
        </div>
        <div class="mt-3 text-[14px] text-[#333333]">渠道信息</div>
        <div
          class="mt-3 text-[#999999] text-[12px] space-y-2"
          v-for="(item, index) in formStateChannel.channelEntities"
          :key="item.id"
          v-show="index < 3 || entityMore"
        >
          <div class="grid grid-cols-2 bg-[#F9F9F9] py-3 px-2">
            <span
              >负责人：<span class="text-[#333333]">{{ item.name }}</span></span
            >
            <span
              >电话：<span class="text-[#015EEA]">{{ item.contact }}</span></span
            >
          </div>
        </div>
        <div
          class="mt-2 w-full flex flex-row justify-center items-center text-[#999999] text-[12px]"
          @click="clickEntity"
        >
          <div v-if="!entityMore">展开全部负责人</div>
          <div v-else>合并负责人信息</div>
          <img
            src="../../../../assets/images/bottom.png"
            alt=""
            class="w-[8px] h-[4px] ml-1"
            :class="entityMore ? 'rotate-180' : 'transform-none'"
          />
        </div>
      </div>
      <!-- 免责声明 -->
      <div class="mt-5 bg-[#F9F9F9] p-5">
        <div class="mt-3 text-[18px] text-[#333333]">免责声明</div>
        <div class="mt-3 text-[10px] text-[#333333]">
          本网呈现的户型图为第三方提供的非标准的参考户型图或根据第三方提供的户型图通过系统/技术等手段生成的非标准的参考户型图，不应作为您交易的决策依据。户型图上呈现的户型、面积、朝向、内部结构、功能分区仅供展示参考，实际信息请以与开发商签订的商品房买卖合同为准。
        </div>
        <div class="mt-5">
          本页面呈现的项目简介/开发商物业简介/区位介绍等内容为新房作业人员结合网络及实际探访项所整理的内容，仅供参考，实际请以开发商介绍的信息为准。详细请阅读
          <span class="text-[#015EEA]">《重要风险提示》</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useI18n } from '/@/hooks/web/useI18n';
  import { defineComponent, onMounted, reactive, ref, UnwrapRef } from 'vue';
  import { HostModel, _HostConst } from '/@/api/host/project/model/projectModel';
  import { useUserStore } from '/@/store/modules/user';
  import { getLocation, getProject } from '/@/api/host/project/project';
  import { getProjectChannel } from '/@/api/host/projectChannel/projectChannel';
  import { ChannelAndCase } from '/@/api/host/projectChannel/model/projectChannelModel';
  import { getRule } from '/@/api/host/reportRule/reportRule';
  import { ReportRuleModel } from '/@/api/host/reportRule/model/reportRuleModel';
  import { DynamicNewsModel } from '/@/api/host/dynamicNews/model/dynamicNewsModel';
  import { getDynamicNews } from '/@/api/host/dynamicNews/dynamicNews';
  import { getLicense } from '/@/api/host/license/license';

  export default defineComponent({
    name: 'ProjectForm',
    components: {},
    props: {
      id: {
        type: String,
        require: false,
      },
    },
    setup(props) {
      const { t } = useI18n();
      let estate = ref();
      let develop = ref();

      const copyText = (e) => {
        debugger;
        alert('You just copied: ' + e.text);
      };

      //加载动画
      const loading = ref<boolean>(false);
      const tip = ref<string>('加载中...');

      const userStore = useUserStore();
      const cityId = ref<string>(userStore.getUserInfo.companyCityId || '');
      let provinceId = ref<string>(userStore.getUserInfo.companyProvinceId || '');

      const formState: UnwrapRef<HostModel> = reactive({});
      const formStateChannel: UnwrapRef<ChannelAndCase> = reactive({});
      const formStateRule: UnwrapRef<ReportRuleModel> = reactive({});
      const dynamics: DynamicNewsModel[] = [];
      const dyList = reactive(dynamics);

      // 查看预售证
      let licenseNumber = ref('');
      const seeLicense = async (value) => {
        if (licenseNumber.value) {
          licenseNumber.value = '';
        } else {
          if (value) {
            const { content } = await getLicense(value);
            licenseNumber.value = content?.resourceEntity.address || '';
          }
        }
      };

      // 驻场
      let channelMore = ref(false);
      const clickChannel = () => {
        if (channelMore.value) {
          channelMore.value = false;
        } else {
          channelMore.value = true;
        }
      };

      // 渠道
      let entityMore = ref(false);
      const clickEntity = () => {
        if (entityMore.value) {
          entityMore.value = false;
        } else {
          entityMore.value = true;
        }
      };

      // 楼号
      let buildId = ref();
      const changeBuildId = (value) => {
        buildId.value = value;
        licenseNumber.value = '';
      };

      // 楼栋销售类型
      let buildType = ref('1');
      const changeBuildType = (type) => {
        buildType.value = type;
        buildId.value = undefined;
        licenseNumber.value = '';
      };

      // 周边更多展示
      let infoMore = ref(false);
      const clickInfoMore = () => {
        if (infoMore.value) {
          infoMore.value = false;
        } else {
          infoMore.value = true;
        }
      };

      // 周边类型
      let infoType = ref('1');
      const changeInfoType = (type) => {
        infoType.value = type;
      };

      // 户型 销售状态
      let saleType = ref('1');
      const clickSaleType = (type) => {
        saleType.value = type;
      };

      // 多条动态
      let dyHidden = ref(false);
      const dyVisible = () => {
        if (dyHidden.value) {
          dyHidden.value = false;
        } else {
          dyHidden.value = true;
        }
      };
      // 医疗配套 090000
      let medicalArray = ref<any[]>([]);
      const getMedicalInfo = async () => {
        const midicalResult = await getLocation(
          formState.longitude + ',' + formState.latitude,
          '090000'
        );
        if (midicalResult.info === 'OK') {
          medicalArray.value.push(...midicalResult.pois);
        }
      };
      // 交通配套
      let trafficArray = ref<any[]>([]);
      const getTrafficInfo = async () => {
        const trafficResult = await getLocation(
          formState.longitude + ',' + formState.latitude,
          '150000'
        );
        if (trafficResult.info === 'OK') {
          trafficArray.value.push(...trafficResult.pois);
        }
      };
      // 教育配套
      let eduArray = ref<any[]>([]);
      const getEduInfo = async () => {
        const eduResult = await getLocation(formState.longitude + ',' + formState.latitude, '学校');
        if (eduResult.info === 'OK') {
          eduArray.value.push(...eduResult.pois);
        }
      };
      // 周边住宅
      let houseArray = ref<any[]>([]);
      const getHouse = async () => {
        const houseResult = await getLocation(
          formState.longitude + ',' + formState.latitude,
          '120300|120301|120302'
        );
        if (houseResult.info === 'OK') {
          houseArray.value.push(...houseResult.pois);
        }
      };
      // 商业配套
      let matchArray = ref<any[]>([]);
      const getMatch = async () => {
        const houseResult = await getLocation(
          formState.longitude + ',' + formState.latitude,
          '060000'
        );
        if (houseResult.info === 'OK') {
          matchArray.value.push(...houseResult.pois);
        }
      };
      //初始加载
      onMounted(async () => {
        if (props.id) {
          loading.value = true;
          try {
            // 项目信息
            const { content } = await getProject(props.id);
            Object.assign(formState, content);
            // if (formState.hBuildsById && formState.hBuildsById.length > 0) {
            //   buildId.value = formState.hBuildsById[0].number;
            // }
            // 交通配套
            getTrafficInfo();
            // 教育配套
            getEduInfo();
            // 周边住宅
            getHouse();
            // 医疗配套
            getMedicalInfo();
            // 商业配套
            getMatch();
            // 渠道信息
            const channelResult = await getProjectChannel(props.id);
            Object.assign(formStateChannel, channelResult.content);
            // 动态
            const dyRusult = await getDynamicNews(
              { projectId: props.id },
              { pageNum: 1, pageSize: 10 }
            );
            if (dyRusult.content && dyRusult.content.length > 0) {
              dyList.push(...dyRusult.content);
              jiangXv(dyList);
            }
            // 规则
            const ruleResult = await getRule(props.id);
            Object.assign(formStateRule, ruleResult.content);
          } catch (error) {
          } finally {
            loading.value = false;
          }
        }
        if (!formState.sysCityByCityId) {
          formState.sysCityByCityId = {};
        }
        if (!formState.sysAreaByAreaId) {
          formState.sysAreaByAreaId = {};
        }
        if (!formState.sysProvinceByProvinceId) {
          formState.sysProvinceByProvinceId = {};
        }
        formState.sysProvinceByProvinceId.id = provinceId.value;
        formState.sysCityByCityId.id = cityId.value;
        // 户型信息
        if (formState.hLayoutsById && formState.hLayoutsById.length > 0) {
          hLayout(formState.hLayoutsById);
        }
      });
      // 动态降序
      const jiangXv = (list) => {
        let t;
        for (let i = 0; i < list.length; i++) {
          if (list[i + 1].createTime > list[i].createTime) {
            t = list[i + 1];
            list[i + 1] = list[i];
            list[i] = t;
          }
        }
      };

      // 户型信息
      let maxarea = ref(0);
      let minarea = ref(0);
      let maxroom = ref(0);
      let minroom = ref(0);
      let allLayout = ref(0);
      let onSale = ref(0);
      let offSale = ref(0);
      const hLayout = (layouts) => {
        allLayout.value = layouts.length;
        maxarea.value = layouts[0].area;
        minarea.value = layouts[0].area;
        maxroom.value = layouts[0].room;
        minroom.value = layouts[0].room;
        layouts.forEach((item) => {
          if (item.saleState === '1') {
            onSale.value++;
          }
          if (item.saleState === '2') {
            offSale.value++;
          }
          if (item.area > maxarea.value) {
            maxarea.value = item.area;
          }
          if (item.area < minarea.value) {
            minarea.value = item.area;
          }
          if (item.room > maxroom.value) {
            maxroom.value = item.room;
          }
          if (item.room < minroom.value) {
            minroom.value = item.room;
          }
        });
      };

      return {
        t,
        formState,
        loading,
        tip,
        props,
        cityId,
        provinceId,
        formStateChannel,
        formStateRule,
        maxarea,
        minarea,
        maxroom,
        minroom,
        dyList,
        dyVisible,
        dyHidden,
        allLayout,
        onSale,
        offSale,
        saleType,
        clickSaleType,
        trafficArray,
        eduArray,
        houseArray,
        medicalArray,
        matchArray,
        infoType,
        changeInfoType,
        clickInfoMore,
        infoMore,
        changeBuildType,
        buildType,
        buildId,
        changeBuildId,
        copyText,
        estate,
        develop,
        channelMore,
        clickChannel,
        clickEntity,
        entityMore,
        seeLicense,
        licenseNumber,
      };
    },
  });
</script>

<style lang="less">
  .setwidth {
    @apply lg:mx-6 sm:mx-3;
  }

  .setflex {
    @apply flex mt-4 sm:flex-col lg:flex-row;
  }

  .name {
    @apply text-2xl font-bold text-blue-500;
  }

  .basic {
    @apply text-base mt-4 border-2 p-4 font-light shadow;
  }

  .basicInfo {
    @apply w-full border-b-2 border-b-blue-300 text-lg font-bold;
  }

  .layout {
    @apply w-full mt-5;
  }

  .setcol {
    @apply text-lg ml-4 mt-4;
  }
</style>
