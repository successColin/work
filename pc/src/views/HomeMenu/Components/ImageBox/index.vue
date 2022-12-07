/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getRotateX">
    <div class="imageContent" :style="getRotateY">
      <div class="imageBox" :style="getTextStyles()"></div>
    </div>
  </div>
</template>

<script>
import { isEqual } from 'lodash';
import { getInfoById } from '@/api/design';
import { getRequestParams, IsURL } from '@/views/HomeMenuConfig/constants/common';

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
    }
  },
  data() {
    return {
      content: ''
    };
  },

  components: {},

  computed: {
    getRotateY() {
      if (this.config.horizontalMirror) {
        return 'transform: rotateY(180deg);';
      }
      return '';
    },
    getRotateX() {
      const { width, height, top, left, stylesObj } = this.config;
      let styles = `width: ${width}px;height: ${height}px;line-height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
      if (this.config.verticalMirror) {
        styles += 'transform: rotateX(180deg);';
      }
      return styles;
    },
    getImageUrl() {
      // 获取图片路径
      return function (url) {
        if (!url) return '';
        const reg = /(http|https):\/\/([\w.]+\/?)\S*/gi;
        const result = url.match(reg);
        if (!result || !IsURL(result)) return '';
        return this.$parseImgUrl(result[0]) || '';
      };
    },
    getTextStyles() {
      return function () {
        let styles = '';
        const { stylesObj = {}, dataType = 1 } = this.config;
        const { supportParameters } = stylesObj;
        if (supportParameters === 1) {
          const url = this.getImageUrl(this.content);
          styles += `background-image:url(${this.$parseImgUrl(url, this.hasToken)});`;
        }
        Object.keys(stylesObj).forEach((item) => {
          if (item === 'backgroundImage') {
            if (dataType === 1 && supportParameters !== 1) {
              styles += `background-image:url(${this.$parseImgUrl(stylesObj[item])});`;
            } else if ([2, 3].includes(dataType) && supportParameters !== 1) {
              const url = this.getImageUrl(this.content);
              styles += `background-image:url(${this.$parseImgUrl(url, this.hasToken)});`;
            }
          } else if (item === 'rotationAngle') {
            styles += `transform:rotate(${stylesObj[item]}deg);`;
          } else {
            styles += `${item}:${stylesObj[item]};`;
          }
        });
        return styles;
      };
    },
    hasToken() {
      if (this.$route.name === 'appCustomPage') {
        const { query } = this.$route;
        const { hasOwnProperty } = Object.prototype;
        if (hasOwnProperty.call(query, 'CSMToken') && query.CSMToken) {
          return query.CSMToken;
        }
        return '';
      }
      return '';
    }
  },
  mounted() {
    this.init();
  },
  activated() {
    this.init();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: false,
      handler(v, o) {
        const { isShow, stylesObj: { supportParameters } } = this.config;
        if (supportParameters === 1) {
          let url = '';
          Object.keys(v).forEach((item) => {
            url = this.getImageUrl(v[item]);
          });
          this.content = url;
          return;
        }
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && isShow) {
          this.init();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && isShow) {
          this.init();
        }
      }
    }
  },
  methods: {
    async init() {
      const {
        stylesObj: { supportParameters }
      } = this.config;
      if (supportParameters === 1) {
        const { query } = this.$route;
        let url = '';
        Object.keys(query).forEach((item) => {
          url = this.getImageUrl(query[item]);
        });
        this.content = url;
        return;
      }
      const { dataType } = this.config;
      if (dataType === 3) {
        await this.getSQL();
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
      this.content = res[SQLEffect];
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
  width: 100%;
  height: 100%;
  position: absolute;

  .imageContent {
    width: 100%;
    height: 100%;

    .imageBox {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>
