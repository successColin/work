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
  props: {},

  data() {
    return {
      loading: false,
      dataArr: [],
      classId: 1,
    };
  },

  computed: {
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    },
  },

  methods: {
    // 查询全部接口
    async getList(params) {
      this.loading = true;
      const res = await listFiles({
        classId: this.classId,
        isFolder: 0, // 是否只显示文件夹(1是 0否)
        keywords: '',
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
        keywords: '',
        size: 99999,
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
      res.forEach((item) => {
        item.collect = true;
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
    fileTypeImg(obj) {
      let fileName = 'OTHER.svg';
      if (obj.sysKlTree && obj.sysKlTree.treeType === 1) {
        fileName = 'FILE.svg';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 3) {
        fileName = 'IMAG.svg';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 4) {
        fileName = 'MP4.svg';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 5) {
        fileName = 'MP3.svg';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 6) {
        fileName = 'OTHER.svg';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 2) {
        let url = '';
        if (obj.sysKlTree && obj.sysKlTree.url) {
          url = obj.sysKlTree.url;
        } else {
          url = obj.url;
        }
        const suffixArr = url.split('.');
        const suffix = suffixArr[suffixArr.length - 1];
        if ('txt'.indexOf(suffix) !== -1) {
          fileName = 'TXT.svg';
        }
        if (['xls', 'xlsx'].indexOf(suffix) !== -1) {
          fileName = 'XLS.svg';
        }
        if (['ppt', 'pptx'].indexOf(suffix) !== -1) {
          fileName = 'PPT.svg';
        }
        if ('pdf'.indexOf(suffix) !== -1) {
          fileName = 'PDF.svg';
        }
        if (['doc', 'docx'].indexOf(suffix) !== -1) {
          fileName = 'DOC.svg';
        }
        if (['zip', 'rar'].indexOf(suffix) !== -1) {
          fileName = 'ZIP.svg';
        }
      }
      return require(`@/static/img/fileType/${fileName}`);
    },
  },
};
