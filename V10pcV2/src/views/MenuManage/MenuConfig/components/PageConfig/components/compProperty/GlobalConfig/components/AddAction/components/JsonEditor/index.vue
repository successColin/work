<template>
  <div class="json-editor">
    <textarea ref="textarea" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import { getChartsByEx } from '@/utils/utils';
/* eslint-disable import/no-webpack-loader-syntax  */
/* eslint-disable import/no-extraneous-dependencies  */
require('script-loader!jsonlint');

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  // props: ['value', 'requestLintRes', 'triggerCompMap'],
  props: {
    value: {
      type: String
    },
    requestLintRes: {
      type: Boolean
    },
    triggerCompMap: {
      type: Object
    },
    mode: {
      type: String,
      default: 'application/json'
    }
  },
  data() {
    return {
      jsonEditor: false,
      cursor: null
    };
  },
  watch: {
    value(value) {
      this.$nextTick(() => {
        const editorValue = this.jsonEditor.getValue();
        if (value !== editorValue) {
          const value1 = JSON.parse(this.value);
          this.jsonEditor.setValue(JSON.stringify(value1, null, 2));
        }
      });
    }
  },
  mounted() {
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: this.mode,
      gutters: ['CodeMirror-lint-markers'],
      theme: 'idea',
      lint: true
    });
    console.log(this.value);

    this.$nextTick(() => {
      if (this.value) {
        this.jsonEditor.setValue(
          JSON.stringify(JSON.parse(this.value.replace(/\\/g, '')), null, 2)
        );
      }

      this.jsonEditor.focus();
      this.jsonEditor.setCursor(this.jsonEditor.lineCount(), 0);
      this.repalceMark();
    });
    this.jsonEditor.on('change', (cm) => {
      // // console.log(cm.getValue());
      this.$emit('update:requestLintRes', true);
      try {
        window.jsonlint.parse(cm.getValue());
      } catch (error) {
        this.$emit('update:requestLintRes', false);
      }
      // console.log(this.requestLintRes);
      this.$emit('changed', cm.getValue());
      this.$emit('input', cm.getValue());
    });
    this.jsonEditor.on('blur', (cm) => {
      this.cursor = cm.getCursor();
    });
  },
  methods: {
    repalceMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(strArry[line], '\\"\\$([A-Za-z0-9]{6})\\$\\"');
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const compId = marTextArry[col].result[1];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(this.triggerCompMap[compId].compName),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true
            }
          );
        }
      }
    },
    getValue() {
      return this.jsonEditor.getValue();
    },
    // 创建标记节点
    createMartDom(markText) {
      const htmlNode = document.createElement('span');
      htmlNode.className = 'jsonEditor__text';
      const htmlText = `${markText}`;
      htmlNode.innerHTML = htmlText;
      return htmlNode;
    },
    setValue(markInfo) {
      const { ch, line } = this.cursor;
      // eslint-disable-next-line no-useless-concat
      const key = `"$${markInfo.compId}$"`;
      const cursor = {
        line,
        ch: ch + key.length
      };
      // 插入对应实际的值
      this.jsonEditor.replaceRange(key, this.cursor);
      // 对这个实际的值进行标记
      this.jsonEditor.doc.markText(this.cursor, cursor, {
        replacedWith: this.createMartDom(markInfo.name),
        inclusiveLeft: false,
        inclusiveRight: false,
        selectRight: true,
        handleMouseEvents: true
      });

      // 标记好后，进行聚焦，设置光标位置
      this.jsonEditor.focus();
      this.jsonEditor.doc.setCursor(cursor);
      this.cursor = cursor;
    }
  }
};
</script>

<style lang="scss" scoped>
.json-editor {
  height: 300px;
  position: relative;
  overflow: auto;
  font-size: 18px;
  line-height: 1;

  ::v-deep {
    .CodeMirror {
      height: auto;
      min-height: 300px;
    }

    .CodeMirror-scroll {
      min-height: 300px;
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
  }
}
</style>
