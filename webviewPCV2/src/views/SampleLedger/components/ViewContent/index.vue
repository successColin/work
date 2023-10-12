<!--
 * @Descripttion: 样品台账
 * @Author: ytx
 * @Date: 2021-08-09 17:15:02
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-09 17:15:02
-->
<template>
  <section class="ledger" v-loading="contentLoading">
    <div class="ledger__content">
      <header class="ledger__header">
        <div class="ledger__header--box">
          <el-date-picker
            class="ledger__header--picker"
            v-model="dataTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          >
          </el-date-picker>
          <apiot-button type="primary" @click="handleQuery">
            查询
          </apiot-button>
          <apiot-button @click="handleReset"> 重置 </apiot-button>
        </div>
      </header>
      <section class="ledger__main">
        <apiot-table
          ref="ledgerMain"
          :tableData="tableData"
          :dropColumnData="columnData"
          highlight-current-row
          dropClass=".ledger__main"
          :hasBigButton="true"
          :isNeedAsync="true"
          @selection-change="handleSelectionChange"
          @sortChangeColumn="sortChange"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="item.label"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          ></component>

          <!-- 酸值（mgKOH/ g） -->
          <el-table-column :key="`${headerObj.acidValue}_0`">
            <template slot="header">
              酸值(mgKOH/ g)
              <br />
              {{ headerObj.acidValue }}
            </template>
            <template slot-scope="scope">
              <span :style="warnCom(scope.row.acidValue, headerObj.acidValue)">
                {{ scope.row.acidValue }}
              </span>
            </template>
          </el-table-column>

          <!-- 机械杂质含量（% (m / m)） -->
          <el-table-column :key="`${headerObj.impurity}_1`">
            <template slot="header">
              机械杂质含量(% (m / m))
              <br />
              {{ headerObj.impurity }}
            </template>
            <template slot-scope="scope">
              <span :style="warnCom(scope.row.impurity, headerObj.impurity)">
                {{ scope.row.impurity }}
              </span>
            </template>
          </el-table-column>

          <!-- 闪点（℃） -->
          <el-table-column :key="`${headerObj.flashPoint}_2`">
            <template slot="header">
              闪点(℃)
              <br />
              {{ headerObj.flashPoint }}
            </template>
            <template slot-scope="scope">
              <span
                :style="warnCom(scope.row.flashPoint, headerObj.flashPoint)"
              >
                {{ scope.row.flashPoint }}
              </span>
            </template>
          </el-table-column>

          <!-- 水的体积百分含量（% (v / v)） -->
          <el-table-column :key="`${headerObj.waterContent}_3`">
            <template slot="header">
              水的体积百分含量(% (v / v))
              <br />
              {{ headerObj.waterContent }}
            </template>
            <template slot-scope="scope">
              <span
                :style="warnCom(scope.row.waterContent, headerObj.waterContent)"
              >
                {{ scope.row.waterContent }}
              </span>
            </template>
          </el-table-column>

          <!-- 运动粘度(40℃)（mm2 / s） -->
          <el-table-column :key="`${headerObj.viscosity}_4`">
            <template slot="header">
              运动粘度(40℃)(mm2 / s)
              <br />
              {{ headerObj.viscosity }}
            </template>
            <template slot-scope="scope">
              <span :style="warnCom(scope.row.viscosity, headerObj.viscosity)">
                {{ scope.row.viscosity }}
              </span>
            </template>
          </el-table-column>
        </apiot-table>
        <!--  -->
      </section>
      <footer class="task__footer">
        <apiot-pagination
          v-show="tableData.length"
          ref="pagination"
          :total="total"
          :size.sync="params.size"
          :selectedNum="multiExpressionArr.length"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @handle-cancel="handleCancle"
        ></apiot-pagination>
      </footer>
    </div>
  </section>
</template>

<script>
import { listLubrication, getHeadLubrication } from '@/api/sampleLedger';
import { timeShortcuts } from '@/config';

