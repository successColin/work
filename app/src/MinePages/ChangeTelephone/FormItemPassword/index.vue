<!--
 * @Author: sss
 * @Date: 2021-09-13 11:13:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-13 11:13:44
 * @Desc: 密码框
-->
<template>
  <view class="passwordBox">
    <apiot-input
      v-if="isShowPassword"
      :value="defaultValue"
      suffixIcon="appIcon-mimayincang"
      :password="isShowPassword"
      :placeholder="placeholder"
      border="none"
      @suffixClick="changeType"
      @input="handleInput"
    ></apiot-input>
    <apiot-input
      v-if="!isShowPassword"
      :value="defaultValue"
      suffixIcon="appIcon-mimaxianshi"
      :placeholder="placeholder"
      border="none"
      @suffixClick="changeType"
      @input="handleInput"
    ></apiot-input>
  </view>
  <!-- <view>{{ defaultValue }}</view> -->
</template>

<script>
export default {
  components: {},

  props: {
    value: {
      type: [String, Number, Boolean],
      default: ''
    },
    // 是否需要清除图标
    clearable: {
      type: Boolean,
      default: false
    },
    // 提示文字
    placeholder: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isShowPassword: true,
      defaultValue: ''
    };
  },

  computed: {},

  watch: {
    value(newValue) {
      this.defaultValue = newValue;
    }
  },

  methods: {
    changeType() {
      this.isShowPassword = !this.isShowPassword;
    },
    handleInput(value) {
      this.$emit('input', value);
    }
  },

  mounted() {
    this.defaultValue = this.value;
  }
};
</script>

<style lang='scss' scoped>
.passwordBox {
  width: 100%;
}
</style>
