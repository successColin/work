<!--
 * @Descripttion: 第一步：验证方式
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:22:01
-->
<template>
  <my-model :title="title" :timeLineList="timeLineList">
    <section class="verifyWay">
      <div class="verifyWay__info">
        {{
          $t(
            'login.fillInTheAccountNumberOrMobilePhoneNumberAndVerifyTheMethod'
          )
        }}
      </div>
      <div class="verifyWay__dec">
        {{ $t('login.resetAfterVerificationOfPhoneNumberOrEmail') }}
      </div>
      <div style="width: 400px; margin: 0 auto; padding-bottom: 30px">
        <!-- 表单 -->
        <validation-form
          ref="elForm"
          :formConfig="formConfig"
          :value="ruleForm"
          :rules="rules"
        >
        </validation-form>
        <!-- button 手机号验证和邮箱验证 -->
        <div class="verifyWay__btn">
          <apiot-button
            class="verifyWay__btn--phone"
            type="primary"
            @click.prevent="handleBtn('PHONE')"
            >{{ $t('login.phoneVerification') }}</apiot-button
          >
          <apiot-button
            class="verifyWay__btn--email"
            @click.prevent="handleBtn('EMAIL')"
            >{{ $t('login.emailVerification') }}</apiot-button
          >
        </div>
      </div>
    </section>
  </my-model>
</template>

<script>
import MyModel from '@/views/Login/components/RegisterForgot/MyModel'; // 公共模块
import ValidationForm from '@/views/Login/components/ValidationForm'; // 表单验证
import { getRestPwdAccountByType } from '@/api/login.js';

export default {
  data() {
    return {
      // 标题
      title: this.$t('login.accountWhosePasswordNeedsToBeRetrieved'),
      // 步骤条
      timeLineList: [
        {
          steps: 1,
          content: this.$t('login.waysOfIdentifying'),
          icon: 'icon-zuo',
          checked: true
        },
        {
          steps: 2,
          content: this.$t('login.getVerification'),
          icon: 'el-icon-remove',
          checked: false
        },
        {
          steps: 3,
          content: this.$t('login.resetPasswords'),
          icon: 'el-icon-remove',
          checked: false
        },
        {
          steps: 4,
          content: this.$t('login.resetSuccess'),
          icon: 'el-icon-remove',
          checked: false
        }
      ],
      // 表单数组
      formConfig: [
        {
          type: 'input',
          prop: 'account',
          placeholder: this.$t('placeholder.pleaseEnterYourAccountPhone')
        }
      ],
      // 表单值
      ruleForm: {
        account: ''
      },
      // 校验方式
      rules: {
        account: {
          required: true,
          message: this.$t('login.helloPleaseEnterYourAccountPhoneNumber'),
          trigger: 'change'
        }
      }
    };
  },
  components: {
    MyModel,
    ValidationForm
  },
  methods: {
    // 按钮验证和跳转
    handleBtn(type) {
      this.$refs.elForm.$refs.form.validate((valid) => {
        if (valid) {
          this.getRestPwdAccountByTypeFun(type);
        } else {
          return false;
        }
      });
    },
    // 获取用户信息 接口
    async getRestPwdAccountByTypeFun(type) {
      const query = {
        account: this.ruleForm.account,
        messageType: type
      };
      const res = await getRestPwdAccountByType(query);
      if (res) {
        const obj = {
          [type]: res
        };
        sessionStorage.setItem('login__forgotpswd', JSON.stringify(obj));
        this.$router.push({ path: '/forgotpswd/getverify', query: { type } });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '@/views/Login/components/RegisterForgot/MyModel/index.scss';

$--name: 'verifyWay';
$--buttonTop: '';
@include setLayout($--name, $--buttonTop);
</style>
