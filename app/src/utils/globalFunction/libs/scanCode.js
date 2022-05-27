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
        resolve(res);
      };

      delete config.success;
    } else {
      param.success = function (res) {
        resolve(res);
      };
    }

    if (option.fail) {
      param.fail = function (res) {
        res = option.fail.call(res);
        reject(res);
      };

      delete config.fail;
    } else {
      param.fail = function (res) {
        reject(res);
      };
    }

    if (option.complete) {
      delete config.complete;
    }

    // 支持ios，安卓，小程序（除快手）,但精度底
    uni.scanCode(param);
  });
}

export default scanCode;
