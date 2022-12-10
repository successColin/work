<template>
  <!-- 页脚 -->
  <div class="printFooter" v-html="html" :style="footerStyle"></div>
</template>

<script>
import { formatDate } from '@/utils/utils';

export default {
  props: {
    globalConfig: {
      type: Object,
      default() {
        return {};
      }
    },
    pageNum: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      footerStyle: {
        position: 'absolute',
        zIndex: 999,
        bottom: '10px',
        left: '20px',
        width: 'calc(100% - 40px)'
      }
    };
  },
  components: {},
  computed: {
    pageFooter() {
      return this.globalConfig.pageFooter;
    },
    html() {
      const html = this.pageFooter;
      if (!html) return;

      let str = '';
      const dataReg = /<message(V|v)ar vartype=("|'|)date("|'|)>当前日期<\/message(V|v)ar>/g;
      str = html.replace(dataReg, () => {
        const data = formatDate(new Date(), 'yyyy-MM-dd');
        return ` ${data} `;
      });
      // 当前时间
      const timeReg = /<message(V|v)ar vartype=("|'|)time("|'|)>当前时间<\/message(V|v)ar>/g;
      str = str.replace(timeReg, () => {
        const data = formatDate(new Date(), 'hh:mm:ss');
        return ` ${data} `;
      });
      // 页码
      const pageNum = /<message(V|v)ar vartype=("|'|)pageNum("|'|)>页码<\/message(V|v)ar>/g;
      str = str.replace(pageNum, () => this.pageNum);

      return str;
    }
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
</style>
