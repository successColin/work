/**
 * @description 列表数据请求
 * @autor shishanshan
 * @update 2019/08/12
 */
import * as Path from './interface.js';

let listApi = {
  getDate(_this, params) {
    //获取数据
    return _this.$http
      .post(Path.currencyGetListData, params)
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
          throw result;
          return {
            datalist: [],
            total: 0,
          };
        }
      })
      .catch((err) => {
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: JSON.stringify(err),
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
      });
  },
  getScanDate(_this, params) {
    //获取扫描数据
    let pathUrl = Path.currencyScanningByKeyCode;
    if (!!_this.scanningType && _this.scanningType == 2) {
      pathUrl = Path.currencyHaiLiScanning;
    }
    console.log(pathUrl);
    return _this.$http
      .post(pathUrl, params)
      .then((res) => {
        const result = res.data;
        console.log(result);
        if (result.success) {
          return result.data || {};
        }
      })
      .catch((err) => {
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: JSON.stringify(err),
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
      });
  },
  getListData(_this, url, params) {
    const pathUrl = Path[url],
      elementList = params.elementList;
    return _this.$http
      .post(pathUrl, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          let resultData = result.data;
          if (url === 'static_getDataByInterface') {
            //如果数据来源接口，需要处理数据
            const dataList = resultData.dataList;
            let interfaceData = [];
            dataList.forEach((obj) => {
              let data = {};
              elementList.forEach((item) => {
                const { elementId, relationColumnName } = item;
                let value = obj[relationColumnName];
                data[elementId] = JSON.stringify({
                  id: `${value}`,
                  name: `${value}`,
                });
              });
              interfaceData.push(data);
            });
            resultData.datalist = interfaceData;
          }
          return resultData;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg,
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          return {
            datalist: [],
            total: 0,
          };
        }
      })
      .catch((err) => {
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: JSON.stringify(err),
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
        console.error(err);
      });
  },
  currencyStandardSelectionBoxList(_this, params) {
    //通用查询APP标准选择框数据（列表）
    return _this.$http
      .post(Path.currencyStandardSelectionBoxList, params)
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
          throw result;
          return {
            datalist: [],
            total: 0,
          };
        }
      })
      .catch((err) => {
        console.error(err);
      });
  },
};

export default listApi;
