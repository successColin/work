<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">开关</h1>
    <el-form label-position="top" :model="activeObj">
      <TitleConfig
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
      ></TitleConfig>
      <HelpConfig :activeObj="activeObj"></HelpConfig>
      <DataSourceConfig
        :isUser="isUser"
        :fatherObj="fatherObj"
        :activeObj="activeObj"
        :relateObj="relateObj"
        v-if="this.relateObj.tableInfo.tableName"
      ></DataSourceConfig>
      <!--  v-if="activeObj.dataSource.id && relateObj.tableInfo.tableName" -->
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
      <el-form-item label="值绑定" v-if="activeObj.dataSource.dictObj">
        <div class="bindValue m-b-10">
          <apiot-input
            value="是"
            disabled
            class="bindValue__left"
          ></apiot-input>
          <span class="bindValue__center">=</span>
          <el-select
            class="bindValue__right"
            v-model="activeObj.activeValue"
            placeholder="请选择值"
            @change="selectValue(1)"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="item in getDictArr(1)"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="bindValue">
          <apiot-input
            value="否"
            disabled
            class="bindValue__left"
          ></apiot-input>
          <span class="bindValue__center">=</span>
          <el-select
            class="bindValue__right"
            v-model="activeObj.inactiveValue"
            placeholder="请选择值"
            @change="selectValue(2)"
          >
            <el-option
              :label="item.name"
              :value="item.value"
              v-for="item in getDictArr(2)"
              :key="item.value"
            ></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="默认值" v-if="activeObj.dataSource.dictObj">
        <el-select
          v-model="defaultValue"
          placeholder="请选择默认值"
          @change="defalutChange"
        >
          <el-option label="是" :value="1"></el-option>
          <el-option label="否" :value="2"></el-option>
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
      <el-form-item>
        <p class="switchBox">
          是否显示文字
          <el-switch
            v-model="activeObj.showContent"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :deactive-value="false"
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
      <el-form-item label="验证" v-if="false">
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
      <el-form-item label="提交类型" v-if="!isUser">
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
      defaultValue: 2,
    };
  },

  components: {},

  computed: {
    getDictArr() {
      return (flag) => {
        if (flag === 1) {
          if (this.activeObj.inactiveValue) {
            const arr = this.activeObj.dataSource.dictObj.dictValue.filter(
              (item) => {
                if (item.value === this.activeObj.inactiveValue) {
                  return false;
                }
                return true;
              },
            );
            return arr;
          }
        }
        if (flag === 2) {
          if (this.activeObj.activeValue) {
            const arr = this.activeObj.dataSource.dictObj.dictValue.filter(
              (item) => {
                if (item.value === this.activeObj.activeValue) {
                  return false;
                }
                return true;
              },
            );
            return arr;
          }
        }
        return this.activeObj.dataSource.dictObj.dictValue || [];
      };
    },
  },

  created() {
    // 需要在内部组件渲染之前初始化数据
    this.initMainTable();
  },

  mounted() {
    this.initDefault();
  },

  methods: {
    // 默认值更改
    defalutChange() {
      if (this.defaultValue === 1) {
        this.fatherObj.form[this.activeObj.compId] = this.activeObj.activeValue;
      }
      if (this.defaultValue === 2) {
        this.fatherObj.form[this.activeObj.compId] =
          this.activeObj.inactiveValue;
      }
    },
    // 选择值来设置默认值
    selectValue(flag) {
      if (flag === this.defaultValue) {
        this.fatherObj.form[this.activeObj.compId] = this.activeObj.activeValue;
      }
      if (flag === this.defaultValue) {
        this.fatherObj.form[this.activeObj.compId] =
          this.activeObj.inactiveValue;
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
      this.$set(this.activeObj.dataSource, 'dictObj', dict);
      this.fatherObj.form[this.activeObj.compId] = '';
      this.activeObj.activeValue = '';
      this.activeObj.inactiveValue = '';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../commonConfig';

.bindValue {
  display: flex;
  &__left {
    flex: 0 0 70px;
  }
  &__center {
    flex: 0 0 30px;
    text-align: center;
  }
  &__right {
    flex: 1;
  }
}
</style>
