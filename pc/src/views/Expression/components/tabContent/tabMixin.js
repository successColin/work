import { delExMulti } from '@/api/expression';

export default {
  props: {
    expressionGroup: {
      type: Number,
      default: 1, // 1-常用；2-自定义
    },
  },

  data() {
    return {
      orders: [],
      current: 1,
      total: 0,
      size: 10,
      tableData: [],
      keywords: '',
      multiExpressionArr: [], // 列表选中的数据
      showExDetail: false,
      oprationType: 'common.add', // 操作类型 新增-common.add; 编辑-common.edit; 删除-common.delete
      columnData: [
        // 名称
        {
          label: 'common.name',
          prop: 'description',
          compName: 'ElTableColumn',
          width: 300,
        },
        // 表达式
        {
          label: 'expression.expression',
          prop: 'expression',
          compName: 'ElTableColumn',
          width: 300,
        },
        // 备注
        {
          label: 'common.remark',
          prop: 'memo',
          compName: 'ElTableColumn',
        },
        {
          label: 'common.operate',
          width: 220,
          fixed: 'right',
          compName: 'OperateColumn',
        },
      ],
    };
  },

  computed: {
    getButtonArr() {
      return function(column) {
        if (column.compName === 'OperateColumn') {
          if (this.expressionGroup !== 1) {
            return [{ name: 'common.edit1', funcName: 'editEx' }];
          }
          return [];
        }
        return [];
      };
    },
  },

  watch: {
    showExDetail(v) {
      // drawer 关闭的时候统一清空输入内容
      if (!v && this.$refs.exDetail) {
        this.$refs.exDetail.resetForm();
      }
    },
  },
  methods: {
    // 初始化
    initList() {
      this.orders = [];
      this.getList();
    },
    // 添加表达式
    addEx() {
      this.oprationType = 'common.add';
      this.showExDetail = true;
    },
    // 编辑表达式
    editEx(row) {
      this.$refs.exDetail.initFormData(row);
      this.oprationType = 'common.edit';
      this.showExDetail = true;
    },
    // 删除表达式
    async delEx() {
      // 如果没有选中数据，进行提醒
      if (this.multiExpressionArr.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('common.placeSelectData'),
        });
        return;
      }
      await this.$confirm(
        this.$t('common.sureToDelete'),
        this.$t('common.tip'),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning',
        },
      );

      const ids = [];
      this.multiExpressionArr.forEach((element) => {
        ids.push(element.id);
      });
      this.$emit('contentLoading', true);
      this.oprationType = 'common.delete';
      await delExMulti({
        ids: ids.join(','),
        logData: {
          name: this.$t('expression.expression'),
          value: 'description',
          deleteArr: this.multiExpressionArr,
        },
      });
      this.getList();
      this.$message({
        type: 'success',
        message: this.$t('common.success', {
          name: this.$t('common.delete', {
            name: this.$t('expression.expression', { name: '' }),
          }),
        }),
      });
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiExpressionArr = val;
    },
    // 点击页项
    handleCurrentChange(page) {
      this.getList(page);
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.size = size;
      this.getList();
    },
    // 取消选中
    handleCancelChecked() {
      this.tableData = this.tableData.map((item) => {
        if (item.isChecked) item.isChecked = false;
        return item;
      });
    },
    // 搜索
    searchDict() {
      this.getList();
    },
    // 保存表达式
    sureClick(info) {
      this.showExDetail = false;
      let page = 1;
      if (info.reload) page = this.current;
      this.getList(page);
    },
    // 排序
    sortChange(sortInfo) {
      // console.log(sortInfo);
      const { prop, order } = sortInfo;
      const orderObj = { column: prop };
      if (order === 'ascending') orderObj.asc = true;
      else if (order === 'descending') orderObj.asc = false;
      this.orders = [orderObj];
      // console.log(this.orders);
      this.getList(this.current);
    },
  },
};
