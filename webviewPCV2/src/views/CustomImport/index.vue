<!--
 * @Descripttion: 泰州石化--定制导入
 * @Author: ytx
 * @Date: 2022-06-08 16:26:17
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-08 16:26:17
-->
<template>
  <div class="mainWrap">
    <!-- 上传区域 -->
    <div class="mainWrap__file">
      <file-manage
        class="mainWrap__file--upload"
        :num="1"
        dec="上传文件"
        buttonName="请选择文件"
        placeholder="请从本地选择你要导入的文件"
        :fileList.sync="fileList"
        @upload-file="getFiles"
      ></file-manage>
      <el-button
        type="primary"
        class="mainWrap__file--button"
        :disabled="disabled"
        :loading="buttonLoading"
        @click="handleImport"
      >
        <i class="iconfont icon-daoru"></i>
        立即导入
      </el-button>
    </div>
    <!-- 备注 -->
    <div class="mainWrap__doc mainWrap__defaultDoc">
      <div v-for="(item, i) in exportTips" :key="i">
        {{ item.content }}
      </div>
    </div>
    <!-- 步骤条 -->
    <el-steps
      :active="activeSteps"
      finish-status="success"
      :process-status="currentState"
      direction="vertical"
      class="mainWrap__timeline"
    >
      <el-step title="检测">
        <div slot="description" class="m-b-20">
          <!-- 检测进度 -->
          <detector-box
            :diffTime="diffTime"
            :checkInfo="checkInfo"
            :progress="progress"
          ></detector-box>
        </div>
      </el-step>
      <el-step title="导入">
        <div slot="description">
          <!-- 导入进度 -->
          <import-schedule
            :uploadTime="uploadTime"
            :importProgress="importProgress"
            :uploadInfo="uploadInfo"
          >
          </import-schedule>
        </div>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
import { exportTips } from '@/config';
import { createUnique, getQueryString } from '@/utils/utils';

import {
  getCheckDeviceSynProgress,
  getImportDeviceSynProgress,
  importDevice
} from '@/api/importTemplate';
import DetectorBox from './components/DetectorBox';
import FileManage from './components/FileManage';
import ImportSchedule from './components/ImportSchedule';

