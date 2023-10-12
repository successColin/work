<template>
  <div
    class="menuMain tableArea"
    :class="[
      { flexReserve: configData.pageType === 3 },
      { notConfig: !isConfig },
      { showTitle: configData.showTitle },
      { isHidden: isHidden },
    ]"
    :style="tableStyle"
    @click="changeCurActiveObj(1, $event)"
    :title="isConfig ? configData.name : ''"
    v-show="showMenu"
  >
    <div
      class="menuMain__title"
      :class="[{ isHidden: isHidden }]"
      v-if="configData.showTitle"
      @click="hiddenContent"
    >
      {{ configData.name }}
      <i
        class="iconfont icon-xialajiantou"
        :class="[{ isHidden: isHidden }]"
      ></i>
    </div>
    <div
      class="menuMain__sum"
      :class="[
        { isHidden: isHidden },
        { sumType1: configData.sumType === 1 },
        { sumType2: configData.sumType === 2 },
        { hasBorderBottom: configData.pageType === 2 },
      ]"
      v-if="!isConfig && configData.enableSum && getSumArr.length"
    >
      <SumItem
        :sumType="configData.sumType"
        :item="item"
        :index="index"
        :length="getSumArr.length"
        :activeSumIndex.sync="activeSumIndex"
        @selectSumItem="selectSumItem"
        v-for="(item, index) in getSumArr"
        :key="item.compId"
      ></SumItem>
    </div>
    <div
      class="menuMain__content"
      :class="[
        { isHidden: isHidden },
        {
          sumType1:
            !isConfig && configData.enableSum && configData.sumType === 1,
        },
        {
          sumType2:
            !isConfig && configData.enableSum && configData.sumType === 2,
        },
      ]"
    >
      <BtnsArea
        :style="`${!isConfig ? 'margin-bottom: 0' : ''}`"
        :class="[{ hasConfig: !isConfig && configData.personalConfig }]"
        v-if="configData.children.length !== 0 && showBtns"
        :configData="configData"
        :tableShowColumn="dropColumnData"
        :activeObj="activeObj"
        :hasTriggerComp="hasTriggerComp"
        :isSidebar="isSidebar"
        :getBtnsArr="getBtnsArr"
        :getFeatureArr="getFeatureArr"
        :showType="showType"
        :fileDeleteIds="fileDeleteIds"
        :moreOperateArr="moreOperateArr"
        :grandFather="configData"
        :btnTypesArr="[1, 2, 3, 4, 5, 7, 8, 14, 15]"
        :isTable="true"
        :canSearch="true"
        :multiEntityArr="multiEntityArr"
        :getIdCompId="getIdCompId"
        @click.native="changeCurActiveObj(2, $event)"
        @addTableRow="addTableRow"
        @tableAreaDelete="tableAreaDelete"
        @exportGetDate="exportGetDate"
        :tableAllId="tableAllId"
      ></BtnsArea>
      <el-popover
        placement="bottom"
        trigger="click"
        v-model="showPersonal"
        popper-class="personalPopover"
      >
        <PersonalConfig
          :dropColumnData="getFeatureArr.children"
          :showPersonal.sync="showPersonal"
          :configData="configData"
          @changeTableColumn="changeTableColumn"
        ></PersonalConfig>
        <apiot-button
          v-if="!isConfig && configData.personalConfig"
          slot="reference"
          class="menuMain__config"
          :class="[{ hasTitle: configData.showTitle }]"
        >
          <i class="iconfont icon-shezhi"></i>
        </apiot-button>
      </el-popover>

      <section
        v-if="configData.children.length !== 0"
        class="menuMain__feature"
        :class="[
          { configClass: isConfig && getFeatureArr.children.length === 0 },
          { borderType: isConfig },
          {
            highBorder:
              isConfig &&
              activeObj.compId === configData.compId &&
              activeObj.areaType === 1,
          },
          { useStyle: !isConfig },
          { hiddenBtnArea: configData.pageType === 1 },
          { hasPagination: configData.hasPagination },
        ]"
        configData="功能区"
      >
        <div
          class="menuMain__card"
          :class="[
            { hasPagination: !isConfig && configData.hasPagination },
            { isMain: !this.isConfig },
          ]"
        >
          <!-- 配置页 -->
          <div class="menuMain__card--config" v-if="isConfig">
            <draggable
              v-model="getFeatureArr.children"
              style="height: 100%"
              group="comp"
              animation="300"
              ghostClass="featGhost"
              filter=".notMove"
              :isTable="true"
              :areaType="1"
              :isSidebar="isSidebar"
              @start="featDragStart"
              @end="featDragEnd"
              :move="featDragMove"
              :disabled="!isConfig"
            >
              <transition-group
                class="menuMain__feature--compList"
                tag="ul"
                ref="tableConfig"
              >
                <component
                  v-for="(child, i) in getFeatureArr.children"
                  :class="[
                    {
                      notMove:
                        child.dataSource.columnName === 'id' ||
                        child.compName === 'BtnsArea',
                    },
                  ]"
                  :key="child.compId"
                  :is="child.compName"
                  :parent="getFeatureArr"
                  :grandFather="configData"
                  :i="i"
                  :activeObj="activeObj"
                  :hasTriggerComp="hasTriggerComp"
                  :configData="child"
                  :fileDeleteIds="fileDeleteIds"
                  :showType="showType"
                  :isTable="true"
                  :getBtnsArr="child"
                  :getFeatureArr="getFeatureArr"
                  :moreOperateArr="[]"
                  :btnTypesArr="[2, 3, 4, 5, 15]"
                  :isTableBtn="true"
                ></component> </transition-group
            ></draggable>
          </div>

          <!-- 应用页 -->
          <div
            style="height: 100%"
            ref="curTable"
            :class="`configTable table__main menuMain__feature--compList ${dropClass}`"
            v-else
          >
            <ApiotTableEdit
              class="canEditTable"
              :class="[{ hasSort: hasSort }]"
              v-if="initSuccess && configData.lineEditable"
              :isLineEnter="true"
              :tableData="tableData"
              :row-key="configData.lineEditable ? 'unique' : getIdCompId"
              selectName="unique"
              :highlight-current-row="true"
              :dropColumnData="showResColumnData"
              :showSort="numAndSel.showSort"
              :showRadio="numAndSel.showRadio"
              :showSelection="numAndSel.showSelection"
              :isAnimate="!configData.lineEditable"
              :lineSelect="lineSelect"
              :reserveSelection="reserveSelection"
              @selection-change="handleSelectionChange"
              :currentRadioObj.sync="currentRadioObj"
              @sort-change="sortChange"
              @cell-mouse-enter="cellMouseEnter"
              @cell-mouse-leave="cellMouseLeave"
              @row-click="rowClick"
              @cell-click="cellClick"
              @column-drop-end="columnDropEnd"
              :row-style="rowStyleEdit"
              :dropClass="`.${dropClass}`"
              ref="tableMain"
            >
              <component
                ref="column"
                :label-class-name="`${
                  item.enableTableSearch ? 'hasFilter' : ''
                }`"
                v-for="(item, index) in showResColumnData"
                :key="`${item.name}_${index}`"
                :label="item.name"
                sortable="custom"
                :sort-orders="['ascending', 'descending']"
                :show-overflow-tooltip="false"
                :fixed="item.fixed"
                :min-width="item.minWidth"
                :is="showResColumnData[index].tableCompName"
                :parent="getFeatureArr"
                :grandFather="configData"
                :activeObj="activeObj"
                :configData="item"
                :areaData="configData"
                :fileDeleteIds="fileDeleteIds"
                :showType="showType"
                :isTable="true"
                :tableData="tableData"
                :showVisible.sync="showVisible"
                :showCell="showCell"
                :clickCell="clickCell"
                @isChangeShowCell="isChangeShowCell"
                :getIdCompId="getIdCompId"
                @deleteTableRow="deleteTableRow"
                :multiEntityArr="multiEntityArr"
                @showPanelDialog="showPanelDialog"
                @getListParams="getListParams"
                @showFileDialog="showFileDialog"
              ></component>
            </ApiotTableEdit>
            <ApiotTableEdit
              :class="[{ hasSort: hasSort }]"
              v-if="
                initSuccess &&
                !configData.lineEditable &&
                configData.mergeColumnsArr &&
                configData.mergeColumnsArr.length !== 0
              "
              :tableData="tableData"
              :row-key="configData.lineEditable ? 'unique' : getIdCompId"
              selectName="unique"
              :highlight-current-row="true"
              :dropColumnData="showResColumnData"
              :showSort="numAndSel.showSort"
              :showRadio="numAndSel.showRadio"
              :showSelection="numAndSel.showSelection"
              :isAnimate="!configData.lineEditable"
              :lineSelect="lineSelect"
              :reserveSelection="reserveSelection"
              :show-summary="configData.statistics"
              :summary-method="getSummaries"
              @selection-change="handleSelectionChange"
              :currentRadioObj.sync="currentRadioObj"
              @sort-change="sortChange"
              @row-click="rowClick"
              @column-drop-end="columnDropEnd"
              :row-style="rowStyle"
              :dropClass="`.${dropClass}`"
              ref="tableMain"
            >
              <component
                ref="column"
                :label-class-name="`${
                  item.enableTableSearch ? 'hasFilter' : ''
                }`"
                v-for="(item, index) in showResColumnData"
                :key="`${item.name}_${index}`"
                :label="item.name"
                sortable="custom"
                :sort-orders="['ascending', 'descending']"
                :show-overflow-tooltip="false"
                :fixed="item.fixed"
                :min-width="item.minWidth"
                :is="showResColumnData[index].tableCompName"
                :parent="getFeatureArr"
                :grandFather="configData"
                :activeObj="activeObj"
                :configData="item"
                :areaData="configData"
                :fileDeleteIds="fileDeleteIds"
                :showType="showType"
                :isTable="true"
                :tableData="tableData"
                :showVisible.sync="showVisible"
                :showCell="showCell"
                @isChangeShowCell="isChangeShowCell"
                :getIdCompId="getIdCompId"
                @deleteTableRow="deleteTableRow"
                :multiEntityArr="multiEntityArr"
                @showPanelDialog="showPanelDialog"
                @getListParams="getListParams"
                @showFileDialog="showFileDialog"
              ></component>
            </ApiotTableEdit>
            <apiot-table
              :class="[{ hasSort: hasSort }]"
              v-else-if="initSuccess && !configData.lineEditable"
              :tableData="tableData"
              :row-key="configData.lineEditable ? 'unique' : getIdCompId"
              selectName="unique"
              :highlight-current-row="true"
              :dropColumnData="showResColumnData"
              :showSort="numAndSel.showSort"
              :showRadio="numAndSel.showRadio"
              :showSelection="numAndSel.showSelection"
              :isAnimate="!configData.lineEditable"
              :lineSelect="lineSelect"
              :reserveSelection="reserveSelection"
              :show-summary="configData.statistics"
              :summary-method="getSummaries"
              @selectionChange="handleSelectionChange"
              :currentRadioObj.sync="currentRadioObj"
              @sort-change="sortChange"
              @row-click="rowClick"
              @column-drop-end="columnDropEnd"
              :row-style="rowStyle"
              :dropClass="`.${dropClass}`"
              ref="tableMain"
            >
              <component
                ref="column"
                :label-class-name="`${
                  item.enableTableSearch ? 'hasFilter' : ''
                }`"
                v-for="(item, index) in showResColumnData"
                :key="`${item.name}_${index}`"
                :label="item.name"
                sortable="custom"
                :sort-orders="['ascending', 'descending']"
                :show-overflow-tooltip="false"
                :fixed="item.fixed"
                :min-width="item.minWidth"
                :is="showResColumnData[index].tableCompName"
                :parent="getFeatureArr"
                :grandFather="configData"
                :activeObj="activeObj"
                :configData="item"
                :areaData="configData"
                :fileDeleteIds="fileDeleteIds"
                :showType="showType"
                :isTable="true"
                :tableData="tableData"
                :showVisible.sync="showVisible"
                :showCell="showCell"
                @isChangeShowCell="isChangeShowCell"
                :getIdCompId="getIdCompId"
                @deleteTableRow="deleteTableRow"
                :multiEntityArr="multiEntityArr"
                @showPanelDialog="showPanelDialog"
                @getListParams="getListParams"
                @showFileDialog="showFileDialog"
              ></component>
            </apiot-table>
          </div>

          <!-- 骨架屏 -->
          <!-- <el-skeleton
            :rows="6"
            animated
            v-if="loading"
            class="menuMain__card--skeleton"
          >
          </el-skeleton> -->

          <div
            class="menuMain__card--skeleton"
            :class="[
              {
                isMergeTitle:
                  configData.mergeColumnsArr &&
                  configData.mergeColumnsArr.length,
              },
            ]"
            v-if="loading"
          >
            <div>
              <img src="./images/loading.svg" alt="" />
            </div>
            <p>数据加载中</p>
          </div>
        </div>
        <apiot-pagination
          v-if="!isConfig && configData.hasPagination && showPagi"
          :isSystem="false"
          layout="total, prev, pager, next, sizes, jumper"
          :total="total"
          :current-page.sync="current"
          :selectedNum="this.numAndSel.showRadio ? 0 : multiEntityArr.length"
          :size.sync="configData.rowNum"
          :pageSizes="pageSizes"
          @sizeChange="sizeChange"
          @handle-cancel="handleCancel"
        >
        </apiot-pagination>
      </section>
      <section
        v-if="configData.children.length === 0"
        class="menuMain__wz"
        :class="[
          { borderType: isConfig },
          {
            highBorder: isConfig && activeObj.compId === configData.compId,
          },
        ]"
      >
        卡片区
      </section>
    </div>

    <!-- <transition name="slide-bottom"> -->
    <Panel-dialog
      ref="panelDialog"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
      :showType="showType"
      @setDataSel="setDataSel"
    ></Panel-dialog>
    <!-- </transition> -->

    <!-- <showImgDialog
      :visible.sync="fileShow"
      :fileShow="fileShow"
      :configData="fileConfigData"
      :parent="getFeatureArr"
    ></showImgDialog> -->

    <image-zoom
      v-if="fileShow"
      :previewObj="previewObj"
      :picList="picList"
      v-on:hideImgPreview="hideImgPreview"
      :isShowDelBtn="false"
      :isShowShareBtn="false"
    ></image-zoom>
  </div>
</template>

<script>
import { getSidebarList, getSidebarPage, totalNum } from '@/api/menuConfig';
import { downloadSingle } from '@/api/knowledge';
import { createUnique, formatDate } from '@/utils/utils';
import initAreaMixin from '../initAreaMixin';

export default {
  props: {
    showType: {
      // 用于流程
      type: Object,
      default: () => {},
    },
    configData: {
      type: [Array, Object],
    },
    activeObj: {
      type: [Array, Object],
    },
    hasTriggerComp: {
      type: Object,
    },
    isSidebar: {
      type: Boolean,
      default: false,
    },
    // 父节点
    parent: {
      type: Object,
    },
  },
  data() {
    return {
      moreOperateArr: [],
      fileDeleteIds: [],
      isMenuMain: true,
      tableData: [],
      tempTableData: [],
      current: 1,
      backCurrent: 1,
      total: 0,
      dropColumnData: [], // 表格列
      showResColumnData: [], // 最终展示列
      numAndSel: {
        showSort: false,
        showRadio: false,
        showSelection: false,
      },
      multiEntityArr: [], // 多选数组
      notMultiChange: false, // 不更改多选数组
      currentRadioObj: null, // 单选时选中的值
      defaultForm: null,
      showVisible: false,
      showCell: '', // 当前激活的cell
      clickCell: '', // 点击的cell
      dropClass: 'table',
      showPanel: false, // 数据选择框弹窗
      curIndex: -1, // 数据选择框当前下标
      panelObj: null, // 数据选择框信息
      getRelateColumnName: 'id', // 数据选择框关联字段
      dataSelComp: '', // 数据选择框compId
      hasInitMul: false, // 多选数据选择框是否初始化
      tableStyle: '',
      pageSizes: [10, 20, 50, 100, 200, 500, 1000],
      reserveSelection: true, // 是否记住选择
      initSuccess: false, // 初始化列成功
      showPagi: true, // 显示分页器
      notTouch: false,
      isHidden: false,
      timer: null,
      showPersonal: false, // 是否显示个性化弹窗
      fileShow: false, // 文件展示
      fileConfigData: null, // 文件配置
      loading: false,
      previewObj: {},
      picList: [],
      showBtns: false,
      sumArr: null,
      activeSumIndex: 0,
      exportType: false,
      tableAllId: [],
    };
  },

  components: {},
  mixins: [initAreaMixin],
  inject: [
    'isConfig',
    'getAllForm',
    'getIsMain',
    'sysMenuDesignId',
    'getFatherPanel',
    'onlyFlag',
    'getSelData',
    'initSelData',
    'changeNotValueChange',
    'changeNotValueChangeTable',
    'getNotInitArr',
    'isSelect',
    'getDesignPersonal',
    'resolveFormula',
    'isPreview',
  ],

  computed: {
    // 获取汇总条件
    getSumArr() {
      let arr = [];
      if (this.configData.sumArr && this.configData.sumArr.length) {
        arr = this.configData.sumArr;
        if (arr[0].name !== '全部') {
          arr.unshift({
            compId: createUnique(),
            name: '全部',
            color: '#4689f5',
            filterTermType: 1,
            tableInfo: this.configData.tableInfo,
            filterTermStr: '',
            filterTermSql: '',
            termParams: '',
          });
        }
      }
      return arr;
    },
    // 没有序号
    hasSort() {
      const { showSort, showRadio, showSelection } = this.numAndSel;
      if (!showSort && !showRadio && !showSelection) {
        return false;
      }
      return true;
    },
    showMenu() {
      if (this.isConfig) {
        return true;
      }
      if (this.configData.notShowArea) {
        return false;
      }
      const index = this.getFeatureArr.children.findIndex(
        (item) => item.canShow,
      );
      return index !== -1;
    },
    getFeatureArr() {
      const index = this.configData.children.findIndex(
        (child) => child.areaType === 1,
      );
      return index === -1 ? { children: [] } : this.configData.children[index];
    },
    getBtnsArr() {
      const index = this.configData.children.findIndex(
        (child) => child.areaType === 2,
      );
      return index === -1 ? { children: [] } : this.configData.children[index];
    },
    getButtonStyle() {
      return (i) => {
        if (
          this.getBtnsArr.children.length - this.getBtnsArr.rightIndex ===
          i
        ) {
          return 'margin-left: auto';
        }
        return '';
      };
    },
    // 获取所有页码
    getAllPage() {
      return Math.ceil(this.total / this.configData.rowNum);
    },
    // 获取id字段的组件id
    getIdCompId() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === 'id',
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    // 是否选中
    isItemActive() {
      return (item) => {
        if (this.getFeatureArr.form) {
          return (
            item[this.getIdCompId] === this.getFeatureArr.form[this.getIdCompId]
          );
        }
        return false;
      };
    },
    // 获取监听函数名称
    getEventName() {
      return `reloadArea${this.onlyFlag()}`;
    },
    // 获取多选下拉框
    getMultiArr() {
      const tempArr = [];
      this.dropColumnData.forEach((comp) => {
        if (comp.compType === 2 && comp.dropDownType !== 1) {
          tempArr.push(comp.compId);
        }
        if (comp.compType === 3) {
          return false;
        }
        if (comp.compType === 4) {
          tempArr.push(comp.compId);
        }
      });
      return tempArr;
    },
    // 转化列为map
    getColumnDataMap() {
      const obj = {};
      this.dropColumnData.forEach((comp) => {
        obj[comp.compId] = comp;
      });
      return obj;
    },
    // 获取多选的唯一数组
    getUniqueArr() {
      const arr = [];
      this.dropColumnData.forEach((comp) => {
        if (comp.compType === 1 && comp.shouldRepeat) {
          arr.push(comp.compId);
        }
      });
      return arr;
    },
    // 获取当前数据选择框的字段名称
    getSelDataColumnName() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === this.getSelData().name,
      );
      // console.log(index);
      if (index !== -1) {
        const { compId } = this.getFeatureArr.children[index];
        return compId;
      }
      return 'id';
    },
    // 获取已经勾选的id数组
    getHasSelIds() {
      const arr = [];
      this.multiEntityArr.forEach((row) => {
        arr.push(row[this.getIdCompId]);
      });
      return arr;
    },
    // 行选择
    lineSelect() {
      if (this.getSelData() && this.getSelData().name) {
        return true;
      }
      return false;
    },
    // 是否需要数据权限
    getDataPermissions() {
      if (this.$store.state.userCenter.userInfo.isSupAdmin) {
        return false;
      }
      if (this.showType && this.showType.type === 'flow') {
        return false;
      }
      return this.configData.needPermissions == null
        ? true
        : this.configData.needPermissions;
    },
    // 获取组件数据的map
    getCompIdMap() {
      const obj = {};
      this.getFeatureArr.children.forEach((item) => {
        if (item.dataSource && item.dataSource.columnName) {
          obj[item.compId] = item.dataSource.columnName;
        }
      });
      return obj;
    },
  },

  created() {
    this.configData.isTree = false;
    // console.log(this.configData);
    // console.log(this.getSumArr);
  },
  activated() {
    sessionStorage.__current__mulArr__id = this.getHasSelIds.join(',');
    if (!this.configData.lineEditable) {
      if (this.tempTableData.length) {
        this.loading = true;
        setTimeout(() => {
          this.tableData = JSON.parse(JSON.stringify(this.tempTableData));
          this.tempTableData = [];
          this.loading = false;
        }, 100);
      } else {
        this.getSidebarList();
      }
    }
    if (this.configData.lineEditable) {
      document.addEventListener('onkeydown', this.ctrlAdd, false);
    }
  },
  async mounted() {
    // console.log(this.configData);
    if (this.isConfig) {
      this.showBtns = true;
      // console.log(this.isConfig);
    } else if (!this.isPreview) {
      if (this.getFeatureArr.form) {
        this.defaultForm = JSON.parse(JSON.stringify(this.getFeatureArr.form));
      }
      // this.changeTableColumn()
      if (
        this.getDesignPersonal()[this.configData.compId] &&
        this.configData.personalConfig
      ) {
        this.changeTableColumn(
          this.getDesignPersonal()[this.configData.compId].designOverallLayout,
        );
      } else {
        this.initDropColumnData();
      }
      this.initBtnsSelect();
      this.getMoreOperate();
      this.initFixData();
      this.getTotalNum();
      this.$nextTick(() => {
        sessionStorage.__current__mulArr__id = this.getHasSelIds.join(',');
        this.initHeight();
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.getSidebarList();
        }
      });

      this.$bus.$on(this.getEventName, this.reloadArea);
      this.$bus.$on(`loadSomeArea_${this.parent.compId}`, this.loadArea);
      this.$bus.$on(`getSelMultiArr${this.onlyFlag()}`, this.getSelMultiArr);
      // this.$bus.$on('getAllTableData', this.getAllTableData);
      // this.$bus.$on('getTableArr', this.getTableArr);
      this.$bus.$on(`selectTableLine${this.onlyFlag()}`, this.selectTableLine);
      if (this.configData.lineEditable) {
        document.addEventListener('keydown', this.ctrlAdd, false);
      }
    } else {
      this.getMoreOperate();
      this.initDropColumnData();
      this.showBtns = true;
      this.$nextTick(() => {
        this.initHeight();
      });
    }
  },

  methods: {
    // 导出获取数据
    async exportGetDate(type, callback) {
      this.exportType = type;
      await this.getSidebarList(type);
      if (callback) {
        callback(this.tableAllId);
        this.exportType = false;
      }
    },
    // 选中汇总
    selectSumItem() {
      this.getSidebarList();
    },
    // 获取汇总数据
    async getTotalNum() {
      if (
        !this.isConfig &&
        this.configData.enableSum &&
        this.getSumArr.length
      ) {
        const filterMap = JSON.stringify(this.getFilterParams());
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          current: this.current,
          size: this.configData.rowNum,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          totalFilter: this.getSumArr,
        };
        const panelFilter = this.getCurAreaTerm(
          this.getValueFromFather('panelFilter'),
        );
        if (panelFilter) {
          params.panelFilter = [panelFilter];
        }
        // 最外层的才会有菜单跳转条件
        if (this.getFatherPanel && !this.getFatherPanel()) {
          if (+this.$route.query.isJump === 1) {
            const menuFilter = this.getCurAreaTerm(
              this.getCurMenu('menuFilter'),
            );
            if (menuFilter) {
              params.panelFilter = [menuFilter];
            }
          }
        }
        if (this.configData.searchInfo) {
          params.searchInfo = this.configData.searchInfo;
        }
        const headerSearch = this.getHeaderSearch();
        if (headerSearch) {
          params.headerSearch = headerSearch;
        }
        const data = await totalNum(params);
        // console.log(data);
        this.getSumArr.forEach((item) => {
          this.$set(item, 'value', data[item.compId]);
        });
        // console.log(this.getSumArr);
      }
    },
    // ctrl + 组合键新增
    ctrlAdd(e) {
      // console.log(e);
      const keyCode = e.keyCode || e.which || e.charCode;
      const shiftKey = e.shiftKey || e.metaKey;
      if (shiftKey && (keyCode === 107 || keyCode === 187)) {
        // console.log('按住了 shift+S');
        this.addTableRow();
        e.preventDefault();
        return false;
      }
    },
    // 初始化按钮的下拉框
    initBtnsSelect() {
      this.getBtnsArr.children.forEach((child, i) => {
        if (child.compName === 'FilterSelectCol') {
          const index = this.getFeatureArr.children.findIndex(
            (comp) => comp.relateCompId === child.compId,
          );
          // console.log(index);
          if (index !== -1) {
            // child = {
            //   ...this.getFeatureArr.children[index],
            //   ...child,
            // };
            this.getBtnsArr.children.splice(i, 1, {
              ...this.getFeatureArr.children[index],
              ...child,
              relateCompId: this.getFeatureArr.children[index].compId,
            });
          }
        }
      });
      this.showBtns = true;
    },
    // 展示文件
    async showFileDialog(row, compId, index) {
      const urlArr = row[`${compId}_`].split(',');
      const idsArr = row[`${compId}`].split(',');
      this.picList = [];
      this.previewObj = {
        sysKlTree: {
          id: idsArr[index],
          url: urlArr[index],
        },
      };
      idsArr.forEach((id, i) => {
        this.picList.push({
          sysKlTree: {
            id,
            url: urlArr[i],
          },
        });
      });
      if (this.$store.state.globalConfig.waterConfig.enableWaterMask === '1') {
        const data = await downloadSingle({
          url: this.picList[index].sysKlTree.url,
        });
        this.picList[index].sysKlTree.blob = data;
      }
      console.log(this.picList, this.previewObj);
      this.fileShow = true;
      // this.fileConfigData = config;
    },
    hideImgPreview() {
      // 关闭预览
      this.fileShow = false;
    },
    // 获取全部数据行尾计算
    async getAllDataSum() {
      const filterMap = JSON.stringify(this.getFilterParams());
      const params = {
        dataPermissions: this.getDataPermissions,
        compId: this.configData.compId,
        compMap: filterMap,
        sysMenuDesignId: this.sysMenuDesignId(),
        panelCompId: this.getValueFromFather('panelCompId'),
        relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
      };
      const panelFilter = this.getCurAreaTerm(
        this.getValueFromFather('panelFilter'),
      );
      if (panelFilter) {
        params.panelFilter = [panelFilter];
      }
      // 最外层的才会有菜单跳转条件
      if (this.getFatherPanel && !this.getFatherPanel()) {
        if (+this.$route.query.isJump === 1) {
          const menuFilter = this.getCurAreaTerm(this.getCurMenu('menuFilter'));
          if (menuFilter) {
            params.panelFilter = [menuFilter];
          }
        }
      }
      if (this.configData.searchInfo) {
        params.searchInfo = this.configData.searchInfo;
      }
      const headerSearch = this.getHeaderSearch();
      if (headerSearch) {
        params.headerSearch = headerSearch;
      }
      let formulaStr = '';
      let str = 'SUM';
      if ([1, 5].includes(this.configData.statisticsType)) {
        str = 'SUM';
      } else if ([2, 6].includes(this.configData.statisticsType)) {
        str = 'AVG';
      } else if ([3, 7].includes(this.configData.statisticsType)) {
        str = 'MAX';
      } else if ([4, 8].includes(this.configData.statisticsType)) {
        str = 'MIN';
      }
      this.dropColumnData.forEach((comp) => {
        if (this.configData.statisticsComps.includes(comp.compId)) {
          formulaStr += `${str}(${this.configData.tableInfo.tableName}.${comp.dataSource.columnName}) ${comp.compId},`;
        }
      });
      if (formulaStr) {
        params.formula = formulaStr.slice(0, -1);
      }
      if (
        this.configData.enableSum &&
        this.getSumArr.length &&
        this.getSumArr[this.activeSumIndex]
      ) {
        params.totalFilter = [this.getSumArr[this.activeSumIndex]];
      }
      const data = await getSidebarList(params);
      [this.sumArr] = data;
    },
    // 行尾计算
    getSummaries({ columns }) {
      // console.log(columns, this.tableData, data);
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          if ([1, 5].includes(this.configData.statisticsType)) {
            sums[index] = '合计';
          } else if ([2, 6].includes(this.configData.statisticsType)) {
            sums[index] = '平均值';
          } else if ([3, 7].includes(this.configData.statisticsType)) {
            sums[index] = '最大值';
          } else if ([4, 8].includes(this.configData.statisticsType)) {
            sums[index] = '最小值';
          }
          return;
        }

        if (this.configData.statisticsComps.includes(column.property)) {
          if (this.configData.statisticsType > 4 && this.sumArr) {
            sums[index] = this.sumArr[column.property];
            return;
          }
          const values = this.tableData.map((item) => item[column.property]);
          if (!values.length) {
            sums[index] = '';
            return;
          }
          let num = 0;
          if (this.configData.statisticsType === 1) {
            num = 0;
            values.forEach((v) => {
              num += +v;
            });
          } else if (this.configData.statisticsType === 2) {
            let all = 0;
            values.forEach((v) => {
              all += +v;
            });
            if (values.length) {
              num = all / values.length;
            } else {
              num = 0;
            }
          } else if (this.configData.statisticsType === 3) {
            num = Math.max(...values);
          } else if (this.configData.statisticsType === 4) {
            num = Math.min(...values);
          }
          sums[index] = +num.toFixed(4);
        } else {
          sums[index] = '';
        }
      });

      return sums;
    },
    // 是否隐藏内容
    hiddenContent() {
      if (this.isConfig) {
        return false;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (this.isHidden) {
          setTimeout(() => {
            this.$broadcast('changeHeight');
          }, 300);
        }
        this.isHidden = !this.isHidden;
      }, 100);
      setTimeout(() => {
        if (this.timer) {
          clearTimeout(this.timer);
        }
      }, 300);
    },
    getTableArr(callback) {
      // console.log(this.multiEntityArr);
      const arr = JSON.parse(JSON.stringify(this.tableData));
      this.configData.children.forEach((item) => {
        item.children.forEach((v) => {
          const getDictKey =
            v.dataSource &&
            v.dataSource.dictObj &&
            v.dataSource.dictObj.dictKey;
          const tempData = this.$store.getters.getCurDict(getDictKey) || [];
          const tempDataCopy = JSON.parse(JSON.stringify(tempData));
          const obj = {};
          if (tempDataCopy.length) {
            tempDataCopy.forEach((dict) => {
              obj[dict.value] = dict;
            });
          }
          arr.forEach((a) => {
            if (v.enableDict && !this.isConfig) {
              a[v.compId] =
                (obj[a[v.compId]] && obj[a[v.compId]].name) || a[v.compId];
            }
          });
        });
      });
      callback(arr);
    },
    // 获取选中数组
    getSelMultiArr(compId, callback) {
      if (compId === this.configData.compId) {
        callback(this.multiEntityArr);
      }
    },
    getAllTableData(compId, callback) {
      console.log(compId, this.configData.compId);
      if (compId === this.configData.compId) {
        console.log(this.tableData);
        callback(this.tableData);
      }
    },
    // 刚打开tab的时候如果不是初始化的，则加载一次
    loadArea(compId) {
      // 代表刚打开的tab
      if (this.parent.compId === compId) {
        if (this.getNotInitArr().includes(this.configData.compId)) {
          this.$nextTick(() => {
            this.getSidebarList();
          });
        }
      }
    },
    // 获取当前是否只有一个表格
    getCurLength() {
      const arr = [];
      this.parent.children.forEach((item) => {
        if (item.compName !== 'MenuMain') {
          arr.push(item);
        } else {
          const featureArr =
            item.pageType === 2 ? item.children[1] : item.children[0];
          const index = featureArr.children.findIndex((v) => v.canShow);
          if (index !== -1) {
            arr.push(item);
          }
        }
      });
      return arr.length;
    },
    // 初始化表格高度
    initHeight() {
      if (!this.isConfig) {
        let num = 41 + 37 * this.configData.showLine + 42 + 6;
        // 多级表头
        if (
          this.configData.mergeColumnsArr &&
          this.configData.mergeColumnsArr.length !== 0
        ) {
          num += 82;
        }
        // 标题高度
        if (this.configData.showTitle) {
          num += 40;
        }
        // 无按钮区
        if (this.configData.pageType === 1) {
          num -= 42;
        }
        // 有无分页器
        if (this.configData.hasPagination) {
          num += 42;
        }
        if (this.configData.showLine === 5) {
          let tableMaxHeight = 0;
          this.$emit(
            'getTableMaxHeight',
            this.parent,
            this.configData.compId,
            (v) => {
              tableMaxHeight = v;
            },
          );
          // console.log(tableMaxHeight, num);
          if (tableMaxHeight > num) {
            const dis = tableMaxHeight - num;
            const line = Math.floor(dis / 37);
            this.showPagi = false;
            // this.pageSizes.push(this.configData.showLine + line);
            if (!this.pageSizes.includes(this.configData.showLine + line)) {
              this.pageSizes.push(this.configData.showLine + line);
            }
            this.configData.rowNum = this.configData.showLine + line;
            this.$nextTick(() => {
              this.showPagi = true;
              this.current = 1;
            });
            num += 37 * line;

            if (this.getCurLength() === 2) {
              this.tableStyle = 'height: 100%';
              return;
            }
            this.tableStyle = `height: ${tableMaxHeight}px`;
            return;
          }
          this.showPagi = false;
          if (!this.pageSizes.includes(this.configData.showLine)) {
            this.pageSizes.push(this.configData.showLine);
          }
          this.configData.rowNum = this.configData.showLine;
          this.$nextTick(() => {
            this.showPagi = true;
          });
        }
        if (this.getCurLength() === 2) {
          this.tableStyle = 'height: 100%';
          return;
        }
        this.tableStyle = `height: ${num}px`;
        return;
      }
      this.tableStyle = '';
    },
    // 表格校验
    tableValidate() {
      return new Promise((resolve, reject) => {
        const resArr = this.tableData.filter((data) => !data.notChange);
        if (resArr.length === 0) {
          return resolve();
        }
        const keys = Object.keys(this.getFeatureArr.rules);
        console.log(keys);
        this.tableData.forEach((res, index) => {
          if (!res.notChange) {
            // 唯一性校验
            // console.log(this.getUniqueArr);
            this.getUniqueArr.forEach((compId) => {
              const i = this.tableData.findIndex(
                (v) => v[compId] === res[compId],
              );
              // console.log(i);
              if (i !== -1 && i !== index) {
                return reject(
                  new Error(
                    `${this.configData.name}第${index + 1}行${
                      this.getColumnDataMap[compId].name
                    }不能重复`,
                  ),
                );
              }
            });
            // 规则校验
            keys.forEach((key) => {
              if (this.getColumnDataMap[key]) {
                const ruleArr = this.getFeatureArr.rules[key];
                console.log(ruleArr, res, key);
                ruleArr.forEach((rule) => {
                  if (rule.flag === 'requiredRule') {
                    if (res[key] === '' || res[key] == null) {
                      return reject(
                        new Error(
                          `${this.configData.name}第${index + 1}行${
                            this.getColumnDataMap[key].name
                          }为必填`,
                        ),
                      );
                    }
                  } else if (rule.flag === 'maxAndMin') {
                    const len = res[key].length;
                    if (len < rule.min || len > rule.max) {
                      return reject(
                        new Error(
                          `${this.configData.name}第${index + 1}行${
                            this.getColumnDataMap[key].name
                          } 长度应为${rule.min}-${rule.max}`,
                        ),
                      );
                    }
                  } else {
                    // console.log(rule);
                    const reg = new RegExp(rule.pattern);
                    if (!reg.test(res[key])) {
                      return reject(
                        new Error(
                          `${this.configData.name}第${index + 1}行${
                            this.getColumnDataMap[key].name
                          }${rule.message}`,
                        ),
                      );
                    }
                  }
                });
              }
            });
          }
          if (index === this.tableData.length - 1) {
            return resolve();
          }
        });
      });
    },
    // 初始化列
    initDropColumnData() {
      // console.log(this.configData);
      // console.log(this.$refs.curTable.offsetWidth);
      const width = this.$refs.curTable.offsetWidth - 40;
      // 初始化父节点唯一class
      this.dropClass = `table_${createUnique()}`;

      // 初始化列表
      this.dropColumnData = this.getFeatureArr.children.filter((item) => {
        item.showTip = true;
        if (!item.tableWidth) {
          item.minWidth = width * 0.1;
        } else {
          item.minWidth = width * item.tableWidth;
        }
        if (item.tableCompName === 'OperateCol') {
          item.showTip = false;
          if (item.canShow !== false) {
            item.canShow = true;
          }
          if (this.configData.operateWidth) {
            item.minWidth = width * this.configData.operateWidth;
          } else {
            item.minWidth = width * 0.2;
          }
        }
        if (item.compType === 6) {
          item.showTip = false;
        }
        if (item.compType === 7) {
          item.showTip = false;
        }
        // if (item.singleStatus === 1 || item.singleStatus === 2) {
        //   item.canShow = true;
        // }
        // if (item.singleStatus === 4) {
        //   item.canShow = false;
        // }
        return item.canShow;
      });
      // 处理合并表头
      const hasRolveArr = [];
      const mergeObj = {};
      if (this.configData.mergeColumnsArr) {
        this.configData.mergeColumnsArr.forEach((cArr) => {
          cArr.columnsArr.forEach((compId) => {
            mergeObj[compId] = cArr;
          });
        });
      }
      this.dropColumnData.forEach((obj) => {
        if (hasRolveArr.includes(obj.compId)) {
          return;
        }
        const curMergeObj = mergeObj[obj.compId];
        if (curMergeObj) {
          obj = {
            compId: curMergeObj.id,
            name: curMergeObj.content,
            tableCompName: 'MergeTitle',
            children: [],
          };
          obj.compId = curMergeObj.id;
          obj.name = curMergeObj.content;
          curMergeObj.columnsArr.forEach((compId) => {
            const resObj = this.dropColumnData.find(
              (res) => res.compId === compId,
            );
            if (resObj) {
              obj.children.push(resObj);
              hasRolveArr.push(compId);
            }
          });
        }
        hasRolveArr.push(obj.compId);
        this.showResColumnData.push(obj);
      });
      console.log(this.showResColumnData);
      // 初始化序号以及多选
      this.numAndSel = {
        showSort: false,
        showRadio: false,
        showSelection: false,
      };
      if (this.getSelData() && this.getSelData().name) {
        if (this.getSelData().showInfo) {
          this.numAndSel = {
            showSort: false,
            showRadio: false,
            showSelection: true,
          };
        } else {
          this.numAndSel = {
            showSort: false,
            showRadio: true,
            showSelection: false,
          };
        }
      } else if (this.configData.showNum) {
        // console.log(this.configData.selectType);
        if (this.configData.selectType === 1) {
          this.numAndSel.showSelection = true;
        } else if (this.configData.selectType === 2) {
          this.numAndSel.showRadio = true;
        } else {
          this.numAndSel.showSort = true;
        }
      }
      // 弹窗选择里面记住
      if (
        this.getSelData() &&
        this.getSelData().name &&
        this.numAndSel.showSelection &&
        this.configData.hasPagination
      ) {
        this.reserveSelection = true;
      }
      // 初始化固定列
      if (this.configData.fixedLeft) {
        for (let i = 0; i < this.configData.fixedLeft; i += 1) {
          if (this.dropColumnData[i]) {
            this.dropColumnData[i].fixed = 'left';
          }
        }
      }
      if (this.configData.fixedRight) {
        const len = this.dropColumnData.length;
        for (let i = 0; i < this.configData.fixedRight; i += 1) {
          if (this.dropColumnData[len - i - 1]) {
            this.dropColumnData[len - i - 1].fixed = 'right';
          }
        }
      }
      // 初始化列成功显示
      this.initSuccess = true;
    },
    // 个性化更改
    changeTableColumn(tempArr, isFirst = true) {
      const arr = [];
      this.dropColumnData = [];
      const featureArr = this.getFeatureArr.children.filter(
        (item) => item.dataSource.columnName === 'id',
      );
      // 更改顺序
      tempArr.forEach((item, index) => {
        const obj = this.getFeatureArr.children.find(
          (v) => v.compId === item.compId,
        );
        if (obj) {
          featureArr[index + 1] = obj;
        }
      });
      this.getFeatureArr.children.forEach((item, index) => {
        const obj = tempArr.find((v) => v.compId === item.compId);
        if (!obj) {
          featureArr.splice(index, 0, item);
        }
      });
      // console.log(featureArr, this.getFeatureArr.children);
      this.getFeatureArr.children = featureArr.filter((v) => v);
      // 更改里面的属性
      this.getFeatureArr.children.forEach((item) => {
        const obj = tempArr.find((v) => item.compId === v.compId);
        if (!obj) {
          if (item.canShow && !isFirst) {
            this.dropColumnData.push(item);
          }
          arr.push(item);
        } else {
          item.canShow = obj.canShow;
          if (item.canShow && !isFirst) {
            this.dropColumnData.push(item);
          }
          arr.push(item);
        }
      });
      this.getFeatureArr.children = arr;
      if (isFirst) {
        this.initDropColumnData();
      } else {
        this.dropColumnData.forEach((item) => {
          item.fixed = '';
        });
        // 初始化固定列
        if (this.configData.fixedLeft) {
          for (let i = 0; i < this.configData.fixedLeft; i += 1) {
            if (this.dropColumnData[i]) {
              this.dropColumnData[i].fixed = 'left';
            }
          }
        }
        if (this.configData.fixedRight) {
          const len = this.dropColumnData.length;
          for (let i = 0; i < this.configData.fixedRight; i += 1) {
            if (this.dropColumnData[len - i - 1]) {
              this.dropColumnData[len - i - 1].fixed = 'right';
            }
          }
        }
        if (this.configData.headerSearch) {
          this.configData.headerSearch = null;
          this.getSidebarList();
        }
        this.initSuccess = false;
        this.$nextTick(() => {
          this.initSuccess = true;
        });
      }
      //
    },
    columnDropEnd() {
      if (this.configData.headerSearch) {
        this.configData.headerSearch = null;
        this.getSidebarList();
      }
      this.initSuccess = false;
      this.$nextTick(() => {
        this.initSuccess = true;
      });
    },
    // 表格改变分页大小
    sizeChange() {
      this.current = 1;
      this.$refs.tableMain.clearSort();
      this.handleCancel();
      this.getSidebarList();
    },
    // 取消多选项
    handleCancel() {
      this.$refs.tableMain.clearSelection();
      this.multiEntityArr = [];
    },
    // 多选选中行
    handleSelectionChange(section) {
      console.log(section);
      if (!this.notMultiChange) {
        this.multiEntityArr = section;
      }
    },
    // 选中表格的几行
    selectTableRow() {
      this.notMultiChange = true;
      this.$nextTick(() => {
        const uniqueArr = [];
        this.multiEntityArr.forEach((row) => {
          if (this.configData.hasPagination) {
            uniqueArr.push(row[this.getIdCompId]);
          } else if (row.unique) {
            uniqueArr.push(row.unique);
          } else {
            uniqueArr.push(row[this.getIdCompId]);
          }
        });
        if (this.$refs && this.$refs.tableMain) {
          this.$refs.tableMain.curData.forEach((row) => {
            if (this.configData.hasPagination) {
              if (uniqueArr.includes(row[this.getIdCompId])) {
                this.$refs.tableMain.toggleRowSelection(row, true);
              } else {
                this.$refs.tableMain.toggleRowSelection(row, false);
              }
            } else if (
              uniqueArr.includes(row.unique) ||
              uniqueArr.includes(row[this.getIdCompId])
            ) {
              this.$refs.tableMain.toggleRowSelection(row, true);
            } else {
              this.$refs.tableMain.toggleRowSelection(row, false);
            }
          });
        }

        this.notMultiChange = false;
      });
    },
    // 对需要选中的数据赋值
    setTableDataSel() {
      if (sessionStorage.notInitMul === '1') {
        return;
      }
      if (this.numAndSel.showRadio) {
        this.tableData.findIndex((row) => {
          // eslint-disable-next-line
          if (row[this.getSelDataColumnName] == this.getSelData().value) {
            this.currentRadioObj = row;
            return true;
          }
          return false;
        });
      }
      if (this.numAndSel.showSelection) {
        if (!this.hasInitMul) {
          this.hasInitMul = true;
          const valueArr = this.getSelData().value
            ? this.getSelData().value.split(',')
            : [];
          const showArr = this.getSelData().showInfo.value
            ? this.getSelData().showInfo.value.split(',')
            : [];
          let showCompId = '';
          const index = this.getFeatureArr.children.findIndex(
            (comp) =>
              comp.dataSource.columnName === this.getSelData().showInfo.name,
          );
          if (index !== -1) {
            showCompId = this.getFeatureArr.children[index].compId;
          }
          valueArr.forEach((id, i) => {
            const obj = {};
            obj[this.getIdCompId] = +id;
            obj[showCompId] = showArr[i];
            obj.old = true;
            const j = this.multiEntityArr.findIndex(
              (item) => item[this.getIdCompId] === +id,
            );
            if (j === -1) {
              this.$refs.tableMain.toggleRowSelection(obj, true);
              this.multiEntityArr.push(obj);
            }
          });
          // console.log(this.multiEntityArr);
        }
        this.selectTableRow();
      }
    },
    // 更新该区域
    reloadArea(areaArr, compId, filterObj) {
      // 按钮全部刷新
      if (areaArr === 'all') {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.currentRadioObj = null;
          this.multiEntityArr = [];
          this.$refs.tableMain.clearSelection();
          this.getTotalNum();
          this.getSidebarList();
        }
        return;
      }

      // 刷新当前区域
      if (areaArr === 'current' && compId === this.configData.compId) {
        this.current = 1;
        this.currentRadioObj = null;
        this.multiEntityArr = [];
        this.$refs.tableMain.clearSelection();
        this.getSidebarList();
        return;
      }
      // 搜索刷新
      if (
        areaArr === 'searchCurrent' &&
        compId === this.configData.compId &&
        this.configData.compName === 'TableMain'
      ) {
        this.current = 1;
        this.configData.headerSearch = null;
        this.$refs.column.forEach((vueComp) => {
          if (vueComp.$refs.filterCol) {
            vueComp.$refs.filterCol.clearFilter();
          }
        });
        this.getTotalNum();
        this.getSidebarList();
        return;
      }
      if (
        areaArr === 'filterList' &&
        compId === this.configData.compId &&
        this.configData.compName === 'TableMain'
      ) {
        this.current = 1;
        this.configData.searchInfo = null;
        if (!this.configData.headerSearch) {
          this.configData.headerSearch = {};
        }
        if (filterObj.arr.length) {
          this.configData.headerSearch[filterObj.compId] = filterObj.arr;
        } else {
          delete this.configData.headerSearch[filterObj.compId];
        }
        this.getTotalNum();
        this.getSidebarList();
        return;
      }
      if (areaArr.includes(this.configData.compId)) {
        this.current = 1;
        this.currentRadioObj = null;
        this.multiEntityArr = [];
        this.$refs.tableMain.clearSelection();
        this.getSidebarList();
      }
    },
    // 一些固定值的初始化
    initFixData() {
      if (this.getFatherPanel()) {
        const keys = this.getFeatureArr.form
          ? Object.keys(this.getFeatureArr.form)
          : [];
        keys.forEach((key) => {
          if (this.getFatherPanel().panelFixData[key]) {
            this.getFeatureArr.form[key] =
              this.getFatherPanel().panelFixData[key];
          }
        });
      }
      // this.$refs.form.resetFields();
    },
    // 获取当前过滤条件需要的参数
    getFilterParams() {
      let obj = {};
      const menuFilter = this.getCurAreaTerm(this.getCurMenu('menuFilter'));
      if (
        this.getFatherPanel() &&
        this.getFatherPanel().panelVarObj[this.configData.compId]
      ) {
        obj = this.getFatherPanel().panelVarObj[this.configData.compId];
      } else if (+this.$route.query.isJump === 1 && menuFilter) {
        obj = this.getCurMenu('menuVarObj');
        if (obj[this.configData.compId]) {
          obj = obj[this.configData.compId];
        }
      } else if (this.configData.termParams) {
        const compMap = this.getAllForm();
        const arr = this.configData.termParams.split(',');
        arr.forEach((compId) => {
          obj[compId] = compMap[compId];
        });
      }
      // 有汇总的
      if (
        !this.isConfig &&
        this.configData.enableSum &&
        this.getSumArr.length
      ) {
        const compMap = this.getAllForm();
        this.getSumArr.forEach((item) => {
          const arr = item.termParams.split(',');
          arr.forEach((compId) => {
            obj[compId] = compMap[compId];
          });
        });
      }
      // 插入菜单id
      obj.MENU_ID = this.$route.params.id || this.$route.query.menuId;
      return obj;
    },
    makeFlowParams(params) {
      const { tableInfo } = this.configData;
      params.workflowFilter = `${tableInfo.tableName}.id=${this.showType.dataId}`;
      params.dataPermissions = false;
    },
    // 获取上级的某个值
    getValueFromFather(v) {
      if (this.getFatherPanel() && this.getFatherPanel()[v]) {
        return this.getFatherPanel()[v];
      }
      return '';
    },
    // 获取该区域的过滤条件
    getCurAreaTerm(filterArr) {
      if (filterArr) {
        const obj = filterArr.find(
          (filter) => filter.compId === this.configData.compId,
        );
        return obj;
      }
      return '';
    },
    // 获取当前菜单的
    getCurMenu(params) {
      const jumpMenuObj = sessionStorage.jumpMenuObj
        ? JSON.parse(sessionStorage.jumpMenuObj)
        : '';
      // console.log(jumpMenuObj, 'jumpMenuObj');
      if (jumpMenuObj) {
        const menu =
          jumpMenuObj[this.$route.params.id || this.$route.query.menuId];
        if (menu && menu[params]) {
          return menu[params];
        }
      }
      return '';
    },
    // 获取表头过滤条件
    getHeaderSearch() {
      if (this.configData.headerSearch) {
        const arr = [];
        Object.keys(this.configData.headerSearch).forEach((key) => {
          arr.push(...this.configData.headerSearch[key]);
        });
        if (arr.length) {
          return {
            columnsInfo: arr,
          };
        }
      }
      return '';
    },
    getListParams(callback) {
      const filterMap = JSON.stringify(this.getFilterParams());
      const params = {
        dataPermissions: this.getDataPermissions,
        compId: this.configData.compId,
        compMap: filterMap,
        sysMenuDesignId: this.sysMenuDesignId(),
        panelCompId: this.getValueFromFather('panelCompId'),
        relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
      };
      const panelFilter = this.getCurAreaTerm(
        this.getValueFromFather('panelFilter'),
      );
      if (panelFilter) {
        params.panelFilter = [panelFilter];
      }
      // 最外层的才会有菜单跳转条件
      if (this.getFatherPanel && !this.getFatherPanel()) {
        if (+this.$route.query.isJump === 1) {
          const menuFilter = this.getCurAreaTerm(this.getCurMenu('menuFilter'));
          if (menuFilter) {
            params.panelFilter = [menuFilter];
          }
        }
      }

      callback(params);
    },
    // 获取列表数据
    async getSidebarList(sortStr) {
      // console.log(this.getFatherPanel());
      // console.log(this.onlyFlag());
      if (this.isPreview) {
        return false;
      }
      if (!this.exportType) {
        this.loading = true;
      }
      const filterMap = JSON.stringify(this.getFilterParams());
      let data = [];
      const { hasPagination } = this.configData;
      // console.log(this.configData.searchInfo);
      console.log(3333333333, this.tableData);
      if (hasPagination && !this.exportType) {
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          current: this.current,
          size: this.configData.rowNum,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          sortStr,
        };
        const panelFilter = this.getCurAreaTerm(
          this.getValueFromFather('panelFilter'),
        );
        if (panelFilter) {
          params.panelFilter = [panelFilter];
        }
        // 最外层的才会有菜单跳转条件
        if (this.getFatherPanel && !this.getFatherPanel()) {
          if (+this.$route.query.isJump === 1) {
            const menuFilter = this.getCurAreaTerm(
              this.getCurMenu('menuFilter'),
            );
            if (menuFilter) {
              params.panelFilter = [menuFilter];
            }
          }
        }
        if (this.configData.searchInfo) {
          params.searchInfo = this.configData.searchInfo;
        }
        const headerSearch = this.getHeaderSearch();
        if (headerSearch) {
          params.headerSearch = headerSearch;
        }
        if (
          this.configData.enableSum &&
          this.getSumArr.length &&
          this.getSumArr[this.activeSumIndex]
        ) {
          params.totalFilter = [this.getSumArr[this.activeSumIndex]];
        }
        const { compName } = this.configData;
        if (
          this.showType &&
          this.showType.type === 'flow' &&
          compName === 'CardMain'
        ) {
          this.makeFlowParams(params);
        }
        const res = await getSidebarPage(params);
        data = res.records;
        this.total = res.total;
      } else {
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          sortStr,
        };
        const panelFilter = this.getCurAreaTerm(
          this.getValueFromFather('panelFilter'),
        );
        if (panelFilter) {
          params.panelFilter = [panelFilter];
        }
        // 最外层的才会有菜单跳转条件
        if (this.getFatherPanel && !this.getFatherPanel()) {
          if (+this.$route.query.isJump === 1) {
            const menuFilter = this.getCurAreaTerm(
              this.getCurMenu('menuFilter'),
            );
            if (menuFilter) {
              params.panelFilter = [menuFilter];
            }
          }
        }
        if (this.configData.searchInfo) {
          params.searchInfo = this.configData.searchInfo;
        }
        const headerSearch = this.getHeaderSearch();
        if (headerSearch) {
          params.headerSearch = headerSearch;
        }
        if (
          this.configData.enableSum &&
          this.getSumArr.length &&
          this.getSumArr[this.activeSumIndex]
        ) {
          params.totalFilter = [this.getSumArr[this.activeSumIndex]];
        }
        const { compName } = this.configData;
        if (
          this.showType &&
          this.showType.type === 'flow' &&
          compName === 'CardMain'
        ) {
          this.makeFlowParams(params);
        }
        data = await getSidebarList(params);
      }
      if (this.configData.statistics && this.configData.statisticsType > 4) {
        await this.getAllDataSum();
      }
      // 多选值变数组
      const keys = this.getFeatureArr.form
        ? Object.keys(this.getFeatureArr.form)
        : [];
      if (!data) {
        data = [];
      }
      data.forEach((form) => {
        // unique 代表唯一值
        // notChange 代表没改变
        form.unique = createUnique();
        form.notChange = true;
        keys.forEach((key) => {
          // if (!form[key]) {
          //   form[key] = '';
          // }
          if (!Object.prototype.hasOwnProperty.call(form, key)) {
            form[key] = '';
          }
        });
        this.getMultiArr.forEach((compId) => {
          if (form[compId]) {
            if (!form[compId].split) {
              form[compId] = `${form[compId]}`;
            }
            const tempArr = form[compId].split(',');
            const arr = [];
            tempArr.forEach((v) => {
              arr.push(+v);
            });
            form[compId] = arr;
          } else {
            form[compId] = [];
          }
        });
      });
      if (this.exportType) {
        this.tableAllId = data.map((item) => item[this.getIdCompId]);
        return;
      }
      console.log('进不来了吧');
      this.tableData = data;
      this.loading = false;
      this.configData.tableData = this.tableData;
      // 代表当前是数据选择框打开的弹窗
      if (this.getSelData() && this.getSelData().name) {
        this.setTableDataSel();
      }
      if (sessionStorage.notInitMul === '1') {
        sessionStorage.notInitMul = '';
        this.selectTableRow();
      }
      if (data && data.length) {
        this.selectItem(data[0]);
      } else {
        this.$bus.$emit('changeShowSkeleton');
      }
    },
    // 列表排序  ASC ascending升序  DESC descending降序
    sortChange(column) {
      if (this.tableData.length === 0) {
        return;
      }
      this.handleCancel();
      this.current = 1;
      const obj = this.dropColumnData.find((data) => {
        if (data.name === column.column.label && data.compId === column.prop) {
          return true;
        }
        return false;
      });
      let sortStr = `${obj.compId} ${
        column.order === 'ascending' ? 'ASC' : 'DESC'
      }`;
      // 取显示值
      if (obj.compType === 6 || obj.compType === 7) {
        sortStr = `${obj.compId}_ ${
          column.order === 'ascending' ? 'ASC' : 'DESC'
        }`;
      }
      if (obj.compType === 15) {
        if (obj.dataSource.relateName === '主表') {
          if (obj.enableMultiColumn) {
            // 数据多选框
            sortStr = `${obj.compId}_ ${
              column.order === 'ascending' ? 'ASC' : 'DESC'
            }`;
          }
        } else {
          sortStr = `${obj.compId}_ ${
            column.order === 'ascending' ? 'ASC' : 'DESC'
          }`;
        }
      }
      this.getSidebarList(sortStr);
    },
    // 处理值去设置
    resolveRes(v) {
      console.log(v);
      if (v) {
        const arr = typeof v === 'string' ? v.split(',') : v;
        arr.forEach((item, index) => {
          if (!Object.is(NaN, +item)) {
            arr[index] = +item;
          }
        });
        return arr;
      }
      return [];
    },
    // 开启行编辑新增行
    addTableRow() {
      const obj = {};
      this.dropColumnData.forEach((comp) => {
        let v = this.defaultForm[comp.compId] || '';
        if (v) {
          if (comp.compType === 1) {
            v = `${v}`;
          }
          if (comp.compType === 2) {
            if (comp.dropDownType === 1) {
              if (v) {
                v = +v;
              } else {
                v = '';
              }
            }
          }
          if ([3, 34].includes(comp.compType)) {
            v = +v;
          }
          if ([10].includes(comp.compType)) {
            v = `${v}`;
          }
        }
        if (
          [4, 25].includes(comp.compType) ||
          (comp.compType === 2 && comp.dropDownType !== 1)
        ) {
          v = this.resolveRes(v);
        }
        // 时间初始化
        // 日期时间选择器
        if (comp.compType === 8 && comp.defaultType === 1) {
          v = formatDate(new Date(), 'yyyy-MM-dd');
        }
        if (comp.compType === 9 && comp.defaultType === 1) {
          v = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        }
        obj[comp.compId] = v;
      });
      obj.unique = createUnique();
      obj.notChange = false;
      console.log(obj);
      this.tableData.push(obj);
      this.configData.tableData = this.tableData;
      this.selectTableRow();

      // 新增数据 定位在最底部
      this.$nextTick(() => {
        if (this.$refs && this.$refs.tableMain) {
          const table = this.$refs.tableMain.$refs.multipleTable;
          const row = this.$refs.tableMain.curData.find(
            (data) => data.unique === obj.unique,
          );
          table.setCurrentRow(row);
          setTimeout(() => {
            table.setCurrentRow();
            setTimeout(() => {
              table.setCurrentRow(row);
            }, 200);
          }, 200);
          table.bodyWrapper.scrollTop = table.bodyWrapper.scrollHeight;
        }
      });
    },

    // 表格内删除删除新增未保存的行编辑
    deleteTableRow(i) {
      // console.log(this.tableData);
      this.tableData.splice(i, 1);
      this.configData.tableData = this.tableData;
    },

    // 表格区按钮区删除
    tableAreaDelete() {
      if (this.multiEntityArr.length) {
        const uniqueArr = [];
        this.multiEntityArr.forEach((row) => {
          uniqueArr.push(row.unique);
        });
        const res = this.tableData.filter(
          (row) => !uniqueArr.includes(row.unique),
        );
        console.log(uniqueArr);
        this.tableData = res;
        this.$refs.tableMain.clearSelection();
        this.multiEntityArr = [];
        this.currentRadioObj = null;
      }
    },

    changeCurActiveObj(areaType = 1, e) {
      if (!this.isConfig) {
        return;
      }
      if (this.isSelect && areaType === 2) {
        return;
      }
      if (e) {
        e.stopPropagation();
      }
      // console.log(this.configData);
      this.configData.shouldTab = true;
      this.configData.areaType = areaType;
      this.$bus.$emit('changeCurActiveObj', this.configData);
    },
    featDragStart() {
      // console.log(1);
    },
    featDragEnd() {
      // console.log(2);
    },
    featDragMove(e) {
      // console.log(3, e);
      if (!e.relatedContext.element) {
        return false;
      }
      if (e.relatedContext.element.areaType !== 1) {
        return false;
      }
      if (e.relatedContext.element.dataSource.columnName === 'id') {
        return false;
      }
      if (e.relatedContext.element.compName === 'BtnsArea') {
        return false;
      }
      // console.log(e.from !== e.to);
      if (e.from !== e.to) {
        return false;
      }
    },
    // 按钮超过4个出现更多操作
    // getMoreOperate() {
    //   const { length } = this.getBtnsArr.children;
    //   if (length - this.getBtnsArr.rightIndex - 3 > 0) {
    //     this.moreOperateArr = this.getBtnsArr.children.splice(
    //       3,
    //       length - this.getBtnsArr.rightIndex - 3,
    //       {
    //         compName: 'MoreFormButton',
    //         compId: createUnique()
    //       }
    //     );
    //     // console.log(this.moreOperateArr);
    //   }
    // },
    // 选择当前item
    selectItem(item) {
      if (this.isConfig) {
        return;
      }
      if (item) {
        this.changeNotValueChangeTable(true);
        this.getFeatureArr.form = item;
        this.$nextTick(() => {
          this.changeNotValueChangeTable(false);
        });
      }
      // 触发其他区域数据的加载
      if (this.configData.reloadArea.length) {
        this.$bus.$emit(
          this.getEventName,
          this.configData.reloadArea,
          this.onlyFlag(),
        );
      } else {
        this.$bus.$emit('changeShowSkeleton');
      }
    },

    // 鼠标移入某个区域
    cellMouseEnter(row, column) {
      // console.log(row, column);
      // 给表格区form赋值
      this.timer = setTimeout(() => {
        this.changeNotValueChangeTable(true);
        const index = this.tableData.findIndex(
          (data) => data.unique === row.unique,
        );
        this.getFeatureArr.form = this.tableData[index];
        this.$nextTick(() => {
          this.changeNotValueChangeTable(false);
        });
        if (this.showVisible) {
          this.showVisible = false;
        }
        this.showCell = `${column.id}_${row.unique}`;
      }, 50);
    },
    // 鼠标移出某个区域
    cellMouseLeave() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (!this.showVisible) {
        this.showCell = '';
      }
    },
    cellClick(row, column) {
      this.clickCell = `${column.id}_${row.unique}`;
    },
    // 是否触发行点击
    selectTableLine(compId, row) {
      if (compId === this.configData.compId) {
        this.rowClick(row);
      }
    },
    // 行样式
    rowStyle(row) {
      // console.log(row);
      if (this.configData.lineBg) {
        // 第一版本根据字典来源
        // const comp = this.getFeatureArr.children.find(
        //   (c) => c.compId === this.configData.iconColorId,
        // );
        // if (comp && comp.dataSource.dictObj) {
        //   const { dictKey } = comp.dataSource.dictObj;
        //   const value =
        //     row.row[`${this.configData.iconColorId}_`] ||
        //     row.row[`${this.configData.iconColorId}`];
        //   const dictArr = this.$store.getters.getCurDict(dictKey);
        //   const dict = dictArr.find((d) => +d.value === +value);
        //   if (dict) {
        //     // console.log(dict);
        //     return {
        //       backgroundColor: dict.color,
        //     };
        //   }
        // }
        // 第二版本 根据条件设置
        if (this.configData.hasCardIcon && row.rowIndex % 2 !== 0) {
          return {
            backgroundColor: '#F6F7FA',
          };
        }
        const obj = this.configData.bgColorArr?.find((item) => {
          const res = this.resolveFormula(true, item.content, row.row);
          // console.log(item.content, res);
          if (res) {
            return true;
          }
          return false;
        });
        if (obj) {
          return {
            backgroundColor: obj.color,
          };
        }
      }
      return {
        backgroundColor: '#fff',
      };
    },
    // 行编辑
    rowStyleEdit(row) {
      // console.log(row, row.row.notChange);
      if (row.row.notChange) {
        return {
          backgroundColor: '#fff',
        };
      }
      return {
        backgroundColor: '#edf3fe',
      };
    },
    // 点击行
    rowClick(row) {
      const index = this.tableData.findIndex(
        (data) => data.unique === row.unique,
      );
      if (
        index !== -1 &&
        this.getFeatureArr.form.unique !== this.tableData[index].unique
      ) {
        this.getFeatureArr.form = this.tableData[index];
        this.selectItem();
      }
    },
    // 点击收起下拉
    isChangeShowCell(ele) {
      if (!this.$refs.tableMain.$el.contains(ele)) {
        this.showCell = '';
      }
    },

    // 打开数据选择框
    showPanelDialog(index, panelObj, getRelateColumnName, comp, obj) {
      this.curIndex = index;
      this.panelObj = panelObj;
      this.getRelateColumnName = getRelateColumnName;
      this.dataSelComp = comp;
      this.$refs.panelDialog.initSelData(
        getRelateColumnName,
        this.tableData[index][comp.compId],
        obj,
      );
      this.showPanel = true;
    },
    // 数据选择框选中数据
    setDataSel(arr) {
      // 单选框
      if (this.dataSelComp.compType === 6) {
        this.$set(
          this.tableData[this.curIndex],
          this.dataSelComp.compId,
          arr[0][this.getRelateColumnName],
        );
        // console.log(this.getFeatureArr.form);
        this.tableData[this.curIndex].notChange = false;
        if (arr.length) {
          this.$set(
            this.tableData[this.curIndex],
            `${this.dataSelComp.compId}_`,
            arr[0][this.dataSelComp.dataSource.columnName],
          );
        }
      }
      // 多选框
      if (this.dataSelComp.compType === 7) {
        let str = '';
        let str1 = '';
        arr.forEach((item) => {
          str += `${item.id},`;
          str1 += `${item[this.dataSelComp.multiTable.column.columnName]},`;
        });
        // this.tableData[this.curIndex][this.dataSelComp.compId] = str.slice(0, -1);0
        // this.tableData[this.curIndex][`${this.dataSelComp.compId}_`] = str1.slice(0, -1);
        this.$set(
          this.tableData[this.curIndex],
          this.dataSelComp.compId,
          str.slice(0, -1),
        );
        this.$set(
          this.tableData[this.curIndex],
          `${this.dataSelComp.compId}_`,
          str1.slice(0, -1),
        );
        this.tableData[this.curIndex].notChange = false;
      }

      this.showPanel = false;
      this.dataSelComp.selData = arr;
    },
    // 更新multiArr
    updateMulti(v) {
      const arr = v.split(',');
      const index = this.multiEntityArr.findIndex((item) => {
        if (!arr.includes(`${item[this.getIdCompId]}`)) {
          return true;
        }
        return false;
      });
      if (index !== -1) {
        this.multiEntityArr.splice(index, 1);
        this.$refs.tableMain.clearSelection();
        this.selectTableRow();
      }
    },
    // 获取字段组件id
    getCompId(coulumnName) {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === coulumnName,
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    initMulti(form) {
      // console.log(2);
      const keyArr = [];
      form.keys.forEach((item) => {
        if (this.getCompId(item)) {
          keyArr.push(this.getCompId(item));
        }
      });
      const arr = form.tagValue ? form.tagValue.split(',') : [];
      const arr1 = form.tagValue_ ? form.tagValue_.split(',') : [];
      this.notTouch = true;
      this.handleCancel();
      console.log(arr);
      arr.forEach((item, index) => {
        const obj = {};
        obj[keyArr[0]] = +arr[index];
        obj[keyArr[1]] = arr1[index];
        obj.old = true;
        this.multiEntityArr.push(obj);
        this.$refs.tableMain.toggleRowSelection(obj, true);
      });
      this.selectTableRow();
      this.$nextTick(() => {
        this.notTouch = false;
      });
    },
    hideOtherFilter(compId) {
      this.$refs.column.forEach((vueComp) => {
        if (vueComp.$refs.filterCol) {
          vueComp.$refs.filterCol.hide(compId);
        }
      });
    },
  },
  deactivated() {
    sessionStorage.__current__mulArr__id = '';
    document.removeEventListener('onkeydown', this.ctrlAdd);
    if (!this.configData.lineEditable) {
      this.tempTableData = JSON.parse(JSON.stringify(this.tableData));
      this.tableData = [];
    }
  },
  beforeDestroy() {
    console.log('列表销毁监听');
    sessionStorage.__current__mulArr__id = '';
    this.$bus.$off(this.getEventName, this.reloadArea);
    this.$bus.$off(`loadSomeArea_${this.parent.compId}`, this.loadArea);
    this.$bus.$off(`getSelMultiArr${this.onlyFlag()}`, this.getSelMultiArr);
    this.$bus.$off(`selectTableLine${this.onlyFlag()}`, this.selectTableLine);
    // this.$bus.$off('getTableArr');

    if (this.defaultForm) {
      this.getFeatureArr.form = JSON.parse(JSON.stringify(this.defaultForm));
    }
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    },
    async current(v) {
      if (!v) {
        this.backCurrent = 1;
      }
      if (this.backCurrent !== v && v) {
        this.backCurrent = v;
        await this.getSidebarList();
        this.$refs.tableMain.toggleMulti();
        this.$refs.tableMain.clearSort();
      }
    },
    'configData.canOperate': function (v) {
      if (v) {
        this.getFeatureArr.children.push({
          name: this.configData.operateName,
          compName: 'BtnsArea',
          tableCompName: 'OperateCol',
          compId: createUnique(),
          children: [],
          dataSource: {
            columnName: '',
          },
          canShow: true,
        });

        this.$nextTick(() => {
          this.$refs.tableConfig.$el.scrollLeft =
            this.$refs.tableConfig.$el.scrollWidth;
        });
      } else {
        const index = this.getFeatureArr.children.findIndex(
          (item) => item.compName === 'BtnsArea',
        );
        this.getFeatureArr.children.splice(index, 1);
      }
    },
    'configData.operateName': function (v) {
      const index = this.getFeatureArr.children.findIndex(
        (item) => item.tableCompName === 'OperateCol',
      );
      if (index !== -1) {
        console.log(this.getFeatureArr.children[index]);
        this.$set(this.getFeatureArr.children[index], 'name', v);
        this.getFeatureArr.children[index].name = v;
      }
    },
    currentRadioObj: {
      handler(v) {
        if (v) {
          this.multiEntityArr = [v];
          if (this.getSelData() && this.getSelData().name) {
            this.initSelData(
              this.getSelData().name,
              v[this.getSelDataColumnName],
            );
          }
        } else {
          this.multiEntityArr = [];
        }
      },
      deep: true,
    },
    'getFeatureArr.children': {
      handler(v) {
        if (this.isConfig) {
          return;
        }
        this.dropColumnData = v.filter((item) => item.canShow);
      },
      deep: true,
    },
    multiEntityArr(v) {
      sessionStorage.__current__mulArr__id = this.getHasSelIds.join(',');
      if (!this.notTouch) {
        this.$bus.$emit(
          `multiArrChange${this.onlyFlag()}`,
          v,
          this.getCompIdMap,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menuMain {
  position: relative;
  box-sizing: border-box;
  // height: calc(100% - 20px);
  height: 200px;
  margin: 10px;
  margin-bottom: 0px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 100%;
  box-sizing: border-box;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  &.isHidden {
    height: 40px !important;
  }
  &.showTitle {
    font-size: 15px;
    padding-top: 40px !important;
    position: relative;
    &::before {
      content: attr(tip);
      position: absolute;
      left: 10px;
      top: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 40px;
    }
  }
  .hasConfig {
    width: calc(100% - 52px);
  }
  &.flexReserve {
    .menuMain__content {
      display: flex;
      flex-direction: column-reverse;
    }
  }
  &__config {
    position: absolute;
    right: 10px;
    top: 6px;
    cursor: pointer;
    color: $--color-primary;
    &.hasTitle {
      top: 46px;
    }
  }
  &__title {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    line-height: 40px;
    padding: 0 10px;
    cursor: pointer;
    background: #fafafa;
    box-sizing: border-box;
    border-bottom: 1px solid #ebebeb;
    &:hover {
      background-color: #f5f7fa;
      // color: $--color-primary;
      .icon-xialajiantou {
        color: $--color-primary;
      }
    }
    &.isHidden {
      border-bottom: 0 none;
    }
    .icon-xialajiantou {
      position: absolute;
      right: 10px;
      transition: all 0.2s linear;
      color: #999;
      &.isHidden {
        transform: rotate(180deg);
      }
    }
  }
  &__sum {
    transition: all 0.2s linear;
    box-sizing: border-box;
    margin: 0 10px;
    display: flex;
    align-items: center;
    &.isHidden {
      height: 0;
      opacity: 0;
      display: none !important;
    }

    &.hasBorderBottom {
      border-bottom: 1px solid #e9e9e9;
    }
    &.sumType1 {
      height: 66px;
    }
    &.sumType2 {
      height: 56px;
    }
  }
  &__content {
    height: 100%;
    transition: all 0.2s linear;
    &.isHidden {
      height: 0;
      opacity: 0;
      display: none !important;
    }
    &.sumType1 {
      height: calc(100% - 66px);
    }
    &.sumType2 {
      height: calc(100% - 56px);
    }
  }
  &__feature {
    height: calc(100% - 52px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 10px;
    box-sizing: border-box;
    &.borderType:hover {
      border-width: 1px !important;
      border-style: solid !important;
      border-image: url(../../../assets/img/border-blue.svg) 1 round !important;
    }
    &.hiddenBtnArea {
      height: 100% !important;
    }
    ::v-deep {
      .el-form {
        height: 100%;
        width: 100%;
        & > div {
          height: 100%;
        }
      }
    }
    &--compList {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      min-height: 100%;
      white-space: nowrap;
      & > div,
      & > header {
        display: inline-block;
        width: 140px !important;
        border: 1px solid #e9e9e9;
        border-right: 0 none;
        margin-bottom: 0;
        &:last-child {
          border-right: 1px solid #e9e9e9;
        }
      }
      & > header {
        width: 300px !important;
      }
    }
  }

  &__wz {
    text-align: center;
    line-height: 300px;
    height: 100%;
    box-sizing: border-box;
  }
  &__card {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
    width: 100%;
    &--config {
      width: 100%;
    }
    &--skeleton {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 42px;
      background-color: #fff;
      z-index: 1000;
      &.isMergeTitle {
        top: 82px;
      }
      div {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -70px;
        margin-left: -20px;
        width: 40px;
        height: 40px;
        background: #ffffff;
        box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.24);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          animation: clockwise 1s linear infinite;
        }
      }
      p {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -20px;
        transform: translateX(-50%);
        height: 18px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
      }
    }
  }
  &.notConfig {
    height: 170px;
    .menuMain__feature {
      padding: 0;
      height: calc(100% - 42px);
      & > {
        ::v-deep {
          .el-loading-mask {
            top: 42px;
          }
        }
      }
      &--compList {
        overflow: hidden;
        & > div {
          width: 100% !important;
          border: 0 none;
        }
      }
      &.hasPagination {
        position: relative;
        ::v-deep {
          .pagination {
            border-top: 0px none;
            border-bottom: 0 none;
            &:before {
              content: '';
              position: absolute;
              left: 0;
              right: 0;
              height: 1px;
              background-color: #e9e9e9;
              top: 0;
            }
          }
        }
      }
      &--input {
        width: 48px;
        height: 22px;
        ::v-deep {
          .el-input {
            height: 22px;
          }
          .el-input__inner {
            height: 22px;
            vertical-align: top;
          }
        }
      }
    }
    .menuMain__card {
      box-sizing: border-box;
      cursor: pointer;
      height: auto;
      border-radius: 4px;
      display: flex;
      height: 100%;
      &.isMain {
        padding: 0 10px;
      }
      &.hasPagination {
        height: calc(100% - 42px);
      }
    }
    .menuMain__cardRight {
      flex: 1;
    }
  }
}
.configClass {
  position: relative;
  background: #fafafa;
  border: 1px dashed #e9e9e9;
  &:after {
    content: attr(configData);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 13px;
    font-weight: 400;
    color: #808080;
  }
}
.configTable {
  ::v-deep {
    .el-table th {
      padding: 6px 6px 6px 6px !important;
      &.hasFilter {
        padding-right: 18px !important;
      }
      .cell {
        overflow: visible !important;
      }
    }
  }
}
.canEditTable {
  ::v-deep {
    .cell {
      padding: 0;
    }
  }
}
</style>
<style lang="scss">
.personalPopover {
  padding: 0 !important;
  background: #ffffff !important;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.18) !important;
  border-radius: 8px !important;
  width: 260px;
}
</style>
