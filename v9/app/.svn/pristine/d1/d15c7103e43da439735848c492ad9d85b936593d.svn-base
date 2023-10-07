<!--
 * @Author: sss
 * @Date: 2021-10-16 17:12:06
 * @Last Modified by: sss
 * @Last Modified time: 2021-10-16 17:12:06
 * @Desc: 登录界面
-->
<template>
  <view class="loginMenu">
    <header class="loginMenu__header" v-if="!isAssociatedUser">
      <image
        class="loginMenu__header--icon"
        mode="heightFix"
        :src="appLoginLogo || logo"
      ></image>
      <p class="loginMenu__header--title">
        Hi，欢迎登录{{ technicalSupport || 'APIoT' }}！
      </p>
      <p v-if="!technicalSupport" class="loginMenu__header--subTitle">
        <span :style="{ color: themeColorCode }">i4.0</span>SOLUTIONS
      </p>
    </header>
    <div class="loginMenu__center">
      <view class="loginMenu__center--item">
        <m-input-lable
          :element="userElemnt"
          ref="username"
          sourceType="form"
          :value="formData.username"
          @changeValue="changeValue"
          :isLogin="isLogin"
        >
          <m-font-icon
            :color="themeColorCode"
            :iconSize="48"
            class="loginMenu__center--labelIcon"
            slot="labels"
            icon="zhanghao1"
          ></m-font-icon>
        </m-input-lable>
      </view>
      <view class="loginMenu__center--item">
        <m-input-lable
          :element="passworderElemnt"
          sourceType="form"
          ref="password"
          :value="formData.password"
          :showPassword="isShowPassword"
          @changeValue="changeValue"
          :isLogin="isLogin"
        >
          <m-font-icon
            :color="themeColorCode"
            class="loginMenu__center--labelIcon"
            slot="labels"
            icon="mima1"
            :iconSize="48"
          ></m-font-icon>
          <m-font-icon
            slot="btns"
            :icon="passwordIcon"
            @click="showPassword"
            :iconSize="42"
          ></m-font-icon>
        </m-input-lable>
      </view>
      <view
        class="loginMenu__center--remb"
        :class="{ remeber: remeber }"
        v-if="!isAssociatedUser"
      >
        <m-button
          :isFontBtn="true"
          @elementClick="rememberPassword"
          style="display: inline-block"
        >
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon icon="checkbox_app" :iconSize="28"></m-font-icon>
            <p class="loginMenu__center--rembTitle">
              {{ $t('user-remember') }}
            </p>
          </block>
        </m-button>
      </view>
    </div>
    <footer class="loginMenu__footer">
      <m-button
        class="loginMenu__footer--btn"
        ref="loginBtn"
        :disabled="disabled"
        :isLoading="isLoading"
        btnClass="mainColor"
        @elementClick="doLogin"
      >
        <m-font-icon
          class="loginMenu__footer--btnicon"
          slot="buttonIcon1"
          icon="jiantou1"
        >
          {{ $t('page-signIn') }}
        </m-font-icon>
      </m-button>
      <view class="loginMenu__footer--line" v-if="!isAssociatedUser">
        <view class="line"></view>
        <view class="name"
          >由
          <span @tap="selectServer" :style="{ color: themeColorCode }">{{
            technicalSupport || 'APIoT'
          }}</span>
          提供技术支持</view
        >
        <view class="line"></view>
      </view>
    </footer>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import mInputLable from '../../components/element/m-inputLable1.vue';
import { homeApi } from '@/common/request/api.js';
import EncryptionPSW from '@/static/js/encryptionPSW.js';

import logo from '@/static/images/apiotLogo.png';

