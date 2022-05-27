<!-- 用户管理 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <left-tree :sideWidth="239"></left-tree>
    </template>
    <template>
      <user-content :userData="userData"></user-content>
    </template>
  </apiot-content>
</template>

<script>
import LeftTree from '@/views/Users/Left/left';
import UserContent from '@/views/Users/Main/user';
import { getUsersState } from '@/api/user';

export default {
  name: 'user',
  data() {
    return {
      userData: {} // 用户状态枚举
    };
  },

  components: {
    LeftTree,
    UserContent
  },

  computed: {},

  mounted() {
    this.fetchState();
  },

  methods: {
    async fetchState() {
      this.userData = await getUsersState({ dictKeys: 'USER_STATE' });
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
