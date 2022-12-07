/**
* @name: index
* @author: DELL
* @date: 2022/11/21 16:31
* @description：index
* @update: 2022/11/21 16:31
*/
<!-- 页面 -->
<template>
  <div class="userListWrap" v-loading="loading">
    <div class="searchWrap">
      <el-input placeholder="请输入内容" v-model="input3" class="input-with-select" @change="doSearch">
        <el-button slot="append" icon="el-icon-search" @click="doSearch"></el-button>
      </el-input>
    </div>
    <div class="listWrap">
      <CTable
          :height="372"
          :tableData="tableData"
          ref="tables"
          @change-selectd="selectRows"
          @select-all="selectAll"
          :border="false"
          :selectKeys="selectKeys"
          style="width: 100%">
        <el-table-column
            prop="account"
            label="帐号"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="nickname"
            label="昵称"
            width="100"
        >
        </el-table-column>
        <el-table-column
            prop="telephone"
            label="手机号"
        >
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
        >
        </el-table-column>
      </CTable>
    </div>
    <div class="paginationWrap">
      <c-pagination
          :total="total"
          :size="size"
          :selectedNum="selectKeys.length"
          @size-change="sizeChange"
          @current-change="currentChange"
          @handle-cancel="doCancel"/>
    </div>
  </div>
</template>

<script>
import {getUserList} from '@/services/home'

export default {
  props: {
    users: { // 选中的用户
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      loading: false,
      input3: '',
      tableData: [],
      current: 1,
      size: 10,
      total: 0,
      selectKeys: [] // 选中的数据
    };
  },

  components: {},

  computed: {
  },

  mounted() {
    this.init();
    console.log(111);
    this.selectKeys = JSON.parse(JSON.stringify(this.users));
  },
  methods: {
    reduceUser(arr = []) {
      if (!arr.length) {return arr;}
      if (!this.users.length) {return arr;}
      return arr.map((item) => {
        const {id} = item;
        const current = this.users.find((user) => user.id === id);
        if (current) {
          return {
            ...item,
            isChecked: true,
            showIndex: false
          }
        }
        return item;
      })
    },
    async init() { // 初始化用户列表
      this.loading = true;
      try {
        const res = await getUserList({
          current: this.current,
          size: this.size,
          keywords: this.input3
        })
        const {records = [], total = 0} = res;
        this.tableData = records;
        this.total = total;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    doSearch() {
      this.init();
    },
    selectRows(row) {
      const i = this.selectKeys.findIndex((user) => user.id === row.id);
      if ( i === -1) {
        this.selectKeys.push(row);
      } else {
        this.selectKeys.splice(i, 1);
      }
    },
    selectAll(rows) {
      if (!rows.length) { // 清空动作，和当前页的数据对比
        const arr = [...this.selectKeys];
        const newArr = [];
        arr.forEach((item) => {
          const obj = this.tableData.find((users) => users.id === item.id);
          if (!obj) {
            newArr.push(obj);
          }
        });
        this.selectKeys = newArr;
      } else {
        const arr = [...rows, ...this.selectKeys];
        this.selectKeys = arr.reduce((pre, current) => {
          const cur = pre.find((item) => item.id === current.id);
          if (cur) {
            return pre;
          }
          return pre.concat([current]);
        }, [])
      }
    },
    doCancel() {
      this.selectKeys = [];
      this.$refs.tables.clearSelection();
    },
    sizeChange(size) {
      this.size = size;
      this.init();
    },
    currentChange(current) {
      this.current = current;
      this.init();
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.userListWrap {
  width: 100%;
  height: 100%;

  .searchWrap {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    box-sizing: border-box;

    ::v-deep {
      .el-input-group {
        width: 210px;
        height: 30px;
      }

      .el-input__inner {
        height: 30px;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        line-height: 30px;
        color: #ffffff;
        background: #192757;
        border: 1px solid #2F437F;
      }

      .el-input.is-active .el-input__inner, .el-input__inner:focus {
        border-color: #409EFF;
        outline: 0;
      }

      .el-input-group__append {
        padding: 0 10px;
        background: #192757;
        border-top: 1px solid #2F437F;
        border-right: 1px solid #2F437F;
        border-bottom: 1px solid #2F437F;
      }

      .el-input__inner:focus + .el-input-group__append {
        border-top: 1px solid #409EFF;
        border-right: 1px solid #409EFF;
        border-bottom: 1px solid #409EFF;
      }

      .el-input__inner:focus + .el-input-group__append .el-icon-search {
        color: #409EFF;
      }

      .el-input-group__append:hover .el-icon-search {
        color: #409EFF;
      }
    }
  }

  .listWrap {
    width: 100%;
    height: 372px;
  }

  .paginationWrap {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
  }
}
</style>
