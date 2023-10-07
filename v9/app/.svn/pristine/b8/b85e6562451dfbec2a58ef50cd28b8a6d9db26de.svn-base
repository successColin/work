<template>
  <view class="bottomBtnsComs">
    <block v-for="(item, index) in buttons" :key="index">
      <m-button
        class="btn-item"
        v-if="showByPermissiones(item.baseType, item.visiabled, item.type)"
        :ref="item.elementId"
        :btnClass="item.btnStyle"
        :btnColor="item.labelIconColour"
        :btnInfo="btnInfo(item)"
        :elementId="item.elementId"
        :btnTilte="item.label"
        :visiabled="item.visiabled"
        :elementFormat="item.elementFormat"
        :disabled="btnDisable"
        :checkForm="true"
        @elementClick="handleBtnClick"
      ></m-button>
    </block>
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { mapState, mapMutations } from 'vuex';
import { ELEMENT_BACKFRAME } from '@/common/functions/element.js';
import { TRIGGER_Conditions } from '@/common/constant/triggers.js';
import { TRIGGRT_ConditionFnc } from '@/common/functions/trigger.js';

import BtnsComs from './btnsComs.js';
const btnsComs = new BtnsComs();
export default {
  props: {
    tabInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
    tabStaticParams: {
      //面板固定参数
      type: Object,
      default: function () {
        return {};
      },
    },
    btnBasicInfo: {
      //按钮信息
      type: Object,
      default: function () {
        return {
          normalEvent: ['normalBtn', 'jumpMenuBtn', 'jumpTabBtn'],
          delEvent: ['delBtn'],
          saveEvent: ['saveBtn', 'archiveBtn', 'normalArchiveBtn'],
        };
      },
    },
  },
  data() {
    return {
      comBoxVisible: false,
      btnDisable: false, //按钮是否不能点击
      bundlesList: [],
    };
  },
  computed: {
    ...mapState(['isOriginHei']),
    ...mapState('common', [
      'tabsElements',
      'tabsFormDatas',
      'submitTabsDatas',
      'frameUId',
    ]),
    ...mapState('form', ['currentBottomBtns']),
    ...mapState('verificationRule', ['rules', 'checkedFlag']),
    ...mapState('home', ['bottomList', 'workSpaceList', 'topCoreList']),
    /**
     * 处理按钮需要携带的参数，
     * baseType:按钮类型 普通按钮、保存、删除、归档等
     * checkedForm:是否需要校验表单,目前没有配置，默认保存按钮需要校验，其他按钮均不需要 TODO 后续有校验规则是需要进一步完善
     * elementFormat:刷新类型 0-不刷新；1-刷新本面板；2-刷新框架
     */
    btnInfo() {
      return function (item) {
        const noChecked = [4, 5, 6, 24, 43, 44], //不需要校验必填的按钮
          {
            baseType,
            checkedForm = 1,
            elementFormat,
            type,
            relationTabId,
            relationTableName,
            elementId,
            jumpMenuList,
            jumpTabList,
            executeCondition,
            defaultConditions,
          } = item;
        //判断是否需要校验表单规则
        let static_checkedForm =
          noChecked.indexOf(baseType) !== -1 ? 0 : checkedForm;
        //根据不同的按钮，有不同的默认刷新类型
        let static_elementFormat = elementFormat;
        if (!static_elementFormat) {
          //如果没有设置刷新类型
          const norefreshAry = [24, 43, 44];
          if (norefreshAry.indexOf(baseType) !== -1) static_elementFormat = 0;
          //普通按钮默认不刷新
          else if (this.tabInfo.templateType === 'list' && baseType === 6)
            static_elementFormat = 1;
          //列表上的删除按钮默认刷新本面板
          else static_elementFormat = 2; //其他默认都刷新上一个面板
        }
        return {
          type,
          relationTabId,
          relationTableName,
          elementId,
          elementFormat: static_elementFormat, //0-不刷新，1-刷新本面板，2-刷新上一个面板
          static_checkedForm: static_checkedForm,
          jumpMenuList, //跳转菜单
          jumpTabList, //跳转面板
          executeCondition, //前置触发条件
          defaultConditions,
        };
      };
    },
    buttons() {
      const tabId = this.tabInfo.mobileTabId;
      return this.currentBottomBtns[tabId];
    },
  },
  methods: {
    ...mapMutations(['SET_FRAMETYPE']),
    ...mapMutations('framsStore', [
      'SET_FRAMS_JUMParams',
      'SET_FRAMS_JUMINParams',
    ]),
    ...mapMutations('common', [
      'SET_TEMPLATE_PARAMS',
      'SET_FORMREFRESH_PARENT',
      'SET_COM_PAGERELOAD',
    ]),
    ...mapMutations('form', ['SET_FILEPARAMS']),
    showByPermissiones(basetype, visiabled, type) {
      //按钮权限
      if (!visiabled) return false;
      const saveEvent = this.btnBasicInfo.saveEvent || [],
        normalEvent = this.btnBasicInfo.normalEvent || [],
        delEvent = this.btnBasicInfo.delEvent || [];
      if (
        saveEvent.indexOf(type) === -1 &&
        delEvent.indexOf(type) === -1 &&
        normalEvent.indexOf(type) === -1
      )
        return false;

      let bundleId = this.tabInfo.bundleId;
      return this.Static_GlobalFucs.Permissiones(
        bundleId,
        basetype,
        this.tabInfo.formType
      );
    },
    getJumpBundleParam(passParam = '') {
      if (!passParam) return;
      const { mobileTabId } = this.tabInfo;
      const jumpConfig = {
        passParam: passParam,
        mobileTabId,
        tabsElements: this.tabsElements,
        tabsFormDatas: this.tabsFormDatas,
        tabStaticParams: this.tabStaticParams,
      };
      const jumpBundleParam = btnsComs.getJumpBundleParam(jumpConfig, this);
      //设置跳转菜单的变量
      if (jumpBundleParam)
        this.SET_FRAMS_JUMParams({
          source: this.tabInfo.bundleId,
          value: jumpBundleParam,
        });
      return jumpBundleParam || {};
    },
    checkExecuteCondition(formdata, text, type = 'form', elements) {
      const obj = JSON.parse(text);
      const fortype = obj.fortype == 'and' ? '&&' : '||';
      const formula = obj.formula;
      let condition = '',
        result,
        conditions = [],
        title = obj.isFalse,
        newTitle = '';
      // const reg = /(?<=\{@@).*?(?=\})/g
      const falseNames = this.Static_GlobalFucs.getSQLParams(obj.isFalse);
      if (type == 'list') {
        formdata.forEach((item) => {
          for (let i = 0; i < formula.length; i++) {
            condition = '';
            const itemName = formula[i].key;
            const element = elements.filter((obj) => obj.parameter == itemName);
            const elementId = element.length ? element[0].elementId : null;
            let paramValue = elementId
              ? item[elementId].id
              : this.Static_GlobalFucs.Global_ParamFormat(
                  { key: itemName },
                  this
                ).id;
            paramValue = paramValue || null;
            const variable =
              JSON.stringify(formula[i].value).indexOf('@@') == -1;
            const cond = formula[i].cond == '=' ? '===' : formula[i].cond;
            let value = '';
            if (variable) {
              value = JSON.stringify(formula[i].value).trim();
            } else {
              const elementName = formula[i].value;
              const elementValue = elements.filter(
                (obj) => obj.parameter == elementName
              );
              const valueId = elementValue.length
                ? elementValue[0].elementId
                : null;
              value = valueId
                ? item[valueId].id
                : this.Static_GlobalFucs.Global_ParamFormat(
                    { key: elementName },
                    this
                  ).id;
            }
            value = value || null;
            if (i == formula.length - 1) {
              if (cond == '===' || cond == '!=') {
                condition += `${paramValue}` + cond + `${value}`;
              } else {
                condition += Number(paramValue) + cond + Number(value);
              }
            } else {
              if (cond == '===' || cond == '!=') {
                condition += `${paramValue}` + cond + `${value}` + fortype;
              } else {
                condition +=
                  Number(paramValue) + cond + Number(value) + fortype;
              }
            }
          }
          result = eval(condition);
          conditions.push(result);
          if (!result && falseNames.length) {
            title = obj.isFalse;
            falseNames.forEach((name) => {
              const element = elements.filter((obj) => obj.parameter == name);
              const elementId = element.length ? element[0].elementId : null;
              const value = elementId
                ? item[elementId].name
                : this.Static_GlobalFucs.Global_ParamFormat({ key: name }, this)
                    .id || null;
              title = title.replace('{' + name + '}', value || '') + '\n';
            });
            newTitle += title;
          } else if (!result && !falseNames.length) {
            newTitle = title;
          }
        });
      } else {
        for (let i = 0; i < formula.length; i++) {
          // const itemName = formula[i].key.split('@@')[1]
          const element = elements.filter(
            (obj) => obj.parameter == formula[i].key
          );
          const itemName = element.length ? element[0].name : null;
          const variable = JSON.stringify(formula[i].value).indexOf('@@') == -1;
          const cond = formula[i].cond == '=' ? '===' : formula[i].cond;
          let paramValue = itemName
            ? formdata[itemName]
            : this.Static_GlobalFucs.Global_ParamFormat(
                { key: formula[i].key },
                this
              ).id;
          paramValue = paramValue || null;
          let value = '';
          if (variable) {
            value = JSON.stringify(formula[i].value).trim();
          } else {
            const elementName = formula[i].value;
            const elementValue = elements.filter(
              (obj) => obj.parameter == elementName
            );
            const valueName = elementValue.length ? elementValue[0].name : null;
            value = valueName
              ? formdata[valueName]
              : this.Static_GlobalFucs.Global_ParamFormat(
                  { key: elementName },
                  this
                ).id;
          }
          value = value || null;
          const isNeed = typeof paramValue === 'string' ? "'" : '';
          if (i == formula.length - 1) {
            if (cond == '===' || cond == '!=') {
              condition +=
                `${isNeed}${paramValue}${isNeed}` + cond + `${value}`;
            } else {
              condition += Number(paramValue) + cond + Number(value);
            }
          } else {
            if (cond == '===' || cond == '!=') {
              condition +=
                `${isNeed}${paramValue}${isNeed}` + cond + `${value}` + fortype;
            } else {
              condition += Number(paramValue) + cond + Number(value) + fortype;
            }
          }
        }
        result = eval(condition);
        conditions.push(result);
        if (!result && falseNames.length) {
          falseNames.forEach((name) => {
            const element = elements.filter((obj) => obj.parameter == name);
            const labelName = element.length ? element[0].label : null;
            title = title.replace(
              '{' + name + '}',
              labelName ||
                this.Static_GlobalFucs.Global_ParamFormat({ key: name }, this)
                  .id ||
                ''
            );
          });
        }
        newTitle = title;
      }
      if (conditions.indexOf(false) == -1) {
        return true;
      } else {
        // uni.showToast({
        // 	title: newTitle || title,
        // 	duration: 5000,
        // 	icon:'none'
        // });
        uni.showModal({
          title: '',
          content: newTitle || title,
          showCancel: false,
        });
        return false;
      }
    },
    handleBtnClick(params) {
      //按钮点击
      this.$emit('checkedForm', {
        static_checkedForm: params.static_checkedForm, //是否验证表单数据
        btnType: params.type, //按钮类型如果是删除按钮，只要校验是否存在id即可
      });
      const tabId = this.tabInfo.mobileTabId,
        check = this.checkedFlag[tabId];
      console.log(
        '=================================================================='
      );
      if (params.static_checkedForm === 1 && !check) return;
      params = { ...this.tabInfo, ...this.btnBasicInfo, ...params };
      params.tabStaticParams = this.tabStaticParams; //固定面板变量
      params.submitFormData = this.submitTabsDatas[tabId] || {};
      //针对表单或者列表需要做单独的处理
      if (this.tabInfo.templateType === 'list') {
        //列表
        const listCheckIds = this.tabStaticParams.GlobalIds;
        if (listCheckIds && listCheckIds.id)
          params.submitFormData.ids = listCheckIds.id; //列表选中的值
        if (params.executeCondition && listCheckIds) {
          const listCheckDatas = this.tabStaticParams.GlobalCheckDatas;
          const elements = this.tabStaticParams.GlobalElements;
          const isExecuteCondition = this.checkExecuteCondition(
            listCheckDatas,
            params.executeCondition,
            'list',
            elements
          );
          if (!isExecuteCondition) return;
        }
        if (params.defaultConditions == 1) {
          if (
            !listCheckIds ||
            !listCheckIds.id ||
            listCheckIds.id.indexOf(',') != -1
          ) {
            uni.showModal({
              title: '',
              content: this.$t('lang-select-one'),
              showCancel: false,
            });
            return;
          }
        } else if (params.defaultConditions == 2) {
          if (!listCheckIds || !listCheckIds.id) {
            uni.showModal({
              title: '',
              content: this.$t('lang-select-one'),
              showCancel: false,
            });
            return;
          }
        }
      } else {
        //表单
        //按钮前置触发条件判断
        const isExecuteCondition =
          params.executeCondition &&
          this.checkExecuteCondition(
            this.submitTabsDatas[tabId],
            params.executeCondition,
            'form',
            this.tabInfo.mobileTabs[this.tabInfo.mobileTabId].elements
          );
        if (params.executeCondition && !isExecuteCondition) return;
        const { relationMainTab } = this.tabInfo;
        if (
          params.type === 'saveBtn' &&
          this.tabInfo.formType === 'batch' &&
          relationMainTab
        ) {
          //表单上的批量处理，如果是保存按钮并且是需要批量处理
          const batchCheckIds = this.tabStaticParams.GlobalIds; //需要批量处理的id
          if (batchCheckIds && batchCheckIds.id) {
            params.submitFormData.static_ids = batchCheckIds.id;
            if ('id' in params.submitFormData) delete params.submitFormData.id;
            params.type = 'batchSaveBtn';
          }
        }
      }
      if (
        this.tabInfo.templateType === 'list' &&
        params.type === 'delBtn' &&
        !params.submitFormData.ids
      ) {
        this.Static_GlobalFucs.showToast({ title: this.$t('formTip-select') }); // 中文：请选择数据
        return;
      }
      //容错，如果同时存在jumpMenuList和jumpTabList
      //如果同时有跳转菜单和跳转面板，默认跳转菜单
      //tab-面板；menu-菜单
      let jumpType = 'tab';
      if (params.jumpMenuList && params.jumpMenuList.length) jumpType = 'menu';
      if (jumpType === 'menu') {
        //如果有跳转菜单列表
        //获取符合条件的跳转菜单
        const jumpMenu = this.getAccordBundle(params.jumpMenuList);
        if (jumpMenu) {
          //如果有符合的菜单跳转
          //先进行判断菜单列表中符合的列表
          const { jumpBundleId, passParam } = jumpMenu;
          params.jumpBundleId = jumpBundleId;
          params.jumpBundleParam = this.getJumpBundleParam(passParam) || {};
          params.bundlesList = this.bundlesList;
        }
      } else {
        //获取符合条件的跳转面板
        const jumpTab = this.getAccordBundle(params.jumpTabList);
        if (jumpTab) {
          //如果有符合的菜单跳转
          const { jumpMobileTabId, relationTabId } = jumpTab;
          params.relationTabId = jumpMobileTabId || relationTabId;
        }
      }
      const { static_elementId } = params.submitFormData;
      if (static_elementId) {
        params.type = 'saveBtn';
        delete params.submitFormData.id; //多条新增删除对应的id字段
      }
      btnsComs.click(params, this);
    },
    isEligible(preconditions) {
      //是否符合条件
      if (!preconditions) return true;
      //如果没有匹配条件默认符合
      else {
        const { relationMainTab, mobileTabId, bundleParams } = this.tabInfo;
        const paramFormatConfig = {
          otherTabId: relationMainTab,
          mobileTabId,
          bundleParams,
          tabsElements: this.tabsElements,
          tabsFormDatas: this.tabsFormDatas,
          tabStaticParams: this.tabStaticParams,
        };
        let preconditionsList = [];
        try {
          preconditionsList = JSON.parse(preconditions);
        } catch (e) {
          preconditionsList = [];
        }
        let eligible = true;
        for (let i = 0, len = preconditionsList.length; i < len; i++) {
          const preconditionObj = preconditionsList[i],
            { key, cond, value: passK } = preconditionObj;
          //获取匹配条件中变量的值
          let keyValue = this.Static_GlobalFucs.Global_ParamFormat(
              { ...{ key }, ...paramFormatConfig },
              this
            ),
            passKVaule = this.Static_GlobalFucs.Global_ParamFormat(
              { ...{ key: passK }, ...paramFormatConfig },
              this
            );
          keyValue = `${keyValue.id}`;
          passKVaule = `${passKVaule.id}`;
          const conditionType = TRIGGER_Conditions.find(
            (item) => item.name === cond
          );
          //只有其中一个匹配条件不符合就跳出匹配，且返回false
          if (!TRIGGRT_ConditionFnc(conditionType, passKVaule, keyValue)) {
            eligible = false;
            break;
          }
        }
        return eligible;
      }
    },
    getAccordBundle(jumpList = []) {
      //从跳转菜单列表中获取符合条件的菜单
      let jumpThing = '';
      for (let i = 0, len = jumpList.length; i < len; i++) {
        const jumpThingMap = jumpList[i] || {};
        if (this.isEligible(jumpThingMap.preconditions)) {
          //如果符合条件，则跳出返回符合条件的跳转菜单
          jumpThing = { ...jumpThingMap };
          break;
        }
      }
      return jumpThing;
    },
    loading(param) {
      this.btnDisable = param || false;
    },
    btnBack(elementFormat) {
      this.btnDisable = false;
      if (elementFormat === 2) {
        //刷新上一个面板
        bus.$emit(this.tabInfo.parentKey, this.tabInfo.refreshParams);
        uni.navigateBack();
      } else if (elementFormat === 1) {
        //刷新本页面
        bus.$emit(this.tabInfo.selfKey, this.tabInfo.refreshParams);
      } else if (elementFormat === 3) {
        //刷新框架
        let framePageInfo = ELEMENT_BACKFRAME({ frameUId: this.frameUId }),
          index = framePageInfo.pageNum - (framePageInfo.pageIndex + 1),
          key = '';
        if (framePageInfo.templateType === 'form')
          key = `formReload${this.frameUId}`;
        else key = `listReload${this.frameUId}`;
        bus.$emit(key, this.tabInfo.refreshParams);
        uni.navigateBack({ delta: index, animationType: 'slide-out-right' });
      } else if (elementFormat === 4) {
        //逐层刷新
        this.SET_COM_PAGERELOAD({ pageUid: 'parent', type: true });
        uni.navigateBack();
      }
    },
    btnEvent(elementFormat, backParam = {}) {
      const _this = this;
      if (backParam.tip)
        this.Static_GlobalFucs.showToast({
          title: backParam.tipContent,
          mask: true,
          complete() {
            setTimeout(function () {
              uni.hideToast();
              _this.btnBack(elementFormat);
            }, 600);
          },
        });
      else this.btnBack(elementFormat);
    },
  },
  created() {
    let workBundle = [];
    for (let key in this.workSpaceList) {
      const group = this.workSpaceList[key];
      workBundle = [...workBundle, ...group.list];
    }
    this.bundlesList = [...this.bottomList, ...workBundle];
  },
};
</script>


