// #ifdef H5
import ZheZhengdd from 'gdt-jsapi';
// #endif

// 浙政钉获取 code
export async function getDingDingCode() {
  // #ifdef H5
  const ua = navigator.userAgent.toLowerCase();
  let getCode = '';
  if (ua.indexOf('saas') > -1) {
    // 浙政钉隐藏 title
    ZheZhengdd.hideTitleBar();
    await ZheZhengdd.getAuthCode({}).then((result) => {
      const { code } = result;
      if (code) {
        getCode = code;
      }
    });
  }
  return getCode;
  // #endif
}

// 浙政钉隐藏 title
export async function hidddleDingDingTitle() {
  console.log(1111);
}
