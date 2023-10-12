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
        <i v-if="!isOperation" class="appIcon appIcon-a-shujuxuanzejinru"></i>

        <u-checkbox
          v-else
          :key="value.taskId"
          :name="value.taskId"
          class="userloginManage__checkobx"
        >
        </u-checkbox>
      </div>
    </header>
    <div class="listCard__content">
      <header class="listCard__content__header">
        <div class="listCard__content__header__user">
          <apiot-userhead :userInfo="userInfo" :size="50"></apiot-userhead>
        </div>
        <div class="listCard__content__header__title">
          <span>{{ value.instanceName }}</span>
        </div>
      </header>

      <div class="listCard__content__desc">
        <p v-for="(item, index) in taskDesc" :key="index">
          <span class="name">{{ item.key }}：</span>
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
    },
    isOperation: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      isOnlyUnread: false
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    userInfo() {
      const { triggerUserName, triggerUserId } = this.value;
      return { userId: triggerUserId, username: triggerUserName };
    },
    taskDesc() {
      const { taskDesc } = this.value;
      if (!taskDesc || taskDesc === '{}') {
        return [];
      }
      return JSON.parse(taskDesc);
    }
  },

  methods: {
    clickNode() {
      this.$emit('clickNode', this.value);
    },
    checkedItem() {
      let check = [...this.checkList];
      const { getComp, value } = this;
      const { compId } = getComp;
      const index = check.findIndex((item) => `${item[compId]}` === `${value[compId]}`);
      if (index === -1) {
        const selectDataConfig = this.selectDataConfig();
        // 是否多选
        if (selectDataConfig.multiple) check.push(value);
        else check = [value];
      } else check.splice(index, 1);
      this.$emit('update:checkList', check);
      this.$emit('checkedCard', value, check);
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
    padding: 28rpx 0 24rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: inset 0 -1rpx 0 0 #e0e0e0;
    &--right {
      display: flex;
      font-size: 28rpx;
      font-family: $--font-family;
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
      align-items: flex-start;
      div {
        display: inline-block;
      }
      &__title {
        margin-left: 10rpx;
        font-size: 32rpx;
        font-family: $--font-family;
        color: #333333;
      }
    }

    &__desc {
      margin-top: 18rpx;
      font-size: 24rpx;
      font-family: $--font-family;
      color: #808080;
      line-height: 34rpx;
    }
  }
}
.checkboxVisibility {
  visibility: hidden;
}
.userloginManage__checkobx {
  ::v-deep {
    .u-checkbox__icon-wrap {
      margin-right: 0;
      margin-left: 10rpx;
    }
  }
}
</style>