const remberUser = uni.getStorageSync('loginMsg') || {};
export default {
  components: { mInputLable },

  props: {
    isAssociatedUser: {
      type: Boolean,
      defalut: false,
    },
    code: {
      type: String,
      defalut: '',
    },
  },

  data() {
    return {
      userElemnt: {
        label: this.$t('user-username'),
        visiabled: 1,
        labletPositon: 'top',
        name: 'username',
        placeholderText: this.$t('entry-username'),
      }, //中文："账号"
      passworderElemnt: {
        label: this.$t('user-password'),
        visiabled: 1,
        labletPositon: 'top',
        name: 'password',
        inputType: 'password',
        placeholderText: this.$t('entry-password'),
      }, //中文："密码"
      remeber: true, //默认记住密码
      formData: remberUser,
      PasswrodEncrypted: '0',
      disabled: true,
      isLoading: true,
      passwordIcon: 'iconmimayincang',
      isShowPassword: true,
      logo: logo,
      isLogin: true,
    };
  },

  computed: {
    ...mapState([
      'appLoginLogo',
      'technicalSupport',
      'themeColorCode',
      'PasswordLevel',
    ]),
    ...mapState(['formElementFocus']),
  },

  methods: {
    ...mapMutations(['SET_LOGIN_STATE', 'SET_SYSPARAMER']),
    showPassword() {
      //点击icon
      if (this.isShowPassword) {
        this.passwordIcon = 'iconmimaxianshi';
        this.isShowPassword = false;
      } else {
        this.passwordIcon = 'iconmimayincang';
        this.isShowPassword = true;
      }
    },
    changeValue(param) {
      this.formData[param.element.name] = param.value;
      if (this.formData.username && this.formData.password)
        this.disabled = false;
      else this.disabled = true;
    },
    //记住密码
    rememberPassword() {
      this.remeber = this.remeber ? false : true;
    },
    selectServer() {
      console.log('selectServer');
      uni.navigateTo({
        url: 'selectServer',
      });
    },
    //登录
    doLogin() {
      this.isLoading = true;
      this.disabled = true;
      setTimeout(() => {
        //是否校验通过

        const checkRes = this.Static_GlobalFucs.checkForm({
          rule: [
            {
              name: 'username',
              checkType: 'notnull',
              checkRule: '',
              label: `${this.userElemnt.label}`,
            }, //中文："用户不能为空"
            {
              name: 'password',
              checkType: 'notnull',
              checkRule: '',
              label: `${this.passworderElemnt.label}`,
            }, //中文："密码不能为空"
          ],
          data: this.formData,
        });
        if (!checkRes.isCheck) {
          this.Static_GlobalFucs.showToast({ title: checkRes.errorMsg });
          this.isLoading = false;
          this.disabled = false;
          return;
        }

        //是否需要记忆密码
        if (this.remeber) uni.setStorageSync('loginMsg', this.formData);
        else uni.removeStorageSync('loginMsg');

        let encyData = EncryptionPSW(this.formData, this.PasswrodEncrypted);
        encyData.language = this._i18n.locale; //记录语言
        if (this.isAssociatedUser) {
          encyData.zwddBindCode = this.code;
        }
        homeApi.getToken(this, encyData).finally(() => {
          this.isLoading = false;
          this.disabled = false;

          // 时间间隔
          // getDurationTime()
        });
      }, 50);
    },
    getSysParamer(params) {
      return homeApi.sysParamer(this, params);
    },
  },

  mounted() {
    let formData = uni.getStorageSync('loginMsg') || {};
    if (JSON.stringify(formData) !== '{}') {
      this.remeber = true;
    }
    console.log(this.PasswordLevel);
    //登录之前获取必要的系统参数
    this.getSysParamer('PasswrodEncrypted').then((res) => {
      this.PasswrodEncrypted = res.data; //设置密码是否加密

      this.isLoading = false;
      this.disabled = false;
    });
  },

  onLoad() {
    this.SET_LOGIN_STATE({});
  },
};
</script>

<style lang='scss' scoped>
.loginMenu {
  display: flex;
  flex-direction: column;
  padding: var(--status-bar-height) 75rpx 0 75rpx;
  width: 100%;
  background: #ffffff;
  font-family: PingFangSC-Regular, PingFang SC;
  &__header {
    flex-shrink: 0;
    margin: 150rpx 0 25rpx 20rpx;
    &--icon {
      height: 50rpx;
    }
    &--title {
      font-size: 46rpx;
      color: #444444;
      line-height: 65rpx;
    }
    &--subTitle {
      font-size: 30rpx;
      font-family: HelveticaNeue;
      color: #444444;
      line-height: 36rpx;
      letter-spacing: 1px;
    }
  }
  &__center {
    flex: 1;
    padding-top: 91rpx;
    &--item {
      margin-top: 49rpx;
      padding: 10rpx 35rpx;
      border-radius: 51rpx;
      border: 2rpx solid #e0e0e0;
      ::v-deep {
        .formElemets {
          position: relative;
          border-bottom: none;
        }
        .text {
          position: absolute;
          top: -30rpx;
          left: 35rpx;
          padding: 0 10rpx;
          background: #ffffff;
        }
        .hide {
          display: none;
        }
      }
    }
    &--remb {
      text-align: right;
      margin-top: 22rpx;
      color: #aaaaaa;
      &.remeber {
        color: #333333;
      }
    }
    &--rembTitle {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      line-height: 40rpx;
    }
  }
  &__footer {
    flex-shrink: 0;
    &--btn {
      margin: 0 auto;
      width: 340rpx;
      ::v-deep {
        .btn {
          border-radius: 50rpx;
          .iconfont::before {
            margin-right: 10rpx;
          }
        }
      }
    }
    &--line {
      margin: 80rpx 0 113rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: nowrap;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #666666;
      .line {
        flex-grow: 3;
        height: 1px;
        background: #ebebeb;
      }
      .name {
        flex-grow: 1;
        text-align: center;
      }
    }
  }
}
</style>
