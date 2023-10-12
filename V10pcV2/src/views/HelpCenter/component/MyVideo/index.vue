<!--
 * @Descripttion: 视频封装
 * @Author: ytx
 * @Date: 2021-06-29 18:01:33
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:01:33
-->
<template>
  <video-player
    class="myVideo"
    v-bind="$attrs"
    v-on="$listeners"
  ></video-player>
</template>

<script>
import { videoPlayer } from 'vue-video-player';
import 'video.js/dist/video-js.css';
import 'vue-video-player/src/custom-theme.css';

export default {
  data() {
    return {};
  },
  components: {
    videoPlayer
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.myVideo {
  ::v-deep {
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
