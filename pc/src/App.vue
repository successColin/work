<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 17:45:20
 * @Des: 主入口
-->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { whitePathName } from '@/config';
import { zwdingtalkLogin } from '@/api/login';
import { getDingDingCode } from '@/utils/dingding/index';
// import store from '@/store';

export default {
  data() {
    return {
      isSuccess: true
    };
  },
  created() {
    this.$store.commit('changeIsNoodQuery', false);
    this.fetchConfig();
    window.addEventListener('beforeunload', this.beforeLoad);
  },
  computed: {
    configs() {
      const { loginConfig } = this.$store.state.base;
      return loginConfig;
    }
  },
  methods: {
    beforeLoad() {
      const arr = ['/appConfig/funcPage', '/appConfig/mine', '/homeMenuConfig/'];
      const { pathname } = window.location;
      const pathnameArr = pathname.split('/');
      if (
        arr.includes(pathname) ||
        pathnameArr.includes('menuConfig') ||
        pathnameArr.includes('homeMenuConfig')
      ) {
        window.event.returnValue = '刷什么新，快按“取消”吧！';
      }
    },
    // 获取配置
    async fetchConfig() {
      await this.$store.dispatch('getLoginConfigFun');
      await this.$store.dispatch('getHomeRoute');
      // 单点登录逻辑
      if (+this.configs.ssoTypePc === 2) {
        await this.ssoZheZhengDing();
      }
      // 获取到 token 才去获取路由或其他信息
      const token = localStorage.getItem('token');
      if (this.isSuccess && token) {
        const pathArr = window.location.pathname.split('/');
        const pathName = pathArr[pathArr.length - 1];
        if (!whitePathName.includes(pathName)) {
          this.$store.dispatch('getRoute');
        }
        await this.publicJump();
      }
    },
    async publicJump() {
      const { homeArr } = this.$store.state.base;
      const pathArr = window.location.pathname.split('/');
      const pathName = pathArr[pathArr.length - 1];
      if (homeArr.length && (!pathName || pathName === 'home')) {
        const current = homeArr[0];
        await this.$router.push(`/homePage/${current.homePageId}`);
      }
    },
    // 浙政钉单点登录
    ssoZheZhengDing() {
      getDingDingCode().then(async (code) => {
        if (code) {
          localStorage.setItem('zhezhengdingCode', code);
          try {
            await zwdingtalkLogin({ code });
            const { homeArr } = this.$store.state.base;
            if (!homeArr.length) {
              window.vue.$router.push('/home');
            } else {
              await this.publicJump();
            }
            this.isSuccess = true;
          } catch (error) {
            window.vue.$router.push('/AssociatedUser');
            this.isSuccess = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
