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
      { isMenuManin: grandFather && grandFather.compName === 'MenuMain' },
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
    v-show="canShowLable && !isUser"
  >
    <span
      class="span-box"
      :style="getStyle"
      v-if="
        grandFather &&
        grandFather.compName !== 'TableMain' &&
        grandFather.compName !== 'GanttMain' &&
        grandFather.compName !== 'TreeTable' &&
        (grandFather.compName === 'MenuMain'
          ? configData.labelNotChange
          : true) &&
        (grandFather.compName === 'CardForm'
          ? isConfig
            ? true
            : configData.labelNotChange
          : true)
      "
      @click="labelClick"
    >
      <div
        class="appMenu__icon"
        v-if="
          configData.enableIcon &&
          (configData.icon.imageUrl || configData.icon.icon) &&
          configData.dropDownStyle !== 4
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
      <span class="span-box__labelName" v-if="configData.showLabelTitle">
        {{ configData.name }}
      </span>
      <span v-if="configData.showLabelTitle && configData.dataSourceType !== 2"
        >：</span
      >
      <span
        class="span-box__content"
        :class="[
          {
            font__ellipsis:
              configData.ellipsis || configData.ellipsis !== false,
          },
        ]"
        v-for="(item, i) in configData.dataSourceType !== 2
          ? getContentArr
          : []"
        :key="i"
        :style="getItemStyle(item)"
        :title="getDictInfo(item, 'name') || (+item === 0 ? '' : item)"
      >
        <i
          v-if="
            configData.enableDictIcon &&
            getDictInfo(item, 'icon') &&
            (!configData.dropDownStyle || configData.dropDownStyle === 1)
          "
          :class="`iconfont ${getDictInfo(item, 'icon').icon} m-r-2`"
          :style="`color:${getDictInfo(item, 'icon').color}`"
        ></i>
        <i
          v-if="configData.enableDict && configData.dropDownStyle === 4"
          class="circle m-r-2"
          :style="`background:${getDictInfo(item, 'color')}`"
        ></i>
        <span>{{
          configData.enableDict
            ? getDictInfo(item, 'name') || (+item === 0 ? '' : item)
            : item
        }}</span>
        <span v-if="i !== getContentArr.length - 1">,</span>
      </span>
      <el-tooltip
        :content="configData.helpInfo"
        placement="top"
        v-if="configData.helpInfo.length"
      >
        <i class="iconfont icon-bangzhu" />
      </el-tooltip>
    </span>
    <div class="table" v-if="isTable">
      <p class="table__name">{{ configData.name }}</p>
      <p class="table__zw" :class="[{ isId: configData.labelNotChange }]">
        {{ configData.labelNotChange ? '自增组件' : '数据占位' }}
      </p>
    </div>
    <div
      class="label__form"
      v-if="
        grandFather &&
        grandFather.compName === 'MenuMain' &&
        !configData.labelNotChange
      "
    >
      <el-form-item :prop="`${configData.compId}`" style="margin-bottom: 0">
        <span class="span-box" slot="label">
          <span style="white-space: nowrap"> {{ configData.name }} </span>
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
          :disabled="true"
        ></apiot-input>
        <div class="label__form--content" :style="getStyle" @click="labelClick">
          <span
            class="span-box__content"
            :class="[
              {
                font__ellipsis:
                  configData.ellipsis || configData.ellipsis !== false,
              },
            ]"
            v-for="(item, i) in configData.dataSourceType !== 2
              ? getContentArr
              : []"
            :key="i"
            :style="getItemStyle(item)"
            :title="getDictInfo(item, 'name') || (+item === 0 ? '' : item)"
          >
            <i
              v-if="
                configData.enableDictIcon &&
                getDictInfo(item, 'icon') &&
                (!configData.dropDownStyle || configData.dropDownStyle === 1)
              "
              :class="`iconfont ${getDictInfo(item, 'icon').icon} m-r-2`"
              :style="`color:${getDictInfo(item, 'icon').color}`"
            ></i>
            <i
              v-if="configData.enableDict && configData.dropDownStyle === 4"
              class="circle m-r-2"
              :style="`background:${getDictInfo(item, 'color')}`"
            ></i>
            <span>{{
              configData.enableDict
                ? getDictInfo(item, 'name') || (+item === 0 ? '' : item)
                : item
            }}</span>
            <span v-if="i !== getContentArr.length - 1">,</span>
          </span>
        </div>
      </el-form-item>
    </div>
    <div
      class="label__cardForm"
      v-if="
        grandFather &&
        grandFather.compName === 'CardForm' &&
        !configData.labelNotChange &&
        !isConfig
      "
    >
      <el-form-item :prop="`${configData.compId}`" style="margin-bottom: 0">
        <span
          class="span-box"
          slot="label"
          style="width: 100%"
          :style="getCardFormTitleStyle"
        >
          <span style="white-space: nowrap; width: 100%">
            {{ configData.name }} <span v-if="getIsCardFormBg">:</span>
          </span>
          <el-tooltip
            :content="configData.helpInfo"
            placement="top"
            v-if="configData.helpInfo.length"
          >
            <i class="iconfont icon-bangzhu" />
          </el-tooltip>
        </span>
        <div :style="getStyle" @click="labelClick">
          <span
            class="span-box__content"
            :class="[
              {
                font__ellipsis:
                  configData.ellipsis || configData.ellipsis !== false,
              },
            ]"
            v-for="(item, i) in configData.dataSourceType !== 2
              ? getContentArr
              : []"
            :key="i"
            :style="getItemStyle(item)"
            :title="getDictInfo(item, 'name') || (+item === 0 ? '' : item)"
          >
            <i
              v-if="
                configData.enableDictIcon &&
                getDictInfo(item, 'icon') &&
                (!configData.dropDownStyle || configData.dropDownStyle === 1)
              "
              :class="`iconfont ${getDictInfo(item, 'icon').icon} m-r-2`"
              :style="`color:${getDictInfo(item, 'icon').color}`"
            ></i>
            <i
              v-if="configData.enableDict && configData.dropDownStyle === 4"
              class="circle m-r-2"
              :style="`background:${getDictInfo(item, 'color')}`"
            ></i>
            <span>{{
              configData.enableDict
                ? getDictInfo(item, 'name') || (+item === 0 ? '' : item)
                : item
            }}</span>
            <span v-if="i !== getContentArr.length - 1">,</span>
          </span>
        </div>
      </el-form-item>
    </div>
    <config-manage
      v-if="isConfig && !configData.labelNotChange"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
    <component
      :is="panelObj ? panelObj.dialogName : 'PanelDialog'"
      :visible.sync="showPanel"
      :showPanel="showPanel"
      :panelObj="panelObj"
      :showType="showType"
    ></component>
  </div>
