export default {
  props: {
    menuHeight: Number,
  },

  inject: ['getMenuPane'],

  data() {
    return {
      searchInfo: null,
      listHeight: 0,
    };
  },

  computed: {
    // 计算高度
    allComp() {
      return this.getMenuPane().compObj;
    },
    // 计算tab区按钮的高度
    tabsBtnHight() {
      const { showTabBtn, children } = this.currentTab;
      if (!showTabBtn) return 0;
      const { allComp } = this;
      const elements = children[0].children;
      const btnList = elements.filter((el) => {
        const comp = allComp[el.compId] || {};
        el = { ...el, ...comp };
        return el.canShow && el.compName !== 'SearchCondition';
      });
      // 128rpx = 20*2rpx(边距) + 88rpx(高度)底部按钮区的高度
      if (btnList.length > 0) return this.$apiot.rpx2px(128);
      return 0;
    },
    computedHeight() {
      const { menuHeight, tabsBtnHight } = this;
      let listHeight = menuHeight - tabsBtnHight;
      if (this.htmlConfig.showTab) listHeight -= 45;
      if (this.hasSearch) listHeight -= 44;
      if (this.htmlConfig.isSelectDataBox) listHeight -= 41;
      return listHeight;
    },
    // 搜索
    searchComp() {
      const { funcConfig } = this;
      const { children } = funcConfig;
      const btnArea = children.find((item) => item.areaType === 2) || {
        children: [],
      };
      return btnArea.children.find((el) => el.compName === 'SearchCondition');
    },
    hasSearch() {
      return !!this.searchComp;
    },
    featureArr() {
      return {
        compId: this.funcConfig.compId,
        form: this.currentData,
        children: this.elementList,
        relateTableArr: this.funcConfig.relateTableArr,
      };
    },
  },

  methods: {
    // 切换树和列表
    switchType(type) {
      this.$emit('switchType', type);
    },
  },
};
