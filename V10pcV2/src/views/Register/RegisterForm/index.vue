<!--
 * @Descripttion: 注册第一步：注册信息
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:24:31
-->
<template>
  <my-model :title="title" :timeLineList="timeLineList">
    <section class="register">
      <div style="width: 400px; margin: 0 auto; padding-bottom: 30px">
        <!-- 表单 -->
        <validation-form
          ref="elForm"
          :formConfig="formConfig"
          :value="ruleForm"
          :rules="rules"
          @giveObj="handleGetObj"
        ></validation-form>
        <!-- 《隐私服务条款》 -->
        <div class="register__checkbox">
          <apiot-checkbox v-model="termsCheck" @change="handleTermsCheck">
            <div class="register__checkbox--color">
              {{ $t('login.iHaveReadAndAgree') }}
            </div>
          </apiot-checkbox>
          <span class="register__checkbox--childColor fontHover">
            {{ $t('login.privacyTermsOfService') }}
          </span>
        </div>
        <!-- 注册按钮 -->
        <apiot-button
          class="register__btn"
          type="primary"
          :isFull="true"
          :disabled="isBtnDisabled"
          :loading="loadingButton"
          @click="handleRegister"
        >
          {{ $t('login.registered') }}
        </apiot-button>
      </div>
    </section>
  </my-model>
</template>

<script>
import { postDoMessageVerify, postRegister } from '@/api/login';
import { Encrypt } from '@/utils/utils';
import {
  phoneNumber,
  securityCheckFour,
  securityCheckThree,
  securityCheckTwo
} from '@/utils/validationRules';
import MyModel from '@/views/Login/components/RegisterForgot/MyModel';
import ValidationForm from '@/views/Login/components/ValidationForm'; // 表单验证

