<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ isBtnArea ? '按钮区' : '单表树区' }}</h1>
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
        <h2 class="contentConfig__dataSource--h2">
          业务表<el-tooltip
            content="当业务表被关系关联，或者被组件使用时不允许更改"
            placement="top"
            ><i class="iconfont icon-bangzhu"
          /></el-tooltip>
        </h2>
        <filterable-input
          placeholder="请选择关联表"
          title="关联表"
          :dialogType="1"
          :disabled="canChangeTable"
          :showInfo="getCurrentTab.tableInfo"
          :isTree="true"
          @selectRes="selectTable"
        ></filterable-input>
        <h2 v-if="getCurrentTab && getCurrentTab.tableInfo.tableName">
          关联表
        </h2>
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-bottom: 10px"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName"
          @click="
            currentRadioObj = null;
            relateDialog = true;
          "
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>配置关联表
        </apiot-button>
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-left: 0"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && !isSelect"
          @click="
            currentRadioObj = null;
            filterDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>设置过滤条件
        </apiot-button>
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-left: 0"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && isSelect"
          @click="addLableComp"
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>添加label框
        </apiot-button>
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
      <div class="contentConfig__box" v-if="getCardArea.children.length !== 1">
        <h2>包含组件</h2>
        <draggable
          v-model="getCardArea.children"
          group="tabs"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group class="contentConfig__hasTab--list" tag="ul">
            <li
              class="contentConfig__hasTab--tab"
              v-for="(child, index) in getCardArea.children"
              :key="child.compId"
              @click="changeTab(child)"
              v-show="child.compName !== 'BtnsArea'"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
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
                    child.dataSource.columnName !== 'id' &&
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
                    child.dataSource.columnName !== 'id' &&
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
                  @click="deleteLabel(index)"
                  v-show="
                    child.dataSource.columnName !== 'id' &&
                    child.compName !== 'BtnsArea'
                  "
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用节点图标
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.hasTreeIcon"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div
        class="contentConfig__box iconSelect"
        v-if="getCurrentTab.hasTreeIcon"
      >
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected"
          :item="curItem"
          :iconType="1"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个识别度高的图标</p>
      </div>
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用组件字典图标
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.hasCardIcon"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box" v-if="getCurrentTab.hasCardIcon">
        <h2>图标来源</h2>
        <el-select v-model="getCurrentTab.iconId" class="contentConfig__select">
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getDictLable"
            :key="item.compId"
          ></el-option>
        </el-select>
      </div>
      <div class="contentConfig__box" v-if="getCurrentTab.hasCardIcon">
        <h2>图标颜色来源</h2>
        <el-select
          v-model="getCurrentTab.iconColorId"
          class="contentConfig__select"
        >
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getDictLable"
            :key="item.compId"
          ></el-option>
        </el-select>
      </div>
      <!-- 配置关联表弹窗 -->
      <RelateTableDialog
        :visible.sync="relateDialog"
        :getCurrentTab="getCurrentTab"
      ></RelateTableDialog>
      <!-- 筛选条件 -->
      <FilterTerm
        :visible.sync="filterDialog"
        v-if="filterDialog"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
        :getCurrentTab="getCurrentTab"
      ></FilterTerm>
    </section>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import IconSelect from '../../../../../../components/IconSelect';
