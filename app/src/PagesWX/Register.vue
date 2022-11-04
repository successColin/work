<!--
 * @Author: sss
 * @Date: 2021-09-08 12:07:57
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-08 12:07:57
 * @Desc: 注册
-->
<template>
  <view class="register">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar title="司机注册"></apiot-navbar>
    <!-- #endif -->
    <form-register></form-register>
  </view>
</template>

<script>
import FormRegister from './components/FormRegister';

export default {
  components: { FormRegister },

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {},

  onLoad() {},
  onReady() {
    uni.setNavigationBarTitle({
      title: '司机注册'
    });
  }
};
</script>

<style lang='scss' scoped>
.register {
  height: 100vh;
  background: #ffffff;
}
</style>
