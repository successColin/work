<template>
  <section class="action__term">
    <h1 class="action__term--header" :class="{ [getLayOut]: true }">
      <span class="action__term--title">{{ termTitle }}</span>
      <apiot-button
        class="action__term--addAnd"
        :disabled="
          !canAdd || (termObj.termArr.length !== 0 && termObj.termType === 2)
        "
        @click="addTerm(1)"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>添加And条件
      </apiot-button>
      <apiot-button
        class="action__term--addOr"
        :disabled="
          !canAdd || (termObj.termArr.length !== 0 && termObj.termType === 1)
        "
        @click="addTerm(2)"
      >
        <i class="iconfont icon-xinzeng m-r-4"></i>添加Or条件
      </apiot-button>
    </h1>
    <ul class="action__term--ul">
      <li
        class="action__term--li"
        v-for="(item, i) in termObj.termArr"
        :key="i"
      >
        <h2 class="action__term--liHeader" :class="{ [getLayOut]: true }">
          单行条件
          <apiot-button
            class="action__term--addTerm"
            type="text"
            @click="addChildTerm(item)"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>添加{{
              termObj.termType === 1 ? 'Or' : 'And'
            }}条件子集
          </apiot-button>
          <apiot-button
            class="action__term--deleteTerm"
            type="text"
            @click="deleteChildTerm(i)"
          >
            <i class="iconfont icon-shanchu m-r-4"></i>删除
          </apiot-button>
        </h2>
        <div
          class="action__term--liChildren"
          v-for="(child, j) in item"
          :key="j"
          :class="{ [getLayOut]: true }"
        >
          <div
            style="margin-bottom: 0"
            v-if="businessType === 'flow' && needRelations"
          >
            <el-select
              v-model="child.baseType"
              class="action__term--liChild valueType"
              @change="change($event, child)"
              value-key="value"
            >
              <el-option
                :label="relation.label"
                :value="relation"
                v-for="(relation, i) in relationArr"
                :key="`${relation.value}_${i}`"
              ></el-option>
            </el-select>
          </div>
          <div
            style="margin-bottom: 0"
            v-if="businessType === 'flow' && child.baseType && needRelations"
          >
            <el-select
              disabled
              v-model="child.baseType.value"
              class="action__term--liChild valueType"
            >
            </el-select>
          </div>
          <select-comp
            class="selectCompVertical"
            :businessType="businessType"
            :canFormula="true"
            v-if="flag === 1"
            :configData="configData"
            :curTriggerComp="child.comp"
            :triggerCompMap="triggerCompMap"
            @compChange="compChange(child)"
          ></select-comp>
          <filterable-input
            v-if="flag === 2"
            class="list__item--column fields"
            placeholder="请选择字段"
            :tableName="getRealTableName(child)"
            :showInfo="child.columnObj"
            :dialogType="2"
            :notShowSys="notShowSys"
            @selectRes="selectColumnRes($event, child.columnObj, child)"
          ></filterable-input>
          <el-select
            v-model="child.lambda"
            class="action__term--liChild comparison"
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
          <!-- 日期框 -->
          <el-date-picker
            v-if="
              child.valueType === 1 &&
              child.comp.compId &&
              triggerCompMap[child.comp.compId].compType == 8
            "
            type="date"
            :editable="false"
            value-format="yyyy-MM-dd"
            v-model="child.content"
            class="action__term--liChild action__term--time VerticalDate"
            placeholder="请选择日期"
          >
          </el-date-picker>
          <!-- 日期时间框 -->
          <el-date-picker
            v-else-if="
              child.valueType === 1 &&
              ((child.comp.compId &&
                triggerCompMap[child.comp.compId].compType == 9) ||
                (child.columnObj && child.columnObj.columnType === 3))
            "
            type="datetime"
            :editable="false"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="child.content"
            class="action__term--liChild action__term--time VerticalDateTime"
            placeholder="请选择日期"
          >
          </el-date-picker>
          <apiot-input
            v-show="child.valueType === 1"
            v-else
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
            :showType="showType"
            :variables="variables"
            v-model="child.content"
          ></select-formula>
          <i class="iconfont icon-shanchu" @click="deleteTerm(i, j)"></i>
        </div>
      </li>
    </ul>
  </section>
