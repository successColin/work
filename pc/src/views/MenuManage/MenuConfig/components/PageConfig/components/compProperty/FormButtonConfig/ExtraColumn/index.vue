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
      <apiot-button class="panelBtn" @click="addColumn">
        <i class="iconfont icon-xinzeng m-r-4"></i>新增表跟字段
      </apiot-button>
      <div
        class="action__term--liChildren"
        v-for="(child, j) in extraColumnArr"
        :key="j"
      >
        <el-select
          v-model="child.tableName"
          class="action__term--liChild comparison"
        >
          <el-option
            :label="tableName"
            :value="tableName"
            v-for="tableName in tableArr"
            :key="tableName"
          ></el-option>
        </el-select>
        <filterable-input
          class="list__item--column"
          placeholder="请选择字段"
          :tableName="child.tableName"
          :showInfo="child.columnObj"
          :dialogType="2"
          @selectRes="selectColumnRes($event, child.columnObj, child)"
        ></filterable-input>
        <el-select
          v-model="child.lambda"
          class="action__term--liChild comparison"
          :disabled="true"
        >
          <el-option
            :label="lambda.label"
            :value="lambda.value"
            v-for="lambda in lambdaArr"
            :key="lambda.value"
          ></el-option>
        </el-select>
        <el-select
          v-model="child.valueType"
          class="action__term--liChild valueType"
          @change="child.content = ''"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <apiot-input
          v-show="child.valueType === 1"
          v-model="child.content"
          class="action__term--input"
          placeholder="请输入内容"
        >
        </apiot-input>
        <select-formula
          v-if="child.valueType === 2"
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="child.content"
        ></select-formula>
        <i class="iconfont icon-shanchu" @click="deleteTerm(j)"></i>
      </div>
    </apiot-dialog>
  </section>
</template>

<script>
import { lambdaArr } from '@/config/index';
import SelectFormula from '../../GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  props: {
    triggerCompMap: {
      type: Object
    },
    configData: {
      type: Array
    },
    tableArr: {
      type: Array
    },
    extraColumnArr: {
      type: Array
    }
  },
  data() {
    return {
      lambdaArr
    };
  },
  computed: {},
  mounted() {
    this.initStr();
  },
  methods: {
    initStr() {},
    // 组件变化
    compChange(child) {
      child.content = '';
    },
    selectColumnRes(column, columnObj, child) {
      console.log(column, columnObj, child);
      if (columnObj) {
        if (columnObj.columnName !== column.columnName) {
          columnObj.columnName = column.columnName;
          columnObj.columnType = column.columnTypeDict;
          columnObj.tableName = column.tableName;
          child.content = '';
        }
      }
    },
    // 删除条件
    deleteTerm(j) {
      this.extraColumnArr.splice(j, 1);
    },
    addColumn() {
      this.extraColumnArr.push({
        tableName: this.tableArr[0],
        columnObj: {
          columnName: '',
          columnType: 0
        },
        lambda: '=',
        valueType: 1,
        content: ''
      });
    }
  },
  components: {
    SelectFormula
  },
  watch: {}
};
</script>

<style lang='scss' scoped>
.FilterTerm {
  overflow-x: hidden;
  .panelBtn {
    width: 200px;
    i {
      color: $--color-primary;
    }
  }
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
        padding-top: 10px;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px - 10px);
      }
    }
  }
}
.action {
  .icon-shanchu {
    color: #bbc3cd;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: $--color-primary;
    }
  }

  &__term {
    ::v-deep {
      .el-button {
        .iconfont {
          color: $--color-primary;
        }
      }

      .is-disabled {
        .iconfont {
          color: #c0c4cc !important;
        }
      }
    }

    &--liChildren {
      position: relative;
      display: flex;
      align-items: center;
      margin-top: 8px;

      .termComp {
        position: absolute;
        margin-left: 14px;
      }

      .icon-shanchu {
        width: 40px;
        text-align: right;
        color: #bbc3cd;
        cursor: pointer;

        &:hover {
          color: #4689f5;
        }
      }
    }

    &--liChild {
      margin-left: 10px;

      &:nth-child(1) {
        width: 150px;
        margin-left: 0;
        margin-right: 10px;
      }

      &:nth-child(2) {
        width: 200px;
      }

      &:nth-child(3) {
        width: 70px;
      }

      &:nth-child(4) {
        width: 100px;
      }
    }

    &--input {
      margin-left: 10px;
      flex: 1;
    }

    &--formula {
      margin-left: 10px;
      width: auto !important;
      flex: 1;
    }
  }
}
</style>
