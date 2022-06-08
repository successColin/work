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
import MenuList from './components/MenuList';

export default {
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
    MenuList
  },

  computed: {
    getKey() {
      if (this.$route.meta.parentPath) {
        return this.$route.parentPath;
      }
      return this.$route.fullPath;
    }
  },

  beforeMount() {
    this.getUserCenterInfo();
    this.$store.dispatch('fetchThemeConfig', 'THEME_AND_LOGO');
    this.$store.dispatch('fetchThirdLinks');
  },
  mounted() {
    this.$bus.$on('showMenu', this.showMenu);
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
          this.navLeftWidth = 260;
        } else {
          this.navLeftWidth = 0;
        }
        console.log(this.aniName);
        setTimeout(() => {
          this.aniName = 'slide-left';
        }, 0.5);
      });
    }
  },
  beforeDestroy() {
    this.$bus.$off('showMenu', this.showMenu);
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
</style>
