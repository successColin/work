<template>
  <section class="user" key="user" :class="{ big: isBig }">
    <el-avatar
      v-if="headImg && userInfo[headImg] && userInfo[headImg].imageUrl"
      :size="isBig ? 28 : 24"
      :src="userInfo[headImg].imageUrl"
    ></el-avatar>
    <div
      v-else
      class="user__circle"
      :style="{ background: `${colorIndex(userInfo)}` }"
    >
      {{ firstLetter(userInfo) }}
    </div>
    <div class="user__name">{{ userInfo[prop] }}</div>
    <i
      v-if="isClear"
      class="iconfont icon-guanbi user__clear"
      @click="clear"
    ></i>
  </section>
</template>

<script>
import { fontChange } from '@/utils/utils';

export default {
  props: {
    isClear: {
      type: Boolean,
      default: false
    },
    // 大小，小：24px 大：28px
    isBig: {
      type: Boolean,
      default: false
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

  components: {},

  computed: {
    firstLetter() {
      return function(row) {
        const userName = row[this.prop];
        return fontChange(userName);
      };
    },
    colorIndex() {
      return function(row) {
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

  mounted() {},

  methods: {
    clear() {
      this.$emit('handleClear', this.userInfo);
    }
  }
};
</script>

<style lang='scss' scoped>
.user {
  &.big {
    line-height: 28px;
    & .user__circle {
      width: 28px;
      line-height: 28px;
    }
  }
  margin: auto 0;
  padding-right: 6px;
  line-height: 24px;
  font-size: 13px;
  width: max-content;
  border-radius: 4px;
  display: flex;
  background: #f1f3f6;
  border-radius: 12px;
  color: #333333;
  div {
    display: inline-block;
  }
  &__circle {
    width: 24px;
    line-height: 24px;
    border-radius: 50%;
    text-align: center;
    background: #5a80ed;
    font-size: 10px;
    color: #ffffff;
  }
  &__name {
    margin: 0 6px 0 4px;
  }
  &__font--color {
    background: #333333 !important;
  }
  &__clear {
    font-size: 12px;
    cursor: pointer;
    color: #bbc3cd;
    &:hover {
      color: #6b798d;
    }
  }
}
</style>
