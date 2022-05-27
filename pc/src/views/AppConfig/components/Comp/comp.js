// app组件的minxin
export default {
  props: {
    config: {
      type: Object,
    },
    activeObj: {
      type: Object,
    },
  },
  data() {},
  created() {},
  methods: {
    selectActive() {
      this.$bus.$emit('selectActive', this.config);
    },
  },
  watch: {},
};
