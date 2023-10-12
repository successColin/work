<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable :prop="prop">
    <template slot-scope="scope">
      <div class="baseColor">
        {{ scope.row[prop] }}
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      default: 'enabled'
    }
  }
};
</script>

<style lang='scss' scoped>
.baseColor {
  height: 28px;
  line-height: 28px;
  padding: 0 10px;
  background: #e5f0ff;
  border-radius: 4px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4689f6;
}
</style>
