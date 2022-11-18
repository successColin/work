<!--
 * @Author: sss
 * @Date: 2022-06-11 14:54:10
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-11 14:54:10
 * @Desc: 角色
-->
<template>
  <section class="roles">
    <div class="roles__title" @click.stop="showRoles()">
      <span> {{ group.name }}</span>
      <i
        class="appIcon appIcon-a-shujuxuanzejinru"
        :class="[isExpand ? 'rotate' : '']"
      ></i>
    </div>
    <div class="roles__content" v-if="isExpand">
      <p
        class="roles__content--item"
        v-for="(role, index) in roleData"
        :key="index"
        @click.stop="clickRole(role)"
      >
        <i class="appIcon appIcon-jiaose"></i>
        <span class="roleName"
          >{{ role.roleName }}({{
            role.id in treeNodeUsersNumber
              ? treeNodeUsersNumber[role.id].length
              : 0
          }})</span
        >
      </p>
    </div>
  </section>
</template>

<script>
import userMixin from '../../../userMixin';
import { getRoles } from '@/api/pagesSelectUser.js';

export default {
  mixins: [userMixin],
  components: {},

  props: {
    group: Object,
    groupLoading: Boolean
  },

  data() {
    return {
      roleData: [],
      isExpand: false,
      treeNodeUsersNumber: {}
    };
  },

  computed: {},

  watch: {
    groupLoading(status) {
      // 只有下拉加载时，group才能重新加载
      // group重新加载的时候，已经展开group需要重新加载角色和人员
      if (status) {
        this.isExpand = false;
        this.roleData = [];
        this.listData = [];
        this.treeNodeUsersNumber = {};
      }
    }
  },

  methods: {
    // 获取用户
    async getUsers() {
      await this.getUserList();
      const { listData } = this;
      const obj = {};

      listData.forEach((user) => {
        const { roleIds } = user;
        const roleArry = roleIds.split(',');
        roleArry.forEach((role) => {
          const arry = obj[role] || [];
          arry.push(user);
          obj[role] = arry;
        });
      });
      this.treeNodeUsersNumber = { ...obj };
    },
    async showRoles(isReload = false) {
      const { id } = this.group;
      if (this.listData.length === 0 || isReload) {
        this.otherParam = {
          searchType: 2,
          roleGroupId: id
        };
        this.getUsers();
      }
      if ((!this.isExpand && this.roleData.length === 0) || isReload) {
        await this.getRoles(id);
      }
      if (!isReload) this.isExpand = !this.isExpand;
    },
    async getRoles(groupId) {
      try {
        const result = await getRoles({ groupId });
        this.roleData = [...result];
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    },
    clickRole(role) {
      const users = this.treeNodeUsersNumber;
      this.$emit('click', { role, users });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.roles {
  background: #fff;
  padding: 0 30rpx;
  &__title {
    padding: 30rpx 0;
    display: flex;
    align-items: center;
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
    span {
      font-size: 32rpx;
      font-family: $--font-family;
      color: #333333;
      flex: 1;
    }
    .appIcon {
      font-size: 48rpx;
      color: #bbc3cd;
      &.rotate {
        transform: rotateZ(90deg);
        color: #4689f5;
      }
    }
  }

  &__content {
    &--item {
      padding: 25rpx 0;
      display: flex;
      align-items: center;
      box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
      .appIcon {
        font-size: 60rpx;
        color: #ee5e5e;
        margin-right: 10rpx;
      }
      .roleName {
        font-size: 32rpx;
        font-family: $--font-family;
        color: #333333;
        line-height: 40rpx;
      }
    }
  }
}
</style>
