<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ isBtnArea ? '按钮区' : '甘特图区' }}</h1>
    </header>
    <section class="contentConfig__wrapper" v-if="!isBtnArea">
      <div
        class="contentConfig__box contentConfig__hasTab"
        v-if="!isSelect && !isUser"
      >
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
      <div class="contentConfig__box contentConfig__hasTab" v-if="!isUser">
        <h2 class="contentConfig__hasTab--switchBox">
          是否隐藏该区域
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.notShowArea"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div
        class="contentConfig__box contentConfig__hasTab"
        v-if="!isSelect && !isUser"
      >
        <h2 class="contentConfig__hasTab--switchBox">
          是否显示树形甘特图
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.isTreeGantt"
            active-text="是"
            inactive-text="否"
            :disabled="!!getCurrentTab.tableInfo.tableName"
            @change="isTreeChange"
          >
          </el-switch>
        </h2>
      </div>
      <div
        class="contentConfig__box contentConfig__dataSource"
        v-if="getCurrentTab.children.length"
      >
        <!-- <h2>关联数据源</h2>
        <el-select
          :disabled="true"
          placeholder="请选择数据源"
          :value="1"
          class="contentConfig__dataSource--select"
        >
          <el-option label="数据库" :value="1"></el-option>
        </el-select> -->
        <h2 class="contentConfig__dataSource--h2">
          业务表<el-tooltip
            content="当业务表被关系关联，或者被组件使用时不允许更改"
            placement="top"
            ><i class="iconfont icon-bangzhu"
          /></el-tooltip>
        </h2>

        <filterable-input
          ref="tableFilter"
          placeholder="请选择关联表"
          title="关联表"
          :dialogType="1"
          :isTree="getCurrentTab.isTreeGantt"
          :disabled="canChangeTable"
          :showInfo="getCurrentTab.tableInfo"
          @selectRes="selectTable"
        ></filterable-input>
        <h2 v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && false">
          关联表
        </h2>
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-bottom: 10px"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && false"
          @click="
            currentRadioObj = null;
            relateDialog = true;
          "
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>配置关联表
        </apiot-button>
        <!-- <br /> -->
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-left: 0; margin-top: 10px"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && !isSelect"
          @click="
            currentRadioObj = null;
            filterDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>设置过滤条件
        </apiot-button>
        <h2 v-if="getCurrentTab && getCurrentTab.tableInfo.tableName">
          开始时间字段
        </h2>
        <filterable-input
          :key="1"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName"
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.startTime"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="3"
          @selectRes="selectColumnRes($event, 'startTime')"
        ></filterable-input>
        <h2 v-if="getCurrentTab && getCurrentTab.tableInfo.tableName">
          结束时间字段
        </h2>
        <filterable-input
          :key="2"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName"
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.endTime"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="3"
          @selectRes="selectColumnRes($event, 'endTime')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
        >
          周期间隔字段
        </h2>
        <filterable-input
          :key="3"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.interval"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="1,2"
          @selectRes="selectColumnRes($event, 'interval')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
        >
          周期间隔单位字段
          <!-- 值需要与系统字典TIME_TYPE对应 -->
        </h2>
        <filterable-input
          :key="4"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.intervalUnit"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="1,2"
          @selectRes="selectColumnRes($event, 'intervalUnit')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
        >
          周期是否固定字段
          <!-- 值需要与系统字典CYCLE_TYPE对应 -->
        </h2>
        <filterable-input
          :key="5"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.cycle"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="1,2"
          @selectRes="selectColumnRes($event, 'cycle')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
        >
          历史数据关联当前字段
        </h2>
        <filterable-input
          :key="6"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            !getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.associatedColumn"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="1,2"
          @selectRes="selectColumnRes($event, 'associatedColumn')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            getCurrentTab.isTreeGantt
          "
        >
          父子关连字段
        </h2>
        <filterable-input
          :key="7"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.parentId"
          :dialogType="2"
          :notShowSys="false"
          :disabled="true"
          columnTypes="1,2"
          @selectRes="selectColumnRes($event, 'parentId')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            getCurrentTab.isTreeGantt
          "
        >
          进度字段
        </h2>
        <filterable-input
          :key="8"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.progress"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="1,2,4"
          @selectRes="selectColumnRes($event, 'progress')"
        ></filterable-input>
        <h2
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            getCurrentTab.isTreeGantt
          "
        >
          连接线字段
        </h2>
        <filterable-input
          :key="9"
          v-if="
            getCurrentTab &&
            getCurrentTab.tableInfo.tableName &&
            getCurrentTab.isTreeGantt
          "
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.tableInfo.tableName"
          :showInfo="activeObj.taskColumn.links"
          :dialogType="2"
          :notShowSys="true"
          columnTypes="1,2"
          @selectRes="selectColumnRes($event, 'links')"
        ></filterable-input>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="!isUser">
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
      <div class="contentConfig__box" v-if="!isSelect && !isUser">
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
        class="contentConfig__box m-b-10"
        v-if="!isSelect && !isUser && false"
      >
        <h2>表格高度</h2>
        <el-select
          v-model="getCurrentTab.showLine"
          style="width: calc(100% - 20px)"
          class="p-l-10 p-r-10"
        >
          <el-option label="自适应" :value="5"></el-option>
          <el-option label="10" :value="10"></el-option>
          <el-option label="20" :value="20"></el-option>
          <el-option label="30" :value="30"></el-option>
          <el-option label="40" :value="40"></el-option>
        </el-select>
      </div>
      <div
        class="contentConfig__box contentConfig__hasTab"
        v-if="!getCurrentTab.lineEditable && !isSelect && !isUser && false"
      >
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
        v-show="getCurrentTab.hasPagination && getCurrentTab.showLine !== 5"
        v-if="!isSelect"
      >
        <h2>每页默认条数</h2>
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
        v-if="getCurrentTab && getCurrentTab.tableInfo.tableName && false"
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
      <el-collapse v-model="activeNames" class="collapse">
        <el-collapse-item title="高级配置" name="1">
          <h2 class="contentConfig__hasTab--switchBox">
            启用视图切换
            <el-switch
              class="contentConfig__hasTab--switch"
              v-model="getCurrentTab.viewChange"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </h2>
          <h2
            class="contentConfig__hasTab--switchBox m-t-10"
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.isTreeGantt
            "
          >
            启用新增按钮
            <el-switch
              class="contentConfig__hasTab--switch"
              v-model="getCurrentTab.enableAdd"
              active-text="是"
              inactive-text="否"
              @change="enableAddChange"
            >
            </el-switch>
          </h2>
          <!-- <h2 class="contentConfig__hasTab--switchBox m-t-10">
            启用时间段筛选
            <el-switch
              class="contentConfig__hasTab--switch"
              v-model="getCurrentTab.timeFilter"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </h2> -->
          <h2 class="contentConfig__hasTab--switchBox m-t-10">
            启用便捷筛选
            <el-switch
              class="contentConfig__hasTab--switch"
              v-model="getCurrentTab.highFilter"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </h2>
          <h2
            class="contentConfig__hasTab--switchBox m-t-10"
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              !getCurrentTab.isTreeGantt
            "
          >
            启用状态筛选
            <el-switch
              class="contentConfig__hasTab--switch"
              v-model="getCurrentTab.stateFilter"
              active-text="是"
              inactive-text="否"
            >
            </el-switch>
          </h2>
          <h2
            class="contentConfig__hasTab--switchBox"
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.stateFilter
            "
          >
            字典表
          </h2>
          <filterable-input
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.stateFilter
            "
            ref="filterableInput"
            placeholder="请选择字典"
            :showInfo="activeObj.taskDict"
            :hasPagination="true"
            :dialogType="3"
            @selectRes="selectDict"
          ></filterable-input>
          <h2
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.stateFilter
            "
          >
            状态字段
          </h2>
          <filterable-input
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.stateFilter
            "
            :key="6"
            ref="filterableInput"
            placeholder="请选择字段"
            :tableName="activeObj.tableInfo.tableName"
            :showInfo="activeObj.taskColumn.state"
            :dialogType="2"
            :notShowSys="true"
            columnTypes="1,2"
            @selectRes="selectColumnRes($event, 'state')"
          ></filterable-input>
          <h2
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.stateFilter &&
              activeObj.taskColumn.state.columnName
            "
          >
            是否是当前数据状态条件
          </h2>
          <div
            class="contentConfig__box stateTerm"
            v-if="
              getCurrentTab &&
              getCurrentTab.tableInfo.tableName &&
              getCurrentTab.stateFilter &&
              activeObj.taskColumn.state.columnName
            "
          >
            <apiot-input
              class="left"
              disabled
              :value="activeObj.taskColumn.state.columnName"
            ></apiot-input>
            <el-select
              v-model="activeObj.taskColumn.state.lamba"
              class="center"
              placeholder=""
            >
              <el-option label="=" value="="></el-option>
              <el-option label="!=" value="!="></el-option>
            </el-select>
            <el-input-number
              class="right"
              placeholder=""
              v-model="activeObj.taskColumn.state.value"
              :controls="false"
              :precision="0"
            ></el-input-number>
          </div>
          <div class="contentConfig__box" v-if="!isSelect">
            <h2 style="padding-left: 0">关联类型</h2>
            <el-radio v-model="getCurrentTab.relateType" :label="1"
              >弹出面板</el-radio
            >
            <el-radio v-model="getCurrentTab.relateType" :label="2"
              >跳转菜单</el-radio
            >
            <apiot-button
              class="panelBtn"
              v-if="getCurrentTab.relateType === 1"
              @click="showPanelConfig = true"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
            </apiot-button>
            <apiot-button
              class="panelBtn"
              v-if="getCurrentTab.relateType === 2"
              @click="showMenuConfig = true"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
            </apiot-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </section>
    <!-- 按钮区 -->
    <BtnsAreaConfig
      v-if="isBtnArea"
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
    <ToPanelConfig
      :visible.sync="showPanelConfig"
      v-if="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :isSelPanel="false"
      :panelCompId.sync="activeObj.textPanelId"
      :triggerCompMap="triggerCompMap"
      :getAllcheck="getAllcheck"
      :panelRow="panelRow"
    ></ToPanelConfig>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      :visible.sync="showMenuConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
    ></ToMenuConfig>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import BtnsAreaConfig from '../ContentConfig/BtnsAreaConfig';
