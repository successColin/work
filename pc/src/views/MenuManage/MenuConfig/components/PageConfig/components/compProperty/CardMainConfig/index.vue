<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ isBtnArea ? '按钮区' : '卡片区' }}</h1>
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
      <div class="contentConfig__box contentConfig__areaShow" v-if="!isSelect">
        <h2>区域展示</h2>
        <ul class="contentConfig__areaShow--box">
          <li
            class="contentConfig__areaShow--item"
            v-for="(item, index) in areaArr"
            :class="[
              {
                active: item.pageType === getCurPageType,
              },
            ]"
            :key="index"
            @click.stop="changeActive(index)"
          >
            <img
              :src="
                require(`@/assets/img/menu_images/displayType/${item.imgUrl}`)
              "
            />
            <p>
              {{ item.name }}
            </p>
          </li>
        </ul>
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
          :isTree="getCurrentTab.isTree"
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
      <div
        class="contentConfig__box contentConfig__hasTab"
        v-if="$route.query.isApp === '1' && !isSelect"
      >
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用操作列
          <el-switch
            class="contentConfig__hasTab--switch"
            :value="getCurrentTab.canOperate"
            @input="changeCanOperate"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          是否需要数据权限
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.needPermissions"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
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
      <div
        class="contentConfig__box"
        v-if="getCardArea.children.length && !isSelect"
      >
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
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
              <span class="input">{{ child.name }}</span>
              <el-tooltip
                effect="dark"
                content="删除"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-shanchu"
                  @click="deleteLabel(index)"
                  v-show="child.dataSource.columnName !== 'id'"
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="!isSelect">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用分页
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.hasPagination"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div
        class="contentConfig__box m-b-10"
        v-show="getCurrentTab.hasPagination"
        v-if="!isSelect"
      >
        <h2>每页默认行数</h2>
        <el-select
          v-model="getCurrentTab.rowNum"
          style="width: calc(100% - 20px)"
          class="p-l-10 p-r-10"
        >
          <el-option label="10" :value="10"></el-option>
          <el-option label="20" :value="20"></el-option>
          <el-option label="30" :value="30"></el-option>
          <el-option label="40" :value="40"></el-option>
        </el-select>
      </div>
      <apiot-button
        v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && !isSelect"
        class="contentConfig__hasTab--addArea"
        @click="dialogVisible = true"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '字段排序' }) }}
      </apiot-button>
      <div class="contentConfig__box">
        <draggable
          v-model="getCurrentTab.sortArr"
          group="sort"
          animation="300"
          handle=".icon-zongxiangtuodong"
          v-if="getCurrentTab.sortArr.length"
        >
          <transition-group class="contentConfig__hasTab--list" tag="ul">
            <li
              class="contentConfig__hasTab--tab"
              v-for="(child, index) in getCurrentTab.sortArr"
              :key="child.id"
              @click="changeTab(child)"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
              <span class="columnName">{{ child.columnName }}</span>
              <el-select v-model="child.sort" class="columnName__sort">
                <el-option label="升序" value="ASC"></el-option>
                <el-option label="降序" value="DESC"></el-option>
              </el-select>
              <el-tooltip
                effect="dark"
                content="删除"
                :enterable="false"
                placement="bottom"
              >
                <i class="iconfont icon-shanchu" @click="deleteSort(index)"></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用卡片图标
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
      <div
        class="contentConfig__box p-l-10 p-r-10"
        v-if="$route.query.isApp === '1' && !isSelect"
      >
        <h2>关联类型</h2>
        <el-radio v-model="activeObj.relateType" :label="1">弹出面板</el-radio>
        <!-- <el-radio v-model="activeObj.relateType" :label="2">跳转菜单</el-radio> -->
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 1"
          @click="showPanelConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
        </apiot-button>
        <apiot-button class="panelBtn" v-if="activeObj.relateType === 2">
          <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
        </apiot-button>
      </div>
    </section>
    <!-- 按钮区 -->
    <BtnsAreaConfig
      v-if="isBtnArea"
      :isCard="true"
      :getBtnsArea="getBtnsArea"
      :isBtnArea="isBtnArea"
    ></BtnsAreaConfig>
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
    <!-- 实体表和字段表: 实体表1，字段表2 -->
    <transition name="dialog-fade">
      <table-or-field-dialog
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        :currentRadioObj.sync="currentColumnObj"
        :dialogType="2"
        :tableName="getCurrentTab.tableInfo.tableName"
        :hasPagination="false"
        :columnTypes="`1,2,3,4,5`"
        :idNeedId="true"
        :notShowSys="false"
        @sure-click="handleSubmit"
      ></table-or-field-dialog>
    </transition>
    <!-- 面板配置弹窗 -->
    <PanelConfig
      :visible.sync="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
      :getAllcheck="getAllcheck"
    ></PanelConfig>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import BtnsAreaConfig from '../ContentConfig/BtnsAreaConfig';
