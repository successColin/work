<!-- 页面 -->
<template>
  <div class="design__listWrap">
    <div class="design—div__listTitleWrap">
      <div class="listTitleWrap__module listTitleWrap__common">
        {{ $t('role.functionFile') }}
      </div>
      <div class="listTitleRihghtWrap">
        <div
            class="listTitleWrap__function"
            :class="{
            listTitleWrap__function: !isShowInherit(),
            listTitleWrap__function1: isShowInherit(),
          }"
        ></div>
        <div
            class="listTitleWrap__common"
            :class="{
            listTitleWrap__authObj: !isShowInherit(),
            listTitleWrap__authObj1: isShowInherit(),
          }"
        >
          {{ $t('role.functionAuthority') }}
        </div>
        <div
            class="listTitleWrap__authData listTitleWrap__common"
            :class="{
            listTitleWrap__authData: !isShowInherit(),
            listTitleWrap__authData1: isShowInherit(),
          }"
        >
          {{ $t('role.dataRights') }}
        </div>
        <div
            class="listTitleWrap__inherit listTitleWrap__common"
            v-if="isShowInherit()"
        ></div>
      </div>
    </div>
    <div class="design__listwrap">
      <div class="listwrap__moduleListWrap" v-if="com === 'mobileDesign'">
        <div
            v-for="(item, index) in authList"
            :key="item.id"
            class="listwrap__modulesItem"
            :class="{ active: index === selectModuleIndex }"
            @click="handleClickModules(item)"
        >
          {{ item.menuName }}
        </div>
      </div>
      <div class="listwrap__moduleListWrap" v-if="com === 'PCDesign'">
        <MenuList @selectMenu="handleClickModules"></MenuList>
        <!--        <div-->
        <!--            v-for="(item, index) in authList"-->
        <!--            :key="item.id"-->
        <!--            class="listwrap__modulesItem"-->
        <!--            :class="{ active: index === selectModuleIndex }"-->
        <!--            @click="handleClickModules(item)"-->
        <!--        >-->
        <!--          {{ item.menuName }}-->
        <!--        </div>-->
      </div>
      <div class="listwrap__designListWrap" :key="update">
        <apiot-nodata description="暂无数据" v-if="!getAuthList.length"></apiot-nodata>
        <div v-for="(item, index) in getAuthList"
             :key="`${item.menuId}_${index}`"
        >
          <div class="listwrap__itemBox">
            <div
                :title="item.menuName"
                :class="{
                function: !isShowInherit(),
                function1: isShowInherit(),
              }"
            >
              <span v-if="item.menuType !== 3" class="menuName">{{
                  item.menuName
                }}</span>
              <div
                  v-if="item.menuType === 3"
                  class="hasChildren"
                  @click="expand(item, index)"
              >
                {{ item.menuName }}
                <span
                    class="iconfont"
                    :class="getExpandStatus(item, index)"
                ></span>
              </div>
            </div>
            <div
                :class="{ design: !isShowInherit(), design1: isShowInherit() }"
            >
              <div>
                <el-checkbox
                    @change="(e) => changeAllAuth(e, item)"
                    v-model="item.checkAll"
                    :checked="item.checkAll"
                >
                  {{ $t('role.selectAll') }}
                </el-checkbox>
              </div>
              <div style="margin-top: 8px">
                <apiot-checkbox
                    v-for="items in item.list"
                    :checked="items.isCheck"
                    v-model="items.isCheck"
                    :key="items.permissionItemId"
                    @change="(e) => changeAuth(e, items, item)"
                >
                  <span> {{ items.permissionItemName }}</span>
                  <!--                  <span v-if="items.permissionItemId === 1">{{-->
                  <!--                    $t('role.look')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 2">{{-->
                  <!--                    $t('role.add')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 3">{{-->
                  <!--                    $t('role.modifiy')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 4">{{-->
                  <!--                    $t('role.delete')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 5">{{-->
                  <!--                    $t('role.Import')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 6">{{-->
                  <!--                    $t('role.export')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 7">{{-->
                  <!--                    $t('role.Printing')-->
                  <!--                  }}</span>-->
                  <!--                  <span v-if="items.permissionItemId === 8">{{-->
                  <!--                    $t('role.Design')-->
                  <!--                  }}</span>-->
                </apiot-checkbox>
              </div>
            </div>
            <div
                :class="{
                authData: !isShowInherit(),
                authData1: isShowInherit(),
              }"
                style="overflow: hidden"
            >
              <div
                  v-for="dataItem in dataAuthList.DATA_AUTHORITY_TYPE"
                  :key="dataItem.value"
              >
                <apiot-radio
                    class="raidoWrap"
                    :data-index="index"
                    :key="dataItem.value"
                    @change="(e) => changeRoleDataAuth(e, dataItem, item)"
                    v-model="item.dataPermission"
                    :label="Number(dataItem.value)"
                    :class="{ radioWrap: Number(dataItem.value) === 5 }"
                    :title="showName(dataItem)"
                >
                  {{ showName(dataItem) }}
                </apiot-radio>
              </div>
            </div>
            <div class="inherit" v-if="functionType === 'user'">
              <div class="inheritWrap">
                <apiot-checkbox
                    :checked="item.isInheritCheck"
                    v-model="item.isInheritCheck"
                    :disabled="item.isInheritCheck"
                    @change="(e) => updateInhertAuth(e, item)"
                >
                  {{ $t('role.inhert') }}
                </apiot-checkbox>
              </div>
            </div>
          </div>
          <div v-if="item.expand">
            <div
                class="listwrap__itemBox"
                v-for="(sub, i) in item.children"
                :key="sub.id"
            >
              <div
                  :title="sub.menuName"
                  :class="{
                  function: !isShowInherit(),
                  function1: isShowInherit(),
                }"
              >
                <span class="menuName" style="margin-left: 37px">{{
                    sub.menuName
                  }}</span>
              </div>
              <div
                  :class="{ design: !isShowInherit(), design1: isShowInherit() }"
              >
                <div>
                  <el-checkbox
                      v-if="sub.list.length"
                      @change="(e) => changeAllAuth(e, sub)"
                      :value="getSubCheckAll(sub)"
                      :checked="sub.checkAll"
                  >
                    {{ $t('role.selectAll') }}
                  </el-checkbox>
                </div>
                <div style="margin-top: 8px">
                  <apiot-checkbox
                      v-for="per in sub.list"
                      :checked="per.isCheck"
                      :value="per.check === '1'"
                      :key="per.permissionItemId"
                      @change="(e) => changeAuth(e, per, sub)"
                  >
                    <span>{{ per.permissionItemName }}</span>
                    <!--                    <span v-if="per.permissionItemId === 1">{{-->
                    <!--                      $t('role.look')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 2">{{-->
                    <!--                      $t('role.add')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 3">{{-->
                    <!--                      $t('role.modifiy')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 4">{{-->
                    <!--                      $t('role.delete')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 5">{{-->
                    <!--                      $t('role.Import')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 6">{{-->
                    <!--                      $t('role.export')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 7">{{-->
                    <!--                      $t('role.Printing')-->
                    <!--                    }}</span>-->
                    <!--                    <span v-if="per.permissionItemId === 8">{{-->
                    <!--                      $t('role.Design')-->
                    <!--                    }}</span>-->
                  </apiot-checkbox>
                </div>
              </div>
              <div
                  :class="{
                  authData: !isShowInherit(),
                  authData1: isShowInherit(),
                }"
                  style="overflow: hidden"
              >
                <div
                    v-for="dataItem in dataAuthList.DATA_AUTHORITY_TYPE"
                    :key="dataItem.value"
                >
                  <apiot-radio
                      class="raidoWrap"
                      :data-index="`${index}_${i}`"
                      :key="dataItem.value"
                      @change="(e) => changeRoleDataAuth(e, dataItem, sub)"
                      :value="sub.dataPermission || 4"
                      :label="Number(dataItem.value)"
                      :class="{ radioWrap: Number(dataItem.value) === 5 }"
                      :title="showName(dataItem)"
                  >
                    {{ showName(dataItem) }}
                  </apiot-radio>
                </div>
              </div>
              <div class="inherit" v-if="functionType === 'user'">
                <div class="inheritWrap">
                  <apiot-checkbox
                      :checked="sub.isInheritCheck"
                      :value="sub.inherit === 1"
                      :disabled="sub.inherit === 1"
                      @change="(e) => updateInhertAuth(e, sub)"
                  >
                    {{ $t('role.inhert') }}
                  </apiot-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doEditRoleAuth, doEditRoleDataAuth, getModulesFunction } from '@/api/role';
