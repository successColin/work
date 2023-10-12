<!--
 * @Descripttion: 企业文件
 * @Author: ytx
 * @Date: 2022-01-05 14:19:38
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:19:38
-->
<template>
  <div class="recentDoc">
    <!-- 吸顶 -->
    <u-sticky :customNavHeight="customBar">
      <div class="recentDoc__sticky">
        <search-button :classId="classId"></search-button>
        <section class="recentDoc__nav">
          <div class="recentDoc__nav--left">
            <!-- 头部类型 -->
            <div
              :class="[
                'recentDoc__nav--marginLeft',
                v.state
                  ? 'recentDoc__nav--title'
                  : 'recentDoc__nav--noClickTitle',
              ]"
              v-for="(v, i) in typeTabs"
              :key="i"
              @click="handleSwitchTabs(v)"
            >
              {{ v.name }}
            </div>
            <!-- 底部颜色 -->
            <div
              class="recentDoc__nav--selected"
              :style="{ left: selectTypeLeft + 'rpx' }"
            ></div>
          </div>
          <i
            class="appIcon appIcon-shaixuan"
            @click="isShowPopup = true"
            v-if="tabValue === 1"
          ></i>
        </section>
        <!-- 路径 -->
        <div class="recentDoc__url">
          <apiot-breadcrumb
            :arr="pathArr"
            @handlePathFun="handlePathFun"
          ></apiot-breadcrumb>
        </div>
      </div>
    </u-sticky>
    <!-- loading -->
    <apiot-toast v-if="loading" status="loading" :isFull="true"></apiot-toast>
    <list-data
      class="recentDoc__list"
      :dataArr="dataArr"
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :pathArr.sync="pathArr"
      :videoPreviewUrl.sync="videoPreviewUrl"
      :height="computedHeight"
      @scrolltolower="scrolltolower"
    ></list-data>

    <!-- 上传的按钮 -->
    <transition name="slide-bottom">
      <upload-btn
        v-if="isShowUploadBtn"
        :classId="classId"
        :parentId="parentId"
        @refreshFun="refreshFun"
      ></upload-btn>
    </transition>

    <!-- 筛选 -->
    <div @touchmove.stop.prevent>
      <u-popup
        mode="bottom"
        :show="isShowPopup"
        :round="10"
        @close="isShowPopup = false"
      >
        <section class="recentDoc__popup">
          <div class="recentDoc__popup--title margTop">筛选</div>
          <popup-line :arr="screenArr1"></popup-line>
          <!-- <div class="recentDoc__popup--title margTop">来源</div>
          <popup-line :arr="screenArr2"></popup-line>
          <div class="recentDoc__popup--title margTop">排序</div>
          <popup-line :arr="screenArr3"></popup-line> -->

          <footer>
            <apiot-button class="recentDoc__popup--reset" @click="handleReset">
              重置
            </apiot-button>
            <apiot-button
              class="recentDoc__popup--ok"
              type="primary"
              @click="handleOk"
            >
              确定
            </apiot-button>
          </footer>
        </section>
      </u-popup>
    </div>

    <!-- 更多操作弹窗 -->
    <more-oper
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :isCollect="isCollect"
      :classId="classId"
      @refreshFun="refreshFun"
    ></more-oper>

    <!-- 更多操作弹窗 -->
    <toggle-sharing
      :isToggleSharing.sync="isToggleSharing"
      @handleOthersShare="handleOthersShare"
      @handleMyShare="handleMyShare"
    ></toggle-sharing>

    <view v-if="videoPreviewUrl" class="previewVideo" @click="cancelVideo">
      <video
        :src="videoPreviewUrl"
        autoplay="true"
        controls
        object-fit="contain"
      ></video>
    </view>
  </div>
</template>

<script>
import PopupLine from '../components/PopupLine';
import ListData from '../components/ListData';
import MoreOper from '../components/MoreOper';
import ToggleSharing from '../components/ToggleSharing';
import dataListMixin from '../dataListMixin';
import ApiotBreadcrumb from '../ApiotBreadcrumb';

import SearchButton from '../components/SearchButton';

import UploadBtn from '../components/UploadBtn';

