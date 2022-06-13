<template>
  <section class="formula">
    <div class="formula__params">
      <div class="formula__params--comp" v-if="treeType!==5">
        <div class="formula__params--compHead">
          表单控件
          <i class="iconfont icon-sousuo" @click="showCompSearch"></i>
          <search-input
            v-show="showCompTree"
            ref="compSearch"
            @getList="getTree"
            @blur="compSearchBlur"
            v-model="compName"
            class="compSearch"
          ></search-input>
        </div>
        <div class="formula__params--compTree">
          <el-tree
            v-if="showTree"
            ref="configTree"
            :data="configData"
            node-key="compId"
            class="formula__tree"
            default-expand-all
            @node-click="nodeClick"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ data }"
              :key="data.compId || data.name"
              class="formula__treeItem"
            >
              <img
                v-if="data.compType"
                :src="require(`@/assets/img/menu_images/${data.imgUrl}`)"
              />
              {{ data.name }}
            </div>
          </el-tree>
        </div>
      </div>
      <div class="formula__params--comp" v-if="treeType===5">
        <div class="formula__params--compHead">
          函数
          <i class="iconfont icon-sousuo" @click="showFormulaSearch"></i>
          <search-input
              v-show="showFormula"
              ref="formulaSearch"
              @getList="getFormulaTree"
              @blur="formulaSearchBlur"
              v-model="formulaNameKey"
              class="compSearch"
          ></search-input>
        </div>
        <div class="formula__params--formuTree formula__params--compTree">
          <el-tree
              v-if="treeType===5"
              ref="formulaTree"
              :data="formulaData"
              node-key="compId"
              class="formula__tree"
              default-expand-all
              @node-click="formulaNodeClick"
              :filter-node-method="formulaFilterNode"
              :expand-on-click-node="false"
          >
            <div
                slot-scope="{ data }"
                :key="data.name"
                class="formula__treeItem"
            >
              {{ data.name }}
            </div>
          </el-tree>
        </div>
      </div>
    </div>
    <div class="formula__box">
      <div class="formula__box--header">{{ titleName }}</div>
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
import { formulaData } from '@/config';
import parser from '_u/formula';

