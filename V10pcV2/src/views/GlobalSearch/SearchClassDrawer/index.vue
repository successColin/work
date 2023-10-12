<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :loading.sync="showLoading"
    destroy-on-close
    @sure-click="sureClick"
    title="新增"
  >
    <el-form
      label-position="top"
      label-width="80px"
      :model="curData"
      :rules="rules"
      ref="curData"
      class="form"
    >
      <div class="form--line">
        <el-form-item
          prop="tableName"
          class="form--child"
          :label="$t('entity.searchTable.entityTable')"
        >
          <apiot-input v-show="false" v-model="curData.tableName"></apiot-input>
          <filterable-input
            :placeholder="
              $t('placeholder.pleaseSelect', {
                any: $t('entity.searchTable.entityTable'),
              })
            "
            :disabled="!!filedArr.length"
            :title="$t('entity.searchTable.entityTable')"
            :dialogType="1"
            :showInfo="curData"
            @selectRes="selectTable"
          ></filterable-input>
        </el-form-item>
        <el-form-item
          prop="name"
          :label="$t('entity.searchTable.name')"
          class="form--child"
        >
          <apiot-input
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                name: $t('entity.entity'),
              })
            "
            v-model="curData.name"
            maxlength="20"
          ></apiot-input>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item label="应用于设备" class="form--child">
          <el-checkbox
            v-model="curData.searchApplyPc"
            :true-label="1"
            :false-label="2"
            >应用于pc</el-checkbox
          >
          <el-checkbox
            v-model="curData.searchApplyApp"
            :true-label="1"
            :false-label="2"
            >应用于app</el-checkbox
          >
        </el-form-item>
      </div>
      <apiot-button
        @click="addFiled"
        :disabled="!curData.tableName"
        class="addBtn"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>添加字段
      </apiot-button>
      <div class="filed__list m-b-10" :class="[{ noData: !filedArr.length }]">
        <div class="filed__head filed__item">
          <span class="filed__item--move"></span>
          <span class="filed__item--filed borderRight">字段</span>
          <span class="filed__item--memo borderRight">备注</span>
          <span class="filed__item--isShow borderRight">是否显示</span>
          <span class="filed__item--isDict borderRight">是否字典</span>
          <span class="filed__item--dict borderRight">字典</span>
          <span class="filed__item--delete"></span>
        </div>
        <div class="filed__body" v-if="filedArr.length">
          <draggable
            v-model="filedArr"
            group="filed"
            animation="300"
            handle=".icon-zongxiangtuodong"
          >
            <div
              class="filed__item"
              v-for="(item, index) in filedArr"
              :key="item.id"
            >
              <span class="filed__item--move">
                <i class="iconfont icon-zongxiangtuodong"></i>
              </span>
              <span class="filed__item--filed">{{ item.filedName }}</span>
              <span class="filed__item--memo">{{ item.filedMemo }}</span>
              <span class="filed__item--isShow">
                <apiot-switch
                  :disabled="getCurshowCount > 4 && item.isShow === 2"
                  v-model="item.isShow"
                  :activeValue="1"
                  :inactivevalue="2"
                ></apiot-switch>
              </span>
              <span class="filed__item--isDict">
                <apiot-switch
                  v-if="+item.filedType === 1"
                  v-model="item.isDict"
                  :activeValue="1"
                  :inactivevalue="2"
                ></apiot-switch>
                <span v-else>-</span>
              </span>
              <span class="filed__item--dict">
                <filterable-input
                  v-if="item.isDict === 1"
                  ref="filterableInput"
                  placeholder="请选择字典"
                  :showInfo="item.dictObj"
                  :hasPagination="true"
                  :dialogType="3"
                  @selectRes="selectDict($event, item)"
                ></filterable-input>
                <span v-else>-</span>
              </span>
              <span
                class="filed__item--delete"
                @click="deleteFiled(index)"
                v-if="!getUsedFiledArr.includes(item.filedName)"
              >
                <i class="iconfont icon-shanchu"></i>
              </span>
              <span
                class="filed__item--delete"
                v-if="getUsedFiledArr.includes(item.filedName)"
              >
              </span>
            </div>
          </draggable>
        </div>
        <div v-else class="apiotNoData"></div>
      </div>
      <div class="ToMenuConfig__content--term" style="width: 100%">
        <h1 class="ToMenuConfig__content--termHead">搜索过滤条件</h1>
        <select-formula
          class="ToMenuConfig__content--termFormula"
          v-model="searchTerm"
          v-if="showTerm"
          :isSql="true"
        ></select-formula>
      </div>
      <el-tabs
        v-model="activeTabName"
        @tab-click="handleClick"
        class="filed__menu"
      >
        <el-tab-pane name="1" label="PC端跳转" :key="`${curData.id}1`">
          <apiot-button
            @click="showMenu = true"
            :disabled="!curData.tableName"
            class="addBtn addMenu"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>添加跳转菜单
          </apiot-button>
          <el-collapse
            class="ToMenuConfig__collapse"
            v-model="activeName"
            accordion
            v-if="menuList.length"
          >
            <el-collapse-item
              :index="index + 1"
              v-for="(item, index) in menuList"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <img
                  :src="$parseImgUrl(item.icon.imageUrl)"
                  v-if="item.icon.imageUrl"
                  class="full"
                />
                <i
                  :class="`full iconfont ${item.icon.icon}`"
                  :style="`color:${item.icon.color}`"
                  v-else
                ></i>
                <span class="menuName">{{ item.name }}</span>
                <span class="shanchu" @click.stop="deleteMenu(index)">
                  <i class="iconfont icon-shanchu"></i>删除
                </span>
              </template>
              <div class="ToMenuConfig__content">
                <div class="ToMenuConfig__content--term">
                  <h1 class="ToMenuConfig__content--termHead">跳转条件</h1>
                  <select-formula
                    class="ToMenuConfig__content--termFormula"
                    v-model="item.jumpTerm"
                    v-bind="$attrs"
                    :variables="variables"
                  ></select-formula>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
        <el-tab-pane name="2" label="APP端跳转" :key="`${curData.id}2`">
          <apiot-button
            @click="showMenu = true"
            :disabled="!curData.tableName"
            class="addBtn addMenu"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>添加跳转菜单
          </apiot-button>
          <el-collapse
            class="ToMenuConfig__collapse"
            v-model="activeAppName"
            accordion
            v-if="menuAppList.length"
          >
            <el-collapse-item
              :index="index + 1"
              v-for="(item, index) in menuAppList"
              :key="index"
              :name="index"
            >
              <template slot="title">
                <img
                  :src="$parseImgUrl(item.icon.imageUrl)"
                  v-if="item.icon.imageUrl"
                  class="full"
                />
                <i
                  :class="`full iconfont ${item.icon.icon}`"
                  :style="`color:${item.icon.color}`"
                  v-else
                ></i>
                <span class="menuName">{{ item.name }}</span>
                <span class="shanchu" @click.stop="deleteMenu(index)">
                  <i class="iconfont icon-shanchu"></i>删除
                </span>
              </template>
              <div class="ToMenuConfig__content">
                <div class="ToMenuConfig__content--term">
                  <h1 class="ToMenuConfig__content--termHead">跳转条件</h1>
                  <select-formula
                    class="ToMenuConfig__content--termFormula"
                    v-model="item.jumpTerm"
                    v-bind="$attrs"
                    :variables="variables"
                  ></select-formula>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-tab-pane>
      </el-tabs>
      <SelDialog
        :visible.sync="showFiled"
        :showFiled="showFiled"
        v-if="curData.tableName"
        :tableName="curData.tableName"
        :getFiledArr="getFiledArr"
        @fieldSel="fieldSel"
      ></SelDialog>
      <MenuSelect
        :visible.sync="showMenu"
        v-if="showMenu"
        :showMenu="showMenu"
        :isApp="1"
        @addMenu="addMenu"
        :clientType="+activeTabName"
      ></MenuSelect>
    </el-form>
  </apiot-drawer>
