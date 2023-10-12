<!--
 * @Descripttion: 数据源
 * @Author: ytx
 * @Date: 2021-04-25 08:52:13
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-26 10:24:36
-->
<template>
  <div style="width: 100%; height: 100%">
    <div v-if="JSON.stringify(tableData) !== '[]'">
      <table class="dataSource" v-for="(item, i) in tableData" :key="i">
        <tbody>
          <tr>
            <td class="dataSource__title">
              {{ $t('tenant.tenant1', { name: '' }) }}
            </td>
            <td class="dataSource--mgl dataSource__name dataSource__width">
              {{ lineData.tenantName }}
            </td>
            <td class="dataSource__title">{{ $t('tenant.dataSourceType') }}</td>
            <td class="dataSource--mgl dataSource__type dataSource__width">
              <div>{{ dataSourceType(item) }}</div>
            </td>
          </tr>
          <tr>
            <td class="dataSource__title">{{ $t('tenant.account') }}</td>
            <td class="dataSource--mgl dataSource__account dataSource__width">
              {{ item.username }}
            </td>
            <td class="dataSource__title">{{ $t('common.password') }}</td>
            <td class="dataSource--mgl dataSource__password dataSource__width">
              <div v-if="isShowPswd">
                <div>********</div>
                <i class="iconfont icon-mimayincang" @click="handleChange"></i>
              </div>
              <div v-else>
                <div>{{ item.password }}</div>
                <i class="iconfont icon-mimaxianshi" @click="handleChange"></i>
              </div>
            </td>
          </tr>
          <tr>
            <td class="dataSource__title">{{ $t('tenant.drivers') }}</td>
            <td class="dataSource--mgl dataSource__drive" colspan="3">
              <div :style="getStyle(item)">
                {{ driverType(item).name }}
              </div>
            </td>
          </tr>
          <tr>
            <td class="dataSource__title">
              {{ $t('tenant.linkPoolConfiguration') }}
            </td>
            <td colspan="3">
              <table class="childrenTable">
                <thead>
                  <tr>
                    <td>{{ $t('tenant.initializationSize') }}</td>
                    <td>{{ $t('tenant.minimum') }}</td>
                    <td>{{ $t('tenant.max') }}</td>
                    <td>{{ $t('tenant.maximumWaitingTimeUnitMs') }}</td>
                    <td>
                      {{ $t('tenant.detectsTheIdleConnectionIntervalInMs') }}
                    </td>
                    <td>
                      {{ $t('tenant.connectTheSmallestSurvivingTimeUnitMs') }}
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {{ item.poolConf && item.poolConf.initialSize }}
                    </td>
                    <td>{{ item.poolConf && item.poolConf.minIdle }}</td>
                    <td>{{ item.poolConf && item.poolConf.maxActive }}</td>
                    <td>{{ item.poolConf && item.poolConf.maxWait }}</td>
                    <td>
                      {{
                        item.poolConf &&
                        item.poolConf.timeBetweenEvictionRunsMillis
                      }}
                    </td>
                    <td>
                      {{
                        item.poolConf &&
                        item.poolConf.minEvictableIdleTimeMillis
                      }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="dataSource__title">{{ $t('tenant.URLAddress') }}</td>
            <td class="dataSource--mgl dataSource__url" colspan="3">
              <div>
                {{ item.url }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="apiotNoData" :placeholder="$t('common.noData')"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { lighten } from '@/utils/varyColor';
import { getDatasourceList } from '@/api/tenant';

export default {
  props: {
    lineData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableData: [],
      isShowPswd: true,
    };
  },
  computed: {
    ...mapState({
      DATASOURCE_TYPE: (state) => state.dictManage.DATASOURCE_TYPE,
      DRIVER_TYPE: (state) => state.dictManage.DRIVER_TYPE,
    }),
    dataSourceType() {
      return function (row) {
        if (this.DATASOURCE_TYPE.length) {
          const temp = row.datasourceType;
          const index = this.DATASOURCE_TYPE.findIndex(
            (item) => item.value === temp,
          );
          return this.DATASOURCE_TYPE[index].name || {};
        }
        return {};
      };
    },
    driverType() {
      return function (row) {
        if (this.DRIVER_TYPE.length) {
          const temp = row.driverType;
          const index = this.DRIVER_TYPE.findIndex(
            (item) => item.value === temp,
          );
          return this.DRIVER_TYPE[index] || {};
        }
        return {};
      };
    },
    getStyle() {
      return function (row) {
        const obj = this.driverType(row);
        if (obj && obj.color) {
          return `color: ${obj.color};backgroundColor:${lighten(
            obj.color,
            0.9,
          )}`;
        }
        return '';
      };
    },
  },
  methods: {
    init() {
      this.getDatasourceList();
      this.$store.dispatch('getCurrentDict', 'DATASOURCE_TYPE,DRIVER_TYPE');
    },
    handleChange() {
      this.isShowPswd = !this.isShowPswd;
    },
    lighten(color) {
      return lighten(color);
    },
    async getDatasourceList() {
      const params = this.lineData && { tenantId: this.lineData.id };
      this.tableData = await getDatasourceList(params);
    },
  },
};
</script>
<style lang="scss" scoped>
$border: 1px solid #e9e9e9;
.dataSource {
  margin: 30px 10px 0 10px;
  width: calc(100% - 20px);
  &__title {
    // min-width: 110px;
    width: 10%;
    font-size: 13px;
    color: #666666;
    text-align: right;
    height: 100%;
    background-color: #fafafa;
    padding-right: 30px;
    line-height: 36px;
  }
  &--mgl,
  .childrenTable td {
    padding-left: 20px;
  }
  // 租户
  &__name {
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  // 类型
  &__type {
    div {
      display: inline-block;
      padding: 5px 10px;
      background: #4689f5;
      border-radius: 4px;
      font-size: 13px;
      color: #ffffff;
    }
  }
  // 密码
  &__password {
    & > div {
      display: inline-block;
      padding: 5px 10px;
      background: #e5f0ff;
      border-radius: 4px;
      font-size: 13px;
      color: #4689f5;
      div {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
      }
    }
  }
  // 驱动
  &__drive {
    div {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 13px;
      margin-right: 7px;
    }
  }
  // 账号
  &__account {
    font-size: 13px;
    color: #333333;
  }
  &__url {
    font-size: 13px;
    color: #333333;
    div {
      display: inline-block;
      line-height: 30px;
    }
  }
  .childrenTable {
    width: 100%;
    & > thead {
      border-bottom: $border;
      td {
        font-size: 13px;
        color: #666666;
        background-color: #fafafa;
        padding-right: 30px;
        line-height: 36px;
      }
    }
    & > tbody {
      td {
        font-size: 13px;
        color: #333333;
      }
    }
    td {
      border-right: $border;
    }
    tbody,
    thead {
      line-height: 36px;
    }
  }
  & > tbody > tr {
    border-top: $border;
    & > td {
      border-right: $border;
    }
  }
  td {
    vertical-align: middle;
    min-height: 36.5px;
    height: 36px;
  }
  border: $border;
  &__width {
    width: 40%;
  }
}
</style>
