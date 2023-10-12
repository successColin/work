<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ getCurrentTab.name }}</h1>
    </header>
    <section class="contentConfig__wrapper">
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          显示标题
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showTitle"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box" style="margin: 0 10px">
        <h2 style="padding-left: 0">标题</h2>
        <apiot-input
          v-model="getCurrentTab.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </div>
      <div class="contentConfig__box">
        <h2>之后加载</h2>
        <el-select
          v-model="getCurrentTab.reloadArea"
          multiple
          collapse-tags
          class="contentConfig__select"
        >
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getArea"
            :key="item.compId"
          ></el-option>
        </el-select>
      </div>
      <div class="contentConfig__box">
        <h2>链接符</h2>
        <el-select
          v-model="getCurrentTab.linkSymbol"
          class="contentConfig__select"
        >
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="item in linkSymbolArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="contentConfig__box">
        <h2 class="contentConfig__hasTab--switchBox">
          是否新增
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showAdd"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2>设备位置树关联面板选择</h2>
        <el-select
          v-model="paneType"
          class="contentConfig__select"
          @change="paneTypeChange"
        >
          <el-option label="位置节点新增位置" :value="1"></el-option>
          <el-option label="位置节点新增设备" :value="2"></el-option>
          <el-option label="设备节点新增设备" :value="3"></el-option>
        </el-select>
        <div class="p-l-10 p-r-10">
          <filterable-input
            class="m-t-10"
            placeholder="请选择面板"
            :hasPagination="true"
            :showInfo="curPaneObj"
            :dialogType="4"
            @selectRes="selectPane"
          ></filterable-input>
          <apiot-button
            class="panelBtn"
            @click="addDataTransfer"
            v-if="Object.keys(this.getAreaAndComp.comp).length"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>数据传递
          </apiot-button>
          <ul
            class="dataTransfer"
            v-if="Object.keys(this.getAreaAndComp.comp).length"
          >
            <li
              class="dataTransfer__item m-t-8"
              v-for="(item, index) in curPaneObj.panelData"
              :key="index"
            >
              <h1>数据传递</h1>
              <i class="iconfont icon-guanbi" @click="deletePane(index)"></i>
              <select-comp
                class="m-b-8"
                :configData="curPaneConfig"
                :curTriggerComp="item.paneComp"
                :triggerCompMap="getPaneCompMap"
              ></select-comp>
              <span class="equal">=</span>
              <select-comp
                :configData="configData"
                :curTriggerComp="item.mainComp"
                :triggerCompMap="triggerCompMap"
              ></select-comp>
            </li>
          </ul>
          <!-- <apiot-button
            class="panelBtn"
            v-if="Object.keys(this.getAreaAndComp.comp).length"
            @click="filterPaneDialog = true"
          >
            <i class="iconfont icon-shaixuan m-r-4"></i>面板过滤条件
          </apiot-button> -->
        </div>
        <h2 class="contentConfig__hasTab--switchBox">
          是否删除
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showDel"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否移动
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showTransfer"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box p-r-10 p-l-10">
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          @click="
            activeFilter = getCurrentTab.positionFilter;
            filterDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>设置位置过滤条件
        </apiot-button>
      </div>
      <div class="contentConfig__box p-r-10 p-l-10 m-t-10">
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          @click="
            activeFilter = getCurrentTab.deviceFilter;
            filterDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>设置设备过滤条件
        </apiot-button>
      </div>
    </section>
    <!-- 筛选条件 -->
    <FilterTerm
      :visible.sync="filterDialog"
      v-if="filterDialog"
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      :getCurrentTab="getCurrentTab"
      :filterObj="activeFilter"
    ></FilterTerm>
  </div>
</template>

