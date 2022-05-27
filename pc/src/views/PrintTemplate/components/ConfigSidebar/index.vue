<!--
 * @Descripttion: 左侧打印内容
 * @Author: ytx
 * @Date: 2021-09-02 15:16:45
 * @Last Modified by: ytx
 * @Last Modified time: 2021-09-02 15:16:45
-->
<template>
  <section class="configSidebar">
    <el-button-group class="configSidebar__tab">
      <apiot-button
        class="configSidebar__tab--item"
        :class="[{ active: curType === 1 }]"
        @click="curType = 1"
      >
        表单数据
      </apiot-button>
      <apiot-button
        class="configSidebar__tab--item"
        :class="[{ active: curType === 2 }]"
        @click="curType = 2"
      >
        数据库
      </apiot-button>
    </el-button-group>
    <div class="configSidebar__wrapper">
      <div class="configSidebar__tabArea" v-show="curType === 1">
        <el-tree
          v-if="showTree"
          ref="configTree"
          :data="configData"
          node-key="compId"
          class="configSidebar__tree"
          default-expand-all
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
        >
          <div
            slot-scope="{ data, node }"
            :key="data.compId || data.name"
            class="configSidebar__treeItem"
            @mouseenter="handleMouseenter(node, $event)"
            @mouseleave="handleMouseleave"
            @mousedown="handleMousedown(node)"
          >
            <!-- :style="{ cursor: node.level == 5 ? 'move' : 'not-allowed' }" -->
            <img
              v-if="data.compType"
              :src="require(`@/assets/img/menu_images/${data.imgUrl}`)"
            />
            {{ getTreeName(data, node) }}
          </div>
        </el-tree>
      </div>
      <div class="configSidebar__tabArea" v-show="curType === 2">数据库</div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    configData: {
      type: Array
    },
    isMove: {
      type: Boolean,
      default: false
    },
    dropObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      curType: 1,
      showTree: true,
      btnAreaIds: [2],
      nodes: [],
      isHover: false
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    handleMousedown(node) {
      // console.log(node);
      if (node.data.compType) {
        this.$emit('update:dropObj', node.data);
        this.$emit('update:isMove', true);
      }
    },
    // 拖拽时判定目标节点能否被放置
    allowDrop(draggingNode, dropNode) {
      if (draggingNode.id !== dropNode.id) {
        return false;
      }
      return true;
    },
    // 判断节点能否被拖拽
    allowDrag(node) {
      if ((node.level === 4 && this.isHover) || (node.level === 5 && this.isHover)) {
        return true;
      }
      return false;
    },
    // 鼠标移入
    handleMouseenter(node, e) {
      if (node.level === 5) {
        e.target.style.outline = '1px dashed #107fff';
        e.target.style.padding = '6px 0';
        e.target.style.cursor = 'move';
        this.isHover = true;
      } else {
        e.target.style.cursor = 'not-allowed';
      }
    },
    // 鼠标移出
    handleMouseleave(e) {
      e.target.style.outline = '';
      e.target.style.padding = '';
      e.target.style.cursor = '';
      this.isHover = false;
    },
    filterNode(value, data, node) {
      const tempNode = this.findNode(node);
      // console.log(value, data, node);
      if (data.compType === 5) {
        return false;
      }
      if (tempNode && tempNode.parent.data.showTab === false) {
        if (
          tempNode.parent.data.curCompId &&
          tempNode.data.compId &&
          tempNode.parent.data.curCompId === tempNode.data.compId
        ) {
          return true;
        }
        return false;
      }

      return true;
    },
    findNode(node) {
      let tempNode = null;
      while (node.parent && !tempNode) {
        if (node.parent.data.showTab === false) {
          tempNode = node;
          break;
        }
        node = node.parent;
      }
      return tempNode;
    },
    getTreeName(data, node) {
      if (
        node.parent.data.curCompId &&
        data.compId &&
        node.parent.data.showTab === false &&
        node.parent.data.curCompId === data.compId
      ) {
        return `${data.name}(隐藏)`;
      }
      if (data.dataSource && data.dataSource.relateName) {
        return `${data.name}(${data.dataSource.relateName})`;
      }
      return data.name;
    }
    // 节点开始拖拽时触发的事件,把被拖拽的节点参数写入拖拽事件对象中
    // handleDragStart(node, ev) {
    //   const dt = ev.dataTransfer;
    //   dt.effectAllowed = 'copy';
    //   dt.setData('text/plain', JSON.stringify(node.data));
    // }
    // dragMove(e) {
    //   // console.log(22222, e);
    //   const relateElement = e.relatedContext.element;
    //   const dragElement = e.draggedContext.element;
    //   const { component } = e.relatedContext;
    //   // 侧边栏按钮区最多拖动2个
    //   if (
    //     component &&
    //     component.$attrs.areaType === 2 &&
    //     component.$attrs.isSidebar &&
    //     component.$attrs.length >= 2
    //   ) {
    //     return false;
    //   }
    //   if (relateElement) {
    //     if (relateElement.areaType !== dragElement.areaType) {
    //       return false;
    //     }
    //   } else if (component.$attrs.areaType !== dragElement.areaType) {
    //     return false;
    //   }
    // }
  },

  watch: {
    configData: {
      handler() {
        // console.log(v);
        this.showTree = false;
        this.$nextTick(() => {
          this.showTree = true;
          setTimeout(() => {
            this.$refs.configTree.filter();
          }, 0);
        });
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.configSidebar {
  height: 100%;
  width: 280px;
  overflow: hidden;
  background: #fff;
  &__tab {
    box-sizing: border-box;
    width: 100%;
    height: 46px;
    padding: 10px 10px 8px;
    display: flex;
    &--item {
      flex: 1;
      border: 1px solid #e9e9e9;
      color: #333333;
      cursor: pointer;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      &:not(:first-child) {
        margin-left: 1px;
      }
      &.active {
        background-color: $--color-primary !important;
        border-color: $--color-primary !important;
        color: #fff !important;
      }
    }
  }
  &__wrapper {
    height: 100%;
  }
  &__tabArea {
    height: calc(100% - 46px);
    overflow: auto;
  }
  ::v-deep {
    &.el-tree {
      overflow: auto;
      width: 280px;
      height: 100%;
      > .el-tree-node {
        /*设置横向滚动条*/
        min-width: 100%;
        display: inline-block;
      }
    }
  }
  &__tree {
    ::v-deep {
      .el-tree-node:focus > .el-tree-node__content {
        background-color: $--hover-color;
        border-left: 3px solid $--color-primary;
      }
      .el-tree-node__content {
        height: 36px;
        box-sizing: border-box;
        border-left: 3px solid transparent;
        .el-tree-node__expand-icon {
          margin-left: 10px;
        }
        & > div {
          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
  &__treeItem {
    display: flex;
    align-items: center;
    user-select: none;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
}
</style>
