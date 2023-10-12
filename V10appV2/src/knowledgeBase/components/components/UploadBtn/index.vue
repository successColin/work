<!--
 * @Descripttion: 上传按钮
 * @Author: ytx
 * @Date: 2023-05-22 09:27:37
 * @Last Modified by: ytx
 * @Last Modified time: 2023-05-22 09:27:37
-->
<template>
  <div>
    <div class="uploadBtn" @click="showChooseFile = true">
      <div class="uploadBtn__font">+</div>
    </div>
    <apiot-popup
      :show="showChooseFile"
      :title="title"
      @close="showChooseFile = false"
    >
      <!-- 选择类型 -->
      <choose-file-div
        :canAddFolder="true"
        @addFolder="
          addFileShow = true;
          showChooseFile = false;
        "
        @uploadFiles="uploadFiles"
      ></choose-file-div>
    </apiot-popup>

    <!-- 新建文件夹 -->
    <add-directory
      @close="addFileShow = false"
      title="新建文件夹"
      :show.sync="addFileShow"
      @ok="handleAddFolder"
    ></add-directory>

    <u-toast ref="uToast"></u-toast>
  </div>
</template>

<script>
import { addSaveFolder, addUpload } from '@/api/knowledgeBase';
import ChooseFileDiv from '@/globalComponents/ApiotUploadFiles/components/ChooseFileDiv';
import AddDirectory from './AddDirectory';

export default {
  props: {
    classId: {
      type: Number,
      default: 1
    },
    parentId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showChooseFile: false,
      title: '新增',
      addFileShow: false // 点击新增文件夹
    };
  },
  components: {
    ChooseFileDiv,
    AddDirectory
  },
  computed: {
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },
  inject: ['getFileType'],
  methods: {
    // 新建文件夹
    async handleAddFolder(val) {
      const { parentId, treeClass = this.classId } = this;
      await addSaveFolder({
        name: val,
        parentId,
        treeClass,
        treeType: 1,
        uploadUserName: this.userInfo.username
      });
      this.addFileShow = false;
      this.$emit('refreshFun');
      this.$refs.uToast.show({
        type: 'success',
        message: '新建成功'
      });
    },
    // 上传文件
    uploadFiles(res) {
      this.showChooseFile = false;
      const files = this.contrastSize(res.files);
      console.log(files);

      if (files.length === 0) return;

      for (let i = 0, len = files.length; i < len; i += 1) {
        this.uploadFun(files[0]);
      }
      this.$refs.uToast.show({
        type: 'success',
        message: '上传成功'
      });
      this.$emit('refreshFun');
    },
    async uploadFun(file) {
      console.log(file);
      const { name, path } = file;
      const suffixArr = name.split('.');
      const params = {
        parentId: this.parentId,
        treeClass: this.classId,
        treeType: this.getFileType(suffixArr[suffixArr.length - 1]),
        name,
        uploadUserName: this.userInfo.username
      };
      await addUpload(path, params);
    },
    contrastSize(files) {
      const sizeMax = 200;
      let index = -1;
      const path = [];
      for (let i = 0, len = files.length; i < len; i += 1) {
        const file = files[i];
        const { size = 0, tempFilePath, url } = file;
        if (size > sizeMax * 1024 * 1024) {
          index = i;
          break;
        }
      }
      if (index !== -1) {
        this.$refs.uToast.show({
          type: 'error',
          message: `单文件不能超过${sizeMax}MB`
        });
        return [];
      }
      return files;
    }
  }
};
</script>
<style lang='scss' scoped>
.uploadBtn {
  border-radius: 50%;
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  width: 100rpx;
  height: 100rpx;
  background: #4689f5;
  box-shadow: 0px 4rpx 11rpx 0px rgba(0, 0, 0, 0.2);

  &__font {
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
}
</style>
