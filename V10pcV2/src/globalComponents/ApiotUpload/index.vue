<template>
  <div>
    <el-upload
      class="apiotUpload"
      action="#"
      list-type="picture-card"
      :before-upload="beforeUpload"
      :http-request="doUpload"
      :file-list="fileList"
    >
      <div class="apiotUpload__default">
        <i class="el-icon-plus"></i>
        <div>上传背景图片</div>
      </div>
      <div slot="file" slot-scope="{ file }">
        <img
          class="el-upload-list__item-thumbnail"
          :src="$parseImgUrl(file.url)"
          alt=""
        />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="iconfont icon-fangda"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click.stop="
              download(
                `${file.url}?response-content-type=application/octet-stream`,
                file.name
              )
            "
          >
            <i class="iconfont icon-xiazai"></i>
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleRemoveImg(file)"
          >
            <i class="iconfont icon-shanchu"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="$parseImgUrl(imgPreview)" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import { batchUpload, deleteFileFun } from '@/api/menuConfig';
import { getBlob, saveAs } from '@/utils/utils';

export default {
  props: {
    bgImgArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileList: [],
      acceptImg: 'jpeg,png,jpg',
      // 图片是否放大
      dialogVisible: false,
      imgPreview: ''
    };
  },
  components: {},
  computed: {},
  watch: {
    bgImgArr(v) {
      this.fileList = v;
    }
  },
  mounted() {},
  methods: {
    // 上传之前
    beforeUpload(file) {
      const { type, size } = file;
      const isLt2M = size / 1024 / 1024 < 2;
      const imgType = type.split('/')[1];
      if (!isLt2M) {
        this.$message({
          type: 'warning',
          message: '上传图片大小不能超过 2MB!'
        });
        return false;
      }
      if (this.acceptImg.indexOf(imgType) === -1) {
        this.$message({
          type: 'warning',
          message: '请上传 jpeg,png,jpg 格式!'
        });
        return false;
      }
      return true;
    },
    // 自定义上传
    async doUpload(param) {
      this.fileList = [];
      const { file } = param;
      const formData = new FormData();
      formData.append('files', file);
      const menuId = this.$route.params.id || this.$route.query.menuId;
      formData.append('menuId', menuId);
      const res = await batchUpload(formData);
      console.log(res);
      file.url = res[0].url;
      file.id = res[0].id;
      this.fileList.push(file);
      this.$emit('update:bgImgArr', this.fileList);
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.imgPreview = file.url;
      this.dialogVisible = true;
    },
    // 下载
    download(url, filename) {
      console.log(url, filename);
      getBlob({ url }, (blob) => {
        saveAs(blob, filename);
      });
    },
    // 删除图片
    async handleRemoveImg(file) {
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.image') }),
        this.$t('common.delete', { name: this.$t('helpCenter.image') }),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        await deleteFileFun({ id: file.id });
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.fileList = [];
        this.$emit('update:bgImgArr', []);
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.apiotUpload {
  width: 105px;
  height: 105px;
  overflow: hidden;
  display: inline-block;
  &__default {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    height: 104px;
    i {
      color: #bbc3cd;
      font-size: 17px;
    }
    div {
      line-height: 32px;
      font-size: 12px;
      color: #aaaaaa;
    }
  }
  ::v-deep {
    .disabled {
      .el-upload--picture-card {
        display: none;
      }
    }
    .el-upload--picture-card {
      width: 104px;
      height: 104px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px dashed #e0e0e0;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 104px;
      height: 104px;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .el-upload-list--picture-card .el-upload-list__item:focus {
      outline: none;
    }
  }
}
</style>
