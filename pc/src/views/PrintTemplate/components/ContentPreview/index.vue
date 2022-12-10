<template>
  <div class="printClass">
    <!-- 文档类 -->
    <doc-type
      ref="printPre"
      v-if="type === 1"
      :printParams="printParams"
    ></doc-type>
    <!-- 内容类 -->
    <content-type
      ref="printPre"
      v-if="type === 2"
      :printParams="printParams"
    ></content-type>
  </div>
</template>

<script>
import DocType from './DocType';
import ContentType from './ContentType';

export default {
  props: {
    printParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: { DocType, ContentType },
  computed: {
    type() {
      const { type } = this.printParams.globalConfig;
      return type;
    }
  },
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
