<template>
  <div class="selectComp">
    <apiot-input
      class="selectComp__input"
      v-model="curTriggerComp.compId"
      :placeholder="placeholder"
      readonly
      slotType="append"
    >
      <el-button slot="append" @click="selectTriggerComp" :disabled="disabled"
        ><i class="iconfont icon-jiahao"></i
      ></el-button>
    </apiot-input>
    <comp-item
      :compObj="curTriggerComp"
      :triggerCompMap="triggerCompMap"
      class="triggerComp"
      v-if="curTriggerComp.compId || curTriggerComp.isFormula === 2"
    ></comp-item>
    <transition name="slide-bottom">
      <comp-tree
        :visible.sync="showCompTree"
        v-if="showCompTree"
        :selectedComp="selectedComp"
        @getSelectComp="getSelectComp"
        v-bind="$attrs"
      ></comp-tree>
    </transition>
  </div>
</template>

<script>
import CompTree from '../CompTree';

export default {
  props: {
    businessType: {
      type: String
    },
    curTriggerComp: {
      type: Object
    },
    triggerCompMap: {
      type: Object
    },
    disabled: {
      type: Boolean
    },
    placeholder: {
      type: String,
      default: '请选择控件'
    }
  },
  data() {
    return {
      showCompTree: false,
      selectedComp: {}
    };
  },

  components: {
    CompTree
  },

  computed: {},

  mounted() {
    // console.log(this.curTriggerComp, 'sssssss', this.triggerCompMap);
  },

  methods: {
    selectTriggerComp() {
      this.selectedComp = this.curTriggerComp;
      this.showCompTree = true;
    },
    getSelectComp(comp) {
      if (comp.isFormula === 2) {
        this.curTriggerComp.compType = '';
        this.curTriggerComp.compName = '';
        this.curTriggerComp.name = comp.name;
        this.curTriggerComp.compId = '';
        this.curTriggerComp.compPath = '';
        this.curTriggerComp.isFormula = 2;
        this.$emit('compChange');
      } else if (this.curTriggerComp.compId !== comp.compId) {
        this.curTriggerComp.isFormula = 1;
        this.curTriggerComp.name = '';
        this.curTriggerComp.compType = comp.compType;
        this.curTriggerComp.compName = comp.name;
        this.curTriggerComp.compId = comp.compId;
        this.curTriggerComp.compPath = comp.compPath;
        if (this.businessType === 'flow') {
          this.curTriggerComp.columnName = comp.dataSource.columnName;
          this.curTriggerComp.columnType = comp.dataSource.columnTypeDict;
        }
        this.$emit('compChange');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.selectComp {
  position: relative;
  &__input {
    ::v-deep {
      .el-input__inner {
        color: #fff;
      }
      .el-input-group__append {
        padding: 0;
        width: 30px;
        text-align: center;
        .el-button--default {
          margin: 0;
          padding: 0 6px;
          background-color: #fff;
          border: 1px solid transparent !important;
          .icon-jiahao {
            color: #bbc3cd;
          }
          &:hover {
            background-color: #e5f0ff;
            .icon-jiahao {
              color: $--color-primary;
            }
          }
        }
        .el-button--default.is-disabled {
          &:hover {
            background-color: #e5f0ff;
            .icon-jiahao {
              color: #bbc3cd;
            }
          }
        }
      }
    }
  }

  .iconfont {
    color: $--color-primary;
  }
  .icon-jiahao {
    color: #333333;
    &:hover {
      color: $--color-primary;
    }
  }
  .triggerComp {
    position: absolute;
    margin-top: -28px;
    margin-left: 4px;
  }
}
</style>
