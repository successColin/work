<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:39:12
 * @Des: 页面主体 nav 框
-->
<template>
  <div class="nav">
    <el-tooltip
      effect="dark"
      :content="showMenuFlag ? '隐藏菜单' : '展开菜单'"
      transition="topEnterBottomLeave"
      placement="bottom"
      :enterable="false"
      :disabled="showTip"
      v-if="[2, 3, 4].includes($store.getters.getMenuType)"
    >
      <div
        class="nav__menubar"
        @click="showMenu()"
        v-if="[2, 3, 4].includes($store.getters.getMenuType)"
      >
        <i
          :class="`iconfont ${
            showMenuFlag ? 'icon-caidanzhankai' : 'icon-caidanyincang'
          }`"
        ></i>
      </div>
    </el-tooltip>
    <div class="nav--refresh" @click="$emit('refresh')" v-if="false">
      <i class="iconfont icon-shuaxin m-r-5 m-l-18"></i>刷新
    </div>
    <div
      class="nav--home"
      @click="goHome"
      :class="[{ 'nav--item__active': isHome }]"
    >
      <i class="iconfont icon-zhuye"></i>
      <span v-if="homeArr.length" class="m-l-2">{{ homeArr[0].menuName }}</span>
    </div>
    <div
      class="nav--left"
      :class="[{ canClick: canLeftClick }]"
      @click="leftClick"
      v-if="showLeftAndRight"
    >
      <i class="iconfont icon-shuangjiantouzuo"></i>
    </div>
    <div class="nav__menu" ref="navMenu">
      <ul class="nav--tab" ref="navTab">
        <li
          class="nav--item"
          ref="navItem"
          v-for="tab in reduceArr"
          :key="tab.path"
          :class="[
            {
              'nav--item__active':
                $route.path.indexOf(tab.path) !== -1 ||
                tab.path.indexOf($route.path) !== -1,
            },
          ]"
          @click="changeMenuTab(tab, false)"
        >
          {{ tab.menuName }}
          <span
            v-if="isShow(tab.path)"
            class="close-btn"
            @click.stop="closeTab(tab)"
          >
            <i class="el-icon-close"></i>
          </span>
        </li>
      </ul>
    </div>
    <div
      class="nav--right"
      :class="[{ canClick: canRightClick }]"
      @click="rightClick"
      v-if="showLeftAndRight"
    >
      <i class="iconfont icon-shuangjiantouyou"></i>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import bus from '@/utils/bus';
import { debounce } from '@/utils/utils';

export default {
  data() {
    return {
      tabArr: [], // tab 数组
      delTabArr: [], // 关闭的tab数组
      curIndex: 0, // 当前位置的
      canLeftClick: true, // 左边能否点击
      canRightClick: true, // 右边能否点击
      hasMounted: false, // 是否第一次
      scroll: null,
      posIndex: 0, // 位置的index
      showMenuFlag: true, // 传统菜单是否显示
      timer: null,
      showLeftAndRight: false,
      hoverPath: '', // hover的菜单项
      showTip: true,
    };
  },

  components: {},

  computed: {
    isHome() {
      if (this.homeArr.length) {
        const current = this.homeArr[0];
        const { path } = current;
        return (
          this.$route.path.indexOf(path) !== -1 ||
          path.indexOf(this.$route.path) !== -1
        );
      }
      return this.$route.path === '/home';
    },
    homeArr() {
      const { homeArr } = this.$store.state.base;
      // homeArr.forEach((home) => {
      //   home.path = `${home.path}?`;
      // });
      return homeArr;
    },
    reduceArr() {
      if (!this.homeArr.length) {
        return this.tabArr;
      }
      const arr = this.getTabArr;
      return arr.slice(1);
    },
    getTabArr() {
      return [...this.homeArr, ...this.tabArr];
    },
    isShow() {
      return function (path) {
        if (path && path.indexOf('homePage') > -1) {
          return false;
        }
        return true;
      };
    },
  },
  activated() {
    this.tabArr = sessionStorage.navTabArr
      ? JSON.parse(sessionStorage.navTabArr)
      : this.tabArr;
    this.delTabArr = sessionStorage.delTabArr
      ? JSON.parse(sessionStorage.delTabArr)
      : this.delTabArr;
    this.hasMounted = true;
    bus.$on('changeMenuTab', this.changeMenuTab);
    bus.$on('changeModuleDrawer', this.changeModuleDrawer);
    bus.$on('openMenuList', this.showMenu);
    bus.$on('routerReset', () => {
      this.tabArr = sessionStorage.navTabArr
        ? JSON.parse(sessionStorage.navTabArr)
        : this.tabArr;
    });
    this.initScroll('init');
    window.addEventListener('resize', debounce(this.initScroll));
    if (
      this.$store.getters.getMenuType === 2 ||
      this.$store.getters.getMenuType === 3
    ) {
      if (sessionStorage.traditionOpen === 'false') {
        this.showMenuFlag = true;
        this.showMenu(false);
        // 这个时候不打开
        return false;
      }
      this.showMenuFlag = false;
      this.showMenu(true);
    }
  },
  // mounted() {
  //   this.tabArr = sessionStorage.navTabArr ? JSON.parse(sessionStorage.navTabArr) : this.tabArr;
  //   this.delTabArr = sessionStorage.delTabArr
  //     ? JSON.parse(sessionStorage.delTabArr)
  //     : this.delTabArr;
  //   this.hasMounted = true;
  //   bus.$on('changeMenuTab', this.changeMenuTab);
  //   bus.$on('openMenuList', this.showMenu);
  //   bus.$on('routerReset', () => {
  //     this.tabArr = sessionStorage.navTabArr ?
  // JSON.parse(sessionStorage.navTabArr) : this.tabArr;
  //   });
  //   this.initScroll('init');
  //   window.addEventListener('resize', debounce(this.initScroll));
  //   if (this.$store.getters.getMenuType === 2) {
  //     if (sessionStorage.traditionOpen === 'false') {
  //       this.showMenuFlag = false;
  //       // 这个时候不打开
  //       return false;
  //     }
  //     this.showMenuFlag = true;
  //   }
  // },
  methods: {
    goHome() {
      if (this.homeArr.length) {
        const current = this.homeArr[0];
        const { path } = current;
        this.$router.push(path);
        return;
      }
      this.$router.push('/home');
    },
    // 初始化bs
    initScroll(flag) {
      this.$nextTick(() => {
        if (this.scroll && flag !== 'init') {
          this.scroll.refresh();
        } else {
          this.scroll = new BScroll(this.$refs.navMenu, {
            bounce: false,
            scrollX: true,
            scrollY: false,
            click: true,
          });

          if (this.scroll.maxScrollX < 0) {
            this.showLeftAndRight = true;
            this.scroll.destroy();
            this.$nextTick(() => {
              this.scroll = new BScroll(this.$refs.navMenu, {
                bounce: false,
                scrollX: true,
                scrollY: false,
                click: true,
              });
            });
          }
          this.scroll.on('scrollEnd', () => {
            this.validateBtn();
          });
          setTimeout(() => {
            this.scroll.refresh();
            // console.log(this.scroll.maxScrollX);
            const res = this.reduceArr.findIndex(
              (tab) =>
                // console.log(this.$route.path, tab);
                tab.path === this.$route.path ||
                this.$route.path.indexOf(tab.path) !== -1 ||
                (tab.path && tab.path.indexOf(this.$route.path) !== -1),
            );
            this.changePos(res);
          }, 100);
        }
      });
    },

    // 展示侧边菜单
    showMenu(flag = false) {
      clearTimeout(this.timer);
      if (flag) {
        if (this.showMenuFlag) {
          return;
        }
        this.showMenuFlag = true;
        this.$emit('showMenu', flag);
      } else {
        this.showMenuFlag = !this.showMenuFlag;
        this.$emit('showMenu', flag);
      }
      this.timer = setTimeout(() => {
        this.scroll.refresh();
        this.validateBtn();
      }, 500);
    },
    changeModuleDrawer(v) {
      this.showTip = v;
    },

    changeMenuTab(item, refresh = true) {
      console.log(this.$route, item.path);
      // console.log(item);
      if (item.openType === 2) {
        const shareUrl = `${window.location.origin}/sharePage/1?menuId=${item.id}`;
        window.open(shareUrl);
        return;
      }
      if (this.$route.path === item.path) {
        // 相等 跳过去的页面是带条件的页面 只需刷新页面无需跳转
        if (item.path.indexOf('isJump=1') !== -1 && refresh) {
          setTimeout(() => {
            this.$emit('menuRefresh');
          }, 100);
        }
        return;
      }
      // 更换菜单中心选中菜单
      this.$bus.$emit('changeSelect', item);
      this.$router.push(item.path);
      const res = this.getTabArr.findIndex(
        (tab) => tab.path.split('?')[0] === item.path.split('?')[0],
      );
      console.log(refresh);
      if (refresh) {
        // 判断是否是有条件的 true 为不带条件的
        const flag = item.path.indexOf('isJump=1') === -1;
        const pathArr = sessionStorage.pathArr
          ? JSON.parse(sessionStorage.pathArr)
          : [];
        const index = pathArr.findIndex((p) => {
          if (flag) {
            if (p.indexOf(item.path) !== -1 && p !== item.path) {
              return true;
            }
          } else if (item.path.indexOf(p) !== -1) {
            return true;
          }

          return false;
        });
        if (index === -1) {
          pathArr.push(item.path);
        } else {
          pathArr.splice(index, 1, item.path);
        }
        console.log(res);
        if (res !== -1) {
          this.$emit('menuRefresh');
        }
        sessionStorage.pathArr = JSON.stringify(pathArr);
      }
      if (res === -1) {
        if (this.tabArr.length >= 8) {
          this.closeTab(this.tabArr[0]);
        }
        this.tabArr.push(item);
        this.$nextTick(() => {
          this.scroll.refresh();
          if (this.scroll.maxScrollX < 0) {
            this.showLeftAndRight = true;
            this.initScroll('init');
          } else {
            this.changePos(this.reduceArr.length - 1);
          }
        });
      }
      // console.log(2, this.tabArr);
      sessionStorage.navTabArr = JSON.stringify(this.tabArr);
    },

    closeTab(item) {
      const res = this.tabArr.findIndex((tab) => tab.path === item.path);
      if (res === -1) {
        return;
      }
      this.$emit('clearCacheBefore', true, item.path);
      // this.$bus.$emit('clearCacheBefore', item.path);
      const delItem = this.tabArr.splice(res, 1);
      this.delTabArr.push(...delItem);
      sessionStorage.delTabArr = JSON.stringify(this.delTabArr);
      this.$nextTick(() => {
        this.scroll.refresh();
      });

      if (
        item.path === this.$route.path ||
        this.$route.path.indexOf(item.path) !== -1 ||
        item.path.indexOf(this.$route.path) !== -1
      ) {
        if (this.tabArr.length === 0) {
          const { homeArr } = this.$store.state.base;
          if (homeArr.length) {
            const current = homeArr[0];
            this.$router.push(`/homePage/${current.homePageId}`);
          } else {
            this.$router.push('/home');
          }
          // this.$router.push('/home');
        } else {
          this.$router.push(this.tabArr[this.tabArr.length - 1].path);
        }
      }
      sessionStorage.navTabArr = JSON.stringify(this.tabArr);

      this.$nextTick(() => {
        if (this.scroll.maxScrollX >= 0) {
          this.showLeftAndRight = false;
          this.scroll.destroy();
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.navMenu, {
              bounce: false,
              scrollX: true,
              scrollY: false,
              click: true,
            });
          });
          this.scroll.on('scrollEnd', () => {
            this.validateBtn();
          });
        }
      });
    },
    // validate 左右按钮能否点击
    validateBtn() {
      if (this.scroll.x - 1 > this.scroll.maxScrollX) {
        this.canRightClick = true;
      } else {
        this.canRightClick = false;
      }
      if (this.scroll.x === 0) {
        this.canLeftClick = false;
      } else {
        this.canLeftClick = true;
      }
    },
    // changePos 改变位置
    changePos(index) {
      // // console.log('pos', index);
      this.validateBtn();
      if (index !== -1) {
        this.$store.commit('changeCurMenuId', this.reduceArr[index].id);
        let left = 0;
        let left1 = 0;
        if (this.$refs.navItem) {
          this.$refs.navItem.forEach((el, key) => {
            if (key < index) {
              left += el.offsetWidth;
            }
            if (key === index) {
              left1 = left + el.offsetWidth;
            }
          });
        }

        if (left < -this.scroll.x) {
          this.scroll.scrollTo(-left, 0, 400);
        }
        if (left1 > -this.scroll.x + this.$refs.navMenu.offsetWidth) {
          this.scroll.scrollTo(this.$refs.navMenu.offsetWidth - left1, 0, 400);
        }
      }

      this.validateBtn();
    },
    leftClick() {
      if (!this.canLeftClick) {
        return false;
      }
      let left = 0;
      const index = this.$refs.navItem.findIndex((el) => {
        if (left + el.offsetWidth >= -this.scroll.x) {
          return true;
        }
        left += el.offsetWidth;
        return false;
      });
      if (index !== -1) {
        this.scroll.scrollTo(-left, 0, 400);
      }
      this.validateBtn();
    },
    rightClick() {
      if (!this.canRightClick) {
        return false;
      }
      let left = 0;
      const index = this.$refs.navItem.findIndex((el) => {
        if (
          left + el.offsetWidth >
          -this.scroll.x + this.$refs.navMenu.offsetWidth
        ) {
          left += el.offsetWidth;
          return true;
        }
        left += el.offsetWidth;
        return false;
      });
      if (index !== -1) {
        if (index === this.tabArr.length - 1) {
          this.scroll.scrollTo(this.scroll.maxScrollX, 0, 400);
        } else {
          this.scroll.scrollTo(this.$refs.navMenu.offsetWidth - left, 0, 400);
        }
      }

      this.validateBtn();
    },
  },
  deactivated() {
    if (this.scroll) {
      this.scroll.destroy();
    }
    window.removeEventListener('resize', debounce(this.initScroll));
    bus.$off('changeMenuTab', this.changeMenuTab);
    bus.$off('openMenuList', this.showMenu);
    bus.$off('routerReset');
  },
  beforeDestroy() {
    if (this.scroll) {
      this.scroll.destroy();
    }
    window.removeEventListener('resize', debounce(this.initScroll));
    bus.$off('changeMenuTab', this.changeMenuTab);
    bus.$off('openMenuList', this.showMenu);
    bus.$off('routerReset');
  },
  watch: {
    $route: {
      handler(to) {
        if (to.path !== '/home' && to.meta.childrenPage) {
          const res = this.reduceArr.findIndex(
            (tab) =>
              tab.path === to.path ||
              to.path.indexOf(tab.path) !== -1 ||
              tab.path.indexOf(to.path) !== -1,
          );
          // console.log(res);
          if (res === -1) {
            if (this.delTabArr.length) {
              const index = this.delTabArr.findIndex((tab) => {
                let flag = false;
                const path = to.meta.parentPath ? to.meta.parentPath : to.path; // 区分孙路由跟无孙路由
                flag =
                  tab.path === path ||
                  path.indexOf(tab.path) !== -1 ||
                  tab.path.indexOf(path) !== -1;
                return flag;
              });
              if (index !== -1) {
                const tabObj = this.delTabArr.splice(index, 1);
                sessionStorage.delTabArr = JSON.stringify(this.delTabArr);
                this.tabArr.push(...tabObj);
                this.$nextTick(() => {
                  this.scroll.refresh();
                  this.changePos(this.reduceArr.length - 1);
                });
              }
            }
            // if (this.hasMounted) {
            //   console.log(1, this.tabArr);
            // sessionStorage.navTabArr = JSON.stringify(this.tabArr);
            // }
          } else {
            this.changePos(res);
          }
        }
      },
      immediate: true,
    },
    // 改变菜单更新scroll数据
    '$store.getters.getMenuType': {
      handler(v) {
        if (v === 2 || v === 3) {
          this.$nextTick(() => {
            this.scroll.refresh();
          });
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.iconfont {
  color: #bbc3cd;
  font-size: 20px;
}
.nav {
  display: flex;
  align-items: center;
  color: #808080;
  font-size: 13px;
  text-align: center;
  background-color: #fff;
  cursor: pointer;
  overflow: hidden;
  & > div {
    // box-sizing: border-box;
    border-right: 1px solid #e9e9e9;
    max-height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    &:hover {
      color: $--color-primary;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
  &__menubar {
    flex: 0 0 50px;
  }
  &--refresh {
    flex: 0 0 86px;
    display: flex;
    align-items: center;

    i {
      font-size: 20px;
    }
  }
  &--home {
    display: flex;
    width: max-content;
    padding: 0 20px;
    white-space: nowrap;
    align-items: center;
    flex: 0 0 $layoutHeader;
    .iconfont {
      margin-top: -1px;
    }
    &.nav--item__active {
      border-bottom: 1px solid #f6f6f8 !important;
      .iconfont {
        color: $--color-primary;
      }
    }
  }

  &--right {
    border-right: 0px;
  }
  &--left,
  &--right {
    flex: 0 0 40px;
    cursor: not-allowed;
    &:not(.canClick):hover {
      .iconfont {
        color: #bbc3cd !important;
      }
    }
    &.canClick {
      cursor: pointer;
    }
  }
  &__menu {
    flex: 1;
    overflow: hidden;
    text-align: left;
    border-bottom: 0 none !important;
  }
  &--tab {
    // display: flex;
    white-space: nowrap;
    width: min-content;
    min-width: 100%;
    max-height: 40px;
    height: 40px;
    position: relative;
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
  }
  &--item {
    position: relative;
    height: 40px;
    display: inline-block;
    padding: 0 20px;
    box-sizing: border-box;
    border-right: 1px solid #e9e9e9;
    white-space: nowrap;
    text-align: center;
    color: #808080;
    &:hover {
      .close-btn {
        visibility: visible;
      }
    }
    &__active {
      color: $--color-primary;
      background-color: #f6f6f8;
      // &:after {
      //   content: '';
      //   position: absolute;
      //   width: 100%;
      //   height: 1px;
      //   left: 0;
      //   bottom: 0;
      //   background: #f5f5f5;
      // }
      .close-btn {
        visibility: visible !important;
      }
    }
    &:hover {
      color: $--color-primary;
    }
    .close-btn {
      visibility: hidden;
      margin-left: 6px;
      // display: inline-block;
      height: 100%;
    }
  }
}
</style>
