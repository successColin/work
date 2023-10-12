<!--
 * @Author: sss
 * @Date: 2021-09-23 13:47:45
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-23 13:47:45
 * @Desc: 菜单样式———— 一行3个
-->
<template>
  <view class="modemenu modemenu__three">
    <p class="modemenu__three--title" v-if="modeObj.enableGroupName">
      {{ modeObj.name }}
    </p>
    <div class="modemenu__three--content">
      <view
        class="modemenu__three--item"
        :class="[modeObj.showStyle === 2 ? 'showImg' : 'showIcon']"
        :style="{ background: menu.bgColor }"
        v-for="menu in menuList"
        :key="menu.id"
        @click="clickMenu(menu)"
      >
        <!-- 图标 -->
        <p v-if="modeObj.showStyle === 1" class="modemenu__three--icon">
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
          <span class="menuTitle font__ellipsis">{{ menu.menuName }}</span>
        </p>
        <!-- 图片 -->
        <p v-else class="modemenu__three--image">
          <u-image
            :src="$apiot.getComUrlByToken(menu.bgImgUrl)"
            mode="widthFix"
            height="100%"
            width="100%"
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
    // 角标
    hornMarkNums: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickMenu(menu) {
      this.$emit('clickMenu', menu);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '../ModemenuTwo/index.scss';

$--name: 'modemenu__three';
$--gridColumns: 3;
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
.modemenu__three {
  &--item {
    &.showIcon {
      padding: 26rpx 20rpx 20rpx 20rpx;
    }
    &.showImg {
      min-height: 140rpx;
    }
  }
  &--icon {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .icon {
      flex-shrink: 0;
      width: 68rpx;
    }
    ::v-deep {
      image {
        width: 60rpx !important;
      }
    }

    .menuTitle {
      width: inherit;
      margin-top: 10rpx;
      flex: 1;
      font-size: 28rpx;
      font-family: $--font-family;
      color: #333333;
      line-height: 34rpx;
    }
  }
}
</style>
