<!--
 * @Descripttion: 组织管理
 * @version:
 * @Author: tjf
 * @Date: 2021-04-08 13:50:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-06-03 09:58:35
-->
<!-- 组织管理 -->
<template>
  <div class="org-content">
    <div class="org-content__option">
      <div class="org-content__option__button">
        <apiot-button type="primary" @click="openDrawer({}, 'add')">
          <i class="iconfont icon-xinzeng m-r-6"></i>
          {{ $t('common.add', { name: $t('org.org') }) }}
        </apiot-button>
        <apiot-button class="m-l-8" @click="deleteOrg">
          <i class="iconfont icon-shanchu m-r-6"></i>
          {{ $t('common.delete', { name: $t('org.org') }) }}
        </apiot-button>
      </div>
      <div class="org-content__option__search">
        <!-- <apiot-sys-import
          @FETCH_NEW_LIST="fetchList"
          :templateId="103"
        ></apiot-sys-import> -->
        <search-input @getList="search" v-model="keywords"></search-input>
      </div>
    </div>
    <tree-table
      :tableData.sync="tableData"
      ref="treeTable"
      :loading="showLoading"
      @openDrawer="openDrawer"
      @getTreeChild="getTreeListData"
    >
      <el-table-column
        prop="name"
        :label="$t('org.org') + $t('common.name', { name: '' })"
        resizable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <apiot-checkbox
            :class="{
              hasNoParent:
                scope.row.childrenTotal === 0 && scope.row.parentId === 0,
              hasNoChild:
                scope.row.childrenTotal === 0 && scope.row.parentId !== 0,
            }"
            v-model="scope.row.isChecked"
            @change="(item) => checkChange(item, scope.row)"
            @click.native.stop
          >
          </apiot-checkbox>
          <i class="iconfont icon-zuzhi m-r-6 m-l-6"></i>
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="keyCode"
        :label="$t('org.keycode')"
        resizable
      ></el-table-column>
      <el-table-column
        prop="manage"
        :label="$t('org.manage')"
        resizable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div
            class="manage m-r-6 p-r-6"
            v-for="item in scope.row.leaders"
            :key="item.id"
          >
            <user-avatar :userItem="item"></user-avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="memo"
        :label="$t('common.desc')"
        resizable
      ></el-table-column>
      <el-table-column :label="$t('common.operate')" width="180">
        <template slot-scope="scope">
          <span class="edit" @click="openDrawer(scope.row, 'edit')" @click.stop>
            {{ $t('common.edit', { name: '' }) }}
          </span>
        </template>
      </el-table-column>
    </tree-table>
    <apiot-drawer
      @sure-click="handleSubmit"
      :visible.sync="visible"
      destroy-on-close
      ref="apiotDrawer"
      :title="
        type === 'add'
          ? $t('common.add', { name: $t('org.org') })
          : $t('common.edit', { name: $t('org.org') })
      "
    >
      <detail
        v-if="visible"
        :type="type"
        @submit="formSubmit"
        v-on="$listeners"
        v-bind="$attrs"
        ref="orgDetail"
        :editData="editData"
      >
      </detail>
    </apiot-drawer>
  </div>
</template>
<script>
import { addSysOrg, deleteSysOrg, editSysOrg, getOrgList } from '@/api/orgManage.js';
import apiotButton from '@/globalComponents/ApiotButton/index';
import apiotCheckbox from '@/globalComponents/ApiotCheckbox/index';
import apiotDrawer from '@/globalComponents/ApiotDrawer/index';
import detail from './components/detail/index';
import treeTable from './components/treeTable/index';
import userAvatar from './components/userAvatar/index';

