<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    :prop="configData.dataSource.columnName"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span
          :class="[
            {
              'is-required': areaData.lineEditable && configData.shouldRequired,
            },
          ]"
        >
          {{ configData.name }}
        </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <FilterCol
        ref="filterCol"
        :configData="configData"
        :grandFather="grandFather"
      ></FilterCol>
    </template>
    <div slot-scope="scope">
      <div
        class="column__editable"
        v-if="
          areaData.lineEditable &&
          showCell === `${scope.column.id}_${scope.row.unique}`
        "
      >
        <apiot-input
          v-model="tableData[scope.$index][configData.compId]"
          :placeholder="configData.placeholder"
          readonly
          :disabled="configData.canReadonly"
        >
        </apiot-input>
        <i
          class="iconfont icon-quanshan"
          @mouseenter="showDelete = true"
          @mouseleave="showDelete = false"
          v-if="
            !isConfig &&
            !configData.canReadonly &&
            parent.form[configData.compId]
          "
          v-show="showDelete"
          @click="deleteSel(scope.$index)"
        ></i>
        <i
          class="iconfont icon-jiahao"
          @click="showPanelDialog(scope.$index)"
        ></i>
        <div
          class="showData"
          @mouseenter="showDelete = true"
          @mouseleave="showDelete = false"
          v-if="scope.row[`${configData.compId}_`]"
        >
          {{ getContent(scope.row[`${configData.compId}_`]) }}
        </div>
      </div>
      <div
        class="column__notEditable"
        :class="[{ hasMenu: showMenuColor }]"
        v-else
        @click="jumpMenu"
      >
        {{ getContent(scope.row[`${configData.compId}_`]) }}
      </div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  name: '',
  mixins: [tableCol],
  data() {
    return {
      panelObj: null, // 面板相关信息
      showPanel: false,
      curIndex: -1,
      showDelete: false
    };
  },

  computed: {
    getRelateColumnName() {
      const relateName = this.configData.dataSource.relateName.split('(')[0];
      const index = this.grandFather.relateTableArr.findIndex(
        (relate) => relate.relateName === relateName
      );
      if (index !== -1) {
        return this.grandFather.relateTableArr[index].conditionArr[0][0].secondLineColumn
          .columnName;
      }
      return 'id';
    },
    showMenuColor() {
      if (this.isConfig) {
        return false;
      }
      if (!this.getMenu()) {
        return false;
      }
      const curMenuArr = this.getMenu()[this.configData.compId];
      if (!curMenuArr) {
        return false;
      }
      return true;
    },
    // 是否需要点击打开菜单
    hasMenu() {
      if (this.isConfig) {
        return false;
      }
      if (!this.getMenu()) {
        return false;
      }
      const curMenuArr = this.getMenu()[this.configData.compId];
      if (!curMenuArr) {
        return false;
      }
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        // console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      return obj;
    },
    getDictObj() {
      if (this.configData.dataSource) {
        const { dictKey } = this.configData.dataSource.dictObj;
        if (dictKey) {
          const tempData = this.$store.getters.getCurDict(dictKey);
          const obj = {};
          if (Array.isArray(tempData) && tempData.length) {
            tempData.forEach((dict) => {
              obj[dict.value] = dict;
            });
          }
          return obj;
        }
      }
      return '';
    },
    // 获取字典结果
    getContent() {
      return (v) => {
        if (this.configData.enableDict && this.getDictObj && this.getDictObj[v]) {
          return this.getDictObj[v].name;
        }
        return v;
      };
    }
  },

  components: {},

  created() {},

  inject: ['getAllForm', 'getPanel', 'getMenu', 'onlyFlag', 'sysMenuDesignId'],

  methods: {
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
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
          panelObj.panelFixData[item.paneComp.compId] = this.getAllForm()[item.mainComp.compId];
        }
      });

      panelObj.panelCompId = this.configData.compId;
      panelObj.relationMenuDesignId = this.sysMenuDesignId();
      panelObj.onlyFlag = this.onlyFlag();
      if (this.configData.dialogTitle) {
        panelObj.panelName = this.configData.dialogTitle;
      } else {
        panelObj.panelName = `请选择${this.configData.name}`;
      }
      return panelObj;
    },
    showPanelDialog(index) {
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      // console.log(this.panelObj);
      if (this.panelObj && this.panelObj.panelName) {
        this.curIndex = index;
        // this.$nextTick(() => {
        //   this.$refs.panelDialog.initSelData(
        //     this.getRelateColumnName,
        //     this.tableData[index][this.configData.compId]
        //   );
        // });
        this.$emit(
          'showPanelDialog',
          index,
          this.panelObj,
          this.getRelateColumnName,
          this.configData
        );
      }
    },
    jumpMenu() {
      if (!this.getMenu()) {
        return;
      }
      const curMenuArr = this.getMenu()[this.configData.compId];
      if (!curMenuArr) {
        return;
      }
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        // console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        const menu = this.$store.getters.getCurMenu(obj.id);
        if (menu) {
          const curMenu = JSON.parse(JSON.stringify(menu));
          curMenu.path = `${curMenu.path}&isJump=1`;
          obj.menuVarObj = {};
          obj.menuFilter.forEach((item) => {
            if (item.termParams) {
              const arr = item.termParams.split(',');
              obj.menuVarObj[item.compId] = {};
              arr.forEach((compId) => {
                obj.menuVarObj[item.compId][compId] = this.getAllForm()[compId];
              });
            }
          });
          const menuObj = sessionStorage.jumpMenuObj ? JSON.parse(sessionStorage.jumpMenuObj) : {};
          menuObj[obj.id] = obj;
          sessionStorage.jumpMenuObj = JSON.stringify(menuObj);
          this.$bus.$emit('changeMenuTab', curMenu);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限'
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单'
        });
      }
    },
    setDataSel(arr, row) {
      row[this.configData.compId] = `${arr[0][this.getRelateColumnName]}`;
      if (arr.length) {
        row[`${this.configData.compId}_`] = arr[0][this.configData.dataSource.columnName];
      }
      this.showPanel = false;
    },
    // 删除选中
    deleteSel(index) {
      this.tableData[index][this.configData.compId] = '';
      this.tableData[index][`${this.configData.compId}_`] = '';
      this.configData.selData = [];
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../col.scss';

.column__editable {
  display: flex;
  align-items: center;

  &:hover {
    ::v-deep {
      .icon-jiahao {
        border-color: $--color-primary;
        background-color: #edf3fe;
        color: $--color-primary;
      }
      input {
        border-color: $--color-primary !important;
      }
    }
  }
  ::v-deep {
    .el-input input {
      border: 1px solid #e9e9e9;
      padding-right: 31px;
    }
    .el-input-group__append {
      padding: 0;
      border: 1px solid #e9e9e9;
      border-left: 0;
      background-color: #fff;
      line-height: 14px;
      .iconfont {
        font-size: 13px;
        color: #aaaaaa;
      }
      &:hover {
        .iconfont {
          color: $--color-primary;
        }
      }
    }
  }
  .icon-jiahao {
    border-left: 1px solid #e9e9e9;
    position: absolute;
    right: 1px;
    top: 3px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #aaaaaa;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
  .icon-quanshan {
    position: absolute;
    z-index: 1;
    font-size: 13px;
    right: 30px;
    margin-top: 1px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #aaaaaa;
    color: rgba(0, 0, 0, 0.29);
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    &:hover {
      color: rgba(0, 0, 0, 0.6);
    }
  }
  .showData {
    position: absolute;
    left: 12px;
    right: 42px;
    margin-top: 0px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
.column__notEditable {
  &.hasMenu {
    cursor: pointer;
    color: $--color-primary;
  }
}
</style>
