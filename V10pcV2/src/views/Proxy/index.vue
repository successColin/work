/**
* @name: index
* @author: DELL
* @date: 2023/2/18 13:45
* @description：index
* @update: 2023/2/18 13:45
*/
<!-- 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <leftTree></leftTree>
    </template>
    <template>
      <mainLayout></mainLayout>
    </template>
  </apiot-content>
</template>

<script>
const leftTree = () => import('./Layout/leftTree');
const mainLayout = () => import('./Layout/main');

export default {
  data() {
    return {};
  },

  components: {
    leftTree,
    mainLayout
  },

  computed: {},

  mounted() {},

  methods: {},
  name: 'index',
};
</script>

<style lang='scss' scoped>
</style>
