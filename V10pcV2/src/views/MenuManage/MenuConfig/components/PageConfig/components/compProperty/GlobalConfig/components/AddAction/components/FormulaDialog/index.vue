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
      <div class="formula__params--comp" v-if="!isVariables && !isSql">
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
            @close="closeSearch"
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
              v-for="data in treeList"
              :key="data.id"
              :data1="JSON.stringify(data)"
              :data="[data]"
              node-key="id"
              :lazy="true"
              class="formula__tree"
              :props="props"
              @node-click="sysNodeClick"
              :load="loadNodeList"
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
          </div>
        </div>
      </div>
      <div class="formula__params--var" v-if="isVariables && !isSql">
        <div class="formula__params--compHead">变量</div>
        <div class="formula__params--formuTree formula__params--compTree">
          <el-tree
            v-if="showFormulaTree"
            ref="variablesTree"
            :data="variables"
            node-key="id"
            class="formula__tree"
            default-expand-all
            @node-click="variableNodeClick"
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ data }"
              :key="data.variableCode"
              class="formula__treeItem"
            >
              {{ data.variableName }}
            </div>
          </el-tree>
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
      <div class="formula__params--des" v-html="des"></div>
    </div>
  </apiot-dialog>
</template>

<script>
import CodeMirror from 'codemirror';
import {
  doFetchGroup,
  doFetchOrgTree,
  getPostionTree,
  getRoleLiistById,
} from '@/api/role';
import parser from '@/utils/formula';
import { getChartsByEx } from '@/utils/utils';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';

