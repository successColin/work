<!-- 页面 -->
<template>
  <div class="moreWrap">
    <div v-if="isShow.process" class="importWrap">
      <div class="importWrap__img">
        <img :src="require('@/assets/img/importingBg.svg')" alt="" />
        <img
          :src="require('@/assets/img/importingRote.svg')"
          class="importingRote"
        />
      </div>
      <div class="importWrap__process">
        {{ $t('importAndExport.completedimporting') }}…{{ process }}%
      </div>
      <div class="importWrap__notice">
        {{ $t('importAndExport.theimportprocess') }}！
      </div>
    </div>
    <div class="importSuccess" v-if="isShow.success">
      <div class="importWrap__img">
        <img :src="require('@/assets/img/importSuccess.svg')" alt="" />
        <img
          :src="require('@/assets/img/importCheck.svg')"
          class="importingRote"
        />
      </div>
      <div class="importWrap__process">
        {{ $t('importAndExport.Importsucceeded') }}！
      </div>
      <div class="importWrap__notice">
        {{ $t('importAndExport.datainthelist') }}！
      </div>
    </div>
    <div class="importError" v-if="isShow.error">
      <div class="errorWrap">
        <div><img :src="require('@/assets/img/importError.svg')" alt="" /></div>
        <div>
          <div>{{ $t('importAndExport.pleaseimportagain') }}！</div>
          <div>{{ $t('importAndExport.followingreasons') }}！</div>
        </div>
      </div>
      <ul class="error__memo">
        <li>{{ $t('importAndExport.willbeimported') }};</li>
        <li>{{ $t('importAndExport.avoidimportfailure') }};</li>
        <li>{{ $t('importAndExport.XLSformat') }};</li>
        <li>{{ $t('importAndExport.worksheet') }};</li>
        <li>请检查导入数据是否有效</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    checkInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    process() {
      const { Row, Sum, isImportFinish, status } = this.checkInfo;
      if (!Row || !Sum || status === 201) return 0;
      if (Row && Sum) {
        const num = Row / Sum;
        return (num * 100).toFixed(2);
      }
      if (isImportFinish) return 100;
      return 0;
    },
    isShow() {
      const { Row, Sum, isImportFinish, status } = this.checkInfo;
      if (status === 201) {
        return {
          process: false,
          success: false,
          error: true
        };
      }
      if (Row < Sum || (!Row && !Sum)) {
        // console.log('2o2');
        return {
          process: true,
          success: false,
          error: false
        };
      }
      if (isImportFinish) {
        // console.log('2o3');
        return {
          process: false,
          success: true,
          error: false
        };
      }
      return {};
    }
  },

  watch: {
    isShow(v) {
      if (v.success) {
        this.$emit('successFun', false);
      } else {
        this.$emit('successFun', true);
      }
    }
  },

  mounted() {},

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.moreWrap {
  width: 100%;
  height: 100%;

  .importWrap {
    width: 100%;
    height: 100%;
    position: relative;

    .importWrap__img {
      position: relative;
      margin-top: 80px;
      text-align: center;

      .importingRote {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -55px;
        margin-top: -55px;
        animation: clockwise 8s linear infinite;
      }
    }

    .importWrap__notice {
      margin-top: 17px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      text-align: center;
    }

    .importWrap__process {
      margin-top: 18px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      text-align: center;
    }
  }

  .importSuccess {
    width: 100%;
    height: 100%;

    .importWrap__img {
      position: relative;
      margin-top: 80px;
      text-align: center;

      .importingRote {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: 25px;
        margin-top: -55px;
      }
    }

    .importWrap__notice {
      margin-top: 17px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      text-align: center;
    }

    .importWrap__process {
      margin-top: 18px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      text-align: center;
    }
  }

  .importError {
    width: 100%;
    height: 100%;

    .errorWrap {
      height: 88px;
      width: 100%;
      display: flex;
      background: #fafafa;
      border-radius: 4px;

      & > div:first-child {
        & > img {
          margin: 14px 12px 14px 14px;
        }
      }

      & > div:nth-child(2) {
        & > div:first-child {
          margin-top: 22px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #333333;
          line-height: 22px;
        }

        & > div:nth-child(2) {
          margin-top: 6px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #808080;
        }
      }
    }

    .error__memo {
      margin-top: 14px;

      & > li {
        margin-top: 10px;
        margin-left: 20px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        line-height: 16px;
        list-style-type: disc;

        &::marker {
          color: #aaaaaa;
        }
      }
    }
  }
}
</style>
