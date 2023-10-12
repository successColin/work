<template name="BRATemplate">
  <!-- 带选择按钮 -->
  <view class="BRATemplate">
    <m-back-bar>
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight">
        <top-btns-coms
          :tabInfo="tabInfo"
          :btnBasicInfo="btnBasicInfo"
        ></top-btns-coms>
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
    <view class="BRATemplate-btns">
      <view class="bottomBtnsComs">
        <m-button
          class="btn-item"
          btnClass="mainColor"
          :btnTilte="$t('basic-confirm')"
          key="sureBottomBtn"
          @elementClick="handleSure"
        ></m-button>
      </view>
    </view>
    <!-- <m-Loading></m-Loading> -->
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { formApi } from '@/common/request/api.js';
import { mapState, mapMutations } from 'vuex';
import ClassList from '@/static/js/ClassList.js';

import mInputSearch from '@/components/element/m-inputSearch.vue';
import topBtnsComs from '@/pageComs/topBtnsComs.vue';
import bottomBtnsComs from '@/pageComs/bottomBtnsComs.vue';
import ListCom from '@/components/makeup/list/ListCom.vue';

let listTem = new ClassList(),
  mobileTabs = '';
export default {
  components: { topBtnsComs, bottomBtnsComs, mInputSearch, ListCom },
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
      btnBasicInfo: {
        normalEvent: ['normalBtn', 'addBtn', 'relationAddBtn'],
        delEvent: ['delBtn'],
      },
    };
  },
  computed: {
    ...mapState(['bundleName', 'bundleId', 'BusinessID']),
    ...mapState('common', [
      'templateParams',
      'tabsElements',
      'tabsFormDatas',
      'pageRealod',
    ]), //面板参数
    templateType() {
      return 'list';
    },
  },
  watch: {
    searchParams(newValue, oldValue) {
      this.$refs.list.searchParams = newValue;
    },
  },
  methods: {
    ...mapMutations(['SET_bundle', 'SET_BusinessID', 'SET_ORIGIN']),
    ...mapMutations('list', ['SET_LIST_REFRESH']),
    ...mapMutations('form', ['SET_ALLBTNS']),
    ...mapMutations('home', ['SET_NEW_BUNDLE']),
    ...mapMutations('common', [
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
    handleSure() {
      if (
        !this.tabInfo.relationTableName ||
        !this.tabInfo.mainnColumn ||
        !this.tabInfo.relationColumn ||
        !this.BusinessID
      )
        return;
      const relations = [],
        _this = this;
      let baseConfig = {
        static_tableName: this.tabInfo.relationTableName,
      };
      baseConfig[this.tabInfo.mainnColumn] = this.BusinessID; //业务表字段默认等于主业务id

      let checkIds = this.$refs.List.checkIds;
      checkIds.map((item) => {
        baseConfig[this.tabInfo.relationColumn] = item;
        relations.push({ ...baseConfig });
      });
      if (relations.length > 0) {
        formApi
          .batchInsert(this, {
            static_list: relations,
          })
          .then((result) => {
            bus.$emit(_this.tabInfo.parentKey);
          });
      }
      uni.navigateBack();
    },
    clickList(params) {
      //点击列表
      params = { ...this.tabInfo, ...params };
      params.isMain = false;
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
    setPageInfo(mobileTabsBYRelation, mobileTabId, mobileTab) {
      //根据relationTab取具体面板信息
      const _this = this,
        mobileTabRelationTab =
          mobileTab[mobileTabsBYRelation.mobileTabRelationTabId] || {};

      //设置返回栏标题
      this.barTitle = mobileTabsBYRelation.mobileTabName || this.bundleName;

      //设置列表参数
      const queryParams = listTem.advancedParams(this, {
        advancedQuery: mobileTabsBYRelation.advancedQuery || {}, //过滤条件中需要转化的变量
        advancedSqlQuery: mobileTabsBYRelation.advancedSqlQuery || [], //sql中的变量
        relationMainTab: this.tabInfo.relationMainTab,
      }); //获取过滤条件中的变量
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
        multiple: true,
        hasCheck: true,
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
      listConfig.url = 'currencyGetListData';
      this.listConfig = listConfig;

      //延迟显示列表
      setTimeout(() => {
        if (
          mobileTabsBYRelation.mobileTabSource &&
          mobileTabsBYRelation.elements.length > 0
        ) {
          this.isShow = true;
        }
      }, 100);
      //设置搜索控件参数
      this.quickQuery = mobileTabsBYRelation.quickQuery || {};

      this.SET_ADVAN_FILTERS({
        //设置高级筛选控件
        tabId: mobileTabId,
        params: mobileTabsBYRelation.elements,
      });
      this.SET_ADV_FORMDATAS({
        //清空高级筛选条件值
        tabId: mobileTabId + '_filter',
        value: {},
      });

      this.SET_ALLBTNS({
        //设置按钮
        tabId: mobileTabId,
        bottomBtns: mobileTabsBYRelation.btnList.bottomBtn,
        topRightBtns: mobileTabsBYRelation.btnList.topRightBtn,
      });
      this.SET_TABS_ELEMENT({
        //设置面板控件
        tabId: mobileTabId,
        elements: mobileTabsBYRelation.elements,
      });
    },
  },
  onLoad(options) {
    this.TOAST_REQUESTURLS({ type: 'clear' }); //清空请求地址
    this.SET_ORIGIN(true); //设置按钮栏显示
    const currentTabId = options.relationTab; //当前面板的id

    //当前面板id不存在，不进行面板布局 todo 进入报错界面
    if (!currentTabId) return;
    const currentTemParams = this.templateParams[currentTabId] || {}; //获取当前面板参数

    //判断是否有mobileTabs
    const bundleInfo = uni.getStorageSync(currentTemParams.bundleId) || {};
    const mobileTabs = bundleInfo.mobileTabs || {},
      mobileTabsBYRelation = mobileTabs[currentTabId] || {};
    //定义面板信息
    let tabInfo = {
      _uid: this._uid,
      templateType: 'list',
      bundleId: currentTemParams.bundleId,
      bundleName: currentTemParams.bundleName,
      mobileTabId: Number(currentTabId),
      relationMainTab: currentTemParams.relationMainTab || '',
      mobileTabs: mobileTabs,
      trigger: bundleInfo.triggerMap || {},
      parentKey: currentTemParams.onkey || '',
      selfKey: `listReload${this._uid}`,
      relationTableName: currentTemParams.relationTableName,
      relationColumn: currentTemParams.relationColumn,
      mainnColumn: currentTemParams.mainnColumn,
    };
    this.tabInfo = tabInfo;
    this.setPageInfo(mobileTabsBYRelation, tabInfo.mobileTabId, mobileTabs);
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
