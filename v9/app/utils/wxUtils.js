// #ifdef H5
import wx from 'weixin-js-sdk';
// #endif

// 配置微信config信息
export function setWxConfig(title) {
  // #ifdef H5
  // config注入的是企业的身份与权限，而agentConfig注入的是应用的身份与权限。
  if (wx) {
    const url = window.location.href.split('#')[0];
    uni.request({
      url: '/eam/sso/wechatLogin',
      method: 'get',
      data: {
        url,
      },
      success: (res) => {
        if (res.data.success) {
          const { nonceStr, timestamp, signature, appId } = res.data.data;
          // 2个小时时效性
          wx.config({
            beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,
            appId, // 必填，企业号的唯一标识
            timestamp, // 必填，生成签名的时间戳 因为签名校验中的timestamp最多只能输入10位
            nonceStr, // 必填，生成签名的随机串
            signature, // 必填，签名
            jsApiList: ['scanQRCode', 'checkJsApi', 'chooseImage'], // 必填，需使用的JS接口列表
          });
          wx.ready(() => {
            console.log('配置完成，扫码前准备完成');
          });
          wx.error(function (res) {
            console.log('出错了：' + res.errMsg);
          });
        } else {
          console.log('获取配置信息返回为空');
        }
      },
      fail: (error) => {
        console.log(error, '请求获取微信配置失败');
      },
    });
  }
  // #endif
}

export function onWxScan(callback) {
  // #ifdef H5
  if (wx) {
    wx.scanQRCode({
      needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
      success: function (res) {
        callback(res);
      },
      fail: function (response) {
        console.log('调用wx.scanQRCode扫码失败');
      },
    });
  }
  // #endif
}
