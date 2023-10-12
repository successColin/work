/** * @name: index * @author: DELL * @date: 2021/8/21 14:51 *
@description：index * @update: 2021/8/21 14:51 */
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
      ak="nuWah68S1WieW2AEwiT8T3Ro"
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
        :position="{ lng: item.value[0], lat: item.value[1] }"
        :labelStyle="getLabelStyles(i, item)"
        @mouseover="mouseover($event, i, item)"
        @mouseout="mouseout($event, i, item)"
        @click="click($event, item)"
      />
      <bm-info-window
        :position="{ lng: pointInfo.value[0], lat: pointInfo.value[1] }"
        :show="isShow"
        :width="getWindowsConfig.width"
        :height="getWindowsConfig.height"
        @close="infoWindowClose"
      >
        <div v-if="isHover" v-html="text" class="tooltip-info"></div>
      </bm-info-window>
    </baidu-map>
    <!-- 热力图 -->
    <baidu-map
      class="map singleTextContent"
      :center="center"
      :zoom="zoom"
      ak="nuWah68S1WieW2AEwiT8T3Ro"
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
      ak="nuWah68S1WieW2AEwiT8T3Ro"
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
        :position="{ lng: item.value[0], lat: item.value[1] }"
      />
      <bm-info-window
        :position="{ lng: pointInfo.value[0], lat: pointInfo.value[1] }"
        :show="isShow"
        :width="getWindowsConfig.width"
        :height="getWindowsConfig.height"
      >
        <div v-if="isHover" v-html="text" class="tooltip-info"></div>
      </bm-info-window>
    </baidu-map>
    <component
      :is="panelConfig.activeObj.dialogName || 'PanelDialog'"
      :showPanel="visible"
      :visible.sync="visible"
      :panelObj="panelObj"
      v-if="JSON.stringify(panelConfig) !== '{}'"
    ></component>
  </div>
</template>

<script>
// import { BmlHeatmap } from 'vue-baidu-map';
import baseUrl from '@/assets/img/triangle.svg';
import { getInfoById } from '@/api/design';
import {
  checkAndGetOtherParams,
  getRequestParams,
  hexify,
} from '@/views/HomeMenuConfig/constants/common';
import { cloneDeep } from 'lodash';
import { formatDate, Decrypt, Encrypt, isJiami } from '_u/utils';

const FormulaParser = require('hot-formula-parser').Parser;

const parser = new FormulaParser();
// eslint-disable-next-line no-undef
const { BmlHeatmap, BmInfoWindow, BmLabel, BaiduMap } = VueBaiduMap;
let FIXED_OBJ = {}; // 保存
const lyxz = require('@/assets/mapStylesManage/1.json');
const ydfg = require('@/assets/mapStylesManage/2.json');
const wl = require('@/assets/mapStylesManage/3.json');
const cx = require('@/assets/mapStylesManage/4.json');

const stylesObjs = {
  1: lyxz,
  2: ydfg,
  3: wl,
  4: cx,
};
const defaultGradient = {
  0.1: 'rgb(0, 110, 255)',
  0.5: 'rgba(15, 255, 31, 0.4)',
  1: 'rgba(225, 175, 0, .6)',
};

