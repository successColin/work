<template>
  <div class="noData">
    <span class="el-table__empty-text"></span>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {},
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},
  name: 'NoData'
};
</script>

<style lang='scss' scoped>
.noData {
  width: 100%;
  height: calc(100%);
  background: url('../../assets/img/nodata.svg') center 35% no-repeat;
  min-height: 60px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .el-table__empty-text {
    line-height: 60px;
    width: 50%;
    font-size: 13px;
    color: #909399;
  }
}
</style>
