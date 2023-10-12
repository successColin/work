<!--
 * @Descripttion: 禁止内容
 * @Author: ytx
 * @Date: 2023-04-23 09:35:40
 * @Last Modified by: ytx
 * @Last Modified time: 2023-04-23 09:35:40
-->
<template>
  <apiot-dialog
    class="prohibitContent"
    v-on="$listeners"
    v-bind="$attrs"
    destroy-on-close
    @sure-click="handleOk"
  >
    <header>
      <apiot-button type="primary" @click="handleAdd">
        <i class="iconfont icon-xinzeng m-r-4"></i>添加
      </apiot-button>
    </header>
    <apiot-table-edit
      row-key="prohibitContent"
      dropClass=".prohibitContent"
      :tableData="tableData"
      :dropColumnData="dropColumnData"
      :showSort="true"
    >
      <component
        v-for="(item, index) in dropColumnData"
        :key="`${item.prop}_${index}`"
        :label="$t(item.label)"
        :prop="item.prop"
        :is="item.compName"
        show-overflow-tooltip
        :width="item.width"
        :icon="item.icon"
        :iconStyle="item.iconStyle"
        :funcName="item.funcName"
        @handleEdit="editColumn"
        @deleteFun="deleteFun"
      >
      </component>
    </apiot-table-edit>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 列表数据
      tableData: [],
      // 拖拽数据
      dropColumnData: [
        {
          label: '禁止内容',
          prop: 'value',
          compName: 'EditinputColumn'
        },
        {
          compName: 'OperateColumn',
          width: 80,
          icon: 'icon-shanchu',
          iconStyle: 'color: #BBC3CD;cursor: pointer;',
          funcName: 'deleteFun'
        }
      ]
    };
  },
  methods: {
    async deleteFun(row) {
      await this.$confirm('确定删除禁止内容吗？', this.$t('common.tip'), { type: 'warning' });
      this.tableData.splice(row.index, 1);
    },
    handleAdd() {
      this.tableData.push({ value: '' });
    },
    handleOk() {
      const arr = [];
      this.tableData.forEach((item) => {
        if (item.value) {
          arr.push(item.value);
        }
      });
      const value = arr.join(',');
      console.log(value);
      this.$emit('update:value', value);
      this.$emit('update:visible', false);
      this.$emit('handleProhibit', value);
    },
    // 编辑每一列
    editColumn(row, index) {
      this.tableData[index] = { ...this.tableData[index], ...row };
    }
  },
  watch: {
    value(value) {
      console.log(value);
      if (value) {
        const arr = value.split(',');
        this.tableData = [];
        arr.forEach((v) => {
          this.tableData.push({
            value: v
          });
        });
      }
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
.prohibitContent {
  header {
    margin-bottom: 6px;
  }
}
</style>
