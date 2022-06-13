<!--
 * @Author: sss
 * @Date: 2022-05-30 11:53:14
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-30 11:53:14
 * @Desc: 节点信息
-->
<template>
  <section class="nodeContent">
    <header class="nodeContent__header">
      <div class="nodeContent__header__user" v-if="userInfo">
        <apiot-userhead :userInfo="userInfo" :size="50"></apiot-userhead>
      </div>
      <div class="nodeContent__header__title">
        <span>{{ title }}</span>
      </div>
    </header>
    <p class="nodeContent__time" v-if="time">
      {{ $apiot.dateFormat(time, 'yyyy-MM-dd hh:mm') }}
    </p>
    <p class="nodeContent__explain" v-if="multiApprovalType">
      说明：{{ multiApprovalType | explain }}
    </p>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    content: Object,
    taskType: Number,
    multiApprovalType: String
  },

  data() {
    return {};
  },

  computed: {
    isEnd() {
      const { taskType } = this.content;
      return taskType === 999;
    },
    time() {
      const { isEnd } = this;
      const { handTime, executTime } = this.content;
      if (isEnd) return handTime;
      return executTime;
    },
    userInfo() {
      const { handUserName, handUserId } = this.content;
      if (!handUserId) return '';
      return { userId: handUserId, username: handUserName };
    },
    title() {
      const { taskType } = this;

      let title = '';
      if (taskType === 1) title = '发起流程';
      else if (taskType === 999) title = '流程结束';
      else {
        const { taskStatus, executCommand } = this.content;
        if (taskStatus === 2) title = '跳过';
        else title = '待处理';

        if (executCommand === 'REFERRAL') title = '转审给';
        else if (executCommand === 'REJECT') title = '审批驳回';
        else if (executCommand === 'AGREE') title = '审批同意';
        else if (executCommand === 'SUBMIT') title = '提交';
      }
      return title;
    }
  },

  methods: {},

  mounted() {},

  filters: {
    explain(type) {
      const arry = [
        // 审批类型，用于流程
        { name: '或签(一名审批人通过或否决即可)', value: 'ONE_PASS_OR_REJECT' },
        { name: '会签(需所有审批人通过)', value: 'ALL_PASS_OR_REJECT' },
        {
          name: '会签(需一名审批人通过，否决需全员否决)',
          value: 'ONE_PASS_OR_ALL_REJECT'
        }
      ];
      const typeObj = arry.find((item) => item.value === type) || {};
      return typeObj.name || '';
    }
  }
};
</script>

<style lang='scss' scoped>
.nodeContent {
  padding: 30rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e9e9e9;
  &__header {
    display: inline-flex;
    div {
      display: inline-block;
    }
    &__title {
      margin-left: 10rpx;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      span {
        display: inline-block;
        vertical-align: -10rpx;
      }
    }
  }

  &__time {
    margin: 12rpx 0 0 6rpx;
    font-size: 28rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #808080;
    line-height: 36rpx;
  }

  &__explain {
    margin: 12rpx 0 0 6rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;
    line-height: 40rpx;
  }
}
</style>
