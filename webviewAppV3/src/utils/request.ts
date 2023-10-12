/**
 * @description [ axios 请求封装]
 */
import axios from 'axios';
// import { Message, Modal } from 'view-design' // UI组件库
// 根据环境不同引入不同api地址
import { config, whitePathName } from '@/config';
import { Encrypt } from '@/utils/utils';
import qs from 'qs';
import { Toast } from 'vant';

// import { showNotify } from 'vant';

// 3.响应拦截器
const errorCode = {
  400: '错误请求',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求错误,未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'http版本不支持该请求',
};

class FetchData {
	baseURL: string
	timeout: number
	withCredentials: boolean
	loadingInstance: any
  constructor() {
		this.baseURL = config.baseApi;
    this.timeout = 300000000; // 设置超时时间
    this.withCredentials = true;
    this.loadingInstance = null;
  }

  resolveData(data) {
    // 没参数不做处理返回
    if (!data || !data.logData) {
      return data;
    }
    if (data.logData.content) {
      return data;
    }
    return data;
  }

  setInterceptor(instance) {
    // 设置拦截器
    instance.interceptors.request.use(
      (config) => {
        console.log(this)
        // 打开loading
				if (config.showLoading) {
					// loading 框
          Toast.loading({
              message: '加载中...',
              forbidClick: true,
          })
        }
        if (
          config.method === 'post' ||
          config.method === 'put' ||
          config.method === 'patch'
        ) {
          config.data = this.resolveData(config.data);
          console.log(config.headers)
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
          config.params = this.resolveData(config.params);
          config.headers['Content-Type'] = 'multipart/form-data';
          config.headers['Cache-Control'] = 'no-cache';
          config.headers.Pragma = 'no-cache';
          config.paramsSerializer = function (params) {
            return qs.stringify(params, { allowDots: true });
          };
        }
        
        // // token
        // if (
        //   config.url !== 'login' ||
        //   config.url !== 'zwdingtalkScanLogin' ||
        //   config.url !== 'zwdingtalkLogin' ||
        //   config.url !== 'exchangeTokenLogin'
        // ) {
        //   const { hasOwnProperty } = Object.prototype;
        //   if (
        //     hasOwnProperty.call(config.data || {}, 'cToken') ||
        //     hasOwnProperty.call(config.params || {}, 'cToken')
        //   ) {
        //     config.headers.token = config.data?.cToken || config.params?.cToken;
        //   } else {
        //     config.headers.token = Decrypt(localStorage.getItem('token') || '');
        //   }
        // }

        if (localStorage.apiotLanguage) {
          const language = localStorage.apiotLanguage.split('');
          language.splice(2, 0, '-');
          config.headers['Accept-Language'] = language.join('');
        }
        return config;
      },
      (err) => Promise.reject(err),
    );

    instance.interceptors.response.use(
      (res) => {
        Toast.clear();
        // console.log(res);
        if (
          res.config.url === 'login' ||
          res.config.url === 'zwdingtalkScanLogin' ||
          res.config.url === 'zwdingtalkLogin' ||
          res.config.url === 'exchangeTokenLogin'
        ) {
          const token = res.headers.token || '';
          localStorage.setItem('token', Encrypt(token));
        }
        if (res.config.url === 'system/ssoLogin/getToken') {
          const token = res.data.data || '';
          localStorage.setItem('token', Encrypt(token));
        }
        // 关闭loading
        if (res.config.showLoading) {
          this.loadingInstance.close();
        }
        if (res.data instanceof Blob) {
          return res.data;
        }
        const codeNumber = res.data.code;

        if (codeNumber === '00000') {
          // 处理noData
          const nodeArr = document.getElementsByClassName('apiotHiddenNoData');
          if (nodeArr.length) {
            Array.from(nodeArr).forEach((ele) => {
              ele.classList.remove('apiotHiddenNoData');
            });
          }
          return res.data.data;
        }
        if (codeNumber === '00001') {
          // setTimeout(() => {
          // resetMessage.warning({
          //   showClose: true,
          //   duration: 0,
          //   message: res.data.message,
          // });
          // }, 2000);
          // 树节点数据过多
          res.data.data.isMore = true;
          return res.data.data;
        }
        if (codeNumber === 'B0001') {
          return Promise.reject(res.data.data);
        }
        if (codeNumber === 'DD002') {
          return Promise.reject(res.data);
        }
        if (!res.config.showMsg) {
          console.log(res, codeNumber);
          if (codeNumber === 'B0002') {
            // resetMessage.warning({
            //   showClose: true,
            //   message: '未知查询语句',
            // });
          } else {
            // resetMessage.warning({
            //   showClose: true,
            //   message: res.data.message,
            // });
          }
        }
        return Promise.reject(res.data);
      },
      // 登录失效，账号禁用等处理
      (error) => {
        console.log(error);
        Toast.clear();
        const errMsg = error.message || '';
        if (error.code === 'DD002') {
          return Promise.reject(error);
        }
        if (errMsg.indexOf('401') !== -1) {
          const pathArr = window.location.pathname.split('/');
          const pathName = pathArr[pathArr.length - 1];
          if (!whitePathName.includes(pathName) || pathName === '404') {
            // window.location.href = '/login';
            const ignoreArr = ['system/sysMenu/menuCenter'];
            if (!ignoreArr.includes(error.response.config.url)) {
              // resetMessage.warning({
              //   showClose: true,
              //   message: '登录失效',
              // });
            }
            localStorage.removeItem('token');
            sessionStorage.clear();
          }

          return Promise.reject(error);
        }
        if (this.loadingInstance) {
          // this.loadingInstance.close();
        }
        /** *** 接收到异常响应的处理开始 **** */
        if (error && error.response) {
          // 1.公共错误处理
          // 2.根据响应码具体处理
          const code = error.response.status || 0;
          const errorMsg = `${errorCode[code] || '连接错误'}`;
          // if (code === 401) console.log('无权限做的出来');
          // resetMessage.warning({
          //   showClose: true,
          //   message: errorMsg,
          // });
        } else if (JSON.stringify(error).includes('timeout')) {
          // 超时处理
          // resetMessage.warning({
          //   showClose: true,
          //   message: '服务器响应超时，请刷新当前页',
          // });
        } else {
          // 超时处理
          // resetMessage.warning({
          //   showClose: true,
          //   message: '接口数据异常',
          // });
        }
        // return new Promise((resolve, reject) => { reject(new Error('something bad happened')) })
        return Promise.reject(error);
      },
    );
  }

  request(request, baseURL = '') {
    const instance = axios.create();
    // 合并配置
    const config = {
      ...request,
      baseURL: baseURL || this.baseURL,
      timeout: this.timeout,
			withCredentials: this.withCredentials,
    };
    this.setInterceptor(instance);

    return instance(config);
  }
}
export default new FetchData();
