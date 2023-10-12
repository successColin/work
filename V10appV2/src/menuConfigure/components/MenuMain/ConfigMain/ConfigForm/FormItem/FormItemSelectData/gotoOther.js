export default {
  computed: {
    // 数据选择框内容字体颜色
    contentColor() {
      console.log('contentColor================');
      const { relateType, textPanelId } = this.element;
      console.log(this.element);
      const color = this.$store.state.base.themeColor;

      let showColor = '';
      if (relateType === 1 && textPanelId) {
        showColor = color;
      } else if (relateType === 2 && this.jumpMenu.length > 0) {
        showColor = color;
      }
      return showColor;
    },
  },
  methods: {},
};
