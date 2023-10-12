<!--
 * @Descripttion: 检测器
 * @Author: ytx
 * @Date: 2022-06-09 09:37:49
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-09 09:37:49
-->
<template>
  <div class="detectorBox">
    <div class="detectorBox__img">
      <img
        :src="require('@/assets/img/importingBg.svg')"
        class="importingImg"
      />
      <img
        :src="require('@/assets/img/importingRote.svg')"
        :class="`importingRote ${
          importProgress > 0 && importProgress < 100
            ? 'importingRote__animation'
            : ''
        }`"
      />
    </div>
    <div class="detectorBox__info">
      <div class="detectorBox__process">
        <div>
          <div>导入进度:</div>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="+importProgress"
            class="progress"
            color="#97B0F4"
          ></el-progress>
        </div>
        <div>
          {{ $t('importAndExport.inall') }}
          <span>{{ uploadInfo.Sum || 0 }}</span>
          {{ $t('importAndExport.articles') }}
          <i></i>
          已导入
          <span>{{ uploadInfo.Row || 0 }}</span>
          {{ $t('importAndExport.articles') }}
        </div>
      </div>
      <div class="detectorBox__time">
        <div>
          <!-- {{ $t('importAndExport.AbnormalCo') }}
          <span>{{ uploadInfo.errorRow || 0 }}</span>
          {{ $t('importAndExport.articles') }} -->
        </div>
        <div>
          {{ $t('importAndExport.Sharedtime')
          }}<span>{{ uploadTime || '00:00' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    importProgress: {
      type: [Number, String],
      default: 0
    },
    uploadInfo: {
      type: Object,
      default: () => {}
    },
    uploadTime: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.detectorBox {
  border-radius: 4px;
  width: 100%;
  height: 110px;
  display: flex;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;
  margin-top: 10px;

  .detectorBox__img {
    flex: 0 0 110px;
    position: relative;
    border-right: 1px solid #e9e9e9;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;

    .importingImg {
      width: 90px;
    }
    .importingRote {
      width: 90px;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -45px;
      margin-top: -45px;
    }
    .importingRote__animation {
      animation: clockwise 8s linear infinite;
    }
  }

  .detectorBox__info {
    flex: 1;
    padding: 21px 20px 20px 20px;
    box-sizing: border-box;
    .detectorBox__process,
    .detectorBox__time {
      display: flex;
      justify-content: space-between;
    }
    .detectorBox__process {
      & > div:first-child {
        width: 80%;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
        display: flex;
        .progress {
          margin-left: 10px;
          flex: 1;
        }
      }
      & > div:nth-child(2) {
        font-size: 14px;
        color: #333333;
        display: flex;
        align-items: center;
        & > span {
          color: #4689f5;
        }
        & > i {
          display: inline-block;
          width: 1px;
          height: 100%;
          margin: 0 8px;
          background: #e9e9e9;
        }
      }
    }
    .detectorBox__time {
      height: 36px;
      padding: 8px 10px;
      background: #f1f7ff;
      border-radius: 4px;
      box-sizing: border-box;
      margin-top: 15px;
      & > div {
        line-height: 20px;
        font-size: 14px;
        color: #333333;
      }
      & > div:first-child span {
        color: #ee5e5e;
      }
      & > div:nth-child(2) {
        & > span {
          color: #4689f5;
        }
      }
    }
  }
}
</style>
