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
      :canShowSwitch="htmlConfig.selShowType === 3"
      :showType="1"
      @search="search"
      @filter="search"
      @switchType="switchType"
    >
    </search-condition>
    <config-btns
      ref="btns"
      v-if="funcConfig.pageType === 2 && funcConfig.children.length > 1"
      :tabId="tabId"
      :htmlConfig="htmlConfig"
      :funcConfig="funcConfig"
      :featureArr="featureArr"
      @setBatchArea="setBatchArea"
      @checkedAllClick="checkedAll"
    ></config-btns>
    <view
      v-show="computedHeight > 0"
      :style="{ height: `${computedHeight}px` }"
    >
      <apiot-toast
        v-if="isLoading && listData.length === 0"
        status="loading"
        :isFull="true"
      ></apiot-toast>
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
                :value="item"
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
                @clickCard="clickCard(item)"
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

      <nodata v-else-if="!isLoading && listData.length === 0"></nodata>
    </view>

    <config-btns
      v-if="funcConfig.pageType === 3"
      :tabId="tabId"
      :htmlConfig="htmlConfig"
      :funcConfig="funcConfig"
      :featureArr="featureArr"
      @setBatchArea="setBatchArea"
      @checkedAllClick="checkedAll"
    ></config-btns>
  </view>
</template>

<script>
import { getListData, getListPage } from '@/api/menuConfig.js';
import ListCard from './ListCard';
// import CardBtn from './CardBtn';
import ConfigBtns from '../ConfigBtns';
import SearchCondition from '../Common/SearchCondition';
import nodata from '../Common/nodata.vue';
import compMixin from '../compMixin';
import listTreeMixin from '../listTreeMixin';

