import mpMixin from '@/mixin/mpMixin';

export default {
  props: {
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
    element: Object,
  },

  mixins: [mpMixin],

  data() {
    return {
      elValue: '',
    };
  },

  computed: {
    compShow() {
      // const { canShow, singleStatus } = this.element;
      // if (!canShow) return false;
      return this.element.canShow;
    },
  },

  watch: {
    value(newValue) {
      this.elValue = newValue;
    },
  },

  methods: {
    valueChang(value) {
      const { element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = value;
      this.$emit('change', valueObj, element);
    },
  },

  mounted() {
    this.elValue = this.value;
  },
};
