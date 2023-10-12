<template>
  <div
    class="menuMain"
    :class="[
      { flexReserve: configData.pageType === 3 },
      { notConfig: !isConfig },
      { showTitle: configData.showTitle },
      { isApp: $route.query.isApp == 1 },
      { 'p-t-5': !isConfig && getBtnsArr.children.length === 0 },
      { isUser: isConfig && isUser },
      { notTop: getLabelPositon !== 'top' },
      { isZy: configData.layoutStyle === 2 },
    ]"
    @click="changeCurActiveObj(1, $event)"
    :title="isConfig ? configData.name : ''"
    v-show="showMenu"
  >
    <div
      class="menuMain__title"
      :class="[{ isHidden: isHidden }, { notTop: getLabelPositon !== 'top' }]"
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
      class="menuMain__content"
      :class="[
        { isHidden: isHidden },
        {
          'p-t-10':
            !isConfig && configData.pageType !== 2 && getLabelPositon === 'top',
        },
      ]"
    >
      <BtnsArea
        v-if="isShowBtn"
        :configData="configData"
        :activeObj="activeObj"
        :hasTriggerComp="hasTriggerComp"
        :isSidebar="isSidebar"
        :getBtnsArr="getBtnsArr"
        :getFeatureArr="getFeatureArr"
        :fileDeleteIds="fileDeleteIds"
        :moreOperateArr="moreOperateArr"
        :showType="showType"
        :nodeConfig="nodeConfig"
        @click.native="changeCurActiveObj(2, $event)"
        :btnTypesArr="[1, 2, 5, 15]"
        :isForm="true"
        :canSearch="true"
      ></BtnsArea>
      <section
        ref="contentArea"
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
          { hiddenBtnArea: configData.pageType === 1 },
        ]"
        configData="功能区"
      >
        <el-form
          ref="form"
          :model="getFeatureArr.form"
          :rules="isConfig ? {} : getFeatureArr.rules"
          :validate-on-rule-change="false"
          label-width="150px"
          :label-position="getLabelPositon"
        >
          <draggable
            v-if="isConfig"
            v-model="getFeatureArr.children"
            group="comp"
            animation="300"
            ghostClass="featGhost"
            filter=".notMove"
            :areaType="1"
            @start="featDragStart"
            @end="featDragEnd"
            :move="featDragMove"
            :disabled="!isConfig"
            :isForm="true"
            :canSearch="false"
          >
            <transition-group class="menuMain__feature--compList" tag="ul">
              <component
                v-for="(child, i) in getFeatureArr.children"
                :class="[
                  { notMove: child.labelNotChange && child.compType === 15 },
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
                :isForm="true"
              ></component> </transition-group
          ></draggable>
          <div class="menuMain__feature--compList" v-else>
            <component
              class="menuMain__feature--comp"
              v-for="(child, i) in getFeatureArr.children"
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
              :nodeConfig="nodeConfig"
              :getIdCompId="getIdCompId"
              :backForm="backForm"
            ></component>
          </div>
        </el-form>
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
        表单区
      </section>
    </div>
  </div>
</template>

<script>
import { getSidebarSingle } from '@/api/menuConfig';
import { Decrypt } from '@/utils/utils';
import initAreaMixin from '../initAreaMixin';

