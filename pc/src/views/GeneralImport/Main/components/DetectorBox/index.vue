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
      <img :src="require('@/assets/img/checkBg.svg')" alt="" />
      <img
        :src="require('@/assets/img/probe.png')"
        :style="`width: 86px;height: 86px;${
          progress > 0 && progress < 100 ? '' : 'animation: none'
        }`"
      />
    </div>
    <div class="detectorBox__info">
      <div class="detectorBox__process">
        <div>
          <div>{{ $t('importAndExport.Testprogress') }}:</div>
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="+progress"
            class="progress"
          ></el-progress>
        </div>
        <div>
          {{ $t('importAndExport.inall') }}
          <span>{{ checkInfo.Sum || 0 }}</span>
          {{ $t('importAndExport.articles') }}
          <i></i>
          {{ $t('importAndExport.detected') }}
          <span>{{ checkInfo.Row || 0 }}</span>
          {{ $t('importAndExport.articles') }}
        </div>
      </div>
      <div class="detectorBox__time">
        <div @click="handleJump" class="errorInfor">
          <!-- {{ $t('importAndExport.AbnormalCo') }} -->
          查看异常信息：
          <span>{{ checkInfo.errorRow || 0 }}</span>
          {{ $t('importAndExport.articles') }}
        </div>
        <div>
          {{ $t('importAndExport.Sharedtime')
          }}<span>{{ diffTime || '00:00' }}</span>
        </div>
      </div>
    </div>
    <apiot-dialog
      title="异常明细"
      :visible.sync="visible"
      :isShowSure="false"
      :isBigDialog="true"
    >
      <exc-details ref="excDetails" :checkInfo="checkInfo"></exc-details>
    </apiot-dialog>
  </div>
</template>

<script>
import ExcDetails from '../ExcDetails';

export default {
  props: {
    diffTime: {
      type: String,
      default: ''
    },
    checkInfo: {
      type: Object,
      default: () => {}
    },
    progress: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      visible: false
    };
  },
  components: {
    ExcDetails
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleJump() {
      if (this.checkInfo.errorRow) {
        this.visible = true;
        if (this.$refs.excDetails) {
          this.$refs.excDetails.init();
        }
      }
    }
  }
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
    text-align: center;

    & > img:first-child {
      margin-top: 12px;
    }

    & > img:nth-child(2) {
      position: absolute;
      margin-left: -43px;
      margin-top: -43px;
      top: 50%;
      left: 50%;
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
      .errorInfor {
        cursor: pointer;
      }
    }
  }
}
</style>
