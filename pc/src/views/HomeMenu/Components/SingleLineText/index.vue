/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/

<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles()">
    <div
      class="singleTextContent"
      :style="getTextStyles()"
      :class="{ ellipsis: config.enableEllipsis }"
      @click="hrefUrl"
      :title="content"
    >
      <span>{{ content }}</span>
    </div>
    <component
      :is="panelConfig.activeObj.dialogName || 'PanelDialog'"
      :showPanel="visible"
      :visible.sync="visible"
      :panelObj="panelObj"
      v-if="JSON.stringify(panelConfig) !== '{}'"
    ></component>
  </div>
</template>

<script>
import { isEqual } from 'lodash';
// import parser from '@/utils/formula';
import { getInfoById } from '@/api/design';
import { formatDate } from '@/utils/utils';

let FIXED_OBJ = {}; // 保存
const FormulaParser = require('hot-formula-parser').Parser;

const parser = new FormulaParser();

export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    elementData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      visible: false,
      obj1: {},
      content: '',
      obj: {}, // 文本对象
      timer: null,
      panelConfig: {} // 面板属性
    };
  },

  components: {},

  computed: {
    panelObj() {
      const { activeObj, curPaneObj } = this.panelConfig;
      return {
        ...curPaneObj,
        ...activeObj,
        panelVarObj: {},
        panelName: activeObj.dialogTitle
      };
    },
    getTextStyles() {
      return function () {
        // eslint-disable-next-line max-len
        const {
          stylesObj = {},
          gradientType,
          width,
          height,
          interactionType,
          enableEllipsis,
          enableBackground
        } = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          borderColor,
          borderStyle,
          ...rest
        } = stylesObj;
        let styles = `width: ${width}px;height: ${height}px;`;
        styles += enableEllipsis
          ? `line-height:${this.config.height}px;`
          : `line-height:${stylesObj.fontSize + 10}px;`;
        Object.keys(rest).forEach((item) => {
          let singStyle = `${item}:${stylesObj[item]}`;
          if (item === 'fontSize' || item === 'letterSpacing') {
            singStyle += 'px';
          }
          styles += `${singStyle}${singStyle ? ';' : ''}`;
        });
        if (gradientType === 1 && color1 && color2) {
          // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`;
        } else if (gradientType === 2 && color1 && color2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`;
        } else if (color1 || color2) {
          styles += `color: ${color1 || color2};`;
        } else {
          styles += 'color: rgba(255, 255, 255, 0);';
        }
        if (enableBackground) {
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};`;
        }
        if (interactionType && interactionType !== 1) {
          styles += 'cursor: pointer;';
        }
        return styles;
      };
    },
    getContentStyles() {
      return function () {
        const { stylesObj = {}, enableBackground, width, height, top, left } = this.config;
        let styles = `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex}; `;
        const { backgroundColor, borderRadius, borderColor, borderWidth, borderStyle } = stylesObj;
        if (enableBackground) {
          styles += ` backgroundColor:${backgroundColor}; borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
        }
        return styles;
      };
    }
  },
  mounted() {
    this.init();
    this.initFunc();
  },
  watch: {
    // otherParams: {
    //   deep: true,
    //   immediate: false,
    //   handler(v, o) {
    //     const params = this.getParameters();
    //     const { isShow } = this.config;
    //     if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
    //       this.init();
    //     } else if (
    //       JSON.stringify(v) === '{}'
    //         &&
    //         JSON.stringify(o) !== '{}'
    //         &&
    //         params.varJson === '[]' && isShow
    //     ) {
    //       this.init();
    //     }
    //   }
    // },
    elementData: {
      deep: true,
      immediate: false,
      handler(v, o) {
        const { id, dataType } = this.config;
        if (!isEqual(v, o) && dataType === 3) {
          this.reduceDataFilter(v[id]);
        }
      }
    }
  },
  methods: {
    getParameters() {
      const { id, componentId } = this.config;
      const reduce = (
        obj // 将Object 处理成 Array
      ) =>
        Object.keys(obj).map((item) => ({
          name: item,
          value: obj[item]
        }));

      const { query } = this.$route;
      const satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        });
      }
      const currentParams = {
        ...satisfyParams,
        ...query
      };
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },

    async init() {
      const { dataType, dataConfig } = this.config;
      const { takeEffect, staticValue } = dataConfig;
      if (dataType === 1) {
        let obj = {};
        try {
          obj = JSON.parse(staticValue);
        } catch (e) {
          obj = {};
        }
        this.content = obj[takeEffect];
        this.obj = obj;
        this.obj1 = { ...obj };
      }
      if (dataType === 2) {
        await this.getApi();
      }
      // if (dataType === 3) {
      //   await this.getSQL();
      // }
    },
    async getApi() {
      const { apiDataConfig } = this.config;
      const params = this.getParameters();
      const res = (await getInfoById(params)) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiEffect,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          // eslint-disable-next-line no-unused-expressions
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.getApi();
          }, time);
        }
        if (!apiEffect && !enableApiFilter) {
          this.content = targetObj;
          this.obj = targetObj;
          return;
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          let obj1 = {};
          try {
            obj1 = JSON.parse(targetObj);
          } catch (e) {
            obj1 = {};
          }
          const result = fun()(obj1);
          this.obj = result;
          this.content = result[apiEffect];
          return;
        }
        this.content = JSON.parse(targetObj)[apiEffect];
      }
    },
    async reduceDataFilter(res) {
      const { SqlDataConfig } = this.config;
      const { SQLFilterFun, enableSQLFilter, SQLEffect, SQLDataFilterId } = SqlDataConfig;
      if (!SQLEffect && !enableSQLFilter) {
        this.content = JSON.stringify(res);
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.obj = result;
        this.content = result[SQLEffect];
        return;
      }
      this.content = JSON.stringify(res[SQLEffect]);
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const { enableSQLAutoUpdate, SQLUpdateTime = 1 } = SqlDataConfig;
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.getSQL();
        }, time);
      }
      await this.reduceDataFilter(res);
    },
    doSkipMenu(skipMenuConfig) {
      // 跳菜单
      const menuConfig = skipMenuConfig.find((item) => {
        if (!item.jumpTerm) {
          // 如果没有条件，默认跳
          return true;
        }
        const isFlag = this.formulaConversion(item.jumpTerm);
        return isFlag;
      });
      const commonReduce = (config) => {
        config.menuVarObj = {};
        config.menuFilter.forEach((item, index) => {
          // 将公式值处理成固定值
          const { filterTermStr, filterTermSql, filterTermType } = item;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            config.menuFilter[index].filterTermStr = JSON.stringify(newFilterTermStr);
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const str = this.reduceSqlFilter(filterTermSql);
            config.menuFilter[index].filterTermSql = str;
          }
        });
        return config;
      };
      const { name, query = {} } = this.$route;
      if (name === 'appCustomPage' && menuConfig) {
        const { CSMUuid, CSMIsWebview } = query;
        const newMenuConfig = commonReduce(menuConfig);
        newMenuConfig.operationType = 'menu';
        newMenuConfig.CSMUuid = CSMUuid;
        if (CSMIsWebview === '1') {
          // eslint-disable-next-line no-undef
          uni.postMessage({ data: newMenuConfig });
        }
        if (CSMIsWebview === '2') {
          window.parent.postMessage(newMenuConfig, '*');
        }
        if (CSMIsWebview === '3') {
          // eslint-disable-next-line no-undef
          dd.postMessage({ data: newMenuConfig });
        }
        if (CSMIsWebview === '4') {
          // eslint-disable-next-line no-undef
          uni.navigateTo({ url: `/PagesWX/cusetomPage?CSMUuid=${CSMUuid}` });
          // eslint-disable-next-line no-undef
          uni.postMessage({ data: newMenuConfig });
        }
        return;
      }
      if (menuConfig) {
        // 获取目标菜单
        const menu = this.$store.getters.getCurMenu(menuConfig.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          const newMenuConfig = commonReduce(menuConfig);
          const menuObj = {};
          menuObj[menuConfig.id] = newMenuConfig;
          const { jumpMenuObj = '{}' } = sessionStorage;
          const newJumpMenuObj = JSON.parse(jumpMenuObj);
          newJumpMenuObj[menuConfig.id] = newMenuConfig;
          sessionStorage.jumpMenuObj = JSON.stringify(newJumpMenuObj);
          this.$bus.$emit('changeMenuTab', curMenu);
          this.$nextTick(() => {
            this.$bus.$emit('refresh');
          });
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限'
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单'
        });
      }
    },
    reduceNormalFilter(filterTermStr) {
      // 处理普通的过滤条件
      const newFilterTermStr = filterTermStr ? JSON.parse(filterTermStr) : {};
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            const result = this.formulaConversion(content);
            term.valueType = 1;
            term.content = result;
          }
        });
      });
      if (JSON.stringify(newFilterTermStr) === '{}') {
        return '';
      }
      return newFilterTermStr;
    },
    reduceSqlFilter(filterTermSql) {
      // 处理sql过滤条件
      let str = this.regProcess(filterTermSql);
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    },
    doSpringPanel(panelConfig) {
      const { curPaneObj, activeObj: { dialogTitle } } = panelConfig;
      console.log(panelConfig, 'panelConfig');
      if (curPaneObj && curPaneObj.id) {
        curPaneObj.panelFilter.forEach((item, index) => {
          // 将公式值处理成固定值
          const { filterTermStr, filterTermSql, filterTermType } = item;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr
              ? JSON.stringify(newFilterTermStr)
              : '';
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const str = this.reduceSqlFilter(filterTermSql);
            curPaneObj.panelFilter[index].filterTermSql = str;
          }
        });
        const { panelData } = curPaneObj;
        const panelFixData = {};
        if (panelData && panelData.length) {
          panelData.forEach((item) => {
            const {
              field,
              paneComp: { compId }
            } = item;
            panelFixData[compId] = FIXED_OBJ[field] || field;
          });
        }
        curPaneObj.panelFixData = panelFixData;
        const { name, query = {} } = this.$route;
        if (name === 'appCustomPage') {
          const { CSMUuid, CSMIsWebview } = query;
          curPaneObj.operationType = 'pane';
          curPaneObj.CSMUuid = CSMUuid;
          curPaneObj.dialogTitle = dialogTitle || '';
          if (CSMIsWebview === '1') {
            // eslint-disable-next-line no-undef
            uni.postMessage({ data: curPaneObj });
          }
          if (CSMIsWebview === '2') {
            window.parent.postMessage(curPaneObj, '*');
          }
          if (CSMIsWebview === '3') {
            // eslint-disable-next-line no-undef
            dd.postMessage({ data: curPaneObj });
          }
          if (CSMIsWebview === '4') {
            // eslint-disable-next-line no-undef
            // alert(jWeixin.miniProgram);
            // eslint-disable-next-line no-undef
            uni.navigateTo({ url: `/PagesWX/cusetomPage?CSMUuid=${CSMUuid}` });
            // eslint-disable-next-line no-undef
            // jWeixin.miniProgram.navigateTo({ url: `/PagesWX/cusetomPage?CSMUuid=${CSMUuid}` });
            // eslint-disable-next-line no-undef
            // jWeixin.miniProgram.navigateTo({ url: `/PagesWX/cusetomPage?CSMUuid=${CSMUuid}` });
            // eslint-disable-next-line no-undef
            uni.postMessage({ data: newMenuConfig });
          }
          return;
        }
        this.panelConfig = panelConfig;
        this.$nextTick(() => {
          this.visible = true;
        });
      }
    },
    regProcess(str = '') {
      // 将公式中的特殊字符去除
      if (!str) return '';
      let formulaRes = str
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
      const newStr = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );
      return newStr;
    },
    // 处理公式
    formulaConversion(formulaStr) {
      let str = this.regProcess(formulaStr);
      let res = parser.parse(`${str}`);
      if (res.error) {
        str = str.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // console.log(res);
      // 最终错误把字符串返回
      if (res.error) {
        return false;
      }
      return res.result;
    },
    // 初始化自定的方法
    initFunc() {
      parser.setFunction('GET_VAR', (params) => {
        if (params.length === 0) {
          return '';
        }
        return params[0];
      });
      parser.setFunction('GET_USER_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户公式无参数');
        }
        return this.$store.state.userCenter.userInfo.id;
      });
      parser.setFunction('GET_ORG_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.orgId;
      });
      parser.setFunction('GET_ROLES_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取用户组织公式无参数');
        }
        return this.$store.state.userCenter.userInfo.roleIds;
      });
      parser.setFunction('GET_DATE', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return formatDate(new Date(), 'yyyy-MM-dd');
      });
      parser.setFunction('GET_DATETIME', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      });
      parser.setFunction('GET_YEAR', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getFullYear();
      });
      parser.setFunction('GET_MONTH', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getMonth();
      });
      parser.setFunction('GET_WEEK', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDay();
      });
      parser.setFunction('GET_DAY', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getDate();
      });
      parser.setFunction('GET_TIMESTAMP', (params) => {
        if (params.length !== 0) {
          return new Error('获取时间公式无参数');
        }
        return new Date().getTime();
      });
      parser.setFunction('GET_MENU_ID', (params) => {
        if (params.length !== 0) {
          return new Error('获取菜单id公式无参数');
        }
        return this.$route.query.id;
      });
      parser.setFunction('GET_FIELD_VALUE', (params) => {
        if (!params.length) {
          return new Error('获取控件字段值公式无参数');
        }
        const field = params[0];
        return FIXED_OBJ[field];
      });
    },
    hrefUrl() {
      // 点击操作
      const { interactionType, panelConfig, skipMenuConfig } = this.config;
      FIXED_OBJ = this.obj;
      // 1不需处理
      if (interactionType === 1) return;
      // 跳菜单
      if (interactionType === 3 && skipMenuConfig.length) {
        this.doSkipMenu(skipMenuConfig);
        return;
      }
      // 弹面板
      if (interactionType === 2) {
        this.doSpringPanel(panelConfig);
      }
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    -webkit-background-clip: text;
    color: transparent;
    cursor: default;
  }
}
</style>
