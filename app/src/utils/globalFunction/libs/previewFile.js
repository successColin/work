import { downloadFile } from '@/api/menuConfig.js';
import { getComServeUrl, getComToken, getComUrlByToken } from './common';

// 图片展示时，计算图片的偏移量
// areaH:展示区域高度
// imageH:图片高度
const calculateOffset = function (areaH, imageH) {
  const d = imageH - areaH;
  const x = Math.round(d / areaH);
  if (x <= 0.5) return 0;
  return Math.round(d * 0.25);
};

// 预览文件
const watermarkType = ['.jpg', '.jpeg', '.png', '.pdf']; // 水印文件类型

// 获取文件的后缀
const getFileSuffix = function(name) {
  if (!name) return '.jpg';
  const type = name
    .substring(name.lastIndexOf('.'), name.length)
    .toLocaleLowerCase();
  return type || '.jpg';
};
// 根据文件后缀获取文件类型
const getFileType = function(fileSuffix) {
  if (
    ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'].indexOf(
      fileSuffix,
    ) !== -1
  ) {
    return 'file';
  }
  if (['.mp4', '.webm', '.ogg'].indexOf(fileSuffix) !== -1) {
    return 'video';
  }
  if (['.mp3', '.amr'].indexOf(fileSuffix) !== -1) {
    return 'audio';
  }
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(fileSuffix) !== -1) {
    return 'image';
  }
  return 'other';
};

// 根据名称获取文件对应图标名称
const getFileIconName = function(name) {
  if (!name) return 'appIcon-qitawenjian';
  const currentFileSuffix = getFileSuffix(name);

  if (currentFileSuffix === '.pdf') {
    return 'appIcon-PDF';
  }
  if (['.doc', '.docx'].indexOf(currentFileSuffix) !== -1) {
    return 'appIcon-DOC';
  }
  if (['.xls', '.xlsx'].indexOf(currentFileSuffix) !== -1) {
    return 'appIcon-XLS';
  }
  if (['.ppt', '.pptx'].indexOf(currentFileSuffix) !== -1) {
    return 'appIcon-PPT';
  }
  if (['.zip', '.rar'].indexOf(currentFileSuffix) !== -1) {
    return 'appIcon-yasuobao';
  }
  if (['.mp4', '.webm', '.ogg'].indexOf(currentFileSuffix) !== -1) {
    return 'appIcon-shipinwenjian';
  }
  if (currentFileSuffix === '.mp3') {
    return 'appIcon-yuyinwenjian';
  }
  if (currentFileSuffix === '.txt') {
    return 'appIcon-TXT';
  }

  return 'appIcon-qitawenjian';
};

// 图片预览
const previewImage = function (images, index = 0) {
  if (images.length === 0) return;
  if (typeof images === 'string') images = [images];
  const urls = images.map((item) => item.url);
  uni.previewImage({
    current: index,
    urls,
  });
};

// 文件预览，h5只有pdf才可以在线预览
// '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'
// 这些文件都需要先下载下来然后进行预览
const previewFileLoad = async function(fileArry) {
  if (fileArry.length === 0) return;
  const file = fileArry[0];
  // 如果是H5端，可以直接用webview打开预览，在线预览只有pdf支持
  // #ifdef H5
  if (file.fileSuffix === '.pdf') {
    const filepreviewUrl = `/knowledgeBase/webViewTemplate/index?url=${file.url}&fileName=${file.fileName}`;
    uni.navigateTo({
      url: filepreviewUrl,
    });
  } else {
    uni.showModal({
      title: '提示',
      content: `后缀为${file.fileSuffix}无法支持在线预览，请下载后查看`,
    });
  }
  // #endif

  // 如果是app、小程序，采用先下载在打开的方式
  // #ifndef H5
  try {
    const filePath = await downloadFile(file.url, false);
    uni.openDocument({
      filePath,
      success(res) {
        console.log('打开文档成功');
      },
      fail(error) {
        console.log(error);
      },
    });
  } catch (error) {
    console.error(error);
  }
  // #endif
};

