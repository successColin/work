/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getRotateX" @contextmenu.prevent="show">
    <div class="imageContent" :style="getRotateY">
      <div class="imageBox" :style="getTextStyles()">
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return {};
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
    return {};
  },

  components: {
    // VueDragResize
  },

  computed: {
    getRotateY() {
      if (this.config.horizontalMirror) {
        return 'transform: rotateY(180deg);';
      }
      return '';
    },
    getRotateX() {
      if (this.config.verticalMirror) {
        return 'transform: rotateX(180deg);';
      }
      return '';
    },
    getTextStyles() {
      return function () {
        let styles = '';
        const { stylesObj = {} } = this.config;
        Object.keys(stylesObj).forEach((item) => {
          if (item === 'backgroundImage') {
            styles += `background-image:url(${stylesObj[item]});`;
          } else if (item === 'rotationAngle') {
            styles += `transform:rotate(${stylesObj[item]}deg);`;
          } else {
            styles += `${item}:${stylesObj[item]};`;
          }
        });
        return styles;
      };
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  mounted() {
  },
  watch: {
    // config(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
  },
  methods: {
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      });
    },
    update(obj) {
      const { componentId } = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => item.componentId === componentId);
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
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
    handleClick(e) {
      console.log(e, 'handleClick');
      // this.$nextTick(() => {
      //   this.$emit("updateActiveComponent", this.config);
      // })
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;

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
