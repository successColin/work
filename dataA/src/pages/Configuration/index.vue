<!-- 页面 -->
<template>
  <div class="wrap" @click="doShowComponent">
    <div class="headerWrap">
      <div class="headerWrap__manage">
        <c-button @click="goback" class="headerWrap__back">
          <span class="icon-fanhui iconfont"></span> 返回主页
        </c-button>
        <c-button
            class="headerWrap__setting"
            @click="cancelZoomVisible"
            :class="{zoomActive:zoomVisible}"
        >
          <el-tooltip class="item" effect="dark" content="图层管理" placement="top">
            <span class="icon-tucengguanli iconfont" style="font-size: 18px;"></span>
          </el-tooltip>
        </c-button>
      </div>
      <div class="headerWrap__ope">
        <c-button class="headerWrap__setting" @click="doPreview">
          <span class="iconfont icon-a-dingbuyulandaping"></span> 预览
        </c-button>
        <c-button @click="toggleScreen" class="headerWrap__setting">
          <span class="icon-shezhi iconfont"></span> 大屏设置
        </c-button>
        <c-button
            type="primary"
            @click="handleSaveConfig"
        >保存
        </c-button>
        <c-button
            type="primary"
            @click="publish"
        >发布设置
        </c-button>
      </div>
      <div class="headerWrap__scale">
        <div class="autoZoomWrap">
          <c-select :options="getOptions" :value="autoValue" @change="changeAutoValue"></c-select>
        </div>
        <div class="sliderWrap">
          <div @click="reduce"><span class="icon-suoxiao iconfont"></span></div>
          <div class="slider">
            <el-slider :max="getMax" v-model="getTransform" :step="4" @input="changeScale1"
                       @change="changeScale"></el-slider>
          </div>
          <div @click="addition"><span class="icon-fangda iconfont"></span></div>
        </div>
      </div>
    </div>
    <div class="contentWrap">
      <!-- 左侧分组列表 -->
      <div class="assemblyWrap">
        <div
            v-for="(item) in configGroup"
            :key="item.id"
            class="assemblyBox"
            :class="{active: item.id===index.id}"
            @click.stop="getComponents(item)"
        >
          <span class="iconfont" :class="{[item.icon]: true}"></span>
          <div class="assemblyBox__title">{{ item.name }}</div>
        </div>
      </div>
      <!-- 中间设计列表 -->
      <div class="designContent">
        <div class="designWrap" @click="activeComponent={}">
          <div class="designBg" :key="updateKey" :style="getStylesStransformScalc()">
            <!-- 设计区域 -->
            <div class="design__area" @click.stop="handleClick">
              <component
                  :scale="Number(transitionSacle)"
                  :config="configItem"
                  :is="configItem.componentName"
                  v-for="(configItem, i) in configArr"
                  :key="`${configItem.componentId}_${i}`"
                  :activeComponent="activeComponent"
                  @updateActiveComponent="doUpdateActiveComponent"
                  @rightClickComponent="doRightClick"
                  :bgConfig="getBgConfig"
              >
              </component>
            </div>
            <!-- 背景图 -->
            <div class="design__bg" :style="getStylesBgUrl()"></div>
            <video class="design__video" loop autoplay :src="getBgConfig.bgImage"></video>
            <!--栅格区域-->
            <div class="design_grid">
              <canvas ref="bgCanvas" width="1920px" height="1080px"
                      class="canvasWrap"></canvas>
            </div>
          </div>
          <Loading v-if="isShow"/>
        </div>
      </div>
      <!-- 左侧组件列表 -->
      <div class="componentsBox" v-show="isShowComponent">
        <draggable
            v-model="getComponentList"
            :sort="false"
            @end="end"
            @start="choose"
            animation="300"
            :options="{group:{name: 'content',pull:'clone'},sort: false}"
        >
          <transition-group>
            <div class="componentsBox__item"
                 v-for="item in getComponentList"
                 :key="item.componentName"
            >
              <div class="componentsBox__item__img">
                <img :src="item.url" alt="">
              </div>
              <div class="componentsBox__item__name">{{ item.name }}</div>
            </div>
          </transition-group>
        </draggable>
      </div>
    </div>
    <!-- 右侧大屏属性配置 -->
    <div
        class="screenSettingWrap"
        v-if="isShowScreen"
    >
      <screen-bg-setting :type="type"/>
    </div>
    <!-- 右侧组件属性配置 -->
    <div class="othersConfigWrap">
      <div class="headerTitle">{{ activeComponent.name }}设置</div>
      <component
          v-if="activeComponent&&activeComponent.componentName"
          :activeComponent="activeComponent"
          :is="`${activeComponent.componentName}Config`"
      ></component>
    </div>
    <ZoomCenter
        :zoomVisible="zoomVisible"
        @updateActiveComponent="doUpdateActiveComponent"
        :activeComponent="activeComponent"
    />
    <RightClick
        :rightClick="rightClickInfo"
        @updateActiveComponent="doUpdateActiveComponent"
        :activeComponent="activeComponent"
    />
    <PublishSetting
        @close="close"
        :dialogVisible="dialogVisible"
        :type="type"
        :publishUrl="publishUrl"/>
    <!-- app预览 -->
    <CDialog
        :visible.sync="appVisible"
        :isNeedBtn="false"
        title="预览"
        class="preDialog"
    >
      <AppPreview v-if="appVisible" :preUrl="publishUrl"/>
    </CDialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import {createUnique, makeUrl} from '@/utils/utils';
