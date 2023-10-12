<template>
  <div class="prompt">
    <div class="prompt__layout"></div>
    <div class="prompt__wrap">
      <div class="prompt__wrap__title">{{title}}</div>
      <div class="prompt__wrap__content">
        <input type="text" v-model="promptValue" focus :placeholder="placeholder"
          placeholder-class="fontcolor" />
      </div>
      <div class="prompt__wrap__button">
        <span class="button cancel" @click="cancleClick">{{$t('common.cancle')}}</span>
        <span class="button sure" @click="sureClick">{{$t('common.sure')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
  },
  data() {
    return {
      promptValue: '',
      autoFocus: false,
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {
    this.$nextTick(() => {
      this.autoFocus = true;
    });
  },
  methods: {
    //  确定按钮事件
    sureClick() {
      // 自己业务添加关闭
      this.$emit('sure-click', this.promptValue);
    },
    // 取消按钮事件
    cancleClick() {
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
    bottom: 0;
  }
  &__wrap{
    width: 100%;
    height: 368rpx;
    background: #FFFFFF;
    border-radius: 30rpx 30rpx 0px 0px;
    position: absolute;
    left: 0;
    bottom: 0;
    padding-top: 30rpx;
    &__title{
      height: 80rpx;
      padding: 0 30rpx;
      line-height: 80rpx;
      font-size: 32rpx;
      color: #333333;
    }
    &__content{
      padding: 20rpx 30rpx;
      input{
        width: 100%;
        height: 88rpx;
        background: #FAFAFA;
        border-radius: 12rpx;
        padding: 0 20rpx;
        &::placeholder{
          color: #AAAAAA;
          font-size: 32rpx;
        }
      }
    }
    &__button{
      height: 110rpx;
      padding: 19rpx 21rpx;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      .button{
        width: 330rpx;
        height: 72rpx;
        line-height: 72rpx;
        text-align: center;
        background: #F1F3F6;
        border-radius: 12rpx;
        margin: 0 12rpx;
        color: #333333;
      }
      .sure{
        background: #4689F5;
        color: #ffffff;
      }
    }
  }
  .fontcolor{
    color: #AAAAAA;
  }
}
</style>