import FilterTerm from '../ContentConfig/FilterTerm';
import PanelConfig from '../ContentConfig/PanelConfig';
import RelateTableDialog from '../ContentConfig/RelateTableDialog';
import propertyMixin from '../propertyMixin';

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
    // 所有区域平坦化
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
      showPanelConfig: false // 面板配置弹窗是否显示
    };
  },

  components: {
    RelateTableDialog,
    BtnsAreaConfig,
    FilterTerm,
    PanelConfig
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
      if (this.getCurrentTab.relateTableArr.length) {
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

  mounted() {
    this.resetCardIcon();
    this.resetReloadArea();
    // console.log(this.getCardArea.children);
  },

  methods: {
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
        if (this.getCurrentTab.reloadArea.includes(comp.compId)) {
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
      this.getCurrentTab.sortArr = [];
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
      // this.activeObj.curCompId = tempData.compId;
      // tempData.name = `Tab${this.activeObj.children.length + 1}`;
      // if (this.activeObj.children.length === 0) {
      //   this.activeObj.firstShowTabId = tempData.compId;
      // }
      // this.activeObj.children.push(tempData);
      // console.log(index, this.activeObj);
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
    // 新增排序字段
    handleSubmit() {
      const index = this.getCurrentTab.sortArr.findIndex(
        (column) => column.id === this.currentColumnObj.id
      );
      if (index === -1) {
        // console.log(this.currentColumnObj);
        // console.log(this.getCurrentTab);
        this.getCurrentTab.sortArr.push({
          memo: this.currentColumnObj.memo,
          id: this.currentColumnObj.id,
          columnName: this.currentColumnObj.columnName,
          sort: 'ASC'
        });
        this.dialogVisible = false;
      } else {
        this.$message({
          type: 'warning',
          message: '该排序字段已存在'
        });
      }
    },
    // 删除排序
    deleteSort(index) {
      this.getCurrentTab.sortArr.splice(index, 1);
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
          size: 13, // 字体大小
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
      if (this.$route.query.isApp === '1') {
        label.width = '100%';
      }
      this.activeObj.children[1].form[idCompId] = '';
      this.activeObj.children[1].children.push(label);
    },
    // 更改是否启用按钮区
    changeCanOperate() {
      const arr =
        this.activeObj.pageType === 2
          ? this.activeObj.children[1].children
          : this.activeObj.children[0].children;
      const obj = arr.find((comp) => comp.tableCompName === 'OperateCol');
      if (obj) {
        const res = obj.children.find((btn) => this.hasTriggerComp[btn.compId]);
        if (res) {
          this.$message({
            type: 'warning',
            message: '该组件存在触发器配置，请先删除或更改该触发器'
          });
          return;
        }
      }
      this.activeObj.canOperate = !this.activeObj.canOperate;
    }
  },

  watch: {
    'getCurrentTab.sortArr': {
      handler(v) {
        this.getCurrentTab.sortStr = '';
        v.forEach((column) => {
          this.getCurrentTab.sortStr += `${this.getCurrentTab.tableInfo.tableName}.${column.columnName} ${column.sort},`;
        });
        this.getCurrentTab.sortStr = this.getCurrentTab.sortStr.slice(0, -1);
        // console.log(this.getCurrentTab.sortStr);
      },
      deep: true
    },
    filterDialog(v) {
      // console.log(v);
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
  .panelBtn {
    width: 100%;
    margin-top: 10px;
    .iconfont {
      color: $--color-primary;
    }
  }
  .tipBtn {
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
}
</style>
