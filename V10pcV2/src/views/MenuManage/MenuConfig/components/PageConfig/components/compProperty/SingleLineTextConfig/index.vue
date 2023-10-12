<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">单行文本</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <el-form-item
        label="类型"
        v-if="!tableAndUser && !activeObj.labelNotChange"
      >
        <el-select v-model="activeObj.singleType" placeholder="请选择类型">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in singleTypeArr"
            :key="item.value"
            @click.native="typeOptionClick(item)"
          ></el-option>
        </el-select>
      </el-form-item>
      <PlacehoderConfig
        :activeObj="activeObj"
        v-if="!tableAndUser"
      ></PlacehoderConfig>
      <HelpConfig :activeObj="activeObj" v-if="!tableAndUser"></HelpConfig>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
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
      <el-form-item label="默认值" class="defaultValue" v-if="!isUser">
        <el-select :value="1" placeholder="请选择" class="defaultValue__type">
          <el-option label="固定值" :value="1"></el-option>
        </el-select>
        <apiot-input
          class="defaultValue__input"
          v-model="fatherObj.form[activeObj.compId]"
        ></apiot-input>
      </el-form-item>
      <WidthConfig
        :activeObj="activeObj"
        :relateObj="relateObj"
        :isShow="isShow"
      ></WidthConfig>
      <el-form-item label="验证" v-if="!tableAndUser && getUserShow">
        <p class="switchBox">
          是否必填
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.shouldRequired"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
        <p class="switchBox" v-if="isShow && !isUser">
          是否不允许重复值
          <el-switch
            v-model="activeObj.shouldRepeat"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <div class="numberLength" v-if="isShow && !isUser">
          长度限制
          <div class="numberLength__inputBox">
            <apiot-input
              class="numberLength__input"
              v-onlyNumber="1"
              v-model="lengthMin"
              :disabled="activeObj.showMoreReg"
              @blur="minBlur"
            ></apiot-input>
            -
            <apiot-input
              class="numberLength__input"
              v-onlyNumber="1"
              v-model="lengthMax"
              :disabled="activeObj.showMoreReg"
              @blur="maxBlur"
            ></apiot-input>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="false && activeObj.singleType === 1 && isShow">
        <span class="span-box switchBox" slot="label">
          <span> 高级验证 </span>
          <el-tooltip content="高级验证将会去除长度限制" placement="top">
            <i class="iconfont icon-bangzhu"
          /></el-tooltip>
          <el-switch
            v-model="activeObj.showMoreReg"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="showMoreRegChange"
          ></el-switch>
        </span>
        <p class="toPage" v-if="activeObj.showMoreReg">
          规则
          <el-button type="text" class="toPage__more">添加更多</el-button>
        </p>
        <el-select
          v-model="value"
          filterable
          placeholder="请选择"
          :clearable="true"
          v-if="activeObj.showMoreReg"
        >
          <el-option-group
            v-for="group in options"
            :key="group.label"
            :label="group.label"
          >
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              class="highRule"
            >
              <i class="iconfont icon-bangzhuwendang"></i>
              <span class="highRule__label">{{ item.label }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="提交类型" v-if="isShow && !isUser">
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
      singleTypeArr: [
        {
          label: '普通文本',
          value: 1,
          rule: []
        },
        {
          label: '手机号',
          value: 2,
          rule: [
            {
              pattern: '^1[3|4|5|6|7|8|9][0-9]{9}$',
              message: '请输入手机号',
              trigger: 'change'
            }
          ]
        },
        {
          label: '身份证',
          value: 3,
          rule: [
            {
              pattern:
                '^((1[1-5]|2[1-3]|3[1-7]|4[1-6]|5[0-4]|6[1-5]|8[1-3])\\d{4})((19|20)\\d{2})(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])(\\d{3}([0-9xX]))$',
              message: '请输入身份证',
              trigger: 'change'
            }
          ]
        },
        {
          label: '邮编',
          value: 4,
          rule: [
            {
              pattern: '^[1-9]\\d{5}$',
              message: '请输入邮编',
              trigger: 'change'
            }
          ]
        },
        {
          label: '邮箱',
          value: 5,
          rule: [
            {
              pattern:
                '^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$',
              message: '请输入邮箱',
              trigger: 'change'
            }
          ]
        },
        {
          label: '企业营业执照号',
          value: 6,
          rule: [
            {
              pattern: '(^(?:(?![IOZSV])[dA-Z]){2}d{6}(?:(?![IOZSV])[dA-Z]){10}$)|(^d{15}$)',
              message: '请输入企业营业执照号',
              trigger: 'change'
            }
          ]
        },
        {
          label: '车牌号码',
          value: 7,
          rule: [
            {
              pattern:
                '(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$)))|(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$)',
              message: '请输入车牌号',
              trigger: 'change'
            }
          ]
        }
      ],
      lengthMin: '',
      lengthMax: '',
      options: [
        {
          label: '热门城市',
          options: [
            {
              value: 'Shanghai',
              label: '上海'
            },
            {
              value: 'Beijing',
              label: '北京'
            }
          ]
        },
        {
          label: '城市名',
          options: [
            {
              value: 'Chengdu',
              label: '成都'
            },
            {
              value: 'Shenzhen',
              label: '深圳'
            },
            {
              value: 'Guangzhou',
              label: '广州'
            },
            {
              value: 'Dalian',
              label: '大连'
            }
          ]
        }
      ],
      value: '',
      tableArr: []
    };
  },

  components: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },
  computed: {
    tableAndUser() {
      return this.relateObj && this.relateObj.compName === 'TableMain' && this.isUser;
    },
    getUserShow() {
      return !(
        this.activeObj.labelNotChange &&
        ['username', 'account', 'orgid'].includes(this.activeObj.dataSource.columnName)
      );
    }
  },
  mounted() {
    this.setRequiredRule();
    this.setLengthMaxAndMin();
  },

  methods: {
    // 类型选择
    typeOptionClick(item) {
      const rule = JSON.parse(JSON.stringify(item.rule));
      rule.pattern = new RegExp(rule.pattern);
      this.$set(this.fatherObj.rules, this.activeObj.compId, rule);
      this.activeObj.lengthLimit = '';
      this.lengthMin = '';
      this.lengthMax = '';
      this.activeObj.showMoreReg = false;
      this.setRequiredRule();
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
    setLengthMaxAndMin() {
      console.log(this.activeObj.lengthLimit);
      if (this.activeObj.lengthLimit) {
        const arr = this.activeObj.lengthLimit.split('-');
        [this.lengthMin, this.lengthMax] = arr;
      }
      this.setMaxAndMinRule();
    },
    // 处理最大最小的问题
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
        if (index === -1 && this.activeObj.lengthLimit && !this.activeObj.showMoreReg) {
          ruleArr.push(ruleObj);
        }
        if ((index !== -1 && !this.activeObj.lengthLimit) || this.activeObj.showMoreReg) {
          ruleArr.splice(index, 1);
        }
        if (index !== -1 && this.activeObj.lengthLimit) {
          ruleArr.splice(index, 1, ruleObj);
        }
      } else if (this.activeObj.lengthLimit) {
        this.$set(this.fatherObj.rules, this.activeObj.compId, [ruleObj]);
      }
    },
    showMoreRegChange() {
      this.setMaxAndMinRule();
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
    width: 60px;
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
