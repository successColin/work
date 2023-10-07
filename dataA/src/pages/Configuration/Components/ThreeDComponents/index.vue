/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <CDragComponent
      :isDraggable="!config.isFixed"
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
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
    <div class="singleTextWrap" :style="getContentStyles"
         :id="`third${config.componentId}Box`"
         @contextmenu.prevent="show">
      <div class="singleTextContent" :id="`third${config.componentId}`"></div>
      <!--重置按钮-->
      <CDragComponent
          @dragstop="dragstopBtn($event)"
          v-on:resizing="resizeBtn($event)"
          v-on:dragging="draggingBtn($event)"
          @clicked="handleClick"
          @activated="activated"
          :w="config.stylesObj.resetBtnWidth"
          :h="config.stylesObj.resetBtnHeight"
          :x="config.stylesObj.resetBtnLeft"
          :y="config.stylesObj.resetBtnTop"
          v-if="config.stylesObj.enableResetBtn"
          :isDraggable="isDraggable"
          :isActive="config.componentId === activeComponent.componentId"
          :parentLimitation="true"
          :parentScaleX="scale"
          :parentScaleY="scale"
          :parentW="config.width"
          :parentH="config.height">
        <div style="width: 100%;height: 100%;" :style="getBtnStyles" class="btnWrap" @click="doReset">
          <img
              :src="config.stylesObj.resetBtnBgUrl"
              v-if="config.stylesObj.resetBtnBgUrl"
              :style="getImgStyles"
          >
        </div>
      </CDragComponent>
      <!--预设视角按钮-->
      <CDragComponent
          @dragstop="dragstopBtn($event, 'Presets')"
          v-on:resizing="resizeBtn($event, 'Presets')"
          v-on:dragging="draggingBtn($event, 'Presets')"
          @clicked="handleClick"
          @activated="activated"
          :w="config.stylesObj.presetGroupWidth"
          :h="config.stylesObj.presetGroupHeight"
          :x="config.stylesObj.presetGroupLeft"
          :y="config.stylesObj.presetGroupTop"
          v-if="isShowSysPresets"
          :isDraggable="isDraggable"
          :isActive="config.componentId === activeComponent.componentId"
          :parentLimitation="true"
          :parentScaleX="scale"
          :parentScaleY="scale"
          :parentW="config.width"
          :parentH="config.height">
        <div style="width: 100%;height: 100%;" class="btnWrap">
          <PresetsButton ref="PresetsButton" :config="presetsConfig" @click="changePos"/>
        </div>
      </CDragComponent>
      <!--      <div class="pieHook"></div>-->
    </div>
  </CDragComponent>
</template>

<script>
import PresetsButton from '@/pages/Configuration/Components/ThreeDComponents/component/PresetsButton';
import * as TWEEN from '@tweenjs/tween.js'
import {screenConfig} from '@/constants/global';
import {debounce, getHexColor, throttle} from '@/utils/utils';
import Bus from '@/utils/bus';
import * as THREE from 'three' // 三维
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'; // 控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js';
import {FXAAShader} from 'three/examples/jsm/shaders/FXAAShader.js';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {validConditions} from '@/utils/common';

let animationId = null;
let ambientLight = null; // 环境光
let hemisphereLight = null; // 半球光
let directionalLight = null; // 平行光
let pointLight = null; // 点状光

