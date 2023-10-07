/**
 * @description 设置验证关系
 * @autor shishanshan
 * @update 2019/08/25
 */
import vue from 'vue'
const state = {
	rules:{},
	checkedFlag:{}//验证是否通过
}

const mutations = {
	CLEAR_RULESTATE(state,tabId){//清空
		if(tabId){
			vue.set(state.checkedFlag, tabId, true)
			vue.set(state.checkedFlag, "rules_"+tabId, [])
		}else{
			state.rules = {}
			state.checkedFlag = {}
		}
	},
	CHECKED_FLAG(state, params){//设置表单验证是否通过
		vue.set(state.checkedFlag, params.tabId, params.flag)
	},
	SET_TAB_RULE(state, params){//根据tab中的控件设置验证规则
		let key = "rules_" + params.tabId
		let oldRules = state.rules[key]
		
		if(oldRules){
			let ruleIndex = oldRules.findIndex( item => item.name == params.rule.name)
			if(ruleIndex !== -1){
				state.rules[key][ruleIndex] = params.rule
			}else {
				state.rules[key].push( params.rule)
			}
		}else {
			oldRules = []
			oldRules.push( params.rule)
			vue.set(state.rules, key,oldRules)
		}
	},
	SET_VER_RULES(state, param){//清空面板值
		vue.set(state.rules, param.tabId, param.rules)
	},
}

export default {
	namespaced:true,
	state,
	mutations
}

