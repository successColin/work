<template>
  <div class="searchComp">
    <el-form-item :label="`${configData.name}`" class="searchComp__left">
      <!-- <el-select
        v-model="form[`${configData.compId}_lambda`]"
        class="searchComp__right"
      >
        <el-option
          v-for="lambda in lambdaArr[type]"
          :label="lambda.label"
          :value="lambda.value"
          :key="lambda.value"
          @click.native="lambdaChange(lambda)"
        ></el-option>
      </el-select> -->
      <div slot="label">
        <span> {{ configData.name }} </span>
        <el-dropdown
          @command="handleCommand"
          class="searchComp__condition"
          placement="bottom-start"
        >
          <span class="el-dropdown-link">
            {{ form[`${configData.compId}_lambdaLabel`]
            }}<i class="iconfont icon-shujiantouzhankai"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              :command="lambda"
              v-for="lambda in lambdaArr[type]"
              :label="lambda.label"
              :value="lambda.value"
              :key="lambda.value"
              >{{ lambda.label }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <apiot-input
        v-if="type === 1"
        class="searchComp__left--fw"
        v-model="form[configData.compId]"
        :placeholder="configData.placeholder"
      ></apiot-input>
      <el-select
        v-if="type === 2"
        class="searchComp__left--fw"
        v-model="form[configData.compId]"
        :placeholder="configData.placeholder"
        @change="selectChange"
        :multiple="true"
      >
        <el-option
          v-for="item in getDictArr"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <div class="searchComp__left--fw" v-if="type === 3">
        <apiot-button class="selectBtn m-r-4" @click="showPanelDialog">
          <i class="iconfont icon-jiahao"></i>选择
        </apiot-button>
        <ApiotTagBox
          :form="form"
          :configData="configData"
          class="selectBtn__tag"
        ></ApiotTagBox>
      </div>
      <el-date-picker
        v-if="type === 4"
        class="searchComp__left--fw"
        v-model="form[configData.compId]"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-input
        v-if="type === 5"
        class="searchComp__left--fw"
        v-model="form[configData.compId]"
        :placeholder="configData.placeholder"
        v-onlyNumber="2"
      >
      </el-input>
    </el-form-item>
    <!-- <transition name="slide-bottom"> -->
    <Panel-dialog
      ref="panelDialog"
      :key="curCompId"
      :visible.sync="showPanel"
      :panelObj="panelObj"
      :showPanel="showPanel"
      @setDataSel="setDataSel"
      :append-to-body="true"
    ></Panel-dialog>
    <!-- </transition> -->
  </div>
</template>

<script>
// import { lambdaArr } from '@/config';

export default {
  props: {
    // 表单信息
    form: {
      type: Object
    },
    configData: {
      type: Object
    },
    grandFather: {
      type: Object
    }
  },
  name: '',
  data() {
    return {
      lambdaArr: {
        1: [
          { label: '模糊匹配', value: 'LIKE' },
          { label: '是', value: '=' },
          { label: '否', value: '<>' }
        ],
        2: [
          { label: '包含', value: 'IN' },
          { label: '不包含', value: 'NOT IN' },
          { label: '是', value: '=' },
          { label: '否', value: '<>' }
        ],
        3: [
          { label: '包含', value: 'IN' },
          { label: '不包含', value: 'NOT IN' },
          { label: '是', value: '=' },
          { label: '否', value: '<>' }
        ],
        4: [
          { label: '日期范围内', value: 'IN' },
          { label: '日期范围外', value: 'NOT IN' }
        ],
        5: [
          { label: '=', value: '=' },
          { label: '!=', value: '<>' },
          { label: '>', value: '>' },
          { label: '<', value: '<' },
          { label: '>=', value: '>=' },
          { label: '<=', value: '<=' }
        ]
      },
      type: -1,
      panelObj: null, // 面板相关信息
      showPanel: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '大于当前时间',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365 * 100);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '小于当前时间',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 100);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      curCompId: ''
    };
  },

  computed: {
    getDictArr() {
      return this.$store.getters.getCurDict(this.configData.dataSource.dictObj.dictKey);
    },
    getCurrntMultiArr: {
      get() {
        return this.form[`${this.configData.compId}_`]
          ? this.form[`${this.configData.compId}_`].split(',')
          : [];
      },
      set(value) {
        const valueArr = this.form[`${this.configData.compId}_`]
          ? this.form[this.configData.compId].split(',')
          : [];
        const tempArr = this.form[`${this.configData.compId}_`]
          ? this.form[`${this.configData.compId}_`].split(',')
          : [];
        const index = tempArr.findIndex((item) => item === value);
        tempArr.splice(index, 1);
        valueArr.splice(index, 1);
        this.form[`${this.configData.compId}_`] = tempArr.join(',');
        this.form[`${this.configData.compId}`] = valueArr.join(',');
      }
    },
    getRelateColumnName() {
      // console.log(this.grandFather);
      const relateName = this.configData.dataSource.relateName.split('(')[0];
      const index = this.grandFather.relateTableArr.findIndex(
        (relate) => relate.relateName === relateName
      );
      if (index !== -1) {
        return this.grandFather.relateTableArr[index].conditionArr[0][0].secondLineColumn
          .columnName;
      }
      return 'id';
    }
  },

  mounted() {
    this.initComp();
  },

  inject: [
    'isConfig',
    'resolveFormula',
    'getAllForm',
    'getPanel',
    'getFatherPanel',
    'onlyFlag',
    'sysMenuDesignId'
  ],

  components: {},
  methods: {
    initComp() {
      // 转换label
      if (this.configData.compType === 15) {
        // 启用字典
        if (this.configData.enableDict) {
          // 字典选择
          this.configData.compType = 4;
        } else if (this.configData.dataSource.relateName === '主表') {
          if (this.configData.enableMultiColumn) {
            // 数据多选框
            this.configData.compType = 7;
          } else if (this.configData.dataSource.columnTypeDict === '3') {
            // 日期时间选择框
            this.configData.compType = 9;
          } else if (this.configData.dataSource.columnTypeDict === '1') {
            // 数字类型
            this.configData.compType = 10;
          } else {
            this.configData.compType = 1;
          }
        } else {
          this.configData.compType = 6;
        }
      }
      // 单行文本 多行文本
      if ([1, 11].includes(this.configData.compType)) {
        this.type = 1;
      }
      // 下拉 单选 多选
      if ([2, 3, 4].includes(this.configData.compType)) {
        this.type = 2;
      }
      // 数据单选 数据多选
      if ([6, 7].includes(this.configData.compType)) {
        this.type = 3;
      }
      // 时间
      if ([8, 9].includes(this.configData.compType)) {
        this.type = 4;
      }
      // 数字
      if ([10].includes(this.configData.compType)) {
        this.type = 5;
      }
      if (this.lambdaArr[this.type]) {
        this.form[`${this.configData.compId}_lambda`] = this.lambdaArr[this.type][0].value;
        this.form[`${this.configData.compId}_lambdaLabel`] = this.lambdaArr[this.type][0].label;
      }
    },
    lambdaChange(v) {
      this.form[`${this.configData.compId}_lambdaLabel`] = v.label;
    },
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
      panelObj.panelName = `请选择${this.configData.name}`;
      return panelObj;
    },
    showPanelDialog() {
      // this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      if (this.configData.panelObj) {
        this.panelObj = this.resolveFilterVar(this.configData.panelObj);
      } else {
        this.panelObj = this.resolveFilterVar(this.getPanel()[this.configData.compId]);
      }
      // console.log(this.panelObj);
      if (this.panelObj && this.panelObj.panelName) {
        this.curCompId = this.panelObj.id;
        this.$nextTick(() => {
          if (this.configData.compType === 6) {
            const obj = {
              name: this.configData.dataSource.columnName,
              value: this.form[`${this.configData.compId}_`] || ''
            };
            this.$refs.panelDialog.initSelData(
              this.getRelateColumnName,
              this.form[this.configData.compId],
              obj
            );
          } else if (this.configData.compType === 7) {
            const obj = {
              name: this.configData.multiTable.column.columnName,
              value: this.form[`${this.configData.compId}_`] || ''
            };

            this.$refs.panelDialog.initSelData('id', this.form[this.configData.compId], obj);
          }
          this.showPanel = true;
        });
      }
    },
    setDataSel(arr) {
      let str = '';
      let str1 = '';
      arr.forEach((item) => {
        str += `${item.id},`;
        if (this.configData.compType === 6) {
          str1 += `${item[this.configData.dataSource.columnName]},`;
        } else if (this.configData.compType === 7) {
          str1 += `${item[this.configData.multiTable.column.columnName]},`;
        }
      });

      this.form[this.configData.compId] = str.slice(0, -1);
      this.form[`${this.configData.compId}_`] = str1.slice(0, -1);
      this.showPanel = false;
    },
    // 数据选择框更改
    selectChange() {
      console.log(this.form[this.configData.compId]);
      const arr = [];
      this.form[this.configData.compId].forEach((v) => {
        const index = this.getDictArr.findIndex((dict) => dict.value === v);
        if (index !== -1) {
          arr.push(this.getDictArr[index].name);
        }
      });
      this.form[`${this.configData.compId}_`] = arr.join();
    },
    handleCommand(v) {
      this.form[`${this.configData.compId}_lambda`] = v.value;
      this.form[`${this.configData.compId}_lambdaLabel`] = v.label;
    }
  }
};
</script>

<style lang='scss' scoped>
.searchComp {
  display: flex;
  &__left {
    flex: 1;
    &--fw {
      width: 100% !important;
      display: flex;
      align-items: center;
      ::v-deep {
        .el-input__inner {
          height: 32px !important;
        }
      }
      .selectBtn {
        border-radius: 4px;
        border: 1px solid #e9e9e9;
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
    }
  }
  &__right {
    width: 115px;
    margin-right: 8px;
  }
  &__condition {
    cursor: pointer;
    font-weight: normal;
    color: $--color-primary;
    padding: 2px 10px;
    font-family: PingFangSC-Regular, PingFang SC;
    &:hover {
      background-color: #f6f6f8;
      border-radius: 4px;
      .el-dropdown-link {
        .iconfont {
          visibility: visible;
        }
      }
    }
    .el-dropdown-link {
      .iconfont {
        visibility: hidden;
      }
    }
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
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
  }
}
</style>
