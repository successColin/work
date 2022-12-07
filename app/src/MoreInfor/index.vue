<!--
 * @Descripttion: 更多资讯
 * @Author: ytx
 * @Date: 2022-11-12 11:59:49
 * @Last Modified by: ytx
 * @Last Modified time: 2022-11-12 11:59:49
-->
<template>
  <view class="moreInfor">
    <!-- 顶部 -->
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="title"></apiot-navbar>
    <!-- #endif -->
    <my-tabs :list="tabsList" @change="handleChangeTabs"></my-tabs>
    <!-- 内容 -->
    <view class="moreInfor__content" :style="{ height: computedHeight }">
      <u-list @scrolltolower="scrolltolower" :height="computedHeight">
        <u-list-item v-for="(item, o) in articleArr" :key="o">
          <navigator
            :url="jumpUrl(item.id)"
            hover-class="none"
            class="tabnavHome__infor--more"
          >
            <!-- 风格一 -->
            <info-Stylea
              :valObj="item"
              v-if="item.articleType === 1"
            ></info-Stylea>
            <!-- 风格二 -->
            <info-Styleb
              :valObj="item"
              v-else-if="item.articleType === 2"
            ></info-Styleb>
            <!-- 风格三 -->
            <info-Stylec
              :valObj="item"
              v-else-if="item.articleType === 3"
            ></info-Stylec>
          </navigator>
        </u-list-item>
      </u-list>
    </view>
  </view>
</template>

<script>
import { listGroup } from '@/api/moreInfor';
import { getPageArticle } from '@/api/moreInfor';
import MyTabs from './components/MyTabs';
import InfoStylea from './components/InfoStylea';
import InfoStyleb from './components/InfoStyleb';
import InfoStylec from './components/InfoStylec';
import { Encrypt } from '@/utils';

export default {
  data() {
    return {
      title: '分组名称',
      tabsList: [],
      currentIndex: 0,
      currentObj: {},
      articleArr: [],
      total: 0,
      params: {
        groupId: 0,
        current: 1,
        size: 10
      }
    };
  },
  components: { MyTabs, InfoStylea, InfoStyleb, InfoStylec },
  computed: {
    jumpUrl() {
      return function(id) {
        return `/MoreInfor/components/InforDetails/index?id=${Encrypt(String(id))}`;
      };
    },
    computedHeight() {
      const { windowHeight, navbarHeight, statusBar } = this.$store.state.base.systemInfo;
      const height = windowHeight - navbarHeight - statusBar - 45;
      return height;
    }
  },
  watch: {
    title(v) {
      // #ifdef MP-ALIPAY
      uni.setNavigationBarTitle({
        title: v
      });
      // #endif
    }
  },
  mounted() {
    this.getlistGroup();
  },
  methods: {
    async getlistGroup() {
      const res = await listGroup();
      this.tabsList = res;
      this.params.groupId = res[0].id;
      this.title = res[0].name;
      this.getPageArticleList();
    },
    async handleChangeTabs(v) {
      console.log(v);
      this.title = v.name;
      this.currentObj = v;
      this.params.groupId = v.id;
      this.getPageArticleList();
    },
    // 分组下的数据
    async getPageArticleList(way) {
      if (way !== 'more') {
        this.params.current = 1;
      }
      const list = await getPageArticle(this.params);
      const { records, total } = list;
      if (way === 'more') {
        this.articleArr.push(...records);
      } else {
        this.articleArr = records;
      }
      this.total = total;
    },
    scrolltolower() {
      console.log(this.articleArr.length, this.total);
      if (this.articleArr.length < this.total) {
        this.params.current += 1;
        this.getPageArticleList('more');
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.moreInfor {
  width: 100%;
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  &__content {
    margin: 0 30rpx;
    flex: 1;
    overflow: hidden;
  }
}
</style>
