<template>
  <div :class="['knowledgeBase', isMask ? 'maskOverhidden' : '']">
    <!-- #ifndef MP-DINGTALK -->
    <!-- 顶部 -->
    <apiot-navbar :title="title"></apiot-navbar>
    <!-- #endif -->
    <!-- <u-upload
      :fileList="fileList1"
      @afterRead="afterRead"
      @delete="deletePic"
      name="1"
      multiple
      :maxCount="10"
    ></u-upload> -->
    <!-- 最近文件 -->
    <!-- <recent-doc v-if="currentNav === 0" :title="title"></recent-doc> -->
    <!-- 我的文件 -->
    <my-doc v-if="currentNav === 0" :title="title"></my-doc>
    <!-- 企业文件 -->
    <!-- <enterprise-doc
      v-else-if="currentNav === 1"
      :title="title"
    ></enterprise-doc> -->
    <!-- 占用 -->
    <recent-doc v-if="currentNav === 1" :title="title"></recent-doc>

    <!-- 业务文件 -->
    <!-- <business-doc v-else-if="currentNav === 3" :title="title"></business-doc> -->
    <!-- 底部 -->
    <apiot-tabbar
      v-model="currentNav"
      :list="getFooterArea"
      :active-color="themeColor"
      @change="changeTab"
    ></apiot-tabbar>
  </div>
</template>

<script>
import RecentDoc from './components/RecentDoc';
import MyDoc from './components/MyDoc';
// import EnterpriseDoc from './components/EnterpriseDoc';
// import BusinessDoc from './components/BusinessDoc';
// 顶部图片
// import recentlyDocNormal from '@/static/img/knowledge/recentlyDocNormal.svg';
// import recentlyDocSelect from '@/static/img/knowledge/recentlyDocSelect.svg';
import myDocNormal from '@/static/img/knowledge/myDocNormal.svg';
import myDocSelect from '@/static/img/knowledge/myDocSelect.svg';
import corporateDocSelect from '@/static/img/knowledge/corporateDocSelect.svg';
import corporateDocNormal from '@/static/img/knowledge/corporateDocNormal.svg';
// import businessDocNormal from '@/static/img/knowledge/businessDocNormal.svg';
// import businessDocSelect from '@/static/img/knowledge/businessDocSelect.svg';

export default {
  data() {
    return {
      title: '知识库',
      // 底部第几个
      currentNav: 0,
      getFooterArea: [
        // {
        //   iconPath: recentlyDocNormal,
        //   selectedIconPath: recentlyDocSelect,
        //   text: '最近'
        // },
        {
          iconPath: myDocNormal,
          selectedIconPath: myDocSelect,
          text: '我的文件'
        },
        {
          iconPath: corporateDocNormal,
          selectedIconPath: corporateDocSelect,
          text: '企业文件'
        }
        // {
        //   iconPath: businessDocNormal,
        //   selectedIconPath: businessDocSelect,
        //   text: '业务文件'
        // }
      ]
      // fileList1: []
    };
  },
  computed: {
    // 主题色
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    // 是否是遮罩层
    isMask() {
      return this.$store.state.base.isMask;
    }
  },
  components: {
    RecentDoc,
    MyDoc
    // EnterpriseDoc
    // BusinessDoc
  },
  methods: {
    // 切换底部
    changeTab(index) {
      this.currentNav = index;
    }

    // // 删除图片
    // deletePic(event) {
    //   this[`fileList${event.name}`].splice(event.index, 1);
    // },
    // 新增图片
    // async afterRead(event) {
    //   // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    //   const lists = [].concat(event.file);
    //   let fileListLen = this[`fileList${event.name}`].length;
    //   lists.map((item) =>
    //     this[`fileList${event.name}`].push({
    //       ...item,
    //       status: 'uploading',
    //       message: '上传中'
    //     }));
    //   for (let i = 0; i < lists.length; i += 1) {
    //     // eslint-disable-next-line no-await-in-loop
    //     const result = await this.uploadFilePromise(lists[i].thumb);
    //     const item = this[`fileList${event.name}`][fileListLen];
    //     this[`fileList${event.name}`].splice(
    //       fileListLen,
    //       1,
    //       Object.assign(item, {
    //         status: 'success',
    //         message: '',
    //         url: result
    //       })
    //     );
    //     fileListLen += 1;
    //   }
    // },
    // uploadFilePromise(url) {
    //   return new Promise((resolve) => {
    //     uni.uploadFile({
    //       url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
    //       filePath: url,
    //       name: 'file',
    //       formData: {
    //         user: 'test'
    //       },
    //       success: (res) => {
    //         setTimeout(() => {
    //           resolve(res.data.data);
    //         }, 1000);
    //       }
    //     });
    //   });
    // }
  }
};
</script>
<style lang='scss' scoped>
// .knowledgeBase {
//   &__search {
//     position: fixed;
//     top: 90rpx;
//   }
// }
</style>
