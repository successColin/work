/* eslint-disable no-unexpected-multiline */
import Vue from 'vue';
// 添加单位
import { addUnit, px2rpx, rpx2px } from './libs/addUnit';
import bus from './libs/bus';
import * as common from './libs/common';
import dateFormat from './libs/dateFormat';
import fomatFloat from './libs/fomatFloat';
import guid from './libs/guid';
import moment from './libs/moment';
import preview from './libs/previewFile';
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

/**
 * @description 进行延时，以达到可以简写代码的目的 比如: await this.$apiot.sleep(20)将会阻塞20ms
 * @param {number} value 堵塞时间 单位ms 毫秒
 * @returns {Promise} 返回promise
 */
function sleep(value = 30) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, value);
  });
}

// 查询节点信息
// 目前此方法在支付宝小程序中无法获取组件跟接点的尺寸，为支付宝的bug(2020-07-21)
// 解决办法为在组件根部再套一个没有任何作用的view元素
function $uGetRect(selector, all) {
  return new Promise((resolve) => {
    uni
      .createSelectorQuery()
      .in(this)
      [all ? 'selectAll' : 'select'](selector)
      .boundingClientRect((rect) => {
        if (all && Array.isArray(rect) && rect.length) {
          resolve(rect);
        }
        if (!all && rect) {
          resolve(rect);
        }
      })
      .exec();
  });
}

const $apiot = {
  addUnit,
  px2rpx,
  rpx2px,
  toast,
  guid,
  dateFormat,
  fomatFloat,
  confirm,
  htmlReplace,
  moment,
  scanCode,
  $uGetRect,
  ...common,
  preview,
};

Vue.prototype.$apiot = $apiot;
uni.$apiot = {
  guid,
  sleep,
};

Vue.prototype.$bus = bus;
