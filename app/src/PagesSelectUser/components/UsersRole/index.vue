<!--
 * @Author: sss
 * @Date: 2022-06-11 14:24:16
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-11 14:24:16
 * @Desc: 按角色筛选
-->
<template>
  <view class="usersRole">
    <section class="usersRole__roleList" :class="{ hasOverflow: show }">
      <div class="roles__item" v-for="(item, index) in listData" :key="index">
        <roles
          :group="item"
          :groupLoading="groupLoading"
          @click="clickRole"
        ></roles>
      </div>
    </section>
    <roles-user-modal
      :show.sync="show"
      :role="role"
      :users="users"
    ></roles-user-modal>
  </view>
</template>

<script>
import { getRoleGroup } from '@/api/pagesSelectUser.js';
import Roles from './components/Roles';
import RolesUserModal from './components/RolesUserModal';

export default {
  components: { Roles, RolesUserModal },

  props: {},

  data() {
    return {
      listData: [],
      show: false,
      groupLoading: false,
      role: {},
      users: []
    };
  },

  computed: {},

  methods: {
    async getRoleGroup() {
      try {
        const result = await getRoleGroup();
        this.listData = [...result];
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    },
    clickRole(param) {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 10
        });
        const { id } = param.role;
        this.role = param.role;
        this.users = param.users[id];
        this.show = true;
      });
    },
    async listenOp(params) {
      const { type } = params;
      if (type === 'onPullDownRefresh' && !this.show) {
        this.groupLoading = true;
        await this.getRoleGroup();
        this.groupLoading = false;
      }
      uni.stopPullDownRefresh();
    }
  },

  mounted() {
    this.getRoleGroup();
    this.$bus.$on('SelectUser_ROLE', this.listenOp);
  },

  beforeDestroy() {
    this.$bus.$off('SelectUser_ROLE');
  }
};
</script>

<style lang='scss' scoped>
.hasOverflow {
  height: 100px;
  overflow: hidden;
}
</style>
