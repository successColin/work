/** * @name: index * @author: DELL * @date: 2022/3/28 11:19 *
@description：index * @update: 2022/3/28 11:19 */
<!-- 页面 -->
<template>
  <div class="homePageConfig" @click="resetRightClickInfo">
    <Header
      @doBack="doBack"
      :scale="scale"
      :autoScale="autoScale"
      @doSave="doSave"
      @changeScale="changeScale"
      @changeScaleObj="changeScaleObj"
      @changeSliderScale="onlyChangeScalc"
      @resetScale="changeAutoScale"
    ></Header>
    <div class="homePageContent">
      <div
        class="homePageContent__sidebar"
        :class="{ [isOpen ? 'sidebarOpen' : 'sidebarClose']: true }"
      >
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
        <div
          class="homePageContent__main--content"
          :key="updateKey"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @click.stop="handleClick($event, 'homePageContent__main--content')"
        >
          <div
            class="homePageContent__main--bg"
            :style="getStylesStransformScale()"
          >
            <!-- 设计区域 -->
            <div
              class="homePageContent__main--area"
              @click.stop="handleClick($event, 'homePageContent__main--area')"
            >
              <CommonContainer
                class="dragCom"
                :class="{ dragOnlyOne: selectedComponentArr.length === 1 }"
                v-for="configItem in showList"
                :key="`${configItem.componentId}`"
                :config="configItem"
                :scale="scale"
                :bgConfig="menuProperties"
                :activeComponent="activeComponent"
                @updateActiveComponent="doUpdateActiveComponent"
                @rightClickComponent="doRightClick"
                :list="list"
                :selectedComponentArr="selectedComponentArr"
                @updateList="updateList"
                @onDragStop="resetDraw"
              ></CommonContainer>
              <CDragComponent
                class="batchDrag"
                v-if="newBoxProps.width && newBoxProps.height"
                :parentLimitation="false"
                :isActive="true"
                :preventActiveBehavior="true"
                :w="newBoxProps.width"
                :h="newBoxProps.height"
                :x="newBoxProps.left"
                :y="newBoxProps.top"
                :minw="2"
                :minh="2"
                :z="999"
                :sticks="['tm', 'mr', 'bm', 'ml']"
                :parentScaleX="scale"
                :parentScaleY="scale"
                @dragging="dragging"
                @resizing="resize"
                @resizestop="resize"
              >
              </CDragComponent>
              <i
                @click="click(selectedObj)"
                class="selectedHook"
                :class="{ active: isCtrl }"
                v-for="selectedObj in reduceSelectedList"
                :key="`s${selectedObj.componentId}s`"
                :style="getSelectedObjStyles(selectedObj)"
              ></i>
            </div>
            <!--栅格区域-->
            <div class="design_grid">
              <canvas
                ref="bgCanvas"
                :width="menuProperties.width"
                :height="menuProperties.height"
                class="canvasWrap"
              ></canvas>
            </div>
            <!-- 背景图 -->
            <div class="design__bg" :style="getStylesBgUrl()"></div>
          </div>
          <!--          <div-->
          <!--              class="homePageContent__selected&#45;&#45;zoom"-->
          <!--              :style="getSelectedZoomRootStyles()"-->
          <!--              v-if="newBoxProps.width && newBoxProps.height">-->
          <!--            -->
          <!--          </div>-->
          <SelectedArea
            v-show="isMouseOver && isMousedown"
            :startPoint="startPoint"
            :endPoint="mouseOverPoint"
            :scale="scale"
            :size="size"
            :point="Point"
          />
        </div>
      </div>
      <div class="homePageContent__attribute">
        <!--属性配置区域-->
        <component
          :activeComponent="activeComponent"
          :is="`${activateComponentKey}Config`"
          :list="list"
          :config="menuProperties"
          :boxProps="newBoxPropsCopy"
          @batchDel="batchDel"
          @changeSelected="batchChangeSelected"
          @layoutBatch="layoutBatch"
          @updateList="updateList"
          @changeAlignment="batchChangeLayoutOfSelect"
        ></component>
      </div>
      <div
        class="homePageContent__fold"
        :class="{ [isOpen ? 'foldOpen' : 'foldClose']: true }"
        @click="isOpen = !isOpen"
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
import deepClone from 'lodash/cloneDeep';
import sortBy from 'lodash/sortBy';
import { minBy, maxBy } from 'lodash';
import {
  fetchElementList,
  insertElement,
  saveElementList,
  delComponent,
} from '@/api/design';
import { debounce, isJiami, Decrypt, Encrypt } from '_u/utils';
import { menuAppProperties, menuProperties } from './constants/global';
import Header from './Layout/Header/index';
import Sidebar from './Layout/Sidebar/index';

const SelectedArea = () => import('./Layout/SelectedArea/index');
const UnderlyingBasicConfig = () =>
  import('./configComponents/UnderlyingBasicConfig/index');
