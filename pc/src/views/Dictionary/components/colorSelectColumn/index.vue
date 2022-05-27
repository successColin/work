<!--
 * @Author: sss
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:16:26
 * @Des: 表格 操作列 | 颜色选择
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    :sortable="false"
    resizable
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <apiot-color-select
        v-if="scope.$index === editIndex"
        :color.sync="scope.row[prop]"
        placement="bottom-start"
        width="170"
        trigger="click"
        :colorArr="colorArr"
        @selectColor="selectColor(scope)"
      ></apiot-color-select>
      <div v-else class="color__div">
        <span
          class="color__span"
          :style="`backgroundColor:${scope.row[prop]}`"
        ></span>
        {{ scope.row[prop] }}
      </div>
    </template>
  </el-table-column>
</template>

<script>
// import ColorSelect from './colorSelect.vue';

export default {
  inheritAttrs: false,
  components: {},
  props: {
    prop: {
      type: String,
      default: ''
    },
    editIndex: {
      type: Number
    },
    // 颜色组
    colorArr: {
      // 可以选择的颜色
      type: Array,
      default() {
        return [
          '#5A80ED',
          '#EE5E5E',
          '#FAB71C',
          '#FC8256',
          '#34C7BE',
          '#1CA6FF',
          '#10B98A',
          '#A853F2',
          '#708DB7',
          '#BBC3CD'
        ];
      }
    }
  },
  data() {
    return {};
  },

  computed: {},

  mounted() {},

  methods: {
    selectColor(scope) {
      this.$emit('handleEdit', scope.row, scope.$index, this.prop);
    }
  }
};
</script>

<style lang='scss' scoped>
.color__div {
  display: flex;
  align-items: center;
}
.color__span {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
</style>
