<template>
  <div
    class="GanttMain tableArea"
    :class="[
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
      class="GanttMain__title"
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
      class="GanttMain__content"
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
      <section class="GanttMain__btns">
        <TimeControl
          v-if="configData.viewChange"
          @timeRangeChange="timeRangeChange"
          :curTimeVal.sync="curTimeVal"
        ></TimeControl>
        <StateControl
          class="m-l-10"
          v-if="configData.stateFilter"
          :dictObj="configData.taskDict"
          :isConfig="isConfig"
          @changeStateValue="changeStateValue"
        ></StateControl>
        <el-date-picker
          class="m-l-10"
          v-model="curTime"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          range-separator="~"
          style="width: 300px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="daterangeChange"
          :clearable="false"
          v-if="configData.timeFilter && !configData.isTreeGantt"
        >
        </el-date-picker>
        <FormButton
          :class="[{ configButton: isConfig }]"
          v-if="configData.enableAdd && getBtnsArr.children.length"
          :parent="getBtnsArr"
          :featureArr="getFeatureArr"
          :hasTriggerComp="hasTriggerComp"
          :activeObj="activeObj"
          :configData="getBtnsArr.children[0]"
          :tableInfo="configData"
          :fileDeleteIds="fileDeleteIds"
          :isSidebar="false"
          :isTable="false"
          :isTabBtn="false"
          :multiEntityArr="[]"
          :btnTypesArr="[3]"
          :getIdCompId="getIdCompId"
          :isTree="true"
          :isQuery="false"
        ></FormButton>
        <SearchCondition
          v-if="configData.highFilter"
          :featureArr="getFeatureArr"
          :tableInfo="configData"
          :activeObj="activeObj"
          :parent="getBtnsArr"
          :configData="searchConfigData"
          style="margin-left: auto"
        ></SearchCondition>
        <div class="btnMask" v-if="isConfig"></div>
      </section>
      <section
        v-if="configData.children.length !== 0"
        class="GanttMain__feature"
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
          { hasPagination: configData.hasPagination },
        ]"
        configData="功能区"
      >
        <div
          class="GanttMain__card"
          :class="[
            { hasPagination: !isConfig && configData.hasPagination },
            { isMain: !this.isConfig },
          ]"
        >
          <!-- 配置页 -->
          <div class="GanttMain__card--config" v-if="isConfig">
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
                class="GanttMain__feature--compList"
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
                  lectTask
                  :isTableBtn="true"
                ></component> </transition-group
            ></draggable>
          </div>

          <!-- 应用页 -->
          <div
            style="height: 100%"
            ref="curTable"
            class="configTable table__main GanttMain__feature--compList"
            v-else
          >
            <ApiotGantt
              ref="gantt"
              class="ganttBox"
              :tasks="tableData"
              :isTreeGantt="configData.isTreeGantt"
              @task-selected="selectTask"
              @onTaskDblClick="onTaskDblClick"
              @onScaleClick="onScaleClick"
              @onAfterTaskDrag="onAfterTaskDrag"
            ></ApiotGantt>
          </div>
          <!-- 骨架屏 -->
          <div class="GanttMain__card--skeleton" v-if="loading">
            <div>
              <img src="../TableMain/images/loading.svg" alt="" />
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
        >
        </apiot-pagination>
      </section>
    </div>

    <!-- <transition name="slide-bottom"> -->
    <Panel-dialog
      ref="panelDialog"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
      :showType="showType"
    ></Panel-dialog>
    <!-- </transition> -->

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
import { ganttPage, ganttList, updateGanttTime } from '@/api/menuConfig';
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
      tableData: { data: [] },
      current: 1,
      backCurrent: 1,
      total: 0,
      dropColumnData: [], // 表格列
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
      curTime: [],
      searchConfigData: {
        name: '搜索框',
        canSearch: true,
        areaType: 2, // 表示在按钮区
        dragCard: true,
        imgUrl: 'baseComp/SearchCondition.svg',
        compType: 16,
        compId: createUnique(),
        compName: 'SearchCondition',
        propertyCompName: 'SearchConditionConfig',
        placeholder: '请输入关键字搜索',
        searchCompArr: [], // 普通搜索的组件数组
        enableScan: false, // 是否启用扫描
        shouldHigh: false, // 是否启用高级搜索
        highStyle: 2, // 高级搜索按钮类型
        highCompArr: [], // 高级搜索包含组件类型
        hisSearch: false, // 是否启用高级历史搜索
        canShow: true,
        canReadonly: false,
      },
      curTimeVal: 4,
      stateValue: '',
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
    'getPanel',
    'getMenu',
  ],

  computed: {
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
    // 获取监听函数名称
    getEventName() {
      return `reloadArea${this.onlyFlag()}`;
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
    // 获取请求参数
    getPageParams() {
      const obj = {
        startTime: this.configData.taskColumn.startTime.columnName,
        endTime: this.configData.taskColumn.endTime.columnName,
        interval: this.configData.taskColumn.interval.columnName,
        intervalUnit: this.configData.taskColumn.intervalUnit.columnName,
        tableName: this.configData.tableInfo.tableName,
        associatedColumn:
          this.configData.taskColumn.associatedColumn.columnName,
        cycle: this.configData.taskColumn.cycle.columnName,
        current: {
          key: this.configData.taskColumn.state.columnName,
          val: this.configData.taskColumn.state.value,
          lambda: this.configData.taskColumn.state.lamba,
        },
      };
      return {
        gantt: {
          startDate: this.curTime.length ? this.curTime[0] : '',
          endDate: this.curTime.length ? this.curTime[1] : '',
          whereTerms: this.stateValue
            ? `${this.configData.tableInfo.tableName}.${this.configData.taskColumn.state.columnName} in (${this.stateValue})`
            : '',
          ganttParams: JSON.stringify(obj),
        },
      };
    },
    getListParams() {
      const obj = {
        startTime: this.configData.taskColumn.startTime.columnName,
        endTime: this.configData.taskColumn.endTime.columnName,
        parentId: this.configData.taskColumn.parentId.columnName,
        progress: this.configData.taskColumn.progress.columnName,
        tableName: this.configData.tableInfo.tableName,
        links: this.configData.taskColumn.links.columnName,
      };
      return {
        gantt: {
          ganttParams: JSON.stringify(obj),
        },
      };
    },
  },

  created() {
    this.configData.isTree = false;
    // console.log(this.configData);
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

      this.initDropColumnData();

      this.getMoreOperate();
      this.initFixData();
      this.$nextTick(() => {
        this.initHeight();
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.getSidebarList();
        }
      });

      this.$bus.$on(this.getEventName, this.reloadArea);
      this.$bus.$on(`loadSomeArea_${this.parent.compId}`, this.loadArea);
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
    // 处理跳转面板的条件获取面板
    resolvePanleTerm() {
      if (!this.configData.textPanelId) {
        return;
      }
      const arr = this.configData.textPanelId.split(',');
      const panelArr = [];
      arr.forEach((panelId) => {
        if (panelId && this.getPanel()[panelId]) {
          panelArr.push(this.getPanel()[panelId]);
        }
      });
      const obj = panelArr.find((panel) => {
        if (!panel.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, panel.jumpTerm);
        // console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        this.panelObj = this.resolveFilterVar(obj);
        if (this.panelObj && this.panelObj.panelName) {
          setTimeout(() => {
            this.showPanel = true;
          });
        }
      }
    },
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.id) {
        panelObj.panelVarObj = {};

        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] =
              this.getAllForm()[compId];
          });
          if (item.relateDataComp) {
            panelObj.relateDataComp = {};
            panelObj.relateDataComp[item.compId] = {};
            panelObj.relateDataComp[item.compId].value =
              this.getAllForm()[item.relateDataComp.compId];
            panelObj.relateDataComp[item.compId].tableName =
              item.relateDataComp.tableName;
          }
          if (item.relateBusiComp) {
            panelObj.relateBusiComp = {};
            panelObj.relateBusiComp[item.compId] = {};
            panelObj.relateBusiComp[item.compId].value =
              this.getAllForm()[item.relateBusiComp.compId];
            panelObj.relateBusiComp[item.compId].tableName =
              item.relateBusiComp.tableName;
            panelObj.relateBusiComp[item.compId].flowValue =
              item.relateBusiComp.flowValue;
          }
        });

        panelObj.panelFixData = {};
        panelObj.panelData.forEach((item) => {
          if (item.mainComp.type === 2) {
            panelObj.panelFixData[item.paneComp.compId] =
              item.mainComp.fixedValue;
          } else if (item.mainComp.type === 3) {
            panelObj.panelFixData[item.paneComp.compId] = this.resolveFormula(
              true,
              item.mainComp.fixedValue,
            );
          } else {
            panelObj.panelFixData[item.paneComp.compId] =
              this.getAllForm()[item.mainComp.compId];
          }
        });
        panelObj.panelCompId = this.configData.compId;
        panelObj.relationMenuDesignId = this.sysMenuDesignId();
        panelObj.onlyFlag = this.onlyFlag();

        if (panelObj.name) {
          panelObj.panelName = panelObj.name;
        }
        return panelObj;
      }
      return null;
    },
    selectTask(task, flag) {
      console.log(task, flag);
      if (!flag) {
        return;
      }
      // 假数据直接返回
      if (task.__current__state__ === 2) {
        return;
      }
      this.getFeatureArr.form = task;
      this.$set(this.getFeatureArr, 'form', task);
      const { relateType } = this.configData;
      if (!relateType || relateType === 1) {
        this.resolvePanleTerm();
      } else if (relateType === 2) {
        this.jumpMenu();
      } else if (relateType === 3) {
        // console.log(this.getContent);
        window.open(this.configData.outerLink || this.getContentArr(task)[0]);
      }
    },
    jumpMenu() {
      if (this.$route.name === 'sharePage') {
        return this.$message({
          type: 'warning',
          message: '分享页面无跳转菜单的权限',
        });
      }
      const curMenuArr = this.getMenu()[this.configData.compId];
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        const menu = this.$store.getters.getCurMenu(obj.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          obj.menuVarObj = {};
          obj.menuFilter.forEach((item) => {
            if (item.termParams) {
              const arr = item.termParams.split(',');
              obj.menuVarObj[item.compId] = {};
              arr.forEach((compId) => {
                obj.menuVarObj[item.compId][compId] = this.getAllForm()[compId];
                curMenu.path = `${curMenu.path}&${compId}=${
                  this.getAllForm()[compId]
                }`;
              });
            }
          });
          const menuObj = sessionStorage.jumpMenuObj
            ? JSON.parse(sessionStorage.jumpMenuObj)
            : {};
          menuObj[obj.id] = obj;
          sessionStorage.jumpMenuObj = JSON.stringify(menuObj);
          this.$bus.$emit('changeMenuTab', curMenu);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限',
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单',
        });
      }
    },
    // task 拖动等结束
    async onAfterTaskDrag(task) {
      // console.log(task);
      const id = task.tempId ? task.tempId : task.id;
      const obj = {
        startTime: this.configData.taskColumn.startTime.columnName,
        endTime: this.configData.taskColumn.endTime.columnName,
      };
      const params = {
        startDate: formatDate(task.start_date, 'yyyy-MM-dd hh:mm:ss'),
        endDate: formatDate(task.end_date, 'yyyy-MM-dd hh:mm:ss'),
        whereTerms: `id=${id}`,
        tableName: this.configData.tableInfo.tableName,
        ganttParams: JSON.stringify(obj),
      };
      await updateGanttTime(params);
      // console.log(data);
      this.getSidebarList();
    },
    // changeStateValue
    changeStateValue(v) {
      this.stateValue = v.join(',');
      this.current = 1;
      this.getSidebarList();
    },
    // 时间范围更改
    daterangeChange() {
      this.current = 1;
      this.getSidebarList();
    },
    // 时间单位更改
    timeRangeChange(v) {
      this.curTimeVal = v;
      if (v === 0) {
        this.$refs.gantt.setDate('year');
      } else if (v === 1) {
        this.$refs.gantt.setDate('quarter');
      } else if (v === 2) {
        this.$refs.gantt.setDate('month');
      } else if (v === 3) {
        this.$refs.gantt.setDate('week');
      } else if (v === 4) {
        this.$refs.gantt.setDate('day');
      } else if (v === 5) {
        this.$refs.gantt.setDate('hour');
      }
    },
    onTaskDblClick(task) {
      console.log(task);
    },
    onScaleClick(date) {
      const v = this.curTimeVal;
      if (v === 0) {
        this.curTimeVal = 1;
        this.$refs.gantt.setDate('quarter');
        const lastYear = date.getFullYear() + 1;
        this.$refs.gantt.setTimeRange(
          date,
          new Date(`${lastYear}/01/01 00:00:00`),
        );
      } else if (v === 1) {
        this.curTimeVal = 2;
        this.$refs.gantt.setDate('month');
        let lastYear = date.getFullYear();
        let lastMonth = date.getMonth() + 1 + 3;
        if (lastMonth > 12) {
          lastMonth = 1;
          lastYear += 1;
        }
        this.$refs.gantt.setTimeRange(
          date,
          new Date(`${lastYear}/${lastMonth}/01 00:00:00`),
        );
      } else if (v === 2) {
        this.curTimeVal = 3;
        this.$refs.gantt.setDate('week');
        let lastYear = date.getFullYear();
        let lastMonth = date.getMonth() + 1 + 1;
        if (lastMonth > 12) {
          lastMonth = 1;
          lastYear += 1;
        }
        this.$refs.gantt.setTimeRange(
          date,
          new Date(`${lastYear}/${lastMonth}/01 00:00:00`),
        );
      } else if (v === 3) {
        this.curTimeVal = 4;
        this.$refs.gantt.setDate('day');
        this.$refs.gantt.setTimeRange(
          date,
          new Date(+new Date(date) + 7 * 24 * 3600 * 1000),
        );
      } else if (v === 4) {
        // this.$refs.gantt.setDate('day');
        this.curTimeVal = 5;
        this.$refs.gantt.setDate('hour');
        this.$refs.gantt.setTimeRange(
          date,
          new Date(+new Date(date) + 24 * 3600 * 1000),
        );
      } else if (v === 5) {
        // this.$refs.gantt.setDate('hour');
      }
      // console.log(date);
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
        // 标题高度
        if (this.configData.showTitle) {
          num += 40;
        }
        // 无按钮区
        // if (this.configData.pageType === 1) {
        //   num -= 42;
        // }
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
    // 初始化列
    initDropColumnData() {
      // console.log(this.configData);
      // console.log(this.$refs.curTable.offsetWidth);
      const width = (this.$refs.curTable.offsetWidth - 40) / 4;
      const columns = [];
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
        if (item.canShow) {
          columns.push({
            name: item.compId,
            label: item.name,
            minWidth: item.minWidth,
          });
        }
        return item.canShow;
      });
      console.log(columns);
      if (columns.length) {
        columns[0].tree = true;
      }
      this.$refs.gantt.initColumn(columns);
      // 初始化列成功显示
      this.initSuccess = true;
    },
    // 表格改变分页大小
    sizeChange() {
      this.current = 1;
      this.getSidebarList();
    },

    // 更新该区域
    reloadArea(areaArr, compId, btnType, isAdd) {
      console.log(areaArr, compId, btnType, isAdd);
      // 按钮全部刷新
      if (areaArr === 'all') {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.currentRadioObj = null;
          this.getSidebarList();
        }
        return;
      }

      // 刷新当前区域
      if (areaArr === 'current' && compId === this.configData.compId) {
        this.current = 1;
        this.currentRadioObj = null;
        this.multiEntityArr = [];
        this.getSidebarList();
        return;
      }
      // 搜索刷新
      if (areaArr === 'searchCurrent' && compId === this.configData.compId) {
        if (!this.configData.isTreeGantt) {
          this.current = 1;
          this.configData.headerSearch = null;
          this.getSidebarList();
        }
        console.log(this.configData.searchInfo);
        return;
      }
      if (areaArr === 'treeUpdate') {
        if (btnType === 1) {
          this.treeSave(isAdd);
        } else if (btnType === 2) {
          this.treeDelete();
        }
      }
      if (areaArr.includes(this.configData.compId)) {
        this.current = 1;
        this.currentRadioObj = null;
        this.multiEntityArr = [];
        this.getSidebarList();
      }
    },
    // 树的保存
    async treeSave(isAdd) {
      console.log(isAdd, sessionStorage.ganttCurId);
      if (!sessionStorage.ganttCurId) {
        return;
      }
      const filterMap = JSON.stringify(this.getFilterParams());
      const params = {
        dataPermissions: this.getDataPermissions,
        compId: this.configData.compId,
        compMap: filterMap,
        sysMenuDesignId: this.sysMenuDesignId(),
        panelCompId: this.getValueFromFather('panelCompId'),
        relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
        ...this.getListParams,
        workflowFilter: `${this.configData.tableInfo.tableName}.id=${sessionStorage.ganttCurId}`,
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
      const res = await ganttList(params);
      console.log(res);
      res.forEach((item) => {
        item.start_date = item[this.configData.taskColumn.startTime.columnName];
        item.end_date = item[this.configData.taskColumn.endTime.columnName];
        item.progress =
          item[this.configData.taskColumn.progress.columnName] || '';
        item.parent =
          item[this.configData.taskColumn.parentId.columnName] || '';
        item.text = item[this.dropColumnData[0].compId];
      });
      if (isAdd) {
        this.$refs.gantt.addTask(res[0]);
      } else {
        this.$refs.gantt.updateTask(res[0].id, res[0]);
      }
    },
    // 树的删除
    treeDelete() {
      if (!sessionStorage.ganttDelId) {
        return false;
      }
      this.$refs.gantt.addTask(sessionStorage.ganttDelId);
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
    // getListParams(callback) {
    //   const filterMap = JSON.stringify(this.getFilterParams());
    //   const params = {
    //     dataPermissions: this.getDataPermissions,
    //     compId: this.configData.compId,
    //     compMap: filterMap,
    //     sysMenuDesignId: this.sysMenuDesignId(),
    //     panelCompId: this.getValueFromFather('panelCompId'),
    //     relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
    //   };
    //   const panelFilter = this.getCurAreaTerm(
    //     this.getValueFromFather('panelFilter'),
    //   );
    //   if (panelFilter) {
    //     params.panelFilter = [panelFilter];
    //   }
    //   // 最外层的才会有菜单跳转条件
    //   if (this.getFatherPanel && !this.getFatherPanel()) {
    //     if (+this.$route.query.isJump === 1) {
    //       const menuFilter = this.getCurAreaTerm(this.getCurMenu('menuFilter'));
    //       if (menuFilter) {
    //         params.panelFilter = [menuFilter];
    //       }
    //     }
    //   }

    //   callback(params);
    // },
    getStateColor(state) {
      try {
        const { dictKey } = this.configData.taskDict;
        const dictArr = this.$store.getters.getCurDict(dictKey);
        const res = dictArr.find((dict) => +dict.value === +state);
        if (res) {
          return res.color;
        }
      } catch (error) {
        return '';
      }
      return '';
    },
    // 获取列表数据
    async getSidebarList(sortStr) {
      // console.log(this.getFatherPanel());
      // console.log(this.onlyFlag());
      if (this.isPreview) {
        return false;
      }
      this.loading = true;
      const filterMap = JSON.stringify(this.getFilterParams());
      const data = [];
      this.tableData.data = [];
      const { isTreeGantt } = this.configData;
      // console.log(this.configData.searchInfo);
      if (!isTreeGantt) {
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
          ...this.getPageParams,
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
        const res = await ganttPage(params);
        if (res.records.length) {
          const nowIds = [];
          res.records.forEach((now) => {
            now.__current__state__ = 1;
            const nowKeys = Object.keys(now);
            now.tempId = now.id;
            nowIds.push(now.id);
            now.id =
              now[this.configData.taskColumn.associatedColumn.columnName];
            if (
              nowKeys.includes(this.configData.taskColumn.interval.columnName)
            ) {
              now.render = 'split';
              now.type = 'project';
              now.color = '#ffffff';
            } else {
              now.type = 'task';
              now.color = this.getStateColor(
                now[this.configData.taskColumn.state.columnName],
              );
            }
            now.parent = 0;
            now.start_date =
              now[this.configData.taskColumn.startTime.columnName];
            now.end_date = now[this.configData.taskColumn.endTime.columnName];
            now.text = now[this.dropColumnData[0].compId];
            data.push(now);
          });
          res.ganttMap.futureList.forEach((future) => {
            future.__current__state__ = 2;
            future.parent =
              future[this.configData.taskColumn.associatedColumn.columnName];
            future.start_date =
              future[this.configData.taskColumn.startTime.columnName];
            future.end_date =
              future[this.configData.taskColumn.endTime.columnName];
            future.color = this.getStateColor(
              future[this.configData.taskColumn.state.columnName],
            );
            future.text = '未来预测数据';
            data.push(future);
          });
          res.ganttMap.historyList.forEach((his) => {
            his.__current__state__ = 3;
            if (nowIds.includes(his.id)) {
              his.__current__state__ = 1;
            }
            his.parent =
              his[this.configData.taskColumn.associatedColumn.columnName];
            his.start_date =
              his[this.configData.taskColumn.startTime.columnName];
            his.end_date = his[this.configData.taskColumn.endTime.columnName];
            his.color = this.getStateColor(
              his[this.configData.taskColumn.state.columnName],
            );
            his.text = his[this.dropColumnData[0].compId];
            data.push(his);
          });
        }
        this.total = res.total;
      } else {
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
          ...this.getListParams,
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
        const res = await ganttList(params);
        console.log(res);
        res.forEach((item) => {
          item.start_date =
            item[this.configData.taskColumn.startTime.columnName];
          item.end_date = item[this.configData.taskColumn.endTime.columnName];
          item.progress =
            item[this.configData.taskColumn.progress.columnName] || '';
          item.parent =
            item[this.configData.taskColumn.parentId.columnName] || '';
          item.text = item[this.dropColumnData[0].compId];
          data.push(item);
        });
      }
      // console.log(data);

      this.tableData.data = data;
      this.$refs.gantt.reload();
      this.loading = false;
      // 代表当前是数据选择框打开的弹窗
      if (this.getSelData() && this.getSelData().name) {
        this.setTableDataSel();
      }
      if (sessionStorage.notInitMul === '1') {
        sessionStorage.notInitMul = '';
        this.selectTableRow();
      }
      // if (data && data.length) {
      //   this.selectItem(data[0]);
      // } else {
      this.$bus.$emit('changeShowSkeleton');
      // }
    },
    // 列表排序  ASC ascending升序  DESC descending降序
    sortChange(column) {
      if (this.tableData.data.length === 0) {
        return;
      }
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
  },
  beforeDestroy() {
    console.log('列表销毁监听');
    sessionStorage.__current__mulArr__id = '';
    this.$bus.$off(this.getEventName, this.reloadArea);
    this.$bus.$off(`loadSomeArea_${this.parent.compId}`, this.loadArea);

    if (this.defaultForm) {
      this.getFeatureArr.form = JSON.parse(JSON.stringify(this.defaultForm));
    }
  },

  watch: {
    async current(v) {
      if (!v) {
        this.backCurrent = 1;
      }
      if (this.backCurrent !== v && v) {
        this.backCurrent = v;
        await this.getSidebarList();
      }
    },
    multiEntityArr(v) {
      if (!this.notTouch) {
        this.$bus.$emit(
          `multiArrChange${this.onlyFlag()}`,
          v,
          this.getCompIdMap,
        );
      }
    },
    curTime: {
      handler(v) {
        if (!v || v.length === 0) {
          const time = +new Date();
          const beforeTime = time - 6 * 30 * 24 * 3600 * 1000;
          const afterTime = time + 6 * 30 * 24 * 3600 * 1000;
          this.curTime = [
            formatDate(new Date(beforeTime), 'yyyy-MM-dd'),
            formatDate(new Date(afterTime), 'yyyy-MM-dd'),
          ];
        }
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.GanttMain {
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
  &__btns {
    position: relative;
    padding: 0 10px;
    height: 56px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .iconfont {
      margin-right: 4px;
    }
    .configButton {
      position: absolute;
      z-index: 2;
      ::v-deep {
        .configManage__del {
          display: none !important;
        }
      }
    }
    .btnMask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
      background: rgba(233, 233, 233, 0.5);
    }
  }
  .hasConfig {
    width: calc(100% - 52px);
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
    height: calc(100% - 56px);
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
    .GanttMain__feature {
      padding: 0;
      // height: calc(100% - 56px);
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
    .GanttMain__card {
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
    .GanttMain__cardRight {
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
.ganttBox {
  height: 100%;
  overflow: hidden;
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
