<!--
 * @Author: sss
 * @Date: 2022-02-22 08:47:39
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-22 08:47:39
 * @Desc: 树
-->
<template>
  <view class="configTree">
    <u-sticky :customNavHeight="41" :disabled="htmlConfig.isSelectDataBox">
      <search-condition
        v-if="hasSearch"
        :funcConfig="funcConfig"
        :featureArr="featureArr"
        :canShowSwitch="htmlConfig.selShowType === 3"
        :showType="2"
        @search="search"
        @switchType="switchType"
      ></search-condition>
    </u-sticky>
    <tree-path :rootPath.sync="rootPath" @click="clickPath"></tree-path>
    <scroll-view
      :style="{ height: `${treeHeight}px` }"
      scroll-y
      lower-threshold="100"
      @scrolltolower="scrolltolower"
    >
      <tree-item
        :elements="elementList"
        :list="listData"
        :linkSymbol="funcConfig.linkSymbol"
        :canShowMainIcon="funcConfig.hasCardIcon || funcConfig.hasTreeIcon"
        :isDictIcon="isDictIcon"
        :icon="treeIcon"
        :checkFlagId="checkFlagId"
        :checkList.sync="checkList"
        :canDesign="canDesign"
        @checkedCard="checkedCard"
        @click="clickNode"
      ></tree-item>
    </scroll-view>
  </view>
</template>

<script>
import { getListData, getListPage } from '@/api/menuConfig.js';
import TreePath from './TreeComps/TreePath.vue';
import TreeItem from './TreeItem';
import SearchCondition from '../Common/SearchCondition';
import compMixin from '../compMixin';
import listTreeMixin from '../listTreeMixin';
import treeMixin from '../treeMixin';

export default {
  components: { TreeItem, TreePath, SearchCondition },

  inject: ['sysMenuDesignId', 'getPanel', 'getAllForm'],

  mixins: [compMixin, listTreeMixin, treeMixin],

  props: {
    popTitle: {
      type: String,
      default: '添加'
    },
    checkFlagId: String
  },

  data() {
    return {
      totalPage: -1,
      checkList: [] // 选中的节点
    };
  },

  computed: {
    getNewConfigData() {
      return function (data, checkList = []) {
        const { configData } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find((item) => item.compName === 'TreeMain');
        const currentFunc = currentMain.children.find((item) => item.areaType === 1);
        if (data) currentFunc.form = data;
        if (newConfig.checkList) newConfig.checkList[currentMain.compId] = checkList;
        else {
          const obj = {};
          obj[currentMain.compId] = checkList;
          newConfig.checkList = obj;
        }

        return newConfig;
      };
    },
    getLastViewID() {
      return `path_${this.rootPath.length}`;
    },
    // 是否为字典图标
    isDictIcon() {
      return this.funcConfig.hasCardIcon;
    },
    treeIcon() {
      const { isDictIcon } = this;
      const { treeIcon, iconId, iconColorId } = this.funcConfig;
      if (isDictIcon) return { icon: iconId, color: iconColorId };
      return treeIcon;
    },
    getIdCompId() {
      const index = this.elementList.findIndex((comp) => comp.dataSource.columnName === 'id');
      if (index !== -1) {
        return this.elementList[index].compId;
      }
      return '';
    }
  },

  methods: {
    // 下拉加载
    scrolltolower() {
      if (this.isThisLevel !== 3) return;
      const { current, totalPage } = this;
      if (current <= totalPage) this.getData('loadnext');
    },
    // 便捷搜索
    search(e) {
      if (e) {
        this.isThisLevel = 3;
        this.searchInfo = { ...e };
      } else {
        this.isThisLevel = 1;
        this.searchInfo = null;
        this.currentNodeId = null;
      }
      this.rootPath = [];
      this.treeNodes = {};
      this.getData();
    },
    // 点击路径
    clickPath(node) {
      const { nodeId, nodeName } = node;
      if (nodeName === '首页') {
        this.rootPath = [];
        this.listData = this.treeNodes['首页'];
      } else this.listData = this.treeNodes[`${nodeId}_${this.isThisLevel}`];
    },
    // 选择数据
    checkedCard() {},
    async getData(loadType = 'load') {
      this.isLoading = true;
      try {
        const { funcConfig, currentNodeId } = this;
        const { compId, tableInfo } = funcConfig;
        const { isPanel, isJump, parentCompId, parentSysMenuDesignId } = this.htmlConfig;
        const nodeId = currentNodeId || 1;
        const params = {
          compId,
          sysMenuDesignId: this.sysMenuDesignId(),
          compMap: JSON.stringify(this.getFilterParams() || {}),
          dataSource: tableInfo.tableName,
          isThisLevel: this.isThisLevel,
          nodeId
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

        let list = null;
        if (this.isThisLevel === 3) {
          // 树搜索需要分页
          if (this.searchInfo) params.searchInfo = this.searchInfo;
          // 分页
          let page = this.current;
          let pageSize = 20;
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
        // 处理树路径对应的数据
        if (this.rootPath.length === 0) this.treeNodes['首页'] = [...list];
        else this.treeNodes[`${nodeId}_${this.isThisLevel}`] = [...list];

        this.isLoading = false;
      } catch (e) {
        console.error(e);
        this.isLoading = false;
        this.$apiot.confirm({
          title: this.$t('common.warning'),
          content: e.message
        });
      }
    },
    clickNode(node, nodeName) {
      if (this.getIdCompId) {
        const nodeId = node[this.getIdCompId];
        this.currentNodeId = nodeId;
        if (this.rootPath.length === 0) this.rootPath.push({ nodeName: '首页' });
        this.rootPath.push({ nodeName, nodeId });
        this.isThisLevel = 2;

        this.getData();
      }
    }
  },

  mounted() {},

  created() {
    const { alreadyCheckList } = this;
    if (this.canDesign && alreadyCheckList.length > 0) {
      this.checkList = alreadyCheckList.map((item) => {
        const obj = {};
        this.elementList.forEach((el) => {
          obj[el.compId] = item[el.dataSource.columnName];
        });
        return obj;
      });
    }
    this.getData();
  }
};
</script>

<style lang='scss' scoped>
.configTree {
  background: #ffffff;
  // padding: 0 30rpx;
  &--selectMsg {
    padding: 0 30rpx;
    height: 80rpx;
    line-height: 80rpx;
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #333333;
    font-weight: 550;
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  }
}
</style>
