<template>
  <div
    class="queryMain"
    :class="[
      { flexReserve: configData.pageType === 3 },
      { notConfig: !isConfig },
      { showTitle: configData.showTitle },
      { isApp: $route.query.isApp == 1 },
      { 'p-t-10': true },
      { 'p-t-20': !isConfig && getBtnsArr.children.length === 0 },
    ]"
    @click="changeCurActiveObj(1, $event)"
    :tip="configData.name"
    :title="isConfig ? configData.name : ''"
    v-show="showMenu"
  >
    <section
      ref="contentArea"
      v-if="configData.children.length !== 0"
      class="queryMain__feature"
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
        { queryMain__featureNoConfig: !isConfig },
      ]"
      configData="功能区"
    >
      <el-form
        ref="form"
        :model="getFeatureArr.form"
        :rules="isConfig ? {} : getFeatureArr.rules"
        :validate-on-rule-change="false"
        label-width="auto"
        :label-position="labelPosition"
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
          :isQuery="true"
        >
          <transition-group class="queryMain__feature--compList" tag="ul">
            <component
              v-for="(child, i) in getFeatureArr.children"
              :class="[{ notMove: child.labelNotChange }]"
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
              :isQuery="true"
            ></component> </transition-group
        ></draggable>
        <div class="queryMain__feature--compList" v-else>
          <component
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
            :getIdCompId="getIdCompId"
            :isQuery="true"
          ></component>
        </div>
      </el-form>
    </section>
    <BtnsArea
      class="queryMain__btn"
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
      @click.native="changeCurActiveObj(2, $event)"
      :btnTypesArr="[11, 12, 13, 5]"
      :isQuery="true"
    ></BtnsArea>
    <section
      v-if="configData.children.length === 0"
      class="queryMain__wz"
      :class="[
        { borderType: isConfig },
        {
          highBorder: isConfig && activeObj.compId === configData.compId,
        },
      ]"
    >
      查询区
    </section>
    <!-- 空白 -->
    <div
      class="queryMain__interval"
      :style="`${isConfig ? 'bottom: 0' : ''}`"
      v-if="configData.displayStyle === 2"
    ></div>
  </div>
</template>

<script>
// import { getSidebarSingle } from '@/api/menuConfig';
import initAreaMixin from '../initAreaMixin';