export default {
  components: { ListCard, ConfigBtns, nodata, SearchCondition },

  mixins: [compMixin, listTreeMixin],

  inject: [
    'sysMenuDesignId',
    'getPanel',
    'getAllForm',
    'getMenuFlag',
    'selectDataConfig',
    'onlyFlag',
    'getLoadStatue'
  ],

  provide() {
    return {
      parentConfig: this.funcConfig,
      panelConfig: this.htmlConfig
    };
  },

  props: {
    title: String,
    checkFlagId: String
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
    // 卡片显示的按钮
    cardBtnArea() {
      const { children: elements } = this.functionArea;
      const [btnEle] = elements;
      if (btnEle.compName === 'BtnsArea') {
        return btnEle;
      }
      return null;
    },
    // 是否可以编辑
    canDesign() {
      if (this.htmlConfig.isSelectDataBox) return true;
      return this.htmlConfig.currentBatchAreaCompId === this.funcConfig.compId;
    },
    loadMoreInfo() {
      if (this.isLoading) return 'loading';
      if (!this.funcConfig.hasPagination) return 'no-more';
      if (this.current === this.totalPage) return 'no-more';
      return 'more';
    },
    alreadyCheckList() {
      const selectDataConfig = this.selectDataConfig();
      return selectDataConfig.alreadyCheckList || [];
    },
    getNewConfigData() {
      return function (data, checkList = []) {
        const { configData } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find((item) => item.compName === 'CardMain');
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
    },
    // 获取选中唯一标准控件
    getCheckFlagComp() {
      const { elementList, checkFlagId } = this;
      return elementList.find((item) => item.name === checkFlagId);
    }
  },

  watch: {
    alreadyCheckList(newValue) {
      // 只有可编辑状态才可以选择
      if (!this.canDesign) return;
      const { getCheckFlagComp } = this;
      if (getCheckFlagComp && newValue.length > 0) {
        this.checkList = newValue.map((item) => {
          item[getCheckFlagComp.compId] = item[getCheckFlagComp.dataSource.columnName];
          return item;
        });
      }
    },
    checkList() {
      this.$emit('update:configData', this.getNewConfigData(this.currentData, this.checkList));
    },
    searchInfo() {
      // 搜索条件变化，需要掉接口
      this.getData();
    }
  },

  methods: {
    // 便捷搜索
    search(e) {
      this.searchInfo = { ...e };
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

    // 计算list高度
    computedlist() {
      // const { showTabBtn } = this.currentTab;
      // let height1 = 0;
      // if (showTabBtn) height1 += 44; // 有tab按钮
      // if (this.hasSearch) height1 += 44; // 有搜索框
      let height = this.menuHeight;
      uni
        .createSelectorQuery()
        .selectAll(`.compute--area-${this.onlyFlag()}`)
        .boundingClientRect((dom) => {
          // data - 各种参数
          dom.forEach((el) => {
            if (el.height) height -= el.height;
          });
        })
        .exec();
      const tiemout = setTimeout(() => {
        this.listHeight = height;
        clearTimeout(tiemout);
      }, 250);
    },
    // 获取列表数据
    async getData(loadType = 'load') {
      this.isLoading = true;

      try {
        const { compId, hasPagination, rowNum } = this.funcConfig;
        const { isPanel, isJump, parentCompId, parentSysMenuDesignId } = this.htmlConfig;
        // 是否分页

        const params = {
          compId,
          sysMenuDesignId: this.sysMenuDesignId(),
          compMap: JSON.stringify(this.getFilterParams() || {}),
          dataPermissions: false
        };

        if (isPanel) {
          params.panelCompId = parentCompId;
          params.relationMenuDesignId = parentSysMenuDesignId;
          params.panelFilter = this.getPanelFilter() || [];
        }

        // 如果是跳转菜单
        if (isJump === '1') {
          const jumpMenuFilter = this.getJumpMenuFilter() || [];
          const { panelFilter = [] } = params;
          params.panelFilter = [...panelFilter, ...jumpMenuFilter];
        }

        if (this.searchInfo) params.searchInfo = this.searchInfo;

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
            pageSize *= page;
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
      } catch (e) {
        console.error(e);
        this.isLoading = false;
        this.$apiot.confirm({
          title: this.$t('common.warning'),
          content: e.message
        });
      }
    },
    // 处理跳转面板过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        const sourceFlagId = `${this.funcConfig.compId}_${this._uid}`;
        // 处理面板过滤条件
        panelObj.panelVarObj = {};
        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] = this.getAllForm()[compId];
          });
        });
        // 不同路由用vuex进行管理
        this.$store.commit('setMenuPanelFilter', {
          sourceFlagId,
          data: { ...panelObj.panelVarObj, panelFilter: panelObj.panelFilter }
        });

        // 处理跳转面板的数据传输
        panelObj.panelDataTrans = {};
        panelObj.panelData.forEach((item) => {
          const { mainComp, paneComp } = item;
          panelObj.panelDataTrans[paneComp.compId] = this.getAllForm()[mainComp.compId];
        });
        this.$store.commit('setMenuPanelDataTrans', {
          sourceFlagId,
          data: panelObj.panelDataTrans
        });
        return panelObj;
      }
      return null;
    },
    // 选择数据
    checkedCard(card) {
      this.currentData = { ...card };
    },
    // 点击卡片
    async clickCard(card) {
      this.currentData = { ...card };
      await this.$emit('update:configData', this.getNewConfigData(card));
      const panel = this.resolveFilterVar(this.getPanel()[this.funcConfig.compId]);
      if (panel && panel.panelName) {
        uni.navigateTo({
          url: `/menuConfigure/index?id=${panel.id}&title=${
            panel.panelName
          }&isPanel=true&ejectComId=${this.funcConfig.compId}&parentCompId=${
            this.funcConfig.compId
          }&parentSysMenuDesignId=${this.sysMenuDesignId()}&sourceFlagId=${
            this.funcConfig.compId
          }_${this._uid}&menuFlag=${this.getMenuFlag()}`,
          animationType: 'slide-in-right'
        });
      }
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

    // 如果该功能块需要在其他功能块加载后才能加载的化
    if (this.funcConfig.reloadArea.length === 0) this.getData();
    else {
      this.$bus.$on('reloadArea', this.handleLoadArea);
    }
  },
  beforeDestroy() {
    this.$bus.$off('reloadArea');
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
