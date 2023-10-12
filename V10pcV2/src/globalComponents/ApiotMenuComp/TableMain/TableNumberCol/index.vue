<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.compId"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span
          :class="[
            {
              'is-required': areaData.lineEditable && configData.shouldRequired,
            },
          ]"
        >
          {{ configData.name }}
        </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <FilterCol
        ref="filterCol"
        :configData="configData"
        :grandFather="grandFather"
        v-if="configData.enableTableSearch && !isPreview"
      ></FilterCol>
    </template>
    <div slot-scope="scope" style="width: 100%">
      <SelectBox
        :curData="scope.row"
        :getIdCompId="getIdCompId"
        :multiEntityArr="multiEntityArr"
        v-if="
          !(
            areaData.lineEditable &&
            showCell === `${scope.column.id}_${scope.row.unique}`
          )
        "
        v-on="$listeners"
        v-bind="$attrs"
      ></SelectBox>
      <div
        class="column__editable"
        v-if="
          areaData.lineEditable &&
          (showCell === `${scope.column.id}_${scope.row.unique}` ||
            clickCell === `${scope.column.id}_${scope.row.unique}`) &&
          !configData.canReadonly
        "
      >
        <el-input
          :placeholder="configData.placeholder"
          v-model="tableData[scope.row.index][configData.compId]"
          v-onlyNumber="configData.numberType"
          v-fixedPlace="configData.numberType === 2 && configData.decimalPlaces"
          :disabled="configData.canReadonly"
          :ref="`valueInput${scope.row.index}`"
          @change="valueBlur(scope.row, scope.row.index)"
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
        <el-input
          v-if="configData.thousandSign && canShowRes"
          :placeholder="configData.placeholder"
          :value="showRes(scope.row)"
          readonly
          :disabled="configData.singleStatus === 2"
          class="showRes"
          @focus="resFocus(scope)"
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
      </div>
      <div class="column__notEditable" v-else>
        <span
          v-if="
            showRes(scope.row) &&
            configData.decorateContent &&
            configData.decorateType === 1
          "
        >
          {{ configData.decorateContent }}:
        </span>
        {{ showRes(scope.row) }}
        <span
          v-if="
            showRes(scope.row) &&
            configData.decorateContent &&
            configData.decorateType === 2
          "
        >
          {{ configData.decorateContent }}
        </span>
      </div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  props: {
    getIdCompId: {
      type: String,
    },
    multiEntityArr: {
      type: Array,
      default: () => [],
    },
  },
  name: '',
  mixins: [tableCol],
  data() {
    return {
      canShowRes: true,
    };
  },
  computed: {
    showRes() {
      return (row) => {
        let inputValue = +(row[this.configData.compId] * 1).toFixed(
          this.configData.decimalPlaces,
        );
        if (!this.configData.thousandSign) {
          return inputValue;
        }
        inputValue = `${inputValue}`;
        const index = inputValue.indexOf('.');
        if (index !== -1) {
          const intNum = inputValue
            .substring(0, index)
            .replace(/\B(?=(?:\d{3})+$)/g, ',');
          const dot = inputValue.substring(index, inputValue.length);
          inputValue = intNum + dot;
        } else {
          inputValue = inputValue
            .substring(0, inputValue.length)
            .replace(/\B(?=(?:\d{3})+$)/g, ',');
        }
        return row[this.configData.compId] === '' ||
          row[this.configData.compId] == null
          ? ''
          : inputValue;
      };
    },
  },
  components: {},
  mounted() {
    // console.log(this.areaData);
  },
  methods: {
    resFocus(scope) {
      this.canShowRes = false;
      this.$refs[`valueInput${scope.row.index}`].focus();
    },
    valueBlur(row, index) {
      this.canShowRes = true;
      if (row[this.configData.compId] !== '') {
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
          if (row[this.configData.compId] > maxNumber) {
            row[this.configData.compId] = maxNumber;
          }
        }
        // 有最小值 无最大值
        if (maxNumber === '' && minNumber !== '') {
          if (row[this.configData.compId] < minNumber) {
            row[this.configData.compId] = minNumber;
          }
        }
        if (maxNumber !== '' && minNumber !== '') {
          if (row[this.configData.compId] < minNumber) {
            row[this.configData.compId] = minNumber;
          }
          if (row[this.configData.compId] > maxNumber) {
            row[this.configData.compId] = maxNumber;
          }
        }
      }
      this.$nextTick(() => {
        this.tableData[index][this.configData.compId] =
          row[this.configData.compId];
      });
      this.valueChange(index);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../col.scss';
.editable {
  position: relative;
}
.showRes {
  position: absolute;
  top: 0;
  left: 0;
}
::v-deep {
  .el-form-item__label {
    padding-top: 6px;
    line-height: 18px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    display: flex;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    line-height: 30px !important;
    color: #333;
    padding: 0 10px;
    background-color: #fff;
  }
  .el-input-group__append {
    border-left: 0px;
    border-right: 1px solid #e9e9e9;
  }
}
</style>
