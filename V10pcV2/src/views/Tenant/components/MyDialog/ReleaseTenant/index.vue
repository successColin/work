<!--
 * @Descripttion: 弹出框__释放租户
 * @Author: ytx
 * @Date: 2021-04-25 10:23:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 13:45:51
-->
<template>
  <apiot-dialog
    class="releaseTenant"
    destroy-on-close
    top="35vh"
    width="430px"
    :show-close="false"
    v-on="$listeners"
    v-bind="$attrs"
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
      <el-form-item :label="$t('common.password')" prop="password">
        <input-password
          :placeholder="$t('placeholder.PleaseEnterThePassword')"
          v-model="ruleForm.password"
        ></input-password>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { Encrypt } from '@/utils/utils';
import { updateRelease } from '@/api/tenant';

export default {
  props: {
    lineData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 释放__input 值
      ruleForm: {
        password: ''
      }
    };
  },
  computed: {
    rules() {
      // 释放__表单验证
      return {
        password: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: this.$t('common.password') }),
            trigger: 'change'
          }
        ]
      };
    }
  },
  methods: {
    handleReleaseSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const data = {
            id: this.lineData.id || '',
            password: Encrypt(this.ruleForm.password)
          };
          await updateRelease(data);
          this.$message({
            type: 'success',
            message: `${this.$t('common.success', { name: this.$t('tenant.release') })} !`
          });
          this.$emit('update:visible', false);
        } else {
          return false;
        }
      });
    },
    // 关闭重置值
    handleReset() {
      this.ruleForm.password = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.releaseTenant {
  .release {
    margin-top: 6px;
  }
  ::v-deep {
    .el-dialog__footer {
      border-top: none;
    }
    .el-dialog__body {
      height: auto;
    }
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
