<!--
 * @Author: sss
 * @Date: 2022-03-15 10:14:25
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-15 10:14:25
 * @Desc: 配置界面-高级筛选
-->
<template>
  <view>
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="$t('common.filter')"></apiot-navbar>
    <!-- #endif -->
    <!-- 流程名称 -->
    <u-form ref="highForm" labelPosition="top" class="configForm">
      <!-- <div class="configForm__content">
        <u-form-item label="流程名称">
          <apiot-select-down
            :value="params.flowName"
            :list="processName"
            @select="handleSelectName"
            placeholder="请选择流程名称"
          ></apiot-select-down>
        </u-form-item>
      </div> -->
      <!-- 流程节点多列联动 -->
      <div class="configForm__content">
        <u-form-item label="流程名称" class="form--item">
          <view
            class="picker"
            @click.stop="pickerShow = true"
            style="width: 100%"
          >
            <apiot-input
              disabled
              border="none"
              placeholder="请选择流程名称"
              v-model="params.workflowsFilter.name"
            ></apiot-input>
          </view>
        </u-form-item>
      </div>
      <!-- 节点名称 -->
      <div class="configForm__content">
        <u-form-item label="节点名称">
          <apiot-input
            border="none"
            placeholder="请输入节点名称"
            v-model="params.nodeName"
          ></apiot-input>
        </u-form-item>
      </div>
      <!-- 发起人 -->
      <div class="configForm__content">
        <u-form-item label="发起人">
          <apiot-choose-user
            v-model="params.initiator"
            title="选择抄送人"
          ></apiot-choose-user>
        </u-form-item>
      </div>
      <!-- 发起时间 -->
      <div class="configForm__content">
        <u-form-item label="发起时间">
          <apiot-datepicker
            :value="params.startTime"
            placeholder="请选择发起时间"
            @change="handleChangeStartTime"
          ></apiot-datepicker>
        </u-form-item>
      </div>
      <!-- 结束时间 -->
      <div class="configForm__content">
        <u-form-item label="结束时间" class="form--item">
          <apiot-datepicker
            :value="params.endTime"
            placeholder="请选择结束时间"
            @change="handleChangeEndTime"
          ></apiot-datepicker>
        </u-form-item>
      </div>
    </u-form>

    <u-picker
      :show="pickerShow"
      ref="uPicker"
      :columns="pickerColumns"
      keyName="name"
      :defaultIndex="[0, 0]"
      closeOnClickOverlay
      @confirm="handleConfirm"
      @change="changeHandler"
      @cancel="pickerShow = false"
      @close="pickerShow = false"
    ></u-picker>

    <footer class="highSearch__footer">
      <div class="btn">
        <apiot-button
          type="secondary"
          :custom-style="{
            width: '100%',
            border: 'none',
          }"
          @click="clear"
          >重置</apiot-button
        >
      </div>
      <div class="btn">
        <apiot-button
          :custom-style="{
            width: '100%',
          }"
          type="primary"
          @click="sure"
          >确定</apiot-button
        >
      </div>
    </footer>
  </view>
</template>

<script>
import { getWorkflowGroup, getWorkflowList } from '@/api/pagesProcess.js';

