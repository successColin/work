<!--
 * @Descripttion: 关联知识库搜索
 * @Author: ytx
 * @Date: 2022-01-06 17:06:56
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-06 17:06:56
-->
<template>
  <section class="searchPage">
    <!-- #ifndef MP -->
    <apiot-navbar :title="title"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar">
      <div class="searchPage__sticky">
        <apiot-input
          v-model="keywords"
          class="searchPage__search"
          prefixIcon="appIcon-sousuo"
          placeholder="在全部文件中搜索"
          :isTheme="false"
          focus
          @getList="getListFun"
        ></apiot-input>
        <div class="" v-if="!isGetData">
          <div v-if="list.length !== 0">
            <div>最近搜索</div>
            <i class="appIcon appIcon-shanchu" @click="handleDelete"></i>
          </div>
        </div>
        <div class="searchPage__nav" style="flex-direction: column" v-else>
          <div style="width: 100%">
            {{ dataArr.length }} 条与“
            <span :class="getThemeColorFont">{{ keywordValue }} </span>
            ”相关的同名文件
          </div>
          <section class="searchPage__nav--section">
            <div
              v-for="(item, index) in screenArr"
              :class="[
                'searchPage__screen',
                item.state ? 'searchPage__nav--selectValue' : '',
              ]"
              :key="index"
              @click="handleClickScreen(item)"
            >
              {{ item.name }}
            </div>
          </section>
          <apiot-breadcrumb
            :arr="pathArr"
            @handlePathFun="handlePathFun"
          ></apiot-breadcrumb>
        </div>
      </div>
    </u-sticky>

    <!-- loading -->
    <u-loading-page
      :loading="loading"
      bgColor="rgba(0, 0, 0, 0.1)"
      style="z-index: 1"
      loadingText=""
    ></u-loading-page>

    <!-- 历史查询 -->
    <section class="searchPage__list" v-if="!isGetData">
      <div
        class="searchPage__history"
        v-for="(item, i) in list"
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
        :isShowMoreOper.sync="isShowMoreOper"
        :currentObj.sync="currentObj"
        :parentId.sync="parentId"
        :pathArr.sync="pathArr"
        :funcConfig="funcConfig"
        @getList="getList"
        @getKnowledgeList="getKnowledgeList"
      ></list-data>
    </section>
    <!-- 更多操作弹窗 -->
    <more-oper
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :funcConfig="funcConfig"
    ></more-oper>
  </section>
</template>

<script>
// 复制文件过来的
// \menuConfigure\components\MenuMain\RelationKnowledge\components\ListData
// \menuConfigure\components\MenuMain\RelationKnowledge\components\MoreOper
// \menuConfigure\components\MenuMain\RelationKnowledge\publicMixin
import ListData from './components/ListData';
import MoreOper from './components/MoreOper';
import publicMixin from '../RelationKnowledge/publicMixin';

export default {
  mixins: [publicMixin],
  data() {
    return {
      currentPage: 'searchPage',
      formObj: {},
      parentId: 0,
      funcConfig: {},
      loading: false,
      dataArr: [],
      title: '搜索',
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
      list: [], // 历时搜索到数据
      keywords: '',
      keywordValue: '',
      isShowMoreOper: false,
      currentObj: {},
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
    MoreOper
  },
  computed: {
    // 是否得到数据
    isGetData() {
      return this.dataArr.length !== 0 || this.keywordValue;
    },
    // 主题色
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    },
    customBar() {
      console.log(this.systemInfo);
      let height = 0;
      // #ifdef MP
      height = 0;
      // #endif
      // #ifndef MP
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
  mounted() {
    this.funcConfig = uni.getStorageSync('funcConfigKnowledge');
  },
  onLoad(v) {
    this.formObj = v.formObj && JSON.parse(v.formObj);
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.title
    });
    // #endif
  },
  methods: {
    // 查询历史数据
    handleHistory(name) {
      this.keywords = name;
      this.getList(true);
    },
    // 搜索失去焦点方法
    async getListFun() {
      if (this.keywords) {
        await this.getList(true);
      } else {
        this.dataArr = [];
      }
      this.keywordValue = this.keywords;
    },
    // 筛选
    handleClickScreen(v) {
      this.screenArr.forEach((item) => {
        item.state = false;
        if (v.id === item.id) {
          item.state = true;
        }
      });
      this.getList(true);
    },
    // 删除历史
    handleDelete() {
      this.list = [];
    }
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';
// class 变量名
$--name: 'searchPage';
@include setSearch($--name);
.searchPage {
  display: flex;
  flex-direction: column;
  background: #fff;
  height: 100%;
  &__nav {
    font-size: 34rpx;
    padding-bottom: 0;
    &--section {
      width: 100%;
    }
    &--selectValue {
      background: #f1f7ff !important;
      color: #4689f5 !important;
    }
  }
  &__history,
  &__screen {
    display: inline-block;
    font-size: 28rpx;
    color: #333333;
    border-radius: 34rpx;
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
    background: #fff;
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
