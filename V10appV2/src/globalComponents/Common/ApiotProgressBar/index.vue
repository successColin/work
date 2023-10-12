<!--
 * @Author: sss
 * @Date: 2022-07-08 09:42:37
 * @Last Modified by: sss
 * @Last Modified time: 2022-07-08 09:42:37
 * @Desc: 进度条
-->
<template>
  <section class="progressBar">
    <div class="progress-bar">
      <div class="progress-bar__out" :style="outStyle">
        <div class="progress-bar__inner" :style="progressStyle"></div>
      </div>
    </div>
    <div class="progressBar__text">{{ precent }}%</div>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    value: [Number, String],
    size: {
      type: [Number, String],
      default: '16rpx'
    },
    range: Array
  },

  data() {
    return {};
  },

  computed: {
    precent() {
      let num = Number(this.value);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(num)) return 0;

      if (num > 100) num = 100;

      return num;
    },
    progressStyle() {
      const { precent } = this;
      return { width: `${precent}%` };
    },
    outStyle() {
      let { size } = this;
      const type = typeof size;
      if (type === 'number') size = `${size}rpx`;

      return { height: size };
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.progressBar {
  position: relative;
  width: 100%;
  line-height: 1;

  .progress-bar {
    padding-right: 69rpx;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    margin-right: -74rpx;
    box-sizing: border-box;
    &__out {
      height: 16rpx;
      border-radius: 100px;
      background-color: #ebeef5;
      overflow: hidden;
      position: relative;
      vertical-align: middle;
    }
    &__inner {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background-color: #409eff;
      text-align: right;
      border-radius: 100px;
      line-height: 1;
      white-space: nowrap;
      transition: width 0.6s ease;
      &::after {
        display: inline-block;
        content: '';
        height: 100%;
        vertical-align: middle;
      }
    }
  }

  &__text {
    font-size: 24rpx;
    color: #606266;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10rpx;
    line-height: 1;
  }
}
</style>
