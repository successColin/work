<template>
  <apiot-dialog
    class="ToMenuConfig"
    v-on="$listeners"
    v-bind="$attrs"
    title="跳转面板配置"
    :isShowSure="false"
    cancelBtnName="确认"
  >
    <apiot-button class="ToMenuConfig__addMenuBtn" @click="showMenu = true">
      <i class="iconfont icon-xinzeng m-r-4"></i>添加跳转面板
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
          <span class="menuName m-l-10">{{ item.name }}</span>
          <span class="shanchu" @click.stop="deleteMenu(index)">
            <i class="iconfont icon-shanchu"></i>删除
          </span>
        </template>
        <div class="ToMenuConfig__content">
          <div class="ToMenuConfig__content--term">
            <h1 class="ToMenuConfig__content--termHead">跳转条件</h1>
            <select-formula
              :configData="configData"
              class="ToMenuConfig__content--termFormula"
              :triggerCompMap="triggerCompMap"
              v-model="item.jumpTerm"
              v-bind="$attrs"
            ></select-formula>
          </div>
          <el-form label-position="top" label-width="80px" class="m-t-10">
            <div class="form--line">
              <el-form-item
                label="弹窗样式"
                class="form--child"
                prop="tableName"
              >
                <el-select
                  class="panelStyle"
                  v-model="item.dialogName"
                  placeholder="请选择弹窗样式"
                >
                  <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in dialogNameArr"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="弹窗标题" class="form--child">
                <apiot-input
                  v-model="item.name"
                  placeholder="请输入弹窗标题"
                ></apiot-input>
              </el-form-item>
            </div>
          </el-form>
          <div>
            <apiot-button
              class="dataTransferBtn"
              @click="addDataTransfer(item)"
              v-if="Object.keys(allArea(item)).length"
            >
              <i class="iconfont icon-xinzeng m-r-4"></i>添加数据传递
            </apiot-button>
            <ul class="dataTransfer" v-if="Object.keys(allArea(item)).length">
              <li
                class="dataTransfer__item m-t-8"
                v-for="(it, i) in item.panelData"
                :key="i"
              >
                <h1>数据传递{{ i + 1 }}</h1>
                <i
                  class="iconfont icon-guanbi"
                  @click="deletePane(i, item)"
                ></i>
                <div class="dataTransfer__item--content">
                  <select-comp
                    class="dataTransfer__item--comp1"
                    :placeholder="`请选择${item.name}面板的控件`"
                    :configData="menuConfig[item.id]"
                    :curTriggerComp="it.paneComp"
                    :triggerCompMap="getPaneCompMap(item)"
                  ></select-comp>
                  <apiot-input
                    class="dataTransfer__item--comp3"
                    value="="
                    :disabled="true"
                  ></apiot-input>
                  <el-select
                    v-model="it.mainComp.type"
                    class="dataTransfer__item--comp5"
                  >
                    <el-option :value="1" label="组件">组件</el-option>
                    <el-option :value="2" label="固定值">固定值</el-option>
                    <el-option :value="3" label="公式">公式</el-option>
                  </el-select>
                  <select-comp
                    v-if="it.mainComp.type === 1"
                    class="dataTransfer__item--comp2"
                    placeholder="请选择当前面板的控件"
                    :configData="configData"
                    :curTriggerComp="it.mainComp"
                    :triggerCompMap="triggerCompMap"
                  ></select-comp>
                  <apiot-input
                    class="dataTransfer__item--comp2"
                    v-if="it.mainComp.type === 2"
                    v-model="it.mainComp.fixedValue"
                    placeholder="请输入固定值"
                  ></apiot-input>
                  <select-formula
                    v-if="it.mainComp.type === 3"
                    :configData="configData"
                    class="dataTransfer__item--comp2"
                    :triggerCompMap="triggerCompMap"
                    v-model="it.mainComp.fixedValue"
                  ></select-formula>
                </div>
              </li>
            </ul>
          </div>
          <div class="ToMenuConfig__btnArea m-t-10">
            <el-dropdown
              class="ToMenuConfig__btnArea--btn m-r-10"
              @command="handleCommand"
            >
              <apiot-button
                :class="[{ isDisabled: !Object.keys(canAddArea(item)).length }]"
                :disabled="!Object.keys(canAddArea(item)).length"
              >
                <i class="iconfont icon-xinzeng m-r-4"></i>
                添加面板区域
              </apiot-button>
              <el-dropdown-menu slot="dropdown" class="action__type">
                <el-dropdown-item
                  :command="{ area: value, item }"
                  v-for="(value, key) in canAddArea(item)"
                  :key="key"
                  >{{ value.name
                  }}{{
                    value.tableInfo ? `(${value.tableInfo.tableName})` : ''
                  }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
            <p class="ToMenuConfig__btnArea--tip">
              <i class="el-icon-info"></i>
              打开面板中要筛选条件的区域！
            </p>
          </div>
          <ul class="ToMenuConfig__ul">
            <li
              class="ToMenuConfig__li"
              v-for="(filter, i) in item.panelFilter"
              :key="i"
            >
              <h1 class="ToMenuConfig__li--head">
                <span class="ToMenuConfig__li--title">
                  {{ filter.name }}({{ filter.tableInfo.tableName }})
                </span>
                <el-select
                  class="ToMenuConfig__li--select"
                  v-model="filter.filterTermType"
                >
                  <el-option label="普通设置筛选" :value="1"></el-option>
                  <el-option label="填写sql筛选" :value="2"></el-option>
                </el-select>
                <span
                  class="ToMenuConfig__li--delete"
                  @click="deleteArea(item, index)"
                  ><i class="iconfont icon-shanchu"></i>删除</span
                >
              </h1>
              <TermComp
                class="ToMenuConfig__li--term"
                :getCurrentTab="filter"
                :configData="configData"
                :triggerCompMap="triggerCompMap"
                :showContent="activeName === index"
                v-bind="$attrs"
              ></TermComp>
            </li>
          </ul>
        </div>
      </el-collapse-item>
    </el-collapse>
    <MenuSelect
      :visible.sync="showMenu"
      :showMenu="showMenu"
      @addMenu="addMenu"
    ></MenuSelect>
  </apiot-dialog>
</template>

<script>
import { createUnique } from '@/utils/utils';
import { getDesignMenu } from '@/api/menuConfig';
import { formulaData } from '@/config';
import MenuSelect from './MenuSelect';
import SelectComp from '../../GlobalConfig/components/AddAction/components/SelectComp';
import SelectFormula from '../../GlobalConfig/components/AddAction/components/SelectFormula';
import TermComp from '../FilterPane/TermComp';

export default {
  name: '',
  props: {
    activeObj: {
      type: [Object, Array]
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    sourceType: {
      type: Number,
      default: null
    },
    panelCompId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showMenu: false,
      menuConfig: {},
      menuList: [], // 菜单列表
      activeName: '',
      formulaData,
      // 弹窗类型数组
      dialogNameArr: [
        { value: 'PanelDialog', label: '弹出式' },
        { value: 'PanelDrawer', label: '抽屉式' },
        { value: 'PanelFull', label: '全屏式' }
      ]
    };
  },
  components: {
    MenuSelect,
    SelectComp,
    SelectFormula,
    TermComp
  },
  computed: {
    canAddArea() {
      return (item) => {
        const obj = {};
        const keys = Object.keys(this.allArea(item));
        keys.forEach((key) => {
          const area = this.allArea(item)[key];
          // 设备位子表
          if (area.compName === 'DevicePosTree') {
            ['sys_device', 'sys_position'].forEach((tableName) => {
              const res = item.panelFilter.findIndex((panle) => {
                if (panle.tableInfo.tableName === tableName && panle.compId === key) {
                  return true;
                }
                return false;
              });
              if (res === -1) {
                obj[`${key}-${tableName}`] = {
                  name: area.name,
                  compId: area.compId,
                  tableInfo: {
                    tableName
                  }
                };
              }
            });
          } else if (area.compName === 'MultiTree') {
            area.multiDataSource.forEach((data) => {
              const { tableName } = data.tableInfo;
              const res = item.panelFilter.findIndex((panle) => {
                if (panle.tableInfo.tableName === tableName && panle.compId === key) {
                  return true;
                }
                return false;
              });
              if (res === -1) {
                obj[`${key}-${tableName}`] = {
                  name: '多表树区',
                  compId: area.compId,
                  tableInfo: {
                    tableName,
                    nameAlias: data.tableInfo.nameAlias
                  }
                };
              }
            });
          } else if (area.tableInfo && area.tableInfo.tableName) {
            const index = item.panelFilter.findIndex((panle) => {
              if (panle.compId === key) {
                return true;
              }
              return false;
            });
            if (index === -1) obj[`${key}-${area.tableInfo.tableName}`] = area;
          } else {
            const index = item.panelFilter.findIndex((panle) => {
              if (panle.compId === key) {
                return true;
              }
              return false;
            });
            if (index === -1) obj[key] = area;
          }
        });
        return obj;
      };
    },
    // 获取面板所有单位
    getAreaAndComp() {
      return (id) => {
        const obj = {
          tab: {},
          area: {},
          comp: {}
        };
        if (this.menuConfig[id]) {
          if (this.menuConfig[id][0] && this.menuConfig[id][0].children.length) {
            const compPath = `${this.menuConfig[id][0].name}`;
            this.menuConfig[id][0].children.forEach((bigArea) => {
              const bigPath = `${compPath}/${bigArea.name}`;
              if (bigArea.children.length) {
                bigArea.children.forEach((tab) => {
                  obj.tab[tab.compId] = JSON.parse(JSON.stringify(tab));
                  obj.tab[tab.compId].compType = 'TAB';
                  const tabPath = `${bigPath}/${tab.compId}`;
                  if (tab.children.length) {
                    tab.children.forEach((area) => {
                      if (area.compName === 'BtnsArea') {
                        const areaPath = `${tabPath}/${area.name}`;
                        if (area.children.length) {
                          area.children.forEach((comp) => {
                            obj.comp[comp.compId] = JSON.parse(JSON.stringify(comp));
                            obj.comp[comp.compId].compPath = areaPath;
                          });
                        }
                      } else {
                        obj.area[area.compId] = JSON.parse(JSON.stringify(area));
                        obj.area[area.compId].compType = 'AREA';
                        const areaPath = `${tabPath}/${area.name}`;
                        if (area.children.length) {
                          area.children.forEach((smallArea) => {
                            if (smallArea.children) {
                              smallArea.children.forEach((comp) => {
                                obj.comp[comp.compId] = JSON.parse(JSON.stringify(comp));
                                obj.comp[comp.compId].compPath = areaPath;
                              });
                            }
                          });
                        }
                      }
                    });
                  }
                });
              }
            });
          }
        }
        return obj;
      };
    },
    // 面板上所有区域
    allArea() {
      return (item) => this.getAreaAndComp(item.id).area;
    },
    // 获取转换数据
    getPaneCompMap() {
      return (item) => {
        const curInfo = {};
        const tempObj = this.getAreaAndComp(item.id);
        console.log(tempObj);
        const keys = Object.keys(tempObj);

        keys.forEach((key) => {
          const keyArr = Object.keys(tempObj[key]);
          keyArr.forEach((v) => {
            curInfo[v] = {};
            curInfo[v].compName = tempObj[key][v].name;
            curInfo[v].compType = tempObj[key][v].compType;
            curInfo[v].compPath = tempObj[key][v].compPath;
          });
        });
        console.log(curInfo);
        return curInfo;
      };
    }
  },
  created() {
    if (!this.sourceType && this.configData[0].paneObj && this.panelCompId) {
      const arr = this.panelCompId ? this.panelCompId.split(',') : [];
      this.menuList = [];
      arr.forEach((panelId) => {
        console.log(this.configData[0].paneObj, this.configData[0].paneObj[panelId]);
        if (this.configData[0].paneObj[panelId]) {
          this.menuList.push(this.configData[0].paneObj[panelId]);
        }
      });
    }
    console.log(this.panelCompId, this.menuList);
    if (this.sourceType === 1) {
      this.menuList = this.activeObj;
    }
    this.menuList.forEach((menu) => this.getPaneConfig(menu));
  },
  methods: {
    // 获取面板数据
    async getPaneConfig(menu) {
      if (menu.id && !this.menuConfig[menu.id]) {
        const data = await getDesignMenu({ panelId: menu.id });
        this.menuConfig[menu.id] = data[0].designOverallLayout;
      }
    },
    // 新增菜单
    async addMenu(v) {
      const index = this.menuList.findIndex((item) => item.id === v.id);
      if (index !== -1) {
        return this.$message({
          type: 'warning',
          message: '不可重复添加菜单'
        });
      }
      const unique = createUnique();
      const obj = {
        unique,
        id: v.id, // 菜单id
        name: v.panelName, // 菜单名称
        dialogName: 'PanelDialog', // 弹出风格
        sysMenuDesignId: v.sysMenuDesignId,
        relationMenuDesignId: v.relationMenuDesignId,
        panelClassify: v.panelClassify,
        panelType: v.panelType,
        jumpTerm: '', // 跳转条件
        panelData: [],
        panelFilter: [] // 菜单过滤条件
      };
      this.menuList.push(obj);
      if (!this.sourceType) {
        if (!this.configData[0].paneObj) {
          this.$set(this.configData[0], 'paneObj', {});
        }

        const arr = this.panelCompId ? this.panelCompId.split(',') : [];
        arr.push(unique);
        this.$emit('update:panelCompId', arr.join(','));
        this.configData[0].paneObj[unique] = obj;
      }
      await this.getPaneConfig(v);
      this.activeName = this.menuList.length - 1;
    },
    // 新增数据传递
    addDataTransfer(item) {
      item.panelData.push({
        paneComp: {
          compId: '',
          name: '',
          compPath: ''
        },
        mainComp: {
          type: 1,
          compId: '',
          name: '',
          compPath: '',
          fixedValue: ''
        }
      });
    },
    // 删除数据传递
    deletePane(index, item) {
      item.panelData.splice(index, 1);
    },
    // 新增区域
    handleCommand({ area, item }) {
      // console.log(area);
      item.panelFilter.push({
        compId: area.compId,
        name: area.name,
        filterTermType: 1,
        tableInfo: area.tableInfo,
        filterTermStr: '',
        filterTermSql: '',
        termParams: ''
      });
    },
    // 删除区域
    deleteArea(item, index) {
      item.panelFilter.splice(index, 1);
    },
    // 删除菜单
    deleteMenu(index) {
      delete this.configData[0].paneObj[this.menuList[index].unique];
      const arr = this.panelCompId.split(',');
      console.log(arr);
      arr.splice(index, 1);
      this.$emit('update:panelCompId', arr.join(','));
      this.menuList.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.ToMenuConfig {
  ::v-deep {
    @media (min-height: 640px) {
      & > .el-dialog {
        height: 640px;
      }
    }
    @media (max-height: 640px) {
      & > .el-dialog {
        position: absolute;
        top: 20px;
        bottom: 20px;
      }
    }
    & > .el-dialog {
      width: 960px;
      & > .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px - 10px);
        overflow-y: auto;
      }
    }
  }
  &__addMenuBtn {
    width: min-content;
    margin-bottom: 10px;
    i {
      color: $--color-primary;
    }
  }
  &__collapse {
    border: 0 none;
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
          right: 64px;
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
      .el-form {
        .form--line {
          display: flex;
          align-items: center;
          .form--child {
            flex: 1;
            .el-form-item__content {
              display: flex;
              align-items: center;
              .panelInput {
                width: 305px;
                &.isSelPanel {
                  width: 100%;
                }
              }
              .panelStyle {
                width: calc(100% - 10px);
              }
            }
          }
        }
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
  }
  &__content {
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    border-top-color: #fff;
    border-radius: 0 0 4px 4px;
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
  .dataTransferBtn {
    margin-top: 10px;
    width: min-content;
    i {
      color: $--color-primary;
      margin-right: 4px;
    }
  }
  .dataTransfer {
    &__item {
      position: relative;
      height: 78px;
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      padding: 0 10px;
      overflow: hidden;
      &--content {
        display: flex;
      }
      &--comp1,
      &--comp2 {
        flex: 1;
      }
      &--comp4 {
        flex: 1;
      }
      &--comp3 {
        width: 80px;
        margin-left: 10px;
        margin-right: 10px;
      }
      &--comp5 {
        width: 100px;
        margin-right: 10px;
      }
      h1 {
        height: 36px;
        line-height: 36px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .icon-guanbi {
        position: absolute;
        right: 11px;
        top: 11px;
        font-size: 13px;
        color: #bbc3cd;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
    }
  }
  &__btnArea {
    display: flex;
    margin-bottom: 10px;
    &--btn {
      width: 124px;
      i {
        color: $--color-primary;
      }
      .isDisabled {
        i {
          color: #c0c4cc;
        }
      }
    }
    &--tip {
      margin-left: 10px;
      height: 30px;
      line-height: 30px;
      background: #f1f3f6;
      border-radius: 4px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      flex: 1;
      i {
        font-size: 16px;
        color: #bbc3cd;
        margin-left: 15px;
        margin-right: 10px;
      }
    }
  }
  &__li {
    &--head {
      box-sizing: border-box;
      padding: 0 10px;
      height: 42px;
      line-height: 42px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
    }
    &--title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    &--select {
      margin-left: auto;
      width: 200px;
    }
    &--delete {
      margin-left: 12px;
      line-height: 1;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      i {
        color: $--color-primary;
        margin-right: 4px;
      }
    }
    &--term {
      ::v-deep {
        .sqlTerm {
          height: 472px;
        }
      }
    }
  }
}
</style>
