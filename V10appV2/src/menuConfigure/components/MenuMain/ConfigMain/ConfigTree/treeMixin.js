export default {
  props: {},

  data() {
    return {
      listData: [], // 当前节点列表
      isLoading: false, // 是否加载
      rootPath: [], // 树节点点击路径
      treeNodes: {}, // 树节点对应的子节点
      currentNodeId: null, // 当前节点id
      isThisLevel: 1, // 获取节点时类型：1=根节点；2=子节点；3=树节点搜索

      current: 1, // 当前页面，用于树查询
    };
  },

  computed: {
    // 树搜索时显示的高度
    treeHeight() {
      if (this.rootPath.length > 0) {
        return this.computedHeight - this.$apiot.rpx2px(88);
      }
      return this.computedHeight;
    },
  },

  methods: {
    // 最顶级节点的查询条件
    replaceFirstTerm(params, filterArr) {
      if (!filterArr.length) {
        return;
      }
      let multiDataSource = JSON.parse(params.multiDataSource);
      filterArr.forEach((filter) => {
        multiDataSource.findIndex((data, i) => {
          if (filter.tableInfo.nameAlias) {
            if (data.tableInfo.nameAlias === filter.tableInfo.nameAlias) {
              data.filterTermType = filter.filterTermType;
              data.filterTermStr = filter.filterTermStr;
              data.filterTermSql = filter.filterTermSql;
              data.termParams = filter.termParams;
              return true;
            }
          } else if (data.tableInfo.tableName === filter.tableInfo.tableName) {
            data.filterTermType = filter.filterTermType;
            data.filterTermStr = filter.filterTermStr;
            data.filterTermSql = filter.filterTermSql;
            data.termParams = filter.termParams;
            return true;
          }
          return false;
        });
      });
      // 后端要求截取过滤条件个数来不查询
      if (params.dataType === 1) {
        multiDataSource = multiDataSource.slice(0, 1);
      }
      if (params.dataType === 2) {
        multiDataSource = multiDataSource.slice(0, 2);
      }
      params.multiDataSource = JSON.stringify(multiDataSource);
    },
    replaceTerm(params, filterArr, flag = true) {
      if (!filterArr.length) {
        return;
      }
      const multiDataSource = JSON.parse(params.multiDataSource);
      filterArr.forEach((filter) => {
        if (filter.enableChildSearch === 2 && flag) {
          return false;
        }
        multiDataSource.findIndex((data) => {
          if (filter.tableInfo.nameAlias) {
            if (data.tableInfo.nameAlias === filter.tableInfo.nameAlias) {
              data.filterTermType = filter.filterTermType;
              data.filterTermStr = filter.filterTermStr;
              data.filterTermSql = filter.filterTermSql;
              data.termParams = filter.termParams;
              return true;
            }
          } else if (data.tableInfo.tableName === filter.tableInfo.tableName) {
            data.filterTermType = filter.filterTermType;
            data.filterTermStr = filter.filterTermStr;
            data.filterTermSql = filter.filterTermSql;
            data.termParams = filter.termParams;
            return true;
          }
          return false;
        });
      });
      params.multiDataSource = JSON.stringify(multiDataSource);
    },
  },
};
