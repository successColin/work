(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-frames-inspection-download-download"],{"50b0":function(t,n,i){"use strict";i.d(n,"b",(function(){return o})),i.d(n,"c",(function(){return e})),i.d(n,"a",(function(){}));var o=function(){var t=this,n=t.$createElement,i=t._self._c||n;return i("v-uni-view",{staticClass:"inspection-download"},[i("m-back-bar",[i("template",{attrs:{slot:"barTitle"},slot:"barTitle"},[t._v(t._s(t.$t("basic-download")))])],2),i("v-uni-view",{staticClass:"progress-box-parent"},[i("v-uni-view",{staticClass:"progress-bg"},[i("v-uni-view",{staticClass:"progress-box"},[i("v-uni-text",{staticClass:"progress-title"},[t._v(t._s(t.$t("inspection-routeTask")))]),i("v-uni-progress",{staticClass:"progress",attrs:{percent:t.inspectionRoute,"show-info":"true",activeColor:"#F7B500",backgroundColor:"#D8D8D8","stroke-width":"10"}})],1),i("v-uni-view",{staticClass:"progress-box"},[i("v-uni-text",{staticClass:"progress-title"},[t._v(t._s(t.$t("inspection-pointTast")))]),i("v-uni-progress",{staticClass:"progress",attrs:{percent:t.inspectionPoint,"show-info":"true",activeColor:"#F7B500",backgroundColor:"#D8D8D8","stroke-width":"10"}})],1)],1)],1),i("v-uni-view",{staticClass:"formTemplate-btns foot"},[i("m-button",{staticClass:"btn-item",attrs:{btnClass:"mainColor",disabled:t.disabled,btnTilte:t.$t("basic-download")},on:{elementClick:function(n){arguments[0]=n=t.$handleEvent(n),t.handleBttomBtnClick()}}})],1)],1)},e=[]},"7c62":function(t,n,i){"use strict";i("7a82");var o=i("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,i("e9c4");var e=o(i("5530")),s=i("26cb"),a=i("1ce4e"),c=o(i("a527")),r={data:function(){return{disabled:!1,activeColor:"#F7B500",inspectionRoute:0,inspectionPoint:0,isDownload:!0}},computed:(0,e.default)((0,e.default)({},(0,s.mapState)(["userDesigner","bundleId","userId"])),(0,s.mapState)("home",{newBundle:"newBundle"})),watch:{inspectionRoute:function(t){t===this.inspectionPoint&&this.downloadOver()},inspectionPoint:function(t){t===this.inspectionRoute&&this.downloadOver()}},onBackPress:function(){this.isDownload=!1},methods:(0,e.default)((0,e.default)((0,e.default)({},(0,s.mapMutations)(["SET_bundle"])),(0,s.mapMutations)("home",["SET_NEW_BUNDLE"])),{},{downloadOver:function(){uni.hideLoading(),this.disabled=!1,uni.showModal({title:this.$t("basic-modalTip"),content:this.$t("pageTip-downloadSuccessful"),showCancel:!1,confirmText:this.$t("basic-confirm"),success:function(){uni.navigateBack()}})},handleBttomBtnClick:function(){var t=this;this.disabled=!0,uni.showModal({title:t.$t("basic-modalTip"),content:t.$t("inspection-isDownload"),confirmText:t.$t("basic-confirm"),cancelText:t.$t("basic-cancel"),success:function(n){n.confirm?(uni.showLoading({title:t.$t("pageTip-readyDownload")}),(0,a.dropInspectionTables)((function(n){(0,a.readyDB)((function(){uni.showLoading({title:t.$t("pageTip-downloading")}),t.downIntoInspectionPoint(1),t.downIntoInspection(1)}),(function(){uni.hideLoading(),t.disabled=!1}))}),(function(){uni.hideLoading(),t.disabled=!1}))):t.disabled=!1}})},downIntoInspection:function(t){var n=this;c.default.getInspectionDo(n,{pageNum:t,pageSize:100},n.userId).then((function(i){0!==i.list.length&&(0,a.insertIntoInspectionDo)(i.list,(function(){var o=Math.ceil(i.total/100),e=t+1;n.inspectionRoute=100*(t/o).toFixed(1),e<=o&&n.isDownload&&n.downIntoInspection(e)}),(function(t){uni.hideLoading(),uni.showModal({title:n.$t("basic-modalTip"),content:JSON.stringify(t),confirmText:n.$t("basic-confirm"),cancelText:n.$t("basic-cancel")})}))})).catch((function(){uni.hideLoading()}))},downIntoInspectionPoint:function(t){var n=this,i=this;c.default.getInspectionPotinDo(i,{pageNum:t,pageSize:100},i.userId).then((function(o){if(0===o.list.length)return uni.showModal({title:i.$t("basic-modalTip"),content:i.$t("inspection-noTask"),confirmText:i.$t("basic-confirm"),showCancel:!1}),void uni.hideLoading();(0,a.insertInspectionpointDo)(o.list,(function(){var n=Math.ceil(o.total/100),e=t+1;i.inspectionPoint=100*(t/n).toFixed(1),e<=n&&i.isDownload&&i.downIntoInspectionPoint(e)}),(function(t){uni.hideLoading(),uni.showModal({title:i.$t("basic-modalTip"),content:JSON.stringify(t),confirmText:i.$t("basic-confirm"),cancelText:i.$t("basic-cancel")})})),n.formatDate()})).catch((function(){uni.hideLoading()}))},formatDate:function(){var t=new Date,n=t.getFullYear(),i=t.getMonth()+1;i=i<10?"0"+i:i;var o=t.getDate();o=o<10?"0"+o:o;var e=n+"-"+i+"-"+o;uni.setStorageSync("inspectionDownloadTime",e)}}),onLoad:function(t){var n=this.newBundle[t.bundleId],i=t.V||"0";if(this.SET_NEW_BUNDLE({bundle:t.bundleId,isNew:!1}),n){var o=uni.getStorageSync("bundleVersion")||{},e=this.userDesigner+"_"+t.bundleId;o[e]=i,uni.setStorageSync("bundleVersion",o)}}};n.default=r},a527:function(t,n,i){"use strict";i("7a82");var o=i("dbce").default,e=i("4ea4").default;Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0,i("a9e3");var s=e(i("5530")),a=o(i("d56d")),c={getInspectionDo:function(t,n,i){return n=(0,s.default)((0,s.default)({},n),{userId:i}),t.$http.post(a.inspectionDo,n).then((function(n){var i=n.data;if(i.success)return i.data;throw uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){uni.showModal({title:t.$t("basic-modalTipError"),content:n||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.error(n)}))},getInspectionPotinDo:function(t,n,i){return n=(0,s.default)((0,s.default)({},n),{userId:i}),t.$http.post(a.inspectionPointDo,n).then((function(n){var i=n.data;if(i.success)return i.data;throw uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){uni.showModal({title:t.$t("basic-modalTipError"),content:n||"获取数据失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.error(n)}))},updataInspection:function(t,n){return console.log(n),t.$http.post(a.uploadInspectionHistory,n).then((function(n){var i=n.data;return i.success||uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){return uni.showModal({title:t.$t("basic-modalTipError"),content:n||"上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),n}))},skipTask:function(t,n){return uni.showLoading({title:"加载中..."}),t.$http.post(a.skipTask,n).then((function(n){var i=n.data;return uni.hideLoading(),i.success||uni.showModal({title:t.$t("basic-modalTipError"),content:i.msg||"跳过失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),i})).catch((function(n){return uni.hideLoading(),uni.showModal({title:t.$t("basic-modalTipError"),content:n||"跳过失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),n}))},upInspectionFile:function(t,n,i,o,e){var s=t.baseUrl||t.defaultUrl,c={basetype:2,tableName:"inspectionpointhistory",token:t.token};e&&0!=e&&""!=e&&(c.waterMarkId=Number(e)),uni.uploadFile({url:s+a.uploadInspectionFiles,header:{"content-type":"multipart/form-data",token:t.token},formData:c,files:n,success:function(t){if(200==t.statusCode){var n=JSON.parse(t.data);n.success?i&&i(t):o&&o(n)}else o&&o(t)},fail:function(n){o&&o(),uni.showModal({title:t.$t("basic-modalTipError"),content:"图片上传失败",showCancel:!1,confirmText:t.$t("basic-confirm")}),console.warn(n,"请检查是否CORB/CORS错误!")}})}},r=c;n.default=r},d56d:function(t,n,i){"use strict";i("7a82"),Object.defineProperty(n,"__esModule",{value:!0}),n.uploadInspectionHistory=n.uploadInspectionFiles=n.skipTask=n.inspectionPointDo=n.inspectionDo=void 0;n.inspectionDo="inspectionDo/selectPage";n.inspectionPointDo="inspectionPointDo/selectPage";n.uploadInspectionHistory="inspectionHistory/uploadInspectionHistory";n.uploadInspectionFiles="file/uploadInspectionFiles";n.skipTask="inspectionPointDo/skipTask"},e5dd:function(t,n,i){"use strict";i.r(n);var o=i("7c62"),e=i.n(o);for(var s in o)["default"].indexOf(s)<0&&function(t){i.d(n,t,(function(){return o[t]}))}(s);n["default"]=e.a},e75c:function(t,n,i){"use strict";i.r(n);var o=i("50b0"),e=i("e5dd");for(var s in e)["default"].indexOf(s)<0&&function(t){i.d(n,t,(function(){return e[t]}))}(s);var a=i("f0c5"),c=Object(a["a"])(e["default"],o["b"],o["c"],!1,null,null,null,!1,o["a"],void 0);n["default"]=c.exports}}]);