/**
* @name: splitLine
* @author: DELL
* @date: 2022/9/6 19:02
* @description：splitLine
* @update: 2022/9/6 19:02
*/
<!-- 页面 -->
<template>
  <section class="dividing">
    <div
        :class="`dividing__detail dividing__detail3`"
    >
      <i class="iconfont icon-shujiantoushouqi"></i>
      <span
          class="dividing__detail--name m-r-8"
      >{{ title }}</span
      >
      <div class="dividing__detail--line"></div>
    </div>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    title: {
      type: String,
      default: '基本信息'
    }
  },
  data() {
    return {
    };
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.dividing {
  box-sizing: border-box;
  padding: 4px 20px;
  width: 100%;
  &__detail {
    width: 100%;
    height: 44px;
    &--name {
      font-size: 14px;
      font-weight: 600;
      color: #333333;
      line-height: 15px;
      &.notShow {
        display: none;
      }
    }
    &--line {
      flex: 1;
      height: 14px;
      border-bottom: 1px solid #e9e9e9;
    }
  }
  &__detail3 {
    display: flex;
    align-items: center;
    margin-left: -4px;
    width: calc(100% + 4px);
    i {
      font-size: 18px;
      color: $--color-primary;
    }
  }
}
</style>
