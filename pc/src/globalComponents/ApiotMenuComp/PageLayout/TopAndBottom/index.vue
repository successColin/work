<template>
  <section class="topAndBottom" :class="[{ notConfig: !isConfig }]">
    <div class="topAndBottom__top" :style="`flex:${configData.topHeight}`">
      <tab-main
        :configData.sync="configData.children[0]"
        :activeObj.sync="activeObj"
        :hasTriggerComp="hasTriggerComp"
      ></tab-main>
    </div>
    <div
      class="topAndBottom__bottom"
      :style="`flex:${configData.bottomHeight}`"
    >
      <tab-main
        :configData.sync="configData.children[1]"
        :activeObj.sync="activeObj"
        :hasTriggerComp="hasTriggerComp"
      ></tab-main>
    </div>
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
    }
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
.topAndBottom {
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  &__top {
    flex: 1;
    margin-bottom: 10px;
    overflow: hidden;
  }
  &__bottom {
    flex: 1;
    overflow: hidden;
  }
  &.notConfig {
    padding: 0;
    .topAndBottom__top {
      box-sizing: border-box;
      border-bottom: 1px solid #e9e9e9;
    }
    ::v-deep {
      .inBottom {
        .btnsArea {
          height: 42px !important;
        }
      }
    }
  }
}
</style>
