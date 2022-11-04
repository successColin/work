<!--
 * @Author: sss
 * @Date: 2021-09-23 13:47:45
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-23 13:47:45
 * @Desc: 菜单样式———— 一行1个
-->
<template>
  <view class="modemenu modemenu__one">
    <p class="modemenu__one--title" v-if="modeObj.enableGroupName">
      {{ modeObj.name }}
    </p>
    <div class="modemenu__one--content">
      <view
        class="modemenu__one--item"
        :class="[modeObj.showStyle === 2 ? 'showImg' : 'showIcon']"
        v-for="menu in menuList"
        :key="menu.id"
        @click="clickMenu(menu)"
      >
        <!-- 图标 -->
        <div v-if="modeObj.showStyle === 1" class="modemenu__one--icon">
          <view class="icon">
            <gradient-icon
              v-if="menu.icon.icon"
              :icon="$apiot.getComIconUrl(menu.icon)"
              :color="menu.icon.color"
              :size="68"
              :enableGradient="menu.enableGradient"
              :gradientObj="menu.gradientObj"
            ></gradient-icon>
            <u-image
              v-else
              :src="$apiot.getComIconUrl(menu.icon)"
              mode="widthFix"
              height="100%"
              :fade="false"
            ></u-image>
          </view>
          <div class="modemenu__one--contentTitle">
            <span class="menuTitle font__ellipsis">{{ menu.menuName }}</span>
            <span class="menuDecs font__ellipsis" v-if="menu.des">{{
              menu.des
            }}</span>
          </div>
          <i
            class="appIcon appIcon-a-jinruyemianjiantou modemenu__one--backicon"
          ></i>
        </div>
        <!-- 图片 -->
        <p v-else class="modemenu__one--image">
          <u-image
            :src="$apiot.getComUrlByToken(menu.bgImgUrl)"
            mode="widthFix"
            height="100%"
            width="100%"
            :showLoading="false"
            :fade="false"
          ></u-image>
        </p>
        <HornMark :menu="menu" :hornMarkNums="hornMarkNums"></HornMark>
      </view>
    </div>
  </view>
</template>

<script>
import menuMixin from '../menuMixin';
import GradientIcon from '../GradientIcon';
import HornMark from '../HornMark';

export default {
  components: { GradientIcon, HornMark },

  mixins: [menuMixin],

  props: {
    // 角标
    hornMarkNums: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      heightArry: [140, 210, 280]
    };
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '../ModemenuTwo/index.scss';

$--name: 'modemenu__one';
$--gridColumns: 1;
$--gridSize: 1fr;
$--gridRowGap: 0;
$--gridColumnGap: 0;
@include setMenuStyle(
  $--name,
  $--gridColumns,
  $--gridSize,
  $--gridRowGap,
  $--gridColumnGap
);
.modemenu__one {
  &--item {
    &.showIcon {
      height: 140rpx;
      // border-bottom: solid 1px #e9e9e9;
      box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
    }
    // &.showImg {
    //   min-height: 180rpx;
    // }
  }
  &--icon {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
      flex-shrink: 0;
      width: 68rpx;
    }
    ::v-deep {
      image {
        width: 68rpx !important;
      }
    }
  }
  &--contentTitle {
    margin-left: 30rpx;
    flex: 1;
    font-family: $--font-family;
    color: #333333;
    overflow: hidden;
    .menuTitle {
      display: block;
      width: 100%;
      font-size: 30rpx;
      line-height: 42rpx;
    }
    .menuDecs {
      display: block;
      width: 100%;
      font-size: 30rpx;
      color: #aaaaaa;
      line-height: 30rpx;
    }
  }
  &--backicon {
    color: #9f9f9f;
  }
}
</style>
