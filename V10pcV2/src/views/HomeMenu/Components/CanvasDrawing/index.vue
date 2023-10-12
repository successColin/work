/**
* @name: CanvasDrawing
* @author: DELL
* @date: 2022/2/28 9:45
* @description：CanvasDrawing
* @update: 2022/2/28 9:45
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles" :id="`canvasWrap_${config.componentId}`">
    <div class="boxWrap">
      <div class="crumbsWrap" v-if="crumbsArr.length>1">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
              v-for="(item, i) in crumbsArr"
              :key="item.parentHost"
              :style="getBreadStyles(i)"
          >
            <span @click="doBack(item,i)">{{ item.name }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <canvas
          :id="`canvas_${config.componentId}`"
          :width="config.width"
          :height="config.height"></canvas>
      <div class="canvasTipInfoCanvas" v-show="isHover" :style="getTipInfo" v-html="tipHtml"></div>
    </div>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import Bus from '@/utils/bus';
import { getHotInfo, getZoom } from '@/api/design';
import { validSqlConditions } from '@/views/HomeMenuConfig/constants/common';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    transitionScaleY: {
      type: Number,
      default: 1
    },
    transitionScaleX: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
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
      timer: null,
      refreshTimer: null,
      canvasObject: null,
      panning: false, // 用于控制是否底图移动
      blockPanning: false, // 用于控制热区是否移动
      controlledComponents: [], // 受控组件集合
      controlledVarArr: [], // 受控组件变量集合
      // polygon 相关参数
      polygonMode: false,
      pointArray: [],
      lineArray: [],
      activeShape: false,
      activeLine: '',
      line: {},
      isHover: false,
      pointerPosition: null,
      dom: null,
      tipHtml: '',
      crumbsArr: [{ // 图层
        parentHost: 0,
        name: '全部'
      }],
      isFirst: true // 是否是底层，用于控制自动更新数据
    };
  },

  components: {},

  computed: {
    getBreadStyles() {
      return function (i) {
        const { stylesObj: { pathColor } } = this.config;
        const n = this.crumbsArr.length - 1;
        return {
          color: pathColor,
          opacity: n === i ? 1 : 0.6
        };
      };
    },
    getTipInfo() {
      if (!this.tipHtml) {
        return { opacity: 1, background: 'unset' };
      }
      if (this.dom && this.pointerPosition) {
        const { clientWidth } = document.body;
        const { offsetHeight } = this.dom;
        const { left: domLeft } = this.dom.getBoundingClientRect();
        const { width } = this.dom.querySelector('.canvasTipInfoCanvas').getBoundingClientRect();
        // eslint-disable-next-line max-len
        const leftValue = domLeft + this.pointerPosition.e.offsetX + width > clientWidth ? this.pointerPosition.e.offsetX - width / this.transitionScaleX - 10 : this.pointerPosition.e.offsetX + 10;
        // eslint-disable-next-line max-len
        const topValue = this.pointerPosition.e.offsetY - offsetHeight - 10 <= 0 ? this.pointerPosition.e.offsetY + 10 : this.pointerPosition.e.offsetY - offsetHeight - 10;
        return { left: `${leftValue}px`, top: `${topValue}px`, opacity: 1, background: 'rgba(0, 0, 0, 0.8)' };
      }
      return {};
    },
    getContentStyles() {
      const { width, height, stylesObj, left, top } = this.config;
      return `width:${width}px;height:${height}px;left:${left}px;top: ${top}px;zIndex:${stylesObj.zIndex};`;
    },
    getList() {
      return this.list;
    }
  },
  mounted() {
    this.dom = document.getElementById(`canvasWrap_${this.config.componentId}`);
    this.$nextTick(() => {
      const { componentId, designObject } = this.config;
      const idHook = `canvas_${componentId}`;
      const canvas = new fabric.Canvas(idHook);
      if (!this.canvasObject) {
        canvas.selection = false; // 不允许选中画布
        this.canvasObject = canvas;
        Bus.$emit(`${componentId}_fabric`, canvas);
        if (designObject) {
          this.renderCanvas(designObject);
        }
        this.initDomEvent();
        // this.setCanvasSize();
      }
    });
    // window.addEventListener('resize', this.setCanvasSize);
  },
  watch: {},
  methods: {
    // 后续加其他的动画
    twinkle(block, canvas) { // 闪烁动画
      block.animate('opacity', block.get('opacity') === 1 ? 0 : 1, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas),
        onComplete: () => this.twinkle(block, canvas)
      });
    },
    /**
     * js获取文本显示宽度
     * @param str: 文本
     * @return number
     */
    getTextWidth(str) {
      const dom = document.createElement('span');
      dom.style.display = 'inline-block';
      dom.textContent = str;
      document.body.appendChild(dom);
      const w = dom.clientWidth;
      document.body.removeChild(dom);
      return w;
    },
    createText({
      objects,
      // FontFamily,
      // FontWeight,
      FontSize,
      Color,
      customShowInfo
      // blockConfigs
    }) { // 创建显示内容
      const { left, top, width, height } = objects;
      const text = customShowInfo;
      const textWidth = this.getTextWidth(text);
      const itext = new fabric.IText(text, {
        left: left + width / 2 - textWidth / 2,
        top: top + height / 2 - FontSize / 2,
        fontSize: FontSize,
        fill: Color,
        zIndex: 1
      });
      itext.hasBorders = false;
      itext.hasControls = false;
      itext.transparentCorners = false;
      itext.hoverCursor = 'pointer';
      itext.selectable = false;
      itext.perPixelTargetFind = true;
      this.canvasObject.add(itext);
      // this.canvasObject.renderAll();
    },
    doBack(item, i) {
      const n = this.crumbsArr.length;
      if (i === n - 1) {
        return;
      }
      this.crumbsArr = this.crumbsArr.slice(0, i + 1);
      // eslint-disable-next-line no-unused-expressions
      this.canvasObject && this.canvasObject.clear();
      this.fetchInfo(item);
    },
    async fetchInfo({ parentHost }) {
      if (!parentHost) { // 如果是根节点的情况， 获取控件里面canvas的配置属性
        const { designObject, stylesObj: {
          dataSourceVar = '',
          dataSourceValue = '',
          dataDetailVar = '',
          dataDetailValue = '',
          associatedControls = []
        } } = this.config;
        if (designObject) {
          this.renderCanvas(designObject);
        }
        this.isFirst = true;
        const postData = {};
        associatedControls.forEach((key) => {
          if (dataSourceVar) {
            postData[`${key}_${dataSourceVar}`] = dataSourceValue;
          }
          if (dataDetailVar) {
            postData[`${key}_${dataDetailVar}`] = dataDetailValue;
          }
        });
        const newParams = {
          ...this.otherParams,
          ...postData
        };
        this.updateState('filterParameter', newParams);
        return;
      }
      const res = await getHotInfo({ id: parentHost || 0 }) || {};
      const {
        configMessage = '',
        designJson = '{}',
        varJson = '[]'
      } = res;
      const newJson = JSON.parse(designJson);
      if (configMessage) {
        this.renderCanvas(configMessage, newJson);
      }
      const params = {};
      const { updateCharts = [] } = newJson;
      const newVarJson = JSON.parse(varJson);
      this.controlledComponents.push(...updateCharts); // 记录下受控组件
      updateCharts.forEach((key) => {
        const obj1 = newVarJson[0] || {};
        const obj2 = newVarJson[1] || {};
        params[`${key}_${obj1.name}`] = obj1.value;
        params[`${key}_${obj2.name}`] = obj2.value;
      });
      const newParams = {
        ...this.otherParams,
        ...params
      };
      this.updateState('filterParameter', newParams);
    },
    renderCanvas(designObject, initDesignJson = {}) {
      let enableAutoUpdate = false;
      let time = 0;
      const { id, stylesObj: { updateTime } } = this.config;
      const realDesignObject = JSON.parse(designObject);
      console.log(realDesignObject, 'realDesignObject');
      const n = this.crumbsArr.length;
      if (this.isFirst) {
        enableAutoUpdate = this.config.enableAutoUpdate;
        time = updateTime;
      } else {
        const { enableAutoUpdate: isAutoUpdate, updateZoomTime } = initDesignJson;
        enableAutoUpdate = isAutoUpdate || false;
        time = updateZoomTime;
      }
      const { parentHost } = this.isFirst ? this.crumbsArr[0] : this.crumbsArr[n - 1];
      getZoom({ id, parentHost }).then((res) => {
        // eslint-disable-next-line max-len
        this.canvasObject.loadFromJSON(realDesignObject, this.canvasObject.renderAll.bind(this.canvasObject), (o, objects) => {
          if (!objects) {
            return;
          }
          const { id: blockId } = objects;
          const blockConfigs = res.find((item) => item.id === blockId) || {};
          if (!blockConfigs) { return; }
          // eslint-disable-next-line no-shadow
          const { filtersJson, designJson = '{}', customShowInfoSql = '' } = blockConfigs;
          objects.perPixelTargetFind = true; // 默认为true;
          if (filtersJson) {
            const realJson = JSON.parse(filtersJson);
            if (realJson.length) {
              const arr = realJson.filter((item) => item.enableConditions);
              const result = validSqlConditions(arr);
              if (result) {
                const { borderWidth, borderColor, fillColor } = result;
                const arrColor = fillColor.split(',');
                const nColor = arrColor.length;
                if (nColor > 1 && arrColor[nColor - 1] === ' 0)') {
                  objects.perPixelTargetFind = false; // 填充色没有，就不用边界判断;
                }
                objects.strokeWidth = borderWidth;
                objects.fill = fillColor;
                objects.stroke = borderColor;
                this.twinkle(objects, this.canvasObject);
              }
            }
          }
          objects.hasBorders = false;
          objects.zIndex = 12;
          objects.hasControls = false;
          objects.transparentCorners = false;
          objects.hoverCursor = 'pointer';
          objects.selectable = false;
          this.addBlockEvent(objects, blockConfigs);
          const newDesignJson = JSON.parse(designJson);
          // eslint-disable-next-line max-len
          const { enableShowInfo, showInfoType, customShowInfo, FontFamily, FontWeight, FontSize, Color } = newDesignJson;
          if (
            (showInfoType === 1 && customShowInfo || showInfoType === 2 && customShowInfoSql)
              &&
              enableShowInfo
          ) {
            const info = showInfoType === 1 ? customShowInfo : customShowInfoSql;
            setTimeout(() => {
              this.createText({
                objects,
                customShowInfo: info,
                FontFamily,
                FontWeight,
                FontSize,
                Color,
                blockConfigs
              });
            }, 100);
          }
          this.canvasObject.absolutePan({ x: 0, y: 0 });
          this.canvasObject.renderAll();
        });
        if (enableAutoUpdate) {
          this.refreshBlocks(time); // 隔断时间进行刷新数据
        }
      });
    },
    refreshBlocks(updateTime) {
      const n = this.crumbsArr.length;
      const { id } = this.config;
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }
      this.refreshTimer = setTimeout(() => {
        const { parentHost } = this.isFirst ? this.crumbsArr[0] : this.crumbsArr[n - 1];
        getZoom({ id, parentHost }).then((res = []) => {
          this.canvasObject.forEachObject((obj) => {
            const current = res.find((item) => item.id === obj.id); // 找到对应的热区配置
            if (!current) { return; }
            const { designJson = '{}', customShowInfoSql = '' } = current;
            const newDesignJson = JSON.parse(designJson);
            if (current && current.filtersJson) {
              const { filtersJson = '{}' } = current;
              const realJson = JSON.parse(filtersJson);
              if (realJson.length) {
                const arr = realJson.filter((item) => item.enableConditions);
                const result = validSqlConditions(arr);
                if (result) {
                  const { borderWidth, borderColor, fillColor } = result;
                  obj.strokeWidth = borderWidth;
                  obj.fill = fillColor;
                  obj.stroke = borderColor;
                  obj.set({ fill: fillColor, strokeWidth: borderWidth, stroke: borderColor });
                  obj.dirty = true;
                  this.twinkle(obj, this.canvasObject);
                } else {
                  const { borderWidth, fillColor, borderColor } = newDesignJson;
                  obj.strokeWidth = borderWidth;
                  obj.fill = fillColor;
                  obj.stroke = borderColor;
                  obj.set({ fill: fillColor, strokeWidth: borderWidth, stroke: borderColor });
                  obj.dirty = true;
                }
              }
            }
            const {
              enableShowInfo,
              showInfoType,
              customShowInfo,
              FontFamily,
              FontWeight,
              FontSize,
              Color
            } = newDesignJson;

            if (
              (showInfoType === 1 && customShowInfo || showInfoType === 2 && customShowInfoSql)
                &&
                enableShowInfo
            ) {
              const info = showInfoType === 1 ? customShowInfo : customShowInfoSql;
              setTimeout(() => {
                this.createText({
                  objects: current,
                  customShowInfo: info,
                  FontFamily,
                  FontWeight,
                  FontSize,
                  Color
                });
              }, 100);
            }
          });
          this.canvasObject.renderAll();
          this.refreshBlocks(updateTime);
        });
      }, updateTime * 1000);
    },
    renderTipHtml(config) { // 渲染提示信息
      const { messageType, messageJson = '[]', designJson = '{}' } = config;
      const realDesignJson = JSON.parse(designJson);
      const { customTipInfo } = realDesignJson;
      if (messageType === 1) {
        if (!customTipInfo) {
          this.tipHtml = '';
        } else {
          this.tipHtml = `<p>${customTipInfo || ''}</p>`;
        }
      }
      if (messageType === 2) {
        const arr = JSON.parse(messageJson);
        if (!arr.length) {
          this.tipHtml = '';
        } else {
          arr.forEach((item) => {
            this.tipHtml += `<p><label>${item.name || ''}</label>： ${item.value || ''}</p>`;
          });
        }
      }
    },
    // 设置canvas画布大小
    setCanvasSize() {
      const { designObject = '{}' } = this.config;
      if (designObject) {
        const realDesignObject = JSON.parse(designObject);
        if (realDesignObject.backgroundImage) {
          console.log(111, realDesignObject);
          // this.setInitZoom(realDesignObject.backgroundImage);
        }
      }
    },
    initDomEvent() { // 初始化画布
      const that = this;
      that.panning = false;
      // eslint-disable-next-line no-unused-vars
      let mouseForm = { x: 0, y: 0 };
      // eslint-disable-next-line no-unused-vars
          const mouseTo = { x: 0, y: 0 };
      // eslint-disable-next-line no-unused-vars
          let mouseMove = { x: 0, y: 0 };
      // eslint-disable-next-line no-unused-vars
          let lastMouseMove = { x: 0, y: 0 };
      this.canvasObject.on({
        'mouse:down': (e) => {
          that.panning = true;
          mouseForm = that.canvasObject.getPointer(e, false);
          lastMouseMove = { x: e.e.layerX, y: e.e.layerY };
        },
        'mouse:move': (e) => {
          mouseMove = { x: e.e.layerX, y: e.e.layerY };
          if (this.panning && e && e.e) {
            const delta = new fabric.Point(e.e.movementX, e.e.movementY);
            that.canvasObject.relativePan(delta);
          }
        },
        'mouse:up': () => {
          that.panning = false;
          // 如果有选中绘制类型，鼠标松开开始添加热区
        },
        'mouse:wheel': (e) => {
          // var zoom = (event.deltaY > 0 ? 0.1 : -0.1) + this.canvasObject.getZoom();
          // zoom = Math.max(0.1,zoom); //最小为原来的1/10
          // zoom = Math.min(3,zoom); //最大是原来的3倍
          // var zoomPoint = new fabric.Point(event.pageX, event.pageY);
          // this.canvasObject.zoomToPoint(zoomPoint, zoom);

          let canvasZoom = this.canvasObject.getZoom();
          const scale = 1.05;
          if (e.e.deltaY < 0 && canvasZoom <= 0.2) {
            // 解决缩小到极限抖动问题
            canvasZoom = 0.2;
          } else if (e.e.deltaY < 0) {
            canvasZoom *= (1 / scale);
          } else if (canvasZoom < 10) {
            canvasZoom *= scale;
          }
          this.setCanvasZoom(canvasZoom);
        }
      });
    },
    // 区块添加事件
    addBlockEvent(block, blockConfigs) {
      block.on('mouseup', () => { // 单击
        this.doClickBlock(block);
      });
      block.on('mousedblclick', () => {
        // this.doClickBlock(block);
      });
      block.on('mousemove', (e) => {
        this.pointerPosition = e;
      });
      block.on('mouseover', () => {
        this.isHover = true;
        this.renderTipHtml(blockConfigs);
      });
      block.on('mouseout', () => {
        this.isHover = false;
        this.pointerPosition = null;
        this.tipHtml = '';
      });
    },
    // 控制器输入的缩放比例
    setCanvasZoom(zoom) {
      const center = this.canvasObject.getCenter();
      const corsurPoint = new fabric.Point(center.left, center.top);
      this.canvasObject.zoomToPoint(corsurPoint, zoom);
    },
    setInitZoom(item) {
      const { width, height } = item;
      // eslint-disable-next-line radix
      const zoom = parseInt(this.canvasObject.width * 100 / width) / 100;
      const layerY =
          this.canvasObject.height - height * zoom > 0
              // eslint-disable-next-line radix
            ? parseInt((this.canvasObject.height - height * zoom) / 10)
            : 0;
      const corsurPoint = new fabric.Point(10, layerY);
      this.canvasObject.zoomToPoint(corsurPoint, zoom);
    },
    async doClickBlock(block) { // 点击区块
      const { id } = block;
      if (!id) {
        return;
      }
      const res = await getHotInfo({ id });
      const { designJson = '{}', varJson = '[]' } = res;
      const realDesignJson = JSON.parse(designJson);
      // eslint-disable-next-line max-len,prefer-const
      let { openType, url, interactionMode, bulletType, bulletWidth, bulletHeight, bulletUrl } = realDesignJson;
      const { stylesObj: { type } } = this.config;
      let newVarJson = [];
      try {
        newVarJson = JSON.parse(varJson);
      } catch (e) {
        newVarJson = [];
      }
      const obj1 = newVarJson[0] || {};
      const obj2 = newVarJson[1] || {};
      if (type === 1 && url && interactionMode === 3) { // 跳链接
        if (url.indexOf('?') === -1) {
          url += `?${obj1.name}=${obj1.value}&${obj2.name}=${obj2.value}`;
        } else {
          url += `&${obj1.name}=${obj1.value}&${obj2.name}=${obj2.value}`;
        }
        if (openType === 1) { // 刷新当前页
          window.location.href = url;
        }
        if (openType === 2) { // 打开新页面
          window.open(url, '_blank');
        }
        // eslint-disable-next-line max-len
      } else if (type === 1 && interactionMode === 2 && bulletUrl && bulletType === 1) { // tangchuang
        let newBulletUrl = bulletUrl;
        if (bulletUrl.indexOf('?') === -1) {
          newBulletUrl += `?${obj1.name}=${obj1.value}&${obj2.name}=${obj2.value}`;
        } else {
          newBulletUrl += `&${obj1.name}=${obj1.value}&${obj2.name}=${obj2.value}`;
        }
        Bus.$emit('modalOpera', {
          visible: true,
          singleConfig: {
            url: newBulletUrl,
            bulletWidth,
            bulletHeight
          },
          otherParams: {}
        });
        // eslint-disable-next-line no-empty
      } else if (type === 1 && interactionMode === 1) {

      } else if (type === 2) {
        this.drillDownLayer(res);
      }
    },
    drillDownLayer(config) { // 下钻图层
      console.log(config, '下钻');
      // designJson
      const { configMessage, id, name, designJson = '{}', varJson = '[]', parentHost } = config;
      const newJson = JSON.parse(designJson);
      const { updateCharts = [] } = newJson;
      let newVarJson = [];
      try {
        newVarJson = JSON.parse(varJson);
      } catch (e) {
        newVarJson = [];
      }
      this.isHover = false;
      this.pointerPosition = null;
      this.tipHtml = '';
      const params = {};
      if (!configMessage) {
        return;
      }
      if (updateCharts.length) {
        this.controlledComponents.push(...updateCharts); // 记录下受控组件
        updateCharts.forEach((key) => {
          const obj1 = newVarJson[0];
          const obj2 = newVarJson[1];
          params[`${key}_${obj1.name}`] = obj1.value;
          params[`${key}_${obj2.name}`] = obj2.value;
        });
        const newParams = {
          ...this.otherParams,
          ...params
        };
        this.updateState('filterParameter', newParams);
      }
      const n = this.crumbsArr.length;
      const zoom = { parentHost: id, name };
      if (n === 1) {
        this.crumbsArr.push(zoom);
      } else if (this.crumbsArr[n - 2].parentHost === parentHost) {
        this.crumbsArr.splice(n - 1, 1, zoom);
      } else {
        this.crumbsArr.push(zoom);
      }
      if (this.refreshTimer) {
        clearTimeout(this.refreshTimer);
      }
      this.isFirst = false;
      console.log(configMessage, newJson, '下钻');
      this.renderCanvas(configMessage, newJson);
    }
  },
  beforeDestroy() {
    this.canvasObject = null;
    // eslint-disable-next-line no-unused-expressions
    this.timer && clearTimeout(this.timer);
    this.refreshTimer = null;
    // eslint-disable-next-line no-unused-expressions
    // window && window.removeEventListener('resize', this.setCanvasSize);
    this.timer = null;
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  width: 100%;
  height: 100%;
  .boxWrap{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .imageContent {
    width: 100%;
    height: 100%;

    .imageBox {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }

  .crumbsWrap {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 3333;

    ::v-deep {
      .el-breadcrumb__separator{
        color: inherit;
      }
      .el-breadcrumb__inner {
        color: inherit;
        font-size: 16px;
        cursor: pointer;
      }
    }
  }

}
</style>
