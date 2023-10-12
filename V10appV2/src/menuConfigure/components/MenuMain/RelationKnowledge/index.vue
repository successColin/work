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
    <u-sticky :customNavHeight="customBar">
      <div class="apiotknowledge__sticky">
        <search-button v-show="funcConfig.showSearch"></search-button>
        <apiot-breadcrumb
          :arr="pathArr"
          @handlePathFun="handlePathFun"
        ></apiot-breadcrumb>
      </div>
    </u-sticky>

    <apiot-toast v-if="loading" status="loading" :isFull="true"></apiot-toast>

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
import ApiotBreadcrumb from '../ApiotBreadcrumb';

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
    MoreOper,
    ApiotBreadcrumb
  },
  computed: {
    customBar() {
      console.log(this.systemInfo);
      let height = 0;
      // #ifdef MP-ALIPAY
      height = this.systemInfo.navbarHeight - 1;
      // #endif
      // #ifndef MP-ALIPAY
      height = this.systemInfo.customBar + this.systemInfo.navbarHeight - 1 || 0;
      // #endif
      return height;
    }
  },
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
  width: 100%;
  &__sticky {
    overflow-x: hidden;
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
