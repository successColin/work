<template>
  <apiot-dialog
    class="formula"
    title="选择公式"
    :loading.sync="showLoading"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <div class="formula__box">
      <div class="formula__box--header">当前公式=</div>
      <div class="formula__box--main">
        <textarea ref="textarea" />
      </div>
    </div>
    <div class="formula__params">
      <div class="formula__params--comp">
        <div class="formula__params--compHead">
          <el-dropdown class="formula__treeSelect" @command="treeSelect">
            <span class="formula__treeSelect--name">
              {{ getTreeName }}<i class="iconfont icon-shujiantouzhankai"></i>
            </span>
            <el-dropdown-menu slot="dropdown" class="formula__treeSelect--list">
              <el-dropdown-item :command="1">组件树</el-dropdown-item>
              <el-dropdown-item :command="2">组织树</el-dropdown-item>
              <el-dropdown-item :command="3">角色树</el-dropdown-item>
              <el-dropdown-item :command="4">职位树</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <div class="formula__params--compTree" v-show="treeType === 1">
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
        <div
          class="formula__params--compTree"
          v-show="treeType === 2 || treeType === 3 || treeType === 4"
        >
          <el-tree
            v-if="showSysTree"
            :data="sysTreeData"
            node-key="id"
            :lazy="true"
            class="formula__tree"
            :props="props"
            @node-click="sysNodeClick"
            :filter-node-method="sysFilterNode"
            :load="loadNode"
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ data, node }"
              :key="data.compId || data.name"
              class="formula__treeItem"
            >
              <i
                v-if="node.level === 1 && treeType === 3"
                class="icon-fenzuchangtai iconfont"
                style="color: #fab71c"
              ></i>
              <i
                v-else
                :class="`iconfont ${getCurIcon}`"
                :style="getCurColor"
              ></i>
              {{ data.name || data.roleName }}
            </div>
          </el-tree>
          <div v-else>
            <el-tree
              v-for="(data, index) in treeList"
              :key="index"
              :data="[data]"
              node-key="id"
              :lazy="true"
              class="formula__tree"
              :props="props"
              @node-click="sysNodeClick"
              :filter-node-method="sysFilterNode"
              :load="loadNode"
              :expand-on-click-node="false"
            >
              <div
                slot-scope="{ data }"
                :key="data.compId || data.name"
                class="formula__treeItem"
              >
                <i :class="`iconfont ${getCurIcon}`"></i>
                {{ data.name || data.roleName }}
              </div>
            </el-tree>
          </div>
        </div>
      </div>
      <div class="formula__params--excle">
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
            v-if="showFormulaTree"
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
  </apiot-dialog>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/theme/idea.css';
import 'codemirror/lib/codemirror.css';
import { getChartsByEx } from '@/utils/utils';
import parser from '@/utils/formula';
import { doFetchOrgTree, doFetchGroup, getRoleLiistById, getPostionTree } from '@/api/role';

