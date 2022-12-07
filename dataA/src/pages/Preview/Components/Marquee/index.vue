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
    <c-marquee
        :sendVal="list"
        :config="config"
        :speed="config.stylesObj.speed"
        :takeEffect="takeEffect"
        @clickNews="doClick"
    ></c-marquee>
  </div>
</template>

<script>

import {screenConfig} from '@/constants/global';
import {getInfoById} from '@/services/design';
import {isEqual} from 'lodash';

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
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
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
      takeEffect: '',
      timer: null,
      list: []
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const {width, height, top, left, stylesObj, enableBackground} = this.config;
      const styles = `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
      const {
        backgroundColor,
        borderRadius,
        borderColor,
        borderWidth,
        borderStyle
      } = stylesObj;
      if (enableBackground) {
        return `${styles}backgroundColor:${backgroundColor}; borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
      }
      return styles;
    }
  },
  watch: {
    'config.dataConfig': {
      deep: true,
      handler() {
        this.init()
      }
    },
    'config.apiDataConfig': {
      deep: true,
      handler() {
        this.init()
      }
    },
    'config.SqlDataConfig': {
      deep: true,
      handler() {
        this.init()
      }
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        const {isShow} = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.init();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.init();
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    doClick(item) {
      let {field, param, url, enableOpenNewWindow} = this.config;
      if (url) {
        if (url.indexOf('?') === -1) {
          url += `?${param}=${item[field]}`

        } else {
          url += `&${param}=${item[field]}`
        }
        if (enableOpenNewWindow) { // 打开新页面
          window.open(url, '_blank');
        } else {
          window.location.href = url;
        }
      }
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
    async init() {
      const {dataType, dataConfig, apiDataConfig, SqlDataConfig} = this.config;
      const {takeEffect, staticValue} = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        this.list = obj;
        this.takeEffect = takeEffect;
      }
      if (dataType === 2) {
        const {apiEffect} = apiDataConfig;
        this.takeEffect = apiEffect;
        await this.getApi();
      }
      if (dataType === 3) {
        const {SQLEffect} = SqlDataConfig;
        this.takeEffect = SQLEffect;
        await this.getSQL();
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
          apiEffect,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.getApi();
          }, time);
        }
        if (!enableApiFilter) {
          this.list = JSON.parse(targetObj);
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.list = result || [];
          return;
        }
        this.content = JSON.parse(targetObj);
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
        this.timer = setTimeout(() => {
          this.getSQL();
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
        this.list = result || [];
        return;
      }
      this.list = res;
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>
