<!--
 * @Author: sss
 * @Date: 2021-09-23 10:21:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-23 10:21:09
 * @Desc: 首页
-->
<template>
  <view class="tabnavHome">
    <view
      class="tabnavHome__swiper"
      v-if="configData.enableRotation && swiperListHasurl.length"
    >
      <apiot-swiper
        keyName="image"
        :list="swiperListHasurl"
        :height="110"
        imgMode="scaleToFill"
      >
      </apiot-swiper>
    </view>
    <view
      class="tabnavHome__notice"
      v-if="configData.enableNotice && announceList.length"
    >
      <apiot-notice :list="announceList" :config="configData.notice">
      </apiot-notice>
    </view>
    <view v-for="(item, index) in funcGroup" :key="`funcGroup_${index}`">
      <modemenu-four
        v-if="item.rowNum === 4 || item.rowNum === 5"
        :rowNum="item.rowNum"
        :modeObj="item"
        :hornMarkNums="hornMarkNums"
        @clickMenu="clickMenu"
      ></modemenu-four>

      <modemenu-three
        v-else-if="item.rowNum === 3"
        :modeObj="item"
        @clickMenu="clickMenu"
        :hornMarkNums="hornMarkNums"
      ></modemenu-three>

      <modemenu-two
        v-else-if="item.rowNum === 2"
        :modeObj="item"
        @clickMenu="clickMenu"
        :hornMarkNums="hornMarkNums"
      ></modemenu-two>

      <modemenu-one
        v-else-if="item.rowNum === 1"
        :modeObj="item"
        :hornMarkNums="hornMarkNums"
        @clickMenu="clickMenu"
      ></modemenu-one>

      <!-- 资讯 -->
      <view class="tabnavHome__infor" v-else>
        <view class="tabnavHome__infor--box">
          <view class="tabnavHome__infor--title">
            {{ item.name || '文章资讯' }}
          </view>
          <navigator
            url="/MoreInfor/index"
            hover-class="none"
            class="tabnavHome__infor--more"
          >
            更多
            <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </navigator>
        </view>
        <view v-for="(item, index) in articleArr" :key="index">
          <navigator
            :url="jumpUrl(item.id)"
            hover-class="none"
            class="tabnavHome__infor--more"
          >
            <!-- 风格一 -->
            <info-Stylea
              :valObj="item"
              v-if="item.articleType === 1"
            ></info-Stylea>
            <!-- 风格二 -->
            <info-Styleb
              :valObj="item"
              v-else-if="item.articleType === 2"
            ></info-Styleb>
            <!-- 风格三 -->
            <info-Stylec
              :valObj="item"
              v-else-if="item.articleType === 3"
            ></info-Stylec>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import { appRouteArr } from '@/config';

import ModemenuTwo from '../Menus/ModemenuTwo';
import ModemenuThree from '../Menus/ModemenuThree';
import ModemenuFour from '../Menus/ModemenuFour';
import ModemenuOne from '../Menus/ModemenuOne';
import InfoStylea from './components/InfoStylea';
import InfoStyleb from './components/InfoStyleb';
import InfoStylec from './components/InfoStylec';
import { getListArticle } from '@/api/moreInfor';
import { Encrypt } from '@/utils';

export default {
  components: {
    ModemenuFour,
    ModemenuThree,
    ModemenuTwo,
    ModemenuOne,
    InfoStylea,
    InfoStyleb,
    InfoStylec
  },

  props: {
    // 是否为超级用户
    isSuperman: {
      type: Boolean,
      default: false
    },
    // 轮播图
    swiperList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 角标
    hornMarkNums: {
      type: Object,
      default() {
        return {};
      }
    },
    // 公告
    announceList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 首页配置
    configData: {
      type: Object,
      default() {
        return {
          // 是否启用位置
          enablePos: 0,
          // 是否启用右上角
          enableRightFunc: 0,
          // 是否启用轮播
          enableRotation: 0,
          // 其否启用公告栏
          enableNotice: 0,
          // 是否启用资讯
          enableInfo: 0,
          // 是否启用底部
          enableFooter: 0,
          // 是否启用我的
          enableMine: 0,
          // 右上角按钮
          rightFunc: [],
          // 轮播
          rotateImg: {},
          // 公告信息
          notice: {},
          // 功能区
          funcArea: {
            groupArr: []
          },
          // 资讯
          info: {}
        };
      }
    }
  },

  data() {
    return {
      articleArr: []
    };
  },

  computed: {
    // 功能区
    funcGroup() {
      const { funcArea = {} } = this.configData;
      const { isSuperman } = this;
      const funcGroupArr = funcArea.groupArr || [];
      if (isSuperman) return funcGroupArr;
      return funcGroupArr.filter((item) => item.permission === '1' && item.menuArr.length > 0);
    },
    // 轮播图
    swiperListHasurl() {
      const { swiperList } = this;
      const list = [];
      swiperList.forEach((img) => {
        const { imgUrl, targetUrl } = img;

        if (imgUrl) {
          list.push({
            image: this.$apiot.getComUrlByToken(imgUrl),
            targetUrl
          });
        }
      });
      return list;
    },
    // 行业资讯
    industryInformation() {
      const { info = {} } = this.configData;
      return info;
    },
    jumpUrl() {
      return function(id) {
        return `/MoreInfor/components/InforDetails/index?id=${Encrypt(String(id))}`;
      };
    }
  },

  methods: {
    // 点检菜单
    clickMenu(menu, isJump = 0, params) {
      const { id } = menu;
      this.$store.dispatch('jumpMenu', { menuId: id, isJump, ...params });
    }
  },

  watch: {
    // 获取文章
    async funcGroup(v) {
      let obj = {};
      v.forEach((item) => {
        if (!item.rowNum && String(item.groupId)) {
          obj = item;
        }
      });
      if (JSON.stringify(obj) !== '{}') {
        const res = await getListArticle({
          count: obj.count,
          groupId: obj.groupId === 0 ? '' : obj.groupId,
          type: obj.term
        });
        this.articleArr = res;
      }
    }
  },

  created() {
    this.$bus.$off('clickMenu');
    this.$bus.$on('clickMenu', ({ menu, menuFilter, formData }) => {
      this.clickMenu(menu, 1, { menuFilter, formData });
    });
  },
  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
@import '../Menus/ModemenuTwo/index.scss';

$--name: 'tabnavHome__infor';
$--gridColumns: 4;
$--gridSize: 1fr;
$--gridRowGap: 18rpx;
$--gridColumnGap: 18rpx;
@include setMenuStyle(
  $--name,
  $--gridColumns,
  $--gridSize,
  $--gridRowGap,
  $--gridColumnGap
);

.tabnavHome {
  &__swiper {
    margin-top: 26rpx;
  }
  &__infor {
    &--box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
