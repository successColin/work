<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">用户组件</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :showSwitch="!['TableMain'].includes(relateObj.compName)"
        :relateObj="relateObj"
      ></TitleConfig>
      <el-form-item
        label="单选/多选"
        v-if="['MenuMain'].includes(relateObj.compName)"
      >
        <el-radio-group :value="activeObj.dropDownType">
          <el-radio :label="1" @click.native="activeObj.dropDownType = 1"
            >单选</el-radio
          >
          <el-radio :label="2" @click.native="activeObj.dropDownType = 2"
            >多选</el-radio
          >
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="帮助信息"
        v-if="['MenuMain'].includes(relateObj.compName)"
      >
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
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
          :notShowSys="['MenuMain'].includes(relateObj.compName) ? true : false"
          @selectRes="selectColumnRes"
        ></filterable-input>
        <p class="switchBox" v-if="['MenuMain'].includes(relateObj.compName)">
          是否支持搜索
          <el-switch
            v-model="activeObj.shouldSearch"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <p class="switchBox" v-if="['MenuMain'].includes(relateObj.compName)">
          是否启用常用收藏
          <el-switch
            v-model="activeObj.shouldFav"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <p class="switchBox" v-if="['MenuMain'].includes(relateObj.compName)">
          是否启用按角色选择
          <el-switch
            v-model="activeObj.shouldInRole"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <p class="switchBox" v-if="['MenuMain'].includes(relateObj.compName)">
          是否启用按组织选择
          <el-switch
            v-model="activeObj.shouldInOrg"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
        <p class="switchBox" v-if="['MenuMain'].includes(relateObj.compName)">
          是否启用按职位选择
          <el-switch
            v-model="activeObj.shouldInPost"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
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
        label="对齐方式"
        v-if="
          relateObj.compName === 'CardMain' ||
          relateObj.compName === 'CardTable'
        "
      >
        <!-- <el-select v-model="activeObj.alignStyle" class="m-r-8">
          <el-option label="居左对齐" :value="1"></el-option>
          <el-option label="居右对齐" :value="2"></el-option>
          <el-option label="居中对齐" :value=""></el-option>
        </el-select> -->
        <el-button-group>
          <el-button
            :class="[{ active: activeObj.alignStyle === 1 }]"
            @click="activeObj.alignStyle = 1"
          >
            <i class="iconfont icon-juzuoduiqi"></i>
          </el-button>
          <el-button
            v-if="$route.query.isApp !== '1'"
            :class="[{ active: activeObj.alignStyle === 2 }]"
            @click="activeObj.alignStyle = 2"
          >
            <i class="iconfont icon-juzhongduiqi"></i>
          </el-button>
          <el-button
            :class="[{ active: activeObj.alignStyle === 3 }]"
            @click="activeObj.alignStyle = 3"
          >
            <i class="iconfont icon-juyouduiqi"></i>
          </el-button>
        </el-button-group>
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
      value: '',
      tableArr: [],
      showDefault: true,
      oldSeleValue: [],
      enableAllVal: 2
    };
  },

  components: {},

  computed: {},

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
