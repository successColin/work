export default {
  props: {
    // 按钮列表样式 1-无背景；2-主题色背景；3-自定义颜色
    type: {
      type: [Number, String],
      default: 1,
    },
    // 按钮一排显示几个
    btnNum: {
      type: Number,
      default: 4,
    },
    // 按钮列表
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  data() {
    return {
      loadingList: {},
      show: false,
    };
  },

  computed: {
    getGridTemplateColumns() {
      const { showBtns = [] } = this.btnList;
      const len = showBtns.length;
      if (len === 0) return '';

      let gridTemplateColumns = '';
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < len; i++) {
        if (i === 0) gridTemplateColumns = '1fr';
        if (i !== len - 1) {
          gridTemplateColumns = `${gridTemplateColumns} 1px 1fr`;
        }
      }

      return gridTemplateColumns;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 显示的按钮数
    btnList() {
      const { btnNum, list, type } = this;
      let showBtns = [];
      const hideBtns = [];
      if (list.length > btnNum) {
        list.forEach((item, index) => {
          if (index < btnNum - 1) showBtns.push(item);
          else hideBtns.push(item);
        });
      } else {
        showBtns = [...list];
      }
      if (hideBtns.length > 0) {
        let iconColor = '';
        if (type === 1 || type === 3) {
          iconColor = this.$store.state.base.themeColor;
        }
        showBtns.push({
          name: '更多',
          compId: 'more',
          iconColor,
          iconFont: 'appIcon-gengduoanniu',
          iconType: 1,
        });
      }
      return { showBtns, hideBtns };
    },
  },

  methods: {
    // 设置按钮的loading状态
    setLoading(compId, status) {
      this.loadingList[compId] = status;
    },
    clickBtn(e, type) {
      console.log('clickBtn');
      // 如果是更多按钮
      if (e.compId === 'more') {
        this.show = !this.show;
        return;
      }
      if (type === 'hideBtn') this.show = false;
      const obj = {};
      obj[e.compId] = true;
      this.loadingList = { ...this.loadingList, ...obj };
      this.$emit('click', e);
    },
  },
};
