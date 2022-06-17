<!--
 * @Author: sss
 * @Date: 2022-06-11 14:31:52
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-11 14:31:52
 * @Desc: 角色列表
-->
<template>
  <section class="roles">
    <div class="roles__item" v-for="(item, index) in listData" :key="index">
      <roles :group="item"></roles>
    </div>
  </section>
</template>

<script>
import { getRoleGroup } from '@/api/pagesSelectUser.js';

import Roles from '../Roles';

export default {
  components: { Roles },

  props: {},

  data() {
    return {
      listData: []
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
    }
  },

  mounted() {},

  created() {
    this.getRoleGroup();
  }
};
</script>

<style lang='scss' scoped>
</style>
