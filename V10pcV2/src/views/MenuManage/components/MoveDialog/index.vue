<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择模块"
  >
    <SingleTree
      :treeData="treeData"
      :multiEntityArr="multiEntityArr"
      :filterIds="getFilterIds"
      :getDisabledIds="getDisabledIds"
      :showSingle="true"
      ref="tree"
      class="tree"
    ></SingleTree>
  </apiot-dialog>
</template>

<script>
import { menuList, sysMenuEdit } from '@/api/menuManage';
import SingleTree from '../Sidebar/SingleTree.vue';

export default {
  name: '',
  props: {
    showMoveDialog: {
      type: Boolean,
      default: false
    },
    filterItem: {
      type: Object
    },
    isMenu: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: [],
      multiEntityArr: []
    };
  },
  computed: {
    getFilterIds() {
      if (this.isMenu) {
        return [];
      }
      if (this.filterItem) {
        return [this.filterItem.id];
      }
      return [];
    },
    getDisabledIds() {
      if (this.filterItem) {
        return [this.filterItem.parentId];
      }
      return [];
    }
  },
  mounted() {},
  components: { SingleTree },
  methods: {
    async getMenuList() {
      const params = { menuLevel: 1, clientType: 1, parentId: 0 };
      const data = await menuList(params);
      const arr = [];
      data.forEach((item) => {
        if (!item.childCount) {
          item.isLeaf = true;
        } else {
          item.isLeaf = false;
        }
        item.type = 'module';
        if (item.menuType !== 1 && !this.getFilterIds.includes(item.id)) {
          arr.push(item);
        }
      });
      this.treeData = arr;
    },
    async sureClick() {
      // console.log(this.multiEntityArr, this.filterItem);
      if (this.multiEntityArr.length === 0) {
        return this.$message({
          type: 'warning',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('menu.module') })
        });
      }
      const params = {
        parentId: this.multiEntityArr[0].id,
        menuName: this.filterItem.menuName,
        id: this.filterItem.id,
        logData: {
          operateType: 2,
          parentId: {
            name: this.$t('menu.parant')
          }
        }
      };
      await sysMenuEdit(params);
      this.$emit('update:visible', false);
      this.$store.dispatch('getRoute');
      this.$emit('moveSucess');
      this.$message({
        type: 'success',
        message: this.$t('common.success', {
          name: this.$t('common.move', { name: this.$t('menu.module') })
        })
      });
    }
  },
  watch: {
    showMoveDialog(v) {
      if (v) {
        console.log(v);
        this.multiEntityArr = [];
        this.getMenuList();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.tree {
  height: 100%;
  ::v-deep {
    .el-tree-node {
      width: auto !important;
      max-width: none !important;
    }
  }
}
</style>
