<!--
 * @Author: ytx
 * @Date: 2021-04-15 19:38:10
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-17 09:29:49
 * @Des: 多表弹窗
-->
<template>
  <apiot-dialog
    class="multi"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    width="70%"
    @close="handleClose"
    :loading.sync="showLoading"
  >
    <!-- 选中内容 -->
    <div
      class="multi__res"
      v-show="selectedArr.length"
      :class="[
        {
          'multi__res--auto': isShowOverflow,
        },
      ]"
    >
      <transition-group name="el-zoom-in-center">
        <apiot-tag
          class="m-l-4 m-t-4"
          @deleteSelf="deleteSelf(item)"
          v-for="(item, index) in selectedArr"
          :key="`${item}_${index}`"
          :item="item.columnName"
        ></apiot-tag>
      </transition-group>
    </div>
    <!-- 两个表格 -->
    <section class="multi__container">
      <!-- 父表 -->
      <div>
        <single-table
          ref="table1"
          currentClass="leftTable"
          :currentMultiArr.sync="parentMultiArr"
          :selectedArr="selectedArr"
          :isShowOverflow="isShowOverflow"
          :fieldTableData="fieldTableData"
        >
        </single-table>
      </div>
      <!-- 子表 -->
      <div>
        <single-table
          ref="table2"
          currentClass="rightTable"
          :currentMultiArr.sync="childMultiArr"
          :selectedArr="selectedArr"
          :isShowOverflow="isShowOverflow"
          :fieldTableData="fieldTableData"
        >
        </single-table>
      </div>
    </section>
  </apiot-dialog>
</template>

<script>
import { batchInsertColoumns } from '@/api/importTemplate';
import SingleTable from '../SingleTable';

export default {
  inheritAttrs: false,
  props: {
    giveChildValue: {
      type: Object,
      default: () => {}
    },
    // 字段表数据
    fieldTableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      parentMultiArr: [],
      childMultiArr: [],
      showLoading: false
    };
  },

  components: {
    SingleTable
  },

  computed: {
    // // 计算是否出现滚动条
    // // 当条目大于3并且包含的字符大于62个的时候
    // // 当条目大于12且包含的字符大于14的时候
    isShowOverflow() {
      const arr = [];
      this.selectedArr.forEach((item) => {
        arr.push(item.columnName);
      });
      const res =
        (arr.length > 24 && arr.join('').length > 28) ||
        (arr.length > 6 && arr.join('').length > 80);
      // console.log(arr);
      return res;
    },
    // 两个合并的值
    selectedArr() {
      return [...this.parentMultiArr, ...this.childMultiArr];
    }
  },

  watch: {
    selectedArr() {
      this.$refs.table1.changeHeight();
      this.$refs.table2.changeHeight();
    }
  },

  mounted() {},

  methods: {
    // 初始化
    init(v) {
      const a = 0;
      const b = 1;
      const table1Obj = v[a];
      const table2Obj = v[b];
      this.$nextTick(() => {
        this.$refs.table1.getTableData(table1Obj.tableName, table1Obj.memo);
        this.$refs.table2.getTableData(table2Obj.tableName, table2Obj.memo);
      });
    },
    // 点击确定
    async sureClick() {
      const { relationsList, id } = this.giveChildValue;
      const table1 = [];
      const table2 = [];
      const mergeArr = [];
      this.parentMultiArr.forEach((val) => {
        if (!val.isDisable) {
          table1.push({
            id: val.id,
            dataBaseName: val.columnName,
            name: val.memo,
            coloumnType: val.columnTypeDict,
            checkMaxNumber: val.columnLength,
            checkMaxDecimal: val.decimalPlace
          });
        }
      });
      this.childMultiArr.forEach((val) => {
        if (!val.isDisable) {
          table2.push({
            id: val.id,
            dataBaseName: val.columnName,
            name: val.memo,
            coloumnType: val.columnTypeDict,
            checkMaxNumber: val.columnLength,
            checkMaxDecimal: val.decimalPlace
          });
        }
      });
      relationsList.forEach((item) => {
        const { tableId, tableName, sno } = item;
        // console.log(item);
        let colomuns = [];
        if (sno === 1) {
          colomuns = table1;
        } else if (sno === 2) {
          colomuns = table2;
        }
        mergeArr.push({
          tableId,
          tableName,
          colomuns
        });
      });
      try {
        await batchInsertColoumns({
          id,
          batchInsertJson: JSON.stringify(mergeArr)
        });
        this.$emit('getListFather');
        this.$emit('update:visible', false);
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 删除自己
    deleteSelf(item) {
      // console.log(this.childMultiArr);
      const index = this.childMultiArr.findIndex((val) => val.id === item.id);
      // console.log(index);
      if (index !== -1) {
        this.childMultiArr.splice(index, 1);
        this.$refs.table2.setTableRow(item);
      }
      const index1 = this.parentMultiArr.indexOf(item);
      if (index1 !== -1) {
        this.parentMultiArr.splice(index1, 1);
        this.$refs.table1.setTableRow(item);
      }
    },
    // 关闭
    handleClose() {
      Object.assign(this.$data, this.$options.data());
    }
  }
};
</script>

<style lang='scss' scoped>
.multi {
  display: flex;
  flex-direction: column;
  &__res {
    box-sizing: border-box;
    max-height: 80px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e9e9e9;
    transition: all 0.5s;
    &--auto {
      overflow-y: auto;
      min-height: 80px;
    }
  }
  // 容器
  &__container {
    display: flex;
    justify-content: space-between;
    flex: 1;
    & > div {
      width: calc(50% - 6px);
      display: flex;
      flex-direction: column;

      border: 1px solid #e9e9e9;
      border-bottom: none;
      // border-top: none;
    }
  }
}
</style>
