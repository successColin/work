<!--
 * @Author: sss
 * @Date: 2021-05-29 08:47:58
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-29 08:47:58
 * @Desc: 迁移日志
-->
<template>
  <div class="transferOpration">
    <apiot-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :title="$t('systemLog.transfer')"
      :loading.sync="showLoading"
      @sure-click="handleSure"
    >
      <section>
        <header class="topTip">
          <i class="el-alert__icon el-icon-info"></i>
          <div>
            {{ $t('systemLog.transferTip') }}
            <span class="topTip--blue" @click="showTransferLogDialog"
              >{{ $t('systemLog.transferTipClickLog') }} </span
            >!
          </div>
        </header>
        <el-form
          ref="transferOpration"
          class="transferLog__time"
          label-position="top"
          label-width="80px"
          :model="formData"
          :rules="rules"
        >
          <div class="form--line">
            <el-form-item
              :label="$t('systemLog.deadline')"
              class="form--child"
              prop="deadline"
            >
              <data-range
                v-model="formData.deadline"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                :hasNoMoment="true"
                :placeholder="$t('systemLog.deadline')"
                :pickerOption="pickerOptions"
              ></data-range
            ></el-form-item>
          </div>
        </el-form>
      </section>
    </apiot-dialog>
    <apiot-dialog
      key="transferLogList"
      :visible.sync="transferLogVisible"
      :title="$t('systemLog.transferTipClickLog')"
      :isShowSure="false"
    >
      <transfer-log-list v-if="transferLogVisible"></transfer-log-list>
    </apiot-dialog>
  </div>
</template>

<script>
import { transferOprateLog } from '@/api/systemLog';

import TransferLogList from './TransferLogList';
import DataRange from '../DataRange';

export default {
  components: { TransferLogList, DataRange },

  props: {},

  data() {
    return {
      transferLogVisible: false,
      formData: { deadline: '' },
      showLoading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime() - 3600 * 1000 * 24 * 7;
        }
      }
    };
  },

  computed: {
    rules() {
      return {
        deadline: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('systemLog.deadline')
            }),
            trigger: 'change'
          }
        ]
      };
    }
  },

  methods: {
    // 显示迁移日志列表
    showTransferLogDialog() {
      this.transferLogVisible = true;
    },
    handleSure() {
      this.$refs.transferOpration.validate((valid) => {
        if (valid) {
          this.$confirm(this.$t('systemLog.sureTranferTip'), this.$t('common.tip'), {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          })
            .then(async () => {
              try {
                const logData = `${this.$t('common.success', {
                  name: this.$t('systemLog.transfer')
                })}${this.$t('systemLog.deadline')}:${this.formData.deadline}`;
                await transferOprateLog({ ...this.formData, logData });
                this.$emit('transferSuccess');
                this.showLoading = false;
                this.$message({
                  type: 'success',
                  message: this.$t('common.success', {
                    name: this.$t('systemLog.transfer')
                  })
                });
              } catch (error) {
                this.showLoading = false;
              }
            })
            .catch(() => {
              this.showLoading = false;
            });
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.transferLog__time {
  margin-top: 16px;
}

.topTip {
  padding: 10px 0;
  display: flex;
  align-items: center;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 400;
  color: #666666;
  background: #f1f3f6;
  .el-alert__icon {
    font-size: 18px;
    padding: 0 15px;
    color: #bbc3cd;
  }
  &--blue {
    color: $--color-primary;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
