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
              <div
                class="listData__dec--fileName font__ellipsis"
                v-show="isShowEle('RelateName')"
              >
                {{ item.name }}
              </div>
              <!-- 时间 -->
              <div class="listData__dec--detail font__ellipsis">
                <div
                  :class="'source_' + typeVal(item)"
                  v-show="isShowEle('RelateType')"
                >
                  {{
                    typeVal(item) === 1
                      ? '本地上传'
                      : typeVal(item) === 2
                      ? '关联知识库'
                      : '业务关联'
                  }}
                </div>
                <div v-show="isShowEle('RelateUserName')">
                  {{ item.uploadUserName }}
                </div>
                <div v-show="isShowEle('RelateCreateTime')">
                  {{
                    item.modifyTime
                      ? `${item.modifyTime.slice(
                          0,
                          item.modifyTime.length - 3
                        )}`
                      : item.createTime.slice(0, item.createTime.length - 3)
                  }}
                </div>
              </div>
            </div>
            <!-- 目前只有下载 -->
            <i
              class="appIcon appIcon-gengduo"
              @click.stop="handleMoreOper(item)"
              v-show="funcConfig.showDownload && item.treeType !== 1"
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
import { visitRecord } from '@/api/knowledgeBase';

export default {
  props: {
    parentId: {
      type: Number,
      default: 0
    },
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
    funcConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: { nodata },
  computed: {
    imgUrl() {
      return function (v) {
        return this.fileTypeImg(v);
      };
    },
    computedHeight() {
      return '100%';
    },
    typeVal() {
      return function (item) {
        return (
          item.materialType ||
          (this.pathArr.length &&
            this.pathArr[this.pathArr.length - 1] &&
            this.pathArr[this.pathArr.length - 1].type &&
            Number(this.pathArr[this.pathArr.length - 1].type))
        );
      };
    },
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    },
    isShowEle() {
      return function (v) {
        const obj =
          this.funcConfig &&
          this.funcConfig.tableColumn &&
          this.funcConfig.tableColumn.find((item) => item.column === v);
        return obj && obj.show;
      };
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
      console.log(v);
      if (v.treeType === 1) {
        const arr = [...this.pathArr];
        arr.push({
          name: v.name,
          id: v.materialType === 2 ? v.klTreeId : v.id,
          type: v.materialType
        });
        this.$emit('update:pathArr', arr);
        if (v.materialType === 2) {
          this.$emit('update:parentId', v.klTreeId);
          this.$nextTick(() => {
            this.$emit('getKnowledgeList');
          });
        } else {
          this.$emit('update:parentId', v.id);
          this.$nextTick(() => {
            this.$emit('getList');
          });
        }
      } else if (this.funcConfig.showPreview) {
        // 预览
        const { id, name, url } = v;
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
    },
    // 最近浏览标识
    async visitRecordFun(v) {
      await visitRecord({
        classId: 2,
        userId: this.getUserId,
        id: v.id
      });
    },
    // 节点类型（1目录 2文档 3图片 4视频 5 音频 6 其他）
    fileTypeImg(obj) {
      const { treeType, url } = obj;
      let fileName = 'OTHER.svg';
      if (treeType === 1) {
        fileName = 'FILE.svg';
      }
      if (treeType === 3) {
        fileName = 'IMAG.svg';
      }
      if (treeType === 4) {
        fileName = 'MP4.svg';
      }
      if (treeType === 5) {
        fileName = 'MP3.svg';
      }
      if (treeType === 6) {
        fileName = 'OTHER.svg';
      }
      if (treeType === 2) {
        const suffixArr = url.split('.');
        const suffix = suffixArr[suffixArr.length - 1];
        if ('txt'.indexOf(suffix) !== -1) {
          fileName = 'TXT.svg';
        }
        if (['xls', 'xlsx'].indexOf(suffix) !== -1) {
          fileName = 'XLS.svg';
        }
        if (['ppt', 'pptx'].indexOf(suffix) !== -1) {
          fileName = 'PPT.svg';
        }
        if ('pdf'.indexOf(suffix) !== -1) {
          fileName = 'PDF.svg';
        }
        if (['doc', 'docx'].indexOf(suffix) !== -1) {
          fileName = 'DOC.svg';
        }
        if (['zip', 'rar'].indexOf(suffix) !== -1) {
          fileName = 'ZIP.svg';
        }
      }
      return require(`@/static/img/fileType/${fileName}`);
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
    &--detail {
      font-size: 24rpx;
      line-height: 24rpx;
      color: #808080;
      margin-top: 6rpx;
      flex: 1;
      display: flex;
      align-items: center;
      & > div:first-child {
        border-radius: 10rpx;
        font-size: 24rpx;
        padding: 8rpx 16rpx;
        margin-right: 10rpx;
      }
      & > div:nth-child(2) {
        margin-right: 10rpx;
      }
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
  .source_1 {
    background: #e5f0ff;
    color: #4689f5;
  }
  .source_2 {
    background: #ffede1;
    color: #fa6400;
  }
  .source_3 {
    background: #ebfcf7;
    color: #10b98a;
  }
}
</style>
