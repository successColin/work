<!--
 * @Descripttion: 弹出框__修改密码
 * @Author: ytx
 * @Date: 2021-05-12 13:47:23
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-12 13:47:23
-->
<template>
  <apiot-dialog
    class="changePassword"
    v-on="$listeners"
    v-bind="$attrs"
    destroy-on-close
    @sure-click="handleReleaseSubmit"
    @close="handleReset"
  >
    <el-form
      label-position="top"
      ref="ruleForm"
      class="release"
      :model="ruleForm"
      :rules="rules"
    >
      <el-alert
        :title="$t('common.tipDigitsAtLeastThreeTypes')"
        type="info"
        show-icon
        :closable="false"
        class="changePassword__tips"
      >
      </el-alert>
      <el-form-item
        v-for="(item, i) in formItem"
        :key="i"
        :label="item.label"
        :prop="item.prop"
      >
        <input-password
          v-model="ruleForm[item.prop]"
          :placeholder="item.placeholder"
        ></input-password>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { updateSysGlobalParameters } from '@/api/globalConfig';
import { securityCheckTwo } from '@/utils/validationRules';
import { Encrypt } from '@/utils/utils';

export default {
  props: {
    initialPasswordObj: {
      type: Object,
      default: () => {}
    },
    params: {
      type: Object,
      default: () => {}
    },
    initialPassword: {
      type: String,
      default: ''
    }
  },
  data() {
    // 密码
    const password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('login.helloPleaseEnterANewPassword')));
      } else {
        const { length } = value;
        if (length < 8) {
          callback(
            new Error(this.$t('login.helloPasswordsMustBeLongerThan6DigitsAndLessThan18Digits'))
          );
        } else if (securityCheckTwo.test(value)) {
          callback();
          if (this.ruleForm.confirmPassword !== '') {
            this.$refs.ruleForm.validateField('confirmPassword');
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
      // 释放__input 值
      ruleForm: {
        password: '',
        confirmPassword: ''
      },
      // 释放__表单验证
      rules: {
        password: [
          {
            required: true,
            validator: password,
            trigger: 'change'
          }
        ],
        confirmPassword: [
          {
            required: true,
            validator: confirmPassword,
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    // 父元素的参数
    parentParams() {
      return this.params;
    },
    formItem() {
      return [
        {
          label: this.$t('globalConfig.newInitialPassword', { name: '' }),
          prop: 'password',
          placeholder: this.$t('globalConfig.newInitialPassword', {
            name: this.$t('globalConfig.pleaseEnter')
          })
        },
        {
          label: this.$t('globalConfig.newInitialPassword', {
            name: this.$t('globalConfig.confirm')
          }),
          prop: 'confirmPassword',
          placeholder: this.$t('globalConfig.newInitialPassword', {
            name: this.$t('globalConfig.pleaseEnterAgain')
          })
        }
      ];
    }
  },
  methods: {
    // 按钮__确定
    handleReleaseSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const currentPassword = Encrypt(this.ruleForm.password);
          // console.log(currentPassword, updateSysGlobalParameters);
          const params = {
            ...this.initialPasswordObj,
            attributeValue: currentPassword
          };
          // this.params.globalAccountPassword.initialPassword = currentPassword;
          // this.params.initialPassword = currentPassword;
          // // 有个operateType， 1 是新增 2是编辑 3是删除 4是移动
          // this.params.logData = {
          //   operateType: 2,
          //   initialPassword: {
          //     name:
          //       this.$t('globalConfig.newAccountResetPassword') +
          //       this.$t('globalConfig.initialPassword')
          //   }
          // };
          await updateSysGlobalParameters({ list: [params] });
          this.$message({
            type: 'success',
            message: this.$t('common.successfullyModified')
          });
          this.$emit('update:visible', false);
          this.$emit('update:initialPassword', currentPassword);
        } else {
          return false;
        }
      });
    },
    // 关闭重置值
    handleReset() {
      this.ruleForm.password = '';
      this.ruleForm.confirmPassword = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.changePassword {
  .el-form-item {
    margin-bottom: 20px;
  }

  &__tips {
    // float: right;
    font-size: 12px;
    color: #808080;
    margin-bottom: 16px;
  }

  ::v-deep {
    .el-alert {
      border: none !important;
    }
  }
}
</style>