<script>
// import { createUnique } from '@/utils/utils';
import { getSysDesignMenu } from '@/api/menuConfig';
import FilterTerm from '../ContentConfig/FilterTerm';
import SelectComp from '../GlobalConfig/components/AddAction/components/SelectComp';
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  props: {
    activeObj: {
      type: Object,
    },
    hasTriggerComp: {
      type: Object,
    },
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
    // 所有组件平坦化
    getAllcheck: {
      type: Object,
    },
  },
  data() {
    return {
      areaArr: [
        {
          name: '全功能区',
          compName: 'MenuMain',
          propertyCompName: 'ContentConfig',
          pageType: 1,
          shouldTab: true,
          imgUrl: 'FullFeatArea.svg',
          compId: 0,
          areaType: 1,
          tableInfo: {
            tableName: '',
            id: 0,
            nameAlias: '',
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '功能区',
              compId: 0,
              form: {
                id: '',
              },
              rules: {},
              children: [],
              areaType: 1,
            },
          ],
        },
        {
          name: '按钮功能区',
          compName: 'MenuMain',
          propertyCompName: 'ContentConfig',
          pageType: 2,
          shouldTab: true,
          imgUrl: 'BtnsFeatArea.svg',
          compId: 0,
          areaType: 1,
          tableInfo: {
            tableName: '',
            id: 0,
            nameAlias: '',
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '按钮区',
              compId: 0,
              children: [],
              areaType: 2,
              rightIndex: 0,
              appSort: 1,
              appRadius: 1, // 按钮区排列
              appStyle: 1, // 按钮区风格
            },
            {
              name: '功能区',
              compId: 0,
              form: {
                id: '',
              },
              rules: {},
              children: [],
              areaType: 1,
            },
          ],
        },
        {
          name: '功能按钮区',
          compName: 'MenuMain',
          propertyCompName: 'ContentConfig',
          pageType: 3,
          shouldTab: true,
          imgUrl: 'FeatBtnsArea.svg',
          compId: 0,
          areaType: 1,
          tableInfo: {
            tableName: '',
            id: 0,
            nameAlias: '',
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '功能区',
              compId: 0,
              form: {
                id: '',
              },
              rules: {},
              children: [],
              areaType: 1,
            },
            {
              name: '按钮区',
              compId: 0,
              children: [],
              areaType: 2,
              rightIndex: 0,
              appSort: 1,
              appRadius: 1, // 按钮区排列
              appStyle: 1, // 按钮区风格
            },
          ],
        },
      ],
      relateDialog: false,
      dialogVisible: false,
      currentRadioObj: null,
      currentColumnObj: null,
      filterDialog: false,
      curPaneConfig: [],
      curItem: {
        icon: '',
        color: '',
        imageUrl: '',
      },
      linkSymbolArr: [
        {
          name: '无',
          value: '',
        },
        {
          name: '-',
          value: '-',
        },
        {
          name: '_',
          value: '_',
        },
        {
          name: '/',
          value: '/',
        },
      ],
      activeFilter: null,
      curPaneObj: {
        id: '', // 面板id
        panelName: '', // 面板名称
        sysMenuDesignId: '', // 设计组id
        relationMenuDesignId: '', // 外层设计组id
        panelType: '', // 类型
        panelClassify: 1,
        panelData: [], // 面板传递参数
        panelFilter: [], // 面板过滤条件
      },
      paneType: 1,
    };
  },

  computed: {
    // 获取当前的tab
    getCurrentTab() {
      return this.activeObj;
    },
    // 获取功能组件
    getCardArea() {
      if (this.activeObj.children.length) {
        const index = this.activeObj.children.findIndex(
          (child) => child.areaType === 1,
        );
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {
        children: [],
      };
    },
    // 获取开启了字典的label
    getDictLable() {
      // console.log();
      return this.getCardArea.children.filter((child) => child.enableDict);
    },
    // 获取所有的区域
    getArea() {
      const curInfo = [];
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        const curComp = this.getAllcheck[key];
        if (
          curComp.compType === 'AREA' &&
          this.activeObj.compId !== curComp.compId
        ) {
          curInfo.push(curComp);
        }
      });
      return curInfo;
    },
    // 获取当前按钮的组件id
    getCurButtonId() {
      let tempId = '';
      if (this.paneType === 1) {
        tempId = this.activeObj.posAddPos;
      } else if (this.paneType === 2) {
        tempId = this.activeObj.posAddDevice;
      } else {
        tempId = this.activeObj.deviceAddDevice;
      }
      return tempId;
    },
    // 获取面板所有单位
    getAreaAndComp() {
      const obj = {
        tab: {},
        area: {},
        comp: {},
      };
      if (this.curPaneConfig[0] && this.curPaneConfig[0].children.length) {
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
                        obj.comp[comp.compId] = JSON.parse(
                          JSON.stringify(comp),
                        );
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
                            obj.comp[comp.compId] = JSON.parse(
                              JSON.stringify(comp),
                            );
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
    },
  },
  components: {
    FilterTerm,
    SelectComp,
  },
  created() {
    this.paneTypeChange();
  },
  mounted() {
    this.resetReloadArea();
    // console.log(this.getCardArea.children);
  },

  methods: {
    // 重置触发的区域
    resetReloadArea() {
      const arr = [];
      this.getArea.forEach((comp) => {
        this.getAllcheck[`${comp.compId}_`].isTree = false;
        if (this.getCurrentTab.reloadArea.includes(comp.compId)) {
          this.getAllcheck[`${comp.compId}_`].isTree = true;
          arr.push(comp.compId);
        }
      });
      this.getCurrentTab.reloadArea = arr;
    },
    // 获取面板数据
    async getPaneConfig() {
      if (this.curPaneObj.sysMenuDesignId) {
        const data = await getSysDesignMenu({
          sysMenuDesignId: this.curPaneObj.sysMenuDesignId,
        });
        this.curPaneConfig = data.designOverallLayout;
      }
    },
    // 切换面板
    paneTypeChange() {
      console.log(this.getCurButtonId);
      if (
        this.configData[0].paneObj &&
        this.configData[0].paneObj[this.getCurButtonId]
      ) {
        this.curPaneObj = this.configData[0].paneObj[this.getCurButtonId];
        this.getPaneConfig();
      } else {
        this.curPaneObj = {
          id: '', // 面板id
          panelName: '', // 面板名称
          sysMenuDesignId: '', // 设计组id
          relationMenuDesignId: '', // 外层设计组id
          panelType: '', // 类型
          panelClassify: 1,
          panelData: [], // 面板传递参数
          panelFilter: [], // 面板过滤条件
        };
        this.curPaneConfig = [];
      }
    },
    // 选择面板
    async selectPane(pane) {
      if (!pane) {
        this.curPaneObj = {
          id: '',
        };
        this.configData[0].paneObj[this.getCurButtonId] = this.curPaneObj;
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
        this.curPaneObj.panelClassify = pane.panelClassify;
        this.configData[0].paneObj[this.getCurButtonId] = this.curPaneObj;
        const data = await getSysDesignMenu({
          sysMenuDesignId: pane.sysMenuDesignId,
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
          compPath: '',
        },
        mainComp: {
          compId: '',
          name: '',
          compPath: '',
        },
      });
    },
    // 删除数据传递
    deletePane(index) {
      this.curPaneObj.panelData.splice(index, 1);
    },
  },

  watch: {
    'getCurrentTab.reloadArea': function (v, v1) {
      if (v && v1 && v.length !== v1.length) {
        this.resetReloadArea();
      }
    },
    filterDialog(v) {
      if (!v) {
        this.$bus.$emit('addHasTriggerComp');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.contentConfig {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 10px;
  &__title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
  }
  &__wrapper {
    height: calc(100% - 46px);
    overflow: auto;
  }
  &__box {
    h2 {
      padding-left: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      height: 40px;
      line-height: 40px;
    }
  }
  &__hasTab {
    &--switchBox {
      position: relative;
      ::v-deep {
        .el-switch__label {
          position: absolute;
          margin: 0;
          color: #ffffff !important;
        }
        .el-switch__label--left {
          display: none;
          left: 22px;
          &.is-active {
            display: block;
            z-index: 1;
          }
          span {
            font-size: 12px;
          }
        }
        .el-switch__label--right {
          display: none;
          left: 6px;
          &.is-active {
            display: block;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
    &--switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    &--list {
      padding: 0 10px;
    }
    &--tab {
      height: 36px;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 16px;
        color: #bbc3cd;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
      .icon-zongxiangtuodong {
        cursor: move;
      }
      .icon-sheweimoren {
        visibility: hidden;
        &.active {
          color: $--color-primary;
          visibility: visible;
        }
      }
      .input {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        flex: 1;
      }
      .columnName {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        &__sort {
          width: 80px;
          margin-left: auto;
          margin-right: 8px;
        }
      }
      &.active,
      &:hover {
        background: $--hover-color;
        .icon-sheweimoren {
          visibility: visible;
        }
      }
    }
    &--addTab {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-bottom: 10px;
    }
  }
  &__select {
    margin-left: 10px;
    width: calc(100% - 20px);
  }
  &__areaShow {
    &--box {
      display: flex;
    }
    &--item {
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      height: 80px;
      width: 80px;
      margin-left: 10px;
      cursor: pointer;
      &:hover,
      &.active {
        background: #fafafa;
        border: 1px solid #e9e9e9;
      }
      img {
        display: block;
        margin: 14px auto 0;
      }
      p {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }
    }
  }
  &__dataSource {
    padding-left: 10px;
    padding-right: 10px;
    h2 {
      padding-left: 0;
    }
    &--select {
      width: 100%;
    }
    &--h2 {
      display: flex;
      align-items: center;
      .iconfont {
        color: #aaaaaa;
        font-weight: normal;
        margin-left: 5px;
      }
    }
    &--addRelate {
      width: 100%;
      i {
        color: $--color-primary;
      }
    }
  }
  .iconSelect {
    display: flex;
    align-items: center;
    padding: 0 10px;
    &__tip {
      margin-left: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aaaaaa;
    }
  }
  .panelBtn {
    width: 100%;
    margin-top: 10px;
    .iconfont {
      color: $--color-primary;
    }
  }
  .dataTransfer {
    &__item {
      position: relative;
      height: 118px;
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      padding: 0 10px;
      overflow: hidden;
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
        right: 9px;
        top: 9px;
        font-size: 13px;
        color: #bbc3cd;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
      .equal {
        position: absolute;
        left: 50%;
        margin-left: -12px;
        margin-top: -16px;
        z-index: 1;
        box-sizing: border-box;
        width: 24px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        border-radius: 50%;
        background: #fafafa;
        border: 1px solid #e9e9e9;
      }
    }
  }
}
</style>
