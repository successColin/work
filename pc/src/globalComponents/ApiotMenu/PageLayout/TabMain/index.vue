<template>
  <div
    class="tabMain"
    @click="changeCurActiveObj"
    :class="[
      { highBorder: isConfig && activeObj.compId === configData.compId },
      { borderType: isConfig },
      { notConfig: !isConfig },
    ]"
  >
    <el-tabs
      v-if="getTabs.length"
      v-model="getCurTab"
      class="tabMain__tabs"
      :class="[
        { showTab: !configData.showTab || (!isConfig && getTabs.length === 1) },
      ]"
      @tab-click="handleClick"
    >
      <el-tab-pane
        :label="item.name"
        v-for="item in getTabs"
        :key="item.compId"
        :name="item.compId"
        :lazy="true"
      >
        <div
          class="tabMain__pane"
          ref="tabMainPane"
          :class="[
            { showBtnsArea: isShowBtnConfig(item) },
            { inTop: item.tabBtnPos === 1 },
            { inBottom: item.tabBtnPos === 2 },
          ]"
        >
          <BtnsArea
            v-show="isShowBtnConfig(item)"
            class="btnsArea"
            areaName="tab按钮区"
            :configData="item.children[0]"
            :activeObj="activeObj"
            :hasTriggerComp="hasTriggerComp"
            :isSidebar="false"
            :isTabBtn="true"
            :getBtnsArr="item.children[0]"
            :getFeatureArr="item.children.slice(1)"
            :fileDeleteIds="[]"
            :moreOperateArr="
              moreBtnsArrObj ? moreBtnsArrObj[item.children[0].compId] : []
            "
            @click.native="selectActive(item.children[0], $event)"
            :showType="showType"
            :btnTypesArr="[1, 2, 5, 6]"
          ></BtnsArea>
          <!-- 配置 -->
          <draggable
            style="height: 100%"
            v-if="isConfig"
            :value="item.children.slice(1)"
            @input="dragInput($event, item)"
            group="area"
            animation="300"
            ghostClass="featGhost"
            :isMain="true"
            :areaType="2"
            :isSidebar="false"
            :move="areaMove"
          >
            <transition-group class="tabMain__pane--area" tag="div">
              <component
                :ref="area.compId"
                :is="area.compName"
                v-for="(area, index) in item.children.slice(1)"
                :key="area.compId"
                :configData="area"
                :activeObj.sync="activeObj"
                :hasTriggerComp="hasTriggerComp"
                :pos="index"
                :parent="item"
                :showType="showType"
                @getTableMaxHeight="getTableMaxHeight"
              ></component>
            </transition-group>
          </draggable>
          <div
            class="tabMain__pane--area"
            :id="item.compId"
            :class="[{ firstIsTable: firstIsTable(item) }]"
            :ref="`pane_${item.compId}`"
            v-else
          >
            <component
              :ref="area.compId"
              :is="area.compName"
              v-for="(area, index) in item.children.slice(1)"
              :key="area.compId"
              :configData="area"
              :activeObj.sync="activeObj"
              :hasTriggerComp="hasTriggerComp"
              :pos="index"
              :parent="item"
              :showType="showType"
              @getTableMaxHeight="getTableMaxHeight"
            ></component>
          </div>
          <div v-if="item.children.length === 1" class="tabMain__configClass">
            {{ configData.name }}
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div v-if="!configData.children.length" class="tabMain__configClass">
      {{ configData.name }}
    </div>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';

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
    }
  },
  data() {
    return {
      specialParent: true,
      moreBtnsArrObj: null,
      tabsArr: [],
      loadedTabs: []
    };
  },

  components: {},

  inject: ['isConfig', 'resolveFormula', 'onlyFlag', 'getFatherPanel', 'isSelect'],

  computed: {
    isShowBtnConfig() {
      return function (item) {
        // if (
        //   this.showType &&
        //   JSON.stringify(this.showType) !== '{}' &&
        //   this.showType.type === 'flow'
        // ) {
        //   return !!this.showType.isShowBtn;
        // }
        return item.showTabBtn;
      };
    },
    getTabs() {
      return this.isConfig ? this.configData.children : this.tabsArr;
    },
    getCurTab: {
      get() {
        return this.isConfig ? this.configData.curCompId : this.configData.firstShowTabId;
      },
      set(v) {
        if (this.isConfig) {
          this.configData.curCompId = v;
        } else {
          this.configData.firstShowTabId = v;
        }
      }
    },
    firstIsTable() {
      return (item) => {
        if (item.children.length > 1) {
          return item.children[1].compName === 'TableMain';
        }
        return false;
      };
    }
  },

  mounted() {
    if (!this.isConfig) {
      this.initMoreBtnArr();
      if (this.configData.hiddenRules && this.configData.hiddenRules.length !== 0) {
        this.$bus.$on('tabHidden', this.tabHidden);
      } else {
        this.tabsArr = this.configData.children;
        this.configData.firstShowTabId = this.tabsArr[0].compId;
        this.loadedTabs = [this.configData.firstShowTabId];
      }
      this.$bus.$on('returnFirst', this.returnFirst);
    }
  },
  beforeDestroy() {
    // 在最外层的数据上才销毁
    if (this.getFatherPanel && !this.getFatherPanel()) {
      this.$bus.$off('tabHidden');
      this.$bus.$off('returnFirst');
    }
  },
  methods: {
    // 回到第一个
    returnFirst(onlyFlag) {
      if (this.onlyFlag() === onlyFlag && this.tabsArr[0]) {
        this.configData.firstShowTabId = this.tabsArr[0].compId;
      }
    },
    // 控制显示的tabs
    tabHidden(onlyFlag) {
      // console.log(onlyFlag);
      const tempShow = [];
      if (this.onlyFlag() === onlyFlag) {
        this.tabsArr = [];
        if (!this.configData.showTab || this.configData.children.length === 1) {
          this.tabsArr = this.configData.children;
          tempShow.push(this.tabsArr[0].compId);
          // 没有启用多个tab，不往下执行
          return;
        }
        const hiddenTabsArr = [];
        // 取出所有需要隐藏的tab
        this.configData.hiddenRules.forEach((rule) => {
          const res = this.resolveFormula(true, rule.content);
          if (res) {
            hiddenTabsArr.push(...rule.tabs);
          }
        });
        // 所有需要隐藏的tab去重
        const result = Array.from(new Set(hiddenTabsArr));
        this.configData.children.forEach((tab) => {
          // 不存在需要隐藏的数组中
          if (!result.includes(tab.compId)) {
            this.tabsArr.push(tab);
            tempShow.push(tab.compId);
          }
        });
      }
      if (!tempShow.includes(this.configData.firstShowTabId)) {
        [this.configData.firstShowTabId] = tempShow;
      }
      this.loadedTabs = [this.configData.firstShowTabId];
    },
    changeCurActiveObj(e) {
      if (!this.isConfig) {
        return;
      }
      if (this.isSelect) {
        return;
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      this.configData.shouldTab = false;
      this.$bus.$emit('changeCurActiveObj', this.configData);
    },
    handleClick(v) {
      // console.log(v.name);
      this.configData.curCompId = v.name;
      this.$nextTick(() => {
        if (!this.loadedTabs.includes(v.name)) {
          this.loadedTabs.push(v.name);
          this.$bus.$emit(`loadSomeArea_${v.name}`, v.name);
        }
      });
      this.changeCurActiveObj();
    },
    initMoreBtnArr() {
      const obj = {};
      this.configData.children.forEach((item) => {
        obj[item.children[0].compId] = this.getMoreOperate(item);
      });
      this.moreBtnsArrObj = obj;
    },
    // 按钮超过4个出现更多操作
    getMoreOperate(item) {
      if (!item.showTabBtn) {
        return [];
      }
      const getBtnsArr = item.children[0];
      let moreOperateArr = [];
      const { length } = getBtnsArr.children;
      if (length - getBtnsArr.rightIndex - 4 > 0) {
        moreOperateArr = getBtnsArr.children.splice(4, length - getBtnsArr.rightIndex - 4, {
          compName: 'MoreFormButton',
          compId: createUnique()
        });
      }
      return moreOperateArr;
    },
    selectActive(obj, e) {
      if (!this.isConfig) {
        return;
      }
      if (this.isSelet) {
        return;
      }
      if (e) {
        e.stopPropagation();
      }
      // console.log(obj);
      this.$bus.$emit('changeCurActiveObj', obj);
    },
    getTableMaxHeight(parent, compId, callBack) {
      const paneHeight = this.$refs[`pane_${parent.compId}`][0].offsetHeight;
      let tableMaxHeight = paneHeight;
      parent.children.slice(1).forEach((area) => {
        if (area.compId !== compId) {
          tableMaxHeight -= this.$refs[area.compId][0].$el.offsetHeight;
        }
      });
      callBack(tableMaxHeight);
    },
    areaMove(e) {
      const { component } = e.relatedContext;
      if (!component.$attrs.isMain) {
        return false;
      }
    },
    dragInput(v, item) {
      item.children.splice(1, item.children.length - 1, ...v);
    }
  }
};
</script>

