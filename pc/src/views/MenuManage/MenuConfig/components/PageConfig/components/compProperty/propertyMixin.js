export default {
  props: {
    activeObj: {
      type: Object,
    },
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
    isSelect: {
      type: Boolean,
    },
    // 所有组件平坦化
    getAllcheck: {
      type: Object,
    },
  },
  computed: {
    fatherObj() {
      return this.getParentObj(1);
    },
    // 爷爷节点，上面有数据源关系的绑定
    relateObj() {
      return this.getParentObj(2);
    },
    // 获取所有父节点 0 代表本身 1 代表父对象 2 代表爷爷对象
    getParentObj() {
      return (i, compId = this.activeObj.compId) =>
        this.getParentId(this.configData, compId)[i];
    },
    // 关系数组，默认添加主表的id
    relateTableArr() {
      return [
        {
          relateName: '主表',
        },
        ...this.relateObj.relateTableArr,
      ];
    },
    isShow() {
      return this.relateObj.compName !== 'QueryMain';
    },
  },
  inject: ['isConfig'],

  created() {},

  mounted() {},
  methods: {
    // 名字的失焦恢复
    nameFocus() {
      this.activeObj.backName = this.activeObj.name;
    },
    nameBlur() {
      if (!this.activeObj.name) {
        this.activeObj.name = this.activeObj.backName;
      }
      if (this.fatherObj.rules) {
        const ruleArr = this.fatherObj.rules[this.activeObj.compId];
        if (ruleArr && ruleArr.length) {
          const index = ruleArr.findIndex(
            (item) => item.flag === 'requiredRule',
          );
          if (index !== -1) {
            ruleArr[index].message = `${this.activeObj.name}不能为空`;
          }
        }
      }

      const placeholderArr = ['请输入', '请选择', '请上传'];

      if (this.activeObj.placeholder) {
        const i = placeholderArr.findIndex(
          (item) => this.activeObj.placeholder.indexOf(item) === 0,
        );

        if (i !== -1) {
          this.activeObj.placeholder = `${placeholderArr[i]}${this.activeObj.name}`;
        }
      }
      // }
    },
    // 数据源初始化为当前表
    initMainTable() {
      this.activeObj.dataSource.tableName = this.relateObj.tableInfo.tableName;
    },
    getParentId(list, compId) {
      let arrRes = [];
      if (list.length === 0) {
        if (compId) {
          arrRes.push(list);
        }
        return arrRes;
      }
      const rev = (data, nodeId) => {
        const { length } = data.children;
        for (let i = 0; i < length; i += 1) {
          const node = data.children[i];
          if (node.compId === nodeId) {
            arrRes.push(node);
            if (data.compId) {
              rev(list[0], data.compId);
            }
            break;
          } else if (node.children && node.children.length) {
            rev(node, nodeId);
          }
        }
        return arrRes;
      };
      arrRes = rev(list[0], compId);
      return arrRes;
    },
  },
};
