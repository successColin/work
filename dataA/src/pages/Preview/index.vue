/**
* @name: index
* @author: DELL
* @date: 2021/8/20 15:28
* @description：index
* @update: 2021/8/20 15:28
*/
<!-- 页面 -->
<template>
  <div class="content">
    <div class="contentWrap"
         :class="{ equalWidthRatio: bgConfig.showType === 2, design:  bgConfig.showType === 4}"
         :style="getBGStyle"
    >
      <div class="previewWrap"
           :style="getStylesBgUrl()"
      >
        <div class="contentBox">
          <component
              :designType="designType"
              :scale="transitionScale"
              :config="configItem"
              :is="configItem.componentName"
              v-for="(configItem) in filterList"
              :key="configItem.componentId"
              :transitionScaleY="transitionScaleY"
              :transitionScaleX="transitionScaleX"
              :metaDataList=metaDataList
              :updateState="updateState"
              :otherParams="filterParameter"
          ></component>
        </div>
        <CScreenBullet
            :visible="visible"
            v-if="visible"
            :iframeUrl="singleConfig.url || ''"
            :width="singleConfig.bulletWidth"
            :height="singleConfig.bulletHeight"
        ></CScreenBullet>
      </div>
      <!--      <div class="contentBg" :style="getStylesBg()"></div>-->
    </div>
    <video class="contentVideo" style="width:100%; height:100%; object-fit: fill" muted loop autoplay
           :src="bgConfig.bgImage"></video>
    <Loading v-if="isShow"/>
    <ImageZoom
        v-if="imageFileVisible"
        :imageFileName="imageFileName"
        :imageFileUrl="imageFileUrl"
    ></ImageZoom>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import Bus from '@/utils/bus';
const TimeGanttChart = () => import('./Components/TimeGanttChart/index');
const BackgroundBox = () => import('./Components/BackgroundBox/index');
const SingleLineText = () => import('./Components/SingleLineText/index');
const ImageBox = () => import('./Components/ImageBox/index');
const Video = () => import('./Components/Video/index');
const BasicPieChart = () => import('./Components/BasicPieChart/index');
const BasicBarChart = () => import('./Components/BasicBarChart/index');
const BasicLineChart = () => import('./Components/BasicLineChart/index');
const GeneralTable = () => import('./Components/GeneralTable/index');
const TransverseBarChart = () => import('./Components/TransverseBarChart/index');
const CircleProgressBar = () => import('./Components/CircleProgressBar/index');
const ColumnLineMix = () => import('./Components/ColumnLineMix/index');
const HorizontalProgressBar = () => import('./Components/HorizontalProgressBar/index');
const Dashboard = () => import('./Components/Dashboard/index');
const AuxiliaryLine = () => import('./Components/AuxiliaryLine/index');
const RealTime = () => import('./Components/RealTime/index');
const Marquee = () => import('./Components/Marquee/index');
const TabComponent = () => import('./Components/TabComponent/index');
const TimeFiltering = () => import('./Components/TimeFiltering/index');
const DropdownBox = () => import('./Components/DropdownBox/index');
const CanvasDrawing = () => import('./Components/CanvasDrawing/index');
const FullScreenBtn = () => import('./Components/FullScreenBtn/index');
const DataSwitching = () => import('./Components/DataSwitching/index');
const PopCloseButton = () => import('./Components/PopCloseButton/index');
const RadarChart = () => import('./Components/RadarChart/index');
const DocExportBtn = () => import('./Components/DocExportBtn/index');
const BasicMap = () => import('./Components/BasicMap/index');
const NationalProvinceMap = () => import('./Components/NationalProvinceMap/index');
const RoseChart = () => import('./Components/RoseChart/index');
const FunnelChart = () => import('./Components/FunnelChart/index');
const Liquidfill = () => import('./Components/Liquidfill/index');
const Sankey = () => import('./Components/Sankey/index');
const InfoPresentation = () => import('./Components/InfoPresentation/index');
const CrossSysBtn = () => import('./Components/CrossSysBtn/index');
const Iframe = () => import('./Components/Iframe/index');
const ThreeDComponents = () => import('./Components/ThreeDComponents/index');
const BasicGraph = () => import('./Components/BasicGraph/index');
const DigitalFlipper = () => import('./Components/DigitalFlipper/index');

