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
        <image class="listData__img" :src="imgUrl(item)" alt="" />
        <div class="listData__dec">
          <div class="listData__dec--right">
            <!-- 文件名 -->
            <div class="listData__dec--fileName font__ellipsis">
              {{ item.sysKlTree.name }}
            </div>
            <!-- 时间 -->
            <div class="listData__dec--userName font__ellipsis">
              {{
                item.sysKlTree.modifyTime
                  ? `${item.sysKlTree.modifyTime} 更新`
                  : item.sysKlTree.createTime
              }}
            </div>
            <!-- <div class="listData__dec--url">
              <div>{{ item.url }}</div>
            </div> -->
          </div>
          <i class="appIcon appIcon-gengduo" @click="handleMoreOper"></i>
        </div>
      </section>
    </u-list-item>
  </u-list>
</template>

<script>
import { fileTypeImg } from '@/utils/index';

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
      return function (name) {
        // console.log(fileTypeImg(name));
        return fileTypeImg(name);
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
    scrolltolower() {
      this.$emit('scrolltolower');
    }
  }
};
</script>
<style lang='scss' scoped>
$listHeight: 140rpx;
.listData {
  display: flex;
  justify-content: space-between;
  height: $listHeight;
  padding: 0 30rpx;
  background: #fff;
  &__img {
    width: 68rpx;
    height: auto;
  }
  &__dec {
    display: flex;
    align-items: center;
    flex: 1;
    border-bottom: 1px solid #e9e9e9;
    justify-content: space-between;
    margin-left: 36rpx;
    &--right {
      width: 20px;
      flex: 1;
    }
    &--fileName {
      font-size: 32rpx;
      line-height: 32rpx;
      color: #333333;
    }
    &--url,
    &--userName {
      font-size: 24rpx;
      line-height: 24rpx;
      color: #808080;
      margin-top: 20rpx;
      flex: 1;
    }
    i {
      color: #bbc3cd;
      font-size: 36rpx;
    }
  }
}
</style>
