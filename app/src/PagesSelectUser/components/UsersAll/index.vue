<!--
 * @Author: sss
 * @Date: 2022-06-10 11:32:21
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 11:32:21
 * @Desc: 所有用户
-->
<template>
  <section class="usersAll">
    <user-card
      v-for="(user, index) in users"
      :key="index"
      :value="user"
    ></user-card>
  </section>
</template>

<script>
import UserCard from '../UserCard';

export default {
  name: 'usersAll',

  inject: ['GetSelectUsers'],

  components: {
    UserCard
  },

  props: {
    users: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {},

  created() {}
};
</script>

<style lang='scss' scoped>
</style>
