<!-- 页面 -->
<template>
  <div class="listWrap">
    <div class="tableWrap">
      <apiot-table
        :tableData="list"
        row-key="id"
        ref="Tables"
        :select-on-indeterminate="true"
        :showSelection="false"
        :isNeedColumnDrop="false"
        @selection-change="handleSelectionChange"
        @cell-mouse-enter="cellMouseEnter"
        @cell-mouse-leave="cellMouseLeave"
      >
        <el-table-column width="40">
          <template #header slot-scope>
            <el-checkbox
              :value="isCheckAll()"
              :checked="isCheckAll()"
              @change="handleCheckAllChange"
            >
            </el-checkbox>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.showIndex && !checkIschecked(scope.row)">{{
              scope.row.index + 1
            }}</span>
            <el-checkbox
              v-else
              :value="!!checkIschecked(scope.row)"
              @change="changeSelected(scope.row, !checkIschecked(scope.row))"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          show-overflow-tooltip
          :label="$t('knowledge.file_name')"
        >
          <template slot-scope="scope">
            <div @click="preView(scope.row)" class="inputWrap">
              <img class="listWrap__img" :src="getFileUrl(scope.row)" />
              <span>
                {{ scope.row.name || scope.row.sysKlTree.name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="businessName"
          :label="$t('knowledge.bus_name')"
        >
        </el-table-column>
        <el-table-column
          prop="businessCode"
          :label="$t('knowledge.bus_keycode')"
        >
        </el-table-column>
        <el-table-column prop="size" :label="$t('knowledge.bus_size')">
          <template slot-scope="scope">
            <span>{{ calculateSize(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="uploadUserName"
          :label="$t('knowledge.bus_create')"
        >
        </el-table-column>
        <el-table-column prop="uploadTime" :label="$t('knowledge.bus_time')">
        </el-table-column>
      </apiot-table>
    </div>
    <div class="paginationWrap" v-show="total">
      <apiot-pagination
        :selectedNum="selectKeys.length"
        :total="total"
        :current-page="current"
        :page-size="size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-on:handle-cancel="doUnSelect"
      ></apiot-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 0,
    },
    current: {
      type: Number,
      default: 0,
    },
    fetchList: {
      type: Function,
      default: () => {},
    },
    updateData: {
      type: Function,
      default: () => {},
    },
    selectList: {
      type: Function,
      default: () => {},
    },
    selectKeys: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    fileUrl: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      selected: [],
      checkAll: false,
      editFileName: '',
    };
  },

  components: {},

  computed: {
    calculateSize() {
      // 计算文件大小
      return function (item) {
        const { size } = item.sysKlTree || item;
        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;
        // eslint-disable-next-line no-unused-vars
        let ret = '';

        if (size >= gb) {
          ret = `${(size / (gb * 1.0)).toFixed(0)} GB`;
        } else if (size >= mb) {
          ret = `${(size / (mb * 1.0)).toFixed(0)} MB`;
        } else if (size >= kb) {
          ret = `${(size / (kb * 1.0)).toFixed(0)} KB`;
        } else if (size > 0) {
          ret = `${(size / 1.0).toFixed(0)} KB`;
        } else {
          ret = '0 KB';
        }
        return ret;
      };
    },
    isEdit() {
      return function (item) {
        return (
          this.edit &&
          this.selectKeys.length === 1 &&
          this.selectKeys[0].sysKlTree.id === item.sysKlTree.id
        );
      };
    },
    checkIschecked() {
      return function (obj) {
        return this.selectKeys.find((item) => {
          if (item.sysKlTree && obj.sysKlTree) {
            return item.sysKlTree.id === obj.sysKlTree.id;
          }
          return item.id === obj.id;
        });
      };
    },
    isCheckAll() {
      return function () {
        if (!this.selectKeys.length && !this.list.length) return false;
        return this.selectKeys.length === this.list.length;
      };
    },
    getFileUrl() {
      return function (obj) {
        return this.fileUrl(obj);
      };
    },
  },

  mounted() {
    // console.log('list');
  },

  methods: {
    async handleSizeChange(val) {
      // 切换页面条数
      await this.updateData('size', val);
      await this.fetchList();
    },
    async handleCurrentChange(val) {
      // 切换页码
      this.current = val;
      await this.updateData('current', val);
      await this.fetchList();
    },
    preView(item) {
      this.$emit('preview', item);
    },
    // 不允许空格
    doUnSelect() {
      this.updateData('selectKeys', []);
    },
    handleCheckAllChange(e) {
      const list = e ? this.list : [];
      this.checkAll = e;
      this.selectList(list);
      this.updateData('edit', false);
    },
    //  鼠标移入
    cellMouseEnter(row) {
      row.showIndex = false;
    },
    // 鼠标移出
    cellMouseLeave(row) {
      row.showIndex = true;
    },
    handleSelectionChange(row) {
      const newRow = JSON.parse(JSON.stringify(row));
      const arr = [];
      if (row.length) {
        newRow.forEach((item) => {
          const obj = {
            ...item,
            showIndex: false,
          };
          arr.push(obj);
        });
      }
      this.selectList(arr);
      this.updateData('edit', false);
    },
    changeSelected(row) {
      const list = [...this.selectKeys];
      const index = list.findIndex((item) => item.id === row.id);
      if (index === -1) {
        list.push(row);
      } else {
        list.splice(index, 1);
      }
      this.checkAll = this.list.length === list.length;
      this.selectList(list);
      this.updateData('edit', false);
    },
  },
  watch: {},
  name: 'ListContent',
};
</script>

<style lang="scss" scoped>
.listWrap {
  height: 100%;
  margin: 0 10px;
  .inputWrap {
    ::v-deep {
      .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .listWrap__img {
    margin-right: 14px;
    vertical-align: middle;
    cursor: pointer;

    & + span {
      cursor: pointer;
    }
  }
  .tableWrap {
    width: 100%;
    height: calc(100% - 43px);
  }
  .paginationWrap {
    height: 42px;
    width: 100%;
  }
}
</style>
