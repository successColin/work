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
          {{ $t('common.add', { name: $t('announce.announce') }) }}
        </apiot-button>
        <apiot-button class="m-l-8" @click="deleteOrg">
          <i class="iconfont icon-shanchu m-r-6"></i>
          {{ $t('common.delete', { name: $t('announce.announce') }) }}
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
        :isNeedRowDrop="false"
        :isNeedColumnDrop="false"
        @selection-change="selectTable"
        ref="announceTable"
      >
        <el-table-column prop="title" :label="$t('announce.announcementTitle')">
          <template slot-scope="scope">
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
        <el-table-column :label="$t('announce.issuer')" :width="150">
          <template slot-scope="scope">
            <user-avatar :userItem="scope.row.userInfo"></user-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('announce.enableTime')"
          :width="100"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.startTime ? scope.row.startTime.substring(0, 10) : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          :label="$t('announce.expirationTime')"
          :width="100"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.endTime ? scope.row.endTime.substring(0, 10) : ''
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="txt" :label="$t('importTemplate.content')">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.txt"
              placement="top"
            >
              <div class="txt">{{ scope.row.txt }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="memo" :label="$t('importTemplate.remark')">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.memo"
              placement="top"
            >
              <div class="txt">{{ scope.row.memo }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operate')" :width="160">
          <template slot-scope="scope">
            <span
              class="edit"
              @click="openDrawer(scope.row, 'edit')"
              @click.stop
            >
              {{ $t('common.edit', { name: '' }) }}
            </span>
            <span
              class="edit"
              @click="openAccessRecords(scope.row)"
              @click.stop
            >
              {{ $t('announce.accessRecords') }}
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
          ? $t('common.add', { name: $t('announce.announce') })
          : $t('common.edit', { name: $t('announce.announce') })
      "
      :placeholder="
        $t('placeholder.pleaseEnterAny', {
          any: '',
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
    <access-records
      v-if="accessVisible"
      :visible.sync="accessVisible"
      :currentTableObj.sync="editData"
    ></access-records>
  </div>
</template>
<script>
import { deleteAnnounce, getAnnounceList, modifyAnnounce } from '@/api/announceManage.js';
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import accessRecords from '../accessRecords/index';
import EditDrawer from '../EditDrawer/index';

export default {
  name: 'announceManage',
  components: {
    EditDrawer,
    // detail,
    userAvatar,
    accessRecords
  },
  data() {
    return {
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
      group: {},
      accessVisible: false
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
    // 获取组织树
    async getListData() {
      const param = {
        groupId: this.group.id,
        current: this.current,
        size: this.size,
        searchKey: this.keywords
      };
      const res = await getAnnounceList(param);
      this.tableData = res.records.map((item, index) => {
        const obj = {
          ...item,
          userInfo: {
            username: item.userName,
            image: item.imageUrl,
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
    openAccessRecords(item = {}) {
      this.editData = {
        ...item
      };
      this.accessVisible = !this.accessVisible;
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
        await modifyAnnounce(param);
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
        this.$message.error('请先选择公告！');
        return;
      }
      let ids = '';
      // 列表选中的组织id
      this.selected.forEach((item) => {
        ids += `${item.id},`;
      });
      this.$confirm('是否删除所选公告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAnnounce({
            announceIds: ids,
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
