<template>
  <div
    class="notice comp"
    @click.stop="selectActive"
    :class="[{ borderLight: config.compId === activeObj.compId }]"
  >
    <p>公告栏</p>
  </div>
</template>

<script>
import compMixin from '../comp';

export default {
  mixins: [compMixin],
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../comp.scss';
.notice {
  height: 42px;
  p {
    text-align: center;
    line-height: 42px;
    font-size: 13px;
    font-weight: 400;
    color: #aaaaaa;
  }
}
</style>
