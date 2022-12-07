<template>
  <view class="inspection-route">
    <apiot-navbar :title="title || $t('inspection.inspectionTallyRoute')">
    </apiot-navbar>
    <view class="route-search hasStatusTop">
      <span class="search-btn">
        <i
          class="appIcon appIcon-sousuo"
          :class="{ searchFocus: isSearchFocus }"
        ></i>
      </span>
      <input
        type="text"
        v-model="keywords"
        class="search"
        :placeholder="$t('placeholder.pleaseEnterkeySearch')"
        placeholder-class="placeholder"
        confirm-type="search"
        @focus="searchFocus"
        @blur="searchBlur"
        @input="handleSearchInput"
        @confirm="handleSearch"
      /><!--中文:请输入关键字搜索-->
    </view>
    <view class="notdata" v-if="routeData.length === 0">
      <image src="~@/static/img/common/nodata.svg" class="nodata-img"></image>
      <text class="nodata-text">{{ $t('common.noData') }}</text
      ><!--暂无数据-->
    </view>
    <view
      class="inspection-route-box uni-list"
      v-else
      :class="{ hasBtn: isSelectRoute }"
    >
      <checkbox-group @change="checkboxChange">
        <label
          class="uni-list-cell inspection"
          :class="[{ animateListClick: focusIndex === index }]"
          v-for="(item, index) in routeData"
          :key="index"
          @click="handleJumpClick(item.id, item.routeName, item, index)"
        >
          <view class="inspection-item">
            <span class="inspection-name">
              <image class="img" src="../images/route.svg"></image
              ><span>{{ item.routeName }}</span>
            </span>
            <div class="checkbox-box">
              <i
                v-show="item.checked && isSelectRoute"
                class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"
              ></i>
              <checkbox
                :value="item.id"
                :checked="item.checked"
                class="checkbox-style"
                :class="[{ showSelect: !item.checked }]"
                v-if="isSelectRoute"
              />
            </div>
          </view>
          <view class="inspection-item">
            <text class="code">{{ item.routeCode }}</text>
          </view>
          <view class="inspection-item">
            <text class="num allnum">
              {{ $t('inspection.inspection-totalDevice') }}：{{
                item.deviceCount
              }}</text
            >
            <text
              class="num"
              :class="[{ ongoing: item.ongoing }, { finish: item.finish }]"
              >{{ $t('inspection.completed') }}：{{
                item.finishDeviceCount
              }}</text
            >
          </view>
          <!-- <view class="inspection-item">
            <text class="date">{{ item.minPlanStartDate }}</text>
          </view> -->
        </label>
      </checkbox-group>
    </view>
    <view class="formTemplate-btns foot" v-show="isSelectRoute">
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
      <picker
        :disabled="pickerDisabled"
        @click="handleNotSelect"
        mode="date"
        class="btn-item"
        @change="showSkipMemoFun"
      >
        <span class="confirm">{{ $t('common.sure') }}</span>
      </picker>
    </view>
    <div
      class="bottom-foot no-data"
      v-show="routeData.length === 0 && !isSelectRoute"
    >
      <div class="foot-button dark" @click="handleBttomBtnClick">
        <i class="appIcon appIcon-xiazai"></i>
        {{ $t('inspection.downloadRoute') }}
      </div>
    </div>
    <div class="bottom-foot" v-show="routeData.length !== 0 && !isSelectRoute">
      <div class="foot-button" @click="handleBttomBtnClick">
        <i class="appIcon appIcon-xiazai"></i>
        {{ $t('inspection.downloadRoute') }}
      </div>
      <span class="line" v-if="routeLayer.routePass"></span>
      <div
        v-if="routeLayer.routePass"
        class="foot-button"
        @click="inspctionJumpDate"
      >
        <i class="appIcon appIcon-tiaoguo"></i>
        {{ $t('inspection.skipRoute') }}
      </div>
      <span class="line"></span>
      <div class="foot-button dark" @click="inspctionUpload">
        <i class="appIcon appIcon-shangchuan"></i>
        {{ $t('inspection.uploadResults') }}
      </div>
    </div>
    <div class="download-wrap" v-show="isDownloading">
      <div class="download-layout"></div>
      <div class="download-content">
        <div class="tips">
          <p class="title">{{ $t('inspection.download') }}</p>
          <p class="tip">
            <i class="appIcon appIcon-shangchuan"></i>
            {{ $t('inspection.inspection-isDownload') }}
          </p>
        </div>
        <view class="progress-box-parent">
          <view class="progress-bg">
            <view class="progress-box">
              <text class="progress-title">{{
                $t('inspection.inspectionRouteTask')
              }}</text
              ><!--巡检路线任务-->
              <progress
                class="progress"
                :percent="inspectionRoute"
                show-info="true"
                activeColor="#F7B500"
                backgroundColor="#D8D8D8"
                stroke-width="10"
              />
            </view>
            <view class="progress-box">
              <text class="progress-title">{{
                $t('inspection.inspectionPointTast')
              }}</text
              ><!--巡检点任务-->
              <progress
                class="progress"
                :percent="inspectionPoint"
                show-info="true"
                activeColor="#F7B500"
                backgroundColor="#D8D8D8"
                stroke-width="10"
              />
            </view>
          </view>
        </view>
      </div>
    </div>
    <!-- 下载完成 -->
    <view class="download-complete" v-if="isDownloadComplete">
      <div class="download-complete-layout"></div>
      <div class="download-complete-content">
        <image
          src="../images/complete.svg"
          class="download-complete-img"
        ></image>
        <p class="tip">{{ $t('inspection.inspection-download-complete') }}</p>
        <div class="download-complete-button" @click="reloadRouteData">
          {{ $t('inspection.know') }}
        </div>
      </div>
    </view>
    <!-- 输入点检跳过备注弹窗 -->
    <apiot-prompt
      v-if="showSkipMemo"
      :visible.sync="showSkipMemo"
      @sure-click="confirmSelect"
      :title="$t('inspection.page-note')"
      :placeholder="$t('inspection.inspection-jump-memo')"
    >
    </apiot-prompt>
    <!-- 下载确认弹窗 -->
    <apiot-modal ref="apiotModal"></apiot-modal>
    <!-- 下载确认弹窗 -->
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
import { downloadInspectionTasks, inspectionSkip } from '@/api/inspection.js';
import {
  readyDB,
  insertIntoInspectionDo,
  // insertIntoInspectionDeviceDo,
  insertInspectionpointDo,
  selectInspectionDo,
  dropInspectionTables,
  deleteRoute,
  deletePointByInspec,
  insertIntoInspectionConfigDo,
  selectInspectionConfig
  // readyConfigDB,
  // dropInspectionConfigTables,
} from '../js/DB.js';

