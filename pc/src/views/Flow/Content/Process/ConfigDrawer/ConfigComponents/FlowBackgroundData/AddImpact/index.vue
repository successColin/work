<template>
  <apiot-dialog
      class="affectType"
      :title="getTitle"
      @sure-click="sureClick"
      v-on="$listeners"
      v-bind="$attrs"
  >
    <el-form
        label-position="top"
        label-width="80px"
        @submit.native.prevent
        class="affectType__form"
    >
      <div class="form--line">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型" class="form--child">
              <el-select v-model="curType" :disabled="!canEdit">
                <el-option
                    :label="item.label"
                    :value="item.value"
                    v-for="item in typeList"
                    :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="触发表" class="form--child">
              <filterable-input
                  placeholder="请选择表"
                  :showInfo="tableInfo"
                  :dialogType="1"
                  @selectRes="selectTable"
                  :disabled="!canEdit"
                  :notShowSys="false"
              ></filterable-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="form--line">
        <el-form-item label="新增(更新)内容" class="form--child">
          <apiot-button class="addBtn" @click="addContent"
          ><i class="iconfont icon-xinzeng m-r-4"></i>新增
          </apiot-button
          >
          <ul class="list">
            <li
                v-for="(item, index) in contentList"
                :key="index"
                class="list__item m-b-8"
            >
              <filterable-input
                  class="list__item--column"
                  placeholder="请选择字段"
                  :tableName="tableInfo.tableName"
                  :showInfo="item.columnObj"
                  :dialogType="2"
                  :notShowSys="false"
                  @selectRes="selectColumnRes($event, item.columnObj)"
              ></filterable-input>
              <!-- <el-select v-model="item.lambda" class="list__item--lambda">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in lambdaArr"
                  :key="item.value"
                ></el-option>
              </el-select> -->
              <el-select
                  v-model="item.valueType"
                  class="list__item--valueType"
                  @change="item.content = ''"
              >
                <el-option label="固定值" :value="1"></el-option>
                <el-option label="公式" :value="2"></el-option>
              </el-select>
              <el-date-picker
                  v-if="item.valueType === 1 && item.columnObj.columnType === 3"
                  type="datetime"
                  :editable="false"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="item.content"
                  class="list__item--content"
                  placeholder="请选择日期"
              >
              </el-date-picker>
              <apiot-input
                  v-else
                  v-show="item.valueType === 1"
                  v-model="item.content"
                  class="list__item--content"
              ></apiot-input>
              <select-formula
                  v-if="item.valueType === 2"
                  :configData="configData"
                  class="list__item--formula"
                  :triggerCompMap="triggerCompMap"
                  v-model="item.content"
                  v-bind="$attrs"
              ></select-formula>
              <i
                  class="iconfont icon-shanchu"
                  @click="deleteList(contentList, index)"
              ></i>
            </li>
          </ul>
        </el-form-item>
      </div>
      <div class="form--line" v-if="curType!=='INSERT'">
        <ActionTerm
            v-bind="$attrs"
            :curTermObj="termObj"
            :lambdaArr="lambdaArr"
            :flag="2"
            businessType="flow"
            :tableInfo="tableInfo"
            :configData="configData"
            :triggerCompMap="triggerCompMap"
            :notShowSys="false"
        ></ActionTerm>
      </div>
      <div class="form--line">
        <el-form-item label="备注" class="form--child">
          <apiot-input type="textarea" v-model="memo"></apiot-input>
        </el-form-item>
      </div>
    </el-form>
  </apiot-dialog>
</template>

<script>
import SelectFormula from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/SelectFormula';
import ActionTerm from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/GlobalConfig/components/AddAction/components/ActionTerm';

