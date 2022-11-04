<!--
 * @Author: sss
 * @Date: 2022-05-19 19:26:23
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-19 19:26:23
 * @Desc: 表单头
-->
<template>
  <div class="formHead">
    {{ title }}
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    title: String
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.formHead {
  padding: 0 30rpx;
  width: 100%;
  height: 100rpx;
  font-size: 36rpx;
  @include fontBlob(500);
  color: #333333;
  line-height: 100rpx;
  box-shadow: inset 0 -2rpx 0 0 #e9e9e9;
}
</style>