let composer, effectFXAA, outlinePass, renderPass, bloomPass;
let selectedObjects = [];
let animations = [];
let mixer2 = null;
let clock2 = null;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
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
    // eslint-disable-next-line no-warning-comments
    // todo: activeComponent与config 两个变量有重复，所有的组件都可以进行优化；
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    changeFilterParams: { // 用于修改过滤条件参数的
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      loaded: true, // 是否完全加载
      meshOptions: [],
      childMesh: [],
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      controls: null, // 控制器
      observer: null, // 观察器
      group: null, // 分组
      axes: null, // 辅助线
      recordOldValue: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    systemPresetsConfig() { // 预设视角启用的条数
      const {systemPresetsConfig} = this.config;
      return systemPresetsConfig.filter((item) => item.enable);
    },
    isShowSysPresets() { // 预设按钮启用
      return this.config.stylesObj.enableSysPresets && this.systemPresetsConfig.length;
    },
    presetsConfig() { // 预设角度配置
      const {
        stylesObj: {
          presetBtnWidth,
          presetBtnHeight,
          presetGroupBorderRadius = 0,
          presetGroupNormalBgColor = '',
          presetGroupActiveBgColor = '',
          presetGroupNormalBgUrl = '',
          presetGroupActiveBgUrl = '',
          presetFontFamily = '微软雅黑', // 未激活状态字体
          presetFontWeight = 'normal', // 未激活状态文字粗细
          presetFontSize = 28, // 未激活状态文字大小
          presetColor = '#fff', // 未激活状态左右内边距
          presetHoverColor = '#4689F5' // 未激活状态左右内边距
        }, componentId
      } = this.config;
      return {
        componentId,
        presetGroupBorderRadius,
        presetGroupNormalBgColor,
        presetGroupActiveBgColor,
        presetGroupNormalBgUrl,
        presetGroupActiveBgUrl,
        presetFontFamily,
        presetFontWeight,
        presetFontSize,
        presetColor,
        presetHoverColor,
        presetBtnWidth,
        presetBtnHeight,
        systemPresetsConfig: this.systemPresetsConfig
      }
    },
    getImgStyles() {
      const {stylesObj: {bgUrlWidth, bgUrlHeight}} = this.config;
      let widthObj = bgUrlWidth ? {width: `${bgUrlWidth}px`} : {};
      let heightObj = bgUrlHeight ? {height: `${bgUrlHeight}px`} : {};
      return {
        ...widthObj,
        ...heightObj
      }
    },
    getBtnStyles() {
      const {stylesObj: {resetBtnBgColor, resetBtnBorderRadius, resetBtnHeight}} = this.config;
      return {
        backgroundColor: resetBtnBgColor,
        lineHeight: `${resetBtnHeight}px`,
        borderRadius: `${resetBtnBorderRadius}%`
      }
    },
    isDraggable() {
      if (this.config.componentId !== this.activeComponent.componentId) {
        return false;
      }
      return this.config.isFixed;
    },
    designData() { // 设计数据
      const {
        dataType,
        dataConfig,
        apiDataConfig,
        SqlDataConfig
      } = this.config;
      const {staticValue} = dataConfig;
      if ([1, 4].includes(dataType)) {
        return JSON.parse(staticValue);
      }
      if (dataType === 2) {
        const {apiFilterResponse = '[]'} = apiDataConfig;
        try {
          const arr = JSON.parse(apiFilterResponse);
          if (!Array.isArray(arr)) {
            return [];
          }
          return arr;
        } catch (e) {
          return []
        }
      }
      if (dataType === 3) {
        const {SQLFilterResponse = '[]'} = SqlDataConfig;
        try {
          const arr = JSON.parse(SQLFilterResponse);
          if (!Array.isArray(arr)) {
            return [];
          }
          return arr;
        } catch (e) {
          return []
        }
      }
      return [];
    },
    eventKey() {
      const {componentId} = this.config;
      return `threeD_${componentId}`;
    },
    enableEnterAnimate() { // 启用入场动画
      const {stylesObj: {enableEnterAnimate}} = this.config;
      return enableEnterAnimate;
    },
    getCameraPos() { // 相机视角
      const {stylesObj: {cameraX, cameraY, cameraZ}} = this.config;
      return {
        cameraX, cameraY, cameraZ
      }
    },
    getContentStyles() {
      const {width, height} = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {
    'config.stylesObj.rotationDirection': {
      handler() {
        this.clearAnimationFrame();
        this.debounceSpeed();
      }
    },
    'config.stylesObj.rotationSpeed': {
      handler() {
        this.clearAnimationFrame();
        this.debounceSpeed();
      }
    },
    'config.stylesObj': {
      immediate: false,
      deep: true,
      handler() {
        this.clearAnimationFrame();
        this.debounceInit();
      }
    },
    'config.showOrHideModelsConfig': {
      immediate: false,
      deep: false,
      handler() {
        this.debounceSetModels();
      }
    },
    'config.stylesObj.enableCustomShowOrHideModels': {
      immediate: false,
      deep: false,
      handler() {
        this.filterShowOrHide();
      }
    },
    'config.stylesObj.enableCustomOperationModels': {
      immediate: false,
      deep: false,
      handler() {
        this.filterOperationModels();
      }
    },
    'config.animateConfig': {
      immediate: false,
      deep: false,
      handler() {
        this.debounceSetAnimate();
      }
    },
    'config.stylesObj.enableAllAnimate': {
      immediate: false,
      deep: false,
      handler() {
        this.setAnimate();
      }
    },
    'config.stylesObj.url': {
      handler() {
        // 如果组里有模型，先清除模型
        if (this.group.children.length) {
          this.deleteObject(this.group);
        }
        this.clearAnimationFrame();
        this.addModels();
      }
    },
    'config.stylesObj.cameraX': {
      handler() {
        this.throttleSetCamera();
      }
    },
    'config.stylesObj.cameraY': {
      handler() {
        this.throttleSetCamera();
      }
    },
    'config.stylesObj.cameraZ': {
      handler() {
        this.throttleSetCamera();
      }
    },
    'config.stylesObj.zoomLevel': {
      handler() {
        this.setModelScale();
        this.setModelPosition();
      }
    },
    'config.stylesObj.modelPosX': {
      handler() {
        this.setModelPosition();
      }
    },
    'config.stylesObj.modelPosY': {
      handler() {
        this.setModelPosition();
      }
    },
    'config.stylesObj.modelPosZ': {
      handler() {
        this.setModelPosition();
      }
    },
    'config.stylesObj.enableHoverEffects': {
      handler(v) {
        if (v) {
          this.setOutLine();
        } else {
          this.removePointerMove();
        }
      }
    },
    'config.stylesObj.visibleEdgeColor': {
      handler() {
        this.setHoverEffects();
      }
    },
    'config.stylesObj.hiddenEdgeColor': {
      handler() {
        this.setHoverEffects();
      }
    },
    'config.stylesObj.edgeStrength': {
      handler() {
        this.setHoverEffects();
      }
    },
    'config.stylesObj.edgeThickness': {
      handler() {
        this.setHoverEffects();
      }
    },
    'config.stylesObj.pulsePeriod': {
      handler() {
        this.setHoverEffects();
      }
    },
    'config.stylesObj.edgeGlow': {
      handler() {
        this.setHoverEffects();
      }
    },
    'config.stylesObj.enableGlowEffects': {
      handler(v) {
        if (v) {
          this.setGlow();
        } else {
          this.removeGlowEffects();
        }
      }
    },
    'config.stylesObj.strength': {
      handler() {
        this.setGlowEffects();
      }
    },
    'config.stylesObj.threshold': {
      handler() {
        this.setGlowEffects();
      }
    },
    'config.stylesObj.exposure': {
      handler() {
        this.setGlowEffects();
      }
    },
    'config.stylesObj.radius': {
      handler() {
        this.setGlowEffects();
      }
    }
  },
  created() {
    this.debounceInit = debounce(() => {
      this.init();
    }, 200);
    this.debounceSpeed = debounce(() => {
      this.speed();
    }, 200);
    this.debounceSetModels = throttle(() => {
      this.setChildModels();
    }, 200);
    this.debounceSetAnimate = throttle(() => {
      this.setAnimate();
    }, 200);
    this.throttleSetCamera = throttle(() => {
      this.setCameraPosition();
    })
  },
  mounted() {
    const {componentId} = this.config;
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let element = document.querySelector(`#third${componentId}Box`)
    this.observer = new MutationObserver(() => {
      let width = getComputedStyle(element).getPropertyValue('width')
      let height = getComputedStyle(element).getPropertyValue('height')
      if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
        return
      }
      this.recordOldValue = {
        width,
        height
      };
      this.onWindowResize();
    })
    this.observer.observe(element, {attributes: true, attributeFilter: ['style'], attributeOldValue: true});
    // 创建组
    this.group = new THREE.Group();
    clock2 = new THREE.Clock(); // 用于clock.getDelta()
    this.init();
    this.addModels();
  },
  methods: {
    setOutLine() { // 设置描边
      const {stylesObj: {enableHoverEffects, enableGlowEffects}, width, height} = this.config;
      if (!enableHoverEffects) {
        return;
      }

      outlinePass = new OutlinePass(new THREE.Vector2(width, height), this.scene, this.camera);
      composer.addPass(outlinePass);
      effectFXAA = new ShaderPass(FXAAShader);
      effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
      composer.addPass(effectFXAA);

      this.setHoverEffects();
      this.renderer.domElement.style.touchAction = 'none';
      this.renderer.domElement.addEventListener('pointermove', this.onPointerMove);
    },
    setGlow() { // 设置描边
      const {stylesObj: {enableGlowEffects}, width, height} = this.config;
      if (enableGlowEffects && composer) {
        bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1, 0.4, 1);
        composer.addPass(bloomPass);
        bloomPass.renderToScreen = true;
        this.setGlowEffects();
      }
    },
    removeGlowEffects() {
      if (composer) {
        bloomPass && composer.removePass(bloomPass);
        bloomPass = null;
      }
    },
    removePointerMove() {
      if (composer) {
        composer.removePass()
        renderPass && composer.removePass(renderPass);
        outlinePass && composer.removePass(outlinePass);
        effectFXAA && composer.removePass(effectFXAA);
      }
      this.renderer.domElement.removeEventListener('pointermove', this.onPointerMove);
      composer = null;
      effectFXAA = null;
      outlinePass = null;
      selectedObjects = [];
      renderPass = null;
    },
    setHoverEffects() {
      const {
        stylesObj: {
          visibleEdgeColor = null, // 显示物体描边颜色
          hiddenEdgeColor = null, // 隐藏物品描边颜色
          edgeStrength = 5, // 模糊度
          edgeThickness = 1, // 发光强度
          pulsePeriod = 0, // 光晕闪烁频率
          edgeGlow = 0 // 光晕
        }
      } = this.config;
      if (outlinePass) {
        const color1 = getHexColor(visibleEdgeColor)
        const color2 = getHexColor(hiddenEdgeColor)
        outlinePass.edgeStrength = edgeStrength;
        outlinePass.edgeGlow = edgeGlow;
        outlinePass.edgeThickness = edgeThickness;
        outlinePass.pulsePeriod = pulsePeriod;
        outlinePass.visibleEdgeColor.set(color1);
        outlinePass.hiddenEdgeColor.set(color2);
      }
    },
    setGlowEffects() {
      const {
        stylesObj: {
          enableGlowEffects,
          threshold,
          strength,
          radius,
          exposure = 5
        }
      } = this.config;
      if (bloomPass && enableGlowEffects) {
        bloomPass.threshold = threshold;
        bloomPass.strength = strength;
        bloomPass.radius = radius;
        this.renderer.toneMappingExposure = Math.pow(exposure, 4.0);
      }
    },
    onPointerMove(event) {
      if (event.isPrimary === false) {
        return;
      }
      const {width, height} = this.config;
      mouse.x = event.offsetX / width * 2 - 1;
      mouse.y = -(event.offsetY / height) * 2 + 1;
      // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      this.checkIntersection();

    },
    addSelectedObject(object) {

      selectedObjects = [];
      selectedObjects.push(object);

    },
    checkIntersection() {

      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObject(this.scene, true);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        this.addSelectedObject(selectedObject);
        outlinePass.selectedObjects = selectedObjects;

      } else {
        // outlinePass.selectedObjects = [];
      }
    },
    clearAnimationFrame() {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    },
    speed() {
      const {stylesObj: {enableRotateAnimate}} = this.config;
      if (enableRotateAnimate) {
        this.group.rotation.x = 0;
        this.group.rotation.y = 0;
        this.group.rotation.z = 0;
      }
    },
    onWindowResize() {
      const {width, height} = this.config;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      composer && composer.setSize(width, height);

      effectFXAA && effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height);
      // effectFXAA && effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );

      this.render();
    },

    initScene() {
      this.scene = new THREE.Scene();
      this.scene.add(this.group);
    },
    doChangeConfig() {
      const {
        stylesObj: {
          enableAuxiliaryLines,
          bgColor,
          enablePan,
          enableZoom,
          enableRotate,
          minPolarAngle = 0,
          maxPolarAngle = 180
        }
      } = this.config;

      if (bgColor) {
        const color = getHexColor(bgColor)
        this.scene.background = new THREE.Color(color);
      } else {
        this.scene.background = null;
      }
      if (!this.axes && enableAuxiliaryLines) { // 初次渲染
        this.axes = new THREE.AxesHelper(20);
        this.axes.position.set(0, 0, 0);
        this.scene.add(this.axes);
      } else if (this.axes && !enableAuxiliaryLines) {
        this.scene.remove(this.axes);
        this.axes = null;
      }
      this.controls.enablePan = !enablePan;
      this.controls.enableZoom = !enableZoom; // 縮放
      this.controls.enableRotate = !enableRotate; // 旋轉
      this.controls.enableDamping = true;

      // this.controls.minDistance = 1; // 设置相机距离原点的最近距离
      // this.controls.maxDistance = 20; // 设置相机距离原点的最远距离
      // this.controls.autoRotate = true;
      // this.controls.enablePan = false;
      this.controls.minPolarAngle = Math.PI * (minPolarAngle / 180); // 最小角度
      // this.controls.maxPolarAngle = Math.PI / 2; // 最大角度
      this.controls.maxPolarAngle = Math.PI * (maxPolarAngle / 180); // 最大角度
      // this.controls.rotateSpeed = 0.5;
      // this.controls.autoRotateSpeed = 0.5;
      // this.controls.zoomSpeed = 0.8;
      // this.controls.maxZoom = 15;
      // this.controls.minZoom = 7;
      // controls.minAzimuthAngle = Math.PI * (100 / 180);
      // controls.maxAzimuthAngle = Math.PI * (100 / 180);
      // this.controls.target.set(0, 0, -0.2);
    },
    setModelScale() {
      const {stylesObj: {zoomLevel = 1}} = this.config;
      if (!this.group.children.length) {
        return;
      }
      this.group.scale.set(zoomLevel, zoomLevel, zoomLevel);
      this.render();
    },
    setModelPosition() {
      const {stylesObj: {modelPosY = 0, modelPosX = 0, modelPosZ = 0}} = this.config;
      if (!this.group.children.length) {
        return;
      }
      this.group.position.set(modelPosX, modelPosY, modelPosZ);
      this.render();
    },
    async filterOperationModels() {
      const model = this.group.children[0];
      const {stylesObj: {customIdentifier, enableCustomOperationModels}} = this.config;
      if (model) {
        this.childMesh = [];
        model.traverse((object) => {
          const {name, isMesh, userData} = object;
          const customValue = userData[customIdentifier];
          if (isMesh && enableCustomOperationModels && customValue) { // 具体的模型
            this.childMesh.push({
              label: name,
              value: name
            })
          } else if (isMesh && !enableCustomOperationModels) {
            this.childMesh.push({
              label: name,
              value: name
            })
          }
        });
        Bus.$emit(this.eventKey, {
          animationOptions: animations,
          meshOptions: this.meshOptions,
          childMesh: this.childMesh
        });
      }
    },
    async filterShowOrHide() {
      const model = this.group.children[0];
      const {stylesObj: {customIdentifier, enableCustomShowOrHideModels}} = this.config;
      if (model) {
        this.meshOptions = [];
        model.traverse((object) => {
          const {name, isGroup, userData, id} = object;
          const customValue = userData[customIdentifier];
          if (isGroup && enableCustomShowOrHideModels && customValue) { // 分组
            this.meshOptions.push({
              label: name,
              value: name
            })
          } else if (isGroup && !enableCustomShowOrHideModels) {
            this.meshOptions.push({
              label: name,
              value: name
            })
          }
        });
        Bus.$emit(this.eventKey, {
          animationOptions: animations,
          meshOptions: this.meshOptions,
          childMesh: this.childMesh
        });
      }
    },
    async setChildModels(flag) {
      const model = this.group.children[0];
      const {
        showOrHideModelsConfig,
        stylesObj: {identifier, customIdentifier, enableCustomShowOrHideModels, enableCustomOperationModels}
      } = this.config;
      if (model) {
        model.traverse((object) => {
          const {name, isMesh, isGroup, userData} = object;

          // eslint-disable-next-line no-useless-concat
          const onlyKey = '${' + name + '}${' + object?.parent?.name ?? '' + '}';
          const customValue = userData[customIdentifier];
          if (isGroup && flag && enableCustomShowOrHideModels && customValue) { // 分组
            this.meshOptions.push({
              label: name,
              value: onlyKey
            })
          } else if (isGroup && flag && !enableCustomShowOrHideModels) {
            this.meshOptions.push({
              label: name,
              value: onlyKey
            })
          }
          if (isMesh && flag && enableCustomOperationModels && customValue) { // 具体的模型
            this.childMesh.push({
              label: name,
              value: onlyKey
            })
          } else if (isMesh && flag && !enableCustomOperationModels) {
            this.childMesh.push({
              label: name,
              value: onlyKey
            })
          }
          const targetModel = showOrHideModelsConfig.find((item) => item.value === onlyKey);
          if (targetModel) { // 如果发现模型存在
            const {conditionsArr = [], identifierValue} = targetModel;

            if (conditionsArr.length) {
              const realConditionsArr = conditionsArr.filter((item) => item.enableConditions);
              if (realConditionsArr.length) {
                const data = this.designData.find((item) => `${item[identifier]}` === identifierValue);
                const result = validConditions(realConditionsArr, data, '', false);
                const {visible} = result;
                object.visible = visible;
              }
            }
          }
          if (isMesh) {
            object.castShadow = true;
          }
        });
        this.render();
      }
    },
    setAnimate() {
      const {animateConfig = [], stylesObj: {identifier, enableAllAnimate}} = this.config;
      const renderAnimate = (animation) => {
        if (enableAllAnimate && mixer2) {
          mixer2.clipAction(animation).play();
        } else if (!enableAllAnimate && mixer2) {
          mixer2.clipAction(animation).stop();
        }
      }
      const renderCustomAnimate = (animation, flag) => {
        if (flag) {
          mixer2.clipAction(animation).play();
        } else {
          mixer2.clipAction(animation).stop();
        }
      }
      animations.forEach((animation, i) => {
        const target = animateConfig.find((item) => item.value === i);
        if (target) {
          const {conditionsArr = [], identifierValue} = target;
          const realConditionsArr = conditionsArr.filter((item) => item.enableConditions);
          if (realConditionsArr.length && identifierValue) {
            const data = this.designData.find((item) => `${item[identifier]}` === identifierValue);
            const result = validConditions(realConditionsArr, data, '', false);
            const {visible} = result;
            renderCustomAnimate(animation, visible);
          } else {
            renderAnimate(animation);
          }
        } else { // 没有按正常逻辑做
          renderAnimate(animation);
        }
      })
    },
    addModels() {
      const {stylesObj: {url, zoomLevel = 1, modelPosY = 0, modelPosX = 0, modelPosZ = 0}} = this.config;
      if (!url) {
        this.meshOptions = [];
        this.childMesh = [];
        animations = [];
        Bus.$emit(this.eventKey, {});
        return;
      }
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(url, async (objects) => {
            let model = objects.scene;
            animations = objects.animations || [];
            this.group.add(model);
            this.group.position.set(modelPosX, modelPosY, modelPosZ);
            this.group.scale.set(zoomLevel, zoomLevel, zoomLevel);
            mixer2 = new THREE.AnimationMixer(model);
            await this.setChildModels(true);
            this.setAnimate();
            this.render();
            this.resetControls();
            this.loaded = true;
            Bus.$emit(this.eventKey, {
              animationOptions: animations,
              meshOptions: this.meshOptions,
              childMesh: this.childMesh
            });
          }, (xhr) => {
            // 控制台查看加载进度xhr
            // 通过加载进度xhr可以控制前端进度条进度   Math.floor:小数加载进度取整
            // const progress = xhr.loaded / xhr.total * 100
            const progress = Math.floor(xhr.loaded / xhr.total * 100)
            if (progress < 100) {
              this.loaded = false;
            }
            // if (progress === 100 ) {
            //
            //   console.log('progress', animations )
            // }
          },
          // 加载错误回调函数onError
          (err) => {
            this.loaded = true;
            console.error('加载发生错误', err);
          })
    },
    setAmbientLight() { // 设置环境光
      const {
        stylesObj: {
          enableAmbientLight,
          ambientLightColor = '#FFFFFF',
          ambientLightIntensity
        }
      } = this.config;
      const color = getHexColor(ambientLightColor)
      if (!ambientLight && enableAmbientLight) {
        ambientLight = new THREE.AmbientLight(color, ambientLightIntensity);
        this.scene.add(ambientLight);
      } else if (ambientLight && !enableAmbientLight) {
        this.scene.remove(ambientLight);
        ambientLight = null;
      } else if (ambientLight && enableAmbientLight) {
        // 光源颜色更新
        ambientLight.color = new THREE.Color(color);
        ambientLight.intensity = ambientLightIntensity;
        this.render();
      }
    },
    setHemisphereLight() { // 设置环境光
      const {
        stylesObj: {
          enableHemisphereLight, //  启用半球光
          hemisphereLightSkyColor, // 天空颜色
          hemisphereLightGroundColor, // 地面颜色
          hemisphereLightIntensity // 光照强度
        }
      } = this.config;
      const skyColor = getHexColor(hemisphereLightSkyColor);
      const bgColor = getHexColor(hemisphereLightGroundColor);
      if (!hemisphereLight && enableHemisphereLight) {
        hemisphereLight = new THREE.HemisphereLight(skyColor, bgColor, hemisphereLightIntensity);
        this.scene.add(hemisphereLight);
      } else if (hemisphereLight && !enableHemisphereLight) {
        this.scene.remove(hemisphereLight);
        hemisphereLight = null;
      } else if (hemisphereLight && enableHemisphereLight) {
        // 光源颜色更新
        hemisphereLight.color = new THREE.Color(skyColor);
        hemisphereLight.groundColor = new THREE.Color(bgColor);
        hemisphereLight.intensity = hemisphereLightIntensity;
        this.render();
      }
    },
    setDirectionLight() { // 设置平行光
      const {
        stylesObj: {
          enableDirectionLight, //  启用半球光
          directionLightColor, // 天空颜色
          directionLightX, // 地面颜色
          directionLightY,
          directionLightZ,
          enableDirectionLightShadow,
          directionLightIntensity // 光照强度
        }
      } = this.config;
      const color = getHexColor(directionLightColor)
      if (!directionalLight && enableDirectionLight) {
        directionalLight = new THREE.DirectionalLight(color, directionLightIntensity);
        directionalLight.position.set(directionLightX, directionLightY, directionLightZ);
        directionalLight.castShadow = enableDirectionLightShadow;
        this.scene.add(directionalLight);
      } else if (directionalLight && !enableDirectionLight) {
        this.scene.remove(directionalLight);
        directionalLight = null;
      } else if (directionalLight && enableDirectionLight) {
        directionalLight.position.set(directionLightX, directionLightY, directionLightZ);
        directionalLight.castShadow = enableDirectionLightShadow;
        // // 光源颜色更新
        directionalLight.color = new THREE.Color(color);
        directionalLight.intensity = directionLightIntensity;
        this.render();
      }
    },
    setPointLight() { // 设置平行光
      const {
        stylesObj: {
          enablePointLight, //  启用半球光
          pointLightColor, // 天空颜色
          pointLightLightX, // 地面颜色
          pointLightLightY,
          pointLightLightZ,
          enablePointLightShadow,
          pointLightIntensity // 光照强度
        }
      } = this.config;
      const color = getHexColor(pointLightColor);
      if (!pointLight && enablePointLight) {
        pointLight = new THREE.PointLight(color, pointLightIntensity);
        pointLight.position.set(pointLightLightX, pointLightLightY, pointLightLightZ);
        pointLight.castShadow = enablePointLightShadow;
        this.scene.add(pointLight);
      } else if (pointLight && !enablePointLight) {
        this.scene.remove(pointLight);
        pointLight = null;
      } else if (pointLight && enablePointLight) {
        pointLight.position.set(pointLightLightX, pointLightLightY, pointLightLightZ);
        pointLight.castShadow = enablePointLightShadow;
        // // 光源颜色更新
        pointLight.color = new THREE.Color(color);
        pointLight.intensity = pointLightIntensity;
        this.render();
      }
    },
    initLight() {
      this.setAmbientLight();
      this.setHemisphereLight();
      this.setDirectionLight();
      this.setPointLight();
    },
    initCamera() {
      const {width, height} = this.config;
      this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
      this.setCameraPosition();
      if (this.enableEnterAnimate) {
        this.initEnterAnimate();
      }
    },
    setCameraPosition() {
      const {cameraX, cameraY, cameraZ} = this.getCameraPos;
      if (this.camera) {
        this.camera.position.set(cameraX, cameraY, cameraZ);
      }
    },
    initEnterAnimate() {
      const camera = this.camera;
      const {cameraX, cameraY, cameraZ} = this.getCameraPos;
      const tweenCamera1 = new TWEEN.Tween({x: -45, y: 35, z: 40, lookAtX: 0, lookAtY: 0, lookAtZ: 0})
          .to({x: cameraX, y: cameraY, z: cameraZ, lookAtX: 0, lookAtY: 0, lookAtZ: 0}, 1000);
      const updateCamera = function (object) {
        camera.position.set(object.x, object.y, object.z);
        camera.lookAt(new THREE.Vector3(object.lookAtX, object.lookAtY, object.lookAtZ))
      }
      tweenCamera1.onUpdate(updateCamera);
      tweenCamera1.start();
      tweenCamera1.onComplete(() => {
        // console.log('jieshu');
        // this.isShow = true;
      })
      // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    },
    initRenderer() {
      const {componentId, width, height} = this.config;
      this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      this.renderer.setSize(width, height);
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.physicallyCorrectLights = false;
      this.renderer.autoClear = false;
      // this.renderer.setClearColor(new THREE.Color())
      document.querySelector(`#third${componentId}`).appendChild(this.renderer.domElement);
      this.renderer.render(this.scene, this.camera, true);
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    rotateAnimateRender() { // 自动旋转
      const {stylesObj: {enableRotateAnimate, rotationDirection = 'y', rotationSpeed = 0.005}} = this.config;
      if (enableRotateAnimate) {
        this.group.rotation[rotationDirection] -= rotationSpeed;
      }
    },
    changePos(item) {
      const { x: cameraX, y: cameraY, z:cameraZ } = item;
      const camera = this.camera;
      const {position: { x, y, z }} = camera;
      this.flyTo({ x, y, z }, { cameraX, cameraY, cameraZ });
    },
    flyTo(pos1, pos2) { // 當前位置， 目標位置
      const { x, y, z } = pos1;
      const { cameraX, cameraY, cameraZ } = pos2;
      const tweenCamera1 = new TWEEN.Tween({x, y, z, lookAtX: 0, lookAtY: 0, lookAtZ: 0}).to({x: cameraX, y: cameraY, z: cameraZ, lookAtX: 0, lookAtY: 0, lookAtZ: 0}, 1000);
      const updateCamera = (object) => {
        this.camera.position.set(object.x, object.y, object.z);
        this.camera.lookAt(new THREE.Vector3(object.lookAtX, object.lookAtY, object.lookAtZ))
      }
      tweenCamera1.onUpdate(updateCamera);
      tweenCamera1.start();
      tweenCamera1.easing(TWEEN.Easing.Cubic.InOut);
      tweenCamera1.onComplete(() => {
        console.log('jieshu');
        // this.isShow = true;
      })
    },
    doReset() {
      const {cameraX, cameraY, cameraZ} = this.getCameraPos;
      const camera = this.camera;
      const {position: {x, y, z}} = camera;
      if (cameraX === x && cameraY === y && cameraZ === z) {
        return;
      }
      if (this.isShowSysPresets) {
        this.$refs.PresetsButton.reset();
      }
      this.flyTo({ x, y, z }, { cameraX, cameraY, cameraZ });
    },
    resetControls() { // 重置模型的相机位置和角度
      this.controls.reset();
    },
    animate() {
      this.renderer.clear();
      this.renderer.clearDepth();
      this.rotateAnimateRender();
      if (mixer2) {
        mixer2.update(clock2.getDelta());
      }
      this.render();
      this.controls.update();
      if (this.enableEnterAnimate) {
        TWEEN.update();
      }
      composer && composer.render();
      animationId = requestAnimationFrame(this.animate);
    },
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.controls.enablePan = !enablePan;


      // this.controls.minDistance = 1; // 设置相机距离原点的最近距离
      // this.controls.maxDistance = 20; // 设置相机距离原点的最远距离
      // this.controls.autoRotate = true;
      // this.controls.enablePan = false;
      // this.controls.enableRotate = false;
      // this.controls.enableZoom = false;
      // this.controls.minPolarAngle = 0;
      // this.controls.maxPolarAngle = Math.PI / 2;
      // this.controls.enableDamping = false;
      // this.controls.rotateSpeed = 0.5;
      // this.controls.autoRotateSpeed = 0.5;
      // this.controls.zoomSpeed = 0.8;
      // this.controls.maxZoom = 15;
      // this.controls.minZoom = 7;
      // controls.minAzimuthAngle = Math.PI * (100 / 180);
      // controls.maxAzimuthAngle = Math.PI * (100 / 180);
      // this.controls.target.set(0, 0, -0.2);
      // this.controls.update();
    },
    init() {
      if (!this.scene) {
        this.initScene();
      }
      if (!this.camera) {
        this.initCamera();
      }
      if (!this.renderer) {
        this.initRenderer();
      }
      if (!this.controls) {
        this.initControls();
      }
      this.doChangeConfig();
      this.initLight();
      this.animate();
      if (!composer) {
        composer = new EffectComposer(this.renderer);
        renderPass = new RenderPass(this.scene, this.camera);
        composer.addPass(renderPass);
        // 后处理 - 描边
        this.setOutLine();
        // 外发光
        this.setGlow();
      }
    },
    deleteObject(group) {
      // 递归遍历组对象group释放所有后代网格模型绑定几何体占用内存
      // group.traverse(function(obj) {
      //   if (obj.type === 'Mesh') {
      //     obj.geometry.dispose();
      //     obj.material.dispose();
      //   }
      // })
      const clearCache = (item) => {
        // eslint-disable-next-line no-unused-expressions
        item?.geometry?.dispose();
        // eslint-disable-next-line no-unused-expressions
        item?.material?.dispose();
      };

      // 递归释放物体下的 几何体 和 材质
      const removeObj = (obj) => {
        obj.children.forEach((item) => {
          if (item.children.length) {
            removeObj(item);
          } else {
            clearCache(item);
            item.clear();
          }
        });
        obj.clear();
        obj.children = [];
      };

      // 移除 group
      removeObj(group);
      // 删除场景对象scene的子对象group
      // this.scene.remove(group);
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    updateStyles(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const {stylesObj} = this.config;
      const newInfo = {
        ...this.config,
        stylesObj: {
          ...stylesObj,
          ...obj
        }
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstopBtn(config, key) {
      this.draggingBtn(config, key);
    },
    draggingBtn(config, key) {
      if (!key) {
        const {
          width: resetBtnWidth,
          height: resetBtnHeight,
          top: resetBtnTop,
          left: resetBtnLeft
        } = config;
        this.updateStyles({resetBtnWidth, resetBtnHeight, resetBtnTop, resetBtnLeft});
        return;
      }
      const {
        width: presetGroupWidth,
        height: presetGroupHeight,
        top: presetGroupTop,
        left: presetGroupLeft
      } = config;
      this.updateStyles({presetGroupWidth, presetGroupHeight, presetGroupTop, presetGroupLeft});
    },
    resizeBtn(config, key) {
     this.draggingBtn(config, key);
    },
    dragstop(newRect) {
      this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick() {
      console.log('activated1', this.loaded);
      if (this.loaded) {
        console.log('activated1');
        this.$nextTick(() => {
          this.$emit('updateActiveComponent', this.config);
        })
        setTimeout(() => {
          Bus.$emit(this.eventKey, {
            animationOptions: animations,
            meshOptions: this.meshOptions,
            childMesh: this.childMesh
          });
        }, 400)
      }
    },
    activated() {
      console.log('activated');
    },
    show(e) {
      if (this.loaded) {
        this.$emit('updateActiveComponent', this.config);
        this.$emit('rightClickComponent', e);
        setTimeout(() => {
          Bus.$emit(this.eventKey, {
            animationOptions: animations,
            meshOptions: this.meshOptions,
            childMesh: this.childMesh
          });
        }, 400)
      }
    },
    destroyed3d() {
      if (this.scene) {
        // this.render = null
        this.scene.traverse(function (v) {
          if (v.type === 'Mesh') {
            v.geometry.dispose()
            v.material.dispose()
          }
          if (v.material) {
            v.material.dispose();
          }
          if (v.geometry) {
            v.geometry.dispose();
          }
          v = null;
        })
        while (this.scene.children.length > 0) {
          this.scene.remove(this.scene.children[0])
        }
        this.scene.clear()
        this.removePointerMove();
        this.removeGlowEffects();
        this.scene = null
        // let gl = this.renderer.domElement.getContext('webgl');
        // gl && gl.getExtension('WEBGL_lose_context').loseContext();
        this.camera = null
        this.controls = null
        this.renderer.domElement = null
        this.renderer.dispose()
        this.renderer.forceContextLoss()
        this.renderer = null
        this.clearAnimationFrame();
        this.observer = null; // 观察器
        if (this.group.children.length) {
          this.deleteObject(this.group);
        }
        this.group = null;// 分组
        this.axes = null; // 辅助线
        ambientLight = null;
        hemisphereLight = null;
        directionalLight = null;
        pointLight = null;
        animations = [];
        mixer2 = null;
        clock2 = null;
      }
    }
  },
  components: {
    PresetsButton
  },
  beforeDestroy() {
    // 销毁Three.js场景和渲染器
    this.destroyed3d();
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .btnWrap {
    width: 100%;
    height: 100%;
    text-align: center;
    overflow: hidden;

    img {
      vertical-align: middle;
    }
  }

  .pieHook {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>
