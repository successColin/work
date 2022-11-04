import { getSubscript } from '@/api/menuConfig';

export default {
  data() {
    return {
      panelHornMarkMenus: [], // 角标菜单
      hornMarkNums: { // 角标
        sysNotification: '' // 消息流程角标
      },
      fixedMenuMark: {},
      initHornMarkNums: false
    };
  },

  computed: {
    // 获取有查看权限菜单
    getMenuHasPer() {
      return this.$store.state.menu.menusObj || {};
    },
  },

  methods: {
    async getSubscriptMenu() {
      this.initHornMarkNums = false;
      const panelHornMarkMenus = [];
      let sysNotification = false;
      Object.keys(this.getMenuHasPer).forEach((key) => {
        const obj = this.getMenuHasPer[key];
        if (obj.EnableCornerMarker === 1 && obj.panelHornMarkId) {
          const needPermissions = obj.hornMarkNeedPermissions ? 1 : 0;
          panelHornMarkMenus.push(`${obj.id}-${obj.panelHornMarkId}-${needPermissions}`);
        }
        if (
          obj.EnableCornerMarker === 1 &&
          obj.type === 2 &&
          obj.routeName === 'sysNotification'
        ) {
          sysNotification = true;
        }
      });
      this.panelHornMarkMenus = panelHornMarkMenus;
      this.hornMarkNums.sysNotification = sysNotification;
      if (this.panelHornMarkMenus.length) {
        this.initHornMarkNums = true;
        this.getSubscriptNumberFun();
      }
    },
    async getSubscriptNumberFun() {
      const res = await getSubscript({ compIds: this.panelHornMarkMenus.join() });
      this.hornMarkNums = {
        ...this.hornMarkNums,
        ...res
      };
    }
  },
};
