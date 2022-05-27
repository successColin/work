<template>
  <view class="inspection-device">
    <apiot-navbar :title="$t('inspection.inspectionDevice')">
    </apiot-navbar>
    <view class="notdata" v-if="deviceData.length === 0">
      <image
        src="~@/static/img/common/nodata.svg"
        class="nodata-img"
      ></image>
      <text class="nodata-text">{{ $t('common.noData') }}</text
      ><!--暂无数据-->
    </view>
    <view class="inspection-device-box">
      <view class="inspection-top-route hasStatusTop">
        <image class="img" src="../images/route.svg"></image>
        <view class="route-detail">
          <text class="inspection-name">{{ inspectionDoName }}</text>
          <div class="inspection-num">
            <span>总数：{{ moCount }}</span>
            <span>已点检：{{ finishMoCount }}</span>
          </div>
        </view>
      </view>
      <view class="uni-list">
        <checkbox-group @change="checkboxChange">
          <label
            class="device-info uni-list-cell"
            :class="[
              { 'animateListClick': focusIndex === index },
            ]"
            v-for="(item, index) in deviceData"
            :key="index"
            @click="handleJumpClick(item, index)"
          >
            <view class="device-info-box">
              <view class="item">
                <view class="m-info">
                  <image class="img" src="../images/device.svg"></image>
                  <text class="moname">{{ item.deviceName }}</text>
                </view>
                <div class="checkbox-box">
                  <i v-show="item.checked && isSelectDevie"
                    class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"></i>
                  <checkbox
                    :value="item.deviceId"
                    :checked="item.checked"
                    class="checkbox-style"
                    :class="[
                      { showSelect: !item.checked },
                    ]"
                    v-if="isSelectDevie"
                  />
                </div>
              </view>
              <view class="item">
                <text class="deviceCode">{{ item.deviceCode }}</text>
                <text
                  :class="[
                    'inspection-num',
                    { ongoing: item.ongoing },
                    { finish: item.finish },
                    { abnormal: item.abnormalPointCount > 0 }
                  ]"
                  >{{ item.finishPointCount }}/{{ item.pointCount }}</text
                >
              </view>
              <view class="item position-name-box">
                <text class="position-name">设备位置：{{ item.devicePosition }}</text>
              </view>
            </view>
          </label>
        </checkbox-group>
      </view>
    </view>
    <view class="formTemplate-btns foot" v-if="isSelectDevie">
      <div class="checkAll">
        <label
          class="label"
        >
          <checkbox-group @change="selectAll">
            <div class="checkbox-box">
              <i v-show="isSelectAll" class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"></i>
              <checkbox
                :value="1"
                :checked="false"
                class="checkbox-style"
                :class="[
                  { showSelect: !isSelectAll },
                ]"
              />
            </div>
          </checkbox-group>
          <span>全选</span>
        </label>
      </div>
      <div
        @click="cancelSelect"
        class="btn-item"
      >{{$t('common.cancle')}}</div>
      <!-- :end="endDate" -->
      <picker
        :disabled="pickerDisabled"
        @click="handleNotSelect"
        mode="date"
        :start="startDate"
        class="btn-item"
        @change="showSkipMemoFun"
      >
        <span
          class="confirm"
        >{{$t('common.sure')}}</span>
      </picker>
    </view>
    <view class="inspection-operation"
      v-else-if="(deviceLayer.unlockedType === 1 || deviceLayer.unlockedType === 3) &&
      (deviceLayer.enableRFID || deviceLayer.scanUnlock || deviceLayer.fillCodeUnlock
      || deviceLayer.jumpOver || deviceLayer.workDone)">
      <view class="item rfid" v-if="isShowRfid && deviceLayer.enableRFID" @click="handleRfid">
        <i class="appIcon appIcon-RFID"></i>
        <span class="item-text">RFID</span>
      </view>
      <view class="item rfid" v-if="isShowRfidHR && deviceLayer.enableRFID" @click="handleRfidHR">
        <i class="appIcon appIcon-RFID"></i>
        <span class="item-text">RFID</span>
      </view>
      <view class="item scan" v-if="deviceLayer.scanUnlock" @click="handleScan">
        <i class="appIcon appIcon-saoma"></i>
        <span class="item-text">{{ $t('inspection.basic-scanCode') }}</span
        ><!--扫码-->
      </view>
      <view class="item unlock" v-if="deviceLayer.fillCodeUnlock" @click="showUnlock">
        <i class="appIcon appIcon-jiesuo"></i>
        <span class="item-text">{{ $t('inspection.inspection-unlock') }}</span
        ><!--解锁-->
      </view>
      <view
        v-if="(!deviceLayer.enableRFID || !deviceLayer.scanUnlock || !deviceLayer.fillCodeUnlock)
        && deviceLayer.jumpOver"
        class="item unlock" @click="inspctionJumpDate">
        <i class="appIcon appIcon-tiaoguo"></i>
        <span class="item-text">{{ $t('inspection.inspection-jump') }}</span
        ><!--跳过-->
      </view>
      <view
        v-if="(!deviceLayer.enableRFID || !deviceLayer.scanUnlock || !deviceLayer.fillCodeUnlock)
        && deviceLayer.workDone"
        class="item unlock" @click="handleFinish">
        <i class="appIcon appIcon-gongshi"></i>
        <span class="item-text">{{ $t('inspection.inspection-gongshi') }}</span
        ><!--工时-->
      </view>
      <!-- 按钮多于4个时显示更多 -->
      <view
        v-if="deviceLayer.enableRFID && deviceLayer.scanUnlock && deviceLayer.fillCodeUnlock"
        class="item more" @click="handleShowMore">
        <i class="appIcon appIcon-gengduoanniu"></i>
        <span class="item-text">{{ $t('inspection.more') }}</span
        ><!--更多-->
      </view>
      <view
        v-if="deviceLayer.enableRFID && deviceLayer.scanUnlock && deviceLayer.fillCodeUnlock"
        class="more-operation scale-animate scale-animate-right"
        :class="[
        { 'scale-animate-show': isShowMore },
      ]">
        <span v-if="deviceLayer.jumpOver" class="more-item" @click="inspctionJumpDate">
          <i class="appIcon appIcon-tiaoguo"></i>
        </span>
        <span v-if="deviceLayer.workDone" class="more-item" @click="handleFinish">
          <i class="appIcon appIcon-gongshi"></i>
        </span>
      </view>
    </view>
    <view class="inspection-operation nolock" v-else-if="deviceLayer.unlockedType === 2">
      <span v-if="deviceLayer.jumpOver" class="item" @click="inspctionJumpDate">
        <i class="appIcon appIcon-tiaoguo"></i>
        跳过设备
      </span>
      <span v-if="deviceLayer.workDone" class="item" @click="handleFinish">
        <i class="appIcon appIcon-gongshi"></i>
        完成工时
      </span>
    </view>
    <!-- 输入工时弹窗 -->
    <apiot-prompt
      v-if="showFinishHours"
      :visible.sync="showFinishHours"
      @sure-click="finishInspection"
      :title="$t('inspection.inspection-workTime')"
      :placeholder="$t('inspection.inspection-significantNumber')"
      >
    </apiot-prompt>
    <!-- 输入点检跳过备注弹窗 -->
    <apiot-prompt
      v-if="showSkipMemo"
      :visible.sync="showSkipMemo"
      @sure-click="confirmSelect"
      :title="$t('inspection.page-note')"
      :placeholder="$t('inspection.inspection-jump-memo')"
      >
    </apiot-prompt>
    <!-- 输入解锁码弹窗 -->
    <apiot-prompt
      v-if="showLockTask"
      :visible.sync="showLockTask"
      @sure-click="handleUnlock"
      :title="$t('inspection.inspection-unlockDevice')"
      :placeholder="$t('inspection.inspection-enterCode')"
      >
    </apiot-prompt>
    <!-- 确认弹窗 -->
    <apiot-tip-prompt
      v-if="showTipPrompt"
      :visible.sync="showTipPrompt"
      :promptData="promptData"
      >
    </apiot-tip-prompt>
  </view>
