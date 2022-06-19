<!--
 * @Descripttion: 配置关联资料
 * @Author: ytx
 * @Date: 2022-06-15 14:15:56
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-15 14:15:56
-->
<template>
  <div class="apiotknowledge">
    <!-- 吸顶 -->
    <u-sticky :customNavHeight="customBar" :offsetTop="44">
      <div class="apiotknowledge__sticky">
        <search-button v-show="funcConfig.showSearch"></search-button>
        <apiot-breadcrumb
          :arr="pathArr"
          @handlePathFun="handlePathFun"
        ></apiot-breadcrumb>
      </div>
    </u-sticky>

    <u-loading-page
      :loading="loading"
      bgColor="rgba(0, 0, 0, 0.1)"
      style="z-index: 1"
      loadingText=""
    ></u-loading-page>

    <list-data
      class="apiotknowledge__list"
      :dataArr="dataArr"
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :parentId.sync="parentId"
      :pathArr.sync="pathArr"
      :funcConfig="funcConfig"
      @getList="getList"
      @getKnowledgeList="getKnowledgeList"
    ></list-data>

    <!-- 更多操作弹窗 -->
    <more-oper
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :funcConfig="funcConfig"
    ></more-oper>
  </div>
</template>

<script>
import ListData from './components/ListData';
import SearchButton from './components/SearchButton';
import MoreOper from './components/MoreOper';
import publicMixin from './publicMixin';

export default {
  inject: ['getAllForm'],
  mixins: [publicMixin],
  props: {
    funcConfig: {
      type: Object
    }
  },
  data() {
    return {
      currentPage: 'list',
      loading: false,
      dataArr: [],
      isShowMoreOper: false,
      currentObj: {},
      parentId: 0
    };
  },
  components: {
    ListData,
    SearchButton,
    MoreOper
  },
  computed: {},
  watch: {},
  mounted() {
    this.getList();
    uni.setStorageSync('funcConfigKnowledge', this.funcConfig);
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.apiotknowledge {
  &__sticky {
    background: #fff;
    position: relative;
  }
  ::v-deep {
    .u-input__icon--prefix {
      padding: 0 21rpx 0 34rpx;
    }
  }
}
</style>
