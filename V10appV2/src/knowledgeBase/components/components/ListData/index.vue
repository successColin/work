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
      :height="height"
    >
      <u-list-item v-for="(item, index) in dataArr" :key="index">
        <section class="listData" @click="handleJumpIn(item)">
          <!-- <image class="listData__img" :src="" alt="" /> -->
          <i class="listData__img appIcon" :class="[imgUrl(item)]"></i>
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
    <nodata v-else :style="{ height: height + 'px' }"></nodata>
  </div>
</template>

<script>
import nodata from '@/menuConfigure/components/MenuMain/Nodata';

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
    },
    height: {
      type: Number,
      default: 0
    }
  },
  inject: ['getList', 'visitRecordFun', 'fileTypeImg'],
  data() {
    return {};
  },
  components: { nodata },
  computed: {
    // 是否需要加水印
    isWatermark() {
      return this.$store.getters.getWatermark;
    },
    imgUrl() {
      return function(name) {
        return this.fileTypeImg(name);
      };
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    scrolltolower() {
      this.$emit('scrolltolower');
    },
    handleMoreOper(v) {
      this.$emit('update:isShowMoreOper', true);
      this.$emit('update:currentObj', v);
    },
    // 跳转子目录 和 预览1
    handleJumpIn(v) {
      if (v.sysKlTree.treeType === 1) {
        this.getList({
          parentId: v.sysKlTree.id
        });
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
        const { name, url, id } = v.sysKlTree;
        const imgArr = [];
        let index = -1;
        if (v.sysKlTree.treeType === 3) {
          this.dataArr.forEach((item) => {
            if (item.sysKlTree.treeType === 3) {
              console.log(item);
              console.log(id);
              imgArr.push(item.sysKlTree);
              if (item.sysKlTree.id === id) index = imgArr.length - 1;
            }
          });
        }
        this.$apiot.preview.previewFile({
          file: imgArr.length === 0 ? [v.sysKlTree] : imgArr,
          currentIndex: index,
          isWatermark: this.isWatermark,
          fileParamUrl: 'url',
          fileParamName: 'name'
        });
        const suffix = this.$apiot.preview.getFileSuffix(name);
        const type = this.$apiot.preview.getFileType(suffix);
        if (type === 'video') {
          this.$emit('update:videoPreviewUrl', this.$apiot.getComUrlByToken(url));
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