</template>

<script>
import { selectList } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  props: {
    labelValue: {
      default: '',
    },
    showType: {
      type: Object,
      default() {
        return {};
      },
    },
    cardData: {
      type: Object,
    },
  },
  data() {
    return {
      curCompType: 2,
      panelObj: null, // 面板相关信息
      showPanel: false,
      unwatch: null,
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
    'resolveTerm',
    'isUser',
    'isPreview',
  ],

  components: {},

  computed: {
    // 获取是否是卡片表单的背景模式
    getIsCardFormBg() {
      if (
        this.grandFather &&
        this.grandFather.compName === 'CardForm' &&
        this.grandFather.cardType === 1
      ) {
        return true;
      }
      return false;
    },
    getCardFormTitleStyle() {
      let style = '';
      if (
        this.grandFather &&
        this.grandFather.compName === 'CardForm' &&
        this.grandFather.iconColumn
      ) {
        if (
          this.grandFather.iconColumn.style &&
          this.grandFather.iconColumn.style === 2
        ) {
          style += 'fontWeight: bold;';
        } else {
          style += 'fontWeight: normal;';
        }
        if (this.grandFather.iconColumn.color) {
          style += `color: ${this.grandFather.iconColumn.color};`;
        }
      }
      return style;
    },
    // 卡片跟树 label显示值没有就隐藏
    canShowLable() {
      if (this.isConfig) {
        return true;
      }
      if (this.isPreview) {
        return true;
      }
      if (this.isCard || this.isTree) {
        const v = this.cardData[`${this.configData.compId}_`];
        if (this.configData.dataSource.relateName === '主表') {
          if (this.configData.enableMultiColumn && !v) {
            // 数据多选框
            return false;
          }
        } else if (!v) {
          // 数据单选框
          return false;
        }
      }
      return true;
    },
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
      if (this.isConfig || this.isPreview) {
        return [
          {
            name: '选项1',
            value: 1,
          },
          {
            name: '选项2',
            value: 2,
          },
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
      if (this.isPreview) {
        if (this.grandFather && this.grandFather.compName === 'MenuMain') {
          return '';
        }
        return '数据占位';
      }
      if (this.configData.enableCascade) {
        const content =
          this.labelValue || this.parent.form[`${this.configData.compId}`];
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
            return arr.join('/');
          }
        }
      }
      // 所有其他
      if (this.isCard || this.isTree) {
        if (+this.configData.dataSource.columnTypeDict === 3) {
          if (this.configData.timeShowType === 1) {
            return this.labelValue.toString().slice(0, 10);
          }
          if (this.configData.timeShowType === 3) {
            return this.labelValue.toString().slice(0, -3);
          }
          if (this.configData.timeShowType === 4) {
            return this.labelValue.toString().slice(0, 4);
          }
          if (this.configData.timeShowType === 5) {
            return this.labelValue.toString().slice(0, 7);
          }
        }
        if (+this.configData.dataSource.columnTypeDict === 1) {
          if (this.configData.numberShowType === 2) {
            return this.showRes(this.labelValue);
          }
        }
        if (+this.configData.dataSource.columnTypeDict === 4) {
          if (this.configData.numberShowType === 2) {
            return this.showRes(+this.labelValue);
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
        if (this.configData.timeShowType === 3) {
          return this.parent.form[`${this.configData.compId}`].slice(0, -3);
        }
        if (this.configData.timeShowType === 4) {
          return this.parent.form[`${this.configData.compId}`].slice(0, 4);
        }
        if (this.configData.timeShowType === 5) {
          return this.parent.form[`${this.configData.compId}`].slice(0, 7);
        }
      }
      if (+this.configData.dataSource.columnTypeDict === 1) {
        if (this.configData.numberShowType === 2) {
          return this.showRes(this.parent.form[`${this.configData.compId}`]);
        }
      }
      if (+this.configData.dataSource.columnTypeDict === 4) {
        if (this.configData.numberShowType === 2) {
          return this.showRes(+this.labelValue);
        }
      }
      return this.parent.form[`${this.configData.compId}`];
    },
    // 获取内容数组
    getContentArr() {
      if (
        (this.configData.enableMultiColumn && this.getContent) ||
        (this.configData.enableDict &&
          this.getContent.toString().indexOf(',') !== -1)
      ) {
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
          // console.log(this.configData.font.color);
          if (
            this.configData.font.color === '#808080' &&
            (this.shouldOpenPanel || this.hasMenu)
          ) {
            style += 'color:#4689f5;';
          } else {
            style += `color:${this.configData.font.color};`;
          }
        }
        if (this.configData.font.size) {
          style += `font-size:${this.configData.font.size}px;`;
        }
        if (this.configData.font.style === 2) {
          style += 'font-weight:700;';
        }
        if (this.configData.labelBg.style !== 0) {
          if (this.grandFather && this.grandFather.compName === 'MenuMain') {
            style +=
              'padding-top:6px;padding-bottom:6px;height:auto;line-height:1;';
          } else if (
            this.grandFather &&
            this.grandFather.compName === 'CardForm'
          ) {
            style += 'height:18px;line-height:18px;';
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
          // if (this.configData.labelBg.style !== 0) {
          //   style += `background:${this.configData.labelBg.color};`;
          // }

          if (this.configData.labelBg.style === 1) {
            style += 'borderRadius: 4px;';
          }
          if (this.configData.labelBg.style === 2) {
            style += 'borderRadius: 100px;';
          }
        }
      }
      if (!this.isConfig) {
        if (this.configData.alignStyle === 2) {
          style += 'justify-content:center;';
        } else if (this.configData.alignStyle === 3) {
          style += 'justify-content:flex-end;';
        } else {
          style += 'justify-content:flex-start;';
        }
        if (this.configData.ellipsis === false) {
          style += 'height:auto;';
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
        if (
          this.configData.enableDict &&
          (this.grandFather.compName === 'MenuMain' ||
            this.configData.dropDownStyle === 4)
        ) {
          style += `color:${this.getDictInfo(item, 'fontColor')};`;
        }

        return style;
      };
    },
    // 是否需要点击打开panel
    shouldOpenPanel() {
      if (this.isConfig) {
        return false;
      }
      // 外链
      if (this.configData.relateType === 3) {
        return true;
      }
      if (this.configData.textPanelId) {
        return true;
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
      // 外链
      if (this.configData.relateType === 3) {
        return true;
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
      if (
        this.grandFather &&
        ['MultiTree'].includes(this.grandFather.compName)
      ) {
        return true;
      }
      return false;
    },
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
              const relateName =
                this.configData.dataSource.relateName.split('(')[0];
              const index = this.grandFather.relateTableArr.findIndex(
                (relate) => relate.relateName === relateName,
              );
              if (index !== -1) {
                const { secondLineColumn } =
                  this.grandFather.relateTableArr[index].conditionArr[0][0];
                tempId = secondLineColumn.columnName;
                selectWhere = '';
                this.grandFather.relateTableArr[index].conditionArr.forEach(
                  (orArr, j) => {
                    selectWhere += '';
                    orArr.forEach((item, i) => {
                      if (i === 0) {
                        selectWhere += '(';
                      }
                      if (item.secondIsValue) {
                        selectWhere += `${item.firstLineTable.tableName}.${item.firstLineColumn.columnName}=${item.secondLineValue}`;
                      } else if (
                        this.configData.dataSource.relateName === '主表'
                      ) {
                        if (this.configData.enableMultiColumn) {
                          // 数据多选框
                          if (
                            v &&
                            !this.parent.form[`${this.configData.compId}_`]
                          ) {
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
                    if (
                      j !==
                      this.grandFather.relateTableArr[index].conditionArr
                        .length -
                        1
                    ) {
                      selectWhere += ' and ';
                    }
                  },
                );
              }
            }
            if (this.configData.dataSource.relateName === '主表') {
              if (this.configData.enableMultiColumn) {
                // 数据多选框
                if (v && !this.parent.form[`${this.configData.compId}_`]) {
                  const params = {
                    selectContent:
                      tempId !== this.configData.multiTable.column.columnName
                        ? `${tempId},${this.configData.multiTable.column.columnName}`
                        : tempId,
                    selectFrom: this.configData.multiTable.table.tableName,
                    selectWhere:
                      selectWhere ||
                      `(${this.configData.multiTable.table.tableName}.${tempId} in (${v}))`,
                  };
                  const data = await selectList(params);
                  let str = '';
                  data.forEach((value) => {
                    str += `${
                      value[this.configData.multiTable.column.columnName]
                    },`;
                  });
                  if (str) {
                    str = str.slice(0, -1);
                  }
                  this.parent.form[`${this.configData.compId}_`] = str;
                }
              }
            } else if (v && !this.parent.form[`${this.configData.compId}_`]) {
              const params = {
                selectContent:
                  tempId !== this.configData.dataSource.columnName
                    ? `${tempId},${this.configData.dataSource.columnName}`
                    : tempId,
                selectFrom: this.configData.dataSource.tableName,
                selectWhere:
                  selectWhere ||
                  `(${this.configData.dataSource.tableName}.${tempId} in (${v}))`,
              };
              const data = await selectList(params);

              this.parent.form[`${this.configData.compId}_`] = data[0]
                ? data[0][this.configData.dataSource.columnName]
                : '';
            }
          },
          {
            immediate: true,
          },
        );
      }
    }
    this.setOldPanle();
  },

  methods: {
    // 处理结果
    showRes(value) {
      let inputValue = value.toString();
      const index = inputValue.indexOf('.');
      if (index !== -1) {
        const intNum = inputValue
          .substring(0, index)
          .replace(/\B(?=(?:\d{3})+$)/g, ',');
        const dot = inputValue.substring(index, inputValue.length);
        inputValue = intNum + dot;
      } else {
        inputValue = inputValue
          .substring(0, inputValue.length)
          .replace(/\B(?=(?:\d{3})+$)/g, ',');
      }
      return inputValue;
    },
    // 处理跳转面板的条件获取面板
    resolvePanleTerm() {
      console.log(this.configData.textPanelId);
      if (!this.configData.textPanelId) {
        return;
      }
      const arr = this.configData.textPanelId.split(',');
      const panelArr = [];
      arr.forEach((panelId) => {
        if (panelId && this.getPanel()[panelId]) {
          panelArr.push(this.getPanel()[panelId]);
        }
      });
      const obj = panelArr.find((panel) => {
        if (!panel.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, panel.jumpTerm);
        // console.log(res);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        this.panelObj = this.resolveFilterVar(obj);
        if (this.panelObj && this.panelObj.panelName) {
          setTimeout(() => {
            this.showPanel = true;
          });
        }
      }
    },
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.id) {
        panelObj.panelVarObj = {};
        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] =
              this.getAllForm()[compId];
          });
          if (item.relateDataComp) {
            panelObj.relateDataComp = {};
            panelObj.relateDataComp[item.compId] = {};
            panelObj.relateDataComp[item.compId].value =
              this.getAllForm()[item.relateDataComp.compId];
            panelObj.relateDataComp[item.compId].tableName =
              item.relateDataComp.tableName;
          }
          if (item.relateBusiComp) {
            panelObj.relateBusiComp = {};
            panelObj.relateBusiComp[item.compId] = {};
            panelObj.relateBusiComp[item.compId].value =
              this.getAllForm()[item.relateBusiComp.compId];
            panelObj.relateBusiComp[item.compId].tableName =
              item.relateBusiComp.tableName;
            panelObj.relateBusiComp[item.compId].flowValue =
              item.relateBusiComp.flowValue;
          }
        });

        panelObj.panelFixData = {};
        panelObj.panelData.forEach((item) => {
          if (item.mainComp.type === 2) {
            panelObj.panelFixData[item.paneComp.compId] =
              item.mainComp.fixedValue;
          } else if (item.mainComp.type === 3) {
            panelObj.panelFixData[item.paneComp.compId] = this.resolveFormula(
              true,
              item.mainComp.fixedValue,
            );
          } else {
            panelObj.panelFixData[item.paneComp.compId] =
              this.getAllForm()[item.mainComp.compId];
          }
        });
        panelObj.panelCompId = this.configData.compId;
        panelObj.relationMenuDesignId = this.sysMenuDesignId();
        panelObj.onlyFlag = this.onlyFlag();
        if (panelObj.name) {
          panelObj.panelName = panelObj.name;
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
        this.resolvePanleTerm();
      } else if (relateType === 2) {
        this.jumpMenu();
      } else if (relateType === 3) {
        // console.log(this.getContent);
        window.open(this.configData.outerLink || this.getContent);
      }
    },
    jumpMenu() {
      if (this.$route.name === 'sharePage') {
        return this.$message({
          type: 'warning',
          message: '分享页面无跳转菜单的权限',
        });
      }
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
          const menuObj = sessionStorage.jumpMenuObj
            ? JSON.parse(sessionStorage.jumpMenuObj)
            : {};
          menuObj[obj.id] = obj;
          sessionStorage.jumpMenuObj = JSON.stringify(menuObj);
          this.$bus.$emit('changeMenuTab', curMenu);
        } else {
          this.$message({
            type: 'warning',
            message: '您没有该跳转菜单的权限',
          });
        }
      } else {
        this.$message({
          type: 'warning',
          message: '您没有符合条件的菜单',
        });
      }
    },
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
      this.parent.form[this.configData.compId] = '';
    }
  },
};
</script>

<style lang="scss" scoped>
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
    padding: 0px 15px 0px 35px;
    &.isMenuManin {
      min-height: 76px;
      padding: 0px 15px 18px 20px;
    }
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
    &__content {
      // flex: 1;
      width: max-content;
      &:not(.font__ellipsis) {
        white-space: pre-wrap;
      }
    }
  }
  &__form {
    position: relative;
    &--title {
      line-height: 18px;
      height: 18px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      padding-bottom: 6px;
    }
    &--content {
      position: absolute;
      top: 0;
      left: 13px;
      width: calc(100% - 13px);
      & > span {
        display: inline-block;
        width: 100% !important;
      }
    }
    ::v-deep {
      .el-input.is-disabled .el-input__inner {
        color: rgba(0, 0, 0, 0);
      }
    }
  }
}
.label.isCard {
  padding: 0;
  min-height: 12px;
  line-height: 1;
  .span-box {
    margin-top: 3px;
    margin-bottom: 3px;
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
.circle {
  display: inline-block;
  font-size: 0;
  width: 8px;
  height: 8px;
  background-color: $--color-primary;
  border-radius: 50%;
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
    &.isId {
      color: #999;
    }
  }
}
</style>
