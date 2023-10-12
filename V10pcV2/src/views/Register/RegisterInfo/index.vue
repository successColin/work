<!--
 * @Descripttion: 注册第二步：完善信息
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:24:42
-->
<template>
  <my-model :title="title" :timeLineList="timeLineList">
    <section class="register">
      <div style="width: 400px; margin: 0 auto; padding-bottom: 30px">
        <validation-form
          ref="elForm"
          :formConfig="formConfig"
          :value="ruleForm"
          :rules="rules"
        ></validation-form>
        <!-- 业务类型 -->
        <section class="register__business">
          <div class="register__business--title">
            {{ $t('login.businessTypes') }}
          </div>
          <div class="register__content">
            <div
              class="register__buttonAll"
              v-for="(item, i) in buttonArr"
              :key="i"
            >
              <apiot-button
                round
                class="register__button"
                :class="{ isClickTrue: item.state }"
                @click="handleBusiness(item)"
              >
                <transition-group name="el-fade-in-linear">
                  <i
                    class="iconfont icon-xuanzhong"
                    v-show="item.state"
                    :key="1"
                  ></i>
                  <i
                    class="iconfont icon-weixuanzhong"
                    v-show="!item.state"
                    :key="2"
                  ></i>
                </transition-group>
                <span style="padding-left: 20px">{{ item.label }}</span>
              </apiot-button>
            </div>
          </div>
        </section>
        <!-- 富文本框 -->
        <apiot-input
          type="textarea"
          class="register__textarea"
          v-show="isShowTextare"
          v-model="ruleForm.other"
          resize="none"
          :placeholder="textareaPlaceholder"
          :rows="2"
        ></apiot-input>
        <!-- 进入平台 -->
        <apiot-button
          class="register__btn"
          @click="handleRegister"
          type="primary"
        >
          {{ $t('login.enterThePlatform') }}
        </apiot-button>
      </div>
    </section>
  </my-model>
</template>

<script>
import { postPerfectInformation, postLoginForm } from '@/api/login';
import { email } from '@/utils/validationRules';
import { Decrypt } from '@/utils/utils';
import ValidationForm from '@/views/Login/components/ValidationForm'; // 表单验证
import MyModel from '@/views/Login/components/RegisterForgot/MyModel';

export default {
  data() {
    return {
      // 标题
      title: this.$t('login.completeRegistrationInformation'),
      // 注册流程步骤
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
          checked: true
        }
      ],
      // input 公司 名称 邮箱
      formConfig: [
        {
          type: 'input',
          placeholder: this.$t('placeholder.pleaseEnterYourCompanyTeamName'),
          label: this.$t('login.company'),
          prop: 'companyName',
          slotType: 'prepend'
        },
        {
          type: 'input',
          placeholder: this.$t('placeholder.pleaseEnterYourName'),
          label: this.$t('login.name'),
          prop: 'realName',
          slotType: 'prepend'
        },
        {
          type: 'input',
          placeholder: this.$t('placeholder.pleaseEnterYourUsualEmail'),
          label: this.$t('login.email'),
          prop: 'email',
          slotType: 'prepend'
        }
      ],
      // 校验规则
      rules: {
        email: [{ validator: email, trigger: 'change' }]
      },
      // 业务类型数据
      buttonArr: [
        { label: this.$t('login.troubleshooting'), state: false },
        { label: this.$t('login.equipmentCheck'), state: false },
        { label: this.$t('login.inventoryManagement'), state: false },
        { label: this.$t('login.equipmentStatusMonitoring'), state: false },
        { label: this.$t('login.knowledgeBaseAndPersonnelSkills'), state: false },
        { label: this.$t('login.other'), state: false }
      ],
      // 表单数据
      ruleForm: {
        companyName: '', // 公司名称
        realName: '', // 姓名
        email: '', // 邮箱
        business: '', // 业务类型
        other: '', // 其他业务需求
        phoneNumber: Decrypt(JSON.parse(sessionStorage.getItem('login__register')).registerphone) // 账号
      },
      isShowTextare: false,
      // 描述占位符：简单描述一下您的业务需求～
      textareaPlaceholder: this.$t('placeholder.brieflyDescribeYourBusinessNeeds')
    };
  },
  components: {
    MyModel,
    ValidationForm
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 点击业务类型
    handleBusiness(item) {
      // 取反
      item.state = !item.state;
      // 如果其他是否显示文本框
      if ((item.label === '其他' || item.label === 'Other') && item.state) {
        this.isShowTextare = true;
      } else if (item.label === '其他' || item.label === 'Other') {
        this.isShowTextare = false;
        this.ruleForm.other = '';
      }
    },
    // 按钮 进入平台
    async handleRegister() {
      const businessArr = [];
      this.buttonArr.forEach((item) => {
        if (item.state) businessArr.push(item.label);
      });
      this.ruleForm.business = businessArr.join(',');
      try {
        await this.postPerfectInformation();
        await this.postLoginFormFun();
      } catch (error) {
        // console.log(error);
      }
    },
    // 接口 完善信息
    async postPerfectInformation() {
      await postPerfectInformation(this.ruleForm);
    },
    // 接口 登录接口
    async postLoginFormFun() {
      const params = {
        username: Decrypt(JSON.parse(sessionStorage.getItem('login__register')).registerphone),
        password: JSON.parse(sessionStorage.getItem('login__register')).registerpassword, // 密码
        rememberMe: false // 记住密码
      };
      // console.log(params);
      await postLoginForm(params);
      this.$store.dispatch('getRoute');
      localStorage.setItem('checked', 0);
      sessionStorage.removeItem('login__register');
      this.$nextTick(() => {
        this.$router.replace('/home');
        sessionStorage.removeItem('navTabArr');
        sessionStorage.removeItem('delTabArr');
      });
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
    ::v-deep {
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
  &__business {
    &--title {
      text-align: left;
      font-size: 13px;
      color: #333333;
      margin-top: 10px;
    }
    .register__content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .register__buttonAll {
        display: inline-block;
        text-align: left;
        color: #333333;
        ::v-deep {
          .el-button.is-round {
            padding: 12px 12px;
          }
          .el-form-item {
            margin-bottom: 10px;
          }
        }
        .register__button {
          height: 36px;
          margin-top: 8px;
          text-align: left;
          margin-right: 5px;
          position: relative;
          .iconfont {
            position: absolute;
            margin-right: 4px;
            font-size: 13px;
            color: #dde2ea;
          }
          .icon-xuanzhong {
            color: #4689f5;
          }
        }
        .isClickTrue {
          background: #f6f6f8;
        }
      }
    }
  }
  &__textarea {
    margin-top: 10px;
  }
  &__btn {
    width: 140px;
    margin: 0 auto;
    margin-top: 19px;
    height: $--button-height;
  }
}
</style>