export default {
  data() {
    return {
      currentObj: {}, // 当前选中数据
      disabled: true, // 是否可以导入
      buttonLoading: false, // 按钮loading
      fileList: [],
      uniqueId: '',
      timer: '', // 定时器
      counter: '', // ⏲
      uploadCounter: '', // 上传计数器
      diffTime: '', // 用时
      uploadTime: '',
      checkInfo: {}, // 检测信息
      uploadInfo: {}, // 导入信息
      progress: 0, // 进度
      importProgress: 0, // 导入进度
      activeSteps: -1,
      currentState: 'wait'
    };
  },
  components: {
    FileManage,
    DetectorBox,
    ImportSchedule
  },
  computed: {
    exportTips() {
      return exportTips;
    },
    uploadFileRaw() {
      return this.fileList[0]?.raw;
    }
  },
  methods: {
    // 点击立即导入
    async handleImport() {
      // 步骤条重置、步骤条状态、按钮loading
      this.activeSteps = 0;
      this.currentState = 'process';
      this.buttonLoading = true;

      this.resetValue();
      this.progress = 0.01;

      this.counterFun();
      this.uniqueId = createUnique();
      try {
        // 开始导入
        this.startImport();
        setTimeout(() => {
          this.doPreChek();
        }, 1000);
      } catch (e) {
        this.resetFun();
      }
    },
    // 导入数据
    async startImport() {
      // 如果有 检测定时去，先清除
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const formData = new FormData();
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.uploadFileRaw);

      // 配置需要传递 userId
      const userId = getQueryString('userId');
      console.log(userId);
      formData.append('userId', userId);

      await importDevice(formData);
    },
    // 检测用的时间
    counterFun() {
      let Minute = 0;
      let second = 0;
      this.counter = setInterval(() => {
        second += 1;
        if (second >= 60) {
          second = 0;
          Minute += 1;
        }
        this.diffTime = `${String(Minute).length === 1 ? `0${Minute}` : Minute}:${
          String(second).length === 1 ? `0${second}` : second
        }`;
      }, 1000);
    },
    // 上传用的时间
    uploadCounterFun() {
      let Minute = 0;
      let second = 0;
      this.uploadCounter = setInterval(() => {
        second += 1;
        if (second >= 60) {
          second = 0;
          Minute += 1;
        }
        this.uploadTime = `${String(Minute).length === 1 ? `0${Minute}` : Minute}:${
          String(second).length === 1 ? `0${second}` : second
        }`;
      }, 1000);
    },
    resetFun() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      if (this.counter) {
        clearTimeout(this.counter);
      }
      if (this.uploadCounter) {
        clearTimeout(this.uploadCounter);
      }
      this.buttonLoading = false;
      this.progress = 100;
      this.currentState = 'error';
    },
    // 校验进度监控
    doPreChek() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          const res = await getCheckDeviceSynProgress({ uuid: this.uniqueId });
          const { Row, Sum, isCheckFinish, errorRow = 0 } = res;
          this.checkInfo = res;
          if (Row && Sum && Sum !== 0) {
            const num = Row / Sum;
            const proportion = num * 100;
            this.progress = proportion.toFixed(2);
          }
          if (isCheckFinish || Row >= Sum) {
            // 预校验结束
            if (!errorRow && isCheckFinish) {
              // 如果预校验结束并且错误数据为0，则开启导入
              // await this.startImport();
              this.progress = 100;
              this.activeSteps = 1;
              if (this.counter) {
                clearTimeout(this.counter);
              }
              // 开始计时
              this.uploadCounterFun();
              this.importProgress = 0.01;
              setTimeout(() => {
                this.doProcessImport();
              }, 1000);
            } else {
              this.resetFun();
              this.$message.warning('请先检查数据');
            }
          } else {
            await this.doPreChek();
          }
        } catch (e) {
          this.resetFun();
        }
      }, 1000);
    },
    async doProcessImport() {
      // 导入数据
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          const res = await getImportDeviceSynProgress({ uuid: this.uniqueId });
          const { Row, Sum, isImportFinish, status } = res;
          console.log(res);
          this.uploadInfo = res;
          if (Row && Sum && Sum !== 0) {
            const num = Row / Sum;
            const proportion = num * 100;
            this.importProgress = +proportion.toFixed(2);
          }
          if (isImportFinish || Row >= Sum || status === 201) {
            this.importProgress = 100;
            // 导入结束
            this.$message.success('导入成功！');
            this.activeSteps = 2;
            if (this.timer) {
              clearTimeout(this.timer);
            }
            if (this.uploadCounter) {
              clearTimeout(this.uploadCounter);
            }
            this.buttonLoading = false;
            this.progress = 100;
            // this.currentState = 'success';
          } else {
            await this.doProcessImport();
          }
        } catch (e) {
          this.resetFun();
          this.importProgress = 100;
        }
      }, 1000);
    },
    // 上传成功
    getFiles() {
      console.log(this.fileList, this.uploadFileRaw);
      this.disabled = false; // 按钮
      this.resetValue();
      this.activeSteps = -1; // 步骤状态
      this.currentState = 'wait'; // 状态
    },
    // 重置
    resetValue() {
      this.progress = 0; // 检测进度
      this.importProgress = 0; // 导入进度
      this.uploadInfo = {}; // 导入信息
      this.checkInfo = {};
      this.diffTime = '';
      this.uploadTime = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.mainWrap {
  margin: 20px;
  display: flex;
  flex-direction: column;
  &__file {
    display: flex;
    &--download {
      min-width: 372px;
      width: 30%;
      margin-right: 10px;
    }
    &--upload {
      flex: 1;
      margin-right: 10px;
    }
    &--button {
      width: 130px;
      height: 36px;
    }
  }
  &__doc {
    padding: 14px 26px;
    margin-top: 10px;
    background: #fafafa;
    border-radius: 4px;
    font-size: 14px;
    color: #808080;
    line-height: 20px;
    max-height: 150px;
    min-height: 100px;
    overflow: auto;
  }
  &__defaultDoc {
    div {
      line-height: 2;
    }
  }
  &__timeline {
    margin-top: 20px;
    line-height: 20px;
  }
  ::v-deep {
    .pagination {
      border-top: 0;
    }
    .el-step__description {
      padding-right: 0;
    }
    .el-progress-bar__inner {
      background-color: transparent !important;
      background-image: linear-gradient(to right, #8c99fa, #68c5f7);
    }
    // .el-progress-bar__innerText {
    //   // color: rgb(63, 63, 63);
    // }
  }
}
</style>