export default {
  props: {
    showType: {
      type: Object,
      default: () => {},
    },
    nodeConfig: {
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
    pos: {
      type: Number,
    },
  },
  data() {
    return {
      moreOperateArr: [],
      fileDeleteIds: [],
      isMenuMain: true,
      backForm: null,
      setIdTerm: '',
      isHidden: false,
      timer: null,
    };
  },

  components: {},

  inject: [
    'isConfig',
    'getAllForm',
    'getFatherPanel',
    'sysMenuDesignId',
    'onlyFlag',
    'changeNotValueChange',
    'getNotInitArr',
    'getPanel',
    'initStart',
    'resolveFormula',
    'isUser',
    'isPreview',
  ],
  mixins: [initAreaMixin],
  computed: {
    getLabelPositon() {
      if (this.isConfig) {
        return 'top';
      }
      if (this.configData.layoutStyle === 1) {
        return 'top';
      }
      if (this.configData.layoutStyle === 2) {
        return 'right';
      }
      if (this.configData.layoutStyle === 3) {
        return 'left';
      }
      return 'top';
    },
    isShowBtn() {
      if (this.showType && this.showType.type === 'flow') {
        return true;
      }
      return this.configData.children.length !== 0;
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
    // 获取id字段的组件id
    getIdCompId() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource && comp.dataSource.columnName === 'id',
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    getEventName() {
      return `reloadArea${this.onlyFlag()}`;
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
  },
  created() {
    this.configData.isTree = false;
  },
  mounted() {
    if (!this.isConfig) {
      this.getMoreOperate();
    }
    if (!this.isConfig && !this.isPreview) {
      this.$nextTick(() => {
        this.resetForm();
        this.initFixData();
        if (this.configData.shouldInit) {
          if (!this.getNotInitArr().includes(this.configData.compId)) {
            if (this.getFatherPanel()) {
              if (!this.getFatherPanel().isAdd || this.setIdTerm) {
                this.getSidebarSingle();
              }
            } else {
              this.getSidebarSingle();
            }
          }
        }
      });

      // 转换正则
      const keys = Object.keys(this.getFeatureArr.rules);
      keys.forEach((key) => {
        this.getFeatureArr.rules[key].forEach((item) => {
          if (item.pattern) {
            item.pattern = new RegExp(item.pattern);
          }
          if (item.max && item.min) {
            item.max = +item.max;
            item.min = +item.min;
          }
        });
      });
      // console.log(this.getFeatureArr.rules);
      // this.getMoreOperate();

      this.$bus.$on(this.getEventName, this.reloadArea);
      this.$bus.$on(`loadSomeArea_${this.parent.compId}`, this.loadArea);
    }
  },

  methods: {
    // 是否隐藏内容
    hiddenContent() {
      if (this.isConfig) {
        return false;
      }
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
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
        // 加载的列表里包含该id
        if (this.getNotInitArr().includes(this.configData.compId)) {
          this.getSidebarSingle();
        }
      }
    },
    // 初始化表单
    resetForm() {
      if (!this.backForm) {
        this.backForm = JSON.parse(JSON.stringify(this.getFeatureArr.form));
      } else {
        const keys = Object.keys(this.getFeatureArr.form);
        const backKeys = Object.keys(this.backForm);
        keys.forEach((key) => {
          if (backKeys.includes(key)) {
            this.getFeatureArr.form[key] = this.backForm[key];
          } else {
            this.getFeatureArr.form[key] = '';
          }
        });
        this.getFeatureArr.children.forEach((comp) => {
          if (comp.selData) {
            comp.selData = null;
          }
        });
      }
      // if (this.$refs.form) {
      //   this.$refs.form.resetFields();
      // }
    },
    // 更新该区域
    reloadArea(areaArr, compId, id) {
      if (areaArr === 'all') {
        if (this.configData.shouldInit) {
          if (!this.getNotInitArr().includes(this.configData.compId)) {
            if (
              !(this.getFatherPanel() && this.getFatherPanel().isAdd) ||
              this.setIdTerm
            ) {
              this.getSidebarSingle();
            }
          }
        }
        return;
      }
      // 刷新当前区域
      if (areaArr === 'current' && compId === this.configData.compId) {
        this.getSidebarSingle();
        return;
      }
      // 设置id
      if (areaArr === 'setId' && compId === this.configData.compId) {
        this.setIdTerm = `${this.configData.tableInfo.tableName}.id=${id}`;
        this.getFeatureArr.form[this.getIdCompId] = id;
        this.getSidebarSingle();
        return;
      }
      if (areaArr.includes(this.configData.compId)) {
        this.getSidebarSingle();
      }
    },
    // 一些固定值的初始化
    initFixData() {
      if (this.getFatherPanel()) {
        const keys = Object.keys(this.getFeatureArr.form);
        console.log(this.getFatherPanel(), keys);
        const panelKey =
          (this.getFatherPanel().panelFixData &&
            Object.keys(this.getFatherPanel().panelFixData)) ||
          [];
        keys.forEach((key) => {
          if (panelKey.includes(key)) {
            // console.log(this.getAllForm());
            const comp = this.getFeatureArr.children.find(
              (child) => child.compId === key,
            );
            let v = this.getFatherPanel().panelFixData[key];
            v = this.resolveValue(v, comp);
            this.getFeatureArr.form[key] = v;
          }
        });
      }
      // this.$refs.form.resetFields();
    },
    // 获取当前过滤条件需要的参数
    getFilterParams() {
      let obj = {};
      const menuFilter = this.getCurAreaTerm(this.getCurMenu('menuFilter'));
      console.log(this.getFatherPanel());
      if (+this.$route.params.flag === 3) {
        return obj;
      }
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
    // 处理值去设置
    resolveRes(v) {
      if (v) {
        // 不是字符串就是数组
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
    // 获取上级的某个值
    getValueFromFather(v) {
      if (this.getFatherPanel() && this.getFatherPanel()[v]) {
        return this.getFatherPanel()[v];
      }
      return '';
    },
    resolveValue(v, comp) {
      if (v) {
        v = `${v}`;
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
      return v;
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
    // 获取表单数据
    async getSidebarSingle() {
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
      // this.getFeatureArr.form = data;
      const tempObj = {};
      // this.getFeatureArr.form = {};
      this.resetForm();
      // console.log(this.backForm);
      this.getFeatureArr.children.forEach((comp) => {
        let v = `${data[comp.compId] == null ? '' : data[comp.compId]}`;
        v = this.resolveValue(v, comp);
        if (v !== '') {
          tempObj[comp.compId] = v;
          this.$set(tempObj, comp.compId, v);
          if (
            comp.compType === 6 ||
            comp.compType === 7 ||
            comp.compType === 15
          ) {
            tempObj[`${comp.compId}_`] = data[`${comp.compId}_`];
          }
          if (comp.compType === 21) {
            tempObj[comp.compId] = v.replace(
              /token=[^"]*/g,
              () => `token=${Decrypt(localStorage.token)}`,
            );
          }
        } else if (this.getFeatureArr.form[comp.compId]) {
          const tempV = this.getFeatureArr.form[comp.compId];
          this.getFeatureArr.form[comp.compId] = '';
          this.$nextTick(() => {
            this.getFeatureArr.form[comp.compId] = tempV;
          });
        } else {
          tempObj[comp.compId] = '';
          if (
            comp.compType === 6 ||
            comp.compType === 7 ||
            comp.compType === 15
          ) {
            tempObj[`${comp.compId}_`] = '';
          }
        }
      });
      this.changeNotValueChange(true);
      this.$nextTick(() => {
        this.getFeatureArr.form = {
          ...this.getFeatureArr.form,
          ...tempObj,
        };
        // console.log(this.getFeatureArr.form);
        this.loading = false;
        this.initStart();

        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.clearValidate();
          }
          this.changeNotValueChange(false);
          // 获取步骤条
          this.$bus.$emit(
            'getSteps',
            this.getFeatureArr.form[this.getIdCompId],
            this.configData.tableInfo.tableName,
            this.getFeatureArr.children,
          );
          this.$broadcast('setRichValue');
          if (this.configData.reloadArea.length) {
            this.$bus.$emit(
              this.getEventName,
              this.configData.reloadArea,
              this.onlyFlag(),
            );
          } else {
            this.$bus.$emit('changeShowSkeleton');
          }
        });
      });
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
      // console.log(e.from !== e.to);
      if (
        e.relatedContext.element.labelNotChange &&
        e.relatedContext.element.compType === 15
      ) {
        return false;
      }
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
    // }
  },

  beforeDestroy() {
    console.log('表单销毁监听');
    this.$bus.$off(this.getEventName, this.reloadArea);
    this.$bus.$off(`loadSomeArea_${this.parent.compId}`);

    this.resetForm();
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    },
  },
};
</script>

<style lang="scss" scoped>
.menuMain {
  box-sizing: border-box;
  // height: calc(100% - 20px);
  height: 300px;
  margin: 10px;
  margin-bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #ebebeb;
  border-radius: 6px;
  &.notTop {
    border: 0 none;
    border-right: 1px solid #ebebeb;
  }
  &.notTop.notConfig:not(.showTitle) {
    .menuMain__content {
      border-top: 1px solid #ebebeb !important;
    }
  }
  &.isApp {
    // height: auto;
  }
  &.isUser {
    height: calc(100% - 20px);
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
    &.notTop {
      border: 1px solid #ebebeb;
      border-right: 0 none;
      border-radius: 6px 6px 0 0;
    }
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
        border-bottom: 0 none;
      }
    }
  }
  &__content {
    height: 100%;
    transition: all 0.2s linear;
    &.notConfig {
      padding-top: 10px;
    }
    &.isHidden {
      height: 0;
      opacity: 0;
      display: none !important;
    }
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
    .menuMain__content {
      display: flex;
      flex-direction: column-reverse;
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
      height: 100%;
    }
    ::v-deep {
      .el-form {
        height: 100%;
        & > div {
          height: 100%;
        }
        &.el-form--label-left,
        &.el-form--label-right {
          .menuMain__feature--compList {
            & > div {
              // min-height: 52px;
              height: min-content;
              min-height: auto;
              padding: 10px 10px 10px 0;
              border: 1px solid #e9e9e9;
              border-top: 0 none;
              border-right: 0 none;
              .el-form-item {
                position: relative;

                .el-form-item__label {
                  margin-top: 6px;
                  padding-right: 20px;
                  &::before {
                    content: '';
                    position: absolute;
                    margin-top: -16px;
                    width: 140px;
                    height: calc(100% + 20px);
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
                    margin-top: -10px;
                    margin-left: -10px;
                    width: 1px;
                    // height: 52px;
                    height: calc(100% + 20px);
                    background-color: #e9e9e9;
                  }
                  .label__form--content {
                    top: 0;
                  }
                }
              }
              .dividing {
                &__detail {
                  height: 30px;
                  margin-bottom: 0;
                  border-bottom: 0 none;
                  &--line {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
    }
    &--compList {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      min-height: 100%;
      // & > div {
      //   margin-bottom: 10px;
      // }
    }
    // &--comp:first-child {
    //   ::v-deep {
    //     .dividing__detail {
    //       height: 30px !important;
    //     }
    //   }
    // }
  }
  &__wz {
    text-align: center;
    line-height: 300px;
    height: 100%;
    box-sizing: border-box;
  }
  &.notConfig {
    // margin: 0;
    height: auto;
    min-height: min-content;

    .menuMain__feature {
      padding: 0;
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
