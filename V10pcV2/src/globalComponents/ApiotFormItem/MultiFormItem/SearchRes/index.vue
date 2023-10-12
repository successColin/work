<!-- 字段模糊搜索结果 -->
<template>
  <section class="searchRes m-t-6" v-show="searchField">
    <div class="searchRes__item">
      {{ $t('common.search') }}“<span class="searchRes__item--keys">{{
        getSearchValue
      }}</span
      >” {{ $t('common.resultNum', { num: resArr.length }) }}
    </div>
    <ul class="searchRes__wrapper" v-show="resArr.length">
      <li
        class="searchRes__item"
        v-for="(item, index) in resArr"
        :key="index"
        @click="itemClick(item)"
      >
        <i
          :class="`iconfont ${itemIconClass} iconfont__${itemTheme} m-r-4`"
          v-if="itemIconClass"
        ></i>
        {{ item[showProp] }}{{ item.memo ? `(${item.memo})` : '' }}
      </li>
    </ul>
  </section>
</template>

<script>
import bus from '@/utils/bus';

export default {
  inheritAttrs: false,
  props: {
    searchField: {
      type: String,
      default: ''
    },
    // 结果数组
    resArr: {
      type: Array,
      default() {
        return [];
      }
    },
    // 显示的prop
    showProp: {
      type: String,
      default: ''
    },
    // 子项icon 的主题色
    // 1 是黄色 2 红色 3 蓝色
    itemTheme: {
      type: Number,
      default: 1
    },
    // 子项的icon class
    itemIconClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getSearchValue() {
      if (this.searchField.length > 16) {
        return this.searchField.replace(/^(.{2}).*(.{2})$/g, '$1...$2');
      }
      return this.searchField;
    }
  },

  mounted() {},

  methods: {
    itemClick(item) {
      // this.$emit('itemClick', item);
      bus.$emit('selectRes', item[this.showProp], item);
    }
  }
};
</script>

<style lang='scss' scoped>
.searchRes {
  position: absolute;
  left: 0;
  right: 0;
  max-height: 164px;
  padding: 10px 0px;
  box-sizing: border-box;
  background: #ffffff;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  z-index: 10;
  overflow: hidden;
  &__item {
    height: 36px;
    line-height: 36px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    &--keys {
      color: $--color-primary;
    }
  }
  &__wrapper {
    overflow-y: auto;
    max-height: 108px;
    .searchRes__item {
      &:hover {
        background: #f1f7ff;
      }
    }
  }
}
// item 主题色
.iconfont {
  font-size: 20px;
  &__1 {
    color: #fa6400;
  }
  &__2 {
    color: #ee5e5e;
  }
  &__3 {
    color: #4689f6;
  }
}
</style>
