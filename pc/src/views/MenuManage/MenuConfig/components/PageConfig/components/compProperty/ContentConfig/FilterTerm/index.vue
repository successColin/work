<template>
  <section>
    <apiot-dialog
      class="FilterTerm"
      v-on="$listeners"
      v-bind="$attrs"
      title="设置筛选条件"
      :isShowSure="false"
      cancelBtnName="确认"
    >
      <el-form
        label-position="top"
        label-width="80px"
        class="form"
        ref="action"
      >
        <div class="form--line" style="width: calc(50% - 15px)">
          <el-form-item label="方式" class="form--child">
            <el-select v-model="getFilterObj.filterTermType">
              <el-option label="普通设置筛选" :value="1"></el-option>
              <el-option label="填写sql筛选" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="normalTerm" v-if="getFilterObj.filterTermType === 1">
        <ActionTerm
          v-bind="$attrs"
          :curTermObj="termObj"
          :lambdaArr="lambdaArr"
          :flag="2"
          :tableInfo="getFilterObj.tableInfo"
          :notShowSys="false"
        ></ActionTerm>
      </div>
      <div class="sqlTerm" v-if="getFilterObj.filterTermType === 2">
        <SelectSql
          v-bind="$attrs"
          :formulaStr.sync="getFilterObj.filterTermSql"
        ></SelectSql>
      </div>
    </apiot-dialog>
  </section>
</template>

<script>
import { lambdaArr } from '@/config/index';
import ActionTerm from '../../GlobalConfig/components/AddAction/components/ActionTerm';
import SelectSql from './SelectSql';

export default {
  props: {
    getCurrentTab: {
      type: Object
    },
    filterObj: {
      type: Object
    }
  },
  data() {
    return {
      lambdaArr,
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [] // 条件数组
      }
    };
  },
  computed: {
    getFilterObj() {
      if (this.filterObj) {
        return this.filterObj;
      }
      return this.getCurrentTab;
    }
  },
  mounted() {
    this.initStr();
  },
  methods: {
    initStr() {
      if (this.getFilterObj.filterTermStr) {
        this.termObj = JSON.parse(this.getFilterObj.filterTermStr.replace(/\\/g, ''));
      }
    },
    setTermParams(str) {
      const reg = /\$([A-Za-z0-9]{6})\$/g;
      const arr = str ? str.match(reg) || [] : [];
      const resArr = [];
      arr.forEach((item) => {
        resArr.push(item.slice(1, -1));
      });
      this.getFilterObj.termParams = resArr.join();
    }
  },
  components: {
    ActionTerm,
    SelectSql
  },
  watch: {
    termObj: {
      handler(v) {
        // console.log(this.getCurrentTab);
        // console.log(v);
        const obj = {
          termType: v.termType, // 1 代表外层and 内层 or
          termArr: [] // 条件数组
        };
        if (v.termArr.length) {
          v.termArr.forEach((term) => {
            // console.log(term);
            const arr = [];
            term.forEach((child) => {
              if (child.columnObj.columnName) {
                arr.push(child);
              }
            });
            if (arr.length) {
              obj.termArr.push(arr);
            }
          });
          this.getFilterObj.filterTermStr = JSON.stringify(obj);
          if (this.getFilterObj.filterTermType === 1) {
            this.setTermParams(this.getFilterObj.filterTermStr);
          }
        } else {
          this.getFilterObj.filterTermStr = '';
        }
      },
      deep: true
    },
    'getFilterObj.filterTermSql': function (v) {
      if (this.getFilterObj.filterTermType === 2) {
        this.setTermParams(v);
      }
    },
    'getFilterObj.filterTermType': function (v) {
      if (v === 2 && this.getFilterObj.filterTermSql) {
        this.setTermParams(this.getFilterObj.filterTermSql);
      }
      if (v === 1 && this.getFilterObj.filterTermStr) {
        this.setTermParams(this.getFilterObj.filterTermStr);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.FilterTerm {
  overflow-x: hidden;
  ::v-deep {
    & > .el-dialog {
      width: 960px;
      max-height: 640px;
      position: absolute;
      top: 100px;
      bottom: 100px;
      & > .el-dialog__body {
        padding-top: 10px;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px - 10px);
      }
    }
    .el-form {
      .el-form-item {
        margin-bottom: 0;
      }
      .el-select {
        width: 100%;
      }
    }
    .el-date-editor--datetime {
      flex: 1;
    }
  }
  .normalTerm {
    height: calc(100% - 52px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sqlTerm {
    height: calc(100% - 52px);
    overflow: hidden;
  }
}
</style>
