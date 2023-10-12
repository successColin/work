export default {
  props: {
    // 过滤条件
    filterParam: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      totalPage: -1,
      current: 1,
      size: 10,
      listData: [],
      isLoading: false,
      otherHight: 0,
      searchParam: {},
      keywords: '',
      total: 0,
      processNameArr: [],
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
    // 待我审核，我发起的，抄送给我
    computedHeightList() {
      return this.computedHeight - 45;
    },
    // 我发起的
    computedHeightList2() {
      return this.computedHeight - 45 - 45;
    },
    // 待我审核
    computedHeightList3() {
      return this.computedHeight - 45 - 45 - 25;
    },
  },

  watch: {
    filterParam: {
      handler(newValue) {
        this.searchParam = { ...newValue };
        this.getData();
      },
      immediate: true,
      deep: true,
    },
  },

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