</template>

<script>
import { mapState } from 'vuex';
import {
  selectMoList,
  updateSql,
  selectworkingHours,
  deleteSkipMo,
  currencyHaiLiScanning,
  forceInspection,
  selectPointDoListByCode,
  selectInspectionConfig,
} from '../js/DB.js';
import { inspectionSkip } from '@/api/inspection.js';
import StaticNFC from '../js/NFC.js';
import { readCardInit, readCard, closeReadCard } from '../js/bridge.js';
import { ELEMENT_SCAN } from '../js/element.js';

export default {
  components: {},
  onLoad(options) {
    this.id = options.id;
    this.inspectionDoName = options.inspectionDoName;
  },
  onShow() {
    selectInspectionConfig((res) => {
      this.deviceLayer = JSON.parse(res[0].deviceLayer);
    });
    this.getData();
  },
  onHide() {
    // 页面进入后台时，如果没关闭NFC时关闭
    if (this.isShowRfidHR && this.readCardStatus) {
      clearTimeout(this.timer);
      this.readCardStatus = false;
      closeReadCard();
    }
  },
  onUnload() {
    // 页面关闭时，如果没关闭NFC时关闭
    if (this.isShowRfidHR && this.readCardStatus) {
      clearTimeout(this.timer);
      this.readCardStatus = false;
      closeReadCard();
    }
  },
  data() {
    return {
      isShowRfidHR: false,
      readCardStatus: false,
      timer: null,
      isShowRfid: true,
      id: null,
      inspectionDoName: 0,
      finishMoCount: 0,
      moCount: null,
      nowRfid: '',
      deviceData: [],
      isSelectDevie: false,
      selectdeviceId: [],
      pickerDisabled: false,
      startDate: '',
      endDate: '',
      isShowMore: false,
      isDownloadComplete: false,
      isSelectAll: false,
      showFinishHours: false,
      showSkipMemo: false,
      selectDate: null,
      showLockTask: false,
      showTipPrompt: false,
      promptData: {
        title: '',
        confirmText: '',
        tip: '',
      },
      focusIndex: null,
      deviceLayer: {}
    };
  },
  computed: {
    ...mapState('Inspection', ['inspectionDeviceLock']),
  },
  watch: {
    nowRfid(newValue) {
      if (!newValue) return;
      if (this.isShowRfidHR) {
        clearTimeout(this.timer);
        this.readCardStatus = false;
        closeReadCard();
      }
      selectPointDoListByCode(this.id, newValue, 1, (res) => {
        if (res.length) {
          this.goToPoint(newValue, 1); // 进入到点界面
        } else {
          this.nowRfid = '';
          this.promptData = {
            title: this.$t('common.tip'),
            confirmText: this.$t('common.sure'),
            tip: this.$t('inspection.inspection-notFindDevice'),
          };
          this.showTipPrompt = true;
        }
      });
    },
  },
  methods: {
    inspctionJumpDate() {
      this.isSelectDevie = true;
      this.isShowMore = false;
      if (this.isSelectDevie && this.selectdeviceId.length === 0) {
        this.pickerDisabled = true;
      }
    },
    handleJumpClick(device, index) {
      this.focusIndex = index;
      setTimeout(() => {
        // 点击设备
        if (this.isSelectDevie) {
          // 如果需要选择设备则不点击进入点
          this.$set(device, 'checked', !device.checked);
        } else if (this.deviceLayer.unlockedType === 2 || this.deviceLayer.unlockedType === 1) {
          // 点检是否需要解锁设备添加系統变量 1=都可以  2= 点击列表进入 3=解锁进入
          // 不需要是，可以通过点击列表进入
          this.goToPoint(device, 4); // 进入到点界面
        }
        this.focusIndex = null;
      }, 300);
    },
    checkboxChange(e) {
      this.selectdeviceId = e.detail.value;
      if (this.selectdeviceId.length > 0) {
        this.pickerDisabled = false;
      } else {
        this.pickerDisabled = true;
      }
    },
    selectAll(e) {
      const data = [];
      if (e.detail.value.length) {
        const selectdeviceId = this.deviceData.map((item) => {
          const obj = item;
          obj.checked = true;
          data.push(obj);
          return item.id;
        });
        this.deviceData = data;
        this.selectdeviceId = selectdeviceId;
        this.isSelectAll = true;
      } else {
        // eslint-disable-next-line array-callback-return
        this.deviceData.map((item) => {
          const obj = item;
          obj.checked = false;
          data.push(obj);
        });
        this.deviceData = data;
        this.selectdeviceId = [];
        this.isSelectAll = false;
      }
      if (this.selectdeviceId.length > 0) {
        this.pickerDisabled = false;
      } else {
        this.pickerDisabled = true;
      }
    },
    cancelSelect() {
      this.isSelectDevie = false;
    },
    handleNotSelect() {
      if (this.pickerDisabled) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-skip'),
        };
        this.showTipPrompt = true;
      }
    },
    showSkipMemoFun(event) {
      this.showSkipMemo = true;
      this.selectDate = `${event.detail.value} 00:00:00`;
    },
    async confirmSelect(value) {
      // 如果没有输入备注,提示返回
      if (!value) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-memo'),
        };
        this.showTipPrompt = true;
        return;
      }
      try {
        const params = {
          deviceIds: this.selectdeviceId,
          targetDate: this.selectDate,
          skipMemo: value,
        };
        uni.showLoading();
        await inspectionSkip(params);
        this.showSkipMemo = false;
        uni.hideLoading();
        const deviceCodeAry = this.selectdeviceId.map((item) => item);
        const sdeviceCode = deviceCodeAry.join(',');
        // 跳过成功之后删除本地数据库对应任务
        deleteSkipMo(
          this.id,
          sdeviceCode,
          () => {
            this.promptData = {
              title: this.$t('common.tip'),
              confirmText: this.$t('common.sure'),
              tip: '跳过成功',
            };
            this.showTipPrompt = true;
            this.getData();
          },
          () => {
            this.promptData = {
              title: this.$t('common.tip'),
              confirmText: this.$t('common.sure'),
              tip: this.$t('inspection.inspection-deletionFailed'),
            };
            this.showTipPrompt = true;
          }
        );
        // 删除之后重新获取数据
        this.getData();
        this.isSelectDevie = false;
        this.selectdeviceId = [];
      } catch (o) {
        this.showSkipMemo = false;
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: '跳过失败',
        };
        this.showTipPrompt = true;
        uni.hideLoading();
      }
    },
    // RFID解锁
    handleRfid() {
      const _this = this;
      const i18nMsg = (name) => this.$t(name);
      // eslint-disable-next-line no-new
      new StaticNFC({
        readNFC: true,
        $t: i18nMsg,
        callback(res) {
          _this.nowRfid = res.value;
        },
      });
      // rfid();
    },
    handleRfidHR() {
      if (this.readCardStatus) return;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // 读取超时关闭
        this.readCardStatus = false;
        closeReadCard();
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.timeout'),
        };
        this.showTipPrompt = true;
      }, 8000);
      readCardInit(() => {
        this.readCardStatus = true;
        uni.showLoading({ title: this.$t('inspection.inspection-readNFC') }); // 中文：'准备读取NFC'
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: this.$t('inspection.inspection-NFCLabel'), // 中文：'请将NFC标签靠近！'
            icon: 'none',
          });
          this.readCardInfo();
        }, 1000);
      });
    },
    readCardInfo() {
      if (this.readCardStatus) {
        readCard(
          (arg) => {
            // eslint-disable-next-line prefer-destructuring
            this.nowRfid = arg[0];
          },
          () => {
            // 未读取到数据继续读取
            setTimeout(() => this.readCardInfo(), 1000);
          }
        );
      }
    },
    // 扫码解锁
    handleScan() {
      ELEMENT_SCAN({}, this.scanCode);
    },
    goToPoint(device, unlockType) {
      // type 1:rfid, 2:扫码，3：解锁，4点击
      // 进入点界面
      let url;
      if (unlockType === 1 || unlockType === 2) {
        const scanDeviceIndex = this.deviceData.findIndex(
          (item) => device === `${item.deviceCode}`
        );
        const deviceItem = this.deviceData[scanDeviceIndex];
        url = `inspectionPoint?inspectionRouteId=${this.id}&deviceCode=${deviceItem.deviceCode}&deviceName=${deviceItem.deviceName}&type=device&unlockType=${unlockType}`;
      } else {
        url = `inspectionPoint?inspectionRouteId=${this.id}&deviceCode=${device.deviceCode}&deviceName=${device.deviceName}&type=device&unlockType=${unlockType}`;
      }
      uni.navigateTo({
        url,
        fail: (res) => {
          console.log(res); // 打印错误信息
        }
      });
    },
    scanCode(result) {
      const that = this;
      const code = `${result.scancode}`;
      if (this.scanningType === '2') {
        currencyHaiLiScanning(
          code,
          this.id,
          (res) => {
            if (res.length) {
              const { deviceCode } = res[0];
              const scanDevice = that.deviceData.find(
                (item) => deviceCode === `${item.deviceCode}`
              );
              that.goToPoint(scanDevice, 2); // 进入到点界面
            } else {
              this.promptData = {
                title: this.$t('common.tip'),
                confirmText: this.$t('common.sure'),
                tip: this.$t('inspection.inspection-notFindDevice'),
              };
              this.showTipPrompt = true;
            }
          },
          (res) => {
            console.log(res);
          }
        );
      } else {
        selectPointDoListByCode(this.id, result.scancode, 2, (res) => {
          if (res.length) {
            this.goToPoint(result.scancode, 2); // 进入到点界面
          } else {
            this.promptData = {
              title: this.$t('common.tip'),
              confirmText: this.$t('common.sure'),
              tip: this.$t('inspection.inspection-notFindDevice'),
            };
            this.showTipPrompt = true;
          }
        });
      }
    },
    showUnlock() {
      this.showLockTask = true;
    },
    // 输入解锁
    handleUnlock(value) {
      const code = value.toLocaleLowerCase();
      const deviceIndex = this.deviceData.findIndex(
        (item) => code === `${item.deviceCode.toLocaleLowerCase()}`
      );
      // qrcode对应设备表中那个字段可以通过全局配置中心进行配置
      if (deviceIndex === -1) {
        // 如果没有找到设备
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-notFindDevice'),
        };
        this.showTipPrompt = true;
      } else {
        const device = this.deviceData[deviceIndex];
        this.goToPoint(device, 3); // 进入到界面
      }
      this.showLockTask = false;
    },
    finishInspection(value) {
      if (
        /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(
          value
        )
      ) {
        updateSql(
          'inspectiondo',
          { workingHours: parseFloat(value) },
          { id: this.id },
          () => {
            uni.navigateBack();
          }
        );
      } else {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.check-nan'),
        };
        this.showTipPrompt = true;
      }
    },
    handleFinish() {
      this.isShowMore = false;
      // 判断强制点检是否完成
      forceInspection(this.id, (res) => {
        let forcepointfinish = 1;
        if (res.length !== 0) forcepointfinish = res[0].forcepointfinish;
        if (forcepointfinish) {
          this.showFinishHours = true;
        } else {
          this.promptData = {
            title: this.$t('inspection.inspection-forceTip'),
            confirmText: this.$t('common.sure'),
            tip: `${res[0].deviceCode},${this.$t(
              'inspection.inspection-hasforceNoFinish'
            )}`, // 中文：'有强制点没有完成',
          };
          this.showTipPrompt = true;
        }
      });
    },
    getData() {
      this.finishMoCount = 0;
      this.moCount = 0;
      selectMoList(this.id, (res) => {
        this.deviceData = res.map((item) => {
          this.finishMoCount += item.finishPointCount;
          this.moCount += item.pointCount;
          item.ongoing = item.finishPointCount > 0;
          item.finish = item.finishPointCount === item.pointCount;
          item.checked = false;
          return item;
        });
        if (this.finishMoCount === this.moCount && this.finishMoCount !== 0) {
          selectworkingHours(this.id, (data) => {
            if (!data[0].workingHours) {
              setTimeout(() => {
                this.handleFinish();
              }, 200);
            }
          });
        }
      });
    },
    handleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    reloadRouteData() {
      this.getData();
      this.isDownloadComplete = !this.isDownloadComplete;
    }
  },
};
</script>

