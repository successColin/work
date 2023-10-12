/* eslint-disable */
/**
 * @description 点巡检
 * @autor shishanshan
 * @update 2020/08/24
 */
import vue from 'vue'

const state = {
	inspectionPhotoGallery: ['camera', 'album'],//巡检选择图片时，可以从什么地方选择 album:相册选图；camera:使用相机；all:二者都有(默认)
	inspectionDeviceLock: '1'// 点检是否需要解锁设备添加系統变量 1=需要  2= 不需要
}

const mutations = {
	set_inspection_photoSourceType(state, sourceType){
		const sourceTypes = ["album","camera","all"]
		if(sourceTypes.indexOf(sourceType) === -1) sourceType = ['camera', 'album']
		else sourceType = [sourceType]
		state.inspectionPhotoGallery = sourceType
	},
	set_inspection_unlock(state, isLocked){
		state.inspectionDeviceLock = isLocked
	},
}

export default {
	namespaced:true,
	state,
	mutations
}

