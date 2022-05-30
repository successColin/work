<!--
 * @Descripttion: 最近搜索
 * @Author: ytx
 * @Date: 2022-01-06 17:06:56
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-06 17:06:56
-->
<template>
  <section class="searchPage">
    <apiot-navbar :title="title"></apiot-navbar>
    <u-sticky offset-top="0">
      <div class="searchPage__sticky">
        <apiot-input
          v-model="keywords"
          class="searchPage__search"
          prefixIcon="appIcon-sousuo"
          placeholder="在全部文件中搜索"
          :isTheme="false"
          clearable
          @getList="getListFun"
        ></apiot-input>
        <div class="searchPage__nav" v-if="!isGetData">
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
          <section class="searchPage__nav--section" v-if="isShow">
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
        </div>
      </div>
    </u-sticky>

    <!-- loading -->
    <u-loading-page
      :loading="loading"
      bgColor="rgba(0, 0, 0, 0.1)"
      style="z-index: 1"
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
      <list-data class="searchPage__list" :dataArr="dataArr"></list-data>
    </section>
  </section>
</template>

<script>
import ListData from '../components/ListData';
import dataListMixin from '../../dataListMixin';

export default {
  mixins: [dataListMixin],
  data() {
    return {
      // 赛选项
      screenArr: [
        {
          state: true,
          name: '全部'
        },
        {
          state: false,
          name: '文档'
        },
        {
          state: false,
          name: '图片'
        },
        {
          state: false,
          name: '视频'
        },
        {
          state: false,
          name: '音频'
        },
        {
          state: false,
          name: '其他'
        }
      ],
      title: '搜索',
      list: [],
      keywords: '',
      keywordValue: ''
    };
  },
  components: {
    ListData
  },
  computed: {
    isGetData() {
      return this.dataArr.length !== 0 || this.keywordValue;
    },
    isShow() {
      return this.dataArr.length !== 0 && this.keywordValue;
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    }
  },
  mounted() {},
  methods: {
    // 筛选
    handleClickScreen(v) {
      this.screenArr.forEach((item) => {
        item.state = false;
      });
      v.state = true;
    },
    // 删除历史
    handleDelete() {
      this.list = [];
    },
    // 查询历史数据
    handleHistory(name) {
      this.keywords = name;
      this.getList();
    },
    async getListFun() {
      if (this.keywords) {
        await this.getList({ keywords: this.keywords });
      } else {
        this.dataArr = [];
      }
      this.keywordValue = this.keywords;
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../../index.scss';

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
