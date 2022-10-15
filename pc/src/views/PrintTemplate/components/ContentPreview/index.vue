<template>
  <div class="printClass">
    <!-- 文档类 -->
    <doc-type
      v-bind="$attrs"
      v-on="$listeners"
      ref="printPre"
      v-if="globalConfig.type === 1"
      :globalConfig="globalConfig"
    ></doc-type>
    <!-- 内容类 -->
    <content-type
      v-bind="$attrs"
      v-on="$listeners"
      ref="printPre"
      v-if="globalConfig.type === 2"
      :globalConfig="globalConfig"
    ></content-type>
  </div>
</template>

<script>
import DocType from './DocType';
import ContentType from './ContentType';

export default {
  props: {
    globalConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: { DocType, ContentType },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.printClass {
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
