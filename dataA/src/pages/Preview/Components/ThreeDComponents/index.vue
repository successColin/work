/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles"
       :id="`third${config.componentId}Box`"
  >
    <div class="threeBox">
      <div class="singleTextContent" :id="`third${config.componentId}${designType}`"></div>
      <div style="width: 100%;height: 100%;" :style="getBtnStyles" class="btnWrap" @click="resetControls">
        <img
            :src="config.stylesObj.resetBtnBgUrl"
            v-if="config.stylesObj.resetBtnBgUrl"
            :style="getImgStyles"
        >
      </div>
      <div v-if="isShowSysPresets" :style="systemPresetsStyles" class="systemPresetsWrap">
        <PresetsButton ref="PresetsButton" :config="presetsConfig" @click="changePos"/>
      </div>
    </div>

  </div>
</template>

<script>
import PresetsButton from '@/pages/Configuration/Components/ThreeDComponents/component/PresetsButton';
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import * as TWEEN from '@tweenjs/tween.js'
import {screenConfig} from '@/constants/global';
import {getHexColor, IsURL } from '@/utils/utils';
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
import {isEqual} from 'lodash/isEqual';
import {getInfoById} from '@/services/design';
import {decrypt} from '@/utils/secret';
import Bus from '@/utils/bus';

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
    designType: {
      type: String,
      default: ''
    },
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
      scene: null, // 场景
      camera: null, // 相机
      renderer: null, // 渲染器
      controls: null, // 控制器
      group: null, // 分组
      axes: null,// 辅助线
      list: [],
      client: null
    };
  },
  computed: {
    systemPresetsStyles() {
      const { stylesObj: { presetGroupWidth, presetGroupHeight, presetGroupLeft, presetGroupTop } } = this.config;
      return { width: `${presetGroupWidth}px`, height: `${presetGroupHeight}px`, left: `${presetGroupLeft}px`, top: `${presetGroupTop}px` };
    },
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
      const {stylesObj: {
        resetBtnBgColor,
        resetBtnBorderRadius,
        resetBtnWidth,
        resetBtnHeight,
        resetBtnTop,
        resetBtnLeft
      }} = this.config;
      return {
        width: `${resetBtnWidth}px`,
        height: `${resetBtnHeight}px`,
        left: `${resetBtnLeft}px`,
        top: `${resetBtnTop}px`,
        backgroundColor: resetBtnBgColor,
        lineHeight: `${resetBtnHeight}px`,
        borderRadius: `${resetBtnBorderRadius}%`
      }
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
      const {width, height, left, top, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;left:${left}px;top: ${top}px;zIndex:${stylesObj.zIndex};`;
    }
  },
  mounted() {
    // 创建组
    this.group = new THREE.Group();
    clock2 = new THREE.Clock(); // 用于clock.getDelta()
    this.start();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: false,
      handler(v, o) {
        const params = this.getParameters();
        const {isShow} = this.config;
        if (JSON.stringify(v) !== '{}' && JSON.stringify(o) === '{}' && params.varJson !== '[]' && isShow) {
          this.initData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.initData();
        }
      }
    },
    list: {
      deep: true,
      immediate: false,
      handler() {
        this.setAnimate();
        this.setChildModels();
      }
    }
  },
  methods: {
    async start() {
      await this.init();
      await this.addModels();
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
          this.timer = setTimeout(() => {
            this.getApi();
          }, time);
        }
        if (!enableApiFilter) {
          this.list = targetObj;
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.list = result;
          return;
        }
        this.list = JSON.parse(targetObj);
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
        this.timer = setTimeout(() => {
          this.getSQL();
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        // await this.setChildModels(true);
        // console.log(4);
        // this.setAnimate();
        // console.log(5);
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.list = result;
        // await this.setChildModels(true);
        // console.log(4);
        // this.setAnimate();
        return;
      }
      this.list = JSON.stringify(res);
    },
    async initData() {

      const {dataType, dataConfig} = this.config;
      const {staticValue} = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        this.list = obj;
        await this.setAnimate();
        await this.setChildModels();
      }
      if (dataType === 2) {
        this.loading = true;
        await this.getApi();
        this.loading = false;
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        this.loading = false;
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
        this.list = data;
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.list = result;
        return;
      }
      this.list = data;
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
    doClick(){
      const {operationModelsConfig = []} = this.config;
      const arr = operationModelsConfig.filter((item) => item.interactionMode !== 1);
      if (!arr.length) return;
      this.renderer.domElement.addEventListener('click', this.onPointerMove);
    },
    setOutLine() { // 设置描边
      const {stylesObj: {enableHoverEffects}, width, height} = this.config;
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
      this.renderer.domElement.addEventListener('pointermove', (e) => {
        this.onPointerMove(e, true)
      });
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
    showModel({ clickBulletUrl, clickBulletHeight: bulletHeight, clickBulletWidth: bulletWidth}, data) {
      if (!clickBulletUrl) return;
      const newUrl = clickBulletUrl.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
        return data[o];
      }).replaceAll('{', '').replaceAll('}', '');
      if (!IsURL(newUrl)) return;
      Bus.$emit('modalOpera', {
        visible: true,
        singleConfig: {
          url: newUrl,
          bulletWidth,
          bulletHeight
        },
        otherParams: {}
      });
    },
    hrefUrl({ url, enableOpenNewWindow }, data){
      if (!url) {
        return;
      }
      const newUrl = url.replace(/(?<=\{)(.+?)(?=\})/g, (o) => {
        return data[o];
      }).replaceAll('{', '').replaceAll('}', '');
      if (!IsURL(newUrl)) {
        return;
      }
      if (enableOpenNewWindow) {
        window.open(newUrl, '_blank');
      } else {
        window.open(newUrl, '_self');
      }
    },
    linkage(rest, data) {
      const { paramsFieldsConfig, updateChart = [] } = rest;
      if (!updateChart.length || !paramsFieldsConfig.length) {return;}
      let params = {};
      updateChart.forEach((key) => {
        paramsFieldsConfig.forEach((field) => {
          const { name, value } = field;
          params[`${key}_${name}`] = data[value] || value;
        })
      })
      const newParams = {
        ...this.otherParams,
        ...params
      }
      this.updateState('filterParameter', newParams);
    },
    checkClick(object) {
      const {operationModelsConfig = [], stylesObj: {identifier}} = this.config;
      const { name } = object;
      const onlyKey = '${' + name + '}${' + (object?.parent?.name ?? '') + '}';
      const target = operationModelsConfig.find(({ value, label, interactionMode = 1 }) => {
        return onlyKey === value && interactionMode !== 1;
      })
      if (!target) return;
      const { interactionMode, identifierValue,  ...rest } = target;
      const data = this.list.find((item) => `${item[identifier]}` === identifierValue);
      if (interactionMode === 2 && data) { // 弹窗
        this.showModel(rest, data);
        return;
      }
      if (interactionMode === 3 && data) { // 链接
        this.hrefUrl(rest, data);
        return;
      }
      if (interactionMode === 4 && data) { // 联动
        this.linkage(rest, data);
        return;
      }
    },
    onPointerMove(event, flag) {
      if (event.isPrimary === false && flag) {
        return;
      }
      const {width, height} = this.config;
      mouse.x = event.offsetX / width * 2 - 1;
      mouse.y = -(event.offsetY / height) * 2 + 1;
      this.checkIntersection(flag);

    },
    addSelectedObject(object, flag) {
      // flag 值为true，是鼠标悬浮，false,点击
      selectedObjects = [];
      selectedObjects.push(object);
      if (!flag) {
        this.checkClick(object);
      }
    },
    checkIntersection(flag) {

      raycaster.setFromCamera(mouse, this.camera);

      const intersects = raycaster.intersectObject(this.scene, true);
      if (intersects.length > 0) {
        const selectedObject = intersects[0].object;
        this.addSelectedObject(selectedObject, flag);
        if (outlinePass) {
          outlinePass.selectedObjects = selectedObjects;
        }
      } else {
        // outlinePass.selectedObjects = [];
      }
    },
    clearAnimationFrame() {
      if (animationId) {
        cancelAnimationFrame(animationId)
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
    async setChildModels() {
      const model = this.group.children[0];
      const {showOrHideModelsConfig, stylesObj: {identifier}} = this.config;
      if (model) {
        model.traverse((object) => {
          const {name, isMesh} = object;
          const onlyKey = '${' + name + '}${' + (object?.parent?.name ?? '') + '}';
          const targetModel = showOrHideModelsConfig.find((item) => item.value === onlyKey);
          if (targetModel) { // 如果发现模型存在
            const {conditionsArr = [], identifierValue} = targetModel;
            if (conditionsArr.length) {
              const realConditionsArr = conditionsArr.filter((item) => item.enableConditions);
              if (realConditionsArr.length) {
                const data = this.list.find((item) => `${item[identifier]}` === identifierValue);
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
            const data = this.list.find((item) => `${item[identifier]}` === identifierValue);
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
        // await this.setChildModels(true);
        // console.log(4);
        // this.setAnimate();
        // console.log(5);
        this.render();
        this.initData();
        if (this.enableEnterAnimate) {
          this.initEnterAnimate();
        }
      },
          // eslint-disable-next-line no-unused-vars
      (xhr) => {
        // 控制台查看加载进度xhr
        // 通过加载进度xhr可以控制前端进度条进度   Math.floor:小数加载进度取整
        // const progress = xhr.loaded / xhr.total * 100
        // const progress = Math.floor(xhr.loaded / xhr.total * 100);
        // if (progress === 100) {
        //
        // }
      },
      // 加载错误回调函数onError
      function (err) {
        console.error('加载发生错误', err);
      }
      )
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
        console.log('jieshu');
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
      document.querySelector(`#third${componentId}${this.designType}`).appendChild(this.renderer.domElement);
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
    resetControls() { // 重置模型的相机位置和角度
      // this.controls.reset();
      const { cameraX, cameraY, cameraZ} = this.getCameraPos;
      const camera = this.camera;
      const { position: { x, y, z } } = camera;
      if (cameraX === x && cameraY === y && cameraZ === z) {
        return;
      }
      if (this.isShowSysPresets) {
        this.$refs.PresetsButton.reset();
      }
      this.flyTo({ x, y, z }, { cameraX, cameraY, cameraZ });
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
      this.initScene();
      this.initCamera();
      this.initRenderer();
      this.initControls();
      this.initLight();
      this.doChangeConfig();
      this.animate();
      composer = new EffectComposer(this.renderer);
      renderPass = new RenderPass(this.scene, this.camera);
      composer.addPass(renderPass);
      // 后处理 - 描边
      this.setOutLine();
      this.doClick();
      // 外发光
      this.setGlow();
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
  justify-content: center;
  box-sizing: border-box;
  .threeBox{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .singleTextContent {
    width: 100%;
    height: 100%;
  }
  .systemPresetsWrap{
    position: absolute;
  }
  .btnWrap {
    position: absolute;
    //width: 100%;
    //height: 100%;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      opacity: .8;
    }
    img {
      vertical-align: middle;
    }
  }
}
</style>
