<!--
 * @Descripttion: 显示当前页面的路径，快速返回之前的任意页面。
 * @Author: ytx
 * @Date: 2022-05-31 17:09:58
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-31 17:09:58
-->
<template>
  <div class="breadcrumb" ref="parent">
    <!-- {{ w }} -->
    <div class="breadcrumb__box" ref="child">
      <div
        v-for="(item, i) in arr"
        :key="i"
        class="breadcrumb__item"
        @click="handlePathFun(item, i)"
      >
        <div class="breadcrumb__title">{{ item.name }}</div>
        <i
          class="appIcon appIcon-a-shujuxuanzejinru"
          v-if="arr.length - 1 !== i"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    separator: {
      type: String,
      default: ''
    },
    arr: {
      type: Array,
      default: () => [
        {
          name: '全部',
          id: 'all'
        }
      ]
    }
  },
  data() {
    return {
      // w: 0
    };
  },
  components: {},
  computed: {},
  watch: {
    // arr() {
    //   this.$nextTick(() => {
    //     const parentW = this.$refs.parent.clientWidth;
    //     const childW = this.$refs.child.clientWidth;
    //     console.log('=====>>>>', parentW, childW);
    //     const w = childW - parentW;
    //     if (w > 0) {
    //       this.w = `${-w}px`;
    //     } else {
    //       this.w = 0;
    //     }
    //   });
    // }
  },
  mounted() {},
  methods: {
    handlePathFun(v, i) {
      this.$emit('handlePathFun', v, i);
    }
  }
};
</script>
<style lang='scss' scoped>
.breadcrumb {
  padding: 20rpx 0;
  position: relative;
  overflow-x: auto;
  margin: 0 30rpx;
  height: 25rpx;
  width: 100%;
  &__box {
    display: flex;
    white-space: nowrap;
    position: absolute;
    left: 0px;
    transition: all 100ms linear 0s !important;
  }
  &__item {
    display: flex;
    align-items: center;
  }
  &__title {
    font-size: 28rpx;
    color: #333333;
  }
  &__title:last-child {
    color: #808080;
  }
  .appIcon-a-shujuxuanzejinru {
    font-size: 38rpx;
    color: #bbc3cd;
    margin: 0 9rpx;
  }
}
</style>