const CommonContainer = () => import('./basicWidgets/ComponentContainer/index');
const RightClickOperation = () => import('./Layout/RightClickOperation/index');
const ImageBoxConfig = () => import('./configComponents/ImageBoxConfig/index');
const BasicPieChartConfig = () =>
  import('./configComponents/BasicPieChartConfig/index');
const BasicBarChartConfig = () =>
  import('./configComponents/BasicBarChartConfig/index');
const BasicLineChartConfig = () =>
  import('./configComponents/BasicLineChartConfig/index');
const CircleProgressBarConfig = () =>
  import('./configComponents/CircleProgressBarConfig/index');
const TransverseBarChartConfig = () =>
  import('./configComponents/TransverseBarChartConfig/index');
const HorizontalProgressBarConfig = () =>
  import('./configComponents/HorizontalProgressBarConfig/index');
const ColumnLineMixConfig = () =>
  import('./configComponents/ColumnLineMixConfig/index');
const DashboardConfig = () =>
  import('./configComponents/DashboardConfig/index');
const SingleLineTextHomeConfig = () =>
  import('./configComponents/SingleLineTextHomeConfig/index');
const ApprovalComConfig = () =>
  import('./configComponents/ApprovalComConfig/propertyConfig');
const GeneralTableConfig = () =>
  import('./configComponents/GeneralTableConfig/index');
const BackgroundBoxConfig = () =>
  import('./configComponents/BackgroundBoxConfig/index');
const RealTimeConfig = () => import('./configComponents/RealTimeConfig/index');
const RadarChartConfig = () =>
  import('./configComponents/RadarChartConfig/index');
const AuxiliaryLineConfig = () => import('./configComponents/LineConfig/index');
const NoticeConfig = () => import('./configComponents/NoticeConfig/index');
const RoseChartConfig = () =>
  import('./configComponents/RoseChartConfig/index');
const LiquidfillConfig = () =>
  import('./configComponents/LiquidfillConfig/index');
const FunnelChartConfig = () =>
  import('./configComponents/FunnelChartConfig/index');
const TabComponentConfig = () =>
  import('./configComponents/TabComponentConfig/propertyConfig');
const CarouselChartConfig = () =>
  import('./configComponents/CarouselChartConfig/index');
const IndicatorConfig = () =>
  import('./configComponents/IndicatorConfig/index');
const DropdownBoxConfig = () =>
  import('./configComponents/DropdownBoxConfig/propertyConfig');
const BatchOperationConfig = () =>
  import('./configComponents/BatchOperation/BatchOperation');
const TimeFilteringConfig = () =>
  import('./configComponents/TimeFilteringConfig/propertyConfig');
const VideoConfig = () => import('./configComponents/VideoConfig/index');
const DataSwitchingConfig = () =>
  import('./configComponents/DataSwitchingConfig/propertyConfig');
const BasicMapConfig = () => import('./configComponents/BasicMapConfig/index');
const CanvasDrawingConfig = () =>
  import('./configComponents/CanvasDrawingConfig/propertyConfig');
const InfoPresentationConfig = () =>
  import('./configComponents/InfoPresentationConfig/index');
const SankeyConfig = () => import('./configComponents/SankeyConfig/index');

