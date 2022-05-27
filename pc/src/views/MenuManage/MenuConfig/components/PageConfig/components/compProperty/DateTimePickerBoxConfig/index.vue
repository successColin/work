<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">日期时间框</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="占位提示">
        <el-input
          v-model="activeObj.placeholder"
          placeholder="请输入占位提示"
        ></el-input>
      </el-form-item>
      <el-form-item label="帮助信息">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="关联数据源"
        v-if="this.relateObj.tableInfo.tableName"
      >
        <el-select :value="1" placeholder="请选择数据源" :disabled="true">
          <el-option label="数据表" :value="1"></el-option>
        </el-select>
        <filterable-input
          class="m-t-8"
          :showInfo="relateObj.tableInfo"
          :dialogType="1"
          :disabled="true"
        ></filterable-input>
        <filterable-input
          class="m-t-8"
          placeholder="请选择字段"
          :tableName="activeObj.dataSource.tableName"
          columnTypes="3"
          :showInfo="activeObj.dataSource"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectColumnRes"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="默认值">
        <el-select
          v-model="activeObj.defaultType"
          placeholder="请选择默认值"
          @change="defaultTypeChange"
          clearable
        >
          <el-option label="当前时间" :value="1"></el-option>
          <el-option label="自定义" :value="2"></el-option>
        </el-select>
        <el-date-picker
          v-if="activeObj.defaultType === 2"
          class="m-t-10"
          type="datetime"
          placeholder="请选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="fatherObj.form[activeObj.compId]"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="状态">
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.singleStatus === 1 }]"
            @click="activeObj.singleStatus = 1"
            >普通</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 2 }]"
            @click="activeObj.singleStatus = 2"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 3 }]"
            @click="activeObj.singleStatus = 3"
            v-if="false"
            >只读</el-button
          >
          <el-button
            :class="[{ active: activeObj.singleStatus === 4 }]"
            @click="activeObj.singleStatus = 4"
            >隐藏</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item
        label="最小宽度"
        v-if="relateObj && relateObj.compName === 'TableMain'"
      >
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.05' }]"
            @click="activeObj.tableWidth = '0.05'"
            >5%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.1' }]"
            @click="activeObj.tableWidth = '0.1'"
            >10%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.15' }]"
            @click="activeObj.tableWidth = '0.15'"
            >15%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.2' }]"
            @click="activeObj.tableWidth = '0.2'"
            >20%</el-button
          >
          <el-button
            :class="[{ active: activeObj.tableWidth === '0.25' }]"
            @click="activeObj.tableWidth = '0.25'"
            >25%</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="宽度" v-else>
        <span slot="label">
          <span class="span-box">
            <span> 宽度 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </span>
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.width === '50%' }]"
            @click="activeObj.width = '50%'"
            >1/2</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '33.33%' }]"
            @click="activeObj.width = '33.33%'"
            >1/3</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '25%' }]"
            @click="activeObj.width = '25%'"
            >1/4</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '66.67%' }]"
            @click="activeObj.width = '66.67%'"
            >2/3</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.width === '75%' }]"
            @click="activeObj.width = '75%'"
            >3/4</el-button
          >
          <el-button
            :class="[{ active: activeObj.width === '100%' }]"
            @click="activeObj.width = '100%'"
            >1/1</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="验证">
        <p class="switchBox">
          是否必填
          <el-switch
            v-model="activeObj.shouldRequired"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="允许最小时间">
        <el-select
          v-model="activeObj.minTimeObj.type"
          placeholder="请选择"
          class="defaultValue__type m-b-10"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <el-date-picker
          type="datetime"
          v-if="activeObj.minTimeObj.type === 1"
          placeholder="请选择日期"
          v-model="activeObj.minTimeObj.minTime"
          value-format="timestamp"
          :picker-options="pickerOptions1"
        >
        </el-date-picker>
        <select-formula
          v-if="activeObj.minTimeObj.type === 2"
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.minTimeObj.formula"
        ></select-formula>
      </el-form-item>
      <el-form-item label="允许最大时间">
        <el-select
          v-model="activeObj.maxTimeObj.type"
          placeholder="请选择"
          class="defaultValue__type m-b-10"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <el-date-picker
          type="datetime"
          v-if="activeObj.maxTimeObj.type === 1"
          placeholder="请选择日期"
          v-model="activeObj.maxTimeObj.maxTime"
          value-format="timestamp"
          :picker-options="pickerOptions2"
        >
        </el-date-picker>
        <select-formula
          v-if="activeObj.maxTimeObj.type === 2"
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.maxTimeObj.formula"
        ></select-formula>
      </el-form-item>
      <el-form-item label="提交类型">
        <el-select v-model="activeObj.submitType" placeholder="请选择类型">
          <el-option label="始终提交" :value="1"></el-option>
          <el-option label="仅显示时提交" :value="2"></el-option>
          <el-option label="始终不提交" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import propertyMixin from '../propertyMixin';
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      value: '',
      tableArr: [],
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.activeObj.maxTimeObj.maxTime) {
            return time.getTime() > this.activeObj.maxTimeObj.maxTime;
          }
          return false;
        }
      },

      pickerOptions2: {
        disabledDate: (time) => {
          if (this.activeObj.minTimeObj.minTime) {
            return time.getTime() < this.activeObj.minTimeObj.minTime;
          }
          return false;
        }
      }
    };
  },

  components: {
    SelectFormula
  },

  computed: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    this.setRequiredRule();
  },

  methods: {
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    },
    // 设置必填规则,无则设置，有则不变
    setRequiredRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'requiredRule',
        required: true,
        message: `${this.activeObj.name}不能为空`,
        trigger: 'change'
      };
      if (ruleArr && ruleArr.length !== 0) {
        const index = ruleArr.findIndex((item) => item.flag === 'requiredRule');
        if (index === -1 && this.activeObj.shouldRequired) {
          ruleArr.push(ruleObj);
        }
        if (index !== -1 && !this.activeObj.shouldRequired) {
          ruleArr.splice(index, 1);
        }
      } else if (this.activeObj.shouldRequired) {
        this.$set(this.fatherObj.rules, this.activeObj.compId, [ruleObj]);
      }
    },

    // 默认值类型改变
    defaultTypeChange(v) {
      if (!v) {
        this.fatherObj.form[this.activeObj.compId] = '';
      }
      if (v === 1) {
        this.fatherObj.form[this.activeObj.compId] = new Date();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.relateBox {
  &__relate,
  &__table {
    width: 48% !important;
  }
  &__relate {
    margin-right: 4%;
  }
}
.styleSelect {
  &__normal,
  &__bg,
  &__self {
    display: flex;
    align-items: center;
  }
  &__left,
  &__right {
    font-size: 13px;
    font-weight: 400;
    color: #333333;
  }
  &__right {
    margin-left: 62px;
  }
  &__bg {
    .styleSelect__right span {
      display: inline-block;
      width: 48px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background: #5a80ed;
      border-radius: 4px;
      color: #fff;
    }
  }
  &__self {
    .styleSelect__right {
      display: flex;
      align-items: center;
      & > span {
        display: flex;
        align-items: center;
        i {
          font-size: 20px;
          color: #5a80ed;
          border-radius: 4px;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
