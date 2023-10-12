<template>
  <section class="threeRegional" :class="[{ notConfig: !isConfig }]" ref="box">
    <div
      class="threeRegional__left"
      :style="`flex:${configData.leftWidth}`"
      v-show="showType.type !== 'flow'"
      ref="left"
    >
      <tab-sidebar
        :configData.sync="configData.children[0]"
        :activeObj.sync="activeObj"
        :hasTriggerComp="hasTriggerComp"
        :showType="showType"
        @showRight="showRight"
      ></tab-sidebar>
    </div>
    <div class="threeRegional__center" ref="resize" v-if="!isConfig"></div>
    <div
      class="threeRegional__right"
      :style="`flex:${configData.rightWidth}`"
      ref="right"
    >
      <div
        class="threeRegional__right--top"
        :style="`flex:${configData.topHeight}`"
      >
        <tab-main
          :configData.sync="configData.children[1]"
          :activeObj.sync="activeObj"
          :hasTriggerComp="hasTriggerComp"
          :showType="showType"
          v-if="isPreview ? true : isConfig ? true : rightShow"
        ></tab-main>
        <div class="apiotNoData" v-else></div>
      </div>
      <div
        class="threeRegional__right--bottom"
        :style="`flex:${configData.bottomHeight}`"
      >
        <tab-main
          :configData.sync="configData.children[2]"
          :activeObj.sync="activeObj"
          :hasTriggerComp="hasTriggerComp"
          :showType="showType"
          v-if="isPreview ? true : isConfig ? true : rightShow"
        ></tab-main>
        <div class="apiotNoData" v-else></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    showType: {
      type: Object,
      default() {
        return {};
      },
    },
    configData: {
      type: [Array, Object],
    },
    activeObj: {
      type: [Array, Object],
    },
    hasTriggerComp: {
      type: Object,
    },
  },
  data() {
    return {
      rightShow: false,
    };
  },
  inject: ['isConfig', 'isPreview'],
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
    },
  },
};
</script>

<style lang="scss" scoped>
.threeRegional {
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px;
  height: 100%;
  display: flex;
  background-color: #fff;
  &__left {
    box-sizing: border-box;
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
    &--top {
      flex: 1;
      margin-bottom: 10px;
      overflow: hidden;
    }
    &--bottom {
      flex: 1;
      overflow: hidden;
    }
  }
  &.notConfig {
    padding: 0;
    .threeRegional__left {
      margin-right: 0;
    }
    .threeRegional__right {
      &--top {
        box-sizing: border-box;
        border-bottom: 1px solid #e9e9e9;
      }
    }
  }
}
</style>