export default {
  components: {},

  props: {
    deviceId: {
      type: Number,
      default: 0
    }
  },

  watch: {
    deviceId: {
      deep: true,
      handler(v) {
        this.params.deviceId = v;
        this.getList();
      }
    },
    dataTime(v) {
      console.log(v);
      if (v.length === 2) {
        const i = 0;
        const j = 1;
        this.params.startTime = v[i];
        this.params.endTime = v[j];
      }
    }
  },
  computed: {
    warnCom() {
      return function (val, area) {
        val = +val;
        const style = 'color: red';
        if (!area) return;
        if (area.indexOf('～') !== -1) {
          const arr = area.split('～');
          if (arr.length !== 2) return;
          if (val < +arr[0] || val > +arr[1]) {
            return style;
          }
          return;
        }
        const symbolVal = area.slice(0, 1);
        const areaVal = +area.slice(1);
        console.log(symbolVal, areaVal);
        if (symbolVal === '≥' && val < areaVal) {
          return style;
        }
        if (symbolVal === '>' && val <= areaVal) {
          return style;
        }
        if (symbolVal === '≤' && val > areaVal) {
          return style;
        }
        if (symbolVal === '<' && val >= areaVal) {
          return style;
        }
        if (symbolVal === '=' && val !== areaVal) {
          return style;
        }
        return '';
      };
    }
  },

  data() {
    return {
      headerObj: {
        acidValue: '',
        flashPoint: '',
        impurity: '',
        viscosity: '',
        waterContent: ''
      }, // 头部区间

      pickerOptions: {
        shortcuts: timeShortcuts
      },
      dataTime: [],
      // 参数
      params: {
        current: 1,
        size: 10,
        orders: [],
        deviceId: 0,
        endTime: '',
        startTime: ''
      },
      total: 0,
      tableData: [], // 列表数据

      contentLoading: false,

      multiExpressionArr: [], // 列表选中的数据
      columnData: [
        {
          label: '部门',
          prop: 'orgName',
          compName: 'ElTableColumn'
        },
        {
          label: '采样时间',
          prop: 'sampDate',
          compName: 'ElTableColumn'
        },
        {
          label: '装置',
          prop: 'plant',
          compName: 'ElTableColumn'
        },
        {
          label: '设备位号',
          prop: 'keycode',
          compName: 'ElTableColumn'
        },
        {
          label: '样品编号',
          prop: 'ordNo',
          compName: 'ElTableColumn'
        }
      ]
    };
  },
  methods: {
    async getHeadLubrication() {
      const res = await getHeadLubrication({ deviceId: this.params.deviceId });
      this.headerObj = res;
      console.log(this.headerObj);
    },
    // 获取列表
    async getList() {
      this.getHeadLubrication();
      this.contentLoading = true;
      if (!this.params.deviceId) {
        this.contentLoading = false;
        return;
      }
      const list = await listLubrication(this.params);
      this.contentLoading = false;
      this.total = list.total;
      this.tableData = list.records;
    },
    // 查询
    handleQuery() {
      this.getList();
    },
    // 重置
    async handleReset() {
      await this.getAMonth();
      this.getList();
    },
    // 选中取消
    handleCancle() {
      this.multiExpressionArr = [];
      this.$refs.taskMain.clearSelection();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiExpressionArr = val;
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.params.current = 1;
      this.params.size = size;
      this.getList();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.params.current = page;
      this.getList();
    },
    // 排序
    sortChange(sortInfo) {
      const { prop, order } = sortInfo;
      const orderObj = { column: prop };
      if (order === 'ascending') orderObj.asc = true;
      else if (order === 'descending') orderObj.asc = false;
      this.params.orders = [orderObj];
      this.getList();
    },
    // 近一个月时间
    getAMonth() {
      const end = new Date();
      const year = end.getFullYear();
      const month = end.getMonth() + 1; // 0-11表示1-12月
      const day = end.getDate();
      const dateObj = {};
      dateObj.end = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
      const endMonthDay = new Date(year, month, 0).getDate(); // 当前月的总天数
      if (month - 1 <= 0) {
        // 如果是1月，年数往前推一年<br>
        dateObj.start = `${year - 1}-${12}-${day}`;
      } else {
        const startMonthDay = new Date(year, parseInt(month, 10) - 1, 0).getDate();
        if (startMonthDay < day) {
          // 1个月前所在月的总天数小于现在的天日期
          if (day < endMonthDay) {
            // 当前天日期小于当前月总天数
            dateObj.start = `${year}-${month - 1}-${startMonthDay - (endMonthDay - day)}`;
          } else {
            dateObj.start = `${year}-${month - 1}-${startMonthDay}`;
          }
        } else {
          dateObj.start = `${year}-${month - 1}-${day}`;
        }
      }
      const arr = dateObj.start.split('-');
      const allDay = new Date(arr[0], arr[1], 0).getDate();
      if (+arr[2] + 1 > allDay) {
        arr[1] = +arr[1] + 1;
        arr[2] = '01';
        if (arr[1] > 12) {
          arr[0] = +arr[0] - 1;
          arr[1] = '01';
        }
      } else {
        arr[2] = +arr[2] + 1;
      }
      const newStartTime = `${arr[0]}-${arr[1].toString().padStart(2, '0')}-${arr[2]
        .toString()
        .padStart(2, '0')}`;
      this.dataTime = [`${newStartTime} 00:00:00`, `${dateObj.end} 23:59:59`];
    }
  },

  mounted() {
    this.getList();
    this.getAMonth();
  }
};
</script>

<style lang='scss' scoped>
.ledger {
  padding: 0px 10px 0 10px;
  background: #fff;
  height: 100%;
  &__content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__header {
    display: flex;
    flex-direction: row-reverse;
    &--box {
      padding: 5px 0;
      display: flex;
      align-items: center;
    }
    &--picker {
      margin-right: 10px;
    }
  }
  &__main {
    overflow: hidden;
    flex: 1;
  }
  &__footer {
    height: 42;
    line-height: 42;
  }
  ::v-deep {
    .el-table th.el-table__cell > .cell {
      line-height: 20px;
      height: auto !important;
      // text-align: center;
      display: inline-block !important;
    }
  }
}
</style>
