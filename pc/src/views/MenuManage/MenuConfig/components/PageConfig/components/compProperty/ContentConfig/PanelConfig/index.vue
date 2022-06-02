<template>
  <section>
    <apiot-dialog
      class="PanelConfig"
      v-on="$listeners"
      v-bind="$attrs"
      title="弹出面板配置"
      :isShowSure="false"
      cancelBtnName="确认"
    >
      <el-form label-position="top" label-width="80px">
        <div class="form--line">
          <el-form-item label="关联面板" class="form--child" prop="tableName">
            <filterable-input
              ref="filterableInput"
              class="panelInput m-r-10"
              :class="[{ isSelPanel: isSelPanel }]"
              placeholder="请选择面板"
              :hasPagination="true"
              :showInfo="curPaneObj"
              :dialogType="4"
              :isSelPanel="isSelPanel"
              @selectRes="selectPane"
            ></filterable-input>
            <el-select
              class="panelStyle"
              v-model="activeObj.dialogName"
              placeholder="请选择弹窗样式"
              v-if="!isSelPanel"
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
              v-model="activeObj.dialogTitle"
              placeholder="请输入弹窗标题"
            ></apiot-input>
          </el-form-item></div
      ></el-form>

      <apiot-button
        class="dataTransferBtn"
        @click="addDataTransfer"
        v-if="Object.keys(allArea).length"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>添加数据传递
      </apiot-button>
      <ul class="dataTransfer" v-if="Object.keys(allArea).length">
        <li
          class="dataTransfer__item m-t-8"
          v-for="(item, index) in curPaneObj.panelData"
          :key="index"
        >
          <h1>数据传递{{ index + 1 }}</h1>
          <i class="iconfont icon-guanbi" @click="deletePane(index)"></i>
          <div class="dataTransfer__item--content">
            <select-comp
              class="dataTransfer__item--comp1"
              :placeholder="`请选择${curPaneObj.panelName}面板的控件`"
              :configData="curPaneConfig"
              :curTriggerComp="item.paneComp"
              :triggerCompMap="getPaneCompMap"
            ></select-comp>
            <apiot-input
              class="dataTransfer__item--comp3"
              value="="
              :disabled="true"
            ></apiot-input>
            <select-comp
              class="dataTransfer__item--comp2"
              placeholder="请选择当前面板的控件"
              :configData="configData"
              :curTriggerComp="item.mainComp"
              :triggerCompMap="triggerCompMap"
            ></select-comp>
          </div>
        </li>
      </ul>
      <div class="PanelConfig__btnArea m-t-10" v-if="curPaneObj.id">
        <el-dropdown
          class="PanelConfig__btnArea--btn m-r-10"
          @command="handleCommand"
        >
          <apiot-button
            :class="[{ isDisabled: !Object.keys(canAddArea).length }]"
            :disabled="!Object.keys(canAddArea).length"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>
            添加面板区域
          </apiot-button>
          <el-dropdown-menu slot="dropdown" class="action__type">
            <el-dropdown-item
              :command="value"
              v-for="(value, key) in canAddArea"
              :key="key"
              >{{ value.name }}({{
                value.tableInfo.tableName
              }})</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <p class="PanelConfig__btnArea--tip">
          <i class="el-icon-info"></i>
          添加关联面板中要筛选条件的区域！
        </p>
      </div>
      <ul class="PanelConfig__ul" v-if="curPaneObj.id">
        <li
          class="PanelConfig__li"
          v-for="(item, index) in curPaneObj.panelFilter"
          :key="index"
        >
          <h1 class="PanelConfig__li--head">
            <span class="PanelConfig__li--title" v-if="item.tableInfo"
              >{{ item.name }}({{ item.tableInfo.tableName }})</span
            >
            <span class="PanelConfig__li--title" v-else>{{ item.name }}</span>
            <el-select
              class="PanelConfig__li--select"
              v-if="item.compName !== 'RelatedData'"
              v-model="item.filterTermType"
            >
              <el-option label="普通设置筛选" :value="1"></el-option>
              <el-option label="填写sql筛选" :value="2"></el-option>
            </el-select>
            <span
              class="PanelConfig__li--delete"
              @click="deleteArea(index)"
              :style="item.compName === 'RelatedData' ? 'margin-left:auto' : ''"
              ><i class="iconfont icon-shanchu"></i>删除</span
            >
          </h1>
          <div class="contentConfig" v-if="item.compName === 'RelatedData'">
            <div class="contentConfig__box">
              <h2>关联数据id</h2>
              <select-comp
                class="p-l-10 p-r-10"
                :placeholder="`请选择关联数据id控件`"
                :configData="configData"
                :curTriggerComp="item.relateDataComp"
                :triggerCompMap="triggerCompMap"
                :filterMethods="filterMethods"
                @compChange="compChange1(item)"
              ></select-comp>
            </div>
            <div class="contentConfig__box">
              <h2>关联业务id</h2>
              <select-comp
                class="p-l-10 p-r-10"
                :placeholder="`请选择关联数据id控件`"
                :configData="configData"
                :curTriggerComp="item.relateBusiComp"
                :triggerCompMap="triggerCompMap"
                :filterMethods="filterMethods"
                @compChange="compChange2(item)"
              ></select-comp>
            </div>
          </div>
          <TermComp
            v-else
            class="PanelConfig__li--term"
            :getCurrentTab="item"
            :configData="configData"
            :triggerCompMap="triggerCompMap"
            v-bind="$attrs"
          ></TermComp>
        </li>
      </ul>
    </apiot-dialog>
  </section>
