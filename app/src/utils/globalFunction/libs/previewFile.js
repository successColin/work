import { downloadFile } from '@/api/menuConfig.js';
import { getComServeUrl, getComToken, getComUrlByToken } from './common';
// 预览文件
const watermarkType = ['.jpg', '.jpeg', '.png', '.pdf']; // 水印文件类型

// 获取文件的后缀
const getFileSuffix = function (name) {
  if (!name) return '.jpg';
  const type = name
    .substring(name.lastIndexOf('.'), name.length)
    .toLocaleLowerCase();
  return type || '.jpg';
};
// 根据文件后缀获取文件类型
const getFileType = function (fileSuffix) {
  if (
    ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'].indexOf(
      fileSuffix
    ) !== -1
  ) {
    return 'file';
  }
  if (['.mp4', '.webm', '.ogg'].indexOf(fileSuffix) !== -1) {
    return 'video';
  }
  if (['.mp3'].indexOf(fileSuffix) !== -1) {
    return 'audio';
  }
  if (['.jpg', '.jpeg', '.png', '.gif', '.svg'].indexOf(fileSuffix) !== -1) {
    return 'image';
  }
  return 'other';
};

// 根据名称获取文件对应图标名称
const getFileIconName = function (name) {
  console.log('getFileIconName======================');
  if (!name) return 'appIcon-qitawenjian';
  const currentFileSuffix = getFileSuffix(name);
  console.log(currentFileSuffix);

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
const previewImage = function (images, index) {
  if (images.length === 0) return;
  if (typeof images === 'string') images = [images];
  console.log(images);
  const urls = images.map((item) => item.url);
  uni.previewImage({
    current: index,
    urls,
  });
};

// 文件预览，h5只有pdf才可以在线预览
// '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt'
// 这些文件都需要先下载下来然后进行预览
const previewFileLoad = async function (fileArry) {
  console.log('previewFileLoad===================');
  if (fileArry.length === 0) return;
  const file = fileArry[0];
  // 如果是H5端，可以直接用webview打开预览，在线预览只有pdf支持
  // #ifdef H5
  if (fileArry.fileSuffix === '.pdf') {
    const filepreviewUrl = `/knowledgeBase/webViewTemplate/index?url=${file.url}&fileName=${file.fileName}`;
    uni.navigateTo({
      url: filepreviewUrl,
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
        console.log(res);
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
const previewFile = function ({
  file,
  current,
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
  let currentIndex = 0;
  file.forEach((item, index) => {
    const fileName = fileParamName ? item[fileParamName] : item;
    const fileSuffix = getFileSuffix(fileName);
    if (currentFileSuffix === fileSuffix) {
      let url = fileParamUrl ? item[fileParamUrl] : item;
      const serveURL = getComServeUrl();
      console.log(serveURL);
      const token = getComToken();
      console.log(token);
      // 如果要加水印，并且该文件格式在水印文件类型中1
      if (isWatermark && watermarkType.indexOf(fileSuffix) !== -1) {
        url = `${serveURL}system/waterMark/addWaterMark?token=${token}&url=${url}`;
      } else url = getComUrlByToken(url);
      console.log(url);
      fileList.push({
        url,
        fileName,
        fileSuffix,
      });
      if (fileName === currentFileName) currentIndex = index;
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
export default {
  getFileSuffix,
  getFileType,
  getFileIconName,
  previewImage,
  previewFile,
};
