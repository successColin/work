/**
* @name: CanvasDrawing
* @author: DELL
* @date: 2022/2/28 9:45
* @description：CanvasDrawing
* @update: 2022/2/28 9:45
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap">
    <div class="crumbsWrap" v-if="crumbsArr.length>1">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
            v-for="(item, i) in crumbsArr"
            :key="item.parentHost"
            :style="getBreadStyles(i)"
        ><span @click="doBack(item,i)">{{ item.name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <canvas
        :id="`canvas_${config.componentId}`"
        :width="config.width"
        :height="config.height"></canvas>
  </div>
</template>

<script>
import { fabric } from 'fabric';
import Bus from '@/utils/bus';
import { doAddHotDesign, editHotInfo, getHotInfo } from '@/api/design';

export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default: () => {
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
    }
  },
  data() {
    return {
      drawType: null, // 热区格式
      subHotZone: {}, // 子热区数据
      timer: null,
      saveTimer: null, // 保存的定时器
      canvasObject: null,
      panning: false, // 用于控制是否底图移动
      blockPanning: false, // 用于控制热区是否移动

      // polygon 相关参数
      polygonMode: false,
      pointArray: [],
      lineArray: [],
      activeShape: false,
      activeLine: '',
      line: {},
      crumbsArr: []
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
    getList() {
      return this.list;
    }
  },
  mounted() {
    const { componentId, designObject } = this.config;
    // Bus.$emit(`crumbsArrChange_${this.activeComponent.componentId}`, v);
    const eventName1 = `crumbsArrChange_${componentId}`; // 面包屑路径
    Bus.$off(eventName1).$on(eventName1, (message) => {
      this.crumbsArr = message;
    });
    const eventName2 = `subHotZone_${componentId}`; // 更新子热区数据
    Bus.$off(eventName2).$on(eventName2, ({ message, isFlag }) => { // isFlag 为true,图层数据需要更新，反之不需要
      this.subHotZone = JSON.parse(JSON.stringify(message));
      if (isFlag) {
        // eslint-disable-next-line no-unused-expressions
        this.canvasObject && this.canvasObject.clear();
        const { configMessage } = message;
        if (configMessage) {
          const realDesignObject = JSON.parse(configMessage);
          this.initCanvas(realDesignObject);
          this.setCanvasZoom(1);
          this.canvasObject.absolutePan({ x: 0, y: 0 });
          this.canvasObject.renderAll();
        }
      }
    });
    const eventName4 = `customPicture_${componentId}`; // drawUrl值
    Bus.$off(eventName4).$on(eventName4, (message) => {
      this.addImage(message);
    });

    const eventName3 = `drawType_${componentId}`; // drawType值
    Bus.$off(eventName3).$on(eventName3, (message) => {
      this.drawType = message;
    });
    this.$nextTick(() => {
      const idHook = `canvas_${componentId}`;
      const canvas = new fabric.Canvas(idHook);
      if (!this.canvasObject) {
        canvas.selection = false; // 不允许选中画布
        this.canvasObject = canvas;
        Bus.$emit(`${componentId}_fabric`, canvas);
        if (designObject) {
          const realDesignObject = JSON.parse(designObject);
          this.initCanvas(realDesignObject);
        }
        this.initDomEvent();
        this.setCanvasSize();
      }
    });
  },
  watch: {
    'config.stylesObj.backgroundImage': {
      handler(v) {
        this.setCanvasBackGround(v); // 如果底图改变，重新设置地图
      }
    },
    'subHotZone.backgroundImage': {
      handler(v) {
        this.setCanvasBackGround(v); // 如果底图改变，重新设置地图
      }
    },
    drawType: {
      handler(v) {
        if (v === 5) {
          this.polygonMode = true;
          // 这里画的多边形，由顶点与线组成
          this.pointArray = []; // 顶点集合
          this.lineArray = []; // 线集合
          this.canvasObject.isDrawingMode = false;
        } else {
          this.polygonMode = false;
          this.pointArray = [];
          this.lineArray = [];
          this.activeShape = false;
          this.activeLine = '';
          this.line = {};
        }
      }
    },
    // 'config.stylesObj.drawUrl': {
    //   handler(v) {
    //     if (v) {
    //       console.log('绘制图片');
    //       this.addImage(v);
    //     }
    //   }
    // },
    'config.width': {
      handler() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.setCanvasSize();
        }, 100);
      }
    },
    'config.height': {
      handler() {
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.setCanvasSize();
        }, 100);
      }
    },
    activeComponent(v, o) {
      if (v && JSON.stringify(o) !== '{}' && v.componentId !== o.componentId) {
        // this.update({key: 'drawType', value: null}, 2);
        Bus.$emit(`${o.componentId}_block_event`, { isFlag: false });
        console.log(1111, '关闭弹框');
        this.canvasObject.discardActiveObject();
        this.canvasObject.requestRenderAll();
      }
      if (v && v.componentId === this.config.componentId) {
        console.log('激活');
        this.activated();
      }
    }
  },
  methods: {
    doBack(item, i) {
      this.crumbsArr = this.crumbsArr.slice(0, i + 1);
      this.fetchInfo(item);
    },
    async fetchInfo({ parentHost }) {
      if (!parentHost) { // 如果是根节点的情况， 获取控件里面canvas的配置属性
        const { designObject, componentId } = this.activeComponent;
        if (designObject) {
          const realDesignObject = JSON.parse(designObject);
          this.initCanvas(realDesignObject);
          // this.setCanvasZoom(1);
          this.canvasObject.absolutePan({ x: 0, y: 0 });
          this.canvasObject.renderAll();
        }
        Bus.$emit(`${componentId}_crumbsArrChange_href`, this.crumbsArr);
        return;
      }
      const res = await getHotInfo({ id: parentHost || 0 }) || {};
      const {
        designJson = '{}',
        configMessage = ''
      } = res;

      const newJson = JSON.parse(designJson);
      let backgroundImage = '';
      if (configMessage) {
        const canvasObj = JSON.parse(configMessage);
        if (canvasObj.backgroundImage) {
          backgroundImage = canvasObj.backgroundImage.src;
        }
      }
      Bus.$emit(`${this.activeComponent.componentId}_crumbsArrChange_by_config`, {
        crumbsArr: this.crumbsArr,
        configMessage, // canvas配置信息
        designJson: newJson, // 前端需要的属性
        backgroundImage
      });
    },
    initCanvas(realDesignObject) {
      // eslint-disable-next-line max-len
      this.canvasObject.loadFromJSON(realDesignObject, this.canvasObject.renderAll.bind(this.canvasObject), (o, objects) => {
        if (!objects) { return; }
        if (objects.type === 'polygon') {
          objects.hasBorders = true;
          objects.hasControls = false;
        }
        objects.transparentCorners = false;
        this.addBlockEvent(objects);
        // if (realDesignObject.backgroundImage) {
        //   this.setInitZoom(realDesignObject.backgroundImage);
        // }
      });
    },
    // 设置canvas画布大小
    setCanvasSize() {
      setTimeout(() => {
        const { width, height } = this.config;
        this.canvasObject.setWidth(width);
        this.canvasObject.setHeight(height);
        this.canvasObject.renderAll();
      }, 30);
    },
    initDomEvent() { // 初始化画布
      const that = this;
      that.panning = false;
      let mouseForm = { x: 0, y: 0 };
          let mouseTo = { x: 0, y: 0 };
      // eslint-disable-next-line no-unused-vars
          let mouseMove = { x: 0, y: 0 };
      // eslint-disable-next-line no-unused-vars
          let lastMouseMove = { x: 0, y: 0 };
      this.canvasObject.on({
        'mouse:down': async (e) => {
          that.panning = true;
          mouseForm = that.canvasObject.getPointer(e, false);
          lastMouseMove = { x: e.e.layerX, y: e.e.layerY };
          // 绘制多边形
          if (that.drawType === 5) {
            that.canvasObject.skipTargetFind = false;
            try {
              // 此段为判断是否闭合多边形，点击红点时闭合多边形
              if (that.pointArray.length > 1) {
                // e.target.id == this.pointArray[0].id 表示点击了初始红点
                // eslint-disable-next-line eqeqeq
                if (e.target && e.target.mainId == that.pointArray[0].mainId) {
                  await that.generatePolygon();
                }
              }
              // 未点击红点则继续作画
              if (that.polygonMode) {
                that.addPoint(e);
              }
            } catch (error) {
              console.log(error);
            }
          }
        },
        'mouse:move': (e) => {
          mouseMove = { x: e.e.layerX, y: e.e.layerY };
          if (!this.blockPanning && !that.drawType && this.panning && e && e.e) {
            const delta = new fabric.Point(e.e.movementX / this.scale, e.e.movementY / this.scale);
            that.canvasObject.relativePan(delta);
          }
        },
        'mouse:up': (e) => {
          that.panning = false;
          // 如果有选中绘制类型，鼠标松开开始添加热区
          const { drawType } = this;
          if (drawType && drawType !== 5) {
            mouseTo = that.canvasObject.getPointer(e, false);
            that.addBlock(mouseForm, mouseTo);
          }
        },
        'mouse:wheel': (e) => {
          const corsurPoint = new fabric.Point(e.e.layerX / this.scale, e.e.layerY / this.scale);
          let canvasZoom = that.canvasObject.getZoom();
          const scale = 1.05;
          if (e.e.deltaY < 0 && canvasZoom <= 0.2) {
            // 解决缩小到极限抖动问题
            canvasZoom = 0.2;
          } else if (e.e.deltaY < 0) {
            canvasZoom *= (1 / scale);
          } else if (canvasZoom < 10) {
            canvasZoom *= scale;
          }
          that.canvasObject.zoomToPoint(corsurPoint, canvasZoom);
          that.setCanvasZoom(canvasZoom);
        }
      });
    },
    async generatePolygon() { // 结束点绘制
      const points = [];
      this.pointArray.forEach((point) => {
        points.push({
          x: point.left,
          y: point.top
        });
        this.canvasObject.remove(point);
      });
      this.lineArray.forEach((line) => {
        this.canvasObject.remove(line);
      });
      this.canvasObject.remove(this.activeShape).remove(this.activeLine);
      const polygon = new fabric.Polygon(points, {
        stroke: '#E34F51',
        strokeWidth: 2,
        fill: 'rgba(0, 206, 209, 0.2)',
        opacity: 1,
        hasBorders: true,
        hasControls: false
      });
      try {
        const { id: elementId } = this.activeComponent;
        const { parentHost } = this.crumbsArr[this.crumbsArr.length - 1] || {};
        const res = await doAddHotDesign({ name: '自定义图形', elementId, parentHost: parentHost || 0, messageType: 1 });
        console.log(res, '自定义图形');
        polygon.id = res;
        this.canvasObject.add(polygon);
      } catch (e) {
        this.addBlockEvent(polygon);
      }
      this.addBlockEvent(polygon);
      this.activeLine = null;
      this.activeShape = null;
      this.polygonMode = false;
      this.drawType = null;
      this.changeCanvas();
      console.log(this.activeComponent, '333');
      Bus.$emit(`${this.activeComponent.componentId}_polygon_end`, null);
    },
    addPoint(e) { // 添加自定义点
      const random = Math.floor(Math.random() * 10000);
      const id = new Date().getTime() + random;
      const realPointer = this.canvasObject.getPointer(e, false);
      const circle = new fabric.Circle({
        radius: 3,
        fill: '#ffffff',
        stroke: '#333333',
        strokeWidth: 0.5,
        left: realPointer.x,
        top: realPointer.y,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        originX: 'center',
        originY: 'center',
        mainId: id,
        objectCaching: false
      });
      if (!this.pointArray.length) {
        circle.set({
          fill: 'red'
        });
      }
      const points = [
        (e.pointer.x || e.e.layerX) / this.canvasObject.getZoom(),
        (e.pointer.y || e.e.layerY) / this.canvasObject.getZoom(),
        (e.pointer.x || e.e.layerX) / this.canvasObject.getZoom(),
        (e.pointer.y || e.e.layerY) / this.canvasObject.getZoom()
      ];

      this.line = new fabric.Line(points, {
        strokeWidth: 2,
        fill: '#999999',
        stroke: '#999999',
        class: 'line',
        originX: 'center',
        originY: 'center',
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,

        objectCaching: false
      });
      if (this.activeShape) {
        const pos = this.canvasObject.getPointer(e.e);
        const otherPoints = this.activeShape.get('points');
        otherPoints.push({
          x: pos.x,
          y: pos.y
        });
        const polygon = new fabric.Polygon(otherPoints, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,

          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false
        });
        this.canvasObject.remove(this.activeShape);
        // this.canvasObject.add(polygon);
        this.activeShape = polygon;
        this.canvasObject.renderAll();
      } else {
        const polyPoint = [
          {
            x: (e.pointer.x || e.e.layerX) / this.canvasObject.getZoom(),
            y: (e.pointer.y || e.e.layerY) / this.canvasObject.getZoom()
          }
        ];
        const polygon = new fabric.Polygon(polyPoint, {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '#cccccc',
          opacity: 0.3,
          selectable: false,
          hasBorders: false,
          hasControls: false,
          evented: false,
          objectCaching: false
        });
        this.activeShape = polygon;
        this.canvasObject.add(polygon);
      }
      this.activeLine = this.line;

      this.pointArray.push(circle);
      this.lineArray.push(this.line);
      this.canvasObject.add(this.line);
      this.canvasObject.add(circle);
    },
    async addBlock(mouseForm, mouseTo) { // 添加区块
      const w = mouseTo.x - mouseForm.x;
          const h = mouseTo.y - mouseForm.y;
      if (w < 3 || h < 3) {
        return;
      }
      const blockOption = {
        left: mouseForm.x,
        top: mouseForm.y,
        strokeWidth: 2,
        objectCaching: false,
        borderColor: 'rgba(0, 0, 0, 1)',
        cornerColor: '#fff',
        cornerSize: 8,
        cornerStrokeColor: 'rgba(0, 0, 0, 1)',
        transparentCorners: false,
        opacity: '1'
      };
      let newBlock = null;
      let name = null;
      if (this.drawType === 1) {
        // 矩形绘制
        name = '默认矩形';
        newBlock = new fabric.Rect({
          fill: 'rgba(0, 145, 255, 0.5)',
          stroke: 'rgba(0, 145, 255, 1)',
          width: w,
          height: h,
          ...blockOption
        });
      } else if (this.drawType === 2) {
        // 圆形绘制
        name = '默认圆形';
        newBlock = new fabric.Circle({
          fill: 'rgba(204, 53, 52, 0.5)',
          stroke: 'rgba(204, 53, 52, 1)',
          radius: w / 2,
          ...blockOption
        });
      } else if (this.drawType === 4) {
        // 椭圆形绘制
        name = '默认椭圆';
        newBlock = new fabric.Ellipse({
          fill: 'rgba(204, 53, 52, 0.5)',
          stroke: 'rgba(204, 53, 52, 1)',
          rx: w / 2,
          ry: h / 2,
          ...blockOption
        });
      } else if (this.drawType === 3) {
        // 椭圆形绘制
        name = '默认三角形';
        newBlock = new fabric.Triangle({
          fill: 'rgba(247, 181, 0, 0.5)',
          stroke: 'rgba(247, 181, 0, 1)',
          width: w,
          height: h,
          ...blockOption
        });
      }

      try {
        const { id: elementId } = this.activeComponent;
        const { parentHost } = this.crumbsArr[this.crumbsArr.length - 1] || {};
        const res = await doAddHotDesign({ name,
          elementId,
          parentHost: parentHost || 0,
          messageType: 1
        });
        console.log(res, '正常');
        newBlock.id = res;
        this.canvasObject.add(newBlock);
      } catch (e) {
        this.canvasObject.add(newBlock);
      }
      this.changeCanvas();
      this.addBlockEvent(newBlock);
    },
    addImage(url) { // 添加图片
      fabric.Image.fromURL(url, async (oImg) => {
        const center = this.canvasObject.getCenter();
        oImg.set({ left: center.left, top: center.top });
        try {
          const { id: elementId } = this.activeComponent;
          const { parentHost } = this.crumbsArr[this.crumbsArr.length - 1] || {};
          const res = await doAddHotDesign({ name: '自定义图片', elementId, parentHost: parentHost || 0, messageType: 1 });
          console.log(res, '添加图片');
          oImg.id = res;
          this.canvasObject.add(oImg);
        } catch (e) {
          this.canvasObject.add(oImg);
        }
        this.addBlockEvent(oImg);
        this.changeCanvas();
      });
    },
    // 区块添加事件
    addBlockEvent(block) {
      // let that = this;
      // let PNodeAry = block.PNodeAry || [];
      block.on('mousedown', () => {
        // if (!that.isMoveCanvas) {
        //   let { id, recordName, relationTabName, color, type } = block;
        //   const { dispatch } = that.context;
        //   that.setState({
        //     visibleConfig: true,
        //     blockId: id,
        //     isClick: true,
        //     recordName,
        //     relationTabName,
        //     color,
        //     type,
        //   });
        // }
      });
      block.on('mouseup', () => {
        this.changeCanvas();
      });
      // block.on('mousemove', () => {
      //   // if (block.isMoving && that.props.isSave) {
      //   //   that.setVisualState({ isSave: false });
      //   // }
      //   // if (!!PNodeAry.length)
      //   //   that.props.setHoverInfo({ type: 'move', layer: { x: e.e.layerX, y: e.e.layerY } });
      // });
      block.on('deselected', () => {
        this.blockPanning = false;
        Bus.$emit(`${this.activeComponent.componentId}_block_event`, { isFlag: false });
        // if (block.isMoving && that.props.isSave) {
        //   that.setVisualState({ isSave: false });
        // }
        // if (!!PNodeAry.length)
        //   that.props.setHoverInfo({ type: 'move', layer: { x: e.e.layerX, y: e.e.layerY } });
      });
      block.on('selected', () => {
        this.blockPanning = true;
        console.log(11);
        Bus.$emit(`${this.activeComponent.componentId}_fabric`, this.canvasObject);
        setTimeout(() => {
          Bus.$emit(`${this.activeComponent.componentId}_block_event`, { isFlag: true, fabricCanvas: this.canvasObject });
        }, 100);
        // if (block.isMoving && that.props.isSave) {
        //   that.setVisualState({ isSave: false });
        // }
        // if (!!PNodeAry.length)
        //   that.props.setHoverInfo({ type: 'move', layer: { x: e.e.layerX, y: e.e.layerY } });
      });
      block.on('mouseover', () => {
        // that.isHover = true;
        // if (!!PNodeAry.length) that.props.setHoverInfo({ type: 'show', PNodeAry });
      });
      block.on('mouseout', () => {
        // that.isHover = false;
        // if (!!PNodeAry.length) that.props.setHoverInfo({ type: 'hide' });
      });
      if (block.type !== 'image') {
        block.on('scaling', (e) => {
          console.log(e);
          // 缩放已绘制好的区块，保持边框不变形
          // if (e.target.type === 'ellipse') {
          //   e.target.rx *= e.target.scaleX;
          //   e.target.ry *= e.target.scaleY;
          //   e.target.width = e.target.rx * 2;
          //   e.target.height = e.target.ry * 2;
          // } else if (e.target.type === 'circle') {
          //   let scale = e.target.scaleX === 1 ? e.target.scaleY : e.target.scaleX;
          //   e.target.radius *= scale;
          //   e.target.width = e.target.radius * 2;
          //   e.target.height = e.target.radius * 2;
          // } else {
          //   e.target.width *= e.target.scaleX;
          //   e.target.height *= e.target.scaleY;
          // }
          // e.target.scaleX = 1;
          // e.target.scaleY = 1;
          // that.fabricCanvas.renderAll();
          // this.setVisualState({ isSave: false });
        });
      }
    },
    getImageWidth(url) {
      //  图片的宽高
      const img = new Image();
      img.src = url;
      return new Promise((resolve) => {
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        };
      });
    },
    getBackgroundImageOptions({ boxWidth, boxHeight, imgWidth, imgHeight }) {
      const scaleX = boxWidth / imgWidth;
      const scaleY = boxHeight / imgHeight;
      // 计算通用比例
      const realScale = scaleX >= scaleY ? scaleY : scaleX;
      const diffWidth = boxWidth - imgWidth * realScale;
      const diffHeight = boxHeight - imgHeight * realScale;
      return {
        left: diffWidth > 0 ? Math.ceil(diffWidth / 2) : 0,
        top: diffHeight > 0 ? Math.ceil(diffHeight / 2) : 0,
        scaleX: realScale,
        scaleY: realScale
      };
    },
    async setCanvasBackGround(url) { // 设置底图
      if (!url) {
        delete this.canvasObject.backgroundImage;
        this.canvasObject.renderAll();
        this.changeCanvas();
        return;
      }
      const { width: boxWidth, height: boxHeight } = this.canvasObject;
      const { width: imgWidth, height: imgHeight } = await this.getImageWidth(url);
      const option = this.getBackgroundImageOptions({
        boxWidth, boxHeight, imgWidth, imgHeight
      });
      this.canvasObject.setBackgroundImage(url, () => {
        this.canvasObject.renderAll();
        this.changeCanvas();
      }, option);
    },
    changeCanvas(obj = {}) { // 更新canvas配置
      const n = this.crumbsArr.length;
      if (n > 1) {
        const cId = this.crumbsArr[n - 1]; // 获取当前图层id
        const pId = this.crumbsArr[n - 2];
        if (this.saveTimer) {
          clearTimeout(this.saveTimer);
        }
        this.saveTimer = setTimeout(() => {
          const visualMapJSON = this.canvasObject.toJSON([
            'id'
          ]);
          const { id: elementId } = this.activeComponent;
          const params = {
            parentHost: pId.parentHost || 0,
            elementId,
            id: cId.parentHost,
            configMessage: JSON.stringify(visualMapJSON)
          };
          editHotInfo(params);
        }, 100);
        console.log('2层级');
        return;
      }
      this.canvasObject.renderAll();
      const visualMapJSON = this.canvasObject.toJSON([
        'id'
      ]);
      console.log('1层级');
      this.update({ designObject: JSON.stringify(visualMapJSON) }, 1);
      const { componentId } = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => item.componentId === componentId);
      const { key, value } = obj;
      const { stylesObj } = this.config;
      const newInfo = {
        ...this.config,
        designObject: JSON.stringify(visualMapJSON),
        stylesObj: {
          ...stylesObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    // 控制器输入的缩放比例
    setCanvasZoom(zoom) {
      const center = this.canvasObject.getCenter();
      const corsurPoint = new fabric.Point(center.left * this.scale, center.top * this.scale);
      this.canvasObject.zoomToPoint(corsurPoint, zoom);
    },
    setInitZoom(item) {
      const { width, height } = item;
      // eslint-disable-next-line radix
      const zoom = parseInt(this.canvasObject.width * 100 / width) / 100;
      const layerY =
          this.canvasObject.height - height * zoom > 0
              // eslint-disable-next-line radix
            ? parseInt((this.canvasObject.height - height * zoom) / 2)
            : 0;
      const corsurPoint = new fabric.Point(10, layerY);
      this.canvasObject.zoomToPoint(corsurPoint, zoom);
    },
    deactivated() {
      this.panning = false;
    },
    activated() {
      this.$nextTick(() => {
        // this.$emit('updateActiveComponent', this.config);
        setTimeout(() => {
          console.log(1111);
          Bus.$emit(`${this.activeComponent.componentId}_fabric`, this.canvasObject);
        }, 20);
      });
    },
    update(obj, type) {
      const { componentId } = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => item.componentId === componentId);
      if (type === 1) {
        const newInfo = {
          ...this.config,
          ...obj
        };
        list.splice(index, 1, newInfo);
      }
      if (type === 2) {
        const { key, value } = obj;
        const newInfo = {
          ...this.config,
          stylesObj: {
            ...this.config.stylesObj,
            [key]: value
          }
        };
        list.splice(index, 1, newInfo);
      }
      this.$emit('updateList', list);
    },
  },
  beforeDestroy() {
    this.canvasObject = null;
    this.drawType = null; // 热区格式
    this.subHotZone = {}; // 子热区数据
    this.timer = null;
    this.saveTime = null; // 保存的定时器
    this.panning = false; // 用于控制是否底图移动
    this.blockPanning = false; // 用于控制热区是否移动
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;
  position: relative;

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
}
</style>
