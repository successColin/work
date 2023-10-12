<template>
<!--  <div class="json-editor-wrap" :class="{ fullScreen: isFull }">-->
  <div class="json-editor-wrap" >
    <div class="json-editor">
      <textarea ref="textarea" />
    </div>
<!--    <div class="operWrap">-->
<!--      <el-tooltip class="item" effect="dark" content="复制" placement="top">-->
<!--        <span-->
<!--          :class="`iconfont icon-fuzhi start${mathClassId}class`"-->
<!--          :data-clipboard-text="value"-->
<!--        ></span>-->
<!--      </el-tooltip>-->
<!--      <span class="split"></span>-->
<!--      <el-tooltip-->
<!--        class="item"-->
<!--        effect="dark"-->
<!--        :content="isFull ? '还原' : '全屏'"-->
<!--        placement="top"-->
<!--      >-->
<!--        <span-->
<!--          class="iconfont"-->
<!--          :class="{ 'icon-quanping': !isFull, 'icon-quxiaoquanping': isFull }"-->
<!--          @click="isFull = !isFull"-->
<!--        ></span>-->
<!--      </el-tooltip>-->
<!--    </div>-->
  </div>
</template>

<script>
// import Clipboard from 'clipboard';
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import { getChartsByEx } from '_u/utils';
// import { createUnique } from '@/utils/utils';

/* eslint-disable import/no-webpack-loader-syntax  */
/* eslint-disable import/no-extraneous-dependencies  */
require('script-loader!jsonlint');

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: {
    value: {
      type: String,
      default() {
        return '{}';
      }
    },
    readonly: { // 是否只读
      type: [String, Boolean],
      default: false
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    variables: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      isFull: false, // 是否全屏
      jsonEditor: false,
      cursor: null,
      // clipboard: null,
      mathClassId: null
    };
  },
  watch: {
    value(value) {
      this.$nextTick(() => {
        const editorValue = this.jsonEditor.getValue();
        if (value !== editorValue) {
          const value1 = this.value;
          this.jsonEditor.setValue(value1);
        }
      });
    }
  },
  mounted() {
    // this.mathClassId = createUnique();
    // this.clipboard = new Clipboard(`.start${this.mathClassId}class`);
    // if (this.clipboard) {
    //   this.clipboard.on('success', () => {
    //     this.$message.success('复制成功！');
    //   });
    // }
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'text/x-markdown',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'eclipse',
      lint: true,
      readOnly: this.readonly,
      lineWrapping: true,
      tabSize: 2,
      ...this.config
    });
    this.$nextTick(() => {
      this.jsonEditor.setValue(this.value.replace(/\\/g, ''), null, 2);
      const strArry = this.value.split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(strArry[line], this.regExRules);

        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const variableCode = marTextArry[col].result[1];
          const variable = this.variables.find((item) => item.variableCode === variableCode);
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(variable.variableName, variable.variableType),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true
            }
          );
        }
      }
    });
    this.jsonEditor.on('change', (cm) => {
      this.$emit('changed', cm.getValue());
      this.$emit('input', cm.getValue());
    });
    this.jsonEditor.on('blur', (cm) => {
      this.$emit('blur', cm.getValue());
      this.cursor = cm.getCursor();
    });
  },
  computed: {
    regExRules() {
      const rules = [];
      this.variables.forEach((element) => {
        rules.push(element.variableCode);
      });

      // eslint-disable-next-line no-useless-concat
      return '\\$' + `{(${rules.join('|')})!}`;
    }
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue();
    },
    focus() {
      this.jsonEditor.focus();
    },
    // 创建标记节点
    createMartDom(markText, type) {
      const htmlNode = document.createElement('span');
      htmlNode.className = `custom__varible type_${type}`;
      const htmlText = `<label>${markText}</label>`;
      htmlNode.innerHTML = htmlText;
      return htmlNode;
    },
    setValue(markInfo) {
      if (!this.cursor) {
        this.cursor = this.jsonEditor.getCursor();
      }
      const { ch, line } = this.cursor;
      // eslint-disable-next-line no-useless-concat
      const key = '$' + `{${markInfo.variable.variableCode}!}`;
      const cursor = {
        line,
        ch: ch + key.length
      };
      // 插入对应实际的值
      this.jsonEditor.replaceRange(key, this.cursor);
      // 对这个实际的值进行标记
      this.jsonEditor.doc.markText(this.cursor, cursor, {
        replacedWith: this.createMartDom(
          markInfo.variable.variableName,
          markInfo.variable.variableType
        ),
        inclusiveLeft: false,
        inclusiveRight: false,
        selectRight: true,
        handleMouseEvents: true
      });

      // 标记好后，进行聚焦，设置光标位置
      this.jsonEditor.focus();
      this.jsonEditor.doc.setCursor(cursor);
      this.cursor = cursor;
    },
  },
  beforeDestroy() {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
    // this.mathClassId = null;
  }
};
</script>

<style lang="scss" scoped>
.json-editor-wrap {
  position: relative;
  height: 237px;

  &.fullScreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    height: calc(100%);
    background: #fff;

    .json-editor {
      height: 100%;
    }
  }

  .operWrap {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 60px;
    height: 22px;
    display: flex;
    padding: 4px 8px;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border: 1px solid #e9e9e9;
    box-sizing: border-box;
    z-index: 3;

    &:hover {
      border: 1px solid #4689f5;
    }

    .iconfont {
      color: #bbc3cd;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;

      &:hover {
        color: #4689f5;
      }
    }

    .split {
      display: block;
      width: 1px;
      height: 13px;
      background-color: #bbc3cd;
    }
  }

  .json-editor {
    height: 100%;
    position: relative;
    overflow: auto;
    font-size: 18px;
    line-height: 1;
    //border: 1px solid #e9e9e9;
    //border-radius: 4px;
    box-sizing: border-box;

    ::v-deep {
      .cm-s-cobalt.CodeMirror,
      .cm-s-cobalt .CodeMirror-gutters {
        background: #192757;
      }

      .cm-s-cobalt .CodeMirror-gutters {
        border-right: 1px solid #2f437f;
      }

      .CodeMirror {
        height: auto;
        min-height: 300px;
      }

      .CodeMirror-linenumber {
        font-size: 13px;
      }

      .CodeMirror-scroll {
        min-height: 300px;
      }

      .CodeMirror pre.CodeMirror-line,
      .CodeMirror pre.CodeMirror-line-like {
        font-size: 13px;
      }

      .cm-s-rubyblue span.cm-string {
        color: #f08047;
      }

      .jsonEditor__text {
        vertical-align: 2px;
        padding: 2px 10px;
        background: #e5f0ff;
        border-radius: 4px;
        color: #4689f5;
        font-size: 13px;
      }
      .custom__varible {
        margin: 0 5px;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        background: #e5f0ff;
        border-radius: 4px;
        & label {
          padding: 0 10px;
          display: inline-block;
          height: 24px;
          line-height: 24px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4689f5;
        }
        &.type_1 {
          background: #ffeaeb;
          & label {
            color: #ee5e5e;
          }
        }
        &.type_2 {
          background: #ebfcf7;
          & label {
            color: #10b98a;
          }
        }
        &.type_3 {
          background: #e5f0ff;
          & label {
            color: #4689f5;
          }
        }
        &.type_4 {
          background: #FFEDE1;
          & label {
            color: #FA6400;
          }
        }
        &.type_5 {
          background: #EBFCF7;
          & label {
            color: #10B98A;
          }
        }
      }
    }
  }
}
</style>
