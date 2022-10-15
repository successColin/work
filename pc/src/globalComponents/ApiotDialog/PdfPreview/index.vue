<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    class="previewDialog"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <div class="pdf-all-container">
      <div class="tool-container">
        <apiot-button @click="onDownloadFile" style="float: right">
          <i class="iconfont icon-xiazai"></i>
          下载
        </apiot-button>
        <span style="float: left; color: #666">共 {{ numPages }} 页</span>
        <span
          v-if="loadedRatio > 0 && loadedRatio < 100"
          style="
            float: left;
            color: #999;
            margin-left: 50px;
            display: inline-block;
          "
        >
          已加载：{{ loadedRatio }}%
        </span>
      </div>
      <div
        v-loading="loading"
        v-infinite-scroll="onScrollBtm"
        class="pdf-viewer"
      >
        <pdf
          v-for="i in numLoadPages"
          :key="i"
          :src="srcTask"
          :page="i"
          style="display: inline-block; width: 100%"
          @progress="loadedRatio = $event"
        />
        <el-empty v-if="loadError" description="预览加载失败，请重新打开！" />
      </div>
    </div>
  </apiot-dialog>
</template>

<script>
import pdf from 'vue-pdf-signature'; // 引入下载的vue-pdf
import CMapReaderFactory from 'vue-pdf-signature/src/CMapReaderFactory.js';
import { downloadSingle } from '@/api/knowledge';
import { saveAs } from '@/utils/utils'; // 封装的下载方法

export default {
  components: {
    pdf
  },
  props: {
    fileUrl: {
      type: String,
      default: ''
    },
    previewObj: {
      type: Object
    }
  },
  data() {
    return {
      srcTask: '',
      numPages: 0,
      numLoadPages: 0,
      loading: false,
      src: '',
      fileInfo: {},
      loadError: false,
      loadedRatio: 0
    };
  },
  watch: {
    previewObj: {
      handler(val) {
        if (!val.sysKlTree) return;
        this.src = this.previewObj.sysKlTree.url;
      },
      deep: true,
      immediate: true
    },
    src: {
      async handler(val) {
        if (!val) {
          return;
        }
        let { url } = this.previewObj.sysKlTree;
        if (this.$store.state.globalConfig.waterConfig.enableWaterMask === '1') {
          const data = await downloadSingle({ url: this.previewObj.sysKlTree.url });
          url = URL.createObjectURL(data);
        } else {
          url = this.$parseImgUrl(url);
        }

        this.srcTask = pdf.createLoadingTask({
          url,
          CMapReaderFactory
        });
        this.srcTask.onProgress = (v) => {
          let ratio = (v.loaded / v.total) * 100;
          if (ratio >= 100) {
            ratio = 100;
            this.loading = false;
          }
          this.loadedRatio = ratio.toFixed(2);
        };
        this.srcTask.promise
          .then((pdf1) => {
            console.log({ pdf1 });
            this.numPages = pdf1.numPages;
            this.numLoadPages = pdf1.numPages > 4 ? 4 : pdf1.numPages;
            this.fileInfo.pageNum = pdf1.numPages;
          })
          .catch((err) => {
            this.loadError = true;
            console.log(err);
          });
      },
      immediate: true
    }
  },
  methods: {
    // 加载pdf,每4页进行更新
    onScrollBtm() {
      if (this.numLoadPages >= this.numPages) {
        return;
      }
      if (this.numLoadPages + 4 > this.numPages) {
        this.numLoadPages = this.numPages;
        return;
      }
      this.numLoadPages += 4;
    },
    // 下载pdf
    // onDownloadFile() {
    //   console.log(this.previewObj);
    //   saveAs(this.previewObj.sysKlTree.src, this.previewObj.sysKlTree.name);
    // },
    async onDownloadFile() {
      const data = await downloadSingle({ url: this.previewObj.sysKlTree.url });
      saveAs(data, this.previewObj.sysKlTree.name);
    }
  }
};
</script>

<style scoped lang='scss'>
.pdf-all-container {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: auto;
  position: relative;
}

.tool-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 30px;
  /* background: pink; */
}

.pdf-viewer {
  position: absolute;
  left: 0px;
  right: 0;
  top: 40px;
  bottom: 0;
  overflow: auto;
}
.pdf-viewer > span {
  box-shadow: 0px 1px 6px #ddd;
  margin-bottom: 10px;
  border-radius: 7px;
}
.icon-xiazai {
  margin-right: 4px;
  color: $--color-primary;
}
</style>
