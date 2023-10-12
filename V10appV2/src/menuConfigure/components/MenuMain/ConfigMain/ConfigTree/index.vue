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
        :canShowSwitch="
          canShowSwitchType.indexOf(htmlConfig.selShowType) !== -1
        "
        :showType="2"
        :showDownSelect="false"
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
        v-if="listData.length > 0"
        :elements="elementList"
        :list="listData"
        :linkSymbol="funcConfig.linkSymbol"
        :canShowMainIcon="funcConfig.hasCardIcon || funcConfig.hasTreeIcon"
        :isDictIcon="isDictIcon"
        :icon="treeIcon"
        :checkFlagId="checkFlagId"
        :checkList.sync="checkList"
        :canDesign="canDesign"
        :isMultiTree="isMultiTree"
        :multiDataSource="funcConfig.multiDataSource"
        @click="clickNode"
      ></tree-item>

      <nodata v-else-if="!isLoading && listData.length === 0"></nodata>
    </scroll-view>
  </view>
</template>

<script>
import { getListData, getListPage, listMultiTree, pageMultiTree } from '@/api/menuConfig.js';
import { Encrypt } from '@/utils';
import nodata from '../../Nodata';
import SearchCondition from '../SearchCondition';

import TreeItem from './TreeItem';
import TreePath from './TreePath';

import treeMixin from './treeMixin';
import compMixin from '../compMixin';
import listTreeMixin from '../listTreeMixin';

