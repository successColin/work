/**
 * @description 表单业务数据
 * @autor shishanshan
 * @update 2019/08/12
 */
import * as Path from './interface.js';

let formApi = {
  getDate(_this, params) {
    //获取数据
    return _this.$http
      .post(Path.currencyGetFromData, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          uni.showModal({
            title: _this.$t('basic-modalTip'),
            content: result.msg,
            showCancel: false,
            confirmText: _this.$t('basic-confirm'),
          });
          throw result;
          return {};
        }
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  batchInsert(_this, params) {
    //批量新增
    return _this.$http
      .post(Path.currencyBatchInsertOrUpdate, params)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          return result.data;
        } else {
          throw result;
          return {};
        }
      })
      .catch((err) => {
        let msg = err.msg || JSON.stringify(err);
        _this.Static_GlobalFucs.showModal(
          _this,
          {
            content: err,
            showCancel: false,
          },
          'error'
        );
      });
  },
  batchInsertOrUpdate(_this, params, gobackornot = true) {
    //根据id批量修改
    return _this.$http
      .post(Path.currencyBatchUpdateByIds, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  batchInsertOrUpdate(_this, params, gobackornot = true) {
    //根据id批量修改
    return _this.$http
      .post(Path.currencyBatchUpdateByIds, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  currencyMultiInsert(_this, params) {
    //根据多选控件生成多条数据
    return _this.$http
      .post(Path.currencyMultiInsert, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  currencyBatchByIdsUpdate(_this, params) {
    //根据id批量修改2
    return _this.$http
      .post(Path.currencyBatchByIdsUpdate, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  batchDelete(_this, params) {
    //批量删除数据
    return _this.$http
      .post(Path.currencyBatchDelete, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
      });
  },
  archiveCycleHandle(_this, params, gobackornot = true) {
    //归档带周期
    return _this.$http
      .post(Path.archiveCycleHandle, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  archiveHandle(_this, params, gobackornot = true) {
    //归档不带周期
    return _this.$http
      .post(Path.archiveHandle, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(err);
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
      });
  },
  insertUpdateDate(_this, params) {
    //新增编辑数据
    return _this.$http
      .post(Path.currencyInsertOrUpdate, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
  currencyInsertOrUpdateByTriggers(_this, params) {
    //普通按钮触发接口
    return _this.$http
      .post(Path.currencyInsertOrUpdateByTriggers, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        console.log(err);
        return { success: false };
      });
  },
  currencyHttpRequest(_this, params) {
    //调http请求
    return _this.$http
      .post(Path.currencyHttpRequest, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        console.log(err);
        return { success: false };
      });
  },
  currencyDelete(_this, params) {
    //删除数据
    return _this.$http
      .post(Path.currencyDelete, params)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        _this.Static_GlobalFucs.showModal(_this, {
          title: _this.$t('basic-modalTip'),
          content: err || '操作失败',
          showCancel: false,
        });
        return { success: false };
        console.log(err);
      });
  },
};

export default formApi;
