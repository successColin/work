<!--
 * @Descripttion: 租户管理
 * @Author: ytx
 * @Date: 2021-04-22 15:22:28
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-29 19:55:39
-->
<template>
  <div class="tenant">
    <section class="content">
      <!-- 头部 -->
      <header>
        <div class="header__headerLeft">
          <apiot-button
            v-for="(item, i) in stateButton"
            round
            :key="i"
            :type="(item.isClick && 'primary') || ''"
            @click="handleFilterData(item)"
          >
            {{ item.name }}
          </apiot-button>
        </div>
        <div class="header__headerRight">
          <search-input
            v-model="params.keywords"
            @getList="searchFun"
          ></search-input>
        </div>
      </header>
      <!-- 表格 -->
      <section>
        <apiot-table
          row-key="groupId"
          dropClass=".tenant"
          :tableData="tableData"
          :dropColumnData="dropColumnData"
          :showSelection="false"
          :hasBigButton="true"
          :isNeedAsync="true"
          @sortChangeColumn="handleSortColumn"
        >
          <component
            v-for="(item, index) in dropColumnData"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            :key="`${item.prop}_${index}`"
            :label="$t(item.label)"
            :prop="item.prop"
            :width="currentLangeWidth(item.cnWidth, item.enWidth)"
            :is="item.compName"
            :buttonArr="item.buttonArr"
            :buttonArr1="item.buttonArr1"
            :fixed="item.fixed"
            :typesPropName="item.typesPropName"
            :colorIndex="item.colorIndex"
            :colorId="item.colorId"
            show-overflow-tooltip
            @memberFun="memberFun"
            @dataSourceFun="dataSourceFun"
            @upgradeFun="upgradeFun"
            @freezeFun="freezeFun"
            @releaseFun="releaseFun"
            @restoreFun="restoreFun"
          >
          </component>
        </apiot-table>
      </section>
    </section>
    <!-- 分页 -->
    <footer v-show="tableData.length !== 0">
      <apiot-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.current"
        :page-size="params.size"
        :total="total"
      ></apiot-pagination>
    </footer>

    <!-- 升级弹出框 -->
    <upgrade-tenant
      :visible.sync="dialogVisibleUpgrade"
      :title="$t('tenant.activateTenant')"
      :lineData="currentLineData"
      :okBtnName="$t('tenant.upgrade')"
      @close="getTenantData"
    ></upgrade-tenant>
    <!-- 重置密码 -->
    <release-tenant
      :visible.sync="dialogVisibleRelease"
      :title="$t('tenant.releaseTenant')"
      :lineData="currentLineData"
      @close="getTenantData"
    >
    </release-tenant>
    <!-- tabs 成员 和 数据源 -->
    <tenant-details
      ref="editDetail"
      :showTabs.sync="showTabs"
      :lineData="currentLineData"
    ></tenant-details>
  </div>
</template>

<script>
import { getTenant, updateFreeze, updateRecover } from '@/api/tenant';
import MyOperateColumn from './components/TableColumn/MyOperateColumn';
import TenantDetails from './components/TenantDetails';
import UpgradeTenant from './components/MyDialog/UpgradeTenant';
import ReleaseTenant from './components/MyDialog/ReleaseTenant';

