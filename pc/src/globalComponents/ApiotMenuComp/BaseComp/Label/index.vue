<template>
  <div
    class="label"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isCard: !isConfig && isCard },
      { isTable: isTable },
      { isConfigId: isConfig && configData.labelNotChange },
      {
        showTablename:
          isConfig &&
          isMultiTree &&
          configData.dataSource &&
          configData.dataSource.tableName,
      },
    ]"
    :tablename="configData.dataSource && configData.dataSource.tableName"
    v-if="showInput"
  >
    <span
      class="span-box"
      :style="getStyle"
      v-if="!isTable"
      @click="labelClick"
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
      <span class="span-box__labelName" v-if="configData.showLabelTitle">
        {{ configData.name }}
      </span>
      <span v-if="configData.showLabelTitle">：</span>
      <span
        class="span-box__content"
        v-for="(item, i) in getContentArr"
        :key="i"
        :style="getItemStyle(item)"
      >
        <i
          v-if="configData.enableDictIcon && getDictInfo(item, 'icon')"
          :class="`iconfont ${getDictInfo(item, 'icon').icon} m-r-2`"
          :style="`color:${getDictInfo(item, 'icon').color}`"
        ></i>
        <span>{{ getDictInfo(item, 'name') || item }}</span>
      </span>
      <el-tooltip
        :content="configData.helpInfo"
        placement="top"
        v-if="configData.helpInfo.length"
      >
        <i class="iconfont icon-bangzhu" />
      </el-tooltip>
    </span>
    <div class="table" v-else>
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw">数据占位</p>
    </div>
    <config-manage
      v-if="isConfig && !configData.labelNotChange"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
    <component
      :is="configData.dialogName"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
    ></component>
  </div>
</template>

