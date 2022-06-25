<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ isBtnArea ? '按钮区' : '多表树区' }}</h1>
    </header>
    <section class="contentConfig__wrapper" v-if="!isBtnArea">
      <div class="contentConfig__box contentConfig__hasTab" v-if="!isSelect">
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
      <div class="contentConfig__box" style="margin: 0 10px" v-if="!isSelect">
        <h2 style="padding-left: 0">标题</h2>
        <apiot-input
          v-model="getCurrentTab.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </div>
      <div
        class="contentConfig__box contentConfig__dataSource"
        v-if="getCurrentTab.children.length"
      >
        <h2>关联数据源</h2>
        <el-select
          :disabled="true"
          placeholder="请选择数据源"
          :value="1"
          class="contentConfig__dataSource--select"
        >
          <el-option label="数据库" :value="1"></el-option>
        </el-select>
      </div>
      <div
        class="contentConfig__box contentConfig__dataSource"
        v-if="getCurrentTab.children.length"
      >
        <h2 class="contentConfig__dataSource--h2">
          业务表<el-tooltip
            content="当业务表被关系关联，或者被组件使用时不允许更改"
            placement="top"
            ><i class="iconfont icon-bangzhu"
          /></el-tooltip>
          <i
            class="iconfont icon-xinzeng"
            @click="addMultiData"
            v-if="getCurrentTab.multiDataSource.length === 2"
          ></i>
        </h2>
        <el-collapse
          v-model="activeNames"
          class="contentConfig__box--collapse"
          accordion
        >
          <el-collapse-item
            :name="index"
            v-for="(item, index) in getCurrentTab.multiDataSource"
            :key="index"
          >
            <template slot="title">
              <span class="tableName" :title="getCollapseName(item)">{{
                getCollapseName(item)
              }}</span>
              <i
                class="iconfont icon-shanchu"
                v-if="index === 2"
                @click.stop="deleteMultiData"
              ></i>
            </template>
            <filterable-input
              class="m-b-10"
              placeholder="上级表关联字段"
              v-if="index !== 0 && item.tableInfo.tableName"
              :tableName="item.tableInfo.tableName"
              :showInfo="item.lastLevelColumn"
              columnTypes="1"
              :dialogType="2"
              @selectRes="selectColumnRes($event, item.lastLevelColumn)"
            ></filterable-input>
            <div class="contentConfig__box iconSelect">
              <IconSelect
                :shouldScale="true"
                @iconSelected="iconSelected($event, item)"
                :item="item.treeIcon"
                :iconType="1"
              ></IconSelect>
              <filterable-input
                placeholder="请选择表"
                :dialogType="1"
                :disabled="canChangeTable"
                :showInfo="item.tableInfo"
                @selectRes="selectTable($event, item.tableInfo, index)"
              ></filterable-input>
            </div>
            <filterable-input
              class="m-t-10"
              placeholder="本表关联字段"
              v-if="item.tableInfo.tableName"
              :tableName="item.tableInfo.tableName"
              :showInfo="item.selfLevelColumn"
              columnTypes="1"
              :dialogType="2"
              @selectRes="selectColumnRes($event, item.selfLevelColumn)"
            ></filterable-input>
            <div
              class="m-t-10 contentConfig__dataSource--start"
              v-if="item.tableInfo.tableName && item.selfLevelColumn.columnName"
            >
              <apiot-input
                class="input"
                readonly
                v-model="item.selfLevelColumn.start"
                placeHolder="本表关联字段起始值"
              ></apiot-input>
              <i class="iconfont icon-jiahao" @click="showDialog(item)"></i>
            </div>
            <apiot-button
              class="contentConfig__dataSource--addRelate"
              style="margin-left: 0"
              v-if="item.tableInfo.tableName"
              @click="
                filterObj = item;
                filterDialog = true;
              "
            >
              <i class="iconfont icon-shaixuan m-r-4"></i>设置过滤条件
            </apiot-button>
            <div
              class="contentConfig__box"
              v-if="getCardArea(item.tableInfo.nameAlias).length"
            >
              <h2>包含组件</h2>
              <draggable
                :value="getCardArea(item.tableInfo.nameAlias)"
                group="tabs"
                animation="300"
                handle=".icon-zongxiangtuodong"
              >
                <transition-group class="contentConfig__hasTab--list" tag="ul">
                  <li
                    class="contentConfig__hasTab--tab"
                    v-for="child in getCardArea(item.tableInfo.nameAlias)"
                    :key="child.compId"
                    v-show="child.compName !== 'BtnsArea'"
                  >
                    <i
                      class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"
                      v-if="false"
                    ></i>
                    <span class="input">{{
                      child.dataSource.columnName || child.name
                    }}</span>
                    <el-tooltip
                      effect="dark"
                      content="隐藏"
                      :enterable="false"
                      placement="bottom"
                    >
                      <i
                        class="iconfont icon-mimaxianshi m-r-12"
                        @click="child.showTreeText = false"
                        v-show="
                          !['id', 'dataType'].includes(
                            child.dataSource.columnName
                          ) &&
                          child.compName !== 'BtnsArea' &&
                          child.showTreeText
                        "
                      ></i
                    ></el-tooltip>
                    <el-tooltip
                      effect="dark"
                      content="显示"
                      :enterable="false"
                      placement="bottom"
                    >
                      <i
                        class="iconfont icon-yincang m-r-12"
                        @click="child.showTreeText = true"
                        v-show="
                          !['id', 'dataType'].includes(
                            child.dataSource.columnName
                          ) &&
                          child.compName !== 'BtnsArea' &&
                          !child.showTreeText
                        "
                      ></i
                    ></el-tooltip>
                    <el-tooltip
                      effect="dark"
                      content="删除"
                      :enterable="false"
                      placement="bottom"
                    >
                      <i
                        class="iconfont icon-shanchu"
                        @click="deleteLabel(child)"
                        v-show="
                          !['id', 'dataType'].includes(
                            child.dataSource.columnName
                          ) && child.compName !== 'BtnsArea'
                        "
                      ></i
                    ></el-tooltip>
                  </li>
                </transition-group>
              </draggable>
            </div>
            <div class="contentConfig__box contentConfig__hasTab">
              <h2 class="contentConfig__hasTab--switchBox">
                是否启用组件字典图标
                <el-switch
                  class="contentConfig__hasTab--switch"
                  v-model="item.hasCardIcon"
                  active-text="是"
                  inactive-text="否"
                >
                </el-switch>
              </h2>
            </div>
            <div class="contentConfig__box" v-if="item.hasCardIcon">
              <h2>图标来源</h2>
              <el-select v-model="item.iconId" class="collapseIcon">
                <el-option
                  :label="item.name"
                  :value="item.compId"
                  v-for="item in getDictLable(item.tableInfo.nameAlias)"
                  :key="item.compId"
                ></el-option>
              </el-select>
            </div>
            <div class="contentConfig__box" v-if="item.hasCardIcon">
              <h2>图标颜色来源</h2>
              <el-select v-model="item.iconColorId" class="collapseIcon">
                <el-option
                  :label="item.name"
                  :value="item.compId"
                  v-for="item in getDictLable(item.tableInfo.nameAlias)"
                  :key="item.compId"
                ></el-option>
              </el-select>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="false">
        <h2 class="contentConfig__hasTab--switchBox">
          是否初始化
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.shouldInit"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box" v-if="!isSelect">
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
      <div
        class="contentConfig__box contentConfig__dataSource"
        v-if="getCurrentTab.children.length"
      >
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-left: 0"
          v-if="getCurrentTab && isSelect"
          @click="addLableComp"
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>添加label框
        </apiot-button>
      </div>

      <!-- 筛选条件 -->
      <FilterTerm
        :visible.sync="filterDialog"
        v-if="filterDialog"
        :filterObj="filterObj"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
        :getCurrentTab="getCurrentTab"
      ></FilterTerm>

      <!-- 初始值弹窗 -->
      <StartDialog
        :visible.sync="showStart"
        v-if="showStart"
        @btnSure="btnSure"
        :tableInfo="curMulItem ? curMulItem.tableInfo : {}"
        :selfLevelColumn="curMulItem ? curMulItem.selfLevelColumn : {}"
      >
      </StartDialog>
    </section>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import IconSelect from '../../../../../../components/IconSelect';
