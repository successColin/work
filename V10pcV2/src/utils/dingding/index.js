import { getQueryObj } from '@/utils/utils';
// import getAuthCode from 'gdt-jsapi/getAuthCode';

// 获取浙政钉code
export function getDingDingCode() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('saas') > -1) {
    // eslint-disable-next-line no-undef
    return dd.getAuthCode({}).then((result) => {
      if (result) {
        return result.auth_code;
      }
    });
  }
  const params = getQueryObj().auth_code;
  return new Promise((res) => {
    res(params);
  });
}

// 获取el当前位子
export function getDingDingCode1() {}
