/**
 * @description 点巡检
 * @autor shishanshan
 * @update 2020/08/24
 */
import vue from 'vue'

const state = {
	inspectionPhotoGallery: ['camera', 'album'],//巡检选择图片时，可以从什么地方选择 album:相册选图；camera:使用相机；all:二者都有(默认)
	inspectionDeviceLock:'1',// 点检是否需要解锁设备添加系統变量 1=需要  2= 不需要
	enableInspectionUnlockByCode: true, // 点检是否需要设备编码解锁
	limitSkipToToday: '0' ,// 点巡检跳至日期限制最迟当天
	constraintDeviceCompleteInspection: 2,// 点检是否需要约束装置完整检查
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
	set_inspection_unlock_by_code(state, isLocked){
		state.enableInspectionUnlockByCode  = isLocked
	},
	set_limit_skip_to_today(state, val){
		state.limitSkipToToday = val;
	},
	set_inspection_device_complete(state, isComplete){
		console.log(isComplete)
		state.constraintDeviceCompleteInspection  = isComplete
	}
}

export default {
	namespaced:true,
	state,
	mutations
}
