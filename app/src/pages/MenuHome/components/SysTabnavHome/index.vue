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
      <u-swiper
        keyName="image"
        indicatorPos="bottomRight"
        :list="swiperListHasurl"
        :height="110"
      ></u-swiper>
    </view>

    <view v-for="(item, index) in funcGroup" :key="`funcGroup_${index}`">
      <modemenu-four
        v-if="item.rowNum === 4 || item.rowNum === 5"
        :rowNum="item.rowNum"
        :modeObj="item"
        @clickMenu="clickMenu"
      ></modemenu-four>

      <modemenu-three
        v-else-if="item.rowNum === 3"
        :modeObj="item"
        @clickMenu="clickMenu"
      ></modemenu-three>

      <modemenu-two
        v-else-if="item.rowNum === 2"
        :modeObj="item"
        @clickMenu="clickMenu"
      ></modemenu-two>

      <modemenu-one
        v-else-if="item.rowNum === 1"
        :modeObj="item"
        @clickMenu="clickMenu"
      ></modemenu-one>
    </view>
  </view>
</template>

<script>
import { appRouteArr } from '@/config';

import ModemenuTwo from '../Menus/ModemenuTwo';
import ModemenuThree from '../Menus/ModemenuThree';
import ModemenuFour from '../Menus/ModemenuFour';
import ModemenuOne from '../Menus/ModemenuOne';

export default {
  components: { ModemenuFour, ModemenuThree, ModemenuTwo, ModemenuOne },

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
    return {};
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
            image: imgUrl,
            targetUrl
          });
        }
      });
      return list;
    }
  },

  methods: {
    // 点检菜单
    clickMenu(menu, isJump = 0) {
      const { type, id, menuName, groupCompId } = menu;
      // type菜单类型 1-普通菜单；2-系统菜单；3-应用
      if (type === 3) {
        uni.navigateTo({
          url: `/pages/MenuHome/applicationTab?menu=${id}&name=${menuName}&areaType=funcArea&groupCompId=${groupCompId}`
        });
      } else if (type === 2) {
        // isJump:1=正常菜单，2=跳转菜单
        // 固定菜单
        const { routeName, offlineCheck } = menu;
        this.$store.commit('setSystemMenusConfig', { [id]: offlineCheck });
        const systemMenu = appRouteArr.find((sys) => sys.routeName === routeName);
        if (systemMenu.url) {
          uni.navigateTo({
            url: `${systemMenu.url}?id=${id}&title=${menuName}&isJump=${isJump}`,
            animationType: 'slide-in-right'
          });
        }
      } else {
        uni.navigateTo({
          url: `/menuConfigure/index?id=${id}&title=${menuName}&isJump=${isJump}`,
          animationType: 'slide-in-right'
        });
      }
    }
  },

  mounted() {},

  created() {
    this.$bus.$off('clickMenu');
    this.$bus.$on('clickMenu', (menu) => {
      this.clickMenu(menu, 1);
    });
  }
};
</script>

<style lang='scss' scoped>
.tabnavHome {
  &__swiper {
    margin-top: 26rpx;
  }
}
</style>
