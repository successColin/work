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
      // current: 1,
      // size: 10,
      // initSize: 10,
      // totalPage: -1,
      // listData: [],
    };
  },

  computed: {
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    },
  },

  methods: {
    // 下拉加载
    scrolltolower() {
      // console.log(this.current, this.totalPage);
      // if (this.current < this.totalPage) {
      //   this.getList({}, 'loadnext');
      // }
    },
    // 查询全部接口
    async getList(params) {
      // , loadType = 'load'
      this.loading = true;
      // 分页
      // if (loadType === 'load') {
      //   this.current = 1;
      //   this.size = this.initSize;
      // } else if (loadType === 'loadnext') {
      //   this.current += 1;
      // }
      const res = await listFiles({
        classId: this.classId,
        isFolder: 0, // 是否只显示文件夹(1是 0否)
        keywords: '',
        parentId: 0,
        // current: this.current,
        // size: this.size,
        current: 1,
        size: 9999,
        ...params,
      });
      // console.log(res);
      // this.listData.push(...res.records);
      // this.sortFun(this.listData);
      // this.totalPage = Math.ceil(res.total / res.size);
      this.sortFun(res.records);
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
      let fileName = 'appIcon-qitawenjian';
      if (obj.sysKlTree && obj.sysKlTree.treeType === 1) {
        fileName = 'appIcon-wenjianjia';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 3) {
        fileName = 'appIcon-tupianwenjian';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 4) {
        fileName = 'appIcon-shipinwenjian';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 5) {
        fileName = 'appIcon-yuyinwenjian';
      }
      if (obj.sysKlTree && obj.sysKlTree.treeType === 6) {
        fileName = 'appIcon-qitawenjian';
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
          fileName = 'appIcon-TXT';
        }
        if (['xls', 'xlsx'].indexOf(suffix) !== -1) {
          fileName = 'appIcon-XLS';
        }
        if (['ppt', 'pptx'].indexOf(suffix) !== -1) {
          fileName = 'appIcon-PPT';
        }
        if ('pdf'.indexOf(suffix) !== -1) {
          fileName = 'appIcon-PDF';
        }
        if (['doc', 'docx'].indexOf(suffix) !== -1) {
          fileName = 'appIcon-DOC';
        }
        if (['zip', 'rar'].indexOf(suffix) !== -1) {
          fileName = 'appIcon-yasuobao';
        }
      }
      return fileName;
    },
  },
};
