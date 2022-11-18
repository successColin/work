import { baseUrl, PREFIX, VERSION } from '@/config';
import { Decrypt } from '@/utils';

export function getComIP() {
  let baseURL = baseUrl;
  // #ifdef APP-PLUS
  // 接口请求地址
  baseURL = uni.getStorageSync('currentServe') || baseUrl;
  // #endif
  return baseURL;
}

// 获取token
export function getComToken() {
  let token = uni.getStorageSync('token') || '';
  if (!token) return;

  token = Decrypt(token);
  return token;
}

// 获取服务器地址
export function getComServeUrl() {
  let baseURL = baseUrl;
  // #ifdef APP-PLUS
  // 接口请求地址
  baseURL = uni.getStorageSync('currentServe') || baseUrl;
  // #endif
  // #ifdef H5
  const htt = window.location.protocol;
  const host1 = window.location.host;
  baseURL = `${htt}//${host1}${baseUrl}`;
  // #endif
  baseURL =
    process.env.NODE_ENV === 'development'
      ? `${baseURL}${PREFIX}/${VERSION}/`
      : `${baseURL}${PREFIX}/${VERSION}/`;

  return baseURL;
}

// 给图片带上token
const formatUrl = (url, params = {}, isToken = true) => {
  let paramUrl = '';
  if (url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
    paramUrl = url;
  } else {
    let baseURL = baseUrl;
    // #ifdef APP-PLUS
    // 接口请求地址
    baseURL = uni.getStorageSync('currentServe') || baseUrl;
    // #endif
    // #ifdef H5
    const htt = window.location.protocol;
    const host1 = window.location.host;
    baseURL = `${htt}//${host1}${baseUrl}`;
    // #endif
    let token = uni.getStorageSync('token') || '';
    if (token) token = Decrypt(token);

    paramUrl = `${baseURL}${url}?`;
    console.log(isToken);
    if (isToken) {
      paramUrl += `token=${token}`;
      Object.keys(params).forEach((key) => {
        paramUrl += `&${key}=${params[key]}`;
      });
    } else {
      Object.keys(params).forEach((key, index) => {
        if (index !== 0) {
          paramUrl += '&';
        }
        paramUrl += `${key}=${params[key]}`;
      });
    }
  }
  return paramUrl;
};

// 判断icon是否是图片还是图标
// 如果是图片需要判断是否带http或者https，如果没有默认要将服务器地址拼上，并且将token也带上
// icon里需要包含icon，imageUrl属性
// canSplitIcon : 是否需要切分，为了兼容uview的u-icon插件
export function getComIconUrl(icon = {}, canSplitIcon) {
  const { icon: iconName, imageUrl } = icon;
  if (!iconName && !imageUrl) return;

  let iconUrl = iconName;
  if (canSplitIcon) iconUrl = iconName && iconName.split('-')[1];
  if (imageUrl) iconUrl = formatUrl(imageUrl);

  return iconUrl;
}

export function getComUrlByToken(url, params, isToken) {
  return formatUrl(url, params, isToken);
}
