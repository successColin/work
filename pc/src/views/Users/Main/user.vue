<!-- 页面 -->
<template>
  <div class="wrap" v-loading="loading">
    <div class="wrap_searchWrap">
      <div class="wrap_searchWrap_btn">
        <apiot-button type="primary" @click="doAdd" style="margin-right: 0px">
          <i class="icon-xinzeng iconfont"></i>
          {{ $t('user.add_user') }}
        </apiot-button>
        <apiot-button @click="del"
          ><i class="iconfont icon-shanchu"></i> {{ $t('user.del_user') }}
        </apiot-button>
      </div>
      <apiot-drawer
        :title="title"
        destroy-on-close
        :visible.sync="visible"
        v-on:sure-click="handleSubmit"
      >
        <FormItem
          v-if="visible"
          ref="dynamicValidateForm"
          :rules="rules"
          label-position="top"
          :roleGroupList="roleGroupList"
          :formData="formData"
          :toggele="toggele"
          :updateData="updateData"
          :fetchUserList="fetchUserList"
        ></FormItem>
      </apiot-drawer>
      <div class="wrap_saerchWrap_search">
<!--        <apiot-input-->
<!--          style="float: right; width: 200px; margin-top: 2px; text-align: right"-->
<!--          :placeholder="getPlaceholder()"-->
<!--          v-model="input"-->
<!--          @keyup.enter.native="doSearch"-->
<!--          @input="reset"-->
<!--          @focus="isActive = true"-->
<!--          slotType="prefix"-->
<!--        >-->
<!--          <i-->
<!--            slot="prefix"-->
<!--            class="iconfont icon-sousuo"-->
<!--            :class="isActive ? 'on' : ''"-->
<!--            @click="doSearch"-->
<!--          ></i>-->
<!--        </apiot-input>-->
        <search-input
            :placeholder="getPlaceholder()"
            @getList="doSearch"
            v-model="input"
        ></search-input>
        <!--        <apiot-sys-import-->
        <!--          style="float: right"-->
        <!--          @FETCH_NEW_LIST="doSearch"-->
        <!--          :templateId="116"-->
        <!--        ></apiot-sys-import>-->
      </div>
    </div>
    <div class="wrap_div_roleWrap">
      <apiot-table
        :isNeedRowDrop="false"
        :tableData="userList"
        row-key="id"
        :isNeedAsync="true"
        :dropColumnData="columnArr"
        ref="multipleTable"
        @selection-change="selectTable"
        @sortChangeColumn="doSort"
        :shouldResetAll.sync="shouldResetAll"
      >
        <component
          v-for="(item, index) in columnArr"
          :key="`${item.prop}_${index}`"
          :label="$t(`${item.label}`)"
          :prop="item.prop"
          :keyName="item.prop"
          :sortable="item.sortable"
          :sort-orders="['ascending', 'descending']"
          :show-overflow-tooltip="item.showTooltip"
          :min-width="item.minWidth"
          :is="item.component"
          :type="item.type"
          :nameValue="item.nameValue"
          :objName="item.objName"
        ></component>
        <el-table-column
          :label="$t('knowledge.list_opea')"
          width="120px"
          fixed="right"
          :resizable="false"
        >
          <template slot-scope="scope">
            <span class="m-r-16" @click="doEdit(scope.row)">
              {{ $t('role.edit') }}
            </span>
            <span class="m-r-16" @click="doDesign(scope.row)">
              {{ $t('role.auth') }}
            </span>
          </template>
        </el-table-column>
      </apiot-table>
      <Design
        :key="key"
        :showTabs.sync="showDesign"
        :designObj="designObj"
        functionType="user"
        v-model="activename"
        :activeTabsKey="activename"
        @tab-click="handleTabsClick"
      ></Design>
      <apiot-dialog
        :visible.sync="orgcustom.dialogVisible"
        :title="$t('user.relation_org')"
        :destroy-on-close="true"
        :modal-append-to-body="false"
        v-on:sure-click="relationFunction"
        v-on:cancle-click="handleCancel"
      >
        <Organization
          ref="org"
          v-if="orgcustom.dialogVisible"
          functionType="user"
          :relationId="designObj.id"
          :menuId="menuId"
          :isInherit="orgcustom.value.functionObj.inherit"
          :useInRoleAndUser="true"
        ></Organization>
      </apiot-dialog>
    </div>
    <div class="paginationWrap" v-show="total">
      <apiot-pagination
        :selectedNum="selected.length"
        :total="total"
        :current-page="current"
        :size="size"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        v-on:handle-cancel="doUnSelect"
      ></apiot-pagination>
    </div>
  </div>
