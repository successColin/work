<!--
 * @Descripttion: 登录Form
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 11:03:50
-->
<template>
  <el-form
    class="loginForm"
    ref="ruleForm"
    :model="ruleForm"
    :rules="rules"
    :show-message="false"
    @validate="validateFun"
  >
    <!-- 空margin-top：40 -->
    <div class="loginForm__empty" v-if="!errorTitle"></div>
    <!-- 提示框 -->
    <div class="loginForm__prompt" v-else>
      <el-alert :title="errorTitle" type="error" :closable="false"></el-alert>
    </div>
    <!-- 账号 -->
    <div class="loginForm__label">{{ $t('login.account') }}</div>
    <el-form-item prop="username">
      <apiot-input
        class="loginForm__inputBox"
        :placeholder="$t('placeholder.pleaseEnterYourAccountPhone')"
        v-model="ruleForm.username"
      ></apiot-input>
    </el-form-item>
    <!-- 密码 -->
    <div class="loginForm__label loginForm--setTop">
      {{ $t('login.password') }}
    </div>
    <el-form-item prop="password">
      <input-password
        class="loginForm__inputBox"
        :placeholder="$t('placeholder.PleaseEnterThePassword')"
        v-model="ruleForm.password"
      >
      </input-password>
    </el-form-item>
    <!-- 验证码:errorFun="validationErrorFun" -->
    <div v-if="isShowValidation">
      <div class="loginForm__label loginForm--setTop">
        {{ $t('login.validation') }}
      </div>
      <el-form-item>
        <slider-validation
          class="loginForm__inputBox"
          :successText="$t('login.verifiedSuccessfully')"
          :startText="$t('login.dragTheSliderToTheFarRight')"
          :successFun="validationSuccessFun"
        ></slider-validation>
      </el-form-item>
    </div>
    <!-- 记住密码 -->
    <div class="loginForm__pswdLine">
      <div class="loginForm__pswdLine--keep">
        <apiot-checkbox v-model="ruleForm.rememberMe" class="loginFontHover">
          <span class="loginForm__pswdLine--title">
            {{ $t('login.rememberPassword') }}
          </span>
        </apiot-checkbox>
      </div>
      <div
        class="loginForm__pswdLine--forget loginFontHover"
        @click="handleJump"
        v-if="configs.enableForgetPassword === '1'"
      >
        {{ $t('login.forgotPassword') }}
      </div>
    </div>
    <!-- button -->
    <div
      class="loginForm__loginButton"
      :class="{ 'login__button--animation': !isBtnDisabled }"
    >
      <apiot-button
        type="primary"
        class="loginForm__loginButton--btn"
        :disabled="isBtnDisabled"
        :isFull="true"
        :loading="loadingButton"
        @click.prevent="handleSubmit('ruleForm')"
      >
        {{ $t('login.login') }}
      </apiot-button>
      <div v-if="isBtnDisabled" class="maskLayer"></div>
    </div>
    <!-- 注册 -->
    <sign-up v-if="configs.enableRegistration === '1'"></sign-up>
  </el-form>
</template>
<script>
import { postLoginForm } from '@/api/login.js';
import { Encrypt, Decrypt } from '@/utils/utils';
import SliderValidation from '../SliderValidation';
import SignUp from '../SignUp';

