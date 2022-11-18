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
      v-loading="loading"
      class="singleTextWrap"
      :id="`basicPie_${config.componentId}`"
      :style="getContentStyles"
  >
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`">
    </div>
  </div>
</template>

<script>
// 引入基本模板
import { isEqual } from 'lodash';
import { getInfoById } from '@/api/design';
import { getLiquidfillOption } from '@/views/HomeMenuConfig/constants/common';
import 'echarts-liquidfill';

// eslint-disable-next-line no-undef
const echarts = require('echarts');

export default {
  props: {
    designType: {
      type: String,
      default: ''
    },
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
    }
  },
  data() {
    return {
      content: [],
      myChart: null,
      observer: null,
      instance: null,
      loading: false
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
    getOption() {
      return function () {
        return getLiquidfillOption({ config: this.config, data: this.content, echarts });
      };
    }
  },
  mounted() {
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
        if (this.myChart && val) {
          const options = this.getOption();
          this.myChart.setOption(options);
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        const { isShow } = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.fetchData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.fetchData();
        }
      }
    }
  },
  methods: {

    initDom() {
      const { componentId } = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`;
      this.myChart = echarts.init(document.getElementById(domWrap));
      this.instance = Object.freeze({ myChart: this.myChart });
      this.fetchData();
    },
    async fetchData() {
      if (!this.myChart) { return; }
      const { dataType } = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.myChart.setOption(
          option
        );
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        this.loading = false;
      }
      // getInfoById
    },
    getParameters() {
      const { id, componentId } = this.config;
      const reduce = (obj) => // 将Object 处理成 Array
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
    async getSQL() {
      const { SqlDataConfig } = this.config;
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
}
</style>
