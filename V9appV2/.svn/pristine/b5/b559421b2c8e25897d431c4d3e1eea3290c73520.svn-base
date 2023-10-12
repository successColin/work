<template name="workbench">
  <view class="workbench">
    <m-back-bar backStyle="backStyleNoBack">
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight">
        <icon-button></icon-button>
      </block>
    </m-back-bar>
    <mni-banner
      :source="figureList"
      duration="500"
      interval="5000"
    ></mni-banner>
    <!-- 公告 -->
    <view class="workbench__announcement" v-if="isShowAnnouncement">
      <!-- icon图 -->
      <m-normal-icon
        icon="tongzhigonggao"
        :iconSize="52"
        class="workbench__icon"
      ></m-normal-icon>
      <!-- 内容 -->
      <view class="workbench__announcementContent">
        <swiper
          class="swiper"
          :autoplay="true"
          duration="500"
          interval="4000"
          :vertical="isVertical"
          circular="true"
          disable-touch="false"
        >
          <swiper-item v-for="(v, i) in shufflingList" :key="i">
            <view class="swiper-item" @click="handleAnnouncement(v.id)">{{
              v.name
            }}</view>
          </swiper-item>
        </swiper>
      </view>
    </view>
    <view class="bundle-list">
      <view class="hasMainBundle" v-if="topCoreList.length > 0"></view>
      <view v-if="workSpaceList.length > 0">
        <m-group-area
          v-for="(group, index) in workSpaceList"
          :class="{ margin: index == 0 && topCoreList.length > 0 }"
          :areaStype="2"
          :name="group.showGroupName ? group.name : ''"
          :key="index"
        >
          <view v-if="group.styleType" class="bundle-group">
            <view
              hover-class="none"
              class="bundle-item"
              :class="[groupShowType[group.styleType]]"
              v-for="(bundle, bundleindex) in group.list"
              :key="bundleindex"
              @click="handleNav(bundle)"
            >
              <m-superscript
                v-if="
                  countsql &&
                  countsql[bundle.id] &&
                  countsql[bundle.id] != -1 &&
                  bundle.picpath
                "
                :count="countsql[bundle.id]"
              ></m-superscript>
              <block v-if="group.styleType === 3 && bundle.picpath">
                <view v-if="bundle.picpath" class="bundle-item-image">
                  <image
                    class="image"
                    :src="bundle.picpath"
                    mode="widthFix"
                  ></image>
                </view>
                <view v-else class="bundle-item-content">
                  <m-font-icon
                    :icon="bundle.iconName"
                    :iconSize="48"
                    :color="bundle.colorCode"
                    class="bundle-item-list-icon"
                  ></m-font-icon>
                  <view class="bundle-item-name">{{ bundle.bundleName }}</view>
                  <view class="arrow-right"><span></span></view>
                </view>
              </block>
              <block v-else-if="group.styleType === 2">
                <!-- 一行3个 -->
                <view
                  v-if="!bundle.picpath"
                  class="bundle-item-content"
                  :style="{ backgroundColor: bundle.colorCode[2] }"
                >
                  <m-font-icon
                    :icon="bundle.iconName"
                    :iconSize="50"
                    :color="bundle.colorCode[0]"
                  ></m-font-icon>
                  <m-superscript
                    v-if="
                      countsql &&
                      countsql[bundle.id] &&
                      countsql[bundle.id] != -1
                    "
                    :count="countsql[bundle.id]"
                  ></m-superscript>
                  <view
                    class="bundle-item-name"
                    :style="{ color: bundle.colorCode[1] }"
                  >
                    {{ bundle.bundleName }}
                    <!-- <i class="icon iconfont APP_47 iconbtn"></i> -->
                  </view>
                </view>
                <view v-else class="bundle-item-image">
                  <image
                    class="image"
                    :src="bundle.picpath"
                    mode="widthFix"
                  ></image
                ></view>
              </block>
              <block v-else-if="group.styleType === 4">
                <view
                  v-if="!bundle.picpath"
                  class="bundle-item-content"
                  :style="{ backgroundColor: bundle.colorCode[1] }"
                >
                  <m-font-icon
                    :icon="bundle.iconName"
                    :iconSize="64"
                    :color="bundle.colorCode[0]"
                  ></m-font-icon>
                  <view class="bundle-item-right">
                    <view class="bundle-item-name">{{
                      bundle.bundleName
                    }}</view>
                    <view class="bundle-item-subtext">
                      <view>进入操作></view>
                      <view
                        class="count"
                        v-if="
                          countsql &&
                          countsql[bundle.id] &&
                          countsql[bundle.id] != -1
                        "
                        >{{ countsql[bundle.id] }}</view
                      >
                    </view>
                  </view>
                </view>
                <view v-else class="bundle-item-image">
                  <image
                    class="image"
                    :src="bundle.picpath"
                    mode="widthFix"
                  ></image
                ></view>
              </block>
              <block v-else>
                <view v-if="!bundle.picpath" class="bundle-item-content">
                  <!-- 一行4个 -->
                  <m-font-icon
                    :icon="bundle.iconName"
                    :iconSize="60"
                    :color="bundle.colorCode"
                  ></m-font-icon>
                  <m-superscript
                    v-if="
                      countsql &&
                      countsql[bundle.id] &&
                      countsql[bundle.id] != -1
                    "
                    :count="countsql[bundle.id]"
                  ></m-superscript>
                  <!-- #ifdef APP-PLUS-->
                  <i
                    v-else-if="
                      newBundle[bundle.id] &&
                      (!countsql || !countsql[bundle.id])
                    "
                    class="iconfont iconnew new"
                  ></i>
                  <!-- #endif -->
                  <view class="bundle-item-name">{{ bundle.bundleName }}</view>
                </view>
                <view v-else class="bundle-item-image">
                  <image
                    class="image"
                    :src="bundle.picpath"
                    mode="widthFix"
                  ></image
                ></view>
              </block>
            </view>
          </view>
        </m-group-area>
      </view>
      <m-group-area
        v-if="isShowConsulting"
        :areaStype="2"
        :name="consultingName"
        key="consulting"
      >
        <view class="informationContent">
          <m-consult
            v-for="(item, index) in consultArr"
            :key="index"
            :dataArr="item"
            :name="consultingName"
          ></m-consult>
          <!-- 分页 -->
          <view class="loadingText" v-if="consultLoading">
            <mLodingSvg></mLodingSvg>
          </view>
        </view>
      </m-group-area>
    </view>
    <!-- <view class="bundle-list" v-if="isShowConsulting">
      
    </view> -->
  </view>
