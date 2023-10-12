<!-- 页面 -->
<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :title="$t('common.user')"
    class="userDialog"
    @sure-click="handleSure"
  >
    <div class="option">
      <div class="option__select">
        <span>查阅状态：</span>
        <apiot-select
          v-model="isHaveRead"
          filterable
          placeholder="查阅状态"
          @change="changeSelect"
        >
          <el-option label="全部" :value="0"></el-option>
          <el-option label="已阅" :value="1"></el-option>
          <el-option label="未阅" :value="2"></el-option>
        </apiot-select>
      </div>
      <div class="announce-content__option__search">
        <search-input @getList="search" v-model.trim="keywords"></search-input>
      </div>
    </div>
    <el-table
      :data="tableData"
      row-key="userid"
      :height="tableHeight"
      ref="announceRecordTable"
    >
      <el-table-column
        prop="userName"
        :label="$t('announce.receiver')"
        width="330"
      >
        <template slot-scope="scope">
          <user-avatar :userItem="scope.row.user"></user-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="title" :label="$t('common.state')">
        <template slot-scope="scope">
          <span class="read" v-if="scope.row.isHaveRead === 1">已阅</span>
          <span class="unread" v-if="scope.row.isHaveRead === 2">未阅</span>
        </template>
      </el-table-column>
    </el-table>
    <footer class="announce-content__footer">
      <apiot-pagination
        v-show="tableData.length"
        ref="announcepagination"
        :total="total"
        :size.sync="size"
        :selectedNum="selected.length"
        :pager-count="5"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></apiot-pagination>
    </footer>
  </apiot-dialog>
</template>

<script>
import { getAnnounceUser } from '@/api/announceManage';
import userAvatar from '@/views/orgManage/components/userAvatar/index';

export default {
  data() {
    return {
      // 组织列表数据
      tableData: [],
      current: 1,
      size: 20,
      selected: [],
      total: 0,
      isHaveRead: 0,
      loading: false,
      keywords: '',
      tableHeight: 300
    };
  },

  props: {
    // 当前对象
    currentTableObj: {
      type: Object,
      default: () => {}
    }
  },
  components: { userAvatar },

  computed: {},

  mounted() {
    this.changeHeight();
    this.initAccessRecords();
  },
  beforeDestroy() {},

  methods: {
    handleSure(e) {
      if (e.relatedContext.element.id === 1) return false;
      return true;
    },
    // 改变高度
    changeHeight() {
      setTimeout(() => {
        if (this.$refs.announceRecordTable) {
          const parent = this.$refs.announceRecordTable.$el.parentNode;
          this.tableHeight = parent.offsetHeight;
          console.log(this.tableHeight);
        }
      }, 0);
    },
    async initAccessRecords() {
      try {
        this.loading = true;
        const param = {
          announceId: this.currentTableObj.id,
          current: this.current,
          size: this.size,
          username: this.keywords,
          isHaveRead: this.isHaveRead
        };
        const res = await getAnnounceUser(param);
        this.tableData = res.records.map((item) => {
          const obj = {
            ...item,
            user: {
              username: item.userName,
              id: item.userid,
              image: item.imageUrl || ''
            }
          };
          return obj;
        });
        this.total = res.total;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    // 关键字搜索组织
    search() {
      this.current = 1;
      this.initAccessRecords();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.initAccessRecords();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.initAccessRecords();
    },
    changeSelect(e) {
      this.current = 1;
      console.log(e);
      this.initAccessRecords();
    }
  },
  name: 'List'
};
</script>

<style lang='scss' scoped>
.userDialog {
  ::v-deep {
    .el-dialog {
      width: 700px;
    }
  }
}
.option {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  height: 30px;
  ::v-deep {
    .el-input,
    .el-input__inner {
      height: 30px;
    }
  }
  &__select {
    width: 180px;
    margin-right: 10px;
    text-align: right;
    .el-select {
      width: 100px;
    }
  }
}
.pagination {
  border: none;
}
.read {
  height: 26px;
  background: #ebfcf7;
  border-radius: 4px;
  padding: 0 8px;
  color: #10b98a;
  font-size: 14px;
  line-height: 26px;
}
.unread {
  height: 26px;
  background: #f1f3f6;
  border-radius: 4px;
  padding: 0 8px;
  color: #6b798d;
  font-size: 14px;
  line-height: 26px;
}
</style>
