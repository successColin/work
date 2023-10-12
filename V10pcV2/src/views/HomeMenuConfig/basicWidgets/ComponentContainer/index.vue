/**
* @name: index
* @author: DELL
* @date: 2022/4/8 15:34
* @description：index
* @update: 2022/4/8 15:34
*/
<!-- 页面 -->
<template>
  <CDragComponent
      :isDraggable="!config.isFixed"
      :parentLimitation="false"
      :isActive="selectedComponentArr.includes(config.componentId)"
      :preventActiveBehavior="true"
      :w="config.width"
      :h="config.height"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :x="config.left"
      :y="config.top"
      :minw="2"
      :minh="2"
      :parentScaleX="scale"
      :parentScaleY="scale"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      :config="config"
      @mousedown.native="(e) => onChartDragStart(e)"
      @mouseup.native="(e)=> onChartDragStop(e)"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="componentsWrap" @contextmenu.prevent="show">
      <component
          :config="config"
          :is="config.componentName"
          :activeComponent="activeComponent"
          :list="list"
          :scale="scale"
          :bgConfig="bgConfig"
          v-on="$listeners"
          v-bind="$attrs"
          @contextmenu="show"
          :type="config.componentName === 'GeneralTable'?'design':''"
      ></component>
    </div>
  </CDragComponent>
</template>

<script>
const ImageBox = () => import('../../components/ImageBox/index');
const BasicPieChart = () => import('../../components/BasicPieChart/index');
const BasicBarChart = () => import('../../components/BasicBarChart');
const BasicLineChart = () => import('../../components/BasicLineChart');
const CircleProgressBar = () => import('../../components/CircleProgressBar');
const ColumnLineMix = () => import('../../components/ColumnLineMix');
const TransverseBarChart = () => import('../../components/TransverseBarChart');
const Dashboard = () => import('../../components/Dashboard/index');
const SingleLineTextHome = () => import('../../components/SingleLineTextHome/index');
const ApprovalCom = () => import('../../components/ApprovalCom/index');
const BackgroundBox = () => import('../../components/BackgroundBox/index');
const RealTime = () => import('../../components/RealTime/index');
const AuxiliaryLine = () => import('../../components/Line/index');
const HorizontalProgressBar = () => import('../../components/HorizontalProgressBar/index');
const RadarChart = () => import('../../components/RadarChart/index');
const Notice = () => import('../../components/Notice/index');
const RoseChart = () => import('../../components/RoseChart/index');
const Liquidfill = () => import('../../components/Liquidfill/index');
const FunnelChart = () => import('../../components/FunnelChart/index');
const TabComponent = () => import('../../components/TabComponent/index');
const CarouselChart = () => import('../../components/CarouselChart/index');
const Indicator = () => import('../../components/Indicator/index');
const DropdownBox = () => import('../../components/DropdownBox/index');
const TimeFiltering = () => import('../../components/TimeFiltering/index');
const Video = () => import('../../components/Video/index');
const DataSwitching = () => import('../../components/DataSwitching/index');
const BasicMap = () => import('../../components/BasicMap/index');
const CanvasDrawing = () => import('../../components/CanvasDrawing/index');
const InfoPresentation = () => import('../../components/InfoPresentation/index');
const Sankey = () => import('../../components/Sankey/index');

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    config: {
      type: Object,
      default() {
        return {};
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
    selectedComponentArr: {
      type: Array,
      default() {
        return [];
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  data() {
    return {
      clickStartTime: 0, // 记录鼠标按下时得时间
      clickEndTime: 0, // 记录鼠标松开时得时间
      dragFlag: true, // 是否开始拖拽
    };
  },

  components: {
    Sankey,
    InfoPresentation,
    CanvasDrawing,
    BasicMap,
    DataSwitching,
    TimeFiltering,
    DropdownBox,
    FunnelChart,
    RoseChart,
    Liquidfill,
    ImageBox,
    RealTime,
    BasicPieChart,
    BasicBarChart,
    BasicLineChart,
    CircleProgressBar,
    TransverseBarChart,
    ColumnLineMix,
    Dashboard,
    SingleLineTextHome,
    ApprovalCom,
    BackgroundBox,
    HorizontalProgressBar,
    RadarChart,
    AuxiliaryLine,
    Notice,
    TabComponent,
    CarouselChart,
    Indicator,
    Video
  },

  computed: {
    sticks() {
      const { componentName } = this.config;
      if (['DropdownBox', 'TimeFiltering'].includes(componentName)) return ['mr', 'ml'];
      return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml'];
    }
  },

  mounted() {},

  methods: {
    onChartDragStart() { // 鼠标按下点击组件
      this.clickStartTime = +new Date(); // 记录点击得时间
      this.dragFlag = true;
    },
    onChartDragStop() {
      this.clickEndTime = +new Date(); // 记录鼠标松开得时间
      this.dragFlag = false;
      // 如果点击操作时间少于300毫米，就判断不是拖拽动作，走正常流程
      if (this.clickEndTime - this.clickStartTime <= 200) {
        this.$emit('updateActiveComponent', this.config);
        return;
      }
      this.$emit('onDragStop');
    },
    update(obj) {
      // const { componentId } = this.config;
      Object.keys(obj).forEach((key) => {
        this.config[key] = obj[key];
      });
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    // dragstop(newRect) {
    //   this.update(newRect);
    // },
    show(e) { // 右击
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.componentsWrap {
  width: 100%;
  height: 100%;
  -webkit-user-select:none;
  -moz-user-select:none;
  -ms-user-select:none;
  user-select:none;
}
</style>
