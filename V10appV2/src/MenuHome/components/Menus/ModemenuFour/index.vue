<!--
 * @Author: sss
 * @Date: 2021-09-23 13:47:45
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-23 13:47:45
 * @Desc: 菜单样式———— 一行4个 或者 5个1
-->
<template>
  <view class="modemenu modemenu__four">
    <p class="modemenu__four--title" v-if="modeObj.enableGroupName">
      {{ modeObj.name }}
    </p>
    <div class="modemenu__four--content" :class="[rowNum === 5 ? 'five' : '']">
      <view
        class="modemenu__four--item"
        :class="[modeObj.showStyle === 2 ? 'showImg' : 'showIcon']"
        v-for="menu in menuList"
        :key="menu.id"
        @click="clickMenu(menu)"
      >
        <!-- 图标 -->
        <p v-if="modeObj.showStyle === 1" class="modemenu__four--icon">
          <view class="icon">
            <gradient-icon
              v-if="menu.icon.icon"
              :icon="menu.icon.icon"
              :color="menu.icon.color"
              :size="80"
              :enableGradient="menu.enableGradient"
              :gradientObj="menu.gradientObj"
            ></gradient-icon>
            <u-image
              v-else
              :src="$apiot.getComIconUrl(menu.icon)"
              mode="widthFix"
              height="100%"
              :showError="false"
              :fade="false"
            ></u-image>
          </view>
          <span class="menuTitle font__ellipsis">{{ menu.menuName }}</span>
        </p>
        <!-- 图片 -->
        <p v-else class="modemenu__four--image">
          <u-image
            :src="$apiot.getComUrlByToken(menu.bgImgUrl)"
            mode="widthFix"
            height="100%"
            width="100%"
            :showLoading="false"
            :showError="false"
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
import GradientIcon from '../../GradientIcon';
import HornMark from '../HornMark';

export default {
  components: { GradientIcon, HornMark },

  mixins: [menuMixin],

  props: {
    // 一行个数
    rowNum: {
      type: Number,
      default: 4
    },
    // 角标
    hornMarkNums: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  // #ifdef MP-WEIXIN
  options: { styleIsolation: 'apply-shared' },
  // #endif

  data() {
    return {};
  },

  computed: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '../ModemenuTwo/index.scss';

$--name: 'modemenu__four';
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
.modemenu__four {
  &--content {
    &.five {
      grid-template-columns: repeat(5, $--gridSize);
    }
  }
  &--item {
    // &.showIcon {
    //   height: 140rpx;
    // }
    &.showImg {
      height: 140rpx;
    }
  }
  &--icon {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
      flex-shrink: 0;
      width: 80rpx;
      height: 80rpx;
    }
    ::v-deep {
      image {
        width: 80rpx !important;
      }
    }

    .menuTitle {
      width: inherit;
      margin-top: 18rpx;
      width: 100%;
      flex: 1 0 auto;
      text-align: center;
      font-size: 13px;
      font-family: $--font-family;
      color: #333333;
      line-height: 17px;
    }
  }
}
</style>
