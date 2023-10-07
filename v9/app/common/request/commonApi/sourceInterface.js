/**
 * @description 数据来源为接口
 * @autor shishanshan
 * @update 2020/07/10
 */

//面板的数据来源为接口
//数据来源为接口时，获取接口需要的输入参数
const interFaceInParamByTab = 'serviceParam/selectByTabId'; //通过面板id获取输入参数信息
/**
 * @param {Number} commonApiHeaderId 接口id
 * @param {Number} mobileTabId 面板id
 */
export const sourceInterface_getInParamByTab = (param, _this) => {
  return _this.$http
    .post(interFaceInParamByTab, param)
    .then((res) => {
      const result = res.data || {};
      return result && result.data;
    })
    .catch((err) => {
      uni.showModal({
        title: _this.$t('basic-modalTipError'),
        content: result.msg,
        showCancel: false,
        confirmText: _this.$t('basic-confirm'),
      });
      return [];
    });
};
