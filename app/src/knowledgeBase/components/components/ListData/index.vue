<!--
 * @Descripttion: 列表
 * @Author: ytx
 * @Date: 2022-01-06 11:35:03
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-06 11:35:03
-->
<template>
  <div>
    <u-list
      @scrolltolower="scrolltolower"
      v-if="dataArr.length !== 0"
      :height="computedHeight"
    >
      <u-list-item v-for="(item, index) in dataArr" :key="index">
        <section class="listData" @click="handleJumpIn(item)">
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
                    ? `${item.sysKlTree.modifyTime}`
                    : item.sysKlTree.createTime
                }}
              </div>
              <!-- <div class="listData__dec--url">
              <div>{{ item.url }}</div>
            </div> -->
            </div>
            <i
              class="appIcon appIcon-gengduo"
              @click.stop="handleMoreOper(item)"
            ></i>
          </div>
        </section>
      </u-list-item>
    </u-list>
    <nodata v-else style="min-height: 70vh"></nodata>
  </div>
</template>

<script>
import { PREVIEW_FILE } from '@/utils/preview.js';
import nodata from '@/globalComponents/ApiotMenu/Common/nodata';

export default {
  props: {
    dataArr: {
      type: Array,
      default: () => []
    },
    isShowMoreOper: {
      type: Boolean,
      default: false
    },
    currentObj: {
      type: Object,
      default: () => {}
    },
    pathArr: {
      type: Array,
      default: () => []
    },
    videoPreviewUrl: {
      type: String,
      default: ''
    }
  },
  inject: ['getList', 'visitRecordFun', 'fileTypeImg'],
  data() {
    return {};
  },
  components: { nodata },
  computed: {
    imgUrl() {
      return function (name) {
        return this.fileTypeImg(name);
      };
    },
    computedHeight() {
      return '100%';
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleMoreOper(v) {
      this.$emit('update:isShowMoreOper', true);
      this.$emit('update:currentObj', v);
    },
    // 底部多少时候出发事件
    scrolltolower() {
      this.$emit('scrolltolower');
    },
    // 跳转子目录 和 预览
    handleJumpIn(v) {
      if (v.sysKlTree.treeType === 1) {
        this.getList({
          parentId: v.sysKlTree.id
        });
        console.log(v);
        const arr = [
          ...this.pathArr,
          {
            name: v.sysKlTree.name,
            id: v.sysKlTree.id
          }
        ];
        this.$emit('update:pathArr', arr);
      } else {
        // 记录访问次
        this.visitRecordFun(v);
        // 预览
        const { id, name, url } = v.sysKlTree; // fileLength
        const video = PREVIEW_FILE(
          {
            id,
            name,
            // fileLength,
            url,
            apiUrl: `${this.baseUrl || this.defaultUrl}file/fileDownload`,
            token: uni.getStorageSync('token')
          },
          this
        );
        if (video.type === 'video') {
          this.$emit('update:videoPreviewUrl', video.url);
        }
      }
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
      line-height: 40rpx;
      color: #333333;
    }
    &--url,
    &--userName {
      font-size: 24rpx;
      line-height: 24rpx;
      color: #808080;
      margin-top: 15rpx;
      flex: 1;
    }
    i {
      color: #bbc3cd;
      font-size: 36rpx;
      height: 100%;
      padding: 0 20rpx;
      display: flex;
      align-items: center;
    }
  }
}
</style>
