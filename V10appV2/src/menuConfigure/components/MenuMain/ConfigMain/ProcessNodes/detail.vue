<!--
 * @Author: sss
 * @Date: 2022-05-25 11:04:57
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:04:57
 * @Desc: 流程
-->
<template>
  <view class="pagesProcess">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar title="流程审批"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar">
      <apiot-tabs
        :list="tabArry"
        :is-scroll="false"
        :current="currentIndex"
        @change="tabsChange"
      >
      </apiot-tabs>
    </u-sticky>

    <flow-log
      ref="flowLog"
      v-if="currentType === 'FlowLog'"
      :nodeArry="nodeArry"
      :isFinish="option.isFinish"
    ></flow-log>
    <flow-diagram
      ref="flowDiagram"
      v-if="currentType === 'FlowDiagram'"
      :instanceId="option.nodeId"
      :approvalInfo="approvalInfo"
    ></flow-diagram>
  </view>
</template>

<script>
import FlowDiagram from './components/FlowDiagram';
import FlowLog from './components/FlowLog';

import { getTaskSite } from '@/api/pagesProcess.js';

export default {
  components: { FlowDiagram, FlowLog },

  data() {
    return {
      // 菜单界面基础配置
      currentType: 'FlowLog',
      tabArry: [
        {
          name: '流程日志',
          type: 'FlowLog'
        },
        {
          name: '流程图谱',
          type: 'FlowDiagram'
        }
      ],
      nodeArry: [],
      option: {}
    };
  },

  computed: {
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
    },
    approvalInfo() {
      console.log(this.option);
      const { instanceName, triggerUserName } = this.option;
      return { instanceName, triggerUserName };
    }
  },

  methods: {
    tabsChange(item) {
      const tab = this.tabArry[item.index];
      if (this.currentType !== tab.type) {
        this.currentType = tab.type;
      }
    },
    // 获取审批流程
    async getTaskSite() {
      const result = await getTaskSite({ instanceId: this.option.nodeId });
      this.nodeArry = result;
    }
  },

  onLoad(option) {
    this.option = {
      ...option,
      isFinish: Boolean(option.isFinish)
    };
    if (this.option.nodeId) {
      this.getTaskSite();
      this.$bus.$on(`processNodesRefresh_${this.option.nodeId}`, this.getTaskSite);
    }
  },
  beforeDestroy() {
    if (this.option.nodeId) {
      this.$bus.$off(`processNodesRefresh_${this.option.nodeId}`);
    }
  }
};
</script>

<style lang='scss' scoped>
.pagesProcess {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
