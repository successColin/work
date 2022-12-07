/**
* @name: index
* @author: DELL
* @date: 2021/10/30 15:43
* @description：index
* @update: 2021/10/30 15:43
*/
<!-- 页面 -->
<template>
  <span
      class="iconfont  pic1"
      :class="`${isFlag? 'icon-quxiaoquanping' : 'icon-quanping'}`"
      title="退出全屏"
      @click="doEnterFullScreen"
  ></span>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      isFlag: false
    };
  },

  components: {},

  computed: {},

  mounted() {
    window.addEventListener('resize', this.retunZoom);
  },

  methods: {
    doEnterFullScreen() {
      if (!this.isFlag) {
        this.enterFullscreen();
        this.isFlag = true;
        // console.log('进入全屏');
      } else {
        this.isFlag = false;
        // console.log('退出全屏');
        this.exitFullscreen();
      }
    },
    enterFullscreen() {
      var docElm = document.documentElement;
      //W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      }
      //FireFox
      else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      }
      //Chrome等
      else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      }
      //IE11
      else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    },
    exitFullscreen() {
      //W3C
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      //FireFox
      else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
      //Chrome等
      else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
      //IE11
      else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    },
    retunZoom() {
      const isFull =
          window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (isFull === undefined) {
        this.isFlag = false;
      }
    }
  },
  beforeDestroy() {
    window && window.removeEventListener('resize', this.retunZoom);
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.pic1 {
  cursor: pointer;
}
</style>
