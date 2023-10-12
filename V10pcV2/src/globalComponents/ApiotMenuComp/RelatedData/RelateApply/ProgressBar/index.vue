<!-- 页面 -->
<template>
  <div class="progressWrap">
    <div class="totalWrap">
      <div class="totalWrap__total">
        {{ $t('knowledge.A_total_of') }}
        <span>{{ fileList.length }}</span>
        {{ $t('knowledge.Files_transferring') }}
      </div>
      <div class="totalWrap__cancel" @click="cancelAll">
        {{ $t('knowledge.cancel_all') }}
      </div>
    </div>
    <div class="progressBarWrap">
      <div
        class="progressWrap__bar"
        v-for="(item, index) in fileList"
        :key="item.uid + '_' + index"
      >
        <img :src="getFileUrl(item)" alt="" />
        <div class="progressWrap__content">
          <p>{{ item.name }}</p>
          <el-progress
            :percentage="item.upload"
            :stroke-width="2"
            :color="customColor"
          ></el-progress>
          <span
            class="icon-guanbi iconfont"
            @click="doCancel(item, index)"
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import xls from '@/assets/img/XLS.svg';

export default {
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
    uploadingFiles: {
      type: Array,
      default: () => [],
    },
    fileUrl: {
      type: Function,
      default: () => {},
    },
    updateData: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      customColor: '#FAB71C',
      url: xls,
    };
  },

  components: {},

  computed: {
    getFileUrl() {
      return function (obj) {
        return this.fileUrl(obj);
      };
    },
  },
  watch: {},

  mounted() {},

  methods: {
    doCancel(item, index) {
      this.fileList.splice(index, 1);
      this.uploadingFiles.splice(index, 1);
      item.source.cancel('取消上传');
    },
    cancelAll() {
      // 取消全部
      this.fileList.forEach((item) => {
        item.source.cancel('取消上传');
      });
      this.updateData('fileList', []);
      this.updateData('uploadingFiles', []);
    },
  },
  name: 'index',
};
</script>

<style lang="scss" scoped>
.progressWrap {
  width: calc(100% - 20px);
  height: 100%;
  overflow: hidden;
  margin: 0 auto;

  .totalWrap {
    width: 100%;
    height: 42px;
    line-height: 42px;
    overflow: hidden;
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;

    .totalWrap__total {
      float: left;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;

      span {
        color: #4689f5;
      }
    }

    .totalWrap__cancel {
      float: right;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4689f5;
      cursor: pointer;
    }
  }

  .progressBarWrap {
    width: 100%;
    height: calc(100% - 42px);
    padding: 10px 0;
    box-sizing: border-box;
    overflow-y: auto;

    .progressWrap__bar {
      height: 60px;
      display: flex;

      & > img {
        width: 30px;
        height: 30px;
        margin: 15px 10px;
      }

      .progressWrap__content {
        flex: 1;
        width: calc(100%);
        padding-top: 10px;
        position: relative;

        & > p {
          margin-bottom: 9px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }

        .icon-guanbi {
          position: absolute;
          top: 10px;
          right: 0px;
          color: #aaaaaa;
          cursor: pointer;
        }
      }

      ::v-deep {
        .el-progress__text {
          display: none;
        }

        .el-progress-bar {
          padding-right: 0;
        }
      }
    }
  }
}
</style>
