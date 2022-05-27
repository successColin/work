<!--
 * @Descripttion: 按角色
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 10:00:33
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-20 14:30:17
-->
<!-- treeTable -->
<template>
  <section class="org">
    <div class="org__tree">
      <div class="org__tree__header">
        {{ $t('org.role') }}
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
          @node-click="handleTreeClick"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <i
              v-if="!data.groupId && data.expanded"
              class="iconfont fenzuzhankai m-r-6"
            ></i>
            <i
              v-else-if="!data.groupId && !data.expanded"
              class="iconfont icon-fenzuchangtai m-r-6"
            ></i>
            <i v-else class="iconfont icon-jiaose m-r-6"></i>
            <span>{{ data.name || data.roleName }}</span>
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
import { getUserPage } from '@/api/orgManage.js';
import { getRoleLiistById, doFetchGroup } from '@/api/role';
import userList from '../userList/index';

export default {
  components: {
    userList
  },
  name: 'roleTab',
  data() {
    return {
      treeData: [],
      userTableData: [],
      selection: [],
      curNode: {},
      props: {
        isLeaf: 'leaf'
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
    this.getRoleGroup();
    this.getUserList();
  },
  methods: {
    handleTreeClick(data) {
      this.curNode = data;
      this.getUserList();
      this.$emit('resetSearchKeyword');
    },
    async loadNode(node, resolve) {
      const { data } = node;
      this.curNode = data;
      this.getUserList();
      if (data.groupId) {
        return false;
      }
      if (node.level === 0) {
        return resolve([]);
      }
      const params = { groupId: data.id };
      const res = await getRoleLiistById(params);
      const list = res.map((item) => {
        item.leaf = true;
        return item;
      });
      resolve(list);
    },
    async getRoleGroup() {
      // 获取树
      try {
        this.loading = true;
        const res = await doFetchGroup();
        this.treeData = res.map((item) => {
          if (item.roleTotal > 0) {
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
        keywords: val,
        size: 999,
        orders: [
          {
            asc: true,
            column: ''
          }
        ]
      };
      if (!this.curNode.groupId) {
        params.roleGroupId = this.curNode.id;
      } else {
        params.roleId = this.curNode.id;
      }
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
