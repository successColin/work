/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div
      class="singleTextWrap"
      :id="`basicPie_${config.componentId}`"
      :style="getContentStyles"
  >
    <div class="pathWrap" v-if="config.interactionType===4">
      <CBreadcrumb
          v-show="pathArr.length>1"
          @change="changePath"
          :color="color"
          :pathArr="pathArr"/>
    </div>
    <div class="singleTextContent" :id="config.componentId">
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
// 引入基本模板
// import { isEqual, cloneDeep } from 'lodash';
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { getInfoById } from '@/api/design';
import { supplementaryColor, returnChartPosition, getRequestParams } from '@/views/HomeMenuConfig/constants/common';
// import parser1 from '_u/formula';
import { formatDate } from '_u/utils';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  TitleComponent, TooltipComponent, PieChart, GraphChart, CanvasRenderer, LegendScrollComponent
]);

let FIXED_OBJ1 = {};
// const parser = cloneDeep(parser1);
const FormulaParser = require('hot-formula-parser').Parser;

const parser = new FormulaParser();
export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    filterParameter: { // 控件传给控件的参数集合
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      params: {}, // 参数集合
      pathArr: [], // 路径数组
      visible: false,
      panelConfig: {}, // 面板属性
      loading: false,
      isFinished: true,
      content: [],
      timer: null,
      myChart: null,
      observer: null,
      color: '#666666',
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const { width, height, stylesObj, left, top } = this.config;
      return `width:${width}px;height:${height}px;left:${left}px;top: ${top}px;zIndex:${stylesObj.zIndex};`;
    },
    getTextStyles() {
      return function () {
        let styles = `line-height:${this.config.height}px;`;
        const { stylesObj = {}, gradientType, enableBackground } = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          ...rest
        } = stylesObj;
        Object.keys(rest).forEach((item) => {
          let singStyle = `${item}:${stylesObj[item]}`;
          if (item === 'fontSize' || item === 'letterSpacing') {
            singStyle += 'px';
          }
          styles += `${singStyle}${singStyle ? ';' : ''}`;
        });

        if (gradientType === 1) { // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`;
        } else if (gradientType === 2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`;
        }
        if (enableBackground) {
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};
          `;
        }
        return styles;
      };
    },
    getOption() {
      return function () {
        const { stylesObj, enableLegend, dataType, dataConfig } = this.config;
        const { staticValue } = dataConfig;
        const {
          legendPosition,
          legendFontFamily,
          legendFontWeight,
          legendFontSize,
          labelPosition,
          labelShowType,
          labelValueType,
          labelFontSize,
          labelFontFamily,
          labelFontWeight,
          labelColor,
          outerCircle,
          InnerCircle,
          colorArr,
          legendColor
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const optionConfig = {
          tooltip: {
            show: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 0,
            textStyle: {
              color: '#fff'
            },
            formatter (params) {
              const { marker, name, value, percent } = params;
              return `${marker} ${name}</br> 数量:  ${value}</br> 占比: ${percent}%`;
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#333'
              }
            }
          },
          legend: {
            ...legendPos,
            show: enableLegend,
            type: 'scroll',
            pageIconColor: '#010b1a',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#010b1a'
            },
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            }
          }
        };
        let chartConfig = {};
        const cn = colorArr.length; // 颜色长度
        let supplementaryColorArr = [];
        if (dataType === 1) {
          const list = JSON.parse(staticValue);
          const ln = this.content.length; // 数据长度
          chartConfig.data = list;
          this.content = list;
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        if (dataType === 3 || dataType === 2) {
          const ln = this.content.length; // 数据长度
          chartConfig.data = this.content;
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        chartConfig = {
          ...chartConfig,
          radius: [`${outerCircle}%`, `${InnerCircle}%`],
          label: {
            show: labelPosition !== 'none',
            color: labelColor,
            position: labelPosition,
            alignTo: 'labelLine',
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            fontFamily: labelFontFamily,
            // eslint-disable-next-line no-useless-concat
            formatter: labelShowType === 'type' ? labelValueType === 1 ? '{b}: {c}' : '{b}: {d}' + '%' : labelValueType === 1 ? '{c}' : '{d}' + '%'
          },
          labelLine: {
            show: labelPosition === 'outside'
            // length: 120,
            // length2: 20,
          },
          emphasis: {
            label: {
              show: labelPosition !== 'none',
              fontSize: labelFontSize,
              fontWeight: labelFontWeight,
              fontFamily: labelFontFamily
            }
          },
          // tooltip: {
          //   position: 'top'
          // },
          type: 'pie'
        };
        if (cn) {
          chartConfig.itemStyle = {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            normal: {
              color: (params) => {
                const colorList = [...colorArr, ...supplementaryColorArr];
                // eslint-disable-next-line max-len
                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                  offset: 0,
                  color: colorList[params.dataIndex].c1 || colorList[params.dataIndex].c2 || '#fff'
                }, {
                  offset: 1,
                  color: colorList[params.dataIndex].c2 || colorList[params.dataIndex].c1 || '#fff'
                }]);
              }
            }
          };
        }
        const series = [chartConfig];
        return {
          ...optionConfig,
          series
        };
      };
    }
  },
  mounted() {
    this.initDom();
    this.initFunc();
  },
  activated() {
    this.initDom();
  },
  watch: {
    config(val) { // 普通的watch监听
      if (this.myChart && val) {
        const options = this.getOption();
        this.myChart.setOption(options);
      }
    },
    content: {
      deep: true,
      immediate: true,
      handler(val) {
        const { dataType } = this.config;
        if (this.myChart && val && dataType !== 1) {
          const options = this.getOption();
          this.myChart.setOption(options);
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (v && o) {
          const { dataType, SqlDataConfig: {
            enableDataManage, variableConfig = []
          } } = this.config;
          if (dataType === 3 && enableDataManage && variableConfig.length) {
            this.checkParams(variableConfig);
          }
        }
      }
    },
    filterParameter: {
      deep: true,
      immediate: false,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          if (isShow) {
            this.checkFilterParameter(true);
          }
        }
      }
    },
  },
  methods: {
    getFilterParamsObj() {
      const paramsObj = {};
      const { componentId } = this.config;
      Object.keys(this.filterParameter).forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.split('_')[1];
          paramsObj[key] = this.filterParameter[item];
        }
      });
      this.params = paramsObj;
      return paramsObj;
    },
    checkFilterParameter(flag) {
      const paramsObj = this.getFilterParamsObj();
      this.$nextTick(() => {
        if (flag && JSON.stringify(paramsObj) === '{}') {
          return;
        }
        this.initPath();
        this.fetchData();
      });
    },
    initPath() {
      const {
        interactionType,
        drillDownConfig = {},
        SqlDataConfig: { variableConfig }
      } = this.config;
      if (interactionType === 4) {
        const pathObj = {};
        const { pathColor } = drillDownConfig;
        variableConfig.forEach((item) => {
          const {
            name,
            value
          } = item;
          pathObj[name] = value;
        });
        pathObj.path_name = '全部';
        this.color = pathColor || '#666666';
        this.pathArr.push(pathObj);
      }
    },

    checkParams(variableConfig) {
      const obj = {};
      Object.keys(this.otherParams).forEach((item) => {
        const currentVar = variableConfig.find((varObj) => varObj.name === item);
        if (currentVar) {
          obj[item] = this.otherParams[item];
        }
      });
      if (JSON.stringify(obj) !== '{}') {
        this.fetchData();
      }
    },
    changePath(item, i) { // 修改路径
      this.params = JSON.parse(JSON.stringify(item));
      this.pathArr = this.pathArr.slice(0, i + 1);
      this.$nextTick(() => {
        this.fetchData();
      });
    },
    initDom() {
      const {
        componentId,
        dataType,
        drillDownConfig = {},
      } = this.config;
      if (dataType === 3) {
        this.getFilterParamsObj();
        this.initPath();
      }
      this.myChart = echarts.init(document.getElementById(componentId));
      this.fetchData();
      this.myChart.on('click', (params) => {
        const {
          interactionType,
          panelConfig,
          skipMenuConfig,
          dimension
        } = this.config;
        if (interactionType === 1) return;
        const { data } = params;
        FIXED_OBJ1 = data;
        if (interactionType === 2) {
          // 弹面板
          console.log(panelConfig);
          this.doSpringPanel(panelConfig);
        }
        if (interactionType === 3 && skipMenuConfig.length) {
          // 跳菜单
          this.doSkipMenu(skipMenuConfig);
          return;
        }
        const { drillDownField = [], tripStopField, tripStopFieldValue } = drillDownConfig;
        // eslint-disable-next-line max-len
        if (interactionType === 4 && Array.isArray(drillDownField) && drillDownField.length && this.isFinished) {
          // eslint-disable-next-line max-len
          this.doDrill(params, drillDownField, dimension, tripStopField, tripStopFieldValue, data);
        }
      });
    },
    // eslint-disable-next-line max-len
    doDrill(params, drillDownField, dimension, tripStopField, tripStopFieldValue, currentObj) { // 下钻
      const { name } = params;
      this.isFinished = false;
      if (tripStopField && `${currentObj[tripStopField]}` === `${tripStopFieldValue}`) {
        this.isFinished = true;
        return;
      }
      drillDownField.forEach((item) => {
        const {
          name: varName,
          value: filed
        } = item;
        this.params[varName] = currentObj[filed];
      });
      this.fetchData(() => {
        this.isFinished = true;
        this.pathArr.push({
          ...this.params,
          path_name: name
        });
      });
    },
    doSkipMenu(skipMenuConfig) { // 跳菜单
      const menuConfig = skipMenuConfig.find((item) => {
        if (!item.jumpTerm) { // 如果没有条件，默认跳
          return true;
        }
        const isFlag = this.formulaConversion(item.jumpTerm);
        return isFlag;
      });
      console.log(menuConfig);
      if (menuConfig) {
        // 获取目标菜单
        const menu = this.$store.getters.getCurMenu(menuConfig.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          menuConfig.menuVarObj = {};
          menuConfig.menuFilter.forEach((item, index) => { // 将公式值处理成固定值
            const { filterTermStr, filterTermSql, filterTermType } = item;
            if (filterTermType === 1) { // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
              menuConfig.menuFilter[index].filterTermStr = JSON.stringify(newFilterTermStr);
            }
            if (filterTermType === 2) { // sql过滤条件
              const str = this.reduceSqlFilter(filterTermSql);
              menuConfig.menuFilter[index].filterTermSql = str;
            }
          });
          const menuObj = {};
          menuObj[menuConfig.id] = menuConfig;
          const { jumpMenuObj = '{}' } = sessionStorage;
          const newJumpMenuObj = JSON.parse(jumpMenuObj);
          newJumpMenuObj[menuConfig.id] = menuConfig;
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
    reduceNormalFilter(filterTermStr) { // 处理普通的过滤条件
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
      // 获取当前用户
      str = str.replace(/GET_USER_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取用户组织
      str = str.replace(/GET_ORG_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取用户角色
      str = str.replace(/GET_ROLES_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取日期
      str = str.replace(/GET_DATE\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取日期时间
      str = str.replace(/GET_DATETIME\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取年份
      str = str.replace(/GET_YEAR\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取月份
      str = str.replace(/GET_MONTH\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取星期
      str = str.replace(/GET_WEEK\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取天
      str = str.replace(/GET_DAY\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取时间撮
      str = str.replace(/GET_TIMESTAMP\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    },

    doSpringPanel(panelConfig) {
      const { curPaneObj } = panelConfig;
      if (curPaneObj && curPaneObj.id) {
        curPaneObj.panelFilter.forEach((item, index) => { // 将公式值处理成固定值
          const { filterTermStr, filterTermSql, filterTermType } = item;
          if (filterTermType === 1) { // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr ? JSON.stringify(newFilterTermStr) : '';
          }
          if (filterTermType === 2) { // sql过滤条件
            const str = this.reduceSqlFilter(filterTermSql);
            curPaneObj.panelFilter[index].filterTermSql = str;
          }
        });
        const { panelData } = curPaneObj;
        const panelFixData = {};
        if (panelData && panelData.length) {
          panelData.forEach((item) => {
            const { field, paneComp: { compId } } = item;
            panelFixData[compId] = FIXED_OBJ1[field] || field;
          });
        }
        curPaneObj.panelFixData = panelFixData;
        this.panelConfig = panelConfig;
        this.$nextTick(() => {
          this.visible = true;
        });
      }
    },
    regProcess(str = '') { // 将公式中的特殊字符去除
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
        return FIXED_OBJ1[field];
      });
    },
    async fetchData(callback) {
      if (!this.myChart) {
        if (callback) callback();
        return;
      }
      const { dataType } = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.myChart.setOption(
          option
        );
      }
      // if (dataType === 2) {
      //   await this.getApi();
      // }
      if (dataType === 3) {
        await this.getSQL();
      }
      if (callback) {
        callback();
      }
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const { query = {}, name } = this.$route;
      const params = getRequestParams({
        config: this.config,
        routeQuery: name !== 'appCustomPage' ? {} : query,
        otherParams: this.otherParams,
        elseParams: this.params || {}
      });
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
          const option = this.getOption();
          this.myChart.clear();
          this.myChart.setOption(
            option
          );
        }, time);
      }
      if (!enableSQLFilter) {
        this.content = res;
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.content = result;
        return;
      }
      this.content = res;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  deactivated() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  //overflow: hidden;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .singleTextContent {
    width: calc(100%);
    height: calc(100%);
    position: relative;
    margin: 0 auto;
  }
  .pathWrap {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 24px;
    white-space: nowrap;
    overflow-y: hidden;
    z-index: 1;
  }
}
</style>