</template>

<script>
import { BUNDLE_SHOW_TYPE } from '@/common/constant/bundle.js';
import { FRAMS_TYPE } from '@/common/constant/frams.js';
import mConsult from '@/components/m-consult/index.vue';
import mGroupArea from '@/components/element/m-groupArea.vue';
import minBadge from '@/components/min-badge/min-badge';
import mSuperscript from '@/components/element/m-superscript.vue';
import mniBanner from '@/components/mniBanner/MniBanner.vue';
import IconButton from '@/components/push-message/IconButton';

import { mapState, mapMutations } from 'vuex';
export default {
  name: 'workbench',
  components: {
    mGroupArea,
    minBadge,
    mSuperscript,
    mniBanner,
    IconButton,
    mConsult,
  },
  props: {
    barTitle: {
      type: String,
      default: '工作台',
    },
    isShowAnnouncement: {
      // 是否显示公告
      type: Boolean,
      default: false,
    },
    isVertical: {
      // 公告轮播方向
      type: Boolean,
      default: true,
    },
    // 资讯数据
    consultArr: {
      type: Array,
      default() {
        return [];
      },
    },
    // 是否显示资讯
    isShowConsulting: {
      type: Boolean,
      default: false,
    },
    // 资讯分组名称
    consultingName: {
      type: String,
      default: '',
    },
    // 资讯是否加载中
    consultLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      topopacity: 0,
      topshow: false,
      height: 340,
      iconSize: [56, 50, 0, 64],
      mainiconSize: 86,
      groupShowType: BUNDLE_SHOW_TYPE,
      shufflingList: [],
    };
  },
  computed: {
    ...mapState(['screenHeight', 'themeColor']),
    ...mapState('home', {
      leftList: 'leftList',
      rightList: 'rightList',
      workSpaceList: 'workSpaceList',
      topCoreList: 'topCoreList',
      newBundle: 'newBundle',
      countsql: 'countsql',
      figureList: 'figureList',
    }),
    height_() {
      return uni.upx2px(this.height);
    },
    themeClass_() {
      //与主题she检修关联
      const mainColor = ['mainColor', 'whiteColor'];
      return this.themeColor !== 'red'
        ? 'mainColor-' + this.themeColor
        : 'mainColor';
    },
  },
  mounted() {
    this.getShufflingList();
  },
  methods: {
    ...mapMutations(['SET_FRAMETYPE']),
    handleNav(bundle) {
      //如果没有框架信息，提示功能正在开发中
      if (!bundle.template) {
        const _this = this;
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$i18nMsg('basic-inquiry'),
          content: _this.$i18nMsg('pageTip-configuration'),
          showCancel: false,
        });
        return;
      }
      this.SET_FRAMETYPE(FRAMS_TYPE[bundle.bundleFrameType]);
      const url = `/pages/${bundle.template}?title=${bundle.bundleName}&bundleId=${bundle.id}&mainTab=1&V=${bundle.bundleVersion}`;
      uni.navigateTo({
        url: url,
      });
      if (this.countsql && this.countsql[bundle.id]) {
        this.countsql[bundle.id] = -1;
      }
    },
    // 得到公告 list
    getShufflingList() {
      this.$http
        .post('bulletin/list', {
          enabled: 1,
        })
        .then((res) => {
          console.log(res);
          const data = res.data;
          if (data.success) {
            this.shufflingList = data.data;
          }
        });
    },
    handleAnnouncement(v) {
      uni.navigateTo({
        url: `/pages/announcement/announcement?id=${v}`,
      });
    },
  },
};
</script>
<style type="text/css" scoped>
.gradient-text-one {
  background-image: linear-gradient(
    180deg,
    rgba(243, 175, 125, 1) 0%,
    rgba(227, 71, 74, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.haveStatusBar,
.topshow-status,
.hasstatus {
  height: var(--status-bar-height);
}
.topBtn {
  top: var(--status-bar-height);
}
.barmargin {
  margin-top: --status-bar-height;
}
</style>
