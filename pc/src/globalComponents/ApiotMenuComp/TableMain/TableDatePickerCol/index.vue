<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="configData.dataSource.columnName"
    v-show="false"
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
      ></FilterCol>
    </template>
    <div slot-scope="scope">
      <div
        class="editable"
        v-if="
          areaData.lineEditable &&
          showCell === `${scope.column.id}_${scope.row.unique}`
        "
      >
        <el-date-picker
          type="date"
          :placeholder="configData.placeholder"
          value-format="yyyy-MM-dd"
          v-model="tableData[scope.$index][configData.compId]"
          :disabled="configData.canReadonly"
          :picker-options="pickerOptions"
          popper-class="tableDatePicker"
          @focus="visibleChange(true)"
          @blur="visibleChange(false)"
          @change="valueChange(scope.$index)"
        >
        </el-date-picker>
      </div>
      <div class="notEditable" v-else>{{ scope.row[configData.compId] }}</div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  name: '',
  mixins: [tableCol],
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          if (this.configData.minTime && this.configData.maxTime) {
            return (
              time.getTime() < this.configData.minTime || time.getTime() > this.configData.maxTime
            );
          }
          if (this.configData.minTime && !this.configData.maxTime) {
            return time.getTime() < this.configData.minTime;
          }
          if (!this.configData.minTime && this.configData.maxTime) {
            return time.getTime() > this.configData.maxTime;
          }
          return false;
        }
      }
    };
  },
  components: {},
  mounted() {
    // console.log(this.areaData);
  }
};
</script>

<style lang='scss' scoped>
@import '../col.scss';
</style>
<style lang='scss'>
.tableDatePicker {
  .popper__arrow {
    display: none !important;
  }
  &.el-picker-panel {
    margin: 1px 0 !important;
  }
}
</style>
