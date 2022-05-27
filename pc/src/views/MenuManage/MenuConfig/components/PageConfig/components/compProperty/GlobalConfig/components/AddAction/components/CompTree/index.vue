<template>
  <apiot-dialog
    class="compTree"
    title="选择控件"
    :loading.sync="showLoading"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <el-tabs v-model="activeName" class="compTree__elTabs">
      <el-tab-pane label="选控件" name="1">
        <section class="compTree__body">
          <el-tree
            v-if="showTree"
            ref="configTree"
            :data="configData"
            node-key="compId"
            class="compTree__tree"
            default-expand-all
            @node-click="nodeClick"
            :filter-node-method="filterNode"
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ data, node }"
              :key="data.compId || data.name"
              class="compTree__treeItem"
            >
              <div v-if="data.compType && data.compType < 1000" @click.stop>
                <el-checkbox-group
                  :value="checkList"
                  v-if="isMulti"
                  @change="nodeClick(data, node)"
                >
                  <el-checkbox :label="data.compId" class="compTree__treeRadio">
                    <img
                      :src="require(`@/assets/img/menu_images/${data.imgUrl}`)"
                    />
                    <span>{{ data.name }}</span>
                  </el-checkbox>
                </el-checkbox-group>
                <el-radio
                  v-else
                  :value="curComp.compId"
                  :label="data.compId"
                  @change="nodeClick(data, node)"
                  class="compTree__treeRadio"
                >
                  <img
                    :src="require(`@/assets/img/menu_images/${data.imgUrl}`)"
                  />
                  <span>{{ data.name }}</span>
                </el-radio>
              </div>
              <span v-else>{{ data.name }}</span>
            </div>
          </el-tree>
        </section>
      </el-tab-pane>
      <el-tab-pane label="选变量" name="2" v-if="canFormula">
        <section class="compTree__body">
          <el-tree
            v-if="showFormulaTree"
            ref="formulaTree"
            :data="formulaData"
            node-key="compId"
            class="compTree__tree"
            default-expand-all
            @node-click="nodeFormulaClick"
            :filter-node-method="filterFormulaNode"
            :expand-on-click-node="false"
          >
            <div
              slot-scope="{ data }"
              :key="data.compId || data.name"
              class="compTree__treeItem"
            >
              <el-radio
                v-if="data.isFormula === 2"
                :value="curComp.name"
                :label="data.name"
                class="compTree__treeRadio"
              >
                <span>{{ data.name }}</span>
              </el-radio>
              <span v-else>{{ data.name }}</span>
            </div>
          </el-tree>
        </section>
      </el-tab-pane>
    </el-tabs>
    <header class="compTree__header">
      <search-input @getList="getTreeData" v-model="keyWord"></search-input>
    </header>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    // 配置树
    configData: {
      type: Array
    },
    // 选中的值
    selectedComp: {
      type: Object
    },
    // 选中的多选值
    selectCompArr: {
      type: Array,
      default: () => []
    },
    // 是否需要去除触发空间
    isNeedTriggerComp: {
      type: Boolean,
      default: true
    },
    // 选中的触发控件
    triggerComp: {
      type: Object
    },
    // 过滤的id
    filterList: {
      type: Array
    },
    filterMethods: {
      type: Function
    },
    // 是否多选
    isMulti: {
      type: Boolean,
      default: false
    },
    // 是否可选公式
    canFormula: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showLoading: false,
      keyWord: '',
      curComp: {
        compId: ''
      },
      showTree: true,
      showFormulaTree: true,
      checkList: [],
      compList: [],
      activeName: '1',
      formulaData: [
        {
          name: '常用公式',
          children: [
            { name: 'GET_USER_ID()', isFormula: 2 },
            { name: 'GET_ORG_ID()', isFormula: 2 },
            { name: 'GET_ROLES_ID()', isFormula: 2 }
          ]
        },
        {
          name: '日期函数',
          children: [
            { name: 'GET_DATE()', isFormula: 2 },
            { name: 'GET_DATETIME()', isFormula: 2 },
            { name: 'GET_YEAR()', isFormula: 2 },
            { name: 'GET_MONTH()', isFormula: 2 },
            { name: 'GET_WEEK()', isFormula: 2 },
            { name: 'GET_DAY()', isFormula: 2 },
            { name: 'GET_TIMESTAMP()', isFormula: 2 }
          ]
        }
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {
    if (!this.isMulti && this.selectedComp) {
      this.curComp = this.selectedComp;
    }
    if (this.isMulti && this.selectCompArr && this.selectCompArr.length !== 0) {
      this.compList = this.selectCompArr;
      this.selectCompArr.forEach((comp) => {
        this.checkList.push(comp.compId);
      });
    }
    this.getTreeData();
  },

  methods: {
    sureClick() {
      this.showLoading = false;
      // console.log(this.curComp);
      if (this.curComp.isFormula === 2) {
        this.$emit('getSelectComp', this.curComp);
        this.$emit('update:visible', false);
      } else if (this.isMulti) {
        if (this.compList.length === 0) {
          return this.$message({
            type: 'error',
            message: '请选择组件'
          });
        }
        this.$emit('getSelectComp', this.compList);
        this.$emit('update:visible', false);
      } else {
        if (!this.curComp.compId) {
          return this.$message({
            type: 'error',
            message: '请选择组件'
          });
        }
        this.$emit('getSelectComp', this.curComp);
        this.$emit('update:visible', false);
      }
    },

    filterNode(value, data, node) {
      if (value && data.name.indexOf(value) === -1) {
        return false;
      }
      // 分割线 iframe 不让操作
      if ([18, 19].includes(data.compType)) {
        return false;
      }

      if (this.filterList && this.filterList.includes(data.compId)) {
        return false;
      }
      if (this.filterMethods && this.filterMethods(data)) {
        return false;
      }

      // 不需要显示触发控件
      if (!this.isNeedTriggerComp) {
        if (
          this.triggerComp &&
          this.triggerComp.compId &&
          this.triggerComp.compId === data.compId
        ) {
          return false;
        }
      }
      const tempNode = this.findNode(node);
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
    filterFormulaNode(value, data) {
      if (value && data.name.indexOf(value) === -1) {
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
    getTreeData() {
      if (this.activeName === '1') {
        this.showTree = false;
        this.$nextTick(() => {
          this.showTree = true;
          setTimeout(() => {
            this.$refs.configTree.filter(this.keyWord);
          }, 0);
        });
      } else {
        this.showFormulaTree = false;
        this.$nextTick(() => {
          this.showFormulaTree = true;
          setTimeout(() => {
            this.$refs.formulaTree.filter(this.keyWord);
          }, 0);
        });
      }
    },
    nodeClick(data, node) {
      const tempComp = JSON.parse(JSON.stringify(data));
      this.$set(this, 'curComp', JSON.parse(JSON.stringify(data)));
      const pathArr = [];
      while (node.parent) {
        if (node.parent.data.name) {
          // 标记替换名字时能够更改
          if (node.parent.data.canChangeName) {
            pathArr.unshift(node.parent.data.compId);
          } else {
            pathArr.unshift(node.parent.data.name);
          }
        }
        node = node.parent;
      }
      tempComp.compPath = pathArr.join('/');
      // console.log(tempComp, 'select');
      if (this.isMulti) {
        if (!this.checkList.includes(data.compId)) {
          this.checkList.push(data.compId);
          this.compList.push(tempComp);
        } else {
          const index = this.checkList.indexOf(data.compId);
          this.checkList.splice(index, 1);
          this.compList.splice(index, 1);
        }
      } else {
        this.curComp = tempComp;
      }
    },
    nodeFormulaClick(data) {
      // console.log(data, node);
      // const tempComp = JSON.parse(JSON.stringify(data));
      this.$set(this, 'curComp', JSON.parse(JSON.stringify(data)));
    }
  },

  watch: {
    activeName() {
      this.getTreeData();
    }
  }
};
</script>

<style lang='scss' scoped>
.compTree {
  ::v-deep {
    .el-dialog__body {
      padding-top: 0;
    }
  }
  &__header {
    position: absolute;
    height: 42px;
    line-height: 42px;
    right: 20px;
  }
  &__elTabs {
    height: 100%;
    ::v-deep {
      .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap::after {
          display: none;
        }
      }
      .el-tabs__content {
        height: calc(100% - 40px);
        .el-tab-pane {
          height: 100%;
        }
      }
    }
    &.noTabHeader {
      ::v-deep {
        .el-tabs__header {
          display: none;
        }
      }
    }
  }
  &__body {
    height: 100%;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    border-bottom: 0;
    overflow: auto;
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
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
  &__treeRadio {
    display: flex;
    align-items: center;
    ::v-deep {
      .el-radio__label {
        display: flex;
        align-items: center;
      }
      .el-checkbox__label {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
