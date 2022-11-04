<!--
 * @Author: sss
 * @Date: 2022-05-30 08:57:32
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-30 08:57:32
 * @Desc: 流程节点
-->
<template>
  <section v-if="nodeArry.length > 0" class="processNodes">
    <header class="processNodes__header">流程进度</header>
    <div class="processNodes__content">
      <Node
        v-for="(item, index) in nodeArry"
        :key="index"
        :value="item"
        :isActivited="index === nodeArry.length - 1"
        :isFinish="isFinish"
      ></Node>
    </div>
  </section>
</template>

<script>
import { getTaskSite } from '@/api/pagesProcess.js';
import Node from './Node';

export default {
  components: { Node },

  props: {
    nodeId: [Number, String],
    isFinish: Boolean
  },

  data() {
    return {
      nodeArry: []
    };
  },

  computed: {},

  methods: {
    // 获取审批流程
    async getTaskSite() {
      try {
        console.log('getTaskSite');
        const result = await getTaskSite({ instanceId: this.nodeId });
        this.nodeArry = result;
      } catch (error) {
        console.error(error);
      }
    }
  },

  mounted() {},

  created() {
    if (this.nodeId) {
      this.getTaskSite();
      this.$bus.$on(`processNodesRefresh_${this.nodeId}`, this.getTaskSite);
    }
  },

  beforeDestroy() {
    if (this.nodeId) {
      this.$bus.$off(`processNodesRefresh_${this.nodeId}`);
    }
  }
};
</script>

<style lang='scss' scoped>
.processNodes {
  padding: 0 20rpx;
  &__header {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    @include fontBlob(500);
    color: #333333;
  }

  &__content {
    padding: 0 30rpx;
    background: #ffffff;
    box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.08);
    border-radius: 14rpx;
  }
}
</style>
