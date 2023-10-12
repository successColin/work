<!--
 * @Author: sss
 * @Date: 2021-12-08 15:27:11
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-08 15:27:11
 * @Desc: 配置列表
-->
<template>
  <view class="listConfig">
    <search-condition
      v-if="hasSearch"
      :placeholder="searchComp && searchComp.placeholder"
      :funcConfig="funcConfig"
      :featureArr="featureArr"
      :canShowSwitch="canShowSwitchType.indexOf(htmlConfig.selShowType) !== -1"
      :showType="1"
      :enableScan="searchComp && searchComp.enableScan"
      :convenientComp="convenientComp"
      @search="search"
      @filter="search"
      @headerSearch="headerSearch"
      @switchType="switchType"
    >
    </search-condition>
    <template v-if="funcConfig.pageType === 2 && functionBtns.length > 0">
      <config-btns
        ref="btns"
        :tabId="tabId"
        :htmlConfig="htmlConfig"
        :funcConfig="funcConfig"
        :featureArr="featureArr"
        @setBatchArea="setBatchArea"
        @checkedAllClick="checkedAll"
      ></config-btns>
    </template>
    <view
      v-show="computedHeight > 0"
      :style="{ height: `${computedHeight}px` }"
    >
      <template v-if="htmlConfig.isPreview">
        <view class="listConfig__item">
          <view class="listConfig__item__card">
            <list-card
              v-if="elementList.length"
              :functionArea="functionArea"
              :elements="elementList"
              :isLoading="isLoading"
              :showSkeleton="showSkeleton"
              :isPreview="true"
              :carConfig="funcConfig"
              :hasCardIcon="funcConfig.hasCardIcon"
              :icon="{
                icon: funcConfig.iconId,
                color: funcConfig.iconColorId,
              }"
              :index="index"
              :checkList.sync="checkList"
              :checkFlagId="checkFlagId"
              :canDesign="canDesign"
              @checkedCard="checkedCard"
              @clickCard="clickCard"
            ></list-card>
          </view>
        </view>
      </template>
      <template v-else>
        <u-list
          v-if="listData.length > 0"
          @scrolltolower="scrolltolower"
          ref="card"
          :height="computedHeight"
          :preLoadScreen="3"
          :pagingEnabled="true"
        >
          <u-list-item
            v-for="(item, index) in listData"
            :key="index"
            :anchor="item[getCheckFlagComp.compId]"
            :timeout="htmlConfig.isSelectDataBox ? 300 : 0"
          >
            <view class="listConfig__item">
              <view class="listConfig__item__card">
                <list-card
                  v-if="elementList.length"
                  :functionArea="functionArea"
                  :elements="elementList"
                  :isLoading="isLoading"
                  :showSkeleton="showSkeleton"
                  :value="item | valueFormat(panelDataTransValue)"
                  :carConfig="funcConfig"
                  :hasCardIcon="funcConfig.hasCardIcon"
                  :icon="{
                    icon: funcConfig.iconId,
                    color: funcConfig.iconColorId,
                  }"
                  :index="index"
                  :checkList.sync="checkList"
                  :checkFlagId="checkFlagId"
                  :canDesign="canDesign"
                  @checkedCard="checkedCard"
                  @clickCard="clickCard"
                ></list-card>
              </view>
              <!--  -->
            </view>
          </u-list-item>
          <apiot-toast
            :status="loadMoreInfo"
            @clickLoadMore="clickLoadMore"
          ></apiot-toast>
        </u-list>
        <nodata
          v-else-if="
            !isLoading && listData.length === 0 && !htmlConfig.isPreview
          "
        ></nodata>
      </template>
    </view>
    <template v-if="funcConfig.pageType === 3 && functionBtns.length > 0">
      <config-btns
        :tabId="tabId"
        :htmlConfig="htmlConfig"
        :funcConfig="funcConfig"
        :featureArr="featureArr"
        @setBatchArea="setBatchArea"
        @checkedAllClick="checkedAll"
      ></config-btns>
    </template>
  </view>
</template>

<script>
import { getListData, getListPage } from '@/api/menuConfig.js';
import nodata from '../../Nodata';
import SearchCondition from '../SearchCondition';
import ConfigBtns from '../ConfigBtns';

import ListCard from './ListCard';

import compMixin from '../compMixin';
import listTreeMixin from '../listTreeMixin';
import gotoOtherPage from '../gotoOtherPage';

