/*
 * @Author: Shishans
 * @Date: 2020/03/31
 * @Desc: 控件方法
*/
// 扫描
export const ELEMENT_SCAN = (param,
  success = function() {},
  fail = function() {},
  complete = function() {}) => {
  console.log(22222222);
  uni.scanCode({
    success: (res) => {
      param.scancode = res.result;
      if (param.scancode) success.call(this, param);
    },
    fail: (e) => {
      console.log(e);
      fail.call(this, param);
    },
    complete: () => {
      complete.call(this, param);
    }
  });
};
// 返回框架并刷新
export const ELEMENT_BACKFRAME = (param) => {
  // eslint-disable-next-line no-undef
  const pages = getCurrentPages(); // 获取页面栈
  const pageIndex = pages.findIndex((findItem) => findItem.$vm._uid === param.frameUId);
  const page = pages[pageIndex];
  return {
    pageNum: pages.length,
    pageIndex,
    templateType: page.templateType
  };
};
