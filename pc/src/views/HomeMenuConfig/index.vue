/**
* @name: index
* @author: DELL
* @date: 2022/3/28 11:19
* @description：index
* @update: 2022/3/28 11:19
*/
<!-- 页面 -->
<template>

  <div class="homePageConfig" @click="pageConfigInit">
    <Header
        @doBack="doBack"
        :scale="scale"
        @doSave="doSave"
        @changeScale="changeScale"
        @changeScaleObj="changeScaleObj"
        @resetScale="changeAutoScale"
    ></Header>
    <div class="homePageContent">
      <div
          class="homePageContent__sidebar"
          :class="{[isOpen? 'sidebarOpen' : 'sidebarClose']: true}">
        <Sidebar
            @dragObject="dragEnd"
            :list="list"
            :activeComponent="activeComponent"
            @updateActiveComponent="doUpdateActiveComponent"
            @updateList="updateList"
        ></Sidebar>
      </div>
      <div class="homePageContent__main">
        <!-- 设计区域 -->
        <div class="homePageContent__main--content"
             @click.stop="handleClick($event, 'homePageContent__main--content')">
          <div
              class="homePageContent__main--bg"
              :key="updateKey"
              :style="getStylesStransformScale()"
          >
            <!-- 设计区域 -->
            <div class="homePageContent__main--area"
                 @click="handleClick($event, 'homePageContent__main--area')">
              <CommonContainer
                  v-for="configItem in showList"
                  :key="configItem.componentId"
                  :config="configItem"
                  :scale="scale"
                  :bgConfig="menuProperties"
                  :activeComponent="activeComponent"
                  @updateActiveComponent="doUpdateActiveComponent"
                  @rightClickComponent="doRightClick"
                  :list="list"
                  @updateList="updateList"
              ></CommonContainer>
            </div>
            <!--栅格区域-->
            <div class="design_grid">
              <canvas ref="bgCanvas"
                      :width="menuProperties.width"
                      :height="menuProperties.height"
                      class="canvasWrap"></canvas>
            </div>
            <!-- 背景图 -->
            <div class="design__bg" :style="getStylesBgUrl()"></div>
          </div>
        </div>
      </div>
      <div class="homePageContent__attribute">
        <!--属性配置区域-->
        <component
            :activeComponent="activeComponent"
            :is="`${activateComponentKey}Config`"
            :list="list"
            :key="activeComponent.componentId"
            :config="menuProperties"
            @updateList="updateList"
        ></component>
      </div>
      <div
          class="homePageContent__fold"
          :class="{[isOpen? 'foldOpen' : 'foldClose']: true}"
          @click="isOpen=!isOpen"
      ></div>
      <RightClickOperation
          :list="list"
          @updateList="updateList"
          :rightClick="rightClickInfo"
          @resetRightClickInfo="resetRightClickInfo"
          @updateActiveComponent="doUpdateActiveComponent"
          :activeComponent="activeComponent"
      />
    </div>
  </div>
</template>

<script>
import { insertElement, fetchElementList, saveElementList } from '@/api/design';
import { menuProperties } from './constants/global';
import Header from './Layout/Header/index';
import Sidebar from './Layout/Sidebar/index';

const UnderlyingBasicConfig = () => import('./configComponents/UnderlyingBasicConfig/index');
const CommonContainer = () => import('./basicWidgets/ComponentContainer/index');
const RightClickOperation = () => import('./Layout/RightClickOperation/index');
const ImageBoxConfig = () => import('./configComponents/ImageBoxConfig/index');
const BasicPieChartConfig = () => import('./configComponents/BasicPieChartConfig/index');
const BasicBarChartConfig = () => import('./configComponents/BasicBarChartConfig/index');
const BasicLineChartConfig = () => import('./configComponents/BasicLineChartConfig/index');
const CircleProgressBarConfig = () => import('./configComponents/CircleProgressBarConfig/index');
const TransverseBarChartConfig = () => import('./configComponents/TransverseBarChartConfig/index');
const ColumnLineMixConfig = () => import('./configComponents/ColumnLineMixConfig/index');
const DashboardConfig = () => import('./configComponents/DashboardConfig/index');
const SingleLineTextHomeConfig = () => import('./configComponents/SingleLineTextHomeConfig/index');
const GeneralTableConfig = () => import('./configComponents/GeneralTableConfig/index');
const BackgroundBoxConfig = () => import('./configComponents/BackgroundBoxConfig/index');
const RealTimeConfig = () => import('./configComponents/RealTimeConfig/index');

