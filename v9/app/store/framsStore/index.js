/**
 * @description 框架的全局变量
 * @autor shishanshan
 * @update 2019/08/24
 */
import vue from 'vue'

const state = {
	jumpTagParam:{},//跳转菜单所带的对应参数
	jumpInBundleParam:{},//跳转菜单-输入参数
}

const mutations = {
	SET_FRAMS_JUMParams(state, param){
		let bundleId = param.source //来源数据的bundle
		if(state.jumpTagParam[bundleId]) state.jumpTagParam[bundleId] = {...param.value}
		else vue.set(state.jumpTagParam, bundleId, param.value)
	},
	SET_FRAMS_JUMINParams(state, param){
		let bundleId = param.tag //目标bundle
		let value = ''
		if(!param.isClear){//是否需要清空
			value = {
				jumpTag:param.source,
				bundleParams:param.bundleParams
			}
		}
		if(state.jumpInBundleParam[bundleId]) state.jumpInBundleParam[bundleId] = {...value}
		else vue.set(state.jumpInBundleParam, bundleId, value)
	}
}

export default {
	namespaced:true,
	state,
	mutations
}