<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">附件</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item v-if="false">
        <span slot="label">
          <span class="span-box">
            <span> 占位提示 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </span>
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
      <el-form-item v-if="this.relateObj.tableInfo.tableName">
        <span slot="label">
          <span class="span-box">
            <span> 关联数据源 </span>
            <i class="iconfont icon-bangzhu" />
          </span>
        </span>
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
          class="m-t-10"
          ref="filterableInput"
          placeholder="请选择字段"
          :tableName="activeObj.dataSource.tableName"
          :showInfo="activeObj.dataSource"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectColumnRes"
        ></filterable-input>
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
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
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
