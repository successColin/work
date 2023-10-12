<template>
  <div class="dataSelect">
    <search-input
      class="dataSelect__search"
      @getList="getSearchList"
      v-model.trim="keyword"
      placeholder="请输入关键字搜索"
    ></search-input>
    <div class="dataSelect__line"></div>
    <p class="dataSelect__tip" v-if="keyword && showSearch">
      搜索"<span>{{ keyword }}</span
      >"的结果展示共{{ total }}条
    </p>
    <div class="dataSelect__box" ref="searchList">
      <el-checkbox-group
        v-model="selectArr"
        class="dataSelect__check"
        ref="scroll"
      >
        <el-checkbox
          v-for="item in resArr"
          v-show="getShowValue(item)"
          :key="item[`${configData.compId}_`] || item[configData.compId]"
          :label="item[`${configData.compId}_`] || item[configData.compId]"
          >{{ getShowValue(item) }}</el-checkbox
        >
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { getSidebarPage } from '@/api/menuConfig';
import { throttle } from '@/utils/utils';

export default {
  name: '',
  props: {
    configData: {
      type: Object,
    },
    startValue: {
      type: String,
    },
  },
  data() {
    return {
      resArr: [],
      keyword: '',
      selectArr: [],
      current: 1,
      size: 20,
      total: 0,
      loading: false,
      noMore: false,
      showSearch: false,
    };
  },
  computed: {
    getDictArr() {
      return this.$store.getters.getCurDict(
        this.configData.dataSource.dictObj.dictKey,
      );
    },
    getDictObj() {
      if (this.configData.dataSource) {
        const { dictKey } = this.configData.dataSource.dictObj || {};
        if (dictKey) {
          const tempData = this.$store.getters.getCurDict(dictKey);
          const obj = {};
          if (Array.isArray(tempData) && tempData.length) {
            tempData.forEach((dict) => {
              obj[dict.value] = dict;
            });
          }
          return obj;
        }
      }
      return '';
    },
    getShowValue() {
      return (item) => {
        let resValue =
          item[`${this.configData.compId}_`] || item[this.configData.compId];
        if (resValue) {
          if (this.configData.enableDict && this.getDictObj) {
            if (this.configData.enableMultiColumn) {
              resValue = resValue.toString().split(',');
            } else {
              resValue = [resValue];
            }
            const tempArr = [];
            resValue.forEach((v) => {
              tempArr.push(this.getDictObj[v].name);
            });
            if (tempArr.length) {
              return tempArr.join(',');
            }
          }
          return resValue;
        }
        return '';
      };
    },
  },
  components: {},
  created() {},
  mounted() {
    setTimeout(() => {
      this.getList();
    }, 1000);
    this.$refs.searchList.addEventListener(
      'scroll',
      throttle(this.scrollThing),
    );
  },
  methods: {
    // 初始话resetSelectArr
    resetSelectArr(v) {
      this.selectArr = v ? v.split('$') : [];
    },
    // 滚动事件
    scrollThing() {
      if (
        this.$refs.searchList.scrollTop + this.$refs.searchList.offsetHeight >
          this.$refs.scroll.$el.offsetHeight - 50 &&
        !this.loading &&
        !this.noMore
      ) {
        this.current += 1;
        this.getList();
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
      column.value = value;
      // 如果是label 但是他的字典没开启
      if (comp.compType === 15 && !comp.enableDict) {
        comp.dataSource.dictObj = null;
      }
      console.log(comp);
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
      return [column];
    },
    getSearchList() {
      this.current = 1;
      this.noMore = false;
      this.loading = false;
      this.getList(true);
    },
    getList(isSearch = false) {
      this.loading = true;
      this.$emit('getListParams', async (params) => {
        const obj = {
          ...params,
          current: this.current,
          size: this.size,
          headerSearch: {},
          groupContent: '',
          groupBy: `${
            this.configData.dataSource.alias ||
            this.configData.dataSource.tableName
          }.${this.configData.dataSource.columnName}`,
        };
        if (this.keyword) {
          const arr = this.createColumn(this.configData, this.keyword);
          obj.headerSearch = {
            columnsInfo: arr,
          };
        }
        obj.groupContent = `${
          this.configData.dataSource.mainTableInfo.tableName
        }.${this.configData.dataSource.mainColumnInfo.columnName} '${
          this.configData.compId
        }',${
          this.configData.dataSource.alias ||
          this.configData.dataSource.tableName
        }.${this.configData.dataSource.columnName} '${
          this.configData.compId
        }_'`;
        const res = await getSidebarPage(obj);
        if (isSearch) {
          this.resArr = res.records;
          if (this.keyword) {
            this.showSearch = true;
          } else {
            this.showSearch = false;
          }
        } else {
          this.resArr.push(...res.records);
        }
        this.total = res.total;
        if (res.records.length < this.size) {
          this.noMore = true;
        }
        this.loading = false;
      });
    },
  },
  watch: {
    selectArr(v) {
      this.$emit('update:startValue', v.join('$'));
    },
  },
  beforeDestroy() {
    // 统一在menu里面注销
    if (this.$refs.searchList) {
      this.$refs.searchList.removeEventListener(
        'scroll',
        throttle(this.scrollThing),
      );
    }
  },
};
</script>

<style lang="scss" scoped>
.dataSelect {
  display: flex;
  flex-direction: column;
  &__search {
    width: 100%;
    margin-bottom: 12px;
  }
  &__line {
    height: 1px;
    background-color: #e9e9e9;
  }
  &__box {
    max-height: 280px;
    overflow-y: auto;
  }
  &__tip {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 36px;
    padding-left: 10px;
    span {
      color: $--color-primary;
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
