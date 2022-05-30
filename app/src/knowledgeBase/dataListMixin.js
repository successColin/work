// 接口
import {
  listCollection,
  listFiles,
  listOtherShare,
  listShare,
  pageFiles,
  visitRecord,
} from '@/api/knowledgeBase';

export default {
  props: {
    // 节点分类（1 我的 2 企业 3业务)
    classId: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      loading: false,
      dataArr: [],
    };
  },

  methods: {
    // 查询全部接口
    async getList(params) {
      this.loading = true;
      const res = await listFiles({
        classId: this.classId,
        isFolder: 0, // 是否只显示文件夹(1是 0否)
        // keywords: '',
        parentId: 0,
        ...params,
      });
      this.sortFun(res);
      this.loading = false;
    },
    // 查询部分
    async getTypeList(params) {
      this.loading = true;
      const res = await pageFiles({
        classId: this.classId,
        fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
        current: 1,
        // keywords: '',
        size: 10,
        ...params,
      });
      this.sortFun(res.records || []);
      this.loading = false;
    },
    // 查询他人分享
    async getOtherShareList(params) {
      this.loading = true;
      const res = await listOtherShare({
        classId: this.classId,
        // keywords: '',
        userId: this.getUserId,
        ...params,
      });
      const arr = [];
      res.forEach((v) => {
        arr.push({
          sysKlTree: { ...v },
        });
      });
      this.sortFun(arr);
      this.loading = false;
    },
    // 查询我的分享
    async getlistShareList(params) {
      this.loading = true;
      const res = await listShare({
        classId: this.classId,
        // keywords: '',
        userId: this.getUserId,
        ...params,
      });
      const arr = [];
      res.forEach((v) => {
        arr.push({
          sysKlTree: { ...v },
        });
      });
      this.sortFun(arr);
      this.loading = false;
    },
    // 查询我的收藏
    async getCollectionList(params) {
      this.loading = true;
      const res = await listCollection({
        classId: this.classId,
        // keywords: '',
        userId: this.getUserId,
        ...params,
      });
      this.sortFun(res);
      this.loading = false;
    },
    // 最近浏览标识
    async visitRecordFun(v) {
      await visitRecord({
        classId: this.classId,
        userId: this.getUserId,
        id: v.sysKlTree.id,
      });
    },
    // 排序
    sortFun(arr) {
      this.dataArr = arr.sort((a, b) => {
        if (a.sysKlTree && b.sysKlTree) {
          return a.sysKlTree.treeType - b.sysKlTree.treeType;
        }
        return a.treeType - b.treeType;
      });
    },
  },
};
