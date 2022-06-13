<!-- 页面 -->
<template>
  <div class="uploadStartWrap">
    <div class="download__template download__common">
      <div class="download__step__one">
        <span>1</span>
        <span>{{ $t('importAndExport.Downloadtemplate') }}</span>
      </div>
      <div class="download__step__tempplate ope__common">
        <apiot-button
          :title="$t('importAndExport.Downloadtemplate')"
          @click="downloadTemplate"
          ><i class="icon-xiazai iconfont"></i>
          {{ $t('importAndExport.Downloadtemplate') }}
        </apiot-button>
      </div>
    </div>
    <div class="download__upload download__common">
      <div class="download__step__two">
        <span>2</span>
        <span>{{ $t('importAndExport.Uploadfile') }}</span>
      </div>
    </div>
    <div class="download__files download__common">
      <div
        class="download__step__three"
        :class="{ download__step__name: fileList.length }"
      >
        {{
          fileList.length
            ? fileList[0].name
            : $t('importAndExport.wanttoimportlocally')
        }}
      </div>
      <div class="download__step__tempplate ope__common">
        <el-upload
          action=""
          :on-success="handleChange"
          :multiple="false"
          :before-upload="beforeUpload"
          :accept="accept"
          :file-list="fileList"
          :http-request="doUpload"
        >
          <el-button :title="$t('importAndExport.Uploadfile')">{{
            $t('importAndExport.Uploadfile')
          }}</el-button>
        </el-upload>
      </div>
    </div>
    <div class="download__memo">
      <div v-html="htmlText.remarks" v-if="htmlText.remarksText"></div>
      <div v-else>
        <div v-for="(item, i) in exportTips" :key="i" style="line-height: 2">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { exportTips } from '@/config';
import { Decrypt, getBlob, saveAs } from '@/utils/utils';
import query from '@/api/query';
import { getTemplateInfo } from '@/api/user';

export default {
  props: {
    templateId: {
      // 模板id
      type: Number,
      default: 1
    },
    templateName: {
      type: String,
      default: '模板.xls'
    }
  },
  data() {
    return {
      htmlText: '',
      fileList: [],
      accept: '.xls'
    };
  },

  components: {},

  computed: {
    exportTips() {
      return exportTips;
    }
  },

  mounted() {
    this.fetchTemplateMemo();
  },

  methods: {
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    beforeUpload(file) {
      // 上传校验
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'error',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    handleChange(response, file) {
      // 校验通过
      this.$emit('upload-file', file);
      this.fileList = [file];
    },
    async fetchTemplateMemo() {
      // 获取模板备注
      const res = await getTemplateInfo({ id: this.templateId });
      this.htmlText = res;
    },
    downloadTemplate() {
      // 下载模板
      getBlob(
        {
          url: `${query.GET_IMPORT_TEMPLATE}?id=${this.templateId}`,
          token: Decrypt(localStorage.getItem('token') || ''),
          method: 'GET'
        },
        (res) => {
          const names = this.htmlText.name;
          saveAs(res, `${names || this.templateName}.xls`);
        }
      );
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.uploadStartWrap {
  width: 100%;
  height: 100%;

  .download__common {
    height: 40px;
    display: flex;
    background: #ffffff;
    border: 1px solid #e9e9e9;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
  }

  .ope__common {
    flex: 1;
    width: calc(100% - 486px);
    height: 100%;
    text-align: center;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & > div {
      width: 100%;
      height: 100%;

      ::v-deep {
        .el-upload {
          width: 100%;
          height: 100%;
        }

        .el-button {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .download__template {
    .download__step__one {
      // flex: 0 0 486px;
      width: 70%;
      display: flex;
      padding-left: 14px;
      align-items: center;
      line-height: 40px;
      border-right: 1px solid #e9e9e9;
      box-sizing: border-box;

      & > span:first-child {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 6px;
        align-items: center;
        line-height: 24px;
        text-align: center;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        border-radius: 50%;
        background: #4689f5;
      }

      & > span:nth-child(2) {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
    }

    .download__step__tempplate {
      .icon-xiazai {
        margin-right: 4px;
        color: #4689f5;
      }

      ::v-deep {
        .el-button {
          height: 100%;
          width: 100%;
          border: none;
          border-radius: 0;
        }
      }
    }
  }

  .download__upload {
    margin-top: 10px;

    .download__step__two {
      flex: 0 0 486px;
      display: flex;
      padding-left: 14px;
      align-items: center;
      line-height: 40px;
      box-sizing: border-box;

      & > span:first-child {
        display: inline-block;
        width: 24px;
        height: 24px;
        margin-right: 6px;
        align-items: center;
        line-height: 24px;
        text-align: center;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        border-radius: 50%;
        background: #4689f5;
      }

      & > span:nth-child(2) {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
    }
  }

  .download__files {
    margin-top: 10px;

    .download__step__three {
      // flex: 0 0 486px;
      width: 70%;
      display: flex;
      padding-left: 14px;
      align-items: center;
      line-height: 40px;
      border-right: 1px solid #e9e9e9;
      box-sizing: border-box;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aaaaaa;
      &.download__step__name {
        color: #333333;
      }
    }

    .download__step__tempplate {
      .icon-xiazai {
        margin-right: 4px;
        color: #4689f5;
      }

      ::v-deep {
        .el-upload-list {
          display: none;
        }

        .el-upload-list--text {
          display: none;
        }

        .el-button {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;
        }
      }
    }
  }

  .download__memo {
    margin-top: 10px;
    height: calc(100% - 150px);
    border-radius: 4px;
    overflow-y: auto;

    & > div {
      min-height: 150px;
      padding: 14px;
      background: #fafafa;
    }
  }
}
</style>
