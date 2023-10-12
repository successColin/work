<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">富文本</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item style="margin-bottom: 0">
        <p class="switchBox">
          显示标题
          <el-switch
            v-model="activeObj.showLabelTitle"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
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
      <el-form-item label="尺寸类型">
        <el-select v-model="activeObj.sizeType" placeholder="请选择尺寸类型">
          <el-option label="全屏" :value="1"></el-option>
          <el-option label="尺寸选择" :value="2"></el-option>
          <el-option label="尺寸输入" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宽度" v-show="activeObj.sizeType === 2">
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
      <el-form-item label="高度" v-show="activeObj.sizeType === 2">
        <el-select v-model="activeObj.heightMul" placeholder="请选择高度">
          <el-option label="1x" :value="1"></el-option>
          <el-option label="2x" :value="2"></el-option>
          <el-option label="3x" :value="3"></el-option>
          <el-option label="4x" :value="4"></el-option>
          <el-option label="5x" :value="5"></el-option>
          <el-option label="6x" :value="6"></el-option>
          <el-option label="7x" :value="7"></el-option>
          <el-option label="8x" :value="8"></el-option>
          <el-option label="9x" :value="9"></el-option>
          <el-option label="10x" :value="10"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宽度" v-show="activeObj.sizeType === 3">
        <el-input-number
          class="number"
          placeholder="请输入宽度"
          v-model="activeObj.widthPix"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        >px
      </el-form-item>
      <el-form-item label="高度" v-show="activeObj.sizeType === 3">
        <el-input-number
          class="number"
          placeholder="请输入高度"
          v-model="activeObj.heightPix"
          :min="0"
          :controls="false"
          :precision="2"
        ></el-input-number
        >px
      </el-form-item>
      <el-form-item label="高级功能显示">
        <p class="switchBox" v-if="false">
          是否启用表情包
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.enableEmoji"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否启用图片上传
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.enableImg"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否启用视频上传
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.enableVedio"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否启用外部链接
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.enableLink"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否启用表格
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.enableGird"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="setRequiredRule"
          >
          </el-switch>
        </p>
      </el-form-item>
      <StatusConfig :activeObj="activeObj"></StatusConfig>
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
      singleTypeArr: [
        {
          label: '普通文本',
          value: 1,
          rule: [],
        },
        {
          label: '手机号',
          value: 2,
          rule: [
            {
              pattern: '^1[3|4|5|7|8][0-9]{9}$',
              message: '请输入手机号',
              trigger: 'change',
            },
          ],
        },
        {
          label: '身份证',
          value: 3,
          rule: [
            {
              pattern: '(^d{15}$)|(^d{18}$)|(^d{17}(d|X|x)$)',
              message: '请输入身份证',
              trigger: 'change',
            },
          ],
        },
        {
          label: '邮编',
          value: 4,
          rule: [
            {
              pattern: '^[1-9]d{5}(?!d)$',
              message: '请输入邮编',
              trigger: 'change',
            },
          ],
        },
        {
          label: '邮箱',
          value: 5,
          rule: [
            {
              pattern:
                '^([a-z0-9A-Z]+[-|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$',
              message: '请输入邮编',
              trigger: 'change',
            },
          ],
        },
        {
          label: '企业营业执照号',
          value: 6,
          rule: [
            {
              pattern:
                '(^(?:(?![IOZSV])[dA-Z]){2}d{6}(?:(?![IOZSV])[dA-Z]){10}$)|(^d{15}$)',
              message: '请输入邮编',
              trigger: 'change',
            },
          ],
        },
      ],
      lengthMin: '',
      lengthMax: '',
      options: [
        {
          label: '热门城市',
          options: [
            {
              value: 'Shanghai',
              label: '上海',
            },
            {
              value: 'Beijing',
              label: '北京',
            },
          ],
        },
        {
          label: '城市名',
          options: [
            {
              value: 'Chengdu',
              label: '成都',
            },
            {
              value: 'Shenzhen',
              label: '深圳',
            },
            {
              value: 'Guangzhou',
              label: '广州',
            },
            {
              value: 'Dalian',
              label: '大连',
            },
          ],
        },
      ],
      value: '',
      tableArr: [],
    };
  },

  components: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    // console.log(this.activeObj);
    this.setRequiredRule();
    this.setLengthMaxAndMin();
    this.setTableArr();
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
      if (
        this.lengthMin &&
        this.lengthMax &&
        this.lengthMin >= this.lengthMax
      ) {
        this.lengthMin = '';
      }
      if (!this.lengthMin) {
        this.activeObj.lengthLimit = '';
      }
      this.setMaxAndMinRule();
    },
    maxBlur() {
      if (
        this.lengthMin &&
        this.lengthMax &&
        this.lengthMin >= this.lengthMax
      ) {
        this.lengthMax = '';
      }
      if (!this.lengthMax) {
        this.activeObj.lengthLimit = '';
      }
      this.setMaxAndMinRule();
    },
    setMaxAndMinRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'maxAndMin',
        min: +this.lengthMin,
        max: +this.lengthMax,
        message: `长度在 ${this.lengthMin} 到 ${this.lengthMax} 个字符`,
        trigger: 'change',
      };
      // console.log(ruleObj);
      // if (!this.lengthMin || !this.lengthMax) {
      //   return;
      // }
      if (ruleArr && ruleArr.length !== 0) {
        const index = ruleArr.findIndex((item) => item.flag === 'maxAndMin');
        if (
          index === -1 &&
          this.activeObj.lengthLimit &&
          !this.activeObj.showMoreReg
        ) {
          ruleArr.push(ruleObj);
        }
        if (
          (index !== -1 && !this.activeObj.lengthLimit) ||
          this.activeObj.showMoreReg
        ) {
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
    },
    // 设置tableArr
    setTableArr() {
      const index = this.relateTableArr.findIndex(
        (relate) => relate.relateName === this.activeObj.dataSource.relateName,
      );
      if (index !== -1) {
        this.relateChange(this.relateTableArr[index]);
      }
    },
    // 关系选择切换
    relateChange(item) {
      this.tableArr = [];

      if (item.relateName !== '主表') {
        this.tableArr.push({
          label: '关联表',
          relateName: item.relateName,
          tableName: item.relateTable.tableName,
          alias: item.relateTable.alias,
        });
      } else {
        this.tableArr.push({
          label: '主表',
          relateName: '主表',
          tableName: this.relateObj.tableInfo.tableName,
          alias: '',
        });
      }
      // 单表默认单表 多表默认关联表
      this.tableChange(this.tableArr[0]);
    },
    // 表格切换
    tableChange(table) {
      if (this.activeObj.dataSource.relateName === table.relateName) {
        return;
      }
      this.activeObj.dataSource.relateName = table.relateName;
      this.activeObj.dataSource.tableName = table.tableName;
      this.activeObj.dataSource.alias = table.alias;
      // 切换表格，重置字段
      this.activeObj.dataSource.columnName = '';
      this.activeObj.dataSource.id = '';
      // 获取字段
      this.$nextTick(() => {
        this.$refs.filterableInput.currentRadioObj = null;
        // this.$refs.filterableInput.getList();
      });
    },
  },

  watch: {
    lengthMin(v) {
      if (v && this.lengthMax) {
        this.activeObj.lengthLimit = `${v}-${this.lengthMax}`;
      }
    },
    lengthMax(v) {
      if (v && this.lengthMin) {
        this.activeObj.lengthLimit = `${this.lengthMin}-${v}`;
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
