<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">日期框</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <PlacehoderConfig :activeObj="activeObj"></PlacehoderConfig>
      <el-form-item label="开始占位符提示" v-if="intervalTimeShow">
        <el-input
          v-model="activeObj.startPlaceholder"
          placeholder="请输入占位提示"
        ></el-input>
      </el-form-item>
      <el-form-item label="结束占位符提示" v-if="intervalTimeShow">
        <el-input
          v-model="activeObj.endPlaceholder"
          placeholder="请输入占位提示"
        ></el-input>
      </el-form-item>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <el-form-item label="时间显示风格">
        <el-select v-model="activeObj.timeType" class="m-r-8">
          <el-option label="yyyy" value="year"></el-option>
          <el-option label="yyyy-MM" value="month"></el-option>
          <el-option label="yyyy-MM-dd" value="date"></el-option>
        </el-select>
      </el-form-item>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        columnTypes="3"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <el-form-item label="默认值" v-if="!intervalTimeShow">
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
          :type="getTimeType"
          placeholder="请选择日期"
          :format="getFormatTime"
          :value-format="getFormatTime"
          v-model="fatherObj.form[activeObj.compId]"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="默认值" v-else>
        <!-- 日期区间框 -->
        <el-date-picker
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :format="getFormatTime"
          :value-format="getFormatTime"
          :editable="false"
          v-model="dataTime"
          range-separator="至"
          @change="handleChangeDateTime"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        v-if="relateObj && relateObj.compName === 'TableMain' && !isUser"
      >
        <p class="switchBox">
          是否启用表头搜索
          <el-switch
            v-model="activeObj.enableTableSearch"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <StatusConfig :activeObj="activeObj"></StatusConfig>
      <WidthConfig
        :activeObj="activeObj"
        :relateObj="relateObj"
        :isShow="isShow"
      ></WidthConfig>
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
      <el-form-item v-if="!isShow">
        <p class="switchBox">
          是否选择区间
          <el-tooltip
            content="webview传入参数，开始时间加_start，结束时间加_end"
            placement="top"
          >
            <i class="iconfont icon-bangzhu" />
          </el-tooltip>
          <el-switch
            v-model="activeObj.timeInterval"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="handleChangeTimeInterval"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="允许最小时间" v-if="!isUser">
        <el-select
          v-model="activeObj.minTimeObj.type"
          placeholder="请选择"
          class="defaultValue__type m-b-10"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <el-date-picker
          :type="getTimeType"
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
      <el-form-item label="允许最大时间" v-if="!isUser">
        <el-select
          v-model="activeObj.maxTimeObj.type"
          placeholder="请选择"
          class="defaultValue__type m-b-10"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <el-date-picker
          :type="getTimeType"
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
      <el-form-item label="提交类型" v-if="isShow && !isUser">
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
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      dataTime: '',
      value: '',
      tableArr: [],
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.activeObj.maxTimeObj.maxTime) {
            return time.getTime() > this.activeObj.maxTimeObj.maxTime;
          }
          return false;
        },
      },

      pickerOptions2: {
        disabledDate: (time) => {
          if (this.activeObj.minTimeObj.minTime) {
            return time.getTime() < this.activeObj.minTimeObj.minTime;
          }
          return false;
        },
      },
    };
  },

  components: {
    SelectFormula,
  },

  watch: {
    'fatherObj.form': {
      handler(v) {
        const copy =
          (JSON.parse(JSON.stringify(v)) &&
            JSON.parse(JSON.stringify(v))[this.activeObj.compId]) ||
          '';
        if (!copy) {
          this.dataTime = '';
          return;
        }
        if (copy.indexOf(',') !== -1) {
          const val = copy && copy.split(',');
          this.dataTime = [val[0], val[1]];
        }
      },
      deep: true,
      immediate: true,
    },
    'activeObj.minTimeObj.minTime': function (v) {
      console.log(v);
      if (v == null) {
        this.activeObj.minTimeObj.minTime = '';
      }
    },
    'activeObj.maxTimeObj.maxTime': function (v) {
      if (v == null) {
        this.activeObj.maxTimeObj.maxTime = '';
      }
    },
  },

  computed: {
    intervalTimeShow() {
      return this.activeObj.timeInterval;
    },
    getTimeType() {
      return this.activeObj.timeType || 'date';
    },
    getFormatTime() {
      if (this.activeObj.timeType === 'year') {
        return 'yyyy';
      }
      if (this.activeObj.timeType === 'month') {
        return 'yyyy-MM';
      }
      return 'yyyy-MM-dd';
    },
  },

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    this.setRequiredRule();
  },

  methods: {
    handleChangeDateTime(v) {
      if (v) {
        this.fatherObj.form[this.activeObj.compId] = v.join(',');
      } else {
        this.fatherObj.form[this.activeObj.compId] = '';
      }
    },
    handleChangeTimeInterval() {
      this.activeObj.defaultType = '';
      this.fatherObj.form[this.activeObj.compId] = '';
      this.dataTime = '';
    },
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
        trigger: 'change',
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
    },
  },
};
</script>

<style lang="scss" scoped>
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
