<!-- 角色管理 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <list :sideWidth="239"></list>
    </template>
    <template>
      <announce-content></announce-content>
    </template>
  </apiot-content>
</template>

<script>
import list from './components/list/index';
import announceContent from './components/content/index';

export default {
  name: 'role',
  data() {
    return {};
  },

  components: {
    list,
    announceContent
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