export default {
  props: {
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    formulaStr: {
      type: String
      // [getVariable]($M2kf9X$)
    },
    showType: {
      type: Array,
      default: () => [1]
    }
  },
  data() {
    return {
      showLoading: false, // 是否展示loading
      compName: '', // 组件树搜索名
      showCompTree: false, // 是否展示组件树搜索
      showTree: false, // 是否展示组件树
      formulaNameKey: '', // 公式树搜索名
      showFormula: false, // 是否展示公式树搜索
      showFormulaTree: false, // 是否展示公式树
      formulaData: [
        // type 1 表示哪里都有 2表示只在触发器影响控件里面有 3 表示是执行函数 4 代表 app
        {
          name: '常用公式',
          children: [
            { name: 'GET_SELDATA', isFormula: true, type: 2 },
            { name: 'GET_USER_ID', isFormula: true, type: 1 },
            { name: 'GET_ORG_ID', isFormula: true, type: 1 },
            { name: 'GET_ROLES_ID', isFormula: true, type: 1 },
            { name: 'GET_MENU_ID', isFormula: true, type: 1 },
            { name: 'GET_TABLE_IDS', isFormula: true, type: 1 },
            { name: 'BULK_ADD', isFormula: true, type: 3 },
            { name: 'BULK_ONE_ADD', isFormula: true, type: 3 },
            { name: 'CREATE_UNIQUE', isFormula: true, type: 3 },
            { name: 'GET_SCAN_VALUE', isFormula: true, type: 4 },
            { name: 'GET_SHOW_VALUE', isFormula: true, type: 1 },
            { name: 'GET_TABLE_VALUE', isFormula: true, type: 1 }
          ]
        },
        {
          name: '日期函数',
          children: [
            { name: 'GET_DATE', isFormula: true, type: 1 },
            { name: 'GET_DATETIME', isFormula: true, type: 1 },
            { name: 'GET_YEAR', isFormula: true, type: 1 },
            { name: 'GET_MONTH', isFormula: true, type: 1 },
            { name: 'GET_WEEK', isFormula: true, type: 1 },
            { name: 'GET_DAY', isFormula: true, type: 1 },
            { name: 'GET_TIMESTAMP', isFormula: true, type: 1 }
          ]
        },
        {
          name: '自定义页面函数',
          children: [
            { name: 'GET_FIELD_VALUE', isFormula: true, type: 5 },
          ]
        },
        {
          name: '流程引擎函数',
          children: [
            { name: 'GET_FLOW_DATA_ID', isFormula: true, type: 6 },
          ]
        },
        {
          name: '服务器函数',
          children: [
            // { name: 'GET_IP', isFormula: true },
            // { name: 'GET_TIME', isFormula: true },
          ]
        }
      ],
      jsonEditor: null,
      formulaValue: '',
      cursor: null,
      treeType: 1, // 树类型 1代表组件树
      sysTreeData: [], // 树数据
      treeList: [], // 搜索结果
      showSysTree: true,
      props: {
        isLeaf: 'isLeaf'
      }
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
    getTreeName() {
      if (this.treeType === 1) {
        return '组件树';
      }
      if (this.treeType === 2) {
        return '组织树';
      }
      if (this.treeType === 3) {
        return '角色树';
      }
      if (this.treeType === 4) {
        return '职位树';
      }
      return '组件树';
    },
    getCurIcon() {
      if (this.treeType === 2) {
        return 'icon-zuzhi';
      }
      if (this.treeType === 3) {
        return 'icon-jiaose';
      }
      if (this.treeType === 4) {
        return 'icon-zhiwei';
      }
      return 'icon-zuzhi';
    },
    getCurColor() {
      if (this.treeType === 2) {
        return 'color: #4789f5';
      }
      if (this.treeType === 3) {
        return 'color: #EE5E5E';
      }
      if (this.treeType === 4) {
        return 'color: #FC8256';
      }
      return 'color: #4789f5';
    }
  },

  mounted() {
    this.getTree();
    this.getFormulaTree();
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
        lineWrapping: true,
        hintOptions: { hint: this.handleShowHint, completeSingle: false }
      });
      this.jsonEditor.setSize('auto', '80px');
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
        console.log(params, 'GET_FIELD_VALUE');
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
      parser.setFunction('GET_FLOW_DATA_ID', (params) => {
        console.log(params);
        if (params.length !== 0) {
          return new Error('获取流程数据id公式无参数');
        }
        return '';
      });
    },
    // 初始化组件替换
    repalceCompMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(strArry[line], '\\$([A-Za-z0-9]{6})\\$');
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const compId = marTextArry[col].result[1];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(this.triggerCompMap[compId].compName, false, 1),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true
            }
          );
        }
      }
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
    // 处理返回字符串
    resolveRes() {
      const reg = /(=)\1*/g;
      const matchRes = this.jsonEditor.getValue().match(reg);
      console.log(matchRes);
      if (matchRes) {
        const index = matchRes.findIndex((r) => {
          if (r.length > 3) {
            return true;
          }
          return false;
        });
        // console.log(index);
        if (index !== -1) {
          this.$message({
            type: 'error',
            message: '一般性错误，请检查函数参数个数，格式等'
          });
          return false;
        }
      }

      const formulaStr = this.jsonEditor
        .getValue()
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      // console.log(formulaStr);
      const sysReg =
        /(\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$,)+(\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$)$/;
      // console.log(sysReg.test(formulaStr));
      if (sysReg.test(formulaStr)) {
        return true;
      }
      let str = formulaStr.replace(/\$([A-Za-z0-9]{6})\$/g, () => '""');
      console.log(str);
      str = str.replace(/\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g, () => `'${RegExp.$1}'`);
      let res = parser.parse(`${str}`);
      // console.log(res);
      if (res.error === '#VALUE!') {
        str = formulaStr.replace(/\$([A-Za-z0-9]{6})\$/g, () => '0');
        console.log(str);
        str = str.replace(/\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g, () => `'${RegExp.$1}'`);
        res = parser.parse(str);
      }
      // console.log(str);
      // console.log(res);
      if (!res.error) {
        return true;
      }
      if (res.error === '#ERROR!') {
        this.$message({
          type: 'error',
          message: '一般性错误，请检查函数参数个数，格式等'
        });
        return false;
      }
      if (res.error === '#NAME?') {
        this.$message({
          type: 'error',
          message: '无法识别的函数名,变量名或参数个数不对'
        });
        return false;
      }
      if (res.error === '#N/A') {
        this.$message({
          type: 'error',
          message: '表示某个值对公式不可用'
        });
        return false;
      }
      if (res.error === '#DIV/0!') {
        this.$message({
          type: 'error',
          message: '除以零误差'
        });
        return false;
      }
      if (res.error === '#NUM!') {
        this.$message({
          type: 'error',
          message: '当公式遇到无效数字时发生'
        });
        return false;
      }
      if (res.error === '#VALUE!') {
        this.$message({
          type: 'error',
          message: '当公式参数之一的类型错误时发生'
        });
        return false;
      }
      this.$message({
        type: 'error',
        message: '该公式存在问题'
      });
      return false;
    },
    // 公式确认按钮
    sureClick() {
      this.showLoading = false;
      const res = this.resolveRes();
      // console.log(res);
      if (res) {
        this.$emit('update:formulaStr', this.jsonEditor.getValue());
        this.$emit('update:visible', false);
      }
    },
    // 获取组件树
    async getTree() {
      if (this.treeType === 1) {
        this.showTree = false;
        this.$nextTick(() => {
          this.showTree = true;
          setTimeout(() => {
            this.$refs.configTree.filter(this.compName);
          }, 0);
        });
      } else if (this.treeType === 2 || this.treeType === 4) {
        if (this.compName) {
          this.showSysTree = false;
          const data =
            this.treeType === 2
              ? await doFetchOrgTree({
                keywords: this.compName
              })
              : await getPostionTree({
                keywords: this.compName
              });
          data.forEach((item) => {
            if (!item.childrenTotal) {
              item.isLeaf = true;
            } else {
              item.isLeaf = false;
            }
          });
          this.treeList = data;
        } else {
          this.showSysTree = true;
        }
      } else if (this.treeType === 3) {
        if (this.compName) {
          this.showSysTree = false;
          const data = await getRoleLiistById({
            roleName: this.compName
          });
          this.treeList = data;
        } else {
          this.showSysTree = true;
        }
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
    // 系统树的的点击
    sysNodeClick(data, node) {
      if (this.treeType === 3 && node.level === 1) {
        return;
      }
      const name = data.name || data.roleName;
      const key = `$${this.treeType}-${data.id}-${name}$`;
      this.setMarkText(key, name, false);
    },
    // 系统树的排除
    sysFilterNode() {},
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
    formulaNodeClick(data) {
      if (!data.isFormula) {
        return;
      }
      const key = `[${data.name}]`;
      this.setMarkText(key, data.name);
    },
    setMarkText(key, name, isFormula = true) {
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
    handleShowHint() {
      const codeMirrorInstance = CodeMirror;
      const cur = this.jsonEditor.getCursor();
      const end = cur.ch;
      const start = end;
      let list = [];
      const resStr = this.getCurStr();
      // // console.log(resStr);
      // 根据不同情况给list赋值，默认为[]，即不显示提示框。
      if (resStr) {
        list = this.getFormulaData.filter((formula) => formula.indexOf(resStr) === 0);
      }
      return {
        list,
        from: codeMirrorInstance.Pos(cur.line, start),
        to: codeMirrorInstance.Pos(cur.line, end)
      };
    },
    handleCodeChange(cm, changeObj) {
      this.jsonEditor.closeHint();
      this.jsonEditor.showHint();
      // // console.log(cm.getValue(), changeObj);
      // 方法提示选择的结果
      if (changeObj.origin === 'complete') {
        const formula = changeObj.text[0];
        const cur = this.jsonEditor.getCursor();
        const resStr = this.getCurStr();
        this.jsonEditor.replaceRange(
          '',
          { line: cur.line, ch: cur.ch - resStr.length },
          { line: cur.line, ch: cur.ch }
        );
        this.cursor = { line: cur.line, ch: cur.ch - resStr.length };
        this.formulaNodeClick({ name: formula, isFormula: true });
      }
      // 手动输入方法
      if (changeObj.origin === '+insert' && changeObj.text[0] === '()') {
        const cur = this.jsonEditor.getCursor();
        const formula = this.getCurStr(true);
        // console.log(formula);
        if (!formula) {
          return;
        }
        const resStr = `${formula}()`;
        this.jsonEditor.replaceRange(
          '',
          { line: cur.line, ch: cur.ch - resStr.length + 1 },
          { line: cur.line, ch: cur.ch + 1 }
        );
        this.cursor = { line: cur.line, ch: cur.ch - resStr.length + 1 };
        this.formulaNodeClick({ name: formula, isFormula: true });
      }
    },
    // 创建标记节点
    createMartDom(markText, flag, type) {
      console.log(type);
      const htmlNode = document.createElement('span');
      if (flag) {
        htmlNode.className = 'jsonEditor__formula';
      } else if (+type === 1) {
        htmlNode.className = 'jsonEditor__variable';
        htmlNode.title = '组件';
      } else if (+type === 2) {
        htmlNode.className = 'jsonEditor__zuzhi';
        htmlNode.title = '组织';
      } else if (+type === 3) {
        htmlNode.className = 'jsonEditor__juese';
        htmlNode.title = '角色';
      } else if (+type === 4) {
        htmlNode.className = 'jsonEditor__zhiwei';
        htmlNode.title = '职位';
      }
      const htmlText = `${markText}`;
      htmlNode.innerHTML = htmlText;
      return htmlNode;
    },

    // 选择树
    treeSelect(v) {
      // console.log(v);
      this.treeType = v;
      this.sysTreeData = [];
      if (v === 2) {
        this.doFetchOrgTree();
      } else if (v === 3) {
        this.doFetchGroup();
      } else if (v === 4) {
        this.getPostionTree();
      }
    },
    // 系统树子节点加载
    async loadNode(node, resolve) {
      if (node.level === 0) {
        resolve(this.sysTreeData);
        return;
      }
      let data = [];
      if (this.treeType === 2) {
        data = await doFetchOrgTree({
          parentId: node.data.id
        });
      } else if (this.treeType === 3) {
        data = await getRoleLiistById({
          groupId: node.data.id
        });
      } else if (this.treeType === 4) {
        data = await getPostionTree({
          parentId: node.data.id
        });
      }
      data.forEach((item) => {
        if (!item.childrenTotal) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
      });
      console.log(data);
      resolve(data);
    },
    // 获取组织
    async doFetchOrgTree() {
      const data = await doFetchOrgTree({
        parentId: 0
      });
      data.forEach((item) => {
        if (!item.childrenTotal) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
      });
      this.sysTreeData = data;
    },
    // 获取角色分组
    async doFetchGroup() {
      const data = await doFetchGroup({
        parentId: 0
      });
      data.forEach((item) => {
        if (!item.roleTotal) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
      });
      this.sysTreeData = data;
    },
    // 获取职位树
    async getPostionTree() {
      const data = await getPostionTree({
        parentId: 0
      });
      data.forEach((item) => {
        if (!item.childrenTotal) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
      });
      this.sysTreeData = data;
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-dialog {
    width: 960px;
    max-height: 640px;
    position: absolute;
    top: 100px;
    bottom: 100px;
  }
  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    height: calc(100% - 54px - 54px);
  }
}
.formula {
  line-height: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  &__box {
    height: 110px;
    margin-bottom: 10px;
    border: 1px solid #e9e9e9;
    &--header {
      background: #fafafa;
      border-bottom: 1px solid #e9e9e9;
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    &--main {
      overflow: hidden;
      border-bottom: 1px solid #e9e9e9;
    }
  }
  &__params {
    flex: 1;
    display: flex;
    overflow: hidden;
    &--comp {
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
  &__treeSelect {
    &--name {
      display: inline-block;
      width: 94px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      background: #f6f6f8;
      border-radius: 3px;
      .iconfont {
        color: #bbc3cd;
      }
      &:hover {
        background-color: $--hover-color;
        color: $--color-primary;
        .iconfont {
          color: $--color-primary;
        }
      }
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
    .jsonEditor__zuzhi {
      margin: 0 2px;
      vertical-align: 2px;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 13px;
      background: #e7f8f7;
      color: #26c4bb;
    }
    .jsonEditor__juese {
      margin: 0 2px;
      vertical-align: 2px;
      padding: 2px 10px;

      border-radius: 4px;

      font-size: 13px;
      background: #ffeaeb;
      color: #e73c3c;
    }
    .jsonEditor__zhiwei {
      margin: 0 2px;
      vertical-align: 2px;
      padding: 2px 10px;
      border-radius: 4px;
      background: #fff2d4;
      color: #fa9d0b;
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
