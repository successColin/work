<template>
  <el-popover
    placement="bottom"
    width="260"
    trigger="click"
    v-model="visible"
    @show="show"
    popper-class="filter"
  >
    <div class="filter__content">
      <apiot-input
        v-if="type === 1"
        v-model="startValue"
        placeholder="请输入关键字搜索"
      ></apiot-input>
      <el-checkbox-group
        v-model="startValue"
        v-if="type === 2"
        class="filter__all filter__check"
      >
        <el-checkbox
          v-for="item in getDictArr"
          :key="item.value"
          :label="item.name"
        ></el-checkbox>
      </el-checkbox-group>
      <el-date-picker
        v-if="type === 4"
        class="filter__all"
        v-model="startValue"
        type="daterange"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-input
        v-if="type === 5"
        class="filter__all"
        v-model="startValue"
        :placeholder="configData.placeholder"
        v-onlyNumber="2"
      >
      </el-input>
    </div>
    <div class="filter__btns">
      <apiot-button @click="visible = false"> 取消 </apiot-button>
      <apiot-button type="primary" @click="sureClick"> 确定 </apiot-button>
    </div>
    <i
      slot="reference"
      class="filter__btn iconfont icon-shujiantouzhankai"
      :class="[
        { rotate: visible },
        {
          active: getState || visible,
        },
      ]"
      @click.stop
    ></i>
  </el-popover>
</template>

<script>
export default {
  name: '',
  props: {
    configData: {
      type: Object
    },
    grandFather: {
      type: Object
    }
  },
  data() {
    return {
      type: 1,
      startValue: '', // 初始值
      filterValue: '', // 最终使用值
      visible: false,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '大于当前时间',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 365 * 100);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '小于当前时间',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365 * 100);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
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
    'isSelect'
  ],
  components: {},
  computed: {
    getDictArr() {
      return this.$store.getters.getCurDict(this.configData.dataSource.dictObj.dictKey);
    },
    getState() {
      return Array.isArray(this.filterValue) ? this.filterValue.length : this.filterValue;
    }
  },
  mounted() {
    this.initComp();
  },
  methods: {
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
        if (this.configData.enableDict) {
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
        this.type = 1;
      }
      // 时间
      if ([8, 9].includes(compType)) {
        this.type = 4;
      }
      // 数字
      if ([10].includes(compType)) {
        this.type = 5;
      }
    },
    // 生成搜索结构
    createColumn(comp, value) {
      const column = {
        dict: 2,
        lambda: 'LIKE',
        name: '',
        value: '',
        compId: '',
        columnType: comp.dataSource.columnTypeDict
      };
      // 转化label
      comp = JSON.parse(JSON.stringify(comp));
      if (comp.compType === 15) {
        // 启用字典
        if (comp.enableDict) {
          // 字典选择
          comp.compType = 4;
        } else if (comp.dataSource.relateName === '主表') {
          if (comp.enableMultiColumn) {
            // 数据多选框
            comp.compType = 7;
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
      column.value = value;
      // 如果是label 但是他的字典没开启
      if (comp.compType === 15 && !comp.enableDict) {
        comp.dataSource.dictObj = null;
      }

      // 值的处理 字典的处理
      if (comp.dataSource.dictObj) {
        column.dict = 1;
        column.value = value.join();
      }

      // 字段名的处理
      column.name = `${comp.dataSource.tableName}.${comp.dataSource.columnName}`;
      if (comp.dataSource.alias) {
        column.name = `${comp.dataSource.alias}.${comp.dataSource.columnName}`;
      }

      column.compId = comp.compId;
      if (comp.compType === 6 || comp.compType === 7) {
        column.compId = `${comp.compId}_`;
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
              compId: comp.compId,
              columnType: comp.dataSource.columnTypeDict
            },
            {
              dict: 2,
              lambda: '<=',
              name: column.name,
              value: value[1],
              keyName: comp.name,
              compId: comp.compId,
              columnType: comp.dataSource.columnTypeDict
            }
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
      }
      if (this.$parent.$parent.$parent.$parent.hideOtherFilter) {
        this.$parent.$parent.$parent.$parent.hideOtherFilter(this.configData.compId);
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
      let value = this.filterValue;
      if (this.type === 2) {
        const arr = [];
        this.getDictArr.forEach((dict) => {
          if (this.startValue.includes(dict.name)) {
            arr.push(dict.value);
          }
        });
        value = arr;
      }
      if (Array.isArray(value) ? !value.length : !value) {
        this.$bus.$emit('reloadArea', 'filterList', this.onlyFlag(), this.grandFather.compId, {
          compId: this.configData.compId,
          arr: []
        });
        return;
      }
      const arr = this.createColumn(this.configData, value);
      // 清除高级搜索，普通搜索
      this.$emit('clearSearch', this.onlyFlag(), this.grandFather.compId, false);
      // 传递arr，到列表更新列表
      this.$bus.$emit('reloadArea', 'filterList', this.onlyFlag(), this.grandFather.compId, {
        compId: this.configData.compId,
        arr
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.filter {
  &__btn {
    position: absolute;
    right: -16px;
    top: -4px;
    transition: all 0.5s;
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
    padding: 0 10px 10px;
    border-bottom: 1px solid #e9e9e9;
  }
  &__all {
    width: 100% !important;
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
