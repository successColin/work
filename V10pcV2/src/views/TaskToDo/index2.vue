/**
* @name: index
* @author: DELL
* @date: 2021/9/23 14:33
* @description：index
* @update: 2021/9/23 14:33
*/
<!-- 页面 -->
<template>
  <apiot-tabs
      v-on="$listeners"
      v-bind="$attrs"
      @handleReturn="close"
      :tabsArr="tabsCount"
  >
    <template v-slot:LeaveItToMe>
      <div class="approvalPanel">
        <left ref="left" @switching_process_types="click"/>
        <ApproveList
            @flow_End_of_operation="closeChange"
            ref="ApproveList"
            @closeApproval="close"
            v-on="$listeners"
            v-bind="$attrs"/>
      </div>
    </template>
  </apiot-tabs>
</template>

<script>
// const ApproveList = () => import('./Components/approveList');
import ApproveList from './Components/approveList';
import left from './Components/left';

export default {
  props: {
    activeName: {
      type: String,
      default: 'LeaveItToMe'
    }
  },
  data() {
    return {
      tabsCount: [
        {
          total: 0,
          compName: 'LeaveItToMe',
          key: 'LeaveItToMe',
        },
      ],
    };
  },

  components: {
    left,
    ApproveList
  },
  watch: {},

  computed: {},

  mounted() {
  },

  methods: {
    closeChange() {
      this.$refs.left.init();
      this.$emit('changeMessage');
    },
    click(key) {
      this.$refs.ApproveList.setComAndChange(key);
    },
    close() {
      this.$refs.left.init();
      this.$emit('changeMessage');
    },
  },
};
</script>

<style lang='scss' scoped>
.approvalPanel {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  box-sizing: border-box;
  box-shadow: inset -1px 0px 0px 0px #E9E9E9;
}

::v-deep {
  .el-tabs__item {
    padding: 0 30px;
  }

  #tab-IInitiatedIt {
    padding-left: 60px;

    &::after {
      content: '|';
      color: #E0E0E0;
      position: absolute;
      left: 10px;
      font-weight: normal;
    }
  }
}
</style>