export default {
  props: {
    designType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      singleConfig: {}, // lianjie url
      visible: false, // tangkuang
      bgConfig: {}, // 背景配置
      transitionScale: 1, // 缩放比例
      transitionScaleX: 1, // 宽度缩放
      transitionScaleY: 1, // 高度缩放
      list: [], // 配置控件
      metaDataList: [], // 控件配置元数据
      isShow: true,
      filterParameter: {}, // 用于tab控件，时间控件组装过滤参数
      imageFileName: '',
      imageFileUrl: '',
      imageFileVisible: false
    };
  },
  components: {
    Iframe,
    BasicGraph,
    ThreeDComponents,
    TimeGanttChart,
    CrossSysBtn,
    FunnelChart,
    RoseChart,
    BasicMap,
    PopCloseButton,
    SingleLineText,
    BackgroundBox,
    ImageBox,
    BasicPieChart,
    DigitalFlipper,
    BasicBarChart,
    BasicLineChart,
    GeneralTable,
    TransverseBarChart,
    CircleProgressBar,
    HorizontalProgressBar,
    ColumnLineMix,
    Dashboard,
    AuxiliaryLine,
    RealTime,
    Marquee,
    TabComponent,
    TimeFiltering,
    DropdownBox,
    CanvasDrawing,
    FullScreenBtn,
    DataSwitching,
    Video,
    RadarChart,
    DocExportBtn,
    NationalProvinceMap,
    Liquidfill,
    Sankey,
    InfoPresentation
  },

  computed: {

    filterList() {
      return this.list.filter((item) => item.isShow);
    },
    getBGStyle() {
      const { bgImage, bgColor, width, height, showType} = this.bgConfig;
      let styles = '';
      if (showType === 4) {
        styles += `width: ${width}px;height:${height}px;`;
      }
      if (bgImage) {
        styles += `background-image: url('${bgImage || ''}');`;
        return styles;
      }
      if (bgColor) {
        styles += `background:${bgColor || ''};`;
        return styles;
      }
      return ''
    },
    getStylesBgUrl() { // 获取背景图
      return function () {
        const { bgImage, width, height, showType} = this.bgConfig;
        let styles = '';
        // if (showType === 4) {
        styles += `width: ${width}px;height:${height}px;`;
        // }
        if (showType === 2 || showType === 4) {
          styles += `background-image: url('${bgImage || ''}');transform: scale(${this.transitionScaleX}, ${this.transitionScaleY}) ;`;
          return styles;
        }
        styles += `background-image: url('${bgImage || ''}');transform: scale(${this.transitionScaleX}, ${this.transitionScaleY}) translate3d(-50%, -50%, 0px);`;
        return styles;
      }
    },
    getStylesBg() { // 获取大屏背景色
      return function () {
        return `background:${this.bgConfig.bgColor || ''}`
      }
    }
  },

  mounted() {
    Bus.$off('modalOpera').$on('modalOpera', ({ visible, singleConfig }) => {
      this.visible = visible;
      this.singleConfig = singleConfig;
      console.log(singleConfig, visible);
    })
    Bus.$off('previewOpera').$on('previewOpera', ({ visible, imageFileName, imageFileUrl }) => {
      this.imageFileVisible = visible;
      this.imageFileName = imageFileName;
      this.imageFileUrl = imageFileUrl;
    })
    const bgConfig = localStorage.getItem('bg') || '{}';
    const list = localStorage.getItem('list') || '[]';
    this.bgConfig = JSON.parse(bgConfig);
    const newList = JSON.parse(list);
    this.getInitFilterParams(newList);
    this.metaDataList = newList;
    if (!this.designType) {
      document.title = this.bgConfig.title;
    }
    this.setDrawContent();
    window.addEventListener('resize', this.setDrawContent)
    this.$nextTick(() => {
      setTimeout(() => {
        this.isShow = false;
      }, 200);
    })
    window.addEventListener('message', (e) => {
      if (e.data.message === 'modalClose') {
        this.visible = Boolean(e.data.visible);
      }
    }, false);
  },

  methods: {
    getInitFilterParams(arr) {
      let params = {};
      let newArr = cloneDeep(arr);
      arr.forEach((item) => {
        const {componentName} = item;
        if (componentName === 'TabComponent') { // tab
          const {stylesObj = {}, tabConfig = []} = item;
          const {defaultShowTab, paramName} = stylesObj;
          if (!paramName) {
            return;
          }
          const i = defaultShowTab.split('_')[1]; // 默认选中的tab
          const {geChartArray = [], value} = tabConfig[+i];
          if (!geChartArray.length) {
            return;
          }
          if (!value) {
            return;
          }
          geChartArray.forEach((arr) => {
            params[`${arr}_${paramName}`] = value;
          })
        } else if (componentName === 'DropdownBox') {
          const {
            stylesObj: {
              updateChart = [],
              selectOptions = [],
              defaultCheckedTimeType = '',
              paramsFiled = ''
            }
          } = item;
          if (!selectOptions.length || !paramsFiled || !updateChart.length || !defaultCheckedTimeType) {return;}
          let arr = defaultCheckedTimeType.split('_');
          const i = +arr[arr.length - 1];
          const obj = selectOptions[i];
          const value = obj.value;
          updateChart.forEach((chart) => {
            params[`${chart}_${paramsFiled}`] = value;
          })
        } else if (componentName === 'DataSwitching') {
          const {beforeParamsConfig = []} = item;
          beforeParamsConfig.forEach((beforeItems) => {
            const index = newArr.findIndex(items => items.componentId === beforeItems.componentId);
            if (index !== -1) {
              newArr[index].isShow = beforeItems.isShow;
              const {variableConfig = []} = item;
              if (variableConfig.length) {
                variableConfig.forEach((varObj) => {
                  const {name, value} = varObj;
                  if (name) {
                    params[`${beforeItems.componentId}_${name}`] = value;
                  }
                })
              }
            }
          })
        }
      })
      this.filterParameter = params;
      this.list = newArr.filter((item) => item.isShow); // 只展示显示的控件
    },
    updateState(key, itemObj) { // 修改data中的值
      this[key] = itemObj;
    },
    setDrawContent() { //  计算画布大小
      let { width: availWidth, height: availHeight } = document.querySelector('.contentWrap').getBoundingClientRect();
      if (this.designType === 'APP') {
        const previewDialogWrapConfig = document.querySelector('.previewDialogWrap').getBoundingClientRect()
        availWidth = previewDialogWrapConfig.width;
        availHeight = previewDialogWrapConfig.height;
      }
      const {showType, width: dWidth, height: dHeight } = this.bgConfig;
      const widthScalc = availWidth / (dWidth || 1920);
      const heightScalc = availHeight / (dHeight || 1080);
      if (showType === 1) {
        this.transitionScaleX = widthScalc;
        this.transitionScaleY = heightScalc;
      }
      if (showType === 2) {
        this.transitionScaleX = widthScalc;
        this.transitionScaleY = widthScalc;
      }
      if (showType === 3) {
        this.transitionScaleX = heightScalc;
        this.transitionScaleY = heightScalc;
      }
      if (showType === 4) {
        // const transitionScale = widthScalc > heightScalc ? heightScalc : widthScalc;
        this.transitionScaleX = 1;
        this.transitionScaleY = 1;
      }
    }
  },
  beforeDestroy() {
    if (this.designType !== 'APP') {
      localStorage.removeItem('bg');
      localStorage.removeItem('list');
      window && window.removeEventListener('message');
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .equalWidthRatio, .design {
    overflow: auto;

    & > .previewWrap {
      left: 0 !important;
      top: 0 !important;
    }
  }

  .contentWrap {
    width: 100%;
    height: 100%;
    position: relative;

    .previewWrap {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform-origin: 0 0;
      background-repeat: no-repeat;
      background-size: 100%;
      z-index: 1;

      .contentBox {
        position: relative;
        width: 100%;
        height: 100%;
      }
    }

    .contentBg {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }

  .contentVideo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

}
</style>
