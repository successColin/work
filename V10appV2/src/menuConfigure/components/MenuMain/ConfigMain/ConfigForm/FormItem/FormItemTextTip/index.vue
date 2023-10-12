<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-文本提示
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <section class="element noborder formTextTip">
      <text-tip
        :title="title"
        :iconName="iconName"
        :color="element.icon.color"
        :titleStyle="titleStyle"
        :content="resolveHtml"
        :contentStyle="contentStyle"
        :bgStyle="bgStyle"
      ></text-tip>
    </section>
  </u-form-item>
</template>

<script>
import elementMixin from '../elementMixin';
import TextTip from './TextTip';

export default {
  inject: ['getAllForm'],
  components: { TextTip },

  mixins: [elementMixin],

  props: {},

  data() {
    return {};
  },

  computed: {
    title() {
      const { name, showLabelTitle } = this.element;
      if (!showLabelTitle) return '';
      return name;
    },
    formValue() {
      return this.getAllForm();
    },
    resolveHtml() {
      const { fixedContent, formulaContent, defaultValueType } = this.element;
      if (defaultValueType === 1) return fixedContent;

      const reg = /\$([A-Za-z0-9]{6})\$/g;
      const formData = this.getAllForm();
      console.log(formulaContent);
      const str = formulaContent.replace(reg, (res, v) => {
        if (formData[v]) {
          return formData[v];
        }
        return '';
      });
      return this.$apiot.htmlReplace(str);
    },
    iconName() {
      const { enableIcon, icon } = this.element;
      if (!enableIcon) return '';
      return icon.icon || icon.imageUrl;
    },
    titleStyle() {
      const { size = 15, color, style } = this.element.titleFont;

      const sty = { color, fontSize: `${this.$apiot.px2rpx(size)}rpx` };
      if (style === 2) {
        sty.fontFamily =
          'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold';
        sty.fontWeight = 600;
      }
      return sty;
    },
    contentStyle() {
      const { size = 12, color, style } = this.element.font;

      const sty = { color, fontSize: `${this.$apiot.px2rpx(size)}rpx` };
      if (style === 2) {
        sty.fontFamily =
          'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold';
        sty.fontWeight = 600;
      }
      return sty;
    },
    bgStyle() {
      const { color, style } = this.element.labelBg;
      let borderRadius = '14rpx';
      if (style === 0) return { padding: '24rpx 0 0 0' };
      if (style === 2) borderRadius = '100px';
      return { background: color, borderRadius, padding: '24rpx' };
    }
  },

  watch: {},

  methods: {},

  mounted() {},

  created() {},

  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
@import '../index.scss';
.formTextTip {
  flex-direction: row !important;
  padding-top: 20rpx !important;
  padding-bottom: 20rpx !important;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
}
</style>
