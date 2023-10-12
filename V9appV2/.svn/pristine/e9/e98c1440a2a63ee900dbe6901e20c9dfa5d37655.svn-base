<!-- 通用业务处理框架 Universal Business Processing Framework
 默认首页显示列表，点击行进入编辑页面
 详情的控件类型取至列表的控件
 列表默认显示label，详情按控件类型展示-->
<template name="listCreateTemplate">
  <view class="BRATemplate">
    <m-back-bar>
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight">
        <top-btns-coms :tabInfo="tabInfo"></top-btns-coms>
      </block>
    </m-back-bar>
    <view class="list-seach" v-if="quickQuery.isSearch">
      <m-input-search
        :tabInfo="tabInfo"
        :quickQuery="quickQuery"
        :mobileTabId="tabInfo.mobileTabId"
        :isQuickQuery="quickQuery.isQuickQuery"
        :isSeniorFilter="quickQuery.isSeniorFilter"
        @doSearch="handelSearch"
      ></m-input-search>
    </view>
    <ListCom
      ref="List"
      v-if="isShow"
      :tabInfo="tabInfo"
      :listConfig="listConfig"
      @clickList="clickList"
    ></ListCom>
    <mLodingSvg
      v-if="configLoading"
      loadingTitle="界面配置缓存中,请稍后"
    ></mLodingSvg>
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { homeApi } from '@/common/request/api.js';
import { mapState, mapMutations } from 'vuex';
import ClassList from '@/static/js/ClassList.js';

import mInputSearch from '@/components/element/m-inputSearch.vue';
import topBtnsComs from '@/pageComs/topBtnsComs.vue';
import ListCom from '@/components/makeup/list/ListCom.vue';

let listTem = new ClassList(),
  mobileTabs = '';