export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      errorCount: 0, // 登录失败次数
      // 是否显示验证码
      isShowValidation: false,
      // 记住密码
      checked: false,
      // 按钮状态
      isBtnDisabled: true,
      // 错误提示的文案
      errorTitle: '',
      // 表单参数
      ruleForm: {
        username: '', // 账号
        password: '', // 密码
        rememberMe: false // 记住密码
      },
      // 校验状态
      valiState: {
        username: false, // 账号
        password: false, // 密码
        validation: false // 滑条
      },
      // 是否显示button loading
      loadingButton: false
    };
  },
  computed: {
    // 校验规则
    rules() {
      return {
        username: [
          {
            required: true,
            message: this.$t('login.helloPleaseEnterYourAccountPhoneNumber'),
            trigger: 'change'
          }
        ],
        password: [
          {
            required: true,
            message: this.$t('login.helloPleaseEnterThePassword'),
            trigger: 'change'
          }
        ]
      };
    }
  },
  components: {
    SliderValidation, // 拖动验证
    SignUp // 注册组件
  },
  mounted() {
    if (this.isShowValidation) {
      this.valiState.validation = false;
    }
    const isChecked = localStorage.getItem('checked') || '0';
    // 如果 isChecked=1：账号密码加密；为0：账号密码清空
    if (isChecked === '1') {
      const username = Decrypt(localStorage.getItem('username'));
      const password = Decrypt(localStorage.getItem('password'));
      this.ruleForm.username = username;
      this.ruleForm.password = password;
      this.ruleForm.rememberMe = true;
    } else {
      this.ruleForm.username = '';
      this.ruleForm.password = '';
      this.ruleForm.rememberMe = false;
    }
    this.$nextTick(() => {
      this.$refs.ruleForm.clearValidate();
      this.errorTitle = '';
    });
    this.$bus.$on('changeLange', () => {
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
        this.errorTitle = '';
      });
    });
  },
  watch: {
    configs: {
      immediate: true,
      deep: true,
      handler(newValue) {
        const { sliderErrorsCount } = newValue;
        if (sliderErrorsCount === '1') {
          this.isShowValidation = true;
          this.isBtnDisabled = true;
        }
        if (sliderErrorsCount === '2') {
          this.isShowValidation = false;
          this.isBtnDisabled = false;
        }
        if (sliderErrorsCount === '3') {
          this.isShowValidation = false;
          this.isBtnDisabled = false;
        }
      }
    }
  },
  methods: {
    // 跳转忘记密码
    handleJump() {
      this.$router.push('/forgotpswd');
    },
    // 拖动验证校验成功
    validationSuccessFun() {
      this.validateFun('validation', true);
    },
    // 点击按钮触发
    handleSubmit(formName) {
      // 表单验证
      this.$nextTick(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postLoginFormFun();
          } else {
            return false;
          }
        });
      });
    },
    async postLoginFormFun() {
      this.valiState.validation = false;
      try {
        this.loadingButton = true;
        // 登录接口
        const params = {
          ...this.ruleForm,
          password: Encrypt(this.ruleForm.password)
        };
        await postLoginForm(params);
        this.$store.dispatch('getRoute');
        if (this.ruleForm.rememberMe) {
          localStorage.setItem('checked', 1);
          localStorage.setItem('username', Encrypt(this.ruleForm.username));
          localStorage.setItem('password', params.password);
        } else {
          localStorage.setItem('checked', 0);
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
        // 登录成功
        this.$nextTick(() => {
          this.$router.push('/home');
          sessionStorage.removeItem('navTabArr');
          sessionStorage.removeItem('delTabArr');
        });
      } catch (error) {
        this.errorTitle = error.message;
        this.isBtnDisabled = true;
        this.loadingButton = false;
        const { sliderErrorsCount } = this.configs;
        // 移除组件
        this.isShowValidation = false;
        if (sliderErrorsCount === '3') {
          this.errorCount += 1;
          this.isBtnDisabled = false;
          if (this.errorCount >= 3) {
            this.$nextTick(() => {
              this.isShowValidation = true;
            });
            this.isBtnDisabled = true;
          }
        } else if (sliderErrorsCount === '2') {
          this.isBtnDisabled = false;
        } else {
          this.$nextTick(() => {
            this.isShowValidation = true;
            this.isBtnDisabled = true;
          });
        }
      }
    },
    // 校验方法
    validateFun(type, state, error) {
      this.errorTitle = error;
      this.valiState[type] = state;
      try {
        const { sliderErrorsCount } = this.configs;
        Object.keys(this.valiState).forEach((key) => {
          // eslint-disable-next-line no-empty
          if (sliderErrorsCount === '2' && key === 'validation' && !this.valiState[key]) {
          } else if (
            sliderErrorsCount === '3' &&
            key === 'validation' &&
            !this.valiState[key] &&
            this.errorCount < 3
            // eslint-disable-next-line no-empty
          ) {
          } else {
            // console.log('');
            // eslint-disable-next-line no-lonely-if
            if (!this.valiState[key]) throw Error('error');
          }
        });
      } catch (e) {
        this.isBtnDisabled = true;
        return;
      }
      this.isBtnDisabled = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.loginForm {
  // 空
  &__empty {
    margin-top: $remto40px;
  }
  // 提示
  &__prompt {
    margin: $remto12px 0 $remto20px 0;
  }
  // 账号, 密码
  &__label {
    font-size: $remto16px;
  }
  &--setTop {
    margin-top: $remto14px;
  }
  // 输入框
  &__inputBox {
    margin-top: $remto8px;
  }
  // 记住密码
  &__pswdLine {
    margin-top: $remto14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .loginForm__pswdLine--title {
      position: relative;
      left: -$remto2px;
    }
    &--forget {
      font-size: $remto13px;
    }
  }
  // 登录按钮
  &__loginButton {
    margin: $remto30px 0 $remto14px 0;
    position: relative;
    &--btn {
      height: $remto40px;
      font-size: $remto16px;
      font-family: PingFangSC-Medium, PingFang SC !important;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 1.6px;
    }
    .maskLayer {
      position: absolute;
      width: 100%;
      height: $remto40px;
      top: 0;
      cursor: not-allowed;
    }
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
  ::v-deep {
    .el-alert {
      height: $remto40px;
      border: $remto1px solid rgba(255, 77, 79, 0.5);
      .el-alert__content {
        padding: 0;
      }
      .el-alert__title {
        font-size: $remto13px;
        line-height: $remto18px;
      }
    }
    .el-input__inner {
      height: $remto40px !important;
      line-height: $remto40px !important;
    }
    .el-input {
      font-size: $remto13px;
    }
    .el-checkbox,
    .el-checkbox__label {
      font-size: $remto13px;
      color: #333;
    }
    .el-checkbox__inner {
      width: $remto13px;
      height: $remto13px;
    }
    .el-checkbox__label {
      padding-left: $remto10px;
    }
  }
}
.login__button--animation {
  width: 100%;
  position: relative;
  overflow: hidden;
  background: $--color-primary;
  border-radius: $remto4px;
  ::v-deep {
    .el-button {
      position: relative;
      z-index: 2;
      transition: all 0.4s;
      border: none;
      &:focus {
        background: #377bea;
      }
      &:hover {
        background: transparent;
      }
    }
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0%;
    top: 0%;
    transform-origin: center center;
    transform: scale(0, 1);
    transition: all 0.6s;
    z-index: 1;
  }
  &:hover {
    &::after {
      transform: scale(1, 1);
      background: #2c74e9;
    }
  }
}
</style>
