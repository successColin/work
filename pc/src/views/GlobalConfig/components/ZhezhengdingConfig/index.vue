<!--
 * @Descripttion: 浙政钉配置
 * @Author: ytx
 * @Date: 2022-07-12 18:50:08
 * @Last Modified by: ytx
 * @Last Modified time: 2022-07-12 18:50:08
-->
<template>
  <apiot-dialog
    class="config"
    v-on="$listeners"
    v-bind="$attrs"
    destroy-on-close
    @sure-click="handleReleaseSubmit"
  >
    <el-form
      label-position="top"
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
    >
      <el-form-item
        v-for="(item, i) in formItem"
        :key="i"
        :label="item.label"
        :prop="item.prop"
      >
        <apiot-input
          v-model="ruleForm[item.prop]"
          :placeholder="item.placeholder"
        ></apiot-input>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { commonUpdate } from '@/api/globalConfig';

export default {
  props: {
    zzdConfig: {
      type: Object,
      default: () => {}
    },
    zzdConfigObj: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    zzdConfig(v) {
      console.log(v);
      const { clientId, redirectUri, qrCodeUrl } = v;
      this.ruleForm = {
        clientId,
        redirectUri,
        qrCodeUrl
      };
    }
  },
  data() {
    return {
      // 释放__input 值
      ruleForm: {
        clientId: '',
        redirectUri: '',
        qrCodeUrl: ''
      },
      // 释放__表单验证
      rules: {
        clientId: [
          {
            required: true,
            message: '请填写扫码应用标识',
            trigger: 'change'
          }
        ],
        redirectUri: [
          {
            required: true,
            message: '请填写扫码回调地址',
            trigger: 'change'
          }
        ],
        qrCodeUrl: [
          {
            required: true,
            message: '请填写获取二维码扫码链接地址',
            trigger: 'change'
          }
        ]
      }
    };
  },
  computed: {
    formItem() {
      return [
        {
          label: '扫码应用标识',
          prop: 'clientId',
          placeholder: '请填写扫码应用标识'
        },
        {
          label: '扫码回调地址',
          prop: 'redirectUri',
          placeholder: '请填写扫码回调地址'
        },
        {
          label: '获取二维码扫码链接地址',
          prop: 'qrCodeUrl',
          placeholder: '请填写获取二维码扫码链接地址'
        }
      ];
    }
  },
  methods: {
    // 按钮__确定
    handleReleaseSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const param = {
            ...this.zzdConfigObj,
            attributeValue: JSON.stringify(this.ruleForm)
          };
          await commonUpdate({ list: [param] });
          this.$message({
            type: 'success',
            message: this.$t('common.successfullyModified')
          });
          this.$emit('update:visible', false);
        } else {
          return false;
        }
      });
    }
    // // 关闭重置值
    // handleReset() {
    //   this.ruleForm.password = '';
    //   this.ruleForm.confirmPassword = '';
    // }
  }
};
</script>
<style lang='scss' scoped>
.changePassword {
  .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