import FilterTerm from '../ContentConfig/FilterTerm';
import StartDialog from './StartDialog';

export default {
  mixins: [propertyMixin],
  props: {
    activeObj: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    // 所有组件平坦化
    getAllcheck: {
      type: Object
    }
  },
  data() {
    return {
      filterObj: null,
      filterDialog: false,
      curItem: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      linkSymbolArr: [
        {
          name: '无',
          value: ''
        },
        {
          name: '-',
          value: '-'
        },
        {
          name: '_',
          value: '_'
        },
        {
          name: '/',
          value: '/'
        }
      ],
      activeNames: '',
      curMulItem: null,
      showStart: false
    };
  },

  components: {
    IconSelect,
    FilterTerm,
    StartDialog
  },

  computed: {
    // 获取当前页面的类型
    getCurPageType() {
      if (this.getCurrentTab) {
        return this.getCurrentTab.pageType;
      }
      return -1;
    },
    // 获取当前的tab
    getCurrentTab() {
      return this.activeObj;
    },
    // 是否可以更改主表
    canChangeTable() {
      let flag = false;
      if (!this.getCurrentTab.children.length) {
        return flag;
      }
      if (this.getCurrentTab.relateTableArr && this.getCurrentTab.relateTableArr.length) {
        flag = true;
      } else {
        this.getCurrentTab.children.forEach((child) => {
          child.children.forEach((comp) => {
            if (
              comp.dataSource &&
              comp.dataSource.relateName === '主表' &&
              comp.dataSource.tableName &&
              comp.dataSource.columnName !== 'id'
            ) {
              flag = true;
            }
          });
        });
      }
      return flag;
    },
    // 是不是按钮区
    isBtnArea() {
      return this.activeObj.shouldTab && this.activeObj.areaType === 2;
    },
    // 获取按钮数组
    getBtnsArea() {
      if (this.activeObj.children.length) {
        const index = this.activeObj.children.findIndex((child) => child.areaType === 2);
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {
        children: []
      };
    },
    // 获取功能组件
    getCardArea() {
      return (alias) => {
        const arr = [];
        if (this.activeObj.children[1]) {
          this.activeObj.children[1].children.forEach((item) => {
            if (item.compName !== 'BtnsArea') {
              if (item.dataSource.tableName === '') {
                arr.push(item);
              } else if (item.dataSource.alias === alias) {
                arr.push(item);
              }
            }
          });
        }
        return arr;
      };
    },
    // 获取开启了字典的label
    getDictLable() {
      return (alias) =>
        // console.log();
        this.getCardArea(alias).filter((child) => child.enableDict);
    },
    // 获取所有的区域
    getArea() {
      const curInfo = [];
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        const curComp = this.getAllcheck[key];
        if (curComp.compType === 'AREA' && this.activeObj.compId !== curComp.compId) {
          curInfo.push(curComp);
        }
      });
      return curInfo;
    }
  },
  created() {
    this.initIcon();
  },
  mounted() {
    this.resetCardIcon();
    this.resetReloadArea();
  },

  methods: {
    initIcon() {
      if (this.getCurrentTab.hasTreeIcon) {
        this.curItem.icon = this.getCurrentTab.treeIcon.icon;
        this.curItem.color = this.getCurrentTab.treeIcon.color;
        this.curItem.imageUrl = this.getCurrentTab.treeIcon.imageUrl;
      }
    },
    // 重置选中的图标跟颜色来源
    resetCardIcon() {
      if (this.getDictLable.length === 0) {
        this.getCurrentTab.iconId = '';
        this.getCurrentTab.iconColorId = '';
      } else {
        const index1 = this.getCurrentTab.children[1].children.findIndex(
          (label) => label.compId === this.getCurrentTab.iconId
        );
        if (index1 === -1) {
          this.getCurrentTab.iconId = '';
        }
        const index2 = this.getCurrentTab.children[1].children.findIndex(
          (label) => label.compId === this.getCurrentTab.iconColorId
        );
        if (index2 === -1) {
          this.getCurrentTab.iconColorId = '';
        }
      }
    },
    // 重置触发的区域
    resetReloadArea() {
      const arr = [];
      this.getArea.forEach((comp) => {
        if (this.getCurrentTab.reloadArea.includes(comp.compId)) {
          arr.push(comp.compId);
        }
      });
      this.getCurrentTab.reloadArea = arr;
    },
    // getcollapsename
    getCollapseName(item) {
      if (item.tableInfo.tableName) {
        return `${item.name}(${item.tableInfo.tableName})`;
      }
      return `${item.name}`;
    },
    // 选中表格
    selectTable(table, tableInfo, index) {
      // console.log(table);
      tableInfo.tableName = table.tableName;
      tableInfo.id = table.id;
      tableInfo.nameAlias = `alias_${createUnique()}`;
      // 按钮区表名，别名回填
      if (!this.isSelect) {
        this.getCurrentTab.children[1].children[index].dataSource.tableName = tableInfo.tableName;
        this.getCurrentTab.children[1].children[index].dataSource.alias = tableInfo.nameAlias;
      }

      // console.log(this.getCurrentTab.children[1].children[index]);
    },
    // 字段选择结果
    selectColumnRes(table, column) {
      column.id = table.id;
      column.columnName = table.columnName;
      column.columnTypeDict = table.columnTypeDict;
    },
    // 删除label
    deleteLabel(item) {
      console.log(item);
      const index = this.getCurrentTab.children[1].children.findIndex(
        (label) => label.compId === item.compId
      );
      if (index !== -1) {
        this.getCurrentTab.children[1].children.splice(index, 1);
      }
    },
    iconSelected(obj, item) {
      item.treeIcon.icon = obj.icon;
      item.treeIcon.color = obj.color;
      item.treeIcon.imageUrl = obj.imageUrl;
    },
    // 新增多表表
    addMultiData() {
      this.getCurrentTab.multiDataSource.push({
        name: '三级表',
        treeIcon: {
          icon: '',
          color: '',
          imageUrl: ''
        },
        hasCardIcon: false, // 是否启用组件字典图标
        iconId: '', // 组件字典图标来源的组件id
        iconColorId: '', // 组件字典图标颜色来源的组件id
        tableInfo: {
          id: '',
          tableName: ''
        },
        lastLevelColumn: {
          id: '',
          columnName: '',
          columnTypeDict: ''
        },
        selfLevelColumn: {
          id: '',
          columnName: '',
          columnTypeDict: '',
          start: 0,
          startId: ''
        },
        filterTermType: 1, // 1 是普通 2是sql
        filterTermStr: '', // 普通字符串
        filterTermSql: '', // sql字符串
        termParams: '' // 过滤条件需要的组件参数id
      });
      this.getCurrentTab.children[1].children.splice(2, 0, {
        name: '操作',
        compName: 'BtnsArea',
        compId: createUnique(),
        children: [],
        dataSource: {
          columnName: '',
          tableName: '',
          alias: ''
        }
      });
    },
    // 删除多表
    deleteMultiData() {
      this.getCurrentTab.multiDataSource.splice(2, 1);
      this.getCurrentTab.children[1].children.splice(2, 1);
    },
    // 添加label组件
    addLableComp() {
      const idCompId = createUnique();
      const label = {
        name: 'label控件',
        areaType: 1, // 表示内容区
        dragTable: true,
        dragCard: true, // 能否拖入卡片区
        dragTree: true, // 能否拖入卡片区
        imgUrl: 'baseComp/Label.svg',
        compType: 15,
        compId: idCompId,
        compName: 'Label',
        tableCompName: 'TableLabelCol',
        propertyCompName: 'LabelConfig',
        labelName: 'label',
        labelShowStyle: 1, // label 展示风格
        waterColor: '#333', // 小水滴颜色
        dropDownType: 15,
        placeholder: '请选择数据',
        showLabelTitle: true, // 是否显示label的标题
        helpInfo: '', // 帮助信息
        enableMultiColumn: false, // 是否多选字段
        labelNotChange: false, // label 不可更改
        enableDict: false, // 是否字典值
        dataSource: {
          relateName: '', // 关系名称
          tableName: '', //  表名
          columnName: '', // 字段名称
          columnTypeDict: 0, // 字段类型
          id: 0, // 字段id
          alias: '', // 别名
          dictObj: null, // 字典表数据
          mainColumnInfo: null // 主表相关信息
        },
        timeShowType: 1, // 1 是日期 2是日期时间
        multiTable: {
          table: {
            tableName: '',
            alias: '',
            id: ''
          },
          column: {
            columnName: '',
            id: '',
            columnTypeDict: 0
          }
        },
        singleStatus: 1,
        canShow: true,
        canReadonly: false,
        width: '50%',
        tableWidth: '0.1',
        alignStyle: 1, // 1 是左对齐 2右对齐
        font: {
          color: '#333333', // 字体颜色
          size: 14, // 字体大小
          style: 1 // 1 常规 2 加粗
        }, // 字体大小
        labelBg: {
          color: '#ffffff', // 背景颜色
          style: 0 // 0 无 1 方角 2 圆角
        }, // label 背景色
        enableIcon: false, // 是否允许label图标
        enableDictIcon: false, // 是否允许字典图标
        showTreeText: true, // 树节点上展示内容
        icon: {
          icon: '',
          color: '',
          imageUrl: ''
        }, // label 图标
        relateType: 1, // 弹窗类型 1是面板 2是菜单
        dialogName: 'PanelDialog', // 弹窗风格
        dialogTitle: '', // 弹窗标题
        shouldRequired: false,
        submitType: 1 // 1 始终提交 2 仅显示时提交 3 始终不提交
      };
      console.log(this.activeObj);
      this.activeObj.children[1].form[idCompId] = '';
      this.activeObj.children[1].children.push(label);
    },
    // 展示本表关联字段初始值弹窗
    showDialog(item) {
      this.curMulItem = item;
      this.showStart = true;
    },
    btnSure(obj) {
      console.log(obj);
      this.curMulItem.selfLevelColumn.startId = obj.id;
      this.curMulItem.selfLevelColumn.start = obj[this.curMulItem.selfLevelColumn.columnName];
    }
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
    }
  }
};
</script>

