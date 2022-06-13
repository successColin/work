export default {
  props: {},

  data() {
    return {
      totalPage: -1,
      current: 1,
      size: 10,
      listData: [],
      isLoading: false,
      otherHight: 0,
    };
  },

  computed: {
    loadMoreInfo() {
      if (this.isLoading) return 'loading';
      if (this.current === this.totalPage) return 'no-more';
      return 'more';
    },
    menuHeight() {
      const { windowHeight, customBar } = this.$store.state.base.systemInfo;
      const height = windowHeight - customBar;
      return height;
    },
    computedHeight() {
      const { menuHeight, otherHight } = this;
      const listHeight = menuHeight - otherHight - 45;
      return listHeight;
    },
  },

  watch: {},

  methods: {
    clickLoadMore() {
      this.scrolltolower();
    },
    // 下拉加载
    scrolltolower() {
      const { current, totalPage } = this;
      if (current < totalPage) this.getData('loadnext');
    },
  },
};
