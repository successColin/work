<!-- 页面 -->
<template>
  <div class="wrap" v-loading="loading">
    <div class="wrap_searchWrap">
      <div class="wrap_searchWrap_btn">
        <apiot-button type="primary" @click="doAdd" style="margin-right: 0px">
          <i class="icon-xinzeng iconfont"></i>
          {{ $t('role.addRole') }}
        </apiot-button>
        <apiot-button @click="del"
          ><i class="iconfont icon-shanchu"></i>
          {{ $t('role.deleteRole') }}
        </apiot-button>
      </div>
      <apiot-drawer
        :title="title"
        destroy-on-close
        :visible.sync="visible"
        v-on:sure-click="handleSubmit()"
      >
        <FormItem
          v-if="visible"
          ref="dynamicValidateForm"
          :rules="rules"
          label-position="right"
          :roleGroupList="roleGroupList"
          :formData="formData"
        ></FormItem>
      </apiot-drawer>
      <div class="wrap_saerchWrap_search">
        <apiot-input
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model="input"
          @input="reset"
          @keyup.enter.native="doSearch"
          @focus="isActive = true"
          slotType="prefix"
        >
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            :class="isActive ? 'on' : ''"
            @click="doSearch"
          ></i>
        </apiot-input>
      </div>
    </div>
    <div class="wrap_div_roleWrap">
      <apiot-table
        :tableData="tableData"
        row-key="id"
        :isNeedRowDrop="true"
        :isNeedColumnDrop="false"
        @selection-change="selectTable"
        v-on:row-drop-end="dropEnd"
        v-on:row-drop-start="dropStart"
        ref="roleTable"
      >
        <el-table-column
          prop="roleName"
          :label="$t('role.roleName')"
          :render-header="renderRoleName"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
        >
          <template slot-scope="scope">
            <div style="display: flex">
              <div style="padding-right: 10px; border-right: 1px solid #e9e9e9">
                <span class="iconfont icon-zongxiangtuodong"></span>
              </div>
              <i class="iconfont icon-jiaose"></i>
              <span style="margin-left: 10px">{{ scope.row.roleName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="memo"
          :label="$t('role.memo')"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
        ></el-table-column>
        <el-table-column :label="$t('common.operate')" :max-width="200">
          <template slot-scope="scope">
            <span
              class="m-r-16"
              @click="doEdit(scope.row)"
              v-show="scope.row.roleCode !== 'SUPERADMIN'"
            >
              {{ $t('common.edit1') }}
            </span>
            <span class="m-r-16" @click="doDesign(scope.row)">
              {{ $t('role.auth') }}
            </span>
            <span
              class="m-r-16"
              @click="doCopy(scope.row)"
              v-show="scope.row.roleCode !== 'SUPERADMIN'"
            >
              {{ $t('role.copy') }}
            </span>
          </template>
        </el-table-column>
      </apiot-table>
      <apiot-dialog
        class="copyWrap"
        :visible.sync="dialogVisible"
        :title="copyTitle"
        v-on:sure-click="handleSubmit('copy')"
      >
        <FormItem
          v-if="dialogVisible"
          ref="dynamicValidateForm"
          :rules="rules"
          label-position="right"
          :roleGroupList="roleGroupList"
          :formData="formData"
        ></FormItem>
      </apiot-dialog>
      <Design
        :showTabs.sync="showDesign"
        :designObj="designObj"
        v-model="activename"
        functionType="role"
        :activeTabsKey="activename"
        @tab-click="handleTabsClick"
      ></Design>
      <apiot-dialog
        :visible.sync="orgcustom.dialogVisible"
        :title="$t('role.costomOrg')"
        :destroy-on-close="true"
        :modal-append-to-body="false"
        v-on:sure-click="relationFunction"
        v-on:cancle-click="handleCancel"
      >
        <Organization
          ref="org"
          :relationId="designObj.id"
          :menuId="menuId"
          functionType="role"
          :useInRoleAndUser="true"
          v-if="orgcustom.dialogVisible"
        ></Organization>
      </apiot-dialog>
    </div>
  </div>
</template>

<script>
import { errorMessageProcessing } from '@/utils/utils';
import animate from '@/utils/animateList';
import {
  getRoleLiistById,
  doAddRole,
  delByBatch,
  doUpdateRole,
  doSwitchRole,
  doEditRoleDataAuth,
  doCopyRole
} from '@/api/role';

const FormItem = () => import('./FormItem/formItem');
const Design = () => import('./AuthorityDesign/authorDesign');
const Organization = () => import('./DesignDetial/Organization/organization');

export default {
  data() {
    return {
      currentRowkey: '', // 当前行
      activename: 'PCDesign', // 默认显示pc
      orgcustom: {}, // 组织弹框信息
      designObj: {}, // 设计的角色内容
      showDesign: false, // 是否进入设计界面
      isActive: false,
      copyTitle: this.$t('role.copy'),
      dialogVisible: false,
      title: this.$t('role.addRole'), // 新增角色
      visible: false, // 修改的数据
      selected: [], // 选中的数据
      stripe: true, // 带斑马纹
      input: '', // 查询内容
      group: {}, // 分组内容
      maxHeight: 250, // 初始高度
      tableData: [],
      roleGroupList: [], // 所有分组的信息
      loading: false,
      formData: {}, // 表单值
      keyObj: {
        roleName: this.$t('role.name'),
        groupId: this.$t('role.group'),
        memo: this.$t('role.memo')
      }
    };
  },

  components: {
    FormItem,
    Design,
    Organization
  },
  watch: {
    group: {
      immediate: true,
      deep: true,
      handler(newValue, old = {}) {
        if (newValue.id && old.id !== newValue.id) {
          this.fetchRoleList({ groupId: newValue.id, roleName: this.input, });
        } else if (newValue.id && !old.id) {
          this.fetchRoleList({ groupId: newValue.id, roleName: this.input, });
        }
      }
    }
  },
  computed: {
    rules() {
      return {
        roleName: [
          {
            required: true,
            trigger: 'change',
            message: this.$t('role.placeEnterRoleName')
          }
        ]
      };
    },
    menuId() {
      if (JSON.stringify(this.orgcustom) === '{}') return '';
      if (!this.orgcustom.value || !this.orgcustom.value.functionObj) return '';
      return this.orgcustom.value.functionObj.menuId;
    }
  },
  mounted() {
    this.$nextTick(() => {
      const height = document.getElementsByClassName('wrap_div_roleWrap')[0].offsetHeight;
      this.maxHeight = height - 40;
    });
    this.$bus.$on('roleGroup', (item) => {
      this.group = item;
    });
    this.$bus.$on('roleGroupList', (message) => {
      this.roleGroupList = message;
    });
    this.$bus.$on('role_orgcustom', (message) => {
      this.orgcustom = message;
    });
  },
  beforeDestroy() {
    this.$bus.$off('roleGroup', () => {});
    this.$bus.$off('roleGroupList', () => {});
    this.$bus.$off('role_orgcustom', () => {});
  },
  methods: {
    blurSearch() {
      this.isActive = false;
      this.doSearch();
    },
    renderRoleName(h) {
      // 渲染列表头
      return h('div', { style: 'margin-left:45px;display:inline;' }, this.$t('role.roleName'));
    },
    handleTabsClick({ name }) {
      // tabs切换
      this.activename = name;
    },
    relationFunction() {
      // 关联function
      const { value: data } = this.orgcustom;
      const { value, functionObj, doUUpdate } = data;
      const { id } = this.designObj;
      const { selectKeys } = this.$refs.org;
      if (!selectKeys.length) {
        this.$message({
          type: 'error',
          message: this.$t('role.placeChooseOrgMessage')
        });
        return;
      }
      const list = [];
      const orgList = [];
      selectKeys.forEach((item) => {
        list.push({
          menuId: functionObj.menuId,
          roleId: id,
          typeDict: value,
          orgId: item.id
        });
        orgList.push(item.name);
      });
      const type =
        this.activename === 'PCDesign'
          ? this.$t('role.desktopPermission')
          : this.$t('role.Mobileterminalpermission');
      const msg = `为${this.designObj.roleName}${type}中的${functionObj.menuName}菜单添加${orgList.join(',')}等数据权限`;
      const params = {
        roleId: id,
        list,
        logoData: msg
      };
      try {
        doUUpdate(params, doEditRoleDataAuth);
        this.orgcustom.dialogVisible = false;
      } catch (e) {
        // console.log(e);
      }
    },
    handleCancel() {
      // 关闭
      this.orgcustom = {
        dialogVisible: false
      };
    },
    doDesign(row) {
      // 进入设计界面
      this.showDesign = true;
      this.designObj = row;
    },
    doCopy(row) {
      const { roleName, id, ...rest } = row;

      this.copyTitle = `${this.$t('role.copy')}${roleName}`;
      this.formData = {
        roleName: `${roleName}(${this.$t('role.copy')})`,
        id,
        ...rest
      };
      this.dialogVisible = true;
    },
    dropStart() {
      const list = document.getElementsByClassName('el-table__row');
      list.forEach((item) => {
        item.classList.remove('hover-row');
        item.classList.remove('animate__animated');
        item.classList.remove('animate__fadeInRight');
        item.style.opacity = 1;
      });
    },
    async dropEnd({ oldIndex, newIndex }) {
      if (this.tableData.length < 2) return; // 如果列表数据少于2条，不做任何动作
      const { sno, id, roleName } = this.tableData[oldIndex];
      const { sno: switchSno } = this.tableData[newIndex];
      const params = {
        sno,
        switchSno,
        id,
        tableName: 'sys_role',
        logData: {
          operateType: 4,
          name: '角色',
          switchName: roleName
        }
      };
      try {
        await doSwitchRole(params);
        // this.doSearch();
      } catch (e) {
        this.doSearch();
      }
    },
    handleSubmit(type) {
      this.$refs.dynamicValidateForm.$children[0].validate(async (valid) => {
        if (valid) {
          try {
            const n = this.tableData.length;
            const lastRole = this.tableData[n - 1] || {};
            const { sno: newSno } = lastRole;
            const AddRoleparams = {
              ...this.formData,
              sno: newSno ? newSno + 1 : 1,
              logData: {
                operateType: 1,
                username: {
                  name: this.$t('role.name')
                },
                groupId: {
                  name: this.$t('role.group')
                },
                memo: {
                  name: this.$t('role.memo')
                }
              }
            };
            const params = {
              roleName: this.input,
              groupId: this.group.id
            };
            if (type === 'copy') {
              // 角色复制
              try {
                const { id: copyRoleId, ...rest } = AddRoleparams;
                const newParams = {
                  ...rest,
                  copyRoleId
                };
                const res = await doCopyRole(newParams);
                this.dialogVisible = false;
                this.$message({
                  type: 'success',
                  message: this.$t('role.copySuccess')
                });
                this.currentRowkey = res.id;
                setTimeout(async () => {
                  await this.fetchRoleList(params, res, 'edit');
                }, 500);
                this.$bus.$emit('renderGroupList', true);
                this.formData = {};
              } catch (e) {
                let newError = {};
                Object.keys(e).forEach((item) => {
                  newError = {
                    ...newError,
                    [this.keyObj[item]]: e[item]
                  };
                });
                errorMessageProcessing(newError, (message) => {
                  this.$message({
                    type: 'error',
                    message
                  });
                });
              }
              return;
            }
            const api = this.formData.id ? doUpdateRole : doAddRole;
            const submitParams = this.formData.id
              ? {
                ...this.formData,
                logData: {
                  operateType: 2,
                  roleName: {
                    name: this.$t('role.name')
                  },
                  groupId: {
                    name: this.$t('role.group')
                  },
                  memo: {
                    name: this.$t('role.memo')
                  }
                }
              }
              : AddRoleparams;
            const message = this.formData.id
              ? this.$t('role.modifiedSuccessfully')
              : this.$t('role.addedSuccessfully');
            const res = await api(submitParams);
            this.visible = false;
            this.$message({
              type: 'success',
              message
            });
            this.currentRowkey = res.id;
            setTimeout(async () => {
              await this.fetchRoleList(params, res, 'edit');
            }, 100);
            this.$bus.$emit('renderGroupList', true);
            this.formData = {};
          } catch (e) {
            let newError = {};
            Object.keys(e).forEach((item) => {
              newError = {
                ...newError,
                [this.keyObj[item]]: e[item]
              };
            });
            errorMessageProcessing(newError, (message) => {
              this.$message({
                type: 'error',
                message
              });
            });
          }
        } else {
          return false;
        }
      });
    },
    doEdit(row) {
      // 编辑
      this.title = this.$t('role.editRole');
      this.visible = true;
      this.formData = JSON.parse(JSON.stringify(row));
    },
    doAdd() {
      // 点击新增时的操作
      this.formData = {
        groupId: this.group.id
      };
      this.title = this.$t('role.addRole');
      this.visible = true;
    },
    async fetchRoleList(params, response = {}) {
      // 获取用户列表
      this.loading = true;
      try {
        const res = await getRoleLiistById(params);
        this.tableData = res;
        this.$nextTick(() => {
          const index = this.tableData.findIndex((item) => item.id === response.id);
          this.$refs.roleTable.scrollToCur(index);
          animate.animateFun({
            list: this.tableData,
            deleteArr: [response],
            keyName: 'id',
            selector: '.wrap_div_roleWrap',
            animateType: 'add',
            type: 'table'
          });
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    reset() {
      if (!this.input) {
        this.doSearch();
      }
    },
    doSearch() {
      // 模糊查询
      const params = {
        roleName: this.input,
        groupId: this.group.id
      };
      this.fetchRoleList(params);
    },
    addClassName(row) {
      if (this.currentRowkey === row.row.id) {
        return 'animate__animated animate__fadeInRight';
      }
    },
    selectTable(row) {
      // 选中数据
      this.selected = row;
    },
    async del() {
      // 删除角色
      if (!this.selected.length) {
        this.$message({
          type: 'error',
          message: this.$t('common.placeSelectData')
        });
        return;
      }
      try {
        const nameArr = this.selected.map((item) => item.roleName);
        await this.$confirm(
          `${this.$t('role.conformDelete', { names: nameArr.join(',') })}`,
          this.$t('common.tip'),
          { type: 'warning' }
        );
        this.doDel();
      } catch (err) {
        // this.isSelectdEdit = false;
      }
    },
    async doDel() {
      // 删除成功之后，左边列表和右侧列表的数据都应该刷新
      try {
        const idArr = this.selected.map((item) => item.id);
        const ids = idArr.join(',');
        await delByBatch({
          ids,
          logData: {
            operateType: 3,
            name: this.$t('role.name'),
            value: 'roleName',
            deleteArr: this.selected
          }
        });
        this.$bus.$emit('renderGroupList', true);
        const params = {
          roleName: this.input,
          groupId: this.group.id
        };
        animate.animateFun({
          list: this.tableData,
          deleteArr: this.selected,
          keyName: 'id',
          selector: '.wrap_div_roleWrap',
          type: 'table',
          animateType: 'delete'
        });
        this.selected = [];
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        setTimeout(async () => {
          await this.fetchRoleList(params, '', 'edit');
        }, 100);
      } catch (e) {
        // console.log(e);
      }
    }
  },
  beforeDestory() {
    window.removeEventListener('resize', () => {});
  },
  name: 'roleList'
};
</script>

<style lang='scss' scoped>
.wrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .on {
    color: $--color-primary;
  }

  .wrap_searchWrap {
    margin: 6px 10px;
    height: 30px;

    .wrap_searchWrap_btn {
      width: 206px;
      float: left;
      display: flex;
      height: 30px;

      .icon-shanchu {
        color: $--color-primary;
        margin-right: 4px;
        vertical-align: bottom;
      }

      .icon-xinzeng {
        margin-right: 4px;
        vertical-align: bottom;
      }

      ::v-deep {
        .el-icon-plus {
          border: 1px solid;
        }
      }
    }

    .wrap_saerchWrap_search {
      width: 200px;
      float: right;
      height: 30px;
      margin-top: 2px;
      text-align: right;

      ::v-deep {
        .el-input__inner {
          width: 98%;
          height: 30px;
          margin-top: -2px;
          padding-left: 12px;
          font-size: 14px;
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
  }

  .wrap_div_roleWrap {
    padding: 0 10px 0 10px;
    height: calc(100% - 42px);

    .icon-jiaose {
      margin-left: 13px;
      color: #ee5e5e;
      font-size: 20px;
      vertical-align: bottom;
    }

    .icon-zongxiangtuodong {
      color: #aaaaaa;
    }

    ::v-deep {
      .el-table__body .el-table__row .icon-zongxiangtuodong:hover {
        cursor: move;
      }

      .el-dialog__body {
        padding: 0px 20px 0 20px !important;
      }
    }
  }

  .m-r-16 {
    color: $--color-primary;
    margin-right: 16px;
    font-size: 14px;
    cursor: pointer;
  }

  .el-table__row:hover {
    .icon-zongxiangtuodong {
      color: $--color-primary;
    }
  }

  .copyWrap {
    ::v-deep {
      .el-dialog__body {
        padding: 0 !important;
      }
    }
  }
}
</style>
