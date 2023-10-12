<!-- 角色管理 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <list :sideWidth="239"></list>
    </template>
    <template>
      <article-content></article-content>
    </template>
  </apiot-content>
</template>

<script>
import list from './components/list/index';
import articleContent from './components/content/index';

export default {
  name: 'role',
  data() {
    return {};
  },

  components: {
    list,
    articleContent
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
