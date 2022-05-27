// 开启红外线
export const initMeaTem = function (callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
    uni.showModal({
      title: 'fail',
    });
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'initMeaTem', [callbackID]);
};

// 准备测量,温度,震动,加速度,速度
export const readMeaInit = function (callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
    uni.showModal({
      title: 'fail',
      content: `准备测量${JSON.stringify(code)}`
    });
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'readMeaInit', [callbackID]);
};

// 开始测量,温度,震动,加速度,速度
export const meaTem = function (option, callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
    uni.showModal({
      title: 'fail',
      content: `开始测量${JSON.stringify(code)}`
    });
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'meaTem', [callbackID], option);
};

// 结束测量
export const closeMeaTem = function (callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
    uni.showModal({
      title: 'fail',
      content: `结束测量${JSON.stringify(code)}`
    });
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'closeMeaTem', [callbackID]);
};

// 准备NFC
export const readCardInit = function (callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
    uni.showModal({
      title: 'fail',
      content: `准备NFC${JSON.stringify(code)}`
    });
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'readCardInit', [callbackID]);
};

// 读取NFC
export const readCard = function (callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'readCard', [callbackID]);
};

// 结束读取NFC
export const closeReadCard = function (callback, callbackError) {
  const success = function(args) {
    if (typeof callback === 'function') callback.call(this, args);
  };
  const fail = function(code) {
    if (typeof callbackError === 'function') callbackError.call(this, code);
    uni.showModal({
      title: 'fail',
      content: `关闭NFC${JSON.stringify(code)}`
    });
  };
  const callbackID = plus.bridge.callbackId(success, fail);
  plus.bridge.exec('Inspection', 'closeReadCard', [callbackID]);
};
