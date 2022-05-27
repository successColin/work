<template>
  <div
    class="notice comp"
    @click.stop="selectActive"
    :class="[{ borderLight: config.compId === activeObj.compId }]"
  >
    <p>{{ config.name }}</p>
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
  height: 74px;
  p {
    text-align: center;
    line-height: 74px;
    font-size: 13px;
    font-weight: 400;
    color: #aaaaaa;
  }
}
</style>
