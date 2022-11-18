<!--
 * @Descripttion: 业务文件
 * @Author: ytx
 * @Date: 2022-01-05 14:20:13
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:20:13
-->
<template>
  <div class="prompt" :class="[position]" v-if="isShow" @touchmove.prevent>
    <div class="prompt__layout" :class="beijClass"></div>
    <div class="prompt__wrap">
      <div
        class="prompt__wrap__content"
        :class="animationClass"
        @tap.stop="noop"
      >
        <div
          class="prompt__wrap--title"
          v-if="modalObj.showTitle"
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
            <template v-if="!customCancel">
              {{ modalObj.cancelTitle }}
            </template>
            <template v-else>
              <slot name="cancel"></slot>
            </template>
          </div>
          <div
            v-if="modalObj.showSure"
            class="button sure"
            @click.stop="sureClick"
            :class="[`themeColor__bg-${getThemeIndex}`]"
          >
            <template v-if="!customSure">
              {{ modalObj.sureTitle }}
            </template>
            <template v-else>
              <slot name="sure"></slot>
            </template>
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
    showTitle: {
      type: Boolean,
      default: true
    },
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
    },
    sureTitle: String,
    cancelTitle: String,
    show: {
      type: Boolean,
      default: false
    },
    // 确定时是否自动关闭弹框
    automatic: {
      type: Boolean,
      default: true
    },
    // 是否自定义取消按钮
    customCancel: {
      type: Boolean,
      default: false
    },
    // 是否自定义确定按钮
    customSure: {
      type: Boolean,
      default: false
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    showSure: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      promptValue: '',
      isShow: false, // 为了做动画
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
  watch: {
    show: {
      handler(newV) {
        // 为了兼容点击确定按钮不自动关闭弹框的情况
        if (!newV && !this.automatic && newV !== this.isShow) {
          this.hideAni();
          setTimeout(() => {
            this.isShow = false;
          }, 300);
        }
        // 展示弹出框
        if (newV && newV !== this.isShow) this.showModal({}, 0);
      },
      immediate: true
    }
  },
  methods: {
    //  确定按钮事件
    sureClick() {
      if (this.automatic) {
        // 自动关闭时默认动画
        this.hideAni();
        setTimeout(() => {
          this.modalObj.success({ confirm: true });
          this.$emit('update:show', this.isShow);
          this.isShow = false;
        }, 300);
      } else this.modalObj.success({ confirm: true });
    },
    // 取消按钮事件
    cancleClick() {
      this.hideAni();
      setTimeout(() => {
        this.modalObj.success({ cancel: true });

        this.$emit('update:show', this.isShow);
        this.isShow = false;
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
    showModal(modalObj = {}, type = 1) {
      const { aniName } = this;
      this.animationClass = [`a-${aniName}-enter`, `a-${aniName}-enter-active`];
      this.beijClass = ['a-fade-enter', 'a-fade-enter-active'];
      const baseObj = {
        showCancel: this.showCancel,
        cancelTitle: this.cancelTitle || this.$t('common.cancle'),
        showSure: this.showSure,
        sureTitle: this.sureTitle || this.$t('common.sure'),
        title: this.title || '提示',
        showTitle: this.showTitle,
        content: this.content || '',
        success: (res) => {
          if (res.confirm) {
            this.$emit('confirm');
          } else if (res.cancel) {
            this.$emit('cancel');
          }
        }
      };
      this.modalObj = { ...baseObj, ...modalObj };

      this.isShow = true;
      if (type === 1) this.$emit('update:show', this.isShow);
      this.$nextTick(() => {
        this.beijClass = ['a-fade-enter-to', 'a-fade-enter-active'];
        this.animationClass = [`a-${aniName}-to`, `a-${aniName}-enter-active`];
      });
    },
    // 显示
    showAsyncModal(modalObj = {}) {
      return new Promise((resolve, reject) => {
        modalObj.success = function(res) {
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
        font-size: 30rpx;
        font-family: $--font-family;
        font-weight: 400;
        color: #333333;
        letter-spacing: 1px;
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

      // border-top: 1px solid #e9e9e9;
      font-size: 30rpx;
      display: flex;
      .button {
        box-shadow: inset 0 1rpx 0 0 #e9e9e9;
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
.prompt__wrap--content--title {
  word-break: break-all;
}
</style>
