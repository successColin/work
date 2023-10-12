<template>
  <video-player
    class="video"
    ref="video"
    :options="playerOptions"
    :playsinline="true"
    v-bind="$attrs"
    v-on="$listeners"
  ></video-player>
</template>

<script>
import { videoPlayer } from 'vue-video-player';
import { Decrypt } from '@/utils/utils';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';

export default {
  props: {
    previewObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      playerOptions: {
        height: '360',
        autoplay: false,
        muted: false,
        preload: 'auto',
        language: 'en',
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        controlBar: {
          timeDivider: true, // 当前时间和持续时间的分隔符
          durationDisplay: true, // 显示持续时间
          remainingTimeDisplay: false, // 是否显示剩余时间功能
          fullscreenToggle: true // 是否显示全屏按钮
        }
      }
    };
  },
  components: {
    videoPlayer
  },
  computed: {},
  watch: {
    previewObj: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue && JSON.stringify(newValue) !== '{}') {
          const { url } = newValue.sysKlTree || newValue;
          const suffixArr = url.split('.');
          const len = suffixArr.length;
          const suffix = len && suffixArr[len - 1];
          this.playerOptions.sources = [
            {
              type: `video/${suffix}`,
              src: `${url}?token=${Decrypt(localStorage.token)}`
            }
          ];
          this.$nextTick(() => {
            this.makeImage(url);
          });
        }
      }
    }
  },
  mounted() {
    this.makeImage();
  },
  methods: {
    makeImage(url, callback) {
      const videoWrap = this.$refs.video.$el;
      const video = videoWrap.querySelector('video');
      video.src = url; // url地址 url跟 视频流是一样的
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d'); // 绘制2d
      video.crossOrigin = 'anonymous'; // 解决跨域问题，也就是提示污染资源无法转换视频
      video.currentTime = 1; // 第一帧
      video.oncanplay = () => {
        canvas.width = video.clientWidth; // 获取视频宽度
        canvas.height = video.clientHeight; // 获取视频高度
        // 利用canvas对象方法绘图
        ctx.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        // 转换成base64形式
        this.imgsrc = canvas.toDataURL('image/png'); // 截取后的视频封面
        this.playerOptions.poster = this.imgsrc;
        // eslint-disable-next-line no-unused-expressions
        callback && callback();
      };
    }
  }
};
</script>
<style lang='scss' scoped>
.video {
  width: 100%;
  height: 100%;
  ::v-deep {
    .video-js .vjs-play-progress:before {
      top: -5px;
    }
    .video-js .vjs-big-play-button {
      top: 50%;
      left: 50%;
      width: 34px;
      height: 34px;
      margin: -17px 0 0 -17px;
      border-radius: 50%;
      .vjs-icon-placeholder:before {
        top: -6px;
      }
    }
    .vjs-slider-horizontal .vjs-volume-level:before {
      top: -5px;
    }
    .video-js .vjs-volume-panel.vjs-volume-panel-horizontal:hover {
      //width: 9em;
      transition: width 0.1s;
    }
    //.vjs-custom-skin>.video-js .vjs-volume-level {
    //  background-color: #2483d5;
    //}
    .video-js:hover .vjs-big-play-button,
    .vjs-custom-skin > .video-js .vjs-big-play-button:focus,
    .vjs-custom-skin > .video-js .vjs-big-play-button:active {
      background-color: rgba(0, 0, 0, 0.3);
    }
    .vjs-poster {
      background-size: cover;
    }
    .video-js {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>
