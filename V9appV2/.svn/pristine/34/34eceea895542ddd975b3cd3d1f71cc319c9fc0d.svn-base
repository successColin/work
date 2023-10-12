const selectByRelationId = 'inParam/selectByRelationId'; //取菜单的输入参数
const getDeviceCheck = 'fixedCode/relationGetByHeadId'; //根据设备盘点头表id查询盘点统计数据
const inventoryScanInster = 'currency/currencyInventoryScanning'; //设备盘点扫描

export const common_inParam_selectByRelationId = (param, _this) => {
  return _this.$http
    .post(selectByRelationId, param)
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

export const common_getDeviceCheck = (headId, _this) => {
  //获取设备盘点面板参数
  const url = `${getDeviceCheck}/${headId}`;
  return _this.$http
    .get(url)
    .then((res) => {
      const result = res.data || {};
      return result && result.data;
    })
    .catch((err) => {
      uni.showModal({
        title: _this.$t('basic-modalTipError'),
        content: err,
        showCancel: false,
        confirmText: _this.$t('basic-confirm'),
      });
      return {};
    });
};

export const common_inventoryScanInster = (param, _this) => {
  //设备盘点扫描
  //扫描结果如果在盘点明显表中返回id进入盘点明显表
  //扫描结果如果不在明显表了，新增一条盘点明显，并且状态为盘盈
  return _this.$http
    .post(inventoryScanInster, param)
    .then((res) => {
      const result = res.data || {};
      return result && result.data;
    })
    .catch((err) => {
      uni.showModal({
        title: _this.$t('basic-modalTipError'),
        content: `扫描结果:${param.deviceKeyCode},${err}`,
        showCancel: false,
        confirmText: _this.$t('basic-confirm'),
      });
    });
};
