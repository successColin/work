(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-frames-inspection-inspection-inspectionDevice"],{"0fa6":function(t,e,i){t.exports=i.p+"static/img/nodata.2945b091.png"},"1aa3":function(t,e,i){"use strict";i("7a82");var n=i("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a=n(i("5530"));i("a9e3"),i("d81d"),i("ac1f"),i("5319"),i("14d9"),i("4e82"),i("99af"),i("7db0"),i("d3b7"),i("c740"),i("00b4"),i("acd8");var o=i("26cb"),s=i("1ce4e"),c=n(i("a527")),l=n(i("f4d5")),r=i("e2c1"),d=n(i("551a")),u=i("ea34"),f=new d.default,h={},p={onLoad:function(t){this.id=t.id,this.inspectionDoName=t.inspectionDoName;var e=t.relationTab;if(console.log(this.bundleId),e){var i=this.templateParams[e]||{},n=uni.getStorageSync(this.bundleId)||{};h=n.mobileTabs||{};var a=h[e]||{},o={_uid:this._uid,bundleId:this.bundleId,bundleName:this.bundleName,mobileTabId:Number(e),relationMainTab:i.relationMainTab||"",mobileTabs:h,trigger:n.triggerMap||{},parentKey:i.onkey||"",refreshParams:i.refreshParams||{},formType:i.type||"editBtn",cascadeSelects:a.cascadeSelects||[],commonSelects:a.commonSelects||[],selectsFilterParams:a.filterParams||{}};this.tabInfo=o,this.setPageInfo(a,o.mobileTabId,i.id)}},onShow:function(){this.getData()},onHide:function(){this.isShowRfidHR&&this.readCardStatus&&(clearTimeout(this.timer),this.readCardStatus=!1,(0,r.closeReadCard)())},onUnload:function(){this.isShowRfidHR&&this.readCardStatus&&(clearTimeout(this.timer),this.readCardStatus=!1,(0,r.closeReadCard)())},data:function(){return{readCardStatus:!1,timer:null,isShowScan:!0,isShowLock:!0,id:null,inspectionDoName:0,finishMoCount:0,moCount:null,nowRfid:"",deviceData:[],isSelectDevie:!1,selectMokey:[],pickerDisabled:!1,startDate:"",endDate:"",isAutoHours:!1}},computed:(0,a.default)((0,a.default)((0,a.default)((0,a.default)({},(0,o.mapState)(["bundleName","bundleId","isOriginHei","themeColor","scanningType","readCardType","hourFillingAutomatic","QRType"])),(0,o.mapState)("common",["templateParams","doRefreshParent","tabsElements","tabsFormDatas"])),(0,o.mapState)("Inspection",["inspectionDeviceLock","enableInspectionUnlockByCode","limitSkipToToday","constraintDeviceCompleteInspection"])),{},{isShowRfidHR:function(){return"RFID"===this.readCardType},isShowRfid:function(){return"RFID"!==this.readCardType}}),watch:{nowRfid:function(t){if(t){this.isShowRfidHR&&(clearTimeout(this.timer),this.readCardStatus=!1,(0,r.closeReadCard)());for(var e=0,i=this.deviceData.length;e<i;e++){if(t===this.deviceData[e].rfid){this.goToPoint(this.deviceData[e]),this.nowRfid="";break}i-1===e&&(this.nowRfid="",uni.showModal({title:this.$t("basic-modalTip"),content:this.$t("inspection-notFindDevice"),confirmText:this.$t("basic-confirm"),showCancel:!1}))}}}},onBackPress:function(t){this.isAutoHours||"2"!==this.hourFillingAutomatic||"2"!=this.constraintDeviceCompleteInspection||(0,s.updateSql)("inspectiondo",{manhours:0},{id:this.id})},methods:(0,a.default)((0,a.default)({},(0,o.mapMutations)("FrameVariable",["Set_Inspections"])),{},{inspctionJumpDate:function(){if(1===+this.limitSkipToToday)this.endDate=this.$dateFormat.formatDate(!1,"yyyy-MM-dd");else{var t=(new Date).getFullYear();this.endDate="".concat(t+10,"-01-01")}console.log("=================>",this.limitSkipToToday),this.isSelectDevie=!this.isSelectDevie,this.isSelectDevie&&0===this.selectMokey.length&&(this.pickerDisabled=!0)},handleJumpClick:function(t){this.isSelectDevie?this.$set(t,"checked",!t.checked):"2"!==this.inspectionDeviceLock&&"3"!==this.inspectionDeviceLock||this.goToPoint(t)},checkboxChange:function(t){var e=[],i=t.detail.value.map((function(t){var i=t.split("/")[1].replace(/-/g,"/"),n=new Date(i).getTime();return e.push(n),t.split("/")[0]})),n=e.sort((function(t,e){return e-t}))[0],a=this.$dateFormat.formatDate(!1,"yyyy-MM-dd"),o=this.$dateFormat.formatDate(n,"yyyy-MM-dd"),s=a===o?0:864e5;this.startDate=this.$dateFormat.formatDate(n+s,"yyyy-MM-dd"),this.selectMokey=i,this.selectMokey.length>0?this.pickerDisabled=!1:this.pickerDisabled=!0},selectAll:function(t){var e=[];if(t.detail.value.length){var i=[],n=this.deviceData.map((function(t){var n=t.moMaxPlanStartDate.replace(/-/g,"/"),a=new Date(n).getTime();i.push(a);var o=t;return o.checked=!0,e.push(o),t.mokey})),a=i.sort((function(t,e){return e-t}))[0],o=this.$dateFormat.formatDate(!1,"yyyy-MM-dd"),s=this.$dateFormat.formatDate(a,"yyyy-MM-dd"),c=o===s?0:864e5;this.startDate=this.$dateFormat.formatDate(a+c,"yyyy-MM-dd"),this.deviceData=e,this.selectMokey=n}else{this.deviceData.map((function(t){var i=t;return i.checked=!1,e.push(i),t.mokey}));this.deviceData=e,this.selectMokey=[]}this.selectMokey.length>0?this.pickerDisabled=!1:this.pickerDisabled=!0},cancelSelect:function(){this.isSelectDevie=!1},handleNotSelect:function(){this.pickerDisabled&&uni.showModal({title:this.$t("basic-modalTip"),content:this.$t("inspection-skip"),confirmText:this.$t("basic-confirm"),cancelText:this.$t("basic-cancel")})},confirmSelect:function(t){var e=this,i="".concat(t.detail.value," 00:00:00"),n=[this.$t("basic-cancel"),this.$t("basic-confirm")];plus.nativeUI.prompt("请输入点检跳过备注",(function(t){var n=t.index,a=t.value;if(1===n){var o=e.selectMokey.join(",");c.default.skipTask(e,{skipInspectionDoIds:e.id,skipMoKeys:o,skipDate:i,memo:a}).then((function(t){if(t){if(t.success){var i=e.selectMokey.map((function(t){return'"'.concat(t,'"')})),n=i.join(",");(0,s.deleteSkipMo)(e.id,n,(function(i){uni.showModal({title:e.$t("basic-modalTip"),content:t.msg,showCancel:!1,confirmText:e.$t("basic-confirm")}),e.getData()}),(function(t){uni.showModal({title:e.$t("basic-modalTip"),content:e.$t("inspection-deletionFailed"),showCancel:!1,confirmText:e.$t("basic-confirm")})}))}e.isSelectDevie=!1}}))}}),this.$t("basic-modalTip"),"备注:",n)},handleRfid:function(){var t=this,e=this;new l.default({readNFC:!0,$i18nMsg:function(e){return t.$t(e)},callback:function(t){e.nowRfid=t.value}})},handleRfidHR:function(){var t=this;this.readCardStatus||(clearTimeout(this.timer),this.timer=setTimeout((function(){t.readCardStatus=!1,(0,r.closeReadCard)(),uni.showModal({title:t.$t("basic-modalTip"),content:t.$t("basic-timeout"),showCancel:!1,confirmText:t.$t("basic-confirm")})}),8e3),(0,r.readCardInit)((function(){t.readCardStatus=!0,uni.showLoading({title:t.$t("inspection-readNFC")}),setTimeout((function(){uni.hideLoading(),uni.showToast({title:t.$t("inspection-NFCLabel"),icon:"none"}),t.readCardInfo()}),1e3)})))},readCardInfo:function(){var t=this;this.readCardStatus&&(0,r.readCard)((function(e){t.nowRfid=e[0]}),(function(){setTimeout((function(){return t.readCardInfo()}),1e3)}))},handleScan:function(){(0,u.ELEMENT_SCAN)({},this.scanCode)},goToPoint:function(t){var e=t.moid,i=t.mokey,n=t.moname,a=t.posid,o=t.posname,s=t.orgid,c=t.orgname,l=t.inspectiondoid;if(this.Set_Inspections({key:"InspectionDevice",value:{id:e,name:n}}),this.Set_Inspections({key:"InspectionPosition",value:{id:a,name:o}}),this.Set_Inspections({key:"InspectionOrganization",value:{id:s,name:c}}),this.tabInfo){var r=this.tabInfo.mobileTabs[this.tabInfo.mobileTabId],d=r.mobileTabRelationTabId;uni.navigateTo({url:"/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=".concat(l,"&mokey=").concat(i,"&type=device&relationTab=").concat(d,"&moname=").concat(n)})}else uni.navigateTo({url:"/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=".concat(l,"&mokey=").concat(i,"&type=device&moname=").concat(n)})},scanCode:function(t){var e=this,i="".concat(t.scancode);if(console.log("scanCode=========================================================="),console.log(i),console.log(this.scanningType),"2"==this.scanningType)(0,s.currencyHaiLiScanning)(i,this.id,(function(t){if(t.length){var i=t[0].mokey,n=e.deviceData.find((function(t){return i==="".concat(t.mokey)}));e.goToPoint(n)}else uni.showModal({title:e.$t("basic-modalTip"),content:e.$t("inspection-notFindDevice"),showCancel:!1,confirmText:e.$t("basic-confirm")})}),(function(t){console.log(t)}));else{var n=this.deviceData.findIndex((function(t){return i==="".concat(t.qrcode)}));if(-1===n&&(n=this.deviceData.findIndex((function(t){return i==="".concat(t.mokey)}))),-1===n)uni.showModal({title:this.$t("basic-modalTip"),content:this.$t("inspection-notFindDevice"),showCancel:!1,confirmText:this.$t("basic-confirm")});else{var a=this.deviceData[n];this.goToPoint(a)}}},handleUnlock:function(){var t=this;plus.nativeUI.prompt(t.$t("inspection-unlockDevice"),(function(e){if(1==e.index){var i=e.value.toLocaleLowerCase(),n=t.deviceData.findIndex((function(t){return i==="".concat(t.qrcode.toLocaleLowerCase())}));if(-1===n&&(n=t.deviceData.findIndex((function(t){return i==="".concat(t.mokey.toLocaleLowerCase())}))),-1===n)uni.showModal({title:t.$t("basic-modalTip"),content:t.$t("inspection-notFindDevice"),showCancel:!1,confirmText:t.$t("basic-confirm")});else{var a=t.deviceData[n];t.goToPoint(a)}}}),t.$t("basic-modalTip"),t.$t("inspection-enterCode"),[t.$t("basic-cancel"),t.$t("basic-confirm")])},finishInspection:function(){var t=this;plus.nativeUI.prompt(t.$t("inspection-enterTime"),(function(e){1==e.index&&(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(e.value)?(0,s.updateSql)("inspectiondo",{manhours:parseFloat(e.value)},{id:t.id},(function(){t.isAutoHours=!0,uni.navigateBack()})):uni.showModal({title:t.$t("basic-modalTip"),content:t.$t("check-nan"),showCancel:!1,confirmText:t.$t("basic-confirm")}))}),t.$t("basic-modalTip"),t.$t("inspection-significantNumber"),[t.$t("basic-cancel"),t.$t("basic-confirm")])},handleFinish:function(){var t=this,e=!0;if("1"==this.constraintDeviceCompleteInspection){var i=[];this.deviceData.map((function(t){return 0!=t.moOperatingCount&&t.moOperatingCount<t.moPointCount&&i.push(t),t}));var n="";i.length>0&&(e=!1,i.map((function(t,e){e<i.length-1?n+="".concat(t.moname,"、"):n+=t.moname,console.log(t.moname)})),uni.showModal({title:"提示",content:"".concat(n,"等设备未全部点检完成"),showCancel:!1,confirmText:t.$t("basic-confirm")}))}e&&(0,s.forceInspection)(this.id,(function(e){var i=1;0!==e.length&&(i=e[0].forcepointfinish),i?t.finishInspection():uni.showModal({title:t.$t("inspection-forceTip"),content:"".concat(e[0].mokey,",").concat(t.$t("inspection-hasforceNoFinish")),showCancel:!1,confirmText:t.$t("basic-confirm")})}))},getData:function(){var t=this;t.finishMoCount=0,t.moCount=0,(0,s.selectMoList)(t.id,(function(e){console.log(e),t.deviceData=e.map((function(e,i){return t.finishMoCount+=e.moOperatingCount,t.moCount+=e.moPointCount,e.ongoing=e.moOperatingCount>0,e.finish=e.moOperatingCount===e.moPointCount,e})),console.log(t.deviceData),t.finishMoCount===t.moCount&&0!=t.finishMoCount&&(0,s.selectManhours)(t.id,(function(e){e[0].manhours||setTimeout((function(){t.handleFinish()}),200)}))}))},setPageInfo:function(t,e){var i=this;if(e){var n=t[e];t[n.mobileTabRelationTabId];this.barTitle=n.mobileTabName||this.bundleName;var a=f.advancedParams(this,{advancedQuery:n.advancedQuery||{},advancedSqlQuery:n.advancedSqlQuery||[],relationMainTab:this.tabInfo.relationMainTab}),o={};o.otherParams={globalMap:a.advancedQuery,globalQueryMap:a.advancedSqlQuery,mobileTabId:this.tabInfo.mobileTabId,elementList:n.elements,mobileTabSource:n.mobileTabSource},o.baseParams={hasIcon:!0,listIcon:n.listIcon||{}},o.goEventParams={primaryKey:n.primaryKey,mobileTabRelationTabId:n.mobileTabRelationTabId},o.url="currencyGetListData",this.listConfig=o,setTimeout((function(){n.mobileTabSource&&n.elements.length>0&&(i.isShow=!0)}),100),this.quickQuery=n.quickQuery||{},this.SET_ADVAN_FILTERS({tabId:e,params:n.elements}),this.SET_TABS_ELEMENT({tabId:this.mobileTabId,elements:n.elements})}}})};e.default=p},2116:function(t,e,i){var n=i("f9df");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=i("4f06").default;a("43f46a8d",n,!0,{sourceMap:!1,shadowMode:!1})},"551a":function(t,e,i){"use strict";i("7a82");var n=i("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("d81d"),i("14d9");var a=n(i("53ca")),o=n(i("d4ec")),s=n(i("bee2")),c=i("cad8"),l=(i("cd03"),function(){function t(e,i){(0,o.default)(this,t)}return(0,s.default)(t,[{key:"advancedParams",value:function(t,e){var i=e.advancedQuery,n=e.advancedSqlQuery,o=e.relationMainTab,s=e.bundleParams,c=e.tabStaticParams,l={advancedQuery:{},advancedSqlQuery:{}},r={otherTabId:o,tabsElements:t.tabsElements,tabsFormDatas:t.tabsFormDatas,bundleParams:s,tabStaticParams:c};for(var d in i){var u=r;u.key=d;var f=t.Static_GlobalFucs.Global_ParamFormat(u,t);f&&"object"===(0,a.default)(f)&&(f=f.id),l.advancedQuery[d]=f}return n.map((function(e){var i=r;i.key=e;var n=t.Static_GlobalFucs.Global_ParamFormat(i,t);l.advancedSqlQuery[e]={value:n.id,type:n.relationColumnType}})),l}},{key:"clickListNode",value:function(t,e){var i=e.primaryKey,n=e.listItem||{},a=n[i]||"";if(a=e.isMain?t.Static_GlobalFucs.setBusinessID(t,a):t.Static_GlobalFucs.dataFormat(a),e.mobileTabRelationTabId){var o=e.mobileTabs[e.mobileTabRelationTabId],s=o.mobileTabShowType,l=o.childMobilTable||[],r={tabId:e.mobileTabRelationTabId,params:{relationTab:e.mobileTabRelationTabId,relationMainTab:e.mobileTabId,onkey:e.selfKey,id:a.id,refreshParams:e.refreshParams,bundleId:e.bundleId,bundleName:e.bundleName,tabStaticParams:e.tabStaticParams}};t.SET_TEMPLATE_PARAMS(r);var d=c.mobileTabShowType[s];2===s&&l.length>0&&(d="templates/formListTemplate"),t.Static_GlobalFucs.gotoOtherRoute(r,d)}}},{key:"handleSearchText",value:function(t,e){var i=e.quickQueryParams||{},n=[],a={};if(1===e.searchType){for(var o in i){var s=i[o].relationColumnName,c=i[o].relationTableName;i[o].mainTableName&&(s=i[o].mainColumnName,c=i[o].mainTableName);var l={field:s,value:e.searchText,tableName:c,elementId:i[o].elementId||""};n.push(l)}a={calendarList:n}}else 2===e.searchType&&(a={seniorFilterMap:e.searchText});return a}}]),t}()),r=l;e.default=r},"5e1f":function(t,e,i){"use strict";var n=i("2116"),a=i.n(n);a.a},8699:function(t,e,i){"use strict";i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return a})),i.d(e,"a",(function(){}));var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-uni-view",{staticClass:"inspection-device"},[n("m-back-bar",[n("template",{attrs:{slot:"barTitle"},slot:"barTitle"},[t._v(t._s(t.$t("inspection-device")))]),n("template",{attrs:{slot:"barRight"},slot:"barRight"},[t.isSelectDevie?t._e():n("m-button",{attrs:{isFontBtn:!0,btnClass:"mainColor"},on:{elementClick:function(e){arguments[0]=e=t.$handleEvent(e),t.handleFinish.apply(void 0,arguments)}}},[n("template",{staticStyle:{display:"inline-block"},attrs:{slot:"buttonIcon"},slot:"buttonIcon"},[n("m-font-icon",{attrs:{icon:"inspectionConfirm",iconSize:40}})],1)],2),t.isSelectDevie?n("m-button",{attrs:{isFontBtn:!0,btnClass:"mainColor"}},[n("template",{staticStyle:{display:"inline-block"},attrs:{slot:"buttonIcon"},slot:"buttonIcon"},[n("v-uni-checkbox-group",{on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.selectAll.apply(void 0,arguments)}}},[n("v-uni-checkbox",{staticClass:"checkbox-all",staticStyle:{display:"inline-block"},attrs:{value:"1",checked:!1}})],1)],1)],2):t._e(),n("m-button",{attrs:{isFontBtn:!0,btnClass:"mainColor"},on:{elementClick:function(e){arguments[0]=e=t.$handleEvent(e),t.inspctionJumpDate.apply(void 0,arguments)}}},[n("template",{staticStyle:{display:"inline-block"},attrs:{slot:"buttonIcon"},slot:"buttonIcon"},[n("m-font-icon",{attrs:{icon:"inspectionJumpDate",iconSize:40}})],1)],2)],1)],2),0===t.deviceData.length?n("v-uni-view",{staticClass:"notdata"},[n("v-uni-image",{staticClass:"nodata-img",attrs:{src:i("0fa6")}}),n("v-uni-text",{staticClass:"nodata-text"},[t._v(t._s(t.$t("page-nodata")))])],1):t._e(),n("v-uni-view",{staticClass:"inspection-device-box"},[n("v-uni-view",{staticClass:"inspection-top-route hasStatusTop"},[n("v-uni-view",{staticClass:"route-detail"},[n("m-font-icon",{staticClass:"inspection-route-icon",attrs:{icon:"inspectionRoute",iconSize:80,color:"#FAB71C"}}),n("v-uni-text",{staticClass:"inspection-name"},[t._v(t._s(t.inspectionDoName))]),n("v-uni-text",{staticClass:"inspection-num"},[t._v(t._s(t.finishMoCount)+"/"+t._s(t.moCount))])],1)],1),n("v-uni-view",{staticClass:"uni-list"},[n("v-uni-checkbox-group",{on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.checkboxChange.apply(void 0,arguments)}}},t._l(t.deviceData,(function(e,i){return n("v-uni-label",{key:i,staticClass:"device-info uni-list-cell",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.handleJumpClick(e)}}},[n("v-uni-view",{staticClass:"device-info-box"},[t.isSelectDevie?n("v-uni-checkbox",{staticClass:"checkbox-style",attrs:{value:e.mokey+"/"+e.moMaxPlanStartDate,checked:e.checked}}):t._e(),n("v-uni-view",{staticClass:"m-info"},[n("v-uni-text",{staticClass:"moname"},[t._v(t._s(e.moname))])],1),n("v-uni-text",{class:["inspection-num",{ongoing:e.ongoing},{finish:e.finish},{shutdown:e.shutdownMoCount>0},{abnormal:e.abnormalMoCount>0}]},[t._v(t._s(e.moOperatingCount)+"/"+t._s(e.moPointCount))])],1),n("v-uni-text",{staticClass:"mokey"},[t._v(t._s(e.mokey))]),n("v-uni-view",{staticClass:"position-name-box"},[n("m-font-icon",{attrs:{icon:"iconweizhi",iconSize:20,color:"#D9D9D9"}}),n("v-uni-text",{staticClass:"position-name"},[t._v(t._s(e.posname))]),n("v-uni-text",{staticClass:"position-storagelocation"},[t._v(t._s(e.storagelocation||""))])],1)],1)})),1)],1)],1),t.isSelectDevie?n("v-uni-view",{staticClass:"formTemplate-btns foot"},[n("m-button",{staticClass:"btn-item",attrs:{btnClass:"whiteColor",btnTilte:t.$t("basic-cancel")},on:{elementClick:function(e){arguments[0]=e=t.$handleEvent(e),t.cancelSelect.apply(void 0,arguments)}}}),n("v-uni-picker",{staticClass:"btn-item",attrs:{disabled:t.pickerDisabled,mode:"date",start:t.startDate,end:t.endDate},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleNotSelect.apply(void 0,arguments)},change:function(e){arguments[0]=e=t.$handleEvent(e),t.confirmSelect.apply(void 0,arguments)}}},[n("m-button",{staticClass:"btn-item",staticStyle:{width:"100%"},attrs:{btnClass:"mainColor",btnTilte:t.$t("basic-confirm")}})],1)],1):"1"===t.inspectionDeviceLock||"3"===t.inspectionDeviceLock?n("v-uni-view",{staticClass:"inspection-operation"},[t.isShowRfid?n("v-uni-view",{staticClass:"item rfid",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleRfid.apply(void 0,arguments)}}},[n("m-font-icon",{staticClass:"item-icon",attrs:{icon:"inspectionRfid",iconSize:34,color:"#444444"}}),n("v-uni-text",{staticClass:"item-text"},[t._v(t._s(t.readCardType))])],1):t._e(),t.isShowRfidHR?n("v-uni-view",{staticClass:"item rfid",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleRfidHR.apply(void 0,arguments)}}},[n("m-font-icon",{staticClass:"item-icon",attrs:{icon:"inspectionRfid",iconSize:34,color:"#444444"}}),n("v-uni-text",{staticClass:"item-text"},[t._v(t._s(t.readCardType))])],1):t._e(),t.isShowScan&&"0"!==t.QRType?n("v-uni-view",{staticClass:"item scan",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleScan.apply(void 0,arguments)}}},[n("m-font-icon",{staticClass:"item-icon",attrs:{icon:"iconsaoma1",iconSize:34,color:"#444444"}}),n("v-uni-text",{staticClass:"item-text"},[t._v(t._s(t.$t("basic-scanCode")))])],1):t._e(),"true"===t.enableInspectionUnlockByCode?n("v-uni-view",{staticClass:"item unlock",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.handleUnlock.apply(void 0,arguments)}}},[n("m-font-icon",{staticClass:"item-icon",attrs:{icon:"inspectionUnlock",iconSize:34,color:"#444444"}}),n("v-uni-text",{staticClass:"item-text"},[t._v(t._s(t.$t("inspection-unlock")))])],1):t._e()],1):t._e()],1)},a=[]},a527:function(t,e,i){"use strict";i("7a82");var n=i("dbce").default,a=i("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0,i("a9e3");var o=a(i("5530")),s=n(i("d56d")),c={getInspectionDo:function(t,e,i){return e=(0,o.default)((0,o.default)({},e),{userId:i}),t.$http.post(s.inspectionDo,e).then((function(e){var i=e.data;if(i.success)return i.data;throw uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(e){uni.showModal({title:t.$t("basic-modalTipError"),content:e||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.error(e)}))},getInspectionPotinDo:function(t,e,i){return e=(0,o.default)((0,o.default)({},e),{userId:i}),t.$http.post(s.inspectionPointDo,e).then((function(e){var i=e.data;if(i.success)return i.data;throw uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(e){uni.showModal({title:t.$t("basic-modalTipError"),content:e||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.error(e)}))},updataInspection:function(t,e){return console.log(e),t.$http.post(s.uploadInspectionHistory,e).then((function(e){var i=e.data;return i.success||uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(e){return uni.showModal({title:t.$t("basic-modalTipError"),content:e||"上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),e}))},skipTask:function(t,e){return uni.showLoading({title:"加载中..."}),t.$http.post(s.skipTask,e).then((function(e){var i=e.data;return uni.hideLoading(),i.success||uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"跳过失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(e){return uni.hideLoading(),uni.showModal({title:t.$t("basic-modalTipError"),content:e||"跳过失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),e}))},upInspectionFile:function(t,e,i,n,a){var o=t.baseUrl||t.defaultUrl,c={basetype:2,tableName:"inspectionpointhistory",token:t.token};a&&0!=a&&""!=a&&(c.waterMarkId=Number(a)),uni.uploadFile({url:o+s.uploadInspectionFiles,header:{"content-type":"multipart/form-data",token:t.token},formData:c,files:e,success:function(t){if(200==t.statusCode){var e=JSON.parse(t.data);e.success?i&&i(t):n&&n(e)}else n&&n(t)},fail:function(e){n&&n(),uni.showModal({title:t.$t("basic-modalTipError"),content:"图片上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.warn(e,"请检查是否CORB/CORS错误!")}})}},l=c;e.default=l},a898:function(t,e,i){"use strict";i.r(e);var n=i("8699"),a=i("e5f2");for(var o in a)["default"].indexOf(o)<0&&function(t){i.d(e,t,(function(){return a[t]}))}(o);i("5e1f");var s=i("f0c5"),c=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"4784d03b",null,!1,n["a"],void 0);e["default"]=c.exports},d56d:function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.uploadInspectionHistory=e.uploadInspectionFiles=e.skipTask=e.inspectionPointDo=e.inspectionDo=void 0;e.inspectionDo="inspectionDo/selectPage";e.inspectionPointDo="inspectionPointDo/selectPage";e.uploadInspectionHistory="inspectionHistory/uploadInspectionHistory";e.uploadInspectionFiles="file/uploadInspectionFiles";e.skipTask="inspectionPointDo/skipTask"},e2c1:function(t,e,i){"use strict";i("7a82"),Object.defineProperty(e,"__esModule",{value:!0}),e.readMeaInit=e.readCardInit=e.readCard=e.meaTem=e.initMeaTem=e.closeReadCard=e.closeMeaTem=void 0,i("e9c4"),i("ac1f");e.initMeaTem=function(t,e){var i=plus.bridge.callbackId((function(e){"function"===typeof t&&t.call(this,e)}),(function(t){"function"===typeof e&&e.call(this,t),uni.showModal({title:"fail",content:"开启红外线"+JSON.stringify(t)})}));plus.bridge.exec("Inspection","initMeaTem",[i])};e.readMeaInit=function(t,e){var i=plus.bridge.callbackId((function(e){"function"===typeof t&&t.call(this,e)}),(function(t){"function"===typeof e&&e.call(this,t),uni.showModal({title:"fail",content:"准备测量"+JSON.stringify(t)})}));plus.bridge.exec("Inspection","readMeaInit",[i])};e.meaTem=function(t,e,i){console.log(t);var n=plus.bridge.callbackId((function(t){"function"===typeof e&&e.call(this,t)}),(function(t){"function"===typeof i&&i.call(this,t),uni.showModal({title:"fail",content:"开始测量"+JSON.stringify(t)})}));plus.bridge.exec("Inspection","meaTem",[n],t)};e.closeMeaTem=function(t,e){var i=plus.bridge.callbackId((function(e){"function"===typeof t&&t.call(this,e)}),(function(t){"function"===typeof e&&e.call(this,t),uni.showModal({title:"fail",content:"结束测量"+JSON.stringify(t)})}));plus.bridge.exec("Inspection","closeMeaTem",[i])};e.readCardInit=function(t,e){var i=plus.bridge.callbackId((function(e){"function"===typeof t&&t.call(this,e)}),(function(t){"function"===typeof e&&e.call(this,t),uni.showModal({title:"fail",content:"准备NFC"+JSON.stringify(t)})}));plus.bridge.exec("Inspection","readCardInit",[i])};e.readCard=function(t,e){var i=plus.bridge.callbackId((function(e){"function"===typeof t&&t.call(this,e)}),(function(t){"function"===typeof e&&e.call(this,t)}));plus.bridge.exec("Inspection","readCard",[i])};e.closeReadCard=function(t,e){var i=plus.bridge.callbackId((function(e){"function"===typeof t&&t.call(this,e)}),(function(t){"function"===typeof e&&e.call(this,t),uni.showModal({title:"fail",content:"关闭NFC"+JSON.stringify(t)})}));plus.bridge.exec("Inspection","closeReadCard",[i])}},e5f2:function(t,e,i){"use strict";i.r(e);var n=i("1aa3"),a=i.n(n);for(var o in n)["default"].indexOf(o)<0&&function(t){i.d(e,t,(function(){return n[t]}))}(o);e["default"]=a.a},ea34:function(t,e,i){"use strict";i("7a82");var n=i("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.ELEMENT_SCAN=e.ELEMENT_BACKFRAME=void 0,i("c740");var a=n(i("5441")),o=i("4037");e.ELEMENT_SCAN=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:function(){};return"1"===a.default.state.QRType&&(0,o.onWxScan)((function(i){t.scancode=i.resultStr,t.scancode&&e.call(void 0,t)})),!1};e.ELEMENT_BACKFRAME=function(t){var e=getCurrentPages(),i=e.findIndex((function(e){return e.$vm._uid===t.frameUId})),n=e[i];return{pageNum:e.length,pageIndex:i,templateType:n.templateType}}},f4d5:function(t,e,i){"use strict";i("7a82");var n=i("4ea4").default;Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a,o,s,c=n(i("d4ec")),l=n(i("bee2")),r=[["android.nfc.tech.IsoDep"],["android.nfc.tech.NfcA"],["android.nfc.tech.NfcB"],["android.nfc.tech.NfcF"],["android.nfc.tech.Nfcf"],["android.nfc.tech.NfcV"],["android.nfc.tech.NdefFormatable"],["android.nfc.tech.MifareClassi"],["android.nfc.tech.MifareUltralight"]],d=function(t){var e,i,n,a=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"],o="";for(i=0;i<t.length;++i)n=255&t[i],e=n>>>4&15,o+=a[e],e=15&n,o+=a[e];return o};function u(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1500;uni.showToast({title:t,icon:"none",duration:e})}var f=function(){function t(e){(0,c.default)(this,t),plus.globalEvent.removeEventListener("newintent"),plus.globalEvent.removeEventListener("pause"),plus.globalEvent.removeEventListener("resume"),this.readResult={},this.readyRead=!1,this.readyWriteData=!1,this.noNFC=!0,this.$i18nMsg=e.$i18nMsg,this.listenNFCStatus(),this.callback=e.callback,e.readNFC&&this.readData(),this.get()}return(0,l.default)(t,[{key:"listenNFCStatus",value:function(){var t=this;console.log("listenNFCStatus================================================="),console.log(t),u(t.$i18nMsg("lang-NFC-test"));try{console.log("listenNFCStatus=================================================1");var e=plus.android.runtimeMainActivity(),i=plus.android.importClass("android.content.Intent"),n=(plus.android.importClass("android.app.Activity"),plus.android.importClass("android.app.PendingIntent")),o=plus.android.importClass("android.content.IntentFilter");a=plus.android.importClass("android.nfc.NfcAdapter");var s=a.getDefaultAdapter(e);if(null==s)return uni.showToast({title:t.$i18nMsg("lang-NFC-no"),icon:"none"}),void(this.noNFC=!0);if(!s.isEnabled())return uni.showToast({title:t.$i18nMsg("lang-NFC-open-first"),icon:"none"}),void(this.noNFC=!0);this.noNFC=!1,console.log("listenNFCStatus=================================================2");var c=new i(e,e.getClass());c.addFlags(i.FLAG_ACTIVITY_SINGLE_TOP);var l=n.getActivity(e,0,c,0),d=new o("android.nfc.action.TECH_DISCOVERED");d.addDataType("*/*");var f=[d];console.log("listenNFCStatus=================================================4"),plus.globalEvent.addEventListener("newintent",(function(){console.log("newintent running"),setTimeout(t.nfcRuning(),1e3)})),plus.globalEvent.addEventListener("pause",(function(t){console.log("pause running"),s&&s.disableForegroundDispatch(e)})),plus.globalEvent.addEventListener("resume",(function(t){console.log("resume running"),s&&s.enableForegroundDispatch(e,l,f,r)})),s.enableForegroundDispatch(e,l,f,r),console.log("listenNFCStatus=================================================5")}catch(h){console.error(h)}}},{key:"nfcRuning",value:function(){console.log("listenNFCStatus================================================="),o=plus.android.importClass("android.nfc.NdefRecord"),s=plus.android.importClass("android.nfc.NdefMessage");var t=plus.android.runtimeMainActivity(),e=t.getIntent();console.log("action type:"+e.getAction()),"android.nfc.action.TECH_DISCOVERED"==e.getAction()&&(this.readyWriteData?(this.write(e),this.readyWriteData=!1):this.readyRead&&(this.read(e),this.readyRead=!1))}},{key:"write",value:function(t){try{u(this.$i18nMsg("lang-NFC-no-move")),console.log("text="+text);var e=plus.android.invoke(text,"getBytes"),i=new o(o.TNF_MIME_MEDIA,plus.android.invoke("text/plain","getBytes"),plus.android.invoke("","getBytes"),e),n=new s([i]),c=plus.android.importClass("android.nfc.tech.Ndef"),l=plus.android.importClass("android.nfc.tech.NdefFormatable"),r=t.getParcelableExtra(a.EXTRA_TAG),d=c.get(r);if(null!=d){var f=n.toByteArray().length;return d.connect(),d.isWritable()?d.getMaxSize()<f?void u(this.$i18nMsg("lang-NFC-file-excess")):(d.writeNdefMessage(n),void u(this.$i18nMsg("lang-NFC-enter-success"))):void u(this.$i18nMsg("lang-NFC-no-enter"))}var h=l.get(r);if(null==h)return void u(this.$i18nMsg("lang-NFC-no-NDEF"));try{return h.connect(),h.format(n),void u(this.$i18nMsg("lang-NFC-format-write"))}catch(p){return void u(this.$i18nMsg("lang-NFC-format-fail"))}}catch(p){u(this.$i18nMsg("lang-NFC-enter-fail")),console.log("error="+p)}}},{key:"read",value:function(t){u(this.$i18nMsg("lang-NFC-move-enter"),1e4);try{var e=plus.android.importClass("android.nfc.Tag"),i="";e=t.getParcelableExtra(a.EXTRA_TAG);t.getByteArrayExtra(a.EXTRA_ID);var n=d(e.getId());i+=this.$i18nMsg("lang-NFC-card-chart-id")+"："+e.getId()+"<br/>",i+=this.$i18nMsg("lang-NFC-card-id")+"："+d(e.getId())+"<br/>",this.readResult.value=n,u(this.$i18nMsg("lang-NFC-read-success")),this.callback&&this.callback.call(this,this.readResult),console.log(i)}catch(o){u(o)}}},{key:"writeData",value:function(){this.noNFC?u(this.$i18nMsg("lang-NFC-support-open")):(this.readyWriteData=!0,u(this.$i18nMsg("lang-NFC-near")))}},{key:"readData",value:function(){this.noNFC?u(this.$i18nMsg("lang-NFC-support-open")):(this.readyRead=!0,u(this.$i18nMsg("lang-NFC-near")))}},{key:"get",value:function(){console.log("get================================================")}}]),t}(),h=f;e.default=h},f9df:function(t,e,i){var n=i("24fb");e=n(!1),e.push([t.i,".hasStatusTop[data-v-4784d03b]{margin-top:0}",""]),t.exports=e}}]);