import RelateTableDialog from '../ContentConfig/RelateTableDialog';
import FilterTerm from '../ContentConfig/FilterTerm';

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
            nameAlias: ''
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '功能区',
              compId: 0,
              form: {
                id: ''
              },
              rules: {},
              children: [],
              areaType: 1
            }
          ]
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
            nameAlias: ''
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
              appSort: 1, // 按钮区排列
              appStyle: 1 // 按钮区风格
            },
            {
              name: '功能区',
              compId: 0,
              form: {
                id: ''
              },
              rules: {},
              children: [],
              areaType: 1
            }
          ]
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
            nameAlias: ''
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '功能区',
              compId: 0,
              form: {
                id: ''
              },
              rules: {},
              children: [],
              areaType: 1
            },
            {
              name: '按钮区',
              compId: 0,
              children: [],
              areaType: 2,
              rightIndex: 0,
              appSort: 1, // 按钮区排列
              appStyle: 1 // 按钮区风格
            }
          ]
        }
      ],
      relateDialog: false,
      dialogVisible: false,
      currentRadioObj: null,
      currentColumnObj: null,
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
      ]
    };
  },

  components: {
    IconSelect,
    RelateTableDialog,
    FilterTerm
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
      if (this.activeObj.children.length) {
        const index = this.activeObj.children.findIndex((child) => child.areaType === 1);
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {
        children: []
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

    // console.log(this.getCardArea.children);
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
        const index1 = this.getDictLable.findIndex(
          (label) => label.compId === this.getCurrentTab.iconId
        );
        if (index1 === -1) {
          this.getCurrentTab.iconId = '';
        }
        const index2 = this.getDictLable.findIndex(
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
        this.getAllcheck[`${comp.compId}_`].isTree = false;
        if (this.getCurrentTab.reloadArea.includes(comp.compId)) {
          this.getAllcheck[`${comp.compId}_`].isTree = true;
          arr.push(comp.compId);
        }
      });
      this.getCurrentTab.reloadArea = arr;
    },
    // 选中表格
    selectTable(table) {
      // console.log(table);
      this.getCurrentTab.tableInfo.tableName = table.tableName;
      this.getCurrentTab.tableInfo.id = table.id;
      this.getCurrentTab.tableInfo.nameAlias = table.tableName;
      // 更改id组件的表名
      this.getCurrentTab.children.forEach((child) => {
        child.children.forEach((comp) => {
          // console.log(comp);
          if (
            comp.dataSource &&
            comp.dataSource.relateName === '主表' &&
            comp.dataSource.columnName === 'id'
          ) {
            comp.dataSource.tableName = table.tableName;
          }
        });
      });
    },
    // 更改当前活跃的tab
    changeActive(index) {
      // 判断是否打开tab
      if (this.activeObj.children.length) {
        this.changeChilren(this.activeObj, index);
        // 判断没有打开tab的情况下是否有子节点
      } else {
        this.addTab(index);
      }
    },
    // 切换视图
    async changeChilren(obj, index) {
      const newPageType = index + 1;
      if (obj.pageType === newPageType) {
        return;
      }
      if (obj.pageType !== 1 && newPageType === 1) {
        const i = this.getBtnsArea.children.findIndex((btn) => {
          if (this.hasTriggerComp[btn.compId]) {
            return true;
          }
          return false;
        });
        // console.log(i);
        if (i !== -1) {
          return this.$message({
            type: 'warning',
            message: '该按钮区存在触发器配置，请先删除相关的触发器配置'
          });
        }
        try {
          await this.$confirm('将清空按钮区的内容，是否继续', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          });
        } catch (error) {
          return;
        }
      }
      if (obj.pageType === 1) {
        if (newPageType === 2) {
          obj.children.unshift({
            name: '按钮区',
            compId: createUnique(),
            children: [],
            areaType: 2,
            rightIndex: 0,
            appSort: 1, // 按钮区排列
            appStyle: 1 // 按钮区风格
          });
        } else if (newPageType === 3) {
          obj.children.push({
            name: '按钮区',
            compId: createUnique(),
            children: [],
            areaType: 2,
            rightIndex: 0,
            appSort: 1, // 按钮区排列
            appStyle: 1 // 按钮区风格
          });
        }
      } else if (obj.pageType === 2) {
        if (newPageType === 1) {
          obj.children.shift();
        } else if (newPageType === 3) {
          const temp = obj.children.shift();
          obj.children.push(JSON.parse(JSON.stringify(temp)));
        }
      } else if (obj.pageType === 3) {
        if (newPageType === 2) {
          const temp = obj.children.shift();
          obj.children.push(JSON.parse(JSON.stringify(temp)));
        } else if (newPageType === 1) {
          obj.children.pop();
        }
      }
      obj.pageType = newPageType;
    },
    // 添加tab
    addTab(index) {
      const tempData = JSON.parse(JSON.stringify(this.areaArr[index]));
      tempData.children.forEach((child) => {
        child.compId = createUnique();
      });
      this.activeObj.pageType = index + 1;
      this.activeObj.children = tempData.children;
    },
    // 切换tab
    changeTab(child) {
      this.activeObj.curCompId = child.compId;
    },
    // 设置名称备注
    setBackName(child) {
      child.backName = child.name;
    },
    // 还原名称备注
    resetBackName(child) {
      if (!child.name) {
        child.name = child.backName;
      }
    },
    // 删除label
    deleteLabel(index) {
      this.getCardArea.children.splice(index, 1);
    },

    iconSelected(obj) {
      this.getCurrentTab.treeIcon.icon = obj.icon;
      this.getCurrentTab.treeIcon.color = obj.color;
      this.getCurrentTab.treeIcon.imageUrl = obj.imageUrl;
    },
    compDictChange(v) {
      if (v) {
        console.log(this.getCurrentTab.hasTreeIcon);
        this.getCurrentTab.hasTreeIcon = false;
      }
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
}
</style>
