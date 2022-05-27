<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">数据单选框</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="占位提示">
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
      <el-form-item
        label="关联数据源"
        v-if="this.relateObj.tableInfo.tableName && getSingleRelate.length"
      >
        <el-select :value="1" placeholder="请选择数据源" :disabled="true">
          <el-option label="数据表" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="关系"
        v-if="this.relateObj.tableInfo.tableName && getSingleRelate.length"
      >
        <el-select
          class="relateBox__relate"
          :title="activeObj.dataSource.relateName"
          :value="activeObj.dataSource.relateName"
          placeholder="请选择关系"
        >
          <el-option
            :label="getLabel(item)"
            :value="item.relateName"
            v-for="(item, index) in getSingleRelate"
            :key="index"
            @click.native="relateChange(item)"
          ></el-option>
        </el-select>
        <el-select
          class="relateBox__table"
          :value="activeObj.dataSource.tableName"
          placeholder="请选择表"
          :disabled="true"
          :title="activeObj.dataSource.tableName"
        >
          <el-option
            :value="item.tableName"
            v-for="(item, index) in tableArr"
            :key="index"
            @click.native="tableChange(item)"
          >
            {{ item.tableName }}
          </el-option>
        </el-select>
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
      <el-form-item
        style="margin-bottom: 0"
        v-if="activeObj.dataSource.columnName"
      >
        <p class="switchBox">
          是否启用字典
          <el-switch
            v-model="activeObj.enableDict"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item
        label="字典表"
        v-if="activeObj.dataSource.columnName && activeObj.enableDict"
      >
        <filterable-input
          ref="filterableInput"
          placeholder="请选择字典"
          :showInfo="activeObj.dataSource.dictObj"
          :hasPagination="true"
          :dialogType="3"
          @selectRes="selectDict"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="关联类型" v-if="activeObj.dataSource.columnName">
        <el-radio v-model="activeObj.relateType" :label="1">弹出面板</el-radio>
        <el-radio v-model="activeObj.relateType" :label="2">跳转菜单</el-radio>
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 1"
          @click="showPanelConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
        </apiot-button>
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 2"
          @click="showMenuConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
        </apiot-button>
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
        label="默认值"
        class="defaultValue"
        v-if="relateObj && relateObj.compName !== 'TableMain'"
      >
        <el-select
          v-model="activeObj.defaultValueType"
          placeholder="请选择"
          class="defaultValue__type"
        >
          <el-option label="固定值" :value="1"></el-option>
          <el-option label="公式" :value="2"></el-option>
        </el-select>
        <apiot-input
          v-if="activeObj.defaultValueType === 1"
          class="defaultValue__input"
          v-model="fatherObj.form[activeObj.compId]"
        ></apiot-input>
        <select-formula
          v-if="activeObj.defaultValueType === 2"
          :configData="configData"
          class="action__term--formula"
          :triggerCompMap="triggerCompMap"
          v-model="activeObj.formulaContent"
        ></select-formula>
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
      </el-form-item>
      <el-form-item label="提交类型">
        <el-select
          v-model="activeObj.submitType"
          placeholder="请选择类型"
          :disabled="canChangeSubmit"
        >
          <el-option label="始终提交" :value="1"></el-option>
          <el-option label="仅显示时提交" :value="2"></el-option>
          <el-option label="始终不提交" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 面板配置弹窗 -->
    <PanelConfig
      :visible.sync="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :isSelPanel="true"
      :triggerCompMap="triggerCompMap"
    ></PanelConfig>
    <!-- 跳转菜单配置 -->
    <ToMenuConfig
      :visible.sync="showMenuConfig"
      :configData="configData"
      :activeObj="activeObj"
      :triggerCompMap="triggerCompMap"
    ></ToMenuConfig>
  </div>
</template>

<script>
import propertyMixin from '../propertyMixin';
import SelectFormula from '../GlobalConfig/components/AddAction/components/SelectFormula';
import PanelConfig from '../ContentConfig/PanelConfig';
import ToMenuConfig from '../ContentConfig/ToMenuConfig';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      tableArr: [],
      curPaneConfig: [],
      curPaneObj: {
        id: '', // 面板id
        panelName: '', // 面板名称
        sysMenuDesignId: '', // 设计组id
        relationMenuDesignId: '', // 外层设计组id
        panelType: '', // 类型
        panelData: [], // 面板传递参数
        panelFilter: [] // 面板过滤条件
      },
      showPanelConfig: false, // 面板配置弹窗是否显示
      showMenuConfig: false
    };
  },

  components: {
    SelectFormula,
    PanelConfig,
    ToMenuConfig
  },

  computed: {
    getSingleRelate() {
      return this.relateObj.relateTableArr.filter(
        (item) =>
          item.conditionArr[0][0].firstLineColumn.columnName &&
          item.conditionArr[0][0].secondLineColumn.columnName
      );
    },
    getLabel() {
      return (item) =>
        (item.relateName === '主表'
          ? item.relateName
          : `${item.relateName}(${item.conditionArr[0][0].firstLineColumn.columnName})`);
    },
    canChangeSubmit() {
      if (this.activeObj.dataSource.mainTableInfo) {
        if (
          this.activeObj.dataSource.mainTableInfo.tableName !== this.relateObj.tableInfo.tableName
        ) {
          return true;
        }
      }
      return false;
    }
  },

  mounted() {
    this.setRequiredRule();
  },

  methods: {
    // 关系选择切换
    relateChange(item) {
      this.tableArr = [];

      if (item.relateName !== '主表') {
        this.tableArr.push({
          label: '关联表',
          relateName: this.getLabel(item),
          tableName: item.relateTable.tableName,
          alias: item.relateTable.alias
        });
        this.$set(
          this.activeObj.dataSource,
          'mainColumnInfo',
          item.conditionArr[0][0].firstLineColumn
        );
        this.$set(
          this.activeObj.dataSource,
          'mainTableInfo',
          item.conditionArr[0][0].firstLineTable
        );
        if (
          item.conditionArr[0][0].firstLineTable.tableName === this.relateObj.tableInfo.tableName
        ) {
          this.activeObj.submitType = 1;
        } else {
          this.activeObj.submitType = 3;
        }
      } else {
        this.tableArr.push({
          label: '主表',
          relateName: '主表',
          tableName: this.relateObj.tableInfo.tableName,
          alias: ''
        });
      }
      // this.$set(
      //   this.activeObj.dataSource,
      //   'mainColumnInfo',
      //   item.conditionArr[0][0].firstLineColumn
      // );
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
        if (this.$refs.filterableInput) {
          this.$refs.filterableInput.currentRadioObj = null;
        }

        // this.$refs.filterableInput.getList();
      });
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
        required: true,
        message: `请选择${this.activeObj.name}`,
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

<style lang='scss' scoped>
@import '../commonConfig';

.relateBox {
  &__relate {
    margin-bottom: 10px;
  }
}

.defaultValue {
  &__type {
    margin-bottom: 10px;
  }
}
.panelBtn {
  width: 100%;
  margin-top: 10px;
  .iconfont {
    color: $--color-primary;
  }
}
</style>
