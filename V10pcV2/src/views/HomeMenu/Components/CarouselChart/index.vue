/** * @name: index * @author: DELL * @date: 2021/8/21 14:51 *
@description：index * @update: 2021/8/21 14:51 */

<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles()">
    <el-carousel
      :height="`${config.height - 40}px`"
      :indicator-position="config.stylesObj.indicatorPosition"
      :autoplay="config.stylesObj.autoplay"
      :interval="config.stylesObj.interval * 1000"
      :arrow="config.stylesObj.arrow"
      :loop="config.stylesObj.loop"
      :type="config.stylesObj.type"
      :direction="config.stylesObj.direction"
      :class="`carousel__box type__${config.stylesObj.indicatorType}`"
    >
      <el-carousel-item
        v-for="(item, i) in getLoopImages"
        :key="item.parperId || i"
      >
        <div
          class="imgBox"
          @click="doClickImage(item)"
          :style="`backgroundImage:url(${$parseImgUrl(item.imgUrl)})`"
        ></div>
      </el-carousel-item>
    </el-carousel>
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
// import { isEqual } from 'lodash';
// import parser from '@/utils/formula';
import { getInfoById } from '@/api/design';
import { formatDate, Decrypt, Encrypt, isJiami } from '@/utils/utils';
import {
  checkAndGetOtherParams,
  getRequestParams,
} from '@/views/HomeMenuConfig/constants/common';
import cloneDeep from 'lodash/cloneDeep';

let FIXED_OBJ = {}; // 保存
const FormulaParser = require('hot-formula-parser').Parser;

const parser = new FormulaParser();

