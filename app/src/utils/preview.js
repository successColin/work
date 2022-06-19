const previewImage = (current, urls = []) => {
  // 预览图片
  uni.previewImage({
    current,
    urls: urls.length > 0 ? urls : [current],
  });
};
const appDownloadFile = (file) => {
  // 下载文件
  const { url } = file;

  uni.downloadFile({
    // 下载后文件会存在临时路径中，因为下次不想想再下载将文件存储到实际路径中，以便下次获取
    url,
    success: (res) => {
      console.log(res);
      const filePath = res.tempFilePath;
      // const previewFile = {};
      // previewFile[id] = filePath;
      // _this.SET_COM_PREVIEWFILEPATHS(previewFile);

      uni.openDocument({
        filePath,
        success() {
          console.log('打开文档成功');
        },
      });
    },
  });
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
  // 文件预览
  const { name, url } = file;
  const typeArray = name.split('.');
  let type = typeArray[typeArray.length - 1];
  const picTypes = ['jpg', 'jpeg', 'png'];
  const previewTypes = [
    'pdf',
    'txt',
    'doc',
    'xls',
    'ppt',
    'docx',
    'xlsx',
    'pptx',
  ];
  const video = {};
  // // #ifdef H5
  // previewTypes = ['pdf', 'txt', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx'];
  // // #endif
  // // #ifndef H5
  // previewTypes = ['pdf', 'txt', 'doc', 'xls', 'ppt', 'docx', 'xlsx', 'pptx'];
  // // #endif
  if (type) type = type.toLowerCase();
  console.log(type);
  if (picTypes.indexOf(type) !== -1) {
    // 如果是图片类型的直接预览
    previewImage(url);
  } else if (previewTypes.indexOf(type) !== -1) {
    // 如果是直接可以预览的文件，比如pdf与txt
    // 如果是H5端，可以直接用webview打开
    // #ifdef H5
    const filepreviewUrl = `/pages/webViewTemplate/index?url=${url}&fileName=${name}`;
    uni.navigateTo({
      url: filepreviewUrl,
    });
    // #endif
    // #ifdef APP-PLUS
    appDownloadFile(file, _this);
    // #endif
  } else if (type === 'mp3') {
    // 如果是MP3
    previewMP3(url);
  } else if (type === 'mp4') {
    // 如果是MP3
    video.type = 'video';
    video.url = url;
  } else {
    uni.showModal({
      title: '提示', // 中文：'提示'
      content: '无法预览', // 中文：'是否打开XX附件查看?'
      confirmText: '确定',
      cancelText: '取消',
    });
  }
  return video;
};

export const PREVIEW_DOWNLOAD_FILE = (file) => {
  // 文件下载
  const { url, name } = file;
  if (!url) {
    uni.showModal({
      title: '提示', // 中文：'提示'
      content: '没有下载路径',
      confirmText: '确定',
      cancelText: '取消',
    });
    return;
  }
  // #ifdef H5
  const link = document.createElement('a');
  const body = document.querySelector('body');

  link.href = url;
  link.download = name;
  link.style.display = 'none';
  body.appendChild(link);

  link.click();
  body.removeChild(link);

  // #endif
  // #ifndef H5
  uni.downloadFile({
    // 下载后文件会存在临时路径中，因为下次不想想再下载将文件存储到实际路径中，以便下次获取
    url,
    success: (res) => {
      console.log(res);
      const filePath = res.tempFilePath;
      uni.saveFile({
        tempFilePath: filePath,
        success(saveRes) {
          console.log(saveRes);
          const { savedFilePath } = saveRes;
          uni.showModal({
            title: '提示', // 中文：'提示'
            content: `下载成功，文件保存路径:${savedFilePath}`,
            confirmText: '确定',
            cancelText: '取消',
          });
        },
      });
    },
  });
  // #endif
};