<style lang='scss' scoped>
.tabMain {
  position: relative;
  border: 1px solid #e9e9e9;
  height: 100%;
  box-sizing: border-box;
  &__tabs {
    height: 100%;
    ::v-deep {
      .el-tabs__header {
        height: 42px !important;
        line-height: 42px !important;
        margin-bottom: 0;
        .el-tabs__nav-scroll {
          justify-content: flex-start;
        }
        .el-tabs__item {
          vertical-align: top;
          font-size: 14px !important;
          height: 42px;
          &:nth-child(2) {
            padding-left: 10px;
          }
          &.is-active {
            font-weight: 600;
          }
        }
        .el-tabs__nav-wrap::after {
          height: 1px;
          background-color: #ebebeb;
        }
      }
      .el-tab-pane {
        height: 100%;
        overflow: auto !important;
      }
      .el-tabs__content {
        height: calc(100% - 41px) !important;
      }
    }
    &.showTab {
      ::v-deep {
        .el-tabs__header {
          display: none;
        }
        .el-tabs__content {
          height: 100% !important;
        }
      }
    }
  }
  &__configClass {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 13px;
    font-weight: 400;
    color: #808080;
  }
  &.notConfig {
    border: 0;
    .showBtnsArea.inBottom {
      .btnsArea {
        bottom: 0px;
      }
    }
  }
  &__pane {
    height: 100%;
    &.showBtnsArea.inTop {
      padding-top: 40px;
      // padding-bottom: 10px;
      position: relative;
      box-sizing: border-box;
      height: 100%;
      overflow: hidden;
      .btnsArea {
        position: absolute;
        top: 0;
        bottom: auto;
        width: 100%;
        box-sizing: border-box;
        z-index: 100;
        background-color: #fff;
      }
    }
    &.showBtnsArea.inBottom {
      position: relative;
      box-sizing: border-box;
      padding-bottom: 42px;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .btnsArea {
        position: absolute;
        bottom: 0px;
        top: auto;
        width: 100%;
        box-sizing: border-box;
        margin-top: 10px;
        margin-bottom: 1px;
        z-index: 100;
        background-color: #fff;
        border-top: 1px solid #e9e9e9;
        border-bottom: 0;
      }
    }
    &--area {
      height: 100%;
      overflow-y: auto;
    }
  }
}
</style>