export default {
  components: { ListCard, ConfigBtns, nodata, SearchCondition },

  mixins: [compMixin, listTreeMixin, gotoOtherPage],

  inject: [
    'sysMenuDesignId',
    'getPanel',
    'getAllForm',
    'getMenuFlag',
    'onlyFlag',
    'getLoadStatue',
    'resolveFormula'
  ],

  provide() {
    return {
      parentConfig: this.funcConfig,
      panelConfig: this.htmlConfig
    };
  },

  props: {
    title: String,
    isProcessNode: Boolean
  },

  data() {
    return {
      // 是否显示鱼骨架
      showSkeleton: true,
      skeletonNum: 10,
      // 导航栏高度
      customNavHeight: 0,
      // 数据加载中
      isLoading: false,
      loadingContentText: {
        contentdown: '上拉显示更多',
        contentrefresh: '正在加载...',
        contentnomore: '没有更多数据了1'
      },
      current: 1,
      totalPage: -1,
      listData: [],
      currentData: {},
      checkList: []
    };
  },

  computed: {
    // 数据传递参数
    panelDataTransValue() {
      const { sourceFlagId } = this.htmlConfig;
      return this.$store.state.menu.panelDataTrans[sourceFlagId] || {};
    },
    // 卡片显示的按钮
    cardBtnArea() {
      const { children: elements } = this.functionArea;
      const [btnEle] = elements;
      if (btnEle.compName === 'BtnsArea') {
        return btnEle;
      }
      return null;
    },

    loadMoreInfo() {
      if (this.isLoading) return '';
      if (!this.funcConfig.hasPagination) return 'no-more';
      if (this.current === this.totalPage) return 'no-more';
      return 'more';
    },

    getNewConfigData() {
      return function(data, checkList = []) {
        const { configData } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find(
          (item) => item.compName === 'CardMain' && item.compId === this.funcConfig.compId
        );
        const currentFunc = currentMain.children.find((item) => item.areaType === 1);
        if (data) currentFunc.form = data;
        if (newConfig.checkList) {
          newConfig.checkList[currentMain.compId] = checkList;
        } else {
          const obj = {};
          obj[currentMain.compId] = checkList;
          newConfig.checkList = obj;
        }

        return newConfig;
      };
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      return this.systemInfo.customBar;
    }
  },

  watch: {
    searchInfo() {
      // 搜索条件变化，需要掉接口
      this.getData();
    }
  },

  methods: {
    // 便捷搜索
    search(e) {
      this.searchInfo = { searchInfo: e };
    },
    headerSearch(e) {
      this.searchInfo = { headerSearch: e };
    },
    // 选择数据
    checkedAll(isChecked) {
      if (isChecked) this.checkList = [...this.listData];
      else this.checkList = [];
    },
    // 重置选择的列表
    resetCheck(data = []) {
      this.checkList = data;
    },
    // 记录目前正处于批量操作的功能区
    setBatchArea(compId, type) {
      if (type === 'cancel') {
        this.checkList = [];
      }
      this.$emit('setBatchArea', compId);
    },
    clickLoadMore() {
      this.scrolltolower();
    },
    // 获取搜索参数
    getSearchParams(searchComps, isKeySearch, keyword, searchValue = {}) {
      const { allComp } = this;
      const columnsInfo = [];
      const column = {
        lambda: 'in', // 是否包含关系
        dict: 2, // 是否为字典
        value: '',
        compId: '',
        name: ''
      };
      searchComps.forEach((comp) => {
        const compMap = allComp[comp.value];
        if (!compMap) return;
        let value = '';
        if (!isKeySearch) value = searchValue[compMap.compId] || '';
        // 如果是字典项并且为便捷搜索
        if (compMap.enableDict && isKeySearch) {
          const key = compMap.dataSource.dictObj.dictKey;
          const dicArray = this.$store.getters.getCurDict(key) || [];
          dicArray.forEach((dic) => {
            const { name, value: dicV } = dic;
            if (name && name.indexOf(keyword) !== -1) value = value ? `${dicV}` : `,${dicV}`;
          });
        }

        const { dataSource } = compMap;
        const name = `${dataSource.tableName}.${dataSource.columnName}`;

        columnsInfo.push({ ...column, compId: compMap.compId, name, value });
      });
      return columnsInfo;
    },

    // 获取列表数据
    async getData(loadType = 'load') {
      // 如果是预览界面，默认不请求接口
      if (this.htmlConfig.isPreview) {
        this.listData = [];
        return;
      }
      this.switchLoadingArea(this.funcConfig.compId, true);
      this.isLoading = true;

      try {
        const { compId, hasPagination, rowNum, needPermissions = false } = this.funcConfig;
        const { isPanel, isJump, parentCompId, parentSysMenuDesignId } = this.htmlConfig;
        // 是否分页

        let params = {
          compId,
          sysMenuDesignId: this.sysMenuDesignId(),
          compMap: JSON.stringify(this.getCompMap() || {}),
          dataPermissions: needPermissions,
          menuId: this.getMenuFlag()
        };
        if (isPanel) {
          params.panelCompId = parentCompId;
          params.relationMenuDesignId = parentSysMenuDesignId;
          params.panelFilter = this.getFilterParams() || [];
        }

        // 如果是跳转菜单
        if (isJump === '1') {
          // const jumpMenuFilter = this.getJumpMenuFilter() || [];
          // const { panelFilter = [] } = params;
          // params.panelFilter = [...panelFilter, ...jumpMenuFilter];
          params.panelFilter = this.getFilterParams() || [];
        }

        if (this.searchInfo) params = { ...params, ...this.searchInfo };

        let list = null;
        if (hasPagination) {
          // 分页
          let page = this.current;
          let pageSize = rowNum;
          if (loadType === 'loadnext') {
            this.current += 1;
            page = this.current;
          } else if (loadType === 'reload') {
            page = 1;
            pageSize *= this.current;
          } else {
            this.current = 1;
            page = 1;
          }
          params.current = page;
          params.size = pageSize;

          const result = await getListPage(params);

          if (loadType === 'loadnext') {
            list = this.listData.concat(result.records);
          } else {
            this.totalPage = Math.ceil(result.total / pageSize);
            list = result.records;
          }
        } else {
          list = await getListData(params);
        }
        this.listData = [...list];

        this.isLoading = false;
        this.showSkeleton = false;
        this.switchLoadingArea(this.funcConfig.compId, false);
        // this.$nextTick(() => {
        //   this.switchLoadingArea(this.funcConfig.compId, false);
        // });
      } catch (e) {
        this.switchLoadingArea(this.funcConfig.compId, false);
        this.$apiot.confirm({
          title: this.$t('common.warning'),
          content: e.message
        });
      }
    },
    // 选择数据
    checkedCard(card = {}) {
      this.currentData = { ...card };
    },
    // 点击卡片
    async clickCard(card) {
      if (JSON.stringify(card) !== '{}') {
        this.currentData = { ...card };
        await this.$emit('update:configData', this.getNewConfigData(card));
      }
      const { compId, textPanelId } = this.funcConfig;
      const sourceFlagId = `${compId}_${this._uid}`;
      // 跳转面板
      const urlParams = {
        parentSysMenuDesignId: this.sysMenuDesignId(),
        menuFlag: this.getMenuFlag()
      };
      if (this.htmlConfig.isPreview) urlParams.isPreview = true;
      this.panelFormat({
        compId,
        sourceFlagId,
        textPanelId,
        urlParams,
        formData: this.getAllForm(),
        canJump: true
      });
    },
    reloadData() {
      this.getData('reload');
    },
    // 下拉加载
    scrolltolower() {
      const { hasPagination } = this.funcConfig;
      const { current, totalPage } = this;
      if (hasPagination && current < totalPage) this.getData('loadnext');
    },
    scrolltoupper() {
      this.getData('reload');
    },
    // 在其他功能块后面进行加载
    handleLoadArea(funId) {
      const { reloadArea } = this.funcConfig;
      const index = reloadArea.indexOf(funId);
      if (index === -1) return;
      const areaStatue = this.getLoadStatue();
      const noFinishArea = reloadArea.find((area) => !areaStatue[area]);
      if (!noFinishArea) this.getData();
    }
  },

  filters: {
    valueFormat(value, panelDataTransValue) {
      return { ...value, ...panelDataTransValue };
    }
  },

  mounted() {},

  created() {
    const { getCheckFlagComp, alreadyCheckList } = this;
    if (this.canDesign && getCheckFlagComp && alreadyCheckList.length > 0) {
      this.checkList = alreadyCheckList.map((item) => {
        const obj = {};
        this.elementList.forEach((el) => {
          if (el.compName !== 'BtnsArea') obj[el.compId] = item[el.dataSource.columnName];
        });
        return obj;
      });
    }
    if (this.htmlConfig.isSelectDataBox) this.$bus.$on('configCheckList', this.deleteChecked);

    // 如果该功能块需要在其他功能块加载后才能加载的化
    if (this.funcConfig.reloadArea.length === 0) this.getData();
    else {
      this.$bus.$on('reloadArea', this.handleLoadArea);
    }
  },
  beforeDestroy() {
    this.$bus.$off('reloadArea');
    if (this.htmlConfig.isSelectDataBox) this.$bus.$off('configCheckList');
  }
};
</script>

<style lang='scss' scoped>
.listConfig {
  position: relative;
  &__item {
    margin: 20rpx 30rpx 0 30rpx;
    background: #fff;
    border-radius: 12rpx;
    box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.08);
  }
}
</style>