<script>
import { selectList } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  props: {
    labelValue: {
      default: ''
    }
  },
  data() {
    return {
      curCompType: 2,
      panelObj: null, // 面板相关信息
      showPanel: false,
      unwatch: null
    };
  },
  mixins: [compMixin],

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

  components: {},

  computed: {
    getDictKey() {
      if (this.configData.dataSource.dictObj) {
        return this.configData.dataSource.dictObj.dictKey;
      }
      return '';
    },
    getDictArr() {
      let tempData = [];
      if (
        this.isConfig &&
        this.configData.dataSource.dictObj &&
        this.configData.dataSource.dictObj.id
      ) {
        tempData = this.configData.dataSource.dictObj.dictValue;
      } else if (this.getDictKey) {
        tempData = this.$store.getters.getCurDict(this.getDictKey);
      }
      if (Array.isArray(tempData)) {
        tempData = JSON.parse(JSON.stringify(tempData));
        if (this.configData.sort === 2) {
          tempData.reverse();
        }
        if (tempData.length) {
          return tempData;
        }
      }
      if (this.isConfig) {
        return [
          {
            name: '选项1',
            value: 1
          },
          {
            name: '选项2',
            value: 2
          }
        ];
      }
      return [];
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
    // 获取内容，主要获取单选选择框多选选择框的内容
    getContent() {
      if (this.isConfig) {
        if (this.configData.labelNotChange) {
          return '自增主键';
        }
        return 'label占位';
      }
      // 所有其他
      if (this.isCard || this.isTree) {
        if (+this.configData.dataSource.columnTypeDict === 3) {
          if (this.configData.timeShowType === 1) {
            return this.labelValue.toString().slice(0, 10);
          }
        }
        return this.labelValue;
      }
      if (this.configData.dataSource.relateName === '主表') {
        if (this.configData.enableMultiColumn) {
          // 数据多选框
          return this.parent.form[`${this.configData.compId}_`];
        }
      } else {
        // 数据单选框
        return this.parent.form[`${this.configData.compId}_`];
      }
      if (+this.configData.dataSource.columnTypeDict === 3) {
        if (this.configData.timeShowType === 1) {
          return this.parent.form[`${this.configData.compId}`].slice(0, 10);
        }
      }
      return this.parent.form[`${this.configData.compId}`];
    },
    // 获取内容数组
    getContentArr() {
      if (this.configData.enableMultiColumn && this.getContent) {
        return this.getContent.toString().split(',');
      }
      if (this.getContent !== '') {
        return [this.getContent];
      }
      return [];
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
    getStyle() {
      let style = '';
      if (this.shouldOpenPanel || this.hasMenu) {
        style += 'cursor:pointer;';
      }
      if (this.configData.font) {
        if (this.configData.font.color) {
          style += `color:${this.configData.font.color};`;
        }
        if (this.configData.font.size) {
          style += `font-size:${this.configData.font.size}px;`;
        }
        if (this.configData.font.style === 2) {
          style += 'font-weight:700;';
        }
        if (this.configData.labelBg.style !== 0) {
          if (this.grandFather && this.grandFather.compName === 'MenuMain') {
            style += 'padding-top:6px;padding-bottom:6px;height:auto;line-height:1;';
          } else {
            style += 'height:22px;line-height:22px;';
          }
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
    // 是不是多表树下级
    isMultiTree() {
      if (this.grandFather && this.grandFather.compName === 'MultiTree') {
        return true;
      }
      return false;
    }
  },

  mounted() {
    if (!this.isConfig) {
      if (this.grandFather && this.grandFather.compName === 'MenuMain') {
        this.unwatch = this.$watch(
          `parent.form.${this.configData.compId}`,
          async (v) => {
            let tempId = 'id';
            let selectWhere = '';
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
                    } else if (this.configData.dataSource.relateName === '主表') {
                      if (this.configData.enableMultiColumn) {
                        // 数据多选框
                        if (v && !this.parent.form[`${this.configData.compId}_`]) {
                          selectWhere += `${item.secondLineTable.tableName}.${item.secondLineColumn.columnName} in (${v})`;
                        }
                      }
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
            if (this.configData.dataSource.relateName === '主表') {
              if (this.configData.enableMultiColumn) {
                // 数据多选框
                if (v && !this.parent.form[`${this.configData.compId}_`]) {
                  const params = {
                    selectContent: `${this.configData.multiTable.column.columnName},${tempId}`,
                    selectFrom: this.configData.multiTable.table.tableName,
                    selectWhere:
                      selectWhere ||
                      `${this.configData.multiTable.table.tableName}.${tempId} in (${v})`
                  };
                  const data = await selectList(params);
                  let str = '';
                  data.forEach((value) => {
                    str += `${value[this.configData.multiTable.column.columnName]},`;
                  });
                  if (str) {
                    str = str.slice(0, -1);
                  }
                  this.parent.form[`${this.configData.compId}_`] = str;
                }
              }
            } else if (v && !this.parent.form[`${this.configData.compId}_`]) {
              const params = {
                selectContent: `${this.configData.dataSource.columnName},${tempId}`,
                selectFrom: this.configData.dataSource.tableName,
                selectWhere: selectWhere || `${this.configData.dataSource.tableName}.${tempId}=${v}`
              };
              const data = await selectList(params);

              this.parent.form[`${this.configData.compId}_`] = data[0]
                ? data[0][this.configData.dataSource.columnName]
                : '';
            }
          },
          {
            immediate: true
          }
        );
      }
    }
  },

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
      if (this.isConfig) {
        return false;
      }
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
.label {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  min-height: 44px;
  overflow: hidden;
  line-height: 1;
  &.showTablename::before {
    content: attr(tablename);
    position: absolute;
    font-size: 12px;
    color: $--color-primary;
    top: 0;
    left: 0;
    right: 0;
    height: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.noHover {
    min-height: 28px;
    padding: 0px 15px 0px 15px;
  }
  &.isConfigId {
    min-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
    line-height: 36px;
    padding-top: 9px;
    span {
      color: #999999;
    }
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
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    // &__labelName {
    //   max-width: 50px;
    //   overflow: hidden;
    //   text-overflow: ellipsis;
    //   white-space: nowrap;
    // }
    &.textDec {
      text-decoration: underline;
      cursor: pointer;
    }
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
}
.label.isCard {
  padding: 0;
  min-height: 12px;
  line-height: 1;
  .span-box {
    margin-top: 0;
    margin-bottom: 6px;
  }
}

.appMenu {
  &__icon {
    width: 18px;
    height: 18px;
    line-height: 18px;
    margin-right: 4px;
    .full {
      display: block;
      width: 18px;
      height: 18px;
      font-size: 18px;
    }
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
</style>
