<!--
 * @Author: cmk
 * @Date: 2021-04-14 17:45:32
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:38:50
 * @Des: 动态加载的页面
-->
<template>
  <apiot-container
    :navLeftWidth="$store.getters.getMenuType === 1 ? 0 : navLeftWidth"
    :headerHeight="$store.state.globalConfig.themeConfig.topHeight"
  >
    <template v-slot:header>
      <layout-header @refresh="refresh"></layout-header>
    </template>
    <template v-slot:navLeft>
      <menu-tradition
        v-if="[2].includes($store.getters.getMenuType)"
      ></menu-tradition>
      <menu-collapse
        v-if="[4].includes($store.getters.getMenuType)"
      ></menu-collapse>
      <menu-list v-show="[3].includes($store.getters.getMenuType)"></menu-list>
    </template>
    <template v-slot:nav>
      <layout-nav
        @refresh="refresh"
        @showMenu="showMenu"
        @clearCacheBefore="clearCacheBefore"
        @menuRefresh="menuRefresh"
      ></layout-nav>
    </template>
    <template>
      <!-- <transition :name="aniName"> -->
      <!-- <keep-alive :max="8" :include="keepAliveArr"> -->
      <!-- <router-view
            ref="routerView"
            v-if="showPage"
            class="view__layout"
            :class="{ hasShadow: isShow }"
            :key="getKey"
          />
        </keep-alive> -->
      <history-transition
        alive-ref="routerView"
        ref="routerView"
        keep-alive
        :max="25"
        v-if="showPage"
        class="view__layout"
        :class="{ hasShadow: isShow }"
      />
      <!-- </transition> -->
    </template>
  </apiot-container>
</template>

<script>
import { Transition } from 'history-keep-alive';
import routes from '@/router/Routes';
import { getPersonalCenterUser } from '@/api/userCenter';
import LayoutHeader from './components/LayoutHeader';
import LayoutNav from './components/LayoutNav';
import MenuTradition from './components/MenuTradition';
import MenuCollapse from './components/MenuCollapse';
import MenuList from './components/MenuList';

