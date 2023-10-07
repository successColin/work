/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
    <div class="singleTextWrap"
         :style="getContentStyles"
    >
      <iframe frameborder="0" :src="getSrc"></iframe>
    </div>
</template>

<script>
import qs from 'qs';
import {screenConfig} from '@/constants/global';
import { getQueryString } from '@/utils/utils';
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
    }
  },
  data() {
    return {
    };
  },
  computed: {
    getSrc(){
      const { stylesObj: { url = '' }, componentId } = this.config;
      if (!url) return '';
      let query = getQueryString(url) || {};
      Object.keys(this.otherParams).forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.split('_')[1];
          query = {
            ...query,
            [key]: this.otherParams[item]
          }
        }
      })
      if (JSON.stringify(query) !== '{}') {
        return `${url}?${qs.stringify(query)}`
      }
      return url;
    },
    getContentStyles() {
      const { width, height, top, left, stylesObj} = this.config;
      return `width: ${width}px;height: ${height}px;line-height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    }
  },

  mounted() {
  },

  components: {},

  watch: {
  },
  methods: {
  },
  beforeDestroy() {
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;

  &>iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
