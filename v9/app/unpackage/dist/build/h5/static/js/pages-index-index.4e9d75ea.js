(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-index-index"],{"16ee":function(e,t,n){"use strict";n.r(t);var a=n("3c56"),o=n.n(a);for(var r in a)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return a[e]}))}(r);t["default"]=o.a},"1d63":function(e,t,n){"use strict";n.d(t,"b",(function(){return a})),n.d(t,"c",(function(){return o})),n.d(t,"a",(function(){}));var a=function(){var e=this.$createElement,t=this._self._c||e;return t("v-uni-view",{staticClass:"content"})},o=[]},"3c56":function(e,t,n){"use strict";n("7a82");var a=n("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,n("e9c4"),n("d3b7");var o=a(n("c7eb")),r=a(n("1da1")),i=a(n("5530")),c=n("26cb"),s=n("cd03"),u=n("902d"),l=n("acaa"),d={data:function(){return{}},computed:(0,i.default)({},(0,c.mapState)(["platform","appKeyCode","token"])),onLoad:function(){var e=this;this.token&&this.$http.post("logout"),this.init(),this.$http.get("variable/getValue",{variableName:"useSso"},{errorNoRefresh:!0,noToken:!0}).then((function(t){var n=t.data||{};uni.setStorageSync("signOn",n);var a=n.data||"0";"0"===a?e.singleLoginO():"1"===a?e.standardSingleLogin():"3"===a?e.standardSingleLoginIT():"4"===a?e.zwdingtalkLogin():"5"===a?e.enterpriseWechatLogin():e.loadExecution()})).catch((function(t){console.log(JSON.stringify(t)),e.loadExecution()}))},methods:(0,i.default)((0,i.default)((0,i.default)({},(0,c.mapMutations)(["SET_LOGIN_STATE","UPDATE_THEME_COLOR","SET_LOGIN_CONFIG","SET_WATERMARK","SET_SCANTYPE","setGlobelParams","SET_HOURFILLINGAUTOMATIC","SET_QRTYPE"])),(0,c.mapMutations)("Inspection",["set_inspection_photoSourceType","set_inspection_unlock","set_inspection_unlock_by_code","set_limit_skip_to_today","set_inspection_device_complete"])),{},{init:function(){var e=this;this.getThemeStyle(),this.getSysParamer("PasswordLevel").then((function(t){e.setGlobelParams({key:"PasswordLevel",value:t.data||"3"})})),this.getSysParamer("unDoInspectionDo").then((function(t){e.setGlobelParams({key:"unDoInspectionDo",value:t.data||"0"})}));var t=uni.getStorageSync("readCardTypeVal");t?this.setGlobelParams({key:"readCardType",value:t}):this.getSysParamer("readCardType").then((function(t){var n=t.data||"NFC";uni.setStorageSync("readCardTypeVal",n),e.setGlobelParams({key:"readCardType",value:n.toUpperCase()})})),this.getSysParamer("useLocalPhotoGallery").then((function(t){e.set_inspection_photoSourceType(t.data)})),this.getSysParamer("unlock").then((function(t){e.set_inspection_unlock(t.data)})),this.getSysParamer("enableInspectionUnlockByCode").then((function(t){e.set_inspection_unlock_by_code(t.data)})),this.getSysParamer("limitSkipToToday").then((function(t){console.log("====================>",t),e.set_limit_skip_to_today(t.data)})),this.getSysParamer("ScanningType").then((function(t){e.SET_SCANTYPE(t.data)})),this.getSysParamer("hourFillingAutomatic").then((function(t){e.SET_HOURFILLINGAUTOMATIC(t.data)})),this.getSysParamer("WaterMarkConfig").then((function(t){e.SET_WATERMARK(t.data)})),this.getSysParamer("constraintDeviceCompleteInspection").then((function(t){console.log(t),e.set_inspection_device_complete(t.data)})),this.getSysParamer("QRType").then((function(t){e.SET_QRTYPE(t.data)}))},getSysParamer:function(e){return s.homeApi.sysParamer(this,e)},loadWX:function(){var e=this;wx.getSetting({success:function(t){var n=t.authSetting;n["scope.userInfo"]?(uni.login({provider:"weixin",success:function(t){var n=t.code;uni.getUserInfo({provider:"weixin",success:function(t){var a=t.userInfo.nickName;t.userInfo.avatarUrl;s.homeApi.mpWXRegisterLogin(e,{code:n,name:a})},fail:function(e){}})}}),console.log("您已经授权成功")):uni.reLaunch({url:"/pages/login/login"})}})},forceChangPassWord:function(){var e=this;return(0,r.default)((0,o.default)().mark((function t(){var n;return(0,o.default)().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n="0",t.next=3,e.getSysParamer("passwordValidity").then((function(e){n=e.data}));case 3:e.setGlobelParams({key:"passwordValidity",value:n});case 4:case"end":return t.stop()}}),t)})))()},loadExecution:function(){var e=this;return(0,r.default)((0,o.default)().mark((function t(){var n;return(0,o.default)().wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,e.forceChangPassWord();case 3:t.next=7;break;case 5:t.prev=5,t.t0=t["catch"](0);case 7:try{n=uni.getStorageSync("launchFlag"),n?1==n?(uni.getStorageSync("loginMsg"),uni.reLaunch({url:"/pages/login/login"})):uni.reLaunch({url:"/pages/index/guide"}):(uni.setStorage({key:"launchFlag",data:!0}),uni.reLaunch({url:"/pages/index/guide"}))}catch(a){uni.setStorage({key:"launchFlag",data:!0,success:function(){console.log("error时存储launchFlag")}}),uni.reLaunch({url:"/pages/index/guide"})}case 8:case"end":return t.stop()}}),t,null,[[0,5]])})))()},getThemeStyle:function(){var e=this;this.$http.post("pcHomePageConfig/selectline",{},{noToken:!0}).then((function(t){var n=t.data.data.appThemeColor;if(n){var a={color:u.THEME_COLOR_TYPE[n],colorCode:u.THEME_COLOR_VALUE[n]};e.UPDATE_THEME_COLOR(a),e.SET_LOGIN_CONFIG(t.data.data)}})).catch((function(e){console.log(JSON.stringify(e))}))},setUserInfo:function(e){var t=uni.getStorageSync("userDesignerId")||"";t!=e.userDesignerId&&(uni.setStorageSync("bundleVersion",{}),uni.setStorageSync("userDesignerId",e.userDesignerId),uni.setStorageSync("language",e.currentLanguage)),this.SET_LOGIN_STATE(e),uni.reLaunch({url:"/pages/home/home"})},standardSingleLoginIT:function(){var e=this;(0,l.APP_StandardSingleLoginIT)({tag:this.platform,appKeyCode:this.appKeyCode,language:this._i18n.locale},this).then((function(t){e.setUserInfo(t)})).catch((function(t){t=t.msg||t,uni.showModal({title:e.$t("basic-modalTipError"),content:t,showCancel:!1,confirmText:e.$t("basic-confirm")})}))},standardSingleLogin:function(){var e=this;(0,l.APP_StandardSingleLogin)({tag:this.platform,appKeyCode:this.appKeyCode,language:this._i18n.locale},this).then((function(t){e.setUserInfo(t)})).catch((function(t){t=t.msg||t,uni.showModal({title:e.$t("basic-modalTipError"),content:t,showCancel:!1,confirmText:e.$t("basic-confirm")})}))},singleLoginO:function(){var e=this;(0,l.APP_singleLogin)({},this).then((function(t){e.setUserInfo(t)})).catch((function(t){"noTurnUp"===t.type?uni.showModal({title:e.$t("basic-modalTipError"),content:t.msg,showCancel:!1,confirmText:e.$t("basic-confirm")}):e.loadExecution()}))},zwdingtalkLogin:function(){var e=this;(0,l.APP_ZwdingtalkLogin)({},this).then((function(t){"{}"!==JSON.stringify(t)?e.setUserInfo(t):uni.reLaunch({url:"/pages/login/login"})})).catch(function(){var e=(0,r.default)((0,o.default)().mark((function e(t){return(0,o.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:uni.reLaunch({url:"/pages/associatedUser/index?code="+t});case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())},enterpriseWechatLogin:function(){var e=this;console.log("企业微信"),(0,l.APP_EnterpriseWechatLogin)({},this).then((function(t){if("{}"===JSON.stringify(t))return new Promise((function(e,t){uni.showModal({title:"错误提示",content:"没有获取到用户信息，请登录！",showCancel:!1,confirmText:"确定",success:function(e){e.confirm&&uni.reLaunch({url:"/pages/login/login"})}})}));e.setUserInfo(t)}))}})};t.default=d},"902d":function(e,t,n){"use strict";n("7a82"),Object.defineProperty(t,"__esModule",{value:!0}),t.THEME_COLOR_VALUE=t.THEME_COLOR_TYPE=t.THEME_COLOR_RADIO=void 0;t.THEME_COLOR_TYPE={1:"red",2:"blue",3:"navyBlue",4:"violet",5:"orange"};t.THEME_COLOR_VALUE={1:"rgb(198,33,39)",2:"rgb(48,162,255)",3:"rgb(47, 88, 153)",4:"rgb(216, 0, 109)",5:"rgb(248, 156, 51)"};t.THEME_COLOR_RADIO={red:"#FCBCBE",blue:"#9AD1FF",navyBlue:"#95B7ED",violet:"#F7BFDB",orange:"#FFD6A"}},acaa:function(e,t,n){"use strict";n("7a82");var a=n("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.APP_singleLogin=t.APP_ZwdingtalkLogin=t.APP_StandardSingleLoginIT=t.APP_StandardSingleLogin=t.APP_GetStandardUid=t.APP_EnterpriseWechatLogin=void 0,t.getQueryString=d;var o=a(n("c7eb")),r=a(n("1da1"));n("4d63"),n("c607"),n("ac1f"),n("2c3e"),n("25f0"),n("466d"),n("841c"),n("d3b7"),n("c975"),n("99af"),n("e9c4");var i=n("af61");t.APP_singleLogin=function(e,t){var n=new RegExp("(^|&)code=([^&]*)(&|$)","i"),a=window.location.search.substr(1).match(n);return a?(e.type=1,e.threesidetoken=a[2],t.$http.post("sso/auth",e).then((function(e){var t=e.data||{};if(t.success)return t&&t.data;reject({type:"noTurnUp",msg:t.msg||"操作错误"})}))):new Promise((function(e,t){t("请重新登录")}))};var c=function(){var e=(0,r.default)((0,o.default)().mark((function e(t,n){var a,r,i,c,s,u,l,d,f;return(0,o.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a=document.cookie||"","LtpaToken=",{},r=a.indexOf("LtpaToken="),i="",a.length>0&&-1!==r&&(r+="LtpaToken=".length,c=a.indexOf(";",r),-1===c&&(c=a.length),i=a.substring(r,c)),i){e.next=7;break}return e.abrupt("return",new Promise((function(e,t){t("没有有效cookie,请重新登录.cookie:".concat(a,";Ltpatoken:").concat(i))})));case 7:return s={itToken:i,hasCompanyInfo:!0,hasAuthInfo:!0},u="",l="",e.next=11,n.$http.post("itSso/getAccount",s,{errorNoRefresh:!0,noToken:!0,iSNonstandard:!0}).then((function(e){var t=e.data||{};if(console.log(JSON.stringify(t)),console.log(JSON.stringify(e)),t.isError)l="上海电气接口提示:".concat(t.message||"",",cookie:").concat(a,";Ltpatoken:").concat(i);else{var n=t.account;u=n.code}})).catch((function(e){l="上海电气接口错误:".concat(e,",cookie:").concat(a,";Ltpatoken:").concat(i)}));case 11:if(d="",!u){e.next=17;break}return f=n.$EncryptionPSW({userCode:u},1),t.account=f.userCode,e.next=17,n.$http.post("sso/ssoByAccount",t,{errorNoRefresh:!0,noToken:!0}).then((function(e){var t=e.data||{};d=t.data})).catch((function(e){l=e||"ams接口错误,用户:".concat(u,";")}));case 17:if(d){e.next=21;break}return e.abrupt("return",new Promise((function(e,t){return t("".concat(l))})));case 21:return e.abrupt("return",d);case 22:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();t.APP_StandardSingleLoginIT=c;t.APP_StandardSingleLogin=function(e,t){var n=window.location.href,a={};if(-1!=n.indexOf("?"))for(var o=n.split("?")[1],r=o.split("&"),i=0,c=r.length;i<c;i++)a[r[i].split("=")[0]]=r[i].split("=")[1];return a.uid?(e.accessToken=a.uid,t.$http.post("ssoCommon/getUserInfoByToken",e).then((function(e){var t=e.data||{};if(t.success)return t&&t.data;reject({msg:"uid:".concat(a.uid,"，").concat(t.msg||"登录失败,请查询")})})).catch((function(e){uni.showModal({title:t.$t("basic-modalTipError"),content:"uid:".concat(a.uid,"，").concat(e||"登录失败,请查询"),showCancel:!1,confirmText:t.$t("basic-confirm")})}))):new Promise((function(e,t){t("没有uid,请重新登录")}))};var s=function(){var e=(0,r.default)((0,o.default)().mark((function e(t,n,a){var r,i,c,s,u,l,d,f;return(0,o.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r=(new Date).getTime(),i=a.$EncryptionPSW({timeStamp:r},1,"MD5"),c=i.timeStamp,s={timeStamp:r,checkSum:c},u="",e.next=6,a.$http.post("ssoCommon/getLoginKey",s,{errorNoRefresh:!0,noToken:!0,submitUrl:n}).then((function(e){var t=e.data||{};t.success&&(u=t.data)})).catch((function(e){uni.showModal({title:a.$t("basic-modalTipError"),content:e,showCancel:!1,confirmText:a.$t("basic-confirm")})}));case 6:return l="",d=a.$EncryptionPSW({value:"".concat(r).concat(u).concat(t)},1,"MD5"),f={loginKey:u,account:t,timeStamp:r,checkSum:d.value},e.next=9,a.$http.post("ssoCommon/ssoAuth",f,{errorNoRefresh:!0,noToken:!0,submitUrl:n}).then((function(e){var t=e.data||{};t.success&&(l=t.data)})).catch((function(e){uni.showModal({title:a.$t("basic-modalTipError"),content:e,showCancel:!1,confirmText:a.$t("basic-confirm")})}));case 9:return e.abrupt("return",l);case 10:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}();t.APP_GetStandardUid=s;var u=function(){var e=(0,r.default)((0,o.default)().mark((function e(t,n){var a;return(0,o.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={},e.next=3,(0,i.getDingDingCode)().then(function(){var e=(0,r.default)((0,o.default)().mark((function e(r){return(0,o.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(r){e.next=4;break}return e.abrupt("return",new Promise((function(e,t){uni.showModal({title:"错误提示",content:"没有获取到code，请登录！",showCancel:!1,confirmText:"确定",success:function(e){e.confirm&&uni.reLaunch({url:"/pages/login/login"})}})})));case 4:return t.code=r,e.prev=5,e.next=8,n.$http.post("sso/zwdingtalkLogin",t).then((function(e){var t=e.data||{},n=t.success,o=t.data;if(!n)return new Promise((function(e,t){t(r)}));a=o}));case 8:e.next=13;break;case 10:return e.prev=10,e.t0=e["catch"](5),e.abrupt("return",new Promise((function(e,t){t(r)})));case 13:case"end":return e.stop()}}),e,null,[[5,10]])})));return function(t){return e.apply(this,arguments)}}());case 3:return e.abrupt("return",a);case 4:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}();t.APP_ZwdingtalkLogin=u;var l=function(){var e=(0,r.default)((0,o.default)().mark((function e(t,n){var a,r;return(0,o.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(a={},r=d("code"),!r){e.next=12;break}return t.code=r,e.prev=4,e.next=7,n.$http.post("sso/wechatSSOLogin",t).then((function(e){var t=e.data||{},n=(t.success,t.data);a=n}));case 7:e.next=12;break;case 9:return e.prev=9,e.t0=e["catch"](4),e.abrupt("return",new Promise((function(t,n){uni.showModal({title:"错误提示",content:e.t0,showCancel:!1,confirmText:"确定",success:function(e){e.confirm&&uni.reLaunch({url:"/pages/login/login"})}})})));case 12:return e.abrupt("return",a);case 13:case"end":return e.stop()}}),e,null,[[4,9]])})));return function(t,n){return e.apply(this,arguments)}}();function d(e,t){var n,a=new RegExp("(^|&)".concat(e,"=([^&]*)(&|$)"),"i");return n=t?t.split("?")[1].match(a):window.location.search.substr(1).match(a),null!=n?unescape(n[2]):null}t.APP_EnterpriseWechatLogin=l},f136:function(e,t,n){"use strict";n.r(t);var a=n("1d63"),o=n("16ee");for(var r in o)["default"].indexOf(r)<0&&function(e){n.d(t,e,(function(){return o[e]}))}(r);var i=n("f0c5"),c=Object(i["a"])(o["default"],a["b"],a["c"],!1,null,null,null,!1,a["a"],void 0);t["default"]=c.exports}}]);