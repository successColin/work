<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <span class="wrap" v-for="item in scope.row.roleArr" :key="item.id">
        <span class="icon-jiaose iconfont" style="color: #ee5e5e"></span>
        <span class="roleName">
          {{ item.roleName }}
        </span>
      </span>
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

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.wrap {
  display: flex;
  align-items: center;
  height: 24px;
  box-sizing: border-box;
  line-height: 18px;
  padding: 3px 8px;
  margin-right: 4px;
  background: #ffeaeb;
  border-radius: 4px;
  box-sizing: border-box;
  .roleName {
    margin-left: 3px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }

  .icon-jiaose {
    font-size: 16px;
    color: #ee5e5e;
  }
}
</style>
