<!--
 * @Descripttion: 通用导入
 * @Author: ytx
 * @Date: 2022-06-08 11:14:00
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-08 11:14:00
-->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <left-tree :sideWidth="239"></left-tree>
    </template>
    <template>
      <main-con></main-con>
    </template>
  </apiot-content>
</template>

<script>
import { getUsersState } from '@/api/user';
import LeftTree from './Left';
import MainCon from './Main';

export default {
  name: 'user',
  data() {
    return {};
  },

  components: {
    LeftTree,
    MainCon
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
