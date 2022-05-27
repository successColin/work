<!--
 * @Author: sss
 * @Date: 2022-02-22 08:47:39
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-22 08:47:39
 * @Desc: 设备位置树
-->
<template>
  <view class="configTree">
    <u-sticky :customNavHeight="41">
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
        :list="listData"
        :linkSymbol="funcConfig.linkSymbol"
        :checkList.sync="devicePosCheckList"
        :canDesign="canDesign"
        @click="clickNode"
      ></tree-item>
    </scroll-view>
  </view>
</template>

<script>
import { listDeviceTree, pageDeviceTree } from '@/api/menuConfig.js';
import TreePath from '../ConfigTree/TreeComps/TreePath.vue';
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
      currentNode: null, // 当前节点信息
      devicePosCheckList: [], // 设备位置树选中节点
      pageFlag: 0, // 用于搜索时，第一页数据未满pagesize
      isEnd: false, // 用于是否还需要继续分页
      isSwitchDev: false // 是否切换为设备
    };
  },

  computed: {
    // 为了兼容设备位置树接口返回的数据与配置树返回数据不一致
    checkList() {
      const { elementList, devicePosCheckList = [] } = this;
      const tempArr = [];
      devicePosCheckList.forEach((item) => {
        const obj = {};
        elementList.forEach((comp) => {
          obj[comp.compId] = item[comp.dataSource.columnName];
        });
        tempArr.push(obj);
      });
      return tempArr;
    },

    getNewConfigData() {
      return function (data, checkList = []) {
        const { configData } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find((item) => item.compName === 'DevicePosTree');
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
    }
  },

  methods: {
    // 下拉加载
    scrolltolower() {
      if (this.isThisLevel !== 3 || this.isEnd) return;
      this.getData('loadnext');
    },
    // 便捷搜索
    search(e) {
      if (e) {
        this.isThisLevel = 3;
        this.searchInfo = { ...e };
      } else {
        this.isThisLevel = 1;
        this.searchInfo = null;
      }
      this.rootPath = [];
      this.treeNodes = {};
      this.currentNode = {};
      this.pageFlag = 0;

      this.getData();
    },
    // 点击路径
    clickPath(node) {
      const { nodeId, nodeName, dataType } = node;
      if (nodeName === '首页') {
        this.rootPath = [];
        this.listData = this.treeNodes['首页'];
      } else this.listData = this.treeNodes[`${nodeId}_${dataType}`];
    },
    async getData(loadType = 'load') {
      let list = await this.getTree(loadType);
      // 如果搜索时，第一页的数据没有满20，默认再进行一次数据的请求
      if (this.isThisLevel === 3 && list.length < 20 && this.current === 1) {
        const nextList = await this.getTree('loadnext', true);
        list = list.concat(nextList);
      }
      this.listData = [...list];

      // 处理树路径对应的数据
      const { id, dataType } = this.currentNode || {};
      const parentId = id || 1;
      if (this.rootPath.length === 0) this.treeNodes['首页'] = [...list];
      else this.treeNodes[`${parentId}_${dataType}`] = [...list];

      this.isLoading = false;
    },
    async getTree(loadType = 'load', isAdditional) {
      this.isLoading = true;
      try {
        const { id, dataType } = this.currentNode || {};
        const { deviceFilter, positionFilter } = this.funcConfig;
        const { isJump } = this.htmlConfig;
        const parentId = id || 1;
        const params = {
          sysMenuDesignId: this.sysMenuDesignId(),
          parentId,
          dataType: dataType || 1,
          isThisLevel: this.isThisLevel,
          compMap: JSON.stringify(this.getAllForm())
        };

        // 如果是跳转菜单
        if (isJump === '1') {
          if (deviceFilter) params.deviceDesignRegionalTabInfoVO = deviceFilter;
          if (positionFilter) params.positionDesignRegionalTabInfoVO = positionFilter;
        }

        let list = null;
        if (this.isThisLevel === 3) {
          params.pageFlag = this.pageFlag;
          // 设备位置树搜索时，默认先搜索位置
          if (this.searchInfo) params.searchValue = this.searchInfo.searchValue;
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
            this.isSwitchDev = false;
            this.isEnd = false;
          }
          params.current = page;
          params.size = pageSize;

          const result = await pageDeviceTree(params);
          const { current: resultCurrent } = result;
          if (this.pageFlag === 0) this.pageFlag = resultCurrent;

          if (resultCurrent !== 0) this.isSwitchDev = true;

          if (this.isSwitchDev && result.records.length < 20) this.isEnd = true;

          if (loadType === 'loadnext' && !isAdditional) {
            list = this.listData.concat(result.records);
          } else {
            list = result.records;
          }
        } else {
          list = await listDeviceTree(params);
        }

        return list;
      } catch (e) {
        console.error(e);
        this.isLoading = false;
        this.$apiot.confirm({
          title: this.$t('common.warning'),
          content: e.message
        });
        return [];
      }
    },
    clickNode(node, nodeName) {
      const { dataType } = node;
      const nodeId = node.id;
      this.currentNodeId = nodeId;
      this.currentNode = node;
      if (this.rootPath.length === 0) this.rootPath.push({ nodeName: '首页', dataType });
      this.rootPath.push({ nodeName, nodeId, dataType });
      this.isThisLevel = 2;

      this.getData();
    }
    // clickNode(node, nodeName) {
    //   const { dataType } = node;
    //   const nodeId = node.id;
    //   this.currentNode = node;
    //   this.rootPath.push({ nodeName, nodeId, dataType });
    //   this.isThisLevel = 2;

    //   this.getData();
    // }
  },

  mounted() {},

  created() {
    const { alreadyCheckList } = this;
    if (this.canDesign && alreadyCheckList.length > 0) {
      this.devicePosCheckList = alreadyCheckList.map((item) => {
        const obj = {};
        this.elementList.forEach((el) => {
          obj[el.dataSource.columnName] = item[el.compId];
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