export default {
  data() {
    return {
      updateKey: 0, // 强制更新表示
      isOpen: true, // 默认展开
      scale: 0, // 缩放比列
      list: [], // 组件集合
      menuProperties: { // 菜单属性
      },
      rightClickInfo: {}, // 右键鼠标集合
      timer: null,
      autoScale: true, // 自适应缩放
      activateComponentKey: 'UnderlyingBasic', // 激活组件名称
      activeComponent: {} // 激活的组件
    };
  },

  components: {
    CommonContainer,
    Header,
    Sidebar,
    UnderlyingBasicConfig,
    ImageBoxConfig,
    BasicPieChartConfig,
    RightClickOperation,
    BasicBarChartConfig,
    BasicLineChartConfig,
    CircleProgressBarConfig,
    TransverseBarChartConfig,
    ColumnLineMixConfig,
    DashboardConfig,
    SingleLineTextHomeConfig,
    GeneralTableConfig,
    BackgroundBoxConfig,
    RealTimeConfig
  },

  computed: {
    getStylesBgUrl() {
      return function () {
        const { bgImage, bgColor } = this.menuProperties;
        return `background-image:url(${bgImage || ''});background-color:${bgColor || ''} `;
      };
    },
    showList() {
      return this.list.filter((item) => item.isShow);
    },
    getStylesStransformScale() { // 设计区域大小，当大缩小设置
      return function () {
        const { width, height } = this.menuProperties;
        return `transform: scale(${this.scale}, ${this.scale});width:${width}px;height:${height}px`;
      };
    },
    getComponentConfig() { // 获取单个组件的属性配置
      if (this.activateComponentKey === 'UnderlyingBasic') {
        return this.menuProperties;
      }
      return this.activeComponent;
    },
  },

  mounted() {
    this.initScaling();
    this.initElementList();
    window.addEventListener('resize', () => {
      this.initScaling();
    });
    this.$nextTick(() => {
      this.drawGrid();
    });
  },
  watch: {
    isOpen: {
      deep: true,
      immediate: false,
      handler() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.initScaling(() => {
            this.updateKey += 1;
            this.$nextTick(() => {
              this.drawGrid();
            });
          });
        }, 1000);
      }
    },
    'menuProperties.gridSize': {
      deep: true,
      immediate: false,
      handler(v) {
        if (v && this.menuProperties.enable && v > 5) {
          this.$nextTick(() => {
            this.drawGrid();
          });
        }
      }
    },
    menuProperties: {
      deep: true,
      immediate: false,
      handler() {
        this.$nextTick(() => {
          this.drawGrid();
        });
      }
    }
  },
  methods: {
    async initElementList() { // 获取控件列表
      const res = await fetchElementList({ id: this.$route.params.id });
      const { designJson, list } = res;
      const newList = list.map((item) => {
        const { id, designJson: elementDesign, sqlResponse, sqlFilterResponse } = item;
        const config = JSON.parse(elementDesign);
        const { SqlDataConfig } = config;
        return {
          ...config,
          id,
          SqlDataConfig: {
            ...SqlDataConfig,
            SQLResponse: sqlResponse,
            SQLFilterResponse: sqlFilterResponse
          },
        };
      });
      this.updateList(newList);
      this.menuProperties = designJson ? JSON.parse(designJson) : menuProperties;
    },
    async doSave() { // 保存控件
      const newList = [];
      this.list.forEach((item) => {
        const { dataType, componentId, id = '', SqlDataConfig = {}, ...rest } = item;
        const obj = {
          dataJson: '',
          dataType,
          designJson: JSON.stringify(item),
          id,
          type: 0,
          homepageId: this.$route.params.id,
        };
        if (dataType === 3) {
          obj.dataJson = JSON.stringify({
            SQL: SqlDataConfig.SQL,
          });
          obj.varJson = JSON.stringify(SqlDataConfig.variableConfig || []);
        }
        const { SQLFilterResponse, SQLResponse } = SqlDataConfig;
        obj.sqlResponse = SQLResponse;
        obj.sqlFilterResponse = SQLFilterResponse;
        delete SqlDataConfig.SQLFilterResponse;
        delete SqlDataConfig.SQLResponse;
        obj.designJson = JSON.stringify({
          ...rest,
          dataType,
          componentId,
          SqlDataConfig,
        });
        newList.push(obj);
      });
      const params = {
        homepageDesignJson: JSON.stringify(this.menuProperties),
        homepageId: this.$route.params.id,
        list: newList
      };
      try {
        await saveElementList(params);
        this.$message.success('保存成功!');
        await this.initElementList();
      } catch (e) {
        console.log('保存错误');
      }
    },
    doBack() {
      if (sessionStorage.menuBackPath) {
        this.$router.replace(sessionStorage.menuBackPath);
      } else {
        this.$router.replace('/HomePageConfig');
      }
    },
    pageConfigInit() { // 页面恢复
      this.rightClickInfo = {};
      // this.activateComponentKey = 'UnderlyingBasic';
    },
    updateList(v) {
      this.list = v.sort((a, b) => b.stylesObj.zIndex - a.stylesObj.zIndex);
    },
    async dragEnd({ componentInfo, e }) {
      const { pageX, pageY } = e;
      const { height, width } = componentInfo;
      // eslint-disable-next-line no-mixed-operators
      const lastTop = (pageY - 66) / this.scale - (height / 2 * this.scale);
      // eslint-disable-next-line no-mixed-operators
      const lastLeft = (pageX - 280 - 20) / this.scale - width * this.scale / 2;
      const top = Math.ceil(lastTop);
      const left = Math.ceil(lastLeft);
      const { scrollTop, scrollLeft } = document.querySelector('.homePageContent__main--content');
      const positionsObj = {
        top: top + scrollTop / this.scale,
        left: left + scrollLeft
      };
      const designObj = { ...componentInfo, ...positionsObj, type: 0 };
      const newObj = JSON.parse(JSON.stringify(designObj));
      const data = await insertElement(newObj);
      this.list.push({ ...newObj, id: data, homepageId: this.$route.params.id });
      this.activeComponent = newObj;
      this.activateComponentKey = newObj.componentName;
    },
    changeAutoScale() { // 选择自适应
      this.autoScale = true;
      this.initScaling();
    },
    initScaling(callback) { // 初始化缩放比例
      const dom = document.body.querySelector('.homePageContent__main--content');
      if (this.autoScale && dom) {
        const { width, height } = dom.getBoundingClientRect();
        const rWidth = width;
        const rHeight = height;
        const widthScale = rWidth / (this.menuProperties.width || 1920);
        const heightScale = rHeight / (this.menuProperties.height || 1080);
        this.scale = widthScale > heightScale ? heightScale : widthScale;
        if (callback) {
          callback();
        }
      }
    },
    changeScale(v) {
      this.scale = v;
      this.updateKey += 1;
      this.$nextTick(() => {
        this.drawGrid();
      });
    },
    changeScaleObj() {
      this.autoScale = false;
    },
    handleClick(e, key) {
      const classList = Array.from(e.target.classList);
      if (classList.includes(key)) {
        this.activeComponent = {};
        this.activateComponentKey = 'UnderlyingBasic';
        // this.isShowComponent = false;
        this.rightClickInfo = {};
      }
    },
    resetRightClickInfo() { // 隐藏右击
      this.rightClickInfo = {};
    },
    doUpdateActiveComponent(config) { // 更新激活组件
      this.activeComponent = config;
      this.activateComponentKey = config.componentName || 'UnderlyingBasic';
      this.rightClickInfo = {};
    },
    doRightClick(e) { // 右键处理
      const { pageX, pageY } = e;
      this.rightClickInfo = { pageX, pageY };
    },
    drawGrid() { //  画栅格
      const myCanvas = document.querySelector('.canvasWrap');
      const ctx = myCanvas.getContext('2d');
      const { gridSize } = this.menuProperties;
      const canvasWidth = ctx.canvas.width;
      const canvasHeight = ctx.canvas.height;
      if (!this.menuProperties.enable) {
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        return;
      }
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      const xLineTotal = Math.floor(canvasHeight / gridSize);
      const yLineTotal = Math.floor(canvasWidth / gridSize);

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= xLineTotal; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize - 0.5);
        ctx.lineTo(canvasWidth, i * gridSize - 0.5);
        ctx.strokeStyle = '#F3F3F3';
        ctx.stroke();
      }
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i <= yLineTotal; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize - 0.5, 0);
        ctx.lineTo(i * gridSize - 0.5, canvasHeight);
        ctx.strokeStyle = '#F3F3F3';
        ctx.stroke();
      }
    },
  },
  beforeDestroy() {
    if (window) {
      window.removeEventListener('resize', this.initScaling);
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
      this.observer = null;
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.homePageConfig {
  width: 100%;
  height: 100%;
  background-color: #F6F6F8;

  .homePageContent {
    width: 100%;
    height: calc(100% - 46px);
    margin-top: 46px;
    display: flex;
    position: relative;

    &__sidebar {
      width: 280px;
      height: 100%;
      position: relative;
    }

    &__main {
      flex: 1;
      display: flex;
      justify-content: center;

      &--content {
        width: calc(100% - 40px);
        height: calc(100% - 20px);
        position: relative;
        align-self: flex-end;
        overflow: auto;
      }

      &--bg {
        width: 1920px;
        height: 1080px;
        z-index: 0;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        transform-origin: left top;
        background: #ffffff;
        .homePageContent__main--area {
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 6;
          top: 0;
          left: 0;

          .locked {
            pointer-events: none;

            &:before {
              outline: none !important;
            }

            ::v-deep {
              .vdr-stick {
                display: none;
              }
            }
          }
        }

        .design_grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 2;
          overflow: hidden;
        }
        .design__bg{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          max-width: 100%;
          max-height: 100%;
          background-repeat: no-repeat;
          transition: all .3s ease;
          pointer-events: none;
          background-size: 100%;
          z-index: 0;
        }

        .canvasWrap {
          width: 100%;
          height: 100%;
          z-index: 0;
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
      }
    }

    &__attribute {
      width: 300px;
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
    }

    &__fold {
      position: absolute;
      width: 12px;
      height: 68px;
      margin-top: -6px;
      top: 45%;
      left: 280px;
      background: #FFFFFF;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.18);
      border-radius: 0px 4px 4px 0px;
      cursor: pointer;
    }

    & .sidebarClose {
      -webkit-animation-name: move_left;
      animation-name: move_left;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    & .sidebarOpen {
      -webkit-animation-name: move_right;
      animation-name: move_right;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;
    }

    & .foldClose {
      -webkit-animation-name: move_left1;
      animation-name: move_left1;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;

      &::after {
        content: "";
        position: absolute;
        top: 32px;
        left: 4px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent transparent transparent #333333;
      }
    }

    & .foldOpen {
      -webkit-animation-name: move_right1;
      animation-name: move_right1;
      -webkit-animation-duration: 1s;
      animation-duration: 1s;
      -webkit-animation-iteration-count: 1;
      animation-iteration-count: 1;
      -webkit-animation-fill-mode: forwards;
      animation-fill-mode: forwards;

      &::after {
        content: "";
        position: absolute;
        top: 32px;
        left: 0px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent #333333 transparent transparent;;
      }
    }
  }
}
</style>