export default {
  components: {
    ApiotTipPrompt
  },
  data() {
    return {
      keywords: '',
      isSelectRoute: false,
      routeData: [],
      selectRouteId: [],
      endDate: '',
      pickerDisabled: false,
      params: {},
      activeColor: '#F7B500',
      inspectionRoute: 0,
      inspectionPoint: 0,
      isDownload: true,
      isDownloading: false,
      routename: '',
      startdate: null,
      enddate: null,
      isShowFilter: false,
      isDownloadComplete: false,
      isSelectAll: false,
      showSkipMemo: false,
      selectDate: null,
      showDownloadConfirm: false,
      isSearchFocus: false,
      showTipPrompt: false,
      promptData: {
        title: '',
        confirmText: '',
        tip: ''
      },
      focusIndex: null,
      sysMenuId: '',
      routeLayer: {},
      title: '点检路线'
    };
  },
  computed: {},
  methods: {
    handleSearch() {
      this.getData();
    },
    // 搜索关键字为空时自定刷新列表
    handleSearchInput(event) {
      if (!event.detail.value) {
        this.getData();
      }
    },
    searchFocus() {
      this.isSearchFocus = true;
    },
    searchBlur() {
      this.isSearchFocus = false;
    },
    // 点检跳过没有选择路线时
    handleNotSelect() {
      if (this.pickerDisabled) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-selectRouteSkip')
        };
        this.showTipPrompt = true;
      }
    },
    handleJumpClick(id, inspectionDoName, item, index) {
      this.focusIndex = index;
      setTimeout(() => {
        if (this.isSelectRoute) {
          this.$set(item, 'checked', !item.checked);
        } else {
          const url = `/inspection/inspection/inspectionDevice?id=${id}&inspectionDoName=${inspectionDoName}`;
          uni.navigateTo({ url });
        }
        this.focusIndex = null;
      }, 300);
    },
    cancelSelect() {
      this.isSelectRoute = false;
    },
    // 点检跳过备注
    showSkipMemoFun(event) {
      this.showSkipMemo = true;
      this.selectDate = `${event.detail.value} 00:00:00`;
    },
    // 点检跳过
    async confirmSelect(value) {
      // 没有跳过备注备注时不可提交
      if (!value) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.inspection-memo')
        };
        this.showTipPrompt = true;
        return;
      }
      const selectRouteId = this.selectRouteId.join(',');
      try {
        const params = {
          routeIds: this.selectRouteId,
          targetDate: this.selectDate,
          skipMemo: value
        };
        uni.showLoading();
        await inspectionSkip(params);
        this.showSkipMemo = false;
        uni.hideLoading();
        // 跳过成功后删除已跳过的路线
        this.removeInspec(
          selectRouteId,
          (sucess) => {
            this.promptData = {
              title: this.$t('common.tip'),
              confirmText: this.$t('common.sure'),
              tip: '跳过成功'
            };
            this.showTipPrompt = true;
            console.log(sucess);
          },
          (err) => {
            this.promptData = {
              title: this.$t('common.tip'),
              confirmText: this.$t('common.sure'),
              tip: this.$t('inspection.inspection-deletionFailed')
            };
            this.showTipPrompt = true;
            console.log(err);
          }
        );
        this.getData();
        this.isSelectRoute = false;
        this.selectRouteId = [];
      } catch (e) {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: '跳过失败'
        };
        this.showTipPrompt = true;
        console.error(e);
        uni.hideLoading();
      }
    },
    // 根据routerId删除点检路线
    removeInspec(routerId, cb, cbe) {
      const deleteRoutePromise = new Promise((resolve, reject) =>
        deleteRoute(routerId, resolve, reject));
      const deletePointByInspecPromise = new Promise((resolve, reject) =>
        deletePointByInspec(routerId, resolve, reject));
      Promise.all([deleteRoutePromise, deletePointByInspecPromise]).then(cb).catch(cbe);
    },
    checkboxChange(e) {
      this.selectRouteId = e.detail.value;
      if (this.selectRouteId.length > 0) {
        this.pickerDisabled = false;
      } else {
        this.pickerDisabled = true;
      }
    },
    // 全选跳过路线
    selectAll(e) {
      const data = [];
      if (e.detail.value.length) {
        const selectRouteId = this.routeData.map((item) => {
          const obj = item;
          obj.checked = true;
          data.push(obj);
          return item.id;
        });
        this.routeData = data;
        this.selectRouteId = selectRouteId;
        this.isSelectAll = true;
      } else {
        this.routeData.map((item) => {
          const obj = item;
          obj.checked = false;
          data.push(obj);
          return null;
        });
        this.routeData = data;
        this.selectRouteId = [];
        this.isSelectAll = false;
      }
      if (this.selectRouteId.length > 0) {
        this.pickerDisabled = false;
      } else {
        this.pickerDisabled = true;
      }
    },
    // 跳过路线
    inspctionJumpDate() {
      this.endDate = this.$apiot.dateFormat(false, 'yyyy-MM-dd');
      this.isSelectRoute = !this.isSelectRoute;
      if (this.isSelectRoute && this.selectRouteId.length === 0) {
        this.pickerDisabled = true;
      } else {
        this.pickerDisabled = false;
      }
    },
    // 上传点检
    inspctionUpload() {
      uni.navigateTo({
        url: 'inspectionUpload'
      });
    },
    getData(params = {}) {
      if (this.keywords) {
        params = { keywords: this.keywords };
      }
      selectInspectionDo(params, (res) => {
        this.routeData = res.map((item) => {
          console.log(item);
          item.ongoing = item.finishDeviceCount > 0;
          item.finish = item.finishDeviceCount === item.deviceCount;
          item.checked = false;
          return item;
        });
      });
    },
    // 下载点检数据确认
    showConfirmModal() {
      this.showDownloadConfirm = true;
    },
    async handleBttomBtnClick() {
      // 初始化数据库
      try {
        await this.$refs.apiotModal.showAsyncModal({
          content: this.$t('inspection.inspection-isDownload')
        });
        dropInspectionTables(
          () => {
            readyDB(
              () => {
                // 初始化数据库完成后开始下载点检数据
                this.doDownloadInspectionTasks();
                insertIntoInspectionConfigDo(
                  this.$store.state.menu.systemMenusConfig[this.sysMenuId],
                  () => {
                    selectInspectionConfig((res) => {
                      this.routeLayer = JSON.parse(res[0].routeLayer);
                    });
                  }
                );
                this.showDownloadConfirm = false;
              },
              () => {
                this.showDownloadConfirm = false;
              }
            );
          },
          () => {
            this.showDownloadConfirm = false;
          }
        );
      } catch (error) {
        console.error(error);
      }
    },
    // 下载点检数据
    async doDownloadInspectionTasks() {
      try {
        uni.showLoading({
          title: this.$t('inspection.pageTip-downloading') // 中文；'下载中...'
        });
        const result = await downloadInspectionTasks();
        const routes = [];
        const points = [];
        result.map((item) => {
          routes.push({
            ...item,
            ongoing: false,
            finish: false,
            finishMoCount: 0,
            deviceNum: item.deviceList.length
          });
          if (item.deviceList.length) {
            item.deviceList.map((dev) => {
              if (dev.taskList.length) {
                dev.taskList.map((point) => {
                  points.push({
                    ...point,
                    uploadstatus: 0,
                    operatingstatus: 0
                  });
                  return null;
                });
              }
              return null;
            });
          }
          return item;
        });
        // 往路线表插入点检路线数据
        insertIntoInspectionDo(routes);
        // 往任务表插入点检任务数据
        insertInspectionpointDo(points);
        uni.hideLoading();
        this.isDownloadComplete = !this.isDownloadComplete;
      } catch (e) {
        uni.hideLoading();
        console.error(e);
      }
    },
    // 下载完成后刷新列表
    reloadRouteData() {
      this.isDownloadComplete = !this.isDownloadComplete;
      this.getData();
    }
  },
  onShow() {
    this.getData();
    this.params = {};
    selectInspectionConfig((res) => {
      console.log(JSON.parse(res));
      this.routeLayer = JSON.parse(res[0].routeLayer);
    });
  },
  onLoad(option) {
    console.log(option);
    this.title = option.title;
    this.sysMenuId = option.id;
  }
};
</script>
<style lang="scss" scoped>
.hasStatusTop {
  margin-top: var(--status-bar-height);
}

