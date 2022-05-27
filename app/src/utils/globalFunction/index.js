import Vue from 'vue';
// 添加单位
import { addUnit, px2rpx, rpx2px } from './libs/addUnit';
import bus from './libs/bus';
import dateFormat from './libs/dateFormat';
import guid from './libs/guid';
import moment from './libs/moment';
import scanCode from './libs/scanCode';
import toast from './libs/toast';

// 提示框1
function confirm(obj) {
  return new Promise((resolve, reject) => {
    uni.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success(res) {
        if (res.confirm) {
          resolve(res);
        } else if (res.cancel) {
          reject(res);
        }
      },
      ...obj,
    });
  });
}

// 替换字符串中html标签和空格
function htmlReplace(str) {
  if (!str) return '';
  str = str.replace(/<[^>]+>/g, '');
  str = str.replace(/&nbsp;/g, ' ');
  return str;
}

const $apiot = {
  addUnit,
  px2rpx,
  rpx2px,
  toast,
  guid,
  dateFormat,
  confirm,
  htmlReplace,
  moment,
  scanCode,
};

Vue.prototype.$apiot = $apiot;

Vue.prototype.$bus = bus;
