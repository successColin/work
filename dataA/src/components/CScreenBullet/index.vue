/**
* @name: index
* @author: DELL
* @date: 2022/1/25 16:23
* @description：index
* @update: 2022/1/25 16:23
*/
<!-- 页面 -->
<template>
  <div class="cModalWrap" v-if="visible" @click="handleCancel">
    <div
        @click="handleClick"
        class="contentWrap"
        :style="`width:${width}px;height:${height}px;`"
    >
      <iframe :src="iframeUrl" :frameborder="0" :width="width" :height="height"></iframe>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/bus';

export default {
  props: {
    iframeUrl: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    },
    width: {
      type: Number,
      default() {
        return 600;
      }
    },
    height: {
      type: Number,
      default() {
        return 400;
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    handleClick(e) {
      e.stopPropagation();
    },
    handleCancel(e) {
      e.stopPropagation();
      Bus.$emit('modalOpera', {visible: false, url: '', otherParams: {}});
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.cModalWrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.5);
  z-index: 99999999;

  .contentWrap {
    &>iframe{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
