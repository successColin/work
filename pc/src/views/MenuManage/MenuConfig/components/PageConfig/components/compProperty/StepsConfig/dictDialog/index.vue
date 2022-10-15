<template>
  <apiot-dialog
    class="dictionary__main"
    title="选择字典"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <apiot-table
      ref="dicyionaryTable"
      :tableData="tableData"
      :dropColumnData="dictionaryColumnData"
      @selection-change="handleSelectionChange"
      @cellMouseEnter="cellMouseEnter"
      :selectable="canSelectEd"
      rowKey="value"
      highlight-current-row
      dropClass=".dictionary__main"
    >
      <component
        v-for="(item, index) in dictionaryColumnData"
        :is="item.compName"
        :key="`${item.prop}_${index}`"
        :prop="item.prop"
        :label="`${$t(item.label)}`"
        :width="item.width"
        :type="item.type"
        :align="item.align"
        :fixed="item.fixed"
      ></component>
    </apiot-table>
  </apiot-dialog>
</template>

<script>
export default {
  name: '',
  props: {
    tableData: {
      type: Array
    },
    curSelectArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dictionaryColumnData: [
        // 枚举值列表的表头
        // 枚举值(中文)
        {
          label: 'dictionary.langZH',
          prop: 'zhCN',
          compName: 'ElTableColumn'
        },
        // 英文
        {
          label: 'dictionary.langEN',
          prop: 'enUS',
          compName: 'ElTableColumn'
        },
        // 值
        {
          label: 'dictionary.value',
          prop: 'value',
          compName: 'ElTableColumn'
        }
      ],
      multiArr: []
    };
  },
  computed: {
    getSelectIdsArr() {
      const arr = [];
      this.curSelectArr.forEach((item) => {
        arr.push(item.value);
      });
      return arr;
    }
  },
  components: {},
  methods: {
    // 确认按钮
    sureClick() {
      this.$emit('sureDict', this.multiArr);
      this.multiArr = [];
      this.$emit('update:visible', false);
    },
    // 多选值选择变化
    handleSelectionChange(val) {
      this.multiArr = val;
      console.log(val);
    },
    // 鼠标移入
    cellMouseEnter(row, timer) {
      if (this.getSelectIdsArr.includes(row.value)) {
        clearTimeout(timer);
      }
    },
    canSelectEd(row) {
      if (this.getSelectIdsArr.includes(row.id)) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