export default {
  props: {
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    formulaStr: {
      type: String,
      default: ''
      // [getVariable]($M2kf9X$)
    },
    titleName: {
      type: String,
      default: 'Where条件'
    },
    height: {
      type: String,
      default: '422px'
    },
    treeType: { // 树展示类型
      type: Number,
      default: 1
    },
    showContent: {
      type: Boolean,
      default: false
    },
    showType: {
      type: Array,
      default: () => [1]
    }
  },
  data() {
    return {
      showFormula: false, // 是否展示公式树搜索
      showFormulaTree: false, // 是否展示公式树
      formulaNameKey: '',
      showLoading: false, // 是否展示loading
      compName: '', // 组件树搜索名
      showCompTree: false, // 是否展示组件树搜索
      showTree: false, // 是否展示组件树
      jsonEditor: null,
      formulaValue: '',
      cursor: null,
      formulaData
    };
  },

  components: {},

  computed: {
    getFormulaData() {
      const arr = [];
      this.formulaData.forEach((item) => {
        item.children.forEach((formula) => {
          arr.push(formula.name);
        });
      });
      return arr;
    },
  },

  mounted() {
    this.getTree();
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
      this.jsonEditor.setValue(this.formulaStr);
      // 自动聚焦
      this.jsonEditor.focus();
      // 聚焦到最后
      this.jsonEditor.setCursor(this.jsonEditor.lineCount(), 0);
      // console.log(111);
      // 替换组件的标记
      this.repalceCompMark();
      this.repalceFormulaMark();
      this.repalceSysMark();
      // 初始化方法
      this.initFunc();
    });
  },

  methods: {
    // 初始化自定的方法
    initFunc() {
      // GET_FIELD_VALUE
      parser.setFunction('GET_FIELD_VALUE', (params) => {
        if (params.length === 0) {
          return new Error('需要一个参数');
        }
        if (params[0] === '') {
          return new Error('参数需要具体的字段');
        }
        const reg = /^[A-Za-z]+$/;
        if (typeof params[0] === 'string' && !reg.test(params[0])) {
          return new Error('参数需是英文字母！');
        }
        return '';
      });
      // GET_VAR
      parser.setFunction('GET_VAR', (params) => {
        if (params.length !== 1) {
          return '';
        }
        return params[0];
      });
      // 数据选择框选择数据公式，只在影响控件里面有
      parser.setFunction('GET_SELDATA', (params) => {
        if (
          params.length !== 2 &&
            params.length !== 3 &&
            params.length !== 4 &&
            params.length !== 5
        ) {
          return new Error('参数为两个,三个或四个');
        }
        if (params[0] !== '') {
          return new Error('第一个参数应为数据选择框组件');
        }
        if (typeof params[1] !== 'string' && params[1] !== '') {
          return new Error('第二个参数应为字符串');
        }
        return '';
      });
      // BULK_ADD
      parser.setFunction('BULK_ADD', (params) => {
        if (params.length === 0) {
          return new Error('批量新增需要参数');
        }
        return '';
      });
      parser.setFunction('GET_SHOW_VALUE', (params) => {
        if (params.length !== 1) {
          return new Error('获取显示值，需要有且只有一个参数');
        }
        return '';
      });
      parser.setFunction('GET_TABLE_VALUE', (params) => {
        if (params.length !== 1 || params.length !== 1) {
          return new Error('获取列表值，需要1个或2个参数');
        }
        return '';
      });
      // BULK_ONE_ADD
      parser.setFunction('BULK_ONE_ADD', (params) => {
        if (params.length === 0) {
          return new Error('批量新增需要参数');
        }
        return '';
      });
      // CREATE_UNIQUE
      parser.setFunction('CREATE_UNIQUE', (params) => {
        if (params.length === 0) {
          return new Error('修改提交值需要参数');
        }
        return '';
      });
      parser.setFunction('GET_USER_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_ORG_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_ROLES_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_DATE', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_DATETIME', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_YEAR', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_MONTH', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_WEEK', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_DAY', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_TIMESTAMP', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return '';
      });
      //
      parser.setFunction('GET_MENU_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取菜单id公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_TABLE_IDS', (params) => {
        if (params.length !== 0) {
          return new Error('获取表格id集合公式无参数');
        }
        return '';
      });

      parser.setFunction('GET_SCAN_VALUE', (params) => {
        if (params.length !== 0) {
          return new Error('获取扫一扫结果公式无参数');
        }
        return '';
      });
    },
    // 初始化方法替换
    repalceFormulaMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(
          strArry[line],
          `\\[(${this.getFormulaData.join('|')})\\]`
        );
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const formulaName = marTextArry[col].result[1];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(formulaName, true),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true
            }
          );
        }
      }
    },
    // 初始化方法替代
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
    // 获取组件树
    getTree() {
      this.showTree = false;
      if (this.treeType !== 5) { // 不是自定义页面的时候，才执行
        this.$nextTick(() => {
          this.showTree = true;
          setTimeout(() => {
            this.$refs.configTree.filter(this.compName);
          }, 0);
        });
      }
      if (this.treeType === 5) {
        this.$refs.formulaTree.filter();
      }
    },
    // 组件搜索失焦
    compSearchBlur() {
      if (!this.compName) {
        this.showCompTree = false;
      }
    },
    // 组件搜索展示
    showCompSearch() {
      this.showCompTree = true;
      this.$nextTick(() => {
        this.$refs.compSearch.focus();
      });
    },
    // 组件filter
    filterNode(value, data, node) {
      if (value && data.name.indexOf(value) === -1) {
        return false;
      }
      const tempNode = this.findNode(node);
      if (tempNode && tempNode.parent.data.showTab === false) {
        if (
          tempNode.parent.data.curCompId &&
          tempNode.data.compId &&
          tempNode.parent.data.curCompId === tempNode.data.compId
        ) {
          return true;
        }
        return false;
      }

      return true;
    },
    findNode(node) {
      let tempNode = null;
      while (node.parent && !tempNode) {
        if (node.parent.data.showTab === false) {
          tempNode = node;
          break;
        }
        node = node.parent;
      }
      return tempNode;
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
    },
    // 获取公式树
    getFormulaTree() {
      this.showFormulaTree = false;
      this.$nextTick(() => {
        this.showFormulaTree = true;
        setTimeout(() => {
          this.$refs.formulaTree.filter(this.formulaNameKey);
        }, 0);
      });
    },
    // 公式搜索失焦
    formulaSearchBlur() {
      if (!this.formulaNameKey) {
        this.showFormula = false;
      }
    },
    // 公式搜索展示
    showFormulaSearch() {
      this.showFormula = true;
      this.$nextTick(() => {
        this.$refs.formulaSearch.focus();
      });
    },
    formulaNodeClick(data) {
      if (!data.isFormula) {
        return;
      }
      const key = `[${data.name}]`;
      this.setFormulaMarkText(key, data.name);
    },
    setFormulaMarkText(key, name, isFormula = true) {
      const { ch, line } = this.cursor;
      const cursor = {
        line,
        ch: ch + key.length
      };
      // 插入对应实际的值
      this.jsonEditor.replaceRange(key, this.cursor);
      // 对这个实际的值进行标记
      this.jsonEditor.doc.markText(this.cursor, cursor, {
        replacedWith: this.createMartDom(name, isFormula, this.treeType),
        inclusiveLeft: false,
        inclusiveRight: false,
        selectRight: true,
        handleMouseEvents: true
      });
      if (isFormula) {
        this.jsonEditor.replaceSelection('()');
        cursor.ch += 1;
      }
      // 标记好后，进行聚焦，设置光标位置,聚焦到括号内部
      this.jsonEditor.focus();
      this.jsonEditor.doc.setCursor(cursor);
      this.cursor = cursor;
    },
    // 公式filter
    formulaFilterNode(value, data) {
      if (value && data.name.indexOf(value) === -1) {
        return false;
      }
      // 对数据选择框的公式做特殊处理
      // if (data.name === 'GET_SELDATA') {
      //   // console.log(data.name);
      //   if (!this.isAffetComp) {
      //     return false;
      //   }
      // }
      if (!this.showType.includes(data.type)) {
        return false;
      }
      return true;
    },
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
