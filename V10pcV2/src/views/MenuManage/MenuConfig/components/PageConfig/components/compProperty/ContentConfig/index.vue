<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ activeObj.name }}</h1>
    </header>
    <section class="contentConfig__wrapper">
      <div
        class="contentConfig__box contentConfig__hasTab"
        v-if="!activeObj.shouldTab"
      >
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用Tabs
          <el-switch
            class="contentConfig__hasTab--switch"
            :value="activeObj.showTab"
            active-text="是"
            inactive-text="否"
            @input="switchChange"
          >
          </el-switch>
        </h2>
        <apiot-button
          @click="addTab"
          class="contentConfig__hasTab--addTab"
          v-if="isShowAddTab"
        >
          <i class="iconfont icon-xinzeng m-r-4"></i
          >{{ $t('common.add', { name: 'Tabs' }) }}
        </apiot-button>
        <draggable
          v-model="activeObj.children"
          group="tabs"
          animation="300"
          handle=".icon-zongxiangtuodong"
          v-if="activeObj.showTab"
        >
          <transition-group class="contentConfig__hasTab--list">
            <li
              class="contentConfig__hasTab--tab"
              v-for="(child, index) in activeObj.children"
              :key="child.compId"
              @click="changeTab(child)"
              :class="[{ active: activeObj.curCompId === child.compId }]"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
              <apiot-input
                class="input"
                v-model="child.name"
                @focus="setBackName(child)"
                @blur="resetBackName(child)"
              ></apiot-input>

              <el-tooltip
                effect="dark"
                content="设为默认选中"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-sheweimoren m-l-10"
                  :class="[
                    { active: activeObj.firstShowTabId === child.compId },
                  ]"
                  @click="activeObj.firstShowTabId = child.compId"
                ></i
              ></el-tooltip>
              <el-tooltip
                effect="dark"
                content="隐藏"
                :enterable="false"
                placement="bottom"
                v-show="!child.notShowTab"
              >
                <i
                  class="iconfont icon-mimaxianshi m-l-10 m-r-10"
                  @click.stop="$set(child, 'notShowTab', true)"
                ></i
              ></el-tooltip>
              <el-tooltip
                effect="dark"
                content="显示"
                :enterable="false"
                placement="bottom"
                v-show="child.notShowTab"
              >
                <i
                  class="iconfont icon-yincang m-l-10 m-r-10"
                  @click.stop="$set(child, 'notShowTab', false)"
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
                  @click.stop="deleteTab(index)"
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <apiot-button
        @click="addTabTerm"
        class="contentConfig__hasTab--addTab"
        v-if="isShowAddTab"
      >
        <i class="iconfont icon-shezhi m-r-4"></i>Tabs隐藏条件
      </apiot-button>
      <div
        class="contentConfig__box contentConfig__hasTab"
        v-if="getCurrentTab && !activeObj.isSidebar"
      >
        <h2 class="contentConfig__hasTab--switchBox">
          启用Tab按钮
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showTabBtn"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>

      <div
        class="contentConfig__pBox m-b-10"
        v-if="getCurrentTab && !activeObj.isSidebar && getCurrentTab.showTabBtn"
      >
        <p class="contentConfig__p">固定位置</p>
        <el-select
          class="contentConfig__select"
          v-model="getCurrentTab.tabBtnPos"
          placeholder="请选择类型"
        >
          <el-option label="头部" :value="1"></el-option>
          <el-option label="底部" :value="2"></el-option>
        </el-select>
      </div>

      <div
        class="contentConfig__pBox"
        v-if="getCurrentTab && ![0, 1].includes(getCurrentTab.children.length)"
      >
        <p class="contentConfig__p">功能属性</p>
      </div>
      <div
        class="contentConfig__box contentConfig__hasTab m-b-10"
        v-if="getCurrentTab"
      >
        <draggable
          v-model="getCurrentTab.children"
          group="area"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group>
            <li
              class="contentConfig__hasTab--tab"
              v-for="(child, index) in getCurrentTab.children"
              :key="child.compId"
              :class="[{ active: getCurrentTab.curCompId === child.compId }]"
              v-show="index !== 0 || activeObj.isSidebar"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
              <apiot-input
                class="input m-r-10"
                style="width: 182px"
                v-model="child.name"
                @focus="setBackName(child)"
                @blur="resetBackName(child)"
              ></apiot-input>
              <el-tooltip
                effect="dark"
                content="删除"
                :enterable="false"
                placement="bottom"
              >
                <i class="iconfont icon-shanchu" @click="deleteArea(index)"></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <!-- 提交前提示 -->
      <tabs-hidden
        :visible.sync="showRuleDialog"
        :showRuleDialog="showRuleDialog"
        :activeObj="activeObj"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
      ></tabs-hidden>
      <!-- <apiot-button
        v-if="!activeObj.isSidebar"
        @click="addArea('MenuMain')"
        class="contentConfig__hasTab--addArea"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '表单区' }) }}
      </apiot-button>
      <apiot-button
        v-if="!activeObj.isSidebar && $route.query.isApp !== '1'"
        @click="addArea('TableMain')"
        class="contentConfig__hasTab--addArea"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '表格区' }) }}
      </apiot-button>
      <apiot-button
        v-if="showAddCard || $route.query.isApp == 1"
        @click="addArea('CardMain')"
        class="contentConfig__hasTab--addArea"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '卡片区' }) }}
      </apiot-button>
      <apiot-button
        v-if="showAddTree"
        @click="addArea('TreeMain')"
        class="contentConfig__hasTab--addArea"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '树区' }) }}
      </apiot-button> -->
    </section>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import TabsHidden from './TabsHidden';

