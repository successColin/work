<template>
  <div
    class="dataMultiSel"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
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
        v-model="parent.form[this.configData.compId]"
        v-show="false"
      ></apiot-input>
      <apiot-button
        class="selectBtn m-r-4"
        :disabled="configData.canReadonly"
        @click="showPanelDialog"
      >
        <i class="iconfont icon-jiahao"></i>选择
      </apiot-button>
      <!-- <apiot-tag
        class="m-r-4"
        @deleteSelf="getCurrntMultiArr = item"
        v-for="(item, index) in getCurrntMultiArr"
        :key="index"
        :item="item"
      ></apiot-tag> -->
      <ApiotTagBox
        :form="getFormContent(parent.form)"
        :configData="configData"
        :disabled="configData.canReadonly"
        class="selectBtn__tag"
      ></ApiotTagBox>
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
      unwatch: null
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    getCurrntMultiArr: {
      get() {
        return this.parent.form[`${this.configData.compId}_`]
          ? this.parent.form[`${this.configData.compId}_`].split(',')
          : [];
      },
      set(value) {
        if (this.configData.singleStatus === 2) {
          return;
        }
        const valueArr = this.parent.form[`${this.configData.compId}_`]
          ? this.parent.form[this.configData.compId].split(',')
          : [];
        const tempArr = this.parent.form[`${this.configData.compId}_`]
          ? this.parent.form[`${this.configData.compId}_`].split(',')
          : [];
        const index = tempArr.findIndex((item) => item === value);
        tempArr.splice(index, 1);
        valueArr.splice(index, 1);
        this.parent.form[`${this.configData.compId}_`] = tempArr.join(',');
        this.parent.form[`${this.configData.compId}`] = valueArr.join(',');
      }
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
    getFormContent() {
      return (form) => {
        if (this.configData.enableDict && this.getDictObj) {
          const showArr = form[`${this.configData.compId}_`].split(',');
          const arr = [];
          showArr.forEach((v) => {
            if (this.getDictObj[v]) {
              arr.push(this.getDictObj[v].name);
            }
          });
          if (arr.length) {
            form[`${this.configData.compId}_`] = arr.join(',');
          }
        }
        return form;
      };
    }
  },

  mounted() {
    if (!this.isConfig) {
      this.unwatch = this.$watch(
        `parent.form.${this.configData.compId}`,
        async (v) => {
          // console.log(v);
          // console.log(this.parent.form[`${this.configData.compId}_`]);
          // console.log(this.configData);
          if (v && !this.parent.form[`${this.configData.compId}_`]) {
            let tempId = 'id';
            let selectWhere = `${this.configData.multiTable.table.tableName}.${tempId} in (${v})`;
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
                      selectWhere += `${item.secondLineTable.tableName}.${item.secondLineColumn.columnName} in (${v})`;
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
              selectContent: `${tempId},${this.configData.multiTable.column.columnName}`,
              selectFrom: this.configData.multiTable.table.tableName,
              selectWhere
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
        },
        {
          immediate: true
        }
      );
    }
  },

  inject: ['getAllForm', 'getPanel', 'onlyFlag', 'sysMenuDesignId'],

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
        }
        return panelObj;
      }
      return null;
    },
    showPanelDialog() {
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);

      // console.log(this.panelObj);
      if (this.panelObj && this.panelObj.panelName) {
        this.showPanel = true;
        const obj = {
          name: this.configData.multiTable.column.columnName,
          value: this.parent.form[`${this.configData.compId}_`] || ''
        };

        this.$refs.panelDialog.initSelData('id', this.parent.form[this.configData.compId], obj);
      }
    },
    setDataSel(arr) {
      // console.log(this.grandFather, this.configData);
      let str = '';
      let str1 = '';
      arr.forEach((item) => {
        str += `${item.id},`;
        str1 += `${item[this.configData.multiTable.column.columnName]},`;
      });
      this.$set(this.parent.form, this.configData.compId, str.slice(0, -1));
      this.$set(this.parent.form, `${this.configData.compId}_`, str1.slice(0, -1));
      // this.parent.form[this.configData.compId] = str.slice(0, -1);
      // this.parent.form[`${this.configData.compId}_`] = str1.slice(0, -1);
      this.showPanel = false;
      this.configData.selData = arr;
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
.dataMultiSel {
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
      .el-form-item__label {
        padding-top: 0px;
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
      .fieldSelect--item {
        height: 32px;
      }
    }
  }
  .selectBtn {
    border-radius: 4px;
    border: 1px dashed #d9d9d9;
    width: 68px;
    height: 32px;
    box-sizing: border-box;
    font-size: 13px;
    font-weight: 400;
    margin-right: 4px;
    &:hover {
      border-color: $--color-primary !important;
      .iconfont {
        color: $--color-primary;
      }
    }
    .iconfont {
      font-weight: normal;
      font-size: 13px;
      color: #aaaaaa;
      margin-right: 4px;
    }
    &__tag {
      width: calc(100% - 72px);
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
