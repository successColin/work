<template>
  <div
    class="menuMain treeArea"
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
      v-if="(configData.children.length !== 0 && !isConfig) || isSelect"
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
      :btnTypesArr="[2, 3, 4, 5, 15]"
    ></BtnsArea>
    <section
      v-if="configData.children.length !== 0"
      class="menuMain__feature"
      v-loading="loading"
      element-loading-background="hsla(0,0%,100%,.9)"
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
      <div class="menuMain__cardRight">
        <!-- 预览模式 -->
        <div
          style="height: 100%"
          class="menuMain__feature--compList"
          v-if="isPreview"
        >
          <PreviewTree :previewData="previewData"></PreviewTree>
        </div>
        <!-- 配置页 -->
        <draggable
          v-else-if="isConfig"
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
          :disabled="!isConfig"
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
              :btnTypesArr="[2, 3, 4, 5, 15]"
              :isSidebar="isSidebar"
            ></component> </transition-group
        ></draggable>
        <!-- 应用页 -->
        <div style="height: 100%" class="menuMain__feature--compList" v-else>
          <SingleTree
            ref="tree"
            :class="`tree${configData.compId}`"
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
            @changeForm="changeForm"
            @changeFormToCurrent="changeFormToCurrent"
            @getListParams="getListParams"
            @node-click="nodeClick"
            @selectTreeNode="selectTreeNode"
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
                :key="i"
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
                @changeForm="changeForm"
                @changeFormToCurrent="changeFormToCurrent"
                @getListParams="getListParams"
                @node-click="nodeClick($event, i)"
              ></SingleTree>
            </div>
            <div class="nodata" v-else>暂无数据</div>
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
import {
  getSidebarList,
  getSidebarPage,
  getSidebarSingle,
} from '@/api/menuConfig';
import { throttle } from '@/utils/utils';
import initAreaMixin from '../initAreaMixin';
import SingleTree from './SingleTree';
import PreviewTree from '../MultiTree/PreviewTree';

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
  },
  data() {
    return {
      moreOperateArr: [],
      fileDeleteIds: [],
      isMenuMain: true,
      sidebarData: [],
      current: 1,
      total: 0,
      showList: false,
      noMore: false, // 没有更多数据
      loading: false, // 请求中
      selectKey: '',
      currentData: null,
      backKey: '',
      showCheckbox: false, // 是否展示多选
      showSinglebox: false, // 是否展示单选
      multiEntityArr: [], // 多选/单选值
      needSearch: false,
      notReloadArea: false,
    };
  },

  components: {
    SingleTree,
    PreviewTree,
  },

  inject: [
    'isConfig',
    'getAllForm',
    'sysMenuDesignId',
    'getFatherPanel',
    'onlyFlag',
    'getSelData',
    'changeTabChange',
    'isSelect',
    'isPreview',
  ],
  mixins: [initAreaMixin],
  computed: {
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
    getTreeBtnsArr() {
      if (this.getFeatureArr.children.length) {
        const obj = this.getFeatureArr.children.find(
          (comp) => comp.compName === 'BtnsArea',
        );
        if (obj) {
          return obj;
        }
      }
      return { children: [] };
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
    // 获取图标
    getCurDict() {
      return (item, flag) => {
        let compId = this.configData.iconId;
        if (flag === 2) {
          compId = this.configData.iconColorId;
        }
        const index = this.getFeatureArr.children.findIndex(
          (child) => child.compId === compId,
        );
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
  },

  created() {
    this.configData.isSidebar = this.isSidebar;
  },

  mounted() {
    if (!this.isConfig) {
      this.getMoreOperate();
    }
    if (!this.isConfig && !this.isPreview) {
      // console.log(this.isConfig);
      this.initFixData();
      this.initMulOrSingle();
      if (this.configData.shouldInit) {
        this.getSidebarList();
      }

      this.$bus.$on(this.getEventName, this.reloadArea);
      this.$refs.searchList.addEventListener(
        'scroll',
        throttle(this.scrollThing),
      );
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
              (comp) =>
                comp.dataSource.columnName === this.getSelData().showInfo.name,
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
      // console.log(this.getSelData(), this.getIdCompId, this.multiEntityArr);
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
        (comp) => comp.dataSource.columnName === coulumnName,
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    initMulti(form) {
      // console.log(2, form);
      const keyArr = [];
      form.keys.forEach((item) => {
        if (this.getCompId(item)) {
          keyArr.push(this.getCompId(item));
        }
      });
      const arr = form.tagValue ? form.tagValue.split(',') : [];
      const arr1 = form.tagValue_ ? form.tagValue_.split(',') : [];
      this.multiEntityArr = [];
      arr.forEach((item, index) => {
        const obj = {};
        obj[keyArr[0]] = +arr[index];
        obj[keyArr[1]] = arr1[index];
        this.multiEntityArr.push(obj);
      });
    },
    // 滚动事件
    scrollThing() {
      if (
        this.$refs.searchList.scrollTop + this.$refs.searchList.offsetHeight >
          this.$refs.scroll.offsetHeight - 50 &&
        !this.loading
      ) {
        this.current += 1;
        this.getSidebarList(true, 1, false);
      }
    },
    // 更新该区域
    reloadArea(areaArr, compId, btnType, isAdd) {
      // 按钮全部刷新
      if (areaArr === 'all' || (this.showList && areaArr === 'treeUpdate')) {
        if (this.configData.shouldInit) {
          this.needSearch = true;
          this.getSidebarList();
        }
        return;
      }
      // 刷新当前区域
      if (
        (areaArr === 'current' || areaArr === 'searchCurrent') &&
        compId === this.configData.compId
      ) {
        this.current = 1;
        this.getSidebarList();
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
        this.getSidebarList();
      }
    },
    // 一些固定值的初始化
    initFixData() {
      if (this.getFatherPanel()) {
        const keys = Object.keys(this.getFeatureArr.form);
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
      // console.log(obj);
      // 插入菜单id
      obj.MENU_ID = this.$route.params.id || this.$route.query.menuId;
      return obj;
    },
    makeFlowParams(params) {
      const { tableInfo } = this.configData;
      console.log(this.configData, '3');
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
      if (jumpMenuObj) {
        const menu =
          jumpMenuObj[this.$route.params.id || this.$route.query.menuId];
        if (menu && menu[params]) {
          return menu[params];
        }
      }
      return '';
    },
    // 获取列表数据
    async getSidebarList(flag = true, nodeId = 1, needNext = true) {
      if (this.isPreview) {
        return;
      }
      this.loading = true;
      this.showList = false;
      // flag true 是搜索 false 不是搜索
      const filterMap = JSON.stringify(this.getFilterParams());
      let data = [];
      const { searchInfo } = this.configData;
      if (searchInfo && flag) {
        if (this.backKey !== searchInfo.searchValue) {
          this.backKey = searchInfo.searchValue;
          this.current = 1;
          this.noMore = false;
        }
        if (this.needSearch) {
          this.backKey = searchInfo.searchValue;
          this.current = 1;
          this.noMore = false;
          this.needSearch = false;
        }
        if (this.noMore) {
          return;
        }
        if (this.current === 1) {
          this.sidebarData = [];
        }
        this.showList = true;
        this.loading = true;

        // 分页
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          current: this.current,
          size: 50,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          searchInfo: this.configData.searchInfo,
          dataSource: this.configData.tableInfo.tableName,
          isThisLevel: 3,
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
        if (this.showType && this.showType.type === 'flow') {
          this.makeFlowParams(params);
        }
        const res = await getSidebarPage(params);
        this.loading = false;
        if (res.records.length === 0) {
          this.noMore = true;
          return;
        }
        const tempData = JSON.parse(JSON.stringify(this.sidebarData));
        tempData.push(...res.records);
        data = tempData;
        this.total = res.total;
      } else {
        this.current = 1;
        this.noMore = false;
        // 不分页
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          dataSource: this.configData.tableInfo.tableName,
          isThisLevel: this.$store.state.userCenter.userInfo.isSupAdmin ? 1 : 2,
          nodeId,
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
              params.nodeId = '';
              params.isThisLevel = 3;
              params.panelFilter = [menuFilter];
            }
          }
        }
        if (this.showType && this.showType.type === 'flow') {
          this.makeFlowParams(params);
        }
        data = await getSidebarList(params);
        this.loading = false;
      }
      data.forEach((item) => {
        if (!item.childCount) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
      });
      this.sidebarData = data;
      this.$emit('showRight', this.sidebarData.length !== 0);
      this.$nextTick(() => {
        this.loading = false;
      });
      if (needNext && data.length) {
        this.$nextTick(() => {
          this.selectItem(data[0]);
          if (!(searchInfo && flag)) {
            // 正常树打开第一个节点
            if (this.$refs.tree) {
              this.$refs.tree.getTree().setCurrentKey(this.selectKey);
              this.$nextTick(() => {
                this.notReloadArea = true;
                document
                  .querySelector(`.tree${this.configData.compId} .is-current`)
                  .firstChild.click();
              });
            }
          }
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
    // 树节点点击
    nodeClick(data, index) {
      if (this.notReloadArea) {
        this.notReloadArea = false;
        return;
      }
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
      this.selectKey = data[this.getIdCompId];
    },
    // 更改form的值
    changeForm(data) {
      this.changeTabChange(true);
      this.getFeatureArr.form = {
        ...data,
      };
      this.$nextTick(() => {
        this.changeTabChange(false);
      });
    },
    changeFormToCurrent() {
      this.selectItem(this.currentData, false);
    },
    // 选择当前item
    selectItem(item, flag = true, setFirst = true, returnFirst = true) {
      if (this.isConfig) {
        return;
      }
      this.currentData = item;
      this.getFeatureArr.form = {
        ...item,
      };
      if (flag && returnFirst) {
        if (this.selectKey !== item[this.getIdCompId]) {
          this.$bus.$emit(`returnFirst${this.onlyFlag()}`);
        }
        this.selectKey = item[this.getIdCompId];
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
        if (returnFirst) {
          this.$bus.$emit(`tabHidden${this.onlyFlag()}`);
        }
        this.$nextTick(() => {
          this.$bus.$emit(this.getEventName, this.configData.reloadArea);
        });
      } else {
        this.$bus.$emit('changeShowSkeleton');
      }
    },
    // 获取下级的参数
    getListParams(node, callBack) {
      const filterMap = JSON.stringify(this.getFilterParams());

      const params = {
        dataPermissions: this.getDataPermissions,
        compId: this.configData.compId,
        compMap: filterMap,
        sysMenuDesignId: this.sysMenuDesignId(),
        panelCompId: this.getValueFromFather('panelCompId'),
        relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
        dataSource: this.configData.tableInfo.tableName,
        isThisLevel: 2,
        nodeId: node.data[this.getIdCompId],
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
          if (menuFilter && menuFilter.enableChildSearch === 1) {
            params.panelFilter = [menuFilter];
          }
        }
      }
      callBack(params);
    },
    // 树的保存
    async treeSave(isAdd) {
      this.$refs.tree.getTree().setCurrentKey(this.selectKey);
      const form = this.$refs.tree.getTree().getCurrentNode();
      const filterMap = JSON.stringify(this.getFilterParams());
      if (!form) {
        return;
      }
      if (isAdd) {
        const node = this.$refs.tree.getTree().getNode(form);
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          dataSource: this.configData.tableInfo.tableName,
          isThisLevel: 2,
          nodeId: form[this.getIdCompId],
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
            if (menuFilter && menuFilter.enableChildSearch === 1) {
              params.panelFilter = [menuFilter];
            }
          }
        }
        const data = await getSidebarList(params);
        data.forEach((item) => {
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
        const parentNode = this.$refs.tree.getTree().getNode(this.selectKey);
        if (parentNode) {
          parentNode.data.childCount += 1;
        }
      } else {
        const params = {
          compId: this.configData.compId,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
          workflowFilter: `${this.configData.tableInfo.tableName}.id=${
            form[this.getIdCompId]
          }`,
        };
        const data = await getSidebarSingle(params);
        Object.keys(data).forEach((key) => {
          form[key] = data[key];
        });
      }
      this.selectItem(form, true, true, false);
    },
    // 树的删除
    treeDelete() {
      const form = this.$refs.tree.getTree().getCurrentNode();
      const node = this.$refs.tree.getTree().getNode(this.selectKey);
      const parentKey = `${node.parent.data[this.getIdCompId]}`;
      if (form[this.getIdCompId] === this.selectKey) {
        this.$refs.tree.getTree().setCurrentKey(parentKey);
        const curForm = this.$refs.tree.getTree().getCurrentNode();
        this.selectItem(curForm);
      }
      this.$refs.tree.getTree().remove(node);
      const parentNode = this.$refs.tree.getTree().getNode(parentKey);
      if (parentNode) {
        parentNode.data.childCount -= 1;
      }
    },
  },

  beforeDestroy() {
    this.$bus.$off(this.getEventName, this.reloadArea);

    if (!this.isConfig && this.$refs.searchList) {
      this.$refs.searchList.removeEventListener(
        'scroll',
        throttle(this.scrollThing),
      );
    }
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    },
    multiEntityArr(v) {
      this.$bus.$emit(`multiArrChange${this.onlyFlag()}`, v, this.getCompIdMap);
    },
  },
};
</script>

<style lang="scss" scoped>
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
    width: calc(100% - 20px);
  }
  &.isApp {
    height: auto;
    margin: 10px;
    width: calc(100% - 20px);
  }
  &.showTitle {
    font-size: 15px;
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
      ::v-deep {
        .el-tree {
          height: 100%;
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
