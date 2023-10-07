/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <CDragComponent
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      @deactivated="deactivated"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :minw="2"
      :minh="2"
      :parentScaleX="scale"
      :parentScaleY="scale"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="singleTextWrap" @contextmenu.prevent="show">
      <div
          class="singleTextContent"
          :title="renderContent"
          :style="singleTextContentStyles"
      >
        <span v-if="prefixContent" :style="prefixStyles">{{prefixContent}}</span>
        <span :style="contentStyles">
          <component
              :is="activeCom"
              :value="renderContent"
              :config="sConfig"
              :endVal="getEndValue"
              :separator="separator"
          />
        </span>
        <span v-if="suffixContent" :style="suffixStyles">{{suffixContent}}</span>
      </div>
    </div>
  </CDragComponent>
</template>

<script>

import {screenConfig} from '@/constants/global';

export default {
  props: {
    bgConfig: {
      type: Object,
      default(){
        return screenConfig
      }
    },
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
      // width: 200,
      // height: 200,
      // top: 0,
      // left: 0,
    };
  },

  components: {
  },

  computed: {
    activeCom() { // 风格类型
      const obj = {
        1: 'CScrollNumber',
        2: 'CCountTo'
      }
      const { styleType = 1 } = this.config;
      return obj[styleType];
    },
    prefixStyles() {
      const { stylesObj: { prefixFontFamily, prefixFontSize, prefixColor, prefixFontWeight } } = this.config;
      return {
        fontFamily: prefixFontFamily,
        fontSize: `${prefixFontSize}px`,
        color: prefixColor,
        fontWeight: prefixFontWeight
      }
    },
    suffixStyles() {
      const { stylesObj: { suffixFontFamily, suffixFontSize, suffixColor, suffixFontWeight } } = this.config;
      return {
        fontFamily: suffixFontFamily,
        fontSize: `${suffixFontSize}px`,
        color: suffixColor,
        fontWeight: suffixFontWeight
      }
    },
    prefixContent() {
      return this.config.stylesObj.prefixContent;
    },
    suffixContent() {
      return this.config.stylesObj.suffixContent;
    },
    singleTextContentStyles() {
      const { stylesObj: { textAlign } } = this.config;
      return {
        justifyContent: textAlign
      };
    },
    contentStyles() {
      const { stylesObj: { FontFamily, FontSize, Color, FontWeight } } = this.config;
      return {
        fontFamily: FontFamily,
        fontSize: `${FontSize}px`,
        color: Color,
        fontWeight: FontWeight
      }
    },
    isNumberString() {
      return function (str) {
        return !isNaN(parseFloat(str)) && isFinite(str)
      };
    },
    sConfig() {
      const { stylesObj: {
        enableThousands,
        bgUrl, FontSize,distance, contentWidth, contentHeight
      }, enableBackgroundImage } = this.config;
      return {
        enableBackgroundImage,
        FontSize,
        distance,
        contentWidth,
        contentHeight,
        bgUrl,
        enableThousands
      }
    },
    addThousandsSeparator() { // 千分位
      return function (numStr) {
        return numStr.toLocaleString();
      }
    },
    separator() {
      const { stylesObj: { enableThousands = true} } = this.config;
      if (enableThousands) {
        return ',';
      }
      return '';
    },
    getValue() {
      const { dataType, dataConfig, apiDataConfig, SqlDataConfig, mqttDataConfig } = this.config;
      const {takeEffect, staticValue} = dataConfig;
      let str = '';
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        str = obj[takeEffect];
      }
      if (dataType === 2) {
        const {apiEffect, apiFilterResponse} = apiDataConfig
        const obj = JSON.parse(apiFilterResponse);
        str = obj[apiEffect];
      }
      if (dataType === 3) {
        const {SQLEffect, SQLFilterResponse} = SqlDataConfig
        const obj = JSON.parse(SQLFilterResponse);
        str = obj[SQLEffect];
      }
      if (dataType === 4) {
        const {mqttEffect, mqttFilterResponse} = mqttDataConfig
        const obj = JSON.parse(mqttFilterResponse);
        str = obj[mqttEffect];
      }
      return str || '0';
    },
    getEndValue() {
      const str = this.getValue;
      if (str && this.isNumberString(`${str}`)) {
       return +str;
      }
      return 0;
    },
    renderContent() {
      const { stylesObj: { enableThousands = true} } = this.config;
      const str = this.getValue;
      if (str && this.isNumberString(`${str}`)) {
        if (enableThousands) {
          return this.addThousandsSeparator(Number(str));
        } else {
          return `${str}`;
        }
      }
      return '0';
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {},
  methods: {
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstop(newRect) {
      // this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick() {
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
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
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>
