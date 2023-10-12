<template>
  <div
    class="InductionNFCBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <section class="nfc" :class="[{ isConfig: isConfig }]">
      <i class="iconfont icon-NFC"></i>
      <span> {{ configData.name }} </span>
    </section>
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
.InductionNFCBox {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .nfc {
    margin: 4px 15px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    border: 1px solid #e9e9e9;
    border-radius: 6px;
    .iconfont {
      display: inline-block;
      font-size: 20px;
      color: $--color-primary;
    }
  }
}
</style>
