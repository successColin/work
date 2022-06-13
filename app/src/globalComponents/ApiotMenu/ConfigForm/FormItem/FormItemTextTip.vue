<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-label
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <section class="element formLabel">
      <apiot-text-tip
        :title="title"
        :iconName="iconName"
        :color="element.icon.color"
        :titleStyle="titleStyle"
        :content="content"
        :contentStyle="contentStyle"
        :bgStyle="bgStyle"
      ></apiot-text-tip>
    </section>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  inject: ['getAllForm'],
  components: {},

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
    content() {
      const { fixedContent, formulaContent, defaultValueType } = this.element;
      if (defaultValueType === 1) return fixedContent;
      const reg = /[$]([A-Za-z0-9]+)[$]/g;
      const form = this.formValue;
      const str = formulaContent.replace(reg, (res) => {
        if (form[res.slice(2, 8)]) {
          return form[res.slice(2, 8)];
        }
        return '';
      });
      return str;
    },
    iconName() {
      const { enableIcon, icon } = this.element;
      if (!enableIcon) return '';
      return icon.icon || icon.imageUrl;
    },
    titleStyle() {
      const { size = 15, color, style } = this.element.titleFont;

      let fontWeight = 400;
      if (style === 2) fontWeight = 600;
      return { color, fontWeight, fontSize: `${this.$apiot.px2rpx(size)}rpx` };
    },
    contentStyle() {
      const { size = 12, color, style } = this.element.font;

      let fontWeight = 400;
      if (style === 2) fontWeight = 600;
      return { color, fontWeight, fontSize: `${this.$apiot.px2rpx(size)}rpx` };
    },
    bgStyle() {
      const { color, style } = this.element.labelBg;
      let borderRadius = '14rpx';
      if (style === 2) borderRadius = '100px';
      return { background: color, borderRadius, padding: '24rpx' };
    }
  },

  watch: {},

  methods: {
    resolveHtml(html) {
      const reg = /[$]\{([A-Za-z0-9]+)\}/g;
      const str = html.replace(reg, (res) => {
        if (this.featureArr.form[res.slice(2, 8)]) {
          return this.featureArr.form[res.slice(2, 8)];
        }
        return '';
      });
      return str;
    }
  },

  mounted() {},

  created() {},

  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
.formLabel {
  flex-direction: row !important;
  padding-top: 20rpx !important;
  padding-bottom: 20rpx !important;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
