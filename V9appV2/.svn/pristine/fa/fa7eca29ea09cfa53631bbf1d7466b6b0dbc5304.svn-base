import * as Path from './interface.js';

const inspectionApi = {
  getInspectionDo(_this, params, userId) {
    //获取数据
    params = { ...params, ...{ userId: userId } };
    return _this.$http
      .post(Path.inspectionDo, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg || '获取数据失败',
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          throw result;
          return {
            list: [],
            total: 0,
          };
        }
      })
      .catch((err) => {
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: err || '获取数据失败',
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
        console.error(err);
      });
  },
  getInspectionPotinDo(_this, params, userId) {
    //获取数据
    params = { ...params, ...{ userId: userId } };
    return _this.$http
      .post(Path.inspectionPointDo, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg || '获取数据失败',
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          throw result;
          return {
            list: [],
            total: 0,
          };
        }
      })
      .catch((err) => {
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: err || '获取数据失败',
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
        console.error(err);
      });
  },
  updataInspection(_this, params) {
    //获取数据
    console.log(params);
    return _this.$http
      .post(Path.uploadInspectionHistory, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg || '上传失败',
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          return result;
        }
      })
      .catch((err) => {
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: err || '上传失败',
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
        return err;
      });
  },
  skipTask(_this, params) {
    // 巡检跳过
    uni.showLoading({
      title: '加载中...',
    });
    return _this.$http
      .post(Path.skipTask, params)
      .then((res) => {
        const result = res.data;
        uni.hideLoading();
        if (result.success) {
          return result;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTipError'),
            content: result.msg || '跳过失败',
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          return result;
        }
      })
      .catch((err) => {
        uni.hideLoading();
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: err || '跳过失败',
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
        return err;
      });
  },
  upInspectionFile(_this, imgs, cb, cbe, waterMarkConfig) {
    let baseUrl = _this.baseUrl || _this.defaultUrl;
    let formData = {
      basetype: 2,
      tableName: 'inspectionpointhistory',
      token: _this.token,
    };
    if (waterMarkConfig && waterMarkConfig != 0 && waterMarkConfig != '')
      formData.waterMarkId = Number(waterMarkConfig);
    uni.uploadFile({
      //开始上传
      url: baseUrl + Path.uploadInspectionFiles,
      header: {
        'content-type': 'multipart/form-data',
        token: _this.token,
      },
      formData: formData,
      files: imgs,
      success(res) {
        if (res.statusCode == 200) {
          let result = JSON.parse(res.data);
          if (result.success) {
            if (cb) cb(res);
          } else {
            if (cbe) cbe(result);
          }
        } else {
          if (cbe) cbe(res);
        }
      },
      fail(err) {
        if (cbe) cbe();
        uni.showModal({
          title: _this.$t('basic-modalTipError'),
          content: '图片上传失败',
          showCancel: false,
          confirmText: _this.$t('basic-confirm'),
        });
        console.warn(err, '请检查是否CORB/CORS错误!');
      },
    });
  },
};
export default inspectionApi;