import {
  getFunctionAuthById,
  doUpdateUserFunctionAuth,
  doUpdateUserDataAuth,
  updateInhertAuth
} from '@/api/user';
import MenuList from './MenuList/index';

export default {
  props: {
    dataAuthList: {
      // 数据权限
      type: Object,
      default: () => {
      }
    },
    designObj: {
      // 修改权限的对象
      type: Object,
      default: () => {
      }
    },
    dogetNewAuth: {
      type: Function,
      default: () => {
      }
    },
    authList: {
      // 权限数据
      type: Array,
      default: () => []
    },
    activeTabsKey: {
      type: String,
      default: 'PCDesign'
    },
    functionType: {
      type: String,
      default: 'role'
    },
    com: {
      type: String
    },
    toggleLoading: {
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      update: 0,
      loading: false,
      dialogVisible: false,
      selectKey: {}, // 被选中的模块
      selectModuleIndex: 0 // 默认选中第一条
    };
  },
  components: {
    MenuList
  },
  watch: {},
  computed: {
    getAuthList() {
      return this.functionList.list;
    },
    getSubCheckAll() {
      return function (obj) {
        const functionAuthList = obj.list || [];
        const checkAll = functionAuthList.filter((items) => items.check === '1');
        return checkAll.length === functionAuthList.length;
      };
    },
    showName() {
      return function (obj) {
        const languageType = window.localStorage.getItem('apiotLanguage') || 'zhCN';
        return obj[languageType];
      };
    },
    isShowInherit() {
      return function () {
        if (this.functionType === 'role') {
          return false;
        }
        if (this.functionType === 'user') {
          return true;
        }
      };
    },
    functionList() {
      let list;
      const functionObj = this.authList[this.selectModuleIndex] || {};
      if (this.com !== 'PCDesign') {
        list = functionObj.list;
      } else {
        list = this.authList;
      }
      const origList = list && list.length ? list : [];
      const newList = origList.map((item) => {
        const functionAuthList = item.list || [];
        const checkAll = functionAuthList.filter((items) => items.check === '1');
        const newFunctionAuthList = [];
        functionAuthList.forEach((items) => {
          const isTure1 = items.check === '1';
          newFunctionAuthList.push({
            ...items,
            isCheck: isTure1
          });
        });
        const isTrue = checkAll.length === functionAuthList.length;
        const isInheritCheck = item.inherit === 1;
        return {
          ...item,
          list: newFunctionAuthList,
          checkAll: isTrue,
          isInheritCheck,
          dataPermission: item.dataPermission || 4
        };
      });
      const newFunctionObj = {
        ...functionObj,
        list: newList
      };
      return newFunctionObj;
    },
    getExpandStatus() {
      return function (item) {
        if (item.expand) {
          return 'icon-shujiantouzhankai';
        }
        return 'icon-shujiantoushouqi';
      };
    }
  },
  mounted() {
    setTimeout(() => {
      this.addEvent();
    }, 0);
  },
  methods: {
    async expand(item) {
      if (item.expand) {
        item.expand = false;
      } else {
        item.expand = true;
      }
      if (item.children && Array.isArray(item.children)) {
        this.update += 1;
        return;
      }
      const { id } = this.designObj;
      let params = {
        functionDict: this.activeTabsKey === 'mobileDesign' ? 2 : 1,
        menuId: item.menuId
      };
      if (this.functionType === 'role') {
        params = {
          ...params,
          roleId: id
        };
      } else if (this.functionType === 'user') {
        params = {
          ...params,
          userId: id
        };
      }
      try {
        const api = this.functionType === 'role' ? getModulesFunction : getFunctionAuthById;
        const list = (await api(params)) || [];
        item.children = list;
        const sourceData = JSON.parse(JSON.stringify(this.authList[this.selectModuleIndex]));
        const sourceList = sourceData.list;
        const i = sourceList.findIndex((source) => source.menuId === item.menuId);
        if (i !== -1) {
          sourceList.splice(i, 1, item);
          sourceData.list = sourceList;
          this.$set(this.authList, this.selectModuleIndex, sourceData);
        }
      } catch (e) {
        this.toggleLoading(false);
      }
      // this.update += 1;
      this.$nextTick(() => {
        this.addEvent();
      });
    },
    updateInhertAuth(e, item) {
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const doType = e ? '使用角色继承' : '取消角色继承';
      const type =
          this.activeTabsKey === 'PCDesign'
            ? this.$t('role.desktopPermission')
            : this.$t('role.Mobileterminalpermission');
      const msg = `对${this.retrunName(this.designObj)}${typeName}${doType}(${type}-${item.menuName})`;
      const params = {
        logData: msg,
        userId: this.designObj.id,
        menuIds: item.menuId
      };
      this.doUpdateAuth(params, updateInhertAuth);
    },
    addEvent() {
      const classAuth = this.functionType === 'role' ? '.authData' : '.authData1';
      const realDomClassName = ['pane-PCDesign', 'pane-mobileDesign'];
      realDomClassName.forEach((classItem) => {
        document.querySelectorAll(`#${classItem} ${classAuth} .radioWrap input[value='5']`).forEach((item) => {
          item.addEventListener('click', (e) => {
            const currentIndex = e.path[2].getAttribute('data-index');
            const arr = currentIndex.split('_');
            const functionObj = this.functionList.list[arr[0]];
            if (this.com !== this.activeTabsKey) return false;
            if (arr.length < 2) {
              this.custom({
                value: '5',
                functionObj,
                doUUpdate: this.doUpdateAuth,
                authList: this.authList,
                selectModuleIndex: this.selectModuleIndex
              });
            } else {
              const Obj = this.functionList.list[arr[0]].children[arr[1]];
              this.custom({
                value: '5',
                functionObj: Obj,
                doUUpdate: this.doUpdateAuth,
                authList: this.authList,
                selectModuleIndex: this.selectModuleIndex
              });
            }
          });
        });
      });
    },
    changeRoleDataAuth(e, dataItem, functionObj) {
      if (dataItem.value === '5') {
        this.custom({
          value: '5',
          functionObj,
          doUUpdate: this.doUpdateAuth,
          authList: this.authList,
          selectModuleIndex: this.selectModuleIndex
        });
        return;
      }
      const filedKey = this.functionType === 'role' ? 'roleId' : 'userId';
      const type =
          this.activeTabsKey === 'PCDesign'
            ? this.$t('role.desktopPermission')
            : this.$t('role.Mobileterminalpermission');
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const msg = `修改【${this.retrunName(this.designObj)}】${typeName}的${this.showName(
        dataItem
      )}数据权限(${type}-${
        functionObj.menuName
      })`;

      const params = {
        logData: msg,
        [filedKey]: this.designObj.id,
        list: [
          {
            menuId: functionObj.menuId,
            [filedKey]: this.designObj.id,
            typeDict: dataItem.value
          }
        ]
      };
      const api = this.functionType === 'role' ? doEditRoleDataAuth : doUpdateUserDataAuth;
      this.doUpdateAuth(params, api);
    },
    changeAllAuth(e, fun) {
      // 全选
      const { list } = fun;
      const checkValue = e ? '1' : '2';
      const newList = [];
      list.forEach((item) => {
        const { check } = item;
        if (check !== checkValue) {
          newList.push({
            ...item,
            check: checkValue,
            [this.functionType === 'role' ? 'roleId' : 'userId']: this.designObj.id
          });
        }
      });
      const api = this.functionType === 'role' ? doEditRoleAuth : doUpdateUserFunctionAuth;
      const type =
          this.activeTabsKey === 'PCDesign'
            ? this.$t('role.desktopPermission')
            : this.$t('role.Mobileterminalpermission');
      const doType = e ? '新增' : '取消';
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const authArr = newList.map((item) => this.returnAuthName(item.permissionItemId));
      const msg = `${doType}${this.retrunName(this.designObj)}${typeName}的${authArr.join(
        ','
      )}权限(${type}-${fun.menuName})`;
      this.doUpdateAuth({
        list: newList,
        logData: msg
      }, api);
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
    changeAuth(e, obj = {}, fun) {
      // 单选
      const newObj = {
        ...obj,
        check: e ? '1' : '2',
        [this.functionType === 'role' ? 'roleId' : 'userId']: this.designObj.id
      };
      const api = this.functionType === 'role' ? doEditRoleAuth : doUpdateUserFunctionAuth;
      const type =
          this.activeTabsKey === 'PCDesign'
            ? this.$t('role.desktopPermission')
            : this.$t('role.Mobileterminalpermission');
      const doType = e ? '新增' : '取消';
      const typeName = this.functionType === 'role' ? '角色' : '用户';
      const msg = `${doType}${this.retrunName(this.designObj)}${typeName}的${this.returnAuthName(
        obj.permissionItemId
      )}权限(${type}-${fun.menuName})`;
      this.doUpdateAuth(
        {
          list: [newObj],
          logData: msg
        },
        api
      );
    },
    async doUpdateAuth(params, api) {
      // 进行修改角色权限
      this.toggleLoading(true);
      try {
        await api(params);
        this.toggleLoading(false);
        this.$message({
          type: 'success',
          message: this.$t('role.authSuccess')
        });
        this.getNewRoleAuth();
      } catch (e) {
        this.toggleLoading(false);
      }
    },
    getNewRoleAuth() {
      // 拉取最新的数据
      const { id } = this.designObj;
      const isTrue = this.activeTabsKey === 'PCDesign';
      let params = {
        functionDict: isTrue ? 1 : 2
      };
      if (isTrue) {
        params.menuId = this.selectKey.id;
      } else {
        const functionObj = this.authList[this.selectModuleIndex];
        const { id: menuId } = functionObj;
        params.menuId = menuId;
      }
      if (this.functionType === 'role') {
        params = {
          ...params,
          roleId: id
        };
      } else if (this.functionType === 'user') {
        params = {
          ...params,
          userId: id
        };
      }
      this.getModulesFunctiion(params);
    },
    async getModulesFunctiion(params) {
      // 获取一级菜单下的所有菜单权限
      this.toggleLoading(true);
      try {
        const api = this.functionType === 'role' ? getModulesFunction : getFunctionAuthById;
        const list = await api(params);
        if (this.com !== 'PCDesign') {
          const newAuthList = [...this.authList];
          newAuthList[this.selectModuleIndex].list = list;
          this.$bus.$emit(`${this.activeTabsKey}_authList`, newAuthList);
        } else {
          this.$bus.$emit(`${this.activeTabsKey}_authList`, list);
        }
        this.toggleLoading(false);
      } catch (e) {
        this.toggleLoading(false);
      }
      this.$nextTick(() => {
        this.addEvent();
      });
    },
    async handleClickModules(functionObj) {
      // 点击菜单
      const { id: menuId } = functionObj;
      this.selectKey = functionObj;
      const index = this.authList.findIndex((item) => item.id === menuId);
      this.selectModuleIndex = index;
      const { id } = this.designObj;
      let params = {
        functionDict: this.activeTabsKey === 'mobileDesign' ? 2 : 1,
        menuId
      };
      if (this.functionType === 'role') {
        params = {
          ...params,
          roleId: id
        };
      } else if (this.functionType === 'user') {
        params = {
          ...params,
          userId: id
        };
      }
      this.$bus.$emit(`${this.activeTabsKey}_change_batch`);
      await this.getModulesFunctiion(params);
    },
    custom(value) {
      value.com = this.com;
      value.selectKey = this.selectKey;
      // 自定义弹框
      this.$bus.$emit(`${this.functionType}_orgcustom`, {
        dialogVisible: true,
        value
      });
    }
  },
  beforeDestory() {
    const classAuth = this.functionType === 'role' ? '.authData' : '.authData1';
    const realDomClassName = ['pane-PCDesign', 'pane-mobileDesign'];
    realDomClassName.forEach((classItem) => {
      document
        .querySelectorAll(`#${classItem} ${classAuth} .radioWrap input[value='5']`)
        .forEach((item) => {
          item.removeEventListener('click', () => {
          });
        });
    });
  },
  name: 'designDetial'
};
</script>

<style lang='scss' scoped>
.design__listWrap {
  width: 100%;
  height: calc(100% - 42px);

  .design—div__listTitleWrap {
    width: 100%;
    height: 38px;
    display: flex;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    background: #fafafa;
    line-height: 38px;

    .listTitleWrap__common {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }

    .listTitleWrap__module {
      padding-left: 29px;
      //flex-grow: 1.5;
      width: 192px;
      flex: 0 0 192px;
    }

    .listTitleRihghtWrap {
      flex: 1;
      display: flex;

      .listTitleWrap__function {
        flex: 0 0 11%;
        border-right: 1px solid #e9e9e9;
        box-sizing: border-box;
      }

      .listTitleWrap__function1 {
        flex: 0 0 10%;
        border-right: 1px solid #e9e9e9;
        box-sizing: border-box;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .listTitleWrap__authObj {
        flex: 0 0 64%;
        padding-left: 20px;
        box-sizing: border-box;
        border-right: 1px solid #e9e9e9;
      }

      .listTitleWrap__authObj1 {
        flex: 0 0 50%;
        padding-left: 20px;
        box-sizing: border-box;
        border-right: 1px solid #e9e9e9;
      }

      .listTitleWrap__authData {
        padding-left: 20px;
        box-sizing: border-box;
        flex: 0 0 25%;
      }

      .listTitleWrap__authData1 {
        padding-left: 20px;
        box-sizing: border-box;
        border-right: 1px solid #e9e9e9;
        flex: 0 0 25%;
      }

      .listTitleWrap__inherit {
        flex: 0 0 15%;
      }
    }
  }

  .design__listwrap {
    width: 100%;
    height: calc(100% - 40px);
    display: flex;

    .listwrap__moduleListWrap {
      flex: 0 0 221px;
      padding: 10px;
      border-right: 1px solid #e9e9e9;
      box-sizing: border-box;
      overflow-y: auto;

      .listwrap__modulesItem {
        height: 34px;
        padding-left: 19px;
        line-height: 34px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.active {
          background: #4689f5 !important;
          border-radius: 4px;
          color: #ffffff !important;
        }

        &:hover {
          background: $--hover-color;
          border-radius: 4px;
          color: #4689f5;
        }
      }
    }

    .listwrap__designListWrap::-webkit-scrollbar {
      width: 0;
    }

    .listwrap__designListWrap {
      flex: 1;
      overflow-y: auto;

      .listwrap__itemBox {
        width: 100%;
        min-height: 80px;
        display: flex;
        border-bottom: 1px solid #e9e9e9;
        box-sizing: border-box;

        .menuName {
          margin-left: 27px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .hasChildren {
          position: relative;
          height: 30px;
          background: #ffffff;
          border-radius: 4px;
          border: 1px solid #ebebeb;
          line-height: 30px;
          width: calc(100% - 20px);
          margin: 0 auto;
          padding: 0 17px;
          box-sizing: border-box;
          cursor: pointer;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;

          &:hover {
            background: #e5f0ff;
            border: 1px solid #ebebeb;
          }

          .iconfont {
            position: absolute;
            right: 5px;
          }
        }

        .function {
          //flex: 0 0 11%;
          display: flex;
          width: 11%;
          align-items: center;
          //padding-left: 27px;
          box-sizing: border-box;
          border-right: 1px solid #e9e9e9;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 79px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .function1 {
          flex: 0 0 10%;
          display: flex;
          align-items: center;
          //padding-left: 27px;
          box-sizing: border-box;
          border-right: 1px solid #e9e9e9;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
          line-height: 79px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }

        .design {
          flex: 0 0 64%;
          padding: 17px 21px;
          box-sizing: border-box;
          border-right: 1px solid #e9e9e9;

          ::v-deep {
            .el-checkbox__label {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

        .design1 {
          flex: 0 0 50%;
          padding: 17px 21px;
          box-sizing: border-box;
          border-right: 1px solid #e9e9e9;

          ::v-deep {
            .el-checkbox__label {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }
          }
        }

        .authData {
          flex: 0 0 25%;
          padding: 9px 20px;
          flex-wrap: wrap;
          box-sizing: border-box;

          & > div:nth-child(even) {
            width: calc(50%);
            float: left;
          }

          & > div:nth-child(odd) {
            width: 50%;
            float: left;
          }

          & > div:nth-child(2) ~ div {
            margin-top: 4px;
          }

          ::v-deep {
            .el-radio {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }

        .authData1 {
          flex: 0 0 25%;
          padding: 9px 20px;
          flex-wrap: wrap;
          box-sizing: border-box;
          border-right: 1px solid #e9e9e9;

          & > div:nth-child(even) {
            width: calc(50%);
            float: left;
          }

          & > div:nth-child(odd) {
            width: 50%;
            float: left;
          }

          & > div:nth-child(2) ~ div {
            margin-top: 4px;
          }

          ::v-deep {
            .el-radio {
              width: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
            }
          }
        }

        .inherit {
          flex: 0 0 15%;
          position: relative;

          & .inheritWrap {
            position: absolute;
            top: 50%;
            left: 50%;
            height: 30px;
            padding: 0 10px;
            line-height: 30px;
            transform: translate(-50%, -50%);
            border-radius: 4px;
            border: 1px solid #e9e9e9;

            ::v-deep {
              .el-checkbox__label {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
              }

              .is-checked .el-checkbox__inner {
                background: #fab71c;
                border-color: #fab71c;
              }

              .el-checkbox__input.is-disabled.is-checked
              .el-checkbox__inner::after {
                border-color: #ffffff;
              }
            }
          }
        }
      }
    }
  }
}
</style>
