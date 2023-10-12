<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">下拉框</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <PlacehoderConfig :activeObj="activeObj"></PlacehoderConfig>
      <p class="redioBox m-b-10 p-t-6">
        <span class="redioBox__label">类型</span>
        <span class="redioBox__radio">
          <el-radio-group :value="activeObj.dropDownType">
            <el-radio :label="1" @click.native="radioChange(1)">单选</el-radio>
            <el-radio :label="2" @click.native="radioChange(2)">复选</el-radio>
          </el-radio-group>
        </span>
      </p>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
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
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <!-- (activeObj.dataSource.id && relateObj.tableInfo.tableName) || -->
      <el-form-item label="字典表">
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
      <el-form-item label="字典生效值" v-if="activeObj.dataSource.dictObj">
        <el-select
          v-model="activeObj.effectDict"
          :multiple="true"
          :collapse-tags="true"
          placeholder="请选择字典生效值"
          :clearable="true"
          @change="efffectChange"
        >
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="item in defaultValueArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <p class="redioBox m-b-10 p-t-6" v-if="!isShow">
        <span class="redioBox__label">是否启用全部</span>
        <span class="redioBox__radio">
          <el-radio-group v-model="enableAllVal" @change="handleChange">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </span>
      </p>
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
          @change="handleSelect"
        >
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="item in optionsArr"
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
          <el-option :value="4" label="圆点展示风格" class="styleSelect__self">
            <span class="styleSelect__left">圆点展示风格</span>
            <span class="styleSelect__right">
              如：<span><i class="circle"></i>男性</span>
            </span></el-option
          >
        </el-select>
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
      <el-form-item
        v-if="
          relateObj &&
          relateObj.compName === 'TableMain' &&
          !isUser &&
          relateObj.pageType !== 1
        "
      >
        <p class="switchBox">
          是否启用列表按钮区搜索
          <el-switch
            v-model="activeObj.enableBtnsSearch"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            @change="enableBtnsSearchChange"
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
import { allOption } from '@/config';
import propertyMixin from '../propertyMixin';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      value: '',
      tableArr: [],
      showDefault: true,
      oldSeleValue: [],
      enableAllVal: 2,
    };
  },

  components: {},

  computed: {
    allSeleValue() {
      return this.optionsArr.map((v) => v.value);
    },
    optionsArr() {
      if (this.activeObj.enableAll === 1) {
        return [allOption, ...this.effectArr];
      }
      return this.effectArr;
    },
    // 默认字典项
    defaultValueArr() {
      const tempData = JSON.parse(
        JSON.stringify(this.activeObj.dataSource.dictObj.dictValue),
      );
      if (this.activeObj.sort === 2) {
        tempData.reverse();
      }
      return tempData || [];
    },
    isShow() {
      return this.relateObj.compName !== 'QueryMain';
    },
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
    handleChange(v) {
      this.fatherObj.form[this.activeObj.compId] = '';
      this.activeObj.enableAll = v;
    },
    handleSelect(val) {
      if (this.activeObj.dropDownType === 2) {
        // 用来储存上一次的值，可以进行对比
        const oldVal = this.oldSeleValue;
        // 若是全部选择
        if (val.includes(0)) {
          this.fatherObj.form[this.activeObj.compId] = Object.assign(
            [],
            this.allSeleValue,
          );
        }
        // 取消全部选中 上次有 当前没有 表示取消全选
        if (oldVal.includes(0) && !val.includes(0)) {
          this.fatherObj.form[this.activeObj.compId] = [];
        }
        // 点击非全部选中 需要排除全部选中 以及 当前点击的选项
        // 新老数据都有全部选中
        if (oldVal.includes(0) && val.includes(0)) {
          const index = val.indexOf(0);
          val.splice(index, 1); // 排除全选选项
          this.fatherObj.form[this.activeObj.compId] = val;
        }
        // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
        if (
          !oldVal.includes(0) &&
          !val.includes(0) &&
          this.activeObj.enableAll === 1
        ) {
          if (val.length === this.effectArr.length) {
            this.fatherObj.form[this.activeObj.compId] = [0, ...val];
          }
        }
        // 储存当前最后的结果 作为下次的老数据
        this.oldSeleValue = this.fatherObj.form[this.activeObj.compId] || [];
      } else {
        this.fatherObj.form[this.activeObj.compId] = val;
      }
    },
    // 初始化字典值
    initDefault() {
      if (
        this.activeObj.dataSource.dictObj &&
        this.activeObj.dataSource.dictObj.dictKey
      ) {
        const a = this.$store.getters.getCurDict(
          this.activeObj.dataSource.dictObj.dictKey,
        );
        if (a) {
          this.activeObj.dataSource.dictObj.dictValue = a;
        }
      }
      this.enableAllVal = this.activeObj.enableAll || 2;
    },

    // 字典选择结果
    async selectDict(dict) {
      if (
        this.activeObj.dataSource.dictObj &&
        dict.id === this.activeObj.dataSource.dictObj.id
      ) {
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
      // this.activeObj.dataSource.dictObj = dict;
      this.$set(this.activeObj.dataSource, 'dictObj', dict);
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
    radioChange(radio) {
      if (this.activeObj.dropDownType === radio) {
        return;
      }
      const ruleArr = this.fatherObj.rules[this.activeObj.compId];
      let index = -1;
      this.showDefault = false;
      this.activeObj.dropDownType = radio;
      if (radio === 1) {
        this.fatherObj.form[this.activeObj.compId] = '';
      } else {
        this.fatherObj.form[this.activeObj.compId] = [];
      }
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
.circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: $--color-primary;
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
