<!--
 * @Author: cmk
 * @Date: 2021-04-09 11:23:00
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-16 17:06:04
 * @Des: 内容区域 用于左右布局
-->
<template>
  <div class="content">
    <aside
      class="content__sidebar"
      v-if="showSidebar"
      v-loading="asideLoading"
      :style="{ flex: `0 0 ${sideWidth}px` }"
    >
      <slot name="sidebar"></slot>
    </aside>
    <section class="content__area" v-loading="contentLoading">
      <slot></slot>
    </section>
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
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.content {
  display: flex;
  height: 100%;
  //padding: 10px 10px 0 10px;
  background: #ffffff;
  // box-sizing: border-box;
  &__sidebar {
    flex: 0 0 239px;
    // min-width: 239px;
    height: 100%;
    background-color: #fff;
    border-right: 1px solid #e9e9e9;
  }

  &__area {
    flex: 1;
    height: 100%;
    overflow: hidden;
  }
}
</style>
