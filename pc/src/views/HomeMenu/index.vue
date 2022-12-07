/**
* @name: index
* @author: DELL
* @date: 2021/8/20 15:28
* @description：index
* @update: 2021/8/20 15:28
*/
<!-- 页面 -->
<template>
  <div class="content" v-loading="loading">
    <div
      class="contentWrap"
      :class="{
        [`files${otherParams.id}`]: true,
        equalWidthRatio: bgConfig.showType === 2,
        design: bgConfig.showType === 4,
      }"
      :style="getBGStyle"
    >
      <div class="previewWrap" :style="getStylesBgUrl()">
        <div class="contentBox">
          <el-skeleton v-if="loading" :rows="14" animated />
<!--          <component-->
<!--            :transitionScaleX="transitionScaleX"-->
<!--            :transitionScaleY="transitionScaleY"-->
<!--            :config="configItem"-->
<!--            :is="configItem.componentName"-->
<!--            v-for="(configItem, i) in filterList"-->
<!--            :key="`${configItem.componentId}_${i}`"-->
<!--            :metaDataList="metaDataList"-->
<!--            :updateState="updateState"-->
<!--            :otherParams="otherParams"-->
<!--            :elementData="elementData"-->
<!--          ></component>-->
          <component
              :transitionScaleX="transitionScaleX"
              :transitionScaleY="transitionScaleY"
              :config="configItem"
              :is="configItem.componentName"
              v-for="(configItem, i) in filterList"
              :key="`${configItem.componentId}_${i}`"
              :metaDataList="metaDataList"
              :updateState="updateState"
              :otherParams="otherParams"
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
      <div class="contentBg"></div>
    </div>
    <!--    <video-->
    <!--        class="contentVideo"-->
    <!--        style="width:100%; height:100%; object-fit: fill"-->
    <!--        muted loop autoplay-->
    <!--        :src="bgConfig.bgImage"></video>-->
    <!--    <Loading v-if="isShow"/>-->
    <ImageZoom
      v-if="imageFileVisible"
      :imageFileName="imageFileName"
      :imageFileUrl="imageFileUrl"
    ></ImageZoom>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import Bus from '@/utils/bus';
import { fetchElementList, fetchElementData } from '@/api/design';

// const PopCloseButton = () => import('./Components/PopCloseButton/index');
const BackgroundBox = () => import('./Components/BackgroundBox/index');
const SingleLineTextHome = () => import('./Components/SingleLineText/index');
const ImageBox = () => import('./Components/ImageBox/index');
const BasicPieChart = () => import('./Components/BasicPieChart/index');
const BasicBarChart = () => import('./Components/BasicBarChart/index');
const BasicLineChart = () => import('./Components/BasicLineChart/index');
const GeneralTable = () => import('./Components/GeneralTable/index');
const TransverseBarChart = () => import('./Components/TransverseBarChart/index');
const CircleProgressBar = () => import('./Components/CircleProgressBar/index');
const ColumnLineMix = () => import('./Components/ColumnLineMix/index');
const Dashboard = () => import('./Components/Dashboard/index');
const AuxiliaryLine = () => import('./Components/AuxiliaryLine/index');
const RealTime = () => import('./Components/RealTime/index');
const HorizontalProgressBar = () => import('./Components/HorizontalProgressBar/index');
const RadarChart = () => import('./Components/RadarChart/index');
const Notice = () => import('./Components/Notice/index');
const RoseChart = () => import('./Components/RoseChart/index');
const Liquidfill = () => import('./Components/Liquidfill/index');
const FunnelChart = () => import('./Components/FunnelChart/index');

// const TabComponent = () => import('./Components/TabComponent/index');
// const TimeFiltering = () => import('./Components/TimeFiltering/index');
// const DropdownBox = () => import('./Components/DropdownBox/index');
// const CanvasDrawing = () => import('./Components/CanvasDrawing/index');
// const DataSwitching = () => import('./Components/DataSwitching/index');
// const Marquee = () => import('./Components/Marquee/index');
// const FullScreenBtn = () => import('./Components/FullScreenBtn/index');