export default {
  props: {
    showType: {
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
    },
    pos: {
      type: Number
    }
  },
  data() {
    return {
      moreOperateArr: [],
      fileDeleteIds: [],
      isMenuMain: true,
      backForm: null
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
    'initStart'
  ],
  mixins: [initAreaMixin],
  computed: {
    labelPosition() {
      return this.configData.layoutStyle === 2 ? 'right' : 'top';
    },
    isShowBtn() {
      if (this.showType && this.showType.type === 'flow') {
        return true;
      }
      return this.configData.children.length !== 0;
    },
    getFeatureArr() {
      const index = this.configData.children.findIndex((child) => child.areaType === 1);
      return index === -1 ? { children: [] } : this.configData.children[index];
    },
    getBtnsArr() {
      const index = this.configData.children.findIndex((child) => child.areaType === 2);
      return index === -1 ? { children: [] } : this.configData.children[index];
    },
    getButtonStyle() {
      return (i) => {
        if (this.getBtnsArr.children.length - this.getBtnsArr.rightIndex === i) {
          return 'margin-left: auto';
        }
        return '';
      };
    },
    // 获取id字段的组件id
    getIdCompId() {
      const index = this.getFeatureArr.children.findIndex(
        (comp) => comp.dataSource && comp.dataSource.columnName === 'id'
      );
      if (index !== -1) {
        return this.getFeatureArr.children[index].compId;
      }
      return '';
    },
    getEventName() {
      return this.showType && this.showType.type === 'flow'
        ? `${this.showType.type}_reloadArea`
        : 'reloadArea';
    },
    showMenu() {
      if (this.isConfig) {
        return true;
      }
      const index = this.getFeatureArr.children.findIndex((item) => item.canShow);
      return index !== -1;
    }
  },
  created() {
    // this.configData.isTree = false;
  },
  mounted() {
    if (!this.isConfig) {
      // this.$nextTick(() => {
      // this.resetForm();
      // });

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
      this.getMoreOperate();
      this.initFixData();
      if (this.configData.shouldInit) {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          if (this.getFatherPanel()) {
            if (!this.getFatherPanel().isAdd) {
              this.getSidebarSingle();
            }
          } else {
            this.getSidebarSingle();
          }
        }
      }

      this.$bus.$on(this.getEventName, this.reloadArea);
      this.$bus.$on(`loadSomeArea_${this.parent.compId}`, this.loadArea);
    }
  },

  methods: {
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
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
    },
    // 更新该区域
    reloadArea(areaArr, onlyFlag, compId) {
      if (areaArr === 'all' && onlyFlag === this.onlyFlag()) {
        if (this.configData.shouldInit) {
          if (!this.getNotInitArr().includes(this.configData.compId)) {
            if (!(this.getFatherPanel() && this.getFatherPanel().isAdd)) {
              this.getSidebarSingle();
            }
          }
        }
        return;
      }
      // 刷新当前区域
      if (
        areaArr === 'current' &&
        onlyFlag === this.onlyFlag() &&
        compId === this.configData.compId
      ) {
        this.getSidebarSingle();
        return;
      }
      if (areaArr.includes(this.configData.compId) && onlyFlag === this.onlyFlag()) {
        this.getSidebarSingle();
      }
    },
    // 一些固定值的初始化
    initFixData() {
      if (this.getFatherPanel()) {
        const keys = Object.keys(this.getFeatureArr.form);
        const panelKey = Object.keys(this.getFatherPanel().panelFixData);
        keys.forEach((key) => {
          if (panelKey.includes(key)) {
            // console.log(this.getAllForm());
            const comp = this.getFeatureArr.children.find((child) => child.compId === key);
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
      // 插入菜单id
      obj.MENU_ID = this.$route.params.id;
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
        if ([3].includes(comp.compType)) {
          v = +v;
        }
      }
      if ([4, 25].includes(comp.compType) || (comp.compType === 2 && comp.dropDownType !== 1)) {
        v = this.resolveRes(v);
      }
      return v;
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
    // 获取表单数据
    getSidebarSingle() {
      return false;
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
      if (e.relatedContext.element.labelNotChange) {
        return false;
      }
      if (e.from !== e.to) {
        return false;
      }
    }
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
    if (this.getFatherPanel) {
      // 在最外层的数据上才销毁
      if (!this.getFatherPanel()) {
        // this.$bus.$off(this.getEventName);
        this.$bus.$off(this.getEventName, this.reloadArea);
        this.$bus.$off(`loadSomeArea_${this.parent.compId}`);
      }
    } else {
      // this.$bus.$off(this.getEventName);
      this.$bus.$off(this.getEventName, this.reloadArea);
      this.$bus.$off(`loadSomeArea_${this.parent.compId}`);
    }
    this.resetForm();
  },

  watch: {
    fileDeleteIds(v) {
      console.log(v);
    }
  }
};
</script>

<style lang='scss' scoped>
.queryMain {
  box-sizing: border-box;
  // height: calc(100% - 20px);
  height: 164px;
  margin: 10px;
  overflow: hidden;
  display: flex;
  // flex-direction: column;
  position: relative;
  padding-bottom: 14px;
  &__interval {
    width: 100%;
    height: 10px;
    position: absolute;
    background: #f6f6f8;
    bottom: 3px;
  }
  &.isApp {
    // height: auto;
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
  }
  &__featureNoConfig {
    overflow: initial !important;
  }
  &__feature {
    flex: 1;
    min-height: calc(100% - 76px);
    overflow-y: auto;
    overflow-x: hidden;
    padding: 10px 10px;
    &.borderType:hover {
      border-width: 1px !important;
      border-style: solid !important;
      border-image: url(../../../assets/img/border-blue.svg) 1 round !important;
    }
    ::v-deep {
      .el-form {
        height: 100%;
        & > div {
          height: 100%;
        }
      }
      .singleLineText,
      .dropDownBox,
      .dataSingleSel,
      .singleBox,
      .dataMultiSel {
        overflow: inherit;
      }
      .el-form-item__error {
        z-index: 9;
      }
      .el-form-item__content {
        margin: 0 !important;
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
  }
  &__btn {
    height: auto !important;
    margin-bottom: 0px;
    margin-left: 10px;
    min-width: 88px;
    padding-bottom: 10px;
    ::v-deep {
      .menuMain__btnArea--compList {
        align-items: flex-end;
      }
    }
  }
  &__wz {
    text-align: center;
    line-height: 300px;
    height: 100%;
    box-sizing: border-box;
  }
  &.notConfig {
    margin: 0;
    height: auto;
    min-height: min-content;

    .queryMain__feature {
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
