<!--
 * @Descripttion: 视频教程
 * @Author: ytx
 * @Date: 2021-06-04 09:23:46
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-04 09:23:46
-->
<template>
  <div class="videoTutorial">
    <my-search
      :parentId="parentId"
      :page="page"
      :isShowSearchValue.sync="isShowSearchValue"
      @searchValue="getSearchValue"
    ></my-search>
    <section class="videoTutorial__content" v-show="!isShowSearchValue">
      <left-menu
        :menuType="2"
        :parentId="parentId"
        :sidebarArr="sidebarArr"
        :activeIndex.sync="activeIndex"
        :isShowSearchValue.sync="isShowSearchValue"
        @currentArr="getCurrentArr"
        @currentObj="getCurrentObj"
      ></left-menu>
      <section class="videoTutorial__middleContent" ref="middleContent">
        <div>
          <middle-header
            :currentObj="currentObj"
            :rightTitle="$t('helpCenter.views')"
            class="m-l-15 m-r-15"
          ></middle-header>
          <section
            class="videoTutorial__dec m-l-10 middle__content"
            v-if="isShow"
          >
            <div
              shadow="hover"
              v-for="(item, i) in videoArr"
              :key="i"
              class="videoTutorial__video"
              @click="handlePlayVideo(item)"
            >
              <div class="videoTutorial__video--player">
                <div
                  :style="`background: url(${item.imageUrl});background-size: cover;`"
                  class="imgContent"
                ></div>
                <!-- <div class="imgContent">
                  <img :src="item.imageUrl" alt="" />
                </div> -->
                <div class="circle">
                  <div class="videoTutorial__triangle"></div>
                </div>
              </div>
              <div class="videoTutorial__video--title">{{ item.name }}</div>
            </div>
          </section>
        </div>
      </section>
    </section>
    <search-content
      v-if="isShowSearchValue"
      class="videoTutorial__searchContent"
      :parentId="parentId"
      :searchValue="searchValue"
      :page.sync="page"
      :activeIndex.sync="activeIndex"
      :isShowSearchValue.sync="isShowSearchValue"
      @giveActiveObj="getActiveObj"
    >
    </search-content>
    <apiot-dialog
      width="68%"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :isShowSure="false"
    >
      <my-video
        v-if="dialogVisible"
        ref="videoPlayer"
        class="videoTutorial__dialogPlay"
        :options="playerOptions"
        :playsinline="true"
      ></my-video>
    </apiot-dialog>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import MyVideo from '@/views/HelpCenter/component/MyVideo';
import { getlistModelShow } from '@/api/helpCenter';
import MySearch from '../components/MySearch';
import LeftMenu from '../components/LeftMenu';
import MiddleHeader from '../components/MiddleHeader';
import SearchContent from '../components/SearchContent';

export default {
  data() {
    return {
      parentId: 2,
      scroll: null,
      // 左侧数据
      sidebarArr: [],
      currentObj: {},
      playerOptions: {
        autoplay: true,
        loop: true, // 使视频一结束就重新开始。
        muted: true, // 默认情况下将静音任何音频。
        // fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        // aspectRatio: '4:3',
        language: 'zh-CN',
        notSupportedMessage: this.$t('helpCenter.videoTemporarilyUnavailable'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        flash: { hls: { withCredentials: false } }, // 可以使用rtmp视频
        html5: { hls: { withCredentials: false } }, // 可以使用m3u8视频
        playbackRates: [0.5, 1, 1.5, 2],
        noUITitleAttributes: true
      },
      // 视屏数组
      videoArr: [],
      isShow: false,
      page: {
        current: 1,
        size: 10
      },
      // 是否显示搜索值
      isShowSearchValue: false,
      // 默认展开
      activeIndex: '',
      dialogVisible: false,
      dialogTitle: '',
      searchValue: null
    };
  },
  components: {
    MySearch,
    LeftMenu,
    MiddleHeader,
    MyVideo,
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
    // 得到左侧行
    getCurrentObj(v) {
      this.currentObj = v;
    },
    // 得到对应行的数据
    getCurrentArr(v) {
      this.isShow = false;
      this.videoArr = v;
      this.$nextTick(() => {
        this.isShow = true;
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
    },
    // 点击图片播放视频
    handlePlayVideo(item) {
      this.dialogTitle = `${item.name}`;
      this.playerOptions.sources = [
        {
          type: item.videoType,
          src: item.url
        }
      ];
      this.dialogVisible = true;
    }
  },
  destroyed() {
    this.scroll.destroy();
  }
};
</script>
<style lang='scss' scoped>
@import '../index';

$--name: 'videoTutorial';
@include setLayout($--name);
.videoTutorial {
  &__dec {
    display: flex;
    flex-wrap: wrap;
  }
  &__video:hover {
    transform: translate3d(0, -6px, 0);
    box-shadow: 0 2px 14px 0px rgb(0, 42, 110, 0.14);
  }
  &__video {
    margin: 10px 7px 0 7px;
    width: calc(33% - 14px);
    // height: 15vw;
    border-radius: 4px;
    transition: all 0.3s;
    &--player {
      padding: 5px 5px 0 5px;
      box-sizing: border-box;
      // width: 100%;
      height: 11vw;
      position: relative;
      cursor: pointer;
      overflow: hidden;
      .imgContent {
        border-radius: 4px;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .circle {
        position: absolute;
        width: 34px;
        height: 34px;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        margin: auto;
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        .videoTutorial__triangle {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: 0;
          margin: auto;
          margin-left: 11px;
          width: 0;
          height: 0;
          border-top: 7px solid transparent;
          border-left: 14px solid #ffffff;
          border-bottom: 7px solid transparent;
        }
      }
    }
    &--title {
      margin: 16px auto;
      margin-top: 18px;
      text-align: center;
      font-size: 13px;
      color: #333333;
    }
  }
  &__dialogPlay {
    width: 100%;
    height: 500px;
  }
  ::v-deep {
    .el-dialog__body {
      height: auto;
      box-sizing: border-box;
      padding: 0;
    }
  }
}
</style>