export default {
  components: { topBtnsComs, mInputSearch, ListCom },
  data() {
    return {
      //列表属性
      listConfig: {},
      page: 0, //总页数
      currentPage: 1, //当前页码
      quickQuery: {}, //便捷搜索
      searchParams: {}, //搜索参数
      isShow: false,
      //面板属性
      tabInfo: {}, //面板基本信息
      barTitle: '', //返回栏标题
      configLoading: false, //界面配置加载中
      bundleName: '',
      bundleId: '',
    };
  },
  computed: {
    ...mapState(['userDesigner']),
    ...mapState('home', { newBundle: 'newBundle' }),
    ...mapState('list', { forceRefresh: 'forceRefresh' }),
    ...mapState('framsStore', ['jumpTagParam', 'jumpInBundleParam']),
    ...mapState('common', ['pageRealod']), //面板参数
  },
  watch: {
    searchParams(newValue, oldValue) {
      this.$refs.list.searchParams = newValue;
    },
  },
  methods: {
    ...mapMutations(['SET_bundle', 'SET_BusinessID']),
    ...mapMutations('list', ['SET_LIST_REFRESH']),
    ...mapMutations('form', ['SET_ALLBTNS']),
    ...mapMutations('home', ['SET_NEW_BUNDLE']),
    ...mapMutations('common', [
      'SET_COMMON_MAINFRAME',
      'SET_TEMPLATE_PARAMS',
      'SET_TRIGGERMAP',
      'SET_COMMONSLT',
      'SET_TABS_ELEMENT', //设置面板变量
      'SET_COM_PAGERELOAD', //记录从工作台点击进入后所以面板，用于判断是否需要重新加载
    ]),
    ...mapMutations('advanceFilter', [
      'SET_ADVAN_FILTERS',
      'SET_ADV_FORMDATAS',
    ]),
    ...mapMutations('Toast', ['TOAST_REQUESTURLS']),

    clickList(params) {
      //点击列表
      params = { ...this.tabInfo, ...params };
      params.isMain = true;
      listTem.clickListNode(this, params);
    },
    handelSearch(searchParam) {
      //处理搜索
      let params = { ...this.quickQuery, ...searchParam };
      const quickQueryParams = listTem.handleSearchText(this, params);

      this.$refs.List.doSearch(quickQueryParams);
    },
    setListInfo(params) {
      //设置列表信息
      this.page = params.page || 1;
      this.currentPage = params.currentPage || 1;
    },
    setPageInfo(mobileTab, mainTabID) {
      //根据relationTab取具体面板信息
      //mobileTabs-此bundle下的所有面板；relationTab关联面板；mainTab是否取主面板
      if (!mainTabID) {
        this.Static_GlobalFucs.showModal(
          this,
          { content: this.$t('pageTip-configuration') },
          'error'
        );
        return;
      }
      const _this = this,
        mobileTabsBYRelation = mobileTab[mainTabID],
        mobileTabRelationTab =
          mobileTab[mobileTabsBYRelation.mobileTabRelationTabId] || {};

      //如果数据来源是接口
      const { dataSourceType, commonApiHeaderId, interfaceInParam } =
        mobileTabsBYRelation || {};
      if (dataSourceType === 2 && !commonApiHeaderId) {
        //如果数据来源是接口，但没有接口id提示错误
        this.Static_GlobalFucs.showModal(
          this,
          { content: this.$t('pageTip-noInterface') },
          'error'
        );
        return;
      }

      //设置返回栏标题
      this.barTitle = mobileTabsBYRelation.mobileTabName || this.bundleName;

      //设置列表参数
      let queryParamsConfig = {
        advancedQuery: mobileTabsBYRelation.advancedQuery || {}, //过滤条件中需要转化的变量
        advancedSqlQuery: mobileTabsBYRelation.advancedSqlQuery || [], //sql中的变量
        relationMainTab: this.tabInfo.relationMainTab,
      };
      if (this.tabInfo.jumpTag)
        queryParamsConfig.bundleParams = this.tabInfo.bundleParams || {};
      const queryParams = listTem.advancedParams(this, queryParamsConfig); //获取过滤条件中的变量
      //如果是其他菜单跳转过来的，需要
      const listConfig = {};
      listConfig.otherParams = {
        //列表额外参数，过滤条件中设置的参数
        globalMap: queryParams.advancedQuery,
        globalQueryMap: queryParams.advancedSqlQuery,
        mobileTabId: this.tabInfo.mobileTabId,
        elementList: mobileTabsBYRelation.elements,
        mobileTabSource: mobileTabsBYRelation.mobileTabSource,
      };
      listConfig.baseParams = {
        //列表基本参数
        hasIcon: true,
        listIcon: mobileTabsBYRelation.listIcon || {},
        multiple: false,
        hasCheck: false,
      };
      listConfig.isCheckedParams = {
        //列表点击返回参数
        primaryKey: mobileTabsBYRelation.primaryKey,
      };
      listConfig.goEventParams = {
        //列表点击返回参数
        primaryKey: mobileTabsBYRelation.primaryKey,
        mobileTabRelationTabId: mobileTabsBYRelation.mobileTabRelationTabId,
      };
      if (dataSourceType === 2 && commonApiHeaderId) {
        listConfig.baseParams.dataSourceType = dataSourceType;
        listConfig.baseParams.commonApiHeaderId = commonApiHeaderId;
        listConfig.otherParams.interfaceInParam = interfaceInParam;
        listConfig.url = 'static_getDataByInterface'; //来源与接口
      } else listConfig.url = 'currencyGetListData';
      this.listConfig = listConfig;

      //延迟显示列表
      setTimeout(() => {
        //如果数据来源为接口时接口id必须不能为空；或者面板数据源和控件列表不能为空
        if (
          (dataSourceType === 2 && commonApiHeaderId) ||
          (mobileTabsBYRelation.mobileTabSource &&
            mobileTabsBYRelation.elements.length > 0)
        )
          this.isShow = true;
      }, 100);
      //设置搜索控件参数
      this.quickQuery = mobileTabsBYRelation.quickQuery || {};

      this.SET_ADVAN_FILTERS({
        //设置高级筛选控件
        tabId: mainTabID,
        params: mobileTabsBYRelation.elements,
      });
      this.SET_ADV_FORMDATAS({
        //清空高级筛选条件值
        tabId: mainTabID + '_filter',
        value: {},
      });
      this.SET_ALLBTNS({
        //设置按钮
        tabId: mainTabID,
        bottomBtns: mobileTabsBYRelation.btnList.bottomBtn,
        topRightBtns: mobileTabsBYRelation.btnList.topRightBtn,
      });
      this.SET_TABS_ELEMENT({
        //设置面板控件
        tabId: mainTabID,
        elements: mobileTabsBYRelation.elements,
      });
    },
  },
  onLoad(options) {
    this.TOAST_REQUESTURLS({ type: 'clear' }); //清空请求地址
    if (!options.bundleId) return;

    const _t = this;
    //如果有bundleId传递过来默认显示
    this.bundleId = options.bundleId;
    this.bundleName = options.title || '';
    if (!options.jumpTag) {
      this.SET_bundle({
        bundleId: options.bundleId,
        bundleName: options.title,
      });
      this.SET_COMMON_MAINFRAME({ _uid: this._uid }); //记录框架的唯一标识
    }

    //判断是否有mobileTabs
    mobileTabs = uni.getStorageSync(this.bundleId) || {};
    //判断是否需要重新获取界面元素
    const isNew = this.newBundle[this.bundleId], //是不是为newbundle
      mobileTabId = mobileTabs.mainTabID,
      bundleV = options.V || '0';
    //定义面板信息
    let onKey = `listReload${this._uid}`;
    let tabInfo = {
      _uid: this._uid,
      bundleId: this.bundleId,
      bundleName: this.bundleName,
      mobileTabId: mobileTabId,
      relationMainTab: '',
      mobileTabs: mobileTabs.mobileTabs,
      trigger: mobileTabs.triggerMap || {},
      selfKey: onKey,
      isJumpTag: options.jumpTag ? true : false,
      isFrames: true, //是不是初始界面，如果是初始界面，新增按钮需要去除全局变量BusinessID
    };
    //判断是否从其他菜单中跳转过来的
    if (options.jumpTag) {
      tabInfo.jumpTag = Number(options.jumpTag);
      const jumpInBundleParam = this.jumpInBundleParam[tabInfo.bundleId] || {};
      tabInfo.bundleParams = jumpInBundleParam.bundleParams; //菜单参数
    }

    this.tabInfo = tabInfo;
    if (isNew || JSON.stringify(mobileTabs) === '{}') {
      //重新获取bundle
      this.configLoading = true;
      homeApi
        .getPage(this, {
          bundleId: tabInfo.bundleId,
        })
        .then((value) => {
          const { mainTabID, mobileTabs } = value;
          this.tabInfo.mobileTabId = mainTabID;
          this.tabInfo.mobileTabs = mobileTabs;
          this.configLoading = false;
          this.setPageInfo(mobileTabs, mainTabID);
          //将bundle版本存入bundleVersion缓存种，版本号以用户设计组和bundleId作为key
          if (isNew) {
            //加载过后设置isNew为false
            this.SET_NEW_BUNDLE({ bundle: this.bundleId, isNew: false });
            let bundleVersions = uni.getStorageSync('bundleVersion') || {},
              key = this.userDesigner + '_' + this.bundleId;
            bundleVersions[key] = bundleV;
            uni.setStorageSync('bundleVersion', bundleVersions);
          }
        });
    } else {
      this.setPageInfo(mobileTabs.mobileTabs, mobileTabId);
    }

    //设置监听
    const _this = this;
    bus.$on(onKey, (params) => {
      //reload
      this.$refs.List.getListData('reload');
    });
  },
  onShow() {
    let reloadPages = this.pageRealod.pages,
      { selfKey, isJumpTag } = this.tabInfo;
    //需要重新刷新界面
    if (reloadPages[selfKey] && reloadPages[selfKey].type)
      this.$refs.List.getListData('reload');
    if (!isJumpTag) {
      //如果不是从其他面板跳过来的
      this.SET_COM_PAGERELOAD({ pageUid: 'first', type: false }); //清空面板跳转路径
      this.SET_COM_PAGERELOAD({ pageUid: selfKey, type: false }); //设置路径
    }
  },
  onPullDownRefresh() {
    //重新加载
    this.$refs.List.getListData('load');
  },
  onReachBottom() {
    // 上拉加载
    this.$refs.List.getListData('loadnext');
  },
};
</script>