import {getDesignList, updateOrInsertElement, delComponent, insertElement} from '@/services/design';
import {attributeCollection, configGroup, componentConfigs, screenConfig, screenAppConfig} from '@/constants/global';
import CanvasDrawingConfig from './ConfigComponents/CanvasDrawingConfig/propertyConfig';

const PublishSetting = () => import('./PublishSetting/index');
const screenBgSetting = () => import('./Components/PropertySettings/ScreenBgSetting');
const demo = () => import('./Components/Demo/index');
const SingleLineTextConfig = () => import('./ConfigComponents/SingleLineTextConfig/index');
const BackgroundBoxConfig = () => import('./ConfigComponents/BackgroundBoxConfig/propertyConfig');
const PopCloseButtonConfig = () => import('./ConfigComponents/PopCloseButtonConfig/propertyConfig');
const PopCloseButton = () => import('./Components/PopCloseButton/index');
const BasicPieChartConfig = () => import('./ConfigComponents/BasicPieChartConfig/index');
const BasicBarChartConfig = () => import('./ConfigComponents/BasicBarChartConfig/index');
const FullScreenBtnConfig = () => import('./ConfigComponents/FullScreenBtnConfig/propertyConfig');
const FullScreenBtn = () => import('./Components/FullScreenBtn/index');
const TransverseBarChartConfig = () => import('./ConfigComponents/TransverseBarChartConfig/index');
const GeneralTableConfig = () => import('./ConfigComponents/GeneralTableConfig/index');
const BasicLineChartConfig = () => import('./ConfigComponents/BasicLineChartConfig/index');
const CircleProgressBarConfig = () => import('./ConfigComponents/CircleProgressBarConfig/index');
const CircleProgressBar = () => import('./Components/CircleProgressBar/index');
const ImageBoxConfig = () => import('./ConfigComponents/ImageConfig/index');
const VideoConfig = () => import('./ConfigComponents/VideoConfig/index');
const MarqueeConfig = () => import('./ConfigComponents/MarqueeConfig/index');
const Marquee = () => import('./Components/Marquee/index');
const RealTimeConfig = () => import('./ConfigComponents/RealTimeConfig/index');
const RealTime = () => import('./Components/RealTime/index');
const AuxiliaryLineConfig = () => import('./ConfigComponents/AuxiliaryLineConfig/index');
const AuxiliaryLine = () => import('./Components/AuxiliaryLine/index');
const ColumnLineMixConfig = () => import('./ConfigComponents/ColumnLineMixConfig/index');
const DashboardConfig = () => import('./ConfigComponents/DashboardConfig/index');
const RadarChartConfig = () => import('./ConfigComponents/RadarChartConfig/index');
const RadarChart = () => import('./Components/RadarChart/index');
const Dashboard = () => import('./Components/Dashboard/index');
const ColumnLineMix = () => import('./Components/ColumnLineMix/index');
const GeneralTable = () => import('./Components/GeneralTable/index');
const BackgroundBox = () => import('./Components/BackgroundBox/index');
const SingleLineText = () => import('./Components/SingleLineText/index');
const BasicPieChart = () => import('./Components/BasicPieChart/index');
const BasicBarChart = () => import('./Components/BasicBarChart/index');
const TransverseBarChart = () => import('./Components/TransverseBarChart/index');
const HorizontalProgressBarConfig = () => import('./ConfigComponents/HorizontalProgressBarConfig/index');
const BasicLineChart = () => import('./Components/BasicLineChart/index');
const HorizontalProgressBar = () => import('./Components/HorizontalProgressBar/index');
const TabComponent = () => import('./Components/TabComponent/index');
const TimeFiltering = () => import('./Components/TimeFiltering/index');
const TabComponentConfig = () => import('./ConfigComponents/TabComponentConfig/propertyConfig');
const TimeFilteringConfig = () => import('./ConfigComponents/TimeFilteringConfig/propertyConfig');
const DataSwitchingConfig = () => import('./ConfigComponents/DataSwitchingConfig/propertyConfig');
const DataSwitching = () => import('./Components/DataSwitching/index');
const CanvasDrawing = () => import('./Components/CanvasDrawing/index');
const DropdownBoxConfig = () => import('./ConfigComponents/DropdownBoxConfig/propertyConfig');
const DocExportBtnConfig = () => import('./ConfigComponents/DocExportBtnConfig/propertyConfig');
const DocExportBtn = () => import('./Components/DocExportBtn/index');
const DropdownBox = () => import('./Components/DropdownBox/index');
const ImageBox = () => import('./Components/ImageBox/index');
const Video = () => import('./Components/Video/index');
const ZoomCenter = () => import('./ZoomCenter/index');
const RightClick = () => import('./RightClickOperation/index');
const AppPreview = () => import('./AppPreview/index');
const BasicMapConfig = () => import('./ConfigComponents/BasicMapConfig/index');
const BasicMap = () => import('./Components/BasicMap/index');
const NationalProvinceMapConfig = () => import('./ConfigComponents/NationalProvinceMapConfig/index');
const NationalProvinceMap = () => import('./Components/NationalProvinceMap/index');
const RoseChart = () => import('./Components/RoseChart/index');
const RoseChartConfig = () => import('./ConfigComponents/RoseChartConfig/index');
const FunnelChartConfig = () => import('./ConfigComponents/FunnelChartConfig/index');
const FunnelChart = () => import('./Components/FunnelChart/index');
const LiquidfillConfig = () => import('./ConfigComponents/LiquidfillConfig/index');
const Liquidfill = () => import('./Components/Liquidfill/index');
const SankeyConfig = () => import('./ConfigComponents/SankeyConfig/index');
const Sankey = () => import('./Components/Sankey/index');
const InfoPresentationConfig = () => import('./ConfigComponents/InfoPresentationConfig/index');
const InfoPresentation = () => import('./Components/InfoPresentation/index');


