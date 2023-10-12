<!-- 页面 -->
<template>
  <div class="wrap" v-loading="loading" ref="wrap">
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
          :roleGroupList="roleGroupList"
          :formData="formData"
          :toggele="toggele"
          :updateData="updateData"
          :fetchUserList="fetchUserList"
          :configData="
            configData && configData.children[0].children[0].children[1]
          "
        ></FormItem>
        <template slot="otherBtn" v-if="formData.id">
          <apiot-button
            @click="resetPassword($t('user.sureOutLine'))"
            v-if="allData.designPageLayout[0].userConfig.leaveJob === 1"
          >
            {{ $t('user.outline') }}
          </apiot-button>
          <apiot-button
            type="primary"
            v-if="allData.designPageLayout[0].userConfig.resetPas === 1"
            @click="resetPassword($t('user.sureReset'), 'pass')"
            >{{ $t('user.resetPassword') }}
          </apiot-button>
        </template>
      </apiot-drawer>
      <div class="wrap_saerchWrap_search">
        <search-input
          :placeholder="getPlaceholder()"
          @getList="doSearch"
          v-model="input"
        ></search-input>
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
          :label="item.label"
          :prop="item.prop"
          :keyName="item.prop"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          :show-overflow-tooltip="item.showTooltip"
          :min-width="item.minWidth"
          :is="item.component"
          :type="item.type"
          :nameValue="item.nameValue"
          :objName="item.objName"
          :areaData="item"
          :configData="item"
        ></component>
        <StateColumn
          :label="$t('user.accountState')"
          prop="enabled"
          :show-overflow-tooltip="false"
          sortable="custom"
          :min-width="60"
          fixed="right"
          v-if="configData && configData.userConfig.accountStatus === 1"
        ></StateColumn>
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
          :isInherit="
            orgcustom.value.isBatch ? 0 : orgcustom.value.functionObj.inherit
          "
          :useInRoleAndUser="!orgcustom.value.isBatch"
          :isBatchCustom="orgcustom.value.isBatch"
        ></Organization>
        <template v-slot:btn v-if="orgcustom.value.isBatch">
          <apiot-button
            @click="menuVisible = true"
            style="position: absolute; left: 20px"
            type="primary"
          >
            <span class="icon-mokuai iconfont"></span>生效模块</apiot-button
          >
        </template>
      </apiot-dialog>
      <apiot-dialog
        :visible.sync="menuVisible"
        title="生效模块"
        :destroy-on-close="true"
        :modal-append-to-body="false"
        v-on:sure-click="handleMenuOk"
        v-on:cancle-click="handleMenuCancel"
      >
        <MenuList
          :activeType="activename"
          ref="MenuList"
          :showCheckbox="true"
          :isInitCheck="false"
          :isNeedSearch="true"
          v-if="menuVisible"
          :disabledId="defaultCheck.disabledId"
          :defaultCheck="defaultCheck.defaultCheckedKeys"
        />
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
import { errorMessageProcessing, formatDate, Encrypt } from '@/utils/utils';
import { getRoleLiistById } from '@/api/role';
import {
  // addUser,
  batchDel,
  doUpdateUserDataAuth,
  pageUser,
  // updateUser,
  saveUser,
  resetPassword,
  updateUserState,
  getUserDetails,
} from '@/api/user';
import NormalColumn from '../Main/NormalColumn';
import StateColumn from '../Main/StateColumn';
import TagColumn from '../Main/TagColumn';

const Design = () =>
  import('@/views/Role/RoleContent/AuthorityDesign/authorDesign');
const Organization = () =>
  import('@/views/Role/RoleContent/DesignDetial/Organization/organization');
const FormItem = () => import('./FormItem/formItem');
const MenuList = () =>
  import('@/views/Role/RoleContent/DesignDetial/MenuList/index');