</template>

<script>
import MenuSelect from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig/MenuSelect';
import selectFormula from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/SelectFormula';
import { getDesignMenu } from '@/api/menuConfig';
import { saveSearch } from '@/api/globalSearch';
import SelDialog from '../SelDialog';

export default {
  name: '',
  props: {
    drawerType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (['全部', '菜单'].includes(value)) {
        callback(new Error('名称不能为“全部”或者“菜单”'));
      } else {
        callback();
      }
    };
    return {
      curData: {
        tableName: '',
        name: '',
        searchApplyPc: 1,
        searchApplyApp: 1,
        id: '',
      },
      showLoading: false,
      rules: {
        tableName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('entity.searchTable.entityTable'),
            }),
            trigger: 'change',
          },
        ],
        name: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAnyName', {
              name: this.$t('entity.entity'),
            }),
            trigger: 'change',
          },
          { validator: checkName, trigger: 'blur' },
        ],
      },
      filedArr: [], // 字段数组
      showFiled: false, // 是否展示字段
      showMenu: false, // 是否展示菜单
      menuList: [], // 跳转菜单数组
      menuAppList: [], // 跳转app菜单数组
      activeName: 0, // 当前激活的菜单
      activeAppName: 0, // 当前app激活的菜单
      activeTabName: '1',
      searchTerm: '', // 搜索过滤条件
      showTerm: false,
    };
  },
  computed: {
    getFiledArr() {
      const arr = [];
      this.filedArr.forEach((item) => {
        arr.push(item.filedName);
      });
      return arr;
    },
    getCurshowCount() {
      let count = 0;
      this.filedArr.forEach((item) => {
        if (item.isShow === 1) {
          count += 1;
        }
      });
      return count;
    },
    variables() {
      const arr = [];
      this.filedArr.forEach((item) => {
        arr.push({
          variableCode: item.filedName,
          variableName: item.filedName,
        });
      });
      return arr;
    },
    getUsedFiledArr() {
      const usedField = [];
      if (this.getFiledArr.length) {
        this.menuList.forEach((item) => {
          if (item.jumpTerm) {
            item.jumpTerm.replace(
              /\$variable_+([a-zA-Z0-9_]+)\$/g,
              (...arr) => {
                usedField.push(arr[1]);
              },
            );
          }
        });
        this.menuAppList.forEach((item) => {
          if (item.jumpTerm) {
            item.jumpTerm.replace(
              /\$variable_+([a-zA-Z0-9_]+)\$/g,
              (...arr) => {
                usedField.push(arr[1]);
              },
            );
          }
        });
      }
      return usedField;
    },
  },
  components: {
    MenuSelect,
    SelDialog,
    selectFormula,
  },
  methods: {
    // Tab点击
    handleClick() {},
    // 设置值
    setValue(data) {
      if (this.drawerType === 1) {
        this.curData.tableName = '';
        this.curData.name = '';
        this.curData.searchApplyPc = 1;
        this.curData.searchApplyApp = 1;
        this.filedArr = [];
        this.menuList = [];
        this.menuAppList = [];
        this.searchTerm = '';
        this.$nextTick(() => {
          this.$refs.curData.clearValidate();
        });
      } else if (this.drawerType === 2) {
        this.curData.tableName = data.tableName;
        this.curData.name = data.searchName;
        this.curData.searchApplyPc = data.searchApplyPc;
        this.curData.searchApplyApp = data.searchApplyApp;
        this.curData.id = data.id;
        this.filedArr = data.config.filedArr;
        this.menuList = data.config.menuList;
        this.menuAppList = data.config.menuAppList || [];
        this.searchTerm = data.config.searchTerm || '';
      }
      this.showTerm = false;
      this.$nextTick(() => {
        this.showTerm = true;
      });
    },
    // 确认按钮
    async sureClick() {
      try {
        const res = await this.$refs.curData.validate();
        console.log(res);
        if (res) {
          if (!this.filedArr.length) {
            return this.$message.warning('请新增搜索字段');
          }
          if (this.curData.searchApplyPc === 1) {
            if (!this.menuList.length) {
              return this.$message.warning('请新增pc跳转菜单');
            }
          }
          if (this.curData.searchApplyApp === 1) {
            if (!this.menuAppList.length) {
              return this.$message.warning('请新增app跳转菜单');
            }
          }
          if (
            this.curData.searchApplyPc === 2 &&
            this.curData.searchApplyApp === 2
          ) {
            return this.$message.warning('pc跟app至少启用一个');
          }
          const config = {
            filedArr: this.filedArr,
            menuList: this.menuList,
            menuAppList: this.menuAppList,
            searchTerm: this.searchTerm,
          };
          const params = {
            tableName: this.curData.tableName,
            searchName: this.curData.name,
            searchColumns: this.getFiledArr.join(','),
            searchApplyPc: this.curData.searchApplyPc,
            searchApplyApp: this.curData.searchApplyApp,
            config: JSON.stringify(config),
          };
          if (this.drawerType === 2) {
            params.id = this.curData.id;
          }
          await saveSearch(params);
          this.$message.success('新增实体类成功');
          this.$emit('update:visible', false);
          this.$emit('addSuccess');
        }
      } catch (error) {
        // console.log(error);
        if (error.searchName) {
          this.$message.warning(`名称${error.searchName}`);
        }
      } finally {
        this.showLoading = false;
      }
    },
    // 选择表
    selectTable(table) {
      this.curData.tableName = table.tableName;
    },
    // 添加字段
    addFiled() {
      this.showFiled = true;
    },
    fieldSel(v) {
      const obj = {
        id: v.id,
        filedName: v.columnName,
        filedType: v.columnTypeDict,
        filedMemo: v.memo,
        isShow: 1,
        isDict: 2,
        dictObj: {
          dictKey: '',
          dictName: '',
        },
      };
      if (this.getCurshowCount > 4) {
        obj.isShow = 2;
      }
      this.filedArr.push(obj);
    },
    // 删除字段
    deleteFiled(index) {
      this.filedArr.splice(index, 1);
    },
    // 字典选择结果
    async selectDict(dict, data) {
      console.log(dict);
      if (data.dictObj && dict.dictKey === data.dictObj.dictKey) {
        return;
      }
      data.dictObj.dictKey = dict.dictKey;
      data.dictObj.dictName = dict.dictName;
    },
    // 新增菜单
    async addMenu(v) {
      const arr = this.activeTabName === '1' ? this.menuList : this.menuAppList;
      const index = arr.findIndex((item) => item.id === v.id);
      if (index !== -1) {
        return this.$message({
          type: 'warning',
          message: '不可重复添加菜单',
        });
      }
      const obj = {
        id: v.id, // 菜单id
        name: v.menuName, // 菜单名称
        icon: v.icon, // 菜单图标
        jumpTerm: '', // 跳转条件
        menuFilter: [], // 菜单过滤条件
      };
      arr.push(obj);
      if (this.activeTabName === '1') {
        this.activeName = arr.length - 1;
      } else {
        this.activeAppName = arr.length - 1;
      }

      try {
        const design = await getDesignMenu({ sysMenuId: v.id });
        // console.log(design);
        let area = null;
        const areaArr =
          design[0].designOverallLayout[0].children[0].children[0];
        if (areaArr.children[0].tableInfo) {
          [area] = areaArr.children;
        } else {
          [, area] = areaArr.children;
        }
        obj.menuFilter.push({
          compId: area.compId,
          filterTermSql: '',
          filterTermStr: '',
          filterTermType: 2,
          name: area.name,
          tableInfo: area.tableInfo,
          termParams: '',
        });
      } catch (error) {
        console.log('该菜单无区域');
      }
    },
    // 删除菜单
    deleteMenu(index) {
      if (this.activeTabName === '1') {
        this.menuList.splice(index, 1);
      } else {
        this.menuAppList.splice(index, 1);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.form {
  .addBtn:not(:disabled) {
    .icon-xinzeng {
      color: $--color-primary;
    }
  }
  .addMenu {
    margin-top: 10px;
  }
  .filed {
    &__list {
      margin-top: 10px;
      width: 100%;
      &.noData {
        height: 200px;
      }
      .apiotNoData {
        height: calc(100% - 40px);
      }
    }
    &__item {
      height: 40px;
      line-height: 40px;
      display: flex;
      width: 100%;
      align-items: center;
      &--move {
        text-align: center;
        width: 40px;
        cursor: move;
      }
      .borderRight {
        border-right: 1px solid #e9e9e9;
      }
      &--filed {
        box-sizing: border-box;
        padding-left: 10px;
        width: 200px;
      }
      &--memo {
        box-sizing: border-box;
        padding-left: 10px;
        width: 160px;
      }
      &--isShow {
        box-sizing: border-box;
        padding-left: 10px;
        width: 120px;
      }
      &--isDict {
        box-sizing: border-box;
        padding-left: 10px;
        width: 120px;
      }
      &--dict {
        box-sizing: border-box;
        padding-left: 10px;
        flex: 1;
        line-height: 32px;
      }
      &--delete {
        text-align: center;
        width: 50px;
        cursor: pointer;
      }
      &--move,
      &--delete {
        &:hover {
          .iconfont {
            color: $--color-primary;
          }
        }
      }
    }
    &__head {
      background: #f6f7fb;
      box-shadow: 0px 1px 0px 0px #e9e9e9, 0px -1px 0px 0px #e9e9e9;
      font-size: 13px;
      color: #808080;
      .filed__item--ruleContent {
        border-right: 1px solid #e9e9e9;
      }
    }
    &__body {
      position: relative;
      height: min-content;
      width: 100%;
      font-size: 13px;
      color: #333;
      .filed__item {
        border-bottom: 1px solid #e9e9e9;
        &:hover {
          background-color: #f1f7ff;
        }
        &--index,
        &--move {
          border-right: 1px solid #e9e9e9;
        }
        .icon-shanchu {
          color: #bbc3cd;
          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
    &__menu {
      width: 100%;
      ::v-deep {
        .el-tabs {
          height: 100%;
        }

        .el-tabs__header {
          margin-bottom: 0;
        }

        .el-tabs__nav-wrap::after {
          height: 1px;
          background-color: #e9e9e9;
        }
        .el-tabs__content {
          .el-tab-pane {
            height: min-content;
          }
        }
      }
    }
  }
  .ToMenuConfig {
    &__collapse {
      margin-top: 10px;
      border: 0 none;
      width: 100%;
      ::v-deep {
        .el-collapse-item {
          margin-bottom: 10px;
        }
        .el-collapse-item__header {
          position: relative;
          background: #f1f7ff;
          border-radius: 4px;
          border: 1px solid #e9e9e9;
          height: 38px;
          line-height: 38px;
          &.is-active {
            border-radius: 4px 4px 0 0;
          }
          .full {
            width: 24px;
            height: 24px;
            font-size: 24px;
            margin-right: 10px;
            margin-left: 10px;
            line-height: 24px;
          }
          .menuName {
            font-weight: 600;
            font-size: 13px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #333333;
          }
          .shanchu {
            position: absolute;
            right: 32px;
            display: flex;
            align-items: center;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            i {
              color: $--color-primary;
              margin-right: 2px;
            }
          }
          .el-collapse-item__arrow {
            color: #bbc3cd;
            &:hover {
              color: $--color-primary;
            }
          }
        }
        .el-collapse-item__content {
          padding-bottom: 0;
        }
        .el-collapse-item__wrap {
          border-bottom: 0px none;
        }
      }
    }
    &__content {
      padding: 0 10px;
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      border-top-color: #fff;
      border-radius: 0 0 4px 4px;
      &--term {
        padding-bottom: 10px;
      }
      &--termHead {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        height: 30px;
        line-height: 30px;
        margin-top: 4px;
      }
    }
  }
}
</style>
