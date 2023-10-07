/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div
      class="singleTextWrap"
      :id="`basicPie_${config.componentId}`"
      :style="getContentStyles"
  >
    <!-- 散点图 -->
    <baidu-map
        class="map singleTextContent"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="scrollWheelZoom"
        @ready="handler"
        @zoomstart="zoomstart"
        @zoomend="zoomend"
        v-if="config.stylesObj.displayType === 1"
    >
      <bm-label
          :key="i"
          v-for="(item, i) in points"
          content="<div class='point'><div class='circle'></div></div>"
          :position="{lng: item.value[0], lat: item.value[1]}"
          :labelStyle="getLabelStyles(i, item)"
          @mouseover="mouseover($event, i, item)"
          @mouseout="mouseout($event, i, item)"
          @click="click($event, item)"
      />
      <bm-info-window
          :position="{lng: pointInfo.value[0], lat: pointInfo.value[1]}"
          :show="isShow"
          :width="getWindowsConfig.width"
          :height="getWindowsConfig.height"
          @close="infoWindowClose"
      >
        <div v-if="isHover" v-html="text" class="tooltip-info"></div>
        <iframe
            v-if="!isHover"
            width="100%"
            height="100%"
            :src="getWindowsConfig.url"
            frameborder="0"
        ></iframe>
      </bm-info-window>
    </baidu-map>
    <!-- 热力图 -->
    <baidu-map
        class="map singleTextContent"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="scrollWheelZoom"
        @ready="handler"
        @zoomstart="zoomstart"
        @zoomend="zoomend"
        v-if="config.stylesObj.displayType === 2"
    >
      <bml-heatmap
          :data="renderHotPoints"
          :max="config.stylesObj.pointSize"
          :radius="config.stylesObj.dotBlurSize"
          :gradient="getGradient"
      >
      </bml-heatmap>
    </baidu-map>

    <!-- 自定义图 -->
    <baidu-map
        class="map singleTextContent"
        :center="center"
        :zoom="zoom"
        :scroll-wheel-zoom="scrollWheelZoom"
        @ready="handler"
        @zoomstart="zoomstart"
        @zoomend="zoomend"
        v-if="config.stylesObj.displayType === 3"
    >
      <bm-marker
          :key="i"
          @mouseover="mouseover($event, i, item)"
          @mouseout="mouseout($event, i, item)"
          v-for="(item, i) in points"
          :icon="getIcon(item)"
          @click="click($event, item)"
          :position="{lng: item.value[0], lat: item.value[1]}"/>
      <bm-info-window
          :position="{lng: pointInfo.value[0], lat: pointInfo.value[1]}"
          :show="isShow"
          :width="getWindowsConfig.width"
          :height="getWindowsConfig.height"
      >
        <div v-if="isHover" v-html="text" class="tooltip-info"></div>
        <iframe
            v-if="!isHover"
            width="100%"
            height="100%"
            :src="getWindowsConfig.url"
            frameborder="0"
        ></iframe>
      </bm-info-window>
    </baidu-map>
  </div>
</template>

<script>
import { BmlHeatmap } from 'vue-baidu-map';
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import { hexify } from '@/utils/common';
import {screenConfig} from '@/constants/global';
import {getInfoById} from '@/services/design';
import baseUrl from '@/assets/triangle.svg';
import {decrypt} from '@/utils/secret';

