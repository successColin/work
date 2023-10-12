<!--
 * @Author: sss
 * @Date: 2023-05-31 15:50:30
 * @Last Modified by: sss
 * @Last Modified time: 2023-05-31 15:50:30
 * @Desc: 语音框
-->
<template>
  <view class="voiceBox">
    <i
      class="appIcon u-input__icon u-input__icon--suffix appIcon-yuyin"
      :class="[show ? `themeColor__font-${getThemeIndex}` : '']"
      @click.stop="clickVoice"
    ></i>
    <apiot-modal
      ref="shareModal"
      position="bottom"
      :show.sync="show"
      :automatic="false"
      :showTitle="false"
      :showCancel="false"
      :showSure="false"
    >
      <view class="voice">
        <div class="title">普通话</div>
        <div class="content font__ellipsis">{{ showValue }}</div>
        <div
          class="btn"
          :class="[
            `themeColor__bg-${getThemeIndex} `,
            enableSpeek ? `circle-ripple-${getThemeIndex}` : '',
          ]"
          @touchstart="startRecognize"
          @touchend="endRecognize"
        >
          <i class="appIcon appIcon-yuyinshixin"></i>
        </div>
      </view>
    </apiot-modal>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    // 识别文字是否包括标点符号
    punctuation: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      show: false,
      content: '',
      partialResult: '',
      enableSpeek: false
    };
  },

  computed: {
    showValue() {
      const { enableSpeek, partialResult } = this;
      return partialResult || (enableSpeek ? '正在聆听，你可以试试说：电机故障工单' : '长按说话');
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    maskClick() {},
    clickVoice() {
      this.content = '';
      this.partialResult = '';
      this.enableSpeek = false;
      this.show = true;
    },
    ontStart() {
      if (!this.show) return false;
      this.enableSpeek = true;
    },
    onRecognizing(e) {
      if (!this.show) return false;
      this.partialResult = e.partialResult;
    },
    onRecognition(e) {
      if (!this.show) return false;
      this.content += e.result;
      this.partialResult = this.content;
    },
    onEnd() {
      if (!this.show) return false;
      this.enableSpeek = false;
      if (this.content) {
        this.show = false;
        this.$emit('change', this.content);
      }
    },
    startRecognize() {
      // #ifdef APP-PLUS
      plus.speech.startRecognize({
        engine: 'baidu',
        lang: 'zh-cn',
        userInterface: false,
        continue: true,
        punctuation: this.punctuation
      });
      // #endif
    },
    endRecognize() {
      // #ifdef APP-PLUS
      plus.speech.stopRecognize();
      // #endif
    }
  },

  mounted() {},

  created() {
    // #ifdef APP-PLUS
    // 监听语音识别事件
    plus.speech.addEventListener('start', this.ontStart, false);
    plus.speech.addEventListener('recognizing', this.onRecognizing, false);
    plus.speech.addEventListener('recognition', this.onRecognition, false);
    plus.speech.addEventListener('end', this.onEnd, false);
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.voiceBox {
  .u-input {
    // padding-right: 20rpx !important;
    &__icon {
      text-align: center;
      font-size: 24px;
      &::after {
        content: '';
        height: 100%;
        width: 0;
        display: inline-block;
        vertical-align: middle;
      }
      &--suffix {
        color: #aaaaaa;
      }
    }
  }
  .title {
    margin-bottom: 18rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    line-height: 42rpx;
  }
  .content {
    font-size: 28rpx;
    color: #808080;
    line-height: 40rpx;
  }
  .btn {
    margin: 84rpx auto auto auto;
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 88rpx;
    color: #fff;

    .appIcon {
      font-size: 48rpx;
    }
  }
}
</style>
