<!--
 * @Author: sss
 * @Date: 2021-05-20 14:23:55
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-20 14:23:55
 * @Desc: tab | 登录日志
-->
<template>
  <section class="oprateLog" v-loading="contentLoading">
    <header class="oprateLog__header">
      <div class="item oprateLog__header--dateRange">
        <data-range
          v-model="intervalTime"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          limitType="timeToDay"
          :start-placeholder="
            $t('common.startTime', {
              time: $t('common.operate'),
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
      <div class="item oprateLog__header--input">
        <apiot-input
          v-model="filterFormData.applicationName"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('systemLog.application'),
            })
          "
        ></apiot-input>
      </div>
      <div class="item oprateLog__header--input">
        <apiot-input
          v-model="filterFormData.menuName"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('systemLog.menu'),
            })
          "
        ></apiot-input>
      </div>
      <div class="item oprateLog__header--input">
        <apiot-input
          v-model="filterFormData.username"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('common.operator'),
            })
          "
        ></apiot-input>
      </div>
      <div class="item oprateLog__header--input">
        <apiot-input
          v-model="filterFormData.operationContent"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('systemLog.logContent'),
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
    <div class="oprateLog__content">
      <apiot-table
        ref="oprateLogList"
        :tableData="tableData"
        :showSelection="false"
        highlight-current-row
        dropClass=".oprateLog__content"
      >
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="`${$t(item.label)}`"
          :width="item.width"
          :headImg="item.headImgProp"
          show-overflow-tooltip
        ></component>
      </apiot-table>
    </div>
    <footer class="oprateLog__footer">
      <apiot-pagination
        v-show="total > 0"
        :total="total"
        :current-page.sync="current"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></apiot-pagination>
    </footer>
    <transfer-opration
      :visible.sync="visible"
      @transferSuccess="transferSuccess"
    ></transfer-opration>
  </section>
</template>

<script>
import { formatDate } from '_u/utils.js';
import { listOprateLog } from '@/api/systemLog';
import ApplicationColumn from '../ApplicationColumn';
import DataRange from '../DataRange';
import TransferOpration from '../TransferOpration';

const currentData = formatDate(new Date(), 'yyyy-MM-dd');
export default {
  components: { ApplicationColumn, DataRange, TransferOpration },

  props: {},

  data() {
    return {
      visible: false,
      contentLoading: false,
      current: 1,
      total: 0,
      size: 10,
      tableData: [],
      filterFormData: { applicationName: '', username: '', operationContent: '', menuName: '' },
      intervalTime: [currentData, currentData], // 区间时间
      columnData: [
        // 账号
        {
          label: 'common.account',
          prop: 'account',
          compName: 'ElTableColumn',
          width: 140
        },
        // 操作人
        {
          label: 'common.operator',
          prop: 'username',
          compName: 'UserColumn',
          width: 140,
          headImgProp: 'icon'
        },
        // 操作时间
        {
          label: 'common.operatingTime',
          prop: 'operationTime',
          compName: 'ElTableColumn',
          width: 200
        },
        // 所属应用
        {
          label: 'systemLog.application',
          prop: 'applicationName',
          compName: 'ApplicationColumn',
          width: 150
        },
        // 菜单
        {
          label: 'systemLog.menu',
          prop: 'menuName',
          compName: 'ElTableColumn',
          width: 190
        },
        // 日志内容
        {
          label: 'systemLog.logContent',
          prop: 'operationContent',
          compName: 'ElTableColumn'
        }
      ]
    };
  },

  computed: {},

  mounted() {
    this.initList();
  },
  methods: {
    // 初始化
    initList() {
      this.getList();
    },
    showTransferLog() {
      this.visible = true;
    },
    // 数据迁移成功
    transferSuccess() {
      this.visible = false;
      this.getList();
    },
    // 获取列表
    async getList(current = 1) {
      this.contentLoading = true;
      try {
        const { size, filterFormData, intervalTime } = this;
        const list = await listOprateLog({
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
      } catch (e) {
        this.contentLoading = false;
      }
    },
    // 筛选
    handleQuery() {
      this.getList();
    },
    // 取消
    handleCancel() {
      this.filterFormData = {
        applicationName: '',
        username: '',
        operationContent: '',
        menuName: ''
      };
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
    }
  }

  // mounted() {
  //   this.initList();
  // }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--footerHeight: 42px;
$--dateRangeWidth: 300px;
$--inputWidth: 200px;
@include setTabContent(
  'oprateLog',
  $--footerHeight,
  $--dateRangeWidth,
  $--inputWidth
);
</style>
