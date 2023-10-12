<template>
  <view class="inspection-device">
    <apiot-navbar :title="$t('inspection.inspectionDevice')"> </apiot-navbar>
    <view class="notdata" v-if="deviceData.length === 0">
      <image src="~@/static/img/common/nodata.svg" class="nodata-img"></image>
      <text class="nodata-text">{{ $t('common.noData') }}</text
      ><!--暂无数据-->
    </view>
    <view class="inspection-device-box">
      <view class="inspection-top-route hasStatusTop">
        <image class="img" src="../images/route.svg"></image>
        <view class="route-detail">
          <text class="inspection-name">{{ inspectionDoName }}</text>
          <div class="inspection-num">
            <span>{{ $t('inspection.total') }}：{{ moCount }}</span>
            <span>{{ $t('inspection.completed') }}：{{ finishMoCount }}</span>
          </div>
        </view>
      </view>
      <view class="uni-list">
        <checkbox-group @change="checkboxChange">
          <label
            class="device-info uni-list-cell"
            :class="[{ animateListClick: focusIndex === index }]"
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
                  <i
                    v-show="item.checked && isSelectDevie"
                    class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"
                  ></i>
                  <checkbox
                    :value="`${item.deviceId}/${item.moMaxPlanStartDate}`"
                    :checked="item.checked"
                    class="checkbox-style"
                    :class="[{ showSelect: !item.checked }]"
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
                    { abnormal: item.abnormalPointCount > 0 },
                  ]"
                  >{{ item.finishPointCount }}/{{ item.pointCount }}</text
                >
              </view>
              <view class="item position-name-box">
                <text class="position-name">
                  {{ $t('inspection.deviceLocation') }}：{{
                    item.devicePosition
                  }}</text
                >
              </view>
            </view>
          </label>
        </checkbox-group>
      </view>
    </view>
    <view class="formTemplate-btns foot" v-if="isSelectDevie">
      <div class="checkAll">
        <label class="label">
          <checkbox-group @change="selectAll">
            <div class="checkbox-box">
              <i
                v-show="isSelectAll"
                class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"
              ></i>
              <checkbox
                :value="1"
                :checked="false"
                class="checkbox-style"
                :class="[{ showSelect: !isSelectAll }]"
              />
            </div>
          </checkbox-group>
          <span>{{ $t('inspection.checkAll') }}</span>
        </label>
      </div>
      <div @click="cancelSelect" class="btn-item">
        {{ $t('common.cancle') }}
      </div>
      <div @click="showJumpModal" class="btn-item confirm">
        {{isBatchInspection ? $t('common.sure') : $t('inspection.inspection-jump') }}
      </div>
      <!-- :end="endDate" -->
      <!-- <picker
        :disabled="pickerDisabled"
        @click="handleNotSelect"
        mode="date"
        class="btn-item"
        @change="showSkipMemoFun"
      >
        <span class="confirm">{{ $t('inspection.inspection-jump') }}</span>
      </picker> -->
    </view>
    <view
      class="inspection-operation"
      v-else-if="
        (deviceLayer.unlockedType === 1 || deviceLayer.unlockedType === 3) &&
        (deviceLayer.enableRFID ||
          deviceLayer.scanUnlock ||
          deviceLayer.fillCodeUnlock ||
          deviceLayer.jumpOver ||
          deviceLayer.workDone)
      "
    >
      <view
        class="item rfid"
        v-if="isShowRfid && deviceLayer.enableRFID"
        @click="handleRfid"
      >
        <i class="appIcon appIcon-RFID"></i>
        <span class="item-text">RFID</span>
      </view>
      <view
        class="item rfid"
        v-if="isShowRfidHR && deviceLayer.enableRFID"
        @click="handleRfidHR"
      >
        <i class="appIcon appIcon-RFID"></i>
        <span class="item-text">RFID</span>
      </view>
      <view class="item scan" v-if="deviceLayer.scanUnlock" @click="handleScan">
        <i class="appIcon appIcon-saoma"></i>
        <span class="item-text">{{ $t('inspection.basic-scanCode') }}</span
        ><!--扫码-->
      </view>
      <view
        class="item unlock"
        v-if="deviceLayer.fillCodeUnlock"
        @click="showUnlock"
      >
        <i class="appIcon appIcon-jiesuo"></i>
        <span class="item-text">{{ $t('inspection.inspection-unlock') }}</span
        ><!--解锁-->
      </view>
      <view
        v-if="
          (!deviceLayer.enableRFID ||
            !deviceLayer.scanUnlock ||
            !deviceLayer.fillCodeUnlock) &&
          deviceLayer.jumpOver
        "
        class="item unlock"
        @click="inspctionJumpDate"
      >
        <i class="appIcon appIcon-tiaoguo"></i>
        <span class="item-text">{{ $t('inspection.inspection-jump') }}</span
        ><!--跳过-->
      </view>
      <view
        v-if="
          (!deviceLayer.enableRFID ||
            !deviceLayer.scanUnlock ||
            !deviceLayer.fillCodeUnlock) &&
          deviceLayer.workDone
        "
        class="item unlock"
        @click="handleFinish"
      >
        <i class="appIcon appIcon-gongshi"></i>
        <span class="item-text">{{ $t('inspection.inspection-gongshi') }}</span
        ><!--工时-->
      </view>
      <!-- 按钮多于4个时显示更多 -->
      <view
        v-if="
          deviceLayer.enableRFID &&
          deviceLayer.scanUnlock &&
          deviceLayer.fillCodeUnlock &&
          (deviceLayer.jumpOver || deviceLayer.workDone)
        "
        class="item more"
        @click="handleShowMore"
      >
        <i class="appIcon appIcon-gengduoanniu"></i>
        <span class="item-text">{{ $t('inspection.more') }}</span
        ><!--更多-->
      </view>
      <view
        v-if="
          deviceLayer.enableRFID &&
          deviceLayer.scanUnlock &&
          deviceLayer.fillCodeUnlock
        "
        class="more-operation scale-animate scale-animate-right"
        :class="{ 'scale-animate-show': isShowMore }"
      >
        <span
          v-if="deviceLayer.batchInspection"
          class="more-item"
          @click="handleBatchInspection"
        >
          <i class="appIcon appIcon-piliangdianjian"></i>
        </span>
        <span
          v-if="deviceLayer.jumpOver"
          class="more-item"
          @click="inspctionJumpDate"
        >
          <i class="appIcon appIcon-tiaoguo"></i>
        </span>
        <span
          v-if="deviceLayer.workDone"
          class="more-item"
          @click="handleFinish"
        >
          <i class="appIcon appIcon-gongshi"></i>
        </span>
      </view>
    </view>
    <view
      class="inspection-operation nolock"
      v-else-if="deviceLayer.unlockedType === 2"
    >
      <span v-if="deviceLayer.batchInspection" class="item" @click="handleBatchInspection">
        <i class="appIcon appIcon-piliangdianjian"></i>
        {{ $t('inspection.batchInsp') }}
      </span>
      <span v-if="deviceLayer.jumpOver" class="item" @click="inspctionJumpDate">
        <i class="appIcon appIcon-tiaoguo"></i>
        {{ $t('inspection.skipDevice') }}
      </span>
      <span v-if="deviceLayer.workDone" class="item" @click="handleFinish">
        <i class="appIcon appIcon-gongshi"></i>
        {{ $t('inspection.workCompleted') }}
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
    <!-- 点检跳过弹窗 -->
    <apiot-modal ref="routeJumpModal"
      position="bottom"
      cancelColor="#F1F3F6"
      :show.sync="showRouteJump"
      :automatic="false"
      :titleStyle="{
        fontFamily:
          'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold',
        fontWeight: 600,
        textAlign: 'left',
      }"
      @confirm="confirmSelect"
      @cancel="cancelSelect">
      <div class="processModal form noLeftForm hasBorder">
        <u-form labelPosition="top" ref="jumpForm" :rules="rules" :model="jumpForm">
          <u-form-item
            class="form--item"
            prop="skipTime"
          >
            <view class="element normal">
              <view class="elementLabel"
                >跳过日期<span class="required">*</span>
              </view>
              <view class="elementContent">
                <picker
                  :disabled="pickerDisabled"
                  @click="handleNotSelect"
                  mode="date"
                  class="picker-item"
                  :start="startDate"
                  :end="endDate"
                  @change="valueChang"
                >
                  <view class="picker-item-label">
                    <span class="confirm">{{jumpForm.skipTime || '选择巡检跳过时间'}}</span>
                    <i
                      class="appIcon appIcon-riqi"
                    ></i>
                  </view>
                </picker>
              </view>
            </view>
          </u-form-item>
          <u-form-item
            class="form--item"
            prop="skipMemo"
          >
            <view class="element normal">
              <view class="elementLabel"
                >备注<span class="required">*</span>
              </view>
              <view class="elementContent">
                <apiot-textarea
                  v-model="jumpForm.skipMemo"
                  placeholder="请填写备注"
                ></apiot-textarea>
              </view>
            </view>
          </u-form-item>
        </u-form>
      </div>
    </apiot-modal>
    <!-- 下载确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
  </view>
