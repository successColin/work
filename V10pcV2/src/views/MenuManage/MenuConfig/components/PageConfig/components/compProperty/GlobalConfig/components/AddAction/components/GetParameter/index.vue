<template>
  <section class="formula">
    <div class="formula__box">
      <div class="formula__box--main">
        <textarea ref="textarea" />
      </div>
    </div>
  </section>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/theme/idea.css';
import 'codemirror/lib/codemirror.css';
import { getChartsByEx } from '@/utils/utils';

export default {
  props: {
    triggerCompMap: {
      type: Object
    },
    formulaStr: {
      type: String,
      default: ''
      // [getVariable]($M2kf9X$)
    },
    showContent: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      jsonEditor: null,
      cursor: null
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.$nextTick(() => {
      this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
        lineNumbers: false,
        mode: { name: 'javascript' },
        extraKeys: {
          Ctrl: 'autocomplete',
          'Shift-4': () => '',
          "Shift-'": () => '',
          '[': () => '',
          ']': () => ''
        },
        theme: 'idea',
        lineWrapping: true
      });
      this.jsonEditor.setSize('auto', this.height);
      this.jsonEditor.on('change', this.handleCodeChange);
      this.jsonEditor.on('blur', (cm) => {
        this.cursor = cm.getCursor();
      });
      // 自动匹配右括号
      this.jsonEditor.addKeyMap({
        name: 'autoInsertParentheses',
        "'('": (cm) => {
          const cur = cm.getCursor();

          cm.replaceRange('()', cur, cur, '+insert');
          cm.doc.setCursor({ line: cur.line, ch: cur.ch + 1 });
        }
      });
      if (this.formulaStr === '{}') {
        this.jsonEditor.setValue('');
      } else {
        this.jsonEditor.setValue(this.formulaStr);
      }

      // 自动聚焦
      this.jsonEditor.focus();
      // 聚焦到最后
      this.jsonEditor.setCursor(this.jsonEditor.lineCount(), 0);
      // 替换组件的标记
      this.repalceCompMark();
    });
  },

  methods: {
    repalceSysMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(
          strArry[line],
          '\\$(\\d+)-\\d+-([a-zA-Z0-9_\\-\\u4e00-\\u9fa5]+)\\$'
        );
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const formulaName = marTextArry[col].result[2];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(formulaName, false, marTextArry[col].result[1]),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true
            }
          );
        }
      }
    },
    // 初始化组件替换
    repalceCompMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // console.log(strArry[line]);
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(strArry[line], '\\$([A-Za-z0-9]{6})\\$');
        // console.log(marTextArry);
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const compId = marTextArry[col].result[1];
          // console.log(this.triggerCompMap);
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(this.triggerCompMap[compId].compName, false),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true
            }
          );
        }
      }
    },
    nodeClick(data) {
      if (!data.compType) {
        return;
      }
      const key = `$${data.compId}$`;
      this.setMarkText(key, data.name, false);
    },

    setMarkText(key, name, isFormula = true) {
      const { ch, line } = this.cursor;
      const cursor = {
        line,
        ch: ch + key.length
      };
      // 插入对应实际的值
      // console.log(key);
      this.jsonEditor.replaceRange(key, this.cursor);
      // 对这个实际的值进行标记
      this.jsonEditor.doc.markText(this.cursor, cursor, {
        replacedWith: this.createMartDom(name, isFormula),
        inclusiveLeft: false,
        inclusiveRight: false,
        selectRight: true,
        handleMouseEvents: true
      });

      // 标记好后，进行聚焦，设置光标位置,聚焦到括号内部
      this.jsonEditor.focus();
      this.jsonEditor.doc.setCursor(cursor);
      this.cursor = cursor;
    },

    getCurStr(isSpecial) {
      const cur = this.jsonEditor.getCursor();
      const curLine = this.jsonEditor.getLine(cur.line);
      let resStr = '';
      let i = cur.ch - 1;
      // 特殊的手动输入方法跳过第一个(
      if (isSpecial) {
        i -= 1;
      }
      for (i; i >= 0; i -= 1) {
        if (
          ['(', '+', '-', '*', '/', ',', '>', '=', '==', '===', '<', '>=', '<='].includes(
            curLine.charAt(i)
          )
        ) {
          break;
        }
        resStr = `${curLine.charAt(i)}${resStr}`;
      }
      return resStr;
    },

    handleCodeChange() {
      this.$emit('update:formulaStr', this.jsonEditor.getValue());
    },
    // 创建标记节点
    createMartDom(markText, flag) {
      const htmlNode = document.createElement('span');
      if (flag) {
        htmlNode.className = 'jsonEditor__formula';
      } else {
        htmlNode.className = 'jsonEditor__variable';
      }
      const htmlText = `${markText}`;
      htmlNode.innerHTML = htmlText;
      return htmlNode;
    }
  },

  watch: {
    showContent(v) {
      if (v) {
        this.$nextTick(() => {
          // this.jsonEditor.setValue(this.formulaStr);
          // 自动聚焦
          this.jsonEditor.focus();
          // // 聚焦到最后
          this.jsonEditor.setCursor(this.jsonEditor.lineCount(), 0);
          // // 替换组件的标记
          // this.repalceCompMark();
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-dialog {
    width: 930px;
  }
  .el-dialog__body {
    height: 522px;
  }
}
.formula {
  padding-top: 8px;
  box-sizing: border-box;
  line-height: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
  &__box {
    margin-left: 20px;
    height: 100%;
    flex: 1;
    &--header {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      position: relative;
      padding: 0 14px 0 20px;
      display: flex;
      align-items: center;
      height: 39px;
      border: 1px solid #e9e9e9;
      border-bottom: 0 none;
    }
    &--main {
      overflow: hidden;
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
    }
  }
  &__params {
    height: 100%;
    width: 240px;
    overflow: hidden;
    &--comp {
      height: 100%;
      width: 240px;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;
    }
    &--compHead {
      position: relative;
      padding: 0 14px 0 20px;
      display: flex;
      align-items: center;
      height: 39px;
      border-bottom: 1px solid #e9e9e9;
      color: #333333;
      font-weight: 600;
      .icon-sousuo {
        margin-left: auto;
        cursor: pointer;
        padding-top: 2px;
        color: #bbc3cd;
        &:hover {
          color: $--color-primary;
        }
      }
      .compSearch {
        position: absolute;
        left: 0;
        right: 0;
        width: auto;
        ::v-deep {
          .el-input__inner {
            border: 0 !important;
          }
        }
      }
    }
    &--compTree {
      height: calc(100% - 40px);
      overflow: hidden;
    }
    &--excle {
      width: 240px;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;
      margin-left: 10px;
    }
  }
  ::v-deep {
    &.el-tree {
      overflow: auto;
      width: 240px;
      height: 100%;
      display: flex;
      flex-direction: column;
      > .el-tree-node {
        /*设置横向滚动条*/
        min-width: 100%;
        display: inline-block;
      }
    }
    .jsonEditor__formula {
      color: $--color-primary;
    }
    .jsonEditor__variable {
      margin: 0 2px;
      vertical-align: 2px;
      padding: 2px 10px;
      background: #e5f0ff;
      border-radius: 4px;
      color: #4689f5;
      font-size: 13px;
    }
  }
  &__tree {
    ::v-deep {
      .el-tree-node:focus > .el-tree-node__content {
        background-color: $--hover-color;
        border-left: 3px solid $--color-primary;
      }
      .el-tree-node__content {
        height: 36px;
        box-sizing: border-box;
        border-left: 3px solid transparent;
        .el-tree-node__expand-icon {
          margin-left: 10px;
        }
        & > div {
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
  &__treeItem {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
}
</style>
