import { FRAMS_SHOWTYPE, FRAMS_TYPE } from '@/common/constant/frams.js';
import {
  TRIGGRT_BaseValue,
  TRIGGRT_NOTWEB,
} from '@/common/functions/trigger.js';
import { formApi } from '@/common/request/api.js';
import { common_inParam_selectByRelationId } from '@/common/request/commonApi/commonRequest.js';
class BtnsComs {
  constructor(vm, tabInfo) {
    this.btnBasicInfo = {
      normalEvent: ['normalBtn', 'addBtn', 'jumpMenuBtn', 'jumpTabBtn'],
      delEvent: ['delBtn'],
      saveEvent: ['saveBtn', 'archiveBtn', 'normalArchiveBtn'],
    };
  }
  /** 按钮触发器归类
   * @param {Object} params
   *		  trigger[Array 按钮对应触发器]
   * 		  relationMainTab[Number 上一个面板id] mobileTabId[Number 本面板id]
   * @param {Object} _this
   */
  triggerClassify(params, _this) {
    const triggerMap = params.triggerMap || [];
    let triggers = triggerMap[params.elementId] || [];
    if (triggers.length === 0) return; //如果没有触发器

    const relationMainTab = params.relationMainTab,
      mobileTabId = params.mobileTabId;
    const baseconfig = { triggers: triggers };
    let triggersNoWeb = TRIGGRT_NOTWEB(baseconfig),
      triggerIds = triggersNoWeb.triggerIds,
      pTriggerIds = triggersNoWeb.procedure_triggerIds,
      hTriggerIds = triggersNoWeb.http_triggerIds,
      paramValueArray = [
        ...triggerIds.paramValues,
        ...pTriggerIds.paramValues,
        ...hTriggerIds.paramValues,
      ];

    //参数
    let queryParams = {};
    for (let i = 0, len = paramValueArray.length; i < len; i++) {
      const paramValueKey = paramValueArray[i];
      //如果不是以@@开头
      if (!/^@@/.exec(paramValueKey)) continue;
      const config = {
        key: paramValueKey,
        otherTabId: relationMainTab,
        mobileTabId: mobileTabId,
        tabsElements: _this.tabsElements,
        tabsFormDatas: _this.tabsFormDatas,
        tabStaticParams: params.tabStaticParams, //面板固定变量
      };
      let paramValues = _this.Static_GlobalFucs.Global_ParamFormat(
        config,
        _this
      );
      //判断是否值为默认值
      let basevalue = {};
      if (paramValues.element)
        basevalue = TRIGGRT_BaseValue(
          paramValues.element.baseType,
          1,
          paramValues.id
        );
      paramValues = { ...paramValues, ...basevalue };
      queryParams[paramValueKey] = paramValues.id || '';
    }
    return {
      triggerIds: triggerIds.triggerIds.join(','),
      http_triggerIds: hTriggerIds.triggerIds.join(','),
      procedure_triggerIds: pTriggerIds.triggerIds.join(','),
      queryParams: queryParams,
    };
  }

