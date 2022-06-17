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
        </el-tooltip> </span
    ></template>
    <div slot-scope="scope">
      <!-- :class="[{ textDec: shouldOpenPanel }]" -->
      <div
        class="column__notEditable"
        :class="[{ hasMenu: showMenuColor }]"
        @click="labelClick"
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
            :src="configData.icon.imageUrl"
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
          <span :style="getStyle">{{ getDictInfo(item, 'name') || item }}</span>
        </span>
      </div>
      <div class="column__notEditable rr" @click="labelClick" v-else>
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
        if (this.configData.dataSource.relateName === '主表') {
          if (this.configData.enableMultiColumn) {
            // 数据多选框
            content = data[`${this.configData.compId}_`];
          }
        } else {
          // 数据单选框
          content = data[`${this.configData.compId}_`];
        }
        if (this.configData.enableMultiColumn && content) {
          return content.split(',');
        }
        if (content !== '') {
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
      return this.configData.dataSource.dictObj.dictKey;
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
    labelClick() {
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
              });
            }
          });
          const menuObj = {};
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
  height: 18px;
  line-height: 18px;
  align-items: center;
  &.textDec {
    text-decoration: underline;
    cursor: pointer;
  }
  &.hasMenu {
    cursor: pointer;
    color: $--color-primary;
  }
  .appMenu__icon {
    margin-right: 4px;
    .full {
      width: 18px;
      height: 18px;
      font-size: 18px;
      vertical-align: bottom;
    }
  }
  .span-box__content {
    display: flex;
    align-items: center;
    height: 18px;
  }
}
</style>
