/**
 * @description 通用接口
 * @autor shishanshan
 * @update 2019/08/12
 */
import * as Path from './interface.js';

let commonApi = {
  getSearchSelectById(_this, params, isMultiple) {
    //数据选择框通过id获取所有的信息
    let url = Path.currencyGetDataById;
    console.log('triggerBaseType============================');
    if (isMultiple) {
      url = Path.currencyGetByIds; //如果是多选框，请求接口不一致
      const { id, tabSource } = params;
      params = {
        ids: id,
        tableName: tabSource,
      };
    }
    return _this.$http
      .post(url, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          uni.showToast({
            title: '操作失败',
            duration: 2000,
          });
          return [];
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
  stateSelectData(_this, params) {
    //查询状态列表
    return _this.$http
      .post(Path.stateSelectData, params, {
        noLoading: true,
      })
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg,
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          return [];
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
  currencyGetDropDown(_this, params) {
    //通用下拉数据
    return _this.$http
      .post(Path.currencyGetDropDown, params, {
        noLoading: true,
      })
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg,
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          return [];
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

export default commonApi;
