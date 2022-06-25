<template>
  <div
    class="dataSingleSel"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
      { disabled: configData.canReadonly },
    ]"
    v-if="showInput"
  >
    <el-form-item :prop="`${configData.compId}`" v-if="!isTable">
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <apiot-input
        v-model="parent.form[configData.compId]"
        :placeholder="configData.placeholder"
        readonly
        :disabled="configData.canReadonly"
      >
      </apiot-input>
      <i
        class="el-icon-circle-close"
        @mouseenter="showDelete = true"
        @mouseleave="showDelete = false"
        v-if="
          !isConfig && !configData.canReadonly && parent.form[configData.compId]
        "
        v-show="showDelete"
        @click="deleteSel"
      ></i>
      <i
        class="iconfont icon-jiahao"
        @click="showPanelDialog"
        :class="[{ disabled: configData.canReadonly }]"
      ></i>
      <div
        class="dataSingleSel__showData"
        :class="[{ disabled: configData.canReadonly }, { hasMenu: hasMenu }]"
        v-if="parent.form[configData.compId]"
        @mouseenter="showDelete = true"
        @mouseleave="showDelete = false"
        @click="jumpMenu"
      >
        {{ getContent(parent.form[`${configData.compId}_`]) }}
      </div>
    </el-form-item>
    <div class="table" v-else>
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw">数据占位</p>
    </div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
    <!-- <transition name="slide-bottom"> -->
    <Panel-dialog
      ref="panelDialog"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
      @setDataSel="setDataSel"
    ></Panel-dialog>
    <!-- </transition> -->
  </div>
</template>

<script>
import { selectList } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      panelObj: null, // 面板相关信息
      showPanel: false,
      curData: [],
      unwatch: null,
      showDelete: false
    };
  },
  mixins: [compMixin],

  components: {},

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
          if (tempData.length) {
            tempData.forEach((dict) => {
              obj[dict.value] = dict;
            });
          }
          return obj;
        }
      }
      return '';
    },
    getContent() {
      return (v) => {
        if (this.configData.enableDict && this.getDictObj && this.getDictObj[v]) {
          return this.getDictObj[v].name;
        }
        return v;
      };
    }
  },

  mounted() {
    if (!this.isConfig) {
      this.unwatch = this.$watch(
        `parent.form.${this.configData.compId}`,
        async (v) => {
          // console.log(this.configData);
          if (v && !this.parent.form[`${this.configData.compId}_`]) {
            let tempId = 'id';
            let selectWhere = `${this.configData.dataSource.tableName}.${tempId}=${v}`;
            if (this.grandFather && this.grandFather.relateTableArr) {
              const relateName = this.configData.dataSource.relateName.split('(')[0];
              const index = this.grandFather.relateTableArr.findIndex(
                (relate) => relate.relateName === relateName
              );
              if (index !== -1) {
                const { secondLineColumn } =
                  this.grandFather.relateTableArr[index].conditionArr[0][0];
                tempId = secondLineColumn.columnName;
                selectWhere = '';
                this.grandFather.relateTableArr[index].conditionArr.forEach((orArr, j) => {
                  selectWhere += '';
                  orArr.forEach((item, i) => {
                    if (i === 0) {
                      selectWhere += '(';
                    }
                    if (item.secondIsValue) {
                      selectWhere += `${item.firstLineTable.tableName}.${item.firstLineColumn.columnName}=${item.secondLineValue}`;
                    } else {
                      selectWhere += `${item.secondLineTable.tableName}.${item.secondLineColumn.columnName}=${v}`;
                    }
                    if (i !== orArr.length - 1) {
                      selectWhere += ' or ';
                    } else {
                      selectWhere += ')';
                    }
                  });
                  if (j !== this.grandFather.relateTableArr[index].conditionArr.length - 1) {
                    selectWhere += ' and ';
                  }
                });
              }
            }
            const params = {
              selectContent: `${tempId},${this.configData.dataSource.columnName}`,
              selectFrom: this.configData.dataSource.tableName,
              selectWhere
            };
            const data = await selectList(params);
            if (data.length !== 0 && data[0][this.configData.dataSource.columnName]) {
              this.parent.form[`${this.configData.compId}_`] =
                data[0][this.configData.dataSource.columnName];
            } else {
              this.parent.form[`${this.configData.compId}_`] = '';
            }
          }
        },
        {
          immediate: true
        }
      );
    }
  },
  inject: ['getAllForm', 'getPanel', 'getMenu', 'onlyFlag', 'sysMenuDesignId'],
  methods: {
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj) {
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
      }
      return null;
    },
    showPanelDialog() {
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      // console.log(this.panelObj);
      if (this.panelObj && this.panelObj.panelName) {
        this.$refs.panelDialog.initSelData(
          this.getRelateColumnName,
          this.parent.form[this.configData.compId]
        );
        this.showPanel = true;
      }
    },
    jumpMenu() {
      const curMenuArr = this.getMenu()[this.configData.compId];
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
        console.log(obj);
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
    setDataSel(arr) {
      // console.log(arr);
      // console.log(this.grandFather, this.configData.dataSource);

      this.parent.form[this.configData.compId] = `${arr[0][this.getRelateColumnName]}`;

      if (arr.length) {
        this.parent.form[`${this.configData.compId}_`] =
          arr[0][this.configData.dataSource.columnName];
      }
      this.showPanel = false;
      this.configData.selData = arr;
    },
    // 删除选中
    deleteSel() {
      this.parent.form[this.configData.compId] = '';
      this.parent.form[`${this.configData.compId}_`] = '';
      this.configData.selData = [];
    }
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  }
};
</script>

<style lang='scss' scoped>
.dataSingleSel {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 82px;
  overflow: hidden;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 15px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
    }
    &:not(.disabled) > .el-form-item {
      & .el-form-item__content:hover {
        .icon-jiahao {
          border-color: $--color-primary;
          background-color: #edf3fe;
          color: $--color-primary;
        }
        input {
          border-color: $--color-primary !important;
        }
      }
      & > .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
      & > .el-form-item__content .el-input input {
        border: 1px solid #e9e9e9;
        padding-right: 31px;
      }
    }
  }
  .icon-jiahao {
    border-left: 1px solid #e9e9e9;
    position: absolute;
    margin-left: -32px;
    margin-top: 1px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #aaaaaa;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
    &:not(.disabled):hover {
      color: $--color-primary;
    }
    &.disabled {
      cursor: default;
    }
  }
  .el-icon-circle-close {
    position: absolute;
    font-size: 13px;
    z-index: 1;
    margin-left: -64px;
    margin-top: 1px;
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #c0c4cc;
    border-radius: 0 4px 4px 0;
    cursor: pointer;
  }
  &__showData {
    position: absolute;
    left: 12px;
    right: 42px;
    margin-top: -31px;
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &.hasMenu {
      color: $--color-primary;
      cursor: pointer;
    }
    &.disabled {
      background-color: #f5f7fa;
      color: #c0c4cc;
    }
  }
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    p {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    p:nth-child(2) {
      color: #333;
      border-top: 1px solid #e9e9e9;
    }
  }
}
</style>
