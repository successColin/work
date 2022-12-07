<!--
 * @Descripttion: 组织管理
 * @version:
 * @Author: tjf
 * @Date: 2021-04-08 13:50:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-06-03 10:04:23
-->
<!-- 组织管理 -->
<template>
  <div class="announce-content">
    <div class="announce-content__option">
      <div class="announce-content__option__button">
        <apiot-button type="primary" @click="openDrawer({}, 'add')">
          <i class="iconfont icon-xinzeng m-r-6"></i>
          {{ $t('common.add', { name: $t('announce.article') }) }}
        </apiot-button>
        <apiot-button class="m-l-8" @click="deleteOrg">
          <i class="iconfont icon-shanchu m-r-6"></i>
          {{ $t('common.delete', { name: $t('announce.article') }) }}
        </apiot-button>
      </div>
      <div class="announce-content__option__search">
        <search-input @getList="search" v-model.trim="keywords"></search-input>
      </div>
    </div>

    <div class="announce-content__main">
      <apiot-table
        :tableData="tableData"
        row-key="id"
        :isNeedRowDrop="true"
        :isNeedColumnDrop="false"
        @selection-change="selectTable"
        ref="announceTable"
        @row-drop-end="handleRowDropEnd"
      >
        <el-table-column prop="title" :label="$t('announce.articleTitle')">
          <template slot-scope="scope">
            <i :class="`iconfont icon-zongxiangtuodong`"></i>
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.title"
              placement="top"
            >
              <div class="txt">{{ scope.row.title }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 是否置顶 -->
        <el-table-column
          prop="isPlacedTop"
          :label="$t('announce.topOrNot')"
          :width="100"
        >
          <template slot-scope="scope">
            <apiot-switch
              v-model="scope.row.isPlacedTop"
              :active-value="1"
              :inactive-value="0"
              class="passwordConfig__switch"
              @change="changePlacedTop(scope.row)"
            ></apiot-switch>
          </template>
        </el-table-column>
        <!-- 评论设置 -->
        <el-table-column label="是否控制评论" :width="130">
          <template slot-scope="scope">
            <apiot-switch
              v-model="scope.row.audit"
              :active-value="1"
              :inactive-value="2"
              class="passwordConfig__switch"
              @change="changePlacedTop(scope.row)"
            ></apiot-switch>
          </template>
        </el-table-column>
        <!-- 发布人 -->
        <el-table-column :label="$t('announce.issuer')" :width="150">
          <template slot-scope="scope">
            <user-avatar :userItem="scope.row.userInfo"></user-avatar>
          </template>
        </el-table-column>
        <!-- 发布时间 -->
        <el-table-column prop="createTime" label="发布时间" :width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column :label="$t('common.operate')" :width="160">
          <template slot-scope="scope">
            <span
              class="edit"
              @click="openDrawer(scope.row, 'edit')"
              @click.stop
            >
              {{ $t('common.edit', { name: '' }) }}
            </span>
            <span class="edit" @click="openDialog(scope.row)">
              查看评论({{ scope.row.comment }})
            </span>
          </template>
        </el-table-column>
      </apiot-table>
    </div>
    <footer class="announce-content__footer">
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
    <!-- 抽屉 -->
    <edit-drawer
      :title="
        type === 'add'
          ? $t('common.add', { name: $t('announce.article') })
          : $t('common.edit', { name: $t('announce.article') })
      "
      :placeholder="
        $t('placeholder.pleaseEnterAny', {
          any: $t('announce.articleTitle'),
        })
      "
      :drawerTitle="$t('helpCenter.text')"
      :visible.sync="visible"
      :isShow="visible"
      :group="group"
      :currentTableObj.sync="editData"
      :isAddDrawerState="type === 'add'"
      @getTableList="getListData"
    >
    </edit-drawer>
    <read-comments
      v-if="commentsVisible"
      :currentTableObj.sync="editData"
      :visible.sync="commentsVisible"
    ></read-comments>
  </div>
</template>
<script>
import {
  pageArticle,
  modifyArticle,
  batchDeleteArticle,
  switchLocation
} from '@/api/articleManage';
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import EditDrawer from '../EditDrawer/index';
import ReadComments from '../ReadComments';

export default {
  name: 'announceManage',
  components: {
    EditDrawer,
    // detail,
    userAvatar,
    ReadComments
  },
  data() {
    return {
      commentsVisible: false,
      // 组织列表数据
      tableData: [],
      // 是否显示新建组织弹窗
      visible: false,
      // 搜索关键字
      keywords: '',
      // 编辑数据
      editData: {},
      // 选中的组织id
      checkedIds: '',
      // 新增or编辑
      type: 'add',
      // 已经更新的父节点
      updateIds: [],
      isActive: false,
      isSubmit: false,
      current: 1,
      size: 20,
      selected: [],
      total: 0,
      group: {}
    };
  },

  computed: {},
  watch: {
    group: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue && newValue.id) {
          this.getListData();
        }
      }
    }
  },

  mounted() {
    this.$bus.$on('announceGroup', (item) => {
      this.group = item;
    });
    this.$bus.$on('roleGroupList', (message) => {
      this.roleGroupList = message;
    });
  },
  beforeDestroy() {
    this.$bus.$off('roleGroup', () => {});
    this.$bus.$off('roleGroupList', () => {});
  },

  methods: {
    async handleRowDropEnd({ oldIndex, newIndex }) {
      console.log(this.tableData[oldIndex]);
      const currentDictValue = this.tableData[oldIndex];
      this.tableData.splice(oldIndex, 1);
      this.tableData.splice(newIndex, 0, currentDictValue);
      await switchLocation({
        id: this.tableData[oldIndex].id,
        sno: this.tableData[oldIndex].sno,
        switchSno: this.tableData[newIndex].sno,
        tableName: 'sys_article',
        logData: {
          operateType: 4,
          name: '文章内容',
          switchName: this.tableData[newIndex].title
        }
      });
    },
    openDialog(item = {}) {
      this.commentsVisible = true;
      this.editData = item;
    },
    // 获取组织树
    async getListData() {
      const param = {
        groupId: this.group.id,
        current: this.current,
        size: this.size,
        searchKey: this.keywords
      };
      const res = await pageArticle(param);
      this.tableData = res.records.map((item, index) => {
        const obj = {
          ...item,
          userInfo: {
            username: item.userName,
            image: item.icon.imageUrl,
            id: index + 1
          }
        };
        const leaderIds = item.childIds ? item.childIds.split(',') : [];
        const leaderNames = item.childNames ? item.childNames.split(',') : [];
        const images = item.childImages ? item.childImages.split(',') : [];
        const colors = item.color ? item.color.split(',') : [];
        const leaders = [];
        // 拆分leaderIds跟leaderNames生产管理人员对象
        for (let i = 0; i < leaderIds.length; i += 1) {
          leaders.push({
            username: leaderNames[i],
            id: leaderIds[i],
            image: images[i],
            color: colors[i]
          });
        }
        obj.leaders = leaders;
        return obj;
      });
      this.total = res.total;
    },
    // 打开新增编辑弹窗
    openDrawer(item = {}, type) {
      this.editData = item;
      this.type = type;
      console.log(item, 'item');
      this.visible = !this.visible;
    },
    // 关键字搜索组织
    search() {
      this.current = 1;
      this.getListData();
    },
    async changePlacedTop(row) {
      try {
        const param = {
          ...row
        };
        delete param.leaders;
        delete param.userInfo;
        console.log(row, 'row');
        console.log(param);
        await modifyArticle(param);
      } catch (error) {
        this.getListData();
        if (error.name) {
          return this.$message({
            type: 'warning',
            message: this.$t('announce.operationFailed')
          });
        }
      }
    },
    // 删除组织
    deleteOrg() {
      if (this.selected.length === 0) {
        this.$message.error('请先选择文章！');
        return;
      }
      let ids = '';
      // 列表选中的组织id
      this.selected.forEach((item) => {
        ids += `${item.id},`;
      });
      this.$confirm('是否删除所选文章?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          batchDeleteArticle({
            ids,
            logData: {
              operateType: 3,
              name: this.$t('post.post') + this.$t('common.name', { name: '' }),
              value: 'name',
              deleteArr: this.selected
            }
          }).then(() => {
            this.getListData();
            this.$message.success('删除成功！');
          });
        })
        .catch(() => {});
    },
    selectTable(row) {
      // 选中数据
      this.selected = row;
    },
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getListData();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getListData();
    },
    // 取消全选
    doUnSelect() {
      this.selected = [];
      this.$refs.announceTable.clearSelection();
    },
    releaseTime(time) {
      return time;
    }
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