export default {
  components: {},

  data() {
    return {
      pickerShow: false, // 级联
      pickerColumns: [],
      pickerColumnData: [],
      config: {},
      isShowProcessName: false,
      params: {
        flowName: '', // 流程的id
        nodeName: '',
        initiator: [],
        startTime: '',
        endTime: '',
        workflowsFilter: {
          wIds: '',
          name: ''
        }
      }
    };
  },

  computed: {
    processName() {
      let arr = this.config.processNameArr?.split(',') || [];
      arr = arr.filter((item) => item);
      return arr.map((item, index) => ({
        value: item,
        name: item
      }));
    },
    userid() {
      return this.params.initiator.map((item) => item.id);
    },
    assemblyParams() {
      const arr = [
        {
          name: 'wi.instance_name',
          value: this.params.flowName,
          lambda: 3
        },
        {
          name: 'wt.task_name',
          value: this.params.nodeName,
          lambda: 3
        },
        {
          name: 'wi.trigger_user_id',
          value: this.userid?.join(','),
          lambda: 4
        },
        {
          name: 'wi.trigger_time',
          value: this.params.startTime,
          lambda: 6
        },
        {
          name: 'wi.trigger_time',
          value: this.params.endTime,
          lambda: 7
        }
      ];

      return arr.filter((item) => item.value);
    },
    workflowsParams() {
      const { wIds } = this.params.workflowsFilter;
      return wIds ? { wIds } : '';
    }
  },

  methods: {
    // 流程管理分组
    async getWorkflowGroup() {
      const res = await getWorkflowGroup();
      this.pickerColumns.push([...res]);
      this.getWorkflowList(res[0].id);
    },
    // 流程管理列表
    async getWorkflowList(id, index = 0) {
      const res = await getWorkflowList({
        groupId: id
      });
      res.forEach((item) => {
        item.name = item.workflowName;
      });
      if (index === 0) {
        this.pickerColumns.push([...res]);
        this.pickerColumnData[0] = [...res];
      } else {
        this.pickerColumnData[index] = [...res];
      }
    },
    handleConfirm(e) {
      const { value } = e;
      this.params.workflowsFilter = {
        wIds: value[1].id,
        name: `${value[0].name}_${value[1].name}`
      };
      this.pickerShow = false;
    },

    async changeHandler(e) {
      const {
        columnIndex,
        index,
        // 微信小程序无法将picker实例传出来，只能通过ref操作
        picker = this.$refs.uPicker
      } = e;
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      if (columnIndex === 0) {
        // picker为选择器this实例，变化第二列对应的选项
        const { id } = this.pickerColumns[0][index];
        await this.getWorkflowList(id, index);
        picker.setColumnValues(1, this.pickerColumnData[index]);
      }
    },
    handleChangeStartTime(v) {
      this.params.startTime = v;
    },
    handleChangeEndTime(v) {
      this.params.endTime = v;
    },
    handleSelectName(v) {
      this.params.flowName = v[0].name;
    },
    clear() {
      uni.setStorageSync('ProcessAdvancedScreen', '');
      this.params = {
        flowName: '',
        nodeName: '',
        initiator: [],
        startTime: '',
        endTime: '',
        workflowsFilter: {
          wIds: '',
          name: ''
        }
      };
      uni.navigateBack({
        success: () => {
          this.$bus.$emit('processAdvancedFilter', {
            compid: this.config.compid
          });
        }
      });
    },
    sure() {
      uni.setStorageSync('ProcessAdvancedScreen', this.params);
      const params = {
        columnsInfos: this.assemblyParams
      };
      if (this.workflowsParams) {
        params.workflowsFilter = this.workflowsParams;
      }
      uni.navigateBack({
        success: () => {
          this.$bus.$emit('processAdvancedFilter', {
            compid: this.config.compid,
            params
          });
        }
      });
    }
  },
  mounted() {
    const params = uni.getStorageSync('ProcessAdvancedScreen');
    if (params) this.params = params;
    console.log(this.params);
    this.getWorkflowGroup();
  },
  onLoad(option) {
    this.config = option;
  },
  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('common.filter')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.picker {
  ::v-deep {
    .u-input {
      background-color: #fff !important;
    }
  }
}
.highSearch__footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 19rpx 33rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24rpx;
  background: #fff;
}
.filterRecord {
  background: #fff;
  padding: 0 30rpx 30rpx 30rpx;
  border-radius: 0 0 20rpx 20rpx;
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.2);

  &__header {
    display: flex;
    justify-content: space-between;
    height: 85rpx;
    line-height: 85rpx;
    .title {
      font-size: 32rpx;
      @include fontBlob(500);
    }
    .btn {
      font-size: 28rpx;
    }
  }

  &__content {
    padding: 20rpx 30rpx;

    border-radius: 14rpx;
    background: #f6f6f8;
    font-size: 28rpx;
    font-family: $--font-family;
    color: #808080;
    &--item {
      display: flex;
      line-height: 40rpx;
      .left {
        width: 174rpx;
      }
      .subtitle {
        flex-shrink: 0;
      }
      .title {
        flex: 1;
        color: #333333;
      }
    }
  }
}
.configForm {
  width: 100%;
  &__content {
    background: #fff;
    padding: 26rpx 30rpx 0 30rpx !important;
  }
  ::v-deep {
    .u-form-item:first-child {
      margin: 0;
    }
    .u-form-item__body__left {
      width: 100% !important;
    }
    .u-form-item__body__right__content__slot,
    .apiotChooseUser {
      display: flex;
      width: 100%;
    }
  }
}
</style>
