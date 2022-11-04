export default {
  props: {},

  inject: ['selectDataConfig'],

  data() {
    return {
      searchInfo: null,
      listHeight: 0,
      // 数据选择框是否要进行切换3=列表，树；5=列表，多表树
      canShowSwitchType: [3, 5],
    };
  },

  computed: {
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
    // 是否可以编辑
    canDesign() {
      if (this.htmlConfig.isSelectDataBox) return true;
      return this.htmlConfig.currentBatchAreaCompId === this.funcConfig.compId;
    },
    // 用于匹配列表、树是否选中的字段，业务字段没有
    checkFlagId() {
      return this.htmlConfig.selectDataBoxRelateColumnName || 'id';
    },
    // 获取选中唯一标准控件
    getCheckFlagComp() {
      const { elementList, checkFlagId } = this;
      return elementList.find((item) => item.name === checkFlagId) || '';
    },
    alreadyCheckList() {
      const selectDataConfig = this.selectDataConfig();
      return selectDataConfig.alreadyCheckList || [];
    },
  },

  watch: {
    alreadyCheckList: {
      handler() {
        console.log('alreadyCheckList======================================');
        this.checkListFormat();
      },
      immediate: true,
      deep: true,
    },
    checkList: {
      handler() {
        console.log('checkList===============================');
        console.log(this.checkList);
        const configData = { ...this.configData };
        const { checkList } = configData;

        if (!checkList) configData.checkList = {};
        const { funcConfig } = this;
        configData.checkList[funcConfig.compId] = this.checkList;

        this.$emit('update:configData', configData);
      },
      deep: true,
    },
  },

  methods: {
    // 选中的数据进行删除
    deleteChecked({ list, flag }) {
      if (flag !== this.funcConfig.compId) return;
      this.checkList = list;
    },
    checkListFormat() {
      if (!this.canDesign) return;
      // const { getCheckFlagComp, alreadyCheckList } = this;
      let selectArry = [];
      // if (getCheckFlagComp && alreadyCheckList.length > 0) {
      //   selectArry = alreadyCheckList.map((item) => {
      //     item[getCheckFlagComp.compId] =
      //       item[getCheckFlagComp.dataSource.columnName];
      //     return item;
      //   });
      // }

      const { configData = {} } = this;
      const { checkList: checkObj = {} } = configData;
      Object.keys(checkObj).forEach((key) => {
        selectArry = selectArry.concat(checkObj[key]);
      });
      console.log(selectArry);
      this.checkList = selectArry;
    },
    // 切换树和列表
    switchType(type) {
      this.$emit('switchType', type);
    },
  },
};
