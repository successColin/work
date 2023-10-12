<!--
 * @Descripttion: 收集的图标
 * @Author: ytx
 * @Date: 2021-05-18 10:11:07
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-18 10:11:07
-->
<template>
  <i
    class="iconCollect"
    v-on="$listeners"
    :class="
      isCollect
        ? 'iconfont icon-shoucangxuanzhong'
        : 'iconfont icon-shoucangweixuanzhong'
    "
    :style="isCollect && defaultShow ? 'transform: scale(1);' : ''"
  ></i>
</template>

<script>
export default {
  props: {
    isCollect: {
      type: Boolean,
      default: false
    },
    defaultShow: {
      type: Boolean,
      default: true
    }
  }
};
</script>
<style lang='scss' scoped>
.iconCollect {
  padding: 0 10px;
  text-align: right;
  color: #fab71c;
  font-size: 13px;
  transform: scale(0);
  transition: all 0.4s;
  position: relative;
  z-index: 999;
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
