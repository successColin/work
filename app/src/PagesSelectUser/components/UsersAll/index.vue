<!--
 * @Author: sss
 * @Date: 2022-06-10 11:32:21
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 11:32:21
 * @Desc: 所有用户
-->
<template>
  <section class="usersAll">
    <users-list ref="usersList"></users-list>
  </section>
</template>

<script>
import UsersList from '../UsersList';

export default {
  name: 'usersAll',

  components: {
    UsersList
  },

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    listenOp(params) {
      const { type } = params;
      if (type === 'onPullDownRefresh') this.$refs.usersList.loadUsersList();
      else if (type === 'userSearch') this.$refs.usersList.getUserList();
      else this.$refs.usersList.loadNextUsersList();
    }
  },

  mounted() {
    this.$bus.$on('SelectUser_ALL', this.listenOp);
  },

  created() {},

  beforeDestroy() {
    this.$bus.$off('SelectUser_ALL');
  }
};
</script>