export default {
  props: {
    frameParameters: {
      // 弹框参数
      type: Object,
      default() {
        return {};
      }
    },
    otherParams: {
      // 其他外部参数
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      elementData: {}, // 所有控件列表数据集合
      timer: null,
      imageFileName: '',
      imageFileUrl: '',
      imageFileVisible: false,
      singleConfig: {}, // lianjie url
      visible: false, // tangkuang
      isShow: true,
      bgConfig: {}, // 背景配置
      transitionScale: 1, // 缩放比例
      list: [], // 配置控件
      transitionScaleX: 1,
      transitionScaleY: 1,
      metaDataList: [],
      loading: true,
      filterParameter: {}, // 用于tab控件，时间控件组装过滤参数
      timer1: null
    };
  },

  components: {
    // FullScreenBtn,
    // PopCloseButton,
    FunnelChart,
    Liquidfill,
    RoseChart,
    HorizontalProgressBar,
    SingleLineTextHome,
    BackgroundBox,
    ImageBox,
    BasicPieChart,
    BasicBarChart,
    BasicLineChart,
    GeneralTable,
    CircleProgressBar,
    TransverseBarChart,
    ColumnLineMix,
    Dashboard,
    AuxiliaryLine,
    RealTime,
    Notice,
    RadarChart
    // TabComponent,
    // TimeFiltering,
    // DropdownBox,
    // CanvasDrawing,
    // DataSwitching,
    // Marquee
  },

  computed: {
    filterList() {
      return this.list.filter((item) => item.isShow);
    },
    getBGStyle() {
      const {
        // bgImage,
        bgColor,
        width,
        height,
        showType,
        enableShadows,
        xShadow,
        yShadow,
        blurRadius,
        shadowDistance,
        shadowColor
      } = this.bgConfig;
      let styles = '';
      if (showType === 4) {
        styles += `width: ${width}px;height:${height}px;`;
      }
      if (enableShadows) {
        styles += `boxShadow: ${xShadow}px ${yShadow}px ${blurRadius}px ${shadowDistance}px ${shadowColor};`;
      }
      // if (bgImage) {
      //   styles += `background-image: url('${this.$parseImgUrl(bgImage) || ''}');`;
      //   return styles;
      // }
      if (bgColor) {
        styles += `background:${bgColor || ''};`;
        return styles;
      }
      return styles;
    },
    getStylesBgUrl() {
      // 获取背景图
      return function () {
        const { bgImage, width, height, showType } = this.bgConfig;
        let styles = '';
        // if (showType === 4) {
        styles += `width: ${width}px;height:${height}px;`;
        // }
        if (showType === 2 || showType === 4) {
          styles += `background-image: url('${
            this.$parseImgUrl(bgImage) || ''
          }');transform: scale(${this.transitionScaleX}, ${this.transitionScaleY}) ;`;
          return styles;
        }
        styles += `background-image: url('${this.$parseImgUrl(bgImage) || ''}');transform: scale(${
          this.transitionScaleX
        }, ${this.transitionScaleY}) translate3d(-50%, -50%, 0px);`;
        return styles;
      };
    },
    getStylesBg() {
      // 获取大屏背景色
      return function () {
        return `background:${this.bgConfig.bgColor || ''}`;
      };
    }
  },

  activated() {
    this.commonBus();
    this.timer = setTimeout(() => {
      this.init();
    }, 500);
    window.addEventListener('resize', this.setDrawContent);
  },
  mounted() {
    this.commonBus();
    this.$nextTick(() => {
      const { name } = this.$route;
      if (this.otherParams.id || name === 'appCustomPage') {
        setTimeout(() => {
          this.init();
        }, 500);
        window.addEventListener('resize', this.setDrawContent);
      }
    });
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: false,
      handler(v, o) {
        if (v && v.id && o) {
          this.init();
          this.setDrawContent();
        }
      }
    }
  },

  methods: {
    commonBus() {
      Bus.$off('modalOpera').$on('modalOpera', ({ visible, singleConfig }) => {
        this.visible = visible;
        this.singleConfig = singleConfig;
      });
      Bus.$off('previewOpera').$on('previewOpera', ({ visible, imageFileName, imageFileUrl }) => {
        this.imageFileVisible = visible;
        this.imageFileName = imageFileName;
        this.imageFileUrl = imageFileUrl;
      });
      Bus.$off('menuWidthChange').$on('menuWidthChange', () => {
        this.timer1 = setTimeout(() => {
          this.setDrawContent();
        }, 500);
      });
    },
    updateState(key, itemObj) {
      // 修改data中的值
      this[key] = itemObj;
    },
    async init() {
      const query = this.$route.params;
      let cToken = '';
      const urlParams = this.$route.query;
      const { hasOwnProperty } = Object.prototype;
      if (hasOwnProperty.call(urlParams, 'CSMToken') && urlParams.CSMToken) {
        cToken = urlParams.CSMToken;
      }
      const params = {
        ...query,
        cToken,
        ...this.otherParams
      };
      if (!cToken) delete params.cToken;
      try {
        const data = await fetchElementList(params);
        const { designJson, list = [] } = data;
        this.loading = false;
        this.bgConfig = designJson ? JSON.parse(designJson) : {};
        this.metaDataList = list.map((item) => {
          const { designJson: elementDesign, id } = item;
          const obj = JSON.parse(elementDesign || '{}');
          return {
            id,
            ...obj
          };
        });
        this.getInitFilterParams(this.metaDataList);
        // this.list = this.metaDataList.filter(item => item.isShow);
      } catch (e) {
        this.loading = true;
      }
    },
    getInitFilterParams(arr) {
      const newArr = cloneDeep(arr);
      this.list = newArr.filter((item) => item.isShow); // 只展示显示的控件
      // this.fetchElementData(this.list);
      this.$nextTick(() => {
        this.setDrawContent();
        this.isShow = false;
      });
    },
    async fetchElementData(list = []) {
      // 批量获取控件数据
      const targetList = list.filter((item) => {
        const { dataType, componentName } = item;
        return ['SingleLineTextHome', 'Dashboard'].includes(componentName) && dataType === 3;
      });
      const paramArr = [];
      targetList.forEach((item) => {
        const obj = this.getParameters(item);
        paramArr.push(obj);
      });
      if (!paramArr.length) return;
      const res = await fetchElementData({ elementDtos: paramArr });
      this.elementData = res;
    },
    getParameters(config) {
      const { id, dataType, SqlDataConfig: {
        enableDataManage, variableConfig
      } } = config;
      const reduce = (
        obj // 将Object 处理成 Array
      ) =>
        Object.keys(obj).map((item) => ({
          name: item,
          value: obj[item]
        }));
      const satisfyParams = {};
      const { name } = this.$route;
      const query = name === 'appCustomPage' ? this.$route.query : this.otherParams;
      if (JSON.stringify(query) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (dataType === 3 && enableDataManage && variableConfig.length) {
            const currentVar = variableConfig.find((varObj) => varObj.name === item);
            if (currentVar) {
              satisfyParams[item] = this.otherParams[item];
            }
          }
        });
      }
      const arr = reduce(satisfyParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },

    setDrawContent() {
      //  计算画布大小
      const dom = document.querySelector('.contentWrap');
      if (!dom) return;
      const { width: availWidth, height: availHeight } = dom.getBoundingClientRect();
      const { showType, width: dWidth, height: dHeight } = this.bgConfig;
      const widthScalc = availWidth / (dWidth + 10 || 1920);
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
        this.transitionScaleX = 1;
        this.transitionScaleY = 1;
      }
    },
    commonDestroy() {
      if (window) {
        window.removeEventListener('resize', this.setDrawContent);
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.timer1) {
        clearTimeout(this.timer1);
      }
      Bus.$off('modalOpera');
      Bus.$off('previewOpera');
      Bus.$off('menuWidthChange');
    }
  },
  deactivated() {
    this.commonDestroy();
  },
  beforeDestroy() {
    this.commonDestroy();
  },
  name: 'homePage'
};
</script>

<style lang='scss' scoped>
.content {
  width: 100%;
  height: 100%;
  //overflow: hidden;
  //background-color: #202020;

  .equalWidthRatio,
  .design {
    overflow-y: auto;
    overflow-x: hidden;

    & > .previewWrap {
      left: 0 !important;
      top: 0 !important;
    }
  }

  .contentWrap {
    width: 100%;
    height: 100%;
    position: relative;
    background: #ffffff;

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
