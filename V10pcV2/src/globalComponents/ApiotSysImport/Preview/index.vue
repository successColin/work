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
    <div class="error__title">
      {{ $t('importAndExport.Exceptiondetails') }}
      <apiot-button
        class="error__title--button"
        @click="handleExport"
        :disabled="isDisabeld"
      >
        <i class="iconfont icon-daochu"></i>
        错误信息导出
      </apiot-button>
    </div>
    <el-table :data="currentDate" height="320" style="width: 100%">
      <el-table-column
        prop="name"
        :label="$t('importAndExport.location')"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        prop="msg"
        :label="$t('importAndExport.errormessage')"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
    </el-table>
    <ApiotPagination
      :isSystem="false"
      :total="total"
      :size.sync="size"
      :current-page.sync="current"
      @size-change="sizeChange"
      @current-change="currentChange"
    ></ApiotPagination>
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
      tableData: [],
      total: 0,
      current: 1,
      size: 10,
      currentDate: [],
      isDisabeld: true
    };
  },

  components: {},

  computed: {
    progress() {
      const { Sum, Row, isCheckFinish } = this.checkInfo;
      console.log(this.checkInfo);
      if ((Row && Sum) || isCheckFinish) {
        const num = Sum === 0 ? 1 : Row / Sum;
        const proportion = num * 100;
        return proportion.toFixed(2);
      }
      return (Sum && Row) || 0;
    }
  },

  watch: {
    checkInfo: {
      handler() {
        this.tableData = [];
        this.currentDate = [];
        const { List = [], errorRow, isCheckFinish } = this.checkInfo;
        List.forEach((item) => {
          const index = item.indexOf(',');
          this.tableData.push({
            name: item.slice(0, index),
            msg: item.slice(index + 1)
          });
        });
        this.currentDate = JSON.parse(JSON.stringify(this.tableData)).splice(
          (this.current - 1) * this.size,
          this.size
        );
        if (errorRow && isCheckFinish) {
          this.isDisabeld = false;
        }
        this.total = this.tableData.length;
      },
      deep: true
    }
  },

  mounted() {},

  methods: {
    // 每页大小改变
    sizeChange(size) {
      console.log(size);
      this.current = 1;
      this.size = size;
      this.currentDate = JSON.parse(JSON.stringify(this.tableData)).splice(
        (this.current - 1) * this.size,
        this.size
      );
      console.log(this.tableData, this.currentDate);
    },
    // 改变页码
    currentChange(current) {
      this.current = current;
      this.currentDate = JSON.parse(JSON.stringify(this.tableData)).splice(
        (this.current - 1) * this.size,
        this.size
      );
      console.log(this.current, this.size);
      console.log(this.tableData, this.currentDate);
    },
    // 导出错误信息
    handleExport() {
      // 列标题
      let str = '<tr><td>定位</td><td>错误信息</td></tr>';
      this.tableData.forEach((item) => {
        str += `<tr><td>${`${item.name}\t`}</td><td>${`${item.msg}\t`}</td></tr>`;
      });
      // Worksheet名
      const worksheet = 'Sheet1';
      const uri = 'data:application/vnd.ms-excel;base64,';

      // 下载的表格模板数据
      const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
          <head><meta charset='UTF-8'><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          </head><body><table>${str}</table></body></html>`;
      // 下载模板
      const url = uri + window.btoa(unescape(encodeURIComponent(template)));

      const link = document.createElement('a');
      link.href = url;
      link.download = '错误信息明细.xls';
      link.click();
    }
  }
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    .error__title--button {
      font-size: 14px;
      i {
        font-size: 16px;
        color: #4689f5;
        margin-right: 4px;
      }
    }
    .error__title--button.is-disabled {
      i {
        opacity: 0.4;
      }
    }
  }

  // .tableWrap {
  //   width: 100%;
  //   height: calc(100% - 40px - 110px) !important;
  // }

  ::v-deep {
    .pagination {
      border-top: 0;
    }
  }
}
</style>
