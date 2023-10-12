<!--
 * @Descripttion: 全部
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 10:00:33
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-20 09:10:12
-->
<!-- treeTable -->
<template>
  <section class="commonly">
    <user-list
      v-if="listData.length > 0"
      :listData.sync="listData"
      v-on="$listeners"
      v-bind="$attrs"
    >
    </user-list>
    <apiot-pagination
      v-if="pages > 1"
      :size.sync="pageSize"
      :total="total"
      :pager-count="5"
      @current-change="changePage"
    >
    </apiot-pagination>
  </section>
</template>

<script>
import { getUserPage } from '@/api/orgManage.js';
import UserList from './UserList';

export default {
  components: {
    UserList
  },
  name: 'wholeTab',
  data() {
    return {
      tableData: [],
      pageSize: 20,
      total: 0,
      currentPage: 1,
      pages: 0
    };
  },
  props: {
    checkeduser: {
      type: Array,
      default() {
        return [];
      }
    },
    keywords: {
      type: String,
      default() {
        return '';
      }
    }
  },
  computed: {
    listData() {
      const rows = this.tableData.map((item) => {
        const arr = this.checkeduser.filter((obj) => String(obj.id) === String(item.id));
        if (arr.length > 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
      return rows;
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 人员列表
    getUserList(val) {
      const params = {
        keywords: val,
        size: this.pageSize,
        current: this.currentPage,
        orders: [
          {
            asc: true,
            column: ''
          }
        ]
      };
      getUserPage(params).then((res) => {
        if (res.records.length > 0) {
          this.tableData = res.records;
          this.total = res.total;
          this.pages = res.pages;
        } else {
          this.tableData = [];
          this.total = 0;
          this.pages = 0;
        }
      });
    },
    changePage(page) {
      this.currentPage = page;
      if ((this.currentPage - 1) * this.pageSize > this.total) {
        this.currentPage = Math.ceil(this.total / this.pageSize);
      }
      this.getUserList();
    }
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
@import './index.scss';
.commonly {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  &__header {
    height: 36px;
    line-height: 36px;
  }
  &__table {
    ::v-deep {
      .el-table__row {
        .collect {
          color: #fab71c;
          transform: scale(0);
          transition: all 0.4s;
          display: inline-block;
          cursor: pointer;
        }
        &:hover {
          .collect {
            transform: scale(1);
          }
        }
      }
    }
  }
  .pagination {
    height: 42px;
    width: 100%;
    flex: 0 0 42px;
    border: none;
  }
  ::v-deep {
    .el-pagination {
      width: 100%;
      text-align: center;
    }
    .org__select__content__list {
      flex: 1;
      overflow-y: auto;
    }
    .el-table td {
      border-right: none;
    }
    .el-table__body > tbody > tr:first-child > td {
      border-top: 1px solid #e9e9e9;
    }
    .el-tabs__content {
      overflow-y: auto;
    }
    .personnel__content {
      height: calc(100% - 42px);
    }
    .el-input__inner {
      height: 30px !important;
    }
    .number,
    .btn-next,
    .btn-prev {
      margin-right: 6px !important;
    }
  }
}
</style>
