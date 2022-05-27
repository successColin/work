<!--
 * @Descripttion: 封装表单
 * @Author: ytx
 * @Date: 2021-04-14 17:43:39
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 11:06:33
  v-bind="$attrs"
  v-on="$listeners"
-->
<template>
  <!-- 表单 -->
  <el-form
    ref="form"
    class="validationForm"
    :model="value"
    :rules="rules"
    :show-message="false"
    @validate="validateFun"
    @submit.native.prevent
  >
    <!-- 错误提示内容 -->
    <el-form-item>
      <el-alert
        :title="errorTips"
        type="error"
        :closable="false"
        v-show="errorTips"
      ></el-alert>
    </el-form-item>
    <slot name="formItem" />
    <el-form-item v-for="item in formConfig" :prop="item.prop" :key="item.prop">
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
        v-if="item.type === 'password'"
        v-model="value[item.prop]"
        :slotType="passwordSlotType"
        prependWidth="70px"
        :placeholder="item.placeholder"
        :prependText="item.label"
        :isShow="isShow"
      >
      </input-password>
      <!--
        验证码
        v-model:值
        prependWidth：左侧宽度
        account：手机号
        verifyType：类型 REGISTER 注册或修改密码
       -->
      <input-getcode
        v-if="item.type === 'getCode'"
        v-model.number="value[item.prop]"
        prependWidth="70px"
        :account="value[item.account]"
        :verifyType="item.verifyType"
      ></input-getcode>
      <!--
        input 输入框
        v-model:值
        disabled：是否禁用
        clearable：是否开启禁用
        placeholder：占位符
        slotType：element 的插槽
       -->
      <apiot-input
        v-if="item.type === 'input'"
        v-model="value[item.prop]"
        :disabled="item.disabled"
        :clearable="item.clearable"
        :placeholder="item.placeholder"
        :slotType="item.slotType"
      >
        <div style="min-width: 70px" slot="prepend">{{ item.label }}</div>
      </apiot-input>
    </el-form-item>
  </el-form>
</template>

<script>
import InputGetcode from '../InputGetcode';

export default {
  props: {
    // 表单配置
    formConfig: {
      type: Array,
      required: true
    },
    // 传过来的参数对象
    value: {
      type: Object,
      required: true
    },
    // 校验规则
    rules: {
      type: Object
    },
    passwordSlotType: {
      type: String,
      default: 'suffix,prepend'
    }
  },
  data() {
    return {
      // 错误提示
      errorTips: '',
      isShow: true
    };
  },
  components: {
    InputGetcode
  },
  methods: {
    // 校验方法
    validateFun(type, state, error) {
      if (state) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
      this.errorTips = error;
      const validateObj = {
        type,
        state,
        error
      };
      this.$emit('giveObj', validateObj);
    }
  }
};
</script>
<style lang='scss' scoped>
.validationForm {
  ::v-deep {
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-alert {
      border: 1px solid rgba(255, 77, 79, 0.5);
      .el-alert__content {
        padding: 0;
      }
    }
  }
}
</style>
