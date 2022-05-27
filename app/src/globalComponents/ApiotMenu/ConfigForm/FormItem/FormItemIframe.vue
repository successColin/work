<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-外部地址
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <!-- #ifdef H5 || APP-PLUS -->
    <view class="iframe" :style="iframeHeight">
      <iframe v-if="iframeUrl" :src="iframeUrl"></iframe>
    </view>
    <!-- #endif -->

    <!-- #ifdef MP -->
    小程序不支持该控件
    <!-- #endif -->
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  inject: ['getAllForm', 'resolveFormula'],
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      iframeUrl: ''
    };
  },

  computed: {
    iframeHeight() {
      let { heightMul = 1 } = this.element;
      // #ifdef MP
      heightMul = 1;
      // #endif
      const height = `${this.$apiot.rpx2px(heightMul * 156)}px`;
      return {
        height
      };
    }
  },

  methods: {
    init() {
      const { paramsArr, showType, innerLink, outerLink } = this.element;

      let url = '';
      if (showType === 1) url = innerLink;
      else url = outerLink;

      if (!url) return;
      const urlParam = [];
      paramsArr.forEach((param) => {
        const { type, name, fixed, formula } = param;
        let value = fixed;
        if (type === 2) {
          value = this.resolveFormula(true, formula);
        }
        urlParam.push(`${name}=${value}`);
      });
      if (urlParam.length > 0) url = `${url}?${urlParam.join('&')}`;
      this.iframeUrl = url;
    }
  },

  mounted() {},

  created() {
    this.init();
  }
};
</script>

<style lang='scss' scoped>
.iframe {
  width: 100%;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
