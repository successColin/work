<!--
 * @Author: sss
 * @Date: 2022-05-25 15:22:39
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 15:22:39
 * @Desc: 流程卡片
-->
<template>
  <section class="listCard" @click.stop="clickNode">
    <header class="listCard__header">
      <task-node
        :name="value.taskName"
        :mode="value.instanceStatus"
      ></task-node>
      <div class="listCard__header--right">
        <span class="time">{{ value.triggerTime }}</span>
        <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
      </div>
    </header>
    <div class="listCard__content">
      <header class="listCard__content__header">
        <div class="listCard__content__header__user">
          <apiot-userhead :userInfo="userInfo" :size="50"></apiot-userhead>
        </div>

        <div class="listCard__content__header__title">
          <!-- 德国进口的风格和立法考了几分感慨国家的疯狂 -->
          <span>{{ value.instanceName }}【{{ value.menuName || '' }}】</span>
        </div>
      </header>

      <div class="listCard__content__desc">
        <p v-for="(item, index) in taskDesc" :key="index">
          <span class="name">{{ item.name }}：</span>
          <span class="value">{{ item.value }}</span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import TaskNode from './components/TaskNode';

export default {
  components: { TaskNode },

  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {
    userInfo() {
      const { triggerUserName, triggerUserId } = this.value;
      return { userId: triggerUserId, username: triggerUserName };
    },
    taskDesc() {
      const { taskDesc } = this.value;
      if (!taskDesc || taskDesc === '{}') {
        return [
          { name: '工单名称', value: '发动机涡轮故障的身高和艰苦大师傅高科技的风格的设计和' }
        ];
      }
      const taskDescObj = JSON.parse(taskDesc);

      const taskDescArry = [];
      Object.keys(taskDescObj).forEach((key) => {
        taskDescArry.push({
          name: key,
          value: taskDescObj[key]
        });
      });
      return taskDescArry;
    }
  },

  methods: {
    clickNode() {
      this.$emit('clickNode', this.value);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.listCard {
  margin: 20rpx 30rpx 0 30rpx;
  padding: 0 30rpx;
  background: #fff;
  box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.08);
  border-radius: 12rpx;
  &__header {
    padding: 30rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0 -1rpx 0 0 #e0e0e0;
    &--right {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #aaaaaa;
      .time {
        vertical-align: 4rpx;
      }
      .appIcon {
        font-size: 38rpx;
      }
    }
  }
  &__content {
    padding: 30rpx 0;
    &__header {
      display: inline-flex;
      // align-items: center;
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

    &__desc {
      margin-top: 18rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #808080;
      line-height: 34rpx;
    }
  }
}
</style>
