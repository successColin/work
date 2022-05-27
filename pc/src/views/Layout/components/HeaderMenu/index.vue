<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-08 14:19:40
 * @Des: 页面主体 头部菜单
-->
<template>
  <div
    class="menu"
    @mouseenter="menuMouseenter"
    @mouseleave="menuMouseleave"
    @click="drawer = true"
  >
    <i class="iconfont icon-caidanzhongxin"></i>
    <menu-normal
      :navArr="navArr"
      :drawer.sync="drawer"
      v-if="$store.state.globalConfig.menuType === 1"
    ></menu-normal>
    <menu-module :drawer.sync="drawer"></menu-module>
  </div>
</template>

<script>
// import { debounce } from '@/utils/utils';
import MenuNormal from './components/MenuNormal';
import MenuModule from './components/MenuModule';

export default {
  data() {
    return {
      hasEnter: false, // 是否已经在页面里面
      timer: null,
      drawer: false,
      curTime: 0,
      navArr: [] // 菜单数组
    };
  },

  components: {
    MenuNormal,
    MenuModule
  },

  computed: {},

  created() {},

  mounted() {
    // this.changeEnter = debounce(this.changeEnter);
    document.addEventListener('mousemove', this.changeEnter);
    document.addEventListener('mouseup', this.notClose, true);
  },

  methods: {
    menuMouseenter() {
      if (this.hasEnter) {
        return;
      }
      this.curTime = +new Date();
      this.timer = setTimeout(() => {
        this.drawer = true;
        this.hasEnter = true;
      }, 200);
    },
    menuMouseleave() {
      //
      clearTimeout(this.timer);
    },
    changeEnter(e) {
      if (e.pageX >= 50 || e.pageY >= 50) {
        this.hasEnter = false;
      } else if (this.drawer) {
        this.hasEnter = true;
      }
    },
    notClose(e) {
      const time = +new Date();
      if (e.pageX <= 50 && e.pageY <= 50 && this.drawer && time - this.curTime <= 1000) {
        e.stopImmediatePropagation();
      }
    }
  },

  beforeDestroy() {
    document.removeEventListener('mousemove', this.changeEnter);
    document.removeEventListener('mouseup', this.notClose, true);
  }
};
</script>

<style lang='scss' scoped>
.menu {
  width: $layoutHeader;
  height: $layoutHeader;
  font-size: 24px;
  line-height: $layoutHeader;
  text-align: center;
  z-index: 1000;
  background: $--color-primary;
  .icon-caidanzhongxin {
    font-size: 24px;
    color: #fff;
  }
  &--tab {
    cursor: pointer;
  }
}
</style>
