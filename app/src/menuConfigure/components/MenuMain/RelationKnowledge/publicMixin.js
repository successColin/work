import {
  listFiles,
  materialsListFiles,
  materialsSearchFiles,
} from '@/api/knowledgeBase';

export default {
  data() {
    return {
      current: 1,
      size: 9999,
      pathArr: [
        {
          name: '全部',
          id: 0,
          type: 0,
        },
      ],
    };
  },

  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
  },

  methods: {
    // 查询全部数据__本地上传
    async getList(isSearch) {
      this.loading = true;
      const { relateBusiComp, relateDataComp } = this.funcConfig;
      const { tableName } = relateDataComp;
      let tableId;
      let relationTableId;
      let res;
      if (this.getAllForm) {
        tableId = this.getAllForm()[relateDataComp.compId];
        relationTableId = this.getAllForm()[relateBusiComp.compId];
      } else {
        tableId = this.formObj[relateDataComp.compId];
        relationTableId = this.formObj[relateBusiComp.compId];
      }
      if (isSearch) {
        const obj = this.screenArr.find((item) => item.state);
        res = await materialsSearchFiles({
          parentId: this.parentId,
          relationTableId,
          relationTableName: tableName,
          tableId,
          tableName,
          keywords: this.keywords,
          current: this.current,
          size: this.size,
          treeType: obj.id === 1 ? '' : obj.id,
        });
      } else {
        res = await materialsListFiles({
          parentId: this.parentId, // 节点父级id(根节点传0)
          relationTableId,
          relationTableName: tableName, // 业务关联表名
          tableId,
          tableName, // 表名
          keywords: '',
          current: this.current,
          size: this.size,
        });
      }
      this.sortFun(res);

      this.loading = false;
    },
    // 查询全部数据__关联知识库
    async getKnowledgeList() {
      this.loading = true;
      const res = await listFiles({
        classId: 2,
        isFolder: 0, // 是否只显示文件夹(1是 0否)
        parentId: this.parentId,
        keywords: '',
        current: this.current,
        size: this.size,
      });
      this.sortFun(res);
      this.loading = false;
    },
    // 排序
    sortFun(arr) {
      const dataArr = arr.records;
      const currentArr = dataArr.map((item) => {
        let obj = {
          ...item,
        };
        if (item.sysKlTree) {
          obj = {
            ...item.sysKlTree,
            ...item,
          };
        }
        return obj;
      });
      this.dataArr = currentArr.sort((a, b) => a.treeType - b.treeType);
    },
    handlePathFun(v, i) {
      this.pathArr = this.pathArr.slice(0, i + 1);
      const lastArr =
        this.pathArr.length && this.pathArr[this.pathArr.length - 1];
      this.parentId = lastArr.id;
      if (lastArr.type === 2) {
        this.getKnowledgeList();
      } else if (
        this.currentPage === 'searchPage' &&
        this.pathArr.length === 1
      ) {
        this.getList(true);
      } else {
        this.getList();
      }
    },
  },
};