export default {
  props: {
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
    formulaStr: {
      type: String,
      // [getVariable]($M2kf9X$)
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
            {
              name: 'GET_TOKEN',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              des: '',
            },
            {
              name: 'GET_SELDATA',
              isFormula: true,
              type: 2,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_SELDATA</span>函数获取数据选择框带出值公式<br/>参数：2个<br/>示例：<span class="red">GET_SELDATA</span>(组件,"orgId"),返回选中组件带出的orgId<br/>参数：5个<br/>示例：<span class="red">GET_SELDATA</span>(组件,"orgId", "sys_org", "name", "id"),得到选中组件带出的orgId,然后根据orgId当作sys_org表的id去查出他的name，最终返回name的值',
            },
            {
              name: 'GET_USER_ID',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_USER_ID</span>函数获取当前用户id<br/>参数：无<br/>示例：<span class="red">GET_USER_ID</span>(),返回当前用户的id',
            },
            {
              name: 'GET_ORG_ID',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_ORG_ID</span>函数获取当前用户组织id<br/>参数：无<br/>示例：<span class="red">GET_ORG_ID</span>(),返回当前用户的组织id',
            },
            {
              name: 'GET_ROLES_ID',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_ROLES_ID</span>函数获取当前用户的所属角色<br/>参数：无<br/>示例：<span class="red">GET_ROLES_ID</span>(),返回当前用户的所属角色',
            },
            {
              name: 'GET_MENU_ID',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: false,
              des: '<span class="red">GET_MENU_ID</span>函数获取当前菜单id<br/>参数：无<br/>示例：<span class="red">GET_MENU_ID</span>(),返回当前菜单的菜单id',
            },
            {
              name: 'GET_TABLE_IDS',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: false,
              des: '<span class="red">GET_TABLE_IDS</span>函数获取当前最后操作表格选中数据的的ids<br/>参数：无<br/>示例：<span class="red">GET_TABLE_IDS</span>(),返回最后操作表格选中数据的的ids',
            },
            {
              name: 'BULK_ADD',
              isFormula: true,
              type: 3,
              onlyIsWeb: true,
              des: '<span class="red">BULK_ADD</span>函数批量新增多对多<br/>参数不定，参数都为组件，逗号相隔</br>示例：<span class="red">BULK_ADD</span>(组件1,组件2),如果组件1的值是1,2;组件2的值是3,4<br/>返回1,3;1,4;2,3;2,4;4条数据',
            },
            {
              name: 'BULK_ONE_ADD',
              isFormula: true,
              type: 3,
              onlyIsWeb: true,
              des: '<span class="red">BULK_ONE_ADD</span>函数批量新增一一对应<br/>参数不定，参数都为组件，逗号相隔</br>示例：<span class="red">BULK_ONE_ADD</span>(组件1,组件2),如果组件1的值是1,2;组件2的值是3,4<br/>返回1,3;2,4;2条数据',
            },
            {
              name: 'CREATE_UNIQUE',
              isFormula: true,
              type: 3,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">CREATE_UNIQUE</span>函数创建唯一值<br/>参数：无<br/>示例：<span class="red">CREATE_UNIQUE</span>(),返回一个随机的唯一值<br/>参数：1个<br/>示例：<span class="red">CREATE_UNIQUE</span>(1),返回结果为1',
            },
            {
              name: 'GET_SCAN_VALUE',
              isFormula: true,
              type: 4,
              onlyIsWeb: false,
              des: '<span class="red">GET_SCAN_VALUE</span>函数获取当前app扫描的值<br/>参数：无<br/>示例：<span class="red">GET_SCAN_VALUE</span>(),返回app扫描的值',
            },
            {
              name: 'GET_SHOW_VALUE',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_SHOW_VALUE</span>函数获取数据单选框，数据多选框，label等组件显示值函数<br/>参数：1个<br/>示例：<span class="red">GET_SHOW_VALUE</span>(组件)，返回当前选中组件的显示值',
            },
            {
              name: 'GET_VALUE_COUNT',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_VALUE_COUNT</span>函数根据逗号获取值得个数<br/>参数：1个<br/>示例：<span class="red">GET_VALUE_COUNT</span>(组件)，返回当前选中组件根据逗号切割出值的个数',
            },
            {
              name: 'GET_TABLE_VALUE',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_TABLE_VALUE</span>函数获取组件所属表格的选中数据的该组件值得集合，逗号隔开<br/>参数：1个<br/>示例：span class="red">GET_TABLE_VALUE</span>(组件)，返回该组件所属表格选中数据的该组件值得集合',
            },
            {
              name: 'GET_TABLE_IS_NULL',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_TABLE_IS_NULL</span>函数判断组件所属表格是否没有选中数据<br/>参数：无<br/>示例：<span class="red">GET_TABLE_IS_NULL</span>(),该组件所属表格有选中值返回false，不然，返回true',
            },
            {
              name: 'GET_TABLE_IS_NO_DATA',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_TABLE_IS_NO_DATA</span>函数判断组件所属表格有无数据<br/>参数：无<br/>示例：<span class="red">GET_TABLE_IS_NO_DATA</span>(),该组件所属表格有选中值返回false，不然，返回true',
            },
            {
              name: 'GET_TIME_GAP',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: "<span class='red'>GET_TIME_GAP</span>函数获取两个时间间隔<br/>参数：2个<br/>示例：<span class='red'>GET_TIME_GAP</span>(startTime,endTime),返回结束时间到开始时间的间隔单位为天<br/>参数：3个，第三个参数为'years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'中的一个<br/>示例：<span class='red'>GET_TIME_GAP</span>(startTime,endTime,'years'),返回结束时间到开始时间的间隔单位为年",
            },
            {
              name: 'GET_TIME_RES',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_TIME_RES</span>函数获取时间结果<br/>参数：4个<br/>第一个参数代表类型 1是 相加 2是相减<br/>第二个参数代表起始时间<br/>第三个参数代表间隔时间<br/>第4个参数代表间隔时间单位 1 是天 2 是周 3 是月 4 是年 默认不传即为1<br/>示例：<span class="red">GET_TIME_RES</span>(1,startTime,100,1),返回startTime加上100天后的日期结果',
            },
            {
              name: 'BEFORE_IN_AFTER',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: true,
              des: '<span class="red">BEFORE_IN_AFTER</span>函数判断前面的数据是否被后面的包含<br/>参数：第一参数为组件，后面的参数为","相隔的值，拼成数组<br/>示例：<span class="red">BEFORE_IN_AFTER</span>(组件,1,2,3),返回组件值是否是1,2,3内中的值，是返回true，不是则为false',
            },
            {
              name: 'BEFORE_NOT_IN_AFTER',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: true,
              des: '<span class="red">BEFORE_NOT_IN_AFTER</span>函数判断前面的数据是否不被后面的包含<br/>参数：第一参数为组件，后面的参数为"，"相隔的值，拼成数组<br/>示例：<span class="red">BEFORE_NOT_IN_AFTER</span>(组件,1,2,3),返回组件值是否不是1,2,3内中的值，是返回false，不是则为true',
            },
            {
              name: 'GET_TEXT',
              isFormula: true,
              type: 1,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">GET_TEXT</span>函数获取到一个字符串<br/>参数：1个<br/>示例：<span class="red">GET_TEXT</span>(组件),返回组件值是字符串类型',
            },
            {
              name: 'SUB_STRING',
              isFormula: true,
              type: 2,
              onlyIsWeb: true,
              isVariables: false,
              des: '<span class="red">SUB_STRING</span>字符串拼接<br/>参数：不限<br/>示例：<span class="red">SUB_STRING</span>("你","好"),返回"你好"',
            },
          ],
        },
        {
          name: '日期函数',
          children: [
            {
              name: 'GET_DATE',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_DATE</span>函数获取当前日期<br/>参数：无<br/>示例：<span class="red">GET_DATE</span>(),返回当前日期',
            },
            {
              name: 'GET_DATETIME',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_DATETIME</span>函数获取当前日期时间<br/>参数：无<br/>示例：<span class="red">GET_DATETIME</span>(),返回当前日期时间',
            },
            {
              name: 'GET_YEAR',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_YEAR</span>函数获取当前年<br/>参数：无<br/>示例：<span class="red">GET_YEAR</span>(),返回当前年',
            },
            {
              name: 'GET_MONTH',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_MONTH</span>函数获取当前月<br/>参数：无<br/>示例：<span class="red">GET_MONTH</span>(),返回当前月',
            },
            {
              name: 'GET_WEEK',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              des: '<span class="red">GET_WEEK</span>函数获取当前星期<br/>参数：无<br/>示例：<span class="red">GET_WEEK</span>(),返回当前星期',
            },
            {
              name: 'GET_DAY',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_DAY</span>函数获取当前月的第几天<br/>参数：无<br/>示例：<span class="red">GET_DAY</span>(),返回当前月的第几天',
            },
            {
              name: 'GET_TIMESTAMP',
              isFormula: true,
              type: 1,
              onlyIsWeb: false,
              isVariables: true,
              des: '<span class="red">GET_TIMESTAMP</span>函数获取当前时间戳<br/>参数：无<br/>示例：<span class="red">GET_TIMESTAMP</span>(),返回当前时间戳',
            },
          ],
        },
        {
          name: '自定义页面函数',
          children: [
            { name: 'GET_FIELD_VALUE', isFormula: true, type: 5, des: '' },
          ],
        },
        {
          name: '流程引擎函数',
          children: [
            {
              name: 'GET_FLOW_DATA_ID',
              isFormula: true,
              type: 6,
              onlyIsWeb: false,
              des: '',
            },
          ],
        },
        {
          name: '服务器函数',
          children: [
            // { name: 'GET_IP', isFormula: true },
            // { name: 'GET_TIME', isFormula: true },
          ],
        },
      ],
      des: '这里是公式描述',
      jsonEditor: null,
      formulaValue: '',
      cursor: null,
      treeType: 1, // 树类型 1代表组件树
      sysTreeData: [], // 树数据
      treeList: [], // 搜索结果
      showSysTree: true,
      props: {
        isLeaf: 'isLeaf',
      },
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
    },
    isVariables() {
      return ['/globalSearch', '/messageTemplate'].includes(this.$route.path);
    },
  },

  mounted() {
    if (!this.isVariables) {
      this.getTree();
    }
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
          ']': () => '',
        },
        theme: 'idea',
        lineWrapping: true,
        hintOptions: { hint: this.handleShowHint, completeSingle: false },
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
        },
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
      this.repalceVariableMark();
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
      parser.setFunction('GET_VALUE_COUNT', (params) => {
        if (params.length !== 1) {
          return new Error('获取值个数，需要有且只有一个参数');
        }
        return '';
      });
      parser.setFunction('GET_TABLE_VALUE', (params) => {
        if (![1, 2].includes(params.length)) {
          return new Error('获取列表值，需要1个或2个参数');
        }
        return '';
      });
      parser.setFunction('GET_TABLE_IS_NULL', (params) => {
        if (![1].includes(params.length)) {
          return new Error('获取列表所有值，需要1个参数');
        }
        return '';
      });
      parser.setFunction('GET_TABLE_IS_NO_DATA', (params) => {
        if (![1].includes(params.length)) {
          return new Error('获取列表所有值，需要1个参数');
        }
        return '';
      });
      parser.setFunction('GET_TIME_GAP', (params) => {
        if (![1, 2, 3].includes(params.length)) {
          return new Error('获取列表值，需要1个,2个或3个参数');
        }
        return '';
      });
      // GET_TIME_RES
      parser.setFunction('GET_TIME_RES', (params) => {
        if (![4, 3].includes(params.length)) {
          return new Error('获取日期计算结果，需要3个或4个参数');
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
      parser.setFunction('GET_TOKEN', (params) => {
        if (params.length !== 0) {
          return new Error('获取菜单TOKEN公式无参数');
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
        if (params.length !== 0) {
          return new Error('获取流程数据id公式无参数');
        }
        return '';
      });
      parser.setFunction('GET_TOKEN', (params) => {
        if (params.length !== 0) {
          return new Error('获取Token公式无参数');
        }
        return '';
      });
      parser.setFunction('BEFORE_IN_AFTER', (params) => {
        if (params.length < 2) {
          return new Error('获取列表值，需要至少2个参数');
        }
        return '';
      });
      parser.setFunction('BEFORE_NOT_IN_AFTER', (params) => {
        if (params.length < 2) {
          return new Error('获取列表值，需要至少2个参数');
        }
        return '';
      });
      parser.setFunction('GET_TEXT', (params) => {
        if (params.length !== 1) {
          return new Error('获取显示值，需要有且只有一个参数');
        }
        return '';
      });
      parser.setFunction('SUB_STRING', () => '');
    },
    // 初始化组件替换
    repalceCompMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(
          strArry[line],
          '\\$([A-Za-z0-9]{6})\\$',
        );
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const compId = marTextArry[col].result[1];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(
                this.triggerCompMap[compId].compName,
                false,
                1,
              ),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true,
            },
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
          `\\[(${this.getFormulaData.join('|')})\\]`,
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
              handleMouseEvents: true,
            },
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
          '\\$(\\d+)-\\d+-([a-zA-Z0-9_\\-\\u4e00-\\u9fa5]+)\\$',
        );
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const formulaName = marTextArry[col].result[2];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(
                formulaName,
                false,
                marTextArry[col].result[1],
              ),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true,
            },
          );
        }
      }
    },
    // 初始化方法替代
    repalceVariableMark() {
      const strArry = this.jsonEditor.getValue().split('\n'); // 一共几行
      for (let line = 0, len = strArry.length; line < len; line += 1) {
        // 提取出字符串中需要转化成标记的字符以及其所在的位置
        const marTextArry = getChartsByEx(
          strArry[line],
          '\\$variable_+([a-zA-Z0-9_]+)\\$',
        );
        for (let col = 0, len1 = marTextArry.length; col < len1; col += 1) {
          const formulaName = marTextArry[col].result[1];
          // 开始标记
          this.jsonEditor.doc.markText(
            { line, ch: marTextArry[col].from }, // 开始位置
            { line, ch: marTextArry[col].to }, // 结束位置
            {
              replacedWith: this.createMartDom(formulaName, false, 5),
              inclusiveLeft: false,
              inclusiveRight: false,
              selectRight: true,
              handleMouseEvents: true,
            },
          );
        }
      }
    },
    // 处理返回字符串
    resolveRes() {
      const reg = /(=)\1*/g;
      const matchRes = this.jsonEditor.getValue().match(reg);
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
            type: 'warning',
            message: '一般性错误，请检查函数参数个数，格式等',
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
      const sysReg =
        /(\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$,)+(\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$)$/;
      // console.log(sysReg.test(formulaStr));
      if (sysReg.test(formulaStr)) {
        return true;
      }
      // if (
      //   this.jsonEditor.getValue().match(/variable_/g) &&
      //   this.jsonEditor.getValue().match(/variable_/g).length === 1
      // ) {
      //   return true;
      // }
      let str = formulaStr.replace(
        /\$variable_+([a-zA-Z0-9_]+)\$/g,
        () => '""',
      );
      str = str.replace(/\$([A-Za-z0-9]{6})\$/g, () => '""');
      str = str.replace(
        /\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        () => `'${RegExp.$1}'`,
      );
      let res = parser.parse(`${str}`);
      if (res.error === '#VALUE!') {
        str = formulaStr
          .replace(/\$([A-Za-z0-9]{6})\$/g, () => '0')
          .replace(/\//g, '*');
        console.log(str);
        str = str.replace(
          /\$\d+-\d+-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
          () => `'${RegExp.$1}'`,
        );
        res = parser.parse(str);
      }
      // console.log(str);
      console.log(this.jsonEditor.getValue());
      if (!res.error) {
        return true;
      }
      if (res.error === '#ERROR!') {
        this.$message({
          type: 'warning',
          message: '一般性错误，请检查函数参数个数，格式等',
        });
        return false;
      }
      if (res.error === '#NAME?') {
        this.$message({
          type: 'warning',
          message: '无法识别的函数名,变量名或参数个数不对',
        });
        return false;
      }
      if (res.error === '#N/A') {
        this.$message({
          type: 'warning',
          message: '表示某个值对公式不可用',
        });
        return false;
      }
      if (res.error === '#DIV/0!') {
        this.$message({
          type: 'warning',
          message: '除以零误差',
        });
        return false;
      }
      if (res.error === '#NUM!') {
        this.$message({
          type: 'warning',
          message: '当公式遇到无效数字时发生',
        });
        return false;
      }
      if (res.error === '#VALUE!') {
        this.$message({
          type: 'warning',
          message: '当公式参数之一的类型错误时发生',
        });
        return false;
      }
      this.$message({
        type: 'warning',
        message: '该公式存在问题',
      });
      return false;
    },
    // 公式确认按钮
    sureClick() {
      this.showLoading = false;
      if (this.isSql) {
        this.$emit(
          'update:formulaStr',
          this.jsonEditor
            .getValue()
            .replace(/\[and\]/gi, 'and')
            .replace(/\[or\]/gi, 'or'),
        );
        this.$emit('update:visible', false);
        return;
      }
      const res = this.resolveRes();
      // console.log(res);
      if (res) {
        this.$emit(
          'update:formulaStr',
          this.jsonEditor
            .getValue()
            .replace(/\[and\]/gi, 'and')
            .replace(/\[or\]/gi, 'or'),
        );
        this.$emit('update:visible', false);
      }
    },
    // 获取组件树
    async getTree() {
      this.treeList = [];
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
          const data =
            this.treeType === 2
              ? await doFetchOrgTree({
                  keywords: this.compName,
                })
              : await getPostionTree({
                  keywords: this.compName,
                });
          data.forEach((item) => {
            if (!item.childrenTotal) {
              item.isLeaf = true;
            } else {
              item.isLeaf = false;
            }
          });
          this.treeList = data;
          this.showSysTree = false;
        } else {
          this.showSysTree = true;
        }
      } else if (this.treeType === 3) {
        if (this.compName) {
          const data = await getRoleLiistById({
            roleName: this.compName,
          });
          this.treeList = data;
          this.showSysTree = false;
        } else {
          this.showSysTree = true;
        }
      }
      console.log(this.treeList);
    },
    // 组件搜索失焦
    compSearchBlur() {
      if (!this.compName) {
        this.showCompTree = false;
      }
    },
    closeSearch() {
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
      if (!this.showType.includes(data.type)) {
        return false;
      }
      if (!this.onlyIsWeb) {
        return !data.onlyIsWeb;
      }
      if (this.isVariables && !data.isVariables) {
        return data.isVariables;
      }
      return true;
    },
    formulaNodeClick(data) {
      if (!data.isFormula) {
        return;
      }
      if (data.des) {
        this.des = data.des;
      } else {
        this.des = '这里是公式描述';
      }
      const key = `[${data.name}]`;
      this.setMarkText(key, data.name);
    },
    variableNodeClick(data) {
      const key = `$variable_${data.variableCode}$`;
      this.treeType = 5;
      this.setMarkText(key, data.variableName, false);
    },
    setMarkText(key, name, isFormula = true) {
      // console.log(key, name);
      const { ch, line } = this.cursor;
      const cursor = {
        line,
        ch: ch + key.length,
      };
      // 插入对应实际的值
      this.jsonEditor.replaceRange(key, this.cursor);
      // 对这个实际的值进行标记
      this.jsonEditor.doc.markText(this.cursor, cursor, {
        replacedWith: this.createMartDom(name, isFormula, this.treeType),
        inclusiveLeft: false,
        inclusiveRight: false,
        selectRight: true,
        handleMouseEvents: true,
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
          [
            '(',
            '+',
            '-',
            '*',
            '/',
            ',',
            '>',
            '=',
            '==',
            '===',
            '<',
            '>=',
            '<=',
          ].includes(curLine.charAt(i))
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
        list = this.getFormulaData.filter(
          (formula) => formula.indexOf(resStr) === 0,
        );
      }
      return {
        list,
        from: codeMirrorInstance.Pos(cur.line, start),
        to: codeMirrorInstance.Pos(cur.line, end),
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
          { line: cur.line, ch: cur.ch },
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
          { line: cur.line, ch: cur.ch + 1 },
        );
        this.cursor = { line: cur.line, ch: cur.ch - resStr.length + 1 };
        this.formulaNodeClick({ name: formula, isFormula: true });
      }
    },
    // 创建标记节点
    createMartDom(markText, flag, type) {
      // console.log(type);
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
      } else if (+type === 5) {
        htmlNode.className = 'jsonEditor__bianliang';
        htmlNode.title = '变量';
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
          parentId: node.data.id,
        });
      } else if (this.treeType === 3) {
        data = await getRoleLiistById({
          groupId: node.data.id,
        });
      } else if (this.treeType === 4) {
        data = await getPostionTree({
          parentId: node.data.id,
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
    async loadNodeList(node, resolve) {
      if (node.level === 0) {
        resolve(node.data);
        return;
      }
      let data = [];
      if (this.treeType === 2) {
        data = await doFetchOrgTree({
          parentId: node.data.id,
        });
      } else if (this.treeType === 3) {
        data = await getRoleLiistById({
          groupId: node.data.id,
        });
      } else if (this.treeType === 4) {
        data = await getPostionTree({
          parentId: node.data.id,
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
        parentId: 0,
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
        parentId: 0,
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
        parentId: 0,
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
  },
};
</script>

<style lang="scss" scoped>
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
    &--excle,
    &--var {
      width: 240px;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;
      margin-left: 10px;
    }
    &--var {
      margin-left: 0;
    }
    &--des {
      flex: 1;
      margin-left: 20px;
      padding-top: 5px;
      box-sizing: border-box;
      line-height: 24px;
      ::v-deep {
        .red {
          color: #cc3534;
        }
      }
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
    .jsonEditor__bianliang {
      margin: 0 2px;
      vertical-align: 2px;
      padding: 2px 10px;
      border-radius: 4px;
      background: #fff2d4;
      color: #fc8256;
      font-size: 13px;
    }
  }
  &__tree {
    overflow: auto;
    width: 240px;
    height: 100%;
    display: flex;
    flex-direction: column;
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
