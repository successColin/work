<!-- * @描述: 通用单选框 -->
<template>
  <el-radio v-bind="$attrs" v-on="$listeners" class="apiotRadio">
    <slot></slot>
  </el-radio>
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
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.apiotRadio {
  ::v-deep {
    .el-radio__label {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333 !important;
    }
  }
}
</style>
