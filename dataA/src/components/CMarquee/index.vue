/**
* @name: index
* @author: DELL
* @date: 2022/1/14 15:17
* @description：index
* @update: 2022/1/14 15:17
*/
<template>
  <div class="my-outbox">
    <div class="my-inbox" ref="box">
      <div
          class="my-list"
          v-for="(item, index) in sendVal"
          :key="index"
          ref="list"
      >
        <span @click="onItemClick(item)" :style="getStyles()" class="my-uname">{{ item[takeEffect] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lz-marquee',
  props: {
    sendVal: {
      type: Array,
      default() {
        return [];
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    speed: {
      type: Number,
      default() {
        return 0.5;
      }
    },
    takeEffect: {
      type: String
    }
  },
  data() {
    return {
      // 定时器标识
      moveTimer: null
    };
  },
  computed: {
    getStyles() {
      return function () {
        let styles = `line-height:${this.config.height}px;`;
        const {stylesObj = {}, gradientType, enableBackground} = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          borderColor,
          ...rest
        } = stylesObj;
        Object.keys(rest).forEach(item => {
          let singStyle = `${item}:${stylesObj[item]}`
          if (item === 'fontSize' || item === 'letterSpacing') {
            singStyle += 'px'
          }
          styles += `${singStyle}${singStyle ? ';' : ''}`
        })

        if (gradientType === 1) { // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`
        } else if (gradientType === 2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`
        }
        if (enableBackground) {
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};
          `;
        }
        return styles;
      };
    }
  },
  mounted() {},
  watch: {
    sendVal: {
      deep: true,
      handler(v) {
        if (v && v.length) {
          // 清除定时器标识
          this.$nextTick(() => {
            if (this.moveTimer) {
              clearInterval(this.moveTimer);
              this.moveTimer = null;
            }
            this.moveLeft();
          })
        }
      }
    }
  },
  beforeDestroy() {
    // 页面关闭清除定时器
    clearInterval(this.moveTimer);
    // 清除定时器标识
    this.moveTimer = null;
  },
  methods: {
    // 获取margin属性
    getMargin(obj) {
      let marg = window.getComputedStyle(obj, null)['margin-right'];
      marg = marg.replace('px', '');
      return Number(marg); // 强制转化成数字
    },
    onItemClick(item) {
      this.$emit('clickNews', item);
    },
    // 移动的方法
    moveLeft() {
      let item = this.$refs.list;
      if (!item) {return;}
      let len = this.sendVal.length;
      let inbox = this.$refs.box;
      let width = inbox.clientWidth;

      let margin = this.getMargin(item[0]);
      let w = 0;
      for (let i = 0; i < len; i++) {
        w += item[i].clientWidth + margin;
      }

      // 移动距离
      let moveDis = width;
      inbox.style = `transform: translateX(${moveDis}px)`;

      this.moveTimer = setInterval(() => {
        moveDis -= this.speed;
        if (moveDis < 0 && Math.abs(moveDis) >= Math.abs(w)) {
          moveDis = width;
        }
        // 移动外层盒子
        inbox.style = `transform: translateX(${moveDis}px)`;

      }, 10);
    }
  }
};
</script>

<style lang="scss" scoped>
.my-outbox {
  overflow: hidden;
  height: 100%;

  .my-inbox {
    white-space: nowrap;
    height: 100%;
    display: flex;
    align-items: center;

    .my-list {
      margin-right: 25px;
      font-size: 0.3rem;
      height: 100%;
      display: flex;
      align-items: center;

      .my-uname {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        cursor: pointer;
      }
    }
  }
}
</style>
