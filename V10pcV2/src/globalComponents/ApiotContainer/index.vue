<!--
 * @Author: cmk
 * @Date: 2021-04-09 11:23:00
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:23:46
 * @Des: 布局组件，上中下
-->
<template>
  <div class="container">
    <header
      class="container__header"
      :style="{ flex: `0 0 ${headerHeight}px` }"
      v-if="showHeader"
    >
      <slot name="header"></slot>
    </header>
    <section
      class="container__wrapper"
      :style="`height: calc(100% - ${headerHeight}px);`"
    >
      <div class="container__left" :style="`width:${navLeftWidth}px`">
        <slot name="navLeft"></slot>
      </div>
      <div
        class="container__right"
        :style="`width:calc(100% - ${navLeftWidth}px)`"
      >
        <nav
          class="container__nav"
          :style="{ flex: `0 0 ${navHeight}px` }"
          v-if="showNav"
        >
          <slot name="nav"></slot>
        </nav>
        <section class="container__content">
          <slot></slot>
        </section>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示头部
    showHeader: {
      type: Boolean,
      default: true
    },
    // 是否显示nav/tab部分
    showNav: {
      type: Boolean,
      default: true
    },
    // nav、tab 的高度，单位px
    navHeight: {
      type: Number,
      default: 40
    },
    // 头部的高度，单位px
    headerHeight: {
      type: Number,
      default: 50
    },
    // 右边栏宽度
    navLeftWidth: {
      type: Number,
      default: 0
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
.container {
  height: 100%;
  display: flex;
  min-width: 900px;
  flex-direction: column;
  background-color: #f6f6f8;
  &__header {
    flex: 0 0 50px;
  }
  &__wrapper {
    flex: 1;
    display: flex;
  }
  &__left {
    width: 0;
    transition: width 400ms;
  }
  &__right {
    width: 100%;
    display: flex;
    flex-direction: column;
    transition: width 400ms;
  }
  &__nav {
    flex: 0 0 40px;
  }
  &__content {
    flex: 1;
    display: flex;
    height: calc(100% - 40px);
    overflow: hidden;
    position: relative;
  }
}
</style>