<style lang='scss' scoped>
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
    &--collapse {
      border: 0 none;
      ::v-deep {
        .el-collapse-item__header {
          border: 0 none;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: 600;

          .tableName {
            width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .el-collapse-item__header {
          position: relative;
          .icon-shanchu {
            position: absolute;
            right: 28px;
            color: #bbc3cd;
            &:hover {
              color: $--color-primary;
            }
          }
        }
        .el-collapse-item__wrap {
          border-bottom: 0 none;
          .el-collapse-item__content {
            padding-bottom: 0;
          }
        }
      }
      .collapseIcon {
        width: 100%;
      }
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
      .icon-xinzeng {
        margin-left: auto;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
    }
    &--addRelate {
      width: 100%;
      margin-top: 10px;
      i {
        color: $--color-primary;
      }
    }
    &--start {
      position: relative;
      .input {
        &:hover + i {
          border-left-color: #c0c4cc;
        }
        &:focus-within + i {
          border-left-color: $--color-primary;
        }
      }
      .icon-jiahao {
        border-left: 1px solid #e9e9e9;
        position: absolute;
        margin-left: -32px;
        margin-top: 1px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #aaaaaa;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        &:not(.disabled):hover {
          color: $--color-primary;
        }
        &.disabled {
          cursor: default;
        }
      }
    }
  }
  .iconSelect {
    display: flex;
    align-items: center;
    .filterableInput {
      flex: 1;
      margin-left: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aaaaaa;
    }
  }
}
</style>
