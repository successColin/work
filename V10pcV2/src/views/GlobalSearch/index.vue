<template>
  <div class="globalSearch">
    <div class="globalSearch__option">
      <div class="globalSearch__option__button">
        <apiot-button type="primary" @click="openDrawer(1)">
          <i class="iconfont icon-xinzeng m-r-6"></i>
          {{ $t('common.add', { name: $t('entity.searchClass') }) }}
        </apiot-button>
        <apiot-button class="m-l-8" @click="deleteMul">
          <i class="iconfont icon-shanchu m-r-6"></i>
          {{ $t('common.delete', { name: $t('entity.searchClass') }) }}
        </apiot-button>
      </div>
      <div class="globalSearch__option__search">
        <search-input @getList="search" v-model.trim="keywords"></search-input>
      </div>
    </div>

    <div class="globalSearch__main" v-loading="loading">
      <apiot-table
        :tableData="tableData"
        row-key="id"
        :isNeedColumnDrop="false"
        @selection-change="selectTable"
        ref="globalSearchTable"
      >
        <el-table-column
          prop="tableName"
          :label="$t('entity.searchTable.entityTable')"
          :width="200"
        >
        </el-table-column>
        <el-table-column
          prop="searchName"
          :label="$t('entity.searchTable.name')"
          :width="200"
        >
        </el-table-column>
        <el-table-column
          prop="searchColumns"
          :label="$t('entity.searchTable.searchfield')"
        >
          <template slot-scope="scope">
            <!-- {{ scope.row.searchColumns }} -->
            <span
              v-for="item in scope.row.searchColumns.split(',')"
              :key="item"
              class="field"
            >
              {{ item }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('entity.searchTable.isExecuted')"
          :width="200"
        >
          <template slot-scope="scope">
            <apiot-switch
              :value="scope.row.enable"
              :active-value="1"
              :inactive-value="2"
              class="passwordConfig__switch"
              @change="changeEnable(scope.row)"
            ></apiot-switch>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operate')" :width="200">
          <template slot-scope="scope">
            <span class="edit" @click.stop="openDrawer(2, scope.row)">
              {{ $t('common.edit', { name: '' }) }}
            </span>
            <span class="edit" @click="deleteOne(scope.row)" @click.stop>
              {{ $t('common.delete', { name: '' }) }}
            </span>
          </template>
        </el-table-column>
      </apiot-table>
    </div>
    <footer class="globalSearch__footer">
      <apiot-pagination
        v-show="tableData.length"
        ref="pagination"
        :total="total"
        :size.sync="size"
        :selectedNum="selected.length"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        v-on:handle-cancel="doUnSelect"
      ></apiot-pagination>
    </footer>
    <SearchClassDrawer
      :visible.sync="showDrawer"
      :drawerType="drawerType"
      @addSuccess="addSuccess"
      ref="searchClass"
    ></SearchClassDrawer>
  </div>
</template>

<script>
import { pageGlobalSearch, saveSearch, batchDelete } from '@/api/globalSearch';
import SearchClassDrawer from './SearchClassDrawer';

export default {
  name: '',
  data() {
    return {
      tableData: [],
      current: 1,
      keywords: '',
      total: 0,
      size: 20,
      selected: [],
      drawerType: 1,
      showDrawer: false,
      loading: false,
    };
  },
  components: {
    SearchClassDrawer,
  },
  mounted() {
    this.pageGlobalSearch();
  },
  methods: {
    // 获取实体类
    async pageGlobalSearch() {
      const params = {
        current: this.current,
        size: this.size,
        keywords: this.keywords,
      };
      try {
        this.loading = true;
        const res = await pageGlobalSearch(params);
        this.total = res.total;
        this.tableData = res.records;
        this.selected = [];
        // console.log(res);
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    openDrawer(type, data) {
      this.drawerType = type;
      if (type === 1) {
        console.log('xinzneg');
        this.showDrawer = true;
      } else {
        console.log(data);
        this.showDrawer = true;
      }
      this.$nextTick(() => {
        this.$refs.searchClass.setValue(data);
      });
    },
    selectTable(arr) {
      // console.log(arr);
      this.selected = arr;
    },
    // 搜索
    search() {
      this.current = 1;
      this.pageGlobalSearch();
    },
    // 切换页面
    handleCurrentChange() {
      this.pageGlobalSearch();
    },
    // 切换页面大小
    handleSizeChange() {
      this.current = 1;
      this.pageGlobalSearch();
    },
    // 增加或者改修成功
    addSuccess() {
      this.current = 1;
      this.pageGlobalSearch();
      this.$bus.$emit('refreshSearchUser');
    },
    // 取消全选
    doUnSelect() {
      this.selected = [];
      this.$refs.globalSearchTable.clearSelection();
    },
    // 更改
    async changeEnable(row) {
      console.log(row);
      this.loading = true;
      const params = {
        ...row,
        enable: row.enable === 1 ? 2 : 1,
        config: JSON.stringify(row.config),
      };
      await saveSearch(params);
      this.loading = false;
      row.enable = params.enable;
      this.$bus.$emit('refreshSearchUser');
      this.$message.success('编辑实体类成功');
    },
    // 删除1个
    deleteOne(row) {
      this.batchDelete(row.id);
    },
    // 删除多个
    deleteMul() {
      if (!this.selected.length) {
        return this.$message.warning('请选择删除数据');
      }
      const idsArr = [];
      this.selected.forEach((item) => {
        idsArr.push(item.id);
      });
      this.batchDelete(idsArr.join(','));
    },
    async batchDelete(ids) {
      await batchDelete({
        ids,
      });
      this.$message.success('删除实体类成功');
      this.current = 1;
      this.pageGlobalSearch();
      this.$bus.$emit('refreshSearchUser');
    },
  },
};
</script>

<style lang="scss" scoped>
.globalSearch {
  padding: 0 10px;
  box-sizing: border-box;
  background: #fff;
  display: flex;
  flex-flow: column;
  margin: 10px;
  height: calc(100% - 20px);
  &__option {
    height: 42px;
    padding: 6px 0;
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    &__button,
    &__search {
      height: 100%;
      display: flex;
      align-items: center;
      border-radius: 4px;
      box-sizing: border-box;
      .apiotInput {
        width: 200px;
        float: right;
        height: 30px;
        margin-top: 3px;
        text-align: right;
        ::v-deep {
          .el-input__inner {
            width: 98%;
            height: 30px;
            margin-top: -2px;
            padding-left: 12px;
            font-size: 13px;
            cursor: pointer;
          }

          .el-input__prefix {
            left: auto;
            right: 15px;
            cursor: pointer;

            .icon-sousuo {
              line-height: 28px;
            }
          }
        }
      }
      input {
        height: 30px;
        width: 170px;
        border: none;
        background: none;
        padding: 0 10px;
        color: #aaaaaa;
        &::placeholder {
          color: #aaaaaa;
        }
        &:focus {
          outline: none;
        }
      }
      .iconfont {
        color: #d9d9d9;
        cursor: pointer;
        font-size: 16px;
      }
      .icon-xinzeng {
        color: #ffffff;
      }
    }
    &__button {
      border: none;
      .icon-shanchu {
        color: $--color-primary;
      }
    }
  }
  &__main {
    flex: 1;
    .field {
      margin-right: 4px;
      box-sizing: border-box;
      padding: 0px 5px;
      line-height: 24px;
      font-size: 14px;
      color: $--color-primary;
      background-color: $--hover-color;
      border-radius: 4px;
    }
  }
  &__footer {
    height: 42px;
    flex-shrink: 0;
  }
  ::v-deep {
    .item {
      padding-left: 10px;
    }
    .edit {
      color: $--color-primary;
      cursor: pointer;
      margin-right: 10px;
    }
    .txt {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .state {
      border-radius: 4px;
      padding: 0 8px;
      height: 25px;
      line-height: 25px;
      font-size: 14px;
      background: #f1f3f6;
      color: #6b798d;
    }
    .enable {
      color: #10b98a;
      background: #ebfcf7;
    }

    .icon-zongxiangtuodong {
      color: #aaaaaa;
    }
    .el-table__body .el-table__row .icon-zongxiangtuodong:hover {
      cursor: move;
    }
  }
}
</style>
