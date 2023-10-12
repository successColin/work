<!--
 * @Author: sss
 * @Date: 2021-05-20 14:23:55
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-20 14:23:55
 * @Desc: tab | 异常日志
-->
<template>
  <section class="ExceptionLog" v-loading="contentLoading">
    <header class="ExceptionLog__header">
      <div class="item ExceptionLog__header--dateRange">
        <data-range
          v-model="intervalTime"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          limitType="timeToDay"
          :clearable="false"
          :start-placeholder="
            $t('common.startTime', {
              time: $t('common.operatingTime'),
            })
          "
          :end-placeholder="
            $t('common.endTime', {
              time: '',
            })
          "
        >
        </data-range>
      </div>
      <div class="item ExceptionLog__header--input">
        <apiot-input
          v-model="filterFormData.serviceUrl"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('systemLog.serviceUrl'),
            })
          "
        ></apiot-input>
      </div>
      <div class="item ExceptionLog__header--input">
        <apiot-input
          v-model="filterFormData.username"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('common.operator'),
            })
          "
        ></apiot-input>
      </div>
      <apiot-button type="primary" @click="handleQuery">
        {{ $t('common.query') }}
      </apiot-button>
      <apiot-button @click="handleCancel">
        {{ $t('common.empty') }}
      </apiot-button>
    </header>
    <div class="ExceptionLog__content">
      <apiot-table
        ref="ExceptionLogList"
        :tableData="tableData"
        :showSelection="false"
        highlight-current-row
        dropClass=".ExceptionLog__content"
      >
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="`${$t(item.label)}`"
          :width="item.width"
          :headImg="item.headImgProp"
          :buttonArr="item.buttonArr"
          @showDetail="showDetail"
        ></component>
      </apiot-table>
    </div>
    <footer class="ExceptionLog__footer">
      <apiot-pagination
        v-show="total > 0"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></apiot-pagination>
    </footer>
    <apiot-tabs
      :showTabs.sync="showTabs"
      :tabsArr="tabsArr"
      value="exceptionLogDetail"
    >
      <template slot="DetailCom">
        <detail-com :detail="detailContent"></detail-com>
      </template>
    </apiot-tabs>
  </section>
</template>

<script>
import { formatDate } from '_u/utils.js';
import { listExceptionLog, delExceptionLog } from '@/api/systemLog';
import ApplicationColumn from '../ApplicationColumn';
import DataRange from '../DataRange';

const currentData = formatDate(new Date(), 'yyyy-MM-dd');
export default {
  components: { ApplicationColumn, DataRange, DetailCom: () => import('../DetailCom') },

  props: {},

  data() {
    return {
      contentLoading: false,
      current: 1,
      total: 0,
      size: 10,
      tableData: [],
      showTabs: false,
      detailContent: {},
      filterFormData: { serviceUrl: '', username: '' },
      intervalTime: [currentData, currentData], // 区间时间
      tabsArr: [
        {
          label: '',
          compName: 'DetailCom',
          key: 'exceptionLogDetail'
        }
      ],
      columnData: [
        // 账号
        {
          label: 'common.account',
          prop: 'account',
          compName: 'ElTableColumn',
          width: 180
        },
        // 操作人
        {
          label: 'common.operator',
          prop: 'username',
          compName: 'UserColumn',
          width: 200,
          headImgProp: 'icon'
        },
        // 操作时间
        {
          label: 'common.operatingTime',
          prop: 'operationTime',
          compName: 'ElTableColumn',
          width: 200
        },
        // 接口URL
        {
          label: 'systemLog.serviceUrl',
          prop: 'serviceUrl',
          compName: 'ElTableColumn'
        },
        // 查看详情
        {
          label: 'systemLog.viewDetails',
          compName: 'OperateColumn',
          buttonArr: [
            { name: 'systemLog.detail', funcName: 'showDetail', type: 'primary ', plain: true }
          ],
          width: 200
        },
        // 异常编码
        {
          label: 'systemLog.errorCode',
          prop: 'exceptionCode',
          compName: 'ElTableColumn',
          width: 200
        }
      ]
    };
  },

  computed: {},

  activated() {
    this.getList();
  },

  methods: {
    // 初始化
    initList() {
      this.getList();
    },
    // 异常日志删除
    async deleteLog() {
      await this.$confirm(this.$t('systemLog.delExcepTip'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });

      this.contentLoading = true;
      await delExceptionLog({
        logData: `${currentData}${this.$t('common.delete1')}${this.$t('systemLog.exceptionLog')}`
      });
      this.getList();
      this.$message({
        type: 'success',
        message: this.$t('common.success', {
          name: this.$t('common.delete', { name: this.$t('systemLog.exceptionLog') })
        })
      });
    },
    // 获取列表
    async getList(current = 1) {
      this.contentLoading = true;
      const { size, filterFormData, intervalTime } = this;
      const list = await listExceptionLog({
        current,
        size,
        startDate: intervalTime[0],
        endDate: intervalTime[1],
        ...filterFormData,
        orders: [{ asc: false, column: 'id' }]
      });
      this.contentLoading = false;
      this.current = current;
      this.total = list.total;
      this.tableData = list.records;
    },
    // 筛选
    handleQuery() {
      this.getList();
    },
    // 取消
    handleCancel() {
      this.filterFormData = { serviceUrl: '', username: '' };
      this.intervalTime = [currentData, currentData];
      this.getList();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.getList(page);
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.size = size;
      this.getList();
    },
    // 显示异常日志详情
    showDetail(row) {
      this.detailContent = row;
      this.showTabs = true;
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--footerHeight: 42px;
$--dateRangeWidth: 300px;
$--inputWidth: 200px;
@include setTabContent(
  'ExceptionLog',
  $--footerHeight,
  $--dateRangeWidth,
  $--inputWidth
);
.ExceptionLog__content {
  ::v-deep {
    .el-button--primary.is-plain {
      border: none;
      height: 24px;
      line-height: 22px;
    }
  }
}
</style>