export default {
  props: {
    lambdaArr: {
      type: Array
    },
    currentType: {
      type: Number
    },
    editObj: {
      type: Object
    },
    configData: {
      type: Array
    },
    // 所有组件
    triggerCompMap: {
      type: Object
    }
  },
  data() {
    return {
      typeList: [{
        label: '新增',
        value: 'INSERT',
      },
      {
        label: '编辑',
        value: 'UPDATE',
      },
      {
        label: '删除',
        value: 'DELETE',
      }],
      tableInfo: {},
      contentList: [],
      memo: '',
      curType: 'UPDATE',
      termObj: {
        termType: 1, // 1 代表外层and 内层 or
        termArr: [] // 条件数组
      }
    };
  },

  components: {
    SelectFormula,
    ActionTerm
  },

  computed: {
    getTitle() {
      return this.currentType === 1 ? '新增影响类型' : '编辑影响类型';
    },
    canEdit() {
      if (this.contentList.length !== 0 || this.termObj.termArr.length !== 0) {
        return false;
      }
      return true;
    }
  },

  mounted() {
    if (this.currentType === 2 && this.editObj) {
      this.curType = this.editObj.type;
      this.tableInfo.tableName = this.editObj.tableName;
      if (this.editObj.operationContent) {
        this.contentList = JSON.parse(this.editObj.operationContent.replace(/\\/g, ''));
      }
      if (this.editObj.operationConditions) {
        const obj = JSON.parse(this.editObj.operationConditions.replace(/\\/g, ''));
        this.termObj.termArr = obj.termArr;
        this.termObj.termType = obj.termType;
      }
      this.memo = this.editObj.memo;
    }
  },

  methods: {
    sureClick() {
      if (!this.tableInfo.tableName) {
        return this.$message({
          type: 'error',
          message: '请选择触发表'
        });
      }
      if (this.curType === 'INSERT' && this.contentList.length === 0) {
        return this.$message({
          type: 'error',
          message: '新增类型必须有内容'
        });
      }
      if (this.curType === 'DELETE' && this.termObj.termArr.length === 0) {
        return this.$message({
          type: 'error',
          message: '删除类型必须有条件'
        });
      }
      if (
        (this.curType === 'UPDATE') &&
          (this.termObj.termArr.length === 0 || this.contentList.length === 0)
      ) {
        return this.$message({
          type: 'error',
          message: '编辑类型必须有内容和条件'
        });
      }
      if (this.contentList.length) {
        const index = this.contentList.flat(Infinity)
          .findIndex((term) => {
            if (!term.columnObj.columnName) {
              return true;
            }
            return false;
          });
        if (index !== -1) {
          return this.$message({
            type: 'error',
            message: '请选择内容字段'
          });
        }
      }
      if (this.termObj.termArr.length) {
        const index = this.termObj.termArr.flat(Infinity)
          .findIndex((term) => {
            if (!term.columnObj.columnName) {
              return true;
            }
            return false;
          });
        if (index !== -1) {
          return this.$message({
            type: 'error',
            message: '请选择条件字段'
          });
        }
      }
      const params = {
        type: this.curType,
        tableName: this.tableInfo.tableName,
        operationContent: JSON.stringify(this.contentList),
        operationConditions: JSON.stringify(this.termObj),
        memo: this.memo,
      };
      this.$emit('addAffectType', params);
      this.$emit('update:visible', false);
    },
    addContent() {
      if (!this.tableInfo.tableName) {
        return this.$message({
          type: 'error',
          message: '请选择触发表'
        });
      }
      this.contentList.unshift({
        columnObj: {
          columnName: '',
          columnType: ''
        },
        lambda: '=',
        valueType: 1,
        content: ''
      });
    },
    selectTable(table) {
      this.tableInfo = {
        tableName: table.tableName,
        id: table.id
      };
    },
    selectColumnRes(column, columnObj) {
      columnObj.columnName = column.columnName;
      columnObj.columnType = column.columnTypeDict;
    },
    deleteList(list, index) {
      list.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-dialog__header{
    text-align: left;
  }
}
.affectType__form {
  overflow-y: auto;
  overflow-x: hidden;
  .form--line{
    ::v-deep{
      .formula__box--header, .formula__box--main{
        text-align: left;
      }
    }
  }
  ::v-deep{
    .el-form-item {
      text-align: left;
      .el-select {
        width: 100%;
      }
    }
  }
}

.addBtn {
  position: absolute;
  right: 0;
  margin-top: -28px;

  .icon-xinzeng {
    color: $--color-primary;
  }

  span {
    color: #333333;
  }
}

.list {
  margin-top: 10px;

  &__item {
    display: flex;
    align-items: center;

    &--column {
      width: 180px;
      margin-right: 8px;
    }

    &--lambda {
      width: 60px !important;
      margin-right: 8px;
    }

    &--valueType {
      width: 100px !important;
      margin-right: 8px;
    }

    &--content {
      flex: 1;
    }

    &--formula {
      width: auto !important;
      flex: 1;
    }

    .icon-shanchu {
      color: #bbc3cd;
      font-size: 16px;
      cursor: pointer;
      margin-left: 8px;

      &:hover {
        color: $--color-primary;
      }
    }
  }
}
</style>
