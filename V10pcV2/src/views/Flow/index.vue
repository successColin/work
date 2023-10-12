<!-- 角色管理 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <role-list :sideWidth="239"></role-list>
    </template>
    <template>
      <flow-content></flow-content>
    </template>
  </apiot-content>
</template>

<script>
import RoleList from './List/list';
import FlowContent from './Content/index';

export default {
  name: 'role',
  data() {
    return {};
  },

  components: {
    RoleList,
    FlowContent
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
