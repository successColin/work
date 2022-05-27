<!--
 * @Descripttion: 弹出框__历史记录
 * @Author: ytx
 * @Date: 2021-05-12 13:47:23
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-12 13:47:23
-->
<template>
  <apiot-dialog
    class="historyPassword"
    v-on="$listeners"
    v-bind="$attrs"
    destroy-on-close
    :isShowSure="false"
    :cancelBtnName="$t('common.close')"
    @sure-click="handleReleaseSubmit"
    @close="handleReset"
  >
    <header>
      <!-- <search-input
        v-model="keywords"
        class="historyPassword__search"
        @getList="getList"
      ></search-input> -->
      <div class="historyPassword__search">
        <el-date-picker
          align="right"
          v-model="keywords"
          type="date"
          :placeholder="$t('common.selectDate')"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="getList"
        >
        </el-date-picker>
      </div>
    </header>
    <apiot-table
      row-key="historyPassword"
      dropClass=".historyPassword"
      :tableData="tableData"
      :dropColumnData="dropColumnData"
      :showSort="true"
      @sortChangeColumn="handleSortColumn"
    >
      <component
        v-for="(item, index) in dropColumnData"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
        :key="`${item.prop}_${index}`"
        :label="$t(item.label)"
        :prop="item.prop"
        :is="item.compName"
        show-overflow-tooltip
      >
      </component>
    </apiot-table>
  </apiot-dialog>
</template>

<script>
import { getListHistoricalPassword } from '@/api/globalConfig';
import ChangePassword from '../MyDialog/ChangePassword';

export default {
  data() {
    return {
      // 模糊查询的值
      keywords: '',
      // 列表数据
      tableData: [],
      // 拖拽数据
      dropColumnData: [
        {
          label: 'common.operator',
          prop: 'userName',
          compName: 'ElTableColumn'
        },
        {
          label: 'common.operatingTime',
          prop: 'operatingTime',
          compName: 'ElTableColumn'
        },
        {
          label: 'globalConfig.historicalPassword',
          prop: 'password',
          compName: 'ChangePassword'
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }
        ]
      }
    };
  },
  methods: {
    async getListData() {
      const res = await getListHistoricalPassword({ keywords: this.keywords });
      this.tableData = res;
    },
    // 排序
    handleSortColumn(obj) {
      this.params.orders = [];
      if (obj.column && obj.prop) {
        const asc = obj.order === 'ascending';
        const column = obj.prop;
        this.params.orders.push({ asc, column });
      }
      this.getTenantData(true);
    },
    handleReleaseSubmit() {
      this.$emit('update:visible', false);
    },
    getList() {
      this.getListData();
    },
    // 关闭重置值
    handleReset() {
      this.keywords = '';
    }
  },
  components: {
    ChangePassword
  }
};
</script>
<style lang='scss' scoped>
.historyPassword {
  header {
    margin-bottom: 6px;
    display: flex;
    justify-content: flex-end;

    float: right;
    &__search {
      width: 200px;
    }
  }
}
</style>
