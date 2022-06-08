/**
* @name: index
* @author: DELL
* @date: 2022/4/8 15:34
* @description：index
* @update: 2022/4/8 15:34
*/
<!-- 页面 -->
<template>
  <VueDragResize
      :parentLimitation="false"
      :isActive="config.componentId === activeComponent.componentId"
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
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="componentsWrap" @contextmenu.prevent="show">
      <component
          :config="config"
          :is="config.componentName"
          :list="list"
          :scale="scale"
          :bgConfig="bgConfig"
          :type="config.componentName === 'GeneralTable'?'design':''"
      ></component>
    </div>
  </VueDragResize>
</template>

<script>
// import VueDragResize from 'vue-drag-resize';

const ImageBox = () => import('../../components/ImageBox/index');
const BasicPieChart = () => import('../../components/BasicPieChart/index');
const BasicBarChart = () => import('../../components/BasicBarChart');
const BasicLineChart = () => import('../../components/BasicLineChart');
const CircleProgressBar = () => import('../../components/CircleProgressBar');
const ColumnLineMix = () => import('../../components/ColumnLineMix');
const TransverseBarChart = () => import('../../components/TransverseBarChart');
const Dashboard = () => import('../../components/Dashboard/index');
const SingleLineTextHome = () => import('../../components/SingleLineTextHome/index');
const BackgroundBox = () => import('../../components/BackgroundBox/index');
const RealTime = () => import('../../components/RealTime/index');
const HorizontalProgressBar = () => import('../../components/HorizontalProgressBar/index');

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
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },

  components: {
    // VueDragResize,
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
    BackgroundBox,
    HorizontalProgressBar
  },

  computed: {},

  mounted() {
  },

  methods: {
    update(obj) {
      const { componentId } = this.config;
      const list = [...this.list];
      const index = list.findIndex((item) => item.componentId === componentId);
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    handleClick() {
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      });
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    dragstop(newRect) {
      this.update(newRect);
    },
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
}
</style>
