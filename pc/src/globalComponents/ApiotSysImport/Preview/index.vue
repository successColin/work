<!-- 页面 -->
<template>
  <div class="previewWrap">
    <div class="loadWrap">
      <div class="loadWrap__img">
        <img :src="require('@/assets/img/checkBg.svg')" alt="" />
        <img
          :src="require('@/assets/img/probe.png')"
          :style="`width: 86px;height: 86px;${
            this.checkInfo.errorRow ? 'animation: none;' : ''
          }`"
        />
      </div>
      <div class="loadWrap__info">
        <div class="loadWrap__process">
          <div>{{ $t('importAndExport.Testprogress') }}:{{ progress }}%</div>
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
        <div class="loadWrap__time">
          <div>
            {{ $t('importAndExport.AbnormalCo') }}
            <span>{{ checkInfo.errorRow || 0 }}</span>
            {{ $t('importAndExport.articles') }}
          </div>
          <div>
            {{ $t('importAndExport.Sharedtime')
            }}<span>{{ diffTime || '00:00' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="error__title">{{ $t('importAndExport.Exceptiondetails') }}</div>
    <apiot-table
      class="tableWrap"
      :tableData="tableData"
      :showSelection="false"
      :isNeedColumnDrop="false"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        property="name"
        :label="$t('importAndExport.location')"
      >
      </el-table-column>
      <el-table-column
        property="msg"
        :show-overflow-tooltip="true"
        :label="$t('importAndExport.errormessage')"
      >
      </el-table-column>
    </apiot-table>
  </div>
</template>

<script>
export default {
  props: {
    checkInfo: {
      type: Object,
      default: () => {}
    },
    diffTime: {
      type: String,
      default: '00:00'
    }
  },
  data() {
    return {
      list: []
    };
  },

  components: {},

  computed: {
    progress() {
      const { Sum, Row } = this.checkInfo;
      if (Row && Sum) {
        const num = Row / Sum;
        const proportion = num * 100;
        return proportion.toFixed(2);
      }
      return (Sum && Row) || 0;
    },
    tableData() {
      const arr = [];
      const { List = [] } = this.checkInfo;
      List.forEach((item) => {
        const msgArr = item.split(',');
        arr.push({
          name: msgArr[0],
          msg: msgArr[1]
        });
      });
      return arr;
    }
  },

  mounted() {},

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.previewWrap {
  width: 100%;
  height: 100%;

  .loadWrap {
    width: 100%;
    height: 110px;
    display: flex;
    border: 1px solid #e9e9e9;
    box-sizing: border-box;

    .loadWrap__img {
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

    .loadWrap__info {
      flex: 1;
      padding: 26px 20px 20px 20px;
      box-sizing: border-box;

      .loadWrap__process {
        display: flex;
        justify-content: space-between;

        & > div:first-child {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #333333;
        }

        & > div:nth-child(2) {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;

          & > span {
            color: #4689f5;
          }

          & > i {
            display: inline-block;
            width: 1px;
            margin: 0 8px;
            background: #e9e9e9;
          }
        }
      }

      .loadWrap__time {
        display: flex;
        justify-content: space-between;
        height: 36px;
        padding: 8px 10px;
        background: #f1f7ff;
        border-radius: 4px;
        box-sizing: border-box;
        margin-top: 15px;

        & > div {
          line-height: 20px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
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

  .error__title {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }

  .tableWrap {
    width: 100%;
    height: calc(100% - 40px - 110px) !important;
  }
}
</style>
