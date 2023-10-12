// app组件的minxin
export default {
  props: {
    configData: {
      type: Object,
    },
    parentKey: {
      type: String,
    },
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
