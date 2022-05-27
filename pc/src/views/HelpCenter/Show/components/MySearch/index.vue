<!--
 * @Descripttion: 搜索内容
 * @Author: ytx
 * @Date: 2021-06-03 19:33:49
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-03 19:33:49
-->
<template>
  <section class="mySearch">
    <img src="@/assets/img/helpCenterBkgd.png" alt="" />
    <div class="mySearch__content">
      <section>
        <div class="mySearch__input">
          <apiot-input
            :placeholder="inputPlaceholder"
            v-model="inputVal"
            clearable
            @keyup.enter.native="handleSearch('')"
            @change="handleSearch('')"
          >
          </apiot-input>
          <apiot-button
            slot="append"
            icon="iconfont icon-sousuo"
            class="apiot__primary"
            @click="handleSearch('')"
          ></apiot-button>
        </div>
        <div class="m-t-10">
          <div>{{ $t('helpCenter.TopSearches') }}</div>
          <div
            v-for="(item, i) in searchesArr"
            :key="i"
            class="mySearch__val font__ellipsis"
            @click="handleSearch(item)"
            :title="item"
          >
            {{ item }}
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { postHotSearch, getlistDetailShowSearch } from '@/api/helpCenter';

export default {
  props: {
    parentId: {
      type: Number,
      default: 1
    },
    page: {
      type: Object,
      default: () => {}
    },
    isShowSearchValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchesArr: [],
      inputVal: ''
    };
  },
  components: {},
  computed: {
    inputPlaceholder() {
      switch (this.parentId) {
        case 1:
          return this.$t('helpCenter.search', { name: this.$t('helpCenter.helpDocument') });
        case 2:
          return this.$t('helpCenter.search', { name: this.$t('helpCenter.videoTutorial') });
        case 3:
          return this.$t('helpCenter.search', { name: this.$t('helpCenter.qA') });
        case 4:
          return this.$t('helpCenter.search', { name: this.$t('helpCenter.updateLog') });
        default:
          return '';
      }
    }
  },
  watch: {
    page() {
      this.searchFun();
    }
  },
  mounted() {
    this.getHotSearch();
  },
  methods: {
    // 热搜词
    async getHotSearch() {
      const res = await postHotSearch({
        parentId: this.parentId
      });
      this.searchesArr = res;
    },
    handleSearch(val) {
      if (val) this.inputVal = val;
      if (!this.inputVal) {
        this.$emit('update:isShowSearchValue', false);
        return;
      }
      this.searchFun();
    },
    async searchFun() {
      const res = await getlistDetailShowSearch({
        parentId: this.parentId,
        searchKey: this.inputVal,
        current: this.page.current,
        size: this.page.size
      });
      res.searchName = this.inputVal;
      this.$emit('searchValue', res);
    }
  }
};
</script>
<style lang='scss' scoped>
$headerHeight: 130px;
.mySearch {
  height: $headerHeight;
  img {
    height: $headerHeight;
    width: 100%;
  }
  &__content {
    height: $headerHeight;
    position: absolute;
    top: 0;
    color: #ffffff;
    font-size: 13px;
    width: 100%;
    .mySearch__input {
      position: relative;
      .apiot__primary {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    & > section {
      display: flex;
      margin: 0 auto;
      justify-content: center;
      flex-direction: column;
      width: 33%;
      height: 100%;
      & > div:last-child {
        display: flex;
        & > div:first-child {
          white-space: nowrap;
        }
        .mySearch__val {
          padding: 0 10px;
          border-right: 1px solid #ffffff;
          cursor: pointer;
          width: min-content;
          max-width: calc((100% - 71px) / 3);
        }
        .mySearch__val:last-child {
          border-right: none;
        }
        .mySearch__val:hover {
          text-decoration: underline;
        }
      }
      ::v-deep {
        .el-button {
          height: 36px;
          border: 0;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        .iconfont {
          color: #ffffff;
        }
        .el-input__inner {
          height: 36px;
          padding-right: 70px;
        }
        .el-input__suffix {
          padding-right: 42px;
        }
      }
    }
  }
}
</style>
