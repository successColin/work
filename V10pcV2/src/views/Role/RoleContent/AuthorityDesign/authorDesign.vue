<!-- 页面 -->
<template>
  <div>
    <apiot-tabs
        v-on="$listeners"
        v-bind="$attrs"
        :tabsArr="tabsArr"
    >
      <template v-slot:commonPcDesign>
        <design-list :designObj="designObj"
                     :activeTabsKey="activeTabsKey"
                     :functionType="functionType"
                     com="PCDesign"></design-list>
      </template>
      <template v-slot:commonMobileDesign>
        <design-list :designObj="designObj"
                     :activeTabsKey="activeTabsKey"
                     :functionType="functionType"
                     com="mobileDesign"></design-list>
      </template>
    </apiot-tabs>
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
          :functionType="functionType"
          :relationId="designObj.id"
          :menuId="menuId"
          :isInherit="getIsInherit"
          :useInRoleAndUser="!orgcustom.value.isBatch"
          :isBatchCustom="orgcustom.value.isBatch"
      ></Organization>
      <template v-slot:btn v-if="orgcustom.value.isBatch">
        <apiot-button
            @click="menuVisible=true"
            style="position: absolute;left: 20px"
            type="primary"
        ><span class="icon-mokuai iconfont"></span>生效模块
        </apiot-button>
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
          :activeType="activeTabsKey"
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
</template>

<script>
import { doUpdateUserDataAuth } from '@/api/user';
import { doEditRoleDataAuth } from '@/api/role';
import DesignList from '../DesignList/designList';

const Organization = () =>
    import('@/views/Role/RoleContent/DesignDetial/Organization/organization');
const MenuList = () => import('@/views/Role/RoleContent/DesignDetial/MenuList/index');
export default {
  props: {
    designObj: {
      type: Object,
      default: () => {
      }
    },
    activeTabsKey: {
      type: String,
      default: 'PCDesign'
    },
    functionType: {
      type: String,
      default: 'user',
    }
  },
  beforeUpdate() {
    this.tabsArr = [
      {
        label: this.$t('role.desktopPermission'),
        compName: 'commonPcDesign',
        key: 'PCDesign',
      },
      {
        label: this.$t('role.Mobileterminalpermission'),
        compName: 'commonMobileDesign',
        key: 'mobileDesign',
      },
    ];
  },
  data() {
    return {
      tabsArr: [
        {
          label: this.$t('role.desktopPermission'),
          compName: 'commonPcDesign',
          key: 'PCDesign',
        },
        {
          label: this.$t('role.Mobileterminalpermission'),
          compName: 'commonMobileDesign',
          key: 'mobileDesign',
        },
      ],
      orgcustom: {
        value: {
          isBatch: false
        }
      }, // 组织弹框信息
      menuVisible: false,
      otherMenuIds: [], // 生效模块
    };
  },

  components: {
    DesignList,
    Organization,
    MenuList
  },

  computed: {
    getIsInherit() {
      if (this.orgcustom.value.isBatch) return 0;
      if (this.orgcustom.value.functionObj.inherit ||
          this.orgcustom.value.functionObj.isInheritCheck
      ) {
        return this.orgcustom.value.functionObj.inherit;
      }
      if (!this.orgcustom.value.functionObj.isInheritCheck) return 2;
      return 2;
    },
    defaultCheck() {
      const id = this.orgcustom.value?.functionObj?.id;
      return {
        disabledId: id,
        defaultCheckedKeys: [id, ...this.otherMenuIds]
      };
    },
    menuId() {
      if (JSON.stringify(this.orgcustom) === '{}') return 0;
      if (!this.orgcustom.value || !this.orgcustom.value.functionObj) return '';
      return this.orgcustom.value.functionObj.menuId;
    }
  },

  mounted() {
    this.$bus.$off(`${this.functionType}_orgcustom`).$on(`${this.functionType}_orgcustom`, (message) => {
      console.log(message, 'message');
      this.orgcustom = message;
    });
  },

  methods: {
    relationFunction() {
      if (this.functionType === 'user') {
        this.relationUserFunction();
      } else {
        this.relationRoleFunction();
      }
    },
    handleMenuOk() {
      this.otherMenuIds = this.$refs.MenuList.getCheckedKeys();
      this.menuVisible = false;
    },
    handleMenuCancel() {
      this.menuVisible = false;
    },
    relationUserFunction() {
      // 关联function
      const { value: data } = this.orgcustom;
      const { value, functionObj, doUUpdate, isBatch = false } = data;
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
          userid: id,
          typeDict: value,
          orgId: item.id
        });
        orgList.push(item.name);
      });
      const type =
          this.activeTabsKey === 'PCDesign'
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
        userid: id,
        list,
        logData: msg1
      };
      params.batchCustomFlag = isBatch;
      if (isBatch) {
        delete params.list;
        const arr = selectKeys.map((item) => item.id);
        params.orgIds = arr;
        const menuIds = this.otherMenuIds.length ? this.otherMenuIds : [functionObj.id];
        params.menuIds = menuIds;
        params.functionDict = this.activeTabsKey === 'PCDesign' ? 1 : 2;
      }
      try {
        doUUpdate(params, doUpdateUserDataAuth);
        this.orgcustom.dialogVisible = false;
        this.otherMenuIds = [];
      } catch (e) {
        // console.log(e);
      }
    },
    relationRoleFunction() {
      // 关联function
      const { value: data } = this.orgcustom;
      const { value, functionObj, doUUpdate, isBatch = false } = data;
      const { id } = this.designObj;
      const { selectKeys } = this.$refs.org;
      if (!selectKeys.length) {
        this.$message({
          type: 'warning',
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
          this.activeTabsKey === 'PCDesign'
              ? this.$t('role.desktopPermission')
              : this.$t('role.Mobileterminalpermission');
      const msg = `为${this.designObj.roleName}${type}中的${
          functionObj.menuName
      }菜单添加${orgList.join(',')}等数据权限`;
      const params = {
        roleId: id,
        list,
        logoData: msg
      };
      params.batchCustomFlag = isBatch;
      if (isBatch) {
        delete params.list;
        const arr = selectKeys.map((item) => item.id);
        params.orgIds = arr;
        const menuIds = this.otherMenuIds.length ? this.otherMenuIds : [functionObj.id];
        params.menuIds = menuIds;
        params.functionDict = this.activeTabsKey === 'PCDesign' ? 1 : 2;
      }
      try {
        doUUpdate(params, doEditRoleDataAuth);
        this.orgcustom.dialogVisible = false;
        this.otherMenuIds = [];
      } catch (e) {
        console.log(e);
      }
    },
    handleCancel() {
      // 关闭
      this.orgcustom = {
        dialogVisible: false,
        value: {}
      };
    },
  },
  beforeDestroy() {
    this.$bus.$off(`${this.functionType}_orgcustom`);
  }
};
</script>

<style lang='scss' scoped>
</style>
