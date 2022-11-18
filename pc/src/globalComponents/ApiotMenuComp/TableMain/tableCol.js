export default {
  props: {
    // 自身配置信息
    configData: {
      type: [Array, Object],
    },
    // 当前选中的
    activeObj: {
      type: [Array, Object],
    },
    // 爹
    parent: {
      type: Object,
    },
    // 爷爷
    grandFather: {
      type: Object,
    },
    // 是否在表格区
    isTable: {
      type: Boolean,
      default: true,
    },
    showType: {
      type: Object,
      default() {
        return {};
      },
    },
    // 区域的值
    areaData: {
      type: Object,
    },
    // 列表数据
    tableData: {
      type: Array,
    },
    // 当前激活的cell
    showCell: {
      type: String,
      default: '',
    },
    // 是否有下拉框时间框等打开
    showVisible: {
      type: Boolean,
      default: false,
    },
    // id 字段的组件id
    getIdCompId: {
      type: String,
      default: '',
    },
    // 多选数组
    multiEntityArr: {
      type: Array,
    },
  },
  inject: ['isConfig', 'resolveFormula'],
  data() {
    return {
      showIndex: -1,
    };
  },
  created() {
    // 要在表单的数据初始化前已经初始化完成
    if (!this.isConfig) {
      this.initFormula();
    }
  },
  mounted() {},
  methods: {
    visibleChange(v) {
      this.$emit('update:showVisible', v);
      if (!v) {
        this.$emit('isChangeShowCell', window.event.target);
      }
    },
    valueChange(index) {
      this.tableData[index].notChange = false;
      // console.log(this.tableData);
    },
    // 组件加载时，初始化公式
    initFormula() {
      if (
        this.configData.defaultValueType === 2 &&
        this.configData.formulaContent
      ) {
        this.parent.form[`${this.configData.compId}`] = this.resolveFormula(
          true,
          this.configData.formulaContent,
        );
      }
    },
  },

  computed: {
    showInput() {
      if (this.isConfig) {
        return true;
      }
      if (this.configData.canShow) {
        return true;
      }
      return false;
    },
    // 生效字典数组
    effectArr() {
      if (
        this.configData.effectDict &&
        this.configData.effectDict.length &&
        this.getDictArr
      ) {
        const arr = this.getDictArr.filter((item) => {
          if (this.configData.effectDict.includes(item.value)) {
            return true;
          }
          return false;
        });
        return arr;
      }
      if (this.getDictArr) {
        return this.getDictArr;
      }
      return [];
    },
  },

  watch: {
    'configData.singleStatus': {
      handler(v) {
        if (!this.isConfig) {
          return;
        }
        if (v === 1 || v === 2) {
          this.configData.canShow = true;
        }
        if (v === 4) {
          this.configData.canShow = false;
        }
        if (v === 2) {
          this.configData.canReadonly = true;
        }
      },
      immediate: true,
    },
  },
};
