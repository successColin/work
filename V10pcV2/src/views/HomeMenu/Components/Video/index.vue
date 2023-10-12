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
    <video
        :ref="`videoPlayer1_${config.componentId}`"
        class="video-js vjs-default-skin vjs-big-play-centered"
        style="width: 100%;height: 100%"
    ></video>
  </div>
</template>

<script>
import { IsURL } from '@/utils/utils';
import { isEqual } from 'lodash';
import videojs from 'video.js';
import { getInfoById } from '@/api/design';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs-es6';
import 'videojs-flash';

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
      videoPlayer: null,
      content: ''
    };
  },

  components: {},

  computed: {
    getRotateX() {
      const {
        width,
        height,
        top,
        left,
        stylesObj
      } = this.config;
      return `width: ${width}px;height: ${height}px;line-height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getImageUrl() { // 获取图片路径
      return function (url) {
        if (!url) {
          return '';
        }
        const reg = /(http|https):\/\/([\w.]+\/?)\S*/ig;
        const result = url.match(reg);
        if (!result || !IsURL(result)) {
          return '';
        }
        return result[0] || '';
      };
    },
    getList() {
      return this.$store.getters.list;
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
        const {
          isShow,
          stylesObj: { supportParameters }
        } = this.config;
        if (supportParameters === 1) {
          let url = '';
          Object.keys(v)
              .forEach((item) => {
                url = this.getImageUrl(v[item]);
              });
          this.content = url;
          return;
        }
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.init();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.init();
        }
      }
    }
  },
  methods: {
    getParameters() {
      const {
        id,
        componentId
      } = this.config;
      const reduce = (obj) => // 将Object 处理成 Array
         Object.keys(obj)
            .map((item) => ({
                name: item,
                value: obj[item]
              }));
const { query } = this.$route;
      const satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams)
            .forEach((item) => {
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
      const {
        stylesObj: {
          supportParameters,
          url: resultUrl
        }
      } = this.config;
      if (supportParameters === 1) {
        const { query } = this.$route;
        let url = '';
        Object.keys(query)
            .forEach((item) => {
              url = this.getImageUrl(query[item]);
            });
        this.content = url;
        await this.handelVideoUrl(this.content);
        return;
      }
      const { dataType } = this.config;
      if (dataType === 2) {
        await this.getApi();
        return;
      }
      if (dataType === 3) {
        await this.getSQL();
        return;
      }
      if (dataType === 1 && supportParameters === 3) {
        this.content = resultUrl;
        await this.handelVideoUrl(this.content);
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
          await this.handelVideoUrl(this.content);
          return;
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.content = result[apiEffect] || '';
          await this.handelVideoUrl(this.content);
          return;
        }
        this.content = JSON.parse(targetObj)[apiEffect];
        await this.handelVideoUrl(this.content);
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
        await this.handelVideoUrl(this.content);
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.content = result[SQLEffect] || '';
        setTimeout(async () => {
          await this.handelVideoUrl(this.content);
        }, 0);
        return;
      }
      this.content = res[SQLEffect];
      await this.handelVideoUrl(this.content);
    },
    async handelVideoUrl(resultUrl) {
      if (this.videoPlayer) {
        this.videoPlayer.dispose();
      }
      const refsDom = `videoPlayer1_${this.config.componentId}`;
      const { stylesObj } = this.config;
      const {
        controls,
        autoplay,
        loop,
        playbackRates,
        poster
      } = stylesObj;
      let options = {
        muted: true,
        controls, // 进度条
        autoplay, // 自动播放
        loop, // 是否循环
        poster,
        languages: {
          'zh-CN': require('video.js/dist/lang/zh-CN.json')
        },
        language: 'zh-CN',
        preload: 'auto',
        playbackRates: [0.5, 1, 1.5, 2]
      };
      if (!playbackRates) {
        delete options.playbackRates;
      }
      const url = resultUrl.replace(/\s+/g, '');
      if (url.indexOf('rtmp') > -1) {
        // rtmp格式视频
        options = {
          ...options,
          techOrder: ['html5', 'flash'], // 兼容顺序
          sources: [{
            src: resultUrl,
            type: 'rtmp/flv'
          }]
        };
      } else if (url.lastIndexOf('.') > -1) {
        const type = url.substring(url.lastIndexOf('.') + 1);
        if (type === 'flv') {
          // flv格式视频
          options = {
            ...options,
            techOrder: ['html5', 'flvjs'], // 兼容顺序
            flvjs: {
              mediaDataSource: {
                isLive: false,
                cors: true,
                withCredentials: false
              }
            },
            sources: [{
              src: resultUrl,
              type: 'video/x-flv'
            }]
          };
        } else {
          // 其他格式视频
          options = {
            ...options,
            sources: [{
              src: resultUrl,
              type: 'video/mp4'
            }]
          };
        }
      }
      if (this.videoPlayer) {
        this.videoPlayer.dispose();
      }
      this.videoPlayer = videojs(this.$refs[refsDom], {
        ...options
      });
      // this.changeUrl(resultUrl);
    },
    changeUrl(resultUrl) {
      const url = resultUrl.replace(/\s+/g, '');
      if (url.indexOf('rtmp') > -1) {
        this.videoPlayer.src([
          {
            src: resultUrl,
            type: 'rtmp/flv' // 告诉videojs,这是一个hls流
          }
        ]);
        // this.videoPlayer.play();
      } else if (url.lastIndexOf('.') > -1) {
        const type = url.substring(url.lastIndexOf('.') + 1);
        if (type === 'flv') {
          this.videoPlayer.src([
            {
              src: resultUrl,
              type: 'video/x-flv' // 告诉videojs,这是一个hls流
            }
          ]);
          // this.videoPlayer.play();
        } else if (type === 'wmv') {
          this.videoPlayer.src([
            {
              src: resultUrl,
              type: 'video/wmv' // 告诉videojs,这是一个hls流
            }
          ]);
          // this.videoPlayer.play();
        } else {
          // 其他格式视频
          this.videoPlayer.src([
            {
              src: resultUrl,
              type: 'video/mp4' // 告诉videojs,这是一个hls流
            }
          ]);
          // this.videoPlayer.play();
        }
      }
    }
  },
  destroyed() {
    if (this.videoPlayer) {
      this.videoPlayer.dispose();
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
