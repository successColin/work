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
      ></layout-nav>
    </template>
    <template>
      <transition :name="aniName">
        <keep-alive :max="4" :include="keepAliveArr">
          <router-view
            ref="routerView"
            v-if="showPage"
            class="view__layout"
            :class="{ hasShadow: isShow }"
            :key="getKey"
          />
        </keep-alive>
      </transition>
    </template>
  </apiot-container>
</template>

<script>
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
      navLeftWidth: 0,
      aniName: 'slide-left'
    };
  },

  components: {
    LayoutHeader,
    LayoutNav,
    MenuTradition,
    MenuCollapse,
    MenuList
  },

  computed: {
    isShow() {
      const { name } = this.$route;
      return name === 'homePage';
    },
    getKey() {
      if (this.$route.meta.parentPath) {
        return this.$route.parentPath;
      }
      return this.$route.fullPath;
    }
  },

  beforeMount() {
    // this.$store.dispatch('fetchThemeConfig', 'THEME_AND_LOGO');
    // this.$store.dispatch('fetchConfigFun');
    // this.$store.dispatch('fetchConfigFun', 'MESSAGE_CONFIG');
    // this.$store.dispatch('fetchConfigFun', 'UREPORT_URL');
    // this.$store.dispatch('fetchConfigFun', 'FILE_SERVER');
    this.$store.dispatch(
      'fetchConfigFuns',
      'THEME_AND_LOGO,THIRD_LINKS,MESSAGE_CONFIG,UREPORT_URL,FILE_SERVER,WATER_MASK'
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
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    initKeepAliveArr() {
      const index = routes.findIndex((item) => item.path === '/');
      routes[index].children.forEach((item) => this.keepAliveArr.push(item.name));
    },
    clearCacheBefore() {
      const index = this.keepAliveArr.findIndex((item) => item === this.$route.name);
      this.deleteArr = this.keepAliveArr.splice(index, 1);
    },
    clearCacheAfter() {
      if (this.deleteArr.length) {
        this.keepAliveArr.push(...this.deleteArr);
        this.deleteArr = [];
      }
    },
    async refresh() {
      this.$store.commit('changeIsNoodQuery', false);
      try {
        const arr = ['/appConfig/funcPage', '/appConfig/mine'];
        const { pathname } = window.location;
        if (arr.includes(pathname) || pathname.split('/').includes('menuConfig')) {
          await this.$confirm('请确认是否保存配置', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
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
        // console.log(error);
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
        if (this.$store.getters.getMenuType === 2) {
          sessionStorage.traditionOpen = !!this.navLeftWidth;
        }
        // true 代表打开 false 代表关闭
        this.$bus.$emit('menuWidthChange', !!this.navLeftWidth);
        // console.log(this.aniName);
        setTimeout(() => {
          this.aniName = 'slide-left';
        }, 0.5);
      });
    }
  },
  beforeRouteLeave(to, from, next) {
    console.log(to.name);
    if (to.name !== 'menuConfig') {
      if (this.$vnode && this.$vnode.data.keepAlive) {
        if (
          this.$vnode.parent &&
          this.$vnode.parent.componentInstance &&
          this.$vnode.parent.componentInstance.cache
        ) {
          if (this.$vnode.componentOptions) {
            const key =
              this.$vnode.key == null
                ? this.$vnode.componentOptions.Ctor.cid +
                  (this.$vnode.componentOptions.tag ? `::${this.$vnode.componentOptions.tag}` : '')
                : this.$vnode.key;
            const { cache } = this.$vnode.parent.componentInstance;
            const { keys } = this.$vnode.parent.componentInstance;
            if (cache[key]) {
              if (keys.length) {
                const index = keys.indexOf(key);
                if (index > -1) {
                  keys.splice(index, 1);
                }
              }
              delete cache[key];
            }
          }
        }
      }
    }
    next();
  },
  deactivated() {
    this.$bus.$off('showMenu', this.showMenu);
    this.$bus.$off('refresh', this.refresh);
  },
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
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
.view__layout {
  margin: 10px;
  margin-bottom: 0;
  width: calc(100% - 20px);
  box-sizing: border-box;
  height: calc(100% - 10px);
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
  background-color: #fff;
}

.hasShadow {
  box-shadow: none;
}
</style>
