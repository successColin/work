<!--
 * @Author: sss
 * @Date: 2022-05-30 08:57:32
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-30 08:57:32
 * @Desc: 流程节点
-->
<template>
  <section v-if="nodeArry.length > 0" class="processNodes">
    <header class="processNodes__header" @click="handleJump">
      <div><i class="appIcon appIcon-zuzhi"></i>流程日志</div>
      <div><i class="appIcon appIcon-a-shujuxuanzejinru"></i></div>
    </header>
  </section>
</template>

<script>
import { getTaskSite } from '@/api/pagesProcess.js';

export default {
  props: {
    nodeId: [Number, String],
    isFinish: {
      type: Boolean,
      default: false
    },
    approvalInfo: {
      type: Object,
      default: () => {}
    },
    isProcessNode: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      nodeArry: []
    };
  },

  computed: {},

  methods: {
    handleJump() {
      const { instanceName, triggerUserName } = this.approvalInfo;
      uni.navigateTo({
        url: `/menuConfigure/components/MenuMain/ConfigMain/ProcessNodes/detail?nodeId=${this.nodeId}&isFinish=${this.isFinish}&instanceName=${instanceName}&triggerUserName=${triggerUserName}`,
        animationType: 'slide-in-right'
      });
    },
    // 获取审批流程
    async getTaskSite() {
      try {
        const result = await getTaskSite({ instanceId: this.nodeId });
        this.nodeArry = result;
        if (this.nodeArry.length > 0) this.$emit('update:isProcessNode', true);
      } catch (error) {
        console.error(error);
      }
    }
  },

  mounted() {
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
    height: 78rpx;
    background: #e5f0ff;
    border-radius: 12rpx;
    font-size: 30rpx;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    & > div:first-child {
      display: flex;
      align-items: center;
      .appIcon-zuzhi {
        margin-right: 5rpx;
        color: #4689f5;
        font-size: 45rpx;
      }
    }
    .appIcon-a-shujuxuanzejinru {
      color: #4689f5;
      font-size: 45rpx;
    }
  }
}
</style>
