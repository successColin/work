<!--
 * @Author: sss
 * @Date: 2022-05-25 11:49:22
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:49:22
 * @Desc: 待我处理
-->
<template>
  <view class="launchByme" v-if="computedHeight > 0">
    <u-sticky :customNavHeight="customBar">
      <section class="launchByme__status">
        <p
          class="launchByme__status--item"
          v-for="item in statusArry"
          :key="item.value"
          :class="[
            item.value === selectStatus
              ? `themeColor__bg-${getThemeIndex}`
              : '',
          ]"
          :style="{ color: item.value === selectStatus ? '#fff' : '' }"
          @click.stop="selectStatus = item.value"
        >
          {{ item.name }}
        </p>
      </section>
    </u-sticky>
    <view :style="{ height: `${launchBymeHeight}px` }">
      <apiot-toast
        v-if="isLoading && listData.length === 0"
        status="loading"
        :isFull="true"
      ></apiot-toast>
      <u-list
        v-if="listData.length > 0"
        ref="card"
        :height="launchBymeHeight"
        :preLoadScreen="3"
        :pagingEnabled="true"
        @scrolltolower="scrolltolower"
      >
        <u-list-item
          v-for="(item, index) in listData"
          :key="index"
          :anchor="item.id"
        >
          <list-card :value="item" @clickNode="clickNode"></list-card>
        </u-list-item>
        <apiot-toast
          :status="loadMoreInfo"
          @clickLoadMore="clickLoadMore"
        ></apiot-toast>
      </u-list>
      <apiot-list-nodata
        v-else-if="!isLoading && listData.length === 0"
      ></apiot-list-nodata>
    </view>
  </view>
</template>

<script>
import { getIInitiatedList, getNodeAttr } from '@/api/pagesProcess.js';
import tabMixin from '../tabMixin';

import ListCard from '../common/ListCard';

export default {
  components: { ListCard },

  mixins: [tabMixin],

  props: {},

  data() {
    return {
      selectStatus: 'REJECTED'
    };
  },

  computed: {
    launchBymeHeight() {
      return this.computedHeight - this.$apiot.rpx2px(88);
    },
    statusArry() {
      return this.$store.getters.getCurDict('PROCESS_STATUS');
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.customBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    }
  },

  watch: {
    selectStatus() {
      this.getData();
    }
  },

  methods: {
    // 获取节点配置信息
    async getNodeAttr(nodeId) {
      try {
        const result = await getNodeAttr({ nodeId });
        const config = JSON.parse(result.attributes);
        config.workflowVersionId = result.workflowVersionId;
        this.$store.commit('setProcessConfig', { nodeId, config });
      } catch (error) {
        console.error(error);
      }
    },
    // 点击按钮
    async clickNode(node) {
      // 跳转至审批详情
      const { appPanelId, instanceName, instanceId, dataId, nodeId } = node;
      if (!appPanelId) return;
      const { processConfigs } = this.$store.state.process;
      if (!processConfigs[nodeId]) await this.getNodeAttr(nodeId);

      let isFinish = 1;
      if (this.selectStatus === 'IN_PROGRESS') isFinish = 0;

      uni.navigateTo({
        url: `/menuConfigure/index?id=${appPanelId}&title=${instanceName}&isProcess=true&workflowDataId=${dataId}&instanceId=${instanceId}&processNodeId=${nodeId}&isFinish=${isFinish}`,
        animationType: 'slide-in-right'
      });
    },
    // 获得我发起的数据
    async getData(loadType = '') {
      this.isLoading = true;
      try {
        // 分页
        let page = this.current;
        let pageSize = this.size;
        if (loadType === 'loadnext') {
          this.current += 1;
          page = this.current;
        } else if (loadType === 'reload') {
          page = 1;
          pageSize *= page;
        } else {
          this.current = 1;
          page = 1;
        }
        const params = {
          current: page,
          size: pageSize,
          ...this.searchParam,
          instanceStatus: this.selectStatus
        };
        const result = await getIInitiatedList(params);

        let list = null;
        if (loadType === 'loadnext') {
          list = this.listData.concat(result.records);
        } else {
          this.totalPage = Math.ceil(result.total / pageSize);
          list = result.records;
        }

        this.listData = [...list];
        this.isLoading = false;
        console.log(result);
      } catch (error) {
        this.isLoading = false;
        console.error(error);
      }
    }
  },

  mounted() {},

  created() {}
};
</script>

<style lang='scss' scoped>
@import '../MyTodo/index.scss';

$--name: 'launchByme';
@include setTabsStyle($--name);

.launchByme {
  &__status {
    display: flex;
    height: 88rpx;
    padding: 15rpx 30rpx;
    box-sizing: border-box;
    background: #fff;
    &--item {
      margin: auto;
      flex: 1 1 0;
      height: 58rpx;
      line-height: 58rpx;
      font-size: 28rpx;
      font-family: $--font-family;
      color: #333333;
      text-align: center;
      border-right: solid 2rpx #e9e9e9;
      border-top: solid 2rpx #e9e9e9;
      border-bottom: solid 2rpx #e9e9e9;
      &:first-child {
        border-left: solid 2rpx #e9e9e9;
        border-radius: 8rpx 0 0 8rpx;
      }
      &:last-child {
        border-radius: 0 8rpx 8rpx 0;
      }
    }
  }
}
</style>
