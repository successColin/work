<!--
 * @Descripttion: 弹出框__数据转换
 * @Author: ytx
 * @Date: 2021-04-25 10:23:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 13:45:51
-->
<template>
  <apiot-dialog
    class="dataConversion rule"
    v-on="$listeners"
    v-bind="$attrs"
    @sure-click="handleReleaseSubmit"
    @close="handleReset"
  >
    <el-form
      label-position="top"
      ref="ruleForm"
      class="dataConversion__from"
      :model="ruleForm"
      :rules="rules"
    >
      <div class="form__line">
        <el-form-item
          :label="$t('importTemplate.typeOfData')"
          class="form__child"
        >
          <apiot-select
            :value="currentType"
            :options="typeArr"
            :placeholder="
              $t('placeholder.pleaseSelect', { any: $t('common.type') })
            "
            @change="handleChangeType"
          ></apiot-select>
        </el-form-item>
      </div>
      <!-- 转换为关联表ID -->
      <div v-if="currentType === 1">
        <header>
          <div>
            {{ $t('importTemplate.dataConversionSaveDatabase') }}
          </div>
          <div class="m-t-3">
            {{ $t('importTemplate.commonUsageScenariosAre') }}
          </div>
        </header>
        <div class="form__line form__halfLine">
          <el-form-item
            :label="$t('importTemplate.dataSheet')"
            class="form__child"
          >
            <filterable-input
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('importTemplate.tableName'),
                })
              "
              :dialogType="1"
              :showInfo="tableInfo1"
              @selectRes="dataTable"
            ></filterable-input>
          </el-form-item>
        </div>
        <div class="form__line">
          <el-form-item
            :label="$t('importTemplate.excelFillInFields')"
            class="form__child"
          >
            <filterable-input
              :placeholder="$t('importTemplate.searchField')"
              ref="searchField1"
              :dialogType="2"
              :tableName="tableName"
              :showInfo="tableInfo2"
              @selectRes="excelField"
            ></filterable-input>
          </el-form-item>
          <el-form-item
            :label="$t('importTemplate.databaseStorageField')"
            class="form__child"
          >
            <filterable-input
              :placeholder="$t('importTemplate.searchField')"
              ref="searchField2"
              :dialogType="2"
              :tableName="tableName"
              :showInfo="tableInfo3"
              @selectRes="storageField"
            ></filterable-input>
          </el-form-item>
        </div>
      </div>
      <!-- 自动编码生成 -->
      <div v-else-if="currentType === 2">
        <header class="codeHeader">
          <span style="min-width: 65px">
            {{ $t('importTemplate.encodingPreview') }}
          </span>
          <span class="header__text font__ellipsis" :title="showRes">{{
            showRes
          }}</span>
        </header>
        <h2 class="dataConversion__operate">
          编码规则
          <el-dropdown class="dataConversion__dropdown" @command="handleClick">
            <apiot-button class="dataConversion__btn">
              <i class="iconfont icon-xinzeng m-r-4"></i>新增
            </apiot-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in getDropdownList"
                :key="item.type"
                :command="item"
                >{{ item.name }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </h2>
        <div class="dataConversion__content">
          <draggable
            group="rule"
            animation="300"
            handle=".icon-zongxiangtuodong"
            v-model="codeArr"
            filter=".forbid"
            :move="move"
          >
            <transition-group tag="ul" :key="1">
              <li
                class="rule__item"
                v-for="(item, i) in codeArr"
                :key="`${item}_${i}`"
              >
                <span class="rule__item--move">
                  <i
                    class="iconfont icon-zongxiangtuodong"
                    :class="[{ forbid: item.type === 'INCREMENT' }]"
                  ></i>
                </span>
                <apiot-input
                  class="rule__item--type"
                  :disabled="true"
                  :value="getName(item)"
                ></apiot-input>
                <apiot-input
                  class="rule__item--full"
                  v-model="item.value"
                  v-if="item.type === 'STR'"
                ></apiot-input>
                <el-select
                  class="rule__item--full"
                  v-model="item.value"
                  placeholder="请选择数据源"
                  v-if="item.type === 'DATE'"
                >
                  <el-option
                    :label="time.label"
                    :value="time.value"
                    v-for="time in timeArr"
                    :key="time.value"
                  ></el-option>
                </el-select>
                <el-input-number
                  class="rule__item--full m-r-10"
                  v-model="item.value"
                  :min="1"
                  :step-strictly="true"
                  :controls="false"
                  @blur="numberBlur(item, 'value')"
                  v-if="item.type === 'INCREMENT'"
                ></el-input-number>
                <apiot-input
                  class="rule__item--type"
                  :disabled="true"
                  value="起始值"
                  v-if="item.type === 'INCREMENT'"
                ></apiot-input>
                <el-input-number
                  class="rule__item--full"
                  v-model="item.start"
                  :min="1"
                  :max="item.value * 10 - 1"
                  :step-strictly="true"
                  :controls="false"
                  @blur="numberBlur(item, 'start')"
                  v-if="item.type === 'INCREMENT'"
                ></el-input-number>
                <span
                  class="rule__item--delete"
                  @click="deleteRule(i)"
                  v-if="codeArr.length !== 1"
                >
                  <i class="iconfont icon-shanchu"></i>
                </span>
              </li>
            </transition-group>
          </draggable>
        </div>
      </div>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { createUnique, formatDate } from '@/utils/utils';

export default {
  props: {
    lineData: {
      type: Object,
      default: () => {}
    },
    dataConversionObj: {
      type: Object,
      default: () => {}
    },
    visibleState: {
      type: Boolean,
      default: false
    },
    parentTableName: {
      type: String,
      default: ''
    },
    primaryKey: {
      type: String,
      default: ''
    },
    dropdownList: {
      type: Array,
      default: () => []
    },
    timeArr: {
      type: Array,
      default: () => []
    },
    // 类型
    dataType: {
      type: Number,
      default: 1
    },
    codeArr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 释放__input 值
      ruleForm: {
        changeType: '', // 转换类型 1字段转id 2日期
        changeTableId: '', // 数据转换表id
        dateChangeTable: '', // 数据转换表
        changeBeforeId: '', // 数据转字段（前）id
        dateChangeBefore: '', // 数据转字段（前）
        changeAfterId: '', // 数据转字段（后）id
        dateChangeAfter: '' // 数据转字段（后）
      },
      // 搜索内容反显值
      tableInfo1: null,
      tableInfo2: null,
      tableInfo3: null,
      showRes: '',
      // codingRules: [],
      codeRuleList: {}, // 编码规则
      autoIncrementRecord: ''
      // 数据转换类型
      // typeArr: [
      //   {
      //     value: 1,
      //     name: '转换为关联表ID'
      //   }
      // ]
    };
  },
  computed: {
    currentType() {
      return this.ruleForm.changeType ? this.ruleForm.changeType : this.dataType;
    },
    rules() {
      // 释放__表单验证
      return {
        password: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', { any: this.$t('common.password') }),
            trigger: 'change'
          }
        ]
      };
    },
    tableName() {
      return this.ruleForm.dateChangeTable || '';
    },
    typeArr() {
      return [
        {
          value: 1,
          name: this.$t('importTemplate.toTheAssociatedTableID')
        },
        {
          value: 2,
          name: this.$t('importTemplate.codeGeneration')
        }
      ];
    },
    canAddIncremenet() {
      const index = this.codeArr.findIndex((rule) => rule.type === 'INCREMENT');
      if (index === -1) {
        return true;
      }
      return false;
    },
    getDropdownList() {
      const arr = JSON.parse(JSON.stringify(this.dropdownList));
      // 不能
      if (!this.canAddIncremenet) {
        const index = arr.findIndex((rule) => rule.type === 'INCREMENT');
        arr.splice(index, 1);
      }
      return arr;
    }
  },
  watch: {
    tableInfo1(v) {
      if (v) {
        this.ruleForm.changeTableId = v.id;
        this.ruleForm.dateChangeTable = v.tableName;
      } else {
        this.ruleForm.changeTableId = '';
        this.ruleForm.dateChangeTable = '';
      }
    },
    tableInfo2(v) {
      if (v) {
        this.ruleForm.changeBeforeId = v.id;
        this.ruleForm.dateChangeBefore = v.columnName;
      } else {
        this.ruleForm.changeBeforeId = '';
        this.ruleForm.dateChangeBefore = '';
      }
    },
    tableInfo3(v) {
      if (v) {
        this.ruleForm.changeAfterId = v.id;
        this.ruleForm.dateChangeAfter = v.columnName;
      } else {
        this.ruleForm.changeAfterId = '';
        this.ruleForm.dateChangeAfter = '';
      }
    },
    visibleState(state) {
      if (state) {
        // console.log(state);
        const v = this.dataConversionObj;
        this.tableInfo1 = {
          id: v.changeTableId,
          tableName: v.dateChangeTable
        };
        this.tableInfo2 = {
          id: v.changeBeforeId,
          columnName: v.dateChangeBefore
        };
        this.tableInfo3 = {
          id: v.changeAfterId,
          columnName: v.dateChangeAfter
        };
      }
    },
    codeArr: {
      handler(v) {
        console.log(v);
        let str = '';
        let increment = null;
        v.forEach((rule) => {
          if (rule.type === 'STR') {
            str += rule.value;
          }
          if (rule.type === 'DATE') {
            const date = new Date();
            if (rule.value === 'TIMESTAMP') {
              str += +date;
            } else if (rule.value === 'yyyy') {
              str += formatDate(new Date(), 'yyyy');
            } else if (rule.value === 'yyyyMM') {
              str += formatDate(new Date(), 'yyyyMM');
            } else if (rule.value === 'yyyyMMdd') {
              str += formatDate(new Date(), 'yyyyMMdd');
            }
          }
          if (rule.type === 'INCREMENT') {
            increment = rule;
            str += rule.start.toString().padStart(rule.value, '0');
          }
        });
        this.showRes = str;
        this.codeRuleList = v;
        if (increment) {
          this.autoIncrementRecord = increment.value;
        }
      },
      deep: true
    }
  },
  methods: {
    getName(item) {
      const obj = this.dropdownList.find((v) => v.type === item.type);
      if (obj) {
        return obj.name;
      }
      return '';
    },
    move(e) {
      const relateElement = e.relatedContext.element;
      if (relateElement.type === 'INCREMENT') {
        return false;
      }
    },
    // 点击新增
    handleClick(v) {
      if (v.type === 'INCREMENT') {
        this.codeArr.push({
          id: createUnique(),
          type: v.type,
          value: '',
          start: ''
        });
      } else {
        this.codeArr.splice(-1, 0, {
          id: createUnique(),
          type: v.type,
          value: '',
          start: ''
        });
      }
      if (v.type === 'DATE') {
        this.codeArr[this.codeArr.length - 2].value = 'TIMESTAMP';
      }
      if (v.type === 'INCREMENT') {
        this.codeArr[this.codeArr.length - 1].value = 1;
        this.codeArr[this.codeArr.length - 1].start = 1;
      }
    },
    numberBlur(item, flag) {
      if (!item[flag]) {
        item[flag] = 1;
      }
    },
    deleteRule(i) {
      this.codeArr.splice(i, 1);
    },
    // 下拉框__数据转换
    handleChangeType(v) {
      this.ruleForm.changeType = v;
    },
    // 数据表值
    dataTable(v) {
      this.tableInfo1 = {
        id: v.id,
        tableName: v.tableName
      };
      if (this.$refs.searchField1) {
        this.$refs.searchField1.currentRadioObj = null;
        this.tableInfo2 = null;
      }
      if (this.$refs.searchField2) {
        this.$refs.searchField2.currentRadioObj = null;
        this.tableInfo3 = null;
      }
    },
    // Excel填入字段
    excelField(v) {
      this.tableInfo2 = {
        id: v.id,
        columnName: v.columnName
      };
    },
    // 数据库存储字段
    storageField(v) {
      this.tableInfo3 = {
        id: v.id,
        columnName: v.columnName
      };
    },
    handleReleaseSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          console.log(this.ruleForm);
          if (this.currentType === 1) {
            this.ruleForm.changeType = this.currentType;
            this.$emit('update:dataConversionObj', JSON.parse(JSON.stringify(this.ruleForm)));
          } else if (this.currentType === 2) {
            if (!this.showRes) {
              return this.$message({
                type: 'error',
                message: '请编辑编码规则'
              });
            }
            this.$emit('update:dataConversionObj', { changeType: this.ruleForm.changeType });
            this.$emit('update:codeArr', this.codeRuleList);
            this.$emit('update:autoIncrementRecord', this.autoIncrementRecord);
          }
          this.$emit('update:dataType', this.currentType);
          this.$emit('update:visible', false);
        } else {
          return false;
        }
      });
    },
    // 关闭重置值
    handleReset() {
      Object.assign(this.$data, this.$options.data());
    }
  }
};
</script>
<style lang='scss' scoped>
.dataConversion {
  header {
    padding: 10px 0;
    background: #f1f3f6;
    border-radius: 4px;
    font-size: 13px;
    color: #808080;
    line-height: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 15px;
    margin-bottom: 20px;
    .header__text {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
    }
  }
  .codeHeader {
    flex-direction: initial;
    justify-content: inherit;
  }
  &__operate {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10px;
  }
  &__dropdown {
    margin-left: auto;
  }
  &__btn {
    font-size: 13px;
    font-weight: normal;
    .iconfont {
      color: $--color-primary;
    }
  }
}
.rule {
  &__h1 {
    height: 44px;
    line-height: 44px;
    background: #f1f3f6;
    border-radius: 4px;
    padding-left: 14px;
    color: #808080;
    margin-bottom: 14px;
    &--text {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333;
    }
  }
  &__h2 {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10px;
  }
  &__dropdown {
    margin-left: auto;
  }
  &__btn {
    font-size: 13px;
    font-weight: normal;
    .iconfont {
      color: $--color-primary;
    }
  }
  &__content {
    height: calc(100% - 44px - 14px - 30px - 10px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  &__item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .iconfont:hover {
      color: $--color-primary;
    }
    &--move {
      margin-right: 8px;
      cursor: move;
    }
    &--type {
      width: 116px;
      margin-right: 10px;
    }
    &--full {
      flex: 1;
    }
    &--delete {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
</style>
