<template>
  <div class="printClass">
    <!-- 文档类 -->
    <doc-type
      ref="printPre"
      v-if="type === 1"
      :printParams="printParams"
      :rows="rows"
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
    },
    previewObj() {
      return this.printParams.previewObj;
    },
    rows() {
      const { celldataList = [] } = this.previewObj;
      if (celldataList.length === 0) return [];

      const rows = {};
      for (let index = 0, len = celldataList.length; index < len; index += 1) {
        const item = celldataList[index];
        const { r, v } = item;
        const V = { ...item, ...v };
        if (rows[r]) rows[r].push(V);
        else rows[r] = [V];
      }

      return rows;
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
