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
        </el-tooltip> </span
    ></template>
    <div slot-scope="scope" style="height: 36px">
      <div class="column__editable" v-if="false">
        <apiot-input
          v-model="tableData[scope.row.index][configData.compId]"
          @change="valueChange(scope.row.index)"
          :placeholder="configData.placeholder"
          :disabled="configData.canReadonly"
          :readonly="configData.singleStatus === 3"
        ></apiot-input>
      </div>
      <div class="column__notEditable" v-else>
        <EvaluationShow
          class="evaluation"
          :dividingType="configData.dividingType"
          :showContent="configData.configData"
          :maxScore="configData.maxScore"
          :curValue="tableData[scope.row.index][configData.compId]"
          :onlyRead="true"
        ></EvaluationShow>
      </div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
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

.evaluation {
  display: flex;
  align-items: center;
}
</style>