export default {
  name: 'orgManage',
  components: {
    treeTable,
    detail,
    apiotButton,
    apiotDrawer,
    userAvatar,
    apiotCheckbox
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
      showLoading: false,
      isActive: false,
      curNodeId: null,
      isSubmit: false,
      currentRowId: null
    };
  },

  computed: {},

  mounted() {
    this.getTreeListData({ parentId: 0 });
  },

  methods: {
    fetchList() {
      this.getTreeListData({ parentId: 0 });
    },
    // 获取组织树
    getTreeListData(param, cb) {
      getOrgList(param).then((res) => {
        let tData = [];
        if (res.length > 0) {
          if (param.keywords) {
            this.tableData = [];
          }
          tData = res.map((item) => {
            // 子节点数量大于0时,设置hasChildren为true
            if (item.childrenTotal > 0) {
              item.hasChildren = true;
            } else {
              item.hasChildren = false;
            }
            const leaderIds = item.leaderId ? item.leaderId.split(',') : [];
            const leaderNames = item.leaderName ? item.leaderName.split(',') : [];
            const images = item.imageUrl ? item.imageUrl.split(',') : [];
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
            const hasChecked = this.$refs.treeTable.selectedIds.indexOf(item.id) >= 0;
            item.leaders = leaders;
            item.isChecked = hasChecked;
            if (item.id === this.currentRowId) {
              this.$refs.treeTable.setCurrentRow(item);
            }
            return item;
          });
          // 如果没有回调，默认更新整个树列表
          if (cb) {
            cb(tData);
          } else {
            this.$nextTick(() => {
              this.tableData = tData;
            });
          }
          // if (this.curNodeId) {
          //   const row = tData.filter((obj) => obj.id === this.curNodeId);
          //   this.$refs.treeTable.setCurrentRow(row[0]);
          //   // console.log(row[0]);
          // }
        } else if (this.keywords || param.parentId === 0) {
          this.tableData = [];
        } else {
          // 子节点数据为空时根据id更新节点数据
          this.$refs.treeTable.reload(param.parentId);
        }
      });
    },
    // 打开新增编辑弹窗
    openDrawer(item = {}, type) {
      this.editData = item;
      this.type = type;
      this.visible = !this.visible;
    },
    // 关闭新增编辑弹窗
    close() {
      this.visible = false;
      this.editData = {};
      this.$refs.apiotDrawer.loading = false;
    },
    // 关键字搜索组织
    search() {
      if (this.keywords === '') {
        this.getTreeListData({ parentId: 0 });
      } else {
        this.getTreeListData({ keywords: this.keywords });
      }
    },
    checkChange(type, item) {
      this.$refs.treeTable.checkChange(type, item);
    },
    transFormArr(arr) {
      let str = '';
      arr.forEach((item, index) => {
        if (index < arr.length) {
          str = `${str}${item.username},`;
        } else {
          str += item.username;
        }
      });
      return str;
    },
    // 新增组织
    async addOrg(param) {
      try {
        if (!param.parentId) {
          param.parentId = 0;
          param.rootPath = '0';
        }
        const params = {
          ...param,
          logData: {
            operateType: 1,
            name: {
              name: this.$t('common.name', { name: '' })
            },
            parentName: {
              name: this.$t('org.organization')
            },
            leaderId: {
              name: this.$t('org.manage'),
              showStr: this.transFormArr(param.leaders)
            },
            memo: {
              name: this.$t('common.desc')
            }
          }
        };
        delete params.leaders;
        // console.log(params);
        const res = await addSysOrg(params);
        // 新增成功之后更新父节点
        if (res.parentId === 0) {
          this.getTreeListData({ parentId: 0 });
        } else {
          this.$refs.treeTable.updateTable(res.parentId, res.rootPath);
        }
        this.curNodeId = res.id;
        this.currentRowId = res.id;
        // this.$refs.treeTable.setCurrentRow(res);
        this.isSubmit = false;
        this.close();
        this.$message.success('操作成功！');
      } catch (error) {
        this.isSubmit = false;
        if (error.name) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('org.org') })} ${error.name}`
          });
        }
      }
    },
    // 编辑组织
    async editOrg(param) {
      try {
        param.id = this.editData.id;
        let type = 1;
        // 有修改所属组织
        if (param.parentId !== 0 && String(this.editData.parentId) !== String(param.parentId)) {
          param.rootPath = `${param.rootPath}${param.id}/`;
          type = 2;
        }
        const params = {
          ...param,
          logData: {
            operateType: 2,
            name: {
              name: this.$t('common.name', { name: '' })
            },
            parentName: {
              name: this.$t('org.organization')
            },
            leaderId: {
              name: this.$t('org.manage'),
              showStr: this.transFormArr(param.leaders)
            },
            memo: {
              name: this.$t('common.desc')
            }
          }
        };
        delete params.leaders;
        const res = await editSysOrg(params);
        this.currentRowId = res.id;
        // 编辑成功之后更新父节点
        this.$refs.treeTable.updateTable(res.parentId, res.rootPath);
        // 如果有修改所属组织，需要更新之前的父节点
        if (type === 2) {
          if (this.editData.parentId === 0) {
            this.getTreeListData({ parentId: 0 });
          } else {
            this.$refs.treeTable.updateTable(this.editData.parentId, this.editData.rootPath);
          }
        }
        this.isSubmit = false;
        this.close();
        this.$message.success('操作成功！');
      } catch (error) {
        this.isSubmit = false;
        if (error.name) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('org.org') })} ${error.name}`
          });
        }
      }
    },
    formSubmit(params) {
      if (this.isSubmit) return;
      this.isSubmit = true;
      if (this.type === 'add') {
        this.addOrg(params);
      } else {
        this.editOrg(params);
      }
    },
    handleSubmit() {
      this.$refs.orgDetail.sureClick();
    },
    compare(property) {
      return (a, b) => {
        const value1 = a[property];
        const value2 = b[property];
        return value1 - value2;
      };
    },
    // 删除组织
    deleteOrg() {
      if (this.$refs.treeTable.selectedIds.length === 0) {
        this.$message.error('请先选择组织！');
        return;
      }
      // 列表选中的组织id
      const ids = String(this.$refs.treeTable.selectedIds);
      // 列表选中的组织
      let selectRows = JSON.parse(JSON.stringify(this.$refs.treeTable.selectRows));
      selectRows = selectRows.sort(this.compare('id'));
      this.$confirm('是否删除该组织?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSysOrg({
            ids,
            logData: {
              operateType: 3,
              name: this.$t('org.org') + this.$t('common.name', { name: '' }),
              value: 'name',
              deleteArr: selectRows
            }
          }).then(() => {
            this.$refs.treeTable.reset();
            this.updateIds = [];
            // 删除成功之后挨个更新父节点
            selectRows.forEach((item) => {
              // 如果已经更新，则不在重复更新
              if (this.updateIds.indexOf(item.parentId) === -1) {
                if (item.parentId === 0) {
                  this.getTreeListData({ parentId: 0 });
                } else {
                  this.$refs.treeTable.updateTable(item.parentId, item.rootPath);
                }
                this.updateIds.push(item.parentId);
              }
            });
            this.$message.success('删除成功！');
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/orgManage/index.scss';
</style>
