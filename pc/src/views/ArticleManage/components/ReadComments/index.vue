<!--
 * @Descripttion: 查看评论
 * @Author: ytx
 * @Date: 2022-11-29 16:38:36
 * @Last Modified by: ytx
 * @Last Modified time: 2022-11-29 16:38:36
-->
<template>
  <div class="readComments">
    <apiot-dialog
      v-bind="$attrs"
      v-on="$listeners"
      title="查看评论"
      :isShowSure="false"
    >
      <div class="readComments__header">
        <div class="readComments__header--btn">
          <!-- <apiot-button>
            <i class="iconfont icon-shanchu m-r-3"></i>
            删除
          </apiot-button> -->
        </div>
        <search-input @getList="search" v-model.trim="keywords"></search-input>
      </div>
      <apiot-table
        class="readComments__table"
        :tableData="tableData"
        dropClass=".readComments__table"
        :isNeedRowDrop="false"
        :isNeedColumnDrop="false"
      >
        <el-table-column label="人员" :width="100">
          <template slot-scope="scope">
            <user-avatar :userItem="scope.row.userInfo"></user-avatar>
          </template>
        </el-table-column>
        <!-- 发布时间 -->
        <el-table-column label="内容">
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <!-- 发布时间 -->
        <el-table-column label="时间" :width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="auditStatus" label="状态" :width="80">
          <template slot-scope="scope">
            <apiot-switch
              v-model="scope.row.auditStatus"
              :active-value="1"
              :inactive-value="2"
              @change="changePlacedTop(scope.row)"
            ></apiot-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('common.operate')" :width="90">
          <template slot-scope="scope">
            <span class="edit" @click="handleDelete(scope.row.id)">删除</span>
          </template>
        </el-table-column>
      </apiot-table>
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
  </div>
</template>

<script>
import { getPageSysCommentVo, updateCommentStatus, deleteComment } from '@/api/announceManage';
import userAvatar from '@/views/orgManage/components/userAvatar/index';

export default {
  props: {
    currentTableObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableData: [],
      current: 1,
      size: 20,
      selected: [],
      total: 0,
      isHaveRead: 0,
      keywords: '',
      tableHeight: 300
    };
  },

  computed: {},

  components: { userAvatar },

  mounted() {
    this.getTableDate();
  },

  methods: {
    // 获取
    async getTableDate() {
      const params = {
        articleId: this.currentTableObj.id,
        current: this.current,
        size: this.size,
        searchKey: this.keywords
      };
      const res = await getPageSysCommentVo(params);
      this.total = res.total;
      this.tableData = res.records.map((item, index) => {
        const obj = {
          ...item,
          userInfo: {
            username: item.userName,
            image: item.icon.imageUrl,
            id: index + 1
          }
        };
        return obj;
      });
    },
    // 删除评论
    async handleDelete(id) {
      await deleteComment({
        id
      });
      this.$message({
        type: 'success',
        message: '删除成功'
      });
      this.getTableDate();
    },
    // 改变评论状态
    async changePlacedTop(row) {
      try {
        const param = {
          ids: row.id,
          status: row.auditStatus
        };
        await updateCommentStatus(param);
      } catch (error) {
        this.getTableDate();
        if (error.name) {
          return this.$message({
            type: 'warning',
            message: this.$t('announce.operationFailed')
          });
        }
      }
    },
    // 关键字搜索组织
    search() {
      this.current = 1;
      this.getTableDate();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getTableDate();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getTableDate();
    }
  }
};
</script>

<style lang='scss' scoped>
.readComments {
  &__header {
    display: flex;
    justify-content: space-between;
    &--btn {
      color: #333333;
      font-size: 14px;
      .icon-shanchu {
        color: #4689f5;
      }
    }
  }
  &__table {
    margin-top: 6px;
  }
  ::v-deep {
    .el-dialog__body {
      padding-top: 6px;
    }
    .el-dialog {
      width: 700px;
    }
  }
}
</style>
