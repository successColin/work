<!--
 * @Descripttion: 业务文件
 * @Author: ytx
 * @Date: 2022-01-05 14:20:13
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:20:13
-->
<template>
  <div class="prompt" :class="[position]" v-if="show" @touchmove.prevent>
    <div class="prompt__layout" :class="beijClass"></div>
    <div class="prompt__wrap" @click.stop="cancleClick">
      <div
        class="prompt__wrap__content"
        :class="animationClass"
        @tap.stop="noop"
      >
        <div
          class="prompt__wrap--title"
          v-if="modalObj.showTile"
          :style="titleStyle"
        >
          {{ modalObj.title }}
        </div>
        <view class="prompt__wrap--content">
          <div class="prompt__wrap--content--title">{{ modalObj.content }}</div>
          <slot></slot>
        </view>
        <div class="prompt__wrap--button">
          <div
            v-if="modalObj.showCancel"
            class="button cancel"
            :style="{ background: cancelColor }"
            @click.stop="cancleClick"
          >
            {{ modalObj.cancelTitle }}
          </div>
          <div
            v-if="modalObj.showSure"
            class="button sure"
            @click.stop="sureClick"
            :class="[`themeColor__bg-${getThemeIndex}`]"
          >
            {{ modalObj.sureTitle }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: {
      type: String,
      default: ''
    },
    // top/middle/bottom
    position: {
      type: String,
      default: 'middle'
    },
    titleStyle: {
      type: Object,
      default() {
        return {
          textAlign: 'center'
        };
      }
    },
    cancelColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      promptValue: '',
      show: false,
      modalObj: {},
      animationClass: []
    };
  },
  computed: {
    // 动画名称
    aniName() {
      const { position } = this;
      if (position === 'bottom') return 'slide-up';
      return 'fade';
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },
  methods: {
    //  确定按钮事件
    sureClick() {
      // 自己业务添加关闭
      this.hideAni();

      setTimeout(() => {
        this.modalObj.success({ confirm: true });
        this.show = false;
      }, 300);
    },
    // 取消按钮事件
    cancleClick(e) {
      console.log('cancleClick====');
      console.log(e);
      this.hideAni();
      setTimeout(() => {
        this.modalObj.success({ cancel: true });
        this.show = false;
      }, 300);
      //
    },
    hideAni() {
      const { aniName } = this;
      this.beijClass = ['a-fade-leave', 'a-fade-leave-active'];
      this.animationClass = [`a-${aniName}-leave`, `a-${aniName}-leave-active`];
      this.$nextTick(() => {
        this.beijClass = ['a-fade-leave-to', 'a-fade-leave-active'];
        this.animationClass = [`a-${aniName}-leave-to`, `a-${aniName}-leave-active`];
      });
    },
    // 显示
    showModal(modalObj = {}) {
      const { aniName } = this;
      this.animationClass = [`a-${aniName}-enter`, `a-${aniName}-enter-active`];
      this.beijClass = ['a-fade-enter', 'a-fade-enter-active'];
      const baseObj = {
        showCancel: true,
        cancelTitle: this.$t('common.cancle'),
        showSure: true,
        sureTitle: this.$t('common.sure'),
        title: this.title || '提示',
        showTile: true,
        content: this.content || ''
      };
      this.modalObj = { ...baseObj, ...modalObj };

      this.show = true;
      this.$nextTick(() => {
        this.beijClass = ['a-fade-enter-to', 'a-fade-enter-active'];
        this.animationClass = [`a-${aniName}-to`, `a-${aniName}-enter-active`];
      });
    },
    // 显示
    showAsyncModal(modalObj = {}) {
      return new Promise((resolve, reject) => {
        modalObj.success = function (res) {
          if (res.confirm) {
            resolve(res);
          } else if (res.cancel) {
            reject(res);
          }
        };
        this.showModal(modalObj);
      });
    }
  },

  mounted() {}
};
</script>
<style lang='scss' scoped>
.prompt {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1100;
  &.bottom {
    .prompt__wrap {
      padding: 0;
      align-items: flex-end;
      &__content {
        border-radius: 30rpx 30rpx 0 0;
      }
      &--button {
        box-sizing: border-box;
        padding: 0 30rpx;
        margin-bottom: 19rpx;
        box-shadow: none;
        .button {
          height: 72rpx;
          line-height: 72rpx;
          border-radius: 12rpx;
          &.sure {
            margin-left: 24rpx;
          }
        }
      }
    }
  }
  &__layout {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    inset: 0px;
    z-index: 1170;
    background-color: rgba(0, 0, 0, 0.3);
  }
  &__wrap {
    width: 100%;
    height: 100vh;
    padding: 0 70rpx;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0px;
    z-index: 1175;
    box-sizing: border-box;
    &__content {
      width: 100%;
      padding-top: 18rpx;
      background: #ffffff;
      border-radius: 18rpx;
      overflow: hidden;
      transition-duration: 300ms;
      transition-timing-function: ease-out;
    }
    &--title {
      padding: 0 30rpx;
      flex-shrink: 0;
      margin-top: 42rpx;
      font-size: 34rpx;
      color: #333333;
      &--title {
        width: 100%;
        text-align: center;
      }
    }
    &--content {
      padding: 0 30rpx;
      margin-top: 20rpx;
      flex-shrink: 0;
      color: #808080;
      text-align: center;
      font-size: 28rpx;
    }
    &--button {
      flex-shrink: 0;
      width: 100%;
      margin-top: 60rpx;
      box-shadow: inset 0px 1rpx 0px 0px #e9e9e9;
      font-size: 30rpx;
      display: flex;
      .button {
        display: inline-block;
        flex: 1;
        height: 88rpx;
        line-height: 88rpx;
        text-align: center;
        color: #333333;
      }
      .sure {
        color: #ffffff;
      }
    }
  }
}
</style>
