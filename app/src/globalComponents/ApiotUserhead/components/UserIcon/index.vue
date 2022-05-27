<!--
 * @Author: sss
 * @Date: 2021-10-09 09:58:31
 * @Last Modified by: sss
 * @Last Modified time: 2021-10-09 09:58:31
 * @Desc: 用户图标-有url显示图片，否则显示名称的首字母
-->
<template>
  <view class="userIcon">
    <view
      v-if="headImg && userInfo[headImg] && userInfo[headImg].imageUrl"
      :style="{
        width: `${size}rpx`,
      }"
    >
      <u-image
        :src="userInfo[headImg].imageUrl"
        :radius="size / 2"
        :width="`${size}rpx`"
        :height="`${size}rpx`"
        mode="widthFix"
        :showError="false"
      ></u-image>
    </view>
    <div
      v-else
      class="userIcon__circle"
      :style="{
        background: `${colorIndex(userInfo)}`,
        width: `${size}rpx`,
        lineHeight: `${size}rpx`,
      }"
    >
      {{ firstLetter(userInfo) }}
    </div>
  </view>
</template>

<script>
import { fontChange } from '@/utils';

export default {
  components: {},

  props: {
    size: {
      type: Number,
      default: 100
    },
    userInfo: {
      type: Object
    },
    // 左边字段，imageUrl：头像
    headImg: {
      type: String,
      default: 'icon'
    },
    // 根据这个字段取颜色
    colorId: {
      type: String,
      default: 'userId'
    },
    // 当前作用的字段名
    prop: {
      type: String,
      default: 'username'
    }
  },

  data() {
    return {};
  },

  computed: {
    firstLetter() {
      return function (row) {
        const userName = row[this.prop];
        return fontChange(userName);
      };
    },
    colorIndex() {
      return function (row) {
        const colors = ['#5A80ED', '#FAB71C', '#FC8256', '#EE5E5E', '#34C7BE'];
        let index = row[this.colorId] || 0;
        // 如果根据colorId没有获取到对应的值，则根据首字母
        if (!index) {
          const firstLetterUnicode = this.firstLetter(row).charCodeAt(0); // 获取首字母的unicode码
          index = firstLetterUnicode - 65; // 确定字母在26个字母中第几位，65代表A
        }
        const colorIndex = index % 5;
        return colors[colorIndex] || '';
      };
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.userIcon {
  &__circle {
    font-size: 40rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    text-align: center;
    color: #ffffff;
    border-radius: 50%;
    letter-spacing: 2rpx;
  }
}
</style>
