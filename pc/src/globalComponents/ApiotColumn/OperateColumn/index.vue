<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:16:26
 * @Des: 表格 操作列 | 按钮类型
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    :sortable="false"
    :label="$t(opeLable)"
    resizable
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <apiot-button
        @click="buttonClick(scope, item)"
        v-for="(item, index) in buttonArr"
        :key="index"
        :type="item.type || 'text'"
        :plain="item.plain"
      >
        {{ $te(item.name) ? $t(item.name) : item.name }}
      </apiot-button>
      <div class="mask" v-show="showFunc ? showFunc(scope.row) : false"></div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    label: String,
    buttonArr: {
      type: Array,
      default() {
        return [{ name: 'entity.entityTable.operateBtn1', funcName: 'edit' }];
      }
    },
    showFunc: {
      type: Function
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    opeLable() {
      return this.label || 'common.operate';
    }
  },

  mounted() {},

  methods: {
    buttonClick(scope, item) {
      this.$emit(item.funcName, scope.row, scope);
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-button.el-button--text {
    padding: 0 !important;
  }
}
.mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
}
</style>
