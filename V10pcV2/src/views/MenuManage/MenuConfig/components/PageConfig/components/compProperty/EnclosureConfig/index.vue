<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">附件</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :showSwitch="true"
        :relateObj="relateObj"
      ></TitleConfig>
      <PlacehoderConfig
        :activeObj="activeObj"
        labelName="按钮提示"
      ></PlacehoderConfig>
      <el-form-item label="建议提示">
        <el-input
          v-model="activeObj.adviseTip"
          placeholder="建议提示"
          v-if="!['TableMain'].includes(relateObj.compName)"
        ></el-input>
      </el-form-item>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <StatusConfig :activeObj="activeObj"></StatusConfig>
      <el-form-item label="宽度" v-if="false">
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
        <div class="numberLength m-b-4">
          最大数量限制
          <div class="numberLength__inputBox">
            <el-input-number
              class="numberLength__input"
              v-model="activeObj.maxFileCount"
              :controls="false"
              :precision="0"
              :min="1"
              :max="10"
            ></el-input-number>
          </div>
        </div>
        <div class="numberLength">
          单个文件大小限制(M)
          <div class="numberLength__inputBox">
            <el-input-number
              class="numberLength__input"
              v-model="activeObj.maxFileSize"
              :controls="false"
              :precision="0"
              :min="1"
              :max="500"
            ></el-input-number>
          </div>
        </div>
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

export default {
  mixins: [propertyMixin],
  data() {
    return {
      lengthMax: '',
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
    width: 100px;
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