export default {
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
    allData: {
      type: Object,
    },
    fatherDefaultType: {
      type: String,
      default: 'role',
    },
  },
  data() {
    return {
      key: 0,
      menuVisible: false,
      otherMenuIds: [], // 生效模块
      columnArr: [],
      columnObj: {},
      currentRowkey: '',
      total: 0, // 总条数
      userList: [], // 用户列表数据
      defaultLeftType: 'role', // 默认组织类型
      selectKey: {}, // 左边树选中的数据
      current: 1, // 默认第一页
      size: 20, // 一页10条
      orgcustom: {
        value: {
          isBatch: false,
        },
      }, // 组织弹框信息
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
      orders: '',
      shouldResetAll: true,
      keyObj: {
        username: this.$t('user.username'),
        account: this.$t('user.account'),
        telephone: this.$t('user.telephone'),
        email: this.$t('user.userEmail'),
      },
      compIdColumnObj: {},
      backForm: {},
    };
  },
  provide() {
    return {
      isConfig: false,
      isPreview: false,
      resolveFormula: () => {},
      getAllForm: this.getAllForm,
      getPanel: this.getPanel,
      getMenu: this.getMenu,
      onlyFlag: () => '',
      sysMenuDesignId: () => this.allData.id,
      getFatherPanel: () => {},
    };
  },
  components: {
    FormItem,
    MenuList,
    Design,
    Organization,
    NormalColumn,
    StateColumn,
    // OrgAndRole,
    // RoleColumn,
    TagColumn,
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
      },
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
      },
    },
  },
  computed: {
    configData() {
      return this.allData.designPageLayout[0];
    },
    // 获取所有单位
    getAllPane() {
      const obj = {
        formObj: {},
        tabObj: {},
        compObj: {},
        area: {},
      };
      if (this.configData && this.configData.children.length) {
        this.configData.children.forEach((bigArea) => {
          if (bigArea.children.length) {
            bigArea.children.forEach((tab) => {
              obj.tabObj[tab.compId] = tab;
              obj.tabObj[tab.compId].compType = 'TAB';
              if (tab.children.length) {
                tab.children.forEach((area) => {
                  if (area.compName === 'BtnsArea') {
                    if (area.children.length) {
                      area.children.forEach((comp) => {
                        obj.compObj[comp.compId] = comp;
                      });
                    }
                  } else if (area.children.length) {
                    // obj[area.compId] = JSON.parse(JSON.stringify(area));
                    // obj[area.compId].compType = 'AREA';
                    obj.area[area.compId] = area;
                    obj.area[area.compId].compType = 'AREA';
                    area.children.forEach((smallArea) => {
                      if (smallArea.areaType === 1) {
                        // 代表功能区
                        obj.formObj[smallArea.compId] = smallArea;
                        // 父节点的id记录
                        obj.formObj[smallArea.compId].parentCompId =
                          area.compId;
                      }
                      if (smallArea.children) {
                        smallArea.children.forEach((comp) => {
                          if (area.compName === 'TableMain') {
                            comp.isTable = true;
                          }
                          if (area.compName === 'CardTable') {
                            comp.isCardTable = true;
                          }
                          if (area.isTree) {
                            comp.isTree = true;
                          }
                          obj.compObj[comp.compId] = comp;
                          if (comp.children) {
                            comp.children.forEach((btn) => {
                              if (area.compName === 'TableMain') {
                                btn.isTable = true;
                              }
                              if (area.compName === 'CardTable') {
                                btn.isCardTable = true;
                              }
                              if (area.isTree) {
                                btn.isTree = true;
                              }
                              obj.compObj[btn.compId] = btn;
                            });
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
        return obj;
      }
      return obj;
    },
    // 处理所有值给后端
    getCompMap() {
      const keys = Object.keys(this.getAllPane.formObj);
      let obj = {};
      keys.forEach((key) => {
        obj = Object.assign(obj, this.getAllPane.formObj[key].form);
      });
      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].join();
        }
      });
      // 插入菜单id
      obj.MENU_ID = this.$route.params.id || this.$route.query.menuId;
      obj.CUR_SELECTED_IDS = sessionStorage.__current__mulArr__id || '';
      return obj;
    },
    defaultCheck() {
      const id = this.orgcustom.value?.functionObj?.id;
      return {
        disabledId: id,
        defaultCheckedKeys: [id, ...this.otherMenuIds],
      };
    },
    getPlaceholder() {
      return function () {
        return this.$t('user.placeholder_common');
      };
    },
    menuId() {
      if (JSON.stringify(this.orgcustom) === '{}') return 0;
      if (!this.orgcustom.value || !this.orgcustom.value.functionObj) return '';
      return this.orgcustom.value.functionObj.menuId;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setColumnArr();
    });

    this.$bus
      .$off('selectTreeNode_user')
      .$on('selectTreeNode_user', (message) => {
        this.selectKey = message;
      });
    this.defaultLeftType = this.fatherDefaultType;
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
    // 设置列表列
    setColumnArr() {
      this.backForm = JSON.parse(
        JSON.stringify(
          this.configData.children[0].children[0].children[1].children[0].form,
        ),
      );
      const width = this.$refs.wrap.offsetWidth - 40;
      const configArr =
        this.allData.designPageLayout[0].children[0].children[1].children[1]
          .children[0].children;
      const arr = [];
      configArr.forEach((comp) => {
        if (comp.compName !== 'Label' && comp.canShow) {
          if (
            comp.dataSource.columnName === 'username' &&
            comp.labelNotChange
          ) {
            comp = {
              ...comp,
              prop: 'username',
              label: comp.name,
              showTooltip: false,
              component: 'UserColumn',
              minWidth: width * comp.tableWidth,
            };
          } else if (
            comp.dataSource.columnName === 'roleIds' &&
            comp.labelNotChange
          ) {
            comp = {
              ...comp,
              prop: 'roleNames',
              label: comp.name,
              showTooltip: false,
              component: 'RoleColumn',
              nameValue: 'roleArr',
              objName: 'roleName',
              minWidth: width * comp.tableWidth,
            };
          } else {
            comp = {
              ...comp,
              prop: comp.dataSource.columName,
              label: comp.labelName,
              showTooltip: false,
              component: comp.tableCompName,
              minWidth: width * comp.tableWidth,
            };
          }
          arr.push(comp);
        }
      });
      // console.log(arr);
      this.columnArr = arr;
    },
    // 获取全部值
    getAllForm() {
      return this.getCompMap;
    },
    // 获取面板相关数据
    getPanel() {
      console.log(this.configData.paneObj);
      return this.configData.paneObj;
    },
    // 获取菜单
    getMenu() {
      return this.configData.menuObj;
    },
    handleMenuOk() {
      this.otherMenuIds = this.$refs.MenuList.getCheckedKeys();
      this.menuVisible = false;
    },
    handleMenuCancel() {
      this.menuVisible = false;
    },
    async resetPassword(message, type) {
      try {
        await this.$confirm(message, '提示');
        await this.doReset(type);
      } catch (e) {
        // console.log(e);
      }
    },
    async doReset(type) {
      try {
        const api = type === 'pass' ? resetPassword : updateUserState;
        // const api = resetPassword;
        // console.log(api);
        await api({ userid: this.formData.id });
        this.$message({
          type: 'success',
          message: '操作成功！',
        });
        this.toggele();
        await this.fetchUserList();
      } catch (e) {
        // console.log(e);
      }
    },
    blurSearch() {
      this.isActive = false;
      this.doSearch();
    },
    addClassName(row) {
      if (this.currentRowkey === row.row.id) {
        return 'animate__animated animate__fadeInRight';
      }
    },
    doSort(column) {
      this.current = 1;
      const obj = this.columnArr.find((data) => {
        if (
          data.compId === column.prop ||
          (data.dataSource.columnName === column.prop && data.labelNotChange)
        ) {
          return true;
        }
        return false;
      });
      if (obj) {
        this.orders = `${obj.compId} ${
          column.order === 'ascending' ? 'ASC' : 'DESC'
        }`;
        // 取显示值
        if (obj.compType === 6 || obj.compType === 7) {
          this.orders = `${obj.compId}_ ${
            column.order === 'ascending' ? 'ASC' : 'DESC'
          }`;
        }
      } else {
        this.orders = `roleIds ${
          column.order === 'ascending' ? 'ASC' : 'DESC'
        }`;
      }

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
    // 生成搜索结构
    createColumn(comp) {
      // flag 1 普通搜索 flag 2 高级搜索
      const column = {
        dict: 2,
        lambda: 'in',
        name: '',
        value: '',
        compId: '',
        userComp: 2,
        columnType: comp.dataSource.columnTypeDict,
      };

      // 值的处理 字典的处理
      if (comp.dataSource.dictObj) {
        column.dict = 1;
        const dictData = this.$store.getters.getCurDict(
          comp.dataSource.dictObj.dictKey,
        );
        const valueArr = [];
        dictData.forEach((dict) => {
          const i = dict.name.indexOf(this.input);
          if (i !== -1 && this.input) {
            valueArr.push(dict.value);
          }
        });
        column.value = valueArr.join();
      }
      // 字段名的处理
      column.name = `${comp.dataSource.tableName}.${comp.dataSource.columnName}`;
      if (comp.dataSource.alias) {
        column.name = `${comp.dataSource.alias}.${comp.dataSource.columnName}`;
      }
      column.compId = comp.compId;
      if (comp.compType === 6 || comp.compType === 7) {
        column.compId = `${comp.compId}_`;
      }
      // 角色特殊处理
      if (comp.dataSource.columnName === 'roleIds' && comp.labelNotChange) {
        column.compId = 'roleNames';
      }
      return [column];
    },
    createSearchInfo() {
      const searchInfo = {
        searchValue: '',
        searchColumnName: '',
        columnsInfo: [],
      };
      searchInfo.searchValue = this.input;
      searchInfo.searchColumnName = 'ALL';
      this.columnArr.forEach((comp) => {
        if (
          !['roleIds'].includes(comp.dataSource.columnName) &&
          comp.compType !== 7
        ) {
          searchInfo.columnsInfo.push(...this.createColumn(comp));
        }
      });
      return searchInfo;
    },
    async fetchUserList(value = this.selectKey) {
      // 获取用户列表
      const searchInfo = this.createSearchInfo();
      // compId 取自基本配置固定
      let params = {
        // keywords: this.input,
        searchInfo,
        current: this.current,
        size: this.size,
        sortStr: this.orders,
        compId: 'KLyUXH',
        menuId: 6,
      };
      console.log(this.defaultLeftType);
      if (
        this.defaultLeftType === 'org' ||
        this.defaultLeftType === 'position'
      ) {
        params = {
          ...params,
          searchType: this.defaultLeftType === 'position' ? 2 : 1,
          rootPath: value.rootPath,
        };
      }
      if (this.defaultLeftType === 'role') {
        if (Object.prototype.hasOwnProperty.call(value, 'roleName')) {
          params = {
            ...params,
            roleId: value.id,
          };
        } else {
          params = {
            ...params,
            roleGroupId: value.id,
          };
        }
      }
      this.loading = true;
      try {
        const res = await pageUser(params);
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
            icon,
          } = item;
          const colors = [
            '#5A80ED',
            '#FAB71C',
            '#FC8256',
            '#EE5E5E',
            '#34C7BE',
          ];
          const { USER_STATE = [] } = this.userData || {};
          const currentState =
            USER_STATE.find((obj) => Number(obj.value) === userStateDict) || {};
          const languageType =
            window.localStorage.getItem('apiotLanguage') || 'zhCN';
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
                name: userPostName,
              }
            : {};
          item.orgObj = item.orgId
            ? {
                id: orgId,
                name: orgName,
              }
            : {};
          return item;
        });
        list.forEach((item) => {
          this.columnArr.forEach((comp) => {
            if (
              comp.dataSource.columnName === 'username' &&
              comp.labelNotChange
            ) {
              item.username = item[comp.compId];
            }
          });
          item.enabled = item.enabled !== 0;
          // 基本配置中列表id的compid
          item.id = item.PxHtLD;
          item.account = item.kPtqOC;
        });
        // console.log(list);
        this.userList = list;
        this.total = total;
        this.loading = false;
        // console.log(list);
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
          roleName: str2Arr[index],
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
        ...obj,
      };
    },
    relationFunction() {
      // 关联function
      const { value: data } = this.orgcustom;
      const { value, functionObj, doUUpdate, isBatch = false } = data;
      const { id } = this.designObj;
      const { selectKeys } = this.$refs.org;
      if (!selectKeys.length) {
        this.$message({
          type: 'warning',
          message: this.$t('user.pleaseChooseAndSave'),
        });
        return;
      }
      const list = [];
      const orgList = [];
      selectKeys.forEach((item) => {
        list.push({
          menuId: functionObj.menuId,
          userid: id,
          typeDict: value,
          orgId: item.id,
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
        orgList: orgList.join(','),
      })}`;
      // console.log(authList, selectModuleIndex, com, selectKey);
      const params = {
        userid: id,
        list,
        logData: msg1,
      };
      params.batchCustomFlag = isBatch;
      if (isBatch) {
        delete params.list;
        const arr = selectKeys.map((item) => item.id);
        params.orgIds = arr;
        const menuIds = this.otherMenuIds.length
          ? this.otherMenuIds
          : [functionObj.id];
        params.menuIds = menuIds;
        params.functionDict = this.activename === 'PCDesign' ? 1 : 2;
      }
      try {
        doUUpdate(params, doUpdateUserDataAuth);
        this.orgcustom.dialogVisible = false;
        this.otherMenuIds = [];
      } catch (e) {
        // console.log(e);
      }
    },
    handleCancel() {
      // 关闭
      this.orgcustom = {
        dialogVisible: false,
        value: {},
      };
    },
    doDesign(row) {
      // 进入设计界面
      this.showDesign = true;
      // this.key += 1;
      this.activename = 'PCDesign';
      this.designObj = row;
    },
    // 遍历处理保存数据
    resolveSaveData(featureArr, area, data) {
      const form = data || featureArr.form;
      const arr = [
        'create_time',
        'create_user_id',
        'modify_time',
        'modify_user_id',
      ];
      const columnArr = [];
      const formInfo = [];
      formInfo.str = '';

      featureArr.children.forEach((comp) => {
        if (comp.canShow) {
          if (comp.compType === 15) {
            if (
              !['id', 'parent_id', 'position_id'].includes(
                comp.dataSource.columnName,
              )
            ) {
              return;
            }
          }

          // 去除修改系统字段的 并且 字段名不能重复
          if (!arr.includes(comp.dataSource.columnName)) {
            let columnValue =
              form[comp.compId] == null ? '' : form[comp.compId];
            if (comp.compType === 29 && Array.isArray(columnValue)) {
              columnValue = JSON.stringify(columnValue);
            }
            if (Array.isArray(columnValue)) {
              columnValue = columnValue.join();
            }
            if (comp.compType === 8 && columnValue) {
              if (columnValue.replace && !new Date(columnValue).getTime()) {
                columnValue = columnValue.replace(/-/g, '/');
              }
              columnValue = formatDate(new Date(columnValue), 'yyyy-MM-dd');
            }
            if (comp.compType === 9 && columnValue) {
              if (columnValue.replace && !new Date(columnValue).getTime()) {
                columnValue = columnValue.replace(/-/g, '/');
              }
              columnValue = formatDate(
                new Date(columnValue),
                'yyyy-MM-dd hh:mm:ss',
              );
            }

            if (comp.dataSource.columnName === 'id' && !data) {
              if (columnValue) {
                this.isAdd = false;
              } else {
                this.isAdd = true;
              }
            }
            if (
              comp.dataSource.columnName !== 'id' ||
              columnValue !== '' ||
              comp.compType === 17
            ) {
              let column = {
                columnName: comp.dataSource.columnName,
                columnType: comp.dataSource.columnTypeDict,
              };
              // 数据单选框 从关系里面拉取真正存的字段
              if (comp.compType === 6) {
                const relateName = comp.dataSource.relateName.split('(')[0];
                const index = area.relateTableArr.findIndex(
                  (relate) => relate.relateName === relateName,
                );
                if (index !== -1) {
                  const { firstLineColumn } =
                    area.relateTableArr[index].conditionArr[0][0];
                  column = {
                    columnName: firstLineColumn.columnName,
                    columnType: firstLineColumn.columnTypeDict,
                  };
                }
              }
              // 按钮是否启用操作日志
              if (
                this.configData.enableLog &&
                this.configData.logComp.includes(comp.compId)
              ) {
                let str = `${comp.name}:${columnValue}`;
                // 基础组件 不是只读 显示的组件 记录下操作
                if (
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(comp.compType) &&
                  !comp.canReadonly &&
                  comp.canShow
                ) {
                  if (
                    [2, 3, 4].includes(comp.compType) &&
                    comp.dataSource.dictObj.dictKey
                  ) {
                    const tempStr = this.getDictStr(comp, columnValue);
                    if (tempStr) {
                      str = tempStr;
                    }
                  }
                  if ([6, 7].includes(comp.compType)) {
                    const tempStr = this.getShowStr(comp, columnValue, form);
                    if (tempStr) {
                      str = tempStr;
                    }
                  }
                  formInfo.str += `${str},`;
                }
                if (
                  ['id', 'parent_id', 'position_id'].includes(
                    comp.dataSource.columnName,
                  )
                ) {
                  formInfo.str += `${str},`;
                }
              }
              if (!columnArr.includes(column.columnName)) {
                columnArr.push(column.columnName);
                formInfo.push({
                  columnName: column.columnName,
                  columnType: column.columnType,
                  columnValue,
                  compType: comp.compType,
                  compId: comp.compId,
                  sysMenuDesignId: this.allData.id,
                });
              } else {
                const index = formInfo.findIndex(
                  (v) => v.columnName === column.columnName,
                );
                formInfo[index] = {
                  columnName: column.columnName,
                  columnType: column.columnTypeDict,
                  columnValue,
                  compType: comp.compType,
                  compId: comp.compId,
                  sysMenuDesignId: this.allData.id,
                };
              }
            }
          }
        }
      });
      return formInfo;
    },
    resolveParams() {
      const { userInfo } = this.$store.state.userCenter;
      let logContent = `${userInfo.username}(${userInfo.account}):`;
      const area = this.configData.children[0].children[0].children[1];
      const featureArr = area.children[0];
      const params = {
        formInfo: [],
        tableName: area.tableInfo.tableName,
        id: this.formData.id,
        // compMap: JSON.stringify(this.getAllForm()),
        logData: {
          content: '',
          clientType: 'PC',
          curMenuId: this.$route.params.id || this.$route.query.menuId,
        },
      };
      params.formInfo = this.resolveSaveData(featureArr, area);
      // 处理操作日志
      if (params.formInfo.str) {
        const operate = this.isAdd ? '新增' : '编辑';
        logContent += `[${operate}表(${
          params.tableName
        })数据:${params.formInfo.str.slice(0, -1)}]`;
      }
      delete params.formInfo.str;
      params.logData.content = Encrypt(logContent);
      if (!this.configData.enableLog || !this.configData.logComp.length) {
        delete params.logData;
      }
      return params;
    },
    handleSubmit() {
      // 新增编辑
      this.$refs.dynamicValidateForm.$children[0].validate(async (valid) => {
        if (valid) {
          try {
            const params = this.resolveParams();
            const res = await saveUser(params);
            this.currentRowkey = res.id;
            this.visible = false;
            this.$message({
              type: 'success',
              message: `${this.formData.id ? '编辑' : '新增'}成功`,
            });
            this.formData = {};
            await this.fetchUserList(this.selectKey);
          } catch (e) {
            let newError = {};
            Object.keys(e).forEach((item) => {
              newError = {
                ...newError,
                [this.keyObj[item]]: e[item],
              };
            });
            errorMessageProcessing(newError, (message) => {
              this.$message({
                type: 'warning',
                message,
              });
            });
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    async doEdit(row) {
      // 编辑
      this.title = this.$t('user.editUser');
      const params = {
        compId: 'UeUxHW',
        menuId: 6,
        id: row.id,
      };
      const data = await getUserDetails(params);
      this.configData.children[0].children[0].children[1].children[0].form =
        JSON.parse(JSON.stringify(this.backForm));
      this.formData = data;
      // kMhHfy 固定的组织id 的compId
      const { roleIds, roleNames, kMhHfy, orgName } = data;
      this.formData.orgObj = {};
      this.formData.orgObj = kMhHfy
        ? {
            id: kMhHfy,
            name: orgName,
          }
        : {};
      this.formData.roles = this.reduceArr(roleIds, roleNames);
      this.formData.id = this.formData.lLuOIC;
      this.visible = true;
    },
    doAdd() {
      // 点击新增时的操作
      this.configData.children[0].children[0].children[1].children[0].form =
        JSON.parse(JSON.stringify(this.backForm));
      this.formData = {};
      if (this.defaultLeftType === 'org' && this.selectKey.id) {
        this.formData = {
          enabled: true,
          orgObj: {
            id: this.selectKey.id,
            name: this.selectKey.name,
          },
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
              roleName: this.selectKey.roleName,
            },
          ],
        };
      } else if (this.defaultLeftType === 'position' && this.selectKey.id) {
        this.formData = {
          enabled: true,
          posObj: {
            id: this.selectKey.id,
            name: this.selectKey.name,
          },
        };
      } else {
        this.formData = {
          enabled: true,
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
        console.log(res);
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
          message: this.$t('user.chooseOne'),
        });
        return;
      }
      try {
        const nameArr = this.selected.map((item) => item.username);
        await this.$confirm(
          `${this.$t('user.conformDelete', { names: nameArr.join(',') })}`,
          this.$t('common.tip'),
          { type: 'warning' },
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
          jobType: this.allData.designPageLayout[0].userConfig.leaveJob,
          logData: {
            operateType: 3,
            name: this.$t('role.username'),
            value: 'username',
            deleteArr: this.selected,
          },
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
          message: this.$t('common.deleteSuccess'),
        });
      } catch (e) {
        // console.log(e);
      }
    },
  },
  beforeDestory() {},
  name: 'roleList',
};
</script>

<style lang="scss" scoped>
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
