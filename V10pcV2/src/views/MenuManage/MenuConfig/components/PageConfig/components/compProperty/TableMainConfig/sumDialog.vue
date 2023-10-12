<template>
  <apiot-dialog
    class="FilterTerm"
    v-on="$listeners"
    v-bind="$attrs"
    :title="`${sumType === 1 ? '新增' : '编辑'}汇总项`"
    @sure-click="sureClick"
  >
    <el-form label-position="top" label-width="80px" class="form" ref="action">
      <div class="form--line">
        <el-form-item
          label="汇总名称"
          class="form--child"
          prop="tableName"
          ref="entity-form"
        >
          <apiot-input
            v-model="getFilterObj.name"
            placeholder="请输入汇总项名称"
          >
          </apiot-input>
        </el-form-item>
        <el-form-item label="数据字体颜色" class="form--child">
          <apiot-color-picker class="colorSelect" v-model="getFilterObj.color">
          </apiot-color-picker>
        </el-form-item>
      </div>
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
        termTitle="生效条件"
      ></ActionTerm>
    </div>
    <div class="sqlTerm" v-if="getFilterObj.filterTermType === 2">
      <SelectSql
        v-bind="$attrs"
        :formulaStr.sync="getFilterObj.filterTermSql"
      ></SelectSql>
    </div>
  </apiot-dialog>
</template>

<script>
import { lambdaArr } from '@/config/index';
import ActionTerm from '../GlobalConfig/components/AddAction/components/ActionTerm';
import SelectSql from '../ContentConfig/FilterTerm/SelectSql';

export default {
  props: {
    getCurrentTab: {
      type: Object,
    },
    filterObj: {
      type: Object,
    },
    sumType: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      lambdaArr,
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [], // 条件数组
      },
    };
  },
  computed: {
    getFilterObj() {
      if (this.filterObj) {
        return this.filterObj;
      }
      return this.getCurrentTab;
    },
  },
  mounted() {
    this.initStr();
  },
  methods: {
    initStr() {
      if (this.getFilterObj.filterTermStr) {
        this.termObj = JSON.parse(
          this.getFilterObj.filterTermStr.replace(/\\/g, ''),
        );
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
    },
    sureClick() {
      if (!this.getFilterObj.name) {
        return this.$message({
          type: 'warning',
          message: '请输入名称',
        });
      }
      this.$emit('sumSureClick');
      console.log(this.getFilterObj);
    },
  },
  components: {
    ActionTerm,
    SelectSql,
  },
  watch: {
    termObj: {
      handler(v) {
        // console.log(this.getCurrentTab);
        // console.log(v);
        const obj = {
          termType: v.termType, // 1 代表外层and 内层 or
          termArr: [], // 条件数组
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
      deep: true,
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
    },
  },
};
</script>

<style lang="scss" scoped>
.FilterTerm {
  overflow-x: hidden;
  width: 100%;

  .form--line {
    width: 100%;
    display: flex;
  }
  .form--child {
    flex: 1;
    margin-bottom: 10px;

    &:nth-child(2n) {
      margin-left: 20px;
    }
    ::v-deep {
      .el-select {
        width: 100%;
      }
    }
  }
  .colorSelect {
    width: 100%;
    height: 32px;
    vertical-align: top;
    ::v-deep {
      .el-color-picker__trigger {
        width: 100%;
        height: 32px;
      }
      .el-color-picker__color {
        width: 22px;
      }
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
