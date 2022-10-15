<template>
  <div
    class="singleBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
      { isCard: isCard },
    ]"
    v-if="showInput"
  >
    <div v-if="isCard" class="cardLine">
      <span v-if="configData.showLabelTitle">{{ configData.name }}：</span>
      <EvaluationShow
        :dividingType="configData.dividingType"
        :showContent="configData.configData"
        :maxScore="configData.maxScore"
        :curValue="labelValue"
        :onlyRead="true"
      ></EvaluationShow>
    </div>
    <el-form-item
      :prop="`${configData.compId}`"
      v-else-if="!isTable"
      :class="[{ onelineCalss__form: isQueryEle }]"
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

      <EvaluationShow
        :dividingType="configData.dividingType"
        :showContent="configData.configData"
        :maxScore="configData.maxScore"
        :curValue="parent.form[configData.compId]"
        @selectScore="selectScore"
      ></EvaluationShow>
    </el-form-item>
    <div class="table" v-else>
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw">数据占位</p>
    </div>
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
  props: {
    labelValue: {
      default: ''
    }
  },
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
    selectScore(v) {
      this.parent.form[this.configData.compId] = v;
    }
  }
};
</script>

<style lang='scss' scoped>
.singleBox {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 35px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.isCard {
    min-height: 44px;
    &.noHover {
      padding: 0;
      min-height: 12px;
      line-height: 1;
    }
    .cardLine {
      display: flex;
      align-items: center;

      span {
        white-space: nowrap;
        color: rgb(51, 51, 51);
        font-size: 13px;
      }
    }
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
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
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    p:nth-child(2) {
      color: #333;
      border-top: 1px solid #e9e9e9;
    }
  }
}
</style>
