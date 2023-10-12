<!--
 * @Author: sss
 * @Date: 2022-03-14 10:35:01
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-14 10:35:01
 * @Desc: 配置菜单-搜索功能
-->
<template>
  <apiot-input-search
    ref="search"
    :serachClass="serachClass"
    :placeholder="placeholder"
    :searchPorpArr="searchPorpArr"
    :searchFlag="featureArr.compId"
    :isFilter="searchComp.shouldHigh && searchComp.highCompArr.length > 0"
    :filterActivity="JSON.stringify(form) !== '{}'"
    :filterType="searchComp.highStyle"
    :enableScan="enableScan"
    :showDownSelect="showDownSelect"
    @clickFilter="gotoFilter"
    @search="handleSearch"
    @clearSearchBox="clearSearch"
  >
    <template slot="searchRight">
      <div class="switchBtn" v-if="canShowSwitch">
        <p
          :class="[
            currentShowType === 1
              ? `activited themeColor__bg-${getThemeIndex}`
              : '',
          ]"
          @click="switchType(1)"
        >
          <i class="appIcon appIcon-liebiaozhanshi"></i>
        </p>
        <p
          :class="[
            currentShowType === 2
              ? `activited themeColor__bg-${getThemeIndex}`
              : '',
          ]"
          @click="switchType(2)"
        >
          <i class="appIcon appIcon-shuzhanshi"></i>
        </p>
      </div>
    </template>
    <template slot="searchBttom" v-if="convenientComp.length > 0">
      <view @click.stop="">
        <ConvenientSel
          ref="ConvenientSel"
          :convenientComp="convenientComp"
          :elementList="featureArr.children"
          @change="handleConvenient"
        ></ConvenientSel>
      </view>
    </template>
  </apiot-input-search>
</template>

<script>
import ConvenientSel from './components/ConvenientSel.vue';

