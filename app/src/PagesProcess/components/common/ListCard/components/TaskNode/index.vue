<!--
 * @Author: sss
 * @Date: 2022-05-25 16:09:15
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 16:09:15
 * @Desc: 节点名称
-->
<template>
  <span class="taskNode" :style="taskStyle">
    {{ showName }}
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
          color: '#fff',
          bgColor: '#34C7BE',
          status: 'IN_PROGRESS'
        },
        {
          name: '被驳回',
          color: '#333333',
          bgColor: '#FFEAEB',
          status: 'REJECTED'
        },
        {
          name: '已完成',
          color: '#333333',
          bgColor: '#E5F0FF',
          status: 'COMPLETED'
        },
        {
          name: '已完成',
          color: '#333333',
          bgColor: '#bd892c',
          status: 'REVOKED'
        }
      ]
    };
  },

  computed: {
    showName() {
      const { mode, name } = this;
      if (mode !== 'IN_PROGRESS') return '流程结束';
      return name;
    },
    taskStyle() {
      const { typeArry, mode } = this;
      const typeObj = typeArry.find((item) => item.status === mode) || typeArry[0];

      const { bgColor, color } = typeObj;
      return {
        background: bgColor,
        color
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
  font-family: $--font-family;
  border-radius: 23px;
  letter-spacing: 1px;
}
</style>
