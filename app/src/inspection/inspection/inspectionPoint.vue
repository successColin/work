<template>
  <view class="inspection-point">
    <apiot-navbar :title="deviceName || $t('inspection.inspectionPoint')">
    </apiot-navbar>
    <view class="notdata" v-if="pointList.length === 0">
      <image src="~@/static/img/common/nodata.svg" class="nodata-img"></image>
      <text class="nodata-text">{{ $t('common.noData') }}</text
      ><!--暂无数据-->
    </view>
    <view class="inspection-point-list">
      <view
        class="point-item"
        :class="[openPointIndex === index ? 'pointItemActive' : '']"
        v-for="(item, index) in pointList"
        :key="index"
      >
        <view
          class="point-title"
          :class="[openPointIndex === index ? 'pointActive' : '']"
          @click="handleOpen(index)"
        >
          <text
            :class="[
              'num',
              item.inspectCondition === 1 ? 'normal' : '',
              item.inspectCondition === 2 ? 'fault' : '',
              item.inspectCondition === 3 ? 'shutdown' : '',
            ]"
            >{{ index + 1 }}</text
          >
          <text class="point-name">{{ item.taskName }}</text>
          <i class="appIcon appIcon-a-shujuxuanzejinru arrow"></i>
        </view>
        <view
          class="point-detail"
          v-if="openPointIndex === index ? true : false"
        >
          <view class="detail-form">
            <!-- 点的类型 1=正常异常；2-测量；3=润滑；999=强制现场点检虚拟点 -->
            <view class="basic-info" v-if="item.taskType != 999">
              <!-- 中文：巡检基准 -->
              <!-- <view class="basic-info-item">
                <text class="label-text"
                  >{{ $t('inspection.inspection-checkingBenchmark') }}：</text
                >
                <text class="value-text">{{ item.standardCondition }}</text>
              </view> -->
              <view
                class="basic-info-item"
                :key="obj.id"
                v-for="obj in taskConfigByType(item.taskType, 1, 2)"
              >
                <text class="label-text">{{ obj.columnTitle }}：</text
                ><!-- 中文：巡检方法 -->
                <text class="value-text">{{
                  item[obj.columnObj.columnName]
                }}</text>
              </view>
              <!-- 中文：计划开始时间 -->
              <!-- <view class="basic-info-item">
                <text class="label-text">{{ $t('inspection.page-planStartTime') }}：</text
                >
                <text class="value-text">{{ item.taskStartTime }}</text>
              </view> -->
              <!-- 中文：仪器仪表 -->
              <!-- <view class="basic-info-item" v-if="item.taskType > 3">
                <text class="label-text"
                  >{{ $t('inspection.inspection-instrumentMeter') }}：</text
                >
                <text class="value-text">{{ item.instrumentname }}</text>
              </view> -->
              <!-- 中文：测量上限 -->
              <!-- <view
                class="basic-info-item"
                v-if="item.taskType > 3 || item.taskType == 2"
              >
                <text class="label-text"
                  >{{ $t('inspection.inspection-measurementLimit') }}：</text
                >
                <text class="value-text">{{ item.standardMeasureUpper }}</text>
              </view> -->
              <!-- 中文：测量下限 -->
              <!-- <view
                class="basic-info-item"
                v-if="item.taskType > 3 || item.taskType == 2"
              >
                <text class="label-text"
                  >{{ $t('inspection.inspection-measureLowerLimit') }}：</text
                >
                <text class="value-text">{{ item.standardMeasureLower }}</text>
              </view> -->
              <!-- 中文：备 注 -->
              <!-- <view class="basic-info-item">
                <text class="label-text w-s">{{ $t('inspection.page-note') }}：</text
                >
                <text class="value-text">{{ item.memo }}</text>
              </view> -->
            </view>
            <!-- 测量 -->
            <view
              class="basic-content-info"
              v-if="item.taskType == 2 && taskConfigByType(2, 1, 1).length"
            >
              <view
                class="info-item"
                :key="obj.id"
                v-for="obj in taskConfigByType(2, 1, 1)"
              >
                <text class="label-text">{{ obj.columnTitle }}：</text
                ><!-- 中文：测量值-->
                <input
                  class="uni-input"
                  auto-blur="true"
                  type="text"
                  :placeholder="$t('inspection.inspection-enterMeasuredValue')"
                  placeholder-class="placeholder"
                  @input="(e) => handleInput(e, obj.columnObj.columnName)"
                  v-model="item[obj.columnObj.columnName]"
                /><!-- 中文：请输入测量值-->
              </view>
            </view>
            <!-- 测温测振 -->
            <view
              class="basic-content-info"
              v-else-if="item.taskType > 3 && item.taskType != 999"
            >
              <view
                class="info-item"
                :key="obj.id"
                v-for="obj in taskConfigByType(item.taskType, 5, 1)"
              >
                <text class="label-text">{{ obj.columnTitle }}：</text
                ><!-- 中文：测量值-->
                <input
                  class="uni-input"
                  auto-blur="true"
                  type="text"
                  disabled="disabled"
                  :placeholder="$t('inspection.inspection-enterMeasuredValue')"
                  placeholder-class="placeholder"
                  v-model="item[obj.columnObj.columnName]"
                /><!-- 中文：请输入测量值-->
                <i
                  class="appIcon appIcon-celiangzhi"
                  :class="ismeasure"
                  @click="handleMeasure(item)"
                ></i>
              </view>
            </view>
            <!-- 润滑 -->
            <view
              class="basic-content-info"
              v-else-if="item.taskType == 3 && taskConfigByType(3, 1, 1).length"
            >
              <view class="info-item">
                <text class="label-text"
                  >{{ $t('inspection.inspection-lubricant') }}：</text
                ><!-- 中文： 润滑剂-->
                <text class="value-text">{{
                  $t('inspection.inspection-mechanicalLubricant')
                }}</text
                ><!-- 中文： 机械润滑剂-->
              </view>
              <!-- 中文：测量单位 -->
              <!-- <view class="info-item">
                <text class="label-text"
                  >{{ $t('inspection.inspection-measuredUnit') }}：</text
                >
                <text class="value-text">{{ item.unitname }}</text>
              </view> -->
              <view
                class="info-item"
                :key="obj.id"
                v-for="obj in taskConfigByType(3, 1, 1)"
              >
                <text class="label-text">{{ obj.columnTitle }}：</text
                ><!-- 中文： 数量-->
                <input
                  auto-blur="true"
                  class="uni-input"
                  type="number"
                  :placeholder="$t('inspection.enterQuantity')"
                  placeholder-class="placeholder"
                  @input="saveOilqty($event, obj.columnObj.columnName)"
                  v-model="item[obj.columnObj.columnName]"
                /><!-- 中文： 请输入数量 -->
              </view>
            </view>
            <!-- 除强制点检外 -->
            <view class="basic-content-info" v-if="item.taskType != 999">
              <view
                class="info-item info-textarea"
                :key="obj.id"
                v-for="obj in taskConfigByType(item.taskType, 2, 1)"
              >
                <text class="label-text">{{ obj.columnTitle }}：</text
                ><!--中文： 执行描述-->
                <textarea
                  auto-blur="true"
                  class="uni-textarea"
                  type="number"
                  maxlength="50"
                  v-model="item[obj.columnObj.columnName]"
                  :placeholder="$t('inspection.fault-description')"
                  placeholder-class="placeholder"
                  @input="saveDescription($event, obj.columnObj.columnName)"
                ></textarea>
              </view>
              <!-- <text class="textareaLength"
                >{{ item.inspectUserDesc.length }}/50</text
              > -->
            </view>
            <!-- 下拉框 -->
            <view
              class="basic-content-info"
              v-if="taskConfigByType(item.taskType, 6, 1).length"
            >
              <view
                class="info-item"
                :key="obj.id"
                v-for="obj in taskConfigByType(item.taskType, 6, 1)"
              >
                <text class="label-text">{{ obj.columnTitle }}：</text
                ><!--中文： 执行描述-->
                <view class="inspectionSelect">
                  <apiot-select-down
                    :value="item[obj.columnObj.columnName]"
                    :list="obj.dictObj.dictValue"
                    showProp="zhCN"
                    @select="(e) => select(e, obj.columnObj.columnName)"
                  ></apiot-select-down>
                </view>
              </view>
              <!-- <text class="textareaLength"
                >{{ item.inspectUserDesc.length }}/50</text
              > -->
            </view>
            <!-- 上传图片 -->
            <view
              class="info-item info-files"
              v-if="taskConfigByType(item.taskType, 4, 1).length"
            >
              <text class="label-text"
                >{{ $t('inspection.pageTip-uploadImg') }}：</text
              ><!--中文： 执行描述-->
            </view>
            <view
              class="img-files"
              v-if="taskConfigByType(item.taskType, 4, 1).length"
            >
              <view
                class="upload-btn img-item"
                @click="handleChooseImage(index)"
                ><i class="appIcon appIcon-tianjiagongneng"></i
              ></view>
              <view
                class="img-item upload-img"
                v-for="(imgItem, imgIndex) in item.fileList"
                :key="imgIndex"
              >
                <image
                  :src="imgItem.filepath"
                  class="uploadImg"
                  @click="handlePreviewImage(index, imgIndex)"
                ></image>
                <i
                  class="appIcon appIcon-guanbi delImg"
                  @click="handleDeleteImg(index, imgIndex)"
                ></i>
                <!-- <m-font-icon
                  icon="iconqingchu"
                  :iconSize="30"
                  color="#ADADAD"
                ></m-font-icon> -->
              </view>
            </view>
            <block
              v-if="
                item.taskType != 999 &&
                taskConfigByType(item.taskType, 7, 1).length
              "
            >
              <view
                class="operation"
                v-if="
                  item.taskType == 1 ||
                  item.taskType == 3 ||
                  item.taskType == 999 ||
                  !limitFunc
                "
              >
                <text
                  v-for="obj in dicList"
                  :key="obj.value"
                  :class="['btn', 'normal']"
                  :style="{
                    background:
                      item.inspectCondition == obj.value ? obj.color : '',
                    color:
                      item.inspectCondition == obj.value
                        ? obj.fontColor
                        : '#444444',
                  }"
                  @click="handleChangeState(index, obj.value)"
                >
                  <i
                    v-if="obj.value == 1"
                    :style="{
                      color:
                        item.inspectCondition == obj.value
                          ? obj.fontColor
                          : '#BBC3CD',
                    }"
                    class="appIcon appIcon-zhengchang"
                  ></i>
                  <i
                    v-else-if="obj.value == 2"
                    :style="{
                      color:
                        item.inspectCondition == obj.value
                          ? obj.fontColor
                          : '#BBC3CD',
                    }"
                    class="appIcon appIcon-yichang"
                  ></i>
                  <i
                    v-else-if="obj.value == 3"
                    :style="{
                      color:
                        item.inspectCondition == obj.value
                          ? obj.fontColor
                          : '#BBC3CD',
                    }"
                    class="appIcon appIcon-tingji"
                  ></i>
                  {{ obj.name }}
                </text>
              </view>
              <view class="operation" v-else>
                <text
                  v-for="obj in dicList"
                  :key="obj.value"
                  :class="['btn', 'normal']"
                  :style="{
                    background:
                      item.inspectCondition === obj.value ? obj.color : '',
                    color:
                      item.inspectCondition === obj.value
                        ? obj.fontColor
                        : '#444444',
                  }"
                >
                  <i
                    v-if="obj.value === 1"
                    :style="{
                      color:
                        item.inspectCondition === obj.value
                          ? obj.fontColor
                          : '#BBC3CD',
                    }"
                    class="appIcon appIcon-zhengchang"
                  ></i>
                  <i
                    v-else-if="obj.value === 2"
                    :style="{
                      color:
                        item.inspectCondition === obj.value
                          ? obj.fontColor
                          : '#BBC3CD',
                    }"
                    class="appIcon appIcon-yichang"
                  ></i>
                  <i
                    v-else-if="obj.value === 3"
                    :style="{
                      color:
                        item.inspectCondition === obj.value
                          ? obj.fontColor
                          : '#BBC3CD',
                    }"
                    class="appIcon appIcon-tingji"
                  ></i>
                  {{ obj.name }}
                </text>
              </view>
            </block>
          </view>
        </view>
      </view>
    </view>
    <!-- 删除图片确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
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
import ApiotTipPrompt from '../components/ApiotTipPrompt';
import {
  selectPointDoListByCode,
  updateSql,
  insertFile,
  selectFileList,
  deleteFile,
  selectPointsResults,
  selectPointtimeCost,
  selectInspectionConfig
} from '../js/DB.js';
import { mapState } from 'vuex';
import { readMeaInit, meaTem, closeMeaTem, initMeaTem } from '../js/bridge.js';