.inspection-route {
  width: 100%;
  min-height: 100%;
  padding-bottom: 120rpx;
  position: relative;
  .route-search {
    position: absolute;
    top: 88rpx;
    width: 100%;
    display: flex;
    height: 88rpx;
    background: #fff;
    box-shadow: 0px 0px 1px 0px rgba(245, 245, 245, 1);
    align-items: center;
    padding-left: 30rpx;
    color: #9f9f9f;
    z-index: 9;
    box-sizing: border-box;
    box-shadow: inset 0px -1px 0px 0px #e9e9e9;
    .search {
      flex: 1 0 0;
      font-size: 28rpx;
      color: #333333;
    }
    .placeholder {
      color: #aaaaaa;
    }
    .search-btn {
      width: 58rpx;
      color: #bbc3cd;
      .appIcon {
        font-size: 38rpx;
        transition: all 0.3s;
      }
      .searchFocus {
        color: #4689f5;
      }
    }
  }
  .checkbox-all {
    margin-right: 2px;
    .uni-checkbox-input {
      margin: 0;
    }
  }
  // .btn-item{
  //   width: 50%;
  //   display: inline-block;
  //   vertical-align: top;
  //   .btn{
  //     border-radius: 0px;
  //     &:after{
  //       border-radius: 0px;
  //     }
  //   }
  // }
  .mainColor,
  .mainColor-blue,
  .mainColor-orange,
  .mainColor-violet,
  .mainColor-navyBlue {
    float: right;
    margin-left: 40rpx;
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
  .inspection-route-box {
    padding: 20rpx 30rpx;
    padding-top: 108rpx;
    &.hasBtn {
      padding-bottom: 128rpx;
    }
    .inspection {
      width: 100%;
      padding: 30rpx;
      margin-bottom: 20rpx;
      display: block;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0px 2rpx 4rpx 0px rgba(0, 0, 0, 0.08);
      border-radius: 12rpx;
      .inspection-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .inspection-name {
          font-size: 34rpx;
          color: #333333;
          line-height: 100%;
          @include fontBlob(500);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          .img {
            width: 48rpx;
            height: 48rpx;
            margin-right: 14rpx;
          }
        }
        .code {
          font-size: 28rpx;
          color: #333333;
          line-height: 62rpx;
        }
        .num {
          height: 48rpx;
          background: #bbc3cd;
          border-radius: 24rpx;
          padding: 0 20rpx;
          font-size: 24rpx;
          color: #ffffff;
          line-height: 48rpx;
        }
        .allnum {
          background: #f1f7ff;
          color: #4689f5;
        }
        .date {
          width: 100%;
          height: 46rpx;
          background: #f6f6f8;
          border-radius: 8rpx;
          font-size: 24rpx;
          color: #666666;
          line-height: 46rpx;
          padding: 0 20rpx;
          margin-top: 16rpx;
        }
        .ongoing {
          background: #f7b500;
        }
        .finish {
          background: #4689f5;
        }
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
      .confirm {
        width: 100%;
        height: 72rpx;
        border-radius: 12rpx;
        font-size: 30rpx;
        line-height: 72rpx;
        background: #4689f5;
        color: #ffffff;
        display: inline-block;
        text-align: center;
      }
    }
    .red {
      background: red;
    }
  }
  .bottom-foot {
    position: fixed;
    width: 710rpx;
    height: 88rpx;
    left: 20rpx;
    bottom: 30rpx;
    background: #ffffff;
    box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
    border-radius: 44rpx;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .foot-button {
      flex: 1;
      line-height: 62rpx;
      text-align: center;
      color: #333333;
      font-size: 28rpx;
      margin: 0 13rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .appIcon {
        font-size: 38rpx;
        margin-right: 10rpx;
        color: #4689f5;
      }
    }
    .dark {
      background: #4689f5;
      border-radius: 31rpx;
      color: #ffffff;
      .appIcon {
        color: #ffffff;
      }
    }
    .line {
      width: 1rpx;
      height: 24rpx;
      background: #d9d9d9;
    }
  }
  .no-data {
    .foot-button {
      width: 100%;
      height: 100%;
      line-height: 88rpx;
      margin: 0;
      border-radius: 44rpx;
    }
  }
  .download-wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
    left: 0;
    top: 0;
    .download-layout {
      width: 100%;
      height: 100%;
      position: absolute;
      background: rgba(0, 0, 0, 0.3);
      left: 0;
      top: 0;
    }
    .download-content {
      width: 100%;
      height: 600rpx;
      background: #ffffff;
      border-radius: 30px 30px 0px 0px;
      position: absolute;
      left: 0;
      bottom: 0;
      padding: 30rpx;
      box-sizing: border-box;
      .tips {
        .title {
          line-height: 80rpx;
          color: #333333;
          font-size: 32rpx;
        }
        .tip {
          width: 100%;
          height: 88rpx;
          background: #f6f6f8;
          border-radius: 18rpx;
          font-size: 24rpx;
          line-height: 34rpx;
          color: #808080;
          padding: 27rpx 24rpx;
          box-sizing: border-box;
        }
      }
      .progress-box-parent {
        padding-top: 20rpx;
        margin-bottom: 20rpx;
        .progress-bg {
          border-radius: 8rpx;
          background: #fff;
          padding: 13rpx 0rpx 36rpx;
        }
        ::v-deep {
          .uni-progress-bar {
            border-radius: 5rpx;
          }
        }
      }
      .progress-title {
        font-size: 26rpx;
        // color:$default-lable;
        margin: 20rpx 0;
        display: block;
      }
    }
  }
  .routeFilter {
    width: 100%;
    height: 750rpx;
    position: fixed;
    left: 0;
    bottom: 0;
    background: #ffffff;
    border-radius: 30rpx 30rpx 0px 0px;
    padding-top: 30rpx;
    .filter-title {
      font-size: 32rpx;
      color: #333333;
      line-height: 80rpx;
      padding: 0 30rpx;
      @include fontBlob(500);
    }
    .item {
      background: #fff;
      padding: 0 30rpx;
      display: block;
      box-sizing: border-box;
      margin-bottom: 10rpx;
      .text {
        line-height: 68rpx;
        font-size: 32rpx;
        color: #555555;
        display: block;
      }
      .content {
        height: 88rpx;
        box-shadow: inset 0px -2rpx 0px 0px #e9e9e9;
        font-size: 32rpx;
        .routename {
          height: 100%;
          color: #aaaaaa;
          .uni-input-wrapper {
            .input-placeholder {
              color: #aaaaaa;
            }
          }
        }
        ::v-deep {
          .datePicker__placeholder {
            font-size: 32rpx;
            color: #aaaaaa;
          }
        }
      }
    }
    .filter-buttons {
      width: 100%;
      height: 110rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 70rpx;
      padding: 0 30rpx;
      box-sizing: border-box;
      .btn-item {
        width: 330rpx;
        height: 72rpx;
        background: #f1f3f6;
        border-radius: 12rpx;
        color: #333333;
        font-size: 30rpx;
        line-height: 72rpx;
        text-align: center;
      }
      .filter-confirm {
        width: 330rpx;
        height: 72rpx;
        border-radius: 12rpx;
        font-size: 30rpx;
        line-height: 72rpx;
        background: #4689f5;
        color: #ffffff;
        display: inline-block;
        text-align: center;
      }
    }
  }
  .download-complete {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 10;
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
        height: 166rpx;
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
}
</style>
