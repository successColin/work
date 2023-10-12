<template>
  <section>
    <ActionTerm
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      v-model="termObj"
      :lambdaArr="lambdaArr"
      :triggerComp="triggerComp"
      :onlyIsWeb="false"
    ></ActionTerm>
    <section class="action__storeProcess">
      <el-form label-position="top" label-width="80px" @submit.native.prevent>
        <el-form-item label="存储过程">
          <filter-store-process
            placeholder="请选择存储过程"
            :showInfo="actionTriggerObj"
            @selectRes="selectColumnRes"
          ></filter-store-process>
        </el-form-item>
        <el-form-item label="参数设置">
          <el-table
            class="filterableInput__table"
            :data="actionTriggerObj.proceduresList"
            :border="true"
          >
            <el-table-column prop="parameterName" label="参数" width="200">
              <template slot-scope="scope">
                <span class="baseColor">{{ scope.row.parameterName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="parameterRemarks" label="备注">
            </el-table-column>
            <el-table-column prop="valueType" label="值类型" width="150">
              <template slot-scope="scope">
                <el-select
                  :value="
                    +actionTriggerObj.proceduresList[scope.$index].valueType
                  "
                  @change="selectChange($event, scope)"
                  class="valueType"
                >
                  <el-option label="固定值" :value="1"></el-option>
                  <el-option label="公式" :value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="valueInfo" label="值">
              <template slot-scope="scope">
                <apiot-input
                  v-if="+scope.row.valueType === 1"
                  v-model="
                    actionTriggerObj.proceduresList[scope.$index].valueInfo
                  "
                  class="valueInfo"
                >
                </apiot-input>
                <select-formula
                  v-if="+scope.row.valueType === 2"
                  :configData="configData"
                  class="list__item--formula"
                  :triggerCompMap="triggerCompMap"
                  v-model="
                    actionTriggerObj.proceduresList[scope.$index].valueInfo
                  "
                  :onlyIsWeb="false"
                ></select-formula>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="返回值设置">
          <apiot-button @click="setReturnValue"
            ><i class="iconfont icon-shezhi m-r-4"></i
            ><span>设置返回值</span></apiot-button
          >
        </el-form-item>
      </el-form>
    </section>
    <transition name="slide-bottom">
      <return-value
        :visible.sync="showReturnValue"
        v-if="showReturnValue"
        :triggerCompMap="triggerCompMap"
        :triggerComp="triggerComp"
        :configData="configData"
        v-model="actionTriggerObj.returnValue"
      ></return-value>
    </transition>
  </section>
</template>

<script>
import { listProceduresParameter } from '@/api/menuConfig';
import termMixin from '../termMixin';
import ReturnValue from '../ReturnValue';
import ActionTerm from '../ActionTerm';
import FilterStoreProcess from '../FilterStoreProcess';
import SelectFormula from '../SelectFormula';

export default {
  mixins: [termMixin],
  props: {
    //  配置，渲染树
    configData: {
      type: Array,
    },
    // 所有组件
    triggerCompMap: {
      type: Object,
    },
    // 条件
    effectiveConditions: {
      type: String,
    },
    // item 所有数据，方便修改
    actionTriggerObj: {
      type: Object,
    },
    // 当前触发控件
    triggerComp: {
      type: Object,
    },
    // 触发事件
    triggerEvent: {
      type: Number,
    },
  },
  data() {
    return {
      showReturnValue: false,
    };
  },

  components: {
    ReturnValue,
    ActionTerm,
    FilterStoreProcess,
    SelectFormula,
  },

  computed: {},

  mounted() {
    console.log(this.actionTriggerObj);
  },

  methods: {
    methodChange() {
      // this.actionTriggerObj.request_parameter = '';
    },
    setReturnValue() {
      this.showReturnValue = true;
    },
    selectColumnRes(column) {
      this.actionTriggerObj.sysProceduresId = column.id;
      this.listProceduresParameter();
    },
    async listProceduresParameter() {
      const data = await listProceduresParameter({
        proId: this.actionTriggerObj.sysProceduresId,
        triggerId: this.actionTriggerObj.id || '',
      });
      data.forEach((item) => {
        if (!item.valueType) {
          item.valueType = 1;
        }
        if (!item.valueInfo) {
          item.valueInfo = '';
        }
      });
      console.log(data);
      this.actionTriggerObj.proceduresList = data;
      this.$set(this.actionTriggerObj, 'proceduresList', data);
    },
    selectChange(v, scope) {
      this.actionTriggerObj.proceduresList[scope.$index].valueType = v;
      this.actionTriggerObj.proceduresList[scope.$index].valueInfo = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.action {
  .icon-xinzeng {
    color: $--color-primary;
  }
  .icon-shezhi {
    color: $--color-primary;
  }
  &__term {
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
      .termComp {
        position: absolute;
        margin-left: 14px;
      }
      .icon-shanchu {
        width: 40px;
        text-align: right;
        cursor: pointer;
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
      &:nth-child(4) {
        margin-right: 0;
        flex: 1;
      }
    }
  }
  .addBody {
    position: absolute;
    right: 0;
    margin-top: -28px;
    span {
      color: #333333;
    }
  }
  &__endData {
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    padding: 16px 15px 0;
  }
}
.filterableInput__table {
  min-height: 100px !important;
  .baseColor {
    height: 28px;
    line-height: 28px;
    padding: 0 10px;
    background: #e5f0ff;
    border-radius: 4px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #4689f6;
  }
}
</style>
