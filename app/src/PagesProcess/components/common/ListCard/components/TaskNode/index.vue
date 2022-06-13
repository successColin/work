<!--
 * @Author: sss
 * @Date: 2022-05-25 16:09:15
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 16:09:15
 * @Desc: 节点名称
-->
<template>
  <span class="taskNode" :style="taskStyle">
    {{ name }}
  </span>
</template>

<script>
export default {
  components: {},

  props: {
    name: String,
    mode: {
      type: String,
      default: 'IN_PROGRESS'
    }
  },

  data() {
    return {
      typeArry: [
        {
          name: '进行中',
          color: '#34C7BE',
          bgColor: '#34C7BE',
          status: 'IN_PROGRESS'
        },
        {
          name: '被驳回',
          color: '#EE5E5E',
          bgColor: '#FFEAEB',
          status: 'REJECTED'
        },
        {
          name: '已完成',
          color: '#4689F5',
          bgColor: '#E5F0FF',
          status: 'COMPLETED'
        },
        {
          name: '已完成',
          color: '#F5B034',
          bgColor: '#bd892c',
          status: 'REVOKED'
        }
      ]
    };
  },

  computed: {
    taskStyle() {
      const { typeArry, mode } = this;
      const typeObj = typeArry.find((item) => item.status === mode) || typeArry[0];

      const { bgColor } = typeObj;
      return {
        background: bgColor
      };
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.taskNode {
  display: inline-block;
  padding: 10rpx 20rpx;
  color: #fff;
  font-size: 28rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  border-radius: 23px;
  letter-spacing: 1px;
}
</style>
