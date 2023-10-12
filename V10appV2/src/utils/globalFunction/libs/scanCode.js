// 扫描功能
function scanCode(config = {}) {
  return new Promise((resolve, reject) => {
    const param = {
      onlyFromCamera: false, // 是否只能从相机扫码，不允许从相册选择图片
      hideAlbum: false, // 是否隐藏相册（不允许从相册选择图片），只能从相机扫码
      autoDecodeCharset: true,
    };
    const option = { ...config };
    if (option.success) {
      param.success = function (res) {
        res = option.success.call(res);
        setTimeout(() => {
          resolve(res);
        }, 4);
      };

      delete config.success;
    } else {
      param.success = function (res) {
        setTimeout(() => {
          resolve(res);
        }, 4);
      };
    }

    if (option.fail) {
      param.fail = function (res) {
        res = option.fail.call(res);
        setTimeout(() => {
          reject(res);
        }, 4);
      };

      delete config.fail;
    } else {
      param.fail = function (res) {
        setTimeout(() => {
          reject(res);
        }, 4);
      };
    }

    if (option.complete) {
      delete config.complete;
    }

    // #ifdef H5
    // 如果是h5的，需要判断扫描逻辑是否走定制化逻辑
    if (+config.scanItemType === 2) {
      // 泸州老窖扫描功能
      window.scanready = (result) => {
        param.success({ result });
        window.scanready = null;
        param.success = null;
      };
      window.location.href = 'emobile:QRCode:scanready';
    }
    // #endif
    // #ifndef H5
    // 支持ios，安卓，小程序（除快手）,但精度底
    uni.scanCode(param);
    // #endif
  });
}

// 泸州老窖扫描功能
// function scanCode(uid) {
//   return new Promise((resolve) => {
//     let scanSuccess = (res) => {
//       resolve(res);
//     };
//     window.scanready = (result) => {
//       scanSuccess({ result });
//       window.scanready = null;
//       scanSuccess = null;
//     };
//     window.location.href = 'emobile:QRCode:scanready';
//   });
// }

export default scanCode;
