export default {
  props: {},

  inject: ['selectDataConfig'],

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
    // 是否可以编辑
    canDesign() {
      if (this.htmlConfig.isSelectDataBox) return true;
      return this.htmlConfig.currentBatchAreaCompId === this.funcConfig.compId;
    },
    alreadyCheckList() {
      const selectDataConfig = this.selectDataConfig();
      return selectDataConfig.alreadyCheckList || [];
    },
  },

  watch: {
    checkList() {
      this.$emit(
        'update:configData',
        this.getNewConfigData(this.currentData, this.checkList)
      );
    },
  },

  methods: {},
};
