(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-templates-listTemplate"],{"1ce8":function(module,exports,__webpack_require__){"use strict";__webpack_require__("7a82");var _interopRequireDefault=__webpack_require__("4ea4").default;Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0,__webpack_require__("c975"),__webpack_require__("d3b7"),__webpack_require__("159b"),__webpack_require__("14d9"),__webpack_require__("4de4"),__webpack_require__("ac1f"),__webpack_require__("5319"),__webpack_require__("e9c4"),__webpack_require__("498a"),__webpack_require__("a9e3"),__webpack_require__("99af"),__webpack_require__("7db0");var _toConsumableArray2=_interopRequireDefault(__webpack_require__("2909")),_objectSpread2=_interopRequireDefault(__webpack_require__("5530")),_bus=_interopRequireDefault(__webpack_require__("3184")),_vuex=__webpack_require__("26cb"),_element=__webpack_require__("ea34"),_triggers=__webpack_require__("1fec"),_trigger=__webpack_require__("ab7c"),_btnsComs=_interopRequireDefault(__webpack_require__("f07f")),btnsComs=new _btnsComs.default,_default2={props:{tabInfo:{type:Object,default:function(){return{}}},tabStaticParams:{type:Object,default:function(){return{}}},btnBasicInfo:{type:Object,default:function(){return{normalEvent:["normalBtn","jumpMenuBtn","jumpTabBtn"],delEvent:["delBtn"],saveEvent:["saveBtn","archiveBtn","normalArchiveBtn"]}}}},data:function(){return{comBoxVisible:!1,btnDisable:!1,bundlesList:[]}},computed:(0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)({},(0,_vuex.mapState)(["isOriginHei"])),(0,_vuex.mapState)("common",["tabsElements","tabsFormDatas","submitTabsDatas","frameUId"])),(0,_vuex.mapState)("form",["currentBottomBtns"])),(0,_vuex.mapState)("verificationRule",["rules","checkedFlag"])),(0,_vuex.mapState)("home",["bottomList","workSpaceList","topCoreList"])),{},{btnInfo:function(){return function(t){var e=t.baseType,a=t.checkedForm,i=void 0===a?1:a,n=t.elementFormat,o=t.type,r=t.relationTabId,s=t.relationTableName,l=t.elementId,u=t.jumpMenuList,c=t.jumpTabList,d=t.executeCondition,m=t.defaultConditions,b=-1!==[4,5,6,24,43,44].indexOf(e)?0:i,f=n;if(!f){f=-1!==[24,43,44].indexOf(e)?0:"list"===this.tabInfo.templateType&&6===e?1:2}return{type:o,relationTabId:r,relationTableName:s,elementId:l,elementFormat:f,static_checkedForm:b,jumpMenuList:u,jumpTabList:c,executeCondition:d,defaultConditions:m}}},buttons:function(){var t=this.tabInfo.mobileTabId;return this.currentBottomBtns[t]}}),methods:(0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)({},(0,_vuex.mapMutations)(["SET_FRAMETYPE"])),(0,_vuex.mapMutations)("framsStore",["SET_FRAMS_JUMParams","SET_FRAMS_JUMINParams"])),(0,_vuex.mapMutations)("common",["SET_TEMPLATE_PARAMS","SET_FORMREFRESH_PARENT","SET_COM_PAGERELOAD"])),(0,_vuex.mapMutations)("form",["SET_FILEPARAMS"])),{},{showByPermissiones:function(t,e,a){if(!e)return!1;var i=this.btnBasicInfo.saveEvent||[],n=this.btnBasicInfo.normalEvent||[],o=this.btnBasicInfo.delEvent||[];if(-1===i.indexOf(a)&&-1===o.indexOf(a)&&-1===n.indexOf(a))return!1;var r=this.tabInfo.bundleId;return this.Static_GlobalFucs.Permissiones(r,t,this.tabInfo.formType)},getJumpBundleParam:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";if(t){var e=this.tabInfo.mobileTabId,a={passParam:t,mobileTabId:e,tabsElements:this.tabsElements,tabsFormDatas:this.tabsFormDatas,tabStaticParams:this.tabStaticParams},i=btnsComs.getJumpBundleParam(a,this);return i&&this.SET_FRAMS_JUMParams({source:this.tabInfo.bundleId,value:i}),i||{}}},checkExecuteCondition:function checkExecuteCondition(formdata,text){var _this2=this,type=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"form",elements=arguments.length>3?arguments[3]:void 0,obj=JSON.parse(text),fortype="and"==obj.fortype?"&&":"||",formula=obj.formula,condition="",result,conditions=[],title=obj.isFalse,newTitle="",falseNames=this.Static_GlobalFucs.getSQLParams(obj.isFalse);if("list"==type)formdata.forEach((function(item){for(var _loop=function(t){condition="";var e=formula[t].key,a=elements.filter((function(t){return t.parameter==e})),i=a.length?a[0].elementId:null,n=i?item[i].id:_this2.Static_GlobalFucs.Global_ParamFormat({key:e},_this2).id;n=n||null;var o=-1==JSON.stringify(formula[t].value).indexOf("@@"),r="="==formula[t].cond?"===":formula[t].cond,s="";if(o)s=JSON.stringify(formula[t].value).trim();else{var l=formula[t].value,u=elements.filter((function(t){return t.parameter==l})),c=u.length?u[0].elementId:null;s=c?item[c].id:_this2.Static_GlobalFucs.Global_ParamFormat({key:l},_this2).id}s=s||null,t==formula.length-1?condition+="==="==r||"!="==r?"".concat(n)+r+"".concat(s):Number(n)+r+Number(s):condition+="==="==r||"!="==r?"".concat(n)+r+"".concat(s)+fortype:Number(n)+r+Number(s)+fortype},i=0;i<formula.length;i++)_loop(i);result=eval(condition),conditions.push(result),!result&&falseNames.length?(title=obj.isFalse,falseNames.forEach((function(t){var e=elements.filter((function(e){return e.parameter==t})),a=e.length?e[0].elementId:null,i=a?item[a].name:_this2.Static_GlobalFucs.Global_ParamFormat({key:t},_this2).id||null;title=title.replace("{"+t+"}",i||"")+"\n"})),newTitle+=title):result||falseNames.length||(newTitle=title)}));else{for(var _loop2=function(t){var e=elements.filter((function(e){return e.parameter==formula[t].key})),a=e.length?e[0].name:null,i=-1==JSON.stringify(formula[t].value).indexOf("@@"),n="="==formula[t].cond?"===":formula[t].cond,o=a?formdata[a]:_this2.Static_GlobalFucs.Global_ParamFormat({key:formula[t].key},_this2).id;o=o||null;var r="";if(i)r=JSON.stringify(formula[t].value).trim();else{var s=formula[t].value,l=elements.filter((function(t){return t.parameter==s})),u=l.length?l[0].name:null;r=u?formdata[u]:_this2.Static_GlobalFucs.Global_ParamFormat({key:s},_this2).id}r=r||null;var c="string"===typeof o?"'":"";t==formula.length-1?condition+="==="==n||"!="==n?"".concat(c).concat(o).concat(c)+n+"".concat(r):Number(o)+n+Number(r):condition+="==="==n||"!="==n?"".concat(c).concat(o).concat(c)+n+"".concat(r)+fortype:Number(o)+n+Number(r)+fortype},i=0;i<formula.length;i++)_loop2(i);result=eval(condition),conditions.push(result),!result&&falseNames.length&&falseNames.forEach((function(t){var e=elements.filter((function(e){return e.parameter==t})),a=e.length?e[0].label:null;title=title.replace("{"+t+"}",a||_this2.Static_GlobalFucs.Global_ParamFormat({key:t},_this2).id||"")})),newTitle=title}return-1==conditions.indexOf(!1)||(uni.showModal({title:"",content:newTitle||title,showCancel:!1}),!1)},handleBtnClick:function(t){this.$emit("checkedForm",{static_checkedForm:t.static_checkedForm,btnType:t.type});var e=this.tabInfo.mobileTabId,a=this.checkedFlag[e];if(console.log("=================================================================="),1!==t.static_checkedForm||a){if(t=(0,_objectSpread2.default)((0,_objectSpread2.default)((0,_objectSpread2.default)({},this.tabInfo),this.btnBasicInfo),t),t.tabStaticParams=this.tabStaticParams,t.submitFormData=this.submitTabsDatas[e]||{},"list"===this.tabInfo.templateType){var i=this.tabStaticParams.GlobalIds;if(i&&i.id&&(t.submitFormData.ids=i.id),t.executeCondition&&i){var n=this.tabStaticParams.GlobalCheckDatas,o=this.tabStaticParams.GlobalElements,r=this.checkExecuteCondition(n,t.executeCondition,"list",o);if(!r)return}if(1==t.defaultConditions){if(!i||!i.id||-1!=i.id.indexOf(","))return void uni.showModal({title:"",content:this.$t("lang-select-one"),showCancel:!1})}else if(2==t.defaultConditions&&(!i||!i.id))return void uni.showModal({title:"",content:this.$t("lang-select-one"),showCancel:!1})}else{var s=t.executeCondition&&this.checkExecuteCondition(this.submitTabsDatas[e],t.executeCondition,"form",this.tabInfo.mobileTabs[this.tabInfo.mobileTabId].elements);if(t.executeCondition&&!s)return;var l=this.tabInfo.relationMainTab;if("saveBtn"===t.type&&"batch"===this.tabInfo.formType&&l){var u=this.tabStaticParams.GlobalIds;u&&u.id&&(t.submitFormData.static_ids=u.id,"id"in t.submitFormData&&delete t.submitFormData.id,t.type="batchSaveBtn")}}if("list"!==this.tabInfo.templateType||"delBtn"!==t.type||t.submitFormData.ids){var c="tab";if(t.jumpMenuList&&t.jumpMenuList.length&&(c="menu"),"menu"===c){var d=this.getAccordBundle(t.jumpMenuList);if(d){var m=d.jumpBundleId,b=d.passParam;t.jumpBundleId=m,t.jumpBundleParam=this.getJumpBundleParam(b)||{},t.bundlesList=this.bundlesList}}else{var f=this.getAccordBundle(t.jumpTabList);if(f){var _=f.jumpMobileTabId,h=f.relationTabId;t.relationTabId=_||h}}var p=t.submitFormData.static_elementId;p&&(t.type="saveBtn",delete t.submitFormData.id),btnsComs.click(t,this)}else this.Static_GlobalFucs.showToast({title:this.$t("formTip-select")})}},isEligible:function(t){var e=this;if(t){var a=this.tabInfo,i=a.relationMainTab,n=a.mobileTabId,o=a.bundleParams,r={otherTabId:i,mobileTabId:n,bundleParams:o,tabsElements:this.tabsElements,tabsFormDatas:this.tabsFormDatas,tabStaticParams:this.tabStaticParams},s=[];try{s=JSON.parse(t)}catch(b){s=[]}for(var l=!0,u=function(t,a){var i=s[t],n=i.key,o=i.cond,u=i.value,c=e.Static_GlobalFucs.Global_ParamFormat((0,_objectSpread2.default)((0,_objectSpread2.default)({},{key:n}),r),e),d=e.Static_GlobalFucs.Global_ParamFormat((0,_objectSpread2.default)((0,_objectSpread2.default)({},{key:u}),r),e);c="".concat(c.id),d="".concat(d.id);var m=_triggers.TRIGGER_Conditions.find((function(t){return t.name===o}));if(!(0,_trigger.TRIGGRT_ConditionFnc)(m,d,c))return l=!1,"break"},c=0,d=s.length;c<d;c++){var m=u(c);if("break"===m)break}return l}return!0},getAccordBundle:function(){for(var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e="",a=0,i=t.length;a<i;a++){var n=t[a]||{};if(this.isEligible(n.preconditions)){e=(0,_objectSpread2.default)({},n);break}}return e},loading:function(t){this.btnDisable=t||!1},btnBack:function(t){if(this.btnDisable=!1,2===t)_bus.default.$emit(this.tabInfo.parentKey,this.tabInfo.refreshParams),uni.navigateBack();else if(1===t)_bus.default.$emit(this.tabInfo.selfKey,this.tabInfo.refreshParams);else if(3===t){var e=(0,_element.ELEMENT_BACKFRAME)({frameUId:this.frameUId}),a=e.pageNum-(e.pageIndex+1),i="";i="form"===e.templateType?"formReload".concat(this.frameUId):"listReload".concat(this.frameUId),_bus.default.$emit(i,this.tabInfo.refreshParams),uni.navigateBack({delta:a,animationType:"slide-out-right"})}else 4===t&&(this.SET_COM_PAGERELOAD({pageUid:"parent",type:!0}),uni.navigateBack())},btnEvent:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=this;e.tip?this.Static_GlobalFucs.showToast({title:e.tipContent,mask:!0,complete:function(){setTimeout((function(){uni.hideToast(),a.btnBack(t)}),600)}}):this.btnBack(t)}}),created:function(){var t=[];for(var e in this.workSpaceList){var a=this.workSpaceList[e];t=[].concat((0,_toConsumableArray2.default)(t),(0,_toConsumableArray2.default)(a.list))}this.bundlesList=[].concat((0,_toConsumableArray2.default)(this.bottomList),(0,_toConsumableArray2.default)(t))}};exports.default=_default2},"21e5":function(t,e,a){"use strict";a.r(e);var i=a("ba23"),n=a("464e");for(var o in n)["default"].indexOf(o)<0&&function(t){a.d(e,t,(function(){return n[t]}))}(o);var r=a("f0c5"),s=Object(r["a"])(n["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);e["default"]=s.exports},"464e":function(t,e,a){"use strict";a.r(e);var i=a("1ce8"),n=a.n(i);for(var o in i)["default"].indexOf(o)<0&&function(t){a.d(e,t,(function(){return i[t]}))}(o);e["default"]=n.a},b523:function(t,e,a){"use strict";a.r(e);var i=a("e9b4"),n=a.n(i);for(var o in i)["default"].indexOf(o)<0&&function(t){a.d(e,t,(function(){return i[t]}))}(o);e["default"]=n.a},ba23:function(t,e,a){"use strict";a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return n})),a.d(e,"a",(function(){}));var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"bottomBtnsComs"},[t._l(t.buttons,(function(e,i){return[t.showByPermissiones(e.baseType,e.visiabled,e.type)?a("m-button",{key:i+"_0",ref:e.elementId,refInFor:!0,staticClass:"btn-item",attrs:{btnClass:e.btnStyle,btnColor:e.labelIconColour,btnInfo:t.btnInfo(e),elementId:e.elementId,btnTilte:e.label,visiabled:e.visiabled,elementFormat:e.elementFormat,disabled:t.btnDisable,checkForm:!0},on:{elementClick:function(e){arguments[0]=e=t.$handleEvent(e),t.handleBtnClick.apply(void 0,arguments)}}}):t._e()]}))],2)},n=[]},daec:function(t,e,a){"use strict";a.r(e);var i=a("e2d7"),n=a("b523");for(var o in n)["default"].indexOf(o)<0&&function(t){a.d(e,t,(function(){return n[t]}))}(o);var r=a("f0c5"),s=Object(r["a"])(n["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);e["default"]=s.exports},e2d7:function(t,e,a){"use strict";a.d(e,"b",(function(){return i})),a.d(e,"c",(function(){return n})),a.d(e,"a",(function(){}));var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"BRATemplate"},[a("m-back-bar",[a("template",{attrs:{slot:"barTitle"},slot:"barTitle"},[t._v(t._s(t.barTitle))]),a("template",{attrs:{slot:"barRight"},slot:"barRight"},[a("top-btns-coms",{attrs:{tabInfo:t.tabInfo,btnBasicInfo:t.btnBasicInfo,tabStaticParams:t.tabStaticParams}})],1)],2),t.quickQuery.isSearch?a("v-uni-view",{staticClass:"list-seach"},[a("m-input-search",{attrs:{tabInfo:t.tabInfo,quickQuery:t.quickQuery,mobileTabId:t.tabInfo.mobileTabId,isQuickQuery:t.quickQuery.isQuickQuery,isSeniorFilter:t.quickQuery.isSeniorFilter},on:{doSearch:function(e){arguments[0]=e=t.$handleEvent(e),t.handelSearch.apply(void 0,arguments)}}})],1):t._e(),t.isShow?a("ListCom",{ref:"List",attrs:{tabInfo:t.tabInfo,listConfig:t.listConfig},on:{clickList:function(e){arguments[0]=e=t.$handleEvent(e),t.clickList.apply(void 0,arguments)},checkNode:function(e){arguments[0]=e=t.$handleEvent(e),t.checkNode.apply(void 0,arguments)},unCheckNode:function(e){arguments[0]=e=t.$handleEvent(e),t.unCheckNode.apply(void 0,arguments)}}}):t._e(),a("v-uni-view",{staticClass:"BRATemplate-btns"},[a("bottom-btns-coms",{attrs:{tabInfo:t.tabInfo,tabStaticParams:t.tabStaticParams}})],1)],1)},n=[]},e9b4:function(t,e,a){"use strict";a("7a82");var i=a("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,a("a9e3");var n=i(a("5530")),o=i(a("3184")),r=(a("cd03"),a("26cb")),s=i(a("551a")),l=i(a("f7ad")),u=i(a("5bf6")),c=i(a("21e5")),d=i(a("073b")),m=new s.default,b={components:{topBtnsComs:u.default,bottomBtnsComs:c.default,mInputSearch:l.default,ListCom:d.default},data:function(){return{listConfig:{},page:0,currentPage:1,quickQuery:{},searchParams:{},isShow:!1,tabInfo:{},barTitle:"",btnBasicInfo:{normalEvent:["normalBtn","addBtn","relationAddBtn"],delEvent:["delBtn"]},tabStaticParams:{}}},computed:(0,n.default)((0,n.default)({},(0,r.mapState)(["bundleName","bundleId","BusinessID"])),(0,r.mapState)("common",["templateParams","tabsElements","tabsFormDatas","pageRealod"])),watch:{searchParams:function(t,e){this.$refs.list.searchParams=t}},methods:(0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)({},(0,r.mapMutations)(["SET_bundle","SET_BusinessID","SET_ORIGIN"])),(0,r.mapMutations)("list",["SET_LIST_REFRESH"])),(0,r.mapMutations)("form",["SET_ALLBTNS"])),(0,r.mapMutations)("home",["SET_NEW_BUNDLE"])),(0,r.mapMutations)("common",["SET_TEMPLATE_PARAMS","SET_TRIGGERMAP","SET_COMMONSLT","SET_TABS_ELEMENT","SET_COM_PAGERELOAD"])),(0,r.mapMutations)("advanceFilter",["SET_ADVAN_FILTERS","SET_ADV_FORMDATAS"])),(0,r.mapMutations)("Toast",["TOAST_REQUESTURLS"])),{},{checkNode:function(t){var e=t.checkIds,a=t.checkDatas,i="";e.length>0&&(i={id:e.join(","),name:e.join(","),relationColumnType:1}),this.tabStaticParams.GlobalIds=i,this.tabStaticParams.GlobalCheckDatas=a,this.tabStaticParams.GlobalElements=this.tabInfo.mobileTabs[this.tabInfo.mobileTabId].elements},unCheckNode:function(t){var e=t.checkIds,a={};e.length>0&&(a={id:e.join(","),name:e.join(","),relationColumnType:1}),this.tabStaticParams.GlobalIds=a},clickList:function(t){t=(0,n.default)((0,n.default)({},this.tabInfo),t),t.isMain=!1,t.tabStaticParams=this.tabStaticParams,m.clickListNode(this,t)},handelSearch:function(t){var e=(0,n.default)((0,n.default)({},this.quickQuery),t),a=m.handleSearchText(this,e);this.$refs.List.doSearch(a)},setListInfo:function(t){this.page=t.page||1,this.currentPage=t.currentPage||1},setPageInfo:function(t,e,a){var i=this,n=(a[t.mobileTabRelationTabId],t||{}),o=n.dataSourceType,r=n.commonApiHeaderId,s=n.interfaceInParam;if(2!==o||r){this.barTitle=t.mobileTabName||this.bundleName;var l={advancedQuery:t.advancedQuery||{},advancedSqlQuery:t.advancedSqlQuery||[],relationMainTab:this.tabInfo.relationMainTab};this.tabInfo.jumpTag&&(l.bundleParams=this.tabInfo.bundleParams||{});var u=m.advancedParams(this,l),c={},d={};4===t.mobileTabShowType&&(d[t.relationColumn]={static_connector:3,static_type:2,static_value:this.BusinessID}),c.otherParams={globalMap:u.advancedQuery,globalQueryMap:u.advancedSqlQuery,mobileTabId:this.tabInfo.mobileTabId,elementList:t.elements,mobileTabSource:t.mobileTabSource,seniorFilterMap:d},c.baseParams={hasIcon:!0,listIcon:t.listIcon||{},multiple:!0},c.isCheckedParams={primaryKey:t.primaryKey},c.goEventParams={primaryKey:t.primaryKey,mobileTabRelationTabId:t.mobileTabRelationTabId},2===o&&r?(c.baseParams.dataSourceType=o,c.baseParams.commonApiHeaderId=r,c.otherParams.interfaceInParam=s,c.url="static_getDataByInterface"):c.url="currencyGetListData",this.listConfig=c,setTimeout((function(){(2===o&&r||t.mobileTabSource&&t.elements.length>0)&&(i.isShow=!0),i.SET_ALLBTNS({tabId:e,bottomBtns:t.btnList.bottomBtn,topRightBtns:t.btnList.topRightBtn})}),100),this.quickQuery=t.quickQuery||{},this.SET_ADVAN_FILTERS({tabId:e,params:t.elements}),this.SET_ADV_FORMDATAS({tabId:e+"_filter",value:{}}),this.SET_TABS_ELEMENT({tabId:e,elements:t.elements})}else this.Static_GlobalFucs.showModal(this,{content:this.$t("pageTip-noInterface")},"error")}}),onLoad:function(t){var e=this;this.TOAST_REQUESTURLS({type:"clear"});var a=t.relationTab;if(a){var i=this.templateParams[a]||{},n=uni.getStorageSync(i.bundleId)||{},r=n.mobileTabs||{},s=r[a]||{},l="listReload".concat(this._uid),u={_uid:this._uid,templateType:"list",bundleId:i.bundleId,bundleName:i.bundleName,mobileTabId:Number(a),relationMainTab:i.relationMainTab||"",mobileTabs:r,trigger:n.triggerMap||{},onKey:i.onKey||"",selfKey:l,element:i.element||{},mainnColumn:s.relationColumn};this.tabInfo=u,this.setPageInfo(s,u.mobileTabId,r),this.SET_ORIGIN(!0);this.SET_COM_PAGERELOAD({pageUid:l,type:!1}),o.default.$on(l,(function(t){e.tabStaticParams={},e.$refs.List.getListData("reload")}))}},onShow:function(){var t=this.pageRealod.pages,e=this.tabInfo.selfKey;t[e]&&t[e].type&&(this.SET_COM_PAGERELOAD({pageUid:e,type:!1}),this.$refs.List.getListData("reload"))},onPullDownRefresh:function(){this.$refs.List.getListData("load")},onReachBottom:function(){this.$refs.List.getListData("loadnext")}};e.default=b}}]);