<!--
 * @Descripttion: 通用导入主内容
 * @Author: ytx
 * @Date: 2022-06-08 16:26:17
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-08 16:26:17
-->
<template>
  <div class="mainWrap">
    <!-- 上传 -->
    <div class="mainWrap__file">
      <file-manage
        class="mainWrap__file--download"
        :num="1"
        :dec="`下载${currentObj.name || ''}模板`"
        buttonName="下载模板"
        icon="icon-xiazai"
        @click="downloadTemplate"
      ></file-manage>
      <file-manage
        class="mainWrap__file--upload"
        :num="2"
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
    <div
      class="mainWrap__doc"
      v-if="currentObj.remarks"
      v-html="currentObj.remarksHtml"
    ></div>
    <div class="mainWrap__doc mainWrap__defaultDoc" v-else>
      <div v-for="(item, i) in exportTips" :key="i">
        {{ item.content }}
      </div>
    </div>
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
          <!-- 异常明细 -->
          <!-- <exc-details :checkInfo="checkInfo"></exc-details> -->
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
import { Decrypt, getBlob, saveAs, createUnique } from '@/utils/utils';
import query from '@/api/query';

import {
  importData,
  getCheckSysImportProgress,
  getUploadsysImportProgress
} from '@/api/importTemplate';
import FileManage from './components/FileManage';
import DetectorBox from './components/DetectorBox';
// import ExcDetails from './components/ExcDetails';
import ImportSchedule from './components/ImportSchedule';

export default {
  data() {
    return {
      currentObj: {}, // 当前选中数据
      disabled: true, // 是否可以导入
      buttonLoading: false, // 按钮loading
      file: '', // 文件
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
    // ExcDetails,
    ImportSchedule
  },
  computed: {
    isTree() {
      return this.currentObj.isTree === 1;
    },
    exportTips() {
      return exportTips;
    }
  },
  watch: {},
  mounted() {
    this.$bus.$on('getTreeDate', this.getListDate);
  },
  methods: {
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
    // 上传计数器
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
    // 点击立即导入
    async handleImport() {
      this.activeSteps = 0;
      this.currentState = 'process';
      this.buttonLoading = true;

      this.resetValue();

      this.counterFun();
      this.uniqueId = createUnique();
      try {
        this.startImport();
        setTimeout(() => {
          this.doPreChek();
        }, 1000);
      } catch (e) {
        this.resetFun();
      }
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
          const res = await getCheckSysImportProgress({ uuid: this.uniqueId });
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
    // 导入数据
    async startImport() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const formData = new FormData();
      formData.append('id', this.currentObj.id);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      await importData(formData);
    },
    async doProcessImport() {
      // 导入数据
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          const res = await getUploadsysImportProgress({ uuid: this.uniqueId });
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
    // 下载模板
    downloadTemplate() {
      const url = `${query.GET_IMPORT_TEMPLATE}?id=${this.currentObj.id}`;
      const fileName = this.currentObj.name;
      this.downloadFile(url, fileName);
    },
    downloadFile(url, fileName) {
      getBlob(
        {
          url,
          token: Decrypt(localStorage.getItem('token') || ''),
          method: 'GET'
        },
        (res) => {
          saveAs(res, `${fileName || '下载模板'}.xls`);
        }
      );
    },
    // 树那边拿过来值
    getListDate(v) {
      this.currentObj = v;
      this.fileList = [];
      this.file = '';
      this.disabled = true;
      this.resetValue();
      this.activeSteps = -1;
      this.currentState = 'wait';
    },
    // 上传成功
    getFiles(file) {
      this.file = file;
      this.disabled = false;
      this.resetValue();
      this.activeSteps = -1;
      this.currentState = 'wait';
    },
    resetValue() {
      this.progress = 0;
      this.importProgress = 0;
      this.uploadInfo = {};
      this.checkInfo = {};
      this.diffTime = '';
      this.uploadTime = '';
    }
  },
  beforeDestroy() {
    this.$bus.$off('getTreeDate');
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
