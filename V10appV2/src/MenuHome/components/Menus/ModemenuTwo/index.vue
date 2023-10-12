<!--
 * @Author: sss
 * @Date: 2021-09-23 13:47:45
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-23 13:47:45
 * @Desc: 菜单样式———— 一行2个
-->
<template>
  <view class="modemenu modemenu__two">
    <p class="modemenu__two--title" v-if="modeObj.enableGroupName">
      {{ modeObj.name }}
    </p>
    <div class="modemenu__two--content">
      <view
        class="modemenu__two--item"
        :class="[modeObj.showStyle === 2 ? 'showImg' : 'showIcon']"
        :style="{ background: menu.bgColor }"
        v-for="menu in menuList"
        :key="menu.id"
        @click="clickMenu(menu)"
      >
        <!-- 图标 -->
        <p v-if="modeObj.showStyle === 1" class="modemenu__two--icon">
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
              :showLoading="false"
              :showError="false"
              :fade="false"
            ></u-image>
          </view>
          <span class="menuTitle font__ellipsis">{{ menu.menuName }}</span>
        </p>
        <!-- 图片 -->
        <p v-else class="modemenu__two--image">
          <!-- <u-image
            :src="menu.bgImgUrl"
            mode="widthFix"
            height="140rpx"
          ></u-image> -->
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
@import './index.scss';

$--name: 'modemenu__two';
$--gridColumns: 2;
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
.modemenu__two {
  &--item {
    &.showIcon {
      padding: 37rpx 26rpx 30rpx 26rpx;
    }
    &.showImg {
      min-height: 140rpx;
    }
  }
  &--icon {
    width: 100%;
    display: flex;
    flex-direction: row;
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
    .menuTitle {
      width: inherit;
      margin-left: 14rpx;
      flex: 1;
      width: 168px;
      font-size: 30rpx;
      font-family: $--font-family;
      color: #333333;
      line-height: 36rpx;
    }
  }
}
</style>
