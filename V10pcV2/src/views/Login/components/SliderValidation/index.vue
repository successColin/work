<!--
 * @Descripttion: 拖动验证
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:47:50
-->
<template>
  <div class="drag" ref="dragDiv">
    <!-- 背景 -->
    <div class="drag__bg"></div>
    <!-- 描述 -->
    <div class="drag__text shadow">{{ confirmWords }}</div>
    <!-- icon -->
    <div
      ref="moveDiv"
      @mousedown="mousedownFn($event)"
      :class="[iconFontCon]"
      class="handler handler_bg"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    // 失败之后的函数
    errorFun: {
      type: Function,
      default: () => {}
    },
    // 成功之后的函数
    successFun: {
      type: Function,
      default: () => {}
    },
    // 成功文字
    successText: {
      type: String,
      default: ''
    },
    // 开始的文字
    startText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      beginClientX: 0 /* 距离屏幕左端距离 */,
      confirmSuccess: false /* 验证成功判断 */
    };
  },
  computed: {
    confirmWords() {
      return this.confirmSuccess ? this.successText : this.startText;
    },
    iconFontCon() {
      return this.confirmSuccess
        ? 'el-icon-success icon__color1'
        : 'el-icon-d-arrow-right icon__color2';
    }
  },
  methods: {
    mousedownFn(e) {
      const ele = e.target;
      const startX = e.clientX;
      const eleWidth = ele.offsetWidth; // 34px
      const parentWidth = ele.parentElement.offsetWidth; // 300px
      const maxwidth = parentWidth - eleWidth - 6;
      if (this.confirmSuccess) {
        return false;
      }
      document.onmousemove = (event) => {
        e.preventDefault();
        ele.style.transition = '';
        ele.previousSibling.previousSibling.style.transition = '';
        this.beginClientX = event.clientX - startX;
        if (this.beginClientX <= 0) {
          this.beginClientX = 3;
        }
        if (this.beginClientX >= maxwidth - eleWidth) {
          this.beginClientX = maxwidth;
        }
        ele.style.left = `${this.beginClientX}px`;
        ele.previousSibling.previousSibling.style.width = `${this.beginClientX}px`;
      };
      document.onmouseup = () => {
        // // console.log(event1);
        // // console.log(this.$refs.moveDiv.style.left);
        const width = this.$refs.moveDiv.style.left.slice(0, -2);
        // // console.log(width, maxwidth);
        if (Number(width) < maxwidth) {
          ele.style.left = `${3}px`;
          ele.previousSibling.previousSibling.style.width = `${0}px`;
          ele.style.transition = 'all 1s';
          ele.previousSibling.previousSibling.style.transition = 'all 1s';
        } else {
          this.confirmSuccess = true;
          ele.previousSibling.style.background =
            '-webkit-gradient(linear,left top,right top,color-stop(0, white),color-stop(0.4, white),color-stop(0.5, #4d4d4d),color-stop(0.6, white),color-stop(1, white))';
          ele.previousSibling.style['-webkit-background-clip'] = 'text';
          this.successFun();
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    } // mousedoen 事件
  }
};
</script>
<style lang="scss" scoped>
.drag {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background: #f1f3f6;
  border: 1px solid #dde2ea;
  border-radius: 4px;
  position: relative;
  text-align: center;
}
.handler {
  width: 34px;
  height: 34px;
  line-height: 34px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  position: absolute;
  top: 3px;
  left: 3px;
  font-size: 14px;
}
.icon__color1 {
  color: #83d4e8;
}
.icon__color2 {
  color: #bbc3cd;
}
.drag__bg {
  background: #83d4e8;
  height: 34px;
  width: 0px;
  border-radius: 2px;
  position: absolute;
  top: 3px;
  left: 3px;
}
.drag__text {
  position: absolute;
  top: 0px;
  width: 100%;
  text-align: center;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  -o-user-select: none;
  -ms-user-select: none;
  font-size: 13px;
  color: #666666;
}

.shadow {
  text-align: center;
  /* 背景颜色线性渐变 */
  /* 老式写法 */
  /* linear为线性渐变，也可以用下面的那种写法。left top，right top指的是渐变方向，左上到右上 */
  /* color-stop函数，第一个表示渐变的位置，0为起点，0.5为中点，1为结束点；第二个表示该点的颜色。所以本次渐变为两边灰色，中间渐白色 */
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0, #4d4d4d),
    color-stop(0.4, #4d4d4d),
    color-stop(0.5, white),
    color-stop(0.6, #4d4d4d),
    color-stop(1, #4d4d4d)
  );

  /* 设置为text，意思是把文本内容之外的背景给裁剪掉 */
  -webkit-background-clip: text;
  /* 设置对象中的文字填充颜色 这里设置为透明 */
  -webkit-text-fill-color: transparent;
  /* 每隔2秒调用下面的CSS3动画 infinite属性为循环执行animate */
  -webkit-animation: animate 3s infinite;
}
/* 兼容写法，要放在@keyframes前面 */
@-webkit-keyframes animate {
  /* 背景从-100px的水平位置，移动到+100px的水平位置。如果要移动Y轴的，设置第二个数值 */
  from {
    background-position: -200px 0;
  }
  to {
    background-position: 200px 0;
  }
}
@keyframes animate {
  from {
    background-position: -200px 0;
  }
  to {
    background-position: 200px 0;
  }
}
</style>
