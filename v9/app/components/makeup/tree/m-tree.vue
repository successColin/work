<template>
  <view class="mTree">
    <block v-for="(item, index) in treeList" :key="index">
      <m-tree-item
        v-if="update"
        :key="index"
        :treeItem="item"
        :dataSource="dataSource"
        :elementMultiRelation="elementMultiRelation"
        :asyncNode="asyncNode_"
        :multiple="multiple"
        :groupDataSource="groupDataSource"
        :checkedIds="checkedIds"
        :elementId="elementId"
        :showType="showType"
        checkedColumn="id"
        openColumn="nodekey"
        :treeIcon="treeIcon"
        :treeIconConfig="treeIconConfig"
      >
      </m-tree-item>
    </block>
    <m-loading
      v-if="isLoading"
      class="animated"
      :class="[isLoading ? 'fadeIn' : 'fadeOut']"
    ></m-loading>
  </view>
</template>

<script>
import { treeApi } from '@/common/request/api.js';
import { mapState, mapMutations } from 'vuex';
import mTreeItem from '@/components/makeup/tree/m-treeItem.vue';

import bus from '@/static/js/bus';

export default {
  name: 'mTree',
  components: {
    mTreeItem,
  },
  props: {
    ancestorsIsNot: { type: Boolean, default: false }, //是否不需要事先获取节点祖先
    //显示类型 1-名称；2-名称+编码；3-编码+名称；4-编码
    showType: { type: Number, default: 1 },
    elementId: [Number, String],
    elementMultiRelation: [Number, String],
    dataSource: String,
    groupDataSource: String,
    asyncNode: {
      //是否异步，默认false
      type: Boolean,
      default: true,
    },
    multiple: {
      //是否多选
      type: Boolean,
      default: false,
    },
    alreadyCheckId: [Number, String],
    alreadyCheckedNode: {
      //已经选择的数据
      type: Array,
      default: [],
    },
    treeIcon: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      update: true,
      asyncNode_: this.asyncNode,
      showTree: false,
      treeList: [],
      selectIndex: -1,
      treeCheckNode: [],
      checkedIds: [],
      isLoading: false,
      searchParams: '', //搜索参数
      treeIconConfig: [],
    };
  },
  watch: {
    searchParams() {
      this.getTreeData();
    },
  },
  computed: {
    ...mapState('Tree', ['ancestors']),
  },
  methods: {
    ...mapMutations('Tree', ['SETA_TREE_ANCESTORS']),
    changeCheckNodes(param) {
      //改变树选中数据
      this.checkedIds = param.checkedIds;
      this.treeCheckNode = param.treeCheckNode;
    },
    doSearch(params) {
      //搜索
      if (params && JSON.stringify(params) != '{}') {
        //一旦有搜索条件就转同步
        this.asyncNode_ = false;
      } else {
        this.asyncNode_ = true;
      }
      this.searchParams = params;
    },
    getNodeAncestors() {
      //获取祖先节点
      const checkedIds = this.checkedIds.join(','),
        elementMultiRelation = Number(this.elementMultiRelation),
        _this = this;
      if (!checkedIds || this.ancestorsIsNot) return;
      //id-值（只支持单选）dataSource-实体表 elementId-控件id
      let param = { id: checkedIds, dataSource: this.dataSource };
      if (elementMultiRelation === 1) param.elementId = this.elementId; //如果是多级实体传控件id
      treeApi.currencyGetRootNodes(this, param).then((value) => {
        value = value || {};
        const ancestors = value.data || [];
        if (ancestors.length > 1)
          _this.SETA_TREE_ANCESTORS(ancestors.slice(0, -1)); //设置该节点的祖先节点
      });
    },
    getTreeData() {
      const _this = this;
      this.isLoading = true;
      let elementMultiRelation = Number(this.elementMultiRelation);
      let params = {
        group: 1,
        id: 0,
        elementMultiRelation: elementMultiRelation,
      };
      if (elementMultiRelation != 1) {
        params.dataSource = this.dataSource;
      } else {
        params.type = '';
        params.elementId = this.elementId;
      }
      params.treeIcon = this.treeIcon;
      this.update = false;
      if (this.treeIcon) {
        treeApi
          .currencyGetTreeIconAll(this, { ids: this.treeIcon })
          .then((res) => {
            const treeIconConfig = [];
            res.data.forEach((v) => {
              const { jsonInfo, columnName, tableName } = v;
              const arr = jsonInfo && JSON.parse(jsonInfo);
              arr.forEach((item) => {
                treeIconConfig.push({
                  ...item,
                  columnName,
                  tableName,
                });
              });
            });
            this.treeIconConfig = treeIconConfig;
          });
      }

      if (this.asyncNode_) {
        //异步节点数
        treeApi
          .currencyStandardSelectionBoxSingleTree(this, params, 'G')
          .then((value) => {
            _this.treeList = value;
            _this.$nextTick(() => {
              _this.update = true;
            });
            setTimeout(() => {
              _this.isLoading = false;
            }, 100);
          });
      } else {
        //整颗树
        params = { ...params, ...this.searchParams };
        treeApi
          .currencyStandardSelectionBoxTree(this, params, 'G')
          .then((value) => {
            _this.treeList = value;
            _this.$nextTick(() => {
              _this.update = true;
            });
            setTimeout(() => {
              _this.isLoading = false;
            }, 100);
          });
      }
    },
  },
  mounted() {
    this.getTreeData();
  },
  created() {
    this.SETA_TREE_ANCESTORS([]);
    const _this = this;
    if (this.alreadyCheckId) {
      const alreadyCheckId = `${this.alreadyCheckId}`;
      this.checkedIds = alreadyCheckId.split(',');
      this.treeCheckNode = [...this.alreadyCheckedNode];
    }
    if (!this.multiple) this.getNodeAncestors(); //获取节点的祖先节点
    bus.$on('treeCheckNode', (params) => {
      //获取传递的参数并进行操作
      console.log(this.treeCheckNode);
      let treeNode = params.treeItem;
      treeNode.children = params.children;
      if (_this.multiple) {
        _this.treeCheckNode.push(treeNode);
        _this.checkedIds.push(treeNode.id);
      } else {
        _this.treeCheckNode = [treeNode];
        _this.checkedIds = [treeNode.id];
      }
      _this.$emit('checkNode', {
        checkList: _this.treeCheckNode,
        checkNode: treeNode,
      });
    });
    bus.$on('treeNoCheckNode', (params) => {
      //获取传递的参数并进行操作
      let treeNode = params.treeItem;
      treeNode.children = params.children;
      if (_this.multiple) {
        const checkIndex = _this.treeCheckNode.findIndex(
            (item) => `${item.id}` === `${treeNode.id}`
          ),
          checkedIdsIndex = _this.checkedIds.findIndex(
            (item) => `${item}` === `${treeNode.id}`
          );
        _this.treeCheckNode.splice(checkIndex, 1);
        _this.checkedIds.splice(checkedIdsIndex, 1);
      } else {
        _this.treeCheckNode = [];
        _this.checkedIds = [];
      }
      _this.$emit('unCheckNode', {
        checkList: _this.treeCheckNode,
        checkNode: treeNode,
      });
    });
  },
};
</script>

<style>
</style>
