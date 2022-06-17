<template>
  <div>
    <!-- #ifndef MP-DINGTALK -->
    <!-- 顶部 -->
    <apiot-navbar :title="title"></apiot-navbar>
    <!-- #endif -->
    <cont-box :title="title"></cont-box>
  </div>
</template>

<script>
import ContBox from './components';

export default {
  data() {
    return {
      title: '知识库'
    };
  },
  mounth() {
    document.body.addEventListener('touchmove', this.p, { passive: false });
  },
  beforeDestroy() {
    document.body.removeEventListener('touchmove', this.p);
  },
  components: {
    ContBox
  },
  methods: {
    p(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
