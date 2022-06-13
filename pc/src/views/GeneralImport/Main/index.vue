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
    <!-- 检测进度 -->
    <detector-box
      :isdetect.sync="isdetect"
      :diffTime="diffTime"
      :checkInfo="checkInfo"
      :progress="progress"
    ></detector-box>
    <!-- 异常明细 -->
    <exc-details @export="handleExport" :checkInfo="checkInfo"></exc-details>
  </div>
</template>

<script>
import { exportTips } from '@/config';
import { Decrypt, getBlob, saveAs, createUnique } from '@/utils/utils';
import query from '@/api/query';
import {
  importTemplateOrgStart,
  importTemplateUserStart,
  checkTreeTemplate,
  getCheckTreeProgress,
  getUploadTreeProgress,
  importTemplateTreeOrgStart,
  importTreeTemplate,
  importTemplatePDStart,
  checkOrgSpecialTemplate,
  checkUserSpecialTemplate,
  checkPDSpecialTemplate,
  importSpecialTemplate,
  getCheckSpecialProgress,
  getCheckSpecialSpecialProgress
} from '@/api/importTemplate';
import {
  doUploadFiles,
  doProcessChek,
  doImportProcess,
  doImportStart,
  doCheckTemplateIsRight
} from '@/api/user';
import FileManage from './components/FileManage';
import DetectorBox from './components/DetectorBox';
import ExcDetails from './components/ExcDetails';

