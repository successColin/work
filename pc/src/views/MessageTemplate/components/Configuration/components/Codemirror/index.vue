<template>
  <div class="codemirror" :style="{ height: `${height}px` }">
    <codemirror
      ref="cmEditor"
      :key="com"
      v-model="content"
      :options="cmOption"
      @cursorActivity="onCmCursorActivity"
      @ready="onCmReady"
      @focus="onCmFocus"
      @blur="onCmBlur"
      @changes="handleChange"
    />
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/base16-light.css';

import 'codemirror/mode/vue/vue.js';
import 'codemirror/addon/selection/active-line.js';

import { getChartsByEx } from '@/utils/utils';

export default {
  name: 'codemirror-example-vue',
  title: 'Mode: text/x-vue & Theme: base16-dark',
  components: {
    codemirror
  },
  props: {
    // 编辑器唯一标识，为了区别一个界面有多个编辑器情况
    com: {
      type: String,
      default: 'PCDesign'
    },
    prop: {
      type: String,
      default: 'codemirror'
    },
    height: Number
  },
  data() {
    return {
      cursor: '',
      content: '',
      variables: [],
      cmOption: {
        tabSize: 4,
        styleActiveLine: false,
        line: true,
        mode: 'text/x-markdown',
        theme: 'base16-light',
        cursorHeight: 1
      },
      codemirror: ''
    };
  },
  computed: {
    codemirror1() {
      return this.$refs.cmEditor.codemirror;
    },
    regExRules() {
      const rules = [];
      this.variables.forEach((element) => {
        rules.push(element.variableCode);
      });

      // eslint-disable-next-line no-useless-concat
      return '\\$' + `{(${rules.join('|')})!}`;
    }
  },

  watch: {
    content(newValue) {
      this.$emit('contentChange', { content: newValue, prop: this.prop });
    }
  },

  methods: {
    init(row) {
      this.content = row.content;
      this.variables = row.variables;
      this.codemirror.setValue(row.content);
      const strArry = this.content.split('\n'); // 一共几行
      console.log('INIT');
      console.log(this.regExRules);
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(strArry[line], this.regExRules);
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const variableCode = marTextArry[col].result[1];
          const variable = this.variables.find((item) => item.variableCode === variableCode);
          // 开始标记
          this.codemirror.doc.markText(
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
      console.log('setValue');
      const { ch, line } = this.cursor;
      // eslint-disable-next-line no-useless-concat
      const key = '$' + `{${markInfo.variable.variableCode}!}`;
      console.log(key);
      const cursor = {
        line,
        ch: ch + key.length
      };
      // 插入对应实际的值
      this.codemirror.replaceRange(key, this.cursor);
      // 对这个实际的值进行标记
      this.codemirror.doc.markText(this.cursor, cursor, {
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
      this.codemirror.focus();
      this.codemirror.doc.setCursor(cursor);
      this.cursor = cursor;
    },
    handleChange() {
      // const cursor = cm.getCursor();
      // // console.log('=================change');
      // // console.log(changes);
      // // console.log(cm.getTokenTypeAt(cursor));
      // // console.log(cm.getTokenAt(cursor));
      // // console.log(changes);
      // // console.log(cm.getValue());
    },
    onCmCursorActivity() {},
    onCmReady() {},
    onCmFocus() {
      this.$emit('onCmFocus', { com: this.com });
    },
    onCmBlur(cm) {
      this.cursor = cm.getCursor();
    }
  },
  mounted() {
    this.codemirror = this.$refs.cmEditor.codemirror;
    // this.init();
    // this.codemirror.replaceRange('hello', { ch: 0, line: 1 });
  }
};
</script>

<style lang="scss" scoped>
.codemirror {
  padding: 10px;
  height: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  box-sizing: border-box;
  ::v-deep {
    .vue-codemirror,
    .CodeMirror {
      height: 100%;
    }

    .cm-s-base16-light.CodeMirror {
      background: #fff;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    .CodeMirror pre.CodeMirror-line {
      padding: 5px 0;
      & > span {
        height: 24px;
        line-height: 24px;
      }
    }

    .custom__varible {
      margin: 0 5px;
      display: inline-block;
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
    }
  }
}
</style>
