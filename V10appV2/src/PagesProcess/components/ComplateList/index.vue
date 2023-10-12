<!--
 * @Author: sss
 * @Date: 2022-05-25 11:49:22
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:49:22
 * @Desc: 我参与的
-->
<template>
  <view
    class="complateList"
    v-if="computedHeight > 0"
    :style="{ height: `${computedHeight}px` }"
  >
    <search-box @search="handleSearch" @clickFilter="clickFilter"></search-box>
    <apiot-toast
      v-if="isLoading && listData.length === 0"
      status="loading"
      :isFull="true"
    ></apiot-toast>
    <u-list
      v-if="listData.length > 0"
      ref="card"
      :height="computedHeightList"
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
      :style="{ height: computedHeightList + 'px' }"
    ></apiot-list-nodata>

    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { getCompletedTasks, getNodeAttr } from '@/api/pagesProcess.js';
import tabMixin from '../tabMixin';

import ListCard from '../common/ListCard';
import SearchBox from '../common/SearchBox';

export default {
  components: { ListCard, SearchBox },

  mixins: [tabMixin],

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    // 按钮过滤
    clickFilter() {
      if (this.processNameArr.length === 0) return;
      uni.navigateTo({
        url: `/PagesProcess/components/AdvancedScreen/index?processNameArr=${this.processNameArr}&compid=complateList`
      });
    },
    handleSearch(params) {
      this.keywords = params ? params.keyword : '';
      this.getData();
    },
    // 获取节点配置信息
    async getNodeAttr(nodeId) {
      try {
        const result = await getNodeAttr({ nodeId });
        if (!result.attributes) return;
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
      const {
        appPanelId,
        instanceName,
        instanceId,
        dataId,
        nodeId,
        triggerUserId,
        taskType,
        triggerUserName
      } = node;
      if (!appPanelId) return;
      const { processConfigs } = this.$store.state.process;
      if (!processConfigs[nodeId]) await this.getNodeAttr(nodeId);

      uni.navigateTo({
        url: `/menuConfigure/index?id=${appPanelId}&title=${instanceName}&triggerUserName=${triggerUserName}&isProcess=true&workflowDataId=${dataId}&instanceId=${instanceId}&processNodeId=${nodeId}&type=Completed&triggerUserId=${triggerUserId}&taskType=${taskType}&sno=2`,
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
          keywords: this.keywords,
          ...this.searchParam
        };
        const result = await getCompletedTasks(params);

        this.processNameArr = result.extendedMap.flowNames;
        let list = null;
        if (loadType === 'loadnext') {
          list = this.listData.concat(result.records);
        } else {
          this.totalPage = Math.ceil(result.total / pageSize);
          list = result.records;
        }

        this.listData = [...list];
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        console.error(error);
      }
    },
    setSearchParam(v) {
      this.searchParam = v;
    }
  },

  created() {
    // 设置监听，用于转审时，刷新列表
    this.$bus.$on('PROCESS_REFRESH_2', (v) => {
      this.$refs.uToast.show({
        type: 'success',
        message: v
      });
      this.getData();
    });
  },
  beforeDestroy() {
    this.$bus.$off('PROCESS_REFRESH_2');
  }
};
</script>

<style lang='scss' scoped>
@import '../MyTodo/index.scss';

$--name: 'complateList';
@include setTabsStyle($--name);
</style>
