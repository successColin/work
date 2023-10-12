<!--
 * @Author: sss
 * @Date: 2021-05-20 14:23:55
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-20 14:23:55
 * @Desc: tab | 登录日志
-->
<template>
  <section class="loginLog" v-loading="contentLoading">
    <header class="loginLog__header">
      <div class="item loginLog__header--dateRange">
        <data-range
          v-model="intervalTime"
          type="daterange"
          range-separator="-"
          value-format="yyyy-MM-dd"
          limitType="timeToDay"
          :clearable="false"
          :start-placeholder="
            $t('common.startTime', {
              time: $t('systemLog.loginTime'),
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
      <div class="item loginLog__header--input">
        <apiot-input
          v-model="filterFormData.applicationName"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('systemLog.application'),
            })
          "
        ></apiot-input>
      </div>
      <div class="item loginLog__header--input">
        <apiot-input
          v-model="filterFormData.username"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('systemLog.loginPerson'),
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
    <div class="loginLog__content">
      <apiot-table
        ref="loginLogList"
        :tableData="tableData"
        :showSelection="false"
        highlight-current-row
        dropClass=".loginLog__content"
      >
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="`${$t(item.label)}`"
          :width="item.width"
          :headImg="item.headImgProp"
        ></component>
      </apiot-table>
    </div>
    <footer class="loginLog__footer">
      <apiot-pagination
        v-show="total > 0"
        :total="total"
        :current-page.sync="current"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></apiot-pagination>
    </footer>
  </section>
</template>

<script>
import { formatDate } from '_u/utils.js';
import { listLoginLog } from '@/api/systemLog';
import ApplicationColumn from '../ApplicationColumn';
import DataRange from '../DataRange';

const currentData = formatDate(new Date(), 'yyyy-MM-dd');
export default {
  components: { ApplicationColumn, DataRange },

  props: {},

  data() {
    return {
      contentLoading: false,
      current: 1,
      total: 0,
      size: 10,
      tableData: [],
      filterFormData: { applicationName: '', username: '' },
      intervalTime: [currentData, currentData], // 区间时间
      columnData: [
        // 账号
        {
          label: 'common.account',
          prop: 'account',
          compName: 'ElTableColumn',
          width: 240
        },
        // 登录人
        {
          label: 'systemLog.loginPerson',
          prop: 'username',
          compName: 'UserColumn',
          width: 220,
          headImgProp: 'icon'
        },
        // 登录时间
        {
          label: 'systemLog.loginTime',
          prop: 'loginTime',
          compName: 'ElTableColumn',
          width: 300
        },
        // 所属应用
        {
          label: 'systemLog.application',
          prop: 'applicationName',
          compName: 'ApplicationColumn',
          width: 260
        },
        // ip地址
        {
          label: 'systemLog.loginIp',
          prop: 'loginIp',
          compName: 'ElTableColumn'
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
    // 获取列表
    async getList(current = 1) {
      this.contentLoading = true;
      const { size, filterFormData, intervalTime } = this;
      const list = await listLoginLog({
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
      this.current = 1;
      this.getList();
    },
    // 取消
    handleCancel() {
      this.current = 1;
      this.filterFormData = { applicationName: '', username: '' };
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
  'loginLog',
  $--footerHeight,
  $--dateRangeWidth,
  $--inputWidth
);
</style>
