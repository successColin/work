<template>
  <header
    class="menuMain__btnArea"
    :class="[
      {
        configClass: isConfig && getBtnsArr.children.length === 0,
      },
      { borderType: isConfig },
      {
        highBorder:
          isConfig &&
          activeObj.compId === configData.compId &&
          activeObj.areaType === 2,
      },
      { notConfig: !isConfig },
      { hiddenBtnArea: configData.pageType === 1 },
      { flexReserve: configData.pageType === 3 },
      { isSidebar: isSidebar },
      { hasHeight: getBtnsArr && getBtnsArr.children.length === 0 },
      { isTableBtn: isTableBtn },
      { isTree: isTree },
      { isCard: isCard },
      { noChild: isConfig && getBtnsArr && getBtnsArr.children.length === 0 },
      {
        showTablename:
          isConfig &&
          isMulTree &&
          getBtnsArr.dataSource &&
          getBtnsArr.dataSource.tableName,
      },
    ]"
    :configData="areaName"
    :tablename="getBtnsArr.dataSource && getBtnsArr.dataSource.tableName"
  >
    <div v-if="isTableBtn" class="isTableBtn__title">{{ getBtnsArr.name }}</div>
    <!-- 配置 -->
    <draggable
      v-if="getBtnsArr && isConfig"
      v-model="getBtnsArr.children"
      group="comp"
      animation="300"
      ghostClass="featGhost"
      :areaType="2"
      :isSidebar="isSidebar"
      :isQuery="isQuery"
      :canSearch="canSearch"
      :length="getBtnsArr.children.length"
      @start="btnDragStart"
      @end="btnDragEnd"
      :move="btnDragMove"
    >
      <transition-group
        class="menuMain__btnArea--compList"
        :class="[{ isSidebar: isSidebar }, { isTree: isTree }]"
        tag="ul"
      >
        <component
          v-for="(child, i) in getBtnsArr.children"
          :key="child.compId"
          :is="child.compName"
          :parent="getBtnsArr"
          :style="getButtonStyle(i)"
          :featureArr="getFeatureArr"
          :i="i"
          :activeObj="activeObj"
          :hasTriggerComp="hasTriggerComp"
          :configData="child"
          :grandFather="grandFather"
          :tableInfo="configData"
          :fileDeleteIds="fileDeleteIds"
          :moreOperateArr="moreOperateArr"
          :btnTypesArr="btnTypesArr"
          :isSidebar="isSidebar"
          :isTable="isTable"
          :isTabBtn="isTabBtn"
          :canSearch="canSearch"
          :multiEntityArr="multiEntityArr"
          :getIdCompId="getIdCompId"
          :rowData="rowData"
          :isTree="isTree"
          :isQuery="isQuery"
          :isCardOpeBtn="isCardOpeBtn"
          @addTableRow="addTableRow"
          @tableAreaDelete="tableAreaDelete"
          @btnPosChange="btnPosChange"
        ></component> </transition-group
    ></draggable>
    <!-- 应用 -->
    <ul
      v-else
      class="menuMain__btnArea--compList"
      :class="[{ isSidebar: isSidebar }, { isTree: isTree }]"
    >
      <component
        v-for="(child, i) in getBtnsArr.children"
        :key="child.compId"
        :is="child.compName"
        :parent="getBtnsArr"
        :style="getButtonStyle(i)"
        :featureArr="getFeatureArr"
        :i="i"
        :activeObj="activeObj"
        :hasTriggerComp="hasTriggerComp"
        :configData="child"
        :grandFather="grandFather"
        :tableInfo="configData"
        :fileDeleteIds="fileDeleteIds"
        :moreOperateArr="moreOperateArr"
        :btnTypesArr="btnTypesArr"
        :isSidebar="isSidebar"
        :isTable="isTable"
        :isTabBtn="isTabBtn"
        :canSearch="canSearch"
        :multiEntityArr="multiEntityArr"
        :getIdCompId="getIdCompId"
        :rowData="rowData"
        :isTree="isTree"
        :isQuery="isQuery"
        @addTableRow="addTableRow"
        @tableAreaDelete="tableAreaDelete"
        @btnPosChange="btnPosChange"
        @selectTreeNode="selectTreeNode"
        :showType="showType"
        :nodeConfig="nodeConfig"
      ></component>
    </ul>
    <div class="btnMask" v-if="isSelect && isTabBtn" @click.stop></div>
  </header>
</template>

