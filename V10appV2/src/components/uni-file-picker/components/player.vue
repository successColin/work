<!--
 * @Descripttion: 业务文件
 * @Author: sss
 * @Date: 2022-01-05 14:20:13
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:20:13
-->
<template>
  <div class="prompt" v-if="isShow" @touchmove.prevent>
    <div class="prompt__layout" :class="beijClass"></div>
    <div class="prompt__wrap" @click.stop="cancleClick">
      <!-- <section class="deleteBox" @click.stop="deleteFile">
        <i class="appIcon appIcon-shanchu"></i>
      </section> -->
      <div
        class="prompt__wrap__content"
        :class="animationClass"
        @tap.stop="noop"
      >
        <video
          v-if="modalObj.type === 'video'"
          :src="$apiot.getComUrlByToken(modalObj.url)"
          autoplay="true"
          object-fit="contain"
          :poster="modalObj.posterUrl"
        ></video>
        <audio
          v-else-if="modalObj.type === 'audio'"
          :src="$apiot.getComUrlByToken(modalObj.url)"
          :poster="$apiot.getComUrlByToken(modalObj.url)"
          :action="audioAction"
          controls
        ></audio>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // top/middle/bottom
    position: {
      type: String,
      default: 'middle'
    },
    show: {
      type: Boolean,
      default: false
    },
    // 确定时是否自动关闭弹框
    automatic: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      promptValue: '',
      isShow: false, // 为了做动画
      modalObj: {},
      animationClass: [],
      audioAction: {
        method: 'pause'
      }
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
        type: '',
        url: '',
        success: (res) => {
          if (res.confirm) {
            this.$emit('confirm');
          } else if (res.cancel) {
            this.$emit('cancel');
          }
        }
      };
      this.modalObj = { ...baseObj, ...modalObj };
      //  #ifndef H5
      this.modalObj.posterUrl = this.modalObj.url;
      // #endif

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
  &__layout {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    inset: 0px;
    z-index: 1170;
    background-color: #333330;
  }
  &__wrap {
    width: 100%;
    height: 100vh;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    inset: 0px;
    z-index: 1175;
    box-sizing: border-box;
    &__content {
      width: 100%;
      overflow: hidden;
      transition-duration: 300ms;
      transition-timing-function: ease-out;
      video {
        width: 100%;
      }
    }
    .deleteBox {
      position: absolute;
      top: 30rpx;
      right: 30rpx;
      width: 48rpx;
      height: 48rpx;
      background: #ffffff;
      opacity: 0.89;
      text-align: center;
      border-radius: 50%;
      line-height: 48rpx;
      .appIcon-shanchu {
        font-size: 17px;
        color: #333330;
      }
    }
  }
}
</style>