import FilterTerm from '../ContentConfig/FilterTerm';
import RelateTableDialog from '../ContentConfig/RelateTableDialog';
import ToMenuConfig from '../ContentConfig/ToMenuConfig';
import ToPanelConfig from '../ContentConfig/ToPanelConfig';
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
    isSelect: {
      type: Boolean,
    },
    isUser: {
      type: Boolean,
      default: false,
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
      currentColumnObj: null,
      filterDialog: false,
      activeNames: '',
      showPanelConfig: false,
      showMenuConfig: false,
    };
  },

  components: {
    RelateTableDialog,
    BtnsAreaConfig,
    FilterTerm,
    ToMenuConfig,
    ToPanelConfig,
  },

  computed: {
    // 选择面板是否有新增按钮
    hasAddbtn() {
      if (this.isSelect && this.configData[0].selShowType === 1) {
        return this.activeObj.children[0].children.length === 1;
      }
      return false;
    },
    // 获取当前页面的类型
    getCurPageType() {
      if (this.getCurrentTab) {
        return this.getCurrentTab.pageType;
      }
      return -1;
    },
    // 获取当前的tab
    getCurrentTab() {
      // console.log(this.activeObj);
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
        const index = this.activeObj.children.findIndex(
          (child) => child.areaType === 2,
        );
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {
        children: [],
      };
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
    // 获取开启了字典的label或者有字典的组件
    getDictLable() {
      // console.log();
      return this.getCardArea.children.filter((child) => {
        if (child.enableDict) {
          return true;
        }
        if ([2, 3, 4].includes(child.compType)) {
          return true;
        }
        return false;
      });
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
  },

  mounted() {
    this.resetReloadArea();
    if (this.getCurrentTab.notShowArea == null) {
      this.$set(this.getCurrentTab, 'notShowArea', false);
    }

    if (this.activeObj.children.length === 1) {
      this.activeObj.pageType = 2;
      this.activeObj.children.unshift({
        name: '按钮区',
        compId: createUnique(),
        children: [],
        areaType: 2,
        rightIndex: 0,
        appSort: 1,
        appRadius: 1, // 按钮区排列
        appStyle: 1, // 按钮区风格
      });
    }
  },

  methods: {
    enableAddChange() {
      if (this.activeObj.enableAdd) {
        this.addBtnComp();
      } else {
        this.activeObj.children[0].children.shift();
      }
    },
    // 添加新增按钮
    addBtnComp() {
      const idCompId = createUnique();
      const btn = {
        noDragForm: true,
        name: '新增', // 按钮名称
        areaType: 2, // 表示在按钮区
        dragCard: true, // 是否允许拖入卡片区
        imgUrl: 'baseComp/FormButton.svg', // z组件拖拽图标
        compType: 5, // 组件类型
        compId: idCompId, // 组件id
        compName: 'FormButton', // 真实页面组件渲染名称
        propertyCompName: 'FormButtonConfig', // 组件配置渲染名称
        helpInfo: '', // 帮助信息
        buttonType: 3, // 类型
        exportType: 1, // 导出类型
        buttonStyle: 'primary', // 样式
        buttonForm: 1, // 风格
        iconColor: '#4689f5', // 图标颜色
        iconFont: 'icon-xinzeng', // 图标
        ruleArr: [], // 提交钱校验规则
        pane: {
          name: '', // 面板名称
          columnName: '', // 面板字段
          paramArr: [],
        },
        singleStatus: 1,
        textPanelId: '',
        buttonChildType: '', // 按钮子类型
        enableLog: false, // 是否启用日志
        logComp: [], // 操作日志组件数组
        execFunc: false, // 允许执行函数
        execFuncName: '', // 函数表达式
        flowType: 1, // 流程类型
        beforeSubmit: {
          type: 1,
          html: '',
        }, // 提交前提示
        afterSubmit: {
          type: 1,
          html: '',
        }, // 提交后提示
        saveAreaArr: '', // 需要保存的区域
        relateType: 1, // 弹窗类型 1是面板 2是菜单 3是外部地址
        outerLink: '', // 外部地址
        paramsArr: [], // 参数
        dialogName: 'PanelDialog', // 弹窗风格
        dialogTitle: '', // 弹窗标题
        refreshType: 0,
        submitEnable: false,
        canShow: true,
        canReadonly: false,
        templateInfo: {}, // 导入模板
        extraColumn: [], // 额外导入信息
        needField: true, // 是否导出数据库表字段
        exportSetting: 1, // 导出设置 1 - 4
        downLoadType: 1, // 下载类型
        fileColumns: [], // 导出业务字段
        layeredStrategy: '[]', // 层级设置
        downloadName: '下载文件', // 文件名
        printTemp: {}, // 按钮关联打印模板
        queryArea: [], // 查询区域
      };
      this.activeObj.children[0].children.unshift(btn);
    },

    // 是否树形改变
    isTreeChange() {
      setTimeout(() => {
        this.$refs.tableFilter.getList();
      }, 200);
    },
    // 字典选择结果
    async selectDict(dict) {
      if (
        this.getCurrentTab.taskDict &&
        dict.id === this.getCurrentTab.taskDict.id
      ) {
        return;
      }
      dict.dictValue.forEach((item) => {
        item.value = +item.value;
        if (item[`${localStorage.apiotLanguage}`]) {
          item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
        }
      });
      this.$bus.$emit('changeDictArr', dict.dictKey);
      this.$set(this.getCurrentTab, 'taskDict', dict);
    },
    selectColumnRes(table, key) {
      console.log(this.activeObj.taskColumn, table, key);
      this.activeObj.taskColumn[key].id = table.id;
      this.activeObj.taskColumn[key].columnName = table.columnName;
      this.activeObj.taskColumn[key].columnTypeDict = table.columnTypeDict;
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
            message: '该按钮区存在触发器配置，请先删除相关的触发器配置',
          });
        }
        try {
          await this.$confirm('将清空按钮区的内容，是否继续', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning',
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
          });
        } else if (newPageType === 3) {
          obj.children.push({
            name: '按钮区',
            compId: createUnique(),
            children: [],
            areaType: 2,
            rightIndex: 0,
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
        (column) => column.id === this.currentColumnObj.id,
      );
      if (index === -1) {
        // console.log(this.currentColumnObj);
        // console.log(this.getCurrentTab);
        this.getCurrentTab.sortArr.push({
          memo: this.currentColumnObj.memo,
          id: this.currentColumnObj.id,
          columnName: this.currentColumnObj.columnName,
          sort: 'ASC',
        });
        this.dialogVisible = false;
      } else {
        this.$message({
          type: 'warning',
          message: '该排序字段已存在',
        });
      }
    },
    // 删除排序
    deleteSort(index) {
      this.getCurrentTab.sortArr.splice(index, 1);
    },
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
      deep: true,
    },
    filterDialog(v) {
      // console.log(v);
      if (!v) {
        this.$bus.$emit('addHasTriggerComp');
      }
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
      .sumName {
        flex: 1;
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
  .collapse {
    border: 0 none;
    // width: 100%;
    // box-sizing: border-box;
    padding: 0 10px;
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
  .panelBtn {
    width: 100%;
    margin-top: 10px;
    .iconfont {
      color: $--color-primary;
    }
  }
  .stateTerm {
    display: flex;
    align-items: center;
    .left {
      flex: 100px 0 0;
      margin-right: 10px;
    }
    .center {
      flex: 70px 0 0;
      margin-right: 10px;
    }
    .right {
      flex: 1;
    }
  }
}
</style>