</template>

<script>
import ApiotTipPrompt from '../components/ApiotTipPrompt';
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
  selectPointDoListById,
  BatchUpdateSql
} from '../js/DB.js';
import { inspectionSkip } from '@/api/inspection.js';
import StaticNFC from '../js/NFC.js';
import { readCardInit, readCard, closeReadCard } from '../js/bridge.js';
import { ELEMENT_SCAN } from '../js/element.js';

export default {
  components: {
    ApiotTipPrompt
  },
  onLoad(options) {
    this.id = options.id;
    this.inspectionDoName = options.inspectionDoName;
  },
  onShow() {
    selectInspectionConfig((res) => {
      this.deviceLayer = JSON.parse(res[0].deviceLayer);
    });
    this.getData();
    if (!this.deviceLayer.workDone) {
      this.finishInspection(1, 'auto');
    }
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
      startDate: null,
      endDate: null,
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
        tip: ''
      },
      focusIndex: null,
      deviceLayer: {},
      showRouteJump: false,
      jumpForm: {
        skipMemo: '',
        skipTime: '',
      },
      rules: {
        skipTime: [
          {
            required: true,
            message: '请选择跳过时间',
            trigger: ['blur', 'change']
          }
        ],
        skipMemo: [
          {
            required: true,
            message: '备注不能为空',
            trigger: ['blur', 'change']
          }
        ]
      },
      isBatchInspection: false,
      selectDevice: []
    };
  },
  computed: {
    ...mapState('Inspection', ['inspectionDeviceLock'])
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
            tip: this.$t('inspection.inspection-notFindDevice')
          };
          this.showTipPrompt = true;
        }
      });
    }
  },
  methods: {
    inspctionJumpDate() {
      this.isSelectDevie = true;
      this.isShowMore = false;
      if (this.isSelectDevie && this.selectdeviceId.length === 0) {
        this.pickerDisabled = true;
      }
    },
    handleBatchInspection() {
      this.isSelectDevie = true;
      this.isBatchInspection = true;
      this.isShowMore = false;
      if (this.isSelectDevie && this.selectdeviceId.length === 0) {
        this.pickerDisabled = true;
      }
    },
    handleJumpClick(device, index) {
      let time = 0;
      if (!this.isSelectDevie) {
        this.focusIndex = index;
        time = 300;
      }
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
      }, time);
    },
    checkboxChange(e) {
      const maxDateAry = [];
      this.selectDevice = [];
      this.selectdeviceId = e.detail.value.map((item) => {
        const maxDate = item.split('/')[1].replace(/-/g, '/');
        const maxDateTime = new Date(maxDate).getTime();
        maxDateAry.push(maxDateTime);
        this.selectDevice.push(item.split('/')[0]);
        return item.split('/')[0];
      });
      const nowMaxDateTime = maxDateAry.sort((a, b) => b - a)[0];
      const today = this.$apiot.dateFormat(false, 'yyyy-MM-dd');
      const startDay = this.$apiot.dateFormat(
        nowMaxDateTime,
        'yyyy-MM-dd'
      );
      const dateTime = today === startDay ? 0 : 86400000;
      this.startDate = this.$apiot.dateFormat(
        nowMaxDateTime + dateTime,
        'yyyy-MM-dd'
      );
      // this.selectdeviceId = e.detail.value;
      if (this.selectdeviceId.length > 0) {
        this.pickerDisabled = false;
      } else {
        this.pickerDisabled = true;
      }
    },
    selectAll(e) {
      const data = [];
      if (e.detail.value.length) {
        const maxDateAry = [];
        this.selectDevice = [];
        const selectdeviceId = this.deviceData.map((item) => {
          const obj = item;
          obj.checked = true;
          data.push(obj);
          const maxDate = item.moMaxPlanStartDate.replace(/-/g, '/');
          const maxDateTime = new Date(maxDate).getTime();
          maxDateAry.push(maxDateTime);
          this.selectDevice.push(item.deviceId);
          return item.deviceId;
        });
        const nowMaxDateTime = maxDateAry.sort((a, b) => b - a)[0];
        const today = this.$apiot.dateFormat(false, 'yyyy-MM-dd');
        const startDay = this.$apiot.dateFormat(
          nowMaxDateTime,
          'yyyy-MM-dd'
        );
        const dateTime = today === startDay ? 0 : 86400000;
        this.startDate = this.$apiot.dateFormat(
          nowMaxDateTime + dateTime,
          'yyyy-MM-dd'
        );
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
        this.selectDevice = [];
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
      setTimeout(() => {
        this.showRouteJump = false;
      }, 400);
    },
    handleNotSelect() {
      if (this.pickerDisabled) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-skip')
        };
        this.showTipPrompt = true;
      }
    },
    async showJumpModal() {
      if (this.pickerDisabled) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.isBatchInspection ? this.$t('inspection.inspection-selectRouteSkip') : this.$t('inspection.inspection-selectDeviceBatch')
        };
        this.showTipPrompt = true;
        return false;
      }
      if (this.isBatchInspection) {
        await this.$refs.apiotModal.showAsyncModal({
          content: '是否确认批量修改已选点检任务的点检结果为正常？'
        });
        this.batchUpdateTask();
      } else {
        this.showRouteJump = true;
      }
    },
    batchUpdateTask() {
      const deviceId = this.selectdeviceId.join(',');
      uni.showLoading();
      selectPointDoListById(this.id, deviceId, (res) => {
        const ids = res.map((item) => item.inspectionTaskId).join(',');
        const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
        BatchUpdateSql(ids, inspectTime, (e) => {
          this.getData();
          this.isSelectDevie = false;
          this.selectdeviceId = [];
          this.isSelectAll = false;
          uni.hideLoading();
        });
      }, (res) => {
        console.log(res);
      });
    },
    showSkipMemoFun(event) {
      this.showSkipMemo = true;
      this.selectDate = `${event.detail.value} 00:00:00`;
    },
    valueChang(e) {
      this.jumpForm.skipTime = this.$apiot.dateFormat(e.detail.value, 'yyyy-MM-dd');
      this.selectDate = `${this.jumpForm.skipTime} 00:00:00`;
    },
    async confirmSelect(value) {
      // 如果没有输入备注,提示返回
      this.$refs.jumpForm.validate().then(async (res) => {
        // const selectRouteId = this.selectRouteId.join(',');
        try {
          const params = {
            deviceIds: this.selectdeviceId,
            targetDate: this.selectDate,
            skipMemo: value
          };
          uni.showLoading();
          await inspectionSkip(params);
          this.showSkipMemo = false;
          this.showRouteJump = false;
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
                tip: '跳过成功'
              };
              this.showTipPrompt = true;
              this.getData();
            },
            () => {
              this.promptData = {
                title: this.$t('common.tip'),
                confirmText: this.$t('common.sure'),
                tip: this.$t('inspection.inspection-deletionFailed')
              };
              this.showTipPrompt = true;
            }
          );
          // 删除之后重新获取数据
          this.getData();
          this.isSelectDevie = false;
          this.selectdeviceId = [];
          this.isSelectAll = false;
        } catch (o) {
          this.showSkipMemo = false;
          this.promptData = {
            title: this.$t('common.tip'),
            confirmText: this.$t('common.sure'),
            tip: this.$t('inspection.skipFailed')
          };
          this.showTipPrompt = true;
          uni.hideLoading();
        }
      }).catch((errors) => {
        console.log(errors);
      });
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
        }
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
          tip: this.$t('inspection.timeout')
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
            icon: 'none'
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
    async handleScan() {
      // ELEMENT_SCAN({}, this.scanCode);
      const qrResult = await this.$apiot.scanCode();
      const result = { qrResult };
      this.scanCode(qrResult.result);
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
    scanCode(code) {
      const that = this;
      // const code = `${result.scancode}`;
      // if (this.scanningType === '2') {
      //   currencyHaiLiScanning(
      //     code,
      //     this.id,
      //     (res) => {
      //       if (res.length) {
      //         const { deviceCode } = res[0];
      //         const scanDevice = that.deviceData.find(
      //           (item) => deviceCode === `${item.deviceCode}`
      //         );
      //         that.goToPoint(scanDevice, 2); // 进入到点界面
      //       } else {
      //         this.promptData = {
      //           title: this.$t('common.tip'),
      //           confirmText: this.$t('common.sure'),
      //           tip: this.$t('inspection.inspection-notFindDevice')
      //         };
      //         this.showTipPrompt = true;
      //       }
      //     },
      //     (res) => {
      //       console.log(res);
      //     }
      //   );
      // } else {
      selectPointDoListByCode(this.id, code, 2, (res) => {
        if (res.length) {
          this.goToPoint(code, 2); // 进入到点界面
        } else {
          this.promptData = {
            title: this.$t('common.tip'),
            confirmText: this.$t('common.sure'),
            tip: this.$t('inspection.inspection-notFindDevice')
          };
          this.showTipPrompt = true;
        }
      });
      // }
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
          tip: this.$t('inspection.inspection-notFindDevice')
        };
        this.showTipPrompt = true;
      } else {
        const device = this.deviceData[deviceIndex];
        this.goToPoint(device, 3); // 进入到界面
      }
      this.showLockTask = false;
    },
    finishInspection(value, type = null) {
      if (
        /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(
          value
        )
      ) {
        updateSql('inspectiondo', { workingHours: parseFloat(value) }, { id: this.id }, () => {
          if (!type) {
            uni.navigateBack();
          }
        });
      } else {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.check-nan')
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
            tip: `${res[0].deviceCode},${this.$t('inspection.inspection-hasforceNoFinish')}` // 中文：'有强制点没有完成',
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
        console.log(this.deviceData);
        if (this.finishMoCount === this.moCount && this.finishMoCount !== 0) {
          selectworkingHours(this.id, (data) => {
            if (!data[0].workingHours && this.deviceLayer.workDone) {
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
  }
};
</script>

<style lang="scss" scoped>
.hasStatusTop {
  margin-top: var(--status-bar-height);
}
.inspection-device {
  width: 100%;
  .deviceBtn,
  .mainColor,
  .mainColor-blue,
  .mainColor-orange,
  .mainColor-violet,
  .mainColor-navyBlue {
    float: right;
    margin-left: 40rpx;
  }
  .btn-item {
    width: 50%;
    display: inline-block;
    vertical-align: top;
    .btn {
      border-radius: 0px;
      &:after {
        border-radius: 0px;
      }
    }
  }
  .checkbox-all {
    margin-right: 2px;
    .uni-checkbox-input {
      margin: 0;
    }
  }
  .notdata {
    position: fixed;
    height: calc(100% - 176rpx);
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .nodata-img {
      width: 200rpx;
      height: 200rpx;
      margin-bottom: 30rpx;
    }
    .nodata-text {
      color: #9b9b9b;
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
  .checkbox-box {
    width: 32rpx;
    height: 32rpx;
    position: relative;
    .appIcon {
      font-size: 32rpx;
      color: #4689f5;
      top: 0rpx;
      left: 0;
      position: absolute;
      transform: scale(0);
      opacity: 0;
    }
    .checkbox-style {
      width: 32rpx;
      height: 32rpx;
      top: 0rpx;
      left: 0;
      position: absolute;
      transform: scale(0);
      opacity: 0;
      ::v-deep {
        .uni-checkbox-wrapper {
          vertical-align: super;
        }
        .uni-checkbox-input {
          width: 32rpx;
          height: 32rpx;
          box-sizing: border-box;
        }
      }
    }
    .showSelect {
      animation: scaleShow 0.2s 1 forwards;
    }
  }
  .inspection-device-box {
    padding: 200rpx 0 108rpx 0;
    .inspection-top-route {
      width: 100%;
      height: 180rpx;
      padding: 40rpx;
      position: fixed;
      top: 88rpx;
      background: #ffffff;
      box-shadow: 0px 2rpx 10rpx 0px rgba(0, 0, 0, 0.2);
      border-radius: 0px 0px 20rpx 20rpx;
      z-index: 1;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .img {
        width: 88rpx;
        height: 88rpx;
        margin-right: 30rpx;
      }
      .route-detail {
        width: calc(100% - 118rpx);
        height: 88rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .inspection-name {
          font-size: 28rpx;
          color: #333333;
          font-size: 34rpx;
          @include fontBlob(500);
          line-height: 42rpx;
        }
        .inspection-num {
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
    .device-info {
      margin: 0 30rpx 20rpx;
      display: block;
      background: #fff;
      border-radius: 12rpx;
      box-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
      .device-info-box {
        padding: 30rpx;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .m-info {
            display: flex;
            align-items: center;
            height: 48rpx;
            .img {
              width: 48rpx;
              height: 48rpx;
              margin-right: 14rpx;
            }
            .moname {
              color: #444444;
              font-size: 34rpx;
              margin-right: 18rpx;
              display: block;
            }
          }
          .deviceCode {
            font-size: 28rpx;
            color: #333333;
            line-height: 62rpx;
          }
          .inspection-num {
            flex: 0 1 100rpx;
            line-height: 40rpx;
            color: #fff;
            font-size: 26rpx;
            background: #bbc3cd;
            text-align: center;
            border-radius: 20rpx;
          }
          .ongoing {
            background: #f7b500;
          }
          .finish {
            background: #4689f5;
          }
          .abnormal {
            background: #f0605d;
          }
        }
      }
      .position-name-box {
        height: 46rpx;
        background: #f6f6f8;
        border-radius: 8rpx;
        .position-name,
        .position-storagelocation {
          color: #9b9b9b;
          font-size: 28rpx;
          margin-left: 10rpx;
        }
      }
    }
  }
  .inspection-operation {
    position: fixed;
    bottom: 30rpx;
    left: 20rpx;
    width: 710rpx;
    height: 88rpx;
    display: flex;
    background: #ffffff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 44px;
    justify-content: space-around;
    align-items: center;
    padding: 0 13rpx;
    box-sizing: border-box;
    .item {
      flex: 1;
      height: 62rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      font-size: 28rpx;
      &:after {
        content: ' ';
        width: 1rpx;
        height: 24rpx;
        background: #d9d9d9;
        margin-right: -3rpx;
        position: absolute;
        right: -15rpx;
        top: 19rpx;
      }
      .appIcon {
        font-size: 38rpx;
        text-align: right;
        padding-right: 8rpx;
        color: #4689f5;
      }
      .item-text {
        font-size: 28rpx;
        color: #444444;
        padding-left: 8rpx;
      }
    }
    .more {
      background: #4689f5;
      border-radius: 31rpx;
      .appIcon,
      .item-text {
        color: #ffffff;
      }
      &:after {
        content: ' ';
        width: 0rpx;
      }
    }
    .more-operation {
      width: 80rpx;
      height: 300rpx;
      position: absolute;
      right: 0;
      top: -300rpx;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .more-item {
        width: 80rpx;
        height: 80rpx;
        background: #ffffff;
        box-shadow: 0px 4rpx 11rpx 0px rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20rpx;
        .appIcon {
          font-size: 36rpx;
          color: #4689f5;
        }
      }
    }
  }
  .nolock {
    .item {
      width: 50%;
    }
  }
  .download-complete {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 5;
    .download-complete-layout {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.3);
    }
    .download-complete-content {
      width: 440rpx;
      height: 460rpx;
      background: #ffffff;
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
      .download-complete-img {
        width: 200rpx;
        height: auto;
      }
      .tip {
        height: 108rpx;
        font-size: 30rpx;
        color: #333333;
        line-height: 108rpx;
        text-align: center;
      }
      .download-complete-button {
        width: 320rpx;
        height: 72rpx;
        background: #4689f5;
        border-radius: 42rpx;
        text-align: center;
        font-size: 30rpx;
        color: #ffffff;
        line-height: 72rpx;
      }
    }
  }
  .formTemplate-btns {
    width: 100%;
    height: 110rpx;
    background: #ffffff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    .checkAll {
      width: 140rpx;
      height: 72rpx;
      .label {
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
    .btn-item {
      width: 260rpx;
      height: 72rpx;
      background: #f1f3f6;
      border-radius: 12rpx;
      margin: 0 12rpx;
      color: #333333;
      font-size: 30rpx;
      line-height: 72rpx;
      text-align: center;
    }
    .confirm {
      background: #4689f5;
      color: #ffffff;
    }
    .red {
      background: red;
    }
  }
}
.processModal {
  margin: 44rpx 0 275rpx 0;
  &__tip {
    margin-bottom: 16rpx;
    font-size: 28rpx;
    font-family: $--font-family;
    color: #555555;
    text-align: left;
  }
}
.form {
  ::v-deep {
    .u-form-item__body__left__content__required {
      position: static;
    }
    .u-form-item__body__left__content__label{
      color: #555555 !important;
      font-size: 28rpx !important;
    }
    .picker-item{
      width: 100%;
      div{
        width: 100%;
      }
    }
    .picker-item-label{
      height: 88rpx;
      line-height: 88rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .confirm{
        color: #AAAAAA;
        font-size: 32rpx;
      }
      .appIcon-riqi{
        font-size: 38rpx;
        color: #AAAAAA;
      }
    }
  }
}
.element {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  display: flex;
  font-family: $--font-family;
  color: $form-el-labelColor;
  overflow: hidden;
  flex-direction: column;
  align-items: flex-start;
  // border-bottom: solid 0.5px #e9e9e9;

  .required {
    color: #e02020;
    margin-left: 4rpx;
  }
  .elementLabel{
    height: 68rpx;
    line-height: 68rpx;
  }
  .elementContent {
    width: 100%;
    overflow: hidden;
  }
  ::v-deep {
    .u-form-item {
      margin: 0 !important;
    }
  }
}
</style>
