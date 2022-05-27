<!--
 * @Descripttion: 弹出视频
 * @Author: ytx
 * @Date: 2021-06-29 18:00:39
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:00:39
-->
<template>
  <apiot-dialog
    v-on="$listeners"
    v-bind="$attrs"
    width="68%"
    :isShowSure="false"
    :title="dialogTitle"
  >
    <my-video
      ref="videoPlayer"
      v-if="visibleState"
      class="dialogPlay"
      :options="playerOptions"
      :playsinline="true"
    ></my-video>
  </apiot-dialog>
</template>

<script>
import MyVideo from '@/views/HelpCenter/component/MyVideo';

export default {
  props: {
    // visible: {
    //   type: Boolean,
    //   default: false
    // },
    videoOption: {
      type: Object,
      default: () => {}
    },
    visibleState: {
      type: Boolean,
      default: () => {}
    }
  },
  data() {
    return {
      playerOptions: {
        autoplay: true,
        loop: true, // 使视频一结束就重新开始。
        muted: true, // 默认情况下将静音任何音频。
        // fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // aspectRatio: '4:3',
        language: 'zh-CN',
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        flash: { hls: { withCredentials: false } }, // 可以使用rtmp视频
        html5: { hls: { withCredentials: false } }, // 可以使用m3u8视频
        playbackRates: [0.5, 1, 1.5, 2],
        noUITitleAttributes: true
      },
      dialogTitle: ''
    };
  },
  components: {
    MyVideo
  },
  computed: {},
  watch: {
    videoOption: {
      deep: true,
      handler(v) {
        // console.log(v);
        this.dialogTitle = `${v.name}`;
        this.playerOptions.sources = [
          {
            type: v.videoType,
            src: v.url
          }
        ];
      }
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.dialogPlay {
  width: 100%;
  height: 500px;
}
</style>
