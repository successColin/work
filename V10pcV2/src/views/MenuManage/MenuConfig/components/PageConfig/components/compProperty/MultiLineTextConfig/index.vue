<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">多行文本</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <PlacehoderConfig :activeObj="activeObj"></PlacehoderConfig>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <StatusConfig :activeObj="activeObj"></StatusConfig>
      <el-form-item label="默认值" class="defaultValue" v-if="!isUser">
        <el-select :value="1" placeholder="请选择" class="defaultValue__type">
          <el-option label="固定值" :value="1"></el-option>
        </el-select>
        <apiot-input
          class="defaultValue__input"
          v-model="fatherObj.form[activeObj.compId]"
        ></apiot-input>
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
        <div class="numberLength" v-if="!isUser">
          长度限制
          <div class="numberLength__inputBox">
            <apiot-input
              class="numberLength__input"
              v-onlyNumber="1"
              v-model="lengthMin"
              @blur="minBlur"
            ></apiot-input>
            -
            <apiot-input
              class="numberLength__input"
              v-onlyNumber="1"
              v-model="lengthMax"
              @blur="maxBlur"
            ></apiot-input>
          </div>
        </div>
        <div class="numberLength" v-if="!isUser">
          显示行数
          <div class="numberLength__inputBox">
            <el-input-number
              class="numberLength__input1"
              v-model="activeObj.maxRow"
              :controls="false"
              :precision="0"
              :min="1"
              :max="10"
              label="描述文字"
            ></el-input-number>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="提交类型" v-if="!isUser">
        <el-select v-model="activeObj.submitType" placeholder="请选择类型">
          <el-option label="始终提交" :value="1"></el-option>
          <el-option label="仅显示时提交" :value="2"></el-option>
          <el-option label="始终不提交" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="defaultValue" v-if="$route.query.isApp === '1'">
        <p class="switchBox">
          是否启动语音
          <el-switch
            v-model="activeObj.enableSpeech"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      lengthMin: '',
      lengthMax: ''
    };
  },

  components: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    this.setRequiredRule();
  },

  methods: {
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
    minBlur() {
      if (this.lengthMin && this.lengthMax && this.lengthMin >= this.lengthMax) {
        this.lengthMin = '';
      }
      this.setMaxAndMinRule();
    },
    maxBlur() {
      if (this.lengthMin && this.lengthMax && this.lengthMin >= this.lengthMax) {
        this.lengthMax = '';
      }
      this.setMaxAndMinRule();
    },
    setMaxAndMinRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      let str = '';
      if (this.lengthMin) {
        str = `长度大于${this.lengthMin}个字符`;
      }
      if (this.lengthMax) {
        str = `长度小于${this.lengthMax}个字符`;
      }
      if (this.lengthMin && this.lengthMax) {
        str = `长度在 ${this.lengthMin} 到 ${this.lengthMax} 个字符`;
      }
      const ruleObj = {
        flag: 'maxAndMin',
        min: +this.lengthMin,
        max: +this.lengthMax,
        message: str,
        trigger: 'change'
      };
      // console.log(ruleObj);
      // if (!this.lengthMin || !this.lengthMax) {
      //   return;
      // }
      if (ruleArr && ruleArr.length !== 0) {
        const index = ruleArr.findIndex((item) => item.flag === 'maxAndMin');
        if (index === -1 && this.activeObj.lengthLimit) {
          ruleArr.push(ruleObj);
        }
        if (index !== -1 && !this.activeObj.lengthLimit) {
          ruleArr.splice(index, 1);
        }
        if (index !== -1 && this.activeObj.lengthLimit) {
          ruleArr.splice(index, 1, ruleObj);
        }
      } else if (this.activeObj.lengthLimit) {
        this.$set(this.fatherObj.rules, this.activeObj.compId, [ruleObj]);
      }
    }
  },
  watch: {
    lengthMin(v) {
      this.activeObj.lengthLimit = `${v}-${this.lengthMax}`;
      if (!v && !this.lengthMax) {
        this.activeObj.lengthLimit = '';
      }
    },
    lengthMax(v) {
      this.activeObj.lengthLimit = `${this.lengthMin}-${v}`;
      if (!v && !this.lengthMin) {
        this.activeObj.lengthLimit = '';
      }
    }
  }
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
.defaultValue {
  &__type {
    width: 100px !important;
  }
  &__input {
    width: calc(100% - 110px) !important;
    margin-left: 10px;
  }
}
.numberLength {
  position: relative;
  &__inputBox {
    position: absolute;
    right: 0;
    top: 0;
  }
  &__input {
    width: 63px;
    height: 32px;
    border-radius: 4px;
  }
  &__input1 {
    width: 140px;
    height: 32px;
    border-radius: 4px;
  }
}
.toPage {
  position: relative;
  &__more {
    position: absolute;
    right: 0;
    font-size: 13px;
    font-weight: 400;
    color: $--color-primary;
  }
}
.highRule {
  display: flex;
  align-items: center;
  .iconfont {
    font-size: 20px;
    color: #bbc3cd;
    margin-right: 10px;
  }
  &__label {
    font-size: 13px;
    font-weight: 400;
    color: #333333;
  }
}
</style>
