/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/

<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles()" @click="handleClick">
    <div
        class="singleTextContent"
        :style="getTextStyles()"
        :class="{ellipsis: config.enableEllipsis}"
        @click="hrefUrl"
        :title="content"
    >
      <span>{{ content }}</span>
    </div>
  </div>
</template>

<script>
import { isEqual } from 'lodash';
import Bus from '@/utils/bus';
import { getInfoById } from '@/api/design';
import { IsURL } from '@/views/HomeMenuConfig/constants/common';

export default {
  props: {
    config: {
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
      content: '',
      timer: null
    };
  },

  components: {},

  computed: {
    getTextStyles() {
      return function () {
        // eslint-disable-next-line max-len
        const { stylesObj = {}, gradientType, enableBackground, width, height, url, interactionMode, bulletUrl, enableEllipsis } = this.config;
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
        styles += enableEllipsis ? `line-height:${this.config.height}px;` : `line-height:${stylesObj.fontSize + 10}px;`;
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
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};`;
        }
        if ((url || bulletUrl) && interactionMode !== 1) {
          styles += 'cursor: pointer;';
        }
        return styles;
      };
    },
    getContentStyles() {
      return function () {
        const { stylesObj = {}, enableBackground, width, height, top, left } = this.config;
        let styles = `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex}; `;
        const {
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle
        } = stylesObj;
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
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: false,
      handler(v, o) {
        const params = this.getParameters();
        const { isShow } = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.init();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.init();
        }
      }
    }
  },
  methods: {
    handleClick() {
      const { bulletType, interactionMode, bulletUrl, bulletWidth, bulletHeight } = this.config;
      if (interactionMode === 2 && bulletType === 1) {
        Bus.$emit('modalOpera', {
          visible: true,
          singleConfig: {
            url: bulletUrl,
            bulletWidth,
            bulletHeight
          },
          otherParams: {}
        });
      }
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

    async init() {
      const { dataType, dataConfig } = this.config;
      const { takeEffect, staticValue } = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        this.content = obj[takeEffect] || '';
      }
      if (dataType === 2) {
        await this.getApi();
      }
      if (dataType === 3) {
        await this.getSQL();
      }
    },
    async getApi() {
      const { apiDataConfig } = this.config;
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
          // eslint-disable-next-line no-unused-expressions
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.getApi();
          }, time);
        }
        if (!apiEffect && !enableApiFilter) {
          this.content = targetObj;
          return;
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.content = result[apiEffect] || '';
          return;
        }
        this.content = JSON.parse(targetObj)[apiEffect];
      }
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLEffect,
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
        this.timer = setTimeout(() => {
          this.getSQL();
        }, time);
      }
      if (!SQLEffect && !enableSQLFilter) {
        this.content = JSON.stringify(res);
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.content = result[SQLEffect] || '';
        return;
      }
      this.content = JSON.stringify(res[SQLEffect]);
    },
    hrefUrl() {
      const { url, enableOpenNewWindow } = this.config;
      if (!url) {
        return;
      }
      if (!IsURL(url)) {
        return;
      }
      if (enableOpenNewWindow) {
        window.open(url, '_blank');
      } else {
        window.open(url, '_self');
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
  }
}
</style>
