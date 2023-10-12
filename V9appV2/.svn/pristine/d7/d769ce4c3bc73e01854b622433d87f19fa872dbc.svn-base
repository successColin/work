/*
 * @Author: Shishans
 * @Date: 2020/03/31
 * @Desc: 控件方法
*/
//扫描
export const ELEMENT_SCAN = (param,success = function() {},fail = function() {},complete = function() {}) => {
	uni.scanCode({
		success: (res) => {
			param.scancode  = res.result
			if(param.scancode) success.call(this, param)
		},
		fail: () => {
			fail.call(this, param)
		},
		complete: () => {
			complete.call(this, param)
		}
	})
	// uexScanner.cbOpen = function(opCode, dataType, data){ //资产扫描功能
	// 	// uni.showModal({
	// 	// 	title:"测试上汽扫描1",
	// 	// 	content:`扫描结果：opCode:${opCode},data:${JSON.stringify(data)},datatypeof:${typeof data}`
	// 	// })
	// 	if(opCode === 0){//如果成功
	// 		data = data || {}
	// 		if(typeof data === 'string' ) {
	// 			try{
	// 				data = JSON.parse(data)
	// 			}catch(err){
	// 				data = eval(`(${data})`)
	// 			}
	// 		}
	// 		let result = data.code
	// 		param.scancode  = result
	// 		if(param.scancode) success.call(this, param)
	// 	}else{
	// 		fail.call(this, param)
	// 	}
	// };
	// uexScanner.open();
	// var jsonData = '{"lineImg":"res://line.png","pickBgImg":"res://pick_bg.png","tipLabel":"对准二维码/条形码,即可自动扫描","title":"扫一下"}';
	// uexScanner.setJsonData(jsonData);
}
//返回框架并刷新
export const ELEMENT_BACKFRAME = (param) => {
	let pages = getCurrentPages(); //获取页面栈
	let pageIndex = pages.findIndex(findItem=> findItem.$vm._uid === param.frameUId),
		page = pages[pageIndex]
	
	return {
		pageNum:pages.length,
		pageIndex:pageIndex,
		templateType:page.templateType
	}
}