export default {
  data() {
    return {
      currentObj: {}, // 当前选中数据
      disabled: true, // 是否可以导入
      buttonLoading: false, // 按钮loading
      file: '', // 文件
      fileList: [],
      isdetect: false, // 是否开始校验
      uniqueId: '',
      timer: '', // 定时器
      counter: '', // ⏲
      diffTime: '', // 用时
      checkInfo: {}, // 检测信息
      progress: 0 // 进度
    };
  },
  components: {
    FileManage,
    DetectorBox,
    ExcDetails
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
    // 点击立即导入
    async handleImport() {
      this.buttonLoading = true;
      this.counterFun();
      this.isdetect = true;
      const formData = new FormData();
      this.uniqueId = createUnique();
      formData.append('id', this.currentObj.id);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      const { sortId, templateTpye, relationsList } = this.currentObj;
      try {
        console.log(templateTpye);
        if (sortId === -10 && templateTpye === 1) {
          // 校验模板
          if (relationsList.find((v) => v.tableName === 'sys_org')) {
            // 特殊组织表
            await checkOrgSpecialTemplate(formData);
          } else if (relationsList.find((v) => v.tableName === 'sys_user')) {
            // 用户表
            await checkUserSpecialTemplate(formData);
          } else if (
            relationsList.find((v) => v.tableName === 'sys_position') ||
            relationsList.find((v) => v.tableName === 'sys_device')
          ) {
            // 设备位置表
            await checkPDSpecialTemplate(formData);
          }
        } else if (this.isTree === 1) {
          // 常规树
          await checkTreeTemplate(formData);
        } else {
          await doCheckTemplateIsRight(formData);
        }
        // 导入校验
        if (sortId === -10 && templateTpye === 1) {
          if (
            relationsList.find((v) => v.tableName === 'sys_org') ||
            relationsList.find((v) => v.tableName === 'sys_user') ||
            relationsList.find((v) => v.tableName === 'sys_position') ||
            relationsList.find((v) => v.tableName === 'sys_device')
          ) {
            await importSpecialTemplate(formData);
          }
        } else if (this.isTree === 1) {
          await importTreeTemplate(formData);
        } else {
          await doUploadFiles(formData);
        }
        this.doPreChek();
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
      this.buttonLoading = false;
      this.isdetect = false;
      this.progress = 100;
    },
    // 校验进度监控
    doPreChek() {
      const { sortId, templateTpye, relationsList } = this.currentObj;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          let res;
          // 特殊表
          if (sortId === -10 && templateTpye === 1) {
            if (
              relationsList.find((v) => v.tableName === 'sys_org') ||
              relationsList.find((v) => v.tableName === 'sys_user') ||
              relationsList.find((v) => v.tableName === 'sys_position') ||
              relationsList.find((v) => v.tableName === 'sys_device')
            ) {
              res = await getCheckSpecialProgress({ uuid: this.uniqueId });
            }
          } else if (this.isTree) {
            res = await getCheckTreeProgress({ uuid: this.uniqueId });
          } else {
            res = await doProcessChek({ uuid: this.uniqueId });
          }
          const { Row, Sum, isCheckFinish, errorRow = 0 } = res;
          this.checkInfo = res;
          if (this.progress < 60) {
            this.progress += 1;
          }
          if (isCheckFinish || Row >= Sum) {
            // 预校验结束
            if (!errorRow && isCheckFinish) {
              // 如果预校验结束并且错误数据为0，则开启导入
              await this.startImport();
            } else {
              this.resetFun();
              this.$message.error('导入失败！');
            }
          } else {
            await this.doPreChek();
          }
        } catch (e) {
          console.log(e);
          this.resetFun();
        }
      }, 2000);
    },
    // 导入数据
    async startImport() {
      const { sortId, templateTpye, relationsList } = this.currentObj;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const formData = new FormData();
      formData.append('id', this.currentObj.id);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      if (sortId === -10 && templateTpye === 1) {
        // 特殊表导入
        if (relationsList.find((v) => v.tableName === 'sys_org')) {
          // 组织表
          await importTemplateOrgStart(formData);
        } else if (relationsList.find((v) => v.tableName === 'sys_user')) {
          // 用户表
          await importTemplateUserStart(formData);
        } else if (
          relationsList.find((v) => v.tableName === 'sys_position') ||
          relationsList.find((v) => v.tableName === 'sys_device')
        ) {
          // 设备 和 位置表
          await importTemplatePDStart(formData);
        }
      } else if (this.isTree) {
        // 树导入
        await importTemplateTreeOrgStart(formData);
      } else {
        // 常规的导入
        await doImportStart(formData);
      }

      this.doProcessImport();
    },
    async doProcessImport() {
      const { sortId, templateTpye, relationsList } = this.currentObj;
      // 导入数据
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          let res;
          if (sortId === -10 && templateTpye === 1) {
            if (
              relationsList.find((v) => v.tableName === 'sys_org') ||
              relationsList.find((v) => v.tableName === 'sys_user') ||
              relationsList.find((v) => v.tableName === 'sys_position') ||
              relationsList.find((v) => v.tableName === 'sys_device')
            ) {
              res = await getCheckSpecialSpecialProgress({ uuid: this.uniqueId });
            }
          } else if (this.isTree) {
            res = await getUploadTreeProgress({ uuid: this.uniqueId });
          } else {
            res = await doImportProcess({ uuid: this.uniqueId });
          }
          const { Row, Sum, isImportFinish, status } = res;
          console.log(res);
          if (this.progress < 99) {
            this.progress += 1;
          }
          if (isImportFinish || Row >= Sum || status === 201) {
            // 导入结束
            this.resetFun();
            this.$message.success('导入成功！');
          } else {
            await this.doProcessImport();
          }
        } catch (e) {
          this.resetFun();
        }
      }, 2000);
    },
    // 下载模板
    downloadTemplate() {
      const url = `${query.GET_IMPORT_TEMPLATE}?id=${this.currentObj.id}`;
      const fileName = this.currentObj.name;
      this.downloadFile(url, fileName);
    },
    // 常规错误导出
    exportErrorMessage(type) {
      // 1 常规导出， 2 树导出， 3 特殊表导出
      let url;
      if (type === 1) {
        url = `${query.EXPORT_ERROR_MESSAGE}?uuid=${this.uniqueId}`;
      } else if (type === 2) {
        url = `${query.EXPORT_ERROR_TREE_MESSAGE}?uuid=${this.uniqueId}`;
      } else if (type === 3) {
        url = `${query.EXPORT_ERROR_SPCIAL_MESSAGE}?uuid=${this.uniqueId}`;
      }
      const fileName = `${this.currentObj.name}错误信息`;
      console.log(url);
      this.downloadFile(url, fileName);
    },
    async handleExport() {
      const { sortId, templateTpye, relationsList } = this.currentObj;
      if (sortId === -10 && templateTpye === 1) {
        if (
          relationsList.find((v) => v.tableName === 'sys_org') ||
          relationsList.find((v) => v.tableName === 'sys_user') ||
          relationsList.find((v) => v.tableName === 'sys_position') ||
          relationsList.find((v) => v.tableName === 'sys_device')
        ) {
          this.exportErrorMessage(3);
        }
      } else if (this.isTree) {
        this.exportErrorMessage(2);
      } else {
        this.exportErrorMessage(1);
      }
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
      console.log(v);
      this.currentObj = v;
      this.fileList = [];
      this.file = '';
      this.disabled = true;
      this.checkInfo = {};
      this.diffTime = '';
    },
    // 上传成功
    getFiles(file) {
      console.log(file);
      this.file = file;
      this.disabled = false;
      this.checkInfo = {};
      this.diffTime = '';
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
    max-height: 50vh;
    overflow: auto;
  }
  &__defaultDoc {
    div {
      line-height: 2;
    }
  }
}
</style>
