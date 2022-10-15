<!--
 * @Descripttion: 点击编辑抽屉内容
 * @Author: ytx
 * @Date: 2021-06-29 18:02:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:02:05
-->
<template>
  <section>
    <apiot-drawer
      class="drawer"
      v-on="$listeners"
      v-bind="$attrs"
      :loading.sync="showLoading"
      destroy-on-close
      @sure-click="sureClick"
      @close="handleClose"
    >
      <el-form
        v-if="visibleState"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="drawer__ruleForm"
        label-position="top"
      >
        <!-- 单表 -->
        <section v-if="tableState">
          <!-- 第一行 -->
          <div class="form__line">
            <el-form-item
              class="form__child"
              :label="$t('importTemplate.databaseField')"
              prop="databaseColoumn"
            >
              <filterable-input
                :placeholder="$t('importTemplate.searchField')"
                :dialogType="2"
                :idNeedId="false"
                :showInfo="fieldTableInfo"
                :tableName="singleTableName"
                @selectRes="selectRes"
              ></filterable-input>
            </el-form-item>
            <el-form-item
              class="form__child"
              :label="$t('importTemplate.fieldName')"
              prop="coloumnName"
            >
              <apiot-input
                v-model="ruleForm.coloumnName"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('importTemplate.fieldName'),
                  })
                "
              ></apiot-input>
            </el-form-item>
          </div>
          <!-- 第二行 -->
          <div class="form__line">
            <el-form-item class="form__child" :label="$t('common.type')">
              <apiot-select
                v-model="ruleForm.coloumnType"
                :options="typeArr"
                :placeholder="
                  $t('placeholder.pleaseSelect', { any: $t('common.type') })
                "
                disabled
              ></apiot-select>
            </el-form-item>
            <el-form-item class="form__child" prop="type">
              <div slot="label">
                {{ $t('importTemplate.importConstraints') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="导入时，该字段相同的记录则为更新，不同的则新增"
                  placement="top"
                >
                  <i class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </div>
              <el-radio-group v-model="ruleForm.isCheckColoumn">
                <el-radio :label="0">{{ $t('common.no') }}</el-radio>
                <el-radio :label="1">{{ $t('common.is') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="form__line">
            <el-form-item class="form__child">
              <div slot="label">
                {{ $t('importTemplate.isParent') }}
              </div>
              <el-radio-group v-model="ruleForm.isParent">
                <!-- 1是 2否 -->
                <el-radio :label="2">{{ $t('common.no') }}</el-radio>
                <el-radio :label="1">{{ $t('common.is') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </section>
        <!-- 多表 -->
        <section v-else>
          <!-- 第一行 -->
          <div class="form__line">
            <el-form-item
              class="form__child"
              :label="$t('importTemplate.tableName')"
              prop="tableName"
            >
              <apiot-select
                v-model="ruleForm.tableName"
                :options="tableNameArr"
                :placeholder="
                  $t('placeholder.pleaseSelect', {
                    any: $t('importTemplate.tableName'),
                  })
                "
                @change="handleChangeTableName"
              ></apiot-select>
            </el-form-item>
            <el-form-item
              class="form__child"
              :label="$t('importTemplate.databaseField')"
              prop="databaseColoumn"
            >
              <filterable-input
                :placeholder="$t('importTemplate.searchField')"
                :dialogType="2"
                :idNeedId="false"
                :showInfo="fieldTableInfo"
                :tableName="moreTableName"
                @selectRes="selectRes"
              ></filterable-input>
            </el-form-item>
          </div>
          <!-- 第二行 -->
          <div class="form__line">
            <el-form-item
              class="form__child"
              :label="$t('importTemplate.fieldName')"
              prop="coloumnName"
            >
              <apiot-input
                v-model="ruleForm.coloumnName"
                :placeholder="
                  $t('placeholder.pleaseEnterAny', {
                    any: $t('importTemplate.fieldName'),
                  })
                "
              ></apiot-input>
            </el-form-item>
            <el-form-item class="form__child" :label="$t('common.type')">
              <apiot-select
                v-model="ruleForm.coloumnType"
                :options="typeArr"
                :placeholder="
                  $t('placeholder.pleaseSelect', {
                    any: $t('common.type'),
                  })
                "
                disabled
              ></apiot-select>
            </el-form-item>
          </div>
          <!-- 第三行 -->
          <div class="form__line">
            <el-form-item class="form__child">
              <div slot="label">
                {{ $t('importTemplate.importConstraints') }}
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="导入时，该字段相同的记录则为更新，不同的则新增"
                  placement="top"
                >
                  <i class="iconfont icon-bangzhu"></i>
                </el-tooltip>
              </div>
              <el-radio-group v-model="ruleForm.isCheckColoumn">
                <el-radio :label="0">{{ $t('common.no') }}</el-radio>
                <el-radio :label="1">{{ $t('common.is') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="form__child">
              <div slot="label">
                {{ $t('importTemplate.isParent') }}
              </div>
              <el-radio-group v-model="ruleForm.isParent">
                <!-- 1是 2否 -->
                <el-radio :label="2">{{ $t('common.no') }}</el-radio>
                <el-radio :label="1">{{ $t('common.is') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </section>
        <!-- 第三行字段校验 -->
        <div
          class="form__line"
          v-if="[1, 2, 3, 4].includes(ruleForm.coloumnType)"
        >
          <el-form-item class="form__child" :label="checkTypeTitle">
            <!-- varcher -->
            <section class="form__checkType" v-if="ruleForm.coloumnType === 2">
              <check-type
                :ref="refLeftValue"
                class="form__checkType--dec"
                :title="$t('importTemplate.limitedNumberOfWords')"
              >
                <el-input-number
                  v-model="checkOne"
                  :controls="false"
                  :min="0"
                  :max="leftMaximum"
                ></el-input-number>
                <div class="m-r-6 m-l-6">-</div>
                <el-input-number
                  v-model="checkTwo"
                  :controls="false"
                  :min="1"
                  :max="leftMaximum"
                ></el-input-number>
              </check-type>
              <check-type
                :ref="refRightValue"
                class="form__checkType--dec"
                :title="$t('importTemplate.regularExpressions')"
              >
                <apiot-select
                  v-model="dropDownValue"
                  :options="expressionList"
                  clearable
                  :placeholder="
                    $t('placeholder.pleaseSelect', {
                      any: $t('importTemplate.regularExpressions'),
                    })
                  "
                  @change="handleChangePublic"
                ></apiot-select>
              </check-type>
            </section>
            <!-- int -->
            <section
              class="form__checkType"
              style="width: calc(50% - 15px)"
              v-if="ruleForm.coloumnType === 1"
            >
              <check-type
                :ref="refLeftValue"
                class="form__checkType--dec"
                :title="$t('importTemplate.numericalLength')"
              >
                <el-input-number
                  v-model="checkOne"
                  :controls="false"
                  :min="0"
                  :max="leftMaximum"
                ></el-input-number>
                <div class="m-r-6 m-l-6">-</div>
                <el-input-number
                  v-model="checkTwo"
                  :controls="false"
                  :min="1"
                  :max="leftMaximum"
                ></el-input-number>
              </check-type>
            </section>
            <!-- Decimal -->
            <section class="form__checkType" v-if="ruleForm.coloumnType === 4">
              <check-type
                :ref="refLeftValue"
                class="form__checkType--dec"
                :title="$t('importTemplate.limitTheNumberOfWords')"
              >
                <el-input-number
                  v-model="checkOne"
                  :controls="false"
                  :min="0"
                  :max="leftMaximum"
                ></el-input-number>
                <div class="m-r-6 m-l-6">-</div>
                <el-input-number
                  v-model="checkTwo"
                  :controls="false"
                  :min="1"
                  :max="leftMaximum"
                ></el-input-number>
              </check-type>
              <check-type
                :ref="refRightValue"
                class="form__checkType--dec"
                :title="$t('importTemplate.keepDecimalPlaces')"
              >
                <apiot-select
                  v-model="dropDownValue"
                  :options="decimalPlaceArr"
                  :placeholder="
                    $t('placeholder.pleaseSelect', { any: $t('common.type') })
                  "
                ></apiot-select>
              </check-type>
            </section>
            <!-- Datetime -->
            <section class="form__checkType" v-if="ruleForm.coloumnType === 3">
              <check-type
                :ref="refLeftValue"
                class="form__checkType--dec"
                :title="$t('importTemplate.dateRange')"
              >
                <el-date-picker
                  v-model="checkOne"
                  type="daterange"
                  range-separator="-"
                  :start-placeholder="$t('importTemplate.startDate')"
                  :end-placeholder="$t('importTemplate.endDate')"
                  value-format="yyyy/MM/dd"
                >
                </el-date-picker>
              </check-type>
              <el-form-item
                class="form__child timeDateCheck"
                prop="dateFormatType"
                style="margin-bottom: 0; flex: 1 1 100%"
              >
                <check-type
                  :ref="refRightValue"
                  class="form__checkType--dec"
                  :title="$t('importTemplate.format')"
                  :isRequired="true"
                >
                  <apiot-select
                    v-model="ruleForm.dateFormatType"
                    :options="dateFormatArr"
                    :placeholder="
                      $t('placeholder.pleaseSelect', { any: $t('common.type') })
                    "
                  ></apiot-select>
                </check-type>
              </el-form-item>
            </section>
          </el-form-item>
        </div>
        <!-- 数据转换 -->
        <div class="form__line">
          <el-form-item
            class="form__child"
            :label="$t('importTemplate.dataConversion')"
          >
            <apiot-button
              class="form__child--button"
              @click="handleDataConversion"
            >
              <i class="iconfont icon-shezhi"></i>
              {{ $t('importTemplate.setUp') }}
            </apiot-button>
          </el-form-item>
        </div>
        <!-- 转换为关联表ID -->
        <div
          class="form__line conversion__con"
          v-if="
            (dataType === 1 && dataConversionObj.changeTableId) ||
            (dataType === 1 && dataConversionObj.changeBeforeId) ||
            (dataType === 1 && dataConversionObj.changeAfterId)
          "
        >
          <check-type
            :title="$t('importTemplate.toTheAssociatedTableID')"
            :isDelete="true"
            :isCheckbox="false"
            @handleDelete="handleDelete"
          >
            <section class="conversion__section">
              <div
                v-for="(item, i) in conversionArr"
                :key="i"
                class="conversion__value"
              >
                <div>{{ $t(item.name) }}</div>
                <div
                  class="font__ellipsis"
                  :title="getConversionVal(item.props)"
                  :style="`${
                    getConversionVal(item.props) ? 'opacity: 1' : 'opacity: 0'
                  }`"
                >
                  <i class="iconfont icon-shujubiao" v-if="item.isShowIcon"></i>
                  <span>
                    {{ getConversionVal(item.props) }}
                  </span>
                </div>
              </div>
            </section>
          </check-type>
        </div>
        <!-- 编码规则 -->
        <div
          class="form__line conversion__code"
          v-if="dataType === 2 && codeArr.length !== 0"
        >
          <div
            v-for="(item, i) in codeArr"
            :key="i"
            class="conversion__code--box"
          >
            <span>{{ getCodeTitle(item) }}：</span>
            <span>{{ getCodeVal(item) }}</span>
          </div>
          <i
            class="iconfont icon-shanchu"
            style="color: #aaaaaa"
            @click="handleDeleteCode"
          ></i>
        </div>
        <!-- 取字典值 -->
        <div
          class="form__line conversion__code"
          v-if="dataType === 3 && dictObj.dictName"
        >
          <div class="conversion__code--box">
            <span>取字典值：</span>
            <span>{{ dictObj.dictName }}</span>
          </div>
          <i
            class="iconfont icon-shanchu"
            style="color: #aaaaaa"
            @click="handleDeleteDict"
          ></i>
        </div>
        <!-- 备注 -->
        <div class="form__line">
          <el-form-item
            class="form__child"
            :label="$t('importTemplate.remark')"
          >
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('importTemplate.content'),
                })
              "
              v-model="ruleForm.remarks"
            >
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </apiot-drawer>
    <data-conversion
      :title="$t('importTemplate.dataConversion')"
      :visible.sync="dialogVisibleDataConversion"
      :visibleState="dialogVisibleDataConversion"
      :dataConversionObj.sync="dataConversionObj"
      :codeArr.sync="codeArr"
      :autoIncrementRecord.sync="autoIncrementRecord"
      :dataType.sync="dataType"
      :dropdownList="dropdownList"
      :timeArr="timeArr"
      :dictObj.sync="dictObj"
    >
    </data-conversion>
  </section>
</template>

<script>
import {
  addInsertColoumns,
  updateModifyColoumns,
  addCodeRule,
  updateCodeRule,
  getCodeRule,
  deleteCodeRule
} from '@/api/importTemplate';
// import { getExpressionList } from '@/api/importTemplate';
import CheckType from '../CheckType';
import DataConversion from '../DataConversion';

export default {
  props: {
    // 新增：true；编辑：fasle
    isAddDrawerState: {
      type: Boolean,
      default: true
    },
    // 表对象
    giveChildValue: {
      type: Object,
      default: () => {}
    },
    // 字段对象
    currentObj: {
      type: Object,
      default: () => {}
    },
    // 正则表达式
    expressionList: {
      type: Array,
      default: () => []
    },
    visibleState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dropdownList: [
        {
          type: 'STR',
          name: '固定字符'
        },
        {
          type: 'DATE',
          name: '提交日期'
        },
        {
          type: 'INCREMENT',
          name: '自增位数'
        }
      ],
      timeArr: [
        {
          value: 'TIMESTAMP',
          label: '时间戳'
        },
        {
          value: 'yyyy',
          label: '年'
        },
        {
          value: 'yyyyMM',
          label: '年月'
        },
        {
          value: 'yyyyMMdd',
          label: '年月日'
        }
      ],
      // 是否显示loading
      showLoading: false,
      // 表单
      // 第一个，公共值
      checkOne: [],
      checkTwo: '',
      // 公共下拉值
      dropDownValue: '',
      // 字段校验是否打钩
      refLeftValue: '',
      refRightValue: '',
      // 数据转换
      dataConversionObj: {},
      codeArr: [], // 编码规则值
      dictObj: {},
      autoIncrementRecord: '',
      dataType: 1, // 数据类型
      // 多表表名
      moreTableName: '',
      ruleForm: {
        changeJsonString: '', // 字段转换json
        checkJsonString: '', // 字段限制json
        coloumnId: '', // 字段id ---
        coloumnName: '', // 字段名称 ---
        coloumnType: '', // 字段类型 ---
        databaseColoumn: '', // 数据库字段 ---
        isCheckColoumn: 0, // 是否为约束字段（0 否 1是）---
        isNotNull: '', // 是否必填
        remarks: '', // 备注 ---
        tableName: '', // 表名
        tableId: '',
        templateId: '', // 模板id
        dateFormatType: '', // 日期格式
        isParent: 2 // 是否是父字段
      },
      fieldTableInfo: {}, // 返显字段
      tableInfo: {},
      // 是否显示转换
      dialogVisibleDataConversion: false,
      currentLineData: {},
      // 最大值
      leftMaximum: 0,
      rightMaxDecimal: '',
      // 转换对象
      conversionArr: [
        {
          name: 'importTemplate.entityTable',
          props: 'dateChangeTable',
          isShowIcon: true
        },
        {
          name: 'importTemplate.excelFillInFields',
          props: 'dateChangeBefore'
        },
        {
          name: 'importTemplate.databaseStorageField',
          props: 'dateChangeAfter'
        }
      ],
      // 保留小数位数
      decimalPlaceArr: [],
      // 日期格式
      dateFormatArr: [
        {
          value: 1,
          name: 'YYYY-MM-DD'
        },
        {
          value: 2,
          name: 'YYYY-MM-DD hh:mm:ss'
        }
      ],
      isDeleteObj: {
        state: false,
        value: ''
      }
    };
  },
  computed: {
    getConversionVal() {
      return function (i) {
        return this.dataConversionObj && this.dataConversionObj[i];
      };
    },
    getCodeTitle() {
      return function (v) {
        const obj = this.dropdownList.find((item) => item.type === v.type);
        return obj.name;
      };
    },
    getCodeVal() {
      return function (v) {
        if (v.type === 'STR') {
          return v.value;
        }
        if (v.type === 'DATE') {
          const obj = this.timeArr.find((item) => item.value === v.value);
          return obj.label;
        }
        if (v.type === 'INCREMENT') {
          return `${v.value}位(起始值${v.start})`;
        }
      };
    },
    rules() {
      return {
        coloumnName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('importTemplate.fieldName')
            }),
            trigger: 'change'
          }
        ],
        databaseColoumn: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('importTemplate.databaseField')
            }),
            trigger: 'change'
          }
        ],
        tableName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('importTemplate.tableName')
            }),
            trigger: 'change'
          }
        ],
        dateFormatType: [
          {
            required: true,
            message: this.$t('placeholder.pleaseSelect', {
              any: this.$t('importTemplate.dateType')
            }),
            trigger: 'change'
          }
        ]
      };
    },
    // 获取单表表名
    singleTableName() {
      if (this.giveChildValue.relationsList.length === 1) {
        return this.giveChildValue.relationsList[0].tableName;
      }
      return '';
    },
    // true 单表， false 多表
    tableState() {
      if (this.giveChildValue.relationsList.length === 1) {
        return true;
      }
      return false;
    },
    // 表名
    tableNameArr() {
      const arr = [];
      // console.log(this.giveChildValue.relationsList);
      this.giveChildValue.relationsList.forEach((item) => {
        arr.push({
          name: item.tableName,
          value: item.tableId
        });
      });
      return arr;
    },
    // 类型数组
    typeArr() {
      return this.$store.getters.getCurDict('COLUMNS_TYPE');
    },
    checkTypeTitle() {
      let type = '';
      const _this = this;
      switch (this.ruleForm.coloumnType) {
        case 1:
          type = 'Int';
          _this.refLeftValue = 'int__num';
          _this.checkOne = _this.checkOne || 0;
          _this.checkTwo = _this.checkTwo || this.leftMaximum;
          break;
        case 2:
          type = 'Varcher';
          _this.refLeftValue = 'varcher__num';
          _this.refRightValue = 'varcher__type';
          _this.checkOne = _this.checkOne || 0;
          _this.checkTwo = _this.checkTwo || this.leftMaximum;
          break;
        case 3:
          type = 'Datetime';
          _this.refLeftValue = 'datetime__num';
          _this.refRightValue = 'datetime__type';
          break;
        case 4:
          type = 'Decimal';
          _this.refLeftValue = 'decimal__num';
          _this.refRightValue = 'decimal__type';
          _this.checkOne = _this.checkOne || 0;
          _this.checkTwo = _this.checkTwo || this.leftMaximum;
          break;
        default:
          type = '';
          break;
      }
      return `${this.$t('importTemplate.fieldCheck')}（${type}）`;
    }
  },
  components: {
    CheckType,
    DataConversion
  },
  watch: {
    'ruleForm.dateFormatType': function (v) {
      this.dropDownValue = v;
    },
    fieldTableInfo(v) {
      if (v) {
        this.ruleForm.databaseColoumn = v.columnName;
        this.ruleForm.coloumnId = v.id;
      } else {
        this.ruleForm.databaseColoumn = '';
        this.ruleForm.coloumnId = '';
      }
    },
    rightMaxDecimal(v) {
      const arr = [];
      for (let i = 1; i <= v; i += 1) {
        arr.push({
          value: i,
          name: `${i}${this.$t('importTemplate.decimalPlaces')}`
        });
      }
      if (arr.length !== 0) {
        this.dropDownValue = v;
        this.decimalPlaceArr = arr;
      }
    },
    // 赋值
    visibleState(v) {
      if (v) {
        if (this.giveChildValue.relationsList.length === 1) {
          this.ruleForm.tableName = this.giveChildValue.relationsList[0].tableName;
          this.ruleForm.tableId = this.giveChildValue.relationsList[0].tableId;
          // console.log(this.ruleForm.tableName, this.ruleForm.tableId);
        }
      }
    },
    // 赋值
    currentObj(v) {
      // console.log(v);
      if (JSON.stringify(v) === '{}') {
        this.$refs.ruleForm.resetFields();
        Object.assign(this.$data, this.$options.data());
        return;
      }
      const {
        coloumnName,
        isCheckColoumn,
        coloumnType,
        remarks,
        coloumnId,
        databaseColoumn,
        changeType,
        changeTableId,
        dateChangeTable,
        changeBeforeId,
        dateChangeBefore,
        changeAfterId,
        dateChangeAfter,
        checkOne,
        // isCheckOne,
        // isCheckTwo,
        tableId,
        checkMaxDecimal,
        checkMaxNumber,
        tableName,
        codeRuleId,
        isParent,
        dictId,
        dictName
      } = v;
      this.ruleForm.coloumnName = coloumnName;
      this.ruleForm.isCheckColoumn = isCheckColoumn;
      this.ruleForm.coloumnType = coloumnType;
      this.ruleForm.remarks = remarks;
      this.ruleForm.databaseColoumn = databaseColoumn;
      this.moreTableName = tableName;
      this.ruleForm.codeRuleId = codeRuleId;
      this.ruleForm.isParent = isParent || 2;
      this.dictObj = {
        id: dictId,
        dictName
      };

      this.ruleForm.tableName = tableName;
      this.ruleForm.tableId = tableId && Number(tableId);
      // 数据库字段
      // console.log(coloumnId);
      this.fieldTableInfo = {
        id: coloumnId,
        columnName: databaseColoumn
      };
      // console.log(this.fieldTableInfo);
      // 数据转换
      this.dataConversionObj = {
        changeType,
        changeTableId,
        dateChangeTable,
        changeBeforeId,
        dateChangeBefore,
        changeAfterId,
        dateChangeAfter
      };
      this.dataType = changeType;
      this.dropDownValue = v.checkTwo && Number(v.checkTwo);
      this.ruleForm.dateFormatType = v.checkTwo && Number(v.checkTwo);
      this.leftMaximum = checkMaxNumber;
      this.rightMaxDecimal = checkMaxDecimal;
      if (checkOne && this.ruleForm.coloumnType !== 3) {
        const arrCheck = checkOne && checkOne.split('-');
        const a = 0;
        const b = 1;
        // console.log(this.checkOne, this.checkTwo);
        this.checkOne = arrCheck[a];
        this.checkTwo = arrCheck[b];
      } else if (checkOne && this.ruleForm.coloumnType === 3) {
        this.$nextTick(() => {
          this.checkOne = checkOne && checkOne.split('-');
        });
      } else {
        this.checkOne = '';
        this.checkTwo = '';
      }
      this.getCodeRuleFun();
    }
  },
  methods: {
    async getCodeRuleFun() {
      if (this.ruleForm.codeRuleId && this.dataType === 2) {
        const res = await getCodeRule({
          compId: `${this.ruleForm.tableName}-${this.ruleForm.databaseColoumn}`,
          designId: this.giveChildValue.id
        });
        console.log(res);
        if (res) {
          this.codeArr = [...res.codeRuleList];
        }
      }
    },
    // 按钮__确定
    sureClick() {
      // 字段校验
      // console.log(this.ruleForm.coloumnType);
      const checkOne =
        this.ruleForm.coloumnType !== 3
          ? `${this.checkOne || 0}-${this.checkTwo}`
          : this.checkOne && this.checkOne.join('-');
      const checkJsonString = {
        checkOne,
        checkTwo: this.dropDownValue
      };
      // console.log(checkJsonString);
      // console.log(this.giveChildValue);
      const _this = this;
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            _this.ruleForm.changeJsonString = JSON.stringify(_this.dataConversionObj);
            _this.ruleForm.checkJsonString = JSON.stringify(checkJsonString);
            _this.ruleForm.templateId = _this.giveChildValue.id;
            _this.ruleForm.checkMaxNumber = _this.leftMaximum;
            _this.ruleForm.checkMaxDecimal = _this.rightMaxDecimal;
            _this.ruleForm.dictId = _this.dictObj.id;
            // 编码
            const codeParams = {
              codeRuleList: _this.codeArr,
              tableName: _this.ruleForm.tableName,
              primaryKey: _this.ruleForm.databaseColoumn,
              compId: `${_this.ruleForm.tableName}-${_this.ruleForm.databaseColoumn}`,
              sysMenuDesignId: _this.giveChildValue.id,
              autoIncrementRecord: _this.autoIncrementRecord
            };
            // 编码id === 2
            if (_this.dataType === 2) {
              // 修改编码
              if (_this.ruleForm.codeRuleId) {
                codeParams.id = _this.ruleForm.codeRuleId;
                await updateCodeRule(codeParams);
              } else {
                // 新增编码
                const res = await addCodeRule(codeParams);
                _this.ruleForm.codeRuleId = res.id;
              }
            }

            if (_this.isAddDrawerState) {
              // 新增
              await addInsertColoumns(_this.ruleForm);
            } else {
              // 编辑
              const params = {
                id: _this.currentObj.id,
                ..._this.ruleForm
              };
              await updateModifyColoumns(params);
            }
            if (this.isDeleteObj.state) {
              await deleteCodeRule({ ids: this.isDeleteObj.value });
            }
            _this.$emit('getList');
            _this.$emit('update:visible', false);
            _this.showLoading = false;
            _this.$message({
              type: 'success',
              message: _this.isAddDrawerState
                ? _this.$t('common.newSuccess')
                : _this.$t('common.successfullyModified')
            });
          } catch (err) {
            _this.showLoading = false;
          }
        } else {
          _this.showLoading = false;
          return false;
        }
      });
    },
    // 删除方法
    deleteFun(callback) {
      this.$confirm('是否确定删除', this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      }).then(async () => {
        if (callback) {
          callback();
        }
      });
    },
    // 按钮__删除转换为关联表Id
    handleDelete() {
      this.deleteFun(() => {
        this.dataConversionObj = {};
      });
    },
    // 按钮__删除编码规则
    handleDeleteCode() {
      this.deleteFun(async () => {
        this.isDeleteObj = {
          state: true,
          value: this.ruleForm.codeRuleId
        };
        this.codeArr = [];
        this.dataType = 1;
        this.dataConversionObj = {};
        this.ruleForm.codeRuleId = '';
      });
    },
    // 按钮__删除取字典值
    handleDeleteDict() {
      this.deleteFun(() => {
        this.dictObj = {};
        this.dataConversionObj = {};
      });
    },
    // 关闭
    handleClose() {
      this.$emit('update:visible', false);
      this.$emit('update:currentObj', {});
      this.isDeleteObj = {
        state: false,
        value: ''
      };
    },
    // 设置数据转换
    handleDataConversion() {
      this.dialogVisibleDataConversion = true;
      this.getCodeRuleFun();
    },
    // 获取数据表值
    selectRes(v) {
      this.fieldTableInfo = {
        id: v.id,
        columnName: v.columnName
      };
      this.ruleForm.coloumnType = v.columnTypeDict; // 字段类型
      this.ruleForm.coloumnName = v.memo; // 字段名称
      this.leftMaximum = v.columnLength || 0; // 左侧最大值
      this.rightMaxDecimal = v.decimalPlace;
      // 重置下拉框的值
      this.dropDownValue = '';
      this.ruleForm.dateFormatType = '';
      // 数据转换
      this.dataConversionObj = {};

      this.checkOne = '';
      this.checkTwo = '';
    },
    // 选择__表达式
    handleChangePublic(v) {
      this.dropDownValue = v;
    },
    // 改变表名
    handleChangeTableName(v) {
      const res = this.giveChildValue.relationsList.find((item) => item.tableId === v);
      this.ruleForm.tableName = res.tableName;
      this.ruleForm.tableId = res.tableId;
      // 更多表
      this.moreTableName = res.tableName;
      // 数据转换
      this.dataConversionObj = {};
      this.fieldTableInfo = {};
      this.ruleForm.coloumnType = '';
    }
  }
};
</script>
<style lang='scss' scoped>
.drawer {
  &__ruleForm {
    padding: 20px 37px;
    .form__line {
      display: flex;
      width: 100%;
      el-form-item {
        width: 100%;
      }
      .timeDateCheck {
        ::v-deep {
          .el-form-item__error {
            margin-left: 20px;
          }
        }
      }
      .form__child {
        flex: 1;
        margin-bottom: 10px;
        .form__checkType {
          display: flex;
          &--dec {
            &:nth-child(2n) {
              margin-left: 30px;
            }
          }
          ::v-deep {
            .el-input-number {
              width: auto;
            }
          }
        }
        &--button {
          font-size: 13px;
          color: #333333;
          .icon-dingbudonghuatuansan {
            font-size: 13px;
            color: #4689f5;
            margin-right: 3px;
          }
          .icon-shezhi {
            color: $--color-primary;
            margin-right: 3px;
          }
          ::v-deep {
            .el-button {
              padding: 0 14px;
            }
          }
        }
        &:nth-child(2n) {
          margin-left: 30px;
        }
      }
    }
    .conversion__code {
      padding: 12px 15px;
      background: #fafafa;
      border-radius: 4px;
      flex-direction: column;
      position: relative;
      box-sizing: border-box;
      &--box {
        margin: 4px 0;
        span:nth-child(1) {
          font-size: 14px;
          color: #808080;
        }
        span:nth-child(2) {
          font-size: 14px;
          color: #333333;
        }
      }
      .icon-shanchu {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
      }
    }
    .conversion__con {
      display: flex;
      width: 100%;
      .conversion__section {
        width: 100%;
        display: flex;
        .conversion__value {
          flex: 1;
          display: flex;
          height: 40px;
          & > div {
            flex: 1;
          }
          div:nth-child(1) {
            background: #fafafa;
            border-right: 1px solid #e9e9e9;
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            padding-right: 10px;

            font-size: 13px;
            color: #333333;
          }
          div:nth-child(2) {
            box-sizing: border-box;
            display: flex;
            align-items: center;
            background: #e5f0ff;
            border-radius: 4px;
            margin: 8px 10px;
            height: 24px;
            overflow: hidden;
            margin-left: 10px;
            .icon-shujubiao {
              width: 24px;
              height: 24px;
              background: #5a80ed;
              font-size: 18px;
              color: #ffffff;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            span {
              margin-left: 10px;
              font-size: 13px;
              color: #333333;
            }
          }
        }
      }
      ::v-deep {
        .checkType__container {
          padding: 0;
        }
      }
    }
    .form__relation {
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      flex-direction: column;
      &--title {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        padding: 10px;
      }
      &--con {
        display: flex;
        margin-bottom: 20px;
        align-items: center;
        .form__equal {
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: #333333;
        }
        .form__average {
          flex: 1;
        }
      }
    }
    .icon-bangzhu {
      color: #aaaaaa;
      cursor: pointer;
    }
    ::v-deep {
      .el-form-item__label {
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-top: 8px;
      }
    }
  }
}
</style>
