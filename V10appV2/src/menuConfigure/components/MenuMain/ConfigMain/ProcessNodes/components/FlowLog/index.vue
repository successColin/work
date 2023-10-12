<!--
 * @Descripttion: 流程日志
 * @Author: ytx
 * @Date: 2023-07-18 19:48:15
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-18 19:48:15
-->
<template>
  <div class="flowLog">
    <Node
      v-for="(item, index) in nodeArry"
      :key="index"
      :value="item"
      :isActivited="index === nodeArry.length - 1"
      :isFinish="isFinish"
    ></Node>
  </div>
</template>

<script>
import Node from '../../Node';

export default {
  props: {
    nodeArry: {
      type: Array,
      default: () => []
    },
    isFinish: {
      type: Boolean,
      default: false
    }
  },
  components: { Node },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.flowLog {
  padding: 0 30rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.08);
  border-radius: 14rpx;
}
</style>
