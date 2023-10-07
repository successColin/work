import store from '@/store/index'
import Request from './request'

const http = new Request();
const statusCodes = {
	400: '请求错误(400)',
	401: '未授权，请重新登录(401)',
	403: '拒绝访问(403)',
	404: '请求出错(404)',
	406: '格式出错(406)',
	408: '请求超时(408)',
	410: '资源已被删除(410)',
	422: '验证错误(422)',
	500: '服务器错误(500)',
	501: '服务未实现(501)',
	502: '网络错误(502)',
	503: '服务不可用(503)',
	504: '网络超时(504)',
	"request:fail timeout": '网络超时'
} 
let baseUrl = uni.getStorageSync('baseUrl') || store.state.defaultUrl
// 设置全局配置
http.setConfig((config) => { 
	config.baseUrl = baseUrl;
	config.header = {
		'content-type': 'application/json;charset=UTF-8',
		'Access-Control-Allow-Origin':'*',
	}
	return config
})
//请求之前拦截器 
http.interceptor.request((config, cancel) => { 
	let token = store.state.token
	if (!config.noToken) { 
		config.header.token = token
	}
	if(!config.noLoading){
		let url = config.url.split("?") || []
		store.commit("Toast/TOAST_REQUESTURLS",{
			type:"push",
			url:url[0]
		})
	}
	return config;
})
//请求之后拦截器
http.interceptor.response((response) => { 
	const config = response.config || {}
	let statusCode = response.statusCode || '',
		errMsg = response.errMsg || ''
	if(statusCode !== 200){
		response = statusCodes[statusCode] || statusCodes[errMsg]
		if(statusCode === 401 && !config.errorNoRefresh){//errorNoRefresh true：401是不重新到登录界面
			uni.reLaunch({
				url: '/pages/index/index'
			});
		}
	}
	if(!config.noLoading){
		let url = config.url.split("?") || []
		store.commit("Toast/TOAST_REQUESTURLS",{
			type:"out",
			url:url[0]
		})
	}
	
	return response;
})

export default http;


