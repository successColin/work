<!-- 页面 -->
<template>
  <div class="designWrap">
    <div class="design__title">
      <div class="design__obj">
        {{ $t('role.treat') }}
        <span>【{{ designName(designObj) }}】</span>
        {{ $t('role.distribution') }}
        {{
          activeTabsKey === 'PCDesign'
            ? $t('role.desktopPermission')
            : $t('role.Mobileterminalpermission')
        }}
      </div>
      <el-popover
        placement="bottom"
        width="400"
        visible-arrow="false"
        popper-class="batchPopover"
        trigger="click"
      >
        <batch-design
          :com="com"
          :dataAuthList="dataAuthList"
          :functionAuthList="functionAuthList"
          :designObj="designObj"
          @batchUpdateOrg="batchUpdateOrg"
          v-on:checkAll="batchCheckAll"
          v-on:checkItem="batchCheckItem"
          v-on:changeRadio="batchChangeRadio"
          :toggleLoading="toggleLoading"
          :selectModuleKeys="selectModuleKeys"
        ></batch-design>
        <el-button type="primary" class="design__ope" slot="reference">
          <i class="icon-piliangcaozuo iconfont" style="margin-right: 4px"></i>
          {{ $t('role.batchOperation') }}
        </el-button>
      </el-popover>
    </div>
    <design-detial
      v-loading="loading"
      :functionType="functionType"
      :designObj="designObj"
      :isShowInherit="isShowInherit"
      :authList="authList"
      :activeTabsKey="activeTabsKey"
      :dogetNewAuth="fetchAuthList"
      :dataAuthList="dataAuthList"
      :com="com"
      ref="authDetial"
      @selectChooseModules="selectChooseModules"
      :toggleLoading="toggleLoading"
    ></design-detial>
  </div>
</template>

<script>
import {
  fetchRoleAuth,
  doGetRoleData,
  doGetBatchAuth,
  doEditRoleAuth,
  doEditRoleDataAuth
} from '@/api/role';
import { getDefaultFunctionAuth, doUpdateUserFunctionAuth, doUpdateUserDataAuth } from '@/api/user';
import DesignDetial from '../DesignDetial/designDetial';
import BatchDesign from './BatchDesign/batchDesign';

