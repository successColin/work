/**
 * @description 框架变量
 * @autor shishanshan
 * @update 2019/08/24
 */
import vue from 'vue'

const state = {
	ScanFramework:{
		static_scanResult:{}//扫描的值
	},
	Inspections:{
		InspectionOrganization:{},//点检组织
		InspectionPosition:{},//点检位置
		InspectionDevice:{}, //点检设备
		InspectionId:{},//路线id
		InspectionPointId:{},//点id
	}
}

const mutations = {
	Set_ScanFramework(state,param){//设置扫描框架的框架变量
		state.ScanFramework[param.key] = {...param.value}
	},
	Set_Inspections(state,param){//设置扫描框架的框架变量
		state.Inspections[param.key] = {...param.value}
	}
}

export default {
	namespaced:true,
	state,
	mutations
}