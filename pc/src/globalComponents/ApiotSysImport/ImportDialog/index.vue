<!-- 页面 -->
<template>
  <div class="importWrap">
    <apiot-dialog
      title="导入数据"
      :show-close="false"
      :visible="importVisible"
      :okBtnName="okBtnName"
      :loading.sync="showLoading"
      @sure-click="handleOk"
      @cancle-click="handleCancel('importVisible')"
      :isBigDialog="true"
      :append-to-body="true"
    >
      <upload-templete
        v-if="importVisible"
        :templateId="templateId"
        @upload-file="getFiles"
      ></upload-templete>
    </apiot-dialog>
    <apiot-dialog
      :title="getTitle"
      :show-close="false"
      :visible="preVisible"
      :okBtnName="okBtnName"
      @sure-click="handleOk"
      @cancle-click="handleCancel('preVisible')"
      :isHideFooter="isHideFooter"
      :isHideCancel="false"
      :isHideOk="true"
      :isShowSure="false"
      :cancelBtnName="!isShowSure ? 'common.close' : 'common.cancle'"
      class="dialogClass"
      :isBigDialog="true"
    >
      <preview
        v-if="status === 'preview'"
        :checkInfo="checkInfo"
        :diffTime="diffTime"
      />
      <importting
        v-if="status === 'import'"
        :checkInfo="checkInfo"
        @successFun="successFun"
      />
    </apiot-dialog>
  </div>
</template>

<script>
import {
  // checkOrgSpecialTemplate,
  // checkPDSpecialTemplate,
  // checkTreeTemplate,
  // checkUserSpecialTemplate,
  // getCheckSpecialProgress,
  // getCheckSpecialSpecialProgress,
  // getCheckTreeProgress,
  // getUploadTreeProgress,
  // importSpecialTemplate,
  // importTemplateOrgStart,
  // importTemplatePDStart,
  // importTemplateTreeOrgStart,
  // importTemplateUserStart,
  importData,
  // importTreeTemplate,
  getUploadsysImportProgress,
  getCheckSysImportProgress
} from '@/api/importTemplate';
// import {
//   // doCheckTemplateIsRight,
//   // doImportProcess,
//   // doImportStart,
//   // doProcessChek
//   // doUploadFiles
// } from '@/api/user';
import { createUnique, Encrypt, getSeconds } from '@/utils/utils';

const UploadTemplete = () => import('@/globalComponents/ApiotSysImport/UploadTemplete/index');
const Preview = () => import('@/globalComponents/ApiotSysImport/Preview/index');
const Importting = () => import('@/globalComponents/ApiotSysImport/Importting/index');