export default {
  name: 'tenant',
  data() {
    return {
      // 分页
      params: {
        current: 1,
        size: 10,
        // 模糊搜索值
        keywords: '',
        // 状态
        tenantState: '',
        // 排序
        orders: []
      },
      total: 0,
      // 表格结果数据
      tableData: [],
      // 表格列数据
      dropColumnData: [
        {
          label: 'tenant.tenantName',
          prop: 'tenantName',
          compName: 'ElTableColumn'
        },
        {
          label: 'common.type',
          prop: 'tenantType',
          typesPropName: 'TENANT_TYPE',
          compName: 'TypesColumn',
          colorIndex: [100, 101]
        },
        {
          label: 'common.state',
          prop: 'tenantState',
          typesPropName: 'TENANT_STATE',
          compName: 'StateColumn'
        },
        {
          label: 'tenant.rootAdministrator',
          prop: 'managerName',
          compName: 'UserColumn',
          colorId: 'administratorId'
        },
        {
          label: 'common.contactNumber',
          prop: 'managerPhone',
          compName: 'ElTableColumn'
        },
        {
          label: 'common.email',
          prop: 'managerEmail',
          compName: 'ElTableColumn'
        },
        {
          label: 'tenant.numberOfMembers',
          prop: 'userQuantity',
          compName: 'ElTableColumn'
        },
        {
          label: 'tenant.registrationDate',
          prop: 'registerTime',
          compName: 'ElTableColumn'
        },
        {
          label: 'tenant.subscriptionDeadline',
          prop: 'deadlineTime',
          compName: 'ElTableColumn'
        },
        {
          label: 'common.operate',
          buttonArr: [
            { name: 'tenant.members', funcName: 'memberFun' },
            { name: 'tenant.dataSource', funcName: 'dataSourceFun' }
          ],
          buttonArr1: [
            {
              name: 'tenant.upgrade',
              funcName: 'upgradeFun',
              type: 'primary'
            },
            {
              name: 'tenant.freeze',
              funcName: 'freezeFun',
              type: 'danger'
            },
            {
              name: 'tenant.restore',
              funcName: 'restoreFun',
              type: 'warning'
            },
            {
              name: 'tenant.release',
              funcName: 'releaseFun',
              type: 'info'
            }
          ],
          enWidth: '380',
          cnWidth: '270',
          fixed: 'right',
          compName: 'MyOperateColumn'
        }
      ],
      // 升级__是否显示对话框
      dialogVisibleUpgrade: false,
      // 释放__标题
      dialogVisibleRelease: false,
      // 冻结 and 升级 点击当前行数据
      currentLineData: {},
      // 成员 and 数据源
      showTabs: false
    };
  },
  components: {
    MyOperateColumn,
    TenantDetails,
    UpgradeTenant,
    ReleaseTenant
  },
  computed: {
    // 状态按钮
    stateButton() {
      const list = this.$store.state.dictManage.TENANT_STATE;
      const res = [
        {
          name: this.$t('tenant.tenant', { name: this.$t('tenant.all') }),
          state: '',
          isClick: true
        }
      ];
      list.forEach((item) => res.push({ name: item.name, state: item.value, isClick: false }));
      return res;
    },
    // 当前语言
    currentLangeWidth() {
      return function(cnWidth, enWidth) {
        const lang = localStorage.getItem('apiotLanguage');
        const value = lang === 'zhCN' ? cnWidth : enWidth;
        return value;
      };
    }
  },
  activated() {
    this.$store.dispatch('getCurrentDict', 'TENANT_STATE,TENANT_TYPE');
    this.getTenantData();
  },
  methods: {
    // 获取租户数据 and 模糊搜索
    async getTenantData(isSort) {
      if (!isSort) this.params.orders = [];
      const res = await getTenant(this.params);
      this.total = res.total;
      this.tableData = res.records;
    },
    // 分页__选择一页显示多少条
    handleSizeChange(val) {
      this.params.size = val;
      this.params.current = 1;
      this.getTenantData();
    },
    // 分页__选择第几页
    handleCurrentChange(val) {
      this.params.current = val;
      this.getTenantData();
    },
    // 按钮__状态赛选
    handleFilterData(val) {
      this.stateButton.forEach((item) => {
        item.isClick = false;
      });
      val.isClick = true;
      this.params.tenantState = val.state;
      this.params.current = 1;
      this.getTenantData();
    },
    // 按钮__成员
    memberFun(row) {
      this.currentLineData = row;
      this.showTabs = true;
      this.$refs.editDetail.setActiveName('UserManage');
    },
    // 按钮__数据源
    dataSourceFun(row) {
      this.currentLineData = row;
      this.showTabs = true;
      this.$refs.editDetail.setActiveName('DataSource');
    },
    // 按钮__升级
    upgradeFun(row) {
      this.dialogVisibleUpgrade = true;
      this.currentLineData = row;
    },
    // 按钮__冻结
    freezeFun(row) {
      this.$confirm(
        this.$t('tenant.isFreezeTenant'),
        this.$t('tenant.tenant', { name: this.$t('tenant.freeze') }),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        await updateFreeze({ id: row.id });
        this.$message({
          type: 'success',
          message: `${this.$t('common.success', { name: this.$t('tenant.freeze') })} !`
        });
        this.getTenantData();
      });
    },
    async restoreFun(row) {
      await updateRecover({ id: row.id });
      this.$message({
        type: 'success',
        message: `${this.$t('common.success', { name: this.$t('tenant.restore') })} !`
      });
      this.getTenantData();
    },
    // 按钮__释放
    releaseFun(row) {
      this.dialogVisibleRelease = true;
      this.currentLineData = row;
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
    searchFun() {
      this.params.current = 1;
      this.getTenantData();
    }
  }
};
</script>
<style lang='scss' scoped>
.tenant {
  background: #ffffff;
  display: flex;
  flex-direction: column;
  .content {
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    height: calc(100% - #{$--pagination--height});
    header {
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .header__headerLeft {
        margin-left: 10px;
      }
    }
    section {
      height: calc(100% - 42px);
    }
  }
}
::v-deep {
  .el-button.is-round {
    padding: 12px 10px;
  }
}
</style>
