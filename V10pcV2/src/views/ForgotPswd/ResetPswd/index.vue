<!--
 * @Descripttion: 第三步：重置新密码
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:21:37
-->
<template>
  <my-model :title="title" :timeLineList="timeLineList">
    <section class="verifyWay">
      <div class="verifyWay__info">
        {{ $t('login.forMoreEfficientWorkPleaseKeepYourNewPasswordProperly') }}
      </div>
      <div class="verifyWay__dec">
        {{ $t('login.noteThePasswordIs6To18DigitsForSecurity') }}
        {{
          passwordRule[passwordStrengthVal] &&
          passwordRule[passwordStrengthVal].name
        }}
      </div>
      <div style="width: 400px; margin: 0 auto; padding-bottom: 30px">
        <validation-form
          ref="elForm"
          :formConfig="formConfig"
          :value="ruleForm"
          :rules="rules"
          @giveObj="handleGetObj"
        ></validation-form>
        <!-- 上一步和下一步 -->
        <div class="verifyWay__btnTwo">
          <apiot-button class="verifyWay__btnTwo--prev" @click="handleJump">
            {{ $t('login.backToPreviousStep') }}
          </apiot-button>
          <apiot-button
            class="verifyWay__btnTwo--next"
            @click="handleBtn"
            :disabled="isDisabledButton"
            type="primary"
          >
            {{ $t('common.sure') }}
          </apiot-button>
        </div>
      </div>
    </section>
  </my-model>
</template>

<script>
// 流程步骤模板
import { postResetPassword } from '@/api/login';
import { Encrypt, passwordRule } from '@/utils/utils';
import { securityCheckFour, securityCheckThree, securityCheckTwo } from '@/utils/validationRules';
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
      passwordRule,
      // 标题
      title: this.$t('login.resetNewPassword'),
      // 上一步传过来的type
      comeType: this.$route.query.type,
      // 表单值
      ruleForm: {
        account: JSON.parse(sessionStorage.getItem('login__forgotpswd'))[this.$route.query.type],
        password: '',
        confirmPassword: ''
      },
      isDisabledButton: true,
      // 校验状态，是否显示button
      valiState: {
        password: false,
        confirmPassword: false
      },
      // 表单数组
      formConfig: [
        {
          type: 'input',
          prop: 'account',
          slotType: 'prepend',
          label:
            this.$route.query.type === 'PHONE'
              ? this.$t('login.phoneNumber')
              : this.$t('login.email'),
          disabled: true
        },
        {
          type: 'password',
          prop: 'password',
          label: this.$t('login.newPassword'),
          placeholder: this.$t('placeholder.pleaseSetANewPassword')
        },
        {
          type: 'password',
          prop: 'confirmPassword',
          label: this.$t('login.confirmPassword'),
          placeholder: this.$t('placeholder.PleaseConfirmTheNewPasswordAgain')
        }
      ],
      // 流程步骤
      timeLineList: [
        {
          steps: 1, // 步骤
          content: this.$t('login.waysOfIdentifying'),
          icon: 'icon-zuo',
          checked: true
        },
        {
          steps: 2, // 步骤
          content: this.$t('login.getVerification'),
          icon: 'el-icon-remove',
          checked: true
        },
        {
          steps: 3, // 步骤
          content: this.$t('login.resetPasswords'),
          icon: 'el-icon-remove',
          checked: true
        },
        {
          steps: 4, // 步骤
          content: this.$t('login.resetSuccess'),
          icon: 'el-icon-remove',
          checked: false
        }
      ],
      // 规则校验
      rules: {
        password: [{ validator: password, trigger: 'change' }],
        confirmPassword: [{ validator: confirmPassword, trigger: 'change' }]
      }
    };
  },
  components: {
    MyModel, // 公共框架
    ValidationForm
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
  mounted() {
    this.getConfig();
  },
  methods: {
    // 获取配置
    async getConfig() {
      // 获取密码强度配置
      await this.$store.dispatch('getLoginConfigFun');
    },
    handleGetObj(data) {
      if (data) {
        const { type, state } = data;
        if (type) this.valiState[type] = state;
      }
      try {
        Object.keys(this.valiState).forEach((key) => {
          if (!this.valiState[key]) throw Error('error');
        });
      } catch (e) {
        this.isDisabledButton = true;
        return;
      }
      this.isDisabledButton = false;
    },
    // 调整到上个页面
    handleJump() {
      this.$router.back(-1);
      // this.$router.replace('/forgotpswd/getverify'); // 这个方法不行
    },
    // 下一步
    handleBtn() {
      this.$refs.elForm.$refs.form.validate((valid) => {
        if (valid) {
          this.postResetPasswordFun();
        } else {
          return false;
        }
      });
    },
    // 接口 重置密码
    async postResetPasswordFun() {
      const params = {
        account: this.ruleForm.account, // 账号
        confirmPassword: Encrypt(this.ruleForm.confirmPassword), // 确认密码
        messageType: this.comeType, // 验证码发送方式
        messageVerifyCode: JSON.parse(sessionStorage.getItem('login__forgotpswd')).VerificationCode, // 验证码
        password: Encrypt(this.ruleForm.password) // 密码
      };
      await postResetPassword(params);
      this.$router.push('/forgotpswd/successtip');
    }
  }
};
</script>
<style lang='scss' scoped>
@import '@/views/Login/components/RegisterForgot/MyModel/index.scss';

$--name: 'verifyWay';
$--buttonTop: '40px';
@include setLayout($--name, $--buttonTop);
::v-deep {
  .el-alert {
    height: auto;
    padding: 3px 16px;
  }
}
</style>
