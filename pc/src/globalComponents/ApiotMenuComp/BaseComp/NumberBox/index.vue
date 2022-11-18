<template>
  <div
    class="numberBox"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      v-if="!isTable"
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

      <el-input
        :placeholder="configData.placeholder"
        v-model="parent.form[configData.compId]"
        v-onlyNumber="configData.numberType"
        v-remainNumber
        v-fixedPlace="configData.numberType === 2 && configData.decimalPlaces"
        :disabled="configData.canReadonly"
        ref="valueInput"
        @blur="valueBlur"
      >
        <template
          slot="prepend"
          v-if="configData.decorateContent && configData.decorateType === 1"
          >{{ configData.decorateContent }}</template
        >
        <template
          slot="append"
          v-if="configData.decorateContent && configData.decorateType === 2"
          >{{ configData.decorateContent }}</template
        >
      </el-input>
      <div class="numberBox__box" v-if="false">
        <span
          class="numberBox__box--left"
          v-if="configData.decorateContent && configData.decorateType === 1"
        >
          {{ configData.decorateContent }}</span
        >
        <el-input-number
          class="numberBox__box--num"
          :class="[
            { showLeft: configData.decorateType === 1 },
            { showRight: configData.decorateType === 2 },
          ]"
          :placeholder="configData.placeholder"
          v-model="parent.form[configData.compId]"
          :precision="
            configData.numberType === 2 ? configData.decimalPlaces : 0
          "
          :disabled="configData.canReadonly"
          :controls="false"
          ref="valueInput"
          @blur="valueBlur"
        ></el-input-number>
        <span
          class="numberBox__box--right"
          v-if="configData.decorateContent && configData.decorateType === 2"
          >{{ configData.decorateContent }}</span
        >
      </div>

      <el-input
        v-if="configData.thousandSign && canShowRes"
        :placeholder="configData.placeholder"
        :value="showRes"
        readonly
        :disabled="configData.singleStatus === 2"
        class="showRes"
        @focus="resFocus"
      >
        <template
          slot="prepend"
          v-if="configData.decorateContent && configData.decorateType === 1"
          >{{ configData.decorateContent }}</template
        >
        <template
          slot="append"
          v-if="configData.decorateContent && configData.decorateType === 2"
          >{{ configData.decorateContent }}</template
        >
      </el-input>
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
  data() {
    return {
      curCompType: 2,
      canShowRes: true
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    showRes() {
      let inputValue = this.parent.form[this.configData.compId].toString();
      const index = inputValue.indexOf('.');
      if (index !== -1) {
        const intNum = inputValue.substring(0, index).replace(/\B(?=(?:\d{3})+$)/g, ',');
        const dot = inputValue.substring(index, inputValue.length);
        inputValue = intNum + dot;
      } else {
        inputValue = inputValue.substring(0, inputValue.length).replace(/\B(?=(?:\d{3})+$)/g, ',');
      }
      return inputValue;
    }
  },

  mounted() {},

  methods: {
    resFocus() {
      this.canShowRes = false;
      this.$refs.valueInput.focus();
    },
    valueBlur() {
      this.canShowRes = true;
      if (this.parent.form[this.configData.compId] !== '') {
        let minNumber = '';
        const minObj = this.configData.minNumberObj;
        if (minObj) {
          if (minObj.enable) {
            if (minObj.type === 1) {
              minNumber = minObj.value;
            } else {
              minNumber = this.resolveFormula(true, minObj.formula);
            }
          }
        }
        let maxNumber = '';
        const maxObj = this.configData.maxNumberObj;
        if (maxObj) {
          if (maxObj.enable) {
            if (maxObj.type === 1) {
              maxNumber = maxObj.value;
            } else {
              maxNumber = this.resolveFormula(true, maxObj.formula);
            }
          }
        }
        // 有最大值 无最小值
        if (maxNumber !== '' && minNumber === '') {
          if (this.parent.form[this.configData.compId] > maxNumber) {
            this.parent.form[this.configData.compId] = maxNumber;
          }
        }
        // 有最小值 无最大值
        if (maxNumber === '' && minNumber !== '') {
          if (this.parent.form[this.configData.compId] < minNumber) {
            this.parent.form[this.configData.compId] = minNumber;
          }
        }
        if (maxNumber !== '' && minNumber !== '') {
          if (this.parent.form[this.configData.compId] < minNumber) {
            this.parent.form[this.configData.compId] = minNumber;
          }
          if (this.parent.form[this.configData.compId] > maxNumber) {
            this.parent.form[this.configData.compId] = maxNumber;
          }
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.numberBox {
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
  &__box {
    display: flex;
    align-items: center;
    height: 32px;
    &--num {
      flex: 1;
      line-height: 30px;
      &.showLeft {
        ::v-deep {
          .el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
      &.showRight {
        ::v-deep {
          .el-input__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
      }
      ::v-deep {
        .el-input__inner {
          text-align: left;
        }
      }
    }
    &--left,
    &--right {
      height: 32px;
      box-sizing: border-box;
      color: #333;
      padding: 0 10px;
      background-color: #fff;
      color: #666666;
      border: 1px solid #e9e9e9;
    }
    &--left {
      border-right: 0 none;
    }
    &--right {
      border-left: 0px none;
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
      .el-input-group__append,
      .el-input-group__prepend {
        color: #333;
        padding: 0 10px;
        background-color: #fff;
      }
      .el-input-group__append {
        border-left: 0px;
        border-right: 1px solid #e9e9e9;
      }
    }
  }
  .showRes {
    position: absolute;
    top: 0;
    left: 0;
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