export default {
  data() {
    return {
      isControlled: false, // 是否受控
      newBoxProps: {}, // 画框框的大小
      newBoxPropsCopy: {}, // 记录画框属性
      isMousedown: false, // 鼠标是否按下
      isMouseOver: false, // 鼠标是否移动
      startPoint: {
        x: 0,
        y: 0,
      }, // 鼠标按下的位置
      mouseOverPoint: {
        x: 0,
        y: 0,
      }, // 鼠标移动的位置
      updateKey: 0, // 强制更新表示
      key: 0,
      isOpen: true, // 默认展开
      scale: 0, // 缩放比列
      list: [], // 组件集合
      menuProperties: {
        // 菜单属性
      },
      rightClickInfo: {}, // 右键鼠标集合
      timer: null,
      autoScale: true, // 自适应缩放
      activateComponentKey: 'UnderlyingBasic', // 激活组件名称
      activeComponent: {}, // 激活的组件
      isCtrl: false, // 按住ctrl键
      needUpdateArr: [], // 记录下需要改变的数据
      selectedComponentArr: [], // 选中得组件集合
    };
  },

  components: {
    CanvasDrawingConfig,
    BasicMapConfig,
    DataSwitchingConfig,
    VideoConfig,
    ApprovalComConfig,
    TimeFilteringConfig,
    DropdownBoxConfig,
    BatchOperationConfig,
    IndicatorConfig,
    CarouselChartConfig,
    TabComponentConfig,
    FunnelChartConfig,
    LiquidfillConfig,
    RoseChartConfig,
    CommonContainer,
    NoticeConfig,
    Header,
    Sidebar,
    SelectedArea,
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
    RealTimeConfig,
    HorizontalProgressBarConfig,
    RadarChartConfig,
    AuxiliaryLineConfig,
    InfoPresentationConfig,
    SankeyConfig,
  },

  computed: {
    reduceSelectedList() {
      const n = this.selectedComponentArr.length;
      if (n === 1 || !n) return [];
      return this.selectedList;
    },
    selectedList() {
      // 被选中的数组
      // eslint-disable-next-line max-len
      return this.selectedComponentArr.map((item) =>
        this.list.find((com) => com.componentId === item),
      );
    },
    getSelectedObjStyles() {
      return function (params) {
        return {
          width: `${params.width}px`,
          height: `${params.height}px`,
          top: `${params.top}px`,
          left: `${params.left}px`,
          position: 'absolute',
          display: 'block',
          border: '1px solid red',
        };
      };
    },
    getSelectedZoomRootStyles() {
      // 设计区域大小，当大缩小设置
      return function () {
        const { width, height } = this.menuProperties;
        let obj = {
          transform: `scale(${this.scale}, ${this.scale})`,
          width: `${width}px`,
          height: `${height}px`,
        };
        const { clientType } = sessionStorage;
        if (+clientType === 2) {
          obj = {
            ...obj,
            left: '50%',
            marginLeft: `-${(width * this.scale) / 2}px`,
          };
        }
        return obj;
      };
    },

    getStylesBgUrl() {
      return function () {
        const { bgImage, bgColor } = this.menuProperties;
        return `background-image:url(${
          this.$parseImgUrl(bgImage) || ''
        });background-color:${bgColor || ''} `;
      };
    },
    showList() {
      return this.list.filter((item) => item.isShow);
    },
    getStylesStransformScale() {
      // 设计区域大小，当大缩小设置
      return function () {
        const {
          width,
          height,
          enableShadows,
          xShadow,
          yShadow,
          shadowDistance,
          shadowColor,
          blurRadius,
          bgImage,
        } = this.menuProperties;
        let obj = {
          transform: `scale(${this.scale}, ${this.scale})`,
          width: `${width}px`,
          height: `${height}px`,
          backgroundImage: `url('${this.$parseImgUrl(bgImage) || ''}')`,
        };
        if (enableShadows) {
          obj = {
            ...obj,
            'box-shadow': `${xShadow}px ${yShadow}px ${blurRadius}px ${shadowDistance}px ${shadowColor}`,
          };
        }
        const { clientType } = sessionStorage;
        if (+clientType === 2) {
          obj = {
            ...obj,
            left: '50%',
            marginLeft: `-${(width * this.scale) / 2}px`,
          };
        }
        return obj;
      };
    },
    Point() {
      // eslint-disable-next-line max-len
      const x =
        this.mouseOverPoint.x === 0
          ? this.startPoint.x
          : Math.min(this.startPoint.x, this.mouseOverPoint.x);
      // eslint-disable-next-line max-len
      const y =
        this.mouseOverPoint.y === 0
          ? this.startPoint.y
          : Math.min(this.startPoint.y, this.mouseOverPoint.y);
      return {
        x: Math.round(x * this.scale),
        y: Math.round(y * this.scale),
      };
    },
    size() {
      // eslint-disable-next-line max-len
      const width =
        this.mouseOverPoint.x === 0
          ? 0
          : Math.abs(this.startPoint.x - this.mouseOverPoint.x);
      // eslint-disable-next-line max-len
      const height =
        this.mouseOverPoint.y === 0
          ? 0
          : Math.abs(this.startPoint.y - this.mouseOverPoint.y);
      return {
        width: Math.round(width * this.scale),
        height: Math.round(height * this.scale),
      };
    },
  },

  mounted() {
    this.initElementList();
    window.addEventListener('resize', () => {
      this.initScaling();
    });
    window.addEventListener('keyup', this.setComponentStyles);
    this.$nextTick(() => {
      this.drawGrid();
    });
    document
      .querySelector('.homePageContent__main--content')
      .addEventListener('scroll', this.resetDraw);
    this.keydown();
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
      },
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
      },
    },
    menuProperties: {
      deep: true,
      immediate: false,
      handler() {
        this.$nextTick(() => {
          this.drawGrid();
        });
      },
    },
    selectedComponentArr: {
      handler(v) {
        if (v.length && v && v.length !== 1) {
          this.$nextTick(() => {
            this.toMakeBox(this.selectedList);
          });
        } else if (v.length === 1) {
          this.newBoxProps = {};
          this.newBoxPropsCopy = {};
          this.needUpdateArr = [];
        }
        this.resetRightConfigArea();
      },
    },
  },
  methods: {
    getWrapWidth() {
      // 获取容器宽度
      const w1 = document
        .querySelector('.homePageContent__main--content')
        .getBoundingClientRect().width;
      const w2 = document
        .querySelector('.homePageContent__main--area')
        .getBoundingClientRect().width;
      return { w1, w2 };
    },
    click(obj) {
      // 在画框中点击控件，需要做取消这个组件
      const i = this.selectedComponentArr.findIndex(
        (item) => item === obj.componentId,
      );
      if (i === -1) return;
      this.selectedComponentArr.splice(i, 1);
    },
    dragging(n) {
      if (this.isControlled) return;
      const moveX = n.left - this.newBoxProps.left;
      const moveY = n.top - this.newBoxProps.top;
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(moveX) || isNaN(moveY)) return;
      debounce(this.moveChart(moveX, moveY), 200);
    },
    resize({ left, top, width, height }) {
      if (this.isControlled) return;
      const { left: bl, top: bt, width: bw, height: bh } = this.newBoxProps;
      const lm = left - bl; // left 移动的距离
      const lt = top - bt; // top 移动的距离
      const ws = width - bw; // 宽度移动比列
      const hs = height - bh; // 高度移动距离
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(lm) || isNaN(lt) || isNaN(ws) || isNaN(hs)) return;
      debounce(this.resizeChart({ lm, lt, ws, hs }), 200);
    },
    async batchChangeLayoutOfSelect(type) {
      this.isControlled = true;
      switch (type) {
        case 'doLeft': // 往左对齐
          await this.toLeftAndTop('left');
          break;
        case 'doAlignTop': // 上对齐
          await this.toLeftAndTop('top');
          break;
        case 'doRight': // 右对齐
          await this.toRightAndBottom('right');
          break;
        case 'doBottomJustify': // 右对齐
          await this.toRightAndBottom('bottom');
          break;
        case 'doAlignLeftAndRight': // 左右居中对齐
          await this.doAlignLeftAndRight();
          break;
        case 'doAlignUpAndDown': // 左右居中对齐
          await this.doAlignUpAndDown();
          break;
        default:
          this.isControlled = false;
          return;
      }
      this.isControlled = false;
    },
    async doAlignUpAndDown() {
      const { top, height } = this.newBoxPropsCopy;
      const centerLine = height / 2 + top; // 大盒子中心线
      // eslint-disable-next-line no-restricted-syntax
      for (const key of this.selectedComponentArr) {
        const i = this.list.findIndex((item) => item.componentId === key);
        const current = this.list[i];
        if (current) {
          const { top: ct, height: ch } = current;
          const currentLine = ch / 2 + ct;
          const obj = {
            ...this.list[i],
            top: Math.round(centerLine - currentLine + ct),
          };
          this.$set(this.list, i, obj);
        }
      }
      this.newBoxProps = {};
      this.newBoxPropsCopy = {};
      this.$nextTick(async () => {
        await this.toMakeBox(this.selectedList);
      });
    },
    async doAlignLeftAndRight() {
      const { left, width } = this.newBoxPropsCopy;
      const centerLine = width / 2 + left; // 大盒子中心线
      // eslint-disable-next-line no-restricted-syntax
      for (const key of this.selectedComponentArr) {
        const i = this.list.findIndex((item) => item.componentId === key);
        const current = this.list[i];
        if (current) {
          const { left: cl, width: cw } = current;
          const currentLine = cw / 2 + cl;
          const obj = {
            ...this.list[i],
            left: Math.round(centerLine - currentLine + cl),
          };
          this.$set(this.list, i, obj);
        }
      }
      this.newBoxProps = {};
      this.newBoxPropsCopy = {};
      this.$nextTick(async () => {
        await this.toMakeBox(this.selectedList);
      });
    },
    async toRightAndBottom(type) {
      // 右下通用
      const maxObj = maxBy(this.selectedList, (item) => {
        const { left, width, top, height } = item;
        if (type === 'right') {
          return left + width;
        }
        if (type === 'bottom') {
          return top + height;
        }
      });
      // eslint-disable-next-line no-restricted-syntax
      for (const key of this.selectedComponentArr) {
        const i = this.list.findIndex((item) => item.componentId === key);
        const current = this.list[i];
        if (current && current.componentId !== maxObj.componentId) {
          let target = {};
          if (type === 'right') {
            const maxNum = maxObj.left + maxObj.width;
            target = {
              left: maxNum - this.list[i].width,
            };
          }
          if (type === 'bottom') {
            const maxNum = maxObj.top + maxObj.height;
            target = {
              top: maxNum - this.list[i].height,
            };
          }
          const obj = {
            ...current,
            ...target,
          };
          this.$set(this.list, i, obj);
        }
      }
      this.newBoxProps = {};
      this.newBoxPropsCopy = {};
      this.$nextTick(async () => {
        await this.toMakeBox(this.selectedList);
      });
    },
    async toLeftAndTop(type) {
      // 左上通用方法
      const minObj = minBy(this.selectedList, type);
      // eslint-disable-next-line no-restricted-syntax
      for (const key of this.selectedComponentArr) {
        const i = this.list.findIndex((item) => item.componentId === key);
        const obj = {
          ...this.list[i],
          [type]: minObj[type],
        };
        this.$set(this.list, i, obj);
      }
      this.newBoxProps = {};
      this.newBoxPropsCopy = {};
      this.$nextTick(async () => {
        await this.toMakeBox(this.selectedList);
      });
    },
    async batchChangeSelected(obj) {
      // 改变位置
      const { left: lm, top: lt, width: ws, height: hs } = obj;
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(lm) || isNaN(lt) || isNaN(ws) || isNaN(hs)) return;
      await this.resizeChart({ lm, lt, ws, hs }, this.selectedList);
      await this.toMakeBox(this.selectedList);
    },
    async resizeChart({ lm, lt, ws, hs }, comArr) {
      // 控件大小变化
      const arr = comArr && Array.isArray(comArr) ? comArr : this.needUpdateArr;
      // eslint-disable-next-line no-restricted-syntax
      for (const key of this.selectedComponentArr) {
        const current = arr.find((item) => item.componentId === key);
        if (current) {
          const { componentId, top, left, width, height } = current;
          const i = this.list.findIndex(
            (item) => item.componentId === componentId,
          );
          const obj = {
            ...this.list[i],
            top: Math.round(top + lt),
            left: Math.round(left + lm),
            width: Math.round(width + ws),
            height: Math.round(height + hs),
          };
          this.$set(this.list, i, obj);
        }
      }
      await this.toMakeBox(this.selectedList);
    },
    moveChart(moveX, moveY) {
      // 控件移动
      // const newList = deepClone(this.needUpdateArr);
      this.selectedComponentArr.forEach((key) => {
        const current = this.needUpdateArr.find(
          (item) => item.componentId === key,
        );
        if (current) {
          const i = this.list.findIndex(
            (item) => item.componentId === current.componentId,
          );
          const obj = {
            ...this.list[i],
            top: Math.round(current.top + moveY),
            left: Math.round(current.left + moveX),
          };
          this.$set(this.list, i, obj);
        }
      });
      this.toMakeBox(this.selectedList);
    },
    resetDraw() {
      this.isMouseOver = false;
      this.isMousedown = false;
      this.startPoint = {
        x: 0,
        y: 0,
      };
      this.mouseOverPoint = {
        x: 0,
        y: 0,
      };
    },
    keydown() {
      // 用户按下Shift后变量isCtrl为true
      document.onkeydown = (e) => {
        const el = e || window.event;
        if (el.keyCode === 16) {
          this.isCtrl = true;
        }
      };
      // 用户松开ctrl后变量isCtrl为false
      document.onkeyup = (e) => {
        const el = e || window.event;
        if (el.keyCode === 16) {
          this.isCtrl = false;
        }
      };
    },
    async setComponentStyles(e) {
      e.stopPropagation();
      e.preventDefault();
      if (!this.selectedComponentArr.length) return;
      if (![37, 38, 39, 40].includes(e.keyCode)) return;
      const { width, height } = this.menuProperties;
      const elementList = deepClone(this.list);
      this.selectedComponentArr.forEach((componentId) => {
        const index = elementList.findIndex(
          (element) => element.componentId === componentId,
        );
        const current = elementList[index];
        const { left, top } = current;
        if (e.keyCode === 37 && left >= 1) {
          current.left -= 1;
        }
        if (e.keyCode === 40 && top < height) {
          current.top += 1;
        }
        if (e.keyCode === 38 && top >= 1) {
          current.top -= 1;
        }
        if (e.keyCode === 39 && left < width) {
          current.left += 1;
        }
        elementList.splice(index, 1, current);
      });
      this.list = elementList;
      await this.toMakeBox(this.selectedList);
    },
    async initElementList() {
      // 获取控件列表
      const res = await fetchElementList({
        id: this.$route.params.id || this.$route.query.menuId,
      });
      const { designJson, list } = res;
      const newList = list.map((item) => {
        const {
          id,
          designJson: elementDesign,
          sqlResponse,
          sqlFilterResponse,
        } = item;

        const config = JSON.parse(elementDesign);
        if (
          config.panelConfig &&
          config.panelConfig.curPaneObj &&
          config.panelConfig.curPaneObj.panelFilter
        ) {
          config.panelConfig.curPaneObj.panelFilter.forEach((mf) => {
            if (mf.filterTermSql) {
              mf.filterTermSql = isJiami(mf.filterTermSql)
                ? Decrypt(mf.filterTermSql)
                : mf.filterTermSql;
            }
          });
        }
        if (config.skipMenuConfig && Array.isArray(config.skipMenuConfig)) {
          config.skipMenuConfig.forEach((m) => {
            m.menuFilter.forEach((mf) => {
              if (mf.filterTermSql) {
                mf.filterTermSql = isJiami(mf.filterTermSql)
                  ? Decrypt(mf.filterTermSql)
                  : mf.filterTermSql;
              }
            });
          });
        }
        const { SqlDataConfig } = config;
        SqlDataConfig.SQL = isJiami(SqlDataConfig.SQL)
          ? Decrypt(SqlDataConfig.SQL)
          : SqlDataConfig.SQL;
        return {
          ...config,
          id,
          SqlDataConfig: {
            ...SqlDataConfig,
            SQLResponse: sqlResponse,
            SQLFilterResponse: sqlFilterResponse,
          },
        };
      });
      this.updateList(newList);
      const { clientType } = sessionStorage;
      // eslint-disable-next-line max-len
      this.menuProperties = designJson
        ? JSON.parse(designJson)
        : +clientType === 2
        ? menuAppProperties
        : menuProperties;
      if (+clientType !== 1) {
        this.autoScale = false;
        this.scale = 1;
      }
      this.initScaling();
    },
    async doSave() {
      // 保存控件
      const newList = [];
      this.list.forEach((item) => {
        const {
          dataType,
          componentId,
          id = '',
          SqlDataConfig = {},
          ...rest
        } = item;
        if (
          item.panelConfig &&
          item.panelConfig.curPaneObj &&
          item.panelConfig.curPaneObj.panelFilter
        ) {
          item.panelConfig.curPaneObj.panelFilter.forEach((mf) => {
            if (mf.filterTermSql) {
              mf.filterTermSql = Encrypt(mf.filterTermSql);
            }
          });
        }
        if (item.skipMenuConfig && Array.isArray(item.skipMenuConfig)) {
          item.skipMenuConfig.forEach((m) => {
            m.menuFilter.forEach((mf) => {
              if (mf.filterTermSql) {
                mf.filterTermSql = Encrypt(mf.filterTermSql);
              }
            });
          });
        }
        const obj = {
          dataJson: '',
          dataType,
          designJson: JSON.stringify(item),
          id,
          type: 0,
          homepageId: this.$route.params.id || this.$route.query.menuId,
        };
        if (dataType === 3) {
          obj.dataJson = JSON.stringify({
            SQL: Encrypt(SqlDataConfig.SQL),
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
        homepageId: this.$route.params.id || this.$route.query.menuId,
        list: newList,
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
    updateList(v) {
      console.log(v);
      this.list = v.sort((a, b) => b.stylesObj.zIndex - a.stylesObj.zIndex);
      this.toMakeBox(this.selectedList);
    },
    layoutBatch() {
      // 退出批量操作
      this.selectedComponentArr = [];
      this.activeComponent = {};
      this.activateComponentKey = 'UnderlyingBasic';
      this.rightClickInfo = {};
      this.newBoxProps = {};
      this.newBoxPropsCopy = {};
    },
    async batchDel() {
      // 批量删除
      if (!this.selectedComponentArr.length) return;
      const elementList = deepClone(this.list);

      const arr = [];
      try {
        this.selectedComponentArr.forEach((componentId) => {
          const index = elementList.findIndex(
            (element) => element.componentId === componentId,
          );
          arr.push(elementList[index].id);
          elementList.splice(index, 1);
        });
        await delComponent({ id: arr.join(',') });

        this.list = elementList;
        this.layoutBatch();
      } catch (e) {
        this.$message.error('删除失败!');
      }
    },
    async dragEnd({ componentInfo, e }) {
      const { pageX, pageY } = e;
      const { height, width } = componentInfo;
      // eslint-disable-next-line no-mixed-operators
      const lastTop = (pageY - 66) / this.scale - (height / 2) * this.scale;
      // eslint-disable-next-line no-mixed-operators
      const lastLeft =
        (pageX - 280 - 20) / this.scale - (width * this.scale) / 2;
      const top = Math.ceil(lastTop);
      const left = Math.ceil(lastLeft);
      const { scrollTop, scrollLeft } = document.querySelector(
        '.homePageContent__main--content',
      );
      const positionsObj = {
        top: top + scrollTop / this.scale,
        left: left + scrollLeft,
      };
      const { clientType } = sessionStorage;
      if (+clientType === 2) {
        // const w1 = document
        //   .querySelector('.homePageContent__main--content')
        //   .getBoundingClientRect().width;
        // const w2 = document
        //   .querySelector('.homePageContent__main--area')
        //   .getBoundingClientRect().width;
        const { w1, w2 } = this.getWrapWidth();
        positionsObj.left =
          pageX - 300 - (w1 - w2) / 2 - (width * this.scale) / 2;
      }
      const designObj = {
        ...componentInfo,
        ...positionsObj,
        type: 0,
      };
      const newObj = JSON.parse(JSON.stringify(designObj));
      const data = await insertElement(newObj);
      const newElement = {
        ...newObj,
        id: data,
        homepageId: this.$route.params.id || this.$route.query.menuId,
      };
      this.list.push(newElement);
      this.selectedComponentArr = [newElement.componentId];
      this.activeComponent = newElement;
      this.activateComponentKey = newElement.componentName;
    },
    changeAutoScale() {
      // 选择自适应
      this.autoScale = true;
      this.updateKey += 1;
      this.initScaling();
    },
    initScaling(callback) {
      // 初始化缩放比例
      const dom = document.body.querySelector(
        '.homePageContent__main--content',
      );
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
    onlyChangeScalc(v) {
      this.scale = v;
      // this.updateKey += 1;
      this.$nextTick(() => {
        this.drawGrid();
      });
    },
    changeScale(v) {
      this.scale = v;
      if (v) {
        this.autoScale = false;
      } else {
        this.autoScale = true;
      }
      this.$nextTick(() => {
        this.drawGrid();
        document
          .querySelector('.homePageContent__main--content')
          .addEventListener('scroll', this.resetDraw);
      });
    },
    changeScaleObj({ value }) {
      this.autoScale = false;
      this.scale = value;
    },
    async handleClick(e, key) {
      // 鼠标松开
      e.stopPropagation();
      if (this.isMousedown && this.isMouseOver) {
        // 判断是否再画区域
        this.rightClickInfo = {};
        await this.reduceSelectArr();
        this.resetDraw();
      } else {
        const classList = Array.from(e.target.classList);
        if (classList.includes(key)) {
          this.layoutBatch();
        }
        this.resetDraw();
      }
    },
    handleMouseDown(e) {
      // 鼠标按下
      e.stopPropagation();
      const classList = Array.from(e.target.classList);
      const classArr = classList.filter((item) =>
        [
          'homePageContent__main--area',
          'homePageContent__main--content',
        ].includes(item),
      );
      if (classArr.length) {
        // 如果在设计区，记录开始设计的位置
        this.isMousedown = true;
        const { scrollTop, scrollLeft } = document.querySelector(
          '.homePageContent__main--content',
        );
        this.startPoint = {
          x: (e.clientX - 300 + scrollLeft) / this.scale,
          y: (e.clientY - 20 - 46 + scrollTop) / this.scale,
        };
        this.selectedComponentArr = [];
        this.newBoxProps = {};
        this.newBoxPropsCopy = {};
        // this.resetRightConfigArea();
      } else if (classList.includes('selectedHook') && this.isCtrl) {
        console.log(111);
      } else {
        // 点击在控件上
        if (JSON.stringify(this.newBoxProps) !== '{}' && !this.isCtrl) {
          this.layoutBatch();
        }
        this.isMousedown = false;
        this.startPoint = {
          x: 0,
          y: 0,
        };
        this.newBoxProps = {};
        this.newBoxPropsCopy = {};
      }
    },
    handleMouseMove(e) {
      // 鼠标移动
      if (this.isMousedown) {
        this.isMouseOver = true;
        const { scrollTop, scrollLeft } = document.querySelector(
          '.homePageContent__main--content',
        );
        this.mouseOverPoint = {
          x: (e.clientX - 300 + scrollLeft) / this.scale,
          y: (e.clientY - 20 - 46 + scrollTop) / this.scale,
        };
        // 设置画中的组件
        // this.setSelectedComponent();
      } else {
        this.isMouseOver = false;
        this.mouseOverPoint = {
          x: 0,
          y: 0,
        };
      }
    },
    setSelectedComponent() {
      // 边画边处理数据
      const { clientType } = sessionStorage;
      let { x } = this.Point;
      if (+clientType === 2) {
        const { w1, w2 } = this.getWrapWidth();
        x -= (w1 - w2) / 2;
      }
      const drawBottom = this.Point.y + this.size.height;
      const drawRight = x + this.size.width;
      const arr = [];
      const needQuickArr = [];
      this.showList.forEach((item) => {
        const { left = 0, top = 0, width = 0, height = 0 } = item;
        const designLeft = left * this.scale;
        const designTop = top * this.scale;
        const designWidth = width * this.scale;
        const designHeight = height * this.scale;
        if (
          designLeft > x &&
          designTop > this.Point.y &&
          drawBottom > designHeight + designTop &&
          drawRight > designWidth + designLeft
        ) {
          arr.push(item.componentId);
          needQuickArr.push(item);
        }
      });
      return {
        selectArr: arr,
        needQuickArr,
      };
    },
    handleMouseUp() {
      // 鼠标松开
      // console.log('鼠标松开', Array.from(e.target.classList));
      // this.isMousedown = false;
    },
    reduceSelectArr() {
      const {
        selectArr,
        // needQuickArr
      } = this.setSelectedComponent();
      this.selectedComponentArr = selectArr;
      // this.resetRightConfigArea();
      // if (selectArr.length > 1) {
      //   this.toMakeBox(needQuickArr);
      // }
    },
    async toMakeBox(needQuickArr) {
      // 生成一个新盒子
      const n = needQuickArr.length;
      if (!n || n === 1) return;
      const lastArr = needQuickArr.map((item) => ({
        ...item,
        bottom: item.top + item.height,
        right: item.left + item.width,
      }));
      const leftArr = sortBy(lastArr, (item) => item.left);
      const bottomArr = sortBy(lastArr, (item) => item.bottom);
      const topArr = sortBy(lastArr, (item) => item.top);
      const rightArr = sortBy(lastArr, (item) => item.right);
      const minLeft = leftArr[0]; // left最小值组件
      const maxLeft = rightArr.at(-1); // left最大值组件
      const minTop = topArr[0]; // top最小值
      const maxTop = bottomArr.at(-1); // top最大值
      const { left } = minLeft;
      const { top } = minTop;
      const width = maxLeft.right - left;
      const height = maxTop.bottom - top;
      this.setBoxProps({ left, top, width, height });
      this.needUpdateArr = deepClone(needQuickArr);
    },
    setBoxProps({ left, top, width, height }, onlyCopyBox) {
      // 设置方框属性
      if (onlyCopyBox) {
        this.newBoxPropsCopy = { left, top, width, height };
        return;
      }
      this.newBoxPropsCopy = { left, top, width, height };
      this.newBoxProps = { left, top, width, height };
    },

    resetRightClickInfo() {
      // 隐藏右击
      this.rightClickInfo = {};
    },
    doUpdateActiveComponent(config) {
      // 更新激活组件
      if (this.isCtrl) {
        // 按住ctrl键
        // eslint-disable-next-line max-len
        const index = this.selectedComponentArr.findIndex(
          (item) => item === config.componentId,
        );
        if (index === -1) {
          this.selectedComponentArr.push(config.componentId);
        } else {
          this.selectedComponentArr.splice(index, 1);
        }
        // this.resetRightConfigArea();
      } else {
        // 没有按住ctrl键
        this.selectedComponentArr = config.componentId
          ? [config.componentId]
          : [];
        this.activeComponent = config;
        this.activateComponentKey = config.componentName || 'UnderlyingBasic';
      }
      this.rightClickInfo = {};
    },
    resetRightConfigArea() {
      // 重置右边配置区域
      if (!this.selectedComponentArr.length) {
        // 还原全局配置
        this.activeComponent = {};
        this.activateComponentKey = 'UnderlyingBasic';
      }
      if (this.selectedComponentArr.length === 1) {
        const current = this.list.find(
          (item) => item.componentId === this.selectedComponentArr[0],
        );
        this.activeComponent = current;
        this.activateComponentKey = current.componentName || 'UnderlyingBasic';
      }
      if (this.selectedComponentArr.length > 1) {
        this.activeComponent = {};
        this.activateComponentKey = 'BatchOperation';
      }
    },
    doRightClick(e) {
      // 右键处理
      const { pageX, pageY } = e;
      this.rightClickInfo = {
        pageX,
        pageY,
      };
    },
    drawGrid() {
      //  画栅格
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
      window.removeEventListener('keyup', this.setComponentStyles);
    }
    const dom = document.querySelector('.homePageContent__main--content');
    if (dom) {
      dom.removeEventListener('scroll', this.resetDraw);
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
      this.observer = null;
    }
    document.onkeydown = function () {};
    document.onkeyup = function () {};
  },
  name: 'homeMenuConfig',
};
</script>

<style lang="scss" scoped>
.homePageConfig {
  width: 100%;
  height: 100%;
  background-color: #f6f6f8;

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
      z-index: 1;
    }

    &__main {
      flex: 1;
      display: flex;
      justify-content: center;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;

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
        box-shadow: 0px 0px 6px 0px rgb(0 0 0 / 12%);

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

          .dragCom.active {
            ::v-deep {
              .vdr-stick {
                display: none;
              }
            }
          }
          .dragCom.dragOnlyOne.active {
            ::v-deep {
              .vdr-stick {
                display: block;
              }
            }
            &:before {
              outline: 1px solid red;
            }
          }

          .batchDrag {
            ::v-deep {
              .content-container {
                pointer-events: none;
              }
            }
          }

          .selectedHook {
            z-index: 100;

            &.active {
              z-index: 999;
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

        .design__bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          max-width: 100%;
          max-height: 100%;
          background-repeat: no-repeat;
          transition: all 0.3s ease;
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

      .homePageContent__selected--zoom {
        width: 1920px;
        height: 1080px;
        z-index: 8;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        transform-origin: left top;
        //pointer-events: none;
      }
    }

    &__attribute {
      width: 300px;
      height: 100%;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.2);
    }

    &__fold {
      position: absolute;
      width: 12px;
      height: 68px;
      margin-top: -6px;
      top: 45%;
      left: 280px;
      background: #ffffff;
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.18);
      border-radius: 0px 4px 4px 0px;
      cursor: pointer;
      z-index: 0;
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
        content: '';
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
        content: '';
        position: absolute;
        top: 32px;
        left: 0px;
        border-width: 4px;
        border-style: solid;
        border-color: transparent #333333 transparent transparent;
      }
    }
  }
}
</style>
