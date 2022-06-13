<!--
 * @Descripttion: 异常明细
 * @Author: ytx
 * @Date: 2022-06-10 14:28:32
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-10 14:28:32
-->
<template>
  <div class="excDetails" v-if="tableData.length !== 0">
    <header>
      <div>异常明细</div>
      <apiot-button class="excDetails__button" @click="handleExport">
        <i class="iconfont icon-daochu"></i>
        错误信息导出
      </apiot-button>
    </header>
    <apiot-table
      row-key="columnName"
      class="excDetails__table"
      ref="fieldTable"
      dropClass=".excDetails__table"
      :tableData="tableData"
      :highlight-current-row="true"
      :dropColumnData="dropColumnData"
      :showSort="true"
    >
      <component
        v-for="(item, index) in dropColumnData"
        :key="`${item.prop}_${index}`"
        :label="item.label"
        :prop="item.prop"
        show-overflow-tooltip
        :is="item.compName"
      ></component>
    </apiot-table>
  </div>
</template>

<script>
export default {
  props: {
    checkInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [], // 表格结果数据
      dropColumnData: [
        {
          label: '定位',
          prop: 'positon',
          compName: 'ElTableColumn'
        },
        {
          label: '错误信息',
          prop: 'error',
          compName: 'ElTableColumn'
        }
      ]
    };
  },
  components: {},
  computed: {},
  watch: {
    checkInfo(v) {
      console.log(v);
      const { errorRow, isCheckFinish, List } = v;
      this.tableData = [];
      if (errorRow && isCheckFinish) {
        List.forEach((item) => {
          const msgArr = item.split(',');
          this.tableData.push({
            positon: msgArr[0],
            error: msgArr[1]
          });
        });
        console.log(this.tableData);
      }
    }
  },
  mounted() {},
  methods: {
    handleExport() {
      this.$emit('export');
    }
  }
};
</script>
<style lang='scss' scoped>
.excDetails {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    div:first-child {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      margin: 13px 0 13px 1px;
    }
  }
  &__button {
    font-size: 14px;
    color: #333333;
    i {
      font-size: 16px;
      color: #4689f5;
      margin-right: 4px;
    }
  }
}
</style>
