<!--
 * @Descripttion: 成员清单
 * @Author: ytx
 * @Date: 2021-04-25 08:51:24
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 16:55:41
-->
<template>
  <div class="userManage">
    <section class="content">
      <header>
        <search-input
          v-model="params.keywords"
          @getList="searchFun"
        ></search-input>
      </header>
      <section>
        <apiot-table
          row-key="groupId"
          dropClass=".userManage"
          :tableData="tableData"
          :dropColumnData="dropColumnData"
          :hasBigButton="true"
          :showSort="true"
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
            :width="item.width"
            :is="item.compName"
            :buttonArr="item.buttonArr"
            :buttonArr1="item.buttonArr1"
            :fixed="item.fixed"
            :currentIndex="index"
            :isNeedBg="item.isNeedBg"
            :typesProp="item.typesProp"
            :typesPropName="item.typesPropName"
            :colorIndex="item.colorIndex"
            :colorId="item.colorId"
            show-overflow-tooltip
          >
          </component>
        </apiot-table>
      </section>
    </section>
    <!-- 分页 -->
    <footer>
      <apiot-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.current"
        :page-size="params.size"
        :total="total"
      ></apiot-pagination>
    </footer>
  </div>
</template>

<script>
import { getTenantUser } from '@/api/tenant';

export default {
  props: {
    lineData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 分页
      params: {
        current: 1,
        size: 10,
        keywords: '',
        tenantId: '',
        orders: []
      },
      total: 0,
      // 表格结果数据
      tableData: [],
      // 表格列数据
      dropColumnData: [
        {
          label: 'tenant.memberName',
          prop: 'username',
          compName: 'UserColumn',
          colorId: 'id'
        },
        {
          label: 'common.account',
          prop: 'account',
          compName: 'ElTableColumn'
        },
        {
          label: 'common.phoneNumber',
          prop: 'telephone',
          compName: 'ElTableColumn'
        },
        {
          label: 'tenant.role',
          prop: 'userType',
          compName: 'RoleColumn',
          typesPropName: 'TENANT_USER_TYPE',
          colorIndex: [1, 2]
        },
        {
          label: 'common.state',
          prop: 'userState',
          compName: 'TypesColumn',
          typesPropName: 'TENANT_USER_STATE'
        },
        {
          label: 'tenant.lastActiveTime',
          prop: 'lastActiveTime',
          compName: 'ElTableColumn'
        }
      ]
    };
  },
  methods: {
    init() {
      this.$store.dispatch('getCurrentDict', 'TENANT_USER_STATE,TENANT_USER_TYPE');
      this.getUserList();
      this.$broadcast('changeHeight');
    },
    async getUserList() {
      this.params.tenantId = (this.lineData && this.lineData.id) || '';
      const res = await getTenantUser(this.params);
      this.tableData = res.records;
      this.total = res.total;
    },
    handleSizeChange(val) {
      this.params.current = 1;
      this.params.size = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.params.current = val;
      this.getUserList();
    },
    handleSortColumn(obj) {
      this.params.orders = [];
      if (obj.column && obj.prop) {
        const asc = obj.order === 'ascending';
        const column = obj.prop;
        this.params.orders.push({ asc, column });
      }
      this.getUserList();
    },
    searchFun() {
      this.params.current = 1;
      this.getUserList();
    }
  }
};
</script>
<style lang='scss' scoped>
.userManage {
  height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  .content {
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    flex: 0 0 calc(100% - #{$--pagination--height});
    section {
      flex: 1;
    }
    header {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
}
</style>
