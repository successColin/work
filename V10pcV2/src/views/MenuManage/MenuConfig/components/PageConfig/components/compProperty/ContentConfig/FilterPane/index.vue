<template>
  <section>
    <apiot-dialog
      class="FilterTerm"
      v-on="$listeners"
      v-bind="$attrs"
      title="面板筛选条件"
      :isShowSure="false"
      cancelBtnName="确认"
    >
      <div class="FilterTerm__btnArea">
        <el-dropdown
          class="FilterTerm__btnArea--btn m-r-10"
          @command="handleCommand"
        >
          <apiot-button
            :class="[{ isDisabled: !Object.keys(canAddArea).length }]"
            :disabled="!Object.keys(canAddArea).length"
          >
            <i class="iconfont icon-xinzeng m-r-4"></i>
            添加面板区域
          </apiot-button>
          <el-dropdown-menu slot="dropdown" class="action__type">
            <el-dropdown-item
              :command="value"
              v-for="(value, key) in canAddArea"
              :key="key"
              >{{ value.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <p class="FilterTerm__btnArea--tip">
          <i class="el-icon-info"></i>
          添加关联面板中要筛选条件的区域！
        </p>
      </div>
      <ul class="FilterTerm__ul">
        <li
          class="FilterTerm__li"
          v-for="(item, index) in panelFilter"
          :key="index"
        >
          <h1 class="FilterTerm__li--head">
            <span class="FilterTerm__li--title"
              >{{ item.name }}({{ item.tableInfo.tableName }})</span
            >
            <el-select
              class="FilterTerm__li--select"
              v-model="item.filterTermType"
            >
              <el-option label="普通设置筛选" :value="1"></el-option>
              <el-option label="填写sql筛选" :value="2"></el-option>
            </el-select>
            <span class="FilterTerm__li--delete" @click="deleteArea(index)"
              ><i class="iconfont icon-shanchu"></i>删除</span
            >
          </h1>
          <TermComp :getCurrentTab="item" v-bind="$attrs"></TermComp>
        </li>
      </ul>
    </apiot-dialog>
  </section>
</template>

<script>
import TermComp from './TermComp';

export default {
  props: {
    // 面板上所有区域
    allArea: {
      type: Object
    },
    // 面板过滤条件
    panelFilter: {
      type: Array
    }
  },
  computed: {
    canAddArea() {
      const obj = {};
      const keys = Object.keys(this.allArea);
      keys.forEach((key) => {
        const index = this.panelFilter.findIndex((panle) => {
          if (panle.compId === key) {
            return true;
          }
          return false;
        });
        if (index === -1) {
          obj[key] = this.allArea[key];
        }
      });
      return obj;
    }
  },
  data() {
    return {};
  },

  mounted() {},

  components: {
    TermComp
  },

  methods: {
    // 新增区域
    handleCommand(area) {
      // console.log(area);
      this.panelFilter.push({
        compId: area.compId,
        name: area.name,
        filterTermType: 1,
        tableInfo: area.tableInfo,
        filterTermStr: '',
        filterTermSql: '',
        termParams: ''
      });
    },
    // 删除区域
    deleteArea(index) {
      this.panelFilter.splice(index, 1);
    }
  }
};
</script>

<style lang='scss' scoped>
.FilterTerm {
  overflow-x: hidden;
  ::v-deep {
    @media (min-height: 640px) {
      & >.el-dialog {
        height: 640px;
      }
    }
    @media (max-height: 640px) {
      & >.el-dialog {
        position: absolute;
        top: 20px;
        bottom: 20px;
      }
    }
    & > .el-dialog {
      width: 960px;
      & > .el-dialog__body {
        padding-top: 0;
        padding-bottom: 0;
        height: calc(100% - 54px - 54px);
      }
    }
    .el-form {
      .el-form-item {
        margin-bottom: 0;
      }
      .el-select {
        width: 100%;
      }
    }
    .el-date-editor--datetime {
      flex: 1;
    }
  }
  &__btnArea {
    display: flex;
    margin-bottom: 10px;
    &--btn {
      width: 124px;
      i {
        color: $--color-primary;
      }
      .isDisabled {
        i {
          color: #c0c4cc;
        }
      }
    }
    &--tip {
      margin-left: 10px;
      height: 30px;
      line-height: 30px;
      background: #f1f3f6;
      border-radius: 4px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      flex: 1;
      i {
        font-size: 16px;
        color: #bbc3cd;
        margin-left: 15px;
        margin-right: 10px;
      }
    }
  }
  &__li {
    &--head {
      box-sizing: border-box;
      padding: 0 10px;
      height: 42px;
      line-height: 42px;
      background: #f1f7ff;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
    }
    &--title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
    }
    &--select {
      margin-left: auto;
      width: 200px;
    }
    &--delete {
      margin-left: 12px;
      line-height: 1;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      i {
        color: $--color-primary;
        margin-right: 4px;
      }
    }
  }
  .normalTerm {
    height: calc(100% - 52px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  .sqlTerm {
    height: calc(100% - 52px);
    overflow: hidden;
  }
}
</style>
