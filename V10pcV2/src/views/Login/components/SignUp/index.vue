<!--
 * @Descripttion: 登录主页，下方注册和app下载
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:47:06
-->
<template>
  <div class="signUp">
    <!-- app 下载弹出框 -->
    <div class="signUp__download" v-if="+configs.enableAPPDownload === 1">
      <div class="signUp__downTitle">
        {{ $t('login.downloadAPP') }}
      </div>
      <el-popover placement="bottom" trigger="click">
        <vue-qr :text="androidCode" :size="150" :margin="0"></vue-qr>
        <div slot="reference" class="signUp__download--anzhuo">
          <i class="iconfont icon-anzhuo"></i>
        </div>
      </el-popover>
      <el-popover placement="bottom" trigger="click">
        <vue-qr :text="iosCode" :size="150" :margin="0"></vue-qr>
        <div slot="reference" class="signUp__download--IOS">
          <i class="iconfont icon-IOS"></i>
        </div>
      </el-popover>
    </div>
    <div></div>
    <!-- 还没有账号？立即注册 -->
    <!-- <div
      class="signUp__jump"
      v-if="+configs.enableRegistration === 1 && isShowRegister"
    >
      <span>{{ $t('login.noAccountYet') }}</span>
      <span class="signUp__jump--btn loginFontHover" @click="handleJump">
        {{ $t('login.signUpNow') }}
      </span>
    </div> -->
    <div class="signUp__allQr" v-if="+configs.enableDownQr === 1">
      <el-popover placement="bottom" trigger="click">
        <vue-qr :text="qrcodeUrl" :size="150" :margin="0"></vue-qr>
        <div slot="reference" class="signUp__allQr--text">环境二维码</div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { getAppDownloadUrl, getAppConfig } from '@/api/login.js';
import vueQr from 'vue-qr';

export default {
  props: {
    configs: {
      type: Object,
      default: () => {},
    },
    isShowRegister: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      androidCode: '',
      iosCode: '',
      formData: {
        production: '',
        testExtranet: '',
        testIntranet: '',
        productionHttp: 'http://',
        testExtranetHttp: 'http://',
        testIntranetHttp: 'http://',
      },
    };
  },
  methods: {
    handleJump() {
      this.$router.push('/register');
    },
    // 获取 下载路径
    async getUrl() {
      const res = await getAppDownloadUrl();
      if (res) {
        const { androidDownloadUrl, iosDownloadUrl } = res;
        this.androidCode = androidDownloadUrl;
        this.iosCode = iosDownloadUrl;
      }
    },
    async getAppConfig() {
      if (+this.configs.enableDownQr === 1) {
        const res = await getAppConfig();
        this.formData = { ...this.formData, ...res.parameterJson };
      }
    },
  },
  components: { vueQr },
  mounted() {
    this.getUrl();
    this.getAppConfig();
  },
  computed: {
    production() {
      const { production: url, productionHttp: http } = this.formData;

      if (!url) return '';
      return { production: `${http || 'http://'}${url}` };
    },
    testExtranet() {
      const { testExtranet: url, testExtranetHttp: http } = this.formData;

      if (!url) return '';
      return { testExtranet: `${http || 'http://'}${url}` };
    },
    testIntranet() {
      const { testIntranet: url, testIntranetHttp: http } = this.formData;

      if (!url) return '';
      return { testIntranet: `${http || 'http://'}${url}` };
    },
    allServe() {
      const { production, testExtranet, testIntranet } = this;
      if (!production && !testExtranet && !testIntranet) return '';
      const serve = {
        ...production,
        ...testExtranet,
        ...testIntranet,
      };
      return serve;
    },
    qrcodeUrl() {
      return `APIoT_STATIC_SERVERURL${JSON.stringify(
        this.allServe,
      )}SERVERURL_END`;
    },
  },
};
</script>
<style lang="scss" scoped>
.signUp {
  width: 100%;
  display: flex;
  justify-content: space-between;
  &__jump {
    font-size: 13px;
  }
  &__jump--btn {
    // 立即注册按钮
    color: $loginThemeColor;
  }
  // &__jump--btn:hover {
  //   color: darken($loginThemeColor, 90%);
  // }
  &__download {
    &--anzhuo,
    &--IOS {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        color: #fff;
      }
    }
    &--anzhuo {
      background: #4689f5;
      margin-left: 8px;
    }
    &--IOS {
      background: #34c7be;
      margin-left: 4px;
    }
  }
  &__download,
  &__jump {
    // margin-bottom: 30px;
    display: flex;
    align-items: center;
  }
  &__allQr {
    font-size: 13px;
  }
  &__downTitle {
    font-size: 13px;
    text-decoration: none;
    // color: $--color-primary;
  }
  :focus {
    outline: 0;
  }
}
</style>
