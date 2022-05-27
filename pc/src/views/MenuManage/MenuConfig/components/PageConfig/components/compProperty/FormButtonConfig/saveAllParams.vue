<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="saveParams"
    title="保存参数设置"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <el-dropdown class="saveParams__drop m-b-10" @command="handleCommand">
      <apiot-button class="saveParams__addBtn">
        <i class="iconfont icon-xinzeng m-r-4"></i>
        添加保存区域
      </apiot-button>
      <el-dropdown-menu slot="dropdown" class="saveParams__dropItem">
        <el-dropdown-item
          :command="value"
          v-for="value in getCurCanAddArea"
          :key="value.compId"
          >{{ value.name }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <div class="saveParams__body">
      <ul class="saveParams__body--ul">
        <li
          class="saveParams__body--li liItem m-b-10"
          v-for="(item, index) in showSaveArr"
          :key="item.compId"
        >
          <header class="liItem__header m-b-10">
            <span>{{ item.name }}</span>
            <apiot-button
              type="text"
              class="liItem__header--delete"
              @click="showSaveArr.pop()"
              v-show="index + 1 === showSaveArr.length"
            >
              <i class="iconfont icon-shanchu m-r-4"></i>
              删除
            </apiot-button>
          </header>
          <ul class="liItem__list" v-if="index !== 0">
            <header class="liItem__list--header">
              <span>参数传递</span>
              <apiot-button
                class="liItem__header--delete"
                @click="addParams(item)"
                :disabled="item.relation.length >= index"
              >
                <i class="iconfont icon-xinzeng m-r-4"></i>
                添加参数
              </apiot-button>
            </header>
            <li
              class="liItem__item m-b-10"
              v-for="(relate, i) in item.relation"
              :key="i"
            >
              <filterable-input
                class="m-r-10"
                placeholder="请选择表格"
                :showInfo="item.tableInfo"
                :dialogType="1"
                :disabled="true"
              ></filterable-input>
              <filterable-input
                placeholder="请选择字段"
                :tableName="item.tableInfo.tableName"
                :showInfo="relate.columnInfo"
                :dialogType="2"
                @selectRes="selectRes($event, relate.columnInfo)"
              ></filterable-input>
              <span class="liItem__item--equal">=</span>
              <el-select
                value-key="compId"
                v-model="relate.tableInfo"
                class="m-r-10"
              >
                <el-option
                  v-for="v in getBeforeArea(index, item.relation, i)"
                  :key="v.compId"
                  :label="v.name"
                  :value="v"
                ></el-option>
              </el-select>
              <filterable-input
                class="m-r-10"
                placeholder="请选择字段"
                :tableName="item.tableInfo.tableName"
                :showInfo="{ columnName: 'id' }"
                :dialogType="2"
                :disabled="true"
              ></filterable-input>
              <i
                class="liItem__item--delete iconfont icon-shanchu"
                @click="item.relation.splice(i, 1)"
              ></i>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    relateObj: {
      type: Object
    },
    saveAreaArr: {
      type: String
    }
  },
  data() {
    return {
      showSaveArr: []
    };
  },

  components: {},

  computed: {
    getCurCanAddArea() {
      return this.relateObj.children.slice(1).filter((relate) => {
        const index = this.showSaveArr.findIndex((comp) => comp.compId === relate.compId);
        if (index !== -1) {
          return false;
        }
        return true;
      });
    }
  },

  mounted() {
    if (this.saveAreaArr) {
      this.showSaveArr = JSON.parse(this.saveAreaArr);
    }
  },

  methods: {
    // 新增区域
    handleCommand(v) {
      // console.log(v);
      this.showSaveArr.push({
        name: v.name,
        compId: v.compId,
        tableInfo: v.tableInfo,
        relation: []
      });
    },
    // 新增参数
    addParams(item) {
      item.relation.push({
        columnInfo: {
          columnName: '',
          columnTypeDict: 1
        },
        tableInfo: {
          compId: '',
          name: '',
          tableName: ''
        }
      });
    },
    // 获取之前的列表 index 最外层的序号 relation 关系数组 curIndex relation的序号
    getBeforeArea(index, relation, curIndex) {
      // console.log(index, relation);
      const arr = [];
      const relateArr = [];
      relation.forEach((relate, i) => {
        if (curIndex !== i) {
          relateArr.push(relate.tableInfo.compId);
        }
      });
      // console.log(relateArr);
      this.showSaveArr.forEach((v, i) => {
        if (i < index && !relateArr.includes(v.compId)) {
          arr.push({
            compId: v.compId,
            name: v.name,
            tableName: v.tableInfo.tableName
          });
        }
      });
      // console.log(arr);
      return arr;
    },
    selectRes(column, columnInfo) {
      columnInfo.columnName = column.columnName;
      columnInfo.columnTypeDict = column.columnTypeDict;
    }
  },

  watch: {
    showSaveArr: {
      handler(v) {
        // console.log(v);
        this.$emit('update:saveAreaArr', JSON.stringify(v));
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.saveParams {
  .iconfont {
    color: $--color-primary;
  }
  ::v-deep {
    & > .el-dialog {
      width: 960px;
      max-height: 640px;
      position: absolute;
      top: 100px;
      bottom: 100px;
      & > .el-dialog__body {
        // padding-top: 0;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px);
      }
    }
  }
  &__drop {
    width: min-content;
  }
  &__body {
    height: calc(100% - 40px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .liItem {
    &__header {
      box-sizing: border-box;
      padding: 0 10px;
      display: flex;
      height: 42px;
      align-items: center;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
      background: #f1f7ff;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      &--delete {
        margin-left: auto;
        font-size: 13px;
        color: #333333;
      }
    }
    &__list {
      padding: 0 10px 0 12px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      &--header {
        height: 52px;
        display: flex;
        align-items: center;
        font-size: 13px;
        font-weight: 500;
        color: #333333;
      }
    }
    &__item {
      display: flex;
      align-items: center;
      &--equal {
        margin: 0 10px;
        font-size: 13px;
        font-weight: 400;
        color: #333333;
      }
      &--delete {
        color: #000000;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
    }
  }
}
</style>
