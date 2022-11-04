<!--
 * @Author: sss
 * @Date: 2022-06-11 14:24:16
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-11 14:24:16
 * @Desc: 按角色筛选
-->
<template>
  <view class="usersRole">
    <section class="usersRole__roleList">
      <div class="roles__item" v-for="(item, index) in listData" :key="index">
        <roles :group="item" @click="clickRole"></roles>
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

  inject: ['SetOtherParam'],

  props: {
    users: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      listData: [],
      show: false,
      role: {}
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
    clickRole(role) {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 10
        });
        this.SetOtherParam({ searchType: 2, roleGroupId: role.id });
        this.role = role;
        this.show = true;
      });
    }
  },

  mounted() {
    this.getRoleGroup();
  }
};
</script>

<style lang='scss' scoped>
</style>
