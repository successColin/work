<template>
  <div
    class="menuMain"
    :class="[
      { flexReserve: configData.pageType === 3 },
      { notConfig: !isConfig },
      { showTitle: configData.showTitle },
      { isApp: $route.query.isApp == 1 },
    ]"
    :style="cardTableStyle"
    @click="changeCurActiveObj(1, $event)"
    :tip="configData.name"
    :title="isConfig ? configData.name : ''"
    v-show="isConfig ? true : !configData.notShowArea"
  >
    <BtnsArea
      class="menuMain__btns"
      :class="[{ isApp: $route.query.isApp == 1 }, { notConfig: !isConfig }]"
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
      class="menuMain__content"
      :class="[
        { noBtnArea: configData.pageType === 1 },
        { 'm-t-10': !isConfig && configData.pageType !== 2 },
      ]"
    >
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
          { isApp: $route.query.isApp == 1 },
        ]"
        configData="功能区"
      >
        <div
          class="menuMain__card"
          :class="[
            { active: isItemActive(item) },
            { isBg: configData.cardType === 1 },
            { isBorder: configData.cardType === 2 },
          ]"
          :style="getBgStyle"
          v-for="item in isConfig || isPreview ? [{}] : sidebarData"
          :key="item[getIdCompId]"
        >
          <div
            class="menuMain__card--content"
            :class="[{ isConfig: isConfig }]"
          >
            <!-- <div
              class="menuMain__cardLeft"
              v-if="!isConfig && configData.hasCardIcon"
            >
              <i
                v-if="configData.iconFrom === 1"
                :class="`iconfont ${getCurDict(item, 1)}`"
                :style="`color:${getCurDict(item, 2)}`"
              ></i>
              <ColumnIcon
                v-if="configData.iconFrom === 2"
                :item="item"
                :configData="configData"
                @showPreview="preview"
              ></ColumnIcon>
            </div> -->

            <el-form
              label-width="150px"
              label-position="right"
              class="menuMain__cardRight"
              ref="menuMainCard"
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
                :isSidebar="false"
                :isCardForm="true"
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
                          child.compType !== 18 &&
                          child.dataSource.columnName === 'id',
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
                    :isCard="true"
                    :isCardOpeBtn="true"
                    :labelValue="item ? item[child.compId] : ''"
                    :getBtnsArr="getCardBtnsArr"
                    :btnTypesArr="[2, 3, 4, 5]"
                  ></component> </transition-group
              ></draggable>
              <!-- 应用页 -->
              <div
                style="height: 100%"
                class="menuMain__feature--compList"
                v-else
              >
                <component
                  v-for="(child, i) in getCardCompNoBtns.children"
                  class="lastNotMargin"
                  :style="getBgMargin"
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
                  :cardData="item"
                  :labelValue="
                    item
                      ? item[`${child.compId}_`] || item[`${child.compId}`]
                      : ''
                  "
                  :getBtnsArr="getCardBtnsArr"
                ></component>
              </div>
            </el-form>
          </div>
          <!-- <div
            class="menuMain__card--btnsBox"
            v-if="!isConfig && getCardBtnsArr.children.length"
          >
            <BtnsArea
              v-if="getCardBtnsArr.children.length"
              class="menuMain__feature--btns"
              :configData="configData"
              :activeObj="activeObj"
              :grandFather="configData"
              :hasTriggerComp="hasTriggerComp"
              :isSidebar="false"
              :isTree="false"
              :getBtnsArr="getCardBtnsArr"
              :getFeatureArr="getFeatureArr"
              :rowData="item"
              :fileDeleteIds="[]"
              :moreOperateArr="[]"
              @selectCardNode="selectCardNode(item)"
            ></BtnsArea>
          </div> -->
        </div>
        <div
          class="apiotNoData1"
          v-show="!isConfig && sidebarData && !sidebarData.length"
        ></div>
      </section>
    </section>

    <image-zoom
      v-if="previewVisible"
      :previewObj="previewObj"
      :picList="picList"
      v-on:hideImgPreview="hideImgPreview"
      :isShowDelBtn="false"
      :isShowShareBtn="false"
    ></image-zoom>
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
import { downloadSingle } from '@/api/knowledge';
import { getSidebarSingle } from '@/api/menuConfig';
import { createUnique } from '@/utils/utils';
import initAreaMixin from '../initAreaMixin';
import imageZoom from '../RelatedData/RelateApply/ImageZoom';

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
      sidebarData: [],
      previewVisible: false, // 是否预览
      previewObj: {},
      picList: [], // 预览文件数组
      pageSizes: [10, 20, 50, 100, 200, 500, 1000],
      cardTableStyle: '',
    };
  },

  components: {
    imageZoom,
  },

  inject: [
    'isConfig',
    'getAllForm',
    'sysMenuDesignId',
    'getFatherPanel',
    'onlyFlag',
    'getNotInitArr',
    'isSelect',
    'isPreview',
  ],
  mixins: [initAreaMixin],
  computed: {
    // get
    getBgMargin() {
      if (this.configData.cardType === 1) {
        return `marginBottom:${
          this.configData.iconColumn.lineDis / 2
        }px;marginTop:${this.configData.iconColumn.lineDis / 2}px;`;
      }
      return '';
    },
    // 卡片表单获取背景色
    getBgStyle() {
      let style = '';
      if (this.configData.cardType === 1 && this.configData.iconColumn) {
        if (this.configData.iconColumn.radius) {
          style += `borderRadius: ${this.configData.iconColumn.radius}px;`;
        }
        if (this.configData.iconColumn.radiusBg) {
          style += `backgroundColor: ${this.configData.iconColumn.radiusBg};`;
        }
      }
      return style;
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
    getCardBtnsArr() {
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
    getCardCompNoBtns() {
      if (this.getFeatureArr.children.length) {
        const index = this.getFeatureArr.children.findIndex(
          (comp) => comp.compName === 'BtnsArea',
        );
        if (index !== -1) {
          const tempObj = JSON.parse(JSON.stringify(this.getFeatureArr));
          tempObj.children.splice(index, 1);
          return tempObj;
        }
      }
      return this.getFeatureArr;
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
          let res = dictArr.find((child) => +child.value === +item[compId]);
          if (this.isPreview) {
            res = dictArr.find((child) => +child.value === 1);
          }
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
        (comp) => comp.compType !== 18 && comp.dataSource.columnName === 'id',
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
  },

  mounted() {
    if (!this.isConfig && !this.isPreview) {
      this.getMoreOperate();
      this.initFixData();
      this.$nextTick(() => {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.getSidebarList();
        }
      });
      this.$bus.$on(this.getEventName, this.reloadArea);
    }
  },

  methods: {
    // 预览
    async preview(file) {
      [this.previewObj.sysKlTree] = file;
      this.picList = [];
      file.forEach((liObj) => {
        this.picList.push({
          sysKlTree: liObj,
        });
      });
      console.log(file, this.picList);
      if (this.$store.state.globalConfig.waterConfig.enableWaterMask === '1') {
        const index = this.picList.findIndex(
          (item) => item.sysKlTree.id === file.id,
        );
        if (index !== -1) {
          this.loading = true;
          const data = await downloadSingle({
            url: this.picList[index].sysKlTree.url,
          });
          this.loading = false;
          this.picList[index].sysKlTree.blob = data;
        }
      }
      this.previewVisible = true;
    },
    hideImgPreview() {
      // 关闭预览
      this.previewVisible = false;
    },
    // 更新该区域
    reloadArea(areaArr, compId) {
      // 按钮全部刷新
      if (areaArr === 'all') {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
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
    async getSidebarList() {
      if (this.isPreview) {
        return;
      }
      this.loading = true;
      const params = {
        compId: this.configData.compId,
        compMap: JSON.stringify(this.getFilterParams()),
        sysMenuDesignId: this.sysMenuDesignId(),
        panelCompId: this.getValueFromFather('panelCompId'),
        relationMenuDesignId: this.getValueFromFather('relationMenuDesignId'),
      };
      if (this.setIdTerm) {
        params.workflowFilter = this.setIdTerm;
      }
      if (+this.$route.params.flag === 3) {
        params.workflowFilter = `${this.configData.tableInfo.tableName}.id=${this.$route.query.id}`;
      }
      const panelFilter = this.getCurAreaTerm(
        this.getValueFromFather('panelFilter'),
      );
      if (panelFilter) {
        params.panelFilter = [panelFilter];
      }
      if (this.showType && this.showType.type === 'flow') {
        params.dataPermissions = false;
        if (
          !this.getNotInitArr().includes(this.configData.compId) &&
          !panelFilter
        ) {
          const { tableInfo } = this.configData;
          params.workflowFilter = `${tableInfo.tableName}.id=${this.showType.dataId}`;
        }
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

      const data = await getSidebarSingle(params);
      this.sidebarData = [data];

      this.loading = false;

      this.$bus.$emit('changeShowSkeleton');
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
      console.log(areaType);
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
      if (
        e.relatedContext.element.compType !== 18 &&
        e.relatedContext.element.dataSource.columnName === 'id'
      ) {
        return false;
      }
      // console.log(e.from !== e.to);
      if (e.from !== e.to) {
        return false;
      }
    },
    selectCardNode(item) {
      this.getFeatureArr.form = {
        ...item,
      };
    },
  },

  beforeDestroy() {
    this.$bus.$off(this.getEventName, this.reloadArea);
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    },
    current() {
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
            columnName: '',
          },
        });
      } else {
        const index = this.getFeatureArr.children.findIndex(
          (item) => item.compName === 'BtnsArea',
        );
        this.getFeatureArr.children.splice(index, 1);
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
  height: 300px;
  margin: 10px;
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
  &__btns.notConfig {
    margin-bottom: 0;
  }
  &__content {
    height: calc(100% - 42px);
    position: relative;
    z-index: 10;
    &.noBtnArea {
      // margin-top: 10px;
      height: 100%;
    }
  }
  &.flexReserve {
    flex-direction: column-reverse;
    .menuMain__btns {
      &.notConfig {
        margin-top: 0px;
      }
      &.isApp {
        padding-bottom: 0;
      }
    }
  }

  &__feature {
    height: calc(100% - 40px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 10px;
    &.borderType {
      height: calc(100% - 22px);
    }
    &.borderType:hover {
      border-width: 1px !important;
      border-style: solid !important;
      border-image: url(../../../assets/img/border-blue.svg) 1 round !important;
    }
    &.hiddenBtnArea {
      height: calc(100% - 22px);
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
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      align-content: flex-start;
      min-height: 100%;
      // & > div {
      //   margin-bottom: 10px;
      // }
    }
    &--btns {
      position: absolute;
      z-index: 10;
      right: 0;
      top: 3px;
      margin-bottom: 0;
      display: flex !important;
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
    flex-direction: column;
    position: relative;
    &--content {
      display: flex;
      width: 100%;
      &.isConfig {
        height: 100%;
      }
    }
    &--btnsBox {
      position: relative;
      height: 48px;
      width: 100%;
    }
  }
  &__cardRight {
    height: 100%;
    width: 100%;
    padding-right: 14px;
    &.notConfig.hasIcon {
      width: calc(100% - 118px);
    }
  }
  &.notConfig {
    margin: 0;
    height: auto;
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
      margin: 0 10px 0px 10px;
      // border: 1px solid #e9e9e9;
      cursor: pointer;
      height: auto;
      border-radius: 4px;
      display: flex;
      &.isBg {
        ::v-deep {
          .span-box {
            margin-top: 0px;
            &__content {
              // width: calc(100% - 24px);
              display: inline-block;
              max-width: 100%;
              box-sizing: border-box;
              vertical-align: top;
            }
          }
          .el-form-item__content {
            line-height: 18px !important;
            min-height: auto;
          }
          .el-form-item__label {
            margin-bottom: 0;
            padding-bottom: 0;
          }
        }
      }
      &.isBorder {
        ::v-deep {
          .el-form {
            &.el-form--label-left,
            &.el-form--label-right {
              .menuMain__feature--compList {
                border-top: 1px solid #e9e9e9;
                border-right: 1px solid #e9e9e9;
                & > div {
                  // min-height: 52px;
                  height: min-content;
                  min-height: auto;
                  padding: 17px 10px 17px 0;
                  border: 1px solid #e9e9e9;
                  border-top: 0 none;
                  border-right: 0 none;
                  .el-form-item {
                    position: relative;

                    .el-form-item__label {
                      padding-right: 20px;
                      &::before {
                        content: '';
                        position: absolute;
                        margin-top: -18px;
                        width: 140px;
                        height: calc(100% + 36px);
                        background-color: #f6f7fb;
                      }
                      &:after {
                        position: relative;
                      }
                      .span-box {
                        width: 100%;
                        position: relative;

                        span {
                          width: 100%;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          font-weight: 600;
                          font-size: 13px;
                          color: #333;
                        }
                      }
                    }
                    .el-form-item__content {
                      position: relative;
                      &:before {
                        content: '';
                        position: absolute;
                        margin-top: -18px;
                        margin-left: -10px;
                        width: 1px;
                        // height: 52px;
                        height: calc(100% + 36px);
                        background-color: #e9e9e9;
                      }
                      .label__form--content {
                        top: 0;
                      }
                    }
                  }
                }
              }
            }
          }
          .span-box {
            margin-top: 0px;
            &__content {
              // width: calc(100% - 24px);
              display: inline-block;
              max-width: 100%;
              box-sizing: border-box;
              vertical-align: top;
            }
          }
          .el-form-item__content {
            line-height: 18px !important;
            min-height: auto;
          }
          .el-form-item__label {
            margin-bottom: 0;
            padding-bottom: 0;
          }
        }
      }
      &--content {
        padding: 14px 0;
      }
      // &:hover {
      //   // background-color: #f6f6f8;
      //   box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.14);
      // }
      // &.active {
      //   // background-color: $--hover-color;
      //   box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.14);
      // }
      ::v-deep {
        .span-box {
          margin-bottom: 0 !important;
        }
      }
    }
    .menuMain__cardLeft {
      // width: 118px;
      flex: 0 0 118px;
      padding-left: 14px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      .iconfont {
        display: inline-block;
        font-size: 30px;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        overflow: hidden;
      }
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
</style>
