<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">级联组件</h1>
    <el-form label-position="top" :model="activeObj">
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

      <StatusConfig :activeObj="activeObj"></StatusConfig>
      <!-- <el-form-item label="默认值" class="defaultValue">
        <el-select :value="1" placeholder="请选择" class="defaultValue__type">
          <el-option label="固定值" :value="1"></el-option>
        </el-select>
        <apiot-input
          class="defaultValue__input"
          v-model="fatherObj.form[activeObj.compId]"
        ></apiot-input>
      </el-form-item> -->
      <WidthConfig
        :activeObj="activeObj"
        :relateObj="relateObj"
        :isShow="isShow"
      ></WidthConfig>
      <el-form-item
        label="数据来源"
        v-if="activeObj.dataSource.columnName && false"
      >
        <el-select :value="activeObj.cascadeType" placeholder="请选择">
          <el-option label="自定义配置" :value="1"></el-option>
          <!-- <el-option label="省市区" :value="2"></el-option> -->
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="activeObj.dataSource.columnName && activeObj.compType !== 30"
      >
        <span slot="label" class="title">
          <span>数据来源配置</span>
          <i
            class="iconfont icon-xinzeng title__xinzeng"
            @click="addCascadeData"
          ></i>
        </span>
        <el-collapse v-model="activeNames" class="collapse" accordion>
          <el-collapse-item
            :name="index"
            v-for="(item, index) in activeObj.cascadeDataSource"
            :key="index"
          >
            <template slot="title">
              <span class="tableName" :title="getCollapseName(item)">{{
                getCollapseName(item)
              }}</span>
              <i
                class="iconfont icon-shanchu"
                v-if="index >= 2"
                @click.stop="deleteCascadeData(index)"
              ></i>
            </template>
            <filterable-input
              class="m-b-10"
              placeholder="上级表关联字段"
              v-if="index !== 0 && item.tableInfo.tableName"
              :tableName="item.tableInfo.tableName"
              :showInfo="item.relateColumn"
              :dialogType="2"
              @selectRes="selectColumnRes($event, item.relateColumn)"
            ></filterable-input>
            <filterable-input
              placeholder="请选择表"
              :dialogType="1"
              :showInfo="item.tableInfo"
              @selectRes="selectTable($event, item.tableInfo, index)"
            ></filterable-input>
            <filterable-input
              class="m-t-10"
              placeholder="本表显示字段"
              v-if="item.tableInfo.tableName"
              :tableName="item.tableInfo.tableName"
              :showInfo="item.showColumn"
              :dialogType="2"
              @selectRes="selectColumnRes($event, item.showColumn)"
            ></filterable-input>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
      <el-form-item label="下级加载方式" v-if="$route.query.isApp !== '1'">
        <el-select v-model="activeObj.loadType" placeholder="请选择">
          <el-option label="鼠标悬停" :value="1"></el-option>
          <el-option label="鼠标点击" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="存储类型">
        <el-select v-model="activeObj.storeType" placeholder="请选择">
          <el-option label="多级拼接类型" :value="1"></el-option>
          <el-option label="仅末尾级字段" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="$route.query.isApp !== '1'">
        <p class="switchBox">
          是否启用搜索
          <!-- :value="activeObj.showTab"
            @input="switchChange" -->
          <el-switch
            v-model="activeObj.enableSearch"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="验证">
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
      activeNames: '',
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
  },

  methods: {
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
    // 选中表格
    selectTable(table, tableInfo, index) {
      // console.log(table);
      if (table.tableName !== tableInfo.tableName) {
        tableInfo.tableName = table.tableName;
        tableInfo.id = table.id;
        this.activeObj.cascadeDataSource[index].relateColumn = {
          id: '',
          columnName: '',
        };
        this.activeObj.cascadeDataSource[index].showColumn = {
          id: '',
          columnName: '',
        };
      }
    },
    // 字段选择结果
    selectColumnRes(table, column) {
      if (column) {
        column.id = table.id;
        column.columnName = table.columnName;
        column.columnTypeDict = table.columnTypeDict;
      } else {
        this.activeObj.dataSource.id = table.id;
        this.activeObj.dataSource.columnName = table.columnName;
        this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
      }
    },
    getCollapseName(item) {
      if (item.tableInfo.tableName) {
        return `${item.name}(${item.tableInfo.tableName})`;
      }
      return `${item.name}`;
    },
    // 新增数据配置
    addCascadeData() {
      const len = this.activeObj.cascadeDataSource.length;
      this.activeObj.cascadeDataSource.push({
        name: `${len + 1}级表`,
        relateColumn: {
          id: '',
          columnName: '',
        },
        tableInfo: {
          id: '',
          tableName: '',
        },
        showColumn: {
          id: '',
          columnName: '',
        },
      });
    },
    // 删除数据配置
    deleteCascadeData(index) {
      this.activeObj.cascadeDataSource.splice(index, 1);
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
.title {
  position: relative;
  width: 100%;
  &__xinzeng {
    position: absolute;
    right: 0;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
}
.collapse {
  border: 0 none;

  ::v-deep {
    .el-collapse-item__header {
      border: 0 none;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-weight: 600;

      .tableName {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .el-collapse-item__header {
      position: relative;
      .icon-shanchu {
        position: absolute;
        right: 28px;
        color: #bbc3cd;
        &:hover {
          color: $--color-primary;
        }
      }
    }
    .el-collapse-item__wrap {
      border-bottom: 0 none;
      .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
  }
  .collapseIcon {
    width: 100%;
  }
}
</style>
