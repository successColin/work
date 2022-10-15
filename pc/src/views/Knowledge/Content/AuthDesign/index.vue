<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:25:54
 * @Des: tab 页面封装
-->
<template>
  <transition name="slide-bottom">
    <div class="tabs" v-if="showTabs">
      <apiot-button
        class="tabs__return"
        @click="$emit('update:showTabs', false)"
      >
        <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
      </apiot-button>
      <div class="tabs__obj">
        <span>{{ $t('role.treat') }}</span>
        <span
          v-for="item in selectedKeys"
          :key="item.id"
          class="tabs__obj__filename"
        >
          【{{ item.sysKlTree.name }}】</span
        >
        <span>{{ $t('knowledge.Assign_file_permissions') }}</span>
      </div>
      <div class="tabs__content">
        <div class="tabs__content__left">
          <el-tabs
            class="tabs__content__wrap"
            v-model="activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane
              :label="$t('knowledge.By_organization')"
              name="org"
            ></el-tab-pane>
            <el-tab-pane
              :label="$t('knowledge.By_role')"
              name="role"
            ></el-tab-pane>
            <el-tab-pane
              :label="$t('knowledge.By_position')"
              name="pos"
            ></el-tab-pane>
          </el-tabs>
          <div class="tabs__content__type">
            <div class="tabs__content__search" style="padding-right: 0;">
              <search-input
                style="width: 226px; margin: 0 auto; float: none"
                @getList="doSearch"
                v-model="input"
              ></search-input>
            </div>
            <div class="tabs__content__typeWrap">
              <OrgTree
                v-if="activeName === 'org'"
                ref="org"
                isolationSign="knowledge"
              ></OrgTree>
              <RoleTree
                v-if="activeName === 'role'"
                ref="role"
                isolationSign="knowledge"
                :isSearch="isSearch"
              ></RoleTree>
              <PositionTree
                v-if="activeName === 'pos'"
                ref="pos"
                isolationSign="knowledge"
              ></PositionTree>
            </div>
          </div>
        </div>
        <div class="tabs__content__right" v-loading="loading">
          <div
            class="tabs__content__search"
            style="border-bottom: 1px solid #e9e9e9"
          >
            <search-input
              @getList="getFileList"
              v-model="keyWord"
            ></search-input>
          </div>
          <div class="tabs__content__table">
            <apiot-table
              :tableData="tableData"
              :showSelection="false"
              border
              style="width: 100%"
            >
              <user-avatar
                keyName="userName"
                :label="$t('knowledge.name')"
                userid="userId"
              ></user-avatar>
              <el-table-column
                prop="selectAllow"
                :render-header="
                  (h, { column }) => renderHeader(h, { column }, 2)
                "
                :label="$t('role.look')"
              >
                <template slot-scope="scope">
                  <apiot-checkbox
                    :value="!!scope.row.selectAllow"
                    @change="(e) => changeAuth(e, scope.row, 2)"
                  ></apiot-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="editAllow"
                :render-header="
                  (h, { column }) => renderHeader(h, { column }, 1)
                "
                :label="$t('role.edit')"
              >
                <template slot-scope="scope">
                  <apiot-checkbox
                    :value="!!scope.row.editAllow"
                    @change="(e) => changeAuth(e, scope.row, 1)"
                  ></apiot-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="deleteAllow"
                :render-header="
                  (h, { column }) => renderHeader(h, { column }, 3)
                "
                :label="$t('role.delete')"
              >
                <template slot-scope="scope">
                  <apiot-checkbox
                    :value="!!scope.row.deleteAllow"
                    @change="(e) => changeAuth(e, scope.row, 3)"
                  ></apiot-checkbox>
                </template>
              </el-table-column>
              <el-table-column
                prop="all"
                :render-header="
                  (h, { column }) => renderHeader(h, { column }, 4)
                "
                :label="$t('knowledge.all')"
              >
                <template slot-scope="scope">
                  <apiot-checkbox
                    :value="isSelectAll(scope.row)"
                    @change="(e) => changeAuth(e, scope.row, 4)"
                  ></apiot-checkbox>
                </template>
              </el-table-column>
            </apiot-table>
          </div>
          <div class="paginationWrap" v-show="total">
            <apiot-pagination
              :total="total"
              :current-page="current"
              :page-size="size"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></apiot-pagination>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { getUserList, upadteKnowledge } from '@/api/knowledge';

