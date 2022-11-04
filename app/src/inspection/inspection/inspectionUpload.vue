<template>
  <view class="inspection-upload">
    <apiot-navbar :title="$t('inspection.inspection-upload')">
      <block slot="right"> </block>
    </apiot-navbar>
    <view class="notdata" v-if="resultsData.length === 0">
      <image src="~@/static/img/common/nodata.svg" class="nodata-img"></image>
      <text class="nodata-text">{{ $t('common.noData') }}</text
      ><!--暂无数据-->
    </view>
    <view class="inspection-results">
      <view
        class="inspection-results-item"
        v-for="(item, index) in resultsData"
        :key="index"
      >
        <view class="title-box">
          <div class="title">
            <image class="img" src="../images/route.svg"></image
            >{{ item.routeName }}
          </div>
          <span
            v-if="deviceLayer.workDone"
            class="updateHours"
            @click="handleShowUpdateHours(item)"
          >
            {{ item.workingHours + $t('inspection.time-minutes') }}
            <i class="appIcon appIcon-xiugaigongshi"></i>
          </span>
        </view>
        <view class="result-detail">
          <view class="result-detail-item item1">
            <text class="result-label"
              >{{ $t('inspection.inspection-totalDevice') }}：</text
            ><!--中文:总设备数-->
            <text>{{ item.deviceCount }}</text>
          </view>
          <view class="result-detail-item item1">
            <text class="result-label"
              >{{ $t('inspection.inspection-totalPoints') }}：</text
            ><!--中文：总点数-->
            <text>{{ item.allCount }}</text>
          </view>
        </view>
        <view class="result-detail">
          <view
            class="result-detail-item item2"
            v-for="obj in resultLayer.columnArr"
            :key="obj.columnName"
          >
            <text class="result-label" :style="{ color: obj.taskColor }">
              {{ item[obj.columnName] }}</text
            ><!--中文：正常数-->
            <text>{{ obj.title }}</text>
          </view>
        </view>
        <view class="bottom-box">
          <text class="createdate">{{ item.createdate }}</text>
          <div class="more" @click="handleClickShowMore(item.id)">
            <span>{{ $t('inspection.page-particulars') }}</span>
            <i class="appIcon appIcon-a-shujuxuanzejinru arrow"></i>
          </div>
          <!--中文：详情-->
        </view>
      </view>
    </view>
    <!-- 底部按钮 -->
    <view class="formTemplate-btns foot" v-if="resultsData.length !== 0">
      <div class="btn-item" @click="handleBttomBtnClick()">
        <i class="appIcon appIcon-zhengchang"></i>
        {{ $t('inspection.inspection-upload') }}
      </div>
    </view>
    <!-- 提示弹窗 -->
    <apiot-tip-prompt
      v-if="showTipPrompt"
      :visible.sync="showTipPrompt"
      :promptData="promptData"
    >
    </apiot-tip-prompt>
    <!-- 修改工时弹窗 -->
    <apiot-prompt
      v-if="showUpdateHours"
      :visible.sync="showUpdateHours"
      @sure-click="handleUpdateHours"
      :title="$t('inspection.inspection-workTime')"
      :placeholder="$t('inspection.inspection-enterCode')"
    >
    </apiot-prompt>
  </view>
</template>

<script>
import {
  selectInspectionHistory,
  updateSql,
  selectPointsByInspectionDoId,
  selectInspectionPointByImg,
  updateUploadstatus,
  selectAllFile,
  selectInspectionConfig
} from '../js/DB.js';
import { batchUpload, uploadInspectionTask } from '@/api/inspection.js';