export default {
  props: {
    // 导入路口
    importVisible: {
      type: Boolean,
      default: false
    },
    templateId: {
      // 模板id
      type: Number,
      default: 1
    },
    templateName: {
      // 模板id
      type: String,
      default: ''
    },
    // 导入额外信息
    extraColumnArr: {
      type: Array
    },
    tableArr: {
      type: Array,
      default: () => []
    },
    // 是否是树导入
    isTree: {
      type: Boolean,
      default: false
    },
    sortId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showLoading: false,
      okBtnName: 'role.Import',
      preVisible: false, // 数据预校验
      file: '', // 文件
      uniqueId: '',
      status: '', // 状态，是导入还是预校验
      timer: '', // 定时器
      checkInfo: {}, // 校验信息
      startTime: '',
      diffTime: '',
      isEnd: false, // 导入结束
      isShowSure: true
    };
  },

  components: {
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
    },
    isSpecial() {
      return this.sortId === -10;
    }
  },

  mounted() {},
  beforeDestroy() {
    if (this.timer) clearTimeout(this.timer);
  },
  inject: ['resolveFormula'],
  methods: {
    successFun(v) {
      this.isShowSure = v;
    },
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
        this.showLoading = false;
        return;
      }
      const formData = new FormData();
      this.uniqueId = createUnique();
      formData.append('id', this.templateId);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      this.showLoading = true;
      // console.log(this.tableArr, this.sortId, this.isSpecial);
      try {
        // if (this.isSpecial && this.tableArr.length === 1) {
        //   // 校验模板
        //   if (this.tableArr.find((v) => v === 'sys_org')) {
        //     // 特殊组织表
        //     await checkOrgSpecialTemplate(formData);
        //   } else if (this.tableArr.find((v) => v === 'sys_user')) {
        //     // 用户表
        //     await checkUserSpecialTemplate(formData);
        //   } else if (
        //     this.tableArr.find((v) => v === 'sys_position') ||
        //     this.tableArr.find((v) => v === 'sys_device')
        //   ) {
        //     // 设备位置表
        //     await checkPDSpecialTemplate(formData);
        //   }
        // } else if (this.isTree) {
        //   // 常规树
        //   await checkTreeTemplate(formData);
        // } else {
        //   await doCheckTemplateIsRight(formData);
        // }
        // // 导入校验
        // if (this.isSpecial && this.tableArr.length === 1) {
        //   if (
        //     this.tableArr.find((v) => v === 'sys_org') ||
        //     this.tableArr.find((v) => v === 'sys_user') ||
        //     this.tableArr.find((v) => v === 'sys_position') ||
        //     this.tableArr.find((v) => v === 'sys_device')
        //   ) {
        //     await importSpecialTemplate(formData);
        //   }
        // } else if (this.isTree) {
        //   await importTreeTemplate(formData);
        // } else {
        //   await doUploadFiles(formData);
        // }
        this.showLoading = false;
        this.preVisible = true;
        this.$emit('update:importVisible', false);
        this.status = 'preview'; //  成功就进行预校验
        this.startTime = Date.parse(new Date());
        this.startImport();
        setTimeout(() => {
          this.doPreChek();
        }, 1000);
      } catch (e) {
        this.showLoading = false;
      }
    },
    // 校验进度监控
    doPreChek() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          // let res;
          // console.log(this.tableArr);
          // if (this.isSpecial && this.tableArr.length === 1) {
          //   if (
          //     this.tableArr.find((v) => v === 'sys_org') ||
          //     this.tableArr.find((v) => v === 'sys_user') ||
          //     this.tableArr.find((v) => v === 'sys_position') ||
          //     this.tableArr.find((v) => v === 'sys_device')
          //   ) {
          //     res = await getCheckSpecialProgress({ uuid: this.uniqueId });
          //   }
          // } else if (this.isTree) {
          //   res = await getCheckTreeProgress({ uuid: this.uniqueId });
          // } else {
          //   res = await doProcessChek({ uuid: this.uniqueId });
          // }
          // console.log(1111111111111, res);
          const res = await getCheckSysImportProgress({ uuid: this.uniqueId });
          const { Row, Sum, isCheckFinish, errorRow = 0, status } = res;
          this.checkInfo = res;
          if (isCheckFinish || Row >= Sum) {
            // 预校验结束
            clearTimeout(this.timer);
            if (!errorRow && isCheckFinish) {
              // 如果预校验结束并且错误数据为0，则开启导入
              this.status = 'import';
              this.checkInfo = {};
              // await this.startImport();
              setTimeout(() => {
                this.doProcessImport();
              }, 1000);
            }
          } else if (status === 201) {
            if (this.timer) {
              clearTimeout(this.timer);
            }
          } else {
            await this.doPreChek();
          }
          this.diffTime = getSeconds((Date.parse(new Date()) - this.startTime) / 1000);
        } catch (e) {
          console.log(e, 'err');
          this.checkInfo = {
            status: 201
          };
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }
      }, 1000);
    },
    async startImport() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      const formData = new FormData();
      formData.append('id', this.templateId);
      formData.append('uuid', this.uniqueId);
      formData.append('file', this.file.raw);
      if (this.extraColumnArr) {
        const jsonArray = [];
        this.extraColumnArr.forEach((item) => {
          const obj = {
            tableName: '',
            field: '',
            value: '',
            type: ''
          };
          if (item.tableName) {
            obj.tableName = item.tableName;
          } else {
            return false;
          }
          if (item.columnObj.columnName) {
            obj.field = item.columnObj.columnName;
            obj.type = item.columnObj.columnType;
          } else {
            return false;
          }
          if (item.valueType === 1) {
            obj.value = item.content;
          } else {
            obj.value = this.resolveFormula(true, item.content);
          }
          jsonArray.push(obj);
        });
        formData.append('relationJson', JSON.stringify(jsonArray));
      }
      const { userInfo } = this.$store.state.userCenter;
      const b =
        this.tableArr.length === 1
          ? `表[${this.tableArr.join()}]`
          : `多表[${this.tableArr.join()}]`;
      const logContent = `${userInfo.username}(${userInfo.account})导入${b},模板id:${this.templateId},模板名称:${this.templateName}`;
      formData.append('logData.content', Encrypt(logContent));
      formData.append('logData.clientType', 'PC');
      formData.append('logData.curMenuId', this.$route.params.id);
      // if (this.isSpecial && this.tableArr.length === 1) {
      //   // 特殊表导入
      //   if (this.tableArr.find((v) => v === 'sys_org')) {
      //     // 组织表
      //     await importTemplateOrgStart(formData);
      //   } else if (this.tableArr.find((v) => v === 'sys_user')) {
      //     // 用户表
      //     await importTemplateUserStart(formData);
      //   } else if (
      //     this.tableArr.find((v) => v === 'sys_position') ||
      //     this.tableArr.find((v) => v === 'sys_device')
      //   ) {
      //     // 设备 和 位置表
      //     await importTemplatePDStart(formData);
      //   }
      // } else if (this.isTree) {
      //   // 树导入
      //   await importTemplateTreeOrgStart(formData);
      // } else {
      //   // 常规的导入
      //   await doImportStart(formData);
      // }
      await importData(formData);
    },
    async doProcessImport() {
      // 导入数据
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(async () => {
        try {
          // let res;
          // if (this.isSpecial && this.tableArr.length === 1) {
          //   if (
          //     this.tableArr.find((v) => v === 'sys_org') ||
          //     this.tableArr.find((v) => v === 'sys_user') ||
          //     this.tableArr.find((v) => v === 'sys_position') ||
          //     this.tableArr.find((v) => v === 'sys_device')
          //   ) {
          //     res = await getCheckSpecialSpecialProgress({ uuid: this.uniqueId });
          //   }
          // } else if (this.isTree) {
          //   res = await getUploadTreeProgress({ uuid: this.uniqueId });
          // } else {
          //   res = await doImportProcess({ uuid: this.uniqueId });
          // }
          const res = await getUploadsysImportProgress({ uuid: this.uniqueId });
          const { Row, Sum, isImportFinish, status } = res;
          if (isImportFinish || Row >= Sum) {
            // 导入结束
            this.isEnd = true; // 导入结束，做个标记
            this.$emit('importRefresh');
            clearTimeout(this.timer);
          } else if (status === 201) {
            if (this.timer) {
              clearTimeout(this.timer);
            }
          } else {
            await this.doProcessImport();
          }
          console.log(res);
          this.checkInfo = res;
        } catch (e) {
          this.checkInfo = {
            status: 201
          };
          if (this.timer) {
            clearTimeout(this.timer);
          }
        }
      }, 1000);
    },
    handleCancel(key) {
      // 取消上传文件
      this.file = '';
      if (key === 'importVisible') {
        this.$emit('update:importVisible', false);
      } else {
        this[key] = false;
        if (this.status === 'preview') {
          this.$emit('update:importVisible', true);
        }
      }
      this.status = '';
      this.uniqueId = '';
      this.checkInfo = {};
      if (this.timer) clearTimeout(this.timer);
      if (this.isEnd) {
        this.$emit('FETCH_NEW_LIST');
      }
      this.diffTime = '00:00:00';
      this.isEnd = false;
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
.dialogClass {
  ::v-deep {
    .el-dialog__body {
      height: 422px;
      padding: 10px 20px 0;
    }
  }
}
</style>
