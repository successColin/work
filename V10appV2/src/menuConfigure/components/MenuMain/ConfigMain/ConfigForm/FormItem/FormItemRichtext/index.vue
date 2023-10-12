<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-富文本框
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="richText" :style="richTextHeight">
      <u-parse :content="formatValue" :domain="$apiot.getComIP()"></u-parse>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from '../elementMixin';

export default {
  inject: ['getAllForm', 'resolveFormula', 'getFormScreenHeight', 'getMenuFlag'],
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      richTextUrl: '',
      uuid: null,
      token: ''
    };
  },

  computed: {
    formHeight() {
      return this.getFormScreenHeight();
    },
    richTextHeight() {
      const { sizeType } = this.element;
      let { heightMul = 1 } = this.element;

      // 尺寸选择
      if (sizeType === 2) {
        // #ifdef MP
        heightMul = 1;
        // #endif
        const height = `${this.$apiot.rpx2px(heightMul * 156)}px`;
        return {
          height
        };
      }
      // 全屏
      return { height: `${this.formHeight}px` };
    },
    // 全局配置-域名相关
    globalDomain() {
      if (this.element.showType !== 1) return '';
      const { UREPORT_URL } = this.$store.state.base.globalConfig;
      console.log(UREPORT_URL);
      const domain = UREPORT_URL.find((item) => item.attributeKey === 'appHomepageUrl') || {};
      if (!domain.attributeValue) return '';
      return domain.attributeValue;
    },
    // 获取自定义界面url
    customUrl() {
      const { globalDomain, element } = this;
      if (!globalDomain) return '';
      const { innerLink } = element;

      return `${globalDomain}/appCustomPage/${innerLink}`;
    },
    // 修改富文本框内容的token
    formatValue() {
      let { value } = this;
      const { token } = this;
      const reg = /token=(.*?)"/g;
      value = value.replace(reg, (text) => `token=${token}"`);
      return value;
    }
  },

  methods: {},

  mounted() {},

  created() {
    this.uuid = this._uid;
    this.token = this.$apiot.getComToken();
  }
};
</script>

<style lang='scss' scoped>
.richText {
  box-sizing: border-box;
  overflow: auto;
  padding: 0 15px 10px;
}
</style>
