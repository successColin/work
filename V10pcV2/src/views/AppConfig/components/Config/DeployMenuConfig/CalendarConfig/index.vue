<template>
  <div class="calendar__body">
    <h2 class="calendar__body--head">默认展示视图</h2>
    <el-select
      class="calendar__body--select"
      v-model="activeObj.calendar.viewStyle"
    >
      <el-option label="月视图" :value="1"></el-option>
      <el-option label="周视图" :value="2"></el-option>
    </el-select>
    <h2 class="calendar__body--head">业务标记样式</h2>
    <el-select
      class="calendar__body--select"
      v-model="activeObj.calendar.signStyle"
    >
      <el-option label="背景色" :value="1"></el-option>
      <el-option label="红点" :value="2"></el-option>
    </el-select>
    <p class="calendar__body--switch m-t-10">
      启用公告
      <el-switch
        class="switch"
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="2"
        v-model="activeObj.calendar.enableAnnounce"
      >
      </el-switch>
    </p>
    <apiot-button @click="addTabTerm" class="contentConfig__hasTab--addTab">
      <i class="iconfont icon-shezhi m-r-4"></i>业务隐藏条件
    </apiot-button>
    <!-- 提交前提示 -->
    <tabs-hidden
      :visible.sync="showRuleDialog"
      :showRuleDialog="showRuleDialog"
      :activeObj="activeObj.calendar"
      :configData="configData"
      :triggerCompMap="triggerCompMap"
    ></tabs-hidden>
    <!-- 新增业务 -->
    <apiot-button
      @click="addBusinessTerm"
      class="contentConfig__hasTab--addTab"
    >
      <i class="iconfont icon-shezhi m-r-4"></i>新增业务
    </apiot-button>
    <draggable
      v-model="activeObj.calendar.menuArr"
      group="tabs"
      animation="300"
      handle=".icon-zongxiangtuodong"
    >
      <transition-group class="funcGroupConfig__list" tag="ul">
        <li
          class="funcGroupConfig__tab"
          v-for="(child, i) in activeObj.calendar.children"
          :key="child.compId"
        >
          <div class="funcGroupConfig__top">
            <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-10"></i>
            <p class="compName" @click.stop="changeBusiness(i)">
              {{ child.name }}
            </p>
            <el-tooltip
              effect="dark"
              content="删除"
              :enterable="false"
              placement="bottom"
            >
              <i
                class="iconfont icon-shanchu m-r-14 m-l-10"
                v-if="!child.isFixed"
                @click="deleteChild(i)"
              ></i
            ></el-tooltip>
            <i
              class="iconfont icon-dingbugengduoyincang m-l-14 m-r-10"
              @click.stop="changeBusiness(i)"
              :class="{ current: businessIndex === i }"
            ></i>
          </div>
          <div
            class="funcGroupConfig__content"
            :class="{ show: businessIndex === i }"
          >
            <h2 class="calendar__body--head">名称</h2>
            <apiot-input
              @focus="nameFocus"
              @blur="nameBlur"
              v-model="child.name"
              placeholder="请输入业务名称"
            ></apiot-input>
            <h2 class="calendar__body--head">常态图标</h2>
            <div class="iconSelect">
              <IconSelect
                :shouldScale="true"
                @iconSelected="iconSelected($event, child.icon)"
                :item="child.icon"
                :iconType="2"
                :isApp="true"
              ></IconSelect>
              <p class="iconSelect__tip">
                提示：请添加一个对应功能识别度高的图标
              </p>
            </div>
            <h2 class="calendar__body--head">关联类型</h2>
            <el-radio v-model="child.relateType" :label="1">弹出面板</el-radio>
            <el-radio v-model="child.relateType" :label="2">跳转菜单</el-radio>
            <div style="margintop: 10px">
              <apiot-button
                v-if="child.relateType === 2"
                class="panelBtn"
                @click="handleJumpMenuConfig(1)"
              >
                <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
              </apiot-button>
              <apiot-button
                v-if="child.relateType === 1"
                class="panelBtn"
                @click="handleJumpPaneConfig(1)"
              >
                <i class="iconfont icon-shezhi m-r-4"></i>跳转面板配置
              </apiot-button>
            </div>
            <h2 class="calendar__body--head">汇总展示</h2>
            <el-select
              class="calendar__body--select"
              v-model="child.summaryStyle"
            >
              <el-option label="单值" :value="1"></el-option>
              <el-option label="双值" :value="2"></el-option>
            </el-select>
            <h2 class="calendar__body--head">数据表</h2>
            <filterable-input
              ref="singleTable"
              placeholder="数据表"
              :dialogType="1"
              :showInfo="child.tableObj"
              @selectRes="fatherFun"
            ></filterable-input>
            <h2 class="calendar__body--head">时间字段</h2>
            <filterable-input
              ref="filterableInput"
              placeholder="请选择字段"
              :tableName="child.tableObj.tableName"
              :showInfo="child.columnObj"
              :dialogType="2"
              :notShowSys="true"
              @selectRes="selectColumnRes"
            ></filterable-input>
            <apiot-button
              @click="addCompleteTerm('complete')"
              class="contentConfig__hasTab--addTab"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>已完成条件
            </apiot-button>
            <span></span>
            <apiot-button
              @click="addCompleteTerm('incomplete')"
              class="contentConfig__hasTab--addTab"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>未完成条件
            </apiot-button>
          </div>
        </li>
      </transition-group>
    </draggable>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      ref="ToMenuConfig"
      v-if="showMenuConfig"
      :visible.sync="showMenuConfig"
      :activeObj="skipMenuConfig"
      :sourceType="1"
      :isApp="1"
      @cancle-click="handleMenuCancel"
    ></ToMenuConfig>
    <PanelConfig
      v-if="showPaneConfig"
      :visible.sync="showPaneConfig"
      :activeObj="skipPaneConfig"
      :tabPaneConfig="tabPaneConfig"
      :isSelPanel="false"
      :otherParams="{ panelType: 5, unDesign: 1, panelClassify: 1 }"
      @cancle-click="handleCancel"
      :isCustomPage="true"
      :treeType="5"
      :isApp="1"
      ref="panelConfig"
    ></PanelConfig>
    <CompleteConfig
      v-if="showCompleteConfig"
      :visible.sync="showCompleteConfig"
      :title="completeTitle"
      :configData="completeData"
      :tableInfo="activeObj.calendar.children[businessIndex].tableObj"
      @changeTerm="changeTerm"
    ></CompleteConfig>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import ToMenuConfig from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
import PanelConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import TabsHidden from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/TabsHidden/index';
import IconSelect from '_v/MenuManage/components/IconSelect';
import CompleteConfig from './CompleteConfig';

export default {
  name: '',
  props: {
    activeObj: {
      type: Object,
    },
    tableInfo: {
      tableName: '',
      id: 0,
      nameAlias: '',
    },
    configData: [],
    triggerCompMap: {},
    content: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      showRuleDialog: false,
      showMenuConfig: false,
      showPaneConfig: false,
      businessIndex: -1,
      showCompleteConfig: false,
      completeData: [],
      completeTitle: '',
      completeType: '',
    };
  },
  components: {
    TabsHidden,
    IconSelect,
    ToMenuConfig,
    PanelConfig,
    CompleteConfig,
  },
  watch: {
    contentProps: {
      handler() {
        this.$emit('change', this.curContent);
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    skipMenuConfig() {
      const { businessIndex, activeObj } = this;
      const { calendar } = activeObj;
      const { children } = calendar;
      return children[businessIndex].skipMenuConfig || [];
    },
    skipPaneConfig() {
      const { businessIndex, activeObj } = this;
      const { calendar } = activeObj;
      const { children } = calendar;
      const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
      return children[businessIndex].skipPaneConfig || initObj;
    },
    tabPaneConfig() {
      const { businessIndex, activeObj } = this;
      const { calendar } = activeObj;
      const { children } = calendar;
      const { curPaneObj } = children[businessIndex].skipPaneConfig || {};
      console.log(curPaneObj, 'curPaneObj');
      return curPaneObj || {};
    },
  },
  mounted() {
    // 获取事件字典
    this.$store.dispatch('getCurrentDict', 'INSPECTION_TASK_TYPE');
  },
  methods: {
    init() {
      const { contentProps } = this.content;
      if (contentProps) this.contentProps = JSON.parse(contentProps);
      // const { skipPaneConfig, skipMenuConfig } = this.contentProps;
      // const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
      // this.skipMenuConfig = skipMenuConfig || [];
      // this.skipPaneConfig = skipPaneConfig || initObj;
      if (this.getCurrentTab.filterTermStr) {
        this.termObj = JSON.parse(
          this.getCurrentTab.filterTermStr.replace(/\\/g, ''),
        );
        // console.log(this.termObj);
      }
    },
    // 添加业务隐藏条件
    addTabTerm() {
      this.showRuleDialog = true;
    },
    addBusinessTerm() {
      this.activeObj.calendar.children.push({
        compId: createUnique(),
        name: '业务名称', // 业务名称
        bgColor: '', // 背景色
        enableGradient: 0, // 是否渐变
        // 渐变色
        gradientObj: {
          color1: 'rgba(255,255,255,0)',
          color2: 'rgba(255,255,255,0)',
          color3: 'rgba(255,255,255,0)',
        },
        // 图片
        bgImgUrl: '',
        // 描述
        des: '',
        summaryStyle: 1, // 汇总展示
        contentProps: '', // 跳转配置信息
        icon: {
          icon: '',
          color: '',
          imageUrl: '',
        },
        tableObj: {
          // 表
          id: '',
          tableName: '',
          memo: '',
        },
        columnObj: {
          // 字段
          id: '',
          columnName: '',
          columnTypeDict: '',
        },
        completeFilter: {},
        incompleteFilter: {},
      });
      this.businessIndex = this.activeObj.calendar.children.length - 1;
    },
    deleteChild(i) {
      this.activeObj.calendar.children.splice(i, 1);
    },
    selectColumnRes(table) {
      this.activeObj.calendar.children[this.businessIndex].columnObj.id =
        table.id;
      this.activeObj.calendar.children[
        this.businessIndex
      ].columnObj.columnName = table.columnName;
      this.activeObj.calendar.children[
        this.businessIndex
      ].columnObj.columnTypeDict = table.columnTypeDict;
    },
    selectRes() {},
    // 父表值
    fatherFun(v) {
      // this.ruleForm.table1 = v.tableName;
      this.activeObj.calendar.children[this.businessIndex].tableObj = {
        id: v.id,
        tableName: v.tableName,
        memo: v.memo,
      };
    },
    handleJumpMenuConfig() {
      this.showMenuConfig = true;
    },
    handleJumpPaneConfig() {
      this.showPaneConfig = true;
    },
    handleCancel() {
      const { curPaneObj, activeObj } = this.$refs.panelConfig;
      const value = {
        curPaneObj,
        activeObj,
      };
      this.activeObj.calendar.children[this.businessIndex].skipPaneConfig =
        value;
      console.log(this.activeObj);
    },
    handleMenuCancel() {
      const { menuList = [] } = this.$refs.ToMenuConfig;
      console.log(menuList);
      this.activeObj.calendar.children[this.businessIndex].skipMenuConfig =
        menuList;
      console.log(this.activeObj);
    },
    // 名字的失焦恢复
    nameFocus() {
      this.activeObj.calendar.backName = this.activeObj.calendar.menuName;
    },
    async nameBlur() {
      const child = this.activeObj;
      if (!child.menuName) {
        child.menuName = child.backName;
      }
      if (child.menuName) {
        if (child.menuName !== child.backName) {
          try {
            if (child.id) {
              this.addConfigMenu();
            }
          } catch (error) {
            child.menuName = child.backName;
          }
        }
      }
    },
    iconSelected(obj, item) {
      item.icon = obj.icon;
      item.color = obj.color;
      item.imageUrl = obj.imageUrl;
    },
    changeBusiness(i) {
      if (this.businessIndex !== i) {
        this.businessIndex = i;
      } else {
        this.businessIndex = -1;
      }
    },
    addCompleteTerm(type) {
      const init = {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [], // 条件数组
      };
      if (type === 'complete') {
        const filter =
          this.activeObj.calendar.children[this.businessIndex].completeFilter;
        this.completeData = JSON.stringify(filter) !== '{}' ? filter : init;
        this.completeTitle = '已完成条件';
      } else {
        const filter =
          this.activeObj.calendar.children[this.businessIndex].incompleteFilter;
        this.completeData = JSON.stringify(filter) !== '{}' ? filter : init;
        this.completeTitle = '未完成条件';
      }
      console.log(this.completeData);
      this.completeType = type;
      this.showCompleteConfig = true;
    },
    changeTerm(data) {
      if (this.completeType === 'complete') {
        this.activeObj.calendar.children[this.businessIndex].completeFilter =
          data;
        this.completeTitle = '已完成条件';
      } else if (this.completeType === 'incomplete') {
        this.activeObj.calendar.children[this.businessIndex].incompleteFilter =
          data;
        this.completeTitle = '未完成条件';
      }
      console.log(this.activeObj.calendar);
    },
  },
};
</script>

<style lang="scss" scoped>
.calendar__body {
  padding-bottom: 20px;
  ::v-deep {
    .el-collapse-item__header {
      border-bottom: 0 none;
      height: 30px;
      line-height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    .el-collapse-item__wrap {
      border-bottom: 0px none;
    }
    .el-collapse-item__content {
      padding-bottom: 10px;
    }
    .contentConfig__hasTab--addTab,
    .form__line {
      width: 100%;
      margin-top: 10px;
      .filterableInput {
        width: 100%;
      }
    }
    .form__line {
      flex-direction: column;
    }
    .funcGroupConfig__tab {
      overflow: hidden;
    }
    .icon-shezhi {
      color: $--color-primary;
    }
    .funcGroupConfig__top {
      height: 36px;
      display: flex;
      align-items: center;
      float: left;
      width: 100%;
      .compName {
        flex: 1;
        font-size: 14px;
        color: #333333;
        font-weight: 600;
        cursor: pointer;
      }
      .iconfont {
        font-size: 16px;
        color: #bbc3cd;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
      .icon-dingbugengduoyincang,
      .icon-shanchu {
        margin-left: 10px;
        margin-right: 0px;
      }
      .current {
        transform: rotate(180deg);
        color: $--color-primary;
        transition-duration: 0.2s;
      }
      .icon-shanchu {
        font-size: 16px;
      }
      .icon-zongxiangtuodong {
        cursor: move;
        margin-left: 0px;
      }
    }
    .panelBtn {
      width: 100%;
    }
    .funcGroupConfig__content {
      height: 0;
      transition-property: height;
      transition-duration: 0.5s;
      clear: both;
    }
    .show {
      // height: auto;
      height: 530px;
    }
    .iconSelect {
      display: flex;
      align-items: center;
      .iconSelect__tip {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #aaaaaa;
        margin-left: 10px;
      }
      .scaleClass {
        width: 32px;
        height: 32px;
        line-height: 32px;
        position: relative;
        border: 1px dashed #d9d9d9;
        background: #ffffff;
        border-radius: 4px;
        text-align: center;
        box-sizing: border-box;
        cursor: pointer;
        will-change: transform;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  &--head {
    margin-top: 10px;
    line-height: 30px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }
  &--switch {
    position: relative;
    display: flex;
    height: 30px;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    .switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
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
  &--select {
    width: 100%;
  }
  &--number {
    width: 100%;
    ::v-deep {
      .el-input__inner {
        text-align: left;
      }
    }
  }
  &--btn {
    width: 100%;
    height: 30px;
    margin: 0;
    .iconfont {
      color: $--color-primary;
    }
  }
}
</style>