const userAvatar = () => import('@/views/Users/Main/UserColumn/index');
const RoleTree = () => import('@/views/Users/Left/RoleList/roleTree');
const PositionTree = () => import('@/views/Users/Left/PositionTree/positionTree');
const OrgTree = () => import('@/views/Users/Left/OrgTree/orgTree');
export default {
  inheritAttrs: false,
  props: {
    showTabs: {
      type: Boolean,
      default: false
    },
    selectedKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      current: 1,
      size: 10,
      total: 0,
      checkAll: false,
      activeName: 'org',
      keyWord: '',
      isSearch: false, // 标识是否是角色查询
      input: '',
      tableData: [],
      selectTreeNode: {} // 左侧选中的数据
    };
  },

  components: {
    OrgTree,
    RoleTree,
    PositionTree,
    userAvatar
  },

  computed: {
    isSelectAll() {
      return function(obj) {
        return !!obj.deleteAllow && !!obj.editAllow && !!obj.selectAllow;
      };
    }
  },

  mounted() {
    this.$bus.$off('selectTreeNode_knowledge').$on('selectTreeNode_knowledge', (message) => {
      // console.log(message, 'selectTreeNode');
      this.selectTreeNode = message;
    });
  },
  watch: {
    selectTreeNode: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.id) {
          this.current = 1;
          this.shouldResetAll = true;
          this.fetchUsers(newValue, 'do');
        }
      }
    }
  },
  methods: {
    getParams() {
      // 获取用户列表及权限
      const commonParams = {
        current: this.current,
        size: this.size,
        fileId: this.selectedKeys[0].sysKlTree.id,
        keywords: this.keyWord,
        groupById: this.selectTreeNode.id
      };
      let params = {};
      if (this.activeName === 'org') {
        params = {
          ...commonParams,
          groupByType: 1
        };
      }
      if (this.activeName === 'role') {
        if (Object.prototype.hasOwnProperty.call(this.selectTreeNode, 'roleName')) {
          params = {
            ...commonParams,
            groupByType: 2
          };
        } else {
          params = {
            ...commonParams,
            groupByType: 2,
            roleGroupId: this.selectTreeNode.id
          };
          delete params.groupById;
        }
      }
      if (this.activeName === 'pos') {
        params = {
          ...commonParams,
          groupByType: 3
        };
      }
      return params;
    },
    async fetchUsers() {
      const params = this.getParams();
      this.loading = true;
      try {
        const res = await getUserList(params);
        this.total = res.total;
        this.tableData = res.records || [];
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    handleCurrentChange(current) {
      this.current = current;
      this.fetchUsers();
    },
    handleSizeChange(size) {
      this.size = size;
      this.fetchUsers();
    },
    async changeAuth(e, row, type) {
      // 修改权限
      // console.log(e, row);
      const params = {
        fileId: this.selectedKeys[0].sysKlTree.id,
        userIds: row.userId,
        powers: type === 4 ? '1,2,3' : type,
        type: e ? 1 : 2
      };
      this.doAuthUpdadte(params);
    },
    async doAuthUpdadte(params) {
      this.loading = true;
      try {
        await upadteKnowledge(params);
        await this.fetchUsers();
        this.loading = false;
        // eslint-disable-next-line no-shadow
      } catch (e) {
        this.loading = false;
      }
    },
    renderHeader(h, { column }, type) {
      return h('div', [
        h('el-checkbox', {
          style: 'margin-right:5px;',
          on: {
            change: ($event) => this.select($event, column, type)
            // 选中事件 $event, column，这里$event=true,column是input的dom当在select里打印的时候
          }
        }),
        h('span', column.label)
      ]);
    },
    select(e, column, type) {
      if (!this.tableData.length) return;
      const { property } = column;
      let userIdsArr = [];
      if (type !== 4) {
        const updateArr = this.tableData.filter((item) => !item[property] === e);
        userIdsArr = updateArr.map((item) => item.userId);
      } else {
        userIdsArr = this.tableData.map((item) => item.userId);
      }
      if (!userIdsArr.length) return;
      const params = {
        fileId: this.selectedKeys[0].sysKlTree.id,
        userIds: userIdsArr.join(','),
        powers: type === 4 ? '1,2,3' : type,
        type: e ? 1 : 2
      };
      this.doAuthUpdadte(params);
    },
    handleClick({ name }) {
      this.activeName = name;
      this.input = '';
    },
    doSearch() {
      // 进行模糊查询
      if (this.activeName === 'org') {
        const params = this.input ? { keywords: this.input } : { parentId: 0 };
        this.$refs.org.getOrgTree(params);
      } else if (this.activeName === 'role') {
        if (this.input) {
          this.isSearch = true;
          this.$refs.role.getRoleList({ roleName: this.input });
        } else {
          this.isSearch = false;
          this.$refs.role.getOrgTree();
        }
      } else {
        const params = this.input ? { keywords: this.input } : { parentId: 0 };
        this.$refs.pos.getOrgTree(params);
      }
    },
    getFileList() {
      this.current = 1;
      this.fetchUsers();
    }
  }
};
</script>

<style lang='scss' scoped>
.tabs {
  position: fixed;
  top: -200px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  background: rgba(0, 0, 0, 0.3);

  ::v-deep {
    .tabs__return {
      top: 250px;
    }
  }

  &__return {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 1px 0 0;
    border-color: #ebebeb;
    border-radius: 0;
    color: #333333;
    font-size: 16px;
    box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 10%);

    i {
      font-size: 20px;
      margin-right: 8px;
      color: #9b9b9b;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: #ebebeb !important;
      background-color: #fff !important;

      i {
        color: $--color-primary;
      }
    }
  }

  &__obj {
    position: absolute;
    left: 100px;
    top: 250px;
    right: 0;
    height: 46px;
    padding-left: 22px;
    z-index: 1;
    border-radius: 0;
    color: #333333;
    background: #ffffff;
    line-height: 46px;
    box-sizing: border-box;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 10%);

    &__filename {
      color: $--color-primary;
    }
  }

  &__content {
    position: absolute;
    display: flex;
    padding: 10px 10px 0 10px;
    top: 296px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    box-sizing: border-box;

    &__left {
      flex: 0 0 240px;
      box-sizing: border-box;
      background: #ffffff;

      ::v-deep {
        .el-tabs__header {
          margin: 0;
        }

        .el-tabs__item {
          height: 42px;
          line-height: 42px;
        }

        .el-tabs--top .el-tabs__item.is-top:nth-child(2),
        .el-tabs--top .el-tabs__item.is-top:last-child {
          padding: 0 20px;
        }

        .el-tabs__nav-wrap::after {
          height: 1px;
        }
      }
    }

    &__right {
      flex: 1;
      box-sizing: border-box;
      background: #ffffff;
    }

    &__search {
      height: 42px;
      padding-right: 10px;
      line-height: 42px;
      //text-align: right;
      overflow: hidden;
      box-sizing: border-box;
      //::v-deep {
      //  .icon-sousuo {
      //    right: 15px;
      //  }
      //}
    }
    &__batch {
      margin-right: 10px;
    }
    &__type {
      height: calc(100% - 42px);
      border-right: 1px solid #e9e9e9;
      box-sizing: border-box;
    }

    &__typeWrap {
      height: calc(100% - 42px);
      width: 240px;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
    }

    &__table {
      height: calc(100% - 42px - 42px);
      padding: 0 10px;

      ::v-deep {
        .el-table--border {
          border-top: none !important;
        }
      }
    }
  }
}
</style>