<script>
export default {
  name: '',
  props: {
    showType: {
      // 流程中的参数
      type: Object,
      default() {
        return {};
      }
    },
    nodeConfig: {
      // 流程中的参数
      type: Object,
      default() {
        return {};
      }
    },
    // 区域配置信息
    configData: {
      type: [Array, Object]
    },
    // 当前选中
    activeObj: {
      type: [Array, Object]
    },
    // 是否有触发器，过滤条件对应组件
    hasTriggerComp: {
      type: Object
    },
    // 是不是侧边
    isSidebar: {
      type: Boolean,
      default: false
    },
    getBtnsArr: {
      type: Object
    },
    fileDeleteIds: {
      type: Array
    },
    moreOperateArr: {
      type: Array
    },
    getFeatureArr: {
      type: [Object, Array]
    },
    areaName: {
      type: String,
      default: '按钮区'
    },
    btnTypesArr: {
      type: Array
    },
    // 是不是表格的按钮
    isTableBtn: {
      type: Boolean,
      default: false
    },
    isTable: {
      type: Boolean,
      default: false
    },
    // 多选值
    multiEntityArr: {
      type: Array,
      default: () => []
    },
    // id的组件id
    getIdCompId: {
      type: String,
      default: ''
    },
    // 是否是顶部的保存按钮
    isTabBtn: {
      type: Boolean,
      default: false
    },
    canSearch: {
      type: Boolean,
      default: false
    },
    grandFather: {
      type: Object
    },
    // 表格的每一行数据
    rowData: {
      type: Object
    },
    isTree: {
      type: Boolean,
      default: false
    },
    isCard: {
      type: Boolean,
      default: false
    },
    isCardOpeBtn: {
      type: Boolean,
      default: false
    },
    isMulTree: {
      type: Boolean,
      default: false
    },
    isQuery: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      curBtnsArr: []
    };
  },
  inject: ['isConfig', 'isSelect'],
  components: {},
  computed: {
    getButtonStyle() {
      return (i) => {
        if (this.getBtnsArr.children.length - this.getBtnsArr.rightIndex === i) {
          return 'margin-left: auto';
        }
        return '';
      };
    }
  },
  mounted() {
    this.getBtnsArr.children.forEach((btn) => {
      this.curBtnsArr.push(btn.compId);
    });
    // console.log(this.showType, '55');
  },
  methods: {
    btnDragStart() {
      // console.log(1);
    },
    btnDragEnd() {
      // console.log(2);
    },
    btnDragMove(e) {
      // console.log(3, e);
      if (this.isTree || this.isTableBtn || this.$route.query.isApp === '1') {
        if (!e.relatedContext.element) {
          return false;
        }
        if (e.relatedContext.element.areaType !== 2) {
          return false;
        }

        if (e.from !== e.to) {
          return false;
        }
        return true;
      }
      return false;
    },
    addTableRow() {
      this.$emit('addTableRow');
    },
    tableAreaDelete() {
      this.$emit('tableAreaDelete');
    },
    selectTreeNode() {
      this.$emit('selectTreeNode');
    },
    btnPosChange(i) {
      const len = this.getBtnsArr.children.length;
      // console.log(len, i, this.getBtnsArr.rightIndex);
      if (i >= len - this.getBtnsArr.rightIndex) {
        this.getBtnsArr.rightIndex -= 1;
      }
    }
  },
  watch: {
    'getBtnsArr.children.length': function (v1, v2) {
      if (v1 > v2) {
        // 表示新增
        const index = this.getBtnsArr.children.findIndex(
          (btn) => !this.curBtnsArr.includes(btn.compId)
        );
        this.curBtnsArr.push(this.getBtnsArr.children[index].compId);
        if (this.getBtnsArr.rightIndex !== 0) {
          // console.log(this.getBtnsArr.children.length, this.getBtnsArr.rightIndex, index);
          if (this.getBtnsArr.children.length - this.getBtnsArr.rightIndex <= index) {
            this.getBtnsArr.rightIndex += 1;
          }
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.menuMain {
  &__btnArea {
    position: relative;
    height: 42px;
    min-height: 42px;
    box-sizing: border-box;
    // background-color: #fff;
    margin-bottom: 10px;
    &.showTablename::before {
      content: attr(tablename);
      position: absolute;
      font-size: 12px;
      color: $--color-primary;
      top: -20%;
      left: 0;
      right: 0;
      height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &.isTree,
    &.isCard {
      width: 100%;
      // margin-bottom: 0;
    }
    &.isSidebar:not(.isTree) {
      height: auto;
      min-height: auto;
    }
    &.isSidebar.isCard.noChild {
      min-height: 40px;
    }
    &.isSidebar.isTree:not(.borderType) {
      width: auto;
      margin-bottom: 0;
    }
    &.hasHeight {
      height: 40px;
    }
    &.hiddenBtnArea {
      display: none;
    }
    &.flexReserve {
      margin-bottom: 0px;
      margin-top: 10px;
      &.notConfig {
        border-top: 1px solid #e9e9e9;
        border-bottom: 0;
      }
    }
    & > div {
      height: 100%;
    }
    &--compList {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      // align-content: flex-start;
      min-height: 100%;
      padding-right: 10px;
      &.isSidebar {
        padding-left: 10px;
        ::v-deep {
          & > .formButton {
            margin: 5px 0;
            width: 100%;
            overflow: hidden;
            .button {
              text-align: center;
              & > span {
                flex: 1;
                overflow: hidden;
                justify-content: center;
              }
              & > span > span {
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
      &.isTree {
        flex-wrap: nowrap;
        &.isSidebar {
          padding-left: 10px;
          ::v-deep {
            & > .formButton {
              margin: 0 4px 0 0 !important;
            }
          }
        }
      }
    }
    &.isTableBtn {
      vertical-align: top;
      text-align: center;
      width: 100%;
      height: 80px;
      box-sizing: border-box;
      .isTableBtn__title {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        height: 40px;
        box-sizing: border-box;
        line-height: 40px;
      }

      & > div {
        height: 40px;
      }
      .menuMain__btnArea--compList {
        box-sizing: border-box;
        border-top: 1px solid #e9e9e9;
        height: 40px;
        min-height: auto;
        padding: 0;
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
  &.isTableBtn {
    &:after {
      top: 75%;
    }
  }
}
.notConfig {
  .menuMain__btnArea--compList.isSidebar {
    padding: 0 8px;
  }
  .menuMain__btnArea--compList.isSidebar > .formButton {
    margin: 0;
    margin-top: 6px;
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
</style>
