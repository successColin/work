/*
 * @Author: sss
 * @Date: 2021-06-17 14:46:02
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-11 13:57:23
 */
import axios from 'axios';
import axiosAdapterUniapp from 'axios-adapter-uniapp';
import qs from 'qs';
import { baseUrl, PREFIX, VERSION, whitePathName } from '../config';
import { Decrypt, Encrypt } from '../utils';

class FetchData {
  constructor() {
    this.baseURL =
      process.env.NODE_ENV === 'development'
        ? `${baseUrl}${PREFIX}/${VERSION}/`
        : `${baseUrl}${PREFIX}/${VERSION}/`; // 请求路径
    this.timeout = 300000000; // 设置超时时间
    this.withCredentials = true;
  }

  // 数据处理
  resolveData(data) {
    // 没参数不做处理返回
    if (!data || !data.logData) {
      return data;
    }
    const userCenter = uni.getStorageSync('userCenter');
    const { username, account } = userCenter;
    // 没有需要转换的logdata直接返回
    if (typeof data.logData !== 'object') {
      const curMenuId = uni.getStorageSync('curMenuId') || -1;
      const tempObj = {
        content: Encrypt(`${username}(${account})${data.logData}`),
        clientType: 'APP',
        curMenuId,
      };
      data.logData = tempObj;
      return data;
    }
    let str = '';
    let operateStr = '';
    // 新增编辑操作
    if ([1, 2].includes(data.logData.operateType)) {
      operateStr = data.logData.operateStr;
      const keys = Object.keys(data);
      keys.forEach((key) => {
        const tempObj = data.logData[key];
        if (tempObj) {
          if (tempObj.transFormArr) {
            const value = tempObj.value || 'value';
            const name = tempObj.key || 'name';

            const index = tempObj.transFormArr.findIndex(
              (item) => item[value] === data[key]
            );
            if (index !== -1) {
              str += `${tempObj.name}:${tempObj.transFormArr[index][name]},`;
            } else {
              // 数组直接转化为一个值
              let tempStr = '';
              tempObj.transFormArr.forEach((item) => {
                tempStr += `${item[name]},`;
              });
              str += `${tempObj.name}:${tempStr},`;
            }
          } else if (tempObj.showStr) {
            // 指定展示内容
            str += `${tempObj.name}:${tempObj.showStr},`;
          } else {
            str += `${tempObj.name}:${data[key]},`;
          }
        }
      });
    } else if (data.logData.operateType === 3) {
      // 删除数据
      operateStr = data.logData.operateStr;
      const value = data.logData.value || 'value';
      // const name = data.logData.key || 'id';
      data.logData.deleteArr.forEach((item) => {
        str += `(${data.logData.name}:${item[value]}),`;
      });
    } else if (data.logData.operateType === 4) {
      // 移动数据
      operateStr = data.logData.operateStr;
      str = `(${data.logData.name}:${data.logData.switchName}),`;
    }
    const result = `${username}(${account})${operateStr}:${str}`;
    const curMenuId = uni.getStorageSync('curMenuId');
    data.logData = {
      content: Encrypt(result.slice(0, -1)),
      clientType: 'APP',
      curMenuId,
    };
    return data;
  }

