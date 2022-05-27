<!--
 * @Descripttion: 列表
 * @Author: ytx
 * @Date: 2022-01-06 11:35:03
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-06 11:35:03
-->
<template>
  <u-list @scrolltolower="scrolltolower">
    <u-list-item v-for="(item, index) in dataArr" :key="index">
      <section class="listData">
        <image class="listData__img" :src="imgUrl(item.fileName)" alt="" />
        <div class="listData__dec">
          <div>
            <div class="listData__dec--fileName">{{ item.fileName }}</div>
            <div class="listData__dec--userName">{{ item.state }}</div>
            <div class="listData__dec--url">
              <div>{{ item.url }}</div>
            </div>
          </div>
          <i class="appIcon appIcon-gengduo" @click="handleMoreOper"></i>
        </div>
      </section>
    </u-list-item>
  </u-list>
</template>

<script>
import { fileType } from '@/utils/index';

export default {
  props: {
    dataArr: {
      type: Array,
      default: () => []
    },
    isShowMoreOper: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    imgUrl() {
      return function(name) {
        console.log(fileType(name));
        return fileType(name);
      };
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleMoreOper() {
      this.$emit('update:isShowMoreOper', true);
    },
    // 底部多少时候出发事件
    scrolltolower() {}
  }
};
</script>
<style lang='scss' scoped>
$listHeight: 180rpx;
.listData {
  display: flex;
  justify-content: space-between;
  // width: 100%;
  height: $listHeight;
  padding: 0 30rpx;
  background: #fff;
  &__img {
    width: 60rpx;
    height: auto;
    margin: 0 36rpx 30rpx 3px;
  }
  &__dec {
    display: flex;
    align-items: center;
    flex: 1;
    border-bottom: 1px solid #e9e9e9;
    justify-content: space-between;
    &--fileName {
      font-size: 32rpx;
      color: #333333;
    }
    &--url,
    &--userName {
      font-size: 24rpx;
      color: #808080;
      margin-top: 16rpx;
    }
    i {
      color: #bbc3cd;
      font-size: 36rpx;
    }
  }
}
</style>
