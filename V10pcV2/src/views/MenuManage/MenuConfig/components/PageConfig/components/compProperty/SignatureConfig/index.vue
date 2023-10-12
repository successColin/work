<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">电子签名</h1>
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
      <el-form-item label="默认值" class="defaultValue">
        <el-select
          v-model="activeObj.defaultValueType"
          placeholder="请选择"
          class="defaultValue__type"
        >
          <el-option label="无" :value="1"></el-option>
          <el-option label="显示上次签名" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宽度">
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
      <el-form-item>
        <p class="switchBox">
          是否启用签名颜色选择
          <el-switch
            v-model="activeObj.thousandSign"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="默认签名色">
        <el-select v-model="activeObj.waterColor" placeholder="请选择颜色">
          <el-option label="黑色" value="#333333"></el-option>
          <el-option label="红色" value="#E73D3D"></el-option>
          <el-option label="蓝色" value="#4689F5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <p class="switchBox">
          是否保留上次签名
          <el-switch
            v-model="activeObj.showContent"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
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
    return {};
  },

  components: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    // this.setRequiredRule();
  },

  methods: {
    changeValue(v) {
      this.fatherObj.form[this.activeObj.compId] = [v];
    },
    // 设置必填规则,无则设置，有则不变
    setRequiredRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'requiredRule',
        type: 'string',
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
    &--box {
      ::v-deep {
        .el-form-item {
          margin-bottom: 0;
        }
        &:not(.disabled) > .el-form-item {
          & .el-form-item__content:hover {
            .icon-jiahao {
              border-color: $--color-primary;
              background-color: #edf3fe;
              color: $--color-primary;
            }
            input {
              border-color: $--color-primary !important;
            }
          }
          & > .el-form-item__label {
            padding-top: 0px;
            line-height: 18px;
            font-size: 13px;
            font-weight: 600;
            color: #333333;
            display: flex;
          }
          & > .el-form-item__content .el-input input {
            border: 1px solid #e9e9e9;
            padding-right: 31px;
          }
        }
      }
      .icon-jiahao {
        border-left: 1px solid #e9e9e9;
        position: absolute;
        margin-left: -32px;
        margin-top: 1px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #aaaaaa;
        border-radius: 0 4px 4px 0;
        cursor: pointer;
        &:not(.disabled):hover {
          color: $--color-primary;
        }
        &.disabled {
          cursor: default;
        }
      }
    }
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
