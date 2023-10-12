<!--
 * @Author: sss
 * @Date: 2021-09-09 13:51:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-09 13:51:44
 * @Desc: 注册
-->
<template>
  <view class="registerForm">
    <span class="registerForm__title">注意事项</span>
    <span class="registerForm__subtitle">
      该功能仅用于义乌地区送货司机，注册司机后可使用的功能包括：获取物流企业的公告、扫发货码。
    </span>
    <view class="registerFormForm form hasBorder">
      <u-form
        :model="registerFormForm"
        ref="registerFormForm"
        :errorType="showLoading ? 'toast' : 'message'"
      >
        <u-form-item class="form--item" prop="userName">
          <apiot-input
            prefixIcon="appIcon-zhanghao"
            v-model="registerFormForm.userName"
            placeholder="请输入姓名"
          ></apiot-input>
        </u-form-item>
        <u-form-item class="form--item" prop="idCard">
          <apiot-input
            prefixClass="iconfont"
            prefixIcon="icon-leixingicon_94"
            v-model="registerFormForm.idCard"
            placeholder="请输入身份证号码"
          ></apiot-input>
        </u-form-item>
        <u-form-item class="form--item" prop="phone">
          <apiot-input
            prefixIcon="appIcon-shoujihaodenglu"
            v-model="registerFormForm.phone"
            placeholder="请输入手机号码"
          ></apiot-input>
        </u-form-item>
        <u-form-item class="form--item" prop="company">
          <apiot-input
            prefixClass="iconfont"
            prefixIcon="icon-leixingicon_9"
            v-model="registerFormForm.company"
            placeholder="请输入公司名称"
          ></apiot-input>
        </u-form-item>
        <u-form-item class="form--item" prop="car">
          <apiot-input
            prefixClass="iconfont"
            prefixIcon="icon-leixingicon_10"
            v-model="registerFormForm.car"
            placeholder="请输入车牌号码"
          ></apiot-input>
        </u-form-item>
      </u-form>
    </view>
    <div class="btn">
      <apiot-button
        type="primary"
        shape="circle"
        :loading="showLoading"
        @click="registerForm"
        >注册</apiot-button
      >
    </div>
  </view>
</template>

<script>
import { wxRegister } from '@/api/login.js';

export default {
  components: {},

  props: {
    verificationResult: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      registerFormForm: {
        userName: '',
        idCard: '',
        phone: '',
        company: '',
        car: ''
      },
      showLoading: false
    };
  },

  computed: {},

  methods: {
    // 修改密码
    async gotoReset() {
      try {
        const { registerFormForm } = this;
        registerFormForm.openId = uni.getStorageSync('wxFlag');
        console.log(uni.getStorageSync('wxFlag'));
        await wxRegister(registerFormForm);
        this.showLoading = false;
        this.$store.dispatch('jumpHomePage', {});
      } catch (e) {
        this.showLoading = false;
        uni.showToast({
          icon: 'none',
          title: e.message
        });
      }
    },
    // 修改密码
    async registerForm() {
      this.showLoading = true;
      try {
        await this.$refs.registerFormForm.validate();
        this.gotoReset();
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 设置表单校验规则
    setFormRules() {
      const rules = {
        userName: [
          {
            required: true,
            message: '请输入姓名',
            // 可以单个或者同时写两个触发验证方式
            trigger: 'change'
          }
        ],
        idCard: [
          {
            required: true,
            message: '请输入正确身份证号码',
            trigger: 'change',
            validator: (rule, value) => this.$u.test.idCard(value)
          }
        ],
        phone: [
          {
            required: true,
            message: '请输入正确手机号码',
            trigger: 'change',
            validator: (rule, value) => this.$u.test.mobile(value)
          }
        ],
        car: [
          {
            message: '请输入正确车牌号码',
            trigger: 'change',
            validator: (rule, value) => !value || this.$u.test.carNo(value)
          }
        ]
      };
      this.$refs.registerFormForm.setRules(rules);
    }
  },

  mounted() {
    this.setFormRules();
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'registerForm';
$--formName: 'registerFormForm';
@include setVerife($--name, $--formName);
.registerForm {
  .registerFormForm {
    margin-top: 60rpx;
  }
}
</style>
