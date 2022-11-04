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
        v-for="(role, index) in listData"
        :key="index"
        @click.stop="clickRole(role)"
      >
        <i class="appIcon appIcon-jiaose"></i>
        <span class="roleName">{{ role.roleName }}</span>
      </p>
    </div>
  </section>
</template>

<script>
import { getRoles } from '@/api/pagesSelectUser.js';

export default {
  components: {},

  props: {
    group: Object
  },

  data() {
    return {
      listData: [],
      isExpand: false
    };
  },

  computed: {},

  methods: {
    async showRoles() {
      if (!this.isExpand && this.listData.length === 0) {
        const { id } = this.group;
        await this.getRoles(id);
      }
      this.isExpand = !this.isExpand;
    },
    async getRoles(groupId) {
      try {
        const result = await getRoles({ groupId });
        this.listData = [...result];
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    },
    clickRole(role) {
      this.$emit('click', role);
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