export default {
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    scale: {
      type: Number,
      default: 1,
    },
    activeComponent: {
      type: Object,
      default: () => {},
    },
    updateState: {
      // 用于修改父组件data值
      type: Function,
      default: () => {},
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      visible: false,
      panelConfig: {},
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
      pointInfo: { value: {} }, // 点对象
      interactionType: null, // 交互类型
      windowsWidth: 0, // 弹框宽度
      windowsHeight: 0, // 弹框高度
    };
  },

  components: {
    BmlHeatmap,
    BmInfoWindow,
    BmLabel,
    BaiduMap,
  },

  computed: {
    panelObj() {
      const { activeObj, curPaneObj } = this.panelConfig;
      return {
        ...curPaneObj,
        ...activeObj,
        panelVarObj: {},
        panelName: activeObj.dialogTitle,
      };
    },
    getWindowsConfig() {
      // 获取弹框配置
      const obj = {
        width: 0,
        height: 0,
      };
      if (!this.interactionType) {
        return obj;
      }
      const {
        stylesObj: {
          showInfoType,
          overBulletWidth,
          overBulletHeight,
          clickBulletWidth,
          clickBulletHeight,
          overBulletUrl,
          clickBulletUrl,
        },
      } = this.config;
      if (this.interactionType === 'move' && showInfoType === 3) {
        const newUrl = overBulletUrl
          .replace(/(?<=\{)(.+?)(?=\})/g, (o) => this.pointInfo[o])
          .replaceAll('{', '')
          .replaceAll('}', '');
        return {
          width: overBulletWidth,
          height: overBulletHeight,
          url: newUrl,
        };
      }
      if (this.interactionType === 'move' && this.isHover) {
        return obj;
      }
      if (this.interactionType === 'click') {
        const newUrl = clickBulletUrl
          .replace(/(?<=\{)(.+?)(?=\})/g, (o) => this.pointInfo[o])
          .replaceAll('{', '')
          .replaceAll('}', '');
        return {
          width: clickBulletWidth,
          height: clickBulletHeight,
          url: newUrl,
        };
      }

      return {
        width: 0,
        height: 0,
      };
    },
    isHover() {
      // 判断是否悬浮框
      const {
        enableTooltip,
        stylesObj: { showInfoType },
      } = this.config;
      if (
        enableTooltip &&
        ['move', null].includes(this.interactionType) &&
        [1, 2].includes(showInfoType)
      ) {
        return true;
      }
      if (
        enableTooltip &&
        ['move', null].includes(this.interactionType) &&
        showInfoType === 3
      ) {
        return false;
      }

      return false;
    },
    renderHotPoints() {
      // 处理热力图数据
      return this.points.map((item) => {
        const { value } = item;
        return {
          lng: value[0],
          lat: value[1],
          count: value[2],
        };
      });
    },
    getLabelStyles() {
      return function (i, item) {
        // 散点图样式
        const {
          stylesObj: { dataMappingField, scatterConfig = [], scatterBorder },
        } = this.config;
        const fieldValue = item[dataMappingField];
        const currentConfig = scatterConfig.find(
          (config) => +config.fieldValue === +fieldValue,
        );
        const baseStyles = {
          display: 'block',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          borderWidth: `${scatterBorder}px`,
          borderStyle: 'solid',
          cursor: 'pointer',
        };
        if (!currentConfig) {
          if (i === this.index) {
            return {
              ...baseStyles,
              background: 'yellow',
            };
          }
          return {
            ...baseStyles,
            background: 'red',
          };
        }
        const {
          scatterSize,
          scatterHighlightSize,
          scatterColor,
          scatterHighlightColor,
          scatterBorderHighlight,
          scatterBorderColor,
        } = currentConfig;
        if (i === this.index) {
          return {
            ...baseStyles,
            width: `${scatterHighlightSize}px`,
            height: `${scatterHighlightSize}px`,
            background: scatterHighlightColor,
            borderColor: scatterBorderHighlight,
          };
        }
        return {
          ...baseStyles,
          width: `${scatterSize}px`,
          height: `${scatterSize}px`,
          background: scatterColor,
          borderColor: scatterBorderColor,
        };
      };
    },
    getContentStyles() {
      const { width, height, top, left, stylesObj } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getCenterPoint() {
      // 中心点
      const {
        stylesObj: { mapCenterPoint = '116.404, 39.915' },
      } = this.config;
      const arr = mapCenterPoint.split(',');
      return {
        lng: +arr[0],
        lat: +arr[1],
      };
    },
    getZoom() {
      // 层级
      const {
        stylesObj: { initLevel, enableScrollWheelZoom },
      } = this.config;
      return {
        initLevel,
        enableScrollWheelZoom,
      };
    },
    getMapStyle() {
      // 地图风格
      return function () {
        const { stylesObj } = this.config;
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
          adminNameFontSize, // 行政名称字体大小
        } = stylesObj;
        if (typeConfig === 1) {
          return {
            styleJson: [],
          };
        }
        if (typeConfig === 2) {
          return {
            styleJson: stylesObjs[mapStyleType],
          };
        }
        if (typeConfig === 3) {
          return {
            styleJson: [
              {
                featureType: 'background',
                elementType: 'geometry',
                stylers: {
                  visibility: 'on',
                },
              },
              {
                featureType: 'land',
                elementType: 'geometry',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(landColor)}ff`,
                },
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(waterColor)}ff`,
                  opacity: 'ff',
                },
              },
              {
                featureType: 'water',
                elementType: 'labels',
                stylers: {
                  visibility: enableWaterName,
                },
              },
              {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(waterNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'water',
                elementType: 'labels.text',
                stylers: {
                  fontsize: waterNameFontSize,
                },
              },
              {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  opacity: '00',
                  weight: 0,
                  color: waterNameColor,
                },
              },
              {
                featureType: 'green',
                elementType: 'geometry',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(vegetationColor)}ff`,
                },
              },
              // 建筑物
              {
                featureType: 'building',
                elementType: 'geometry',
                stylers: {
                  visibility: 'on',
                },
              },
              {
                featureType: 'building',
                elementType: 'geometry.topfill',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                  opacity: '00',
                },
              },
              {
                featureType: 'building',
                elementType: 'geometry.stroke',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'building',
                elementType: 'geometry.sidefill',
                stylers: {
                  opacity: '00',
                },
              },
              {
                featureType: 'manmade',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'subwaystation',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'education',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'medical',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'scenicspots',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'entertainment',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'estate',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'shopping',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'transportation',
                elementType: 'geometry',
                stylers: {
                  color: `${hexify(buildingColor)}ff`,
                },
              },
              {
                featureType: 'parkinglot',
                elementType: 'geometry',
                stylers: {
                  visibility: 'off',
                },
              },
              {
                featureType: 'playground',
                elementType: 'geometry',
                stylers: {
                  visibility: 'off',
                },
              },
              {
                featureType: 'road',
                elementType: 'geometry',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'road',
                elementType: 'labels',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: {
                  color: `${hexify(roadColor)}ff`,
                },
              },
              {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(roadNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'road',
                elementType: 'labels.text',
                stylers: {
                  fontsize: roadNameFontSize,
                },
              },
              {
                featureType: 'highwaysign',
                elementType: 'labels',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'highwaysign',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'nationalwaysign',
                elementType: 'labels',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'nationalwaysign',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'provincialwaysign',
                elementType: 'labels',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'provincialwaysign',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'tertiarywaysign',
                elementType: 'labels',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'tertiarywaysign',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'subwaylabel',
                elementType: 'labels',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'subwaylabel',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'roadarrow',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'footbridge',
                elementType: 'geometry',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'crosswalk',
                elementType: 'geometry',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'parkingspace',
                elementType: 'geometry',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'laneline',
                elementType: 'geometry',
                stylers: {
                  visibility: enableRoadName,
                },
              },
              {
                featureType: 'railway',
                elementType: 'geometry',
                stylers: {
                  visibility: enableRailwayName,
                },
              },
              {
                featureType: 'districtlabel',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'districtlabel',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'city',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'district',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'continent',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'boundary',
                elementType: 'geometry',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'country',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'city',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'town',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'town',
                elementType: 'labels.icon',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'village',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'island',
                elementType: 'labels',
                stylers: {
                  visibility: enableAdminName,
                },
              },
              {
                featureType: 'districtlabel',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'districtlabel',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'continent',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'continent',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'country',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'country',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'city',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'city',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'district',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'district',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'town',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'town',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'village',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'village',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'island',
                elementType: 'labels.text.fill',
                stylers: {
                  color: `${hexify(adminNameColor)}ff`,
                  weight: 10,
                },
              },
              {
                featureType: 'island',
                elementType: 'labels.text.stroke',
                stylers: {
                  visibility: 'on',
                  color: `${hexify(adminNameColor)}ff`,
                  opacity: '00',
                  weight: 0,
                },
              },
              {
                featureType: 'districtlabel',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'continent',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'country',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'city',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'district',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'town',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'village',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'island',
                elementType: 'labels.text',
                stylers: {
                  fontsize: adminNameFontSize,
                },
              },
              {
                featureType: 'poilabel',
                elementType: 'labels',
                stylers: {
                  visibility: 'off',
                },
              },
              {
                featureType: 'poilabel',
                elementType: 'labels.icon',
                stylers: {
                  visibility: 'off',
                },
              },
            ],
          };
        }
        return {};
      };
    },
    getGradient() {
      // 热力图颜色
      const {
        stylesObj: { hotDataColor = [] },
      } = this.config;
      const n = hotDataColor.length;
      if (n) {
        const obj = {};
        const p = (1 / n).toFixed(1);
        for (let i = 0; i < n; i += 1) {
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
      return defaultGradient;
    },
    getIcon() {
      //  渲染自定义图标
      return function (params) {
        const {
          stylesObj: {
            customDataMappingField,
            customDisplay = [],
            imageWidth,
            imageHeight,
          },
        } = this.config;
        const fieldValue = params[customDataMappingField];
        // eslint-disable-next-line max-len
        const currentConfig =
          customDisplay.find((config) => +config.fieldValue === +fieldValue) ||
          {};
        return {
          url: currentConfig.customUrl || baseUrl,
          size: {
            width: imageWidth,
            height: imageHeight,
          },
        };
      };
    },
    text() {
      // 弹框内容
      const {
        stylesObj: { showInfoType, customTipInfo, infoConfig },
      } = this.config;
      if (showInfoType === 1 && customTipInfo) {
        return customTipInfo
          .replace(/(?<=\{)(.+?)(?=\})/g, (o) => this.pointInfo[o])
          .replaceAll('{', '')
          .replaceAll('}', '');
      }
      const n = infoConfig.length;
      if (showInfoType === 2 && n) {
        let str = '';
        infoConfig.forEach((item, i) => {
          const br = i + 1 === n ? '' : '</br>';
          const { name, value } = item;
          if (name && value) {
            str += `${value}: ${this.pointInfo[name]}${br}`;
          }
        });
        return str;
      }
      return '';
    },
  },
  mounted() {
    this.initFunc();
  },
  watch: {
    filterParameter: {
      deep: true,
      immediate: false,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          if (isShow) {
            this.checkFilterParameter(true);
          }
        }
      },
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          // eslint-disable-next-line max-len
          const lastOtherParams = checkAndGetOtherParams({
            config: this.config,
            otherParams: this.otherParams,
          });
          if (isShow && JSON.stringify(lastOtherParams) !== '{}') {
            this.renderMap();
          }
        }
      },
    },
  },
  methods: {
    checkFilterParameter(flag) {
      const paramsObj = {};
      const { componentId } = this.config;
      Object.keys(this.filterParameter).forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.split('_')[1];
          paramsObj[key] = this.filterParameter[item];
        }
      });
      this.params = paramsObj;
      this.$nextTick(() => {
        if (flag && JSON.stringify(paramsObj) === '{}') {
          return;
        }
        this.renderMap();
      });
    },
    initFunc() {
      parser.setFunction('GET_VAR', (params) => {
        if (params.length === 0) {
          return '';
        }
        return params[0];
      });
      parser.setFunction('GET_USER_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户公式无参数');
        }
        return this.$store.state.userCenter.userInfo.id;
      });
      parser.setFunction('GET_ORG_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.orgId;
      });
      parser.setFunction('GET_ROLES_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.roleIds;
      });
      parser.setFunction('GET_DATE', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return formatDate(new Date(), 'yyyy-MM-dd');
      });
      parser.setFunction('GET_DATETIME', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      });
      parser.setFunction('GET_YEAR', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getFullYear();
      });
      parser.setFunction('GET_MONTH', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getMonth();
      });
      parser.setFunction('GET_WEEK', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDay();
      });
      parser.setFunction('GET_DAY', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDate();
      });
      parser.setFunction('GET_TIMESTAMP', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getTime();
      });
      parser.setFunction('GET_MENU_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取菜单id公式无参数');
        }
        return this.$route.query.id;
      });
      parser.setFunction('GET_FIELD_VALUE', (params) => {
        if (!params.length) {
          return new Error('获取控件字段值公式无参数');
        }
        const field = params[0];
        console.log(FIXED_OBJ, field);
        return FIXED_OBJ[field];
      });
    },
    infoWindowClose() {
      if (this.interactionType === 'click') {
        this.isShow = false;
        this.pointInfo = { value: {} };
        this.interactionType = null;
      }
    },
    zoomstart({ target }) {
      this.center_lng = target.getCenter().lng;
      this.center_lat = target.getCenter().lat;
    },
    zoomend() {
      if (this.map && this.BMap) {
        this.map.centerAndZoom(
          new this.BMap.Point(this.center_lng, this.center_lat),
          this.map.getZoom(),
        );
      }
    },
    mouseover(obj, i, pointObj) {
      this.index = i;
      this.pointInfo = pointObj;
      this.interactionType = 'move';
      this.checkIsShow();
    },
    checkIsShow() {
      const { enableTooltip } = this.config;
      // 第一种情况， 开启悬浮提示
      if (!enableTooltip) return;
      const {
        stylesObj: { showInfoType, customTipInfo, infoConfig, overBulletUrl },
      } = this.config;
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
        return;
      }
      this.isShow = false;
      this.pointInfo = { value: {} };
      this.interactionType = null;
    },
    click(obj, pointObj) {
      const {
        // eslint-disable-next-line no-unused-vars
        panelConfig,
        skipMenuConfig = [],
        stylesObj: { enableMouseClick, interactionMode },
      } = this.config;
      console.log(interactionMode, 'interactionMode', pointObj);
      if (!enableMouseClick) {
        return;
      }
      if (interactionMode === 1) {
        return;
      }
      FIXED_OBJ = pointObj;
      if (interactionMode === 3 && skipMenuConfig.length) {
        // 菜单
        const cloneConfig = cloneDeep(skipMenuConfig);
        this.doSkipMenu(cloneConfig);
        return;
      }
      if (interactionMode === 2) {
        // 弹框
        const lastPaneConfig = cloneDeep(panelConfig);
        console.log(lastPaneConfig, this.config);
        this.doSpringPanel(lastPaneConfig);
        return;
      }
      if (interactionMode === 4) {
        // 联动
        this.triggerParamsUpdate(pointObj);
      }
    },
    doSpringPanel(panelConfig = {}) {
      const {
        curPaneObj,
        activeObj: { dialogTitle },
      } = panelConfig;
      if (curPaneObj && curPaneObj.id) {
        console.log(FIXED_OBJ, 1);
        curPaneObj.panelFilter.forEach((item, index) => {
          // 将公式值处理成固定值
          const { filterTermStr, filterTermType } = item;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr
              ? JSON.stringify(newFilterTermStr)
              : '';
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const filterTermSql = isJiami(item.filterTermSql)
                ? Decrypt(item.filterTermSql)
                : item.filterTermSql;
            const str = this.reduceSqlFilter(filterTermSql);
            curPaneObj.panelFilter[index].filterTermSql = Encrypt(str);
          }
        });
        const { panelData } = curPaneObj;
        const panelFixData = {};
        if (panelData && panelData.length) {
          console.log(FIXED_OBJ, 2);
          panelData.forEach((item) => {
            const {
              field,
              paneComp: { compId },
            } = item;
            panelFixData[compId] = FIXED_OBJ[field] || field;
          });
        }
        curPaneObj.panelFixData = panelFixData;
        const { name, query = {} } = this.$route;
        if (name === 'appCustomPage') {
          const { CSMUuid, CSMIsWebview } = query;
          curPaneObj.operationType = 'pane';
          curPaneObj.CSMUuid = CSMUuid;
          curPaneObj.dialogTitle = dialogTitle || '';
          if (CSMIsWebview === '1') {
            // eslint-disable-next-line no-undef
            uni.postMessage({ data: curPaneObj });
          }
          if (CSMIsWebview === '2') {
            window.parent.postMessage(curPaneObj, '*');
          }
          return;
        }
        this.panelConfig = panelConfig;
        console.log(1123, panelConfig);
        this.$nextTick(() => {
          this.visible = true;
        });
      }
    },
    doSkipMenu(skipMenuConfig) {
      // 跳菜单
      const menuConfig = skipMenuConfig.find((item) => {
        console.log(item.jumpTerm, 'item.jumpTerm');
        if (!item.jumpTerm) {
          // 如果没有条件，默认跳
          return true;
        }
        const isFlag = this.formulaConversion(item.jumpTerm);
        return isFlag;
      });
      const commonReduce = (config) => {
        config.menuVarObj = {};
        config.menuFilter.forEach((item, index) => {
          // 将公式值处理成固定值
          const { filterTermStr, filterTermType } = item;
          const filterTermSql = isJiami(item.filterTermSql)
            ? Decrypt(item.filterTermSql)
            : item.filterTermSql;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            config.menuFilter[index].filterTermStr =
              JSON.stringify(newFilterTermStr);
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const str = this.reduceSqlFilter(filterTermSql);
            console.log(str);
            config.menuFilter[index].filterTermSql = Encrypt(str);
          }
        });
        return config;
      };
      const { name, query = {} } = this.$route;
      if (name === 'appCustomPage' && menuConfig) {
        const { CSMUuid, CSMIsWebview } = query;
        const newMenuConfig = commonReduce(menuConfig);
        newMenuConfig.operationType = 'menu';
        newMenuConfig.CSMUuid = CSMUuid;
        if (CSMIsWebview === '1') {
          // eslint-disable-next-line no-undef
          uni.postMessage({ data: newMenuConfig });
        }
        if (CSMIsWebview === '2') {
          window.parent.postMessage(newMenuConfig, '*');
        }
        return;
      }
      console.log(menuConfig, 'menuConfig');
      if (menuConfig) {
        // 获取目标菜单
        const menu = this.$store.getters.getCurMenu(menuConfig.id);
        console.log(menu);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          const newMenuConfig = commonReduce(menuConfig);
          const menuObj = {};
          menuObj[menuConfig.id] = newMenuConfig;
          const { jumpMenuObj = '{}' } = sessionStorage;
          const newJumpMenuObj = JSON.parse(jumpMenuObj);
          newJumpMenuObj[menuConfig.id] = newMenuConfig;
          sessionStorage.jumpMenuObj = JSON.stringify(newJumpMenuObj);
          this.$bus.$emit('changeMenuTab', curMenu);
          // this.$nextTick(() => {
          //   this.$bus.$emit('refresh');
          // });
          setTimeout(() => {
            this.$bus.$emit('refresh');
          }, 100);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限',
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单',
        });
      }
    },
    // 处理公式
    formulaConversion(formulaStr) {
      let str = this.regProcess(formulaStr);
      console.log(str);
      let res = parser.parse(`${str}`);
      if (res.error) {
        str = str.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      console.log(res);
      // 最终错误把字符串返回
      if (res.error) {
        return false;
      }
      return res.result;
    },
    regProcess(str = '') {
      // 将公式中的特殊字符去除
      if (!str) return '';
      let formulaRes = str
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
      const newStr = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`,
      );
      console.log(newStr, 'newStr');
      return newStr;
    },
    reduceNormalFilter(filterTermStr) {
      if (!filterTermStr) return {};
      // 处理普通的过滤条件
      const newFilterTermStr = JSON.parse(filterTermStr);
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            const result = this.formulaConversion(content);
            term.valueType = 1;
            term.content = result;
          }
        });
      });
      return newFilterTermStr;
    },
    reduceSqlFilter(filterTermSql) {
      // 处理sql过滤条件
      let str = this.regProcess(filterTermSql);
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取当前用户
      str = str.replace(/GET_USER_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取用户组织
      str = str.replace(/GET_ORG_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取用户角色
      str = str.replace(/GET_ROLES_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取日期
      str = str.replace(/GET_DATE\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取日期时间
      str = str.replace(/GET_DATETIME\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取年份
      str = str.replace(/GET_YEAR\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取月份
      str = str.replace(/GET_MONTH\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取星期
      str = str.replace(/GET_WEEK\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取天
      str = str.replace(/GET_DAY\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取时间撮
      str = str.replace(/GET_TIMESTAMP\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    },
    triggerParamsUpdate(pointObj) {
      const {
        stylesObj: { paramsFieldsConfig, updateChart = [] },
      } = this.config;
      if (!updateChart.length || !paramsFieldsConfig.length) {
        return;
      }
      const params = {};
      updateChart.forEach((key) => {
        paramsFieldsConfig.forEach((field) => {
          const { name, value } = field;
          params[`${key}_${name}`] = pointObj[value] || value;
        });
      });
      const newParams = {
        ...this.otherParams,
        ...params,
      };
      this.updateState('filterParameter', newParams);
    },
    handler({ BMap, map }) {
      //  地图加载完成
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
      if (dataType === 3) {
        await this.getSQL();
      }
    },
    getParameters() {
      const { id, componentId } = this.config;
      const reduce = (
        obj, // 将Object 处理成 Array
      ) =>
        Object.keys(obj).map((item) => ({
          name: item,
          value: obj[item],
        }));
      const { query } = this.$route;
      const satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        });
      }
      const currentParams = {
        ...satisfyParams,
        ...query,
      };
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr),
      };
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1,
      } = SqlDataConfig;
      const { query = {}, name } = this.$route;
      const params = getRequestParams({
        config: this.config,
        routeQuery: name !== 'appCustomPage' ? {} : query,
        otherParams: this.otherParams,
        elseParams: this.params || {},
      });
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.points = [];
          return;
        }
        this.points = result;
        return;
      }
      this.points = res;
    },
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
      this.observer = null;
    }
    const dom = document.querySelector(`#basicPie_${this.config.componentId}`);
    if (dom) {
      dom.removeEventListener('contextmenu', this.show);
    }
    // eslint-disable-next-line no-unused-expressions
    this.timer && clearTimeout(this.timer);
  },
  name: 'SingleLineText',
};
</script>

<style lang="scss" scoped>
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

  ::v-deep {
    .tooltip-info {
      color: #ffffff;
      font-size: 12px;
      line-height: 18px;
    }

    .anchorBL {
      display: none;
    }

    .BMap_bubble_content {
      width: 100% !important;
      height: 100% !important;

      & > div {
        width: 100%;
        height: 100%;
      }
    }

    .BMap_pop > div:nth-child(1) > div,
    .BMap_pop > div:nth-child(3) > div,
    .BMap_pop > div:nth-child(5) > div,
    .BMap_pop > div:nth-child(7) > div {
      border: none !important;
      background: rgba(0, 0, 0, 0.3) !important;
    }

    .BMap_pop .BMap_top,
    .BMap_pop .BMap_center,
    .BMap_bottom {
      border: none !important;
      background: rgba(0, 0, 0, 0.3) !important;
    }

    .BMap_pop > img {
      display: none;
    }

    .BMap_pop > div:nth-child(8) > img {
      display: none;
    }

    .BMap_shadow {
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
