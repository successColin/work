<!--
 * @Descripttion: 接口成功失败提示
 * @Author: ytx
 * @Date: 2022-05-31 10:44:24
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-31 10:44:24
-->
<template>
  <u-toast ref="uToast"></u-toast>
</template>

<script>
export default {
  props: {
    obj: {
      type: Object,
      default: () => ({
        type: 'success',
        message: '操作成功'
      })
    },
    position: {
      type: String,
      default: 'top'
    }
  },
  watch: {
    obj: {
      deep: true,
      handler(v) {
        console.log(v);
        const { type, message } = v;
        this.$refs.uToast.show({
          type,
          message: `${message}`,
          position: this.position
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
