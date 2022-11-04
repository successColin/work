<!--
 * @Author: sss
 * @Date: 2022-03-05 09:56:56
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-05 09:56:56
 * @Desc: 搜索框
-->
<template>
  <section class="searchBox">
    <div class="searchBox__types" v-if="list.length > 0">
      <apiot-select-down
        :value="downSelect && downSelect.value"
        :list="list"
        @select="select"
      ></apiot-select-down>
    </div>
    <div class="filter--line" v-if="list.length > 0"></div>
    <div
      class="searchBox__content"
      :class="[list.length === 0 ? 'noSelect' : '']"
    >
      <input
        v-model="keyword"
        focus
        placeholder-class="inputPlaceholder"
        :placeholder="placeholder"
        confirm-type="search"
        @focus="handleFocus"
        @blur="handleBlur"
        @confirm="click"
      />
      <i
        class="appIcon appIcon-sousuo"
        @click="click"
        :class="[isFocus ? getThemeColorFont : '']"
      ></i>
      <i
        v-if="enableScan"
        class="appIcon appIcon-saoma"
        @click.stop="gotoScan"
      ></i>
    </div>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否启动扫描
    enableScan: Boolean
  },

  data() {
    return {
      downSelect: null,
      keyword: '',
      isFocus: true
    };
  },

  computed: {
    listValue() {
      const { list } = this;
      if (list.length > 0) return list[0];
      return {};
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    },
    placeholder() {
      return `在${this.listValue.name || '关键字'}中搜索`;
    }
  },

  methods: {
    async gotoScan() {
      try {
        const qrResult = await this.$apiot.scanCode();
        const { result } = qrResult;
        this.keyword = result;
      } catch (error) {
        console.error(error);
      }
    },
    handleFocus() {
      this.isFocus = true;
    },
    handleBlur() {
      this.isFocus = false;
      // this.click();
    },
    // 下拉框选择
    select(e) {
      // eslint-disable-next-line prefer-destructuring
      this.downSelect = e[0];
    },
    // 点击搜索按钮
    click() {
      const { downSelect, keyword, list } = this;
      const obj = { keyword };
      // eslint-disable-next-line prefer-destructuring
      if (list.length > 0 && !downSelect) obj.downParam = list[0];
      else obj.downParam = downSelect;
      this.$emit('search', obj);
    },
    // 设置关键字
    setKeyword({ keyword, downParam, changeDown }) {
      this.keyword = keyword;
      if (changeDown) this.downSelect = downParam;
    }
  },

  mounted() {},

  created() {
    this.downSelect = this.listValue;
  }
};
</script>

<style lang='scss' scoped>
.inputPlaceholder {
  font-size: 30rpx;
  font-family: $--font-family;
  font-weight: 400;
  color: #aaaaaa;
}
.searchBox {
  height: $list-search-height;
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  &__types {
    padding-left: 30rpx;
    width: 130rpx;
    flex-shrink: 0;
  }
  .filter--line {
    margin: 0 29rpx;
    width: 1rpx;
    height: 29rpx;
    background: #d9d9d9;
  }
  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    &.noSelect {
      padding-left: 30rpx;
    }
    input {
      flex: 1;
      height: 100%;
      font-size: 15px;
    }
    .appIcon-sousuo {
      font-size: 38rpx;
      padding: 20rpx 30rpx;
      color: #bbc3cd;
    }
    .appIcon-saoma {
      padding-right: 30rpx;
      font-size: 48rpx;
      color: #bbc3cd;
    }
  }
}
</style>
