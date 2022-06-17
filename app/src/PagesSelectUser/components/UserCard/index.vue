<!--
 * @Author: sss
 * @Date: 2022-06-10 15:34:35
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 15:34:35
 * @Desc: 人员
-->
<template>
  <div class="userCard">
    <div class="userCard__left">
      <i
        class="appIcon"
        :class="[
          isCollection ? 'appIcon-yishoucang collection' : 'appIcon-shoucang',
        ]"
        @tap.stop="cancelUserCollection"
      ></i>
    </div>
    <div class="userCard__content">
      <div class="userCard__content__userIcon">
        <user-icon
          v-if="userInfo"
          :userInfo="userInfo"
          :size="68"
          :fontSize="30"
        ></user-icon>
      </div>
      <p class="username">{{ value.username }}</p>
      <i
        class="userCard__content__checkbox"
        :class="[
          checked
            ? `appIcon appIcon-a-fuxuankuangxuanzhong themeColor__font-${getThemeIndex}`
            : 'nochecked',
        ]"
        @click.stop="checkUser"
      ></i>
    </div>
  </div>
</template>

<script>
import { cancelUserCollection, addUserCollection } from '@/api/pagesSelectUser.js';

import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';

export default {
  name: 'userCard',

  inject: ['CollectionUsers', 'RefreshCollectionUsers', 'GetSelectUsers', 'cancelOrAddSelectUsers'],

  components: { UserIcon },

  props: {
    value: Object,
    // 唯一标识
    checkFlagId: {
      type: String,
      default: 'id'
    }
  },

  data() {
    return {};
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 选中的人员
    checkList() {
      return this.GetSelectUsers();
    },
    // 收藏列表
    collectionUsers() {
      return this.CollectionUsers();
    },
    isCollection() {
      const { collectionUsers, checkFlagId, value } = this;
      const index = collectionUsers.findIndex(
        (item) => `${item[checkFlagId]}` === `${value[checkFlagId]}`
      );
      return index !== -1;
    },
    userInfo() {
      const { username, id, icon } = this.value;
      if (!id) return '';
      return { userId: id, username, icon };
    },
    checked() {
      const { checkList, value, checkFlagId } = this;
      if (!checkFlagId) return;
      const index = checkList.findIndex(
        (item) => `${item[checkFlagId]}` === `${value[checkFlagId]}`
      );
      return index !== -1;
    }
  },

  methods: {
    // 取消收藏
    async cancelUserCollection() {
      try {
        const { id, username } = this.value;

        let type = '收藏';
        if (this.isCollection) type = '取消收藏';
        const logData = `${type}用户:(用户名称:${username})`;

        if (this.isCollection) await cancelUserCollection({ userId: id, logData });
        else await addUserCollection({ collectionUserId: id, logData });

        this.RefreshCollectionUsers();
      } catch (error) {
        console.error(error);
      }
    },
    // 选择人员
    checkUser() {
      const { checked, value } = this;
      this.cancelOrAddSelectUsers(value, checked);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.userCard {
  padding-right: 30rpx;
  background: #fff;
  display: flex;
  align-items: center;
  &__left {
    padding: 30rpx;

    .appIcon {
      font-size: 34rpx;
      color: #e9e9e9;
      &.collection {
        color: #fab71c;
      }
    }
  }
  &__content {
    flex: 1;
    padding: 26rpx 0;
    display: flex;
    align-items: center;
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
    overflow: hidden;
    &__userIcon {
      margin-right: 36rpx;
      flex-shrink: 0;
    }
    .username {
      margin-right: 10rpx;
      flex: 1;
      font-size: 32rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #333333;
      line-height: 40rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__checkbox {
      font-size: 16px;
      &.nochecked {
        &::after {
          content: '';
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid #d9d9d9;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
