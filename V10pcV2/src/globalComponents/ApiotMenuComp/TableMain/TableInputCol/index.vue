<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
    :prop="configData.compId"
  >
    <!-- :prop="configData.dataSource.columnName" -->
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
        <apiot-input
          v-model="tableData[scope.row.index][configData.compId]"
          @change="valueChange(scope.row.index)"
          :placeholder="configData.placeholder"
          :disabled="configData.canReadonly"
          :readonly="configData.singleStatus === 3"
        ></apiot-input>
      </div>
      <div class="column__notEditable" v-else>
        {{ scope.row[configData.compId] }}
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
    return {};
  },
  components: {},
  mounted() {
    // console.log(this.areaData);
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../col.scss';
</style>
