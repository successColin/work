<template>
  <component :is="getCompName" v-on="$listeners" v-bind="$attrs"></component>
</template>

<script>
export default {
  name: '',

  data() {
    return {};
  },
  inheritAttrs: false,
  inject: ['isConfig'],
  computed: {
    getCompName() {
      if (this.isConfig) {
        return 'RelateConfig';
      }
      return 'RelateApply';
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
</style>
