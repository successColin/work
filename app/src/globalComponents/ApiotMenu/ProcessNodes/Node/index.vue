<!--
 * @Author: sss
 * @Date: 2022-05-30 10:35:06
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-30 10:35:06
 * @Desc: 节点
-->
<template>
  <section class="nodeProcess">
    <header class="nodeProcess__header">
      <span class="spot" :class="[isActivited ? 'activited' : '']"></span
      >{{ value.siteName }}
    </header>
    <div class="nodeProcess__content">
      <div
        class="nodeProcess__item"
        v-for="(item, index) in nodeConent"
        :key="index"
      >
        <node-content
          :content="item"
          :taskType="value.taskType"
          :multiApprovalType="value.multiApprovalType"
        ></node-content>
      </div>
    </div>
  </section>
</template>

<script>
import NodeContent from './components/NodeContent';

export default {
  components: { NodeContent },

  props: {
    value: Object,
    isActivited: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {
    nodeConent() {
      const { handUsers } = this.value;
      if (handUsers.length === 0) return [];
      return handUsers;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.nodeProcess {
  padding: 30rpx 0;
  &__header {
    position: relative;
    padding-left: 32rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #666666;

    .spot {
      position: absolute;
      top: 0;
      left: -10rpx;

      display: inline-block;
      width: 24rpx;
      height: 24rpx;
      border-radius: 50%;
      background: #d6d6d6;

      &.activited {
        background: rgba(70, 137, 245, 1);
        animation: spot-animated-border 1.5s infinite;
      }
    }
  }

  &__item {
    margin: 10rpx 0;
    padding-left: 30rpx;
    border-left: 2rpx dashed #d9d9d9;
  }
}
@keyframes spot-animated-border {
  0% {
    box-shadow: 0 0 0 0 rgba(70, 137, 245, 1);
  }

  100% {
    box-shadow: 0 0 0 10rpx rgba(70, 137, 245, 0);
  }
}
</style>
