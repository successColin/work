<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="rule"
    title="设置编码规则"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <h1 class="rule__h1">
      编码预览（不包含公式）：<span class="rule__h1--text">{{ showRes }}</span>
    </h1>
    <h2 class="rule__h2">
      编码规则
      <el-dropdown class="rule__dropdown" @command="handleClick">
        <apiot-button class="rule__btn">
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
    <div class="rule__content">
      <draggable
        group="rule"
        animation="300"
        handle=".icon-zongxiangtuodong"
        v-model="codingRules"
        filter=".forbid"
        :move="move"
      >
        <transition-group tag="ul">
          <li
            class="rule__item"
            v-for="(item, i) in codingRules"
            :key="item.id"
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
              :max="20"
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
            <select-formula
              :configData="configData"
              :triggerCompMap="triggerCompMap"
              class="rule__item--full"
              v-if="item.type === 'FORMULA'"
              v-model="item.value"
            ></select-formula>
            <span
              class="rule__item--delete"
              @click="deleteRule(i)"
              v-if="codingRules.length !== 1"
            >
              <i class="iconfont icon-shanchu"></i>
            </span>
          </li>
        </transition-group>
      </draggable>
    </div>
  </apiot-dialog>
</template>

<script>
import { createUnique, formatDate } from '@/utils/utils';
import SelectFormula from '../../GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  name: '',
  props: {
    activeObj: {
      type: Object
    },
    configData: {
      type: Array
    },
    getCompIndex: {
      type: Number
    },
    triggerCompMap: {
      type: Object
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
        },
        {
          type: 'FORMULA',
          name: '公式'
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
      codingRules: [],
      showRes: ''
    };
  },
  computed: {
    canAddIncremenet() {
      const index = this.codingRules.findIndex((rule) => rule.type === 'INCREMENT');
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

  components: {
    SelectFormula
  },

  mounted() {
    this.configData[0].codeRuleList[this.getCompIndex].codeRuleList.forEach((rule) => {
      rule.id = createUnique();
    });
    this.codingRules = this.configData[0].codeRuleList[this.getCompIndex].codeRuleList;
  },

  methods: {
    handleClick(v) {
      if (v.type === 'INCREMENT') {
        this.codingRules.push({
          id: createUnique(),
          type: v.type,
          value: '',
          start: ''
        });
      } else {
        this.codingRules.splice(-1, 0, {
          id: createUnique(),
          type: v.type,
          value: '',
          start: ''
        });
      }

      if (v.type === 'DATE') {
        this.codingRules[this.codingRules.length - 2].value = 'TIMESTAMP';
      }
      if (v.type === 'INCREMENT') {
        this.codingRules[this.codingRules.length - 1].value = 1;
        this.codingRules[this.codingRules.length - 1].start = 1;
      }
    },
    getName(item) {
      const obj = this.dropdownList.find((v) => v.type === item.type);
      if (obj) {
        return obj.name;
      }
      return '';
    },
    numberBlur(item, flag) {
      if (!item[flag]) {
        item[flag] = 1;
      }
    },
    deleteRule(i) {
      this.codingRules.splice(i, 1);
    },
    move(e) {
      const relateElement = e.relatedContext.element;
      if (relateElement.type === 'INCREMENT') {
        return false;
      }
    }
  },

  watch: {
    codingRules: {
      handler(v) {
        // console.log(v);
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
        // 更改顶级值
        const curRule = this.configData[0].codeRuleList[this.getCompIndex];
        curRule.operationType = 2;
        curRule.codeRuleList = v;
        if (increment) {
          curRule.autoIncrementRecord = increment.value;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
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
