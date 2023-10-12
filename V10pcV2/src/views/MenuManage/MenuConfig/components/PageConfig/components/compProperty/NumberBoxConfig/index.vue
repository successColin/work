<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">数值框</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <el-form-item label="类型">
        <el-select v-model="activeObj.numberType" @change="numberTypeChange">
          <el-option label="整数型" :value="1"></el-option>
          <el-option label="浮点型" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <PlacehoderConfig :activeObj="activeObj"></PlacehoderConfig>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <el-form-item label="前后修饰" class="decorate">
        <el-select v-model="activeObj.decorateType" class="decorate__type">
          <el-option label="前缀" :value="1"></el-option>
          <el-option label="后缀" :value="2"></el-option>
        </el-select>
        <apiot-input
          class="decorate__input"
          v-model="activeObj.decorateContent"
          placeholder="请输入内容"
          :isForbid="false"
        ></apiot-input>
      </el-form-item>
      <el-form-item>
        <p class="switchBox">
          是否显示千分符
          <el-switch
            v-model="activeObj.thousandSign"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否显示加减功能
          <el-switch
            v-model="activeObj.enableCascade"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        :columnTypes="activeObj.numberType === 1 ? '1' : '4'"
        @selectColumnRes="selectColumnRes"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <el-form-item
        label="小数位数"
        v-if="activeObj.numberType === 2 && activeObj.dataSource.columnName"
      >
        <el-input-number
          v-model.number="activeObj.decimalPlaces"
          controls-position="right"
          :min="1"
          :max="activeObj.maxPlace"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        label="默认值"
        class="defaultValue"
        v-if="activeObj.dataSource.columnName"
      >
        <el-select :value="1" placeholder="请选择" class="defaultValue__type">
          <el-option label="固定值" :value="1"></el-option>
        </el-select>
        <apiot-input
          v-if="updateFlag"
          class="defaultValue__input"
          v-onlyNumber="activeObj.numberType"
          v-fixedPlace="getPlace"
          v-model="fatherObj.form[activeObj.compId]"
          placeholder="请输入固定值"
        ></apiot-input>
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
      <el-form-item label="最小值">
        <p class="switchBox">
          是否启用最小值
          <el-switch
            v-model="activeObj.minNumberObj.enable"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <el-select
          v-if="activeObj.minNumberObj.enable"
          v-model="activeObj.minNumberObj.type"
          placeholder="请选择"
          class="number__type m-b-10"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <el-input-number
          placeholder="请输入最小值"
          v-model="activeObj.minNumberObj.value"
          v-if="
            activeObj.minNumberObj.type === 1 && activeObj.minNumberObj.enable
          "
          :controls="false"
          :precision="activeObj.numberType === 2 ? activeObj.decimalPlaces : 0"
        ></el-input-number>
        <select-formula
          v-if="
            activeObj.minNumberObj.type === 2 && activeObj.minNumberObj.enable
          "
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.minNumberObj.formula"
        ></select-formula>
      </el-form-item>
      <el-form-item label="最大值">
        <p class="switchBox">
          是否启用最大值
          <el-switch
            v-model="activeObj.maxNumberObj.enable"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <el-select
          v-if="activeObj.maxNumberObj.enable"
          v-model="activeObj.maxNumberObj.type"
          placeholder="请选择"
          class="number__type m-b-10"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <el-input-number
          placeholder="请输入最大值"
          v-model="activeObj.maxNumberObj.value"
          v-if="
            activeObj.maxNumberObj.type === 1 && activeObj.maxNumberObj.enable
          "
          :controls="false"
          :precision="activeObj.numberType === 2 ? activeObj.decimalPlaces : 0"
        ></el-input-number>
        <select-formula
          v-if="
            activeObj.maxNumberObj.type === 2 && activeObj.maxNumberObj.enable
          "
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.maxNumberObj.formula"
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
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      value: '',
      tableArr: [],
      updateFlag: true,
    };
  },

  components: {
    SelectFormula,
  },

  computed: {
    getPlace() {
      if (this.activeObj.numberType === 1) {
        return 0;
      }
      return this.activeObj.decimalPlaces;
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
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
      this.activeObj.maxPlace = table.decimalPlace;
      this.activeObj.decimalPlaces = 1;
    },
    // 设置必填规则,无则设置，有则不变
    setRequiredRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'requiredRule',
        type: 'string',
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
    // 类型改变
    numberTypeChange() {
      this.activeObj.dataSource.id = '';
      this.activeObj.dataSource.columnName = '';
      this.activeObj.dataSource.columnTypeDict = '';
      this.activeObj.decimalPlaces = 1;
      this.activeObj.maxPlace = 4;
      this.fatherObj.form[this.activeObj.compId] = '';
      this.updateFlag = false;
      this.$nextTick(() => {
        this.$refs.columnInput.getList();
        this.updateFlag = true;
      });
    },
  },

  watch: {
    'activeObj.decimalPlaces': function () {
      this.updateFlag = false;
      this.$nextTick(() => {
        this.updateFlag = true;
      });
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
.decorate,
.defaultValue {
  &__type {
    width: 100px !important;
  }
  &__input {
    width: calc(100% - 110px) !important;
    margin-left: 10px;
  }
}
.config {
  ::v-deep {
    .el-input-number {
      width: 100%;
      height: 32px;
      line-height: 32px;
      .el-input-number__decrease,
      .el-input-number__increase {
        height: 16px;
        line-height: 16px;
      }
    }
  }
}
.numberLength {
  position: relative;
  &__input {
    width: 118px;
    height: 32px;
    border-radius: 4px;
  }
}
.number__type {
  width: 100%;
}
</style>
