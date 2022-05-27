<!--
 * @Descripttion: 弹出框__升级租户
 * @Author: ytx
 * @Date: 2021-04-25 11:56:31
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 13:43:21
-->
<template>
  <apiot-dialog
    v-on="$listeners"
    v-bind="$attrs"
    destroy-on-close
    @sure-click="handleUpgradeSubmit"
  >
    <section class="upgrade">
      <div class="upgrade__name">{{ lineData.tenantName }}</div>
      <ul class="upgrade__info">
        <li>
          <div>
            {{ $t('tenant.currentType') }}：
            <span
              :style="{ background: '#BBC3CD' }"
              class="upgrade__info--color type"
            >
              {{ $t('tenant.standardEdition') }}
            </span>
          </div>
          <div>
            {{ $t('tenant.buyType') }}：
            <span
              :style="{ background: '#4689F5' }"
              class="upgrade__info--color type"
            >
              {{ $t('tenant.professionalEdition') }}
            </span>
          </div>
        </li>
        <li v-for="(item, i) in dialogContent" :key="i">
          <div>
            {{ $t(item.leftName) }}：
            <span
              :style="{ background: lineData[item.leftBkgd] }"
              :class="[lineData[item.leftBkgd] ? 'upgrade__info--color' : '']"
            >
              {{ lineData[item.leftProp] }}
            </span>
          </div>
          <div>
            {{ $t(item.rightName) }}：
            <span
              :style="{ background: lineData[item.rightBkgd] }"
              :class="[lineData[item.leftBkgd] ? 'upgrade__info--color' : '']"
            >
              {{ lineData[item.rightProp] }}
            </span>
          </div>
        </li>
      </ul>
    </section>
  </apiot-dialog>
</template>

<script>
import { updateUpgrade } from '@/api/tenant';

export default {
  props: {
    lineData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 升级__租户信息
      dialogContent: [
        {
          leftName: 'tenant.purchaserName',
          leftProp: 'tenantName',
          rightName: 'tenant.buyTime',
          rightProp: 'upgradeTime'
        },
        {
          leftName: 'tenant.purchaserPhone',
          leftProp: 'managerPhone',
          rightName: 'tenant.purchaserEmail',
          rightProp: 'managerEmail'
        }
      ]
    };
  },
  methods: {
    // 按钮__点击升级，里面的确定升级
    async handleUpgradeSubmit() {
      const params = {
        id: this.lineData.id
      };
      await updateUpgrade(params);
      this.$emit('update:visible', false);
      this.$message({
        type: 'success',
        message: `${this.$t('common.success', { name: this.$t('tenant.upgrade') })} !`
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.upgrade {
  margin: 10px 30px 0 30px;
  &__name {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  &__info {
    font-size: 13px;
    color: #333333;
    li {
      display: flex;
      margin-top: 14px;
      div {
        width: 50%;
        .type {
          border-radius: 4px;
          padding: 2px 9px;
        }
        span {
          font-size: 13px;
        }
      }
    }
    &--color {
      color: #fff;
    }
  }
}
</style>