export default {
  props: {
    config: {
      type: Object,
      default: () => {},
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      },
    },
    filterParameter: {
      // 控件传给控件的参数集合
      type: Object,
      default() {
        return {};
      },
    },
    // elementData: {
    //   type: Object,
    //   default() {
    //     return {};
    //   }
    // }
  },
  data() {
    return {
      visible: false,
      list: [],
      obj: {}, // 文本对象
      timer: null,
      params: {}, // 别的控件传过来的参数
      panelConfig: {}, // 面板属性
    };
  },

  components: {},

  computed: {
    getLoopImages() {
      const { imgArr = [], dataType = 1 } = this.config;
      if (dataType === 1) return imgArr;
      if (dataType === 3) {
        return this.list;
      }
      return imgArr;
    },
    panelObj() {
      const { activeObj, curPaneObj } = this.panelConfig;
      return {
        ...curPaneObj,
        ...activeObj,
        panelVarObj: {},
        panelName: activeObj.dialogTitle,
      };
    },
    getContentStyles() {
      return function () {
        const { width, height, top, left, stylesObj = {} } = this.config;
        return `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex}; `;
      };
    },
  },
  mounted() {
    this.checkFilterParameter(false);
    this.initFunc();
  },
  activated() {
    this.checkFilterParameter(false);
  },
  watch: {
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
      },
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          // eslint-disable-next-line max-len
          const lastOtherParams = checkAndGetOtherParams({
            config: this.config,
            otherParams: this.otherParams,
          });
          if (isShow && JSON.stringify(lastOtherParams) !== '{}') {
            this.init();
          }
        }
      },
    },
    // elementData: {
    //   deep: true,
    //   immediate: false,
    //   handler(v, o) {
    //     const {
    //       id,
    //       dataType
    //     } = this.config;
    //     if (!isEqual(v, o) && dataType === 3) {
    //       this.reduceDataFilter(v[id]);
    //     }
    //   }
    // }
  },
  methods: {
    doClickImage(item) {
      const { dataType = 1 } = this.config;
      const { targetUrl } = item;
      if (dataType === 1 && targetUrl) {
        window.open(targetUrl);
        return;
      }
      if (dataType === 3) {
        this.hrefUrl(item);
      }
    },
    checkFilterParameter(flag) {
      const paramsObj = {};
      const { componentId } = this.config;
      Object.keys(this.filterParameter).forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.split('_')[1];
          paramsObj[key] = this.filterParameter[item];
        }
      });
      this.params = paramsObj;
      this.$nextTick(() => {
        if (flag && JSON.stringify(paramsObj) === '{}') {
          return;
        }
        this.init();
      });
    },
    async init() {
      const { dataType } = this.config;
      if (dataType === 3) {
        await this.getSQL();
      }
    },
    async reduceDataFilter(res) {
      const { SqlDataConfig } = this.config;
      const { SQLFilterFun, enableSQLFilter, SQLDataFilterId } = SqlDataConfig;
      if (!enableSQLFilter) {
        this.list = res;
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          return;
        }
        this.list = result;
        return;
      }
      this.list = res;
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const { enableSQLAutoUpdate, SQLUpdateTime = 1 } = SqlDataConfig;
      const { query = {}, name } = this.$route;
      const params = getRequestParams({
        config: this.config,
        routeQuery: name !== 'appCustomPage' ? {} : query,
        otherParams: this.otherParams,
        elseParams: this.params || {},
      });
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
          const { filterTermStr, filterTermType } = item;
          const filterTermSql = isJiami(item.filterTermSql)
            ? Decrypt(item.filterTermSql)
            : item.filterTermSql;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            config.menuFilter[index].filterTermStr =
              JSON.stringify(newFilterTermStr);
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const str = this.reduceSqlFilter(filterTermSql);

            config.menuFilter[index].filterTermSql = Encrypt(str);
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
          // this.$nextTick(() => {
          //   this.$bus.$emit('refresh');
          // });
          setTimeout(() => {
            this.$bus.$emit('refresh');
          }, 100);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限',
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单',
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
      const {
        curPaneObj,
        activeObj: { dialogTitle },
      } = panelConfig;
      if (curPaneObj && curPaneObj.id) {
        curPaneObj.panelFilter.forEach((item, index) => {
          // 将公式值处理成固定值
          const { filterTermStr, filterTermType } = item;
          if (filterTermType === 1) {
            // 普通的过滤条件
            const newFilterTermStr = this.reduceNormalFilter(filterTermStr);
            curPaneObj.panelFilter[index].filterTermStr = newFilterTermStr
              ? JSON.stringify(newFilterTermStr)
              : '';
          }
          if (filterTermType === 2) {
            // sql过滤条件
            const filterTermSql = isJiami(item.filterTermSql)
                ? Decrypt(item.filterTermSql)
                : item.filterTermSql;
            const str = this.reduceSqlFilter(filterTermSql);
            curPaneObj.panelFilter[index].filterTermSql = Encrypt(str);
          }
        });
        const { panelData } = curPaneObj;
        const panelFixData = {};
        if (panelData && panelData.length) {
          panelData.forEach((item) => {
            const {
              field,
              paneComp: { compId },
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
        (...arr) => `${arr[1]}`,
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
    hrefUrl(item) {
      // 点击操作
      const { interactionType, panelConfig, skipMenuConfig } = this.config;
      // FIXED_OBJ = this.obj;
      FIXED_OBJ = item;
      // 1不需处理
      if (interactionType === 1) return;
      // 跳菜单
      if (interactionType === 3 && skipMenuConfig.length) {
        const lastSkipMenuConfig = cloneDeep(skipMenuConfig);
        this.doSkipMenu(lastSkipMenuConfig);
        return;
      }
      // 弹面板
      if (interactionType === 2) {
        const lastPanelConfig = cloneDeep(panelConfig);
        this.doSpringPanel(lastPanelConfig);
      }
      // if (interactionType === 4) {
      //   this.doJumpUrl(panelConfig);
      // }
    },
    // doJumpUrl() { // 跳转外部地址
    //   const { stylesObj = {} } = this.config;
    //   const { externalUrl } = stylesObj;
    //   if (!externalUrl) return;
    //   if (IsURL(externalUrl)) {
    //     window.open(externalUrl);
    //     // window.location.href = externalUrl;
    //   }
    // }
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
  name: 'SingleLineText',
};
</script>

<style lang="scss" scoped>
.singleTextWrap {
  position: absolute;
  overflow: hidden;
  box-sizing: border-box;

  & .type__1 {
    ::v-deep {
      .el-carousel__indicators {
        .el-carousel__button {
          width: 18px;
          background-color: rgba(0, 0, 0, 0.3);
          &.is-active {
            background-color: rgba(0, 0, 0, 0.6);
          }
        }
        li.is-active {
          .el-carousel__button {
            background-color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
  & .type__2 {
    ::v-deep {
      .el-carousel__indicators {
        .el-carousel__button {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.3);
        }
        li.is-active {
          .el-carousel__button {
            width: 14px;
            border-radius: 12px;
            background-color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
  & .type__3 {
    ::v-deep {
      .el-carousel__indicators {
        counter-reset: num;
        li .el-carousel__button:before {
          counter-increment: num;
          content: counter(num);
          font-size: 12px;
          font-weight: 400;
          line-height: 16px;
          display: flex;
          align-items: center;
          color: #fff;
          justify-content: center;
        }
        .el-carousel__button {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.3);
        }
        li.is-active {
          .el-carousel__button {
            background-color: rgba(0, 0, 0, 0.6);
          }
        }
      }
    }
  }
  .imgBox {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  ::v-deep {
    .el-carousel {
      width: 100%;
    }
  }
}
</style>