  //http请求
  httpEvent(params, _this) {
    if (params.triggerIds) {
      //http请求
      return formApi.currencyHttpRequest(_this, params, false);
    } else {
      return new Promise((resolve, reject) => {
        resolve({ success: true });
      });
    }
  }
  //普通按钮触发接口
  normalTriggers(params, _this) {
    if (params.static_triggerIds || params.static_procedure_triggerids) {
      //后端触发器和存储过程
      return formApi.currencyInsertOrUpdateByTriggers(_this, params);
    } else {
      return new Promise((resolve, reject) => {
        resolve({ success: true });
      });
    }
  }
  //普通按钮需要请求的事件
  normalEvents(normalEventsParams, _this) {
    const triggerValue = normalEventsParams.triggerValue;
    const triggerIds = triggerValue.triggerIds,
      procedure_triggerIds = triggerValue.procedure_triggerIds,
      http_triggerIds = triggerValue.http_triggerIds,
      static_globalMap = triggerValue.queryParams;
    if (!triggerIds && !procedure_triggerIds && !http_triggerIds) {
      _this.btnEvent(normalEventsParams.elementFormat); //按钮操作
      return;
    }
    _this.loading(true);
    const normalTriggersParams = {
      static_triggerIds: triggerIds,
      static_procedure_triggerids: procedure_triggerIds,
      static_globalMap: static_globalMap, //全局变量、面板变量
    };
    const httpParams = {
      triggerIds: http_triggerIds,
      globalMap: static_globalMap,
    };
    Promise.all([
      this.normalTriggers(normalTriggersParams, _this),
      this.httpEvent(httpParams, _this),
    ])
      .then((result) => {
        let isFail =
          result.find((item) => !item || item.success === false) || '';
        if (isFail) {
          throw isFail;
          return;
        }
        _this.btnEvent(normalEventsParams.elementFormat); //按钮操作
        _this.Static_GlobalFucs.showToast({ title: '操作成功' });
      })
      .catch((error) => {
        _this.loading(false);
      });
  }
  //批量保存实践
  batchSaveEvents(saveParams, _this) {
    let formData = saveParams.formData;
    if (!formData.static_ids) {
      return { success: false, msg: '请选择数据' };
    }
    const triggerValue = saveParams.triggerValue;
    const triggerIds = triggerValue.triggerIds,
      procedure_triggerIds = triggerValue.procedure_triggerIds,
      static_globalMap = triggerValue.queryParams;

    formData.static_triggerIds = triggerIds; //后端触发器id
    formData.static_procedure_triggerids = procedure_triggerIds; //存储过程触发器id
    formData.static_globalMap = static_globalMap; //全局变量、面板变量
    return formApi.batchInsertOrUpdate(_this, formData);
  }
  //批量删除事件
  batchDelEvents(delParams, _this) {
    if (!delParams.ids) {
      return { success: false, msg: '请选择数据' };
    }
    let params = {
      ids: delParams.ids,
      tableName: delParams.tableName,
      triggerIds: delParams.triggerValue.triggerIds, //后端触发器id
    };
    return formApi.batchDelete(_this, params);
  }
  //删除
  delEvents(delParams, _this) {
    if (!delParams.id) {
      return { success: false, msg: '请选择数据' };
    }
    let params = {
      id: delParams.id,
      tableName: delParams.tableName,
      triggerIds: delParams.triggerValue.triggerIds, //后端触发器id
    };
    return formApi.currencyDelete(_this, delParams);
  }
  //保存事件
  saveEvents(saveParams, _this) {
    const triggerValue = saveParams.triggerValue;
    const triggerIds = triggerValue.triggerIds,
      procedure_triggerIds = triggerValue.procedure_triggerIds,
      static_globalMap = triggerValue.queryParams;

    let formData = saveParams.formData;
    formData.static_triggerIds = triggerIds; //后端触发器id
    formData.static_procedure_triggerids = procedure_triggerIds; //存储过程触发器id
    formData.static_globalMap = static_globalMap; //全局变量、面板变量
    if (formData.static_elementId) {
      //如果有static_elementId说明是多条新增
      return formApi.currencyMultiInsert(_this, formData);
    } else {
      return formApi.insertUpdateDate(_this, formData);
    }
  }
  //归档
  archiveEvents(saveParams, _this) {
    if (!saveParams.formData.id) {
      return { success: false, msg: '请选择数据' };
    }
    const triggerValue = saveParams.triggerValue;
    const triggerIds = triggerValue.triggerIds,
      procedure_triggerIds = triggerValue.procedure_triggerIds,
      static_globalMap = triggerValue.queryParams;

    let formData = {};
    formData.id = saveParams.formData.id;
    formData.static_tableName = saveParams.static_tableName;
    formData.static_triggerIds = triggerValue.triggerIds; //后端触发器id
    formData.static_procedure_triggerids = procedure_triggerIds; //存储过程触发器id
    formData.static_globalMap = triggerValue.queryParams; //全局变量、面板变量

    if ('@@null' in formData.static_globalMap)
      delete formData.static_globalMap['@@null'];

    let url = 'archiveCycleHandle'; //带周期
    if (saveParams.type === 'normalArchiveBtn') url = 'archiveHandle'; //不带周期

    return formApi[url](_this, formData);
  }
  getJumpBundleParam(jumpConfig = {}, _this) {
    //获取跳转菜单变量
    //获取跳转菜单的参数
    const passParam = jumpConfig.passParam;
    let passParamObj = '';
    if (passParam)
      try {
        passParamObj = JSON.parse(passParam);
      } catch {}
    if (passParamObj) {
      let basicConfig = {
        mobileTabId: jumpConfig.mobileTabId,
        tabsElements: jumpConfig.tabsElements,
        tabsFormDatas: jumpConfig.tabsFormDatas,
        tabStaticParams: jumpConfig.tabStaticParams,
      };
      let passParamValue = '';
      for (let i = 0, len = passParamObj.length; i < len; i++) {
        const passParamInfo = passParamObj[i],
          value = passParamInfo.value;
        basicConfig.key = value;
        let relValue = _this.Static_GlobalFucs.Global_ParamFormat(
          basicConfig,
          _this
        );
        relValue.relationColumnType =
          passParamInfo.type || relValue.relationColumnType;
        if (!passParamValue) {
          passParamValue = {};
          passParamValue[passParamInfo.key] = relValue;
        } else passParamValue[passParamInfo.key] = relValue;
      }

      return passParamValue;
    }
  }
  click(params, _this) {
    const elementId = params.elementId,
      saveEvent = params.saveEvent || [],
      normalEvent = params.normalEvent || [],
      relationTabId = params.relationTabId,
      displayName = params.label;

    let triggerValue = {};

    if (elementId) {
      const defalutObj = {
        triggerIds: '',
        http_triggerIds: '',
        procedure_triggerIds: '',
        queryParams: {},
      };
      triggerValue =
        this.triggerClassify(
          {
            elementId: elementId,
            triggerMap: params.trigger,
            mobileTabId: params.mobileTabId,
            relationTabId: params.relationTabId,
            tabStaticParams: params.tabStaticParams,
          },
          _this
        ) || defalutObj;
    }

    if (normalEvent.indexOf(params.type) !== -1) {
      //如果为普通按钮，直接跳转面板
      let normalEventsParams = {
        triggerValue: triggerValue,
        parentRefresh: params.parentRefresh,
        selfRefresh: params.selfRefresh,
        mobileTabId: params.mobileTabId,
        elementFormat: params.elementFormat, //0-不刷新，1-刷新本面板，2-刷新上一个面板并回退
      };
      this.normalEvents(normalEventsParams, _this);
      let isGoOther = '', // 是否有跳转
        jumpBundleInfo = '';
      if (params.jumpBundleId || relationTabId) {
        //bundle中是否有该菜单
        const jumpBundleId = params.jumpBundleId || '',
          bundlesList = params.bundlesList || [];

        if (jumpBundleId) isGoOther = 'bundle'; //如果有跳转菜单id，跳转类型为菜单
        jumpBundleInfo =
          bundlesList.find((item) => item.id == jumpBundleId) || '';
        if (jumpBundleInfo) isGoOther = 'bundle';
        else if (relationTabId) isGoOther = 'tab';
      }
      if (isGoOther === 'bundle') {
        const jumpBundleId = params.jumpBundleId || '';
        if (jumpBundleInfo) {
          if (!jumpBundleInfo.template) {
            _this.Static_GlobalFucs.showModal(_this, {
              title: _this.$t('basic-inquiry'),
              content: _this.$t('pageTip-configuration'),
              showCancel: false,
            });
            return;
          }
          let frameName = FRAMS_TYPE[jumpBundleInfo.bundleFrameType];
          _this.SET_FRAMETYPE(frameName);
          const url = `/pages/frames/${frameName}?title=${jumpBundleInfo.bundleName}&bundleId=${jumpBundleInfo.id}&mainTab=1&V=${jumpBundleInfo.bundleVersion}&jumpTag=${params.bundleId}`;
          common_inParam_selectByRelationId(
            { bundleId: jumpBundleId },
            _this
          ).then((value) => {
            const jumpTagParam = params.jumpBundleParam;
            let jumpInParams = {};
            value.map((item) => {
              //处理输入参数
              if (item.name in jumpTagParam) {
                const jumpTagValue = jumpTagParam[item.name] || {};
                console.log(jumpTagValue);
                jumpInParams[item.name] = jumpTagParam[item.name];
              }
            });

            _this.SET_FRAMS_JUMINParams({
              tag: jumpBundleId,
              source: params.bundleId,
              bundleParams: jumpInParams,
            });
            uni.navigateTo({
              url: url,
            });
          });
        } else {
          _this.Static_GlobalFucs.showToast({ title: '无权限' });
        }
      } else if (isGoOther === 'tab') {
        const mobileTab = params.mobileTabs || {},
          mobileTabsBYRelation = mobileTab[relationTabId];
        let static_mobileTabShowType =
          FRAMS_SHOWTYPE[mobileTabsBYRelation.mobileTabShowType];

        let tabParams = {
          //设置下一个面板的参数
          tabId: relationTabId,
          params: {
            static_ids: params.ids,
            relationTab: relationTabId,
            relationMainTab: params.mobileTabId,
            bundleId: params.bundleId,
            onkey: params.selfKey,
          },
        };
        const { templateType, tabStaticParams } = params;
        if (
          templateType === 'list' &&
          tabStaticParams &&
          tabStaticParams.GlobalIds
        ) {
          //将列表上面板固定变量GlobalIds也带过去
          //如果下面一个面板是表单，表单面板上会处理，将GlobalIds存储到其的面板固定变量中
          //如果下面的面板是列表，不做任何的处理
          tabParams.params.GlobalIds = { ...tabStaticParams.GlobalIds };
        }
        let normalBtns = ['normalBtn', 'jumpMenuBtn', 'jumpTabBtn'];
        if (params.type === 'addBtn') {
          tabParams.params.type = 'addBtn';
          static_mobileTabShowType = 'templates/formTemplate';
        } else if (params.type === 'relationAddBtn') {
          tabParams.params.type = 'addBtn';
          tabParams.params.mainnColumn = params.mainnColumn;
          tabParams.params.relationColumn = params.relationColumn;
          tabParams.params.relationTableName = params.relationTableName;
        } else if (
          normalBtns.indexOf(params.type) !== -1 &&
          templateType === 'list'
        ) {
          //如果是普通按钮并且是列表上的普通按钮是，设置type为batch
          //“batch”在表单展示类型时就需要进行批量处理
          tabParams.params.type = 'batch';
        }
        if (mobileTabsBYRelation.mobileTabShowType === 6) {
          tabParams.params.ids = params.submitFormData.ids;
        } //如果为批量面板
        _this.SET_TEMPLATE_PARAMS(tabParams); //设置下一个面板的参数
        _this.Static_GlobalFucs.gotoOtherRoute(
          tabParams,
          static_mobileTabShowType
        ); //跳转其他路由
      }
      return 'normalEvent';
    }

    const _thisBtnCom = this;
    _this.Static_GlobalFucs.showModal(_this, {
      content: '是否' + displayName,
      success: async function (res) {
        if (res.confirm) {
          _this.loading(true);
          let submitParams = {
            tableName: params.relationTableName,
            triggerValue: triggerValue,
          };

          let result = false;
          if (params.type === 'delBtn') {
            if (params.submitFormData.ids) {
              //批量删除
              submitParams.ids = params.submitFormData.ids;
              result = await _thisBtnCom.batchDelEvents(submitParams, _this);
            } else {
              submitParams.id = params.submitFormData.id;
              result = await _thisBtnCom.delEvents(submitParams, _this);
            }
          } else if (params.type === 'saveBtn') {
            //点击保存按钮
            submitParams.formData = params.submitFormData;
            submitParams.formData.static_tableName = params.relationTableName;
            result = await _thisBtnCom.saveEvents(submitParams, _this);
          } else if (params.type === 'batchSaveBtn') {
            //点击批量保存按钮
            submitParams.formData = params.submitFormData;
            submitParams.formData.static_tableName = params.relationTableName;
            result = await _thisBtnCom.batchSaveEvents(submitParams, _this);
          } else if (
            params.type === 'archiveBtn' ||
            params.type === 'normalArchiveBtn'
          ) {
            submitParams.type = params.type;
            submitParams.formData = params.submitFormData;
            submitParams.static_tableName = params.relationTableName;
            result = await _thisBtnCom.archiveEvents(submitParams, _this);
          }
          result = result || { success: false };
          if (result.success) {
            _thisBtnCom.httpEvent(
              {
                triggerIds: triggerValue.http_triggerIds,
                globalMap: triggerValue.queryParams,
              },
              _this
            );
            if (params.saveCallback) {
              params.saveCallback.call(_this);
            }
            _this.btnEvent(params.elementFormat, {
              tip: true,
              tipContent: result.msg,
            });
          } else {
            _this.loading(false);
          }
        }
      },
    });
  }
}

export default BtnsComs;
