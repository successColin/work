<template>
  <div
    class="singleBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <DividingShow
      :dividingName="configData.name"
      :showTitle="configData.showLabelTitle"
      :dividingType="configData.dividingType"
    ></DividingShow>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.singleBox {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
}
</style>
