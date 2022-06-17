<template>
  <div class="treeNode" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="treeNode__content">
      <el-checkbox
        style="margin-right: 4px"
        :value="getChecked"
        @input="changeCheck"
        v-if="showCheckbox && +data.dataType === 2"
      ></el-checkbox>
      <el-radio
        :value="multiEntityArr.length && +multiEntityArr[0][getIdCompId]"
        :label="data.id"
        @input="changeCheck"
        v-if="showSinglebox && data.id && +data.dataType === 2"
      ></el-radio>
      <div class="treeNode__treeIcon">
        <i
          :class="`iconfont m-r-4 ${getCurDict(data, 1)}`"
          :style="`color:${getCurDict(data, 2)}`"
        ></i>
      </div>
      <div
        class="treeNode__label"
        :title="getTreeNodeText"
        @click="changeCheck"
      >
        {{ getTreeNodeText }}
      </div>
    </div>
    <div class="treeNode__btns" v-show="showBtns && isSidebar">
      <el-tooltip
        content="新增位置"
        placement="top"
        :enterable="false"
        transition="none"
      >
        <apiot-button type="text" v-if="showAddPos" @click.stop="addPos"
          ><i class="iconfont icon-xinzengweizhi"></i
        ></apiot-button>
      </el-tooltip>
      <el-tooltip
        content="新增设备"
        placement="top"
        :enterable="false"
        transition="none"
      >
        <apiot-button
          type="text"
          v-if="showAddDevice"
          @click.stop="addDevice(+data.dataType)"
          ><i class="iconfont icon-xinzengshebei"></i
        ></apiot-button>
      </el-tooltip>
      <el-tooltip
        content="删除"
        placement="top"
        :enterable="false"
        transition="none"
      >
        <apiot-button type="text" v-if="showDelBtn" @click.stop="deleteData"
          ><i class="iconfont icon-shanchu"></i
        ></apiot-button>
      </el-tooltip>
    </div>
    <component
      :is="panelDrawer"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
    ></component>
  </div>
</template>

<script>
import { batchDelete } from '@/api/menuConfig';
import compMixin from '../compMixin';

