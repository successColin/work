<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-07-21 11:04:07
 * @Des: 个人中心-账户安全
-->
<template>
  <div class="account">
    <div class="account__header">
      <div class="account__header__icon m-r-12">
        <i class="iconfont icon-zhanghuanquan"></i>
      </div>
      <div class="account__header__info">
        <p class="tenantName">
          {{ $t('userCenter.accountPasswordModificationTips') }}
        </p>
        <p>
          {{ $t('userCenter.passwordTips') }}
        </p>
      </div>
    </div>
    <div class="account__content">
      <el-form
        label-position="top"
        ref="account"
        :rules="rules"
        label-width="80px"
        :model="curData"
      >
        <el-form-item :label="$t('userCenter.oldPassword')" prop="oldPassword">
          <!--
            验证码
            v-model:值
            slotType：插槽类型
            prependWidth：左侧宽度
            placeholder：占位符
            prependText：左侧内容
            isShow：是否显示校验安全信息
          -->
          <input-password
            v-model="curData.oldPassword"
            prependWidth="70px"
            :placeholder="$t('userCenter.enterOldPassword')"
            :isShow="true"
          >
          </input-password>
        </el-form-item>
        <el-form-item :label="$t('userCenter.newPassword')" prop="password">
          <input-password
            v-model="curData.password"
            prependWidth="70px"
            :placeholder="$t('userCenter.enterNewPassword')"
            :isShow="true"
          >
          </input-password>
        </el-form-item>
        <el-form-item
          :label="$t('userCenter.confirmNewPassword')"
          prop="confirmPassword"
        >
          <input-password
            v-model="curData.confirmPassword"
            prependWidth="70px"
            :placeholder="$t('userCenter.confirmEnterNewPassword')"
            :isShow="true"
          >
          </input-password>
        </el-form-item>
      </el-form>
    </div>
    <div class="account__footer">
      <apiot-button
        type="primary"
        :loading="loading"
        @click.stop.prevent="sureClick"
      >
        {{ $t('common.sure') }}
      </apiot-button>
    </div>
  </div>
</template>

<script>
import { editUserPassword } from '@/api/userCenter.js';
import { Encrypt } from '@/utils/utils';
import { securityCheckTwo } from '@/utils/validationRules';

export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    // 密码
    const password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.helloPleaseEnterANewPassword')));
      } else {
        const { length } = value;
        if (length > 18 || length < 6) {
          callback(
            new Error(this.$t('login.helloPasswordsMustBeLongerThan6DigitsAndLessThan18Digits'))
          );
        } else if (securityCheckTwo.test(value)) {
          callback();
          if (this.curData.confirmPassword !== '') {
            this.$refs.account.validateField('confirmPassword');
          }
        } else {
          callback(this.$t('common.anyThreeTypesOfNumbersLettersAndPunctuationMarks'));
        }
      }
    };
    // 确认密码
    const confirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.helloTherePleaseEnterThePasswordAgain')));
      } else if (value !== this.curData.password) {
        callback(new Error(this.$t('login.HelloTheTwoPasswordsDoNotMatchPleaseReEnterThem')));
      } else {
        const { length } = value;
        if (length > 18 || length < 6) {
          callback(
            new Error(this.$t('login.helloPasswordsMustBeLongerThan6DigitsAndLessThan18Digits'))
          );
        } else {
          callback();
        }
      }
    };
    return {
      isEditName: false,
      isEditSign: false,
      loading: false,
      curData: {
        oldPassword: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          {
            required: true,
            message: this.$t('login.helloPleaseEnterThePassword'),
            trigger: ['blur', 'change']
          }
        ],
        password: [{ validator: password, trigger: ['blur', 'change'] }],
        confirmPassword: [{ validator: confirmPassword, trigger: ['blur', 'change'] }]
      }
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    sureClick() {
      this.$refs.account.validate((valid) => {
        if (valid) {
          this.changePassword();
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    async changePassword() {
      try {
        if (this.isSubmit) return;
        this.isSubmit = true;
        const param = {
          oldPassword: Encrypt(this.curData.oldPassword),
          password: Encrypt(this.curData.password),
          confirmPassword: Encrypt(this.curData.confirmPassword)
        };
        const str = `${this.$t('userCenter.changePassword')}`;
        param.logData = str;
        await editUserPassword(param);
        this.isSubmit = false;
        this.$message.success(this.$t('common.successfullyModified'));
        this.$router.push('/login');
      } catch (error) {
        this.isSubmit = false;
        if (error.name) {
          return this.$message({
            type: 'error',
            message: error.name
          });
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.account {
  width: 100%;
  overflow: hidden;
  font-size: 13px;
  &__header {
    width: 100%;
    height: 72px;
    display: inline-flex;
    border-bottom: 1px solid #e9e9e9;
    padding: 14px 12px;
    display: flex;
    box-sizing: border-box;
    &__icon {
      width: 60px;
      height: 44px;
      text-align: center;
      .iconfont {
        font-size: 40px;
        color: #34c7be;
      }
    }
    &__info {
      line-height: 100%;
      color: #808080;
      .tenantName {
        margin-bottom: 10px;
        color: #333333;
      }
    }
  }
  &__content {
    width: 100%;
    padding: 20px 20px 0;
    color: #333333;
    box-sizing: border-box;
  }
  &__footer {
    width: 100%;
    padding: 8px 20px;
    box-sizing: border-box;
  }
  .whole-line {
    width: 100%;
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 16px;
    }
  }
}
</style>