export default {
  data() {
    return {
      appVisible: false,
      obj: {},
      isShow: true,
      zoomVisible: false, // 图层显示
      // presetLine: [{type: 'l', site: 1000}, {type: 'v', site: 2000}],
      dialogVisible: false,
      autoValue: 0, // 默认自适应
      configGroup,
      index: {},
      dataList: [],
      updateKey: 0,
      isScreenSettingShow: false, // 是否显示大屏设置
      isShowComponent: false,
      transitionTop: 0,
      transitionSacle: 1,
      isShowBgSetting: false,
      activeComponent: {}, // 激活的组件id
      isAutoZoom: true, // 是否自动缩放，默认缩放
      rightClickInfo: {},
      type: '' // 大屏类型
    };
  },

  components: {
    PublishSetting,
    Sankey,
    SankeyConfig,
    Liquidfill,
    FunnelChart,
    FunnelChartConfig,
    LiquidfillConfig,
    RoseChartConfig,
    RoseChart,
    AppPreview,
    draggable,
    demo,
    screenBgSetting,
    SingleLineText,
    SingleLineTextConfig,
    BackgroundBoxConfig,
    GeneralTableConfig,
    TransverseBarChartConfig,
    BackgroundBox,
    ImageBoxConfig,
    BasicPieChartConfig,
    CircleProgressBarConfig,
    CircleProgressBar,
    TransverseBarChart,
    BasicPieChart,
    DashboardConfig,
    ImageBox,
    Video,
    ZoomCenter,
    RightClick,
    BasicBarChartConfig,
    BasicBarChart,
    BasicLineChartConfig,
    BasicLineChart,
    GeneralTable,
    ColumnLineMixConfig,
    ColumnLineMix,
    HorizontalProgressBarConfig,
    HorizontalProgressBar,
    Dashboard,
    AuxiliaryLineConfig,
    AuxiliaryLine,
    RealTimeConfig,
    RealTime,
    MarqueeConfig,
    TabComponentConfig,
    TabComponent,
    Marquee,
    TimeFilteringConfig,
    TimeFiltering,
    DropdownBoxConfig,
    DropdownBox,
    CanvasDrawingConfig,
    CanvasDrawing,
    FullScreenBtnConfig,
    FullScreenBtn,
    DataSwitchingConfig,
    DataSwitching,
    PopCloseButton,
    PopCloseButtonConfig,
    VideoConfig,
    RadarChartConfig,
    RadarChart,
    DocExportBtnConfig,
    DocExportBtn,
    BasicMapConfig,
    BasicMap,
    NationalProvinceMapConfig,
    NationalProvinceMap,
    InfoPresentationConfig,
    InfoPresentation
  },

  computed: {
    getOptions() {
      const options = [{
        label: '自适应',
        value: 0
      }, {
        label: '20%',
        value: 0.2
      }, {
        label: '40%',
        value: 0.4
      }, {
        label: '60%',
        value: 0.6
      }, {
        label: '80%',
        value: 0.8
      }, {
        label: '100%',
        value: 1
      }]
      if(this.type === 'PC') {return options;}
      return [...options, {
        label: '120%',
        value: 1.2
      }, {
        label: '140%',
        value: 1.4
      }, {
        label: '160%',
        value: 1.6
      }, {
        label: '180%',
        value: 1.8
      }, {
        label: '200%',
        value: 2
      }]
    },
    getMax() {
      if(this.type === 'PC') {return 100;}
      return 200;
    },
    makeId() { // jiemi
      return function (id) {
        return window.atob(id)
      }
    },
    makeToId() { // jiami
      return function (id) {
        return window.btoa(id)
      }
    },
    publishUrl() {
      const url = makeUrl();
      return `${url}${this.$route.query.id}`;
      // const {pathname, origin} = window.location;
      // const arr = pathname.split('/');
      // const n = arr.length;
      // arr[n - 1] = 'menu'
      // const newPathName = `${origin}${arr.join('/')}/${this.$route.query.id}`;
      // return newPathName;
    },
    getBgConfig() { // 获取大屏的配置
      return this.$store.getters.bgConfig;
    },
    getTransform: {
      get: function () {
        return Math.floor(this.transitionSacle * 100);
      },
      set: function (newValue) {
        return Math.floor(newValue);
      }
    },
    configArr() { // 设计区域的组件
      const list = this.$store.getters.list.filter((item) => item.isShow);
      return list;
    },
    getStylesStransformScalc() { // 设计区域大小，当大缩小设置
      return function () {
        let obj = {
          transform: `scale(${this.transitionSacle}, ${this.transitionSacle})`,
          width: `${this.getBgConfig.width}px`,
          height: `${this.getBgConfig.height}px`
        };
        if (this.type === 'APP') {
          obj = {
            ...obj,
            left: '50%',
            marginLeft: `-${this.getBgConfig.width * this.transitionSacle / 2}px`
          }
        }
        return obj;
      }
    },
    getStylesBgUrl() { // 获取背景图片
      return function () {
        return `background-image:url(${this.getBgConfig.bgImage || ''});background-color:${this.getBgConfig.bgColor || ''} `
      }
    },
    getComponentList() { //  左侧区域滚动的距离
      return componentConfigs.filter((item) => item.relationId === this.index.id);
    },
    isShowScreen() {
      const list = this.$store.getters.list;
      if (!list.length) {
        return true;
      }
      return JSON.stringify(this.activeComponent) === '{}' || this.isScreenSettingShow;
    }
  },
  created() {
    // this.init();
  },
  mounted() {
    this.init();
    window.addEventListener('resize', this.setDrawContent);
    // window.addEventListener('keyup', this.quickDel) // 暂时不启用快捷删除功能
    window.addEventListener('keyup', this.setComponentStyles);
  },
  watch: {
    getBgConfig: {
      immediate: true,
      deep: true,
      handler(newValue, old) {
        if (newValue && old && newValue.gridSize !== old.gridSize) { // 栅格大小重绘
          if (newValue.gridSize < 5) {
            return
          }
          this.drawGrid();
        }
        if (newValue && old && newValue.enable === old.enable) { // 是否显示栅格
          this.drawGrid();
        }
      }
    },
    transitionSacle: {
      immediate: true,
      deep: true,
      handler(newValue, old) {
        if (newValue !== old) {
          this.rightClickInfo = {};
        }
      }
    },
    type: {
      handler(v) {
        if (v === 'PC') {
          this.setDrawContent();
        }
        if (v === 'APP') {
          this.autoValue = 1;
          this.isAutoZoom = false;
        }
        ;
      }
    }
  },

  methods: {
    async publish() {
      // await doPublish({
      //   id: this.makeId(this.$route.query.id),
      //   publish: 1
      // })
      this.dialogVisible = true;
      // this.$message.success('发布成功!');
    },
    async init() {
      const {id} = this.$route.query;
      const data = await getDesignList({id: this.makeId(id)});
      const {list, screenDesignJson, type = 'PC'} = data;
      this.type = type;
      if (!list.length) { // 如果没有控件，直接显示背景配置
        this.isScreenSettingShow = true;
      }
      const newList = list.map((item) => {
        const {id, keycode, designJson, sqlResponse, apiFilterResponse, sqlFilterResponse, apiResponse} = item;
        const config = JSON.parse(designJson);
        const {SqlDataConfig, apiDataConfig} = config;
        return {
          ...config,
          id,
          keycode,
          SqlDataConfig: {
            ...SqlDataConfig,
            SQLResponse: sqlResponse,
            SQLFilterResponse: sqlFilterResponse
          },
          apiDataConfig: {
            ...apiDataConfig,
            apiResponse: apiResponse,
            apiFilterResponse: apiFilterResponse
          }
        }
      })

      const screenJson = screenDesignJson ? JSON.parse(screenDesignJson) : this.type === 'PC' ? screenConfig : screenAppConfig;
      await this.$store.dispatch('config/updateComponentList', newList);
      await this.$store.dispatch('config/setBgConfig', {
        ...screenJson
      });
      this.$nextTick(() => {
        this.drawGrid();
      })
      this.$nextTick(() => {
        setTimeout(() => {
          this.isShow = false;
        }, 400);
      })
    },
    quickDel(e) { // 快捷删除
      if (e.keyCode !== 46) {
        return;
      }
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      this.$confirm(`此操作将删除${this.activeComponent.name}图层`, '是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          if (this.activeComponent.id) {
            await delComponent({id: this.activeComponent.id})
          }
          const index = this.$store.getters.list.findIndex((item) => item.componentId === this.activeComponent.componentId);
          const list = [...this.$store.getters.list];
          list.splice(index, 1);
          await this.$store.dispatch('config/updateComponentList', list);
          this.activeComponent = {};
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        } catch (e) {
          console.log(e);
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    cancelZoomVisible() {
      this.zoomVisible = !this.zoomVisible;
    },
    reduce() {
      this.isAutoZoom = false;
      this.updateKey += 1;
      const scale = Number(this.transitionSacle) - 0.04;
      this.transitionSacle = scale.toFixed(2);
      this.autoValue = `${Math.round(scale * 100)}%`;
      if (this.transitionSacle < 0) {
        this.transitionSacle = 0;
        this.autoValue = '0%';
      }
      this.$nextTick(() => {
        this.drawGrid();
      })
    },
    addition() {
      this.isAutoZoom = false;
      this.updateKey += 1;
      const scale = Number(this.transitionSacle) + 0.04;
      this.transitionSacle = scale.toFixed(2);
      this.autoValue = `${Math.round(scale * 100)}%`;
      const limit = this.type === 'PC' ? 1 : 2;
      const autoValueLimit = this.type === 'PC' ? '100%' : '200%';
      if (this.transitionSacle >= limit) {
        this.transitionSacle = limit;
        this.autoValue = autoValueLimit;
      }
      this.$nextTick(() => {
        this.drawGrid();
      })
    },
    changeAutoValue(value) {
      if (value === 0) {
        this.isAutoZoom = true;
        this.setDrawContent();
      } else {
        this.isAutoZoom = false;
        this.transitionSacle = value;
      }
      this.autoValue = value;
    },
    changeScale1(value) {
      const newValue = Math.floor(value);
      this.transitionSacle = (newValue / 100).toFixed(2);
      if (this.autoValue === 0) {
        this.isAutoZoom = true;
      } else {
        this.autoValue = `${newValue}%`;
        this.isAutoZoom = false;
      }
      this.$nextTick(() => {
        this.drawGrid();
      })
    },
    changeScale(value) {
      this.autoValue = `${value}%`;
      this.isAutoZoom = false;
    },
    doUpdateActiveComponent(component) { // 除非组件激活
      if (!this.zoomVisible) {
        this.isScreenSettingShow = false;
        this.activeComponent = component;
        return;
      }
      if (this.zoomVisible && JSON.stringify(component) !== '{}') {
        this.isScreenSettingShow = false;
        this.$nextTick(() => {
          this.activeComponent = component;
        })
        return;
      }
      this.isScreenSettingShow = true;
      this.activeComponent = component;
    },
    doRightClick(e) { // 右击
      const {pageX, pageY} = e;
      this.rightClickInfo = {pageX, pageY};
    },
    setDrawContent() { //  计算画布大小
      if (this.isAutoZoom) {
        // const width = document.body.querySelector('.designWrap').getBoundingClientRect().width - 340;
        const width = document.body.querySelector('.designWrap').getBoundingClientRect().width - 40;
        const height = document.body.querySelector('.designWrap').getBoundingClientRect().height - 40;
        const widthScalc = width / (this.getBgConfig.width || 1920);
        const heightScalc = height / (this.getBgConfig.height || 1080);
        this.transitionSacle = widthScalc > heightScalc ? heightScalc : widthScalc;
      }
    },
    drawGrid() { //  画栅格
      var myCanvas = document.querySelector('.canvasWrap');
      var ctx = myCanvas.getContext('2d');
      let gridSize = this.getBgConfig.gridSize;
      let canvasWidth = ctx.canvas.width;
      let canvasHeight = ctx.canvas.height;
      if (!this.getBgConfig.enable) {
        ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
        return
      }
      ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
      let xLineTotal = Math.floor(canvasHeight / gridSize);
      let yLineTotal = Math.floor(canvasWidth / gridSize);

      for (let i = 0; i <= xLineTotal; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize - 0.5);
        ctx.lineTo(canvasWidth, i * gridSize - 0.5);
        ctx.strokeStyle = '#666';
        ctx.stroke();
      }

      for (let i = 0; i <= yLineTotal; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize - 0.5, 0);
        ctx.lineTo(i * gridSize - 0.5, canvasHeight);
        ctx.strokeStyle = '#666';
        ctx.stroke();
      }
    },
    async end(e) { // 选中组件松开鼠标的时候，计算出在画布上的位置
      const {oldIndex, originalEvent} = e;
      const {offsetX, offsetY} = originalEvent;
      const componentsList = this.getComponentList;
      const {
        left: designLeft,
        right,
        top: designTop,
        bottom
      } = document.body.querySelector('.designBg').getBoundingClientRect();
      if (offsetX < designLeft) {
        return
      }
      if (offsetX > right) {
        return;
      }
      if (offsetY < designTop) {
        return;
      }
      if (offsetY > bottom) {
        return;
      }
      const choosen = componentsList[oldIndex];
      const componentId = createUnique();
      const screenId = this.makeId(this.$route.query.id);
      const {componentName, name} = choosen;
      const baseInfo = JSON.parse(JSON.stringify(attributeCollection[componentName])) || {};
      const {height, width, dataType} = baseInfo;
      let lastTop = (offsetY - 70) / this.transitionSacle - height / 2;
      let lastLeft = (offsetX - 70) / this.transitionSacle - width / 2;
      if (this.type === 'APP') {
        lastLeft = (offsetX - designLeft) / this.transitionSacle - width / 2;
        const {scrollTop} = document.querySelector('.designWrap');
        lastTop = lastTop + scrollTop;
      }
      const top = lastTop.toFixed(0);
      const left = lastLeft.toFixed(0);
      let positionsObj = {
        top: Number(top),
        left: Number(left)
      }
      if (this.type === 'APP') {
        positionsObj = {
          ...positionsObj,
          width: this.getBgConfig.width
        }
      }
      const designObj = {...baseInfo, componentId, ...positionsObj};
      let obj = {
        dataJson: '',
        dataType,
        designJson: JSON.stringify(designObj),
        keycode: componentId,
        screenId,
        type: 0,
        sqlFilterResponse: '{}',
        sqlResponse: '{}',
        apiFilterResponse: '{}',
        apiResponse: '{}'
      }
      const res = await insertElement(obj);
      let componentConfig = {
        componentName,
        id: res,
        ...designObj,
        componentId
      }
      this.activeComponent = {
        componentId,
        componentName,
        name
      }
      this.isScreenSettingShow = false;
      // 该控件信息存储到vuex
      this.$store.dispatch('config/setConfig', componentConfig);
      this.doShowComponent();
    },
    choose() { // 选择其他的一个组件
      this.isShowComponent = false;
    },
    toggleScreen() {
      this.isScreenSettingShow = !this.isScreenSettingShow;
    },
    doPreview() { // 预览
      if (this.type === 'PC') {
        const {href} = this.$router.resolve({
          name: 'preview'
        });
        window.open(href, '_blank');
      }
      if (this.type === 'APP') {
        this.appVisible = true;
      }
    },
    goback() {
      sessionStorage.removeItem('bgInfo');
      this.$router.push({name: 'home'});
    },
    doShowComponent() {
      this.index = {};
      this.isShowComponent = false;
      this.rightClickInfo = {};
    },
    getComponents(index) { // 点击左侧组件入口时的弹框位置
      this.index = index;
      this.$nextTick(() => {
        this.isShowComponent = true;
      });
    },
    handleClick(e) {
      const classList = Array.from(e.target.classList);
      if (classList.includes('design__area')) {
        this.activeComponent = {};
        this.isShowComponent = false;
        this.rightClickInfo = {};
      }
    },
    async handleSaveConfig() { // 保存配置
      const list = this.$store.getters.list;
      const bgConfig = this.getBgConfig;
      const screenId = this.makeId(this.$route.query.id);
      let newList = [];
      list.forEach((item) => {
        if (item.componentName === 'CanvasDrawing') {
          item.stylesObj.drawType = null;
        }
        const {dataType, componentId, id = '', apiDataConfig = {}, SqlDataConfig = {}, ...rest} = item;
        let obj = {
          dataJson: '',
          dataType,
          designJson: JSON.stringify(item),
          id,
          keycode: componentId,
          screenId,
          type: 0
        }
        if (dataType === 2) {
          const {apiUrl, requestType, requestParams, requestHeader} = apiDataConfig;
          const params = {
            apiUrl, requestType, requestParams, requestHeader
          }
          obj.dataJson = JSON.stringify(params);
        }
        if (dataType === 3) {
          obj.dataJson = JSON.stringify({
            SQL: SqlDataConfig.SQL,
            dataSourceId: this.makeId(this.$route.query.dataId)
          });
          obj.varJson = JSON.stringify(SqlDataConfig.variableConfig || []);
        }
        const {apiResponse, apiFilterResponse} = apiDataConfig;
        const {SQLFilterResponse, SQLResponse} = SqlDataConfig;
        obj.sqlResponse = SQLResponse;
        obj.sqlFilterResponse = SQLFilterResponse;
        obj.apiResponse = apiResponse;
        obj.apiFilterResponse = apiFilterResponse;
        delete apiDataConfig.apiResponse;
        delete apiDataConfig.apiFilterResponse;
        delete SqlDataConfig.SQLFilterResponse;
        delete SqlDataConfig.SQLResponse;
        obj.designJson = JSON.stringify({
          ...rest,
          dataType,
          componentId,
          SqlDataConfig,
          apiDataConfig
        });
        newList.push(obj);
      })
      await updateOrInsertElement({
        screenId,
        list: newList,
        screenDesignJson: JSON.stringify(bgConfig)
      })
      await this.init();
      this.$message.success('保存成功!');
    },
    async setComponentStyles(e) {
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      let {componentId} = this.activeComponent;
      const {width, height} = this.getBgConfig;
      const elementList = this.$store.getters.list;
      const index = elementList.findIndex((item) => item.componentId === componentId);
      let current = elementList[index];
      const {left, top} = current;
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
      const list = [...this.$store.getters.list];
      list.splice(index, 1, current);
      await this.$store.dispatch('config/updateComponentList', list);
    },
    close() { // 关闭发布弹窗
      this.dialogVisible = false;
    }
  },
  beforeDestroy() {
    this.$store.dispatch('config/updateComponentList', []);
    this.$store.dispatch('config/setBgConfig', {});
    window && window.removeEventListener('resize', this.setDrawContent);
    window && window.removeEventListener('keyup', this.setComponentStyles);
    this.clipboard && this.clipboard.destroy();
  },
  name: 'config'
};
</script>

