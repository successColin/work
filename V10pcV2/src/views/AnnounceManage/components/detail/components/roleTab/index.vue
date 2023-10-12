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
      <!-- <div class="org__tree__header">
        {{ $t('org.role') }}
      </div> -->
      <div class="org__tree__content">
        <el-tree
          class="org__tree__content__tree"
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
          :props="props"
          :default-checked-keys="checkArr"
        >
          <span class="custom-tree-node" slot-scope="{ data }">
            <i
              v-if="!data.groupId && data.expanded"
              class="iconfont icon-fenzuzhankai m-r-6"
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
  </section>
</template>

<script>
import { getRoleLiistById, doFetchGroup } from '@/api/role';

export default {
  components: {
  },
  name: 'roleTab',
  data() {
    return {
      treeData: [],
      userTableData: [],
      selection: [],
      curNode: {},
      props: {
        isLeaf: 'leaf',
        disabled(data) {
          if (!data.groupId) {
            return true;
          }
          return false;
        }
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
          && obj.type === 2);
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
    this.getRoleGroup();
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
      const item = {
        username: data.roleName,
        id: data.id,
        type: 2,
      };
      this.$emit('updateSelection', item);
    },
    setChecked(item) {
      this.$refs.tree.setChecked(item.id, false);
    },
    async loadNode(node, resolve) {
      const { data } = node;
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
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
@import './index.scss';
</style>
