<!--
 * @Descripttion: 导入导出按钮 ===>>importDialog 逻辑中没有按钮逻辑
 * @Author: ytx
 * @Date: 2022-02-14 08:58:37
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-14 08:58:37
-->
<!-- 页面 -->
<template>
  <div class="importWrap">
    <apiot-button @click="doImport">
      <i class="icon-daoru1 iconfont"></i>{{ $t('role.Import') }}
    </apiot-button>
    <apiot-button>
      <i class="icon-daochu1 iconfont"></i>{{ $t('role.export') }}
    </apiot-button>
    <dialog-modal
      title="导入数据"
      :show-close="false"
      :visible="visible"
      :okBtnName="okBtnName"
      :loading.sync="showLoading"
      v-on:handleOk="handleOk"
      v-on:handleCancel="handleCancel('visible')"
    >
      <upload-templete
        v-if="visible"
        :templateId="templateId"
        @upload-file="getFiles"
      ></upload-templete>
    </dialog-modal>
    <dialog-modal
      :title="getTitle"
      :show-close="false"
      :visible="preVisible"
      :okBtnName="okBtnName"
      v-on:handleOk="handleOk"
      v-on:handleCancel="handleCancel('preVisible')"
      :isHideFooter="isHideFooter"
      :isHideCancel="false"
      :isHideOk="true"
    >
      <preview
        v-if="status === 'preview'"
        :checkInfo="checkInfo"
        :diffTime="diffTime"
      />
      <importting v-if="status === 'import'" :checkInfo="checkInfo" />
    </dialog-modal>
  </div>
</template>

<script>
import {
  doCheckTemplateIsRight,
  doImportProcess,
  doImportStart,
  doProcessChek,
  doUploadFiles
} from '@/api/user';
import { createUnique, getSeconds } from '@/utils/utils';

const DialogModal = () => import('./Dialog/index');
const UploadTemplete = () => import('./UploadTemplete/index');
const Preview = () => import('./Preview/index');
const Importting = () => import('./Importting/index');

export default {
  props: {
    templateId: {
      // 模板id
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showLoading: false,
      okBtnName: 'role.Import',
      visible: false, // 导入入口
      preVisible: false, // 数据预校验
      file: '', // 文件
      uniqueId: '',
      status: '', // 状态，是导入还是预校验
      timer: '', // 定时器
      checkInfo: {}, // 校验信息
      startTime: '',
      diffTime: '',
      isEnd: false // 导入结束
    };
  },

  components: {
    DialogModal,
    UploadTemplete,
    Preview,
    Importting
  },

  computed: {
    isHideFooter() {
      if (
        this.status === 'preview' &&
        (!this.checkInfo.List || !this.checkInfo.List.length) &&
        this.checkInfo.status !== 201
      ) {
        return true;
      }
      if (
        (this.status === 'preview' || this.status === 'import') &&
        this.checkInfo.status === 201
      ) {
        return false;
      }
      if (this.status === 'preview' && this.checkInfo.List && this.checkInfo.List.length) {
        return false;
      }
      if (this.status === 'import' && this.checkInfo.isImportFinish) {
        return false;
      }

      return true;
    },
    getTitle() {
      if (this.status === 'preview') {
        return this.$t('importAndExport.dataPreCheck');
      }
      if (this.status === 'import') {
        return this.$t('importAndExport.dataImport');
      }
      return this.$t('importAndExport.dataPreCheck');
    }
  },

  mounted() {},
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
  },
  methods: {
    getFiles(file) {
      this.file = file;
    },
    async handleOk() {
      // 点击导入，
      if (!this.file) {
        this.$message({
          type: 'warning',
          message: this.$t('importAndExport.correspondingTemplate')
        });
        return;
      }
      const formData = new FormData();
      this.uniqueId = createUnique();
      formData.append('id', this.templateId);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      this.showLoading = true;
      try {
        await doCheckTemplateIsRight(formData);
        doUploadFiles(formData);
        this.showLoading = false;
        this.preVisible = true;
        this.visible = false;
        this.status = 'preview'; //  成功就进行预校验
        this.startTime = Date.parse(new Date());
        this.doPreChek();
      } catch (e) {
        // console.log(e, 'err');
        this.showLoading = false;
      }
    },
    // 进行预校验
    doPreChek() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          const res = await doProcessChek({ uuid: this.uniqueId });
          const { Row, Sum, isCheckFinish, errorRow = 0 } = res;
          this.checkInfo = res;
          if (isCheckFinish || Row >= Sum) {
            // 预校验结束
            clearTimeout(this.timer);
            if (!errorRow && isCheckFinish) {
              // 如果预校验结束并且错误数据为0，则开启导入
              this.status = 'import';
              this.checkInfo = {};
              await this.startImport();
            }
          } else {
            await this.doPreChek();
          }
          this.diffTime = getSeconds((Date.parse(new Date()) - this.startTime) / 1000);
        } catch (e) {
          // console.log(e, 'err');
          this.checkInfo = {
            status: 201
          };
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }
      }, 5000);
    },
    startImport() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const formData = new FormData();
      formData.append('id', this.templateId);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      doImportStart(formData);
      this.doProcessImport();
    },
    async doProcessImport() {
      // 导入数据
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          const res = await doImportProcess({ uuid: this.uniqueId });
          const { Row, Sum, isImportFinish, status } = res;
          if (isImportFinish || Row >= Sum) {
            // 导入结束
            this.isEnd = true; // 导入结束，做个标记
            clearTimeout(this.timer);
          } else if (status === 201) {
            if (this.timer) {
              clearTimeout(this.timer);
            }
          } else {
            await this.doProcessImport();
          }
          this.checkInfo = res;
        } catch (e) {
          this.checkInfo = {
            status: 201
          };
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }
      }, 5000);
    },
    handleCancel(key) {
      // 取消上传文件
      this.file = '';
      this[key] = false;
      this.status = '';
      this.uniqueId = '';
      this.checkInfo = {};
      if (this.timer) clearTimeout(this.timer);
      if (this.isEnd) {
        this.$emit('FETCH_NEW_LIST');
      }
      this.diffTime = '00:00:00';
      this.isEnd = false;
    },
    doImport() {
      this.visible = true;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.importWrap {
  margin-right: 10px;

  .iconfont {
    margin-right: 4px;
    color: #4689f5;
  }
}
</style>