<style lang='scss' scoped>
.wrap {
  position: relative;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #05103A;
  overflow: hidden;

  .headerWrap {
    height: 50px;
    width: 100%;
    position: absolute;
    background: #101D44;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.4);
    z-index: 1;

    .headerWrap__title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #fff;
      text-align: center;
    }

    .headerWrap__manage {
      position: absolute;
      left: 20px;
      top: 0;
      height: 50px;
      display: flex;
      align-items: center;
      color: #fff;

      & .zoomActive {
        background: #4689F5;
        border: none;

        &:active {
          color: #FFFFFF;
        }

        &:hover {
          color: #FFFFFF;
        }

        &:focus {
          color: #FFFFFF;
          border: none;
        }
      }

      .headerWrap__back {
        line-height: 1;

        .icon-fanhui {
          font-size: 18px;
          vertical-align: text-bottom;
        }
      }
    }

    .headerWrap__scale {
      position: absolute;
      display: flex;
      height: 50px;
      left: 50%;
      align-items: center;
      transform: translateX(-50%);

      .sliderWrap {
        align-items: center;
        width: 236px;
        height: 28px;
        margin-left: 10px;
        padding: 0 15px;
        display: flex;
        justify-content: space-between;
        background: #192757;
        border: 1px solid #2F437F;

        .iconfont {
          font-size: 18px;
          color: #FFFFFF;
          cursor: pointer;

          &:hover {
            color: #4689F5;
          }
        }

        .slider {
          width: 140px;

          ::v-deep {
            .el-slider__button {
              width: 10px;
              height: 10px;
              border-radius: 0;
            }

            .el-slider__bar {
              background: linear-gradient(90deg, #4689F5 0%, #43DBFF 100%);
            }
          }
        }
      }

      .autoZoomWrap {
        width: 92px;

        ::v-deep {
          .el-checkbox__label {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
          }
        }
      }

      ::v-deep {
        .el-slider__runway {
          margin: 22px 0;
          border-radius: 0;
          background-color: #2F437F;

          .el-slider__bar {
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
          }
        }
      }
    }

    .headerWrap__ope {
      position: absolute;
      right: 20px;
      top: 0;
      height: 50px;
      //width: 144px;
      display: flex;
      align-items: center;
      color: #fff;

      .headerWrap__setting {
        font-size: 14px;
        cursor: pointer;

        .iconfont {
          font-size: 18px;
          vertical-align: bottom;
        }
      }

      .headerWrap__preview {
        margin-right: 15px;
        font-size: 14px;
        line-height: 50px;
        cursor: pointer;

        & > a {
          text-decoration: none;
          color: #ffffff;
        }

        .iconfont {
          font-size: 18px;
          vertical-align: bottom;
        }
      }
    }
  }

  .contentWrap {
    position: absolute;
    width: 100%;
    height: calc(100% - 40px);
    display: flex;
    top: 50px;

    .assemblyWrap {
      flex: 0 0 60px;
      height: 100%;
      background: #14214B;

      .assemblyBox {
        position: relative;
        height: 80px;
        padding-top: 20px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;

        & > .iconfont {
          font-size: 22px;
          color: #ffffff;
        }

        & > .assemblyBox__title {
          margin-top: 5px;
          font-size: 12px;
          color: #ffffff;
        }

        &.active {
          background: #11265C;

          .assemblyBox__title {
            color: $component-borderFocus-color;
          }

          & > .iconfont {
            color: $component-borderFocus-color;
          }

          & ::after {
            display: block;
            position: absolute;
            content: '';
            width: 2px;
            height: 80px;
            top: 0;
            background: $component-borderFocus-color;
          }

          transition: all .3s ease;
        }

        &:hover {
          background: #11265C;

          .assemblyBox__title {
            color: $component-borderFocus-color;
          }

          & > .iconfont {
            color: $component-borderFocus-color;
          }

          transition: all .3s ease;
        }
      }

    }

    .designContent {
      flex: 1;
      width: 100%;
      height: 100%;

      .designWrap {
        position: relative;
        background: url('../../assets/bg.png') repeat;
        overflow: auto;
        width: calc(100% - 300px);
        height: calc(100% - 40px);

        .vdr.active:before {
          outline: 1px dashed #23c132;
        }

        .vue-ruler-wrapper {
          height: calc(100% + 24px) !important;
          width: calc(100% + 24px) !important;
        }

        .designBg {
          width: 1920px;
          height: 1080px;
          z-index: 0;
          position: absolute;
          left: 20px;
          right: 20px;
          top: 20px;
          bottom: 20px;
          transform-origin: left top;
          background-color: rgba(13, 42, 67, 0);
          box-shadow: 0 0 30px 0 rgb(0 0 0 / 50%);

          .vue-ruler-content {
            width: 100%;
            height: 100%;
          }

          .design__area {
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

          .design__bg {
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

          .design__video {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            max-width: 100%;
            max-height: 100%;
            width: 100%;
            height: 100%;
            z-index: 1;
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
    }


    .componentsSetting {
      flex: 0 0 300px;
      width: 100%;
      height: 100%;
      background: #202020;
    }

    .componentsBox {
      width: 240px;
      height: 100%;
      position: absolute;
      left: 60px;
      top: 0;
      padding: 15px 20px;
      overflow: hidden;
      border-radius: 2px;
      background: #131E45;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.36);
      overflow: auto;
      z-index: 999;
      box-sizing: border-box;

      .componentsBox__item {
        width: 200px;
        height: 110px;
        margin-bottom: 15px;
        background: #1B2A5B;
        border: 1px solid #2F437F;
        box-sizing: border-box;
        cursor: pointer;

        &:hover .componentsBox__item__img {
          background: $component-border-color;
        }

        &:hover .componentsBox__item__name {
          background: #11214E rgba(70, 137, 245, 0.18);
        }

        &:hover {
          box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.7);
        }

        .componentsBox__item__img {
          width: 100%;
          height: calc(100% - 28px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .componentsBox__item__name {
          height: 28px;
          line-height: 28px;
          text-align: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          border-top: 1px solid #2F437F;
        }
      }
    }
  }

  .screenSettingWrap, .othersConfigWrap {
    position: absolute;
    top: 51px;
    width: 300px;
    right: 0;
    bottom: 0;
    height: calc(100% - 50px);
    background: #131E45;
    opacity: 1;
    transition: all .3s ease;
    z-index: 999;
  }

  .othersConfigWrap {
    .headerTitle {
      height: 46px;
      padding-left: 20px;
      line-height: 46px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      box-shadow: 0px 1px 0px 0px #2f437f;
    }

    z-index: 1;
  }

  .iconfont {
  }

  .passwordDialog {
    ::v-deep {
      .el-dialog__body {
        padding: 20px;
      }

      .el-form-item {
        margin-bottom: 20px;
      }

      .el-form-item__content {
        line-height: unset;
      }

      .el-form-item__label {
        height: 18px;
        margin-bottom: 4px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 18px;
      }

      .el-input__icon {
        line-height: 34px;
      }
    }
  }

  .preDialog {
    ::v-deep {
      .el-dialog__body {
        height: 544px;
      }
    }
  }
}
</style>
