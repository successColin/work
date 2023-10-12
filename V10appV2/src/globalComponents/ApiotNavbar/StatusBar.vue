<!--
 * @Author: sss
 * @Date: 2021-12-09 15:41:27
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-09 15:41:27
 * @Desc: 状态栏
-->
<template>
  <view class="statusBar" :style="{ height: statusHeight }"></view>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    statusHeight() {
      return `${this.systemInfo.statusBar}px`;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
