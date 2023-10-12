<!--
 * @Descripttion: 扫码登录
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:43:43
-->
<template>
  <!-- 1=无 2=APP扫码 3=钉钉扫码登录 4=微信扫码登录 5=浙政钉扫码 -->
  <div class="loginScan">
    <section class="loginScan__area">
      <div class="loginScan__area--title">
        <!-- 浙政钉icon图标 -->
        <i v-show="scanType === 5" class="iconfont icon-zhezhengding"></i>
        <i v-show="scanType === 3" class="iconfont icon-dingding"></i>
        {{
          scanType === 1 || scanType === 2
            ? $t('login.securityScanCodeLogin')
            : scanType === 3
            ? '钉钉扫码登录'
            : scanType === 4
            ? '微信扫码登录'
            : '浙政钉扫码登录'
        }}
      </div>
      <div class="loginScan__border" v-loading="loading">
        <img
          v-if="scanType === 2"
          class="loginScan__area--img"
          src="@/assets/img/androidCode.png"
        />
        <iframe
          ref="Iframe"
          v-if="scanType === 5 && isSwitch"
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
          {{
            scanType === 1 || scanType === 2
              ? 'APIoT APP'
              : scanType === 3
              ? '钉钉' + ' APP'
              : scanType === 4
              ? '微信' + ' APP'
              : '浙政钉' + ' APP'
          }}
        </span>
        {{ $t('login.scanCodeLogin') }}
      </div>
    </section>
    <sign-up :configs="configs"></sign-up>
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
    },
    configs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      isSwitch: true // 显示浙政钉
    };
  },
  components: {
    SignUp
  },
  mounted() {
    window.addEventListener('message', this.scanCode);
    this.loadingFun();
  },
  destroyed() {
    window.removeEventListener('message', this.scanCode);
  },
  computed: {
    zheSrc() {
      return this.$store.state.globalConfig.zzdScan;
    },
    // // 扫码类型
    scanTypeArr() {
      return this.$store.getters.getCurDict('SCAN_TYPE');
    }
  },
  watch: {},
  methods: {
    loadingFun() {
      this.loading = true;
      const iframe = this.$refs.Iframe;
      if (iframe) {
        iframe.onload = () => {
          this.loading = false;
        };
      } else {
        this.loading = false;
      }
    },
    async scanCode(e) {
      const code = e.data && e.data.code;
      if (code) {
        try {
          await zwdingtalkScanLogin({
            code
          });
          this.$nextTick(async () => {
            await this.$store.dispatch('getHomeRoute');
            await this.$store.dispatch('getRoute');
            sessionStorage.removeItem('navTabArr');
            sessionStorage.removeItem('delTabArr');

            const { homeArr } = this.$store.state.base;
            if (sessionStorage.shareUrl) {
              await this.$router.push(sessionStorage.shareUrl);
              sessionStorage.shareUrl = '';
            } else if (homeArr.length) {
              const current = homeArr[0];
              this.$router.push(`/homePage/${current.homePageId}`);
            } else {
              this.$router.push('/home');
            }
          });
        } catch (error) {
          if (error.code === 'DD002') {
            localStorage.setItem('zhezhengdingCode', code);
            window.vue.$router.push('/AssociatedUser');
            this.$message({
              type: 'warning',
              message: error.message
            });
          } else {
            this.isSwitch = false;
            this.$nextTick(() => {
              this.isSwitch = true;
            });
          }
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
    margin-bottom: 13px;
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
        top: -97px;
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
        color: $loginThemeColor;
        margin-right: 6px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
