<!--
 * @Author: sss
 * @Date: 2022-05-25 11:04:57
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:04:57
 * @Desc: 流程
-->
<template>
  <view class="pagesProcess">
    <template v-if="!canShowProcressDeatail">
      <!-- #ifndef MP-ALIPAY -->
      <apiot-navbar :title="menuConfig.title"></apiot-navbar>
      <!-- #endif -->
      <u-sticky :customNavHeight="customBar">
        <apiot-tabs
          :list="tabArry"
          :is-scroll="false"
          :current="currentIndex"
          @change="tabsChange"
        >
          <apiot-select-down
            v-model="selectDownValue"
            :canCustom="true"
            :list="selectDownList"
          >
            <i class="appIcon appIcon-shaixuan"></i>
          </apiot-select-down>
        </apiot-tabs>
      </u-sticky>

      <my-todo
        ref="myTodo"
        v-if="currentType === 'MyTodo'"
        :filterParam="filterParam"
      ></my-todo>
      <complate-list
        ref="complateList"
        v-else-if="currentType === 'ComplateList'"
        :filterParam="filterParam"
      ></complate-list>
      <cc-tom
        ref="ccTom"
        v-else-if="currentType === 'CcTom'"
        :filterParam="filterParam"
      ></cc-tom>
      <launch-byme
        ref="launchByme"
        v-else
        :filterParam="filterParam"
      ></launch-byme>
    </template>
    <template v-else>
      <view
        v-if="isLoading !== -1"
        class="messageTip"
        :class="
          isLoading === 0 ? 'error' : isLoading === 2 ? 'warn' : 'success'
        "
        >{{ message }}</view
      >
    </template>
  </view>
</template>

<script>
import { getProcessByTaskId, getNodeAttr } from '@/api/pagesProcess.js';

import LaunchByme from './components/LaunchByme';
import MyTodo from './components/MyTodo';
import ComplateList from './components/ComplateList';
import CcTom from './components/CcTom';

export default {
  components: { LaunchByme, MyTodo, ComplateList, CcTom },

  props: {},

  data() {
    return {
      // 菜单界面基础配置
      menuConfig: {
        title: '流程审批' // 名称
      },
      tabArry: [
        {
          name: '待我审批',
          type: 'MyTodo'
        },
        {
          name: '我参与的',
          type: 'ComplateList'
        },
        {
          name: '抄送给我',
          type: 'CcTom'
        },
        {
          name: '我发起的',
          type: 'LaunchByme'
        }
      ],
      selectDownValue: '',
      selectDownList: [
        { name: '一周内', value: 1 },
        { name: '近一个月', value: 2 },
        { name: '近三个月', value: 3 },
        { name: '半年内', value: 4 },
        { name: '一年内', value: 5 },
        { name: '全部', value: '' }
      ],
      currentType: 'MyTodo',
      isLoading: -1,
      message: '跳转中...'
    };
  },

  computed: {
    // 是否直接显示流程详情
    canShowProcressDeatail() {
      if (this.homePageConfig.canShowProcressDeatail) return true;
      return false;
    },
    homePageConfig() {
      return this.$store.state.menu.homePageConfig;
    },
    // 过滤条件
    filterParam() {
      const { selectDownValue } = this;
      if (!selectDownValue) return {};
      const paramArray = {
        1: { type: 1, n: 7 }, // 本周
        2: { type: 2, n: 1 }, // 本月
        3: { type: 2, n: 3 }, // 近三个月
        4: { type: 2, n: 6 }, // 近半年
        5: { type: 3, n: 1 } // 本年
      };
      const param = paramArray[selectDownValue] || { type: 1, n: 7 };
      return {
        beginDate: this.$apiot.moment.getRecentDay(param),
        endDate: this.$apiot.dateFormat()
      };
    },
    currentIndex() {
      return this.tabArry.findIndex((item) => item.type === this.currentType);
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

  methods: {
    tabsChange(item) {
      const tab = this.tabArry[item.index];
      if (this.currentType !== tab.type) {
        this.currentType = tab.type;
        this.selectDownValue = '';
        uni.setStorageSync('ProcessAdvancedScreen', '');
      }
    },
    async getProcessByTaskId() {
      try {
        const list = [];
        result.forEach((item) => {
          list.push({ name: item.nodeTitle, value: item.nodeType });
        });
        this.selectList = [...list];
      } catch (error) {
        console.error(error);
      }
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
    // 直接跳转至详情界面
    async gotoDetailPage(node) {
      // 跳转至审批详情
      const { appPanelId, instanceName, instanceId, dataId, nodeId, taskId, instanceStatus } = node;
      if (!appPanelId) return;
      const { processConfigs } = this.$store.state.process;
      if (!processConfigs[nodeId]) await this.getNodeAttr(nodeId);

      let url = `/menuConfigure/index?id=${appPanelId}&title=${instanceName}&isProcess=true&canShowProcressDeatail=true&workflowDataId=${dataId}&instanceId=${instanceId}&processNodeId=${nodeId}&taskId=${taskId}`;

      let isFinish = 1;
      if (instanceStatus === 'IN_PROGRESS') isFinish = 0;
      url = `${url}&isFinish=${isFinish}`;

      uni.navigateTo({
        url,
        animationType: 'slide-in-right'
      });
    },
    async gotoDetail() {
      try {
        const { taskId } = this.menuConfig;
        const result = await getProcessByTaskId({ taskId });
        if (result) {
          await this.gotoDetailPage(result);
          this.isLoading = 1;
          this.message = '已处理';
        } else {
          this.isLoading = 2;
          this.message = '无数据';
        }
      } catch (error) {
        this.isLoading = 0;
        console.error(error);
        this.message = error;
      }
    }
  },

  onLoad(option) {
    option = option || {};
    this.menuConfig = { ...this.menuConfig, ...option };
    if (this.canShowProcressDeatail) this.gotoDetail();
  },
  mounted() {
    this.$bus.$on('processAdvancedFilter', (obj) => {
      const { compid, params } = obj;
      this.$refs[compid].setSearchParam(params);
      this.$refs[compid].getData();
    });
  },

  beforeDestroy() {
    this.$bus.$off('processAdvancedFilter');
    uni.setStorageSync('ProcessAdvancedScreen', '');
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .appIcon-shaixuan {
    padding-right: 30rpx;
    font-size: 38rpx;
    color: #bbc3cd;
  }
}
.messageTip {
  width: 100%;
  padding: 16rpx 20rpx;
  text-align: center;
  color: #fff;
  &.error {
    background: #f56c6c;
  }
  &.success {
    background: #5ac725;
  }
  &.warn {
    background: #f9ae3d;
  }
}
</style>
