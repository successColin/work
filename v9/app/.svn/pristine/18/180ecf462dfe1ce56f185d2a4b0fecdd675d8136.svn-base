/**
 * @description loading框的全局状态管理
 * @autor shishanshan
 * @update 2020/01/09
 */
const state = {
	requestURLs:[],
	forceShow:false,//是否加载中
	isUpload:false//是否升级
}

const mutations = {
	SET_TOAST_LOADING(state, status){//设置加载状态
		state.forceShow = status || false
	},
	SET_TOAST_UPLOAD(state, status){//设置升级状态
		state.isUpload = status || false
	},
	TOAST_REQUESTURLS(state, param){//加入正在请求url
		const url = param.url,
			  index = state.requestURLs.indexOf(url) 
		console.log("url========"+url)
		if(!url) return  
		if(param.type==="push" && index === -1) state.requestURLs.push(param.url)
		else if(param.type==="out" && index !== -1) state.requestURLs.splice(index,1)
		else if(param.type==="clear") state.requestURLs = []
	}
}

export default {
	namespaced:true,
	state,
	mutations
}