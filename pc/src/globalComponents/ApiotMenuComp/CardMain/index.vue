<template>
  <div
    class="menuMain"
    :class="[
      { flexReserve: configData.pageType === 3 },
      { notConfig: !isConfig },
      { showTitle: configData.showTitle },
      { isApp: $route.query.isApp == 1 },
    ]"
    @click="changeCurActiveObj(1, $event)"
    :tip="configData.name"
    :title="isConfig ? configData.name : ''"
  >
    <BtnsArea
      class="menuMain__btns"
      :class="[{ isApp: $route.query.isApp == 1 }]"
      v-if="configData.children.length !== 0"
      :configData="configData"
      :activeObj="activeObj"
      :grandFather="configData"
      :hasTriggerComp="hasTriggerComp"
      :isSidebar="isSidebar"
      :isCard="true"
      :canSearch="true"
      :getBtnsArr="getBtnsArr"
      :getFeatureArr="getFeatureArr"
      :fileDeleteIds="fileDeleteIds"
      :moreOperateArr="moreOperateArr"
      @click.native="changeCurActiveObj(2, $event)"
      :btnTypesArr="[3, 5, 15]"
    ></BtnsArea>
    <section
      v-if="configData.children.length !== 0"
      v-loading="loading"
      element-loading-background="hsla(0,0%,100%,.9)"
      class="menuMain__feature"
      ref="scrollBox"
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
        { isApp: $route.query.isApp == 1 },
      ]"
      configData="功能区"
    >
      <div
        class="menuMain__card"
        :class="[{ active: isItemActive(item) }]"
        v-for="(item, index) in isConfig ? [{}] : sidebarData"
        :key="index"
        @click="selectItem(item, index)"
      >
        <div
          class="menuMain__cardLeft"
          v-if="!isConfig && configData.hasCardIcon"
        >
          <i
            :class="`iconfont ${getCurDict(item, 1)}`"
            :style="`color:${getCurDict(item, 2)}`"
          ></i>
        </div>
        <div
          class="menuMain__cardRight"
          :class="[
            {
              notConfig: !isConfig,
              hasIcon: !isConfig && configData.hasCardIcon,
            },
          ]"
        >
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
            :isCard="true"
            @start="featDragStart"
            @end="featDragEnd"
            :move="featDragMove"
            :disabled="!isConfig"
          >
            <transition-group class="menuMain__feature--compList" tag="ul">
              <component
                v-for="(child, i) in getFeatureArr.children"
                :class="[{ notMove: child.dataSource.columnName === 'id' }]"
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
                :isCard="true"
                :isCardOpeBtn="true"
                :labelValue="item ? item[child.compId] : ''"
                :getBtnsArr="getCardBtnsArr"
                :btnTypesArr="[2, 3, 4, 5]"
              ></component> </transition-group
          ></draggable>
          <!-- 应用页 -->
          <div style="height: 100%" class="menuMain__feature--compList" v-else>
            <component
              v-for="(child, i) in getFeatureArr.children"
              class="lastNotMargin"
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
              :isCard="true"
              :labelValue="
                item ? item[`${child.compId}_`] || item[`${child.compId}`] : ''
              "
              :getBtnsArr="getCardBtnsArr"
            ></component>
          </div>
        </div>
      </div>
      <div
        class="apiotNoData1"
        v-show="!isConfig && sidebarData && !sidebarData.length"
      ></div>
    </section>
    <SmallPagination
      v-if="!isConfig && configData.hasPagination"
      class="menuMain__feature--pagination"
      :current.sync="current"
      @prev-click="prevClick"
      @next-click="nextClick"
      @sizeChange="sizeChange"
      :total="total"
      :rowNum="configData.rowNum"
    ></SmallPagination>
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
import { createUnique } from '@/utils/utils';
import { getSidebarList, getSidebarPage } from '@/api/menuConfig';
import initAreaMixin from '../initAreaMixin';

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
      total: 0,
      currentIndex: 0,
      currentScroll: 0
    };
  },

  components: {},

  inject: [
    'isConfig',
    'getAllForm',
    'sysMenuDesignId',
    'getFatherPanel',
    'onlyFlag',
    'getNotInitArr',
    'isSelect'
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
    getCardBtnsArr() {
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
        const index = this.getFeatureArr.children.findIndex((child) => child.compId === compId);
        if (index !== -1) {
          const comp = this.getFeatureArr.children[index];
          const dict = comp.dataSource.dictObj;
          const dictArr = this.$store.getters.getCurDict(dict.dictKey);
          const res = dictArr.find((child) => +child.value === +item[compId]);
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
    // 是否选中
    isItemActive() {
      return (item) => {
        if (this.getFeatureArr.form) {
          return item[this.getIdCompId] === this.getFeatureArr.form[this.getIdCompId];
        }
        return false;
      };
    },
    getEventName() {
      return this.showType && this.showType.type === 'flow'
        ? `${this.showType.type}_reloadArea`
        : 'reloadArea';
    },
    // 是否需要数据权限
    getDataPermissions() {
      if (this.$store.state.userCenter.userInfo.isSupAdmin) {
        return false;
      }
      if (this.showType && this.showType.type === 'flow') {
        return false;
      }
      return this.configData.needPermissions == null ? true : this.configData.needPermissions;
    }
  },

  mounted() {
    if (this.isConfig) {
      // console.log(this.isConfig);
    } else {
      this.getMoreOperate();
      this.initFixData();
      if (!this.getNotInitArr().includes(this.configData.compId)) {
        this.getSidebarList();
      }
      this.$bus.$on(this.getEventName, this.reloadArea);
    }
  },

  methods: {
    // 更新该区域
    reloadArea(areaArr, onlyFlag, compId) {
      // 按钮全部刷新
      if (areaArr === 'all' && onlyFlag === this.onlyFlag()) {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
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
      const menuFilter = this.getCurAreaTerm(this.getCurMenu('menuFilter'));
      if (this.getFatherPanel() && this.getFatherPanel().panelVarObj[this.configData.compId]) {
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
    getCurAreaTerm(filterArr) {
      if (filterArr) {
        const obj = filterArr.find((filter) => filter.compId === this.configData.compId);
        return obj;
      }
      return '';
    },
    // 获取当前菜单的
    getCurMenu(params) {
      const jumpMenuObj = sessionStorage.jumpMenuObj ? JSON.parse(sessionStorage.jumpMenuObj) : '';
      if (jumpMenuObj) {
        const menu = jumpMenuObj[this.$route.params.id];
        if (menu && menu[params]) {
          return menu[params];
        }
      }
      return '';
    },
    // 获取列表数据
    async getSidebarList() {
      this.loading = true;
      const filterMap = JSON.stringify(this.getFilterParams());
      let data = [];
      const { hasPagination } = this.configData;
      // console.log(111111111111, hasPagination);
      if (hasPagination) {
        const params = {
          dataPermissions: this.getDataPermissions,
          compId: this.configData.compId,
          current: this.current,
          size: this.configData.rowNum,
          compMap: filterMap,
          sysMenuDesignId: this.sysMenuDesignId(),
          panelCompId: this.getValueFromFather('panelCompId'),
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId')
        };
        const panelFilter = this.getCurAreaTerm(this.getValueFromFather('panelFilter'));
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
        const { compName } = this.configData;
        if (this.showType && this.showType.type === 'flow' && compName === 'CardMain') {
          this.makeFlowParams(params);
        }
        // console.log(params);
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
          relationMenuDesignId: this.getValueFromFather('relationMenuDesignId')
        };
        const panelFilter = this.getCurAreaTerm(this.getValueFromFather('panelFilter'));
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
        if (this.showType && this.showType.type === 'flow') {
          this.makeFlowParams(params);
        }
        data = await getSidebarList(params);
      }
      this.sidebarData = data;
      this.loading = false;
      this.$emit('showRight', this.sidebarData ? this.sidebarData.length !== 0 : false);
      if (data && data.length) {
        if (!data[this.currentIndex]) {
          this.currentIndex = 0;
        }
        this.selectItem(data[this.currentIndex], this.currentIndex);
      } else {
        this.$bus.$emit('changeShowSkeleton');
      }
    },
    prevClick() {
      this.current -= 1;
    },
    nextClick() {
      this.current += 1;
    },
    sizeChange(v) {
      this.currentIndex = 0;
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
    //   }
    // },
    // 选择当前item
    selectItem(item, index) {
      if (this.isConfig) {
        return;
      }
      if (this.currentIndex !== index) {
        this.currentIndex = index;
        this.$bus.$emit('returnFirst', this.onlyFlag());
      }

      this.getFeatureArr.form = {
        ...item
      };
      // 触发其他区域数据的加载
      if (this.configData.reloadArea.length) {
        // 点击触发tab显隐
        this.$bus.$emit('tabHidden', this.onlyFlag());

        this.$nextTick(() => {
          this.$bus.$emit(this.getEventName, this.configData.reloadArea, this.onlyFlag());
        });
      } else {
        this.$bus.$emit('changeShowSkeleton');
      }
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
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    },
    current() {
      this.currentIndex = 0;
      this.getSidebarList();
    },
    'configData.canOperate': function (v) {
      if (v) {
        this.getFeatureArr.children.unshift({
          name: '操作',
          compName: 'BtnsArea',
          compId: createUnique(),
          children: [],
          dataSource: {
            columnName: ''
          }
        });
      } else {
        const index = this.getFeatureArr.children.findIndex((item) => item.compName === 'BtnsArea');
        this.getFeatureArr.children.splice(index, 1);
      }
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
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.isApp {
    height: 300px;
    margin: 10px;
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
      // padding-bottom: 40px;
      &.isApp {
        padding-bottom: 0;
      }
    }
    .menuMain__feature {
      &.hasPagination {
        padding-bottom: 0px !important;
      }
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
    max-width: calc(100% - 10px);
    &.notConfig.hasIcon {
      max-width: calc(100% - 50px);
    }
  }
  &.notConfig {
    margin: 0;
    height: 100%;
    .menuMain__feature {
      padding: 0;
      &.isApp.hasPagination {
        padding-bottom: 0;
      }
      &.hasPagination {
        position: relative;
        padding-bottom: 40px;
      }
      &--pagination {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 40px;
        background-color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 22px;
        border-top: 1px solid #e9e9e9;
        border-bottom: 1px solid #e9e9e9;
        box-sizing: border-box;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
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
        background-color: $--hover-color;
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
.lastNotMargin:last-child {
  ::v-deep {
    .span-box {
      margin-bottom: 0 !important;
    }
  }
}
</style>
