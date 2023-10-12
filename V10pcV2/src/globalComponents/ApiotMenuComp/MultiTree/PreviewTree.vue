<template>
  <el-tree :data="previewData" class="elTree previewData"></el-tree>
</template>

<script>
export default {
  name: '',
  props: {
    previewData: {
      type: Array,
    },
  },

  data() {
    return {};
  },
  computed: {},
  mounted() {
    this.$nextTick(() => {
      const dom = document.querySelector(
        '.previewData  .el-tree-node__content',
      );
      if (dom) {
        dom.click();
      }
    });
  },

  inject: ['getAllForm', 'onlyFlag'],

  methods: {},
};
</script>

<style lang="scss" scoped>
.elTree {
  overflow-y: auto;
  width: 100%;
  .custom-tree-node {
    flex: 1;
    width: calc(100% - 24px);
    overflow: hidden;
  }
  ::v-deep {
    .el-tree-node__content {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      height: 34px;
      &:hover {
        background-color: $--hover-color;
      }
      .el-tree-node__label {
        color: #333;
      }
    }
    .el-tree-node__loading-icon {
      position: absolute;
      background-color: #fff;
      margin: 0 0 0 6px;
    }
    .el-tree-node.is-drop-inner > .el-tree-node__content .treeNode__label {
      background-color: #4689f5;
    }
    .el-tree-node > .el-tree-node__content {
      border-left: 3px solid transparent;
    }
    .el-tree-node.is-current > .el-tree-node__content {
      border-left: 3px solid $--color-primary;
      .treeNode__label,
      .el-tree-node__label {
        color: $--color-primary;
      }
    }
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: $--hover-color;
    }
    .el-tree-node__loading-icon {
      background-color: $--hover-color;
    }
  }
}
</style>
