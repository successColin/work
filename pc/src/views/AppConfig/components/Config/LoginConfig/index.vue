<template>
  <section class="loginConfig config">
    <div class="config__header">登录配置</div>
    <div class="config__body">
      <h2 class="config__body--head">上传背景图</h2>
      <app-upload
        :fileUrl.sync="loginConfig.backgroundUrl"
        fileAccept=".png, .jpg,.jpeg, .gif,.svg"
      ></app-upload>
      <div class="config__body--tip">
        建议：尺寸750×480px，png、jpg格式，3M以内
      </div>
      <h2 class="config__body--head">上传logo</h2>
      <app-upload
        :fileUrl.sync="loginConfig.logoUrl"
        fileAccept=".png, .jpg,.jpeg, .gif,.svg"
      ></app-upload>
      <h2 class="config__body--head">上传登录注册协议</h2>
      <app-upload
        :fileUrl.sync="loginConfig.servicePrivacyUrl"
        :fileLimit="10"
        fileAccept=".pdf"
      ></app-upload>
      <p class="config__body--switch m-t-12">
        是否开启注册
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.enableRegister"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否启用微信登录
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.enableWechatLogin"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否启用钉钉登录
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.enableDingLogin"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否启用忘记密码
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.enableForgetPassword"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否需要每次登录
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.enableDefaultLogin"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否开启多语言
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.enableLanguage"
        >
        </el-switch>
      </p>
      <p class="config__body--switch">
        是否进入信息维护页
        <el-switch
          class="switch"
          active-text="是"
          inactive-text="否"
          :active-value="1"
          :inactive-value="0"
          v-model="loginConfig.defaultPage"
        >
        </el-switch>
      </p>
    </div>
    <div class="config__footer">
      <apiot-button type="primary" @click="saveLogin">确定</apiot-button>
    </div>
  </section>
</template>

<script>
import { saveSysAppLoginConfig, getAppLoginPage } from '@/api/appConfig';
import AppUpload from '../AppUpload';

export default {
  props: {
    loginConfig: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {
    AppUpload
  },

  computed: {},

  mounted() {
    // console.log(24234);
    // this.getAppLoginPage();
  },

  methods: {
    async saveLogin(flag = true) {
      await saveSysAppLoginConfig(this.loginConfig);
      if (flag) {
        this.$message({
          type: 'success',
          message: '保存成功'
        });
      }
    },
    async getAppLoginPage() {
      const data = await getAppLoginPage();
      // console.log(data);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
</style>