export default {
  components: {},
  async onShow() {
    await selectInspectionConfig((res) => {
      this.deviceLayer = JSON.parse(res[0].deviceLayer);
      this.taskLayer = JSON.parse(res[0].taskLayer);
      this.resultLayer = JSON.parse(res[0].resultLayer);
      console.log(this.resultLayer, 'this.resultLayer');
      const arr = this.taskLayer.columnArr.filter((item) => item.compType === 7);
      if (arr.length) {
        this.dictArr([arr[0].dictObj.dictKey]);
        this.dictKey = arr[0].dictObj.dictKey;
      }
      this.getData();
    });
  },
  computed: {
    dicList() {
      return this.$store.getters.getCurDict(this.dictKey) || [];
    }
  },
  data() {
    return {
      disabled: false,
      resultsData: [],
      upInspData: [],
      upFileData: [],
      inspectionPointId: [],
      inspectionId: [],
      isUploading: false,
      showTipPrompt: false,
      promptData: {
        title: '',
        confirmText: '',
        tip: ''
      },
      inspectionData: {},
      showUpdateHours: false,
      taskLayer: {},
      dictKey: '',
      deviceLayer: {},
      resultLayer: {}
    };
  },
  methods: {
    async dictArr(dict) {
      await this.$store.dispatch('getCurrentDict', dict.join());
    },
    getData() {
      const that = this;
      selectInspectionHistory(this.resultLayer.columnArr, (res) => {
        that.resultsData = res.map((item) => {
          if (!item.workingHours) item.workingHours = '';
          return item;
        });
      });
    },
    // 上传点检结果
    selectInspectionData() {
      const _this = this;
      // 查询所有已点检的任务
      selectPointsByInspectionDoId(async (pointRes) => {
        try {
          this.upInspData = pointRes;
          const updataData = pointRes.map((item) => {
            const obj = {
              ...item,
              uploadTime: this.$apiot.dateFormat(false, 'yyyy-MM-dd hh:mm:ss')
            };
            return obj;
          });
          const uploadResult = _this.resultsData.map((item) => {
            const arr = updataData.filter((obj) => obj.inspectionRouteId === item.id);
            return {
              routeCode: item.routeCode,
              inspectionRouteId: item.inspectionRouteId,
              abnormalTaskAmount: item.abNormalCount,
              deviceAmount: item.deviceCount,
              normalTaskAmount: item.normalCount,
              taskAmount: item.allCount,
              taskResultList: arr
            };
          });
          // 上传点检结果
          await uploadInspectionTask({ routeResultList: uploadResult });
          const taskId = pointRes.map((item) => item.inspectionTaskId);
          // 上传之后更新本地数据库
          updateUploadstatus('inspectionpointdo', taskId, _this.getData);
          uni.showToast({
            title: _this.$t('inspection.inspection-uploadSuccess')
          }); // 中文：'上传成功'
        } catch (e) {
          this.promptData = {
            title: this.$t('common.tip'),
            confirmText: this.$t('common.sure'),
            tip: this.$t('inspection.uploadFailed')
          };
          this.showTipPrompt = true;
          console.error(e);
          uni.hideLoading();
        }
      });
    },
    selectFiles() {
      const that = this;
      that.upFileData = [];
      // 查询点检上传图片
      selectAllFile((res) => {
        uni.showLoading({
          title: `${that.$t('inspection.inspection-upPoint')}...`,
          mask: true
        });
        if (!res.length) {
          that.selectInspectionData();
          return;
        }
        for (let i = 0; i < res.length; i += 1) {
          batchUpload(
            res[i].filepath,
            { menuId: 1 },
            (data) => {
              selectInspectionPointByImg(res[i].inspectionTaskId, (task) => {
                const imgId = task[0].imageIds ? task[0].imageIds.split(',') : [];
                imgId.push(JSON.parse(data).data[0].id);
                // 图片上传成功之后跟任务绑定
                // eslint-disable-next-line eqeqeq
                if (i == res.length - 1) {
                  // 所有图片上传完成 之后上传点检结果
                  updateSql(
                    'inspectionpointdo',
                    { imageIds: imgId.join(',') },
                    { inspectionTaskId: res[i].inspectionTaskId },
                    that.selectInspectionData
                  );
                  // that.selectInspectionData();
                } else {
                  updateSql(
                    'inspectionpointdo',
                    { imageIds: imgId.join(',') },
                    { inspectionTaskId: res[i].inspectionTaskId }
                  );
                }
              });
            },
            () => {
              uni.hideLoading();
            }
          );
        }
      });
    },
    handleBttomBtnClick() {
      this.selectFiles();
    },
    handleClickShowMore(inspectionId) {
      console.log(inspectionId);
      uni.navigateTo({
        url: `inspectionPoint?inspectionRouteId=${inspectionId}&type=result`
      });
    },
    handleShowUpdateHours(inspectionData) {
      this.inspectionData = inspectionData;
      this.showUpdateHours = true;
    },
    // 修改点检时长
    handleUpdateHours(value) {
      if (
        /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(
          value
        )
      ) {
        updateSql(
          'inspectiondo',
          { workingHours: parseFloat(value) },
          { id: this.inspectionData.id },
          () => {
            this.inspectionData.workingHours = value;
            uni.showToast({ title: this.$t('common.successfullyModified') }); // 中文:'修改成功'
          }
        );
      } else {
        this.promptData = {
          title: this.$t('common.tip'),
          confirmText: this.$t('common.sure'),
          tip: this.$t('inspection.check-nan')
        };
        this.showTipPrompt = true;
      }
      this.showUpdateHours = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.inspection-upload {
  width: 100%;
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
  .inspection-results {
    padding: 20rpx 30rpx 0;
    .inspection-results-item {
      background: #fff;
      margin-bottom: 20rpx;
      border-radius: 12rpx;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.08);
      font-size: 26rpx;
      .title-box {
        height: 88rpx;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 16rpx;
        position: relative;
        .title {
          width: calc(100% - 180rpx);
          height: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          line-height: 88rpx;
          display: inline-block;
          font-size: 30rpx;
          color: #333333;
          @include fontBlob(500);
          .img {
            width: 48rpx;
            height: 48rpx;
            margin: 20rpx 14rpx 0;
            display: inline-block;
            float: left;
          }
        }
        .updateHours {
          max-width: 160rpx;
          height: 50rpx;
          background: #bbc3cd;
          border-radius: 100rpx 0px 0px 100rpx;
          line-height: 50rpx;
          text-align: center;
          color: #ffffff;
          padding: 0 30rpx;
          position: absolute;
          right: 0;
          top: 19rpx;
          .appIcon {
            margin-left: 10rpx;
          }
        }
      }
      .result-detail {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 20rpx 30rpx;
        .result-detail-item {
          width: 310rpx;
          line-height: 46rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 30rpx;
          box-sizing: border-box;
          .result-label {
            color: #9b9b9b;
          }
        }
        .item1 {
          background: #f6f6f8;
          border-radius: 8rpx;
          color: #444444;
          font-size: 24rpx;
          .result-label {
            color: #808080;
          }
        }
        .item2 {
          width: auto;
          flex: 1;
          height: 115rpx;
          flex-direction: column;
          line-height: 36rpx;
          margin-top: 10rpx;
          padding: 10rpx 0;
          box-sizing: border-box;
          color: #808080;
          .result-label {
            font-size: 48rpx;
            @include fontBlob(500);
            color: #333333;
            line-height: 56rpx;
          }
          .red {
            color: #f23558;
          }
        }
      }
      .bottom-box {
        justify-content: space-between;
        height: 80rpx;
        display: flex;
        align-items: center;
        padding: 0 30rpx;
        font-size: 28rpx;
        box-shadow: inset 0px 1px 0px 0px #e9e9e9;
        // border-top: 1px solid #E9E9E9;
        .createdate {
          color: #9b9b9b;
        }
        .more {
          color: #4689f5;
          font-size: 24rpx;
          height: 60rpx;
          line-height: 60rpx;
          display: flex;
          align-items: center;
          .arrow {
            font-size: 28rpx;
          }
        }
      }
    }
  }
  .formTemplate-btns {
    width: 100%;
    height: 88rpx;
    position: absolute;
    bottom: 30rpx;
    left: 0rpx;
    box-sizing: border-box;
    padding: 0 20rpx;
    .btn-item {
      width: 100%;
      height: 88rpx;
      background: #4689f5;
      box-shadow: 0px 0px 20rpx 0px rgba(0, 0, 0, 0.1);
      border-radius: 44rpx;
      font-size: 28rpx;
      color: #ffffff;
      line-height: 36rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      .appIcon {
        color: #ffffff;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
