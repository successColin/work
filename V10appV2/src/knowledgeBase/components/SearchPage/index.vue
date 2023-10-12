<!--
 * @Descripttion: 知识库搜索
 * @Author: ytx
 * @Date: 2022-01-06 17:06:56
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-06 17:06:56
-->
<template>
  <section class="searchPage">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="title"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar">
      <div class="searchPage__sticky">
        <!-- clearable -->
        <apiot-input
          v-model="keywords"
          class="searchPage__search"
          prefixIcon="appIcon-sousuo"
          placeholder="在全部文件中搜索"
          :isTheme="false"
          focus
          @blur="getListFun"
        ></apiot-input>
        <div
          v-if="!isGetData && recentSearch.length !== 0"
          class="searchPage__recently"
        >
          <div>最近搜索</div>
          <i class="appIcon appIcon-shanchu" @click="handleDelete"></i>
        </div>
        <div class="searchPage__nav" style="flex-direction: column" v-else>
          <div style="width: 100%">
            {{ total }} 条与“
            <span :class="getThemeColorFont">{{ keywordValue }} </span>
            ”相关的同名文件
          </div>
          <section class="searchPage__nav--section">
            <div
              v-for="(item, index) in screenArr"
              class="searchPage__screen"
              :style="[item.state ? selectStyle : '']"
              :class="[item.state ? `themeColor__boxBgn-${getThemeIndex}` : '']"
              :key="index"
              @click="handleClickScreen(item)"
            >
              {{ item.name }}
            </div>
          </section>
          <div style="width: 100%">
            <apiot-breadcrumb
              :arr="pathArr"
              @handlePathFun="handlePathFun"
            ></apiot-breadcrumb>
          </div>
        </div>
      </div>
    </u-sticky>

    <!-- loading -->
    <apiot-toast v-if="loading" status="loading" :isFull="true"></apiot-toast>

    <!-- 历史查询 -->
    <section class="searchPage__list" v-if="!isGetData">
      <div
        class="searchPage__history"
        v-for="(item, i) in recentSearch"
        :key="i"
        @click="handleHistory(item)"
      >
        {{ item }}
      </div>
    </section>
    <!-- 查询列表 -->
    <section v-else>
      <list-data
        class="searchPage__list"
        :dataArr="dataArr"
        :pathArr.sync="pathArr"
        :height="computedHeight"
        @scrolltolower="scrolltolower"
      ></list-data>
    </section>
  </section>
</template>

<script>
import ListData from '../components/ListData';
import dataListMixin from '../dataListMixin';
import ApiotBreadcrumb from '../ApiotBreadcrumb';

