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
      <div class="color__div">
        <apiot-color-picker
          v-model="scope.row[prop]"
          initColor="#ffffff"
          @change="selectColor(scope)"
        >
        </apiot-color-picker>
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
::v-deep {
  .el-color-picker {
    height: 30px;
  }
  .el-color-picker__trigger {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
  }
}
</style>
