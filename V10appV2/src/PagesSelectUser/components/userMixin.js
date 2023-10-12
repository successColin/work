import { getUserList } from '@/api/pagesSelectUser.js';

export default {
  inject: ['GetGlobalParam'],
  props: {},

  data() {
    return {
      totalPage: -1,
      current: 1,
      size: 20,
      listData: [],
      otherParam: {},
    };
  },

  computed: {},

  methods: {
    // 重新加载
    loadUsersList() {
      if (this.mode === 'data') return;
      this.getUserList();
    },
    // 加载下一页
    loadNextUsersList() {
      if (this.mode === 'data') return;
      const { current, totalPage } = this;
      if (current < totalPage) this.getUserList('loadnext');
    },
    async getUserList(loadType = '') {
      try {
        let page = this.current;
        let pageSize = this.size;
        if (loadType === 'loadnext') {
          this.current += 1;
          page = this.current;
        } else if (loadType === 'reload') {
          page = 1;
          pageSize *= page;
        } else {
          this.current = 1;
          page = 1;
        }
        const globalParam = this.GetGlobalParam();
        const params = {
          current: page,
          size: pageSize,
          orders: [{ asc: true, column: '' }],
          ...globalParam,
          ...this.otherParam,
        };
        const result = await getUserList(params);
        let list = null;
        if (loadType === 'loadnext') {
          list = this.listData.concat(result.records);
        } else {
          this.totalPage = Math.ceil(result.total / pageSize);
          list = result.records;
        }

        this.listData = [...list];
        this.isLoading = false;
        uni.stopPullDownRefresh();
        if (loadType !== 'reload') {
          this.$store.commit('setUserObj', result.records);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