export default {
  name: '',
  props: {
    node: {
      type: Object
    },
    data: {
      type: Object
    },
    isSidebar: {
      type: Boolean
    },
    getBtnsArr: {
      type: Object
    },
    getFeatureArr: {
      type: Object
    },
    getIdCompId: {
      type: String
    },
    panelConfig: {
      type: Object
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    showSinglebox: {
      type: Boolean,
      default: false
    },
    multiEntityArr: {
      type: Array
    }
  },
  mixins: [compMixin],
  data() {
    return {
      showBtns: false,
      panelObj: null,
      panelDrawer: 'PanelDrawer',
      showPanel: false
    };
  },
  mounted() {},
  inject: [
    'resolveFormula',
    'getAllForm',
    'getPanel',
    'getFatherPanel',
    'onlyFlag',
    'sysMenuDesignId',
    'getInitComp',
    'resolveTerm'
  ],
  computed: {
    getShowIds() {
      return this.getFeatureArr.children.filter((child) => {
        if (child.showTreeText) {
          return true;
        }
        return false;
      });
    },
    getTreeNodeText() {
      let str = '';
      if (this.data.name) {
        str += this.data.name;
        str += this.configData.linkSymbol;
      }
      if (this.data.keycode) {
        str += this.data.keycode;
      }
      if (!str && this.data.id === 1) {
        return '根节点';
      }
      return str;
    },
    // 获取图标
    getCurDict() {
      return (item, flag) => {
        if (+item.dataType === 1) {
          if (flag === 1) {
            return 'icon-weizhi';
          }
          if (flag === 2) {
            return '#5A80ED';
          }
        } else {
          if (flag === 1) {
            return 'icon-shebei';
          }
          if (flag === 2) {
            return '#34C7BE';
          }
        }

        return '';
      };
    },
    showAddDevice() {
      if (!this.$store.getters.getMenuResource(this.$route.params.id).includes(2)) {
        return false;
      }
      if (+this.data.dataType === 1 && this.data.id === 1) {
        return false;
      }
      return this.configData.showAdd;
    },
    showAddPos() {
      if (!this.$store.getters.getMenuResource(this.$route.params.id).includes(2)) {
        return false;
      }
      return +this.data.dataType === 1 && this.configData.showAdd;
    },
    showDelBtn() {
      if (!this.$store.getters.getMenuResource(this.$route.params.id).includes(4)) {
        return false;
      }
      return this.configData.showDel;
    },
    getChecked() {
      const index = this.multiEntityArr.findIndex((item) => {
        if (+item[this.getIdCompId] === +this.data.id) {
          return true;
        }
        return false;
      });
      if (index === -1) {
        return false;
      }
      return true;
    }
  },

  components: {},

  methods: {
    mouseenter() {
      this.showBtns = true;
      this.$emit('changeForm', this.data);
    },
    mouseleave() {
      this.showBtns = false;
      this.$emit('changeFormToCurrent');
    },
    selectTreeNode() {
      this.$emit('selectTreeNode', this.data);
    },
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.id) {
        panelObj.panelVarObj = {};
        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] = this.getAllForm()[compId];
          });
        });

        panelObj.panelFixData = {};
        panelObj.panelData.forEach((item) => {
          if (item.mainComp.type === 2) {
            panelObj.panelFixData[item.paneComp.compId] = item.mainComp.fixedValue;
          } else {
            panelObj.panelFixData[item.paneComp.compId] =
              this.getAllForm()[item.mainComp.compId] == null
                ? 0
                : this.getAllForm()[item.mainComp.compId];
          }
        });
        panelObj.panelCompId = this.configData.compId;
        panelObj.relationMenuDesignId = this.sysMenuDesignId();
        panelObj.onlyFlag = this.onlyFlag();
        panelObj.isTree = true;

        return panelObj;
      }
      return null;
    },
    // 新增位置
    addPos() {
      this.selectTreeNode();
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.posAddPos]);
      if (this.panelObj && this.panelObj.panelName) {
        this.panelObj.isAdd = true;
        this.showPanel = true;
      }
    },
    // 添加设备
    addDevice(dataType) {
      this.selectTreeNode();
      // const obj = {
      //   id: 2,
      //   panelData: [],
      //   panelFilter: [],
      //   panelName: '设备面板',
      //   panelType: 1,
      //   sysMenuDesignId: 423
      // };
      if (dataType === 1) {
        this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.posAddDevice]);
      } else {
        this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.deviceAddDevice]);
      }

      if (this.panelObj && this.panelObj.panelName) {
        this.panelObj.isAdd = true;
        // this.panelObj.pageConfig = this.panelConfig[obj.id];
        // // 固定面板设备的父位子节点组件id goWaZb 父节点组件id o6L0d2
        // if (dataType === 1) {
        //   // 代表位置下面添加设备 此时 父节点id 0 位置节点id就是当前数据id
        //   this.panelObj.panelFixData.o6L0d2 = 0;
        //   this.panelObj.panelFixData.goWaZb = this.data.id;
        // } else {
        //   // 代表设备下面添加设备 此时 父节点id 就是当前节点id 位置节点id就是当前数据位置节点id
        //   this.panelObj.panelFixData.o6L0d2 = this.data.id;
        //   this.panelObj.panelFixData.goWaZb = this.data.positionId;
        // }
        this.showPanel = true;
      }
    },
    async deleteData() {
      this.selectTreeNode();
      if (!this.node.isLeaf) {
        return this.$message({
          type: 'warning',
          message: '存在子节点'
        });
      }
      // if (this.data.childCount) {
      //   return this.$message({
      //     type: 'warning',
      //     message: '存在子节点'
      //   });
      // }
      await this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const params = {
        ids: this.data.id,
        tableName: +this.data.dataType === 1 ? 'sys_position' : 'sys_device',
        userId: this.$store.state.userCenter.userInfo.id,
        menuId: this.$route.params.id
      };
      await batchDelete(params);
      this.$message({
        type: 'success',
        message: '删除成功'
      });
      this.$emit('deleteSuccess');
    },
    getCheckedIndex() {
      const index = this.multiEntityArr.findIndex((item) => {
        if (+item[this.getIdCompId] === +this.data[this.getIdCompId]) {
          return true;
        }
        return false;
      });
      return index;
    },
    // 修改checkout的值
    changeCheck() {
      if (this.data.dataType === 1) {
        return;
      }
      this.data[this.getIdCompId] = this.data.id;
      if (this.showCheckbox) {
        const index = this.getCheckedIndex();
        if (index === -1) {
          this.multiEntityArr.push(this.data);
        } else {
          this.multiEntityArr.splice(index, 1);
        }
      }
      if (this.showSinglebox) {
        this.multiEntityArr.splice(0, this.multiEntityArr.length, this.data);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.treeNode {
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  line-height: 16px;
  &__content {
    height: 100%;
    width: calc(100% - 100px);
    flex: 1;
    display: inline-flex;
    align-items: center;
    ::v-deep {
      .el-radio {
        margin-right: 4px;
      }
      .el-radio__label {
        display: none;
      }
      .el-radio__input {
        margin-top: 1px;
      }
    }
  }
  &__label {
    width: calc(100% - 20px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    line-height: 20px;
  }
  &__treeIcon {
    height: 100%;
    display: inline-flex;
    align-items: center;
    .iconfont {
      font-size: 20px;
    }
    &--img {
      width: 20px;
      height: 20px;
    }
  }
  &__btns {
    margin-right: 8px;
  }
}
</style>
