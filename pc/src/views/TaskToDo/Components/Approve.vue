/**
* @name: Approve
* @author: DELL
* @date: 2021/9/24 8:59
* @description：Approve
* @update: 2021/9/24 8:59
*/
<!-- 页面 -->
<template>
  <apiot-tabs
      v-on="$listeners"
      v-bind="$attrs"
      :tabsArr="tabsArr"
  >
    <template v-slot:Approve>
      <ApproveView
          :approvalInfo="approvalInfo"
          :nodeConfig="nodeConfig"
          :com="com"
      ></ApproveView>
    </template>
  </apiot-tabs>
</template>

<script>
import ApproveView from './ApproveView/index';

export default {
  props: {
    approvalInfo: {
      type: Object,
      default: () => {
      }
    },
    nodeConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    com: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      tabsArr: [
        {
          label: '',
          compName: 'Approve',
          key: 'Approve'
        }
      ],
    };
  },

  components: { ApproveView },

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'Approve',
};
</script>

<style lang='scss' scoped>
::v-deep{
  .tabs .el-tabs__content{
    background: #FFFFFF;
    box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 16%);
  }
}
</style>