<style lang="scss" scoped>
.hasStatusTop {
  margin-top: var(--status-bar-height);
}
.inspection-device{
  width: 100%;
  .deviceBtn,.mainColor,.mainColor-blue,.mainColor-orange,.mainColor-violet,.mainColor-navyBlue{
    float: right;
    margin-left: 40rpx;
  }
  .btn-item{
    width: 50%;
    display: inline-block;
    vertical-align: top;
    .btn{
      border-radius: 0px;
      &:after{
        border-radius: 0px;
      }
    }
  }
  .checkbox-all{
    margin-right: 2px;
    .uni-checkbox-input{
      margin: 0;
    }
  }
  .notdata{
    position: fixed;
    height: calc(100% - 176rpx);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .nodata-img{
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
    }
    .nodata-text{
      color: #9B9B9B;
      font-size: 28rpx;
    }
  }
  @keyframes scaleShow {
    0% {
      transform: scale(0);
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  .checkbox-box{
    width: 32rpx;
    height: 32rpx;
    position: relative;
    .appIcon{
      font-size: 32rpx;
      color: #4689F5;
      top: 0rpx;
      left: 0;
      position: absolute;
      transform: scale(0);
      opacity: 0;
    }
    .checkbox-style{
      width: 32rpx;
      height: 32rpx;
      top: 0rpx;
      left: 0;
      position: absolute;
      transform: scale(0);
      opacity: 0;
      ::v-deep{
        .uni-checkbox-wrapper{
          vertical-align: super;
        }
        .uni-checkbox-input{
          width: 32rpx;
          height: 32rpx;
          box-sizing: border-box;
        }
      }
    }
    .showSelect{
      animation: scaleShow .2s 1 forwards;
    }
  }
  .inspection-device-box{
    padding:200rpx 0 108rpx 0;
    .inspection-top-route{
      width: 100%;
      height: 180rpx;
      padding: 40rpx;
      position:fixed;
      top:88rpx;
      background: #FFFFFF;
      box-shadow: 0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.2);
      border-radius: 0px 0px 20rpx 20rpx;
      z-index: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .img{
        width: 88rpx;
        height: 88rpx;
        margin-right: 30rpx;
      }
      .route-detail{
        width: calc(100% - 118rpx);
        height: 88rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .inspection-name{
          font-size: 28rpx;
          color: #333333;
          font-size: 34rpx;
          font-weight: 500;
          line-height: 42rpx;
        }
        .inspection-num{
          width: 100%;
          font-size: 24rpx;
          color: #333333;
          color: #444444;
          line-height: 30rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
    .device-info{
      margin: 0 30rpx 20rpx;
      display: block;
      background: #fff;
      border-radius: 12rpx;
      box-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
      .device-info-box{
        padding: 30rpx;
        .item{
          display: flex;
          justify-content: space-between;
          align-items: center;
          .m-info{
            display: flex;
            align-items: center;
            height: 48rpx;
            .img{
              width: 48rpx;
              height: 48rpx;
              margin-right: 14rpx;
            }
            .moname{
              color: #444444;
              font-size: 34rpx;
              margin-right: 18rpx;
              display: block;
            }
          }
          .deviceCode{
            font-size: 28rpx;
            color: #333333;
            line-height: 62rpx;
          }
          .inspection-num{
            flex:0 1 100rpx;
            line-height: 40rpx;
            color: #fff;
            font-size: 26rpx;
            background: #BBC3CD;
            text-align: center;
            border-radius: 20rpx;
          }
          .ongoing{
            background: #F7B500;
          }
          .finish{
            background: #4689F5;
          }
          .abnormal{
            background: #f0605d;
          }
        }
      }
      .position-name-box{
        height: 46rpx;
        background: #F6F6F8;
        border-radius: 8rpx;
        .position-name,.position-storagelocation{
          color: #9B9B9B;
          font-size: 28rpx;
          margin-left: 10rpx;
        }
      }
    }
  }
  .inspection-operation{
    position: fixed;
    bottom: 30rpx;
    left: 20rpx;
    width: 710rpx;
    height: 88rpx;
    display: flex;
    background: #FFFFFF;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 44px;
    justify-content: space-around;
    align-items: center;
    .item{
      flex: 1;
      height: 62rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-size: 28rpx;
      &:after{
        content: ' ';
        width: 1rpx;
        height: 24rpx;
        background: #D9D9D9;
        margin-right: -3rpx;
        position: absolute;
        right: -15rpx;
        top: 19rpx;
      }
      .appIcon{
        font-size: 38rpx;
        text-align: right;
        padding-right: 8rpx;
        color: #4689F5;
      }
      .item-text{
        font-size: 28rpx;
        color: #444444;
        padding-left: 8rpx;
      }
    }
    .more{
      background: #4689F5;
      border-radius: 31rpx;
      .appIcon, .item-text{
        color: #ffffff;
      }
      &:after{
        content: ' ';
        width: 0rpx;
      }
    }
    .more-operation{
      width: 80rpx;
      height: 200rpx;
      position: absolute;
      right: 0;
      top: -200rpx;
      .more-item{
        width: 80rpx;
        height: 80rpx;
        background: #FFFFFF;
        box-shadow: 0px 4rpx 11rpx 0px rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20rpx;
        .appIcon{
          font-size: 36rpx;
          color: #4689F5;
        }
      }
    }
  }
  .nolock{
    .item{
      width: 50%;
    }
  }
  .download-complete{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
    .download-complete-layout{
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.3);
    }
    .download-complete-content{
      width: 440rpx;
      height: 460rpx;
      background: #FFFFFF;
      border-radius: 18rpx;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      .download-complete-img{
        width: 200rpx;
        height: auto;
      }
      .tip{
        height: 108rpx;
        font-size: 30rpx;
        color: #333333;
        line-height: 108rpx;
        text-align: center;
      }
      .download-complete-button{
        width: 320rpx;
        height: 72rpx;
        background: #4689F5;
        border-radius: 42rpx;
        text-align: center;
        font-size: 30rpx;
        color: #FFFFFF;
        line-height: 72rpx;
      }
    }
  }
  .formTemplate-btns{
    width: 100%;
    height: 110rpx;
    background: #FFFFFF;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    .checkAll{
      width: 140rpx;
      height: 72rpx;
      .label{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20rpx;
        box-sizing: border-box;
        font-size: 28rpx;
      }
    }
    .btn-item{
      width: 260rpx;
      height: 72rpx;
      background: #F1F3F6;
      border-radius: 12rpx;
      margin: 0 12rpx;
      color: #333333;
      font-size: 30rpx;
      line-height: 72rpx;
      text-align: center;
      .confirm{
        width: 100%;
        height: 72rpx;
        border-radius: 12rpx;
        font-size: 30rpx;
        line-height: 72rpx;
        background: #4689F5;
        color: #FFFFFF;
        display: inline-block;
        text-align: center;
      }
    }
    .red{
      background: red;
    }
  }
}
</style>
