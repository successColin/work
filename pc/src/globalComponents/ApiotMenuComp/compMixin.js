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
    // 是否有触发器的配置
    hasTriggerComp: {
      type: Object,
    },
    // 爹
    parent: {
      type: Object,
    },
    // 爷爷
    grandFather: {
      type: Object,
    },
    // 当前下标
    i: {
      type: Number,
    },
    // 是否在表单区
    isForm: {
      type: Boolean,
      default: false,
    },
    // 是否在查询区
    isQuery: {
      type: Boolean,
      default: false,
    },
    // 是否在卡片区
    isCard: {
      type: Boolean,
      default: false,
    },
    isCardOpeBtn: {
      type: Boolean,
      default: false,
    },
    // 是否在表格区
    isTable: {
      type: Boolean,
      default: false,
    },
    // 是否在树区
    isTree: {
      type: Boolean,
      default: false,
    },
    showType: {
      type: Object,
      default() {
        return {};
      },
    },
    nodeConfig: {
      // 流程中组件的显示隐藏的控制
      type: Object,
      default() {
        return {};
      },
    },
    // 字段为id
    getIdCompId: {
      type: String,
      default: '',
    },
    // 卡片区数据
    cardData: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  inject: ['isConfig', 'resolveFormula', 'getFatherPanel'],
  data() {
    return {
      menuMain: null, // menumain 的vuedom
      hasReset: false,
    };
  },
  created() {
    // 要在表单的数据初始化前已经初始化完成
    if (!this.isConfig) {
      this.initFormula();
    }
    if (this.configData.buttonType === 11) {
      this.$store.commit('changeIsNoodQuery', true);
    }
  },
  mounted() {
    this.menuMain = this.getMenuMain();
    if (this.isConfig) {
      this.resetData();
    }
  },
  methods: {
    // 开始初始化
    resetData() {
      if (this.hasReset) {
        return false;
      }
      this.hasReset = true;
      if (
        this.parent.form &&
        Object.prototype.hasOwnProperty.call(
          this.parent.form,
          this.configData.compId,
        )
      ) {
        return false;
      }
      if (this.curCompType === 2 && !this.parent.form[this.configData.compId]) {
        this.$set(this.parent.form, this.configData.compId, '');
        // 数据单选框，数据多选框，label的显示值赋值
        if (
          this.configData.compType === 6 ||
          this.configData.compType === 7 ||
          this.configData.compType === 15
        ) {
          this.$set(this.parent.form, `${this.configData.compId}_`, '');
        }
      }

      const obj = JSON.parse(
        JSON.stringify(this.parent.children.splice(this.i, 1)[0]),
      );
      this.parent.children.splice(this.i, 0, obj);
      // 存在值是id的时候不选中
      if (this.configData.labelNotChange) {
        if (this.grandFather) {
          this.$bus.$emit('changeCurActiveObj', this.grandFather);
        }
        return false;
      }
      // 按钮的一些特殊处理
      if (this.configData.compType === 5) {
        obj.btnTypesArr = this.btnTypesArr;
        obj.isTabBtn = this.isTabBtn;
      }

      // pc 卡片区lable撑满整行
      if (
        this.$route.query.isApp !== '1' &&
        this.grandFather &&
        this.grandFather.compName === 'CardMain'
      ) {
        if (this.configData.compType === 15) {
          obj.width = '100%';
        }
      }
      // app 上组件撑满整行
      if (this.$route.query.isApp === '1') {
        obj.width = '100%';
        // app 上按钮多了两种类型
        if (this.configData.compType === 5) {
          if (this.isTabBtn) {
            obj.btnTypesArr.push(9);
            obj.btnTypesArr.push(10);
          }
          if (
            this.grandFather &&
            this.grandFather.compName === 'CardMain' &&
            !this.isCardOpeBtn
          ) {
            obj.btnTypesArr.push(9);
            obj.btnTypesArr.push(10);
          }
        }
        if (this.configData.compType === 15) {
          this.$nextTick(() => {
            this.configData.font.size = 0;
          });
        }
      }
      // 18 分割线无需类型
      // if ([18].includes(obj.compType)) {
      //   delete obj.compType;
      // }
      this.$bus.$emit('changeCurActiveObj', obj);
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
    // 删除
    delChild() {
      // console.log(this.hasTriggerComp);
      if (this.hasTriggerComp[this.configData.compId]) {
        return this.$message({
          type: 'warning',
          message: this.hasTriggerComp[this.configData.compId].msg,
        });
      }
      if (this.parent.form) {
        delete this.parent.form[this.configData.compId];
        delete this.parent.rules[this.configData.compId];
      }
      this.$bus.$emit('deletePanel', this.configData.compId);
      // 如果是按钮，左右处理
      if (this.configData.compType === 5 || this.configData.compType === 16) {
        this.$emit('btnPosChange', this.i);
      }
      this.parent.children.splice(this.i, 1);
      // 上一个兄弟元素，由于id的原因先去除
      // if (this.parent.children.length) {
      //   this.$bus.$emit(
      //     'changeCurActiveObj',
      //     this.parent.children[this.parent.children.length - 1],
      //   );
      // } else {
      // 直接定位到父元素
      this.menuMain.changeCurActiveObj(this.parent.areaType);
      // }
    },

    getMenuMain() {
      let parent = this.$parent;
      while (!parent.isMenuMain && !parent.specialParent) {
        parent = parent.$parent;
      }
      return parent;
    },
  },

  computed: {
    // 生效字典数组
    effectArr() {
      if (this.configData.effectDict && this.configData.effectDict.length) {
        const arr = this.getDictArr.filter((item) => {
          if (this.configData.effectDict.includes(item.value)) {
            return true;
          }
          return false;
        });
        return arr;
      }
      return this.getDictArr;
    },
    getBtnResource() {
      if (this.configData.compName === 'FormButton') {
        // 保存
        if (this.configData.buttonType === 1) {
          return 63;
        }
        // 删除
        if (this.configData.buttonType === 2) {
          return 4;
        }
        // 新增
        if (this.configData.buttonType === 3) {
          return 2;
        }
        // 编辑
        if (this.configData.buttonType === 4) {
          return 3;
        }
        // 导入
        if (this.configData.buttonType === 7) {
          return 5;
        }
        // 导出
        if (this.configData.buttonType === 8) {
          return 6;
        }
      }
      return 1;
    },
    showInput() {
      if (this.isConfig) {
        return true;
      }
      // 如果当前页面是自定义页面，同时不是流程的界面，按钮都有权限
      if (this.$route.name === 'homePage' && JSON.stringify(this.showType) === '{}' && this.configData.compName === 'FormButton') {
        return true;
      }
      if (
        this.configData.compName === 'FormButton' &&
        JSON.stringify(this.showType) === '{}'
      ) {
        let menuId = this.$route.params.id || this.$route.query.menuId;
        // 分享页面 分享面板
        if (+this.$route.params.flag === 2 && this.getFatherPanel()) {
          menuId = this.getFatherPanel().menuId;
        }
        if (
          !this.$store.getters
            .getMenuResource(menuId)
            .includes(this.getBtnResource)
        ) {
          return false;
        }
      }
      if (this.isTableBtn) {
        if (this.canShow) {
          return true;
        }
      } else if (this.configData.canShow) {
        return true;
      }

      return false;
    },
    isQueryEle() {
      return this.isQuery && this.grandFather.layoutStyle === 2;
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
        if (v === 1 || v === 4) {
          this.configData.canReadonly = false;
        }
      },
      immediate: true,
    },
  },
};