</template>

<script>
import { getSysDesignMenu } from '@/api/menuConfig';
import TermComp from '../FilterPane/TermComp';
import SelectComp from '../../GlobalConfig/components/AddAction/components/SelectComp';

export default {
  props: {
    activeObj: {
      type: Object
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    // 是不是选择面板
    isSelPanel: {
      type: Boolean,
      default: false
    },
    // 所有组件平坦化
    getAllcheck: {
      type: Object
    }
  },
  computed: {
    canAddArea() {
      const obj = {};
      const keys = Object.keys(this.allArea);
      // keys.forEach((key) => {
      //   const index = this.curPaneObj.panelFilter.findIndex((panle) => {
      //     if (panle.compId === key) {
      //       return true;
      //     }
      //     return false;
      //   });
      //   if (index === -1) {
      //     obj[key] = this.allArea[key];
      //   }
      // });
      keys.forEach((key) => {
        const area = this.allArea[key];

        // 设备位子表
        if (area.compName === 'DevicePosTree') {
          ['sys_device', 'sys_position'].forEach((tableName) => {
            const res = this.curPaneObj.panelFilter.findIndex((panle) => {
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
        } else if (area.tableInfo && area.tableInfo.tableName) {
          const index = this.curPaneObj.panelFilter.findIndex((panle) => {
            if (panle.compId === key) {
              return true;
            }
            return false;
          });
          if (index === -1) obj[`${key}-${area.tableInfo.tableName}`] = area;
        }
      });
      console.log(obj);
      return obj;
    },
    // 获取面板所有单位
    getAreaAndComp() {
      const obj = {
        tab: {},
        area: {},
        comp: {}
      };
      if (this.curPaneConfig && this.curPaneConfig[0] && this.curPaneConfig[0].children.length) {
        const compPath = `${this.curPaneConfig[0].name}`;
        this.curPaneConfig[0].children.forEach((bigArea) => {
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
        return obj;
      }
      return obj;
    },
    // 面板上所有区域
    allArea() {
      return this.getAreaAndComp.area;
    },
    // 获取转换数据
    getPaneCompMap() {
      const curInfo = {};
      const keys = Object.keys(this.getAreaAndComp);

      keys.forEach((key) => {
        const keyArr = Object.keys(this.getAreaAndComp[key]);
        keyArr.forEach((v) => {
          curInfo[v] = {};
          curInfo[v].compName = this.getAreaAndComp[key][v].name;
          curInfo[v].compType = this.getAreaAndComp[key][v].compType;
          curInfo[v].compPath = this.getAreaAndComp[key][v].compPath;
        });
      });
      return curInfo;
    }
  },
  data() {
    return {
      curPaneObj: {
        id: '', // 面板id
        panelName: '', // 面板名称
        sysMenuDesignId: '', // 设计组id
        relationMenuDesignId: '', // 外层设计组id
        panelType: '', // 类型
        panelData: [], // 面板传递参数
        panelFilter: [] // 面板过滤条件
      },
      // 弹窗类型数组
      dialogNameArr: [
        { value: 'PanelDialog', label: '弹出式' },
        { value: 'PanelDrawer', label: '抽屉式' },
        { value: 'PanelFull', label: '全屏式' }
      ],
      curPaneConfig: []
    };
  },
  created() {
    if (this.configData[0].paneObj && this.configData[0].paneObj[this.activeObj.compId]) {
      this.curPaneObj = this.configData[0].paneObj[this.activeObj.compId];
      this.getPaneConfig();
    }
  },
  mounted() {},

  components: {
    TermComp,
    SelectComp
  },

  methods: {
    // 获取面板数据
    async getPaneConfig() {
      if (this.curPaneObj.sysMenuDesignId) {
        const data = await getSysDesignMenu({
          sysMenuDesignId: this.curPaneObj.sysMenuDesignId
        });
        this.curPaneConfig = data.designOverallLayout;
      }
    },
    // 新增区域
    handleCommand(area) {
      console.log(area);
      if (area.compName === 'RelatedData') {
        this.curPaneObj.panelFilter.push({
          compId: area.compId,
          compName: area.compName,
          name: area.name,
          filterTermType: 1,
          tableInfo: area.tableInfo,
          filterTermStr: '',
          filterTermSql: '',
          termParams: '',
          relateDataComp: {
            compId: '',
            compPath: '',
            compType: '',
            tableName: ''
          },
          relateBusiComp: {
            compId: '',
            compPath: '',
            compType: '',
            tableName: ''
          }
        });
      } else {
        this.curPaneObj.panelFilter.push({
          compId: area.compId,
          compName: area.compName,
          name: area.name,
          filterTermType: 1,
          tableInfo: area.tableInfo,
          filterTermStr: '',
          filterTermSql: '',
          termParams: ''
        });
      }
    },
    // 删除区域
    deleteArea(index) {
      this.curPaneObj.panelFilter.splice(index, 1);
    },
    // 选择面板
    async selectPane(pane) {
      if (!pane) {
        this.curPaneObj = {
          id: '', // 面板id
          compType: '',
          panelName: '', // 面板名称
          sysMenuDesignId: '', // 设计组id
          relationMenuDesignId: '', // 外层设计组id
          panelType: '', // 类型
          panelData: [], // 面板传递参数
          panelFilter: [] // 面板过滤条件
        };
        this.configData[0].paneObj[this.activeObj.compId] = this.curPaneObj;
        return;
      }
      if (this.curPaneObj.id !== pane.id) {
        this.curPaneObj.id = pane.id;
        this.curPaneObj.panelName = pane.panelName;
        this.curPaneObj.sysMenuDesignId = pane.sysMenuDesignId;
        this.curPaneObj.relationMenuDesignId = pane.relationMenuDesignId;
        this.curPaneObj.panelType = pane.panelType;
        this.curPaneObj.panelData = [];
        this.curPaneObj.panelFilter = [];
        this.configData[0].paneObj[this.activeObj.compId] = this.curPaneObj;
        const data = await getSysDesignMenu({
          sysMenuDesignId: pane.sysMenuDesignId
        });
        this.curPaneConfig = data.designOverallLayout;
      }
    },
    // 新增数据传递
    addDataTransfer() {
      this.curPaneObj.panelData.push({
        paneComp: {
          compId: '',
          name: '',
          compPath: ''
        },
        mainComp: {
          compId: '',
          name: '',
          compPath: ''
        }
      });
    },
    // 删除数据传递
    deletePane(index) {
      this.curPaneObj.panelData.splice(index, 1);
    },
    filterMethods(data) {
      if (data.dataSource && data.dataSource.columnName) {
        if (data.dataSource.tableName) {
          return false;
        }
        return true;
      }
      return false;
    },
    compChange1(item) {
      if (this.getAllcheck[item.relateDataComp.compId]) {
        item.relateDataComp.tableName =
          this.getAllcheck[item.relateDataComp.compId].dataSource.tableName;
      } else {
        item.relateDataComp = {
          compId: '',
          compPath: '',
          compType: '',
          tableName: ''
        };
      }
    },
    compChange2(item) {
      if (this.getAllcheck[item.relateBusiComp.compId]) {
        item.relateBusiComp.tableName =
          this.getAllcheck[item.relateBusiComp.compId].dataSource.tableName;
      } else {
        item.relateBusiComp = {
          compId: '',
          compPath: '',
          compType: '',
          tableName: ''
        };
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.PanelConfig {
  overflow-x: hidden;
  ::v-deep {
    @media (min-height: 640px) {
      & >.el-dialog {
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
        padding-top: 16px;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px - 16px);
        overflow-y: auto;
      }
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
              width: 120px;
            }
          }
        }
      }
      .el-form-item {
        margin-bottom: 0;
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
      font-size: 16px;
      ::v-deep {
        .sqlTerm {
          height: 472px;
        }
      }
    }
  }
  .normalTerm {
    height: calc(100% - 52px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sqlTerm {
    height: calc(100% - 52px);
    overflow: hidden;
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
      &--comp3 {
        width: 80px;
        margin-left: 10px;
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
  .contentConfig {
    display: flex;
    align-items: center;
    &__box {
      flex: 1;
      h2 {
        padding-left: 10px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        height: 40px;
        line-height: 40px;
      }
    }
  }
}
</style>
