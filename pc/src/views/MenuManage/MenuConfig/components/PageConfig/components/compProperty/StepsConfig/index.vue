<template>
  <div class="config singleLineTextConfig">
    <h1 class="config__h1">步骤条</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="关联组件">
        <el-select
          v-model="activeObj.relateDateId"
          placeholder="请选择关联组件"
        >
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getCurFormComp"
            :key="item.compId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据来源">
        <el-select
          v-model="activeObj.dataFrom"
          placeholder="请选择数据来源"
          @change="activeObj.stepsArr = []"
        >
          <el-option label="字典" :value="1"></el-option>
          <el-option label="数据表" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="字典表" v-if="activeObj.dataFrom === 1">
        <filterable-input
          :key="1"
          class="m-t-10"
          ref="filterableInput"
          placeholder="请选择字典"
          :showInfo="activeObj.dataSource.dictObj"
          :hasPagination="true"
          :dialogType="3"
          @selectRes="selectDict"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="数据表" v-if="activeObj.dataFrom === 2">
        <filterable-input
          :key="2"
          class="m-t-10"
          placeholder="请选择表"
          :showInfo="activeObj.multiTable.table"
          :dialogType="1"
          @selectRes="selectMultiTable"
        ></filterable-input>
        <filterable-input
          :key="3"
          class="m-t-10"
          placeholder="请选择字段"
          :tableName="activeObj.multiTable.table.tableName"
          :showInfo="activeObj.multiTable.column"
          :dialogType="2"
          :notShowSys="true"
          @selectRes="selectMultiColumn"
        ></filterable-input>
      </el-form-item>
      <el-form-item label="步骤条数据增加">
        <draggable
          v-model="activeObj.stepsArr"
          group="area"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group tag="ul">
            <li
              class="searchConfig__compItem"
              v-for="(child, index) in activeObj.stepsArr"
              :key="child.value"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-18"></i>
              <span class="searchConfig__compItem--name" :title="child.name">{{
                child.name
              }}</span>
              <el-tooltip
                effect="dark"
                content="删除"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-shanchu m-r-15"
                  @click="activeObj.stepsArr.splice(index, 1)"
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
        <apiot-button class="searchConfig__btn" @click="addData">
          <i class="iconfont icon-xinzeng m-r-4"></i>添加步骤条数据
        </apiot-button>
      </el-form-item>
      <dictDialog
        :visible.sync="showDict"
        :tableData="getDictArr"
        :curSelectArr="activeObj.stepsArr"
        @sureDict="sureDict"
      ></dictDialog>
      <columnDialog
        :visible.sync="showColumn"
        v-if="
          activeObj.multiTable.table.tableName &&
          activeObj.multiTable.column.columnName
        "
        :curSelectArr="activeObj.stepsArr"
        :multiTable="activeObj.multiTable"
        @sureColumn="sureColumn"
      >
      </columnDialog>
    </el-form>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import dictDialog from './dictDialog';
import columnDialog from './columnDialog';

export default {
  mixins: [propertyMixin],
  data() {
    return {
      showDict: false, // 是否显示字典弹窗
      showColumn: false // 是否显示字段弹窗
    };
  },

  components: {
    dictDialog,
    columnDialog
  },

  computed: {
    // 当前表单可以选择的组件
    getCurFormComp() {
      if (this.fatherObj) {
        const arr = [];
        this.fatherObj.children.forEach((item) => {
          if ([1, 2, 3, 4, 6, 10].includes(item.compType)) {
            arr.push(item);
          }
        });
        return arr;
      }
      return [];
    },
    // 默认字典项
    getDictArr() {
      if (this.activeObj.dataSource.dictObj) {
        const tempData = JSON.parse(
          JSON.stringify(this.$store.getters.getCurDict(this.activeObj.dataSource.dictObj.dictKey))
        );
        return tempData || [];
      }
      return [];
    }
  },

  created() {},

  mounted() {},

  methods: {
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
    },
    // 字典选择结果
    sureDict(arr) {
      arr.forEach((item) => {
        this.activeObj.stepsArr.push({
          name: item.name,
          value: item.value
        });
      });
    },
    // 添加数据
    addData() {
      if (this.activeObj.dataFrom === 1) {
        this.showDict = true;
      } else {
        this.showColumn = true;
      }
    },
    // 数据表选择
    selectMultiTable(table) {
      this.activeObj.multiTable.table.id = table.id;
      this.activeObj.multiTable.table.tableName = table.tableName;
      this.activeObj.multiTable.table.alias = `${table.tableName}__${createUnique()}`;
      this.activeObj.multiTable.column.id = '';
      this.activeObj.multiTable.column.columnName = '';
      this.activeObj.multiTable.column.columnTypeDict = '';
      this.activeObj.stepsArr = [];
    },
    // 字段选择
    selectMultiColumn(table) {
      this.activeObj.multiTable.column.id = table.id;
      this.activeObj.multiTable.column.columnName = table.columnName;
      this.activeObj.multiTable.column.columnTypeDict = table.columnTypeDict;
      this.activeObj.stepsArr = [];
    },
    sureColumn(arr) {
      arr.forEach((item) => {
        this.activeObj.stepsArr.push({
          name: item[this.activeObj.multiTable.column.columnName],
          value: item.id
        });
      });
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.searchConfig {
  &__btn {
    width: 100%;
    margin-bottom: 10px;
    .iconfont {
      font-size: 16px;
      color: $--color-primary;
    }
  }
  &__compItem {
    display: flex;
    align-items: center;
    &.high {
      flex-direction: column;
    }
    &--content {
      display: flex;
      width: 100%;
      height: 36px;
      align-items: center;
    }
    &--panel {
      display: flex;
      width: 100%;
      height: 36px;
      align-items: center;
      .filterableInput {
        width: 100%;
      }
    }
    .iconfont {
      &:hover {
        color: $--color-primary;
      }
    }
    &:hover {
      background-color: $--hover-color;
    }
    .icon-zongxiangtuodong {
      cursor: move;
      color: #bbc3cd;
    }
    &--name {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
    .icon-shanchu {
      cursor: pointer;
      color: #bbc3cd;
    }
  }
}
</style>
