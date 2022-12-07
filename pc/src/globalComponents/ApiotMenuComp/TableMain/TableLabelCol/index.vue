<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="configData.dataSource.columnName"
  >
    <template slot="header">
      <span class="columnHeader__box">
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
        v-if="configData.enableTableSearch"
      ></FilterCol>
    </template>
    <div slot-scope="scope">
      <SelectBox
        :curData="scope.row"
        :getIdCompId="getIdCompId"
        :multiEntityArr="multiEntityArr"
        v-if="
          !(
            areaData.lineEditable &&
            showCell === `${scope.column.id}_${scope.row.unique}`
          )
        "
        v-on="$listeners"
        v-bind="$attrs"
      ></SelectBox>
      <div
        class="column__notEditable"
        :class="[{ hasMenu: showMenuColor }, { textDec: shouldOpenPanel }]"
        @click="labelClick(scope.row)"
        v-if="configData.labelShowStyle !== 2"
      >
        <div
          class="appMenu__icon"
          v-if="
            configData.enableIcon &&
            (configData.icon.imageUrl || configData.icon.icon)
          "
        >
          <img
            :src="$parseImgUrl(configData.icon.imageUrl)"
            alt=""
            v-if="configData.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${configData.icon.icon}`"
            :style="`color: ${configData.icon.color}`"
          ></i>
        </div>
        <span
          class="span-box__content"
          v-for="(item, i) in getContentArr(scope.row)"
          :key="i"
          :style="getItemStyle(item)"
        >
          <i
            v-if="configData.enableDictIcon && getDictInfo(item, 'icon')"
            :class="`iconfont ${getDictInfo(item, 'icon').icon} m-r-2`"
            :style="`color:${getDictInfo(item, 'icon').color}`"
          ></i>
          <span :style="getStyle">{{
            configData.enableDict
              ? getDictInfo(item, 'name') || (+item === 0 ? '' : item)
              : item
          }}</span>
          <span v-if="i !== getContentArr(scope.row).length - 1">{{
            configData.enableCascade ? '/' : ','
          }}</span>
        </span>
      </div>
      <div class="column__notEditable" @click="labelClick(scope.row)" v-else>
        <el-tooltip
          :content="`${configData.name}:${scope.row[configData.compId]}`"
          placement="top"
          :enterable="false"
          transition="none"
          v-show="scope.row[configData.compId]"
        >
          <i
            class="iconfont icon-xiaoshuidi"
            :style="`color:${configData.waterColor};cursor:pointer`"
          />
        </el-tooltip>
      </div>
    </div>
    <component
      :is="configData.dialogName"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
    ></component>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  props: {
    getIdCompId: {
      type: String
    },
    multiEntityArr: {
      type: Array,
      default: () => []
    }
  },
  name: '',
  mixins: [tableCol],
  data() {
    return {
      panelObj: null, // 面板相关信息
      showPanel: false
    };
  },
  components: {},
  computed: {
    // 获取内容数组
    getContentArr() {
      return (data) => {
        let content = data[`${this.configData.compId}`];
        if (this.configData.enableCascade) {
          if (content) {
            const arr = [];
            content.split(',').forEach((item) => {
              const tempArr = item.split('(');
              if (tempArr.length) {
                const name = tempArr[0];
                arr.push(name);
              }
            });
            if (arr.length) {
              return arr;
            }
          }
        }
        if (this.configData.dataSource.relateName === '主表') {
          if (this.configData.enableMultiColumn) {
            // 数据多选框
            content = data[`${this.configData.compId}_`];
          }
        } else {
          // 数据单选框
          content = data[`${this.configData.compId}_`];
        }
        if (
          (this.configData.enableMultiColumn && content) ||
          (this.configData.enableDict && content.toString().indexOf(',') !== -1)
        ) {
          return content.split(',');
        }
        if (content !== '') {
          if (+this.configData.dataSource.columnTypeDict === 3) {
            if (this.configData.timeShowType === 1 && content) {
              content = content.toString().slice(0, 10);
            }
            if (this.configData.timeShowType === 3 && content) {
              content = content.toString().slice(0, -3);
            }
          }
          if (+this.configData.dataSource.columnTypeDict === 1) {
            if (this.configData.numberShowType === 2 && content) {
              content = this.showRes(content);
            }
          }
          if (+this.configData.dataSource.columnTypeDict === 4) {
            if (this.configData.numberShowType === 2) {
              content = this.showRes(+content);
            }
          }
          return [content];
        }
        return [];
      };
    },
    // 获取dict的各个信息
    getDictInfo() {
      // info: color 背景色
      // info: fontColor 字体色
      // icon: icon 图标
      return (item, info) => {
        if (this.configData.enableDict && !this.isConfig) {
          if (this.getDictObj[item]) {
            return this.getDictObj[item][info] || '';
          }
        }
        return '';
      };
    },
    getDictObj() {
      const obj = {};
      if (this.getDictArr.length) {
        this.getDictArr.forEach((dict) => {
          obj[dict.value] = dict;
        });
      }
      return obj;
    },
    getDictKey() {
      if (this.configData.dataSource.dictObj) {
        return this.configData.dataSource.dictObj.dictKey;
      }
      return '';
    },
    getDictArr() {
      let tempData = [];
      tempData = this.$store.getters.getCurDict(this.getDictKey);
      if (Array.isArray(tempData)) {
        tempData = JSON.parse(JSON.stringify(tempData));
        if (tempData.length) {
          return tempData;
        }
      }
      return [];
    },
    getStyle() {
      let style = '';
      if (this.configData.font) {
        if (this.configData.font.color && this.configData.font.color !== '#333333') {
          style += `color:${this.configData.font.color};`;
        }
        if (this.configData.font.size) {
          style += `font-size:${this.configData.font.size}px;`;
        }
        if (this.configData.font.style === 2) {
          style += 'font-weight:700;';
        }
        if (this.configData.labelBg.style !== 0) {
          style += 'height:22px;line-height:22px;';
        }
        if (
          this.configData.labelBg.color &&
          this.configData.dataSource.relateName === '主表' &&
          !this.configData.enableMultiColumn &&
          !this.configData.enableDict
        ) {
          if (this.configData.labelBg.style !== 0) {
            style += `background:${this.configData.labelBg.color};`;
          }

          if (this.configData.labelBg.style === 1) {
            style += 'borderRadius: 4px;';
          }
          if (this.configData.labelBg.style === 2) {
            style += 'borderRadius: 100px;';
          }
        }
      }
      return style;
    },
    getItemStyle() {
      return (item) => {
        let style = '';
        if (this.configData.labelBg) {
          if (this.configData.labelBg.style !== 0) {
            style += 'padding: 0px 12px;';
            if (this.configData.enableDict) {
              style += `background:${this.getDictInfo(item, 'color')};`;
              style += `color:${this.getDictInfo(item, 'fontColor')};`;
            } else if (this.configData.labelBg.color) {
              style += `background:${this.configData.labelBg.color};`;
            }
            if (this.configData.labelBg.style === 1) {
              style += 'borderRadius: 4px;';
            }
            if (this.configData.labelBg.style === 2) {
              style += 'borderRadius: 100px;';
            }
          }
        }
        return style;
      };
    },
    // 是否需要点击打开panel
    shouldOpenPanel() {
      if (this.isConfig) {
        return false;
      }
      const panelObj = this.getPanel()[this.configData.compId];
      if (panelObj && panelObj.panelName) {
        return true;
      }
      return false;
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
    }
  },
  inject: [
    'resolveFormula',
    'getAllForm',
    'getPanel',
    'getMenu',
    'getFatherPanel',
    'onlyFlag',
    'sysMenuDesignId',
    'getInitComp',
    'resolveTerm'
  ],
  mounted() {},
  methods: {
    // 处理结果
    showRes(value) {
      let inputValue = value.toString();
      const index = inputValue.indexOf('.');
      if (index !== -1) {
        const intNum = inputValue.substring(0, index).replace(/\B(?=(?:\d{3})+$)/g, ',');
        const dot = inputValue.substring(index, inputValue.length);
        inputValue = intNum + dot;
      } else {
        inputValue = inputValue.substring(0, inputValue.length).replace(/\B(?=(?:\d{3})+$)/g, ',');
      }
      return inputValue;
    },
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        panelObj.panelVarObj = {};

        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] = this.getAllForm()[compId];
          });
          if (item.relateDataComp) {
            panelObj.relateDataComp = {};
            panelObj.relateDataComp[item.compId] = {};
            panelObj.relateDataComp[item.compId].value =
              this.getAllForm()[item.relateDataComp.compId];
            panelObj.relateDataComp[item.compId].tableName = item.relateDataComp.tableName;
          }
          if (item.relateBusiComp) {
            panelObj.relateBusiComp = {};
            panelObj.relateBusiComp[item.compId] = {};
            panelObj.relateBusiComp[item.compId].value =
              this.getAllForm()[item.relateBusiComp.compId];
            panelObj.relateBusiComp[item.compId].tableName = item.relateBusiComp.tableName;
          }
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
        if (this.configData.dialogTitle) {
          panelObj.panelName = this.configData.dialogTitle;
        }
        return panelObj;
      }
      return null;
    },
    labelClick(rowData) {
      this.$bus.$emit('selectTableLine', this.grandFather.compId, rowData);
      const { relateType } = this.configData;
      if (!relateType || relateType === 1) {
        this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
        if (this.panelObj && this.panelObj.panelName) {
          this.showPanel = true;
        }
      } else if (relateType === 2) {
        this.jumpMenu();
      }
    },
    jumpMenu() {
      if (this.$route.name === 'sharePage') {
        return this.$message({
          type: 'warning',
          message: '分享页面无跳转菜单的权限'
        });
      }
      const curMenuArr = this.getMenu()[this.configData.compId];
      const obj = curMenuArr.find((menu) => {
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        console.log(res);
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
                curMenu.path = `${curMenu.path}&${compId}=${this.getAllForm()[compId]}`;
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
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../col.scss';
.column__notEditable {
  display: flex;
  height: 24px;
  line-height: 24px;
  align-items: center;
  &.textDec {
    // text-decoration: underline;
    cursor: pointer;
  }
  &.hasMenu {
    cursor: pointer;
    color: $--color-primary;
  }
  .appMenu__icon {
    margin-right: 4px;
    .full {
      width: 24px;
      height: 24px;
      font-size: 24px;
      vertical-align: bottom;
    }
  }
  .span-box__content {
    display: flex;
    align-items: center;
    height: 24px;
  }
}
</style>
