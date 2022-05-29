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
        <search-button></search-button>
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
          <i class="appIcon appIcon-shaixuan" @click="isShowPopup = true"></i>
        </section>
      </div>
    </u-sticky>
    <list-data
      class="recentDoc__list"
      :dataArr="dataArr"
      :isShowMoreOper.sync="isShowMoreOper"
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
    <more-oper :isShowMoreOper.sync="isShowMoreOper"></more-oper>
  </div>
</template>

<script>
import PopupLine from '../components/PopupLine';
import ListData from '../components/ListData';
import MoreOper from '../components/MoreOper';
import SearchButton from '../components/SearchButton';
// import UploadFile from '../components/UploadFile';
// 图片
import docTypeUrl from '@/static/img/fileType/DOC.svg';
import imgTypeUrl from '@/static/img/fileType/IMAG.svg';
import mp4TypeUrl from '@/static/img/fileType/MP4.svg';
import mp3TypeUrl from '@/static/img/fileType/MP3.svg';
import otyerTypeUrl from '@/static/img/fileType/OTHER.svg';
// 接口
import { listFiles, pageFiles } from '@/api/knowledgeBase';

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShowPopup: false, // 筛选
      isShowMoreOper: false, // 更多操作
      dataArr: [],
      selectTypeLeft: 40,
      paramsAll: {
        classId: 1, // 节点分类（1 我的 2 企业 3业务)
        isFolder: 0, // 是否只显示文件夹(1是 0否)
        keywords: '',
        parentId: 0
      },
      paramsType: {
        classId: 1, // 节点分类（1 我的 2 企业 3业务)
        fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
        current: 1,
        keywords: '',
        size: 10
      },
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
          state: true
        },
        {
          name: '文档',
          url: docTypeUrl,
          state: false,
          id: 2
        },
        {
          name: '图片',
          url: imgTypeUrl,
          state: false,
          id: 3
        },
        {
          name: '视频',
          url: mp4TypeUrl,
          state: false,
          id: 4
        },
        {
          name: '音频',
          url: mp3TypeUrl,
          state: false,
          id: 5
        },
        {
          name: '其他',
          url: otyerTypeUrl,
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
    SearchButton
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
    }
  },
  watch: {
    isShowPopup(v) {
      this.$store.commit('setIsMask', v);
    },
    isShowMoreOper(v) {
      this.$store.commit('setIsMask', v);
    }
  },
  mounted() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.title
    });
    // #endif
    this.getList(this.paramsAll);
  },
  methods: {
    handleSwitchTabs(v) {
      console.log(1);
      this.typeTabs.forEach((item) => {
        item.state = false;
        if (v.id === item.id) {
          item.state = true;
        }
      });
      if (v.id === 1) {
        this.selectTypeLeft = 40;
      }
      if (v.id === 2) {
        this.selectTypeLeft = 150;
      }
      if (v.id === 3) {
        this.selectTypeLeft = 245;
      }
    },
    // 查询全部接口
    async getList(params) {
      const res = await listFiles(params);
      this.dataArr = res;
    },
    // 查询部分
    async getTypeList(params) {
      const res = await pageFiles(params);
      console.log(res);
      this.dataArr = res.records;
    },
    // 筛选__重置
    handleReset() {
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
      this.isShowPopup = false;
      this.getList(this.paramsAll);
    },
    // 筛选__确定
    handleOk() {
      this.isShowPopup = false;
      const obj = this.screenArr1.find((v) => v.state);
      if (obj.id) {
        // fileType: 2, // 文件类型（ 2文档 3图片 4视频 5 音频 6 其他）
        this.getTypeList({
          ...this.paramsType,
          fileType: obj.id
        });
      }
    }
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载');
  }
};
</script>
<style lang='scss' scoped>
@import '../../index.scss';

// class 变量名
$--name: 'recentDoc';

@include setSearch($--name);
</style>
