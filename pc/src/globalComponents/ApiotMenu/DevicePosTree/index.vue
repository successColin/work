<template>
  <div
    class="menuMain"
    :class="[
      { flexReserve: configData.pageType === 3 },
      { notConfig: !isConfig },
      { showTitle: configData.showTitle },
      { isApp: $route.query.isApp == 1 },
      { notSidebar: !isSidebar },
    ]"
    @click="changeCurActiveObj(1, $event)"
    :tip="configData.name"
    :title="isConfig ? configData.name : ''"
  >
    <BtnsArea
      class="menuMain__btns"
      v-if="configData.children.length !== 0 && !isConfig"
      :configData="configData"
      :activeObj="activeObj"
      :grandFather="configData"
      :hasTriggerComp="hasTriggerComp"
      :isSidebar="isSidebar"
      :isTree="true"
      :canSearch="true"
      :getBtnsArr="getBtnsArr"
      :getFeatureArr="getFeatureArr"
      :fileDeleteIds="fileDeleteIds"
      :moreOperateArr="moreOperateArr"
      @click.native="changeCurActiveObj(2, $event)"
      :btnTypesArr="[3, 5]"
    ></BtnsArea>
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
        { hiddenBtnArea: isConfig },
      ]"
      configData="功能区"
    >
      <div class="menuMain__cardRight" v-loading="loading">
        <!-- 配置页 -->
        <draggable
          v-if="isConfig"
          v-model="getFeatureArr.children"
          style="height: 100%"
          group="comp"
          animation="300"
          ghostClass="featGhost"
          filter=".notMove"
          :areaType="1"
          :isSidebar="isSidebar"
          :isTree="true"
          @start="featDragStart"
          @end="featDragEnd"
          :move="featDragMove"
          :disabled="true"
        >
          <transition-group class="menuMain__feature--compList" tag="ul">
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
              :isTree="true"
              :getBtnsArr="child"
              :getFeatureArr="getFeatureArr"
              :moreOperateArr="[]"
              :btnTypesArr="[2, 3, 5]"
              :isSidebar="isSidebar"
            ></component> </transition-group
        ></draggable>
        <!-- 应用页 -->
        <div
          style="height: 100%"
          class="menuMain__feature--compList"
          :class="[{ noData: sidebarData.length === 0 }]"
          v-else
        >
          <SingleTree
            ref="tree"
            v-show="!showList"
            :treeData="sidebarData"
            :parent="getFeatureArr"
            :activeObj="activeObj"
            :hasTriggerComp="hasTriggerComp"
            :fileDeleteIds="fileDeleteIds"
            :showType="showType"
            :isTree="true"
            :configData="configData"
            :grandFather="configData"
            :isSidebar="isSidebar"
            :getBtnsArr="getTreeBtnsArr"
            :getFeatureArr="getFeatureArr"
            :getIdCompId="getIdCompId"
            :showCheckbox="showCheckbox"
            :showSinglebox="showSinglebox"
            :multiEntityArr="multiEntityArr"
            :panelConfig="panelConfig"
            @changeForm="changeForm"
            @changeFormToCurrent="changeFormToCurrent"
            @getListParams="getListParams"
            @node-click="nodeClick"
            @selectTreeNode="selectTreeNode"
            @deleteSuccess="treeDelete"
          ></SingleTree>
          <div class="searchList" ref="searchList" v-show="showList">
            <div
              class="searchList__scroll"
              ref="scroll"
              v-if="sidebarData.length"
            >
              <SingleTree
                v-for="(child, i) in sidebarData"
                :ref="`tree${i}`"
                :key="`${child.id}_${i}`"
                :treeData="[child]"
                :parent="getFeatureArr"
                :activeObj="activeObj"
                :hasTriggerComp="hasTriggerComp"
                :fileDeleteIds="fileDeleteIds"
                :showType="showType"
                :isTree="true"
                :configData="configData"
                :grandFather="configData"
                :isSidebar="isSidebar"
                :getBtnsArr="getTreeBtnsArr"
                :getFeatureArr="getFeatureArr"
                :getIdCompId="getIdCompId"
                :showCheckbox="showCheckbox"
                :showSinglebox="showSinglebox"
                :multiEntityArr="multiEntityArr"
                :panelConfig="panelConfig"
                @changeForm="changeForm"
                @changeFormToCurrent="changeFormToCurrent"
                @getListParams="getListParams"
                @node-click="nodeClick($event, i)"
              ></SingleTree>
            </div>
            <div class="nodata" v-else v-show="!loading">暂无数据</div>
          </div>
        </div>
      </div>
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
</template>

