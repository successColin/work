<!--
 * @Author: sss
 * @Date: 2021-09-23 13:47:45
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-23 13:47:45
 * @Desc: 菜单样式———— 一行4个 或者 5个1
-->
<template>
  <view v-if="num">
    <span
      class="hornMark markNum"
      v-if="
        menu.panelHornMarkId &&
        menu.hornMarkType === 1 &&
        menu.EnableCornerMarker === 1
      "
    >
      {{ num }}
    </span>
    <span
      class="hornMark markSpot"
      v-if="
        menu.panelHornMarkId &&
        menu.hornMarkType === 2 &&
        menu.EnableCornerMarker === 1
      "
    ></span>

    <span
      class="hornMark markNum"
      v-if="
        menu.hornMarkType === 1 &&
        menu.type === 2 &&
        menu.routeName === 'sysNotification' &&
        menu.EnableCornerMarker === 1
      "
    >
      {{ num }}
    </span>
    <span
      class="hornMark markNum"
      v-if="
        menu.hornMarkType === 2 &&
        menu.type === 2 &&
        menu.routeName === 'sysNotification' &&
        menu.EnableCornerMarker === 1
      "
    >
    </span>
  </view>
</template>

<script>
export default {
  props: {
    // 一行个数
    menu: {
      type: Object,
      default() {
        return {};
      }
    },
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

  computed: {
    num() {
      const { hornMarkNums, menu } = this;
      const { id, panelHornMarkId, hornMarkNeedPermissions, routeName } = menu;
      const needPermissions = hornMarkNeedPermissions ? 1 : 0;
      let value = hornMarkNums[`${id}-${panelHornMarkId}-${needPermissions}`] || 0;
      if (routeName === 'sysNotification') {
        value = hornMarkNums.sysNotification || 0;
      }
      return +value;
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.hornMark {
  position: absolute;
  right: 0;
  top: 0;
  height: 28rpx;
  line-height: 28rpx;
  background: #f6483e;
  border-radius: 14rpx;
  -webkit-border-radius: 14rpx;
  -moz-border-radius: 14rpx;
  -ms-border-radius: 14rpx;
  -o-border-radius: 14rpx;
  text-align: center;
  color: #ffffff;
  font-size: 20rpx;
  box-sizing: border-box;
  text-align: center;
}
.markSpot {
  width: 16rpx;
  height: 16rpx;
}
.markNum {
  min-width: 28rpx;
  padding: 0 8rpx;
}
</style>
