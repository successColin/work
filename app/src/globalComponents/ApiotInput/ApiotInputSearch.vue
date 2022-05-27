<!--
 * @Author: sss
 * @Date: 2022-02-14 14:43:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-14 14:43:24
 * @Desc: 搜索框
-->
<template>
  <view class="apiotInputSearch" :class="serachClass">
    <!-- <u-sticky :customNavHeight="customBar"> -->
    <slot name="searchTop"></slot>
    <view class="apiotInputSearch__input">
      <i
        class="appIcon appIcon-sousuo"
        :class="[searchParams && searchParams.keyword ? getThemeColorFont : '']"
      ></i>
      <div class="apiotInputSearch__input__keywords" @click="goToSearch">
        <span v-if="searchParams && searchParams.keyword">{{
          searchParams.keyword
        }}</span>
        <span class="keywords__placeholder" v-else>{{
          placeholder || $t('placeholder.pleaseEnterkeySearch')
        }}</span>
      </div>
      <p
        class="apiotInputSearch__input__clear"
        v-if="searchParams && searchParams.keyword"
        @click.stop="clear"
      >
        <i
          class="appIcon appIcon-quanshan"
          :class="[filterActivity ? getThemeColorFont : '']"
        ></i>
      </p>
      <div
        v-if="isFilter"
        class="apiotInputSearch__input__filter"
        @click.stop="clickFilter"
      >
        <span class="filter--line"></span>
        <span
          class="filter--text"
          :class="[filterActivity ? getThemeColorFont : '']"
          >筛选</span
        >
        <i
          class="appIcon appIcon-shaixuan"
          :class="[filterActivity ? getThemeColorFont : '']"
        ></i>
      </div>
      <slot name="searchRight"></slot>
    </view>
    <slot name="searchBttom"></slot>
    <!-- </u-sticky> -->
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    serachClass: String,
    // 便捷搜索下拉框
    searchPorpArr: {
      type: Array,
      default() {
        return [];
      }
    },
    // 提示文字
    placeholder: String,
    // 用于搜索存储的标识
    searchFlag: {
      type: String,
      default: 'common'
    },
    // 是否有高级筛选功能
    isFilter: {
      type: Boolean,
      default: false
    },
    // 高级筛选按钮的颜色
    filterActivity: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // 搜索框的唯一标识
      flag: null,
      searchParams: null
    };
  },

  watch: {
    searchPorpArr(newValue) {
      if (newValue.length > 0) this.setDownList(newValue);
    }
  },

  computed: {
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.customBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    }
  },

  methods: {
    // 点击清空按钮
    clear() {
      this.searchParams.keyword = '';
      this.$emit('search', this.searchParams);
      this.$emit('clearSearchBox');
    },
    // 点击筛选按钮
    clickFilter() {
      this.$emit('clickFilter');
    },
    // 设置搜索框中下拉框的内容
    setDownList(list) {
      this.$store.commit('setICSearchDown', { flag: this.flag, list });
    },
    // 跳转至通用搜索界面
    goToSearch() {
      uni.navigateTo({
        url: `/interfaceCommon/search?flag=${this.flag}&searchParams=${JSON.stringify(
          this.searchParams || {}
        )}&searchFlag=${this.searchFlag}`
      });
    },
    // 回填搜索的值
    getValue(e) {
      this.searchParams = { ...e.searchParams };
      this.$emit('search', this.searchParams);
    }
  },

  mounted() {},

  created() {
    this.flag = `apiotInputSearch${this._uid}`;
    this.setDownList(this.searchPorpArr);
    this.$bus.$on(this.flag, this.getValue);
  },

  beforeDestroy() {
    this.$bus.$off(this.flag);
  }
};
</script>

<style lang='scss' scoped>
.apiotInputSearch {
  background: #ffffff;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  &__input {
    box-sizing: border-box;
    padding: 0 30rpx;
    width: 100%;
    height: $list-search-height;
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #808080;
    .keywords__placeholder {
      color: #aaaaaa;
    }
    .appIcon {
      font-size: 18px;
      color: #bbc3cd;
    }
    .appIcon-sousuo {
      margin-right: 20rpx;
    }
    &__clear {
      padding: 26rpx;
      font-size: 30rpx;

      .appIcon-quanshan {
        color: #808080;
      }
    }
    &__keywords {
      flex: 1;
      height: $list-search-height;
      line-height: $list-search-height;
    }
    &__filter {
      flex-shrink: 0;
      max-width: 153rpx;
      display: flex;
      align-items: center;

      .filter--text {
        margin: 0 6rpx;
      }
      .filter--line {
        margin: 0 18rpx 0 6rpx;
        width: 1rpx;
        height: 28rpx;
        background: #d9d9d9;
      }
    }
  }
}
</style>