</template>

<script>
// import cnchar from 'cnchar';
import { errorMessageProcessing } from '@/utils/utils';
// import animateList from '_u/animateList';
import { getRoleLiistById } from '@/api/role';
import { addUser, batchDel, doUpdateUserDataAuth, getUsersList, updateUser } from '@/api/user';
import NormalColumn from './NormalColumn';
// import OrgAndRole from './OrgAndRole';
// import RoleColumn from './RoleColumn';
import StateColumn from './StateColumn';
import TagColumn from './TagColumn';
// import UserColumn from './UserColumn';

const Design = () => import('@/views/Role/RoleContent/AuthorityDesign/authorDesign');
const Organization = () =>
  import('@/views/Role/RoleContent/DesignDetial/Organization/organization');
const FormItem = () => import('./FormItem/formItem');

export default {
  props: {
    userData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('placeholder.PleaseEnterThePassword')));
      } else {
        callback();
      }
    };
    // 手机号码
    const phoneNumber = (rule, value, callback) => {
      if (!value) {
        // callback(new Error(this.$t('placeholder.pleaseEnterThePhoneNumber')));
        callback();
      } else {
        const regTel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
        if (!regTel.test(value)) {
          callback(new Error(this.$t('placeholder.pleaseEnterRightPhoneNumber')));
        }
        callback();
      }
    };
    // 邮箱
    const email = (rule, value, callback) => {
      if (!value) {
        // callback(this.$t('placeholder.pleaseEnterYourUsualEmail'));
        callback();
      } else {
        const checkEmail = /^[a-z0-9]+([._-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if (!checkEmail.test(value)) {
          callback(this.$t('placeholder.pleaseEnterRightEmail'));
        }
        callback();
      }
    };
    // 企业微信
    const wechat = (rule, value, callback) => {
      if (!value) {
        // callback(this.$t('placeholder.pleaseEnterYourUsualEmail'));
        callback();
      } else {
        const checkEmail = /^[^\u4e00-\u9fa5]{1,10}$/g;
        if (!checkEmail.test(value)) {
          callback(this.$t('placeholder.pleaseEnterRightwechat'));
        }
        callback();
      }
    };
    // 组织
    const orgid = (rule, value, callback) => {
      if (!this.formData.orgObj || !this.formData.orgObj.id) {
        callback(this.$t('user.pleaceChoose_org'));
      } else {
        callback();
      }
    };
    return {
      key: 0,
      columnArr: [
        {
          prop: 'username',
          label: 'user.username',
          showTooltip: false,
          minWidth: 150,
          component: 'UserColumn',
          sortable: 'custom'
        },
        {
          prop: 'account',
          label: 'user.account',
          showTooltip: false,
          minWidth: 150,
          component: 'NormalColumn',
          sortable: 'custom'
        },
        {
          prop: 'telephone',
          label: 'user.telephone',
          showTooltip: false,
          minWidth: 150,
          component: 'NormalColumn',
          sortable: 'custom'
        },
        {
          prop: 'user_state_dict',
          label: 'user.user_state_dict',
          showTooltip: false,
          component: 'StateColumn',
          sortable: 'custom'
        },
        {
          prop: 'orgName',
          label: 'user.orgName',
          minWidth: 150,
          showTooltip: false,
          component: 'OrgAndRole',
          type: 'org'
        },
        {
          prop: 'userPostName',
          label: 'user.userPostName',
          minWidth: 150,
          showTooltip: false,
          component: 'OrgAndRole',
          type: 'pos'
        },
        {
          prop: 'roleNames',
          label: 'user.roleNames',
          minWidth: 150,
          showTooltip: true,
          component: 'RoleColumn',
          nameValue: 'roleArr',
          objName: 'roleName'
        },
        // {
        //   prop: 'userLabel',
        //   label: 'user.userLabel',
        //   'show-overflow-tooltip': true,
        //   component: 'TagColumn'
        // }
      ],
      currentRowkey: '',
      total: 0, // 总条数
      userList: [], // 用户列表数据
      defaultLeftType: 'org', // 默认组织类型
      selectKey: {}, // 左边树选中的数据
      current: 1, // 默认第一页
      size: 20, // 一页10条
      orgcustom: {}, // 组织弹框信息
      designObj: {}, // 设计的角色内容
      showDesign: false, // 是否进入设计界面
      isActive: false,
      copyTitle: this.$t('role.copy'),
      dialogVisible: false,
      title: this.$t('user.add_user'), // 新增角色
      visible: false, // 修改的数据
      selected: [], // 选中的数据
      input: '', // 查询内容
      group: {}, // 分组内容
      roleGroupList: [], // 所有分组的信息
      activename: 'PCDesign', // 默认显示pc
      loading: false,
      formData: {}, // 表单值
      orders: [
        {
          asc: true,
          column: ''
        }
      ],
      shouldResetAll: true,
      keyObj: {
        username: this.$t('user.username'),
        account: this.$t('user.account'),
        telephone: this.$t('user.telephone'),
        email: this.$t('user.userEmail')
      },
      rules: {
        username: [
          {
            required: true,
            message: this.$t('user.enterUserName'),
            trigger: 'change'
          }
        ],
        account: [
          {
            required: true,
            message: this.$t('user.enterUserAccount'),
            trigger: 'change',
            validator: validAccount
          }
        ],
        telephone: [
          {
            required: false,
            trigger: 'blur',
            validator: phoneNumber
          }
        ],
        wechat: [
          {
            required: false,
            trigger: 'blur',
            validator: wechat
          }
        ],
        email: [
          {
            required: false,
            trigger: 'change',
            validator: email
          }
        ],
        orgid: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('user.pleaceChoose_org'),
            validator: orgid
          }
        ]
      }
    };
  },

  components: {
    FormItem,
    Design,
    Organization,
    NormalColumn,
    StateColumn,
    // OrgAndRole,
    // RoleColumn,
    TagColumn
    // UserColumn
  },
  watch: {
    group: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.id) {
          this.fetchRoleList({ groupId: newValue.id });
        }
      }
    },
    selectKey: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.id) {
          this.current = 1;
          this.shouldResetAll = true;
          this.fetchUserList(newValue, 'do');
        }
      }
    }
  },
  computed: {
    getPlaceholder() {
      return function () {
        return this.$t('user.placeholder_common');
      };
    },
    menuId() {
      if (JSON.stringify(this.orgcustom) === '{}') return '';
      if (!this.orgcustom.value || !this.orgcustom.value.functionObj) return '';
      return this.orgcustom.value.functionObj.menuId;
    }
  },
  mounted() {
    this.$bus.$off('selectTreeNode_user').$on('selectTreeNode_user', (message) => {
      this.selectKey = message;
    });
    this.$bus.$off('defaultLeftType').$on('defaultLeftType', (message) => {
      this.defaultLeftType = message;
    });
    this.$bus.$off('user_orgcustom').$on('user_orgcustom', (message) => {
      // console.log(message, 'message');
      this.orgcustom = message;
    });
  },
  beforeDestroy() {
    this.$bus.$off('selectTreeNode_user');
    this.$bus.$off('defaultLeftType');
    this.$bus.$off('user_orgcustom');
  },

  methods: {
    blurSearch() {
      this.isActive = false;
      this.doSearch();
    },
    addClassName(row) {
      if (this.currentRowkey === row.row.id) {
        return 'animate__animated animate__fadeInRight';
      }
    },
    doSort({ prop, order }) {
      // 排序
      const isTrue = order === 'ascending';
      // console.log(33333);
      this.orders = [
        {
          asc: isTrue,
          column: prop
        }
      ];
      this.fetchUserList(this.selectKey, '2');
    },
    handleTabsClick({ name }) {
      // tabs切换
      this.activename = name;
    },
    doUnSelect() {
      // 取消选中的数据
      this.selected = [];
      this.$refs.multipleTable.clearSelection();
    },
    handleCurrentChange(val) {
      // 切换页码
      this.current = val;
      this.fetchUserList(this.selectKey);
    },
    handleSizeChange(val) {
      // 切换页面条数
      this.size = val;
      this.fetchUserList(this.selectKey, '33');
    },
    async fetchUserList(value = this.selectKey) {
      // 获取用户列表
      let params = {
        keywords: this.input,
        current: this.current,
        size: this.size,
        orders: this.orders
      };
      if (this.defaultLeftType === 'org' || this.defaultLeftType === 'position') {
        params = {
          ...params,
          searchType: this.defaultLeftType === 'position' ? 2 : 1,
          rootPath: value.rootPath
        };
      }
      if (this.defaultLeftType === 'role') {
        if (Object.prototype.hasOwnProperty.call(value, 'roleName')) {
          params = {
            ...params,
            roleId: value.id
          };
        } else {
          params = {
            ...params,
            roleGroupId: value.id
          };
        }
      }
      this.loading = true;
      try {
        const res = await getUsersList(params);
        const { records, total } = res;
        const list = records.map((item) => {
          const {
            roleIds,
            roleNames,
            userStateDict,
            // userLabel,
            userPostId,
            userPostName,
            orgId,
            orgName,
            id,
            icon
          } = item;
          const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
          const { USER_STATE = [] } = this.userData || {};
          const currentState = USER_STATE.find((obj) => Number(obj.value) === userStateDict) || {};
          const languageType = window.localStorage.getItem('apiotLanguage') || 'zhCN';
          const userStateDictName = currentState[languageType] || ''; // todo
          // item.avtor = cnchar.spell(item.username, 'first', 'up');
          // const len = item.avtor.length;
          // item.avtor = item.avtor.substr(len - 2, 2);
          item.color = `background:${colors[id % 5]}`;
          item.userStateDictName = userStateDictName;
          item.roleArr = this.reduceArr(roleIds, roleNames);
          // item.userLabel = userLabel && userLabel.indexOf('[') > -1 ? JSON.parse(userLabel) : [];
          // item.tags = userLabel && userLabel.indexOf('[') > -1 ? JSON.parse(userLabel) : [];
          item.roles = item.roleArr;
          item.icon = icon ?? { imageUrl: '', icon: '', color: '' };
          item.posObj = item.userPostId
            ? {
              id: userPostId,
              name: userPostName
            }
            : {};
          item.orgObj = item.orgId
            ? {
              id: orgId,
              name: orgName
            }
            : {};
          return item;
        });
        this.userList = list;
        this.total = total;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    reduceArr(str1 = '', str2 = '') {
      // 将字符串处理成数组
      if (!str1) return [];
      const str1Arr = str1.split(',');
      const str2Arr = str2.split(',');
      const arr = [];
      str1Arr.forEach((item, index) => {
        arr.push({
          id: item,
          roleName: str2Arr[index]
        });
      });
      return arr;
    },
    toggele() {
      this.visible = !this.visible;
    },
    updateData(obj = {}) {
      // 更新数据
      this.formData = {
        ...this.formData,
        ...obj
      };
    },
    relationFunction() {
      // 关联function
      const { value: data } = this.orgcustom;
      const { value, functionObj, doUUpdate } = data;
      const { id } = this.designObj;
      const { selectKeys } = this.$refs.org;
      if (!selectKeys.length) {
        this.$message({
          type: 'warning',
          message: this.$t('user.pleaseChooseAndSave')
        });
        return;
      }
      const list = [];
      const orgList = [];
      selectKeys.forEach((item) => {
        list.push({
          menuId: functionObj.menuId,
          userId: id,
          typeDict: value,
          orgId: item.id
        });
        orgList.push(item.name);
      });
      const type =
        this.activename === 'PCDesign'
          ? this.$t('role.desktopPermission')
          : this.$t('role.Mobileterminalpermission');
      const msg1 = `${this.$t('user.addFunctionAuth', {
        name: this.designObj.name,
        type,
        functionMenuName: functionObj.menuName,
        orgList: orgList.join(',')
      })}`;
      // console.log(authList, selectModuleIndex, com, selectKey);
      const params = {
        userId: id,
        list,
        logData: msg1
      };
      try {
        doUUpdate(params, doUpdateUserDataAuth);
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
      // this.key += 1;
      this.activename = 'PCDesign';
      this.designObj = row;
    },
    handleSubmit() {
      // 新增编辑
      this.$refs.dynamicValidateForm.$children[0].validate(async (valid) => {
        if (valid) {
          const api = this.formData.id ? updateUser : addUser;
          const { roles = [], orgObj = {}, posObj = {}, ...rest } = this.formData;
          const roleIds = roles.length ? roles.map((item) => item.id).join(',') : '';
          const logData = {
            operateType: 2,
            name: {
              name: this.$t('user.username')
            },
            account: {
              name: this.$t('user.account')
            },
            telephone: {
              name: this.$t('user.telephone')
            },
            email: {
              name: this.$t('user.userEmail')
            },
            orgid: {
              name: this.$t('user.org')
            },
            userPostId: {
              name: this.$t('user.userPostName')
            },
            roleIds: {
              name: this.$t('user.roleNames')
            },
            enabled: {
              name: this.$t('user.accountState')
            },
            userLabel: {
              name: this.$t('user.addLable')
            },
            memo: {
              name: this.$t('role.memo')
            }
          };
          let params = {
            ...rest,
            roleIds,
            orgId: orgObj.id || '',
            userPostId: posObj.id || '',
            password: null,
            logData
          };
          if (!this.formData.id) {
            logData.operateType = 1;
            params = {
              ...params,
              userStateDict: 1,
              logData
            };
          }
          try {
            const res = await api(params);
            this.currentRowkey = res.id;
            this.visible = false;
            this.formData = {};
            await this.fetchUserList(this.selectKey);
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
                type: 'warning',
                message
              });
            });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    doEdit(row) {
      // 编辑
      this.title = this.$t('user.editUser');
      this.visible = true;
      this.formData = JSON.parse(JSON.stringify(row));
    },
    doAdd() {
      // 点击新增时的操作
      this.formData = {};
      if (this.defaultLeftType === 'org' && this.selectKey.id) {
        this.formData = {
          enabled: true,
          orgObj: {
            id: this.selectKey.id,
            name: this.selectKey.name
          }
        };
      } else if (
        this.defaultLeftType === 'role' &&
        this.selectKey.id &&
        Object.prototype.hasOwnProperty.call(this.selectKey, 'roleName')
      ) {
        this.formData = {
          enabled: true,
          roles: [
            {
              id: this.selectKey.id,
              roleName: this.selectKey.roleName
            }
          ]
        };
      } else if (this.defaultLeftType === 'position' && this.selectKey.id) {
        this.formData = {
          enabled: true,
          posObj: {
            id: this.selectKey.id,
            name: this.selectKey.name
          }
        };
      } else {
        this.formData = {
          enabled: true
        };
      }
      this.title = this.$t('user.add_user');
      this.visible = true;
    },
    async fetchRoleList(params) {
      // 获取用户列表
      this.loading = true;
      try {
        const res = await getRoleLiistById(params);
        this.tableData = res;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    doSearch() {
      // 模糊查询
      this.current = 1;
      this.fetchUserList(this.selectKey, 'do');
    },
    reset() {
      // 重置
      if (!this.input) {
        this.fetchUserList(this.selectKey, 'do');
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
          type: 'warning',
          message: this.$t('user.chooseOne')
        });
        return;
      }
      try {
        const nameArr = this.selected.map((item) => item.username);
        await this.$confirm(
          `${this.$t('user.conformDelete', { names: nameArr.join(',') })}`,
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
        await batchDel({
          ids,
          logData: {
            operateType: 3,
            name: this.$t('role.username'),
            value: 'username',
            deleteArr: this.selected
          }
        });
        // animateList.animateFun({ list: this.userList, deleteArr: this.selected, keyName: 'id',
        // selector: '.wrap_div_roleWrap', type: 'table', animateType: 'delete' });
        setTimeout(() => {
          this.current = 1;
          this.fetchUserList(this.selectKey);
        }, 0);
        this.selected = [];
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
      } catch (e) {
        // console.log(e);
      }
    }
  },
  beforeDestory() {},
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
      width: 450px;
      float: right;
      height: 30px;
      margin-top: 2px;
      //text-align: right;

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
    height: calc(100% - 42px - 42px);

    .roleWrap__nameWrap {
      line-height: 24px;
      float: left;
      //height: 24px;
      background: #f1f3f6;
      border-radius: 12px;
      padding-right: 10px;
    }

    .avtor {
      display: inline-block;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }

    .onLine {
      height: 24px;
      padding: 0 10px;
      display: inline-flex;
      margin-right: 4px;
      background: #e5f0ff;
      border-radius: 4px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4689f5;
      box-sizing: border-box;
      line-height: 24px;
    }

    .ellipsis {
      width: 24px;
      height: 24px;
      float: left;
      position: relative;
      background: #ffeaeb;
      border-radius: 4px;
      text-align: center;
      line-height: 24px;
      color: #ee5e5e;
      cursor: pointer;

      & > .ellipsisMore {
        position: absolute;
      }

      &:hover {
        color: #ffffff;
        background: #ee5e5e;
      }
    }

    .outLine {
      height: 24px;
      padding: 0 10px;
      float: left;
      background: #f1f3f6;
      border-radius: 4px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      box-sizing: border-box;
      line-height: 24px;
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

  .paginationWrap {
    height: 42px;
    width: 100%;
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
}
</style>
