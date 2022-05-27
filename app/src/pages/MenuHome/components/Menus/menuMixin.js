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
    // 可查看的菜单
    menuList() {
      const { menuArr } = this.modeObj;
      const { supper } = this.$store.state.menu;
      if (supper) return menuArr;
      return menuArr.filter((item) => {
        const canSeePer =
          item.permission.find((per) => per.permissionItemId === 1) || {};
        return canSeePer.check === '1';
      });
    },
  },

  methods: {
    clickMenu(menu) {
      this.$emit('clickMenu', menu);
    },
  },
};
