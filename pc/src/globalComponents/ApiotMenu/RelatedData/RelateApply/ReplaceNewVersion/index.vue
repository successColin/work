<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    title="上传新版本"
    class="uploadNew"
    :append-to-body="true"
    :loading.sync="loading"
    @sure-click="sureClick"
  >
    <div class="uploadNew__file">
      <div class="uploadNew__fileBox">
        <img :src="fileUrl(selectKeys[0])" alt="" v-if="selectKeys.length" />
        <div class="uploadNew__fileBox--info">
          <p
            class="uploadNew__fileBox--name font__ellipsis"
            :title="getOldFile.name"
          >
            {{ renderFileName(getOldFile.name) }}
          </p>
          <p class="uploadNew__fileBox--size">{{ getOldFile.size }}</p>
        </div>
      </div>
      <div class="uploadNew__text">
        <i class="iconfont iconfont-qiehuan"></i><span>替换为</span>
      </div>
      <div class="uploadNew__fileBox">
        <img :src="fileUrl(selectKeys[0])" alt="" v-if="curFile" />
        <div class="uploadNew__fileBox--info">
          <p
            class="uploadNew__fileBox--name font__ellipsis"
            :title="getNewFile.name"
          >
            {{ renderFileName(getNewFile.name) }}
          </p>
          <p class="uploadNew__fileBox--size">{{ getNewFile.size }}</p>
        </div>
      </div>
    </div>
    <el-form
      :model="form"
      label-position="top"
      ref="ruleForm"
      label-width="100px"
      class="dialog__form"
    >
      <el-form-item :label="$t('knowledge.file_name')">
        <apiot-input
          v-model="form.name"
          @blur="inputBlur"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('knowledge.file_name'),
            })
          "
        ></apiot-input>
      </el-form-item>
      <el-form-item :label="$t('importTemplate.remark')">
        <apiot-input
          v-model="form.memo"
          type="textarea"
          resize="none"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: $t('importTemplate.remark'),
            })
          "
        ></apiot-input>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
import axios from 'axios';
import { replaceFile } from '@/api/knowledge';

export default {
  name: '',
  props: {
    selectKeys: {
      type: Array
    },
    curFile: {
      type: [Object, File]
    },
    fileUrl: {
      type: Function,
      default: () => {}
    },
    showReplaceDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        name: '',
        memo: ''
      },
      percentage: 0,
      loading: false
    };
  },
  computed: {
    getOldFile() {
      const file = {
        name: '',
        size: ''
      };
      if (this.selectKeys && this.selectKeys[0]) {
        const data = this.selectKeys[0].sysKlTree || this.selectKeys[0];
        file.name = data.name;
        file.size = this.calculateSize(data.size);
      }
      return file;
    },
    getNewFile() {
      const file = {
        name: '',
        size: ''
      };
      if (this.curFile) {
        file.name = this.curFile.name;
        file.size = this.calculateSize(this.curFile.size);
      }
      return file;
    },
    renderFileName() {
      return function (name) {
        const realNameArr = name.split('.');
        if (realNameArr[0].length > 10) {
          realNameArr[0] = `${realNameArr[0].slice(0, 5)}...${realNameArr[0].slice(
            -2,
            realNameArr[0].length
          )}`;
        }
        return realNameArr.join('.');
      };
    }
  },
  components: {},
  methods: {
    sureClick() {
      this.doUpload();
    },
    calculateSize(size) {
      const kb = 1024;
      const mb = kb * 1024;
      const gb = mb * 1024;
      // eslint-disable-next-line no-unused-vars
      let ret = '';

      if (size >= gb) {
        ret = `${(size / (gb * 1.0)).toFixed(0)} GB`;
      } else if (size >= mb) {
        ret = `${(size / (mb * 1.0)).toFixed(0)} MB`;
      } else if (size >= kb) {
        ret = `${(size / (kb * 1.0)).toFixed(0)} KB`;
      } else if (size > 0) {
        ret = `${(size / 1.0).toFixed(0)} KB`;
      } else {
        ret = '0 KB';
      }
      return ret;
    },
    inputBlur() {
      if (!this.form.name) {
        this.form.name = this.getNewFile.name;
      }
    },
    async doUpload() {
      this.loading = true;
      const source = axios.CancelToken.source();
      const formData = new FormData();
      formData.append('file', this.curFile);
      formData.append('id', this.selectKeys[0].sysKlTree.id);
      formData.append('name', this.form.name);
      formData.append('memo', this.form.memo);
      formData.append('uploadUserName', this.$store.state.userCenter.userInfo.username);
      try {
        await replaceFile(formData, this.uploadProgress(this.curFile), source);
        this.loading = false;
        this.$message({
          type: 'success',
          message: this.$t('knowledge.success_upload')
        });
        this.$emit('replaceSureClick');
        this.$emit('update:visible', false);
      } catch (error) {
        this.loading = false;
      }
    },
    // 进度
    uploadProgress() {
      return (percentage) => {
        this.percentage = percentage;
      };
    }
  },
  watch: {
    showReplaceDialog(v) {
      if (v) {
        this.form.name = this.getNewFile.name;
        this.form.memo = '';
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.uploadNew {
  &__file {
    height: 98px;
    display: flex;
    align-items: center;
  }
  &__fileBox {
    width: 260px;
    height: 68px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    &--info {
      width: 180px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
    }
    &--name {
      color: #333333;
      margin-bottom: 4px;
    }
    &--size {
      color: #808080;
    }
  }
  &__text {
    i {
      margin-right: 4px;
      color: #bbc3cd;
    }
    span {
      color: #333333;
    }
  }
}
</style>
