(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-frames-UBPFramework"],{"7c02":function(e,t,a){"use strict";a.r(t);var i=a("8322"),n=a("e018");for(var s in n)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return n[e]}))}(s);var o=a("f0c5"),r=Object(o["a"])(n["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],void 0);t["default"]=r.exports},8322:function(e,t,a){"use strict";a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return n})),a.d(t,"a",(function(){}));var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-uni-view",{staticClass:"BRATemplate"},[a("m-back-bar",[a("template",{attrs:{slot:"barTitle"},slot:"barTitle"},[e._v(e._s(e.barTitle))]),a("template",{attrs:{slot:"barRight"},slot:"barRight"},[a("top-btns-coms",{attrs:{tabInfo:e.tabInfo}})],1)],2),e.quickQuery.isSearch?a("v-uni-view",{staticClass:"list-seach"},[a("m-input-search",{attrs:{tabInfo:e.tabInfo,quickQuery:e.quickQuery,mobileTabId:e.tabInfo.mobileTabId,isQuickQuery:e.quickQuery.isQuickQuery,isSeniorFilter:e.quickQuery.isSeniorFilter},on:{doSearch:function(t){arguments[0]=t=e.$handleEvent(t),e.handelSearch.apply(void 0,arguments)}}})],1):e._e(),e.isShow?a("ListCom",{ref:"List",attrs:{tabInfo:e.tabInfo,listConfig:e.listConfig},on:{clickList:function(t){arguments[0]=t=e.$handleEvent(t),e.clickList.apply(void 0,arguments)}}}):e._e(),e.configLoading?a("mLodingSvg",{attrs:{loadingTitle:"界面配置缓存中,请稍后"}}):e._e()],1)},n=[]},8800:function(e,t,a){"use strict";a("7a82");var i=a("4ea4").default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0,a("a9e3"),a("e9c4");var n=i(a("5530")),s=i(a("3184")),o=a("cd03"),r=a("26cb"),u=i(a("551a")),l=i(a("f7ad")),d=i(a("5bf6")),c=i(a("073b")),b=new u.default,f="",m={components:{topBtnsComs:d.default,mInputSearch:l.default,ListCom:c.default},data:function(){return{listConfig:{},page:0,currentPage:1,quickQuery:{},searchParams:{},isShow:!1,tabInfo:{},barTitle:"",configLoading:!1,bundleName:"",bundleId:""}},computed:(0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)({},(0,r.mapState)(["userDesigner"])),(0,r.mapState)("home",{newBundle:"newBundle"})),(0,r.mapState)("list",{forceRefresh:"forceRefresh"})),(0,r.mapState)("framsStore",["jumpTagParam","jumpInBundleParam"])),(0,r.mapState)("common",["pageRealod"])),watch:{searchParams:function(e,t){this.$refs.list.searchParams=e}},methods:(0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)((0,n.default)({},(0,r.mapMutations)(["SET_bundle","SET_BusinessID"])),(0,r.mapMutations)("list",["SET_LIST_REFRESH"])),(0,r.mapMutations)("form",["SET_ALLBTNS"])),(0,r.mapMutations)("home",["SET_NEW_BUNDLE"])),(0,r.mapMutations)("common",["SET_COMMON_MAINFRAME","SET_TEMPLATE_PARAMS","SET_TRIGGERMAP","SET_COMMONSLT","SET_TABS_ELEMENT","SET_COM_PAGERELOAD"])),(0,r.mapMutations)("advanceFilter",["SET_ADVAN_FILTERS","SET_ADV_FORMDATAS"])),(0,r.mapMutations)("Toast",["TOAST_REQUESTURLS"])),{},{clickList:function(e){e=(0,n.default)((0,n.default)({},this.tabInfo),e),e.isMain=!0,b.clickListNode(this,e)},handelSearch:function(e){var t=(0,n.default)((0,n.default)({},this.quickQuery),e),a=b.handleSearchText(this,t);this.$refs.List.doSearch(a)},setListInfo:function(e){this.page=e.page||1,this.currentPage=e.currentPage||1},setPageInfo:function(e,t){var a=this;if(t){var i=e[t],n=(e[i.mobileTabRelationTabId],i||{}),s=n.dataSourceType,o=n.commonApiHeaderId,r=n.interfaceInParam;if(2!==s||o){this.barTitle=i.mobileTabName||this.bundleName;var u={advancedQuery:i.advancedQuery||{},advancedSqlQuery:i.advancedSqlQuery||[],relationMainTab:this.tabInfo.relationMainTab};this.tabInfo.jumpTag&&(u.bundleParams=this.tabInfo.bundleParams||{});var l=b.advancedParams(this,u),d={};d.otherParams={globalMap:l.advancedQuery,globalQueryMap:l.advancedSqlQuery,mobileTabId:this.tabInfo.mobileTabId,elementList:i.elements,mobileTabSource:i.mobileTabSource},d.baseParams={hasIcon:!0,listIcon:i.listIcon||{},multiple:!1,hasCheck:!1},d.isCheckedParams={primaryKey:i.primaryKey},d.goEventParams={primaryKey:i.primaryKey,mobileTabRelationTabId:i.mobileTabRelationTabId},2===s&&o?(d.baseParams.dataSourceType=s,d.baseParams.commonApiHeaderId=o,d.otherParams.interfaceInParam=r,d.url="static_getDataByInterface"):d.url="currencyGetListData",this.listConfig=d,setTimeout((function(){(2===s&&o||i.mobileTabSource&&i.elements.length>0)&&(a.isShow=!0)}),100),this.quickQuery=i.quickQuery||{},this.SET_ADVAN_FILTERS({tabId:t,params:i.elements}),this.SET_ADV_FORMDATAS({tabId:t+"_filter",value:{}}),this.SET_ALLBTNS({tabId:t,bottomBtns:i.btnList.bottomBtn,topRightBtns:i.btnList.topRightBtn}),this.SET_TABS_ELEMENT({tabId:t,elements:i.elements})}else this.Static_GlobalFucs.showModal(this,{content:this.$t("pageTip-noInterface")},"error")}else this.Static_GlobalFucs.showModal(this,{content:this.$t("pageTip-configuration")},"error")}}),onLoad:function(e){var t=this;if(this.TOAST_REQUESTURLS({type:"clear"}),e.bundleId){this.bundleId=e.bundleId,this.bundleName=e.title||"",e.jumpTag||(this.SET_bundle({bundleId:e.bundleId,bundleName:e.title}),this.SET_COMMON_MAINFRAME({_uid:this._uid})),f=uni.getStorageSync(this.bundleId)||{};var a=this.newBundle[this.bundleId],i=f.mainTabID,n=e.V||"0",r="listReload".concat(this._uid),u={_uid:this._uid,bundleId:this.bundleId,bundleName:this.bundleName,mobileTabId:i,relationMainTab:"",mobileTabs:f.mobileTabs,trigger:f.triggerMap||{},selfKey:r,isJumpTag:!!e.jumpTag,isFrames:!0};if(e.jumpTag){u.jumpTag=Number(e.jumpTag);var l=this.jumpInBundleParam[u.bundleId]||{};u.bundleParams=l.bundleParams}this.tabInfo=u,a||"{}"===JSON.stringify(f)?(this.configLoading=!0,o.homeApi.getPage(this,{bundleId:u.bundleId}).then((function(e){var i=e.mainTabID,s=e.mobileTabs;if(t.tabInfo.mobileTabId=i,t.tabInfo.mobileTabs=s,t.configLoading=!1,t.setPageInfo(s,i),a){t.SET_NEW_BUNDLE({bundle:t.bundleId,isNew:!1});var o=uni.getStorageSync("bundleVersion")||{},r=t.userDesigner+"_"+t.bundleId;o[r]=n,uni.setStorageSync("bundleVersion",o)}}))):this.setPageInfo(f.mobileTabs,i);s.default.$on(r,(function(e){t.$refs.List.getListData("reload")}))}},onShow:function(){var e=this.pageRealod.pages,t=this.tabInfo,a=t.selfKey,i=t.isJumpTag;e[a]&&e[a].type&&this.$refs.List.getListData("reload"),i||(this.SET_COM_PAGERELOAD({pageUid:"first",type:!1}),this.SET_COM_PAGERELOAD({pageUid:a,type:!1}))},onPullDownRefresh:function(){this.$refs.List.getListData("load")},onReachBottom:function(){this.$refs.List.getListData("loadnext")}};t.default=m},e018:function(e,t,a){"use strict";a.r(t);var i=a("8800"),n=a.n(i);for(var s in i)["default"].indexOf(s)<0&&function(e){a.d(t,e,(function(){return i[e]}))}(s);t["default"]=n.a}}]);