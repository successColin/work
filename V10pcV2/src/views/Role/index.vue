<!-- 角色管理 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <role-list :sideWidth="239"></role-list>
    </template>
    <template>
      <role-content></role-content>
    </template>
  </apiot-content>
</template>

<script>
import RoleList from '@/views/Role/List/list';
import RoleContent from '@/views/Role/RoleContent/roleList';

export default {
  name: 'role',
  data() {
    return {};
  },

  components: {
    RoleList,
    RoleContent
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
