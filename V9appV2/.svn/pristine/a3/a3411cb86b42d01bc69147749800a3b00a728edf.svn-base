<template name="mPop">
  <view class="mPop" v-show="showPop">
    <view class="mask" @click="maskClick" catchtouchmove="true"></view>
    <view class="pop-content">
      <view class="pop-title" v-if="config.title"> {{ config.title }} </view>
      <view class="content"> {{ config.content }} </view>
      <view class="bottom">
        <m-button
          v-for="(item, index) in config.buttons"
          class="btn-item"
          :btnClass="item.btnClass"
          :btnTilte="item.text"
          :key="index"
        ></m-button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: '',
      showPop: false,
      config: {},
      baseConfig: {
        title: '',
        content: '',
        buttons: [],
      },
    };
  },
  methods: {
    maskClick() {
      //点击背景层
    },
    popCancel() {
      this.showPop = false;
    },
    alert(config = {}) {
      //警告
      if (!config.title) config.title = this.$t('basic-warning'); // 中文：警告
      config.buttons = [
        {
          text: config.confirmText || this.$t('basic-confirm'), // 中文："确定"
          handle: config.success,
          btnClass: 'whiteColor',
        },
      ];
      this.config = { ...this.baseConfig, ...config };
      this.showPop = true;
    },
    confirm(config = {}) {
      //询问
      if (!config.title) config.title = this.$t('basic-inquiry'); // 中文：询问
      config.buttons = [
        {
          text: config.confirmText || this.$t('basic-cancel'), // 中文："取消",
          handle: config.cancel,
          btnClass: 'whiteColorBlack',
        },
        {
          text: config.confirmText || this.$t('basic-confirm'), // 中文："确定",
          handle: config.success,
          btnClass: 'whiteColor',
        },
      ];
      this.config = { ...this.baseConfig, ...config };
      this.showPop = true;
    },
  },
};
</script>

<style>
</style>
