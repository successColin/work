<template>
  <div class="treeNode" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <div class="treeNode__content">
      <div class="treeNode__treeIcon">
        <i
          v-if="data.dataType === 'G'"
          :class="`iconfont m-r-4 ${getCurDict(data, 1)}`"
          :style="`color:${getCurDict(data, 2)}`"
        ></i>
        <img v-else class="m-r-4" :src="$parseImgUrl(getCurDict(data))" />
      </div>
      <div class="treeNode__label" :title="getTreeNodeText">
        {{ getTreeNodeText }}
      </div>
    </div>
    <div class="treeNode__btns" v-show="showBtns">
      <el-tooltip
        :content="tooltipTitle(data)"
        placement="top"
        :enterable="false"
        transition="none"
      >
        <apiot-button
          type="text"
          v-if="
            'G,A,B'.indexOf(data.dataType) !== -1 &&
            data.parentId !== 'G0' &&
            configData.showAdd
          "
          @click.stop="handleAssociated(data)"
          ><i class="iconfont icon-guanxiguanlian"></i
        ></apiot-button>
      </el-tooltip>
      <el-tooltip
        content="解绑"
        placement="top"
        :enterable="false"
        transition="none"
      >
        <apiot-button
          type="text"
          v-if="
            'A,B,C'.indexOf(data.dataType) !== -1 &&
            data.parentId !== 'G0' &&
            configData.showAdd
          "
          @click.stop="handleUnbundling"
          ><i class="iconfont icon-jiechuguanlian"></i
        ></apiot-button>
      </el-tooltip>
    </div>

    <apiot-table-dialog
      append-to-body
      :title="tooltipTitle(data)"
      :columnArr="columnArr"
      :multiExpressionArr.sync="multiExpressionArr"
      :getList="getPopupsList"
      :paramsObj="paramsObj"
      :visible.sync="tableVisible"
      :show="tableVisible"
      :showRadio="false"
      @sure-click="handleSubmit"
    ></apiot-table-dialog>
  </div>
</template>

<script>
import {
  associatedPhenomenon,
  batchDelete,
  deleteAssociated,
  measureList,
  phenomenonList,
  reasonList
} from '@/api/menuConfig';
import measuresImg from '@/assets/img/measures.svg';
import phenomenonImg from '@/assets/img/phenomenon.svg';
import whyImg from '@/assets/img/why.svg';
import { measuresColumn, phenomenonColumn, whyColumn } from './CurrentData.js';

import compMixin from '../../compMixin';

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
    }
  },
  mixins: [compMixin],
  data() {
    return {
      showBtns: false,
      panelObj: null,
      // 弹出框
      multiExpressionArr: [],
      tableVisible: false,
      paramsObj: {},
      columnArr: []
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
    tooltipTitle() {
      return function (item) {
        if (item.dataType === 'G') {
          return '关联现象';
        }
        if (item.dataType === 'A') {
          return '关联原因';
        }
        if (item.dataType === 'B') {
          return '关联措施';
        }
        return '';
      };
    },
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
        if (flag === 1) {
          return 'icon-fenzuchangtai';
        }
        if (flag === 2) {
          return '#FAB71C';
        }
        if (item.dataType === 'A') {
          return phenomenonImg;
        }
        if (item.dataType === 'B') {
          return whyImg;
        }
        if (item.dataType === 'C') {
          return measuresImg;
        }
        return '';
      };
    }
  },

  components: {},

  methods: {
    // 弹出框值
    async getPopupsList(params) {
      let popupsList = [];
      if (this.data.dataType === 'G') {
        popupsList = await phenomenonList(params);
      }
      if (this.data.dataType === 'A') {
        popupsList = await reasonList(params);
      }
      if (this.data.dataType === 'B') {
        popupsList = await measureList(params);
      }
      return popupsList;
    },
    // 弹出框__确定
    async handleSubmit() {
      console.log(1111);
      this.selectTreeNode();
      if (this.multiExpressionArr.length === 0) {
        return this.$message({
          type: 'warning',
          message: this.$t('common.placeSelectData')
        });
      }
      const arr = [];
      this.multiExpressionArr.forEach((item) => {
        const { keyCode, name, id } = item;
        arr.push({
          keycode: keyCode,
          name,
          nodeTableId: id
        });
      });
      await associatedPhenomenon({
        nodes: arr,
        dataType: this.data.dataType,
        parentKeycode: this.data.id
      });
      // 更新当前树
      // this.$bus.$emit
      // ('reloadArea', 'treeUpdate', this.onlyFlag(), this.configData.compId, 1, true);
      this.$bus.$emit('reloadArea', 'all', this.onlyFlag());
      this.tableVisible = false;
    },
    // 关联
    handleAssociated() {
      if (this.data.dataType === 'G') {
        this.columnArr = phenomenonColumn;
      }
      if (this.data.dataType === 'A') {
        this.columnArr = whyColumn;
      }
      if (this.data.dataType === 'B') {
        this.columnArr = measuresColumn;
      }
      this.tableVisible = true;
    },
    // 解绑
    async handleUnbundling() {
      this.selectTreeNode();
      this.$confirm('是否确定解绑故障', this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      }).then(async () => {
        try {
          // if (this.data.childCount > 0) {
          //   return this.$message({
          //     type: 'warning',
          //     message: '当前树下存在子集，不能删除'
          //   });
          // }
          await deleteAssociated({
            childId: this.data.id,
            parentId: this.data.parentId
          });
          this.$message({
            type: 'success',
            message: '解绑成功'
          });
          // this.$emit('deleteSuccess');
          // console.log(this.data, this.node);
          this.$bus.$emit('reloadArea', 'all', this.onlyFlag());
        } catch (error) {
          this.$message({
            type: 'warning',
            message: '解绑失败'
          });
        }
      });
    },
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
          } else if (item.mainComp.type === 3) {
            panelObj.panelFixData[item.paneComp.compId] = this.resolveFormula(
              true,
              item.mainComp.fixedValue
            );
          } else {
            panelObj.panelFixData[item.paneComp.compId] = this.getAllForm()[item.mainComp.compId];
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
    async deleteData() {
      this.selectTreeNode();
      if (!this.node.isLeaf) {
        return this.$message({
          type: 'warning',
          message: '存在子节点'
        });
      }
      if (this.data.childCount) {
        return this.$message({
          type: 'warning',
          message: '存在子节点'
        });
      }
      await this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      const params = {
        ids: this.data.id,
        tableName: +this.data.dataType === 1 ? 'sys_position' : 'sys_device',
        userId: this.$store.state.userCenter.userInfo.id
      };
      await batchDelete(params);
      this.$message({
        type: 'success',
        message: '删除成功'
      });
      this.$emit('deleteSuccess');
    }
  }
};
</script>

<style lang='scss' scoped>
.treeNode {
  display: flex;
  align-items: center;
  width: 100%;
  height: 32px;
  line-height: 16px;
  &__content {
    width: calc(100% - 100px);
    flex: 1;
    display: inline-flex;
    align-items: center;
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
    &--img {
      width: 16px;
      height: 16px;
    }
  }
  &__btns {
    margin-right: 8px;
  }
}
</style>
