(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-mine-changePassword"],{"00a1":function(e,t,a){"use strict";a.r(t);var n=a("9c0ed"),i=a("e7b2");for(var s in i)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return i[e]}))}(s);a("dc58");var o=a("f0c5"),r=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"144e5527",null,!1,n["a"],void 0);t["default"]=r.exports},"02a5":function(e,t,a){"use strict";a("7a82");var n=a("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a("c7eb")),s=n(a("1da1")),o=n(a("53ca")),r=n(a("5530"));a("a9e3"),a("ac1f"),a("5319"),a("e25e"),a("14d9"),a("fb6a"),a("99af"),a("d81d"),a("e9c4"),a("a434");var l=a("cd03"),u=(n(a("043e")),a("26cb")),c={name:"sunui-upimg",props:{upImgBasic:{type:Object,default:function(){return{}}},getPicParams:{type:Object,default:function(){return{}}},label:{type:String,default:"elementLable"},elementId:Number,mobileTabId:Number,relationId:[String,Number],relationTableName:[String,Number],stateId:[String,Number],typeId:[String,Number],priorityId:[String,Number],visiabled:{type:[Number,Boolean],default:1},requisite:{type:[Number,Boolean],default:0},disabled:{type:[Number,Boolean],default:0},uploadType:String,picpath:String},data:function(){return{elementValue:"",elementLable:this.label,upload_after_list:[],upload_picture_list:[],upload_ready_list:[],static_visiabled:this.visiabled,static_requisite:this.requisite,static_readonly:this.disabled,defaultpicpath:""}},computed:(0,r.default)((0,r.default)({},(0,u.mapState)(["baseUrl","defaultUrl","token"])),{},{upImgConfig:function(){var e={basicConfig:{url:"https://p.dns06.net.cn/index.php?m=Api&c=index&a=upload"},tips:!0,notli:!1,count:9,sourceType:"all",sizeType:!0,upBgColor:"#fff",upIconColor:"#D9D9D9",upSvgIconName:"icon-card",upTextDesc:this.$t("pageTip-uploadImg"),delBtnLocation:"",isAddImage:!1,isDelIcon:!1,delIconColor:"",delIconText:"",iconReplace:""};return Object.assign(e,this.upImgBasic)}}),created:function(){var e=this.relationId;try{e=JSON.parse(e)}catch(t){}e&&"object"===(0,o.default)(e)?this.elementValue=e.id||"":this.elementValue=e||"",f(this),this.picpath&&(this.defaultpicpath=this.picpath.replace(/[\r\n]/g,"")),this.setVerificationRule()},watch:{static_requisite:function(){this.setVerificationRule()},upload_picture_list:function(e,t){this.mobileTabId&&this.elementId&&this.SET_TABS_FORMDATAS({tabId:this.mobileTabId,elementId:this.elementId,params:e})}},methods:(0,r.default)((0,r.default)((0,r.default)({},(0,u.mapMutations)("verificationRule",["SET_TAB_RULE"])),(0,u.mapMutations)("common",["SET_TABS_FORMDATAS"])),{},{setVerificationRule:function(){if(this.mobileTabId&&this.elementId){var e={name:this.elementId,checkType:this.static_requisite?"imgnotnull":"",checkRule:"",errorMsg:this.elementLable+this.$t("check-notNull")};this.SET_TAB_RULE({tabId:this.mobileTabId,rule:e})}},initServerImage:function(e){this.upload_picture_list=e},chooseImage:function(e){d(this,parseInt(e),this.upImgConfig)},uploadimage:function(e){h(this,e)},deleteImg:function(e){v(e,this)},previewImg:function(e){b(e,this)},previewImgs:function(e){w(e,this)}})};t.default=c;var d=function(e,t,a){var n={basicConfig:{url:a.basicConfig.url},count:t,notli:a.notli,sourceType:a.sourceType,sizeType:a.sizeType,tips:a.tips||!1};uni.chooseImage({count:n.notli||0==e.upload_after_list.length?n.count:n.count-e.upload_after_list.length,sizeType:""==n.sizeType||void 0==n.sizeType||1==n.sizeType?["compressed"]:["original"],sourceType:""==n.sourceType||void 0==n.sourceType?["album","camera"]:"camera"==n.sourceType?["camera"]:"album"==n.sourceType?["album"]:["album","camera"],success:function(){var t=(0,s.default)((0,i.default)().mark((function t(a){var s,o;return(0,i.default)().wrap((function(t){while(1)switch(t.prev=t.next){case 0:for(s=0,o=a.tempFiles.length;s<o;s++)a.tempFiles[s]["upload_percent"]=0,a.tempFiles[s]["url"]="",a.tempFiles[s]["id"]="",e.upload_picture_list.length+e.upload_ready_list,e.upload_ready_list.push(a.tempFiles[s]),"touxiang"==e.uploadType&&(e.defaultpicpath=a.tempFiles[s]);return t.next=3,p(e,a,n);case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()})},p=function(e,t,a){!a.notli&&a.count==e.upload_ready_list.length&&h(e,a),a.notli&&0!==e.upload_ready_list.length&&h(e,a),e.upload_after_list=e.upload_after_list.concat(t.tempFilePaths).slice(0,a.count)},f=function(){var e=(0,s.default)((0,i.default)().mark((function e(t,a){return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.relationTableName){e.next=3;break}return console.error("没有关联表"),e.abrupt("return");case 3:if("feedback"!=t.uploadType){e.next=5;break}return e.abrupt("return");case 5:if(!t.elementValue){e.next=8;break}return e.next=8,l.fileApi.getRelationFile({relationId:t.elementValue,relationTableName:t.relationTableName,relationpriorityId:t.priorityId,relationStateId:t.stateId,relationTypeId:t.typeId}).then((function(e){t.upload_picture_list=e,t.upload_ready_list=[],t.upload_after_list=[],"touxiang"==t.uploadType&&(e.length>0?(t.defaultpicpath=e[0].url,t.$emit("isExist",e)):t.defaultpicpath=t.picpath)}));case 8:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),h=function(){var e=(0,s.default)((0,i.default)().mark((function e(t,a){return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,m(t,a,t.upload_ready_list);case 2:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),m=function(){var e=(0,s.default)((0,i.default)().mark((function e(t,a,n,o){var r,l,u,c,d;return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r={url:a.basicConfig.url||""},l=n.map((function(e,t){return{name:"files"+t,uri:e.path}})),u=t.baseUrl||t.defaultUrl,c=t.upload_picture_list.length,e.next=6,uni.uploadFile({url:u+r.url,header:{"content-type":"multipart/form-data",token:t.token},files:l,formData:EncryptionPSW({tableName:t.relationTableName||"workorder"}),success:function(e){return(0,s.default)((0,i.default)().mark((function s(){var o,r;return(0,i.default)().wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(200!=e.statusCode){i.next=9;break}if(o=JSON.parse(e.data),!o.success){i.next=8;break}return r=o.data,r.map((function(e,a){n[a]["url"]=e.url,n[a]["id"]=e.id,n[a]["typeId"]=t.typeId,n[a]["stateId"]=t.stateId,n[a]["priorityId"]=t.priorityId,t.upload_picture_list[c+a]=n[a],"touxiang"==t.uploadType&&(t.defaultpicpath=e.url)})),i.next=7,g(t,n,a.count);case 7:t.upload_ready_list=[];case 8:uni.hideLoading();case 9:case"end":return i.stop()}}),s)})))()},fail:function(e){var a=this;return(0,s.default)((0,i.default)().mark((function n(){return(0,i.default)().wrap((function(n){while(1)switch(n.prev=n.next){case 0:uni.showLoading({title:a.$t("pageTip-pictureUploadFailed")}),t.upload_picture_list=[],t.upload_after_list=[],setTimeout((function(){uni.hideLoading()}),2e3),console.warn(e,"请检查是否CORB/CORS错误!");case 5:case"end":return n.stop()}}),n)})))()}});case 6:d=e.sent,t.upload_picture_list=t.upload_picture_list.concat(n),d.onProgressUpdate(function(){var e=(0,s.default)((0,i.default)().mark((function e(a){var s,o;return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:s=0,o=n.length;case 1:if(!(s<o)){e.next=9;break}return e.next=4,a.progress;case 4:n[s]["upload_percent"]=e.sent,t.upload_picture_list[c+s]=n[s];case 6:s++,e.next=1;break;case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 9:case"end":return e.stop()}}),e)})));return function(t,a,n,i){return e.apply(this,arguments)}}(),g=function(){var e=(0,s.default)((0,i.default)().mark((function e(t,a,n){return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$emit("onUpImg",t.upload_ready_list);case 2:case"end":return e.stop()}}),e)})));return function(t,a,n){return e.apply(this,arguments)}}(),v=function(e,t){var a=e.currentTarget.dataset.index;uni.showModal({title:t.$t("basic-inquiry"),content:t.$t("choiceTip-isDelete"),success:function(e){e.confirm&&_(t,a)}})},_=function(){var e=(0,s.default)((0,i.default)().mark((function e(t,a){var n,s;return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(console.log("dImageView========================"),n=t.upload_picture_list[a],console.log(JSON.stringify(n)),!n.relationId){e.next=8;break}return e.next=6,l.fileApi.filesRelationDel(n.id);case 6:e.next=14;break;case 8:if(!n.id){e.next=14;break}return s=[],s.push({id:n.id}),e.next=13,l.fileApi.fileDelete(s);case 13:t.$emit("onImgDel",n.id);case 14:t.upload_picture_list.splice(a,1),t.upload_after_list.splice(a,1),t.upload_picture_list=t.upload_picture_list;case 17:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}(),b=function(e,t){uni.previewImage({current:t.upload_after_list[e.currentTarget.dataset.index],urls:t.upload_after_list})},w=function(){var e=(0,s.default)((0,i.default)().mark((function e(t,a){var n,s,o;return(0,i.default)().wrap((function(e){while(1)switch(e.prev=e.next){case 0:for(n=[],s=0,o=a.upload_picture_list.length;s<o;s++)n.push(a.upload_picture_list[s].url);uni.previewImage({current:t.currentTarget.dataset.src,urls:n});case 3:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()},"0c7b":function(e,t,a){var n=a("8f46");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var i=a("4f06").default;i("168a5430",n,!0,{sourceMap:!1,shadowMode:!1})},"13ee":function(e,t,a){"use strict";a.r(t);var n=a("88c7"),i=a("cacc");for(var s in i)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return i[e]}))}(s);a("c2e5");var o=a("f0c5"),r=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"34e64688",null,!1,n["a"],void 0);t["default"]=r.exports},"260b":function(e,t,a){var n=a("77f7");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var i=a("4f06").default;i("dc23c1a6",n,!0,{sourceMap:!1,shadowMode:!1})},"55a9":function(e,t,a){"use strict";a.r(t);var n=a("66b2"),i=a("e16a");for(var s in i)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return i[e]}))}(s);a("6cdf");var o=a("f0c5"),r=Object(o["a"])(i["default"],n["b"],n["c"],!1,null,"ea0996f0",null,!1,n["a"],void 0);t["default"]=r.exports},"66b2":function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){}));var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.visiabled?a("div",{staticClass:"mInput input-label",class:[e.labletPositon,e.disabled?"readonly":"",e.isFocus?"inputFocus":""]},[a("v-uni-label",{staticClass:"text",class:{changeFlex:"change"==e.inputsource,drakcolor:!e.isLabel&&!e.element.readonly&&!e.showContent}},[e._v(e._s(e.label)),e.requisite?a("span",{staticClass:"icon iconfont iconmust-fill2 requisite"}):e._e()]),a("div",{staticClass:"input-content"},[a("v-uni-input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],model:{value:e.elementValue,callback:function(t){e.elementValue=t},expression:"elementValue"}}),a("v-uni-input",{staticClass:"input",attrs:{readonly:"readonly",disabled:!!e.disabled,type:e.inputType_,min:3,"auto-blur":"true"},on:{input:function(t){arguments[0]=t=e.$handleEvent(t),e.changeLabelColor.apply(void 0,arguments)},focus:function(t){arguments[0]=t=e.$handleEvent(t),e.inputFocus.apply(void 0,arguments)},blur:function(t){arguments[0]=t=e.$handleEvent(t),e.inputBlur.apply(void 0,arguments)}},model:{value:e.elementValue,callback:function(t){e.elementValue="string"===typeof t?t.trim():t},expression:"elementValue"}}),a("m-font-icon",{attrs:{icon:e.iconClass,iconSize:e.iconSize},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.fontIconClick.apply(void 0,arguments)}}}),e._t("btns")],2),e._t("right")],2):a("v-uni-view",[a("v-uni-input",{directives:[{name:"show",rawName:"v-show",value:!1,expression:"false"}],model:{value:e.elementValue,callback:function(t){e.elementValue="string"===typeof t?t.trim():t},expression:"elementValue"}})],1)},i=[]},"6cdf":function(e,t,a){"use strict";var n=a("260b"),i=a.n(n);i.a},"77f7":function(e,t,a){var n=a("24fb");t=n(!1),t.push([e.i,".clearBtn[data-v-ea0996f0]{position:relative;padding:0 10px}",""]),e.exports=t},"793f":function(e,t,a){e.exports=a.p+"static/img/safe.2804f9bc.png"},"88c7":function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){}));var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",{staticClass:"user-info changePassword"},[a("m-back-bar",{attrs:{backStyle:"0"===e.passwordValidity?"":"backStyleNoBack"}},[a("template",{attrs:{slot:"barTitle"},slot:"barTitle"},[e._v(e._s(e.barTitle))]),a("template",{attrs:{slot:"barRight"},slot:"barRight"},[a("m-button",{on:{elementClick:function(t){arguments[0]=t=e.$handleEvent(t),e.handleTopClick()}}},[a("template",{staticStyle:{display:"inline-block"},attrs:{slot:"buttonIcon"},slot:"buttonIcon"},[a("m-font-icon",{attrs:{iconSize:"40"}})],1)],2)],1)],2),a("v-uni-view",{staticClass:"safe-view"},[a("v-uni-image",{staticClass:"safe-image",attrs:{src:e.safeImage,mode:"widthFix"}})],1),a("v-uni-view",{staticClass:"user-info-list"},[a("v-uni-view",{staticClass:"user-info-item top"},[a("v-uni-label",[e._v(e._s(e.$t("user-OldPassword")))]),a("v-uni-view",{staticClass:"input-view"},["checkbox"===e.inputType_[0]?a("v-uni-input",{staticClass:"changeInput",attrs:{autocomplete:"off",value:"oldPassWord",name:"oldPassWord",placeholder:e.$t("lang-change-password-enter-old"),"placeholder-class":"placeholderClass",type:"checkbox"},model:{value:e.oldPassWord,callback:function(t){e.oldPassWord=t},expression:"oldPassWord"}}):"radio"===e.inputType_[0]?a("input",{directives:[{name:"model",rawName:"v-model",value:e.oldPassWord,expression:"oldPassWord"}],staticClass:"changeInput",attrs:{autocomplete:"off",value:"oldPassWord",name:"oldPassWord",placeholder:e.$t("lang-change-password-enter-old"),"placeholder-class":"placeholderClass",type:"radio"},domProps:{checked:e._q(e.oldPassWord,"oldPassWord")},on:{change:function(t){e.oldPassWord="oldPassWord"}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:e.oldPassWord,expression:"oldPassWord"}],staticClass:"changeInput",attrs:{autocomplete:"off",value:"oldPassWord",name:"oldPassWord",placeholder:e.$t("lang-change-password-enter-old"),"placeholder-class":"placeholderClass",type:e.inputType_[0]},domProps:{value:e.oldPassWord},on:{input:function(t){t.target.composing||(e.oldPassWord=t.target.value)}}}),a("m-font-icon",{staticClass:"iconfontClass",attrs:{icon:e.static_passwordIcon[0],iconSize:e.iconSize},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.fontIconClick(0)}}})],1)],1),a("v-uni-view",{staticClass:"user-info-item top"},[a("v-uni-label",[e._v(e._s(e.$t("user-NewPassword")))]),a("v-uni-view",{staticClass:"input-view"},["checkbox"===e.inputType_[1]?a("v-uni-input",{staticClass:"changeInput",attrs:{autocomplete:"off",value:"newPassWord",name:"newPassWord",placeholder:e.PasswordLevelRule.placeholder,"placeholder-class":"placeholderClass",type:"checkbox"},model:{value:e.newPassWord,callback:function(t){e.newPassWord=t},expression:"newPassWord"}}):"radio"===e.inputType_[1]?a("input",{directives:[{name:"model",rawName:"v-model",value:e.newPassWord,expression:"newPassWord"}],staticClass:"changeInput",attrs:{autocomplete:"off",value:"newPassWord",name:"newPassWord",placeholder:e.PasswordLevelRule.placeholder,"placeholder-class":"placeholderClass",type:"radio"},domProps:{checked:e._q(e.newPassWord,"newPassWord")},on:{change:function(t){e.newPassWord="newPassWord"}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:e.newPassWord,expression:"newPassWord"}],staticClass:"changeInput",attrs:{autocomplete:"off",value:"newPassWord",name:"newPassWord",placeholder:e.PasswordLevelRule.placeholder,"placeholder-class":"placeholderClass",type:e.inputType_[1]},domProps:{value:e.newPassWord},on:{input:function(t){t.target.composing||(e.newPassWord=t.target.value)}}}),a("m-font-icon",{staticClass:"iconfontClass",attrs:{icon:e.static_passwordIcon[1],iconSize:e.iconSize},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.fontIconClick(1)}}})],1)],1),a("v-uni-view",{staticClass:"user-info-item top"},[a("v-uni-label",[e._v(e._s(e.$t("check-ConfirmNewPassword")))]),a("v-uni-view",{staticClass:"input-view"},["checkbox"===e.inputType_[2]?a("v-uni-input",{staticClass:"changeInput",attrs:{autocomplete:"off",value:"checkPassWord",name:"checkPassWord",placeholder:e.PasswordLevelRule.placeholder,"placeholder-class":"placeholderClass",type:"checkbox"},model:{value:e.checkPassWord,callback:function(t){e.checkPassWord=t},expression:"checkPassWord"}}):"radio"===e.inputType_[2]?a("input",{directives:[{name:"model",rawName:"v-model",value:e.checkPassWord,expression:"checkPassWord"}],staticClass:"changeInput",attrs:{autocomplete:"off",value:"checkPassWord",name:"checkPassWord",placeholder:e.PasswordLevelRule.placeholder,"placeholder-class":"placeholderClass",type:"radio"},domProps:{checked:e._q(e.checkPassWord,"checkPassWord")},on:{change:function(t){e.checkPassWord="checkPassWord"}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:e.checkPassWord,expression:"checkPassWord"}],staticClass:"changeInput",attrs:{autocomplete:"off",value:"checkPassWord",name:"checkPassWord",placeholder:e.PasswordLevelRule.placeholder,"placeholder-class":"placeholderClass",type:e.inputType_[2]},domProps:{value:e.checkPassWord},on:{input:function(t){t.target.composing||(e.checkPassWord=t.target.value)}}}),a("m-font-icon",{staticClass:"iconfontClass",attrs:{icon:e.static_passwordIcon[2],iconSize:e.iconSize},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.fontIconClick(2)}}})],1)],1)],1),a("v-uni-view",{staticClass:"save-item"},[a("m-button",{attrs:{btnTilte:e.$t("basic-save"),btnClass:"mainColor"},on:{elementClick:function(t){arguments[0]=t=e.$handleEvent(t),e.changePassword()}}})],1)],1)},i=[]},"8f46":function(e,t,a){var n=a("24fb");t=n(!1),t.push([e.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.iconfontClass[data-v-34e64688]{color:#9f9f9f}.placeholderClass[data-v-34e64688]{color:red}.user-info-item[data-v-34e64688]:last-child{border-bottom:1px solid #e6e6e6!important}',""]),e.exports=t},"9c0ed":function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"c",(function(){return i})),a.d(t,"a",(function(){}));var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.static_visiabled,expression:"static_visiabled"}],staticClass:"upimg",class:[e.static_readonly?"readonly":""]},[e.uploadType?e._e():a("v-uni-label",{staticClass:"text"},[e._v(e._s(e.elementLable)),e.static_requisite?a("span",{staticClass:"icon iconfont iconmust-fill2 requisite"}):e._e()]),"qualiflcation"==e.uploadType?a("v-uni-view",{staticClass:"qualification-upload-content"},[a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.upload_picture_list.length<e.upImgConfig.count||e.upImgConfig.notli,expression:"\n        upload_picture_list.length < upImgConfig.count || upImgConfig.notli\n      "}],staticClass:"upload-item",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseImage(e.upImgConfig.count)}}},[a("m-font-icon",{attrs:{icon:"iconpaizhaozhaoxiangji",color:"#D9D9D9",iconSize:90}}),a("v-uni-view",[e._v(e._s(e.$t("page-personal")))])],1)],1):e._e(),"touxiang"==e.uploadType?a("v-uni-view",{staticClass:"userinfo-upload",on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseImage(1)}}},[a("v-uni-image",{ref:"uImage",attrs:{src:e.defaultpicpath,mode:"aspectFill"}})],1):e._e(),"touxiang"!=e.uploadType?a("v-uni-scroll-view",{class:"qualiflcation"==e.uploadType?"noscroll":"",attrs:{"scroll-x":!0}},[a("v-uni-view",{staticClass:"sunsin_picture_list",class:"qualiflcation"==e.uploadType?"sunsin_picture_list_qualification":""},["qualiflcation"==e.uploadType||e.static_readonly?e._e():a("v-uni-view",[""==e.upImgConfig.iconReplace||void 0==e.upImgConfig.iconReplace?a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.upload_picture_list.length<e.upImgConfig.count||e.upImgConfig.notli,expression:"\n            upload_picture_list.length < upImgConfig.count ||\n            upImgConfig.notli\n          "}],staticClass:"sunsin_picture_item sunsin_width"},[a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.upImgConfig.isAddImage||!0,expression:"upImgConfig.isAddImage || true"}],staticClass:"sunsin_add_image sunsin_width",staticStyle:{"background-image":"url(../../static/images/upload.png)"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseImage(e.upImgConfig.count)}}})],1):a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.upload_picture_list.length<e.upImgConfig.count||e.upImgConfig.notli,expression:"\n            upload_picture_list.length < upImgConfig.count ||\n            upImgConfig.notli\n          "}],staticClass:"sunsin_picture_item sunsin_width"},[e.static_readonly?e._e():a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:e.upImgConfig.isAddImage||!0,expression:"upImgConfig.isAddImage || true"}],staticClass:"sunsin_add_image sunsin_width",staticStyle:{"background-image":"url(../../static/images/upload.png)"},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.chooseImage(e.upImgConfig.count)}}})],1)],1),e._l(e.upload_picture_list,(function(t,n){return a("v-uni-view",{key:n,staticClass:"sunsin_picture_item"},[a("v-uni-image",{directives:[{name:"show",rawName:"v-show",value:t.upload_percent<100,expression:"item.upload_percent < 100"}],staticClass:"sunsin_width",attrs:{src:t.path,mode:"aspectFill"}}),a("v-uni-image",{directives:[{name:"show",rawName:"v-show",value:100==t.upload_percent,expression:"item.upload_percent == 100"}],staticClass:"sunsin_width",attrs:{"data-src":t.url,src:t.url,mode:"aspectFill","data-idx":n},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImgs.apply(void 0,arguments)}}}),a("v-uni-view",{directives:[{name:"show",rawName:"v-show",value:t.upload_percent<100,expression:"item.upload_percent < 100"}],staticClass:"sunsin_upload_progress sunsin_width",attrs:{"data-index":n},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.previewImg.apply(void 0,arguments)}}},[e._v(e._s(t.upload_percent)+"%")]),e.static_readonly?e._e():a("v-uni-text",{staticClass:"del iconfont icon-shanchu",class:"left"==e.upImgConfig.delBtnLocation?"left":"right"==e.upImgConfig.delBtnLocation?"right":"bleft"==e.upImgConfig.delBtnLocation?"bleft":"bright"==e.upImgConfig.delBtnLocation?"bright":"right",style:"color:"+e.upImgConfig.delIconText+";background-color:"+e.upImgConfig.delIconColor,attrs:{"data-url":t.url,"data-index":n,hidden:e.upImgConfig.isDelIcon||!1},on:{click:function(t){arguments[0]=t=e.$handleEvent(t),e.deleteImg.apply(void 0,arguments)}}},[e._v("×")])],1)}))],2)],1):e._e()],1)},i=[]},"9fad":function(e,t,a){var n=a("b88d");n.__esModule&&(n=n.default),"string"===typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);var i=a("4f06").default;i("bcfb876a",n,!0,{sourceMap:!1,shadowMode:!1})},ad4a:function(e,t,a){"use strict";a("7a82");var n=a("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("d3b7"),a("159b"),a("4d63"),a("c607"),a("ac1f"),a("2c3e"),a("25f0"),a("00b4"),a("a9e3"),a("99af");var i=n(a("5530")),s=a("26cb"),o=n(a("e143")),r=n(a("00a1")),l=n(a("793f")),u=n(a("55a9")),c=n(a("043e")),d=n(a("4bd5")),p={components:{mUpload:r.default,mInputLable:u.default},data:function(){return{barTitle:this.$t("lang-change-password-security-settings"),username:c.default.userName,userId:c.default.userId,oldPassWord:"",newPassWord:"",checkPassWord:"",iconSize:48,Strength:0,Strengthname:this.$t("lang-change-password-low"),static_passwordIcon:["iconmimaxianshi","iconmimayincang","iconmimayincang"],inputType_:["text","password","password"],safeImage:l.default}},computed:(0,i.default)((0,i.default)((0,i.default)({},(0,s.mapState)(["passwordStrength","passwordValidity","PasswordLevel"])),(0,s.mapState)("home",{bottomList:"bottomList"})),{},{PasswordLevelRule:function(){var e={minLen:8,rule:[".*[0-9]{1,}.*",".*[a-z]{1,}.*",".*[A-Z]{1,}.*",".*[~!@#%_*]{1,}.*"]},t=this.PasswordLevel;return e.placeholder="最小".concat(e.minLen,"3"===t?"位:必须包含数字;大小字母;~!@#%_*":"2"===t?"位:数字;大小字母;~!@#%_*任意2种":"位:数字;大小字母;~!@#%_*任意1种"),e}}),watch:{newPassWord:function(e,t){this.checkPassword(e)}},methods:{handleTopClick:function(){uni.navigateTo({url:"/pages/home/home?pageType=myself"})},fontIconClick:function(e){"iconmimayincang"===this.static_passwordIcon[e]?(o.default.set(this.static_passwordIcon,e,"iconmimaxianshi"),o.default.set(this.inputType_,e,"text")):"iconmimaxianshi"===this.static_passwordIcon[e]&&(o.default.set(this.static_passwordIcon,e,"iconmimayincang"),o.default.set(this.inputType_,e,"password"))},checkPassword:function(e){var t=this.PasswordLevelRule;if(e.length<t.minLen)return this.Strength=0,!1;var a=0;t.rule.forEach((function(t){var n=new RegExp(t,"g");n.test(e)&&a++})),a<2&&a>0?(this.Strength=1,this.Strengthname=this.$t("lang-change-password-low")):a>3?(this.Strength=3,this.Strengthname=this.$t("lang-change-password-high")):a>=2&&(this.Strength=2,this.Strengthname=this.$t("lang-change-password-medium"))},changePassword:function(){var e=this;console.log("changePassword");var t=this;if(""==t.oldPassWord)return uni.showToast({title:t.$t("lang-change-password-old"),duration:500,icon:"none"}),!1;if(""==t.newPassWord||""==t.checkPassWord)return uni.showToast({title:t.$t("lang-change-password-new-none"),duration:500,icon:"none"}),!1;if(t.newPassWord!=t.checkPassWord)return uni.showToast({title:t.$t("lang-change-password-new"),duration:500,icon:"none"}),!1;var a=this.PasswordLevelRule,n=this.PasswordLevel,i=this.Strength;if("0"!==n&&i<Number(n))return this.Static_GlobalFucs.showToast({title:a.placeholder}),!1;var s={oldPassWord:this.oldPassWord,newPassWord:this.newPassWord,checkPassWord:this.checkPassWord};s=(0,d.default)(s),this.$http.post("user/updatePassWord",s).then((function(a){a.data.success&&(uni.showToast({title:t.$t("pageTip-successfulPasswordModification"),duration:1e3,icon:"none"}),t.$http.post("logout").then((function(e){var t=e.data;if(t.success){uni.redirectTo({url:"/pages/login/login"})}})).catch((function(t){e.Static_GlobalFucs.showToast({title:t})})))})).catch((function(t){e.Static_GlobalFucs.showToast({title:t})}))},checkfingerprint:function(){plus.fingerprint.isSupport()?plus.fingerprint.isKeyguardSecure()?plus.fingerprint.isEnrolledFingerprints()?this.fingerpring():plus.nativeUI.toast(this.$t("lang-change-password-fingerprint-tip")):plus.nativeUI.toast(this.$t("lang-change-password-not-fingerprint")):plus.nativeUI.toast(this.$t("lang-change-password-device-not-fingerprint"))},fingerpring:function(){plus.fingerprint.authenticate((function(){plus.nativeUI.closeWaiting(),console.log("指纹识别成功")}),(function(e){switch(e.code){case e.AUTHENTICATE_MISMATCH:plus.nativeUI.toast(this.$t("lang-change-password-fingerprint-reset"));break;case e.AUTHENTICATE_OVERLIMIT:plus.nativeUI.closeWaiting(),plus.nativeUI.alert(this.$t("lang-change-password-fingerprint-reset-num"));break;default:plus.nativeUI.closeWaiting(),plus.nativeUI.alert("".concat(this.$t("lang-change-password-fingerprint-faile"),"(").concat(e.code,"),").concat(this.$t("lang-change-password-fingerprint-again")));break}})),"Android"==plus.os.name&&plus.nativeUI.showWaiting(this.$t("lang-change-password-fingerprint-identify")+"...")}},mounted:function(){}};t.default=p},b88d:function(e,t,a){var n=a("24fb");t=n(!1),t.push([e.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.icon-text[data-v-144e5527]{font-size:.2em}\r\n/* 宽度 */.sunsin_width[data-v-144e5527]{width:%?150?%!important;height:%?150?%!important\r\n  /* line-height: 150upx !important; */}\r\n/* 循环列表样式 */.sunsin_picture_list[data-v-144e5527]{width:96%;padding:2% 0;display:flex;\r\n  /* flex-wrap: wrap; */text-align:center}.sunsin_picture_list.wrap[data-v-144e5527]{flex-wrap:wrap}.sunsin_picture_list uni-image[data-v-144e5527]{width:%?40?%;height:%?40?%;margin:0 4%}.sunsin_picture_list uni-image.icon_replace[data-v-144e5527]{width:%?150?%;height:%?150?%}\r\n/* 添加图片样式 */.sunsin_add_image[data-v-144e5527]{color:#ddd;font-size:%?24?%;text-align:center;line-height:0!important;cursor:pointer;display:flex;justify-content:center;align-items:center;flex-wrap:wrap;border:1px dashed #d9d9d9;background-repeat:no-repeat;background-position:50%;background-size:60%}\r\n/* 预览图片 */.sunsin_picture_item[data-v-144e5527]{position:relative;margin-right:%?30?%}\r\n/* 删除按钮样式 */.sunsin_picture_item .del[data-v-144e5527]{position:absolute;color:#fff;border-radius:%?-4?%;border-top-right-radius:%?6?%;width:%?40?%;height:%?40?%;line-height:%?40?%;z-index:2;text-align:center;background-color:grey;border-radius:50%}\r\n/* 删除图标位置(上左) */.sunsin_picture_item .del.left[data-v-144e5527]{top:0;left:0;margin-left:4%;border-top-right-radius:0;border-top-left-radius:%?6?%}\r\n/* 删除图标位置(上右) */.sunsin_picture_item .del.right[data-v-144e5527]{top:0;right:-4.2%}\r\n/* 删除图标位置(下左) */.sunsin_picture_item .del.bleft[data-v-144e5527]{bottom:0;left:4%;border-top-left-radius:0;border-bottom-left-radius:%?6?%}\r\n/* 删除图标位置(下右) */.sunsin_picture_item .del.bright[data-v-144e5527]{right:-4.2%;bottom:0;border-top-right-radius:0}\r\n/* 进度遮罩层样式 */.sunsin_upload_progress[data-v-144e5527]{position:absolute;top:0;left:0;color:#fff;font-size:%?24?%;text-align:center;line-height:%?160?%;margin-left:4%;border-radius:%?8?%;background-color:rgba(0,0,0,.7)}\r\n/* 自定义添加图片样式 */.sunsin_picture_item uni-image[data-v-144e5527]{box-shadow:%?6?% %?6?% %?12?% rgba(112,128,144,.7);border-radius:%?15?%}\r\n/* 个人资质上传图片样式 */.upload-item[data-v-144e5527]{width:100%;height:%?345?%;display:flex;justify-content:center;align-items:center;flex-direction:column;background:#fafafa;border-radius:%?12?%;color:#d9d9d9;font-size:%?28?%;line-height:%?90?%}.sunsin_picture_list_qualification[data-v-144e5527]{display:flex;justify-content:flex-start;margin-top:%?25?%;width:100%;flex-wrap:wrap;border:none}.sunsin_picture_list_qualification > uni-view[data-v-144e5527]{flex-grow:0;width:30%;height:%?214?%;margin:5px 1.5%}.sunsin_picture_list_qualification > uni-view > uni-image.sunsin_width[data-v-144e5527],\r\n.sunsin_picture_list_qualification > uni-view > uni-view.sunsin_width[data-v-144e5527]{width:100%!important;height:100%!important;margin:0}.sunsin_picture_list_qualification .del.right[data-v-144e5527]{right:0}.noscroll[data-v-144e5527]{overflow-x:hidden}.userinfo-upload[data-v-144e5527]{width:100%;height:100%;overflow:hidden}.userinfo-upload uni-image[data-v-144e5527]{width:%?110?%;height:%?110?%}',""]),e.exports=t},c2e5:function(e,t,a){"use strict";var n=a("0c7b"),i=a.n(n);i.a},cacc:function(e,t,a){"use strict";a.r(t);var n=a("ad4a"),i=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(s);t["default"]=i.a},dc58:function(e,t,a){"use strict";var n=a("9fad"),i=a.n(n);i.a},e16a:function(e,t,a){"use strict";a.r(t);var n=a("ee62"),i=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(s);t["default"]=i.a},e7b2:function(e,t,a){"use strict";a.r(t);var n=a("02a5"),i=a.n(n);for(var s in n)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(s);t["default"]=i.a},ee62:function(e,t,a){"use strict";a("7a82");var n=a("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i=n(a("5530"));a("a9e3"),a("4de4"),a("d3b7"),a("7db0"),a("99af");var s=a("26cb"),o={name:"mInputLableTop",props:{bundleId:[Number,String],relationMainTab:[Number,String],relationColumnType:Number,mobileTabId:Number,labletPositon:{type:String,default:"left"},inputType:{type:String,default:"text"},label:{type:String,default:"elementLable"},labelType:{type:String,default:"form"},icon:String,iconSize:{type:Number,default:16},elementId:[String,Number],visiabled:{type:[Number,Boolean],default:1},requisite:{type:[Number,Boolean],default:0},disabled:{type:[Number,Boolean],default:0},inputsource:String,germValue:{type:Object,default:function(){return{}}}},data:function(){return{isCreate:!1,inputType_:this.inputType,isFocus:!1,iconNormalClass:"icon iconfont",static_passwordIcon:"iconmimayincang",elementValue:"",isLabel:!1}},computed:(0,i.default)((0,i.default)({},(0,s.mapState)("common",{triggerMap:"triggerMap",tabsElements:"tabsElements",tabsFormDatas:"tabsFormDatas"})),{},{iconClass:function(){return this.icon?this.icon:"password"===this.inputType?this.static_passwordIcon:void 0},trigger:function(){var e=this.triggerMap[this.bundleId]||{};return e[this.elementId]||[]},elementInfo:function(){return{id:this.elementValue,name:this.elementValue,relationColumnType:this.relationColumnType}}}),watch:{elementInfo:function(e,t){this.SET_TABS_FORMDATAS({tabId:this.mobileTabId,elementId:this.elementId,params:e}),"advancedFilter"===this.labelType&&this.SET_ADV_FORMDATAS({tabId:this.mobileTabId,elementId:this.elementId,params:e})},elementValue:function(e,t){if(e!=t){var a=this.trigger.filter((function(e){return 5===e.basetype&&e.jsFunctionList.length>0}))||[],n=!0;if(-1!==a.length&&!this.isCreate&&e)for(var i=0,s=a.length;i<s;i++){var o=a[i].jsFunctionList;if(!this.checkedNumberRange(e,o,t)){n=!1;break}}if(n){this.isCreate&&"create",this.isCreate=!1,this.$emit("input",e)}}}},methods:(0,i.default)((0,i.default)((0,i.default)((0,i.default)({},(0,s.mapMutations)("verificationRule",["SET_TAB_RULE"])),(0,s.mapMutations)("common",["SET_TABS_FORMDATAS"])),(0,s.mapMutations)("advanceFilter",["SET_ADV_FORMDATAS"])),{},{checkedNumberRange:function(e,t){var a=t.find((function(e){return"min"===e.param}))||{},n=t.find((function(e){return"max"===e.param}))||{},i={},s={},o={otherTabId:this.relationMainTab,mobileTabId:this.mobileTabId,tabsElements:this.tabsElements,tabsFormDatas:this.tabsFormDatas};if(2===a.valueType){var r=o;r.key=a.paramValue,i=this.Static_GlobalFucs.Global_ParamFormat(r,this)}else i.id=a.paramValue,i.lable=a.paramValue;if(2===n.valueType){var l=o;l.key=n.paramValue,s=this.Static_GlobalFucs.Global_ParamFormat(l,this)}else s.id=n.paramValue,s.lable=n.paramValue;var u={};u[this.elementId]=e;var c=this.Static_GlobalFucs.checkForm({rule:[{name:this.elementId,checkType:"numberRange",checkRule:"".concat(i.id||"",",").concat(s.id||""),errorMsg:"".concat(this.label||"",",").concat(i.lable||"",",").concat(s.lable||"")}],data:u});return c.isCheck||(this.Static_GlobalFucs.showToast({title:c.errorMsg}),this.elementValue=i.id||s.id),c.isCheck},inputFocus:function(){this.isFocus=!0},handleTrigger:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,t={};t["elementId"]=this.elementId,t["triggerBaseType"]=e,t["value"]=this.elementValue,t["label"]=this.elementValue,this.$emit("trigger",t)},inputBlur:function(){this.isFocus=!1,this.handleTrigger(2)},fontIconClick:function(){"iconmimayincang"===this.iconClass?(this.static_passwordIcon="iconmimaxianshi",this.inputType_="text"):"iconmimaxianshi"===this.iconClass&&(this.static_passwordIcon="iconmimayincang",this.inputType_="password")},changeLabelColor:function(e){this.isLabel=!!e.detail.value}}),created:function(){this.isCreate=!0,this.elementValue=this.germValue.id}};t.default=o}}]);