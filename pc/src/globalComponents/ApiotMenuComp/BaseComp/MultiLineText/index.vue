<template>
  <div
    class="multiLineText"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      :class="[{ 'is-required': isConfig && configData.shouldRequired }]"
    >
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>

      <apiot-input
        v-model="parent.form[configData.compId]"
        type="textarea"
        @input="input"
        :rows="configData.maxRow"
        :maxlength="configData.maxlength"
        :placeholder="configData.placeholder"
        :disabled="configData.canReadonly"
        :readonly="configData.singleStatus === 3"
      ></apiot-input>
    </el-form-item>
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

  methods: {
    input() {
      // console.log(this.parent.form);
      // console.log(this.parent.form[this.configData.compId]);
    }
  }
};
</script>

<style lang='scss' scoped>
.multiLineText {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.noHover {
    padding: 0px 15px 18px 35px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
    }
  }
}
</style>
