(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-frames-inspection-inspection-inspectionUpload"],{"0fa6":function(t,n,i){t.exports=i.p+"static/img/nodata.2945b091.png"},"2e74":function(t,n,i){"use strict";i.r(n);var e=i("8d1a"),a=i("c006");for(var o in a)["default"].indexOf(o)<0&&function(t){i.d(n,t,(function(){return a[t]}))}(o);var s=i("f0c5"),c=Object(s["a"])(a["default"],e["b"],e["c"],!1,null,"7e406216",null,!1,e["a"],void 0);n["default"]=c.exports},6619:function(t,n,i){"use strict";i("7a82");var e=i("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,i("d81d"),i("d3b7"),i("159b"),i("14d9"),i("99af"),i("e9c4"),i("a434"),i("ac1f"),i("00b4"),i("acd8");var a=e(i("5530")),o=i("1ce4e"),s=(e(i("50ab")),e(i("a527"))),c=i("26cb"),u={onShow:function(){this.getData()},computed:(0,a.default)((0,a.default)({},(0,c.mapState)(["baseUrl","defaultUrl","token","waterMarkConfig"])),{},{manhoursStyle:function(){return function(t){return""===t||0===t?"color: red":""}}}),data:function(){return{disabled:!1,resultsData:[],upInspData:[],upFileData:[],pointId:[],inspectionId:[],isUploading:!1}},methods:{getData:function(){var t=this;(0,o.selectInspectionHistory)((function(n){t.resultsData=n.map((function(t){return t.manhours||(t.manhours=""),t}))}))},selectInspectionData:function(t){var n=this;n.pointId=[],(0,o.selectInspectionUpData)((function(i){n.upInspData=i,n.upInspData.forEach((function(i,e){n.inspectionId.push(i.inspectionDoId),(0,o.selectPointsByInspectionDoId)(i.inspectionDoId,(function(i){var a=i.map((function(t){return t.inspectionPointDoId}));n.pointId=n.pointId.concat(a),n.upInspData[e].pointHistoryJsonStr=JSON.stringify(i),n.upInspData.length-1===e&&t()}))}))}))},selectFiles:function(t){var n=this;n.upFileData=[],(0,o.selectAllFile)((function(i){for(var e=Math.ceil(i.length/10),a=0;a<e;a++)n.upFileData.push(i.splice(0,10));t&&t()}))},upInspectionData:function(t,n){var i=this;s.default.updataInspection(i,i.upInspData[t]).then((function(e){if(!e.success)return uni.hideLoading(),void(i.isUploading=!1);i.upInspData.length-1!==t?i.upInspectionData(++t,n):i.upInspData.length-1===t&&((0,o.updateUploadstatus)("inspectiondo",i.inspectionId,(function(){(0,o.updateUploadstatus)("inspectionpointdo",i.pointId,(function(){n&&n()}))})),(0,o.updateManhourSql)("inspectiondo",i.inspectionId))})).catch((function(t){uni.hideLoading(),i.isUploading=!1}))},uploadFile:function(t,n){var i=this,e=[];i.upFileData[t]=i.upFileData[t].map((function(t,n){return e.push(t.id),{uri:t.filepath,name:"".concat(t.inspectionpointdoid,"_").concat(t.createuserid,"_").concat(n)}})),s.default.upInspectionFile(i,i.upFileData[t],(function(){(0,o.updateUploadstatus)("inspectionfiles",e,(function(e){i.upFileData.length-1===t?n&&n():i.uploadFile(++t,n)}))}),(function(t){if(uni.hideLoading(),i.isUploading=!1,(0,o.updateUploadstatus)("inspectionfiles",e),t){var n=t.msg||"";uni.showModal({title:i.$t("basic-modalTipError"),content:"图片上传失败".concat(n),showCancel:!1,confirmText:i.$t("basic-confirm")})}}),i.waterMarkConfig)},handleBttomBtnClick:function(){var t=this;this.isUploading||(t.isUploading=!0,this.selectInspectionData((function(){t.upInspData.length>0&&(uni.showLoading({title:t.$t("inspection-upPoint")+"...",mask:!0}),t.upInspectionData(0,(function(){t.selectFiles((function(){t.isUploading=!1,0===t.upFileData.length?(uni.hideLoading(),t.getData(),uni.showToast({title:t.$t("pageTip-uloadedSuccessfully")})):t.uploadFile(0,(function(){uni.hideLoading(),t.getData(),uni.showToast({title:t.$t("pageTip-uloadedSuccessfully")})}))}))})))})))},handleClickShowMore:function(t){uni.navigateTo({url:"/pages/frames/inspection/inspection/inspectionPoint?inspectiondoid=".concat(t,"&type=result")})},handleUpdateHours:function(t){var n=this;plus.nativeUI.prompt(n.$t("inspection-enterTime"),(function(i){1==i.index&&(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/.test(i.value)?(0,o.updateSql)("inspectiondo",{manhours:parseFloat(i.value)},{id:t.id},(function(){t.manhours=i.value,uni.showToast({title:n.$t("pageTip-modifiedSuccess")})})):uni.showModal({title:n.$t("basic-modalTip"),content:n.$t("check-nan"),showCancel:!1,confirmText:n.$t("basic-confirm")}))}),n.$t("basic-modalTip"),n.$t("inspection-significantNumber"),[n.$t("basic-cancel"),n.$t("basic-confirm")])}}};n.default=u},"8d1a":function(t,n,i){"use strict";i.d(n,"b",(function(){return e})),i.d(n,"c",(function(){return a})),i.d(n,"a",(function(){}));var e=function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("v-uni-view",{staticClass:"inspection-upload"},[e("m-back-bar",[e("template",{attrs:{slot:"barTitle"},slot:"barTitle"},[t._v(t._s(t.$t("inspection-upload")))])],2),0===t.resultsData.length?e("v-uni-view",{staticClass:"notdata"},[e("v-uni-image",{staticClass:"nodata-img",attrs:{src:i("0fa6")}}),e("v-uni-text",{staticClass:"nodata-text"},[t._v(t._s(t.$t("page-nodata")))])],1):t._e(),e("v-uni-view",{staticClass:"inspection-results"},t._l(t.resultsData,(function(n,i){return e("v-uni-view",{key:i,staticClass:"inspection-results-item"},[e("v-uni-view",{staticClass:"title-box"},[e("v-uni-text",{staticClass:"title"},[t._v(t._s(n.inspectionDoName))]),e("m-font-icon",{staticClass:"updateHours",attrs:{icon:"inspectionHours",iconSize:38,color:"#F7B500"},on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.handleUpdateHours(n)}}})],1),e("v-uni-view",{staticClass:"result-detail"},[e("v-uni-view",{staticClass:"result-detail-item"},[e("v-uni-text",{staticClass:"result-label"},[t._v(t._s(t.$t("inspection-totalDevice"))+"：")]),e("v-uni-text",[t._v(t._s(n.moCount))])],1),e("v-uni-view",{staticClass:"result-detail-item"},[e("v-uni-text",{staticClass:"result-label"},[t._v(t._s(t.$t("inspection-totalPoints"))+"：")]),e("v-uni-text",[t._v(t._s(n.allCount))])],1),e("v-uni-view",{staticClass:"result-detail-item"},[e("v-uni-text",{staticClass:"result-label"},[t._v(t._s(t.$t("inspection-totalNormal"))+"：")]),e("v-uni-text",[t._v(t._s(n.normalCount))])],1),e("v-uni-view",{staticClass:"result-detail-item"},[e("v-uni-text",{staticClass:"result-label"},[t._v(t._s(t.$t("inspection-totalAbnormal"))+"：")]),e("v-uni-text",[t._v(t._s(n.abNormalCount))])],1),e("v-uni-view",{staticClass:"result-detail-item"},[e("v-uni-text",{staticClass:"result-label"},[t._v(t._s(t.$t("inspection-totalShutdown"))+"：")]),e("v-uni-text",[t._v(t._s(n.shutdownCount))])],1),e("v-uni-view",{staticClass:"result-detail-item"},[e("v-uni-text",{staticClass:"result-label"},[t._v(t._s(t.$t("inspection-consumptionTime"))+"：")]),e("v-uni-text",{style:t.manhoursStyle(n.manhours)},[t._v(t._s(n.manhours?n.manhours+t.$t("time-minutes"):0+t.$t("time-minutes")))])],1)],1),e("v-uni-view",{staticClass:"bottom-box"},[e("v-uni-text",{staticClass:"createdate"},[t._v(t._s(n.createdate))]),e("v-uni-text",{staticClass:"more",on:{click:function(i){arguments[0]=i=t.$handleEvent(i),t.handleClickShowMore(n.id)}}},[t._v(t._s(t.$t("page-particulars"))+" >")])],1)],1)})),1),0!==t.resultsData.length?e("v-uni-view",{staticClass:"formTemplate-btns foot"},[e("m-button",{staticClass:"btn-item",attrs:{btnClass:"mainColor",btnTilte:t.$t("inspection-upload"),disabled:t.disabled},on:{elementClick:function(n){arguments[0]=n=t.$handleEvent(n),t.handleBttomBtnClick()}}})],1):t._e()],1)},a=[]},a527:function(t,n,i){"use strict";i("7a82");var e=i("dbce").default,a=i("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,i("a9e3");var o=a(i("5530")),s=e(i("d56d")),c={getInspectionDo:function(t,n,i){return n=(0,o.default)((0,o.default)({},n),{userId:i}),t.$http.post(s.inspectionDo,n).then((function(n){var i=n.data;if(i.success)return i.data;throw uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){uni.showModal({title:t.$t("basic-modalTipError"),content:n||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.error(n)}))},getInspectionPotinDo:function(t,n,i){return n=(0,o.default)((0,o.default)({},n),{userId:i}),t.$http.post(s.inspectionPointDo,n).then((function(n){var i=n.data;if(i.success)return i.data;throw uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){uni.showModal({title:t.$t("basic-modalTipError"),content:n||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.error(n)}))},updataInspection:function(t,n){return console.log(n),t.$http.post(s.uploadInspectionHistory,n).then((function(n){var i=n.data;return i.success||uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){return uni.showModal({title:t.$t("basic-modalTipError"),content:n||"上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),n}))},skipTask:function(t,n){return uni.showLoading({title:"加载中..."}),t.$http.post(s.skipTask,n).then((function(n){var i=n.data;return uni.hideLoading(),i.success||uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"跳过失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){return uni.hideLoading(),uni.showModal({title:t.$t("basic-modalTipError"),content:n||"跳过失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),n}))},upInspectionFile:function(t,n,i,e,a){var o=t.baseUrl||t.defaultUrl,c={basetype:2,tableName:"inspectionpointhistory",token:t.token};a&&0!=a&&""!=a&&(c.waterMarkId=Number(a)),uni.uploadFile({url:o+s.uploadInspectionFiles,header:{"content-type":"multipart/form-data",token:t.token},formData:c,files:n,success:function(t){if(200==t.statusCode){var n=JSON.parse(t.data);n.success?i&&i(t):e&&e(n)}else e&&e(t)},fail:function(n){e&&e(),uni.showModal({title:t.$t("basic-modalTipError"),content:"图片上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.warn(n,"请检查是否CORB/CORS错误!")}})}},u=c;n.default=u},c006:function(t,n,i){"use strict";i.r(n);var e=i("6619"),a=i.n(e);for(var o in e)["default"].indexOf(o)<0&&function(t){i.d(n,t,(function(){return e[t]}))}(o);n["default"]=a.a},d56d:function(t,n,i){"use strict";i("7a82"),Object.defineProperty(n,"__esModule",{value:!0}),n.uploadInspectionHistory=n.uploadInspectionFiles=n.skipTask=n.inspectionPointDo=n.inspectionDo=void 0;n.inspectionDo="inspectionDo/selectPage";n.inspectionPointDo="inspectionPointDo/selectPage";n.uploadInspectionHistory="inspectionHistory/uploadInspectionHistory";n.uploadInspectionFiles="file/uploadInspectionFiles";n.skipTask="inspectionPointDo/skipTask"}}]);