export default {
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
            },
          ],
        },
      ],
      relateDialog: false,
      dialogVisible: false,
      currentRadioObj: null,
      showRuleDialog: false,
    };
  },

  components: {
    TabsHidden,
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
      // if (this.activeObj.shouldTab === false) {
      if (this.activeObj.children.length) {
        const i = this.activeObj.children.findIndex(
          (child) => child.compId === this.activeObj.curCompId,
        );
        return this.activeObj.children[i];
      }
      return null;
      // }
      // return this.activeObj;
    },
    // 是否可以更改主表
    canChangeTable() {
      let flag = false;
      if (
        this.getCurrentTab.relateTableArr &&
        this.getCurrentTab.relateTableArr.length
      ) {
        flag = true;
      } else {
        this.getCurrentTab.children.forEach((child) => {
          child.children.forEach((comp) => {
            if (
              comp.dataSource &&
              comp.dataSource.relateName === '主表' &&
              comp.dataSource.tableName
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
        const index = this.activeObj.children.findIndex(
          (child) => child.areaType === 2,
        );
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {};
    },
    // 是否展示新增tab
    isShowAddTab() {
      if (this.activeObj.showTab && this.activeObj.isSidebar) {
        if (this.activeObj.children.length >= 2) {
          return false;
        }
      }
      return this.activeObj.showTab;
    },
    // 是否展示新增卡片
    showAddCard() {
      if (this.activeObj.isSidebar && this.getCurrentTab) {
        if (this.getCurrentTab.children.length >= 1) {
          return false;
        }
      }
      return this.activeObj.isSidebar;
    },
    showAddTree() {
      if (this.activeObj.isSidebar && this.getCurrentTab) {
        if (this.getCurrentTab.children.length >= 1) {
          return false;
        }
      }
      return true;
    },
  },

  mounted() {},

  methods: {
    // 添加tab
    addTab() {
      const compId = createUnique();
      const tempData = {
        compId,
        name: `Tab${this.activeObj.children.length + 1}`,
        showTabBtn: false,
        notShowTab: false, // 是否显示tab
        tabBtnPos: 1, // 1顶部 2 底部
        canChangeName: true, // 能否修改名字
        children: [],
      };
      if (!this.activeObj.isSidebar) {
        tempData.children.push({
          name: 'Tab按钮区',
          showH1: true,
          compName: 'BtnsArea',
          propertyCompName: 'BtnsAreaConfig',
          compId: createUnique(),
          children: [],
          areaType: 2,
          rightIndex: 0,
          appSort: 1,
          appRadius: 1, // 按钮区排列
          appStyle: 1, // 按钮区风格
          tabBtnArea: true, // tab 区的按钮区
        });
      }
      this.activeObj.children.push(tempData);
      this.activeObj.curCompId = compId;
    },
    // 添加tab隐藏条件
    addTabTerm() {
      this.showRuleDialog = true;
    },
    // 添加Area
    addArea(compName) {
      if (this.activeObj.children.length === 0) {
        this.addTab();
        this.activeObj.firstShowTabId = this.activeObj.children[0].compId;
      }
      const idCompId = createUnique();
      const area = {
        name: '功能区',
        compId: createUnique(),
        form: {},
        rules: {},
        children: [
          {
            areaType: 1,
            backName: 'label控件',
            canReadonly: false,
            canShow: true,
            compId: idCompId,
            compName: 'Label',
            compType: 15,
            dataSource: {
              alias: '',
              columnName: 'id',
              columnTypeDict: 1,
              dictObj: null,
              mainColumnInfo: null,
              relateName: '主表',
              tableName: '',
            },
            dragCard: true,
            enableDict: false,
            enableDictIcon: false,
            enableIcon: false,
            enableMultiColumn: false,
            font: { color: '#333333', size: 14, style: 1 },
            helpInfo: '',
            icon: { icon: '', color: '', imageUrl: '' },
            imgUrl: 'baseComp/Label.svg',
            labelBg: { color: '#ffffff', style: 0 },
            labelName: 'label',
            multiTable: {
              table: { tableName: '', id: '' },
              column: { columnName: '', id: '', columnTypeDict: 0 },
            },
            name: 'id',
            pane: { name: '', columnName: '', paramArr: [] },
            placeholder: '请选择数据',
            propertyCompName: 'LabelConfig',
            shouldRequired: true,
            showLabelTitle: true,
            showTreeText: false,
            singleStatus: 4,
            submitType: 1,
            width: '100%',
          },
        ],
        areaType: 1,
      };
      area.form[idCompId] = '';

      const tempObj = {
        compId: createUnique(),
        compName,
        pageType: 1,
        shouldTab: true,
        areaType: 1,
        showTitle: false, // 显示标题
        canChangeName: true, // 标记名字是否可以变更，用于组件树上名字的替换
        tableInfo: {
          tableName: '',
          id: 0,
          nameAlias: '',
        },
        relateTableArr: [],
        relateTableIndex: 0,
        children: [area],
        filterTermType: 1, // 1 是普通 2是sql
        filterTermStr: '', // 普通字符串
        filterTermSql: '', // sql字符串
        termParams: '', // 过滤条件需要的组件参数id
        shouldInit: true, // 是否初始化
        reloadArea: [], // 要刷新的区域
      };
      if (compName === 'CardMain') {
        this.getCurrentTab.children.push({
          name: '卡片区',
          propertyCompName: 'CardMainConfig',
          hasPagination: false, // 是否启用分页
          rowNum: 10, // 分页条数
          sortArr: [], // 排序数组
          sortStr: '', // 排序字符串
          hasCardIcon: false, // 是否有卡片图标
          iconId: '', // 卡片图标来源的组件id
          iconColorId: '', // 卡片图标颜色来源的组件id
          ...tempObj,
        });
      } else if (compName === 'TreeMain') {
        const treeObj = {
          name: '树区',
          propertyCompName: 'TreeMainConfig',
          isTree: true, // 是否是树区
          treeType: 1, // 1 是全树 2 是节点树
          parentId: 0,
          hasTreeIcon: false, // 是否有树区固定图标
          treeIcon: {
            icon: '',
            color: '',
            imageUrl: '',
          }, // 树的固定图标
          linkSymbol: '', // 链接符
          hasCardIcon: false, // 是否启用组件字典图标
          iconId: '', // 组件字典图标来源的组件id
          iconColorId: '', // 组件字典图标颜色来源的组件id
          ...JSON.parse(JSON.stringify(tempObj)), // 要更改children防止污染
          pageType: 2,
        };
        // 默认是第二个，需要插入按钮区搜索，按钮区不展示，默认有搜索
        treeObj.children.unshift({
          areaType: 2,
          children: [
            {
              areaType: 2,
              canReadonly: false,
              canSearch: true,
              canShow: true,
              compId: createUnique(),
              compName: 'SearchCondition',
              compType: 16,
              dragCard: true,
              highCompArr: [],
              highStyle: 2,
              hisSearch: false,
              imgUrl: 'baseComp/SearchCondition.svg',
              name: '搜索框',
              placeholder: '请输入关键字搜索',
              propertyCompName: 'SearchConditionConfig',
              searchCompArr: [],
              shouldHigh: false,
            },
          ],
          compId: createUnique(),
          name: '按钮区',
          rightIndex: 1,
        });
        // 下面插入按钮区
        console.log(treeObj.children[1].children);
        treeObj.children[1].children.unshift({
          name: '操作',
          compName: 'BtnsArea',
          compId: createUnique(),
          children: [],
          dataSource: {
            columnName: '',
          },
        });
        this.getCurrentTab.children.push(treeObj);
      } else if (compName === 'TableMain') {
        this.getCurrentTab.children.push({
          name: '表格区',
          propertyCompName: 'TableMainConfig',
          required: false, // 是否必填
          showNum: false, // 是否显示序号
          selectType: 0, // 多选类型 0 无 1 是多选 2是单选
          canOperate: false, // 是否启用操作列
          showLine: 5, // 显示行数
          lineEditable: false, // 是否启用行编辑
          fixedLeft: 0, // 左侧固定列
          fixedRight: 0, // 右侧固定列
          hasPagination: false, // 是否启用分页
          rowNum: 10, // 分页条数
          sortArr: [], // 排序数组
          sortStr: '', // 排序字符串
          ...tempObj,
        });
      } else {
        this.getCurrentTab.children.push({
          name: '表单区',
          propertyCompName: 'MenuMainConfig',
          ...tempObj,
        });
      }
      console.log(this.getCurrentTab.children);
    },
    // 是否打开tab切换
    async switchChange() {
      // console.log(this.activeObj.showTab);
      if (this.activeObj.showTab) {
        try {
          await this.$confirm('将关闭除当前tab内容外的其他tab', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning',
          });
          this.activeObj.showTab = false;
        } catch (error) {
          // console.log(error);
        }
      } else {
        try {
          await this.$confirm(
            '将打开tab，若之前未配置tab页，当前配置默认为第一个tab的配置',
            {
              confirmButtonText: this.$t('common.sure'),
              cancelButtonText: this.$t('common.cancle'),
              type: 'warning',
            },
          );
          if (this.activeObj.children.length === 0) {
            this.addTab();
          }
          this.activeObj.showTab = true;
        } catch (error) {
          // console.log(error);
        }
      }
    },
    // 是否打开tab头部
    switchBtnChange() {},
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
    // 删除tab
    deleteTab(index) {
      if (this.activeObj.children.length === 1) {
        return this.$message({
          type: 'warning',
          message: '区域下至少有一个tab',
        });
      }
      const tab = this.activeObj.children[index];
      const { paneObj } = this.configData[0];
      let flag = false;
      console.log(tab);
      tab.children.forEach((area, i) => {
        if (i === 0) {
          area.children.forEach((comp) => {
            if (paneObj && paneObj[comp.compId]) {
              delete paneObj[comp.compId];
            }
          });
          if (!flag) {
            flag = this.sureTrigger(area.children);
          }
        } else if (!flag) {
          flag = this.deleteArea(i, false);
        }
      });
      if (!flag) {
        this.activeObj.children.splice(index, 1);
        this.activeObj.curCompId = this.activeObj.children[0].compId;
      } else {
        this.$message({
          type: 'warning',
          message: '该区域下组件存在触发器配置，请先删除相关的触发器配置',
        });
      }
      // console.log(this.activeObj);
    },
    // 删除区域
    deleteArea(index, isDelete = true) {
      const curArea = this.getCurrentTab.children[index];
      let flag = false;
      curArea.children.forEach((box) => {
        if (!flag) {
          flag = this.sureTrigger(box.children);
        }
      });
      // 删除区域
      if (!flag) {
        if (isDelete) {
          this.getCurrentTab.children.splice(index, 1);
        }
        return false;
      }
      if (isDelete) {
        this.$message({
          type: 'warning',
          message: '该区域下组件存在触发器配置，请先删除相关的触发器配置',
        });
      }
      return true;
    },
    sureTrigger(compArr) {
      const i = compArr.findIndex((btn) => {
        if (this.hasTriggerComp[btn.compId]) {
          return true;
        }
        return false;
      });
      if (i !== -1) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
.contentConfig {
  height: 100%;

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
  &__pBox {
    padding: 0 10px;
  }
  &__p {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }
  &__select {
    width: 100%;
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
      margin: 0 10px;
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
        width: 148px;
        ::v-deep {
          .el-input__inner {
            height: 28px;
            line-height: 28px;
          }
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
    &--addTab,
    &--addArea {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng,
      .icon-shezhi {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-bottom: 10px;
    }
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
}
</style>
