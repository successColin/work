<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <div :class="scope.row.userStateDict===1?'onLine':'outLine'">
        <span>{{ scope.row.userStateDictName }}</span>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
.onLine {
  padding: 0 10px;
  display: inline-flex;
  margin-right: 4px;
  background: #E5F0FF;
  border-radius: 4px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4689F5;
  box-sizing: border-box;
  line-height: 24px;
}
.outLine {
  padding: 0 10px;
  display: inline-flex;
  background: #F1F3F6;
  border-radius: 4px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  box-sizing: border-box;
  line-height: 24px;
}
</style>
