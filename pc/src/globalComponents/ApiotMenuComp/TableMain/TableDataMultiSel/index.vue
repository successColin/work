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
        </el-tooltip> </span
    ></template>
    <div slot-scope="scope">
      <div
        class="column__editable"
        v-if="
          areaData.lineEditable &&
          showCell === `${scope.column.id}_${scope.row.unique}`
        "
      >
        <apiot-button
          class="selectBtn m-r-4"
          :disabled="configData.canReadonly"
          @click="showPanelDialog(scope.$index)"
        >
          <i class="iconfont icon-jiahao"></i>选择
        </apiot-button>

        <ApiotTagBox
          :form="getFormContent(scope.row)"
          :configData="configData"
          :disabled="configData.canReadonly"
          class="selectBtn__tag"
        ></ApiotTagBox>
      </div>
      <div class="column__notEditable" v-else>
        {{ getFormContent(scope.row)[`${configData.compId}_`] }}
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
      curIndex: -1
    };
  },

  computed: {
    getCurrntMultiArr: {
      get() {
        console.log(this.parent.form[`${this.configData.compId}_`]);
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
        this.parent.form.notChange = false;
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

  components: {},

  created() {},

  inject: ['getAllForm', 'getPanel', 'onlyFlag', 'sysMenuDesignId'],

  methods: {
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      panelObj.panelVarObj = {};

      panelObj.panelFilter.forEach((item) => {
        console.log(item.termParams);
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
    },
    showPanelDialog(index) {
      this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      // console.log(this.panelObj);
      if (this.panelObj && this.panelObj.panelName) {
        this.curIndex = index;
        const obj = {
          name: this.configData.multiTable.column.columnName,
          value: this.parent.form[`${this.configData.compId}_`] || ''
        };
        this.$emit('showPanelDialog', index, this.panelObj, 'id', this.configData, obj);
      }
    },
    setDataSel(arr, row) {
      row[this.configData.compId] = `${arr[0][this.getRelateColumnName]}`;
      if (arr.length) {
        row[`${this.configData.compId}_`] = arr[0][this.configData.dataSource.columnName];
      }
      this.showPanel = false;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../col.scss';

.column__editable {
  display: flex;
  align-items: center;
  ::v-deep {
    .el-input-group__append {
      padding: 0;
      border-right: 1px solid #e9e9e9;
      border-left: 0;
      background-color: #fff;
      &:hover {
        .iconfont {
          color: $--color-primary;
        }
      }
    }
    .fieldSelect--item {
      height: 32px;
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
  }
  .selectBtn__tag {
    width: calc(100% - 72px);
    height: 32px;
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
</style>
