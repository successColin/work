<!--
 * @Descripttion: 常见问题
 * @Author: ytx
 * @Date: 2021-06-04 09:23:46
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-04 09:23:46
-->
<template>
  <div class="commonProblem">
    <my-search
      :parentId="parentId"
      :page="page"
      :isShowSearchValue.sync="isShowSearchValue"
      @searchValue="getSearchValue"
    ></my-search>
    <section class="commonProblem__content" v-show="!isShowSearchValue">
      <left-menu
        ref="leftMenu"
        :menuType="2"
        :parentId="parentId"
        :sidebarArr="sidebarArr"
        :activeIndex.sync="activeIndex"
        :isShowSearchValue="isShowSearchValue"
        @currentArr="getCurrentArr"
        @currentObj="getCurrentObj"
      ></left-menu>
      <section class="commonProblem__middleContent" ref="middleContent">
        <div>
          <middle-header
            :currentObj="currentObj"
            :rightTitle="$t('helpCenter.peopleHaveRead')"
          ></middle-header>
          <div
            class="commonProblem__dec middle__content ShowIndex"
            v-for="(item, i) in currentArr"
            :key="i"
          >
            <div class="commonProblem__dec--title">Q：{{ item.name }}</div>
            <div class="contentBox">
              <!-- 三角形 -->
              <div class="commonProblem__triangle"></div>
              <div v-html="item.html"></div>
            </div>
          </div>
        </div>
      </section>
    </section>
    <search-content
      v-if="isShowSearchValue"
      class="commonProblem__searchContent"
      :searchValue="searchValue"
      :page.sync="page"
      :activeIndex.sync="activeIndex"
      :isShowSearchValue.sync="isShowSearchValue"
      @giveActiveObj="getActiveObj"
    >
    </search-content>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { getlistModelShow } from '@/api/helpCenter';
import MySearch from '../components/MySearch';
import LeftMenu from '../components/LeftMenu';
import MiddleHeader from '../components/MiddleHeader';
import SearchContent from '../components/SearchContent';

export default {
  data() {
    return {
      parentId: 3,
      // 当前左侧数据
      currentObj: {},
      // 当前详情数据，内容数据
      currentArr: [],
      isShowPopover: true,
      scroll: null,
      // 左侧数据
      sidebarArr: [],
      // 是否显示搜索值
      isShowSearchValue: false,
      page: {
        current: 1,
        size: 10
      },
      // 默认展开
      activeIndex: '',
      searchValue: null
    };
  },
  components: {
    MySearch,
    LeftMenu,
    MiddleHeader,
    SearchContent
  },
  computed: {},
  watch: {},
  mounted() {
    this.getlistModel();
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  methods: {
    init() {
      this.scroll.refresh();
    },
    // 得到点击对象
    getActiveObj(v) {
      this.$refs.leftMenu.itemClick(v);
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    // 获取左侧菜单数据
    getCurrentObj(v) {
      this.currentObj = v;
    },
    // 得到当前数据
    getCurrentArr(v) {
      this.currentArr = v;
      this.$nextTick(() => {
        this.scroll.refresh();
        setTimeout(() => {
          this.scroll.refresh();
        }, 500);
      });
    },
    getSearchValue(v) {
      this.searchValue = v;
      this.isShowSearchValue = true;
    },
    async getlistModel() {
      const res = await getlistModelShow({
        parentId: this.parentId
      });
      this.sidebarArr = res;
    },
    // 滚动条初始化
    initScroll() {
      this.scroll = new BScroll(this.$refs.middleContent, {
        mouseWheel: {
          speed: 20,
          invert: false,
          easeTime: 300
        },
        bounce: false,
        preventDefault: false
      });
    }
  },
  destroyed() {
    this.scroll.destroy();
  }
};
</script>
<style lang='scss' scoped>
@import '@/globalComponents/ApiotWangeditor/index';
@import '../index';

$--name: 'commonProblem';
@include setLayout($--name);
.commonProblem {
  &__dec {
    padding-bottom: 20px;
    border-bottom: 1px solid #e9e9e9;
    &--title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      margin: 20px 0 30px 0;
    }
  }
}
</style>
