/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <VueDragResize
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      @deactivated="deactivated"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :minw="2"
      :minh="2"
      :parentScaleX="scale"
      :parentScaleY="scale"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="singleTextWrap" @contextmenu.prevent="show">
      <div
          style="width: 100%;height: 100%;"
          v-show="content"
          :class="{'hide': !config.stylesObj.isfullScreen}">
        <video
            data-setup="{}"
            :ref="`videoPlayer_${config.componentId}`"
            class="video-js vjs-default-skin vjs-big-play-centered"
            style="width: 100%;height: 100%"
        ></video>
      </div>
    </div>
  </VueDragResize>
</template>

<script>
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-flvjs-es6';
import 'videojs-flash';
import {screenConfig} from '@/constants/global';
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
      default: () => {
      }
    }
  },
  data() {
    return {
      content: '',
      videoPlayer: null
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getList() {
      return this.$store.getters.list;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
    'config.stylesObj.url': {
      handler(v, o) {
        if (!isEqual(v, o) && this.config.dataType === 1) {
          this.content = v;
          this.changeUrl(v)
        }
      }
    },
    'config.dataType': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    },
    'config.SqlDataConfig': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    },
    'config.apiDataConfig': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    }
  },
  methods: {
    init() {
      const {dataType, apiDataConfig, SqlDataConfig, stylesObj} = this.config;
      if (dataType === 2) {
        const {apiEffect, apiFilterResponse} = apiDataConfig
        if (apiFilterResponse === '{}') {
          this.content = '';
          return;
        }
        const obj = JSON.parse(apiFilterResponse);
        const url = obj[apiEffect];
        this.content = url;
        this.handelVideoUrl(url);
      }
      if (dataType === 3) {
        const {SQLEffect, SQLFilterResponse} = SqlDataConfig
        const obj = JSON.parse(SQLFilterResponse);
        const url = obj[SQLEffect];
        this.content = url;
        this.handelVideoUrl(url);
        return;
      }
      const {url} = stylesObj;
      this.content = url;
      this.handelVideoUrl(url);
    },
    changeUrl(resultUrl) {
      if (!resultUrl && !this.videoPlayer) {
        return;
      }
      const url = resultUrl.replace(/\s+/g, '');
      if (url.indexOf('rtmp') > -1) {
        this.videoPlayer.src([
          {
            src: resultUrl,
            type: 'rtmp/flv' // 告诉videojs,这是一个hls流
          }
        ]);
        this.videoPlayer.play();
      } else if (url.lastIndexOf('.') > -1) {
        const type = url.substring(url.lastIndexOf('.') + 1)
        if (type === 'flv') {
          this.videoPlayer.src([
            {
              src: resultUrl,
              type: 'video/x-flv' // 告诉videojs,这是一个hls流
            }
          ]);
          this.videoPlayer.play();
        } else if (type === 'wmv') {
          this.videoPlayer.src([
            {
              src: resultUrl,
              type: 'video/wmv' // 告诉videojs,这是一个hls流
            }
          ]);
          this.videoPlayer.play();
        } else {
          // 其他格式视频
          this.videoPlayer.src([
            {
              src: resultUrl,
              type: 'video/mp4' // 告诉videojs,这是一个hls流
            }
          ]);
          this.videoPlayer.play();
        }
      }
    },
    handelVideoUrl(resultUrl) {
      const refsDom = `videoPlayer_${this.config.componentId}`;
      const {stylesObj} = this.config;
      const {controls, autoplay, loop, playbackRates, poster} = stylesObj;
      let options = {
        muted: true,
        controls,//进度条
        autoplay,//自动播放
        loop,//是否循环
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
        //rtmp格式视频
        options = {
          ...options,
          techOrder: ['html5', 'flash'],// 兼容顺序
          sources: [{src: resultUrl, type: 'rtmp/flv'}]
        };
      } else if (url.lastIndexOf('.') > -1) {
        const type = url.substring(url.lastIndexOf('.') + 1)
        if (type === 'flv') {
          //flv格式视频
          options = {
            ...options,
            techOrder: ['html5', 'flvjs'],// 兼容顺序
            flvjs: {
              mediaDataSource: {
                isLive: false,
                cors: true,
                withCredentials: false
              }
            },
            sources: [{src: resultUrl, type: 'video/x-flv'}]
          };
        } else {
          // 其他格式视频
          options = {
            ...options,
            sources: [{src: resultUrl, type: 'video/mp4'}]
          };
        }
      }

      this.videoPlayer = videojs(this.$refs[refsDom], {
        ...options
      });
      this.changeUrl(resultUrl);
    },
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstop(newRect) {
      this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
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

  &.hide {
    ::v-deep {
      .vjs-fullscreen-control{
        display: none;
      }
    }
  }

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
