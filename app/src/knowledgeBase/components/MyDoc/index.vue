<!--
 * @Descripttion: 我的文件
 * @Author: ytx
 * @Date: 2022-01-05 14:20:35
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:20:35
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
        <!-- 分享：他人共享和我的分享 -->
        <div
          class="recentDoc__select"
          v-if="tabValue === 2"
          @click="isToggleSharing = true"
        >
          {{ selectTitle }}
          <i class="appIcon appIcon-xialasanjiao"></i>
        </div>
        <!-- 路径 -->
        <apiot-breadcrumb
          :arr="pathArr"
          @handlePathFun="handlePathFun"
        ></apiot-breadcrumb>
      </div>
    </u-sticky>
    <!-- loading -->
    <u-loading-page
      :loading="loading"
      bgColor="rgba(0, 0, 0, 0.1)"
      style="z-index: 1"
      loadingText=""
    ></u-loading-page>
    <list-data
      class="recentDoc__list"
      :dataArr="dataArr"
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :pathArr.sync="pathArr"
      :videoPreviewUrl.sync="videoPreviewUrl"
    ></list-data>

    <!-- 上传 -->
    <!-- <upload-file></upload-file> -->

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
            <u-button
              class="recentDoc__popup--reset"
              text="重置"
              @click="handleReset"
            ></u-button>
            <u-button
              class="recentDoc__popup--ok"
              type="primary"
              text="确定"
              @click="handleOk"
            ></u-button>
          </footer>
        </section>
      </u-popup>
    </div>

    <!-- 更多操作弹窗 -->
    <more-oper
      :isShowMoreOper.sync="isShowMoreOper"
      :currentObj.sync="currentObj"
      :isCollect="isCollect"
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

import SearchButton from '../components/SearchButton';
// import UploadFile from '../components/UploadFile';
// 图片

export default {
  mixins: [dataListMixin],
  provide() {
    return {
      getList: this.getList,
      visitRecordFun: this.visitRecordFun,
      fileTypeImg: this.fileTypeImg,
      scrolltolower: this.scrolltolower
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
      classId: 1,
      pathArr: [
        {
          name: '全部'
        }
      ],
      isShowPopup: false, // 筛选
      isShowMoreOper: false, // 更多操作
      isToggleSharing: false,
      selectTypeLeft: 40,
      tabValue: 1, // 菜单 tabs
      selectTitle: '他人共享',
      currentObj: {},
      videoPreviewUrl: '',
      typeTabs: [
        {
          name: '我的文件',
          state: true,
          id: 1
        },
        {
          name: '分享',
          state: false,
          id: 2
        },
        {
          name: '收藏',
          state: false,
          id: 3
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
      ]
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
    ToggleSharing
    // UploadFile
  },
  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    customBar() {
      let height = 0;
      // #ifdef MP-DINGTALK
      height = 0;
      // #endif
      // #ifndef MP-DINGTALK
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
      return this.tabValue === 3;
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
    // 接口方式
    connectFun(v) {
      console.log(v);
      // v tabs
      const obj = this.screenArr1.find((item) => item.state);
      const pathObj = this.pathArr[this.pathArr.length - 1];
      const parentId = pathObj.id;
      let params = {};
      if (parentId) {
        params = {
          parentId
        };
      }
      if (v.id === 1) {
        this.selectTypeLeft = 40;
        this.tabValue = 1;
        // obj 类型
        if (obj.id === 1) {
          this.getList(params);
        } else {
          // fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
          this.getTypeList({
            fileType: obj.id
          });
        }
      }
      if (v.id === 2) {
        this.selectTypeLeft = 150;
        this.tabValue = 2;
        if (params.parentId) {
          this.getList(params);
        } else {
          this.getOtherShareList();
        }
      }
      if (v.id === 3) {
        this.selectTypeLeft = 245;
        this.tabValue = 3;
        if (params.parentId) {
          this.getList(params);
        } else {
          this.getCollectionList();
        }
      }
    },
    // 刷新页面
    refreshFun() {
      const obj = this.typeTabs.find((v) => v.state);
      this.connectFun(obj);
    },
    // 切换类型
    handleSwitchTabs(v) {
      this.typeTabs.forEach((item) => {
        item.state = false;
        if (v.id === item.id) {
          item.state = true;
        }
      });
      this.pathArr = this.pathArrValue;
      this.connectFun(v);
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
      this.connectFun({ id: this.tabValue });
    },
    handlePathFun(v, i) {
      this.pathArr = this.pathArr.slice(0, i + 1);
      this.connectFun({ id: this.tabValue });
    },
    cancelVideo() {
      this.videoPreviewUrl = '';
    }
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载');
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
