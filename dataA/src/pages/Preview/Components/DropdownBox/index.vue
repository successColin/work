/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles">
    <div class="timePickWrap" :class="`a${config.componentId}-timePickWrap`">
      <div class="timeTypeWrap">
        <c-select
            :popper-class="`a${config.componentId}_selectPopper`"
            ref="timeSelect"
            :options="getOptions"
            v-model="timeType"
            @change="change"
        >
        </c-select>
      </div>
    </div>
  </div>
</template>

<script>
import {screenConfig} from '@/constants/global';
import {isEqual} from 'lodash';
import {getInfoById} from '@/services/design';
// import {isEqual} from 'lodash';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line no-warning-comments
    // todo: activeComponent与config 两个变量有重复，所有的组件都可以进行优化；
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    changeFilterParams: { // 用于修改过滤条件参数的
      type: Function,
      default: () => {
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    updateState: { // 用于修改父组件data值
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      sticks: ['mr', 'ml'],
      timeValue: '',
      timeType: null,
      list: []
    };
  },
  mounted() {
    const {
      stylesObj: {
        selectOptions = [],
        defaultCheckedTimeType = ''
      }
    } = this.config;
    this.renderStyles();
    if (defaultCheckedTimeType) {
      let arr = defaultCheckedTimeType.split('_');
      const i = +arr[arr.length - 1];
      const obj = selectOptions[i];
      this.timeType = obj.value;
    }
  },

  computed: {
    getOptions() {
      const {
        enableCustomItems = true,
        dataType,
        stylesObj: {selectOptions = []}
      } = this.config;
      if (enableCustomItems) {return selectOptions;}
      if ([2,3].includes(dataType) && !enableCustomItems) {
        return this.list;
      }
      return []
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        const {isShow} = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.fetchData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.fetchData();
        }
      }
    }
  },
  methods: {
    async fetchData() {
      const {dataType, enableCustomItems} = this.config;
      if (!enableCustomItems && dataType === 2) {
        this.loading = true;
        await this.getApi();
        this.loading = false;
      }
      if (!enableCustomItems && dataType === 3) {
        this.loading = true;
        await this.getSQL();
        this.loading = false;
      }
    },
    async getApi() {
      const {apiDataConfig} = this.config;
      const params = this.getParameters();
      const res = await getInfoById(params) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(async () => {
            await this.getApi();
          }, time);
        }
        const list = JSON.parse(targetObj);
        if (!enableApiFilter) {
          this.list = list;
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(list);
          if (!(Array.isArray(result) && result.length)) {
            this.list = [];
            return
          }
          this.list = result;
        }
      }
    },
    async getSQL() {
      const {SqlDataConfig} = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          return
        }
        this.list = result;
        return;
      }
      this.list = res;
    },
    getParameters() {
      const {id, componentId} = this.config;
      const reduce = (obj) => { // 将Object 处理成 Array
        return Object.keys(obj).map((item) => {
          return {
            name: item,
            value: obj[item]
          }
        })
      }
      const query = this.$route.query
      let satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        })
      }
      const currentParams = {
        ...satisfyParams,
        ...query
      }
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },

    change(v){
      const {stylesObj: {
        updateChart = [],
        selectOptions = [],
        paramsFiled = ''
      }} = this.config;
      if (!selectOptions.length || !paramsFiled || !updateChart.length) {return;}
      let params = {};
      updateChart.forEach((key) => {
        params[`${key}_${paramsFiled}`] = v;
      })
      const newParams = {
        ...this.otherParams,
        ...params
      }
      this.updateState('filterParameter', newParams);
    },
    renderStyles() {
      const {
        stylesObj: {bgColor, borderColor, iconColor, fontColor},
        componentId
      } = this.config;
      let styleDom = document.createElement('style');
      const classNames = `a${componentId}-timePickWrap`;
      const classProperNames = `a${componentId}_selectPopper`;
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('className', `${componentId}-timePickStylesWrap`);
      styleDom.innerHTML = `
          .${classNames} .el-input__inner{
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classNames} .el-input__suffix {
            color: ${iconColor} !important;
          }
          .${classNames} .el-input__prefix {
            color: ${iconColor} !important;
          }
          .${classProperNames} {
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classProperNames} .el-select-dropdown__item.hover{
            background: ${iconColor};
          }
          .${classProperNames} .el-select-dropdown__item{
            color: ${fontColor};
          }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom);
    }
  },
  components: {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .timePickWrap {
    display: flex;
    height: 32px;
    width: calc(100% - 20px);

    .timeTypeWrap {
      width: 100%;

      ::v-deep {
        .el-input__inner {
          padding-left: 10px;
        }
      }
    }
  }
}
</style>
