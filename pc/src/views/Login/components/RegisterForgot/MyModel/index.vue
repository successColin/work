<!--
 * @Descripttion: 忘记密码和注册页面下内容
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:45:56
-->
<template>
  <div class="myModel">
    <div class="myModel__title">{{ title }}</div>
    <div class="myModel__dowm--content">
      <my-steps class="myModel__steps" :timeLineList="timeLineList"></my-steps>
      <div class="myModel__registerInfo">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import MySteps from '../../MySteps';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    timeLineList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    MySteps
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';
</style>
