/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap">
    <div class="singleTextContent" :style="getWrapStyle">
      <img v-if="getPrefixImg" :src="getPrefixImg" :style="getPrefixImgStyle"  alt="">
      <span :style="getPrefixTextStyle">{{config.stylesObj.prefixText}}</span>
      <span :style="getContentStyle">{{ renderContent }}</span>
      <span :style="getSuffixTextStyle">{{config.stylesObj.suffixText}}</span>
      <img v-if="getSuffixImg" :src="getSuffixImg" :style="getSuffixImgStyle"  alt="">
    </div>
  </div>
</template>

<script>
import { validConditions } from '_v/HomeMenuConfig/constants/common';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
    };
  },

  components: {},

  computed: {
    getColor() {
      return function (data, key) {
        const { conditionsArr = [] } = this.config;
        let conditionColor = '';
        if (conditionsArr.length) {
          const realConditionsArr = conditionsArr.filter((item) => item.enableConditions);
          if (realConditionsArr.length) {
            const color = validConditions(realConditionsArr, data, key);
            conditionColor = color;
          }
        }
        return conditionColor;
      };
    },
    getWrapStyle() {
      const { stylesObj: { textAlign } } = this.config;
      return {
        justifyContent: textAlign
      };
    },
    getPrefixImg() { // 前缀图片
      const realImg = this.getColor(this.getOBJ, 'fieldRelPrefixUrl');
      return this.$parseImgUrl(realImg || this.config.stylesObj.prefixImg);
    },
    getSuffixImg() {
      const realImg = this.getColor(this.getOBJ, 'fieldRelSuffixUrl');
      return this.$parseImgUrl(realImg || this.config.stylesObj.suffixImg);
    },
    getPrefixImgStyle() { // 前缀图片样式
      const { stylesObj: { prefixImgMarginRight, prefixImgWidth, prefixImgHeight } } = this.config;
      return {
        marginRight: `${prefixImgMarginRight}px`,
        width: `${prefixImgWidth}px`,
        height: `${prefixImgHeight}px`
      };
    },
    getSuffixImgStyle() { // 后缀图片样式
      const { stylesObj: { suffixImgMarginLeft, suffixImgWidth, suffixImgHeight } } = this.config;
      return {
        marginLeft: `${suffixImgMarginLeft}px`,
        width: `${suffixImgWidth}px`,
        height: `${suffixImgHeight}px`
      };
    },
    getPrefixTextStyle() { // 前缀文字样式
      const { stylesObj: {
        prefixTextMarginRight,
        prefixTextFontFamily,
        prefixTextFontSize,
        prefixTextColor,
        prefixTextFontWeight
      } } = this.config;
      const realColor = this.getColor(this.getOBJ, 'fieldRelPrefixColor');
      return {
        marginRight: `${prefixTextMarginRight}px`,
        fontFamily: prefixTextFontFamily,
        fontSize: `${prefixTextFontSize}px`,
        color: realColor || prefixTextColor,
        fontWeight: prefixTextFontWeight
      };
    },
    renderContent() {
      const { dataType, dataConfig, SqlDataConfig } = this.config;
      const { takeEffect } = dataConfig;
      if (dataType === 1) {
        return this.getOBJ[takeEffect];
      }
      if (dataType === 3) {
        const { SQLEffect } = SqlDataConfig;
        return this.getOBJ[SQLEffect];
      }
      return '';
    },
    getOBJ() {
      const { dataType, dataConfig, SqlDataConfig } = this.config;
      const { staticValue } = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        return obj;
      }
      if (dataType === 3) {
        const { SQLFilterResponse } = SqlDataConfig;
        const obj = JSON.parse(SQLFilterResponse);
        return obj;
      }
      return {};
    },
    getContentStyle() { // 内容具体样式
      const { stylesObj: {
        CFontFamily,
        CFontSize,
        CColor,
        CFontWeight
      } } = this.config;
      const realColor = this.getColor(this.getOBJ, 'fieldRelColor');
      return {
        fontFamily: CFontFamily,
        fontSize: `${CFontSize}px`,
        color: realColor || CColor,
        fontWeight: CFontWeight
      };
    },
    getSuffixTextStyle() { // 后缀文字样式
      const { stylesObj: {
        suffixTextMarginLeft,
        suffixTextFontFamily,
        suffixTextFontSize,
        suffixTextColor,
        suffixTextFontWeight
      } } = this.config;
      const realColor = this.getColor(this.getOBJ, 'fieldRelSuffixColor');
      return {
        marginLeft: `${suffixTextMarginLeft}px`,
        fontFamily: suffixTextFontFamily,
        fontSize: `${suffixTextFontSize}px`,
        color: realColor || suffixTextColor,
        fontWeight: suffixTextFontWeight
      };
    }
  },
  watch: {},
  methods: {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
</style>
