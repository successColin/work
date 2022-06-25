<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    :title="panelObj ? panelObj.panelName : ''"
    class="panel__dialog"
    :class="[{ isSel: dataSelObj }]"
    :append-to-body="true"
    :isShowFooter="false"
  >
    <div class="tagParent" v-if="isMulti">
      <ApiotTagBox
        class="tag"
        :configData="{ compId: 'tagValue' }"
        :form="form"
      ></ApiotTagBox>
    </div>
    <ListOrTree
      ref="ListOrTree"
      v-show="getChangeShow"
      class="btnArr"
      :class="[{ isMulti: isMulti }]"
      :curTypeValue.sync="curTypeValue"
      @changeShowType="changeShowType"
    ></ListOrTree>
    <ApiotMenu
      :class="[{ isMulti: isMulti }]"
      :panelObj="panelObj"
      :dataSelObj="dataSelObj"
      v-if="showPanel"
      @closePanle="closePanle"
      @setDataSel="setDataSel"
      @multiArrChange="multiArrChange"
      ref="menu"
    ></ApiotMenu>
  </apiot-dialog>
</template>

<script>
import ApiotMenu from '@/views/ApiotMenu';

export default {
  name: '',
  props: {
    panelObj: {
      type: Object
    },
    showPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSelObj: null,
      curTypeValue: 1,
      muitlArr: [],
      multiMap: null,
      form: {
        tagValue: '',
        tagValue_: ''
      },
      notTouch: false
    };
  },
  mounted() {},
  computed: {
    getChangeShow() {
      if (this.panelObj) {
        if (this.panelObj.pageConfig) {
          if (this.panelObj.pageConfig[0].designOverallLayout) {
            if ([3, 5].includes(this.panelObj.pageConfig[0].designOverallLayout[0].selShowType)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    isMulti() {
      if (this.dataSelObj) {
        if (this.dataSelObj.showInfo) {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    // 根据字段获取map的key
    getMapKey(name) {
      const res = Object.keys(this.multiMap).find((key) => {
        if (this.multiMap[key] === name) {
          return true;
        }
        return false;
      });
      return res;
    },
    closePanle() {
      this.$emit('update:visible', false);
    },
    setDataSel(arr) {
      this.$emit('setDataSel', arr);
    },
    initSelData(name, value, obj) {
      this.dataSelObj = {
        name,
        value,
        showInfo: obj
      };
    },
    changeShowType(v) {
      this.$refs.menu.changeShowType(v);
      if (!this.dataSelObj || !this.dataSelObj.showInfo) {
        return;
      }
      this.notTouch = true;
      sessionStorage.notInitMul = 1;
      this.$nextTick(() => {
        this.$broadcast('initMulti', {
          ...this.form,
          keys: [this.dataSelObj.name, this.dataSelObj.showInfo.name]
        });
        this.notTouch = false;
      });
    },
    multiArrChange(v, map) {
      // console.log(v, map);
      if (!this.dataSelObj) {
        return;
      }
      if (!this.dataSelObj.showInfo) {
        return;
      }
      this.multiArr = v;
      this.multiMap = map;
      this.getForm();
    },
    getForm() {
      const valueArr = [];
      const showArr = [];
      this.multiArr.forEach((item) => {
        // const key1 =
        if (item[this.dataSelObj.name] || item[this.getMapKey(this.dataSelObj.name)]) {
          valueArr.push(item[this.dataSelObj.name] || item[this.getMapKey(this.dataSelObj.name)]);
        }
        if (
          item[this.dataSelObj.showInfo.name] ||
          item[this.getMapKey(this.dataSelObj.showInfo.name)]
        ) {
          showArr.push(
            item[this.dataSelObj.showInfo.name] ||
              item[this.getMapKey(this.dataSelObj.showInfo.name)]
          );
        }
      });
      this.form.tagValue = valueArr.join(',');
      this.form.tagValue_ = showArr.join(',');
    }
  },

  components: {
    ApiotMenu
  },

  watch: {
    panelObj: {
      handler(v) {
        console.log(v, '---面板信息');
      }
    },
    showPanel(v) {
      if (v) {
        this.$nextTick(() => {
          if (this.$refs.ListOrTree && this.dataSelObj) {
            this.$refs.ListOrTree.changeCurType(this.curTypeValue);
          }
          if (this.dataSelObj && !this.dataSelObj.value) {
            this.form.tagValue = '';
            this.form.tagValue_ = '';
          }
          this.$broadcast('initTime', v);
        });
      }
    },
    'form.tagValue': function (v) {
      // console.log(v);
      if (!this.dataSelObj.showInfo) {
        return;
      }
      if (!this.notTouch) {
        this.$broadcast('updateMulti', v);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.panel__dialog {
  .tagParent {
    box-sizing: border-box;
    margin: 10px 21px 0 21px;
    padding: 4px 0 4px 4px;
    border: 1px dashed #e9e9e9;
    .tag {
      width: 100%;
      ::v-deep {
        .fieldSelect--item {
          .wz {
            line-height: 28px !important;
          }
        }
      }
    }
  }
  .isMulti {
    top: 54px;
  }
  .btnArr {
    position: absolute;
    z-index: 100;
    left: 20px;
    top: 6px;
    &.isMulti {
      top: 58px;
    }
  }
  ::v-deep {
    @media (min-height: 640px) {
      & > .el-dialog {
        height: 640px;
      }
    }
    @media (max-height: 640px) {
      & > .el-dialog {
        position: absolute;
        top: 20px;
        bottom: 20px;
      }
    }
    & > .el-dialog {
      width: 930px;
    }
    .el-dialog__body {
      position: relative;
      padding: 0;
      height: calc(100% - 54px);
      border-radius: 0 0 8px 8px;
      .tabMain {
        padding-bottom: 0;
      }
    }
    .tabMain__pane--area {
      padding: 0px 21px 0;
      box-sizing: border-box;
      &.firstIsTable {
        padding-top: 0px;
      }
    }

    .tabMain__pane.showBtnsArea.inBottom {
      padding-bottom: 64px;
    }
    .tabMain__pane.showBtnsArea.inBottom .btnsArea {
      height: 64px;
    }
    .tabMain__pane.showBtnsArea .btnsArea .menuMain__btnArea--compList {
      padding-right: 30px;
      padding-left: 20px;
    }
    .tabMain__pane .firstIsTable .menuMain__btnArea--compList {
      padding-right: 0;
    }
    .tabMain__pane .treeArea {
      .menuMain__btnArea {
        margin-bottom: 0;
      }
      .menuMain__feature {
        border: 1px solid #e9e9e9;
        border-radius: 4px;
      }
    }
  }
  &.isSel {
    ::v-deep {
      .tabMain__pane--area {
        padding-top: 0px;
      }
    }
  }
}
</style>
