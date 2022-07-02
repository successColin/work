<!--
 * @Descripttion: 扫码登录
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:43:43
-->
<template>
  <!-- 1=无 2=APP扫码 3=浙政钉扫码 -->
  <div class="loginScan">
    <section class="loginScan__area">
      <div class="loginScan__area--title">
        <!-- 浙政钉icon图标 -->
        <i
          v-show="scanType === zheZhengDingScan"
          class="iconfont icon-tongguo"
        ></i>
        {{
          scanType === appScan
            ? $t('login.securityScanCodeLogin')
            : '浙政钉扫码登录'
        }}
      </div>
      <div class="loginScan__border">
        <img
          v-if="scanType === appScan"
          class="loginScan__area--img"
          src="@/assets/img/androidCode.png"
        />
        <iframe
          v-else-if="zheZhengDingScan"
          :src="zheSrc"
          :frameBorder="0"
          width="210"
          height="280"
          scrolling="no"
        />
      </div>
      <div class="loginScan__dec">
        <i class="iconfont icon-saoma"></i>
        {{ $t('login.pleaseUse') }}
        <span style="color: #333333; padding: 0 6px" class="fontHover">
          {{ scanType === appScan ? 'APIoT APP' : '浙政钉 APP' }}
        </span>
        {{ $t('login.scanCodeLogin') }}
      </div>
    </section>
    <sign-up :isScan="true"></sign-up>
  </div>
</template>

<script>
import { zwdingtalkScanLogin } from '@/api/login.js';
import SignUp from '../SignUp';

export default {
  // 2app扫码   3浙政钉
  props: {
    scanType: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      appScan: 2,
      zheZhengDingScan: 3,
      zheSrc: `https://login.dg-work.cn/qrlogin/webAppLogin.htm?APP_NAME=apiotV10_dingoa&protocolKey=0eac8d40-ceef-4f6d-ad03-213bffff9d99&protocol=oauth2&BACK_URL=${window.location.href}&embedMode=true&scope=get_user_info&state=`
    };
  },
  components: {
    SignUp
  },
  mounted() {
    window.addEventListener('message', this.scanCode);
  },
  destroyed() {
    window.removeEventListener('message', this.scanCode);
  },
  computed: {},
  watch: {},
  methods: {
    async scanCode(e) {
      const code = e.data && e.data.code;
      console.log(code);
      if (code) {
        try {
          await zwdingtalkScanLogin({
            code
          });
          this.$nextTick(() => {
            this.$router.push('/home');
            sessionStorage.removeItem('navTabArr');
            sessionStorage.removeItem('delTabArr');
          });
        } catch (error) {
          localStorage.setItem('zhezhengdingCode', code);
          window.vue.$router.push('/AssociatedUser');
        }
      }
    }
  }
};
</script>
<style lang='scss' scoped>
//@import url(); 引入公共css类
.loginScan {
  margin-top: 18px;
  width: 100%;
  &__area {
    min-height: 282px;
    // height: calc(75vw / 10 * 3 - 30px);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid #e9e9e9;
    margin-bottom: 18px;
    box-sizing: border-box;
    &--title {
      flex: 1;
      font-size: 16px;
      color: #333333;
      display: flex;
      align-items: center;
      .iconfont {
        color: #4689f5;
        margin-right: 5px;
      }
    }
    .loginScan__border {
      // flex: 1;
      width: 150px;
      height: 150px;
      padding: 5px;
      border: 1px solid #e9e9e9;
      overflow: hidden;
      .loginScan__area--img {
        background-size: cover;
        width: 100%;
      }
      iframe {
        position: relative;
        top: -107px;
        left: -30px;
        transform: scale(0.9);
      }
    }
    .loginScan__dec {
      flex: 1;
      font-size: 13px;
      color: #808080;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 18px;
        color: #4689f5;
        margin-right: 6px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