export default {
  components: { ConvenientSel },

  inject: [
    'sysMenuDesignId',
    'getPanel',
    'getAllForm',
    'getJumpMenu',
    'getMenuFlag',
    'getMenuPane'
  ],

  props: {
    convenientComp: {
      type: Array,
      default() {
        return [];
      }
    },
    serachClass: String,
    funcConfig: Object,
    // 功能区
    featureArr: {
      type: [Object, Array]
    },
    canShowSwitch: {
      type: Boolean,
      default: false
    },
    showType: {
      type: Number,
      default: 1
    },
    placeholder: String,
    // 是否显示扫描功能
    enableScan: Boolean,
    // 是否显示下拉选择搜索列
    showDownSelect: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      scrollLeft: 0,
      form: {}, // 表单所有数据
      keywords: '',
      flag: null, // 该控件唯一标识
      currentShowType: 1 // 1=列表；2=树
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 搜索控件
    searchComp() {
      const { funcConfig } = this;
      const { children } = funcConfig;
      const btnArea = children.find((item) => item.areaType === 2) || { children: [] };
      return btnArea.children.find((el) => el.compName === 'SearchCondition');
    },
    // 下拉框中的内容
    searchCompArr() {
      const { searchCompArr } = this.searchComp;
      const arry = [...searchCompArr];
      if (arry.length === 0) {
        const { children } = this.featureArr;
        children.forEach((comp) => {
          if (comp.name !== 'id' && comp.name !== 'dataType') arry.push({ name: comp.name, value: comp.compId });
        });
      }

      return arry;
    },
    // 便捷搜索下拉框
    searchPorpArr() {
      const { searchCompArr } = this;
      const arry = [...searchCompArr];
      if (arry && arry.length > 0) arry.unshift({ name: '全部', value: '' });
      return arry;
    }
  },

  methods: {
    switchType(type) {
      this.currentShowType = type;
      this.$emit('switchType', type);
    },
    handleConvenient(e) {
      // 清空便捷搜索框的值
      this.$refs.search.searchParams = null;
      const headerSearch = {
        columnsInfo: []
      };
      e.forEach((comp) => {
        headerSearch.columnsInfo.push(...this.createColumn(comp, 3, comp.value));
      });
      this.$emit('headerSearch', headerSearch);
    },
    // 获取高级赛选值
    getHighValue(e) {
      // 清空便捷搜索框的值
      this.$refs.search.searchParams = null;
      const searchInfo = {
        columnsInfo: []
      };
      this.form = e.form;
      Object.keys(this.form).forEach((key) => {
        const comp = this.getComp(key);
        const v = this.form[comp.compId];
        if (!comp || !v) return;
        searchInfo.columnsInfo.push(...this.createColumn(comp, 2));
      });
      this.$emit('filter', searchInfo);
      if (this.$refs.ConvenientSel) this.$refs.ConvenientSel.clear();
    },
    // 跳转至配置界面的高级筛选界面
    gotoFilter() {
      const { highCompArr, hisSearch } = this.searchComp;
      const featureArr = {
        children: [],
        form: {},
        funcConfig: this.funcConfig,
        sysMenuDesignId: this.sysMenuDesignId(),
        menuPaneObj: this.getPanel(),
        menuJumpObj: this.getJumpMenu(),
        menuFlag: this.getMenuFlag(),
        menuPane: this.getMenuPane()
      };
      highCompArr.forEach((el) => {
        const comp = this.getComp(el.value);
        featureArr.children.push(comp);
        featureArr.form[`${comp.compId}`] = this.form[`${comp.compId}`] || '';
        if (comp.compType === 6 || comp.compType === 7) {
          featureArr.form[`${comp.compId}_`] = this.form[`${comp.compId}_`] || '';
        }

        const { panelObj } = el;
        if (panelObj.id) {
          featureArr.menuPaneObj[el.value] = panelObj;
        }
      });
      this.$store.commit('setMunuHighSearch', featureArr);

      uni.navigateTo({
        url: `/menuConfigure/highSearch?flag=${this.flag}&highSearchFlag=${
          this.featureArr.compId
        }&hisSearch=${hisSearch ? 1 : 0}`
      });
    },
    // 找到对应的组件
    getComp(compId) {
      const { children } = this.featureArr;
      const index = children.findIndex((comp) => comp.compId === compId);
      if (index !== -1) {
        const el = children[index];
        return { ...el };
      }
      return '';
    },
    // 生成搜索结构
    createColumn(comp, flag, value = '') {
      if (comp.compName === 'BtnsArea') return [];
      // flag 1 普通搜索 flag 2 高级搜索; 3 便捷搜索
      let column = {
        dict: 2,
        lambda: 'in',
        name: '',
        value,
        compId: '',
        userComp: 2,
        columnType: comp.dataSource.columnTypeDict
      };
      if (flag === 3) {
        column = {
          dict: 2,
          lambda: 'LIKE',
          name: '',
          value,
          compId: '',
          columnType: comp.dataSource.columnTypeDict
        };
      }
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
      if (comp.compType === 6 && comp.dataSource.mainColumnInfo) {
        column.columnType = comp.dataSource.mainColumnInfo.columnTypeDict;
      }
      if (comp.compType === 7) {
        column.columnType = comp.multiTable.column.columnTypeDict;
      }
      if (comp.compType === 28) {
        comp.compType = 7;
        column.userComp = 1;
      }
      // 一般处理赋值
      if (flag === 2) {
        column.value = this.form[comp.compId];
      }
      // 如果是label 但是他的字典没开启
      if (comp.compType === 15 && !comp.enableDict) {
        comp.dataSource.dictObj = null;
      }

      // 值的处理 字典的处理
      if (comp.dataSource.dictObj) {
        column.dict = 1;
        if (flag === 1) {
          const dictData = this.$store.getters.getCurDict(comp.dataSource.dictObj.dictKey);
          const valueArr = [];
          dictData.forEach((dict) => {
            const i = dict.name.indexOf(this.keywords);
            if (i !== -1 && this.keywords) {
              valueArr.push(dict.value);
            }
          });
          column.value = valueArr.join();
        }
      }

      // lambda的处理
      if (flag === 2 && column.userComp !== 1) {
        column.lambda = this.form[`${comp.compId}_lambda`];
        column.lambdaLable = this.form[`${comp.compId}_lambdaLabel`];
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

      if (flag === 2) {
        if (comp.compType === 6) {
          column.name = `${comp.dataSource.mainTableInfo.tableName}.${comp.dataSource.mainColumnInfo.columnName}`;
        }
      }
      // 高级筛选时间的拆分处理
      if (flag === 2 && this.form[comp.compId][0] && this.form[comp.compId][0]) {
        if (comp.compType === 8 || comp.compType === 9) {
          let timeArr = [
            {
              dict: 2,
              lambda: '>=',
              name: column.name,
              value: this.form[comp.compId][1],
              keyName: comp.name,
              compId: comp.compId
            },
            {
              dict: 2,
              lambda: '<=',
              name: column.name,
              value: this.form[comp.compId][0],
              keyName: comp.name,
              compId: comp.compId
            }
          ];
          if (column.lambda === 'IN') {
            timeArr = [
              {
                dict: 2,
                lambda: '>=',
                name: column.name,
                value: this.form[comp.compId][0],
                keyName: comp.name,
                compId: comp.compId
              },
              {
                dict: 2,
                lambda: '<=',
                name: column.name,
                value: this.form[comp.compId][1],
                keyName: comp.name,
                compId: comp.compId
              }
            ];
          }

          return timeArr;
        }
      }

      if (flag === 2) {
        if (!column.value) {
          return [];
        }
        // 显示的名称
        column.keyName = comp.name;
        // 值得反写显示名称
        if (this.form[`${comp.compId}_`]) {
          column.showValue = this.form[`${comp.compId}_`];
        }
        // 标记数据多选
        if (comp.compType === 7) {
          column.multiple = 1;
        }
      }
      return [column];
    },
    // 处理搜索条件
    handleSearch(e) {
      const { downParam = {}, keyword } = e;
      const searchInfo = {
        searchValue: '',
        searchColumnName: '',
        columnsInfo: []
      };
      searchInfo.searchValue = keyword;
      this.keywords = keyword;
      // 如果值为空
      if (!keyword) {
        this.clearSearch();
        return;
      }
      const selectValue = downParam.value;
      if (selectValue) {
        const comp = this.getComp(selectValue);
        searchInfo.searchColumnName = comp.compId;
        if (comp.compType === 6 || comp.compType === 7) {
          searchInfo.searchColumnName = `${comp.compId}_`;
        }
        searchInfo.columnsInfo.push(...this.createColumn(comp, 1));
      } else {
        searchInfo.searchColumnName = 'ALL';
        this.searchCompArr.forEach((obj) => {
          const comp = this.getComp(obj.value);
          searchInfo.columnsInfo.push(...this.createColumn(comp, 1));
        });
      }
      this.$emit('search', searchInfo);
      if (this.$refs.ConvenientSel) this.$refs.ConvenientSel.clear();
    },
    clearSearch() {
      this.$emit('search', {});
      if (this.$refs.ConvenientSel) this.$refs.ConvenientSel.clear();
    }
  },

  mounted() {},

  created() {
    if (this.searchComp.shouldHigh) {
      this.flag = `configMenuFilter${this._uid}`;
      this.$bus.$on(this.flag, this.getHighValue);
    }
    this.currentShowType = this.showType;
  },

  beforeDestroy() {
    this.$bus.$off(this.flag);
  }
};
</script>

<style lang='scss' scoped>
.switchBtn {
  border-radius: 6rpx;
  background: #f1f7ff;
  p {
    display: inline-block;
    padding: 6rpx 14rpx;
    color: #bbc3cd;
    &.activited {
      border-radius: 6rpx;
      color: #ffffff;
    }
  }
  .appIcon {
    font-size: 38rpx;
  }
}
</style>
