/**
* @name: recordTab
* @author: DELL
* @date: 2023/2/23 19:21
* @description：recordTab
* @update: 2023/2/23 19:21
*/
<!-- 页面 -->
<template>
  <div class="apiLog" v-loading="loading">
    <div class="apiLog__table">
      <apiot-table
          :showSelection="false"
          :isNeedRowDrop="false"
          :tableData="tableData"
          row-key="id"
          @sortChangeColumn="doSort"
          ref="multipleTable"
      >
        <el-table-column
            prop="requestId"
            width="150"
            label="RequestID"
            sortable="custom"
        >
        </el-table-column>
        <el-table-column
            prop="requestUrl"
            label="请求地址"  sortable="custom"
        >
        </el-table-column>
        <el-table-column
            prop="requestTime"
            label="请求时间"
            sortable="custom"
        >
        </el-table-column>
        <el-table-column
            prop="resultCode"
            label="调用结果"
            width="100"
            sortable="custom"
        >
          <template slot-scope="scope">
           <span :class="scope.row.resultCode">
             {{scope.row.resultCode==='FAIL'? '失败': '成功'}}
           </span>
          </template>
        </el-table-column>
        <el-table-column
            prop="resultMsg"
            sortable="custom"
            label="操作"
            width="180">
        </el-table-column>
        <el-table-column
            :label="$t('knowledge.list_opea')"
            width="120px"
            fixed="right"
            :resizable="false"
        >
          <template slot-scope="scope">
            <span class="m-r-16 detials" @click="doEdit(scope.row)">
              详情
            </span>
          </template>
        </el-table-column>
      </apiot-table>
    </div>
    <div class="apiLog__pagination" v-show="total">
      <apiot-pagination
          :total="total"
          :current-page="current"
          :size="size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></apiot-pagination>
    </div>
  </div>
</template>

<script>
import { getApiLog } from '@/api/proxy';

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loading: false,
      total: 0,
      current: 1,
      size: 20,
      orders: [
        {
          asc: true,
          column: ''
        }
      ],
      tableData: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    if (this.info.commonApiHeader.id) {
      this.init();
    }
  },

  methods: {
    async init() {
      this.loading = true;
      const res = await getApiLog({
        current: this.current,
        size: this.size,
        orders: this.orders,
        headerId: this.info.commonApiHeader.id
      });
      const { total, records = [] } = res;
      this.total = total;
      this.tableData = records;
      this.loading = false;
    },
    doSort({ prop, order }) {
      const isTrue = order === 'ascending';
      this.orders = [
        {
          asc: isTrue,
          column: prop
        }
      ];
      this.init();
    },
    handleSizeChange(val) {
      this.size = val;
      this.init();
    },
    handleCurrentChange(val) {
      // 切换页码
      this.current = val;
      this.init();
    },
    doEdit(row) {
      this.$bus.$emit('look_api_log', row);
    }
  },
  name: 'recordTab',
};
</script>

<style lang='scss' scoped>
.apiLog {
  width: 100%;
  height: 100%;
  position: absolute;
  .apiLog__table{
    width: 100%;
    height: calc(100% - 42px);
    .FAIL {
      height: 24px;
      padding: 0 10px;
      display: inline-block;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #F6483E;
      background: #FFEAEB;
      border-radius: 4px;
      line-height: 24px;

    }
    .SUCCESS{
      height: 24px;
      padding: 0 10px;
      display: inline-block;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #10B98A;
      background: #EBFCF7;
      border-radius: 4px;
      line-height: 24px;
    }
    .detials{
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4689F5;
      cursor: pointer;
    }
  }
  .apiLog__pagination {
    height: 42px;
    width: 100%;
  }
}
</style>