const lyxz = require('@/assets/mapStylesManage/1.json');
const ydfg = require('@/assets/mapStylesManage/2.json');
const wl = require('@/assets/mapStylesManage/3.json');
const cx = require('@/assets/mapStylesManage/4.json');
const stylesObjs = {
  1: lyxz,
  2: ydfg,
  3: wl,
  4: cx
};
const defaultGradient = { 0.1: 'rgb(0, 110, 255)', 0.5: 'rgba(15, 255, 31, 0.4)', 1: 'rgba(225, 175, 0, .6)'};

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
    }
  },
  data() {
    return {
      client: null,
      center_lng: 0,
      center_lat: 0,
      center: {}, // 中心点
      zoom: 12, // 层级
      scrollWheelZoom: false, // 是否启用滚动
      BMap: null, // 覆盖物实例
      map: null, // 地图实例
      timer: null,
      points: [], // 数据列表
      index: -1,
      isShow: false,
      pointInfo: {value: {}}, // 点对象
      interactionType: null, // 交互类型
      windowsWidth: 0, // 弹框宽度
      windowsHeight: 0 // 弹框高度
    };
  },

  components: {
    BmlHeatmap
  },

  computed: {
    getWindowsConfig() { // 获取弹框配置
      const obj = {
        width: 0,
        height: 0
      }
      if (!this.interactionType) {
        return obj;
      }
      const { stylesObj: {
        showInfoType,
        overBulletWidth,
        overBulletHeight,
        clickBulletWidth,
        clickBulletHeight,
        overBulletUrl,
        clickBulletUrl
      } } = this.config;
      if (this.interactionType === 'move' && showInfoType === 3) {
        const newUrl = overBulletUrl.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
          return this.pointInfo[o];
        }).replaceAll('{', '').replaceAll('}', '');
        return {
          width: overBulletWidth,
          height: overBulletHeight,
          url: newUrl
        }
      }
      if (this.interactionType === 'move' && this.isHover) {
        return obj
      }
      if (this.interactionType === 'click') {
        const newUrl = clickBulletUrl.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
          return this.pointInfo[o];
        }).replaceAll('{', '').replaceAll('}', '');
        return {
          width: clickBulletWidth,
          height: clickBulletHeight,
          url: newUrl
        }
      }

      return {width: 0, height: 0};
    },
    isHover() { // 判断是否悬浮框
      const {enableTooltip, stylesObj: {
        showInfoType
      } } = this.config;
      if (enableTooltip && ['move', null].includes(this.interactionType) && [1,2].includes(showInfoType)) {
        return true;
      }
      if (enableTooltip && ['move', null].includes(this.interactionType) && showInfoType === 3) {
        return false;
      }

      return false;
    },
    renderHotPoints() { // 处理热力图数据
      return this.points.map((item) => {
        const { value } = item
        return {
          lng: value[0],
          lat: value[1],
          count: value[2]
        }
      })
    },
    getLabelStyles(){
      return function (i, item) { // 散点图样式
        const { stylesObj: { dataMappingField, scatterConfig = [], scatterBorder } } = this.config;
        const fieldValue = item[dataMappingField];
        const currentConfig = scatterConfig.find((config) => +config.fieldValue === +fieldValue );
        const baseStyles = {
          display: 'block',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          borderWidth: `${scatterBorder}px`,
          borderStyle: 'solid',
          cursor: 'pointer'
        };
        if (!currentConfig) {
          if (i === this.index) {
            return {
              ...baseStyles,
              background: 'yellow'
            }
          }
          return {
            ...baseStyles,
            background: 'red'
          }
        }
        const { scatterSize, scatterHighlightSize, scatterColor, scatterHighlightColor, scatterBorderHighlight, scatterBorderColor } = currentConfig;
        if (i === this.index) {
          return {
            ...baseStyles,
            width: `${scatterHighlightSize}px`,
            height: `${scatterHighlightSize}px`,
            background: scatterHighlightColor,
            borderColor: scatterBorderHighlight
          }
        }
        return {
          ...baseStyles,
          width: `${scatterSize}px`,
          height: `${scatterSize}px`,
          background: scatterColor,
          borderColor: scatterBorderColor
        }
      }
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getCenterPoint() { // 中心点
      const { stylesObj: { mapCenterPoint = '116.404, 39.915' }} = this.config;
      const arr = mapCenterPoint.split(',');
      return {lng: +arr[0], lat: +arr[1]}
    },
    getZoom() { // 层级
      const { stylesObj: { initLevel, enableScrollWheelZoom }} = this.config;
      return {
        initLevel,
        enableScrollWheelZoom
      };
    },
    getMapStyle() { // 地图风格
      return function () {
        const { stylesObj} = this.config;
        const {
          typeConfig,
          mapStyleType,
          // 自定义颜色配置
          landColor, // 陆地颜色
          waterColor, // 水系颜色
          // eslint-disable-next-line no-unused-vars
          vegetationColor, // 植被颜色
          // eslint-disable-next-line no-unused-vars
          buildingColor, // 建筑物颜色
          enableWaterName, // 是否启用水系名称
          waterNameColor, // 水系名称颜色
          waterNameFontSize, // 水系名称字体大小
          // eslint-disable-next-line no-unused-vars
          enableRoadName, // 是否启用道路名称
          roadColor,
          // eslint-disable-next-line no-unused-vars
          roadNameColor, // 道路名称颜色
          // eslint-disable-next-line no-unused-vars
          roadNameFontSize, // 道路名称字体大小
          // eslint-disable-next-line no-unused-vars
          enableRailwayName, // 是否启用铁路名称
          // eslint-disable-next-line no-unused-vars
          // railwayNameColor, // 铁路名称颜色
          // // eslint-disable-next-line no-unused-vars
          // railwayNameFontSize, // 铁路名称字体大小
          // eslint-disable-next-line no-unused-vars
          enableAdminName, // 是否启用行政名称
          // eslint-disable-next-line no-unused-vars
          adminNameColor, // 行政名称颜色
          // eslint-disable-next-line no-unused-vars
          adminNameFontSize // 行政名称字体大小
        } = stylesObj;
        if (typeConfig === 1) {
          return {
            styleJson: []
          };
        }
        if (typeConfig === 2) {
          return {
            styleJson: stylesObjs[mapStyleType]
          };
        }
        if (typeConfig === 3) {
          return {
            styleJson: [
              {
                'featureType': 'background',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'on'
                }
              },
              {
                'featureType': 'land',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(landColor)}ff`
                }
              },
              {
                'featureType': 'water',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(waterColor)}ff` ,
                  'opacity': 'ff'
                }
              },
              {
                'featureType': 'water',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableWaterName
                }
              },
              {
                'featureType': 'water',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(waterNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'water',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': waterNameFontSize
                }
              },
              {
                'featureType': 'water',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'opacity': '00',
                  'weight': 0,
                  'color': waterNameColor
                }
              },
              {
                'featureType': 'green',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(vegetationColor)}ff`
                }
              },
              // 建筑物
              {
                'featureType': 'building',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'on'
                }
              },
              {
                'featureType': 'building',
                'elementType': 'geometry.topfill',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`,
                  'opacity': '00'
                }
              },
              {
                'featureType': 'building',
                'elementType': 'geometry.stroke',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'building',
                'elementType': 'geometry.sidefill',
                'stylers': {
                  'opacity': '00'
                }
              },
              {
                'featureType': 'manmade',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'subwaystation',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'education',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'medical',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'scenicspots',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'entertainment',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'estate',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'shopping',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'transportation',
                'elementType': 'geometry',
                'stylers': {
                  'color': `${hexify(buildingColor)}ff`
                }
              },
              {
                'featureType': 'parkinglot',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'off'
                }
              },
              {
                'featureType': 'playground',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': 'off'
                }
              },
              {
                'featureType': 'road',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'road',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'road',
                'elementType': 'geometry.fill',
                'stylers': {
                  'color': `${hexify(roadColor)}ff`
                }
              },
              {
                'featureType': 'road',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(roadNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'road',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': roadNameFontSize
                }
              },
              {
                'featureType': 'highwaysign',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'highwaysign',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'nationalwaysign',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'nationalwaysign',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'provincialwaysign',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'provincialwaysign',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'tertiarywaysign',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'tertiarywaysign',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'subwaylabel',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'subwaylabel',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'roadarrow',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'footbridge',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'crosswalk',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'parkingspace',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'laneline',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableRoadName
                }
              },
              {
                'featureType': 'railway',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableRailwayName
                }
              },
              {
                'featureType': 'districtlabel',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'districtlabel',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'city',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'district',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'continent',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'boundary',
                'elementType': 'geometry',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'country',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'city',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'town',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'town',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'village',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'island',
                'elementType': 'labels',
                'stylers': {
                  'visibility': enableAdminName
                }
              },
              {
                'featureType': 'districtlabel',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'districtlabel',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'continent',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'continent',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'country',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'country',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'city',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'city',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'district',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'district',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'town',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'town',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'village',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'village',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'island',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': `${hexify(adminNameColor)}ff`,
                  'weight': 10
                }
              },
              {
                'featureType': 'island',
                'elementType': 'labels.text.stroke',
                'stylers': {
                  'visibility': 'on',
                  'color': `${hexify(adminNameColor)}ff`,
                  'opacity': '00',
                  'weight': 0
                }
              },
              {
                'featureType': 'districtlabel',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'continent',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'country',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'city',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'district',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'town',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'village',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'island',
                'elementType': 'labels.text',
                'stylers': {
                  'fontsize': adminNameFontSize
                }
              },
              {
                'featureType': 'poilabel',
                'elementType': 'labels',
                'stylers': {
                  'visibility': 'off'
                }
              },
              {
                'featureType': 'poilabel',
                'elementType': 'labels.icon',
                'stylers': {
                  'visibility': 'off'
                }
              }
            ]
          }
        }
        return {};
      }
    },
    getGradient() { // 热力图颜色
      const { stylesObj: { hotDataColor = [] } } = this.config;
      const n = hotDataColor.length;
      if (n) {
        const obj = {};
        const p = (1 / n).toFixed(1);
        for (let i = 0; i < n; i++ ){
          if (i === 0) {
            obj[0.1] = hotDataColor[0].c1;
          } else if (i === n - 1) {
            obj[1] = hotDataColor[i].c1;
          } else {
            obj[(p * i).toFixed(2)] = hotDataColor[i].c1;
          }
        }
        return obj;
      }
      return defaultGradient
    },
    getIcon() { //  渲染自定义图标
      return function (params) {
        const { stylesObj: { customDataMappingField, customDisplay = [], imageWidth, imageHeight } } = this.config;
        const fieldValue = params[customDataMappingField];
        const currentConfig = customDisplay.find((config) => +config.fieldValue === +fieldValue ) || {};
        return {
          url: currentConfig.customUrl || baseUrl,
          size: {width: imageWidth, height: imageHeight}
        }
      }
    },
    text() { // 弹框内容
      const { stylesObj: { showInfoType, customTipInfo, infoConfig} } = this.config;
      if (showInfoType === 1 && customTipInfo) {
        return customTipInfo.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
          return this.pointInfo[o];
        }).replaceAll('{', '').replaceAll('}', '');
      }
      const n = infoConfig.length
      if (showInfoType === 2 && n) {
        let str = '';
        infoConfig.forEach((item, i) => {
          const br = i + 1 === n ? '' : '</br>';
          const { name, value } = item;
          if (name && value) {
            str += `${value}: ${this.pointInfo[name]}${br}`;
          }
        })
        return str;
      }
      return ''
    }
  },

  methods: {
    infoWindowClose() {
      if (this.interactionType === 'click') {
        this.isShow = false;
        this.pointInfo = {value: {}};
        this.interactionType = null;
      }
    },
    zoomstart({target}){
      this.center_lng = target.getCenter().lng;
      this.center_lat = target.getCenter().lat;
    },
    zoomend(){
      if (this.map && this.BMap) {
        this.map.centerAndZoom(
          new this.BMap.Point(this.center_lng, this.center_lat),
          this.map.getZoom()
        );
      }
    },
    mouseover({type, target, point, pixel}, i, pointObj) {
      this.index = i;
      this.pointInfo = pointObj;
      this.interactionType = 'move';
      this.checkIsShow()
    },
    checkIsShow() {
      const { enableTooltip } = this.config;
      // 第一种情况， 开启悬浮提示
      if (!enableTooltip) return;
      const { stylesObj: { showInfoType, customTipInfo, infoConfig, overBulletUrl} } = this.config;
      if (enableTooltip && showInfoType === 1 && !customTipInfo) {
        return;
      }
      if (enableTooltip && showInfoType === 2 && !infoConfig.length) {
        return;
      }
      if (enableTooltip && showInfoType === 3 && !overBulletUrl) {
        return;
      }
      // if (!enableTooltip && !enableMouseover) {
      //   return;
      // }
      this.isShow = true;
    },
    mouseout() {
      this.index = -1;
      if (this.interactionType === 'click') {
        return
      }
      this.isShow = false;
      this.pointInfo = {value: {}};
      this.interactionType = null;
    },
    click({type, target, point, pixel}, pointObj) {
      const { stylesObj: { enableMouseClick, interactionMode, url, enableOpenNewWindow } } = this.config;
      if (!enableMouseClick) {return;}
      if (interactionMode === 1) {return;}
      if (interactionMode === 3) { // 链接
        if (!url) {
          return;
        }
        // if (!IsURL(url)) {
        //   return;
        // }
        const newUrl = url.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
          return pointObj[o];
        }).replaceAll('{', '').replaceAll('}', '');
        if (enableOpenNewWindow) {
          window.open(newUrl, '_blank');
        } else {
          window.open(newUrl, '_self');
        }
      }
      if (interactionMode === 2) { // 弹框
        this.isShow = true;
        this.pointInfo = pointObj;
        this.interactionType = 'click';
      }
      if (interactionMode === 4) { // 联动
        this.triggerParamsUpdate(pointObj);
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
    handler({ BMap, map }) { //  地图加载完成
      this.BMap = BMap;
      this.map = map;
      this.center = this.getCenterPoint;
      this.zoom = this.getZoom.initLevel;
      this.scrollWheelZoom = this.getZoom.enableScrollWheelZoom;
      map.setMapStyleV2(this.getMapStyle());
      this.renderMap();
    },
    async renderMap() {
      const { dataConfig, dataType } = this.config;
      if (dataType === 1) {
        const { staticValue = '[]' } = dataConfig;
        const list = JSON.parse(staticValue);
        this.points = list;
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
      if (!(mqttSourceId && sourceU && sourceP && topic)) {
        return;
      }
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
        this.points = data;
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.points = result;
        return;
      }
      this.points = data;
    },
    publishMessage(message = '') {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.publish(`${topic}/publish`, message, {qos: 2});
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
        ...query
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
          this.points = list;
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(list);
          if (!(Array.isArray(result) && result.length)) {
            this.points = [];
            return
          }
          this.points = result;
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
          this.points = [];
          return
        }
        this.points = result;
        return;
      }
      this.points = res;
    }
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
    }
    this.timer && clearTimeout(this.timer);
    if (this.client) {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.unsubscribe(`${topic}/response`);
      this.client.end();
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
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
</style>
