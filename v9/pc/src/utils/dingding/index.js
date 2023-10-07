import ZheZhengdd from 'gdt-jsapi';

export const getDingDingCode = async() => {
  const ua = navigator.userAgent.toLowerCase();
  let getCode = '';
  if (ua.indexOf('saas') > -1) {
    return await ZheZhengdd.getAuthCode({}).then(result => {
      if (result) {
        return result.auth_code;
      }
    });
  } else {
    const href = window.location.href.split('?')[1];
    let params = '';
    if (href) {
      const index = href.indexOf('#/');
      const search = href.slice(0, index);
      params = search && search.split('=')[1];
    }
    return new Promise((res, rej) => {
      res(params);
    });
  }
};
