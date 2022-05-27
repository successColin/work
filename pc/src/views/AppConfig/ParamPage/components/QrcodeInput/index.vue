<!--
 * @Author: sss
 * @Date: 2022-05-12 10:34:20
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-12 10:34:20
 * @Desc: 输入框中的二维码
-->
<template>
  <el-popover placement="top-start" width="200" trigger="hover">
    <qrcode-down :value="value" :title="title"></qrcode-down>
    <i class="iconfont icon-erweima popover-icon" slot="reference"></i>
  </el-popover>
</template>

<script>
import QrcodeDown from '../QrcodeDown';

export default {
  components: { QrcodeDown },

  props: {
    value: String,
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
.popover-icon {
  padding-right: 4px;
}
</style>
