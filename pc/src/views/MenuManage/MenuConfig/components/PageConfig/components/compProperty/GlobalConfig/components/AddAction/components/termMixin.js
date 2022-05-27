// 条件混入的minxin
import { lambdaArr } from '@/config/index';

export default {
  props: {},
  data() {
    return {
      lambdaArr,
      termObj: '',
    };
  },
  created() {
    this.termObj = this.effectiveConditions.replace(/\\/g, '');
  },
  methods: {},
  watch: {
    termObj: {
      handler(v) {
        this.$emit('update:effectiveConditions', v);
      },
      deep: true,
    },
  },
};
