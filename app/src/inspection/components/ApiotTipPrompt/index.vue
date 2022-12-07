<template>
  <div class="prompt">
    <div class="prompt__layout"></div>
    <div class="prompt__wrap">
      <div class="prompt__wrap__title">{{promptData.title}}</div>
      <div class="prompt__wrap__content">
        {{promptData.tip}}
      </div>
      <div class="prompt__wrap__button">
        <span class="button sure" @click="sureClick">{{promptData.confirmText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    promptData: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    //  确定按钮事件
    sureClick() {
      // 自己业务添加关闭
      this.$emit('update:visible', false);
    },
  }
};
</script>
<style lang='scss' scoped>
.prompt{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  &__layout{
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
  }
  &__wrap{
    width: 610rpx;
    height: 300rpx;
    background: #FFFFFF;
    border-radius: 18rpx;
    overflow: hidden;
    position: absolute;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    padding-top: 50rpx;
    box-sizing: border-box;
    &__title{
      height: 58rpx;
      text-align: center;
      line-height: 58rpx;
      font-size: 34rpx;
      color: #333333;
    }
    &__content{
      width: 100%;
      height: 56rpx;
      line-height: 56rpx;
      color: #808080;
      text-align: center;
      font-size: 28rpx;
    }
    &__button{
      height: 88rpx;
      margin-top: 50rpx;
      .button{
        display: inline-block;
        width: 100%;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        box-shadow: inset 0px 1rpx 0px 0px #E9E9E9;
        color: #4689F5;
      }
    }
  }
}
</style>
