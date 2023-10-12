<template>
  <view>
    <!-- #ifdef H5 -->
    <h5-file
      v-if="showH5"
      ref="h5File"
      @abort="onAbort"
      @close="onCloseH5"
    ></h5-file>
    <!-- #endif -->
  </view>
</template>

<script>
import h5File from './h5-file.vue';
import { mapState } from 'vuex';

export default {
  components: { h5File },
  props: {
    top: {
      type: String,
      default: 'auto',
    },
    bgColor: {
      type: String,
      default: 'rgba(49, 126, 243, 0.5)',
    },
    color: {
      type: String,
      default: '#e54d42',
    },
  },
  data() {
    this.uploadTask = null;
    return {
      loading: false,
      value: 0,
      showH5: false,
    };
  },
  methods: {
    /*
		上传
		*/
    upload(param = {}) {
      if (!param.url) {
        this.toast('上传地址不正确');
        return;
      }

      if (this.loading) {
        this.toast('还有个文件玩命处理中，请稍候..');
        return;
      }

      // #ifdef APP-PLUS
      return this.appChooseFile(param);
      // #endif

      // #ifdef MP-WEIXIN
      return this.wxChooseFile(param);
      // #endif

      // #ifdef H5
      this.h5ChooseFile(param);
      // #endif
    },
    toast(title = '', { duration = 2000, icon = 'none' } = {}) {
      uni.showToast({ title, duration, icon });
    },
    h5ChooseFile(param) {
      this.showH5 = true;
      this.value = 0;
      this.$nextTick(() => {
        this.$refs.h5File.hFile.onchange = (event) => {
          this.handleUpload(param, event.target.files[0]);
        };
        this.$refs.h5File.hImg.onchange = (event) => {
          this.handleUpload(param, event.target.files[0]);
        };
        this.$refs.h5File.hVideo.onchange = (event) => {
          this.handleUpload(param, event.target.files[0]);
        };
      });
    },
    // 上传方法
    handleUpload({ url, name = 'file', header, ...formData } = {}, tempFile) {
      this.loading = true;
      uni.showLoading({
        title: '文件上传中...',
      });

      const opt = { url, name, formData, header };
      const fileName = tempFile.name;
      opt.file = tempFile;
      opt.fail = (e) => {
        return this.errorHandler(); // 文件上传失败
      };
      opt.success = (res) => {
        if (res.statusCode == 200) {
          const data = JSON.parse(res.data);
          return this.successHandler(data); // 执行完毕
        }
        return this.errorHandler(); // 文件上传失败
      };
      this.uploadTask = uni.uploadFile(opt);
      // this.uploadTask &&
      //   this.uploadTask.onProgressUpdate(({ progress = 0 }) => {});
    },
    // 上传失败的方法
    errorHandler() {
      this.loading = false;
      this.loadingFun('文件上传失败');
    },
    // 上传成功
    successHandler(data) {
      // 可自行添加后台返回状态验证
      this.loadingFun('执行完毕~');
      setTimeout(() => {
        this.loading = false;
        this.showH5 = false;
      }, 1500);
      this.$forceUpdate();
      this.$emit('up-success', data.data[0]);
    },
    // loading
    loadingFun(title) {
      uni.showLoading({
        title: title,
      });
      setTimeout(() => {
        uni.hideLoading();
      }, 1500);
    },

    onCloseH5() {
      if (!this.loading) {
        this.showH5 = false;
      }
    },

    /*
			上传说明：
			currentWebview: 当前窗口webview对象
			url：上传接口地址
			name：上传文件key值
			header: 上传接口请求头
			...：body内其他参数
		*/
    appChooseFile({
      currentWebview,
      url,
      name = 'file',
      header,
      ...formData
    } = {}) {
      // #ifdef APP-PLUS
      console.log(url);
      const wv = plus.webview.create(
        '',
        '/hybrid/html/index.html',
        {
          'uni-app': 'none',
          top: 0,
          height: '100%',
          background: 'transparent',
        },
        {
          url,
          header,
          formData,
          key: name,
        }
      );
      wv.loadURL('/hybrid/html/index.html');
      currentWebview.append(wv);
      wv.overrideUrlLoading({ mode: 'reject' }, (e) => {
        let {
          displayFileName,
          fileLength,
          id,
          mainId,
          name,
          relationId,
          upload_percent,
          url,
          token,
        } = this.getRequest(e.url);
        console.log(3333333333, url);
        const param = {
          displayFileName: unescape(displayFileName),
          fileLength: unescape(fileLength),
          id: id,
          mainId: mainId,
          name: unescape(name),
          relationId: relationId,
          upload_percent: unescape(upload_percent),
          url: `${unescape(url)}=${unescape(token)}`,
        };
        console.log(11111111111111111, param);

        return this.onCommit(this.$emit('up-success', param));
      });
      // #endif
    },
    getRequest(url) {
      const theRequest = new Object();
      const index = url.indexOf('?');
      if (index != -1) {
        const str = url.substring(index + 1);
        const strs = str.split('&');
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
        }
      }
      return theRequest;
    },
    // 微信
    wxChooseFile(param) {
      wx.chooseMessageFile({
        count: 1,
        type: 'file',
        success: ({ tempFiles }) => {
          // this.setdefUI();
          this.handleUpload(param, tempFiles[0]);
        },
        fail: () => this.errorHandler('文件选择失败'),
      });
    },
    onAbort() {
      this.uploadTask && this.uploadTask.abort();
    },
    /*
		打开文件
		*/
    // open(filePath) {
    //   const system = uni.getSystemInfoSync().platform;
    //   if (system == 'ios') {
    //     filePath = encodeURI(filePath);
    //   }
    //   uni.openDocument({
    //     filePath,
    //     success: (res) => {
    //       console.log('打开文档成功');
    //     },
    //   });
    // },
    /*
		APP自定义保存
		 */
    // plusSaveFile({ url, customName = '', opt }) {
    //   let dtask;
    //   return new Promise((resolve, reject) => {
    //     // 可自行修改参数
    //     // 参数api: http://www.html5plus.org/doc/zh_cn/downloader.html#plus.downloader.DownloadOptions
    //     let downloadOptions = {
    //       method: 'GET',
    //       timeout: 120,
    //       retryInterval: 10,
    //     };
    //     customName &&
    //       (downloadOptions.filename = `_downloads/files/${customName}`);
    //     downloadOptions = { ...downloadOptions, ...opt };
    //     dtask = plus.downloader.createDownload(
    //       url,
    //       downloadOptions,
    //       (d, status) => {
    //         // 下载完成
    //         if (status == 200) {
    //           const tempFilePath = d.filename;
    //           this.value = 100;
    //           this.onCommit(resolve(tempFilePath));
    //         } else {
    //           this.errorHandler('下载失败', reject);
    //         }
    //         dtask = null;
    //       }
    //     );
    //     dtask.addEventListener(
    //       'statechanged',
    //       ({ downloadedSize = 0, state = 0, totalSize = 0 } = {}) => {
    //         if (state === 3) {
    //           const total = totalSize > 0 ? totalSize : fileSize;
    //           const progressVal = Math.ceil((downloadedSize / total) * 100);
    //           this.value = progressVal > 100 ? 100 : progressVal;
    //           this.$forceUpdate();
    //         }
    //       },
    //       false
    //     );
    //     dtask.start();
    //   });
    // },
    /*
		下载
		 type: temporary=返回临时地址，save=长期保存到本地
		 */
    // download({ url, type = 'temporary', customName = '', ...opt }) {
    //   if (this.loading) {
    //     this.toast('还有个文件玩命处理中，请稍候..');
    //     return;
    //   }
    //   this.setdefUI();

    //   // #ifdef APP-PLUS
    //   if (type == 'save') {
    //     return this.plusSaveFile({ url, customName, opt });
    //   }
    //   // #endif

    //   return new Promise((resolve, reject) => {
    //     url = encodeURI(url);
    //     const downloadTask = uni.downloadFile({
    //       url,
    //       success: ({ statusCode, tempFilePath }) => {
    //         if (statusCode === 200) {
    //           if (type == 'save') {
    //             uni.saveFile({
    //               tempFilePath,
    //               success: ({ savedFilePath }) =>
    //                 this.onCommit(resolve(savedFilePath)),
    //               fail: () => this.errorHandler('下载失败', reject),
    //             });
    //           } else {
    //             this.onCommit(resolve(tempFilePath));
    //           }
    //         }
    //       },
    //       fail: () => this.errorHandler('下载失败', reject),
    //     });

    //     downloadTask.onProgressUpdate(({ progress = 0 }) => {
    //       if (progress <= 100) {
    //         this.$nextTick(() => {
    //           this.value = progress;
    //         });
    //       }
    //     });
    //   });
    // },

    // onCommit(resolve) {
    //   this.loading = false;
    //   setTimeout(() => {
    //     this.showH5 = false;
    //   }, 1500);
    //   return resolve;
    // },

    // setdefUI() {
    //   this.value = 0;
    //   this.loading = true;
    // },
  },
};
</script>

<style scoped>
</style>
