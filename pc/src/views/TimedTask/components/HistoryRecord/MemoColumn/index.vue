<!--  -->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :show-overflow-tooltip="false"
  >
    <template slot-scope="scope">
      <div>
        <el-tooltip placement="top-start" :offset="200">
          <div slot="content">
            <p v-html="scope.row.errorMsg"></p>
          </div>
          <div>
            {{ scope.row.errorMsg }}
          </div>
        </el-tooltip>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>
