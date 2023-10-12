/**
 * Request 0.0.8
 * @Class uni-app request网络请求库
 * @Author lu-ch
 * @Date 2019-07-11
 * @Email webwork.s@qq.com
 * http://ext.dcloud.net.cn/plugin?id=392
 * **/
export default class Request {
  config = {
    baseUrl: '',
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }
  
  requestUrls = []//记录请求的接口

  static posUrl (url) { /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  interceptor = {
    request: (f) => {
      if (f) {
        this.requestBeforeFun = f
      }
    },
    response: (f) => {
      if (f) {
        this.requestComFun = f
      }
    }
  }

  static requestBeforeFun (config) {
    return config
  }

  static requestComFun (response) {
    return response
  }

  setConfig (f) {
    this.config = f(this.config)
  }

  request (options = {}) {
		if(options.submitUrl) options.baseUrl = options.submitUrl // 如果有提交url，那么baseUrl修改为需要提交的url
		else options.baseUrl = this.config.baseUrl
		
    options.dataType = options.dataType || this.config.dataType
    options.responseType = options.responseType || this.config.responseType
    options.url = Request.posUrl(options.url) ? options.url : (options.baseUrl + options.url)
    options.data = options.data || {}
    options.header = Object.assign({},this.config.header,options.header) 
    options.method = options.method || this.config.method
	const _this = this
    return new Promise((resolve, reject) => {
      let next = true
      let _config = null
	  let example = null
      options.complete = (response) => {
		  const index = _this.requestUrls.indexOf(options.url)
		  if(index!==-1) {_this.requestUrls.splice(index, 1)}
				// if(_this.requestUrls.length === 0) uni.hideNavigationBarLoading();//隐藏加载动画
        let statusCode = response.statusCode
        response.config = _config
        response = this.requestComFun(response)
        if (statusCode === 200) { // 成功
					const data = response.data || {}
					if(options.iSNonstandard){//是否非标
						//如果返回的数据是非标的，默认返回后端返回的所有信息
						resolve(response)
					}else{
						//如果返回的数据是标准的，默认判断success：true为成功；false不成功
						if(data.success) resolve(response)
						else reject(data.msg)
					}
        } else {
					reject(response)
        }
      }
      let cancel = (t = 'handle cancel', config = options) => {
        let err = {
          errMsg: t,
          config: config
        }
        reject(err)
        next = false
      }

      _config = { ...this.requestBeforeFun(options, cancel) }
      if (!next) return
	  
	  //记录现在请求的接口数据，如果没有接口则显示加载电话
	  // if(this.requestUrls.length === 0) uni.showNavigationBarLoading();//显示加载动画
	  this.requestUrls.push(options.url)
	  
      example = uni.request(_config)
    })
  }

  get (url, data, options = {}) {
    return this.request({
      url,
      data,
      method: 'GET',
      ...options
    })
  }

  post (url, data, options = {}) {
	  
    return this.request({
      url,
      data,
      method: 'POST',
      ...options
    })
  }
  
  del (url, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...options
    })
  }
  
  // 停止发送请求
    stop (obj) {
        if (obj && obj.example && obj.example.abort) {
            obj.example.abort();
        } else {
			throw new Error('[request error]: 参数错误, 无法停止发送请求');
        }
    }
}
