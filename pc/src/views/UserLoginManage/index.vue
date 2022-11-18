<!--
 * @Descripttion: 用户登录管理
 * @Author: ytx
 * @Date: 2021-08-09 17:15:02
 * @Last Modified by: ytx
 * @Last Modified time: 2021-08-09 17:15:02
-->
<template>
  <section class="userLoginManage" v-loading="contentLoading">
    <div class="userLoginManage__content">
      <header class="userLoginManage__header">
        <apiot-button type="primary" @click="handleBatchOffline">
          <i class="iconfont icon-piliangcaozuo m-r-4"></i>
          批量下线
        </apiot-button>
        <search-input
          @getList="handleSearch"
          v-model="params.searchValue"
        ></search-input>
      </header>
      <section class="userLoginManage__main">
        <apiot-table
          ref="userLoginManageMain"
          :tableData="tableData"
          :dropColumnData="columnData"
          highlight-current-row
          dropClass=".userLoginManage__main"
          :isNeedAsync="false"
          @selection-change="handleSelectionChange"
          @sortChangeColumn="sortChange"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="item.label"
            :buttonArr="item.buttonArr"
            :fixed="item.fixed"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            @offlineFun="offlineFun"
          ></component>
        </apiot-table>
        <!--  -->
      </section>
      <footer class="userLoginManage__footer">
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
import { getListPage, offlineUsers } from '@/api/userLoginManage';
import OnlineTime from './components/OnlineTime';
import LoginWay from './components/LoginWay';

export default {
  name: 'userLoginManage',
  activated() {
    this.getList();
  },
  components: { OnlineTime, LoginWay },
  data() {
    return {
      contentLoading: false,
      // 参数
      total: 0,
      params: {
        current: 1,
        size: 10,
        searchValue: '',
        orders: []
      },
      tableData: [], // 列表数据
      multiExpressionArr: [], // 列表选中的数据
      columnData: [
        // 账号
        {
          label: '账号',
          prop: 'username',
          compName: 'ElTableColumn'
        },
        // 登录IP
        {
          label: '登录IP',
          prop: 'ip',
          compName: 'ElTableColumn'
        },
        // 登录IP
        {
          label: '登录地址',
          prop: 'ipSource',
          compName: 'ElTableColumn'
        },
        // 登录方式
        {
          label: '登录方式',
          prop: 'client',
          compName: 'LoginWay'
        },
        // 登录时间
        {
          label: '登录时间',
          prop: 'loginTime',
          compName: 'ElTableColumn'
        },
        // 在线时长
        {
          label: '在线时长',
          prop: 'onLineDuration',
          compName: 'OnlineTime'
        },
        // 编辑
        {
          buttonArr: [{ name: '下线', funcName: 'offlineFun' }],
          fixed: 'right',
          compName: 'OperateColumn'
        }
      ]
    };
  },
  computed: {
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiExpressionArr.forEach((item) => {
        str += `${item.token},`;
      });
      return str;
    }
  },
  methods: {
    // 获取列表
    async getList() {
      this.contentLoading = true;
      const list = await getListPage(this.params);
      this.contentLoading = false;
      this.total = list.total;
      this.tableData = list.records;
    },
    handleSearch() {
      this.params.current = 1;
      this.getList();
    },
    // 批量下线
    async handleBatchOffline() {
      if (!this.multiIdsString) {
        return this.$message({
          type: 'warning',
          message: '请选择数据'
        });
      }
      this.$confirm('确定要批量下线账号吗？', this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      }).then(async () => {
        await offlineUsers({ tokens: this.multiIdsString });
        this.$message({
          type: 'success',
          message: '下线成功'
        });
        this.getList();
      });
    },
    // 单个下线
    async offlineFun(row) {
      console.log(row);
      this.$confirm(
        `确定要下线该账号IP:${row.ip}，在${row.ipSource}地方登录，是否下线？`,
        this.$t('common.tip'),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        await offlineUsers({ tokens: row.token });
        this.$message({
          type: 'success',
          message: '下线成功'
        });
        this.getList();
      });
    },
    // 选中取消
    handleCancle() {
      this.multiExpressionArr = [];
      this.$refs.userLoginManageMain.clearSelection();
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
    }
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

//右边样式变量
$--name: 'userLoginManage';
$--headerHeight: 42px;
$--footerHeight: 42px;
@include setListLayout($--name, $--headerHeight, $--footerHeight);

.userLoginManage {
  padding: 0px 10px 0 10px;
  background: #fff;
}
</style>
