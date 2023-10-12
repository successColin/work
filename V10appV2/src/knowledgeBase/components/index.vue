<template>
  <div class="knowContent">
    <!-- 最近文件 -->
    <!-- <recent-doc v-if="currentNav === 0" :title="title"></recent-doc> -->
    <!-- 我的文件 -->
    <!-- <my-doc v-if="currentNav === 0" :title="title"></my-doc> -->
    <!-- 企业文件 -->
    <!-- v-else-if="currentNav === 1" -->
    <enterprise-doc :title="title"></enterprise-doc>

    <!-- 业务文件 -->
    <!-- <business-doc v-else-if="currentNav === 3" :title="title"></business-doc> -->
    <!-- 底部 -->
    <!-- <apiot-tabbar
      v-model="currentNav"
      :list="getFooterArea"
      :activeColor="$store.state.base.themeColor"
      @change="changeTab"
    ></apiot-tabbar> -->
  </div>
</template>

<script>
// import RecentDoc from './components/RecentDoc';
// import MyDoc from './MyDoc';
// import BusinessDoc from './components/BusinessDoc';
// 顶部图片
// import recentlyDocNormal from '@/static/img/knowledge/recentlyDocNormal.svg';
// import recentlyDocSelect from '@/static/img/knowledge/recentlyDocSelect.svg';
// import myDocNormal from '@/knowledgeBase/images/myDocNormal.svg';
// import myDocSelect from '@/knowledgeBase/images/myDocSelect.svg';
// import corporateDocSelect from '@/knowledgeBase/images/corporateDocSelect.svg';
// import corporateDocNormal from '@/knowledgeBase/images/corporateDocNormal.svg';
// import businessDocNormal from '@/static/img/knowledge/businessDocNormal.svg';
// import businessDocSelect from '@/static/img/knowledge/businessDocSelect.svg';
import EnterpriseDoc from './EnterpriseDoc';

export default {
  props: {
    title: {
      type: String,
      default: '知识库'
    }
  },
  data() {
    return {
      // currentNav: 1,
      // getFooterArea: [
      //   {
      //     iconPath: recentlyDocNormal,
      //     selectedIconPath: recentlyDocSelect,
      //     text: '最近'
      //   },
      //   {
      //     iconPath: myDocNormal,
      //     selectedIconPath: myDocSelect,
      //     text: '我的文件'
      //   },
      //   {
      //     iconPath: corporateDocNormal,
      //     selectedIconPath: corporateDocSelect,
      //     text: '企业文件'
      //   },
      //   {
      //     iconPath: businessDocNormal,
      //     selectedIconPath: businessDocSelect,
      //     text: '业务文件'
      //   }
      // ]
    };
  },
  components: {
    // RecentDoc,
    // MyDoc,
    EnterpriseDoc
    // BusinessDoc
  },
  methods: {
    // 切换底部
    // changeTab(index) {
    //   this.currentNav = index;
    // }
  }
};
</script>
<style lang='scss' scoped>
.knowContent {
  position: relative;
}
</style>
