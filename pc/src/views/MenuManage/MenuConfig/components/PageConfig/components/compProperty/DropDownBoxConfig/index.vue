<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">下拉框</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item>
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
      <p class="redioBox m-b-10 p-t-6">
        <span class="redioBox__label">类型</span>
        <span class="redioBox__radio">
          <el-radio-group :value="activeObj.dropDownType">
            <el-radio :label="1" @click.native="radioChange(1)">单选</el-radio>
            <el-radio :label="2" @click.native="radioChange(2)">复选</el-radio>
          </el-radio-group>
        </span>
      </p>
      <el-form-item label="帮助信息">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <!-- <el-form-item label="字段名" v-if="!isShow">
        <apiot-input
          v-model="activeObj.fieldName"
          placeholder="请填写字段名"
        ></apiot-input>
      </el-form-item> -->
      <p class="switchBox m-b-10 p-t-6" v-if="isShow">
        <span class="switchBox__label">是否支持搜索</span>
        <el-switch
          v-model="activeObj.filterable"
          class="switchBox__switch"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </p>
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
          :showInfo="activeObj.dataSource"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectColumnRes"
        ></filterable-input>
      </el-form-item>
      <el-form-item
        label="字典表"
        v-if="
          (activeObj.dataSource.id && relateObj.tableInfo.tableName) || !isShow
        "
      >
        <filterable-input
          class="m-t-10"
          ref="filterableInput"
          placeholder="请选择字典"
          :showInfo="activeObj.dataSource.dictObj"
          :hasPagination="true"
          :dialogType="3"
          @selectRes="selectDict"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="activeObj.sort">
          <el-option label="升序" :value="1"></el-option>
          <el-option label="降序" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="默认值"
        v-if="activeObj.dataSource.dictObj && showDefault"
      >
        <el-select
          v-model="fatherObj.form[activeObj.compId]"
          :multiple="activeObj.dropDownType === 2"
          :collapse-tags="activeObj.dropDownType === 2"
          placeholder="请选择默认值"
          :clearable="activeObj.dropDownType !== 2"
        >
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="item in defaultValueArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="风格">
        <el-select
          v-model="activeObj.dropDownStyle"
          placeholder="请选择风格"
          class="styleSelect"
        >
          <el-option
            :value="1"
            label="普通文本风格"
            class="styleSelect__normal"
          >
            <span class="styleSelect__left">普通文本风格</span>
            <span class="styleSelect__right"> 如：<span>男性</span> </span>
          </el-option>
          <el-option :value="2" label="背景展示风格" class="styleSelect__bg">
            <span class="styleSelect__left">背景展示风格</span>
            <span class="styleSelect__right">
              如：<span>男性</span>
            </span></el-option
          >
          <el-option :value="3" label="个性图标风格" class="styleSelect__self">
            <span class="styleSelect__left">个性图标风格</span>
            <span class="styleSelect__right">
              如：<span><i class="iconfont icon-nan1"></i>男性</span>
            </span></el-option
          >
        </el-select>
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
            v-if="$route.query.isApp !== '1' && isShow"
            :class="[{ active: activeObj.width === '66.67%' }]"
            @click="activeObj.width = '66.67%'"
            >2/3</el-button
          >
          <el-button
            v-else
            :class="[{ active: activeObj.width === '20%' }]"
            @click="activeObj.width = '20%'"
            >1/5</el-button
          >
          <el-button
            v-if="$route.query.isApp !== '1' && isShow"
            :class="[{ active: activeObj.width === '75%' }]"
            @click="activeObj.width = '75%'"
            >3/4</el-button
          >
          <el-button
            v-else
            :class="[{ active: activeObj.width === '16.66%' }]"
            @click="activeObj.width = '16.66%'"
            >1/6</el-button
          >
          <el-button
            :class="[{ active: activeObj.width === '100%' }]"
            @click="activeObj.width = '100%'"
            >1/1</el-button
          >
        </el-button-group>
      </el-form-item>
      <el-form-item label="验证" v-if="isShow">
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
      <el-form-item label="提交类型" v-if="isShow">
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
      value: '',
      tableArr: [],
      showDefault: true
    };
  },

  components: {},

  computed: {
    defaultValueArr() {
      const tempData = JSON.parse(JSON.stringify(this.activeObj.dataSource.dictObj.dictValue));
      if (this.activeObj.sort === 2) {
        tempData.reverse();
      }
      return tempData || [];
    },
    isShow() {
      return this.relateObj.compName !== 'QueryMain';
    }
  },

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    this.setRequiredRule();
    this.initDefault();
  },

  methods: {
    // 初始化字典值
    initDefault() {
      if (this.activeObj.dataSource.dictObj && this.activeObj.dataSource.dictObj.dictKey) {
        const a = this.$store.getters.getCurDict(this.activeObj.dataSource.dictObj.dictKey);
        if (a) {
          this.activeObj.dataSource.dictObj.dictValue = a;
        }
      }
    },
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    },
    // 字典选择结果
    async selectDict(dict) {
      if (this.activeObj.dataSource.dictObj && dict.id === this.activeObj.dataSource.dictObj.id) {
        return;
      }
      // console.log(dict);
      dict.dictValue.forEach((item) => {
        item.value = +item.value;
        if (item[`${localStorage.apiotLanguage}`]) {
          item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
        }
      });
      this.$bus.$emit('changeDictArr', dict.dictKey);
      this.activeObj.dataSource.dictObj = dict;
      this.fatherObj.form[this.activeObj.compId] = '';
    },
    // 设置必填规则,无则设置，有则不变
    setRequiredRule() {
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      const ruleObj = {
        flag: 'requiredRule',
        type: this.activeObj.dropDownType === 1 ? 'number' : 'array',
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
    radioChange(radio) {
      if (this.activeObj.dropDownType === radio) {
        return;
      }
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      let index = -1;
      this.showDefault = false;
      this.activeObj.dropDownType = radio;
      if (ruleArr) {
        if (ruleArr.length !== 0) {
          index = ruleArr.findIndex((item) => item.flag === 'requiredRule');
        }
        if (radio === 1 && index !== -1) {
          this.fatherObj.form[this.activeObj.compId] = '';
          ruleArr[index].type = 'number';
        }
        if (radio === 2 && index !== -1) {
          this.fatherObj.form[this.activeObj.compId] = [];
          ruleArr[index].type = 'array';
        }
      }

      this.$nextTick(() => {
        this.showDefault = true;
      });
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
