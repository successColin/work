<template>
  <section class="fullScreen" :class="[{ notConfig: !isConfig }]">
    <tab-main
      :configData.sync="configData.children[0]"
      :activeObj.sync="activeObj"
      :hasTriggerComp="hasTriggerComp"
      :showType="showType"
    ></tab-main>
  </section>
</template>

<script>
export default {
  props: {
    configData: {
      type: [Array, Object]
    },
    activeObj: {
      type: [Array, Object]
    },
    hasTriggerComp: {
      type: Object
    },
    showType: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {};
  },

  components: {},
  inject: ['isConfig'],
  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.fullScreen {
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px;
  height: 100%;
  background-color: #fff;
  &.notConfig {
    padding: 0;
  }
}
</style>
