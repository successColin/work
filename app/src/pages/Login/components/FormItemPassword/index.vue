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
      :key="isShowPassword ? 'password' : 'text'"
      :value="defaultValue"
      prefixIcon="appIcon-mima"
      :suffixIcon="
        isShowPassword ? 'appIcon-mimayincang' : 'appIcon-mimaxianshi'
      "
      :type="isShowPassword ? 'password' : 'text'"
      :placeholder="placeholder"
      border="none"
      @suffixClick="changeType"
      @input="handleInput"
    ></apiot-input>
    <!-- <template v-else>
      <apiot-input
        :value="defaultValue"
        prefixIcon="appIcon-mima"
        suffixIcon="appIcon-mimaxianshi"
        :password="false"
        :placeholder="placeholder"
        border="none"
        @suffixClick="changeType"
        @input="handleInput"
      ></apiot-input>
    </template> -->
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