export default {
  mixins: [dataListMixin],
  provide() {
    return {
      getList: this.getList,
      visitRecordFun: this.visitRecordFun,
      fileTypeImg: this.fileTypeImg
    };
  },
  data() {
    return {
      current: 1,
      size: 10,

      // 赛选项
      screenArr: [
        {
          state: true,
          name: '全部',
          id: 1
        },
        {
          state: false,
          name: '文档',
          id: 2
        },
        {
          state: false,
          name: '图片',
          id: 3
        },
        {
          state: false,
          name: '视频',
          id: 4
        },
        {
          state: false,
          name: '音频',
          id: 5
        },
        {
          state: false,
          name: '其他',
          id: 6
        }
      ],
      title: '搜索',
      recentSearch: [],
      keywords: '',
      keywordValue: '',
      pathArr: [
        {
          name: '全部',
          id: 0,
          type: 0
        }
      ]
    };
  },
  components: {
    ListData,
    ApiotBreadcrumb
  },
  computed: {
    // 主题色
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    selectStyle() {
      return {
        color: this.themeColor
      };
    },
    computedHeight() {
      const { windowHeight, customBar } = this.systemInfo;
      const height = windowHeight - customBar - 178;
      return height;
    },
    isGetData() {
      return this.dataArr.length !== 0 || this.keywordValue;
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    customBar() {
      let height = 0;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      // #ifndef MP-ALIPAY
      height = this.systemInfo.customBar || 0;
      // #endif
      return height;
    }
  },
  watch: {
    keywords(v) {
      if (!v) {
        this.screenArr.forEach((item) => {
          item.state = false;
          if (item.id === 1) {
            item.state = true;
          }
        });
      }
    }
  },
  onReady() {
    this.recentSearch = uni.getStorageSync('knowledgeSearch') || [];
  },
  onLoad(option) {
    this.classId = option.classId;
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.title
    });
    // #endif
  },
  methods: {
    // 刷新页面
    refreshFun(way) {
      this.connectFun(way);
    },
    // 下拉刷新
    scrolltolower() {
      console.log(this.dataArr, this.total);
      if (this.dataArr.length < this.total) {
        this.current += 1;
        this.refreshFun('more');
      }
    },
    connectFun(way) {
      const v = this.screenArr.find((item) => item.state);
      if (v.id === 1) {
        this.getList(
          {
            keywords: this.keywords
          },
          way
        );
      } else {
        // fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
        this.getTypeList(
          {
            fileType: v.id,
            keywords: this.keywords
          },
          way
        );
      }
    },
    // 筛选
    handleClickScreen(v) {
      this.screenArr.forEach((item) => {
        item.state = false;
        if (v.id === item.id) {
          item.state = true;
        }
      });
      this.connectFun();
    },
    // 删除历史
    handleDelete() {
      this.recentSearch = [];
      uni.setStorageSync('knowledgeSearch', []);
    },
    // 查询历史数据
    handleHistory(name) {
      this.keywords = name;
      this.getList();
    },
    async getListFun(e) {
      console.log(e);
      this.keywords = e;
      if (!this.keywords) return;
      this.current = 1;
      // this.showRecent = false;
      const arr = uni.getStorageSync('knowledgeSearch') || [];
      arr.push(e);
      if (arr.length > 10) {
        arr.shift();
      }
      const noRepeat = new Set(arr);
      uni.setStorageSync('knowledgeSearch', [...noRepeat]);

      if (this.keywords) {
        await this.getList({ keywords: this.keywords });
      } else {
        this.dataArr = [];
      }
      this.keywordValue = this.keywords;
    },
    handlePathFun(v, i) {
      this.pathArr = this.pathArr.slice(0, i + 1);
      const obj = this.screenArr.find((item) => item.state);
      console.log(v, i, this.pathArr, obj);
      if (obj.id === 1) {
        const keywords = v.id === 0 ? this.keywords : '';
        this.getList({
          keywords,
          parentId: v.id
        });
      } else {
        // fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
        this.getTypeList({
          fileType: v.id,
          keywords: this.keywords
        });
      }
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../index.scss';

// class 变量名
$--name: 'searchPage';

@include setSearch($--name);
.searchPage {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100vh;
  &__nav {
    font-size: 34rpx;
    &--section {
      width: 100%;
    }
  }
  &__recently {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30rpx;
    height: 88rpx;

    div {
      font-size: 28rpx;
      color: #333333;
    }
    .appIcon-shanchu {
      font-size: 30rpx;
      color: #bbc3cd;
    }
  }
  &__history,
  &__screen {
    display: inline-block;
    font-size: 28rpx;
    color: #333333;
    border-radius: 33rpx;
    background: #f6f6f8;
  }
  &__history:hover {
    background: #f1f7ff;
    color: #4689f5;
  }
  &__history {
    padding: 18rpx 30rpx;
    margin-right: 18rpx;
    margin-top: 10rpx;
  }
  &__screen {
    padding: 10rpx 20rpx;
    margin-right: 23rpx;
    margin-top: 46rpx;
  }
  &__screen:last-child {
    margin-right: 0rpx;
  }
  &__list {
    padding: 0 30rpx;
  }
  &__noDate {
    flex: 1;
    background: #f6f6f8;
    position: relative;
    &--place {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 28rpx;
      color: #333333;
      img {
        width: 200rpx;
        height: 200rpx;
      }
      div {
        margin-top: 30rpx;
      }
    }
  }
}
</style>