<script>
import { createUnique, throttle } from '@/utils/utils';
import {
  listDeviceTree,
  pageDevicePositionTree,
  selectList,
  getDesignMenu
} from '@/api/menuConfig';
import initAreaMixin from '../initAreaMixin';
import SingleTree from './SingleTree';

export default {
  props: {
    showType: {
      // 用于流程
      type: Object,
      default: () => {}
    },
    configData: {
      type: [Array, Object]
    },
    activeObj: {
      type: [Array, Object]
    },
    hasTriggerComp: {
      type: Object
    },
    isSidebar: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moreOperateArr: [],
      fileDeleteIds: [],
      isMenuMain: true,
      sidebarData: [],
      current: 1,
      showList: false,
      pageCount: 0, // 不满50 条数据的次数
      noMore: false, // 没有更多数据，数据为0 或者不满50条 的次数两次
      loading: false, // 请求中
      selectKey: '',
      pageFlag: 0,
      pageData: [], // 分页暂存数据
      panelConfig: {},
      currentData: null,
      backKey: '',
      showCheckbox: false, // 是否展示多选
      showSinglebox: false, // 是否展示单选
      multiEntityArr: [] // 多选/单选值
    };
  },

  components: {
    SingleTree
  },

  inject: [
    'isConfig',
    'getAllForm',
    'sysMenuDesignId',
    'getFatherPanel',
    'getSelData',
    'onlyFlag',
    'changeTabChange'
  ],
  mixins: [initAreaMixin],
  computed: {
    getFeatureArr() {
      const index = this.configData.children.findIndex((child) => child.areaType === 1);
      return index === -1 ? { children: [] } : this.configData.children[index];
    },
    getBtnsArr() {
      const index = this.configData.children.findIndex((child) => child.areaType === 2);
      return index === -1 ? { children: [] } : this.configData.children[index];
    },
    getTreeBtnsArr() {
      if (this.getFeatureArr.children.length) {
        const obj = this.getFeatureArr.children.find((comp) => comp.compName === 'BtnsArea');
        if (obj) {
          return obj;
        }
      }
      return { children: [] };
    },
    getButtonStyle() {
      return (i) => {
        if (this.getBtnsArr.children.length - this.getBtnsArr.rightIndex === i) {
          return 'margin-left: auto';
        }
        return '';
      };
    },
    // 获取图标
    getCurDict() {
      return (item, flag) => {
        let compId = this.configData.iconId;
        if (flag === 2) {
          compId = this.configData.iconColorId;
        }
        const index = this.getFeatureArr.children.findIndex((child) => child.compId === compId);
        if (index !== -1) {
          const comp = this.getFeatureArr.children[index];
          const dict = comp.dataSource.dictObj;
          const dictArr = this.$store.getters.getCurDict(dict.dictKey);
          const res = dictArr.find((child) => child.value === item[compId]);
          if (res && res.icon) {
            if (flag === 1) {
              return res.icon.icon;
            }
            if (flag === 2) {
              return res.icon.color;
            }
          }
        }
        return '';
      };
    },
    // 获取id字段的组件id
    getIdCompId() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === 'id'
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    // 获取datatype的组件id
    getDataTypeCompId() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === 'dataType'
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    getPositionIdCompId() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === 'positionId'
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
          return item.id === this.getFeatureArr.form[this.getIdCompId];
        }
        return false;
      };
    },
    getEventName() {
      return 'reloadArea';
    },
    // 是否需要数据权限
    getDataPermissions() {
      if (this.$store.state.userCenter.userInfo.isSupAdmin) {
        return false;
      }
      return true;
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
    }
  },
  created() {
    if (
      !this.configData.posAddPos ||
      !this.configData.posAddDevice ||
      !this.configData.deviceAddDevice
    ) {
      this.configData.posAddPos = createUnique();
      this.configData.posAddDevice = createUnique();
      this.configData.deviceAddDevice = createUnique();
      // console.log(this.configData);
    }
  },
  mounted() {
    if (this.isConfig) {
      // console.log(this.isConfig);`
    } else {
      this.getMoreOperate();
      this.initFixData();
      this.initMulOrSingle();
      if (this.configData.shouldInit) {
        this.getSidebarList();
      }
      this.$bus.$on(this.getEventName, this.reloadArea);
      this.$refs.searchList.addEventListener('scroll', throttle(this.scrollThing));
      this.getPane();
    }
  },

  methods: {
    // 初始化单选多选
    initMulOrSingle() {
      if (this.getSelData() && this.getSelData().name) {
        if (this.getSelData().showInfo) {
          this.showCheckbox = true;
          this.showSinglebox = false;
        } else {
          this.showCheckbox = false;
          this.showSinglebox = true;
        }
        if (this.getSelData().value) {
          if (sessionStorage.notInitMul === '1') {
            sessionStorage.notInitMul = '';
            return;
          }
          const valueArr = this.getSelData().value.toString().split(',');
          const showArr =
            this.getSelData().showInfo && this.getSelData().showInfo.value
              ? this.getSelData().showInfo.value.split(',')
              : [];
          let showCompId = '';
          if (showArr.length !== 0) {
            const index = this.getFeatureArr.children.findIndex(
              (comp) => comp.dataSource.columnName === this.getSelData().showInfo.name
            );
            if (index !== -1) {
              showCompId = this.getFeatureArr.children[index].compId;
            }
          }
          valueArr.forEach((v, i) => {
            const obj = {};
            obj[this.getIdCompId] = v;
            if (showArr.length !== 0) {
              obj[showCompId] = showArr[i];
            }
            this.multiEntityArr.push(obj);
          });
        }
      } else {
        this.showCheckbox = false;
        this.showSinglebox = false;
      }
      // console.log(this.getSelData(), this.multiEntityArr, this.showSinglebox);
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
      }
    },
    // 获取字段组件id
    getCompId(coulumnName) {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource.columnName === coulumnName
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    initMulti(form) {
      // console.log(2, form);
      const arr = form.tagValue.split(',');
      const arr1 = form.tagValue_.split(',');
      this.multiEntityArr = [];
      arr.forEach((item, index) => {
        const obj = {};
        obj[this.getSelData().name] = +arr[index];
        obj[this.getIdCompId] = +arr[index];
        obj[this.getSelData().showInfo.name] = arr1[index];
        this.multiEntityArr.push(obj);
      });
      console.log(this.multiEntityArr);
    },
    // 请求新增的面板
    async getPane() {
      [1, 2].forEach((id) => {
        getDesignMenu({ panelId: id }).then((data) => {
          this.panelConfig[id] = data;
        });
      });
    },
    // 滚动事件
    scrollThing() {
      if (
        this.$refs.searchList.scrollTop + this.$refs.searchList.offsetHeight <
          this.$refs.scroll.offsetHeight - 50 &&
        !this.loading
      ) {
        this.current += 1;
        this.getSidebarList(true, 1, false);
      }
    },
    // 更新该区域
    reloadArea(areaArr, onlyFlag, compId, btnType, isAdd) {
      // console.log(areaArr);
      // 按钮全部刷新
      if (
        (areaArr === 'all' && onlyFlag === this.onlyFlag()) ||
        (this.showList && areaArr === 'treeUpdate')
      ) {
        if (this.configData.shouldInit) {
          this.getSidebarList();
        }
        return;
      }
      // 刷新当前区域
      if (
        (areaArr === 'current' || areaArr === 'searchCurrent') &&
        onlyFlag === this.onlyFlag() &&
        compId === this.configData.compId
      ) {
        this.current = 1;
        this.getSidebarList();
        return;
      }
      if (areaArr === 'treeUpdate' && onlyFlag === this.onlyFlag()) {
        if (btnType === 1) {
          this.treeSave(isAdd);
        } else if (btnType === 2) {
          this.treeDelete();
        }
      }
      if (areaArr.includes(this.configData.compId) && onlyFlag === this.onlyFlag()) {
        this.getSidebarList();
      }
    },
    // 一些固定值的初始化
    initFixData() {
      if (this.getFatherPanel()) {
        const keys = Object.keys(this.getFeatureArr.form);
        keys.forEach((key) => {
          if (this.getFatherPanel().panelFixData[key]) {
            this.getFeatureArr.form[key] = this.getFatherPanel().panelFixData[key];
          }
        });
      }
      // this.$refs.form.resetFields();
    },
    // 获取当前过滤条件需要的参数
    getFilterParams() {
      let obj = {};
      // 自身的
      const compMap = this.getAllForm();
      this.configData.termParams = `${
        this.configData.deviceFilter ? this.configData.deviceFilter.termParams : ''
      },${this.configData.positionFilter ? this.configData.positionFilter.termParams : ''}`;
      const arr = this.configData.termParams.split(',');
      arr.forEach((compId) => {
        if (compId) {
          obj[compId] = compMap[compId];
        }
      });
      // 面板的
      if (this.getFatherPanel() && this.getFatherPanel().panelVarObj[this.configData.compId]) {
        obj = {
          ...obj,
          ...this.getFatherPanel().panelVarObj[this.configData.compId]
        };
      }
      // 菜单跳转的
      if (+this.$route.query.isJump === 1) {
        const menuObj = this.getCurMenu('menuVarObj');
        if (menuObj) {
          obj = {
            ...obj,
            ...menuObj[this.configData.compId]
          };
        }
      }
      // 插入菜单id
      obj.MENU_ID = this.$route.params.id;
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
    getCurAreaTerm(filterArr, tableName) {
      if (filterArr) {
        const obj = filterArr.find(
          (filter) =>
            filter.compId === this.configData.compId && tableName === filter.tableInfo.tableName
        );
        return obj;
      }
      return '';
    },
    // 获取当前菜单的
    getCurMenu(params) {
      const jumpMenuObj = sessionStorage.jumpMenuObj ? JSON.parse(sessionStorage.jumpMenuObj) : '';
      if (jumpMenuObj) {
        const menu = jumpMenuObj[this.$route.params.id];
        // console.log(menu, menu.menuFilter);
        if (menu && menu[params]) {
          return menu[params];
        }
      }
      return '';
    },
    // 获取列表数据
    async getSidebarList(flag = true, dataType = 1, parentId = 1, needNext = true) {
      this.showList = false;
      // flag true 是搜索 false 不是搜索
      let data = [];
      let curLength = 0;
      this.loading = true;
      const { searchInfo } = this.configData;
      if (searchInfo && flag) {
        if (this.backKey !== searchInfo.searchValue) {
          this.backKey = searchInfo.searchValue;
          this.current = 1;
          this.pageFlag = 0;
          this.pageCount = 0;
          this.noMore = false;
        }
        if (this.noMore) {
          this.loading = false;
          return;
        }
        if (this.current === 1) {
          this.sidebarData = [];
          this.pageData = [];
        }
        this.showList = true;

        // 分页
        const params = {
          dataPermissions: this.getDataPermissions,
          current: this.current,
          size: 50,
          sysMenuDesignId: this.sysMenuDesignId(),
          searchValue: searchInfo.searchValue,
          isThisLevel: 3,
          pageFlag: this.pageFlag,
          deviceDesignRegionalTabInfoVO: this.configData.deviceFilter,
          positionDesignRegionalTabInfoVO: this.configData.positionFilter,
          compMap: JSON.stringify(this.getFilterParams())
        };

        // 最外层的才会有菜单跳转条件
        if (this.getFatherPanel && !this.getFatherPanel()) {
          if (+this.$route.query.isJump === 1) {
            const menuFilter = this.getCurMenu('menuFilter');
            const deviceFilter = this.getCurAreaTerm(menuFilter, 'sys_device');
            if (deviceFilter) {
              params.deviceDesignRegionalTabInfoVO = deviceFilter;
            }
            const positionFilter = this.getCurAreaTerm(menuFilter, 'sys_position');
            if (positionFilter) {
              params.positionDesignRegionalTabInfoVO = positionFilter;
            }
          }
        }
        if (this.showType && this.showType.type === 'flow') {
          this.makeFlowParams(params);
        }
        const res = await pageDevicePositionTree(params);
        const tempData = JSON.parse(JSON.stringify(this.pageData));
        tempData.push(...res.records);
        this.pageData = tempData;
        if (res.current) {
          this.pageFlag = res.current;
        }
        curLength = res.records.length;
        if (curLength < 50) {
          this.pageCount += 1;
        }
        // 第一次查出来设备的不再继续查
        if (this.pageFlag === 0 && this.pageData.length !== 0) {
          if (+this.pageData[this.pageData.length - 1].dataType === 2) {
            this.noMore = true;
            this.pageData.forEach((item) => {
              item.treeId = `${item.id}-${item.dataType}`;
              if (!item.childCount) {
                item.isLeaf = true;
              } else {
                item.isLeaf = false;
              }
            });
            this.sidebarData = this.pageData;
            this.$emit('showRight', this.sidebarData.length !== 0);
            this.$nextTick(() => {
              this.loading = false;
            });
            if (needNext) {
              this.$nextTick(() => {
                this.selectItem(this.sidebarData[0]);
              });
            }
            return;
          }
        }
        if (this.pageCount === 2) {
          this.noMore = true;
          this.pageData.forEach((item) => {
            item.treeId = `${item.id}-${item.dataType}`;
            if (!item.childCount) {
              item.isLeaf = true;
            } else {
              item.isLeaf = false;
            }
          });
          this.sidebarData = this.pageData;
          this.$emit('showRight', this.sidebarData.length !== 0);
          this.$nextTick(() => {
            this.loading = false;
          });
          if (needNext) {
            this.$nextTick(() => {
              this.selectItem(this.sidebarData[0]);
            });
          }
          return;
        }
        if (curLength === 0) {
          this.noMore = true;
          this.loading = false;
          return;
        }
      } else {
        // 重置分页的一些参数
        this.current = 1;
        this.pageFlag = 0;
        this.pageCount = 0;
        this.pageData = [];
        this.noMore = false;
        console.log(this.getDataPermissions);
        // 不分页
        const params = {
          dataPermissions: this.getDataPermissions,
          sysMenuDesignId: this.sysMenuDesignId(),
          parentId,
          isThisLevel: this.$store.state.userCenter.userInfo.roleIds.includes(1) ? 1 : 2,
          dataType,
          deviceDesignRegionalTabInfoVO: this.configData.deviceFilter,
          positionDesignRegionalTabInfoVO: this.configData.positionFilter,
          compMap: JSON.stringify(this.getFilterParams())
        };

        // 最外层的才会有菜单跳转条件
        if (this.getFatherPanel && !this.getFatherPanel()) {
          if (+this.$route.query.isJump === 1) {
            const menuFilter = this.getCurMenu('menuFilter');
            const deviceFilter = this.getCurAreaTerm(menuFilter, 'sys_device');

            if (deviceFilter) {
              params.deviceDesignRegionalTabInfoVO = deviceFilter;
            }
            const positionFilter = this.getCurAreaTerm(menuFilter, 'sys_position');
            if (positionFilter) {
              params.positionDesignRegionalTabInfoVO = positionFilter;
            }
          }
        }
        if (this.showType && this.showType.type === 'flow') {
          this.makeFlowParams(params);
        }
        data = await listDeviceTree(params);
      }
      data.forEach((item) => {
        item.treeId = `${item.id}-${item.dataType}`;
        if (!item.childCount) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
      });
      if (curLength !== 0 && curLength < 50) {
        this.current += 1;
        this.getSidebarList();
        return;
      }
      if (this.pageData.length !== 0) {
        data = this.pageData;
      }
      this.sidebarData = data;
      this.$emit('showRight', this.sidebarData.length !== 0);
      this.$nextTick(() => {
        this.loading = false;
      });
      if (needNext) {
        this.$nextTick(() => {
          this.selectItem(data[0]);
        });
      }
    },
    prevClick() {
      this.current -= 1;
    },
    nextClick() {
      this.current += 1;
    },
    sizeChange(v) {
      this.configData.rowNum = v;
      if (this.current === 1) {
        this.getSidebarList();
      } else {
        this.current = 1;
      }
    },
    changeCurActiveObj(areaType = 1, e) {
      if (!this.isConfig) {
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
    // 树节点点击
    nodeClick(data, index) {
      if (typeof index === 'number') {
        this.sidebarData.forEach((d, i) => {
          if (i !== index) {
            this.$refs[`tree${i}`][0].getTree().setCurrentKey();
          }
        });
      }
      this.selectItem(data, true, false);
    },
    // 按钮点击时，选中当前点击的
    selectTreeNode(data) {
      this.selectKey = `${data.id}-${data.dataType}`;
    },
    // 更改form的值
    changeForm(data) {
      this.changeTabChange(true);
      this.getFeatureArr.form[this.getIdCompId] = data.id;
      this.getFeatureArr.form[this.getDataTypeCompId] = data.dataType;
      this.getFeatureArr.form[this.getPositionIdCompId] = data.positionId;
      this.$nextTick(() => {
        this.changeTabChange(false);
      });
    },
    changeFormToCurrent() {
      this.selectItem(this.currentData, false);
    },
    // 选择当前item
    selectItem(item, flag = true, setFirst = true) {
      if (this.isConfig || !item) {
        return;
      }
      this.currentData = item;
      this.getFeatureArr.form[this.getIdCompId] = item.id;
      this.getFeatureArr.form[this.getDataTypeCompId] = item.dataType;
      this.getFeatureArr.form[this.getPositionIdCompId] = item.positionId;
      if (flag) {
        if (this.selectKey !== `${item.id}-${item.dataType}`) {
          this.$bus.$emit('returnFirst', this.onlyFlag());
        }
        this.selectKey = `${item.id}-${item.dataType}`;
      }

      // 触发其他区域数据的加载
      if (flag && this.configData.reloadArea.length) {
        // 选中节点
        if (setFirst) {
          this.$nextTick(() => {
            // 第一次选中
            if (this.$refs.tree) {
              this.$refs.tree.getTree().setCurrentKey(this.selectKey);
            }
            // 搜索结果第一次选中
            if (this.$refs.tree0) {
              setTimeout(() => {
                if (this.$refs.tree0[0]) {
                  this.$refs.tree0[0].getTree().setCurrentKey(this.selectKey);
                }
              });
            }
          });
        }

        // 点击触发tab显隐
        this.$bus.$emit('tabHidden', this.onlyFlag());
        this.$nextTick(() => {
          this.$bus.$emit(this.getEventName, this.configData.reloadArea, this.onlyFlag());
        });
      }
    },
    // 获取下级的参数
    getListParams(node, callBack) {
      const params = {
        dataPermissions: this.getDataPermissions,
        sysMenuDesignId: this.sysMenuDesignId(),
        isThisLevel: 2,
        dataType: node.data.dataType,
        parentId: node.data.id,
        deviceDesignRegionalTabInfoVO: this.configData.deviceFilter,
        positionDesignRegionalTabInfoVO: this.configData.positionFilter,
        compMap: JSON.stringify(this.getFilterParams())
      };
      // 最外层的才会有菜单跳转条件
      if (this.getFatherPanel && !this.getFatherPanel()) {
        if (+this.$route.query.isJump === 1) {
          const menuFilter = this.getCurMenu('menuFilter');
          const deviceFilter = this.getCurAreaTerm(menuFilter, 'sys_device');

          if (deviceFilter) {
            params.deviceDesignRegionalTabInfoVO = deviceFilter;
          }
          const positionFilter = this.getCurAreaTerm(menuFilter, 'sys_position');
          if (positionFilter) {
            params.positionDesignRegionalTabInfoVO = positionFilter;
          }
        }
      }
      callBack(params);
    },
    // 树的保存
    async treeSave(isAdd) {
      if (this.$refs.tree) {
        this.$refs.tree.getTree().setCurrentKey(this.selectKey);
      }
      const form = this.$refs.tree.getTree().getCurrentNode();
      // const filterMap = JSON.stringify(this.getFilterParams());
      if (!form) {
        return;
      }
      if (isAdd) {
        const node = this.$refs.tree.getTree().getNode(form);
        const params = {
          dataPermissions: this.getDataPermissions,
          sysMenuDesignId: this.sysMenuDesignId(),
          isThisLevel: 2,
          dataType: form.dataType,
          parentId: form.id,
          deviceDesignRegionalTabInfoVO: this.configData.deviceFilter,
          positionDesignRegionalTabInfoVO: this.configData.positionFilter,
          compMap: JSON.stringify(this.getFilterParams())
        };

        // 最外层的才会有菜单跳转条件
        if (this.getFatherPanel && !this.getFatherPanel()) {
          if (+this.$route.query.isJump === 1) {
            const menuFilter = this.getCurMenu('menuFilter');
            const deviceFilter = this.getCurAreaTerm(menuFilter, 'sys_device');

            if (deviceFilter) {
              params.deviceDesignRegionalTabInfoVO = deviceFilter;
            }
            const positionFilter = this.getCurAreaTerm(menuFilter, 'sys_position');
            if (positionFilter) {
              params.positionDesignRegionalTabInfoVO = positionFilter;
            }
          }
        }
        const data = await listDeviceTree(params);
        data.forEach((item) => {
          item.treeId = `${item.id}-${item.dataType}`;
          if (!item.childCount) {
            item.isLeaf = true;
          } else {
            item.isLeaf = false;
          }
        });
        if (node.expanded) {
          this.$refs.tree.getTree().updateKeyChildren(this.selectKey, data);
        } else if (data.length) {
          node.loaded = false;
          node.isLeaf = false;
        }
      } else {
        let params = {
          selectContent: '',
          selectFrom: '',
          selectWhere: ''
        };
        if (+form.dataType === 1) {
          params = {
            selectContent: 'id,name,keycode,parent_id,root_path',
            selectFrom: 'sys_position',
            selectWhere: `sys_position.id=${form.id}`
          };
        } else {
          params = {
            selectContent: 'id,name,keycode,position_id,parent_id,root_path',
            selectFrom: 'sys_device',
            selectWhere: `sys_device.id=${form.id}`
          };
        }
        const data = await selectList(params);
        Object.keys(data[0]).forEach((key) => {
          form[key] = data[0][key];
        });
        form.treeId = `${form.id}-${form.dataType}`;
      }
      this.selectItem(form);
    },
    // 树的删除
    treeDelete() {
      const form = this.$refs.tree.getTree().getCurrentNode();
      const node = this.$refs.tree.getTree().getNode(this.selectKey);
      if (`${form.id}-${form.dataType}` === this.selectKey) {
        this.$refs.tree
          .getTree()
          .setCurrentKey(`${node.parent.data.id}-${node.parent.data.dataType}`);
        const curForm = this.$refs.tree.getTree().getCurrentNode();
        this.selectItem(curForm);
      }
      this.$refs.tree.getTree().remove(node);
    }
  },

  beforeDestroy() {
    if (this.getFatherPanel) {
      // 在最外层的数据上才销毁
      if (!this.getFatherPanel()) {
        this.$bus.$off(this.getEventName, this.reloadArea);
      }
    } else {
      this.$bus.$off(this.getEventName, this.reloadArea);
    }
    if (!this.isConfig) {
      this.$refs.searchList.removeEventListener('scroll', throttle(this.scrollThing));
    }
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    },
    multiEntityArr(v) {
      this.$bus.$emit('multiArrChange', this.onlyFlag(), v, this.getCompIdMap);
    }
  }
};
</script>

<style lang='scss' scoped>
.menuMain {
  position: relative;
  box-sizing: border-box;
  // height: calc(100% - 20px);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.notSidebar {
    height: 300px;
    margin: 10px;
  }
  &.isApp {
    height: auto;
    margin: 10px;
    width: calc(100% - 20px);
  }
  &.showTitle {
    padding-top: 40px;
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
  &.flexReserve {
    flex-direction: column-reverse;
    .menuMain__btns {
      padding-bottom: 40px;
    }
  }

  &__feature {
    height: calc(100% - 50px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 10px;
    &.borderType:hover {
      border-width: 1px !important;
      border-style: solid !important;
      border-image: url(../../../assets/img/border-blue.svg) 1 round !important;
    }
    &.useStyle {
      // border: 1px solid #e9e9e9;
    }
    &.hiddenBtnArea {
      height: 100%;
    }
    ::v-deep {
      .el-form {
        height: 100%;
        & > div {
          height: 100%;
        }
      }
    }
    &--compList {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
      min-height: 100%;
      // & > div {
      //   margin-bottom: 10px;
      // }
      &.noData {
        ::v-deep {
          .el-tree {
            height: 100%;
          }
        }
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
    height: 100%;
    display: flex;
    align-items: center;
  }
  &__cardRight {
    height: 100%;
    flex: 1;
    max-width: 100%;
  }
  &.notConfig {
    margin: 0;
    height: 100%;
    .menuMain__feature {
      padding: 0;
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
      padding: 12px 0 12px 17px;
      border-left: 3px solid transparent;
      margin: 0 8px 8px 8px;
      cursor: pointer;
      height: auto;
      border-radius: 4px;
      display: flex;
      &:hover {
        background-color: #f6f6f8;
      }
      &.active {
        background-color: #f1f7ff;
        border-left-color: $--color-primary;
      }
    }
    .menuMain__cardLeft {
      width: 42px;
      .iconfont {
        display: inline-block;
        font-size: 30px;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        overflow: hidden;
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
.searchList {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
  ::v-deep {
    .elTree {
      height: min-content;
      overflow: initial;
    }
  }
}
.nodata {
  height: 60px;
  line-height: 60px;
  font-size: 13px;
  text-align: center;
  color: #999999;
}
</style>