export default {
  data() {
    // 密码
    const password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.helloPleaseEnterANewPassword')));
      } else {
        const { length } = value;
        if (length < 8) {
          // 密码大于8位
          callback(
            new Error(this.$t('login.helloPasswordsMustBeLongerThan6DigitsAndLessThan18Digits'))
          );
        } else {
          this.pswdProhibitedContentArr.forEach((item) => {
            if (item && value.indexOf(item) !== -1) {
              callback(new Error(`不能包含${item}内容`));
            }
          });
          if (this.passwordStrengthVal === 0) {
            // 校验规则0的情况，只要校验长度即可
            callback();
          } else if (this.passwordStrengthVal === 1) {
            // 校验规则1的情况，满足校验两种
            if (securityCheckTwo.test(value)) {
              callback();
              if (this.ruleForm.confirmPassword !== '') {
                this.$refs.elForm.$refs.form.validateField('confirmPassword');
              }
            } else {
              callback(this.$t('common.anyThreeTypesOfNumbersLettersAndPunctuationMarks'));
            }
          } else if (this.passwordStrengthVal === 2) {
            // 校验规则2的情况，满足校验三种
            if (securityCheckThree.test(value)) {
              callback();
              if (this.ruleForm.confirmPassword !== '') {
                this.$refs.elForm.$refs.form.validateField('confirmPassword');
              }
            } else {
              callback(this.$t('common.threeTypesOfCheck'));
            }
          } else if (this.passwordStrengthVal === 3) {
            // 校验规则3的情况，满足校验四种
            if (securityCheckFour.test(value)) {
              callback();
              if (this.ruleForm.confirmPassword !== '') {
                this.$refs.elForm.$refs.form.validateField('confirmPassword');
              }
            } else {
              callback(this.$t('common.fourTypesOfCheck'));
            }
          }
        }
      }
    };
    // 确认密码
    const confirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.helloTherePleaseEnterThePasswordAgain')));
      } else if (value !== this.ruleForm.password) {
        callback(new Error(this.$t('login.HelloTheTwoPasswordsDoNotMatchPleaseReEnterThem')));
      } else {
        const { length } = value;
        if (length < 8) {
          callback(
            new Error(this.$t('login.helloPasswordsMustBeLongerThan6DigitsAndLessThan18Digits'))
          );
        } else {
          callback();
        }
      }
    };
    return {
      // 注册
      loadingButton: false,
      // 标题
      title: this.$t('login.PleaseFillInTheRegistrationInformation'),
      // 流程步骤
      timeLineList: [
        {
          steps: 1, // 步骤
          content: this.$t('login.applyForRegistration'),
          icon: 'el-icon-remove',
          checked: true
        },
        {
          steps: 2, // 步骤
          content: this.$t('login.perfectInformation'),
          icon: 'el-icon-remove',
          checked: false
        }
      ],
      // input 数组
      formConfig: [
        {
          type: 'input',
          prop: 'phoneNumber',
          slotType: 'prepend',
          placeholder: this.$t('placeholder.pleaseEnterThePhoneNumber'),
          label: this.$t('login.phoneNumber')
        },
        {
          type: 'getCode',
          prop: 'messageVerifyCode',
          placeholder: this.$t('placeholder.pleaseEnterVerificationCode'),
          label: this.$t('login.verificationCode'),
          account: 'phoneNumber',
          verifyType: 'REGISTER'
        },
        {
          type: 'password',
          prop: 'password',
          placeholder: this.$t('placeholder.pleaseSetYourAccountPassword'),
          label: this.$t('login.password')
        },
        {
          type: 'password',
          prop: 'confirmPassword',
          placeholder: this.$t('placeholder.pleaseConfirmAccountPassword'),
          label: this.$t('login.confirmPassword')
        }
      ],
      // input 值
      ruleForm: {
        phoneNumber: '', // 手机号
        messageVerifyCode: '', // 短信验证码
        password: '', // 密码
        confirmPassword: '' // 确认密码
      },
      // 规则校验
      rules: {
        phoneNumber: [{ validator: phoneNumber, trigger: 'blur' }],
        password: [{ validator: password, trigger: 'change' }],
        confirmPassword: [{ validator: confirmPassword, trigger: 'change' }],
        messageVerifyCode: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterVerificationCode'),
            trigger: 'change'
          }
        ]
      },
      // 校验状态，是否显示button
      valiState: {
        phoneNumber: false, // 手机号
        messageVerifyCode: false, // 短信验证码
        password: false, // 密码
        confirmPassword: false, // 确认密码
        termsCheck: false // 我已经阅读并同意
      },
      // 是否可以点击BUTTON: true 不能点击
      isBtnDisabled: true,
      // 错误提示
      // 我已阅读并同意《隐私服务条款》
      termsCheck: false
    };
  },
  components: {
    MyModel, // 公共组件
    ValidationForm
  },
  async mounted() {
    await this.$store.dispatch('getLoginConfigFun');
  },
  computed: {
    // 密码强度值
    passwordStrengthVal() {
      return (
        (this.$store.state.base.loginConfig &&
          this.$store.state.base.loginConfig.passwordStrength - 1) ||
        0
      );
    },
    // 密码禁止内容
    pswdProhibitedContentArr() {
      const prohibitContent =
        (this.$store.state.base.loginConfig &&
          this.$store.state.base.loginConfig.prohibitContent) ||
        '';
      const arr = prohibitContent.split(',');
      return arr;
    }
  },
  methods: {
    handleGetObj(data) {
      if (data) {
        const { type, state } = data;
        if (type) this.valiState[type] = state;
      }
      // console.log(this.valiState);
      try {
        Object.keys(this.valiState).forEach((key) => {
          if (!this.valiState[key]) throw Error('error');
        });
      } catch (e) {
        this.isBtnDisabled = true;
        return;
      }
      this.isBtnDisabled = false;
    },
    // 我已阅读并同意《隐私服务条款》 change事件
    handleTermsCheck(value) {
      this.valiState.termsCheck = value;
      this.handleGetObj();
    },
    // 注册按钮
    async handleRegister() {
      const params = {
        messageType: 'PHONE', // 验证码发送方式,可用值:PHONE,EMAIL
        messageVerifyCode: this.ruleForm.messageVerifyCode, // 验证码
        receiver: this.ruleForm.phoneNumber, // 手机号
        verifyType: 'REGISTER' // 验证业务类型,可用值:REGISTER,REST_PASSWORD
      };
      this.isBtnDisabled = true;
      try {
        this.loadingButton = true;
        await this.postDoMessageVerifyFun(params);
        await this.postRegisterFun();
      } catch (error) {
        this.loadingButton = false;
        // console.log(error);
      }
      this.isBtnDisabled = false;
    },
    // 接口 校验验证码
    async postDoMessageVerifyFun(params) {
      await postDoMessageVerify(params);
    },
    // 接口 注册用户
    async postRegisterFun() {
      const params = {
        ...this.ruleForm,
        password: Encrypt(this.ruleForm.password),
        confirmPassword: Encrypt(this.ruleForm.confirmPassword)
      };
      await postRegister(params);
      const registerphone = Encrypt(this.ruleForm.phoneNumber);
      const registerpassword = params.password;
      const obj = {
        registerphone,
        registerpassword
      };
      sessionStorage.setItem('login__register', JSON.stringify(obj));
      // 跳转到完善注册信息
      this.$router.push('/register/info');
    }
  }
};
</script>
<style lang='scss' scoped>
.register {
  text-align: center;
  position: relative;
  top: -10px;
  .el-form {
    margin-top: 20px;
  }
  &__checkbox {
    margin-top: 20px;
    display: flex;
    align-items: center;
    font-size: 13px;
    &--color {
      color: #333333;
      margin-bottom: 2px;
    }
    .register__checkbox--childColor {
      color: #4689f5;
    }
    .register__checkbox--childColor:hover {
      color: $--hover-fontColor;
    }
  }
  &__btn {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    height: $--button-height;
  }
  ::v-deep {
    .el-alert {
      height: auto;
      padding: 3px 16px;
    }
  }
}
</style>
