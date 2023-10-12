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
      <!-- <div class="org__tree__header">
        {{ $t('org.post') }}
      </div> -->
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
          show-checkbox
          check-strictly
          @check-change="handleCheckChange"
          :default-checked-keys="checkArr"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <i class="iconfont icon-zhiwei m-r-6"></i>
            <span>{{ data.name }}</span>
          </span>
        </el-tree>
      </div>
    </div>
  </section>
</template>

<script>
import { getUserPostList } from '@/api/userpost.js';

export default {
  components: {
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
        children: 'childList',
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
        const arr = this.checkeduser.filter((obj) => String(obj.id) === String(item.id)
          && obj.type === 4);
        if (arr.length > 0) {
          item.checked = true;
        } else {
          item.checked = false;
        }
        return item;
      });
      return rows;
    },
    checkArr() {
      return this.checkeduser.map((item) => item.id);
    }
  },
  mounted() {
    this.getOrgTree({ parentId: 0 });
  },
  methods: {
    handleCheckChange(data) {
      const item = {
        username: data.name,
        id: data.id,
        type: 4,
      };
      this.$emit('updateSelection', item);
    },
    setChecked(item) {
      this.$refs.tree.setChecked(item.id, false);
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
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
@import './../roleTab/index.scss';
</style>
