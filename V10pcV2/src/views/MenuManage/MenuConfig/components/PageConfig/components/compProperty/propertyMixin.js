import { createUnique } from '@/utils/utils';
import TitleConfig from './PublicComp/TitleConfig';
import PlacehoderConfig from './PublicComp/PlacehoderConfig';
import HelpConfig from './PublicComp/HelpConfig';
import DataSourceConfig from './PublicComp/DataSourceConfig';
import StatusConfig from './PublicComp/StatusConfig';
import WidthConfig from './PublicComp/WidthConfig';

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
    isUser: {
      type: Boolean,
      default: false,
    },
    panelRow: {
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
      return this.relateObj && this.relateObj.compName !== 'QueryMain';
    },
    effectArr() {
      if (this.activeObj.effectDict && this.activeObj.effectDict.length) {
        const arr = this.defaultValueArr.filter((item) => {
          if (this.activeObj.effectDict.includes(item.value)) {
            return true;
          }
          return false;
        });
        return arr;
      }
      return this.defaultValueArr;
    },
  },
  inject: ['isConfig'],

  data() {
    return {};
  },
  components: {
    TitleConfig,
    PlacehoderConfig,
    HelpConfig,
    DataSourceConfig,
    StatusConfig,
    WidthConfig,
  },
  mounted() {},
  methods: {
    // 列表按钮区字典下拉搜索
    enableBtnsSearchChange() {
      // console.log(this.activeObj.enableBtnsSearch, this.relateObj);
      const featuerObj =
        this.relateObj.pageType === 2
          ? this.relateObj.children[0]
          : this.relateObj.children[1];
      const index = featuerObj.rightIndex;
      const btnsArr = featuerObj.children;
      if (this.activeObj.enableBtnsSearch) {
        const compId = createUnique();
        const FilterSelectCol = {
          // ...this.activeObj,
          compName: 'FilterSelectCol',
          compId,
          name: this.activeObj.name,
        };
        FilterSelectCol.compName = 'FilterSelectCol';
        btnsArr.splice(btnsArr.length - index, 0, FilterSelectCol);
        this.activeObj.relateCompId = compId;
      } else {
        const curIndex = btnsArr.findIndex(
          (btn) => btn.compId === this.activeObj.relateCompId,
        );
        if (curIndex !== -1) {
          const leftCount = btnsArr.length - index;
          if (curIndex >= leftCount) {
            featuerObj.rightIndex -= 1;
          }
          btnsArr.splice(curIndex, 1);
          this.activeObj.relateCompId = '';
        }
      }
    },
    // 面板老数据兼容
    setOldPanle() {
      if (
        this.isConfig &&
        !this.activeObj.textPanelId &&
        this.configData[0].paneObj[this.activeObj.compId]
      ) {
        const obj = {
          dialogName: 'PanelDialog',
          id: 0,
          jumpTerm: '',
          name: '',
          panelClassify: 1,
          panelData: [],
          panelFilter: [],
          panelType: 2,
          relationMenuDesignId: 0,
          sysMenuDesignId: 0,
          unique: this.activeObj.compId,
        };
        // this.activeObj.textPanelId = this.activeObj.compId;
        this.$set(this.activeObj, 'textPanelId', this.activeObj.compId);
        this.configData[0].paneObj[this.activeObj.compId] = {
          ...obj,
          ...this.configData[0].paneObj[this.activeObj.compId],
          name: this.configData[0].paneObj[this.activeObj.compId].panelName,
        };
        console.log(
          this.configData[0].paneObj[this.activeObj.compId],
          this.activeObj.compId,
        );
      }
    },
    // 字典有效值更改
    efffectChange() {
      if (Array.isArray(this.fatherObj.form[this.activeObj.compId])) {
        this.fatherObj.form[this.activeObj.compId] = [];
      } else {
        this.fatherObj.form[this.activeObj.compId] = '';
      }
    },
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

      // const placeholderArr = ['请输入', '请选择', '请上传'];

      // if (this.activeObj.placeholder) {
      //   const i = placeholderArr.findIndex(
      //     (item) => this.activeObj.placeholder.indexOf(item) === 0,
      //   );

      //   if (i !== -1) {
      //     this.activeObj.placeholder = `${placeholderArr[i]}${this.activeObj.name}`;
      //   }
      // }
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
