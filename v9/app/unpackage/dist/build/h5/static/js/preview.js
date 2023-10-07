/*
 * @Author: Shishans
 * @Date: 2020/11/11
 * @Desc: 文件预览，包括图片、文档等
 */
const previewImage = (current, urls = []) => {
  //预览图片
  let config = { current };
  if (urls.length > 0) config.urls = urls;
  else config.urls = [current];
  uni.previewImage(config);
};
const appDownloadFile = (file, _this) => {
  //下载文件
  const { id, name, fileLength, url } = file;

  uni.downloadFile({
    //下载后文件会存在临时路径中，因为下次不想想再下载将文件存储到实际路径中，以便下次获取
    url: url,
    success: function (res) {
      var filePath = res.tempFilePath;
      let previewFile = {};
      previewFile[id] = filePath;
      _this.SET_COM_PREVIEWFILEPATHS(previewFile);

      uni.openDocument({
        filePath: filePath,
        success: function (res) {
          console.log('打开文档成功');
        },
      });
    },
  });
};
const downloadFile = (file, _this) => {
  const { id, name, fileLength, url } = file,
    fileUrl = `_downloads/${name}`,
    previewFilePaths = _this.previewFilePaths;
  console.log(previewFilePaths);
  if (id in previewFilePaths) {
    uni.openDocument({
      filePath: previewFilePaths[id],
      success: function (res) {
        console.log('打开文档成功');
      },
    });
  } else {
    appDownloadFile(file, _this);
  }
};

const previewMP3 = (url) => {
  const innerAudioContext = uni.createInnerAudioContext();
  innerAudioContext.autoplay = true;
  innerAudioContext.src = url;
  innerAudioContext.onPlay(() => {
    console.log('开始播放');
  });
  innerAudioContext.onError((res) => {
    console.log(res.errMsg);
    console.log(res.errCode);
  });
};

export const PREVIEW_FILE = (file, _this) => {
  //文件预览
  const { name, url } = file;
  let typeArray = name.split('.'),
    type = typeArray[typeArray.length - 1],
    picTypes = ['jpg', 'jpeg', 'png'],
    previewTypes = [],
    video = {};
  //#ifdef H5
  previewTypes = ['pdf', 'txt'];
  //#endif
  //#ifndef H5
  previewTypes = ['pdf', 'txt', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx'];
  //#endif
  if (type) type = type.toLowerCase();
  console.log(type);
  if (picTypes.indexOf(type) !== -1) {
    //如果是图片类型的直接预览
    previewImage(url);
  } else if (previewTypes.indexOf(type) !== -1) {
    //如果是直接可以预览的文件，比如pdf与txt
    //如果是H5端，可以直接用webview打开
    //#ifdef H5
    let filepreviewUrl = `/pages/templates/webViewTemplate?isPreview=true&url=${url}&fileName=${name}`;
    uni.navigateTo({
      url: filepreviewUrl,
    });
    //#endif
    //#ifdef APP-PLUS
    downloadFile(file, _this);
    //#endif
  } else if (type === 'mp3') {
    //如果是MP3
    previewMP3(url);
  } else if (type === 'mp4') {
    //如果是MP3
    video.type = 'video';
    video.url = url;
  } else {
    uni.showModal({
      title: _this.$i18nMsg('basic-modalTip'), // 中文：'提示'
      content: '无法预览', // 中文：'是否打开XX附件查看?'
      confirmText: _this.$i18nMsg('basic-confirm'),
      cancelText: _this.$i18nMsg('basic-cancel'),
    });
  }
  return video;
};

export const PREVIEW_DOWNLOAD_FILE = (file, _this) => {
  //文件下载
  const { url } = file;
  if (!url) {
    uni.showModal({
      title: _this.$t('basic-modalTip'), // 中文：'提示'
      content: '没有下载路径',
      confirmText: _this.$t('basic-confirm'),
      cancelText: _this.$t('basic-cancel'),
    });
    return;
  }
  uni.downloadFile({
    //下载后文件会存在临时路径中，因为下次不想想再下载将文件存储到实际路径中，以便下次获取
    url: url,
    success: function (res) {
      var filePath = res.tempFilePath;
      uni.saveFile({
        tempFilePath: filePath,
        success(saveRes) {
          var savedFilePath = saveRes.savedFilePath;
          uni.showModal({
            title: _this.$t('basic-modalTip'), // 中文：'提示'
            content: `文件保存路径:${savedFilePath}`,
            confirmText: _this.$t('basic-confirm'),
            cancelText: _this.$t('basic-cancel'),
          });
        },
      });
    },
  });
};
