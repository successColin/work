<!-- 页面 -->
<template>
  <transition name="slide-bottom">
    <div class="zoomWrap">
      <div class="audio">
        <div class="audio-controller">
          <i v-show="!isStart"
             class="icon-bofangyinpin iconfont" @click="changeAudioState"></i>
          <i v-show="isStart"
             class="icon-zantingbofangyinpin iconfont" @click="changeAudioState"></i>
        </div>
        <div class="audio-progress">
          <span class="time__current">{{formatTime(currentTime)}}</span>
          <div class="slider-container">
            <div class="slider silder__hook" @click="changeView">
              <div class="slider-progress" :style="getPrecent('width')">
                <div class="progress-buffer"></div>
              </div>
              <div
                  class="slider-runway"
                  @mousedown="startDrag"
                  :style="getPrecent('left')"
              >
                <div class="thumb"></div>
              </div>
            </div>
          </div>
          <span class="time__end">{{formatTime(duration)}}</span>
        </div>
        <div class="audio-volume">
          <i class="iconfont icon-guanbi" @click="handleClose"></i>
        </div>
      </div>
      <audio :src="url"
             style="visibility:hidden"
             ref="audio"
             @timeupdate="timeChange"
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  </transition>
</template>

<script>

export default {
  props: {
    previewObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      url: '',
      duration: 0, // 时间长度
      currentTime: 0, // 播放时间长度
      isStart: false,
      isDrag: false,
      dragCurrentTime: 0, // 拖拽的时间
    };
  },

  components: {},

  computed: {
    getPrecent() {
      return function (key) {
        if (this.isDrag) {
          // eslint-disable-next-line no-mixed-operators
          const precentDrag = this.dragCurrentTime / this.duration * 100;
          return `${key}: ${precentDrag.toFixed(2)}%`;
        }
        // eslint-disable-next-line no-mixed-operators
        const precent = this.currentTime / this.duration * 100;
        return `${key}: ${precent.toFixed(2)}%`;
      };
    },
    formatTime() {
      return function (time) {
        // eslint-disable-next-line no-unused-vars
        const formatTime = null;
        let secs = 0;
        let mins = 0;
        let hours = 0;
        let displayHours;
        const seperator = ':';
        // eslint-disable-next-line radix
        secs = parseInt(time % 60);
        // eslint-disable-next-line radix
        mins = parseInt((time / 60) % 60);
        // eslint-disable-next-line radix
        hours = parseInt(((time / 60) / 60) % 60);
        // eslint-disable-next-line radix,prefer-const
        displayHours = (parseInt(((time / 60) / 60) % 60) > 0);
        secs = (`0${secs}`).slice(-2);
        mins = (`0${mins}`).slice(-2);
        return (displayHours ? `${hours}:` : '') + mins + seperator + secs;
      };
    },
  },

  mounted() {
    this.url = this.previewObj.url || this.previewObj.sysKlTree.url;
    this.$nextTick(() => {
      const { audio } = this.$refs;
      audio.play();
      this.isStart = true;
    });
  },
  destroyed () {
  },
  methods: {
    handleClose() {
      const { audio } = this.$refs;
      audio.pause();
      this.$emit('close-audio');
    },
    startDrag(e) { // 开始拖动移动进度条
      this.isDrag = true;
      this.changePostion(e);
      window.addEventListener('mousemove', this.dragging);
      window.addEventListener('mouseup', this.dragEnd);
    },
    dragging(event) {
      if (!this.isDrag) return;
      this.changePostion(event);
    },
    dragEnd(event) {
      this.isDrag = false;
      this.changePostion(event);
      window.removeEventListener('mouseup', this.dragEnd);
      window.removeEventListener('mousemove', this.dragging);
      const { audio } = this.$refs;
      audio.currentTime = this.dragCurrentTime;
    },
    changePostion(e) { // 改变位置但不改变播放进度
      const silder = document.querySelector('.silder__hook').getBoundingClientRect();
      const { clientX } = e;
      const { left, width } = silder;
      let percent = (clientX - left) / width;
      // 做成判断，如果拖动对象不能越界
      if (clientX < left) percent = 0;
      if (clientX >= (left + width)) percent = 1;
      const currentTime = percent * this.duration;
      this.dragCurrentTime = currentTime;
    },
    changeView(e) { // 点击更改位置
      const { clientX } = e;
      const silder = document.querySelector('.silder__hook').getBoundingClientRect();
      const percent = (clientX - silder.left) / silder.width;
      const currentTime = percent * this.duration;
      this.currentTime = currentTime;
      const { audio } = this.$refs;
      audio.currentTime = currentTime;
    },
    changeAudioState() { // 暂停 == 启动
      this.isStart = !this.isStart;
      const { audio } = this.$refs;
      if (this.isStart) {
        if (this.currentTime >= this.duration) {
          audio.currentTime = 0;
          this.currentTime = 0;
        }
        audio.play();
      } else {
        audio.pause();
      }
    },
    timeChange() { // 播放时间
      const { audio } = this.$refs;
      if (audio) {
        const { duration, currentTime } = audio; // 获取总播放时间, 获取播放进度
        this.duration = duration;
        this.currentTime = currentTime;
        if (currentTime >= duration) {
          this.isStart = false;
        }
      }
    },
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.zoomWrap{
  width: 554px;
  height: 42px;
  color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  margin:0 auto;
  bottom: 60px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.14);
  z-index: 101;
  .audio {
    display: flex;
    align-items: center;
    width: 100%;
    height: 42px;
    color: #fff;
    user-select: none;
    ::v-deep{
      .icon-bofangyinpin, .icon-zantingbofangyinpin{
        color: #BBC3CD;
        font-size: 30px;
        cursor: pointer;
        &:hover{
          color: $--hover-fontColor;
        }
      }
    }
  }

  .slider-container {
    width: 100%;
    margin: 0 1em;
  }

  .slider {
    position: relative;
    width: 100%;
    height: 5px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }

  .slider .slider-progress {
    height: 100%;
    width: 0;
    border-radius: 3px;
    background: #5A80ED;
  }

  .slider .slider-runway {
    position: absolute;
    top: 50%;
    width: 16px;
    height: 16px;
    margin-top: -8px;
    transform: translateX(-50%);
  }

  .slider .slider-runway .thumb {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 12px;
    height: 12px;
    margin: -6px 0 0 -6px;
    background: #5A80ED;
    border-radius: 50%;
    box-sizing: border-box;
  }

  .audio .audio-controller {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 42px;
    height: 100%;
    border-right: 1px solid #e9e9e9;
    box-sizing: border-box;
  }

  .audio-controller .fa {
    cursor: pointer;
  }

  .audio .audio-progress {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 470px;
    height: 100%;
    font-size: 12px;
  }

  .audio-progress .time__current,
  .audio-progress .time__end {
    display: inline-block;
    width: 4.5em;
    text-align: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }

  .audio .audio-volume {
    display: flex;
    align-items: center;
    width: 42px;
    height: 100%;
    justify-content: space-around;
    .icon-guanbi{
      color: #BBC3CD;
      font-size: 16px;
      cursor: pointer;
      &:hover{
        color: $--hover-fontColor;
      }
    }
  }

  .audio-volume .icon__volume {
    margin-right: 1em;
  }

  .audio-volume .slider {
    height: 3px;
  }

  @-webkit-keyframes fa-spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg)
    }

    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg)
    }
  }

  @keyframes fa-spin {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg)
    }

    100% {
      -webkit-transform: rotate(359deg);
      transform: rotate(359deg)
    }
  }

  .fa-rotate-90 {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=1)";
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    transform: rotate(90deg)
  }

  .fa-rotate-180 {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";
    -webkit-transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    transform: rotate(180deg)
  }

  .fa-rotate-270 {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=3)";
    -webkit-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    transform: rotate(270deg)
  }

  .fa-flip-horizontal {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)";
    -webkit-transform: scale(-1, 1);
    -ms-transform: scale(-1, 1);
    transform: scale(-1, 1)
  }

  .fa-flip-vertical {
    -ms-filter: "progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)";
    -webkit-transform: scale(1, -1);
    -ms-transform: scale(1, -1);
    transform: scale(1, -1)
  }

  :root .fa-rotate-90,
  :root .fa-rotate-180,
  :root .fa-rotate-270,
  :root .fa-flip-horizontal,
  :root .fa-flip-vertical {
    filter: none
  }

  .fa-stack {
    position: relative;
    display: inline-block;
    width: 2em;
    height: 2em;
    line-height: 2em;
    vertical-align: middle
  }

  .fa-stack-1x,.fa-stack-2x {
    position: absolute;
    left: 0;
    width: 100%;
    text-align: center
  }

  .fa-stack-1x {
    line-height: inherit
  }

  .fa-stack-2x {
    font-size: 2em
  }

  .fa-inverse {
    color: #fff
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0
  }

  .sr-only-focusable:active,.sr-only-focusable:focus {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto
  }

}
</style>
