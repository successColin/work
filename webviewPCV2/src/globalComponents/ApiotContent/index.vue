<!--
 * @Author: cmk
 * @Date: 2021-04-09 11:23:00
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-16 17:06:04
 * @Des: 内容区域 用于左右布局
-->
<template>
  <div class="content" ref="box">
    <aside
      ref="left"
      class="content__sidebar"
      v-if="showSidebar"
      v-loading="asideLoading"
      :style="{ flex: `0 0 ${sideWidth}px` }"
    >
      <slot name="sidebar"></slot>
    </aside>
    <div class="leftAndRight__center" ref="resize"></div>
    <section ref="right" class="content__area" v-loading="contentLoading">
      <slot></slot>
    </section>
    <el-skeleton :rows="14" animated v-if="showSkeleton" class="skeleton">
      <template slot="template">
        <el-skeleton-item variant="p" style="width: 50%" />
        <el-skeleton-item variant="p" style="width: 40%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 70%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 80%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 30%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 40%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 90%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 20%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 30%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 70%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 80%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 30%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 40%" class="m-t-16" />
        <el-skeleton-item variant="p" style="width: 90%" class="m-t-16" />
      </template>
    </el-skeleton>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示侧边栏
    showSidebar: {
      type: Boolean,
      default: true
    },
    // 侧边栏的占宽尺寸，单位px
    sideWidth: {
      type: Number,
      default: 240
    },
    asideLoading: {
      type: Boolean,
      default: false
    },
    contentLoading: {
      type: Boolean,
      default: false
    },
    showSkeleton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    this.$nextTick(() => {
      this.dragControllerDiv();
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
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  position: relative;
  display: flex;
  height: 100%;
  background: #ffffff;
  &__sidebar {
    flex: 0 0 239px;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }

  &__area {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
  .skeleton {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 2000;
  }
}
.leftAndRight__center {
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
</style>
