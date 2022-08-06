<template>
  <div
    class="papersUpload"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <el-form-item :prop="`${configData.compId}`">
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>

      <apiot-input
        v-model="parent.form[configData.compId]"
        v-show="false"
      ></apiot-input>
      <el-upload
        v-for="(item, num) in fileList"
        :key="num"
        @mouseenter.native="mouseenter(item, num)"
        @mouseleave.native="mouseleave(item, num)"
        drag
        class="upload"
        action=""
        :accept="accept"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :http-request="doUpload"
        :show-file-list="false"
        :disabled="configData.canReadonly"
      >
        <img v-if="item.url" :src="item.url" class="avatar" />
        <div v-else class="tips">
          <i class="el-icon-upload"></i>
          <p>{{ configData.tipsArr[num].info }}</p>
        </div>
        <div
          v-if="item.url && item.showOperate"
          class="operate"
          @click="operateClick"
        >
          <el-tooltip effect="dark" content="预览" placement="top"
            ><i class="iconfont icon-chakan" @click="preview(item)"></i
          ></el-tooltip>
          <el-tooltip effect="dark" content="下载" placement="top">
            <a
              :href="`${item.url}?response-content-type=application/octet-stream`"
              class="operate--xiazai"
            >
              <i class="iconfont icon-xiazai"></i> </a
          ></el-tooltip>
          <el-tooltip effect="dark" content="替换" placement="top"
            ><i class="iconfont icon-qiehuan"></i
          ></el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top"
            ><i class="iconfont icon-guanbi" @click.stop="delFile(item)"></i
          ></el-tooltip>
        </div>
      </el-upload>
    </el-form-item>
    <apiot-dialog :visible.sync="dialogVisible" class="previewDialog">
      <img width="100%" :src="imgUrl" alt="" />
    </apiot-dialog>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import { batchUpload, getFileList } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  props: {
    fileDeleteIds: {
      type: Array
    }
  },
  data() {
    return {
      curCompType: 2,
      fileList: [
        // {
        //   name: '0E004168-6E21-4cd8-8DF4-184B4DA5AD7E.png',
        //   percentage: 100,
        //   response:
        //     'http://v9.mingcloud.top:9000/v10/HelpCenter/0E004168-6E21-4cd8-8DF4-184B4DA5AD7E.png',
        //   size: 1571,
        //   status: 'success',
        //   uid: 1629258101424,
        //   showOperate: false
        // }
      ],
      accept: '.png, .jpg,.jpeg, .gif',
      dialogVisible: false,
      imgUrl: '',
      curIndex: 0,
      idsArr: [],
      flag: true,
      unwatch: null,
      notChangeIndex: false
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {},

  mounted() {
    this.unwatch = this.$watch(`parent.form.${this.configData.compId}`, (v) => {
      if (v && this.flag) {
        this.getFileList();
      }
      if (!v) {
        this.fileList = [];
        for (let i = 0; i < this.configData.maxFileCount; i += 1) {
          this.fileList.push({});
        }
      }
    });
  },

  methods: {
    async getFileList() {
      if (this.parent.form[this.configData.compId]) {
        const data = await getFileList({
          ids: this.parent.form[this.configData.compId]
        });
        data.forEach((item) => {
          item.showOperate = false;
          item.percentage = 100;
        });
        if (data && data.length) {
          [this.fileList[this.curIndex]] = data;
        } else {
          this.fileList[this.curIndex] = {};
        }
        this.notChangeIndex = false;
        // console.log(data);
      }
    },
    setCurIndex(index) {
      this.curIndex = index;
    },
    // 鼠标移入移出
    mouseenter(item, index) {
      this.$set(item, 'showOperate', true);
      if (!this.notChangeIndex) {
        this.curIndex = index;
      }
    },
    mouseleave(item, index) {
      this.$set(item, 'showOperate', false);
      if (!this.notChangeIndex) {
        this.curIndex = index;
      }
    },
    // 上传成功
    uploadSuccess(response, file) {
      file.url = response[0].url;
      file.id = response[0].id;
      this.$set(this.fileList, this.curIndex, file);
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const { size } = file;
        const newSize = size <= this.configData.maxFileSize * 1024 * 1024;

        if (!newSize) {
          this.$message({
            type: 'warning',
            message: this.$t('knowledge.size_more')
          });
          reject(file);
          return;
        }

        resolve(file);
      });
    },
    // 自定义上传
    async doUpload(param) {
      const { file } = param;
      const formData = new FormData();
      // eslint-disable-next-line max-len
      const menuId =
        this.showType && this.showType.menuId ? this.showType.menuId : this.$route.params.id;
      formData.append('files', file);
      formData.append('menuId', menuId);
      this.notChangeIndex = true;
      const res = await batchUpload(formData);
      if (this.fileList[this.curIndex].id) {
        this.fileDeleteIds.push(this.fileList[this.curIndex].id);
      }
      return res;
    },
    // 删除文件
    delFile() {
      const fileArr = this.fileList.splice(this.curIndex, 1, {});
      this.fileDeleteIds.push(fileArr[0].id);
    },
    preview(file) {
      // console.log(file);
      this.imgUrl = file.url;
      this.dialogVisible = true;
    },
    operateClick(e) {
      if (!e.target.classList.contains('icon-qiehuan')) {
        e.stopPropagation();
      }
    }
  },

  watch: {
    'configData.maxFileCount': {
      handler(v) {
        // console.log(v);
        this.fileList = [];
        this.configData.tipsArr = [];
        if (v) {
          for (let i = 0; i < v; i += 1) {
            this.fileList.push({});
            this.configData.tipsArr.push({
              info: '请上传图片'
            });
          }
        } else {
          this.configData.maxFileCount = 1;
        }
      },
      immediate: true
    },
    idsArr: {
      handler(v) {
        this.flag = false;
        this.parent.form[this.configData.compId] = v.join();
        this.flag = true;
      },
      deep: true
    },
    fileList: {
      handler(v) {
        this.idsArr = [];
        v.forEach((file) => {
          if (file.id) {
            this.idsArr.push(file.id);
          }
        });
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  }
};
</script>

<style lang='scss' scoped>
.papersUpload {
  position: relative;
  box-sizing: border-box;
  padding: 2px 15px 18px 15px;

  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 35px;
  }

  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }

  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }

  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;

    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }

  ::v-deep {
    .el-form-item {
      margin-bottom: 0;

      .el-form-item__label {
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
    }
  }

  .upload {
    display: inline-block;
    width: 246px;
    height: 140px;
    margin-right: 8px;
    margin-bottom: 8px;
    vertical-align: top;

    ::v-deep {
      .el-upload {
        width: 100%;
        height: 100%;
      }

      .el-upload-dragger {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar {
          width: 100%;
          height: 100%;
        }

        .el-icon-upload {
          font-size: 50px;
          margin: 0;
        }

        .tips {
          color: #808080;
          font-size: 12px;

          p {
            line-height: 14px;
          }
        }

        .operate {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-evenly;

          .iconfont {
            color: #fff;
            font-size: 16px;
            cursor: pointer;
          }

          &--xiazai {
            text-decoration: none;
            cursor: pointer;
            text-decoration: none;
          }

          &--line {
            position: relative;

            &:after {
              content: '';
              position: absolute;
              width: 1px;
              height: 12px;
              background-color: #e9e9e9;
              right: -14px;
            }
          }
        }
      }
    }
  }

  .previewDialog {
    img {
      width: 100%;
      height: 400px;
    }
  }
}
</style>
