<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.compId"
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
        v-if="configData.enableTableSearch && !isPreview"
      ></FilterCol>
    </template>
    <div slot-scope="scope" style="width: 100%">
      <div
        class="column__editable"
        v-if="
          areaData.lineEditable &&
          showCell === `${scope.column.id}_${scope.row.unique}` &&
          !configData.canReadonly
        "
      >
        <el-date-picker
          type="datetime"
          :placeholder="configData.placeholder"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="tableData[scope.row.index][configData.compId]"
          :disabled="configData.canReadonly"
          :picker-options="pickerOptions"
          popper-class="tableDatePicker"
          :editable="false"
          @focus="visibleChange(true)"
          @blur="visibleChange(false)"
          @change="valueChange(scope.row.index)"
        >
        </el-date-picker>
      </div>
      <div class="column__notEditable" v-else>
        {{ scope.row[configData.compId] }}
      </div>
    </div>
  </el-table-column>
</template>

<script>
import { formatDate } from '@/utils/utils';
import tableCol from '../tableCol';

export default {
  name: '',
  mixins: [tableCol],
  data() {
    return {
      pickerOptions: {
        disabledDate: (time) => {
          let minTime = '';
          let maxTime = '';
          const minObj = this.configData.minTimeObj;
          const maxObj = this.configData.maxTimeObj;
          if (minObj) {
            if (minObj.type === 1) {
              minTime = minObj.minTime;
            }
            if (minObj.type === 2) {
              const res = this.resolveFormula(true, minObj.formula);
              if (+res === 0) {
                minTime = '';
              } else {
                minTime = new Date(res).getTime();
              }
            }
          }
          if (maxObj) {
            if (maxObj.type === 1) {
              maxTime = maxObj.maxTime;
            }
            if (maxObj.type === 2) {
              const res = this.resolveFormula(true, maxObj.formula);
              if (+res === 0) {
                maxTime = '';
              } else {
                maxTime = new Date(res).getTime();
              }
            }
          }
          if (minTime) {
            minTime = new Date(
              `${formatDate(new Date(minTime), 'yyyy-MM-dd')} 00:00:00`,
            ).getTime();
          }
          if (maxTime) {
            maxTime = new Date(
              `${formatDate(new Date(maxTime), 'yyyy-MM-dd')} 00:00:00`,
            ).getTime();
          }
          if (minTime && maxTime) {
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
          if (minTime && !maxTime) {
            return time.getTime() < minTime;
          }
          if (!minTime && maxTime) {
            return time.getTime() > maxTime;
          }
          return false;
        },
      },
    };
  },
  components: {},
  mounted() {
    // console.log(this.areaData);
  },
};
</script>

<style lang="scss" scoped>
@import '../col.scss';
</style>
<style lang="scss">
.tableDatePicker {
  .popper__arrow {
    display: none;
  }
  &.el-picker-panel {
    margin: 1px 0 !important;
  }
}
</style>
