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
    <div class="loginForm__empty"></div>
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
    <div class="loginForm__pswdLine" v-if="!isAssociated">
      <div class="loginForm__pswdLine--keep">
        <apiot-checkbox v-model="ruleForm.rememberMe" class="loginFontHover">
          <span class="loginForm__pswdLine--title">
            {{ $t('login.rememberPassword') }}
          </span>
        </apiot-checkbox>
      </div>
      <div class="loginForm__pswdLine--forget">
        <div
          class="loginFontHover"
          @click="handleJump"
          v-if="configs && configs.enableForgetPassword === '1'"
        >
          {{ $t('login.forgotPassword') }}
        </div>
        <div
          class="loginForm__pswdLine--forget--line"
          v-if="
            configs &&
            configs.enableForgetPassword === '1' &&
            configs &&
            configs.enableRegistration === '1'
          "
        ></div>
        <span
          class="loginFontHover"
          @click="handleJumpRegister"
          v-if="configs && configs.enableRegistration === '1'"
        >
          {{ $t('login.signUpNow') }}
        </span>
      </div>
    </div>
    <!-- button -->
    <div
      class="loginForm__loginButton"
      :class="{ 'login__button--animation': !isBtnDisabled }"
      v-if="!isAssociated"
    >
      <apiot-button
        type="primary"
        class="loginForm__loginButton--btn"
        :disabled="isBtnDisabled"
        :isFull="true"
        :loading="loadingButton"
        @click.prevent="handleSubmit"
      >
        {{ $t('login.login') }}
      </apiot-button>
      <div v-if="isBtnDisabled" class="maskLayer"></div>
    </div>
    <!-- 注册 -->
    <!-- <sign-up v-if="configs.enableRegistration === '1'"></sign-up> -->
    <apiot-dialog
      :visible.sync="showUpdateDialog"
      title="修改密码"
      :append-to-body="true"
      @sure-click="sureClick"
      @cancle-click="cancle"
    >
      <AccountSecurity
        ref="AccountSecurity"
        :isFromLogin="true"
        v-if="showUpdateDialog"
      ></AccountSecurity>
    </apiot-dialog>
  </el-form>
</template>
<script>
import { postLoginForm, exchangeTokenLogin } from '@/api/login.js';
import { Encrypt, Decrypt } from '@/utils/utils';
import SliderValidation from '../SliderValidation';
import AccountSecurity from '../../../UserCenter/components/UserCenterTabs/components/AccountSecurity';
// import SignUp from '../SignUp';

