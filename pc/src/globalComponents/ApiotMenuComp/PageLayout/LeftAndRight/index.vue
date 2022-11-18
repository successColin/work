<template>
  <section class="leftAndRight" :class="[{ notConfig: !isConfig }]" ref="box">
    <div
      ref="left"
      class="leftAndRight__left"
      :style="`flex:${configData.leftWidth}`"
      v-show="showType ? showType.type !== 'flow' : true"
    >
      <tab-sidebar
        :configData.sync="configData.children[0]"
        :activeObj.sync="activeObj"
        :hasTriggerComp="hasTriggerComp"
        :showType="showType"
        @showRight="showRight"
      ></tab-sidebar>
    </div>
    <div class="leftAndRight__center" ref="resize" v-if="!isConfig"></div>
    <div
      class="leftAndRight__right"
      :style="`flex:${configData.rightWidth}`"
      ref="right"
    >
      <tab-main
        :configData.sync="configData.children[1]"
        :activeObj.sync="activeObj"
        :hasTriggerComp="hasTriggerComp"
        :showType="showType"
        v-if="isConfig ? true : rightShow"
      ></tab-main>
      <div class="apiotNoData1" v-else></div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    showType: {
      type: Object,
      default: () => {}
    },
    configData: {
      type: [Array, Object]
    },
    activeObj: {
      type: [Array, Object]
    },
    hasTriggerComp: {
      type: Object
    }
  },
  data() {
    return {
      rightShow: true
    };
  },
  inject: ['isConfig'],
  components: {},

  computed: {},

  mounted() {
    this.$nextTick(() => {
      if (!this.isConfig) {
        this.dragControllerDiv();
      }
    });
  },

  methods: {
    dragControllerDiv() {
      const { resize } = this.$refs;
      const { left } = this.$refs;
      const leftWidth = left.offsetWidth;
      const allWidth = this.$refs.box.offsetWidth * 0.05;
      const max = leftWidth + allWidth;
      const min = leftWidth - allWidth < 170 ? 170 : leftWidth - allWidth;
      const mid = this.$refs.right;
      // const { box } = this.$refs;

      // 鼠标按下事件
      resize.onmousedown = function (event) {
        const startX = event.clientX;
        resize.left = resize.offsetLeft;
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          const endX = e.clientX;
          // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
          let moveLen = resize.left + (endX - startX);

          if (moveLen < min) moveLen = min; // 左边区域的最小宽度为150px
          if (moveLen > max) moveLen = max; // 右边区域最小宽度为150px

          resize.style.left = moveLen; // 设置左侧区域的宽度

          left.style.flex = `0 0 ${moveLen}px`;
          mid.style.flex = '1';
        };
        // 鼠标松开事件
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
          // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
          if (resize.releaseCapture) {
            resize.releaseCapture();
          }
        };
        if (resize.setCapture) {
          resize.setCapture(); // 该函数在属于当前线程的指定窗口里设置鼠标捕获
        }

        return false;
      };
    },
    showRight(v) {
      this.rightShow = v;
    }
  }
};
</script>

<style lang='scss' scoped>
.leftAndRight {
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px;
  height: 100%;
  display: flex;
  overflow: hidden;
  background-color: #fff;
  &__left {
    margin-right: 10px;
    flex: 1;
    overflow: hidden;
  }
  &__center {
    position: relative;
    width: 3px;
    background-color: #fff;
    cursor: ew-resize;
    &:after {
      content: '';
      width: 1px;
      position: absolute;
      height: 100%;
      background-color: #e9e9e9;
    }
  }
  &__right {
    flex: 2;
    overflow: hidden;
  }
  &.notConfig {
    padding: 0;
    .leftAndRight__left {
      margin-right: 0;
    }
  }
}
</style>
