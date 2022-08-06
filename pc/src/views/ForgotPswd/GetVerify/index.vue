<!--
 * @Descripttion: 第二步：填写验证信息
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:21:21
-->
<template>
  <my-model :title="title" :timeLineList="timeLineList">
    <section class="verifyWay">
      <div class="verifyWay__info">
        {{
          comeType === 'EMAIL'
            ? $t('login.sMSVerificationCodeSentToMailboxPleaseCheck')
            : $t('login.sMSVerificationCodeSentToTheMobilePhonePleaseCheck')
        }}
      </div>
      <div class="verifyWay__dec">
        {{
          comeType === 'EMAIL'
            ? $t('login.tipIfYouCanNotReceiveTheVerificationCode1')
            : $t('login.tipIfYouCanNotReceiveTheVerificationCode')
        }}
      </div>
      <div style="width: 400px; margin: 0 auto; padding-bottom: 30px">
        <!-- 表单 -->
        <validation-form
          ref="elForm"
          :formConfig="formConfig"
          :value="ruleForm"
        ></validation-form>
        <!-- 上一步和下一步 -->
        <div class="verifyWay__btnTwo">
          <apiot-button class="verifyWay__btnTwo--prev" @click="handleJump">
            {{ $t('login.backToPreviousStep') }}
          </apiot-button>
          <apiot-button
            class="verifyWay__btnTwo--next"
            @click="handleNext"
            type="primary"
          >
            {{ $t('login.nextStep') }}
          </apiot-button>
        </div>
      </div>
    </section>
  </my-model>
</template>

<script>
import { postDoMessageVerify } from '@/api/login'; // 请求接口
import MyModel from '@/views/Login/components/RegisterForgot/MyModel'; // 流程步骤模板组件
import ValidationForm from '@/views/Login/components/ValidationForm'; // 表单验证

export default {
  data() {
    return {
      // 标题
      title: this.$t('login.fillInVerificationInformation'),
      // 来的类型: PHONE 和 EMAIL
      comeType: this.$route.query.type,
      // 表单数组
      formConfig: [
        {
          type: 'input',
          prop: 'receiver',
          slotType: 'prepend',
          label:
            this.$route.query.type === 'PHONE'
              ? this.$t('login.phoneNumber')
              : this.$t('login.email'),
          disabled: true
        },
        {
          type: 'getCode',
          prop: 'messageVerifyCode',
          placeholder: this.$t('placeholder.pleaseEnterVerificationCode'),
          label: this.$t('login.verificationCode'),
          isGetcode: true,
          account: 'receiver'
        }
      ],
      // input 参数
      ruleForm: {
        messageType: this.$route.query.type, // 验证码发送方式,可用值:PHONE,EMAIL
        messageVerifyCode: '', // 验证码
        receiver: JSON.parse(sessionStorage.getItem('login__forgotpswd'))[this.$route.query.type], // 手机号或邮箱
        verifyType: 'REST_PASSWORD' // 验证业务类型,可用值:REGISTER,REST_PASSWORD
      },
      // 记录具体倒计时时间
      totalTime: 60,
      // 添加canClick
      canClick: true,
      // 步骤条
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
          checked: false
        },
        {
          steps: 4, // 步骤
          content: this.$t('login.resetSuccess'),
          icon: 'el-icon-remove',
          checked: false
        }
      ]
    };
  },
  components: {
    MyModel,
    ValidationForm
  },
  methods: {
    // 跳转到上个页面
    handleJump() {
      this.$router.replace('/forgotpswd/verifyway');
    },
    // 校验验证码
    handleNext() {
      this.postDoMessageVerifyFun();
    },
    async postDoMessageVerifyFun() {
      const type = this.comeType;
      // 如果验证码为空，return
      if (!this.ruleForm.messageVerifyCode) {
        this.$message({
          type: 'warning',
          message: this.$t('login.verificationCodeMustBeFilled')
        });
        return;
      }
      const obj = {
        ...JSON.parse(sessionStorage.getItem('login__forgotpswd')),
        VerificationCode: this.ruleForm.messageVerifyCode
      };
      await postDoMessageVerify(this.ruleForm);
      this.$router.push({ name: 'resetpswd', query: { type } });
      sessionStorage.setItem('login__forgotpswd', JSON.stringify(obj));
    }
  }
};
</script>
<style lang='scss' scoped>
@import '@/views/Login/components/RegisterForgot/MyModel/index.scss';

$--name: 'verifyWay';
$--buttonTop: '118px';
@include setLayout($--name, $--buttonTop);
</style>
