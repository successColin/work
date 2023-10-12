<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">评分</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :showSwitch="relateObj.compName === 'CardMain'"
        :relateObj="relateObj"
      ></TitleConfig>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        columnTypes="1"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <WidthConfig
        :activeObj="activeObj"
        :relateObj="relateObj"
        :isShow="isShow"
      ></WidthConfig>
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
    // 初始化不同区域的label
    initEvaluation() {
      if (this.relateObj.compName === 'CardMain') {
        this.activeObj.width = '100%';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../commonConfig';

.typeBox {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
}
</style>
<style lang="scss">
.dividingTypeSelect {
  .el-select-dropdown__item {
    height: 54px;
    padding: 0 10px;
    margin-bottom: 10px;
  }
}
</style>