export default {
  mixins: [dataListMixin],
  provide() {
    return {
      getList: this.getList,
      visitRecordFun: this.visitRecordFun,
      fileTypeImg: this.fileTypeImg,
      getFileType: this.getFileType
    };
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      current: 1,
      size: 10,

      classId: 2,
      pathArr: [
        {
          name: '全部',
          id: 0
        }
      ],
      isShowPopup: false, // 筛选
      isShowMoreOper: false, // 更多操作
      isToggleSharing: false,
      selectTypeLeft: 4,
      tabValue: 1, // 菜单 tabs
      selectTitle: '他人共享',
      currentObj: {},
      videoPreviewUrl: '',
      typeTabs: [
        {
          name: '全部', // 企业文件
          state: true,
          id: 1
        },
        {
          name: '收藏',
          state: false,
          id: 2
        }
      ],
      screenArr1: [
        {
          name: '全部类型',
          state: true,
          id: 1
        },
        {
          name: '文档',
          url: 'appIcon-DOC',
          state: false,
          id: 2
        },
        {
          name: '图片',
          url: 'appIcon-tupianwenjian',
          state: false,
          id: 3
        },
        {
          name: '视频',
          url: 'appIcon-shipinwenjian',
          state: false,
          id: 4
        },
        {
          name: '音频',
          url: 'appIcon-yuyinwenjian',
          state: false,
          id: 5
        },
        {
          name: '其他',
          url: 'appIcon-qitawenjian',
          state: false,
          id: 6
        }
      ],
      isShowUploadBtn: true
      // screenArr2: [
      //   {
      //     name: '全部来源',
      //     state: false
      //   },
      //   {
      //     name: '我的创建',
      //     state: false
      //   },
      //   {
      //     name: '他人创建',
      //     state: false
      //   }
      // ],
      // screenArr3: [
      //   {
      //     name: '时间降序',
      //     state: false
      //   },
      //   {
      //     name: '时间升序',
      //     state: false
      //   },
      //   // 占位
      //   {
      //     name: ''
      //   }
      // ]
    };
  },
  components: {
    ListData,
    PopupLine,
    MoreOper,
    SearchButton,
    ToggleSharing,
    ApiotBreadcrumb,
    UploadBtn
  },
  computed: {
    // 高度
    computedHeight() {
      const { windowHeight, customBar } = this.systemInfo;
      const height = windowHeight - customBar - 45 - 50 - 35;
      return height;
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
    },
    pathArrValue() {
      return [
        {
          name: '全部'
        }
      ];
    },
    // 是否是收藏
    isCollect() {
      return this.tabValue === 2;
    },
    parentId() {
      return this.pathArr[this.pathArr.length - 1]?.id || 0;
    }
  },
  watch: {
    isShowPopup(v) {
      this.$store.commit('setIsMask', v);
    },
    isShowMoreOper(v) {
      this.$store.commit('setIsMask', v);
    },
    isToggleSharing(v) {
      this.$store.commit('setIsMask', v);
    }
  },
  mounted() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.title
    });
    // #endif
    this.getList();
  },
  methods: {
    // 刷新页面
    refreshFun(way) {
      this.connectFun(way);
    },
    // 下拉刷新
    scrolltolower() {
      if (this.dataArr.length < this.total) {
        this.current += 1;
        this.refreshFun('more');
      }
    },
    // 接口方式
    connectFun(way) {
      // 全部或收藏
      const v = this.typeTabs.find((item) => item.state);
      // v tabs
      const obj = this.screenArr1.find((item) => item.state);
      const params = {
        parentId: this.parentId
      };
      // id === 1 全部类型
      if (v?.id === 1) {
        this.selectTypeLeft = 4;
        this.tabValue = 1;
        // obj 类型
        if (obj?.id === 1) {
          this.getList(params, way);
        } else {
          // fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
          this.getTypeList(
            {
              fileType: obj.id
            },
            way
          );
        }
      }
      if (v?.id === 2) {
        this.selectTypeLeft = 98;
        this.tabValue = 2;
        if (params.parentId) {
          this.getList(params, way);
        } else {
          this.getCollectionList();
        }
      }
    },
    // 切换类型
    handleSwitchTabs(v) {
      this.typeTabs.forEach((item) => {
        item.state = false;
        if (v.id === item.id) {
          item.state = true;
          if (v.id === 2) {
            this.isShowUploadBtn = false;
          } else {
            this.isShowUploadBtn = true;
          }
        }
      });
      this.pathArr = this.pathArrValue;
      this.connectFun();
    },
    handleOthersShare() {
      this.getOtherShareList();
      this.selectTitle = '他人共享';
    },
    handleMyShare() {
      this.getlistShareList();
      this.selectTitle = '我的共享';
    },
    // 筛选__重置
    handleReset() {
      this.isShowPopup = false;
      this.screenArr1.forEach((item, i) => {
        if (i === 0) {
          item.state = true;
        } else {
          item.state = false;
        }
      });
      // this.screenArr2.forEach((item) => {
      //   item.state = false;
      // });
      // this.screenArr3.forEach((item) => {
      //   item.state = false;
      // });
      this.getList();
    },
    // 筛选__确定
    handleOk() {
      this.isShowPopup = false;
      this.connectFun();
    },
    handlePathFun(v, i) {
      this.pathArr = this.pathArr.slice(0, i + 1);

      this.connectFun();
    },
    cancelVideo() {
      this.videoPreviewUrl = '';
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../index.scss';

// class 变量名
$--name: 'recentDoc';

@include setSearch($--name);

.previewVideo {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  video {
    width: 100%;
  }
}
</style>
