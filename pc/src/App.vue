<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 17:45:20
 * @Des: 主入口
-->
<template>
  <div id="app">
    <keep-alive :include="['Layout']" :max="1">
      <router-view v-if="showPage" />
    </keep-alive>
  </div>
</template>

<script>
import { whitePathName } from '@/config';
import { zwdingtalkLogin, ssoLogin } from '@/api/login';
import { getDingDingCode } from '@/utils/dingding/index';
// import store from '@/store';

export default {
  data() {
    return {
      isSuccess: true,
      excludeArr: [],
      max: 1,
      isLoggedIn: false,
      showPage: true
    };
  },
  created() {
    this.getSystemLanguage();
    this.$store.commit('changeIsNoodQuery', false);
    this.fetchConfig();
    window.addEventListener('beforeunload', this.beforeLoad);
  },
  computed: {
    configs() {
      const { loginConfig } = this.$store.state.base;
      return loginConfig;
    },
    zzdConfig() {
      return (this.configs.zzdConfig && JSON.parse(this.configs.zzdConfig)) || {};
    }
  },
  methods: {
    // 退出登录清除弹窗
    removeDialog() {
      const body = document.querySelector('body');
      const divs = document.querySelectorAll('body>.panel__dialog');
      console.log(body, divs);
      divs.forEach((div) => {
        body.removeChild(div);
      });
    },
    async singleLoginSso() {
      if (+this.configs.ssoTypePc === 3) {
        const rsaToken = window.location.href.split('?uid=')[1];
        if (rsaToken) {
          try {
            this.showPage = false;
            await ssoLogin({ rsaToken });
            this.showPage = true;
          } catch (error) {
            this.showPage = true;
          }
        }
      }
    },
    // 先获取localStorage语言，如果没有在获取系统语言
    getSystemLanguage() {
      const lang = localStorage.getItem('apiotLanguage');
      if (!lang) {
        let currentLang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
        currentLang = currentLang.replace(/-/, ''); // 截取lang前2位字符
        localStorage.setItem('apiotLanguage', currentLang);
      }
    },
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
      // 标准单点登录
      await this.singleLoginSso();
      // }
      // await this.$store.dispatch('getHomeRoute');
      // const pathArr = window.location.pathname.split('/');
      // const pathName = pathArr[pathArr.length - 1];
      const { name } = this.$route;
      // console.log(pathName, JSON.stringify(pathArr), this.$route);
      if (!whitePathName.includes(name)) {
        await this.$store.dispatch('getHomeRoute');
      }
      // 单点登录逻辑
      if (+this.configs.ssoTypePc === 2) {
        await this.ssoZheZhengDing();
      }
      // 浙政钉地址
      const url = `${this.zzdConfig.qrCodeUrl}?response_type=code&client_id=${this.zzdConfig.clientId}&redirect_uri=${this.zzdConfig.redirectUri}&scope=get_user_info&authType=QRCODE&embedMode=true`;
      this.$store.commit('setZzdScan', url);
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
  },
  watch: {
    $route(v) {
      if (v.name === 'login') {
        this.removeDialog();
      }
    }
  }
};
</script>

<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  //min-width: 1024px;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
