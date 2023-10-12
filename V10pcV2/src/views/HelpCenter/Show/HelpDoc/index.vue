<!--
 * @Descripttion: 帮助中心
 * @Author: ytx
 * @Date: 2021-06-04 09:23:46
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-04 09:23:46
-->
<template>
  <div class="helpDoc">
    <my-search
      :parentId="parentId"
      :page="page"
      :isShowSearchValue.sync="isShowSearchValue"
      @searchValue="getSearchValue"
    ></my-search>
    <section class="helpDoc__content" v-show="!isShowSearchValue">
      <left-menu
        ref="leftMenu"
        :sidebarArr="sidebarArr"
        :activeIndex.sync="activeIndex"
        :isShowSearchValue.sync="isShowSearchValue"
        @currentObj="getCurrentObj"
      ></left-menu>
      <section class="helpDoc__middleContent" ref="middleContent">
        <div>
          <middle-header
            :currentObj="currentObj"
            :rightTitle="$t('helpCenter.peopleHaveRead')"
          ></middle-header>
          <div class="middle__content">
            <div
              v-html="htmlVal"
              class="helpDoc__dec item-box ShowIndex apiotWangeditor"
            ></div>
          </div>
        </div>
      </section>
      <transition name="move-top">
        <position-ele
          v-if="posTOy > 100"
          :position="position"
          :jumpToEle="jumpToEle"
        ></position-ele>
      </transition>
    </section>
    <search-content
      v-if="isShowSearchValue"
      class="helpDoc__searchContent"
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
import { Decrypt } from '@/utils/utils';
import MySearch from '../components/MySearch';
import LeftMenu from '../components/LeftMenu';
import MiddleHeader from '../components/MiddleHeader';
import PositionEle from '../components/PositionEle';
import SearchContent from '../components/SearchContent';

export default {
  data() {
    return {
      parentId: 1,
      scroll: null,
      // 左侧数据
      sidebarArr: [],
      // 定位数组
      position: [],
      // 当前行
      currentObj: {},
      // 搜索值
      searchValue: {},
      // 是否显示搜索值
      isShowSearchValue: false,
      page: {
        current: 1,
        size: 10
      },
      // 默认展开
      activeIndex: '',
      posTOy: 0
    };
  },
  components: {
    MySearch,
    LeftMenu,
    MiddleHeader,
    PositionEle,
    SearchContent
  },
  computed: {
    htmlVal() {
      let { html = '' } = this.currentObj;
      if (html) {
        html = html.replace(/token=[^"]*/g, () => `token=${Decrypt(localStorage.token)}`);
      }
      return html;
    }
  },
  mounted() {
    this.getlistModel();
    this.$nextTick(() => {
      this.initScroll();
    });
  },
  methods: {
    init() {
      // this.getlistModel();
      this.scroll.refresh();
    },
    // 得到点击对象
    getActiveObj(v) {
      this.$refs.leftMenu.itemClick(v);
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    // 得到内容详情
    getCurrentObj(v) {
      this.currentObj = v;
      const state = true;
      const reg = /<h1\s?[^>]*>([^</]+)<\/h1>/g;
      this.position = [];
      do {
        const arr = reg.exec(this.currentObj.html);
        if (arr != null) {
          this.position.push({
            title: arr[1]
          });
        } else break;
      } while (state);
      this.$nextTick(() => {
        setTimeout(() => {
          this.scroll.refresh();
        }, 1000);
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
    // 跳转对应的值
    jumpToEle(index) {
      const element = document.querySelectorAll('.helpDoc__dec h1')[index];
      this.scroll.scrollToElement(element, 400);
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
        preventDefault: false,
        probeType: 3
      });
      this.scroll.on('scroll', (pos) => {
        this.posTOy = -Math.floor(pos.y);
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
@import '@/globalComponents/ApiotWangeditor/show';
@import '../index';

$--name: 'helpDoc';
@include setLayout($--name);
.helpDoc {
  &__dec {
    overflow: hidden;
  }
}
</style>