export default {
  components: { TreeItem, TreePath, SearchCondition, nodata },

  inject: ['sysMenuDesignId', 'getPanel', 'getAllForm', 'getMenuFlag'],

  mixins: [compMixin, listTreeMixin, treeMixin],

  props: {
    popTitle: {
      type: String,
      default: '添加'
    }
  },

  data() {
    return {
      totalPage: -1,
      checkList: [], // 选中的节点
      dataType: 1 // 用于多表树
    };
  },

  computed: {
    // 是否未多表树
    isMultiTree() {
      // 如果是多表树
      const { compName } = this.funcConfig;
      if (compName === 'MultiTree') return true;
      return false;
    },
    getNewConfigData() {
      return function (data, checkList = []) {
        const { configData } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find(
          (item) => item.compName === 'TreeMain' && item.compId === this.funcConfig.compId
        );
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
    // 获取多表树查询条件
    getColumnStr() {
      // 如果不是多表树
      if (!this.isMultiTree) return {};

      const { elementList } = this;
      const { multiDataSource } = this.funcConfig;
      const obj = {};

      multiDataSource.forEach((table, index) => {
        let str = '';
        elementList.forEach((item) => {
          if (
            item.dataSource.alias &&
            item.dataSource.columnName !== 'dataType' &&
            item.dataSource.columnName !== 'id'
          ) {
            if (item.dataSource.alias === table.tableInfo.nameAlias) {
              str += `${table.tableInfo.tableName}.${item.dataSource.columnName} ${item.compId},`;
            } else {
              str += `'' ${item.compId},`;
            }
          } else if (item.dataSource.columnName === 'dataType') {
            str += `'${index + 1}' dataType,`;
          } else {
            str += `${table.tableInfo.tableName}.${item.dataSource.columnName} ${item.compId},`;
          }
        });
        obj[table.tableInfo.nameAlias] = str;
      });

      const objKeyArry = Object.keys(obj);

      if (objKeyArry.length) {
        multiDataSource.forEach((table) => {
          objKeyArry.forEach((key) => {
            if (key === table.tableInfo.nameAlias) {
              if (table.selfLevelColumn.columnName) {
                obj[
                  key
                ] += `${table.tableInfo.tableName}.${table.selfLevelColumn.columnName} ${table.selfLevelColumn.columnName},`;
              }

              if (table.lastLevelColumn.columnName) {
                obj[
                  key
                ] += `${table.tableInfo.tableName}.${table.lastLevelColumn.columnName} ${table.lastLevelColumn.columnName},`;
              }
            } else {
              if (table.selfLevelColumn.columnName) {
                obj[key] += `'' ${table.selfLevelColumn.columnName},`;
              }

              if (table.lastLevelColumn.columnName) {
                obj[key] += `'' ${table.lastLevelColumn.columnName},`;
              }
            }
          });
        });

        objKeyArry.forEach((key) => {
          const arr = obj[key].split(',');
          const tempObj = {};
          arr.forEach((item) => {
            if (item) {
              const tempArr = item.split(' ');
              if (Object.hasOwnProperty.call(tempObj, tempArr[1])) {
                if (tempArr[0] !== "''") {
                  [tempObj[tempArr[1]]] = tempArr;
                }
              } else {
                [tempObj[tempArr[1]]] = tempArr;
              }
            }
          });
          let str = '';
          Object.keys(tempObj).forEach((tempKey) => {
            str += `${tempObj[tempKey]} ${tempKey},`;
          });
          obj[key] = str;
        });
      }

      return obj;
    }
  },

  methods: {
    getTableName(alias) {
      const { compName, tableInfo, multiDataSource } = this.funcConfig;
      if (compName === 'TreeMain') {
        // 如果是单表树
        return tableInfo.tableName;
      }
      // 多表树
      const index = multiDataSource.findIndex((item) => item.tableInfo.nameAlias === alias);
      if (index !== -1) {
        return multiDataSource[index].tableInfo.tableName;
      }
      return '';
    },
    // 下拉加载
    scrolltolower() {
      if (this.isThisLevel !== 3) return;
      const { current, totalPage } = this;
      if (current <= totalPage) this.getData('loadnext');
    },
    // 便捷搜索
    search(e) {
      if (!e || JSON.stringify(e) === '{}') {
        // 搜索条件为空时，掉最初接口
        this.isThisLevel = 1;
        this.searchInfo = null;
        this.currentNodeId = null;
      } else {
        this.isThisLevel = 3;
        this.searchInfo = { ...e };
      }
      // 如果是多表树
      if (this.isMultiTree) this.dataType = 1;
      this.rootPath = [];
      this.treeNodes = {};
      this.getData();
    },
    // 单表树查询
    async getSingleTree(loadType, params) {
      this.isLoading = true;
      try {
        const { funcConfig, currentNodeId } = this;
        const { compId, tableInfo } = funcConfig;

        const nodeId = currentNodeId || 1;

        params = {
          menuId: this.getMenuFlag(),
          compId,
          dataSource: tableInfo.tableName,
          isThisLevel: this.isThisLevel,
          nodeId,
          ...params
        };

        let list = null;
        if (this.isThisLevel === 3) {
          // 搜索
          const result = await getListPage(params);

          if (loadType === 'loadnext') {
            list = this.listData.concat(result.records);
          } else {
            this.totalPage = Math.ceil(result.total / params.size);
            list = result.records;
          }
        } else {
          list = await getListData(params);
        }

        this.listData = [...list];
        // 处理树路径对应的数据
        if (this.rootPath.length === 0) this.treeNodes['首页'] = [...list];
        else this.treeNodes[`${nodeId}_${this.isThisLevel}`] = [...list];
      } catch (e) {
        console.error(e);
        this.$apiot.confirm({
          title: this.$t('common.warning'),
          content: e.message
        });
      } finally {
        this.isLoading = false;
      }
    },
    // 多表树查询
    async getMultiTree(loadType, params, flag) {
      this.isLoading = true;
      const { funcConfig, currentNodeId, isThisLevel } = this;
      let nodeId = currentNodeId;
      if (isThisLevel !== 3) {
        if (!nodeId) {
          nodeId = funcConfig.multiDataSource[0].selfLevelColumn.start;
        }
        params.nodeId = nodeId;
      }

      params = {
        dataType: this.dataType,
        multiDataSource: JSON.stringify(funcConfig.multiDataSource),
        selectColumn: JSON.stringify(this.getColumnStr),
        ...params
      };

      const panelFilter = this.getFilterParams() || '';
      if (panelFilter) {
        this.replaceTerm(params, panelFilter, flag);
      }

      try {
        let list = null;
        if (this.isThisLevel === 3) {
          const result = await pageMultiTree(params);

          if (loadType === 'loadnext') {
            list = this.listData.concat(result.records);
          } else {
            this.totalPage = Math.ceil(result.total / params.size);
            list = result.records;
          }
        } else {
          list = await listMultiTree(params);
        }

        this.listData = [...list];
        // 处理树路径对应的数据
        if (this.rootPath.length === 0) this.treeNodes['首页'] = [...list];
        else this.treeNodes[`${nodeId}_${this.isThisLevel}_${this.dataType}`] = [...list];
      } catch (error) {
        this.$apiot.confirm({
          title: this.$t('common.warning'),
          content: error.message
        });
      } finally {
        this.isLoading = false;
      }
    },
    getData(loadType = 'load') {
      // 如果是预览界面，默认不请求接口
      if (this.htmlConfig.isPreview) {
        this.listData = [];
        return;
      }
      const { isPanel, isJump, parentCompId, parentSysMenuDesignId } = this.htmlConfig;
      const { needPermissions = false } = this.funcConfig;

      const params = {
        dataPermissions: needPermissions,
        sysMenuDesignId: this.sysMenuDesignId(),
        compMap: JSON.stringify(this.getCompMap() || {})
      };

      if (isPanel) {
        params.panelCompId = parentCompId;
        params.relationMenuDesignId = parentSysMenuDesignId;
        // params.panelFilter = this.getFilterParams() || [];
      }

      // 如果是跳转菜单
      // if (isJump === '1') {
      //   params.panelFilter = this.getFilterParams() || [];
      // }

      // 树搜索需要分页
      if (this.isThisLevel === 3) {
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

        // 树搜索条件整理
        const { searchInfo, isMultiTree } = this;
        if (searchInfo) {
          const searchObj = {};
          if (isMultiTree) {
            // 如果是多表树
            searchInfo.columnsInfo.forEach((item) => {
              const arr = item.name.split('.');
              const alias = arr[0];
              const tableName = this.getTableName(alias);
              if (!searchObj[alias]) {
                searchObj[alias] = '';
              }
              if (item.value) {
                searchObj[alias] += `${tableName}.${arr[1]} = '${
                  item.value || searchInfo.searchValue
                }' or `;
              } else {
                searchObj[alias] += `${tableName}.${arr[1]} like '%${searchInfo.searchValue}%' or `;
              }
            });
            Object.keys(searchObj).forEach((key) => {
              const _V = `(${searchObj[key].slice(0, -4)})`;
              searchObj[key] = Encrypt(_V);
            });
            params.searchInfo = JSON.stringify(searchObj);
          } else params.searchInfo = searchInfo;
        }
      }

      let flag = false;
      if (loadType === 'loadnext') flag = true;

      if (this.isMultiTree) this.getMultiTree(loadType, params, flag);
      else this.getSingleTree(loadType, params);
    },
    clickNode(node, nodeName) {
      const { getCheckFlagComp } = this;
      if (getCheckFlagComp) {
        const { compId } = getCheckFlagComp;
        const nodeId = node[compId];
        this.currentNodeId = nodeId;
        if (this.rootPath.length === 0) this.rootPath.push({ nodeName: '首页' });
        this.isThisLevel = 2;

        // 如果是多表树
        if (this.isMultiTree) {
          this.rootPath.push({ nodeName, nodeId, dataType: node.dataType });
          this.dataType = node.dataType;
        } else {
          this.rootPath.push({ nodeName, nodeId });
        }

        this.getData();
      }
    },
    // 点击路径
    clickPath(node) {
      const { nodeId, nodeName } = node;
      if (nodeName === '首页') {
        this.rootPath = [];
        this.listData = this.treeNodes['首页'];
      } else {
        let key = `${nodeId}_${this.isThisLevel}`;

        if (this.isMultiTree) {
          this.dataType = node.dataType;
          key += `_${this.dataType}`;
        }
        this.listData = this.treeNodes[key];
      }
    }
  },

  mounted() {},

  created() {
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
    color: #333333;
    @include fontBlob(500);
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  }
}
</style>
