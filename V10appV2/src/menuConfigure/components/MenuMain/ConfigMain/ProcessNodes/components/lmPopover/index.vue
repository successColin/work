<template>
  <div class="lmPopover">
    <div class="lmPopover__content" v-if="isShow" :style="{ '--left': left }">
      <slot name="content"></slot>
      <div class="lmPopover__arrow"></div>
      <div class="lmPopover__bgn" @click="handleClick"></div>
    </div>
    <div @click="clickTrigger">
      <slot name="reference"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    left: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    // 触发事件
    async clickTrigger(e) {
      this.isShow = !this.isShow;
    },
    handleClick(e) {
      e.stopPropagation();
      this.isShow = false;
    }
  }
};
</script>

<style scoped lang="scss">
.lmPopover {
  display: inline-block;
  position: relative;
  &__content {
    position: absolute;
    padding: 8px;
    background-color: #fff;
    z-index: 2047;
    color: #606266;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    min-width: 150px;
    border-radius: 4px;
    border: 1px solid #ebeef5;
    word-break: break-all;
    top: 60rpx;
    left: var(--left);
  }
  &__arrow::after {
    top: -22rpx;
    margin-left: 2rpx;
    content: ' ';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border: 12rpx;
    border-style: solid;
    border-color: transparent;
    border-bottom-color: #fff;
  }
  &__bgn {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  ::v-deep {
    .u-divider {
      margin: 15rpx 0;
    }
  }
}
</style>
