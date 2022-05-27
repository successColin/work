<!--
 * @Descripttion: 按职位
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 10:00:33
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-11 09:41:28
-->
<!-- treeTable -->
<template>
  <section class="org">
    <div class="org__tree">
      <div class="org__tree__header">
        {{ $t('org.post') }}
      </div>
      <div class="org__tree__content">
        <el-tree
          class="org__tree__content__tree"
          :props="props"
          :data="treeData"
          node-key="id"
          ref="tree"
          lazy
          :load="loadNode"
          :expand-on-click-node="true"
          highlight-current
          @node-click="handleNodeClick"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <i class="iconfont icon-zhiwei m-r-6"></i>
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="org__select">
      <div class="org__select__header">{{ $t('org.user') }}</div>
      <div class="org__select__content">
        <user-list
          v-if="!!listData"
          :listData.sync="listData"
          v-on="$listeners"
          v-bind="$attrs"
        >
        </user-list>
      </div>
    </div>
  </section>
</template>

<script>
import { getUserPostList } from '@/api/userpost.js';
import { getUserPage } from '@/api/orgManage.js';
import UserList from './UserList';

export default {
  components: {
    UserList
  },
  name: 'postTab',
  data() {
    return {
      treeData: [],
      userTableData: [],
      selection: [],
      curNode: {},
      props: {
        isLeaf: 'leaf',
        children: 'childList'
      }
    };
  },
  props: {
    checkeduser: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  computed: {
    listData() {
      const rows = this.userTableData.map((item) => {
        const arr = this.checkeduser.filter((obj) => String(obj.id) === String(item.id));
        if (arr.length > 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
      return rows;
    }
  },
  mounted() {
    this.getOrgTree({ parentId: 0 });
    this.getUserList();
  },
  methods: {
    handleNodeClick(data) {
      this.curNode = data;
      this.$emit('resetSearchKeyword');
      this.getUserList();
    },
    async loadNode(node, resolve) {
      const { data } = node;
      if (node.level === 0) {
        return resolve([]);
      }
      const params = { parentId: data.id };
      const res = await getUserPostList(params);
      const childData = res.map((item) => {
        if (item.childrenTotal > 0) {
          item.leaf = false;
        } else {
          item.leaf = true;
        }
        return item;
      });
      resolve(childData);
    },
    async getOrgTree(params) {
      // 获取树
      try {
        this.loading = true;
        const res = await getUserPostList(params);
        this.treeData = res.map((item) => {
          if (item.childrenTotal > 0) {
            item.leaf = false;
          } else {
            item.leaf = true;
          }
          return item;
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        // console.log(e);
      }
    },
    // 人员列表
    getUserList(val) {
      const params = {
        searchType: 2,
        rootPath: this.curNode.rootPath || '',
        keywords: val,
        size: 999,
        orders: [
          {
            asc: true,
            column: ''
          }
        ]
      };
      getUserPage(params).then((res) => {
        this.userTableData = res.records;
      });
    }
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
@import './index.scss';
</style>
