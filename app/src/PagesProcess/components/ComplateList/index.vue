<!--
 * @Author: sss
 * @Date: 2022-05-25 11:49:22
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:49:22
 * @Desc: 待我处理
-->
<template>
  <view
    class="complateList"
    v-if="computedHeight > 0"
    :style="{ height: `${computedHeight}px` }"
  >
    <apiot-toast
      v-if="isLoading && listData.length === 0"
      status="loading"
      :isFull="true"
    ></apiot-toast>
    <u-list
      v-if="listData.length > 0"
      ref="card"
      :height="computedHeight"
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
</template>

<script>
import { getCompletedTasks, getNodeAttr } from '@/api/pagesProcess.js';
import tabMixin from '../tabMixin';

import ListCard from '../common/ListCard';

export default {
  components: { ListCard },

  mixins: [tabMixin],

  props: {},

  data() {
    return {};
  },

  computed: {},

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

      uni.navigateTo({
        url: `/menuConfigure/index?id=${appPanelId}&title=${instanceName}&isProcess=true&workflowDataId=${dataId}&instanceId=${instanceId}&processNodeId=${nodeId}&isFinish=1`,
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
        const params = { current: page, size: pageSize, ...this.searchParam };
        const result = await getCompletedTasks(params);

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

$--name: 'complateList';
@include setTabsStyle($--name);
</style>