</template>

<script>
import SelectComp from '../SelectComp';
import SelectFormula from '../SelectFormula';

export default {
  props: {
    // 1 代表组件 2 代表字段
    flag: {
      type: Number,
      default: 1
    },
    // type 为2的时候的表
    tableInfo: {
      type: Object,
      default: () => {}
    },
    // 是否需要系统字段
    notShowSys: {
      type: Boolean,
      default: true
    },
    configData: {
      type: Array,
      default: () => []
    },
    // 所有组件
    triggerCompMap: {
      type: Object,
      default: () => {}
    },
    // 条件
    value: {
      type: String,
      default: ''
    },
    curTermObj: {
      type: Object,
      default: () => {}
    },
    // 当前的触发控件
    triggerComp: {
      type: Object,
      default() {
        return {};
      }
    },
    lambdaArr: {
      type: Array,
      default: () => []
    },
    businessType: {
      // 业务类型，区别用于表单配置还是用在流程配置中，默认值为空用在表单配置中
      type: String,
      default: ''
    },
    layout: {
      type: String, // 布局方式，默认水平， 有垂直Vertical方式
      default: 'Horizontal'
    },
    // 条件标题
    termTitle: {
      type: String,
      default: '生效条件'
    },
    // 展示公式类型
    showType: {
      type: Array,
      default: () => [1]
    },
    relationRefs: {
      // 用于流程，关系引用
      type: Object,
      default() {
        return {};
      }
    },
    needRelations: {
      // 是否需要引用关系
      type: Boolean,
      default: true
    },
    variables: {
      type: Array
    },
  },
  data() {
    return {
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [] // 条件数组
      }
    };
  },

  components: {
    SelectComp,
    SelectFormula
  },

  computed: {
    getRealTableName() {
      return function (params) {
        if (this.businessType === 'flow' && this.needRelations) {
          if (params.baseType) {
            return params.baseType.value;
          }
          return '';
        }
        return this.tableInfo.tableName;
      };
    },
    relationArr() {
      // 引用关系
      const arr = [];
      const { tableInfo = {}, relateTableArr = [] } = this.relationRefs;
      const { relateName, tableName } = tableInfo;
      arr.push({ label: `${relateName || '主表'}(${tableName})`, value: tableName, ...tableInfo });
      relateTableArr.forEach((item) => {
        const { relateName: relateName1, relateTable } = item;
        arr.push({
          label: `${relateName1}(${item.conditionArr[0][0].firstLineColumn.columnName})`,
          value: relateTable.tableName,
          ...item
        });
      });
      return arr;
    },
    getLayOut() {
      // 获取布局方式
      return this.layout;
    },
    canAdd() {
      if (this.flag === 2 && this.tableInfo.tableName) {
        return true;
      }
      if (this.flag === 1) {
        return true;
      }
      return false;
    }
  },

  mounted() {
    if (this.value && this.flag === 1) {
      this.termObj = JSON.parse(this.value);
    }
    if (this.flag === 2) {
      this.termObj = this.curTermObj;
      // console.log(this.termObj);
    }
    console.log(this.relationRefs);
  },

  methods: {
    change(v, child) {
      child.columnObj = {
        columnName: '',
        columnType: '',
        tableName: ''
      };
      child.comp = {
        compId: '',
        compPath: '',
        compType: ''
      };
      const { relateTable, relateName } = v;
      child.alias =
        relateName === '主表' ? v.tableName : relateTable.alias || relateTable.tableName;
      child.content = '';
    },
    // 添加外层条件 1 外层 and 内层or 2外层or 内层 and
    addTerm(flag) {
      if (this.flag === 1 && !this.businessType && !this.triggerComp.compId) {
        return this.$message({
          type: 'warning',
          message: '请选择触发组件'
        });
      }
      this.termObj.termType = flag;
      this.termObj.termArr.push([]);
      console.log(33333, this.termObj.termArr[this.termObj.termArr.length - 1]);
      this.addChildTerm(this.termObj.termArr[this.termObj.termArr.length - 1]);
    },
    // 删除外层条件
    deleteChildTerm(i) {
      this.termObj.termArr.splice(i, 1);
    },
    // 添加子条件
    addChildTerm(item) {
      if (this.flag === 1 && this.triggerComp) {
        // 判断有没有触发控件存在，在流程中，触发控件是由配置人员自己选择
        item.push({
          comp: {
            compId: this.triggerComp.compId,
            compPath: this.triggerComp.compPath,
            compType: this.triggerComp.compType
          },
          lambda: '=',
          valueType: 1,
          content: ''
        });
      } else {
        const obj = {
          comp: {
            compId: '',
            compPath: '',
            compType: ''
          },
          columnObj: {
            columnName: '',
            columnType: ''
          },
          lambda: '=',
          valueType: 1,
          content: ''
        };
        item.push(obj);
      }
      console.log(item);
    },
    selectColumnRes(column, columnObj, child) {
      if (columnObj) {
        if (columnObj.columnName !== column.columnName) {
          columnObj.columnName = column.columnName;
          columnObj.columnType = column.columnTypeDict;
          columnObj.tableName = this.tableInfo.tableName;
          child.content = '';
        }
      }
    },
    // 删除条件
    deleteTerm(i, j) {
      if (this.termObj.termArr[i].length === 1) {
        this.termObj.termArr.splice(i, 1);
      } else {
        this.termObj.termArr[i].splice(j, 1);
      }
    },
    // 组件变化
    compChange(child) {
      child.content = '';
    }
  },

  watch: {
    termObj: {
      handler(v) {
        // console.log(v, 'zzzzzzz');
        if (this.flag === 1) {
          if (v.termArr.length === 0) {
            this.$emit('input', '');
          } else {
            this.$emit('input', JSON.stringify(v));
          }
        }
      },
      deep: true
    },
    value: {
      handler(v) {
        if (v && this.flag === 1) {
          this.termObj = JSON.parse(v);
        }
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
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

    width: 100%;
    margin-top: 8px;

    &--header,
    &--liHeader {
      display: flex;
      height: 30px;
      line-height: 30px;
      font-weight: 600;
      color: #333333;
      font-size: 13px;
    }

    &--header {
      &.Vertical {
        justify-content: space-between;

        & > .action__term--title {
          display: none;
        }

        .action__term--addAnd,
        .action__term--addTerm {
          margin-left: 0;
        }
      }
    }

    &--liHeader {
      &.Vertical {
        .action__term--deleteTerm,
        .action__term--addTerm:after {
          display: none;
        }

        .action__term--addTerm {
          margin-right: 0;
        }
      }
    }

    &--addAnd,
    &--addTerm {
      margin-left: auto;
    }

    &--ul {
      margin-top: 10px;
    }

    &--li {
      padding: 0 15px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      margin-bottom: 10px;
      overflow: hidden;
    }

    &--addTerm,
    &--deleteTerm {
      color: #333333;
      position: relative;
    }

    &--addTerm {
      margin-right: 10px;

      &:after {
        content: '';
        position: absolute;
        right: -14px;
        width: 1px;
        height: 12px;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    &--liChildren {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      &.Vertical {
        display: block;
        align-items: unset;
        overflow: hidden;

        .selectCompVertical {
          width: 200px;
          float: left;
          margin-bottom: 10px;
        }

        .comparison {
          width: 60px;
          float: left;
          margin-left: 8px;
          margin-bottom: 10px;
        }
        .fields {
          width: 200px;
          float: left;
        }

        .valueType {
          width: 268px;
          float: left;
          margin-left: 0;
          margin-bottom: 10px;
        }

        .action__term--input,
        .VerticalDateTime,
        .VerticalDate {
          float: left;
          width: 228px;
          margin-left: 0;
          margin-bottom: 10px;
        }

        .selectFormula {
          float: left;
          width: 228px !important;
          margin-left: 0;
          margin-bottom: 10px;
        }

        .icon-shanchu {
          width: auto;
          float: left;
          padding: 7px;
          margin-left: 8px;
          margin-bottom: 10px;
          color: #bbc3cd;
          border: 1px solid #e9e9e9;
          border-radius: 4px;
          box-sizing: border-box;

          &:hover {
            border: 1px solid #4689f5;
          }
        }
      }

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
        width: 200px;
      }

      &:nth-child(2) {
        width: 100px;
      }

      &:nth-child(3) {
        width: 100px;
      }
    }

    &--input,
    &--time {
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
