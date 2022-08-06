<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">分割线</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item v-if="relateObj.compName === 'CardMain'">
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
      <el-form-item label="标题">
        <apiot-input
          v-model="activeObj.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="帮助信息">
        <apiot-input
          v-model="activeObj.helpInfo"
          placeholder="这里是帮助信息填写"
        ></apiot-input>
      </el-form-item>
      <el-form-item v-if="relateObj.tableInfo.tableName">
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
          columnTypes="1"
          :notShowSys="true"
          @selectRes="selectColumnRes"
        ></filterable-input>
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
      <el-form-item label="宽度" v-if="relateObj.compName === 'MenuMain'">
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
      <el-form-item label="最大分值">
        <el-select v-model="activeObj.maxScore" placeholder="">
          <el-option label="5分" :value="5"> </el-option>
          <el-option label="10分" :value="10"> </el-option>
          <el-option label="100分" :value="100"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="relateObj.compName === 'MenuMain'">
        <p class="switchBox">
          是否显示评价内容
          <el-switch
            v-model="activeObj.showContent"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="展示风格">
        <el-select v-model="activeObj.dividingType" placeholder="">
          <el-option label="五角星" :value="1"> </el-option>
          <el-option label="线性表情" :value="2"> </el-option>
          <el-option label="面性表情" :value="3"> </el-option>
          <el-option label="红旗展示" :value="4"> </el-option>
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

  computed: {},

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
    this.initEvaluation();
  },

  mounted() {},

  methods: {
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
    },
    // 初始化不同区域的label
    initEvaluation() {
      if (this.relateObj.compName === 'CardMain') {
        this.activeObj.width = '100%';
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.typeBox {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}
</style>
<style  lang='scss'>
.dividingTypeSelect {
  .el-select-dropdown__item {
    height: 54px;
    padding: 0 10px;
    margin-bottom: 10px;
  }
}
</style>
