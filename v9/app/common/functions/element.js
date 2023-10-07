/*
 * @Author: Shishans
 * @Date: 2020/03/31
 * @Desc: 控件方法
 */
//扫描
import store from '@/store';
import { onWxScan } from '@/utils/wxUtils';
export const ELEMENT_SCAN = (
  param,
  success = function () {},
  fail = function () {},
  complete = function () {},
) => {
  // #ifdef H5
  // 企业微信
  // QRType = 1 企业微信
  if (store.state.QRType === '1') {
    onWxScan((res) => {
      param.scancode = res.resultStr;
      if (param.scancode) success.call(this, param);
    });
  }
  return false;
  // #endif

  // #ifdef APP-PLUS
  const mpaasScanModule = uni.requireNativePlugin('Mpaas-Scan-Module');
  if (mpaasScanModule) {
    mpaasScanModule.mpaasScan(
      {
        // 扫码识别类型，参数可多选，qrCode、barCode，不设置，默认识别所有
        scanType: ['qrCode'],
        // 是否隐藏相册，默认false不隐藏
        hideAlbum: true,
      },
      (ret) => {
        const { resp_code } = ret;
        if (+resp_code === 1000) {
          param.scancode = ret.resp_result;
          success.call(this, param);
        } else {
          fail.call(this, param);
        }
        param.complete = ret;
        complete.call(this, param);
      },
    );
    return false;
  }
  // #endif

  uni.scanCode({
    success: (res) => {
      param.scancode = res.result;
      setTimeout(() => {
        if (param.scancode) success.call(this, param);
      }, 4);
    },
    fail: () => {
      setTimeout(() => {
        fail.call(this, param);
      }, 4);
    },
    complete: () => {
      setTimeout(() => {
        complete.call(this, param);
      }, 4);
    },
  });

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
};
//返回框架并刷新
export const ELEMENT_BACKFRAME = (param) => {
  let pages = getCurrentPages(); //获取页面栈
  let pageIndex = pages.findIndex(
      (findItem) => findItem.$vm._uid === param.frameUId,
    ),
    page = pages[pageIndex];

  return {
    pageNum: pages.length,
    pageIndex: pageIndex,
    templateType: page.templateType,
  };
};
