/* 此模块用于实现签名绘图功能 */

// 需要用到的变量定义
// eslint-disable-next-line no-array-constructor
let clickX = new Array();
// eslint-disable-next-line no-array-constructor
let clickY = new Array();
// eslint-disable-next-line no-array-constructor
let clickDrag = new Array();
let paint;
const point = { notFirst: false };
// 圆圈配置
const polygonConfig = { x: 0, y: 0 };
let url;
let drawType = 1; // 动作类型1、自由画 2、画圈圈 3、矩形 4、箭头
let canvasDiv = null; // 初始化画布父盒子
const canvas = document.createElement('canvas'); // 创建画板
const context = canvas.getContext('2d'); // 创建2d画布
let canvasWidth = 0; // 初始化画布宽度
let canvasHeight = 0; // 初始化画布高度
let drawColor = 'rgba(224, 50, 50, 1)'; // 画笔颜色

// 可导出图片的标识
// eslint-disable-next-line no-unused-vars
let _exportable = false;

/* ------------ 需要用到的一些功能函数  ------------ */
function addClick(x, y, dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function draw() {
  _exportable = true;
  while (clickX.length > 0) {
    point.bx = point.x;
    point.by = point.y;
    point.x = clickX.pop();
    point.y = clickY.pop();
    point.drag = clickDrag.pop();
    context.beginPath();
    if (point.drag && point.notFirst) {
      context.moveTo(point.bx, point.by);
    } else {
      point.notFirst = true;
      context.moveTo(point.x - 1, point.y);
    }
    context.lineTo(point.x, point.y);
    context.closePath();
    context.stroke();
    context.strokeStyle = drawColor;
  }
}

/* 创建画布背景和画笔 */
function create() {
  const img = new Image();
  const vedioDom = document.querySelector('#local_stream video');
  const w = vedioDom.clientWidth;
  const h = vedioDom.clientHeight;
  img.onload = function() {
    // 将图片画到canvas上面上去！
    context.drawImage(img, 0, 0, w, h);
  };

  img.src = url;

  // 以下是创建画布背景
  // context.rect(0, 0, canvasWidth, canvasHeight);
  // context.fillStyle = '#f2f2f2'; // 图片北京色是灰色，此处去除会变黑色
  // context.fill();
  // 设置画笔属性
  context.strokeStyle = drawColor;
  context.lineJoin = 'round';
  context.lineWidth = 4;
  // 默认值清理
  // eslint-disable-next-line no-array-constructor
  clickX = new Array();
    // eslint-disable-next-line no-array-constructor
  clickY = new Array();
   // eslint-disable-next-line no-array-constructor
  clickDrag = new Array();
  _exportable = false;
}

export default {
  /* 初始化 */
  init(canvasDivDom, classname) {
    canvasDiv = canvasDivDom; // 传入画布父盒子
    canvasWidth = canvasDiv.clientWidth; // 获取父盒子宽度
    canvasHeight = canvasDiv.clientHeight; // 获取父盒子高度
    // 设置属性并追加元素
    canvas.setAttribute('width', canvasWidth);
    canvas.setAttribute('height', canvasHeight);
    canvas.setAttribute('id', 'vedioCanvasDraw');
    canvas.setAttribute('class', 'vedioCanvas');
    canvasDiv.appendChild(canvas);
    url = document.getElementById('vedioCanvas').toDataURL('image/jpg');
    // 创建画布背景和画笔
    create();
    // 开始监控画图
    this.listen(classname);
  },

  /* 画图时的监控 */
  listen(classname) {
    // 获取盒子需要的参数
    const { left, top } = canvas.getBoundingClientRect();
    // 支持 移动端
    canvasDiv.addEventListener('touchstart', function(e) {
      paint = true;
      // eslint-disable-next-line no-unused-expressions
      classname && (this.className = classname);
      // eslint-disable-next-line no-unused-expressions, prefer-destructuring
      (e.touches) && (e = e.touches[0]);
      console.log(e);
      addClick(e.pageX - left, e.pageY - top);
      draw();
    });

    canvasDiv.addEventListener('touchmove', (e) => {
      if (!paint) {
        return;
      }
      console.log(e);
      // eslint-disable-next-line no-unused-expressions, prefer-destructuring
      (e.touches) && (e = e.touches[0]);
      addClick(e.pageX - left, e.pageY - top, true);
      draw();
    });

    canvasDiv.addEventListener('touchend', () => {
      paint = false;
    });

    // 支持 PC 端
    canvasDiv.addEventListener('mousedown', function(e) {
      paint = true;
      // eslint-disable-next-line no-unused-expressions
      classname && (this.className = classname);
      if (drawType === 1) {
        addClick(e.pageX - left, e.pageY - top);
        draw();
      }
      if ([2, 3, 4].includes(drawType)) {
        polygonConfig.x = e.pageX - left;
        polygonConfig.y = e.pageY - top;
      }
    });

    canvasDiv.addEventListener('mousemove', (e) => {
      if (!paint) {
        return;
      }
      if (drawType === 1) {
        addClick(e.pageX - left, e.pageY - top, true);
        draw();
      }
    });

    canvasDiv.addEventListener('mouseup', (e) => {
      if (drawType === 2 && paint) { // 圆形
        const x = e.pageX - left;
        const y = e.pageY - top;
        this.makeCircle({ x, y });
      }
      if (drawType === 3 && paint) {
        const x = e.pageX - left;
        const y = e.pageY - top;
        this.makeRectangle({ x, y }); // 矩形
      }
      if (drawType === 4 && paint) {
        const x = e.pageX - left;
        const y = e.pageY - top;
        this.makeArrow(polygonConfig, { x, y }, 15); // 箭头
      }
      paint = false;
    });

    canvasDiv.addEventListener('mouseleave', () => {
      paint = false;
    });
  },
  makeArrow(p0, p1, headLength) { // 箭头
    const { PI } = Math;
    const degreesInRadians225 = 225 * PI / 180;
    const degreesInRadians135 = 135 * PI / 180;

    // calc the angle of the line
    const dx = p1.x - p0.x;
    const dy = p1.y - p0.y;
    const angle = Math.atan2(dy, dx);

    // calc arrowhead points
    const x225 = p1.x + headLength * Math.cos(angle + degreesInRadians225);
    const y225 = p1.y + headLength * Math.sin(angle + degreesInRadians225);
    const x135 = p1.x + headLength * Math.cos(angle + degreesInRadians135);
    const y135 = p1.y + headLength * Math.sin(angle + degreesInRadians135);

    // draw line plus arrowhead
    context.beginPath();
    // draw the line from p0 to p1
    context.moveTo(p0.x, p0.y);
    context.lineTo(p1.x, p1.y);
    // draw partial arrowhead at 225 degrees
    context.moveTo(p1.x, p1.y);
    context.lineTo(x225, y225);
    // draw partial arrowhead at 135 degrees
    context.moveTo(p1.x, p1.y);
    context.lineTo(x135, y135);
    // stroke the line and arrowhead
    context.stroke();
  },
  makeRectangle(lastConfig) { // 矩形
    const { x, y } = lastConfig;
    const { x: sx, y: sy } = polygonConfig;
    let width = sx - x;
    let height = y - sy;
    if (width < 0 || height < 0) {
      width = Math.abs(width);
      height = Math.abs(height);
    }
    const cx = x >= sx ? sx : x;
    const cy = y >= sy ? sy : y;
    context.beginPath();
    context.strokeStyle = drawColor;
    context.strokeRect(cx, cy, width, height); // 绘制矩形
  },
  makeCircle(lastConfig) { // 处理圆的半径 中心点
    const radius = this.calculateRadius(polygonConfig, lastConfig);
    const { x, y } = lastConfig;
    const { x: sx, y: sy } = polygonConfig;
    const cx = x >= sx ? (x - sx) / 2 + sx : (sx - x) / 2 + x;
    const cy = y >= sy ? (y - sy) / 2 + sy : (sy - y) / 2 + y;
    this.drawCircle(cx, cy, radius);
  },
  drawCircle(x, y, radius) { // 画圆
    context.beginPath();
    // x,y,半径,开始点,结束点,顺时针/逆时针
    context.arc(x, y, radius, 0, Math.PI * 2, false); // 绘制圆
    context.strokeStyle = drawColor;
    context.stroke();
  },
  // 计算圆半径
  calculateRadius(p1, p2) {
    let width = p2.x - p1.x;
    let height = p2.y - p1.y;
    // 如果是负数
    if (width < 0 || height < 0) {
      width = Math.abs(width);
      height = Math.abs(height);
    }
    // 计算两点距离=平方根(width^2+height^2)
    // eslint-disable-next-line no-restricted-properties
    const diameter = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
    return diameter / 2;
  },

  /* 清理 */
  clear() {
    // 使用此方式来清理画布
    // eslint-disable-next-line no-self-assign
    canvas.width = canvas.width;
    // eslint-disable-next-line no-self-assign
    canvas.height = canvas.height;
    create(); // 重新创建画布背景和画笔
    _exportable = false; // 清理之后无法导出
  },
  /* 设置画笔颜色 */
  setColor(color) {
    drawColor = color;
  },
  setDrawType(type) {
    drawType = type;
  }
};