// 预览文件
const previewFile = function({
  file,
  current,
  currentIndex = -1,
  isWatermark,
  fileType,
  fileParamUrl = '',
  fileParamName = '',
  openType = '', // 预览方式
}) {
  if (!file) return;
  if (typeof file === 'string') file = [file];
  if (file.length === 0) return;

  // eslint-disable-next-line prefer-destructuring
  if (!current) current = file[0];

  const currentFileName = fileParamName ? current[fileParamName] : current;
  const currentFileSuffix = getFileSuffix(currentFileName);
  let currentFileType = fileType;

  // 如果没有要预览的文件类型，那么从当前的文件名中取文件类型
  if (!currentFileType) {
    currentFileType = getFileType(currentFileSuffix) || 'image';
  }

  const fileList = [];
  file.forEach((item, index) => {
    const fileName = fileParamName ? item[fileParamName] : item;
    const fileSuffix = getFileSuffix(fileName);
    const fileType1 = getFileType(fileSuffix);

    if (currentFileType === fileType1) {
      let url = fileParamUrl ? item[fileParamUrl] : item;
      const serveURL = getComServeUrl();
      const token = getComToken();
      // 如果要加水印，并且该文件格式在水印文件类型中1
      let pdfUrl = '';
      if (isWatermark && watermarkType.indexOf(fileSuffix) !== -1) {
        url = `${serveURL}system/waterMark/addWaterMark?url=${url}`;
        pdfUrl = url; // 为兼容h5情况下的在线pdf预览
        url = `${url}&token=${token}`;
      } else url = getComUrlByToken(url);
      fileList.push({
        url,
        fileName,
        fileSuffix,
        // pdfUrl,
      });
      if (currentIndex === -1 && fileName === currentFileName) {
        currentIndex = index;
      }
    }
  });
  if (currentFileType === 'image') previewImage(fileList, currentIndex);
  else if (currentFileType === 'file') previewFileLoad(fileList);

  if (openType === 'pdf') {
    previewFileLoad([
      {
        url: file[0],
        fileSuffix: '.pdf',
      },
    ]);
  }
};

// 下载
// 获取文件之后进行下载
// file:{url,name}
const fileDownLoad = async ({ file, isWatermark = false }) => {
  if (!file) return;
  try {
    const filename = file.name;
    const currentFileSuffix = getFileSuffix(filename);
    let { url } = file;
    if (isWatermark && watermarkType.indexOf(currentFileSuffix) !== -1) {
      const serveURL = getComServeUrl();
      const token = getComToken();
      url = `${serveURL}system/waterMark/addWaterMark?url=${url}&token=${token}`;
    } else url = getComUrlByToken(url);
    const filePath = await downloadFile(file.url, false);
    const currentFileType = getFileType(currentFileSuffix) || 'image';
    // #ifdef H5
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(filePath, filename);
    } else {
      const link = document.createElement('a');
      const body = document.querySelector('body');

      link.href = filePath;
      link.download = filename;

      // fix Firefox
      link.style.display = 'none';
      body.appendChild(link);

      link.click();
      body.removeChild(link);

      window.URL.revokeObjectURL(link.href);
    }
    // #endif
    // #ifndef H5
    if (currentFileType === 'image') {
      uni.saveImageToPhotosAlbum({
        filePath,
        success() {
          uni.showToast({
            icon: 'none',
            title: '下载成功,已经存入相册',
          });
        },
      });
    } else if (currentFileSuffix === '.mp4') {
      uni.saveVideoToPhotosAlbum({
        filePath,
        success() {
          uni.showToast({
            icon: 'none',
            title: '下载成功,已经存入相册',
          });
        },
      });
    } else {
      uni.saveFile({
        tempFilePath: filePath, // 文件的临时路径
        success(res) {
          const { savedFilePath } = res;
          uni.showToast({
            icon: 'none',
            title: `下载成功,地址${savedFilePath}`,
          });
          uni.openDocument({
            filePath: savedFilePath,
          });
        },
        fail(err) {
          console.log(err);
        },
      });
    }

    // #endif
  } catch (error) {
    console.error(error);
  }
};
export default {
  getFileSuffix,
  getFileType,
  getFileIconName,
  previewImage,
  previewFile,
  fileDownLoad,
  calculateOffset,
};
