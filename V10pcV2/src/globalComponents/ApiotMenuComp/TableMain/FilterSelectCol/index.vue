<template>
  <div class="filterBox" :class="[{ hasBg: getState }, { isConfig: isConfig }]">
    <div
      class="filter__content"
      :class="[{ p_b_0: [2, 3].includes(type) }]"
      v-if="!isConfig"
    >
      <el-select
        v-model="startValue"
        :multiple="true"
        :collapse-tags="true"
        :placeholder="configData.placeholder"
        v-if="type === 2"
        class="filter__all filter__check"
        @change="sureClick"
      >
        <el-option
          v-for="item in effectArr"
          :key="item.value"
          :value="item.value"
          :label="item.name"
        ></el-option>
      </el-select>
    </div>
    <div v-else>{{ configData.name }}</div>
  </div>
</template>

<script>
import { timeShortcuts } from '@/config';

export default {
  name: '',
  props: {
    configData: {
      type: Object,
    },
    grandFather: {
      type: Object,
    },
  },
  data() {
    return {
      type: 1,
      startValue: '', // 初始值
      filterValue: '', // 最终使用值
      visible: false,
      pickerOptions: {
        shortcuts: timeShortcuts,
      },
    };
  },
  inject: [
    'isConfig',
    'resolveFormula',
    'getAllForm',
    'getPanel',
    'getFatherPanel',
    'onlyFlag',
    'sysMenuDesignId',
    'isSelect',
  ],
  components: {},
  computed: {
    getDictArr() {
      return this.$store.getters.getCurDict(
        this.configData.dataSource.dictObj.dictKey,
      );
    },
    // 生效字典数组
    effectArr() {
      if (this.configData.effectDict && this.configData.effectDict.length) {
        const arr = this.getDictArr.filter((item) => {
          if (this.configData.effectDict.includes(item.value)) {
            return true;
          }
          return false;
        });
        return arr;
      }
      return this.getDictArr;
    },
    getState() {
      return Array.isArray(this.filterValue)
        ? this.filterValue.length
        : this.filterValue;
    },
  },
  mounted() {
    this.initComp();
  },
  methods: {
    getListParams(callback) {
      this.$emit('getListParams', callback);
    },
    // 清除搜索值
    clearFilter() {
      this.startValue = '';
      this.filterValue = '';
    },
    initComp() {
      let { compType } = this.configData;
      // 转换label
      if (this.configData.compType === 15) {
        // 启用字典
        if (this.configData.enableDict && !this.configData.enableMultiColumn) {
          // 字典选择
          compType = 4;
        } else if (this.configData.dataSource.relateName === '主表') {
          if (this.configData.enableMultiColumn) {
            // 数据多选框
            compType = 7;
          } else if (this.configData.dataSource.columnTypeDict === '3') {
            // 日期时间选择框
            compType = 9;
          } else if (this.configData.dataSource.columnTypeDict === '1') {
            // 数字类型
            compType = 10;
          } else {
            compType = 1;
          }
        } else {
          compType = 6;
        }
      }
      // 单行文本 多行文本
      if ([1, 11].includes(compType)) {
        this.type = 1;
      }
      // 下拉 单选 多选
      if ([2, 3, 4].includes(compType)) {
        if (!this.startValue) {
          this.startValue = [];
          this.filterValue = [];
        }
        this.type = 2;
      }
      // 数据单选 数据多选
      if ([6, 7].includes(compType)) {
        this.type = 3;
        if (this.configData.enableDict) {
          // 字典选择
          this.type = 2;
        }
      }
      // 时间
      if ([8, 9].includes(compType)) {
        this.type = 4;
      }
      // 数字
      if ([10].includes(compType)) {
        this.type = 5;
      }
      // console.log(this.type);
    },
    // 生成搜索结构
    createColumn(comp, value) {
      const column = {
        dict: 2,
        lambda: 'LIKE',
        name: '',
        value: '',
        compId: '',
        columnType: comp.dataSource.columnTypeDict,
      };
      // 转化label
      comp = JSON.parse(JSON.stringify(comp));
      if (comp.compType === 15) {
        // 启用字典
        if (comp.dataSource.relateName === '主表') {
          if (comp.enableMultiColumn) {
            // 数据多选框
            comp.compType = 7;
          } else if (comp.enableDict) {
            // 字典选择
            comp.compType = 4;
          } else if (comp.dataSource.columnTypeDict === '3') {
            // 日期时间选择框
            comp.compType = 9;
          } else if (comp.dataSource.columnTypeDict === '1') {
            // 数字类型
            comp.compType = 10;
          } else {
            comp.compType = 1;
          }
        } else {
          comp.compType = 6;
        }
      }
      if (comp.compType === 28) {
        comp.compType = 7;
      }
      column.value = value;
      // 如果是label 但是他的字典没开启
      if (comp.compType === 15 && !comp.enableDict) {
        comp.dataSource.dictObj = null;
      }

      // 值的处理 字典的处理
      if (comp.dataSource.dictObj && this.type === 2) {
        column.dict = 1;
        column.value = value.join();
      }

      if (comp.dataSource.dictObj && comp.enableDict) {
        column.dict = 1;
      }

      // 字段名的处理
      column.name = `${comp.dataSource.tableName}.${comp.dataSource.columnName}`;
      if (comp.dataSource.alias) {
        column.name = `${comp.dataSource.alias}.${comp.dataSource.columnName}`;
      }

      column.compId = comp.relateCompId;
      if (comp.compType === 6 || comp.compType === 7) {
        column.compId = `${comp.relateCompId}_`;
      }

      if ((comp.compType === 8 || comp.compType === 9) && value) {
        if (value[0] && value[1]) {
          const timeArr = [
            {
              dict: 2,
              lambda: '>=',
              name: column.name,
              value: value[0],
              keyName: comp.name,
              compId: comp.relateCompId,
              columnType: comp.dataSource.columnTypeDict,
            },
            {
              dict: 2,
              lambda: '<=',
              name: column.name,
              value: value[1],
              keyName: comp.name,
              compId: comp.relateCompId,
              columnType: comp.dataSource.columnTypeDict,
            },
          ];
          return timeArr;
        }
      }
      return [column];
    },
    // 刚显示时赋值
    show() {
      if (this.filterValue !== this.startValue) {
        this.startValue = this.filterValue;
      } else if (this.configData.enableDict && this.type === 2) {
        if (!this.startValue) {
          this.startValue = [];
          this.filterValue = [];
        }
      }
      if (this.$refs.dataSelect) {
        this.$refs.dataSelect.resetSelectArr(this.startValue);
      }
      if (this.$parent.$parent.$parent.$parent.hideOtherFilter) {
        this.$parent.$parent.$parent.$parent.hideOtherFilter(
          this.configData.compId,
        );
      }
    },
    hide(compId) {
      if (compId !== this.configData.compId) {
        this.visible = false;
      }
    },
    // 确认，进行筛选
    sureClick() {
      this.visible = false;
      this.filterValue = this.startValue;
      const value = this.filterValue;
      if (Array.isArray(value) ? !value.length : !value) {
        this.$bus.$emit(
          `reloadArea${this.onlyFlag()}`,
          'filterList',
          this.grandFather.compId,
          {
            compId: this.configData.relateCompId,
            arr: [],
          },
        );
        return;
      }

      const arr = this.createColumn(this.configData, value);
      // 清除高级搜索，普通搜索
      this.$bus.$emit(
        `clearSearch${this.onlyFlag()}`,
        this.grandFather.compId,
        false,
      );
      // 传递arr，到列表更新列表
      this.$bus.$emit(
        `reloadArea${this.onlyFlag()}`,
        'filterList',
        this.grandFather.compId,
        {
          compId: this.configData.relateCompId,
          arr,
        },
      );
    },
    // 清空 并搜索
    clearSearch() {
      this.startValue = '';
      if (this.type === 2) {
        this.startValue = [];
      }
      this.sureClick();
    },
  },
};
</script>

