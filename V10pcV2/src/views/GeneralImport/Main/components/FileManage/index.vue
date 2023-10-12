<!--
 * @Descripttion: 进度条
 * @Author: ytx
 * @Date: 2022-06-10 14:28:55
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-10 14:28:55
-->
<template>
  <div class="fileManage">
    <div class="fileManage__box">
      <div class="fileManage__number">{{ num }}</div>
      <div
        class="fileManage__desc font__ellipsis"
        :style="`${num === 2 ? 'width: auto;flex: none;' : ''}`"
        :title="dec"
      >
        {{ dec }}
      </div>
      <div
        :class="{
          fileManage__fileName: fileList.length,
          fileManage__placeholder: true,
          font__ellipsis: true,
        }"
        v-if="placeholder"
        :title="fileList.length ? fileList[0].name : placeholder"
      >
        {{ fileList.length ? fileList[0].name : placeholder }}
      </div>
    </div>
    <!-- 步骤一 -->
    <apiot-button
      @click="handleClick"
      class="fileManage__button"
      v-if="num === 1"
    >
      <i :class="`iconfont ${icon}`"></i>
      {{ buttonName }}
    </apiot-button>
    <!-- 步骤二 -->
    <el-upload
      v-if="num === 2"
      action=""
      :on-success="handleChange"
      :multiple="false"
      :before-upload="beforeUpload"
      :accept="accept"
      :file-list="fileList"
      :http-request="doUpload"
      class="fileManage__upload"
    >
      <apiot-button class="fileManage__button">
        <i :class="`iconfont ${icon}`"></i>
        {{ buttonName }}
      </apiot-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 1
    },
    dec: {
      type: String,
      default: ''
    },
    buttonName: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      accept: '.xls, .xlsx'
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    // 上传校验
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const { name } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
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
      this.$emit('update:fileList', [file]);
    },
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>
<style lang='scss' scoped>
.fileManage {
  width: 100%;
  height: 36px;
  display: flex;
  &__box {
    border: 1px solid #e9e9e9;
    border-right: 0;
    display: flex;
    flex: 1;
    align-items: center;
    position: relative;
  }
  &__number {
    width: 20px;
    height: 20px;
    background: #4689f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-left: 16px;
  }
  &__desc {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-left: 8px;
    flex: 1;
    width: 30px;
  }
  &__placeholder {
    font-size: 14px;
    color: #aaaaaa;
    margin-left: 40px;
    border-left: 1px solid #e9e9e9;
    padding-left: 14px;
    flex: 1;
    width: 40px;
    line-height: 36px;
  }
  &__fileName {
    color: #333333;
  }
  &__upload {
    width: 114px;
    height: 100%;
    display: flex;
  }
  &__button {
    width: 114px;
    height: 100%;
    background: #ffffff;
    border: 1px solid #e9e9e9;
    border-radius: 0;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
    .iconfont {
      font-size: 16px;
      color: #4689f5;
      margin-right: 5px;
    }
  }
  ::v-deep {
    .el-upload-list {
      display: none;
    }
    .el-upload-list--text {
      display: none;
    }
  }
}
</style>
