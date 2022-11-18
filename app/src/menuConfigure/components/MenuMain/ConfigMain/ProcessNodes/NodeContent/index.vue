<!--
 * @Author: sss
 * @Date: 2022-05-30 11:53:14
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-30 11:53:14
 * @Desc: 节点信息-递归函数
-->
<template>
  <view>
    <section class="nodeContent">
      <header class="nodeContent__header">
        <div class="nodeContent__header__user" v-if="userInfo">
          <apiot-userhead :userInfo="userInfo" :size="50"></apiot-userhead>
        </div>
        <div class="nodeContent__header__title">
          <span>{{ title }}</span>
        </div>
        <div
          class="referral"
          v-if="content.executCommand === 'REFERRAL' && childUsers.length > 0"
        >
          <span v-for="(user, index) in childUsers" :key="index">
            <apiot-userhead :userInfo="user" :size="50"></apiot-userhead>
          </span>
        </div>
      </header>
      <p class="nodeContent__time" v-if="time">
        {{ $apiot.dateFormat(time, 'yyyy-MM-dd hh:mm') }}
      </p>
      <p
        class="nodeContent__explain"
        v-if="content.executCommand === 'REFERRAL' && content.memo"
      >
        转审说明：{{ content.memo }}
      </p>

      <div
        class="nodeContent__header__endorsement"
        v-if="content.executCommand !== 'REFERRAL' && childUsers.length > 0"
      >
        并对
        <span
          class="endorsement"
          v-for="(user, index) in childUsers"
          :key="index"
        >
          <apiot-userhead :userInfo="user" :size="50"></apiot-userhead>
        </span>
        加签
      </div>

      <p class="nodeContent__explain tip" v-if="multiApprovalType">
        说明：{{ multiApprovalType | explain }}
      </p>
    </section>
    <div class="nodeChild" v-if="childUsers.length > 0">
      <node-content
        v-for="(item, index) in childUsers"
        :key="index"
        :content="item"
        :taskType="taskType"
        :multiApprovalType="multiApprovalType"
      ></node-content>
    </div>
  </view>
</template>

<script>
import NodeContent from '../NodeContent';

export default {
  name: 'nodeContent',

  components: { NodeContent },

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
    childUsers() {
      const { children = [] } = this.content;
      const userArray = [];
      children.forEach((user) => {
        const { handUserName, handUserId } = user;
        // 去重，加签的人员可能重复
        const index = userArray.findIndex((item) => item.handUserId === user.handUserId);
        if (index === -1) userArray.push({ userId: handUserId, username: handUserName, ...user });
      });
      return userArray;
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
  margin: 10rpx 0;
  padding: 30rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e9e9e9;
  &__header {
    display: inline-flex;
    align-items: center;
    div {
      display: inline-block;
    }
    &__title {
      margin-left: 10rpx;
      font-size: 32rpx;
      font-family: $--font-family;
      color: #333333;
    }

    &__endorsement {
      margin-top: 10rpx;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      font-size: 32rpx;
      .endorsement {
        margin-left: 10rpx;
        &:last-child {
          margin-right: 10rpx;
        }
      }
    }
    .referral {
      margin-left: 10rpx;
    }
  }

  &__time {
    margin: 12rpx 0 0 6rpx;
    font-size: 28rpx;
    font-family: $--font-family;
    color: #808080;
    line-height: 36rpx;
  }

  &__explain {
    margin: 12rpx 0 0 6rpx;
    font-size: 32rpx;
    font-family: $--font-family;
    color: #333333;
    line-height: 40rpx;
    &.tip {
      color: #808080;
    }
  }
}
</style>