  setInterceptor(instance) {
    // 设置连接器
    instance.interceptors.request.use(
      (config) => {
        if (
          config.method === 'post' ||
          config.method === 'put' ||
          config.method === 'patch'
        ) {
          // 处理请求参数
          config.data = this.resolveData(config.data);
          if (config.hasArray) {
            config.headers['Content-Type'] = 'application/json';
          } else if (
            config.headers['content-type'] !== 'multipart/form-data' &&
            config.headers['content-type'] !== 'application/json'
          ) {
            config.data = qs.stringify(config.data, {
              arrayFormat: 'indices',
              allowDots: true,
            });
          }
        } else {
          // #ifndef MP-ALIPAY
          config.data = this.resolveData(config.params);
          // #endif
          config.headers['Content-Type'] = 'multipart/form-data';
          config.headers['Cache-Control'] = 'no-cache';
          config.headers.Pragma = 'no-cache';
          // config.url = `${config.url}?${qs.stringify(config.params, {})}`;
          config.paramsSerializer = function (params) {
            return qs.stringify(params, {
              arrayFormat: 'indices',
              allowDots: true,
            });
          };
        }
        // 在白名单中的接口不用带token
        if (whitePathName.indexOf(config.url) === -1) {
          config.headers.token = Decrypt(uni.getStorageSync('token') || '');
        }
        // 针对get类型 对于支付宝小程序需要做特殊的兼容
        // #ifdef MP-ALIPAY
        // params 必须为空否则将会产生2个一模一样的变量
        // 传递进去的url如果要带参数，需要 url?id=1
        if (config.method === 'get' && config.params) {
          const buildURL = require('axios/lib/helpers/buildURL');
          config.url = buildURL(
            config.url,
            config.params,
            config.paramsSerializer
          );
          if (config.params) delete config.params;
        }
        // #endif
        const apiotLanguage = uni.getStorageSync('apiotLanguage');
        if (apiotLanguage) {
          const language = apiotLanguage.split('');
          language.splice(2, 0, '_');
          config.headers['Accept-Language'] = language.join('');
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (res) => {
        const { config } = res;
        if (Array.isArray(res.header)) {
          // 兼容钉钉小程序返回的头信息，钉钉小程序返回的头信息为数组，需要将数组转换为对象
          res.header = Object.assign({}, ...res.header);
        }
        if (res.config.url === 'login') {
          const token = res.header.token || '';
          uni.setStorageSync('token', Encrypt(token));
        }
        const codeNumber = res.data.code;
        // 如果返回是非标准数据
        if (config.isNonstandard) {
          return res.data;
        }
        if (codeNumber === '00000') {
          return res.data.data;
        }
        if (codeNumber === 'B0001') {
          return Promise.reject(res.data.data);
        }
        return Promise.reject(res.data);
      },
      (error) => {
        console.error(`===================ERROR${error}`);
        let code = null;
        if (error && error.response) code = error.response.status;
        if (code === 401) {
          uni.reLaunch({
            url: '/pages/index/index',
          });
          return;
        }
        return Promise.reject(error);
      }
    );
  }

  request(request, baseURL) {
    // #ifdef APP-PLUS
    // 接口请求地址
    const currentServe = uni.getStorageSync('currentServe');
    if (currentServe && !baseURL) {
      baseURL = currentServe;
      baseURL =
        process.env.NODE_ENV === 'development'
          ? `${baseURL}${PREFIX}/${VERSION}/`
          : `${baseURL}${PREFIX}/${VERSION}/`;
    }
    // #endif

    const instance = axios.create();

    const config = {
      ...request,
      baseURL: baseURL || this.baseURL,
      adapter: axiosAdapterUniapp, // 适配器
      timeout: this.timeout,
      withCredentials: this.withCredentials,
    };

    this.setInterceptor(instance);

    return instance(config);
  }

  uploadFile(request, baseURL) {
    // #ifdef APP-PLUS
    // 接口请求地址
    const currentServe = uni.getStorageSync('currentServe');
    if (currentServe && !baseURL) {
      baseURL = currentServe;
      baseURL =
        process.env.NODE_ENV === 'development'
          ? `${baseURL}${PREFIX}/${VERSION}/`
          : `${baseURL}${PREFIX}/${VERSION}/`;
    }
    // #endif

    return new Promise((resolve, reject) => {
      const config = { ...request };
      const { header } = config;
      if (!header) config.header = {};

      config.header.token = Decrypt(uni.getStorageSync('token') || '');
      config.url = `${baseURL || this.baseURL}${config.url}`;
      config.name = config.name || 'files';
      config.success = function (uploadFileRes) {
        let uploadData = uploadFileRes.data;
        if (uploadData && typeof uploadData === 'string') {
          uploadData = JSON.parse(uploadData);
        }
        const codeNumber = uploadData.code;
        // 如果返回是非标准数据
        if (config.isNonstandard) {
          resolve(uploadData);
        }
        if (codeNumber === '00000') {
          resolve(uploadData.data);
        }
        if (codeNumber === 'B0001') {
          reject(uploadData.data);
        }
      };
      // if (config.files) {
      //   config.files = qs.stringify(config.files, {
      //     arrayFormat: 'indices',
      //     allowDots: true,
      //   });
      // }
      config.error = function (error) {
        reject(error);
      };
      uni.uploadFile(config);
    });
  }
}

export default new FetchData();
