<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">数据多选框</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <!-- <el-form-item label="占位提示">
        <el-input
          v-model="activeObj.placeholder"
          placeholder="请输入占位提示"
        ></el-input>
      </el-form-item> -->
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
      <!-- 业务表 -->
      <el-form-item label="业务表" v-if="!isShow">
        <filterable-input
          :disabled="!!activeObj.tableInfo.tableName"
          placeholder="请选择关联表"
          title="关联表"
          :dialogType="1"
          :showInfo="activeObj.tableInfo"
          @selectRes="selectTable"
        ></filterable-input>
      </el-form-item>
      <!-- 关联数据源  -->
      <el-form-item
        v-if="
          this.relateObj.tableInfo.tableName ||
          (this.activeObj.tableInfo.tableName && !isShow)
        "
      >
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
          :showInfo="dataTableInfo"
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
      <el-form-item label="多选值来源" v-if="activeObj.dataSource.columnName">
        <filterable-input
          class="m-t-10"
          placeholder="请选择表"
          :showInfo="activeObj.multiTable.table"
          :dialogType="1"
          @selectRes="selectMultiTable"
        ></filterable-input>
        <filterable-input
          class="m-t-10"
          placeholder="请选择字段"
          :tableName="activeObj.multiTable.table.tableName"
          :showInfo="activeObj.multiTable.column"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectMultiColumn"
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
        <el-radio v-model="activeObj.relateType" :label="2" v-if="false"
          >跳转菜单</el-radio
        >
        <apiot-button
          class="panelBtn"
          v-if="activeObj.relateType === 1"
          @click="showPanelConfig = true"
        >
          <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
        </apiot-button>
        <apiot-button class="panelBtn" v-if="activeObj.relateType === 2">
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
    <!-- 面板配置弹窗 -->
    <PanelConfig
      :visible.sync="showPanelConfig"
      :configData="configData"
      :activeObj="activeObj"
      :isSelPanel="true"
      :triggerCompMap="triggerCompMap"
    ></PanelConfig>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import PanelConfig from '../ContentConfig/PanelConfig';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      tableArr: [],
      showPanelConfig: false // 面板配置弹窗是否显示
    };
  },

  components: {
    PanelConfig
  },

  computed: {
    dataTableInfo() {
      return this.isShow ? this.relateObj.tableInfo : this.activeObj.tableInfo;
    },
    getSingleRelate() {
      return this.relateObj.relateTableArr.filter(
        (item) =>
          item.conditionArr[0][0].firstLineTable.tableName === this.relateObj.tableInfo.tableName &&
          item.conditionArr[0][0].firstLineColumn.columnName &&
          item.conditionArr[0][0].secondLineColumn.columnName
      );
    },
    getMultiRelate() {
      return [
        {
          relateName: '主表'
        },
        ...this.getSingleRelate
      ];
    }
  },
  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },
  mounted() {
    this.setRequiredRule();
  },

  methods: {
    // 选中表格
    selectTable(table) {
      this.activeObj.tableInfo.tableName = table.tableName;
      this.activeObj.tableInfo.id = table.id;
      this.activeObj.tableInfo.nameAlias = table.tableName;

      this.activeObj.dataSource.tableName = table.tableName;
      this.activeObj.dataSource.id = table.id;
    },
    // 关系选择切换
    relateChange(item) {
      this.tableArr = [];

      if (item.relateName !== '主表') {
        this.tableArr.push({
          label: '关联表',
          tableName: item.relateTable.tableName,
          alias: item.relateTable.alias
        });
      } else {
        this.tableArr.push({
          label: '主表',
          tableName: this.relateObj.tableInfo.tableName,
          alias: ''
        });
      }
      // this.activeObj.dataSource.mianColumnInfo = item.conditionArr[0][0].firstLineColumn;
      // 单表默认单表 多表默认关联表
      this.tableChange(this.tableArr[0]);
    },
    // 表格切换
    tableChange(table) {
      if (this.activeObj.dataSource.tableName === table.tableName) {
        return;
      }
      this.activeObj.dataSource.tableName = table.tableName;
      this.activeObj.dataSource.alias = table.alias;
      // 切换表格，重置字段
      this.activeObj.dataSource.columnName = '';
      this.activeObj.dataSource.id = '';
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
    selectMultiTable(table) {
      this.activeObj.multiTable.table.id = table.id;
      this.activeObj.multiTable.table.tableName = table.tableName;
      this.activeObj.multiTable.table.alias = `${table.tableName}__${createUnique()}`;
      this.activeObj.multiTable.column.id = '';
      this.activeObj.multiTable.column.columnName = '';
      this.activeObj.multiTable.column.columnTypeDict = '';
    },
    selectMultiColumn(table) {
      this.activeObj.multiTable.column.id = table.id;
      this.activeObj.multiTable.column.columnName = table.columnName;
      this.activeObj.multiTable.column.columnTypeDict = table.columnTypeDict;
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

.panelBtn {
  width: 100%;
  margin-top: 10px;
  .iconfont {
    color: $--color-primary;
  }
}
</style>
