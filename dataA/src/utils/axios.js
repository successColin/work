/**
 * @name: axios
 * @author: DELL
 * @date: 2021/11/27 11:54
 * @description：axios
 * @update: 2021/11/27 11:54
 */
import qs from 'qs';
import axios from 'axios';
import {message} from '@/utils/message';
import {PREFIX, V} from '@/constants/config';
import query from '@/constants/query';

const headers = {
  'content-type': 'application/x-www-form-urlencoded', // 转换为key=value的格式必须增加content-type
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': 'X-Requested-width, Content-type',
  'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
};

const loginUrl = `${PREFIX}/v${V}/login`; // 登录接口

axios.defaults.withCredentials = true;

const instance = axios.create({
  baseURL: '/',
  timeout: 300000,
  headers
});

let cancel, promiseArr = {};
// const CancelToken = axios.CancelToken;

// 2.请求拦截器
instance.interceptors.request.use(config => {
  //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
  if (config.cancelRepeat) { // 请求中接口只请求一次
    if (promiseArr[config.url]) { // 发起请求时，取消掉当前正在进行的相同请求
      promiseArr[config.url]('cancel 操作取消');
      promiseArr[config.url] = cancel;
    } else {
      promiseArr[config.url] = cancel;
    }
  }
  const {method, params = {}, contentType, headers} = config;
  const {...rest} = params;
  if (method.toLowerCase() === 'get') {
    config.params = rest;
  } else if (contentType.toLocaleLowerCase() === 'json') {
    config.headers = {
      ...headers,
      'content-type': 'application/json;charset=UTF-8'
    }
    delete config.params;
    config.data = rest;
  } else if (contentType.toLowerCase() === 'file') {
    config.headers = {
      ...headers,
      'content-type': 'multipart/form-data'
    }
    config.data = params;
  } else if (contentType.toLowerCase() === 'form') {
    config.headers = {
      ...headers,
      'content-type': 'application/x-www-form-urlencoded'
    }
    config.data = qs.stringify(rest);
    delete config.params;
  }
  config.headers.token = localStorage.getItem('screenToken') || '';
  if (window.vue.$route.name === 'menu' && window.vue.$route.query.designTypePreview !== 'APP') {
    const { id } = window.vue.$route.params;
    const loginPagesShareTokenMapString = localStorage.getItem('loginPagesShareTokenMap');
    const loginPagesShareTokenMap = JSON.parse(loginPagesShareTokenMapString) || {};
    config.headers.shareToken = loginPagesShareTokenMap[id] || '';

    const loginPagesTokenMapString = localStorage.getItem('loginPagesTokenMap');
    const loginPagesTokenMap = JSON.parse(loginPagesTokenMapString) || {};
    if (loginPagesTokenMap[id]) {
      config.headers.token = loginPagesTokenMap[id];
    } else {
      delete config.headers.token;
    }
    // delete config.headers.token;
    // if (query.MENU_CHECK_OVERDUE === config.url) {
    //   delete config.headers.token;
    // }
  }
  if (query.LOGIN_DO_LOGIN === config.url) {
    delete config.headers.token;
  }
  return config
}, error => {
  Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  const {status, data: {code, data, message: info}, config: {url, noCheck}, headers: {token}} = response;
  if (status === 200 && noCheck) {
    return response.data;
  }
  if (status === 200 && code === 'A0205') {
    // alert(url);
    localStorage.removeItem('screenToken');
    window.vue.$router.push('/login');
    return Promise.reject(data);
    ;
  }
  if (status === 200 && code === '00000') {
    if (loginUrl === url) {
      localStorage.setItem('screenToken', token);
      return {token, ...data }
    }
    return data;
  }
  if (status === 200 && code === 'A0204') {
    /**todo
     * 后端就说codeA0204需要登录，不想改，只能这么处理
     */
    return {publish: 4};
  }
  if (status === 200 && code === 'SH004') { // 发布过期需到过期界面
    window.vue.$router.push('/expired');
    return response.data;
  }
  message.error(info || '请求错误');
  return Promise.reject(response);
}, function (error) {
  // 对响应错误做点什么
  message.error('请求错误');
  return Promise.reject(error);
});


const fetch = (config) => {
  return instance(config)
}
export default fetch;