export default {
  components: {
    ApiotTipPrompt
  },
  onLoad(options) {
    selectInspectionConfig((res) => {
      this.taskLayer = JSON.parse(res[0].taskLayer);
      const arr = this.taskLayer.columnArr.filter((item) => item.compType === 7);
      if (arr.length) {
        this.dictArr([arr[0].dictObj.dictKey]);
        this.dictKey = arr[0].dictObj.dictKey;
      }
      if (this.taskLayer.openFirstTask) {
        this.openPointIndex = 0;
      }
      this.limitFunc = this.taskLayer.limitFunc;
      this.enforceCheck = this.taskLayer.enforceCheck;
    });
    // this.openFirstTask = this.taskLayer.openFirstTask;
    this.inspectionRouteId = options.inspectionRouteId;
    this.deviceCode = options.deviceCode;
    this.deviceName = options.deviceName;
    this.unlockType = options.unlockType;
    this.type = options.type;
    // result 上传点检页面进入, device 设备页面进入
    if (this.type === 'result') {
      this.getResultData();
    } else if (this.type === 'device') {
      this.getData();
    }
  },
  onHide() {
    if (!this.measure && this.openPointIndex !== -1) {
      // 页面进入后台时关闭测量接口
      setTimeout(() => {
        this.measure = true;
        this.$set(this.pointList[this.openPointIndex], 'inspectMeasureValue', '');
        closeMeaTem();
      }, 30);
    }
  },
  onUnload() {
    if (!this.measure && this.openPointIndex !== -1) {
      // 页面销毁时关闭测量接口
      setTimeout(() => {
        this.measure = true;
        this.$set(this.pointList[this.openPointIndex], 'inspectMeasureValue', '');
        closeMeaTem();
      }, 30);
    }
  },
  onBackPress() {
    let backFlag = false;
    // 如果有强制点检的点，必须要有现场图片
    // 如果所有的点都没有点检过，那么也不需要判断强制点检
    if (
      this.openPointIndex !== -1 &&
      +this.pointList[this.openPointIndex].taskType === 999 &&
      this.pointList[this.openPointIndex].fileList.length === 0 &&
      this.enforceCheck
    ) {
      this.promptData = {
        title: this.$t('common.tip'),
        confirmText: this.$t('common.sure'),
        tip: `${this.pointList[this.openPointIndex].taskName},${this.$t(
          'inspection.inspection-forcePoint'
        )}` // 中文：'强制点检必须要有相关设备图片!',
      };
      this.showTipPrompt = true;
      backFlag = true;
    } else if (
      this.openPointIndex !== -1 &&
      this.pointList[this.openPointIndex].inspectCondition === 2 &&
      !this.pointList[this.openPointIndex].inspectUserDesc &&
      this.taskLayer.abnormalMemo
    ) {
      this.promptData = {
        title: this.$t('common.tip'),
        confirmText: this.$t('common.sure'),
        tip: this.$t('inspection.inspection-pointErrorStatus') // 中文：'强制点检必须要有相关设备图片!',
      };
      this.showTipPrompt = true;
      backFlag = true;
    }
    return backFlag;
  },
  data() {
    return {
      inspectionRouteId: null,
      unlockType: null,
      measure: true,
      measureType: null,
      openPointIndex: -1,
      lastOpenPointIndex: -1,
      type: null, // 分为结果进入的和设备页面进入的
      pointList: [],
      startCheckTime: null,
      endCheckTime: null,
      showDeleteConfirm: false,
      delImg: {},
      showTipPrompt: false,
      promptData: {
        title: '',
        confirmText: '',
        tip: ''
      },
      taskLayer: {},
      dictKey: '',
      deviceName: '',
      openFirstTask: false
    };
  },
  computed: {
    ...mapState('Inspection', ['inspectionPhotoGallery']),
    ismeasure() {
      let res = 'inspectionMeasureConfirm';
      if (this.measure) {
        res = 'inspectionMeasure';
      }
      return res;
    },
    measureColor() {
      let res = '#F7B500';
      if (this.measure) {
        res = '#BBC3CD';
      }
      return res;
    },
    measureStrType: {
      get: () => {
        let res = '';
        if (this.measureType === '4') {
          // 温度
          res = '0b0b';
        } else if (this.measureType === '5') {
          // 振动
          res = '0F11';
        } else if (this.measureType === '6') {
          // 加速度
          res = '0F12';
        } else if (this.measureType === '7') {
          // 速度
          res = '0F13';
        }
        return res;
      }
    },
    dicList() {
      return this.$store.getters.getCurDict(this.dictKey) || [];
    }
  },
  methods: {
    async dictArr(dict) {
      await this.$store.dispatch('getCurrentDict', dict.join());
    },
    // 下拉框选择
    select(e, columnName) {
      const val = e[0].value;
      const that = this;
      const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
      updateSql(
        'inspectionpointdo',
        {
          [columnName]: val,
          inspectTime
        },
        { inspectionTaskId: this.pointList[this.openPointIndex].inspectionTaskId },
        () => {
          that.pointList[that.openPointIndex][columnName] = val;
        }
      );
    },
    taskConfigByType(taskType, type, status) {
      // taskType 任务类型， type 控件类型， status控件状态
      let arr = [];
      if (status) {
        arr = this.taskLayer.columnArr.filter(
          (item) =>
            item.compType === type &&
            item.taskState.indexOf(Number(taskType)) !== -1 &&
            item.showStatus === status
        );
      } else {
        arr = this.taskLayer.columnArr.filter(
          (item) => item.compType === type && item.taskState.indexOf(Number(taskType)) !== -1
        );
      }
      return arr;
    },
    handleMeasure(item) {
      const that = this;
      that.measureType = item.taskType;
      if (that.measure) {
        // 准备测量
        readMeaInit(() => {
          that.measure = false;
          uni.showLoading({
            title: `${that.$t('inspection.inspection-readyRead')}...` // 中文：准备读取
          });
          if (that.measureType === '4') {
            // 测量温度特殊处理
            setTimeout(() => {
              initMeaTem();
            }, 1000);
            setTimeout(() => {
              uni.hideLoading();
              that.startMeasure(that.measureStrType, item);
            }, 2000);
          } else {
            uni.hideLoading();
            setTimeout(() => that.startMeasure(that.measureStrType, item), 1000);
          }
        });
      } else {
        setTimeout(() => {
          that.measure = true;
          that.confirmMeasure(item);
          that.openPointIndex = -1;
          closeMeaTem();
        }, 30);
      }
    },
    // 开始测量
    startMeasure(type, item) {
      if (!this.measure) {
        meaTem(type, (args) => {
          // eslint-disable-next-line prefer-destructuring
          item.inspectMeasureValue = args[0].split(' ')[0];
          setTimeout(() => this.startMeasure(type, item), 1000);
        });
      }
    },
    getData() {
      const that = this;
      selectPointDoListByCode(this.inspectionRouteId, this.deviceCode, this.unlockType, (res) => {
        console.log(res);
        that.pointList = res.map((item) => {
          if (!item.fileList) item.fileList = [];
          if (!item.inspectUserDesc) item.inspectUserDesc = '';
          if (item.memo === null) item.memo = that.$t('inspection.inspection-none'); // 中文：that.$t('inspection.inspection-none')
          if (item.instrumentname === null) {
            item.instrumentname = that.$t('inspection.inspection-none');
          }
          if (item.standardMeasureUpper === null) {
            item.standardMeasureUpper = that.$t('inspection.inspection-none');
          }
          if (item.standardMeasureLower === null) {
            item.standardMeasureLower = that.$t('inspection.inspection-none');
          }
          if (item.inspectMeasureValue === null) item.inspectMeasureValue = '';
          return item;
        });
      });
    },
    // 获取已点检完成任务
    getResultData() {
      const that = this;
      selectPointsResults(this.inspectionRouteId, (res) => {
        console.log(res);
        that.pointList = res.map((item) => {
          if (!item.fileList) item.fileList = [];
          if (!item.inspectUserDesc) item.inspectUserDesc = '';
          if (item.memo === null) item.memo = that.$t('inspection.inspection-none');
          if (item.instrumentname === null) {
            item.instrumentname = that.$t('inspection.inspection-none');
          }
          if (item.standardMeasureUpper === null) {
            item.standardMeasureUpper = that.$t('inspection.inspection-none');
          }
          if (item.standardMeasureLower === null) {
            item.standardMeasureLower = that.$t('inspection.inspection-none');
          }
          if (item.inspectMeasureValue === null) item.inspectMeasureValue = '';
          return item;
        });
      });
    },
    async handleOpen(index) {
      // 如果是强制点检的点，没有上传图片时不允许点击其它点
      if (
        this.openPointIndex !== -1 &&
        +this.pointList[this.openPointIndex].taskType === 999 &&
        this.pointList[this.openPointIndex].fileList.length === 0 &&
        this.enforceCheck
      ) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: `${this.pointList[this.openPointIndex].taskName},${this.$t(
            'inspection.inspection-forcePoint'
          )}` // 中文：'强制点检必须要有相关设备图片!',
        };
        this.showTipPrompt = true;
        return;
      }
      // 异常状态没有填写描述不允许点击其它点
      if (
        this.openPointIndex !== -1 &&
        this.pointList[this.openPointIndex].inspectCondition === 2 &&
        !this.pointList[this.openPointIndex].inspectUserDesc &&
        this.taskLayer.abnormalMemo
      ) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-pointErrorStatus')
        };
        this.showTipPrompt = true;
        return;
      }
      if (!this.measure) {
        // 测量中关闭或切换点关闭测量接口
        const pointIndex = this.openPointIndex;
        setTimeout(() => {
          this.measure = true;
          this.$set(this.pointList[pointIndex], 'inspectMeasureValue', '');
          closeMeaTem();
        }, 30);
      }
      if (
        this.openPointIndex !== -1 &&
        this.pointList[this.openPointIndex].taskType === 2 &&
        this.pointList[this.openPointIndex].inspectMeasureValue === ''
      ) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-enterMeasuredValue')
        };
        this.showTipPrompt = true;
        return;
      }
      // 打开其它任务
      if (this.openPointIndex !== index) {
        // 当前没有展开的任务
        if (this.openPointIndex === -1) {
          // 记录任务展开时间点
          this.startCheckTime = new Date().getTime() / 1000;
          this.openPointIndex = index;
        } else {
          // 关闭当前任务并打开其它任务
          try {
            const { inspectionTaskId } = this.pointList[this.openPointIndex];
            // 查询当前展开任务已用时长
            await selectPointtimeCost(inspectionTaskId, (res) => {
              const timeCost = res[0].timeCost || 0;
              this.endCheckTime = new Date().getTime() / 1000;
              const time = Math.floor(this.endCheckTime - this.startCheckTime);
              const data = {
                timeCost: time + timeCost
              };
              // 更新当前展开任务点检用时
              this.updateInspectionTime(data, inspectionTaskId);
              this.openPointIndex = index;
              this.endCheckTime = null;
              this.startCheckTime = new Date().getTime() / 1000;
            });
          } catch (e) {
            this.openPointIndex = index;
            this.endCheckTime = null;
            this.startCheckTime = new Date().getTime() / 1000;
            console.error(e);
          }
        }
        // 打开点检类型为正常异常\润滑\强制点检任务时,默认设为正常
        if (
          (Number(this.pointList[index].taskType) === 1 ||
            Number(this.pointList[index].taskType) === 3 ||
            Number(this.pointList[index].taskType) === 999) &&
          !this.pointList[index].inspectCondition
        ) {
          this.handleChangeState(index, 1);
        }
        this.getFileList(index);
      } else {
        // 关闭当前任务
        try {
          const { inspectionTaskId } = this.pointList[this.openPointIndex];
          // 查询当前展开任务已用时长
          await selectPointtimeCost(inspectionTaskId, (res) => {
            const timeCost = res[0].timeCost || 0;
            console.log(res);
            this.endCheckTime = new Date().getTime() / 1000;
            const time = Math.floor(this.endCheckTime - this.startCheckTime);
            console.log(time);
            const data = {
              timeCost: time + timeCost
            };
            // 更新当前展开任务点检用时
            this.updateInspectionTime(data, inspectionTaskId);
            this.openPointIndex = -1;
            this.endCheckTime = null;
            this.startCheckTime = null;
          });
        } catch (e) {
          this.openPointIndex = -1;
          this.endCheckTime = null;
          this.startCheckTime = null;
          console.error(e);
        }
      }
    },
    // 更新任务点检用时
    updateInspectionTime(data, inspectionTaskId) {
      updateSql('inspectionpointdo', data, { inspectionTaskId });
    },
    // 查询任务关联图片
    getFileList(index) {
      const that = this;
      selectFileList(that.pointList[index].inspectionTaskId, (res) => {
        that.pointList[index].fileList = res;
        that.nowFileList = res;
      });
    },
    // 任务输入测量值变化时判断当前任务正常异常状态
    handleInput(e, columnName) {
      const that = this;
      const pointData = this.pointList[this.openPointIndex];
      const inspectMeasureValue = e.detail.value; // 界面展示数值
      let val = 0; // 实际存入数据库的数值
      const reg = /^((-?\d+)|(-?))((\.\d+)?|(\.)?)$/;
      if (reg.test(inspectMeasureValue) && inspectMeasureValue !== '') {
        if (inspectMeasureValue === '-') {
          val = 0;
        } else {
          pointData[columnName] = parseFloat(inspectMeasureValue);
          val = parseFloat(inspectMeasureValue);
        }
      } else {
        pointData[columnName] = 0;
        val = 0;
      }
      const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
      if (this.limitFunc) {
        if (val <= pointData.standardMeasureUpper && val >= pointData.standardMeasureLower) {
          this.handleChangeState(this.openPointIndex, 1);
        } else {
          this.handleChangeState(this.openPointIndex, 2);
        }
      }
      updateSql(
        'inspectionpointdo',
        { [columnName]: val, inspectTime },
        { inspectionTaskId: pointData.inspectionTaskId },
        () => {
          that.$set(that.pointList, that.openPointIndex, pointData);
        }
      );
    },
    // 确认测量
    confirmMeasure(pointData) {
      const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
      if (
        pointData.inspectMeasureValue <= pointData.standardMeasureUpper &&
        pointData.inspectMeasureValue >= pointData.standardMeasureLower
      ) {
        this.handleChangeState(this.openPointIndex, 1);
      } else {
        this.handleChangeState(this.openPointIndex, 2);
      }
      updateSql(
        'inspectionpointdo',
        {
          inspectMeasureValue: pointData.inspectMeasureValue,
          inspectTime
        },
        { inspectionTaskId: pointData.inspectionTaskId }
      );
    },
    saveOilqty(e, columnName) {
      const inspectOilQty = e.detail.value;
      const that = this;
      const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
      console.log(inspectOilQty, columnName, 'columnName');
      updateSql(
        'inspectionpointdo',
        { [columnName]: inspectOilQty, inspectTime },
        { inspectionTaskId: this.pointList[this.openPointIndex].inspectionTaskId },
        () => {
          that.pointList[that.openPointIndex][columnName] = inspectOilQty;
        }
      );
    },
    saveDescription(e, columnName) {
      console.log(e, '000000000000000');
      const inspectUserDesc = e.detail.value;
      const that = this;
      const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
      updateSql(
        'inspectionpointdo',
        {
          [columnName]: inspectUserDesc,
          inspectTime
        },
        { inspectionTaskId: this.pointList[this.openPointIndex].inspectionTaskId },
        () => {
          that.pointList[that.openPointIndex][columnName] = inspectUserDesc;
        }
      );
    },
    // 上传点检图片
    handleChooseImage(index) {
      const that = this;
      const imgLength = that.pointList[index].fileList.length;
      if (imgLength >= 3) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.pageTip-noMorePictures')
        };
        this.showTipPrompt = true;
        return;
      }
      uni.chooseImage({
        count: 3 - imgLength,
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: this.inspectionPhotoGallery, // 从相册选择
        success: (res) => {
          console.log(res);
          // let filesList = that.pointList[index].fileList.concat(res.tempFilePaths);
          // #ifdef APP-PLUS
          that.saveFile(res.tempFilePaths, index);
          // #endif
          // #ifdef H5
          // eslint-disable-next-line no-undef
          that.pointList[index].fileList = filesList;
          // #endif
        }
      });
    },
    saveFile(filesList, index) {
      const that = this;
      const fileData = [];
      let num = 0;
      const saveFiles = (item) => {
        if (typeof item === 'object') return;
        const tempFile = escape(item);
        console.log(tempFile);
        // 图片保存本地
        uni.saveFile({
          tempFilePath: item,
          success: (res) => {
            console.log(res);
            fileData.push({
              inspectionRouteId: that.pointList[index].inspectionRouteId,
              inspectionTaskId: that.pointList[index].inspectionTaskId,
              filepath: res.savedFilePath,
              createdate: new Date().getTime() / 1000
            });
            if (num < filesList.length - 1) {
              // eslint-disable-next-line no-plusplus
              num++;
              return saveFiles(filesList[num]);
              // eslint-disable-next-line no-else-return
            } else {
              insertFile(fileData, () => {
                that.getFileList(index);
              });
            }
          },
          fail: (e) => {
            // reject(err)
            console.log(e);
            if (fileData.length > 0) {
              insertFile(fileData, () => {
                that.getFileList(index);
              });
            }
            that.promptData = {
              title: that.$t('common.tip'),
              confirmText: that.$t('common.sure'),
              tip: that.$t('inspection.formTip-reUpload')
            };
            that.showTipPrompt = true;
          }
        });
      };
      saveFiles(filesList[num]);
    },
    // 删除图片确认
    showDeleteImg(index, imgIndex) {
      this.showDeleteConfirm = true;
      this.delImg = {
        index,
        imgIndex
      };
    },
    // 删除图片
    async handleDeleteImg(index, imgIndex) {
      try {
        await this.$refs.apiotModal.showAsyncModal({
          content: this.$t('common.sureToDelete')
        });
        const _this = this;
        uni.removeSavedFile({
          filePath: _this.pointList[index].fileList[imgIndex].filepath,
          success: () => {
            deleteFile(_this.pointList[index].fileList[imgIndex].id, () => {
              _this.pointList[index].fileList.splice(imgIndex, 1);
              _this.showDeleteConfirm = false;
            });
          },
          fail: (e) => {
            console.log(e);
            _this.showDeleteConfirm = false;
            this.promptData = {
              title: this.$t('common.tip'),
              confirmText: this.$t('common.sure'),
              tip: this.$t('inspection.pageTip-deleteFaile')
            };
            this.showTipPrompt = true;
          }
        });
      } catch (error) {
        console.error(error);
      }
    },
    // 修改任务点检状态
    handleChangeState(index, inspectCondition) {
      const that = this;
      const inspectTime = this.$apiot.dateFormat('', 'yyyy-MM-dd hh:mm:ss');
      updateSql(
        'inspectionpointdo',
        {
          inspectCondition,
          operatingstatus: 1,
          inspectTime,
          hasAbnormal: inspectCondition === 1 ? 2 : 1
        },
        { inspectionTaskId: that.pointList[index].inspectionTaskId },
        () => {
          that.pointList[index].inspectCondition = inspectCondition;
          console.log(that.pointList[index].inspectCondition);
        }
      );
    },
    // 预览图片
    handlePreviewImage(index, imgIndex) {
      const urls = this.pointList[index].fileList.map((item) => item.filepath);
      uni.previewImage({
        current: imgIndex,
        urls
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.inspection-point {
  width: 100%;
  height: 100vh;
  font-size: 28rpx;
  background: #f6f6f8;
  overflow-y: auto;
  .notdata {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .nodata-img {
      width: 300rpx;
      height: 267rpx;
    }
    .nodata-text {
      color: #9b9b9b;
      font-size: 28rpx;
    }
  }
  .comBox {
    padding-left: 40rpx;
    height: 90rpx;
    font-size: 30rpx;
    font-family: PingFangSC-Regular, PingFangSC;
    font-weight: 400;
    color: rgba(68, 68, 68, 1);
    line-height: 90rpx;
    border-bottom: solid 1px #ebebeb;
  }
  .inspection-point-list {
    width: 100%;
    padding: 20rpx 30rpx;
    background: #f6f6f8;
    // height: 100%;
    box-sizing: border-box;
    .point-item {
      background: #fff;
      // box-shadow: 0px 4rpx 8rpx 0px rgba(0, 0, 0, 0.08);
      box-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
      border-radius: 14rpx;
      margin-bottom: 20rpx;
      .point-title {
        height: 88rpx;
        padding: 0 20rpx 0 30rpx;
        display: flex;
        align-items: center;
        color: #333333;
        .num {
          flex: 0 1 44rpx;
          width: 44rpx;
          height: 44rpx;
          border-radius: 50%;
          background: #bbc3cd;
          color: #fff;
          text-align: center;
          line-height: 44rpx;
          margin-right: 18rpx;
          font-size: 28rpx;
        }
        .normal {
          background: #5a80ed;
        }
        .fault {
          background: #f0605d;
        }
        .shutdown {
          background: #6b798d;
        }
        .point-name {
          flex: 1 0 0;
          font-size: 30rpx;
        }
        .arrow {
          flex: 0 1 18rpx;
          line-height: 45rpx;
          transition: all 0.3s;
          color: #bbc3cd;
        }
      }
      .point-title.pointActive {
        .arrow {
          transform: rotate(90deg);
        }
      }
      .point-detail {
        padding: 20rpx 0rpx;
        .label-text {
          width: 154rpx;
          color: #9b9b9b;
          display: inline-block;
        }
        .w-s {
          word-spacing: 49.3rpx;
        }
        .detail-form {
          background: #fff;
          border-radius: 12rpx;
          padding: 0 30rpx;
          .basic-info {
            padding: 22rpx 30rpx;
            background: #f6f6f8;
            border-radius: 12rpx;
            overflow: hidden;
            .basic-info-item {
              display: flex;
              line-height: 40rpx;
              .label-text {
                flex: 0 1 154rpx;
              }
              .value-text {
                flex: 1 0 0;
              }
              // &:last-child{
              //   padding-bottom:53rpx;
              //   box-shadow:0px 1px 0px 0px rgba(245,245,245,1);
              // }
            }
          }
          .basic-content-info {
            .info-item {
              box-shadow: inset 0px -2rpx 0px 0px #e9e9e9;
            }
            .inspectionSelect {
              flex: 1;
              .placeholder {
                color: #aaaaaa;
                font-size: 28rpx;
              }
            }
            .info-textarea {
              box-shadow: none;
            }
          }
          .info-item {
            height: 84rpx;
            display: flex;
            align-items: center;
            .label-text {
              flex-shrink: 1;
              font-size: 28rpx;
            }
            .value-text {
              flex-grow: 1;
            }
            .uni-input {
              flex: 1;
              flex-shrink: 0;
              .placeholder {
                color: #aaaaaa;
                font-size: 28rpx;
              }
            }
            .uni-textarea {
              width: 100%;
              height: 145rpx;
              flex-grow: 1;
              border-radius: 12rpx;
              border: 2rpx solid #e9e9e9;
              line-height: 60rpx;
              padding: 15rpx 20rpx;
              box-sizing: border-box;
            }
            .appIcon-celiangzhi {
              font-size: 60rpx;
              color: #bbc3cd;
            }
            .inspectionMeasure {
              color: #5a80ed;
            }
          }
          .info-textarea {
            height: 229rpx;
            align-items: flex-start;
            position: relative;
            box-shadow: none;
            display: block;
            box-sizing: border-box;
            .label-text {
              width: 100%;
              height: 68rpx;
              line-height: 68rpx;
            }
            .placeholder {
              color: #aaaaaa;
              font-size: 32rpx;
            }
            .textareaLength {
              position: absolute;
              right: 0;
              top: 145rpx;
              font-size: 24rpx;
              color: #9b9b9b;
            }
          }
          .info-files {
            height: 68rpx;
            .label-text {
              width: 100%;
              height: 68rpx;
              line-height: 68rpx;
            }
          }
          .img-files {
            display: flex;
            .upload-img {
              position: relative;
              &::before {
                content: '';
                width: 34rpx;
                height: 34rpx;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 0px 12rpx 0px 100rpx;
                position: absolute;
                right: 0;
                top: 0;
                z-index: 1;
              }
            }
            .img-item {
              width: 120rpx;
              margin: 0 1%;
              height: 120rpx;
              border: 1rpx solid #ebebeb;
              position: relative;
              border-radius: 12rpx;
              overflow: hidden;
              .uploadImg {
                width: 100%;
                height: 100%;
              }
              .delImg {
                position: absolute;
                top: 6rpx;
                right: 6rpx;
                font-size: 18rpx;
                color: #ffffff;
                z-index: 1;
              }
            }
            .upload-btn {
              border: 2rpx solid #e9e9e9;
              display: flex;
              justify-content: center;
              align-items: center;
              .appIcon {
                color: #bbc3cd;
                font-size: 34rpx;
              }
              // background: url("~@/static/images/upload.png") no-repeat center center / 76rpx;
            }
          }
          .operation {
            height: 120rpx;
            justify-content: space-between;
            align-items: center;
            display: flex;
            .btn {
              color: #444444;
              min-width: 140rpx;
              height: 60rpx;
              border-radius: 60rpx;
              border: 1rpx solid #d9d9d9;
              line-height: 60rpx;
              text-align: center;
              justify-content: center;
              align-items: center;
              display: flex;
              padding: 0 15rpx;
              .appIcon {
                margin-right: 8rpx;
                color: #bbc3cd;
              }
            }
            .normal.active {
              background: #5a80ed;
              border: 1rpx solid #5a80ed;
              color: #fff;
              .appIcon {
                color: #ffffff;
              }
            }
            .fault.active {
              background: #f0605d;
              border: 1rpx solid #f0605d;
              color: #fff;
              .appIcon {
                color: #ffffff;
              }
            }
            .shutdown.active {
              background: #6b798d;
              border: 1rpx solid #6b798d;
              color: #fff;
              .appIcon {
                color: #ffffff;
              }
            }
          }
        }
      }
    }
    .pointItemActive {
      box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