<style lang="scss" scoped>
.filterBox {
  width: 160px;
  height: 32px;
  font-size: 13px;
  box-sizing: border-box;
  border-radius: 4px;
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  &.isConfig {
    width: max-content;
    padding: 0 4px;
    border: 1px solid #e9e9e9;
  }
  &.hasBg {
    background: #e9ebf3;
    right: -17px;
    .icon-quanshan {
      display: inline-block;
    }
  }
  .icon-quanshan {
    display: none;
    font-size: 14px;
    width: 20px;
    color: rgba(0, 0, 0, 0.16);
    &:hover {
      color: rgba(0, 0, 0, 0.4);
    }
  }
  .icon-biaotoushaixuan {
    font-size: 14px;
    color: #bbc3cd;
  }
}
.filter {
  &__btn {
    transition: all 0.5s;
    display: inline-block;
    height: 36px;
    width: 20px;

    &:hover {
      color: $--color-primary;
    }
    &.rotate {
      transform: rotate(180deg);
    }
    &.active {
      color: $--color-primary;
    }
  }
  &__btns {
    text-align: right;
    margin: 0;
    margin-top: 12px;
    margin-right: 10px;
  }
  &__content {
    &.p_b_0 {
      padding-bottom: 0;
    }
  }
  &__all {
    width: 100% !important;
    ::v-deep {
      .el-select__tags {
        & > span {
          & > span {
            padding: 0 4px;
            &:first-child {
              padding-right: 16px;
              position: relative;
              .el-select__tags-text {
                display: inline-block;
                width: 64px;
              }
              i {
                position: absolute;
                right: 2px;
                top: 4px;
              }
            }
          }
        }
      }
    }
  }
  &__check {
    display: flex;
    flex-direction: column;
    ::v-deep {
      .el-checkbox {
        height: 36px;
        line-height: 36px;
        padding-left: 4px;
        margin-right: 0;

        .el-checkbox__label {
          color: #333;
        }
      }
    }
  }
}
</style>
<style>
.filter {
  padding: 12px 0px !important;
  box-shadow: 0px 4px 14px 0px rgb(0 0 0 / 14%) !important;
}
</style>
