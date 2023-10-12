export default {
  props: {
    modeObj: {
      type: Object,
      default() {
        return {
          // 是否显示title
          enableGroupName: 1,
          // title
          name: '',
          // 菜单数组
          menuArr: [
            {
              // 菜单名称
              menuName: '',
              // 图标
              icon: {
                color: '',
                icon: '', // 字体图标
                imageUrl: '', // 自定义图标
              },
              // 背景色
              bgColor: '',
            },
          ],
          // 展示风格 1-图标；2-图片
          showStyle: 1,
        };
      },
    },
  },

  computed: {
    // 获取有查看权限菜单
    getMenuHasPer() {
      return this.$store.state.menu.menusObj || {};
    },
    // 可查看的菜单
    menuList() {
      const { menuArr } = this.modeObj;
      const { supper } = this.$store.state.menu;
      if (supper) return menuArr;

      const { getMenuHasPer } = this;
      return menuArr.filter((item) => getMenuHasPer[item.id]);
    },
  },

  methods: {
    clickMenu(menu) {
      this.$emit('clickMenu', menu);
    },
  },
};
