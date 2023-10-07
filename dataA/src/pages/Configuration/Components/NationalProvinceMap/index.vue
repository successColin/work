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
      :isDraggable="!config.isFixed"
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
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
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div
        class="singleTextWrap"
        :id="`basicPie_${config.componentId}`"
        :style="getContentStyles"
    >
    </div>
<!--    <Dialog v-if="visible">111</Dialog>-->
    <div class="zoomWrap" :style="getDialog" v-if="visible">
      <div v-html="renderPointText(pointData)"></div>
    </div>
  </CDragComponent>
</template>

<script>

import axios from 'axios';
import { debounce } from '@/utils/utils';
import {screenConfig} from '@/constants/global';
// eslint-disable-next-line no-undef
let echarts = require('echarts');

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
      pointData: {},
      top: 0,
      left: 0,
      timer: null,
      recordOldValue: {},
      instance: null,
      operationType: '',
      list: [] // 后台数据
    };
  },

  components: {
    // Dialog
  },

  computed: {
    getDialog() {
      return {
        top: `${this.top}px`,
        left: `${this.left + 10 }px`
      }
    },
    visible() {

      if (this.operationType === 'mousemove') return true;
      if (!this.operationType) return false;
      return false;
    },
    getContentStyles() {
      const {width, height} = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    },
    getSeries() { // 获取散点图数据
      return function ({scatterBorder, dataMappingField, scatterConfig = [], ...rest}) {
        if (!scatterConfig.length) {
          const dataList = this.list.map((item) => {
            const {lat, lon, value, name } = item;
            return {
              name,
              value: [lon, lat, value]
            }
          })
          const res = this.getRender(dataList, {
            scale: 1.1,
            symbolSize: 10,
            scatterColor: '#f4e925',
            scatterHighlightColor :'#ff8c00',
            scatterBorderColor: null,
            scatterBorderHighlight: null,
            ...rest
          })
          return [res]
        }
        let typeObj = this.getReducerType(this.list, dataMappingField, scatterConfig);
        const series = [];
        Object.keys(typeObj).forEach((key) => {
          if (key === 'other') {
            series.push(this.getRender(typeObj[key], {...rest}))
          } else {
            const current = scatterConfig.find((item) => {
              return `${item.fieldValue}` === `${key}`;
            });
            const { scatterSize, scatterHighlightSize, scatterColor,scatterHighlightColor, scatterBorderColor = null, scatterBorderHighlight = null } = current;
            series.push(this.getRender(typeObj[key], {
              scale: scatterHighlightSize / scatterSize,
              symbolSize: scatterSize,
              scatterColor,
              scatterHighlightColor,
              scatterBorderColor,
              scatterBorderHighlight,
              ...rest
            }))
          }
        })
        return series;
      }
    },
    getHotColor() { // 获取热力图颜色
      const { stylesObj: { pointSize, dotBlurSize, hotDataColor } } = this.config;
      let obj = {
        max: pointSize,
        min: dotBlurSize,
        textStyle: {
          color: '#ffffff'
        },
        left: 20,
        bottom: 20,
        splitNumber: 5
      };
      if (hotDataColor.length) {
        obj = {
          ...obj,
          inRange : {
            color: hotDataColor.map((item) => item.c1)
          }
        }
      }
      return obj;
    },
    getHotSeries() { // 获取热力图配置
      const dataList = this.list.map((item) => {
        const {lat, lon, value, name } = item;
        return {
          name,
          value: [lon, lat, value]
        }
      })
      return [
        {
          type: 'heatmap',
          coordinateSystem: 'geo',
          data: dataList
        }
      ];
    },
    getRender() { // 渲染散点
      return function (data, {
        scale = 1.1,
        symbolSize = 10,
        scatterColor = '#fff',
        scatterHighlightColor = '#ffffff',
        scatterBorderColor = null,
        scatterBorderHighlight = null,
        enableShowLabel,
        labelColor,
        labelSize,
        scatterIcon,
        labelPosition,
        labelShowType
      }) {
        return {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: data,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          symbol: scatterIcon,
          symbolSize,
          hoverAnimation: true,
          label: {
            formatter: function ({ data: { name, value} }) {
              if (!labelShowType) return name;
              if (labelShowType === 1) return name;
              if (labelShowType === 2) return value[2];
              if (labelShowType === 3) return '';
              return '';
            },
            position: labelPosition,
            show: enableShowLabel,
            color: labelColor,
            fontSize: labelSize
          },
          itemStyle: {
            color: scatterColor,
            shadowBlur: 10,
            shadowColor: '#333',
            borderColor: scatterBorderColor
          },
          emphasis: {
            scale,
            itemStyle: {
              color: scatterHighlightColor,
              borderColor: scatterBorderHighlight
            }
          },
          zlevel: 1
        }
      }
    },
    getReducerType() { // 处理数据分类型
      return function (list, fieldKey, arr) {
        let typeObj = {
          other: []
        };
        // 数据分类
        list.forEach((liObj) => {
          const { lon, lat, value, name, ...rest } = liObj;
          const type = liObj[fieldKey];
          const isFlag = arr.some((item) => {
            return `${item.fieldValue}` === `${type}`;
          });
          const obj = {
            name,
            value: [lon, lat, value],
            ...rest,
            lon,
            lat
          }
          if (isFlag && (!Object.hasOwn(typeObj, `${type}`))) { // 没有Key
            typeObj[type] = [obj];
          } else if (isFlag && (Object.hasOwn(typeObj, `${type}`))) { // 有key
            typeObj[type].push(obj);
          } else if (!isFlag) {
            typeObj.other.push(obj);
          }
        })
        return typeObj;
      }
    },
    getCustomSeries() { // 渲染自定义的
      return function ({imageWidth,imageHeight, customDataMappingField, customDisplay = []}) {
        const normalScatter = { // 定义通用的
          scale: 1.1,
          symbolSize: 10,
          scatterColor: '#f4e925',
          scatterHighlightColor :'#ff8c00',
          scatterBorderColor: null,
          scatterBorderHighlight: null,
          enableShowLabel: false,
          labelColor: '#fff',
          labelSize: 12,
          scatterIcon: 'circle',
          labelPosition: 'right',
          labelShowType: 1
        }
        if (!customDisplay.length) {
          const dataList = this.list.map((item) => {
            const {lat, lon, value, name } = item;
            return {
              name,
              value: [lon, lat, value]
            }
          })
          const res = this.getRender(dataList, normalScatter);
          return [res];
        }
        let typeObj = this.getReducerType(this.list, customDataMappingField, customDisplay);
        const series = [];
        Object.keys(typeObj).forEach((key) => {
          if (key === 'other') {
            series.push(this.getRender(typeObj[key], normalScatter))
          } else {
            const current = customDisplay.find((item) => {
              return `${item.fieldValue}` === `${key}`;
            });
            series.push(this.getCustomRender(typeObj[key], { ...current, imageWidth, imageHeight }))
          }
        })
        return series;
      }
    },
    getCustomRender() { // 渲染自定义
      return function (data, config) {
        const {
          customUrl,
          enableShowLabel,
          labelShowType,
          labelColor,
          labelSize,
          labelPosition,
          shadowHorizontalOffset = 0,
          shadowVerticalOffset = 0,
          imageWidth = 20,
          imageHeight = 20
        } = config;
        const symbol = customUrl ? `image://${customUrl}` : 'circle';
        return {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: data,
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          symbol,
          symbolSize: [imageWidth, imageHeight],
          hoverAnimation: true,
          label: {
            formatter: function ({ data: { name, value} }) {
              if (!labelShowType) return name;
              if (labelShowType === 1) return name;
              if (labelShowType === 2) return value[2];
              if (labelShowType === 3) return '';
              return '';
            },
            offset: [shadowHorizontalOffset, shadowVerticalOffset],
            position: labelPosition,
            show: enableShowLabel,
            color: labelColor,
            fontSize: labelSize
          },
          zlevel: 2
        }
      }
    },
    renderText() {
      return function (params) {
        const { stylesObj: { showInfoType = 1, customTipInfo, infoConfig = [], overBulletWidth, overBulletHeight, overBulletUrl } } = this.config;
        const { data } = params;
        if (showInfoType === 1 && customTipInfo) { // 自定义
          const text = customTipInfo.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
            if (o === 'value') {
              return data.value[2];
            }
            return data[o];
          }).replaceAll('{', '').replaceAll('}', '');
          return text;
        }
        const n = infoConfig.length
        if (showInfoType === 2 && n) { // 配置
          let str = '';
          infoConfig.forEach((item, i) => {
            const br = (i + 1) === n ? '' : '</br>';
            const { name, value } = item;
            if (name && value) {
              let lastValue = name === 'value' ? data.value[2] : data[name];
              str += `<span style="display: inline-block;width: 80px;text-align: right;">${value}: </span>
                      <span style="display: inline-block;margin-left: 5px;width: 80px;text-align: left;"> ${lastValue}</span>${br}`;
            }
          })
          return str;
        }
        if (showInfoType === 3 && overBulletUrl) {
          const newUrl = overBulletUrl.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
            let lastValue = o === 'value' ? data.value[2] : data[o];
            return lastValue;
          }).replaceAll('{', '').replaceAll('}', '');
          const dom = `<div style="width: ${overBulletWidth}px;height: ${overBulletHeight}px">
                  <iframe width="100%" height="100%" src=${newUrl}  frameborder="0"></iframe>
                </div>`;
          return dom;
        }
        // if (type === 'click') {
        //   return 1111;
        // }
        return '';
      }
    },
    renderPointText() {
      return function (params) {
        const { stylesObj: { showInfoType = 1, customTipInfo, infoConfig = [], overBulletWidth, overBulletHeight, overBulletUrl } } = this.config;
        const data = { ...params };
        if (showInfoType === 1 && customTipInfo) { // 自定义
          const text = customTipInfo.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
            if (o === 'value') {
              return data.value[2];
            }
            return data[o];
          }).replaceAll('{', '').replaceAll('}', '');
          return text;
        }
        const n = infoConfig.length
        if (showInfoType === 2 && n) { // 配置
          let str = '';
          infoConfig.forEach((item, i) => {
            const br = (i + 1) === n ? '' : '</br>';
            const { name, value } = item;
            if (name && value) {
              let lastValue = name === 'value' ? data.value[2] : data[name];
              str += `<span style="display: inline-block;width: 80px;text-align: right;">${value}: </span>
                      <span style="display: inline-block;margin-left: 5px;width: 80px;text-align: left;"> ${lastValue}</span>${br}`;
            }
          })
          return str;
        }
        if (showInfoType === 3 && overBulletUrl) {
          const newUrl = overBulletUrl.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
            let lastValue = o === 'value' ? data.value[2] : data[o];
            return lastValue;
          }).replaceAll('{', '').replaceAll('}', '');
          const dom = `<div style="width: ${overBulletWidth}px;height: ${overBulletHeight}px">
                  <iframe width="100%" height="100%" src=${newUrl}  frameborder="0"></iframe>
                </div>`;
          return dom;
        }
        // if (type === 'click') {
        //   return 1111;
        // }
        return '';
      }
    }
  },
  created() {
    this.debouncedSearch = debounce(() => {
      // this.instance.myChart.dispose();
      this.init();
    },400);
  },
  watch: {
    'config.stylesObj': {
      immediate: false,
      handler() {
        if (this.instance) {
          this.debouncedSearch();
        }
      }
    }
  },
  mounted() {
    const { componentId } = this.config;
    const dom = document.querySelector(`#basicPie_${componentId}`);
    if(dom) {
      dom.addEventListener('contextmenu', this.show, true);
    }
    this.init();
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let element = document.querySelector(`#basicPie_${componentId}`)
    this.observer = new MutationObserver(() => {
      let width = getComputedStyle(element).getPropertyValue('width')
      let height = getComputedStyle(element).getPropertyValue('height')
      if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
        return
      }
      this.recordOldValue = {
        width,
        height
      };
      this.instance.myChart.resize();
    })
    this.observer.observe(element, {attributes: true, attributeFilter: ['style'], attributeOldValue: true})
  },

  methods: {
    async fetchCustomJson(url) {
      const res = await axios.get(url);
      return res.data || {};
    },
    async init() {
      const {componentId, dataType, dataConfig: { staticValue }, enableTooltip, apiDataConfig, SqlDataConfig} = this.config;
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(`basicPie_${componentId}`))});
      if ( [1,4].includes(dataType)) {
        this.list = JSON.parse(staticValue);
      }
      if (dataType === 2) {
        const {apiFilterResponse = '[]'} = apiDataConfig;
        this.list = JSON.parse(apiFilterResponse);
      }
      if (dataType === 3) {
        const {SQLFilterResponse = '[]'} = SqlDataConfig;
        this.list = JSON.parse(SQLFilterResponse);
      }
      const option = await this.getOption();
      this.instance.myChart.setOption(option, true);
      this.instance.myChart.on('mousemove', (params) => {
        const { componentType, event: { offsetX, offsetY }, data } = params;
        if (componentType !== 'geo' && enableTooltip ) {
          this.left = offsetX;
          this.top = offsetY;
          this.pointData = data;
          this.operationType = 'mousemove';
        }
      })
      this.instance.myChart.on('mouseout', () => {
        this.operationType = '';
        this.pointData = {};
      })
    },
    async getOption() {
      const { stylesObj: {
        areaType, provinceCode, cityCode, geoJSONUrl, bgColor1, bgColor2,
        adminBoundaryColor,
        adminBoundaryBorderWidth,
        adminBoundaryShadowColor,
        adminBoundaryShadowSize,
        shadowHorizontalOffset,
        shadowVerticalOffset,
        areaDefaultColor,
        areaHighlightColor,
        textColor,
        highlightTextColor,
        enableShow,
        roam,
        displayType,
        scatterBorder,
        dataMappingField,
        scatterConfig,
        enableShowLabel,
        labelColor,
        labelSize,
        scatterIcon,
        labelPosition,
        labelShowType,
        imageWidth,
        imageHeight,
        customDataMappingField,
        customDisplay,
        zoom,
        center
      } } = this.config;
      let mapName = '', mapGeoJSON = {};
      if (areaType === 1) {
        mapGeoJSON = require('@/assets/geoJSON/100000.json');
        mapName = 'china';
      } else if (areaType === 3) {
        mapGeoJSON = require(`@/assets/geoJSON/${provinceCode}.json`);
        mapName = provinceCode;
      } else if (areaType === 4) {
        mapGeoJSON = require(`@/assets/geoJSON/${cityCode}.json`);
        mapName = cityCode;
      } if (areaType === 5) {
        mapGeoJSON = await this.fetchCustomJson(geoJSONUrl);
        mapName = 'CustomJSON';
      }
      const baseColor = 'rgba(255, 255, 255, 0)';
      echarts.registerMap(mapName, mapGeoJSON);
      let series = [];
      const option = {
        tooltip: {
          show: false,
          // show: enableTooltip,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderWidth: 0,
          textStyle: {
            color: '#fff'
          },
          // trigger: 'none',
          formatter: (params) => {
            const text = this.renderText(params)
            return text;
          }
          // axisPointer: {
          //   type: 'cross',
          //   label: {
          //     backgroundColor: '#333'
          //   }
          // }
        },
        backgroundColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0, color: bgColor1 || bgColor2 || baseColor // 0% 处的颜色
          }, {
            offset: 1, color: bgColor2 || bgColor1 || baseColor // 100% 处的颜色
          }],
          globalCoord: false // 缺省为 false
        },
        geo: {
          map: mapName,
          show: true,
          roam: roam,
          zoom,
          label: {
            show: enableShow,
            color: textColor
          },
          itemStyle: {
            shadowOffsetX: shadowHorizontalOffset,
            shadowOffsetY: shadowVerticalOffset,
            areaColor: areaDefaultColor, // 区域颜色
            borderColor: adminBoundaryColor, // 边界颜色
            borderWidth: adminBoundaryBorderWidth, // 边界宽度
            shadowBlur: adminBoundaryShadowSize, // 阴影大小
            shadowColor: adminBoundaryShadowColor // 阴影颜色,
          },
          emphasis:{
            itemStyle: {
              areaColor: areaHighlightColor
            },
            label: {
              show: enableShow,
              color: highlightTextColor
            }
          },
          select: {
            disabled: true,
            label: {
              show: enableShow,
              color: highlightTextColor
            },
            itemStyle: {
              areaColor: areaHighlightColor
            }
          }
        }
      };
      if (displayType === 1) {
        series = this.getSeries({
          scatterBorder,
          dataMappingField,
          scatterConfig,
          enableShowLabel,
          labelColor,
          labelSize,
          scatterIcon,
          labelPosition,
          labelShowType
        })
      }
      if (displayType === 2) { // 热力图
        series = this.getHotSeries;
        option.visualMap = this.getHotColor;
      }
      if (displayType === 3) { // 自定义
        series = this.getCustomSeries({
          imageWidth,imageHeight, customDataMappingField, customDisplay
        });
      }
      if (areaType === 1) {
        if (!center) {
          option.geo.center = [108.953723,34.341248];
        } else {
          const centerArr = center.split(',');
          option.geo.center = [centerArr[0],centerArr[1]];
        }
      }
      option.series = series;
      return option;
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
      this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    show(e) {
      e.preventDefault();
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
    }
    const dom = document.querySelector(`#basicPie_${this.config.componentId}`);
    if (dom) {
      dom.removeEventListener('contextmenu', this.show)
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .singleTextContent {
    width: calc(100%);
    height: calc(100%);
    position: relative;
    margin: 0 auto;
  }

  .pieHook {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  ::v-deep{
    .tooltip-info {
      color: #ffffff;
      font-size: 12px;
      line-height: 18px;
    }
    .anchorBL{
      display: none;
    }
    .BMap_bubble_content{
      width: 100% !important;
      height: 100% !important;
      &>div{
        width: 100%;
        height: 100%;
      }
    }
    .BMap_pop>div:nth-child(1)>div, .BMap_pop>div:nth-child(3)>div, .BMap_pop>div:nth-child(5)>div, .BMap_pop>div:nth-child(7)>div{
      border: none !important;
      background:  rgba(0,0,0,.3) !important;
    }
    .BMap_pop .BMap_top, .BMap_pop .BMap_center, .BMap_bottom{
      border: none !important;
      background:  rgba(0,0,0,.3) !important;
    }
    .BMap_pop>img{
      display: none;
    }
    .BMap_pop>div:nth-child(8)>img{
      display: none;
    }
    .BMap_shadow{
      display: none;
    }
  }
  //.point{
  //  width: 100%;
  //  height: 100%;
  //  position: absolute;
  //  transform: translate(-0.1rem, -0.1rem);
  //  border-radius: 50%;
  //  box-sizing: border-box;
  //  cursor: pointer;
  //  .circle{
  //    width: 100%;
  //    height: 100%;
  //    border: 0.04rem solid #CFF3FF;
  //    border-radius: 50%;
  //    background: #02D5FF;
  //    box-sizing: border-box;
  //    top: 0;
  //    left: 0;
  //    position: absolute;
  //    z-index: 5;
  //  }
  //  &::before, &::after{
  //    content: '';
  //    width: 350%;
  //    height: 350%;
  //    border-radius: 50%;
  //    background: #02D5FF;
  //    position: absolute;
  //    left: -125%;
  //    top: -115%;
  //    animation: zoomAni 2s linear infinite;
  //    z-index: -1;
  //    opacity: 0;
  //    -webkit-animation: zoomAni 2s linear infinite;
  //  }
  //  &::before{
  //    animation-delay: 1s;
  //  }
  //}
  //
  //@keyframes zoomAni {
  //  0% {
  //    transform: scale(.2);
  //    opacity: 1;
  //    -webkit-transform: scale(.2);
  //    -moz-transform: scale(.2);
  //    -ms-transform: scale(.2);
  //    -o-transform: scale(.2);
  //  }
  //  100% {
  //    transform: scale(1);
  //    opacity: 0;
  //  }
  //}
}
.zoomWrap{
  position: absolute;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  border-radius: 4px;
  box-sizing: border-box;
  z-index: 222;
  & > div{
    font-size: 14px;
    line-height: 24px;
  }
}
</style>