export default {
  name: 'Layout',
  data() {
    return {
      showPage: true,
      keepAliveArr: [],
      deleteArr: [],
      navLeftWidth: 220,
      aniName: 'slide-left',
    };
  },

  components: {
    LayoutHeader,
    LayoutNav,
    MenuTradition,
    MenuCollapse,
    MenuList,
    'history-transition': Transition,
  },

  computed: {
    isShow() {
      const { name } = this.$route;
      return name === 'homePage';
    },
    getKey() {
      // if (this.$route.name === 'homePage') {
      //   return this.$route.fullPath;
      // }
      // return this.$route.name;
      if (this.$route.meta.parentPath) {
        return this.$route.parentPath;
      }
      return this.$route.fullPath;
    },
  },

  beforeMount() {
    this.$store.dispatch(
      'fetchConfigFuns',
      'THEME_AND_LOGO,THIRD_LINKS,MESSAGE_CONFIG,UREPORT_URL,FILE_SERVER,WATER_MASK,REMOTE_ASSISTANCE',
    );
  },
  mounted() {
    // this.getUserCenterInfo();
    this.$bus.$on('showMenu', this.showMenu);
    this.$bus.$on('refresh', this.refresh);
    if (this.$store.getters.getMenuType === 2) {
      if (sessionStorage.traditionOpen === 'false') {
        // 这个时候不打开
        return false;
      }
      this.showMenu();
    }
  },
  methods: {
    menuRefresh() {
      setTimeout(() => {
        const onlyFlagObj = sessionStorage.onlyFlagObj
          ? JSON.parse(sessionStorage.onlyFlagObj)
          : {};
        this.$broadcast(
          'menuRefresh',
          this.$route.params.id ? onlyFlagObj[this.$route.params.id] : '',
        );
      }, 200);
    },
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    initKeepAliveArr() {
      const index = routes.findIndex((item) => item.path === '/');
      routes[index].children.forEach((item) =>
        this.keepAliveArr.push(item.name),
      );
    },
    // 清空一些bus监听
    clearBus(path) {
      const arr = path.split('/');
      const id = arr[arr.length - 1];
      const onlyFlagObj = sessionStorage.onlyFlagObj
        ? JSON.parse(sessionStorage.onlyFlagObj)
        : {};
      const onlyFlag = onlyFlagObj[id];
      if (onlyFlag) {
        this.offBus(onlyFlag);
        delete onlyFlagObj[id];
        sessionStorage.onlyFlagObj = JSON.stringify(onlyFlagObj);
      }
    },
    offBus(onlyFlag) {
      this.$bus.$off(`closePanel${onlyFlag}`);
      this.$bus.$off(`setDataSel${onlyFlag}`);
      this.$bus.$off(`multiArrChange${onlyFlag}`);
      this.$bus.$off(`reloadArea${onlyFlag}`);
      this.$bus.$off(`getSelMultiArr${onlyFlag}`);
      this.$bus.$off('changeShowSkeleton');
      this.$bus.$off(`selectTableLine${onlyFlag}`);
      this.$bus.$off(`tabHidden${onlyFlag}`);
      this.$bus.$off(`returnFirst${onlyFlag}`);
      this.$bus.$off(`clearSearch${onlyFlag}`);
    },
    clearCacheBefore(flag = false, path) {
      if (flag) {
        const children = this.$refs.routerView.$children;
        if (children.length) {
          const routerHistoryInstance =
            this.$refs.routerView.$children[children.length - 1]
              .$routerHistoryInstance;
          // console.log(routerHistoryInstance);
          if (routerHistoryInstance) {
            const res = path.split('?');
            setTimeout(() => {
              routerHistoryInstance.destroy({ path: res[0] });
              this.clearBus(res[0]);
              // console.log(res1, res[0]);
            }, 100);
          }
        }
      }
      const index = this.keepAliveArr.findIndex(
        (item) => item === this.$route.name,
      );
      this.deleteArr = this.keepAliveArr.splice(index, 1);
    },
    clearCacheAfter() {
      if (this.deleteArr.length) {
        this.keepAliveArr.push(...this.deleteArr);
        this.deleteArr = [];
      }
    },
    async refresh() {
      //   // 手动点击刷新的时候清除缓存
      //   const children = this.$refs.routerView.$children;
      //   if (children.length) {
      //     this.$refs.routerView.$children[
      //       children.length - 1
      //     ].$routerHistoryInstance.destroyAll();
      //   }
      // 清除缓存
      const onlyFlagObj = sessionStorage.onlyFlagObj
        ? JSON.parse(sessionStorage.onlyFlagObj)
        : {};
      Object.keys(onlyFlagObj).forEach((key) => {
        const onlyFlag = onlyFlagObj[key];
        this.offBus(onlyFlag);
        delete onlyFlagObj[key];
        sessionStorage.onlyFlagObj = JSON.stringify(onlyFlagObj);
      });
      if (this.$route.meta.parentPath === 'globalConfig') {
        this.$broadcast('refresh');
        return;
      }
      try {
        const arr = ['/appConfig/funcPage', '/appConfig/mine'];
        const { pathname } = window.location;
        if (
          arr.includes(pathname) ||
          pathname.split('/').includes('menuConfig')
        ) {
          await this.$confirm('请确认是否保存配置', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning',
          });
        }
        // 刷新清除缓存
        this.clearCacheBefore();
        this.showPage = false;
        this.$nextTick(() => {
          this.showPage = true;
          this.clearCacheAfter();
        });
      } catch (error) {
        console.log(error);
      }
    },
    showMenu(flag) {
      // console.log(this.navLeftWidth, flag);
      this.aniName = '';
      this.$nextTick(() => {
        if (this.navLeftWidth === 0 || flag) {
          this.navLeftWidth = 220;
        } else {
          this.navLeftWidth = 0;
        }
        if (
          this.$store.getters.getMenuType === 2 ||
          this.$store.getters.getMenuType === 3
        ) {
          sessionStorage.traditionOpen = !!this.navLeftWidth;
        }
        // true 代表打开 false 代表关闭
        this.$bus.$emit('menuWidthChange', !!this.navLeftWidth);
        // console.log(this.aniName);
        setTimeout(() => {
          this.aniName = 'slide-left';
        }, 0.5);
      });
    },
  },
  // deactivated() {
  //   console.log(555);
  //   this.$bus.$off('showMenu', this.showMenu);
  //   this.$bus.$off('refresh', this.refresh);
  // },
  beforeDestroy() {
    this.$bus.$off('showMenu', this.showMenu);
    this.$bus.$off('refresh', this.refresh);
  },
  watch: {
    $route: {
      handler(to) {
        if (to.meta.childrenPage) {
          if (!this.keepAliveArr.includes(to.name)) {
            this.keepAliveArr.push(to.name);
          }
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.view__layout {
  margin: 10px;
  margin-bottom: 0;
  width: calc(100% - 20px);
  box-sizing: border-box;
  height: calc(100% - 10px);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  position: absolute !important;
  &:nth-last-child(2):first-child {
    display: none;
  }
}

.hasShadow {
  box-shadow: none;
}
</style>
