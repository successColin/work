<template>
  <div class="selectFormula">
    <apiot-input
      v-model="formula"
      placeholder="请选择公式"
      readonly
      slotType="append"
    >
      <el-button slot="append" :disabled="disabled" @click="showDialog"
        ><i class="iconfont icon-jiahao"></i
      ></el-button>
    </apiot-input>
    <div
      class="selectFormula__show"
      v-html="getFormulaHtml"
      v-if="formulaStr"
    ></div>
    <transition name="slide-bottom">
      <formula-dialog
        :visible.sync="showFormula"
        v-if="showFormula"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
        :formulaStr.sync="formulaStr"
        :showType="showType"
        :variables="variables"
        :onlyIsWeb="onlyIsWeb"
        :isSql="isSql"
      ></formula-dialog>
    </transition>
  </div>
</template>

<script>
import FormulaDialog from '../FormulaDialog';

export default {
  props: {
    formula: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
    value: {
      type: String,
    },
    showType: {
      type: Array,
      default: () => [1],
    },
    variables: {
      type: Array,
    },
    onlyIsWeb: {
      type: Boolean,
      default: true,
    },
    isSql: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showFormula: false,
      formulaStr: '',
    };
  },

  components: {
    FormulaDialog,
  },

  computed: {
    getFormulaHtml() {
      if (!this.formulaStr) {
        return '';
      }
      let str = this.formulaStr.replace(/\[|\]/g, '');
      if (str.indexOf('$variable_') !== -1) {
        const res = str.replace(/\$variable_+([a-zA-Z0-9_]+)\$/g, (...arr) =>
          this.createMartDom(`${arr[1]}`),
        );
        return res;
      }
      str = this.repalceCompMark(str);
      return str;
    },
  },

  mounted() {
    this.formulaStr = this.value;
  },

  methods: {
    showDialog() {
      this.showFormula = true;
    },
    // 初始化组件替换
    repalceCompMark(str) {
      let res = str.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
        if (this.triggerCompMap[v1]) {
          return this.createMartDom(this.triggerCompMap[v1].compName);
        }
        this.$emit('input', '');
        this.formulaStr = '';
        return '';
      });
      res = res.replace(
        /\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => this.createMartDom(`${arr[1]}`),
      );
      return res;
    },
    // 创建标记节点
    createMartDom(markText) {
      return `<span class="jsonEditor__variable">${markText}</span>`;
    },
  },
  watch: {
    value(v) {
      if (!v) {
        this.formulaStr = '';
      }
    },
    formulaStr(v) {
      // console.log(v);
      this.$emit('input', v);
    },
  },
};
</script>

<style lang="scss" scoped>
.selectFormula {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  ::v-deep {
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
          color: #aaaaaa;
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
            color: #333333;
          }
        }
      }
    }
    .jsonEditor__variable {
      vertical-align: 2px;
      padding: 2px 10px;
      height: 20px;
      line-height: 20px;
      background: #e5f0ff;
      border-radius: 4px;
      color: #4689f5;
      font-size: 13px;
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
  &__show {
    position: absolute;
    display: flex;
    align-items: center;
    left: 10px;
    width: calc(100% - 42px);
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
