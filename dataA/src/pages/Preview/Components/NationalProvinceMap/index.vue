/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
<div :style="getContentStyles" class="singleTextWrap">
  <div :id="`basicPie_${config.componentId}${designType}`" class="mapWrap">
  </div>
  <div>

  </div>
  <div class="zoomWrap"  :style="getDialog" v-if="visible">
    <div :class="{fixed: operationType==='click'}" @click="close"></div>
    <div v-html="renderPointText(pointData)" :key="key"></div>
  </div>
  <div class="pathWrap">
    <div v-if="pathArr.length > 1" class="pathContent" :style="getPathColor()">
      <div
          class="pathItem"
          v-for="(item, i) in pathArr"
          :key="`${item.id}_${i}`"
          :style="getPathColor((i+1) !== pathArr.length)"
          @click="changePath(item, i)"
      >
        <span class="name">{{item.name}}</span>
        <span class="el-icon-arrow-right" v-if="(i+1) !== pathArr.length"></span>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import axios from 'axios';
import { debounce } from '@/utils/utils';
import {screenConfig} from '@/constants/global';
import {getInfoById} from '@/services/design';
import { PROVINCE_LIST, CITY_LIST } from '@/constants/global'
import {decrypt} from '@/utils/secret';

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
    },
    updateState: { // 用于修改父组件data值
      type: Function,
      default: () => {
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    designType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      client: null,
      pathArr: [{}], // 下钻路径
      pointData: {},
      top: 0,
      left: 0,
      timer: null,
      recordOldValue: {},
      instance: null,
      operationType: '',
      key: 0,
      drillParams: {}, // 下钻参数
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
    getPathColor() {
      return function (type) {
        const { stylesObj: {
          adminBoundaryColor,
          labelColor
        } } = this.config;
        const b = {
          borderTop: `1px solid ${adminBoundaryColor}`,
          borderBottom: `1px solid ${adminBoundaryColor}`
        }
        if (type === undefined) {
          return b;
        }
        const obj = {
          color: labelColor
        }
        if (type) {
          return {
            ...obj,
            opacity: 0.8
          }
        }
        return obj;
      }
    },
    visible() {
      if (this.operationType === 'mousemove') {return true;}
      if (this.operationType === 'click') {return true;}
      if (!this.operationType) {return false;}
      return false;
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
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
            scatterHighlightColor: '#ff8c00',
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
          inRange: {
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
              if (!labelShowType) {return name;}
              if (labelShowType === 1) {return name;}
              if (labelShowType === 2) {return value[2];}
              if (labelShowType === 3) {return '';}
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
          if (isFlag && !Object.hasOwn(typeObj, `${type}`)) { // 没有Key
            typeObj[type] = [obj];
          } else if (isFlag && Object.hasOwn(typeObj, `${type}`)) { // 有key
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
          scatterHighlightColor: '#ff8c00',
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
        console.log(shadowHorizontalOffset, shadowVerticalOffset);
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
              if (!labelShowType) {return name;}
              if (labelShowType === 1) {return name;}
              if (labelShowType === 2) {return value[2];}
              if (labelShowType === 3) {return '';}
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
            const br = i + 1 === n ? '' : '</br>';
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
    reduceUrl() {
      return function (url, data) {
        if (!url) {return '';}
        return url.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
          if (o === 'value') {
            return data.value[2];
          }
          return data[o];
        }).replaceAll('{', '').replaceAll('}', '');
      }
    },
    renderPointText() {
      return function (params) {
        const { stylesObj: {
          showInfoType = 1,
          customTipInfo,
          infoConfig = [],
          overBulletWidth,
          overBulletHeight,
          overBulletUrl,
          clickBulletUrl,
          interactionMode,
          clickBulletHeight,
          clickBulletWidth
        } } = this.config;
        const data = { ...params };
        if (this.operationType === 'mousemove' && showInfoType === 1 && customTipInfo) { // 自定义
          return this.reduceUrl(customTipInfo, data);
        }
        const n = infoConfig.length
        if (this.operationType === 'mousemove' && showInfoType === 2 && n) { // 配置
          let str = '';
          infoConfig.forEach((item, i) => {
            const br = i + 1 === n ? '' : '</br>';
            const { name, value } = item;
            if (name && value) {
              let lastValue = name === 'value' ? data.value[2] : data[name];
              str += `<span style="display: inline-block;width: 80px;text-align: right;">${value}: </span>
                      <span style="display: inline-block;margin-left: 5px;width: 80px;text-align: left;"> ${lastValue}</span>${br}`;
            }
          })
          return str;
        }
        if (this.operationType === 'mousemove' && showInfoType === 3 && overBulletUrl) {
          const newUrl = this.reduceUrl(overBulletUrl, data);
          const dom = `<div style="width: ${overBulletWidth}px;height: ${overBulletHeight}px">
                  <iframe width="100%" height="100%" src=${newUrl}  frameborder="0"></iframe>
                </div>`;
          return dom;
        }
        if (this.operationType === 'click' && clickBulletUrl && interactionMode === 2) {
          const newUrl = this.reduceUrl(clickBulletUrl, data);
          const dom = `<div style="width: ${clickBulletWidth}px;height: ${clickBulletHeight}px">
                  <iframe width="100%" height="100%" src=${newUrl}  frameborder="0"></iframe>
                </div>`;
          return dom;
        }
        return '';
      }
    },
    getFirstName() {
      const { stylesObj: { areaType, provinceCode, cityCode} } = this.config;
      if (areaType === 1) {
        return '全国'
      } else if (areaType === 3) {
        const obj = PROVINCE_LIST.find((item) => item.value === provinceCode );
        return obj.name;
      } else if (areaType === 4) {
        const obj = CITY_LIST.find((item) => item.value === cityCode );
        return obj.name;
      } if (areaType === 5) {
        return '全部';
      }
      return '';
    }
  },
  created() {
    this.debouncedSearch = debounce(() => {
      this.instance.myChart.dispose();
      this.init();
    },400);
  },
  mounted() {
    const { stylesObj: { interactionMode, enableMouseClick } } = this.config;
    if (enableMouseClick && interactionMode === 1) {
      this.pathArr = [{ name: this.getFirstName }]
    }
    this.init();
    // let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    // let element = document.querySelector(`#basicPie_${componentId}`)
    // this.observer = new MutationObserver(() => {
    //   let width = getComputedStyle(element).getPropertyValue('width')
    //   let height = getComputedStyle(element).getPropertyValue('height')
    //   if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
    //     return
    //   }
    //   this.recordOldValue = {
    //     width,
    //     height
    //   };
    //   this.instance.myChart.resize();
    // })
    // this.observer.observe(element, {attributes: true, attributeFilter: ['style'], attributeOldValue: true})
  },

  methods: {
    close(){
      this.operationType = '';
      this.pointData = {};
    },
    async fetchCustomJson(url) {
      const res = await axios.get(url);
      return res.data || {};
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
        enableMouseClick,
        interactionMode,
        areaCallbackField,
        geoJsonConfig,
        zoom,
        center,
        fetchGeoJsonType
      } } = this.config;
      let mapName = '', mapGeoJSON = {};
      const n = this.pathArr.length;
      if (areaType === 1 && [0, 1].includes(n)) {
        mapGeoJSON = require('@/assets/geoJSON/100000.json');
        mapName = 'china';
      } else if (areaType === 3 && [0, 1].includes(n)) {
        mapGeoJSON = require(`@/assets/geoJSON/${provinceCode}.json`);
        mapName = provinceCode;
      } else if (areaType === 4 && [0, 1].includes(n)) {
        mapGeoJSON = require(`@/assets/geoJSON/${cityCode}.json`);
        mapName = cityCode;
      } else if (areaType === 5 && [0, 1].includes(n)) {
        mapGeoJSON = await this.fetchCustomJson(geoJSONUrl);
        mapName = 'CustomJSON';
      } else if ( n > 1 && interactionMode === 1 && enableMouseClick && fetchGeoJsonType === 1) { // 区域编码下钻
        const lastData = this.pathArr[n - 1];

        try {
          mapGeoJSON = require(`@/assets/geoJSON/${lastData[areaCallbackField]}.json`);
        } catch (e) {
          let url = '/';
          if (geoJsonConfig.length) {
            const obj = geoJsonConfig.find((item) => item.areaCode === lastData[areaCallbackField]);
            url = obj ? obj.geoJSONUrl || url : url;
            mapGeoJSON = await this.fetchCustomJson(url);
          }
        }
        mapName = lastData[areaCallbackField];
      } else if (n > 1 && interactionMode === 1 && enableMouseClick && fetchGeoJsonType === 2) { // 直接根据区域文件进行下钻
        const lastData = this.pathArr[n - 1];
        const url = lastData[areaCallbackField];
        mapGeoJSON = url ? await this.fetchCustomJson(url) : {};
        mapName = url || `默认${n}`;
      }
      const baseColor = 'rgba(255, 255, 255, 0)';
      echarts.registerMap(`${mapName}`, mapGeoJSON);
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
          emphasis: {
            label: {
              show: enableShow,
              color: highlightTextColor
            },
            itemStyle: {
              areaColor: areaHighlightColor
            }
          },
          itemStyle: {
            shadowOffsetX: shadowHorizontalOffset,
            shadowOffsetY: shadowVerticalOffset,
            areaColor: areaDefaultColor, // 区域颜色
            borderColor: adminBoundaryColor, // 边界颜色
            borderWidth: adminBoundaryBorderWidth, // 边界宽度
            shadowBlur: adminBoundaryShadowSize, // 阴影大小
            shadowColor: adminBoundaryShadowColor// 阴影颜色
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
      if (areaType === 1 && this.pathArr.length < 2) {
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
    async fetchMethods() {
      const { dataType, dataConfig: { staticValue } } = this.config;
      if ([1, 4].includes(dataType)) {
        this.list = JSON.parse(staticValue);
      }
      if (dataType === 2) {
        await this.getApi();
      }
      if (dataType === 3) {
        await this.getSQL();
      }
      if (dataType === 4 && !this.client) {
        await this.initMqtt()
        // if (this.client) {
        //   this.publishMessage()
        // } else {
        //   await this.initMqtt()
        // }
      }
    },
    async initMqtt() {
      const {
        mqttDataConfig: {
          mqttSourceId,
          sourceU,
          sourceP,
          sourceA,
          sourceD,
          topic
        }
      } = this.config;
      if (!(mqttSourceId && sourceU && sourceP && topic)) { return; }
      const options = {
        username: decrypt(sourceA), // 可选，MQTT代理的用户名
        password: decrypt(sourceD) // 可选，MQTT代理的密码
      };
      const url = decrypt(sourceU);
      const port = decrypt(sourceP);
      this.client = mqtt.connect(`${url}:${port}/mqtt`, options);
      this.client.on('connect', () => {
        this.client.subscribe(`${topic}/response`, (err) => {
          if (!err) {
            console.log('订阅成功!');
            this.publishMessage();
          }
        });
      });
      this.client.on('message', (u, message) => {
        this.reduceMqtt(JSON.parse(message));
      });
    },
    reduceMqtt(data) {
      const {
        mqttDataConfig: {
          enableMqttFilter,
          mqttFilterFun // 过滤器函数
        }
      } = this.config;
      if (!enableMqttFilter) {
        this.list = data;
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.list = result;
        return;
      }
      this.list = data;
    },
    publishMessage(message = '') {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.publish(`${topic}/publish`, message, {qos: 2});
    },
    async init() {
      const {componentId, enableTooltip, stylesObj: { enableMouseClick }} = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`
      if (!this.instance) {
        this.instance = Object.freeze({myChart: echarts.init(document.getElementById(domWrap))});
      }
      await this.fetchMethods();
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
        if (this.operationType === 'click') {return;}
        this.operationType = '';
        this.pointData = {};
      })
      this.instance.myChart.on('click', (params) => {
        const { componentType } = params;
        if (componentType !== 'geo' && enableMouseClick ) {
          this.click(params)
        }
      })
    },
    async click(params) {
      const { stylesObj: {
        enableMouseClick,
        interactionMode,
        url,
        enableOpenNewWindow,
        clickBulletUrl,
        dataCallbackFieldConfig,
        areaCallbackField,
        dataEndField,
        geoJsonConfig,
        fetchGeoJsonType
      } } = this.config;
      if (!enableMouseClick) {return;}
      const { data, event: { offsetX, offsetY }} = params;
      if (interactionMode === 1 && dataCallbackFieldConfig && dataCallbackFieldConfig.length && areaCallbackField ) { // 下钻
        if (data[dataEndField]) {return;}// 返回的数据中有下钻结束字段，就不允许下钻
        let mapGeoJSON = '';
        if (fetchGeoJsonType === 1) { // 区域编码下钻
          try {
            mapGeoJSON = require(`@/assets/geoJSON/${data[areaCallbackField]}.json`);
          } catch (e) {
            let url = '/';
            if (geoJsonConfig.length) {
              const obj = geoJsonConfig.find((item) => item.areaCode === data[areaCallbackField]);
              url = obj ? obj.geoJSONUrl || url : url;
            }
            mapGeoJSON = await this.fetchCustomJson(url);
          }
        } else if (fetchGeoJsonType === 2) { // geoJSON地址下钻
          const url = data[areaCallbackField] || '/';
          mapGeoJSON = await this.fetchCustomJson(url);
        }
        if (mapGeoJSON.type !== 'FeatureCollection') return;
        this.pathArr.push(data);
        this.$nextTick(() => {
          this.resetClick();
          this.init();
        })
      }
      if (interactionMode === 3 && url) { // 链接
        const newUrl = this.reduceUrl(url, data);
        if (enableOpenNewWindow) {
          window.open(newUrl, '_blank');
        } else {
          window.open(newUrl, '_self');
        }
      }
      if (interactionMode === 2 && clickBulletUrl) { // 弹框
        this.left = offsetX;
        this.top = offsetY;
        this.operationType = 'click';
        this.pointData = data;
        this.key += 1;
      }
      if (interactionMode === 4) { // 联动
        this.triggerParamsUpdate(data);
      }
    },
    triggerParamsUpdate(pointObj) {
      const {stylesObj: {paramsFieldsConfig, updateChart = []}} = this.config;
      if (!updateChart.length || !paramsFieldsConfig.length) {return;}
      let params = {};
      updateChart.forEach((key) => {
        paramsFieldsConfig.forEach((field) => {
          const { name, value } = field;
          params[`${key}_${name}`] = pointObj[value] || value;
        })
      })
      const newParams = {
        ...this.otherParams,
        ...params
      }
      this.updateState('filterParameter', newParams);
    },
    getParameters() {
      const {id, componentId} = this.config;
      const reduce = (obj) => { // 将Object 处理成 Array
        return Object.keys(obj).map((item) => {
          return {
            name: item,
            value: obj[item]
          }
        })
      }
      const query = this.$route.query
      let satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        })
      }
      const currentParams = {
        ...satisfyParams,
        ...query,
        ...this.drillParams
      }
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },
    async getApi() {
      const {apiDataConfig} = this.config;
      const params = this.getParameters();
      const res = await getInfoById(params) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(async () => {
            await this.getApi();
          }, time);
        }
        const list = JSON.parse(targetObj);
        if (!enableApiFilter) {
          this.list = list;
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(list);
          if (!(Array.isArray(result) && result.length)) {
            this.list = [];
            return
          }
          this.list = result;
          return;
        }
      }
    },
    async getSQL() {
      const {SqlDataConfig} = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          return
        }
        this.list = result;
        return;
      }
      this.list = res;
    },
    resetClick() {
      this.instance.myChart.off('mouseout');
      this.instance.myChart.off('click');
      this.instance.myChart.off('mousemove');
      this.operationType = '';
      const { stylesObj: {
        dataCallbackFieldConfig
      } } = this.config;

      const n = this.pathArr.length;
      if (!n || n === 1) {
        this.drillParams = {};
      } else {
        const data = this.pathArr[n - 1];
        let obj = {};
        dataCallbackFieldConfig.forEach(({name, value}) => {
          obj[name] = data[value];
        })
        this.drillParams = obj;
      }
    },
    changePath(item, i) {
      this.pathArr = this.pathArr.slice(0, i + 1);
      this.$nextTick(() => {
        this.resetClick();
        this.init();
      })
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
    }
    this.timer && clearTimeout(this.timer);
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  overflow: hidden;
  //display: flex;
  align-items: center;
  box-sizing: border-box;
  .mapWrap{
    width: 100%;
    height: 100%;
  }
  .singleTextContent {
    width: calc(100%);
    height: calc(100%);
    position: relative;
    margin: 0 auto;
  }
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
  & > .fixed{
      content: '';
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,.7);
      z-index: -1;
      cursor: pointer;
  }
}
.pathWrap {
  position: absolute;
  top: 46px;
  left: 50px;
  .pathContent{
    display: flex;
    padding: 10px 0;
    font-size: 18px;
    .pathItem{
      cursor: pointer;
    }
  }
}
</style>