export default {
  props: {
    activeTabsKey: {
      type: String,
      default: 'PCDesign'
    },
    com: {
      type: String,
      default: 'PCDesign'
    },
    designObj: {
      // 修改权限的对象
      type: Object,
      default: () => {}
    },
    isShowInherit: {
      type: Boolean,
      default: false
    },
    functionType: {
      type: String,
      default: 'role'
    }
  },
  data() {
    return {
      selectModuleKeys: {}, // 选中的模块
      loading: false,
      authList: [], // 菜单模块，菜单，权限列表
      dataAuthList: {}, // 数据权限集合
      functionAuthList: [] // 功能权限集合
    };
  },

  watch: {},
  components: {
    DesignDetial, // 设计权限详情
    BatchDesign // 批量设计
  },

  computed: {
    designName() {
      return function(obj) {
        if (this.functionType === 'user') {
          return obj.username;
        }
        if (this.functionType === 'role') {
          return obj.roleName;
        }
      };
    }
  },

  mounted() {
    this.init();
    this.getRoleDataAuth();
    this.getRoleFunctionAuth();
    this.$bus.$on(`${this.com}_authList`, (message) => {
      // 菜单权限修改监听
      this.authList = message;
    });
  },

  methods: {
    batchUpdateOrg() { // 批量选择组织
      // this.custom({
      //   value: '5',
      //   functionObj,
      //   isBatch: false,
      //   doUUpdate: this.doUpdateAuth,
      //   authList: this.authList,
      //   selectModuleIndex: this.selectModuleIndex
      // });
      // value.com = this.com;
      // value.selectKey = this.selectKey;
      console.log(this.$refs.authDetial);
      const { doUpdateAuth, selectModuleIndex } = this.$refs.authDetial;
      const lastObj = this.com === 'PCDesign' ? this.selectModuleKeys : this.authList[selectModuleIndex];
      // 自定义弹框
      this.$bus.$emit(`${this.functionType}_orgcustom`, {
        dialogVisible: true,
        value: {
          com: this.com,
          doUUpdate: doUpdateAuth,
          selectKey: this.selectModuleKeys,
          functionObj: lastObj,
          value: '5',
          isBatch: true,
          authList: this.authList,
        }
      });
    },
    selectChooseModules(value) {
      this.selectModuleKeys = value;
    },
    toggleLoading(loading) {
      // 显示或者隐藏loading
      this.loading = loading;
    },
    retrunName(obj) {
      if (this.functionType === 'user') {
        return obj.username;
      }
      if (this.functionType === 'role') {
        return obj.roleName;
      }
    },
    returnAuthName(type) {
      if (type === 1) {
        return this.$t('role.look');
      }
      if (type === 2) {
        return this.$t('role.add');
      }
      if (type === 3) {
        return this.$t('role.modifiy');
      }
      if (type === 4) {
        return this.$t('role.delete');
      }
      if (type === 5) {
        return this.$t('role.Import');
      }
      if (type === 6) {
        return this.$t('role.export');
      }
      if (type === 7) {
        return this.$t('role.Printing');
      }
      if (type === 8) {
        return this.$t('role.Design');
      }
    },
    showRealName(obj) {
      const languageType = window.localStorage.getItem('apiotLanguage') || 'zhCN';
      return obj[languageType];
    },
    batchChangeRadio(obj) {
      // 组织批量修改
      const { value } = obj;
      if (!this.$refs.authDetial) return false;
      const { selectModuleIndex, authList, doUpdateAuth } = this.$refs.authDetial;
      const modulles = authList[selectModuleIndex] || {};
      let modullesArr = modulles.list || [];
      if (this.com === 'PCDesign') {
        modullesArr = authList;
      }
      if (!modullesArr.length) return false;
      const { id: roleId } = this.designObj;
      const newList = [];
      const filedKey = this.functionType === 'role' ? 'roleId' : 'userid';
      const type =
        this.activeTabsKey === 'PCDesign'
          ? this.$t('role.desktopPermission')
          : this.$t('role.Mobileterminalpermission');
      let message = `${type}-`;
      const menuArr = [];
      modullesArr.forEach((item) => {
        if (item.dataPermission !== Number(value)) {
          const newItem = {
            ...item,
            [filedKey]: roleId,
            typeDict: value
          };
          newList.push(newItem);
          menuArr.push(item.menuName);
        }
      });
      message += menuArr.join('/');
      if (!newList.length) return false;
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const msg = `批量修改${this.retrunName(this.designObj)}${typeName}的${this.showRealName(
        obj
      )}数据权限（${message}）`;
      // console.log(msg);
      const api = this.functionType === 'role' ? doEditRoleDataAuth : doUpdateUserDataAuth;
      doUpdateAuth(
        {
          [filedKey]: roleId,
          list: newList,
          logData: msg
        },
        api
      );
    },
    batchCheckAll({ value }) {
      // 功能角色全选
      if (!this.$refs.authDetial) return false;
      const { selectModuleIndex, authList, doUpdateAuth } = this.$refs.authDetial;
      const modulles = authList[selectModuleIndex] || {};
      let modullesArr = modulles.list || [];
      if (this.com === 'PCDesign') {
        modullesArr = authList;
      }
      if (!modullesArr.length) return false;
      let functionAuthList = [];
      modullesArr.forEach((item) => {
        const functionList = item.list || [];
        const newList1 = functionList.map((listObj) => ({
          ...listObj,
          menuName: item.menuName,
          inherit: item.inherit
        }));
        const subChildren = item.children;
        if (subChildren && Array.isArray(subChildren) && subChildren.length) {
          subChildren.forEach((sub) => {
            const subArr = sub.list || [];
            const arr = subArr.map((subObj) => ({
              ...subObj,
              menuName: sub.menuName,
              inherit: sub.inherit
            }));
            functionAuthList = [...functionAuthList, ...arr];
          });
        }
        if (Array.isArray(item.list)) {
          functionAuthList = [...functionAuthList, ...newList1];
        }
      });
      const { id: roleId } = this.designObj;
      const newList = [];
      const api = this.functionType === 'role' ? doEditRoleAuth : doUpdateUserFunctionAuth;
      const filedKey = this.functionType === 'role' ? 'roleId' : 'userid';
      let message = '';
      functionAuthList.forEach((item) => {
        const isTrue = value ? '1' : '2';
        const { check, inherit } = item;
        if (this.functionType === 'user' && inherit && inherit === 1) {
          const newItem = {
            ...item,
            check: isTrue,
            [filedKey]: roleId
          };
          newList.push(newItem);
        } else if (
          (this.functionType === 'user' && inherit && inherit === 2) ||
          this.functionType === 'role'
        ) {
          if (check !== isTrue) {
            const newItem = {
              ...item,
              check: isTrue,
              [filedKey]: roleId
            };
            newList.push(newItem);
          }
        }
        const msg = `${item.menuName}-${this.returnAuthName(item.permissionItemId)}权限/`;
        message += msg;
      });
      if (!newList.length) return false;
      const doType = value ? '批量新增' : '批量取消';
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const type =
        this.activeTabsKey === 'PCDesign'
          ? this.$t('role.desktopPermission')
          : this.$t('role.Mobileterminalpermission');
      const msg = `${doType}${this.retrunName(this.designObj)}${typeName}的数据权限(${type}-${message})`;
      doUpdateAuth(
        {
          list: newList,
          logData: msg
        },
        api
      );
    },
    batchCheckItem({
      // 功能权限单项
      value,
      obj
    }) {
      if (!this.$refs.authDetial) return false;
      const { selectModuleIndex, authList, doUpdateAuth } = this.$refs.authDetial;
      const { id: authId } = obj;
      const modulles = authList[selectModuleIndex] || {};
      let modullesArr = modulles.list || [];
      if (this.com === 'PCDesign') {
        modullesArr = authList;
      }
      if (!modullesArr.length) return false;
      let functionAuthList = [];
      const menuArr = [];
      modullesArr.forEach((item) => {
        const functionList = item.list || [];
        const newList1 = functionList.map((listObj) => ({
          ...listObj,
          menuName: item.menuName,
          inherit: item.inherit
        }));
        menuArr.push(item.menuName);
        const subChildren = item.children;
        if (subChildren && Array.isArray(subChildren) && subChildren.length) {
          subChildren.forEach((sub) => {
            const subArr = sub.list || [];
            const arr = subArr.map((subObj) => ({
              ...subObj,
              menuName: sub.menuName,
              inherit: sub.inherit
            }));
            functionAuthList = [...functionAuthList, ...arr];
          });
        }
        if (Array.isArray(functionList)) {
          functionAuthList = [...functionAuthList, ...newList1];
        }
      });
      if (!functionAuthList.length) return false;
      const { id: roleId } = this.designObj;
      const newList = [];
      const api = this.functionType === 'role' ? doEditRoleAuth : doUpdateUserFunctionAuth;
      const filedKey = this.functionType === 'role' ? 'roleId' : 'userid';
      functionAuthList.forEach((item) => {
        const isTrue = value ? '1' : '2';
        if (item.permissionItemId === authId) {
          if (
            this.functionType === 'role' ||
            (this.functionType === 'user' && item.inherit === 2)
          ) {
            if (isTrue !== item.check) {
              const newItem = {
                ...item,
                check: isTrue,
                [filedKey]: roleId
              };
              newList.push(newItem);
            }
          }
          if (this.functionType === 'user' && item.inherit === 1) {
            const newItem = {
              ...item,
              check: isTrue,
              [filedKey]: roleId
            };
            newList.push(newItem);
          }
        }
      });
      const doType = value ? '批量新增' : '批量取消';
      const type =
        this.activeTabsKey === 'PCDesign'
          ? this.$t('role.desktopPermission')
          : this.$t('role.Mobileterminalpermission');
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const msg = `${doType}${this.retrunName(this.designObj)}${typeName}的${this.returnAuthName(
        authId
      )}数据权限(${type}-${menuArr.join('/')})`;
      if (!newList.length) return false;
      doUpdateAuth(
        {
          list: newList,
          logData: msg
        },
        api
      );
    },
    async getRoleFunctionAuth() {
      // 获取批量的功能权限
      try {
        const list = await doGetBatchAuth();
        this.functionAuthList = list || [];
      } catch (e) {
        // console.log(e);
      }
    },
    async getRoleDataAuth() {
      // 获取该页面的数据权限
      try {
        const list = await doGetRoleData({ dictKeys: 'DATA_AUTHORITY_TYPE' });
        this.dataAuthList = list || {};
      } catch (e) {
        // console.log(e);
      }
    },
    init() {
      // 根据comkey来调用接口获取pc，app的数据
      const { id } = this.designObj;
      let params = {
        functionDict: this.com === 'mobileDesign' ? 2 : 1
      };
      params = {
        ...params,
        [this.functionType === 'role' ? 'roleId' : 'userid']: id
      };
      this.fetchAuthList(params);
    },
    async fetchAuthList(params) {
      // 获取权限列表
      this.loading = true;
      const api = this.functionType === 'role' ? fetchRoleAuth : getDefaultFunctionAuth;
      try {
        const list = await api(params);
        this.authList = this.com === 'PCDesign' ? [] : list;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        // console.log(e);
      }
    },
    async fetchAuthListAgain(params) {
      // 获取权限列表
      try {
        const list = await fetchRoleAuth(params);
        this.authList = list;
      } catch (e) {
        // console.log(e);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.designWrap {
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;

  .design__title {
    height: 42px;
    line-height: 42px;
    overflow: hidden;

    .design__obj {
      float: left;
      margin-left: 31px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;

      span {
        color: $--color-primary;
      }
    }

    .design__ope {
      float: right;
      margin-top: 6px;
      margin-right: 10px;
    }
  }
}

.batchPopover {
  padding: 0 !important;
}
</style>