export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    },
    isAssociated: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {},
      errorCount: 0, // 登录失败次数
      // 是否显示验证码
      isShowValidation: false,
      // 记住密码
      checked: false,
      // 按钮状态
      isBtnDisabled: true,
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
      loadingButton: false,
      // 这不能用 computed rules
      rules: {
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
      },
      showUpdateDialog: false // 修改密码弹窗
    };
  },
  computed: {
    // 校验规则
    // rules() {
    //   return {
    //     username: [
    //       {
    //         required: true,
    //         message: this.$t('login.helloPleaseEnterYourAccountPhoneNumber'),
    //         trigger: 'change'
    //       }
    //     ],
    //     password: [
    //       {
    //         required: true,
    //         message: this.$t('login.helloPleaseEnterThePassword'),
    //         trigger: 'change'
    //       }
    //     ]
    //   };
    // }
  },
  components: {
    SliderValidation, // 拖动验证
    AccountSecurity
    // SignUp // 注册组件
  },
  beforeDestroy() {
    // this.$bus.$off('changeLange');
    this.$bus.$off('handleAssociatedUser');
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
    // this.$nextTick(() => {
    //   if (this.$refs.ruleForm) {
    //     this.$refs.ruleForm.clearValidate();
    //   }
    // });
    // this.$bus.$on('changeLange', () => {
    //   this.$nextTick(() => {
    //     this.$refs.ruleForm.clearValidate();
    //   });
    // });
    this.$bus.$on('handleAssociatedUser', () => {
      this.handleSubmit();
    });
  },
  watch: {
    configs: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue) {
          const { sliderErrorsCount } = newValue;
          if (sliderErrorsCount === '1') {
            this.isShowValidation = true;
          }
          if (sliderErrorsCount === '2') {
            this.isShowValidation = false;
          }
          if (sliderErrorsCount === '3') {
            this.isShowValidation = false;
          }
        }
      }
    }
  },
  methods: {
    handleJumpRegister() {
      this.$router.push('/register');
    },
    // 跳转忘记密码
    handleJump() {
      this.$router.push('/forgotpswd');
    },
    // 拖动验证校验成功
    validationSuccessFun() {
      this.validateFun('validation', true);
    },
    // 点击按钮触发
    handleSubmit() {
      // 表单验证
      this.$nextTick(() => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.postLoginFormFun();
          } else {
            return false;
          }
        });
      });
    },
    async successFun(res) {
      await this.$store.dispatch('getRoute');
      await this.$store.dispatch('getHomeRoute');
      localStorage.setItem('deploymentMode', res.deploymentMode);
      if (this.ruleForm.rememberMe) {
        localStorage.setItem('checked', 1);
        localStorage.setItem('username', Encrypt(this.ruleForm.username));
        localStorage.setItem('password', this.params.password);
      } else {
        localStorage.setItem('checked', 0);
        localStorage.removeItem('username');
        localStorage.removeItem('password');
      }
      await this.$store.dispatch(
        'fetchConfigFuns',
        'THEME_AND_LOGO,THIRD_LINKS,MESSAGE_CONFIG,UREPORT_URL,FILE_SERVER,WATER_MASK'
      );
      // 登录成功
      this.$nextTick(async () => {
        this.loadingButton = false;

        sessionStorage.removeItem('navTabArr');
        sessionStorage.removeItem('delTabArr');
        const { homeArr } = this.$store.state.base;
        if (sessionStorage.shareUrl) {
          this.$router.push(sessionStorage.shareUrl);
          sessionStorage.shareUrl = '';
        } else if (homeArr.length) {
          const current = homeArr[0];
          this.$router.push(`/homePage/${current.homePageId}`);
        } else {
          this.$router.push('/home');
        }
      });
    },
    async postLoginFormFun() {
      this.valiState.validation = false;
      try {
        this.loadingButton = true;
        // 登录接口
        this.params = {};
        this.params = {
          ...this.ruleForm,
          password: Encrypt(this.ruleForm.password),
          enableLoginFirstPc: this.$store.state.base.loginConfig.enableLoginFirstPc
        };
        if (this.isAssociated) {
          const code = localStorage.getItem('zhezhengdingCode');
          this.params.zwddBindCode = code;
        }
        const res = await postLoginForm(this.params);
        this.successFun(res);
      } catch (err) {
        this.loadingButton = false;
        const { data, code, message } = err;

        console.log(data, err);
        if (code === 'SS002') {
          await this.$confirm(`${message}`, '账户登录提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async (v) => {
            console.log(v);
            const res = await exchangeTokenLogin({ exchangeToken: data });
            this.successFun(res);
          });
        } else if (!data) {
          this.$message.error(err.message);
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
        } else {
          // 0:跳过校验;1:密码失效重置;2:密码失效不允许登录;3:首次登录
          switch (data.state) {
            case '1':
              try {
                await this.$confirm(
                  `您的账号${this.ruleForm.username}密码已到有效期，请修改密码！`,
                  '账户安全提示',
                  {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                );
                this.showUpdateDialog = true;
              } catch (error) {
                localStorage.token = '';
              }

              break;
            case '2':
              await this.$alert(
                `您的账号${this.ruleForm.username}密码已到有效期，请联系管理员！`,
                '账户安全提示',
                {
                  confirmButtonText: '确定'
                }
              );
              localStorage.token = '';
              break;
            case '3':
              try {
                await this.$confirm(
                  `您的账号${this.ruleForm.username}首次，请修改密码！`,
                  '账户安全提示',
                  {
                    dangerouslyUseHTMLString: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }
                );
                this.showUpdateDialog = true;
              } catch (error) {
                localStorage.token = '';
              }

              break;
            case '0':
            default: {
              sessionStorage.removeItem('navTabArr');
              sessionStorage.removeItem('delTabArr');
              const { homeArr } = this.$store.state.base;
              if (sessionStorage.shareUrl) {
                this.$router.push(sessionStorage.shareUrl);
                sessionStorage.shareUrl = '';
              } else if (homeArr.length) {
                const current = homeArr[0];
                this.$router.push(`/homePage/${current.homePageId}`);
              } else {
                this.$router.push('/home');
              }
            }
          }
        }
      }
    },
    // 修改密码弹窗确认
    async sureClick() {
      await this.$refs.AccountSecurity.sureClick();
      this.showUpdateDialog = false;
      this.$message({
        type: 'success',
        message: '修改成功'
      });
    },
    cancle() {
      localStorage.token = '';
    },
    // 校验方法
    validateFun(type, state, error) {
      if (error) {
        this.$message.error(error);
      }
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
    margin-top: 44px;
  }
  // 提示
  &__prompt {
    margin: 12px 0 20px 0;
  }
  // 账号, 密码
  &__label {
    font-size: 16px;
  }
  &--setTop {
    margin-top: 14px;
  }
  // 输入框
  &__inputBox {
    margin-top: 8px;
  }
  // 记住密码
  &__pswdLine {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .loginForm__pswdLine--title {
      position: relative;
      left: -2px;
    }
    &--forget {
      font-size: 13px;
      display: flex;
      &--line {
        width: 1px;
        height: 13px;
        background: #e9e9e9;
        margin: 0 10px 0 7px;
      }
    }
  }
  // 登录按钮
  &__loginButton {
    margin: 30px 0 14px 0;
    position: relative;
    &--btn {
      height: 40px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC !important;
      font-weight: 600;
      color: #ffffff;
      letter-spacing: 1.6px;
    }
    .maskLayer {
      position: absolute;
      width: 100%;
      height: 40px;
      top: 0;
      cursor: not-allowed;
    }
  }
  .el-form-item {
    margin-bottom: 0 !important;
  }
  ::v-deep {
    .el-alert {
      height: 40px;
      border: 1px solid rgba(255, 77, 79, 0.5);
      .el-alert__content {
        padding: 0;
      }
      .el-alert__title {
        font-size: 13px;
        line-height: 18px;
      }
    }
    .el-input__inner {
      height: 40px !important;
      line-height: 40px !important;
    }
    .el-input {
      font-size: 13px;
    }
    .el-checkbox,
    .el-checkbox__label {
      font-size: 13px;
      color: #333;
    }
    // .el-checkbox__inner {
    //   width: 16px;
    //   height: 16px;
    // }
    // .el-checkbox__inner::after {
    //   height: 9px;
    //   left: 5px;
    //   width: 4px;
    // }
    .el-checkbox__label {
      padding-left: 10px;
    }
  }
}
.login__button--animation {
  width: 100%;
  position: relative;
  overflow: hidden;
  background: $loginThemeLighten;
  border-radius: 4px;
  ::v-deep {
    .el-button {
      position: relative;
      z-index: 2;
      transition: all 0.4s;
      border: none;
      &:focus {
        background: $loginThemeLighten;
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
      background: $loginThemeColor;
    }
  }
}
</style>
