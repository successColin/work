<template>
  <section>
    <div class="normalTerm" v-if="getCurrentTab.filterTermType === 1">
      <ActionTerm
        v-bind="$attrs"
        termTitle="过滤条件"
        :curTermObj="termObj"
        :lambdaArr="lambdaArr"
        :flag="2"
        :tableInfo="getCurrentTab.tableInfo"
        :notShowSys="false"
        :showType="showType"
        :variables="variables"
      ></ActionTerm>
    </div>
    <div class="sqlTerm" v-if="getCurrentTab.filterTermType === 2">
      <SelectSql
        :key="key"
        v-bind="$attrs"
        :showType="showType"
        :formulaStr.sync="getCurrentTab.filterTermSql"
        :showContent="showContent"
      ></SelectSql>
    </div>
  </section>
</template>

<script>
import { lambdaArr } from '@/config/index';
import ActionTerm from '../../../GlobalConfig/components/AddAction/components/ActionTerm';
import SelectSql from '../../FilterTerm/SelectSql';

export default {
  props: {
    getCurrentTab: {
      type: Object
    },
    showType: {
      type: Array,
      default: () => [1]
    },
    showContent: {
      type: Boolean,
      default: false
    },
    variables: {
      type: Array
    },
  },
  data() {
    return {
      key: 0,
      lambdaArr,
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [] // 条件数组
      }
    };
  },
  created() {
    this.initStr();
  },
  methods: {
    initStr() {
      if (this.getCurrentTab.filterTermStr) {
        this.termObj = JSON.parse(this.getCurrentTab.filterTermStr.replace(/\\/g, ''));
        // console.log(this.termObj);
      }
    },
    setTermParams(str) {
      const reg = /\$([A-Za-z0-9]{6})\$/g;
      const arr = str ? str.match(reg) || [] : [];
      const resArr = [];
      arr.forEach((item) => {
        resArr.push(item.slice(1, -1));
      });
      // console.log(resArr);
      this.getCurrentTab.termParams = resArr.join();
    }
  },
  components: {
    ActionTerm,
    SelectSql
  },
  watch: {
    showContent: {
      immediate: true,
      handler(v, o) {
        console.log(v, 'watch');
        if (v !== o) {
          this.key += 1;
        }
      }
    },
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
          this.getCurrentTab.filterTermStr = JSON.stringify(obj);
          if (this.getCurrentTab.filterTermType === 1) {
            this.setTermParams(this.getCurrentTab.filterTermStr);
          }
        } else {
          this.getCurrentTab.filterTermStr = '';
        }
      },
      deep: true
    },
    'getCurrentTab.filterTermSql': function (v) {
      if (this.getCurrentTab.filterTermType === 2) {
        this.setTermParams(v);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.FilterTerm {
  overflow-x: hidden;
  ::v-deep {
    @media (min-height: 640px) {
      & > .el-dialog {
        height: 640px;
      }
    }
    @media (max-height: 640px) {
      & > .el-dialog {
        position: absolute;
        top: 20px;
        bottom: 20px;
      }
    }
    & > .el-dialog {
      width: 960px;
      & > .el-dialog__body {
        padding-top: 0;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px);
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
