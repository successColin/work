<template>
  <div
    class="searchCondition formButton"
    :id="configData.compId"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <section class="searchCondition__box" v-if="!isConfig">
      <div
        class="searchCondition__btn searchCondition__btnSx"
        v-if="showHigh"
        :class="[{ 'm-r-8': !configData.hisSearch }]"
      >
        <apiot-button
          class="searchCondition__btnSx--btn"
          :class="[
            { isActive: activeType === 2 },
            { noHis: !configData.hisSearch },
          ]"
          slot="reference"
          @click="visible1 = true"
        >
          <i
            class="iconfont icon-shaixuan m-r-4"
            v-if="[2, 3].includes(configData.highStyle)"
          ></i
          ><span v-if="[1, 2].includes(configData.highStyle)">高级筛选</span>
        </apiot-button>
      </div>

      <el-popover
        v-if="configData.shouldHigh && configData.hisSearch"
        placement="bottom"
        trigger="click"
        :visible-arrow="false"
        v-model="visible2"
        class="searchCondition__btn searchCondition__btnHis m-r-8"
        popper-class="noPadding"
        @show="listSearchRecords"
      >
        <div class="searchCondition__his">
          <header class="searchCondition__his--header">筛选历史记录</header>
          <div class="searchCondition__his--body">
            <ul
              class="searchCondition__his--ul"
              :class="[{ apiotNoData: hisArr.length === 0 }]"
            >
              <li
                class="searchCondition__his--li"
                v-for="(his, index) in hisArr"
                @click="hisClick(his)"
                :key="index"
              >
                <div class="searchCondition__his--liHead m-b-10">
                  <span
                    class="searchCondition__his--headName"
                    :class="[{ edit: editIndex === index }]"
                  >
                    {{ his.searchTitle }}
                    <el-tooltip class="item" effect="dark" content="编辑名称">
                      <i
                        class="iconfont icon-bianji"
                        @click.stop="showEdit(index)"
                      ></i>
                    </el-tooltip>
                  </span>
                  <span
                    class="searchCondition__his--nameEdit"
                    v-show="editIndex === index"
                  >
                    <apiot-input
                      :ref="`input_${index}`"
                      v-model="his.searchTitle"
                      :maxlength="10"
                      @click.stop.native
                      @focus="backName(his)"
                      @blur="updateName(his)"
                    ></apiot-input>
                  </span>
                  <span class="searchCondition__his--headTime">{{
                    his.createTime.slice(0, -3)
                  }}</span>
                  <span
                    class="searchCondition__his--headIcon"
                    :class="[{ iconDec: activeHisIndex === index }]"
                    @click.stop="changeActiveHisIndex(index)"
                  >
                    <i class="iconfont icon-dingbugengduoyincang"></i>
                  </span>
                </div>
                <div
                  class="searchCondition__his--liBody"
                  v-show="activeHisIndex === index"
                >
                  <p
                    class="searchCondition__his--p"
                    v-for="(row, i) in his.searchContent.columnsInfo"
                    :key="i"
                  >
                    <span
                      class="searchCondition__his--left"
                      :title="row.showValue || row.value"
                    >
                      <span class="searchCondition__his--name">
                        {{ row.keyName }}：
                      </span>
                      <span
                        class="searchCondition__his--value"
                        v-if="row.showValue"
                      >
                        <apiot-tag
                          ref="tag"
                          class="m-r-4"
                          style="margin-bottom: 0"
                          :closable="false"
                          :itemTheme="3"
                          v-for="(item, index) in row.showValue.split(',')"
                          :key="index"
                          :item="item"
                        ></apiot-tag>
                      </span>
                      <span
                        class="searchCondition__his--value"
                        v-if="!row.showValue && row.value"
                      >
                        {{ row.value }}
                      </span>
                    </span>
                    <span class="searchCondition__his--right">{{
                      row.lambdaLable || row.lambda
                    }}</span>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <apiot-button
          class="searchCondition__btnHis--btn"
          slot="reference"
          :class="[{ hasTag: activeHisName }]"
        >
          <i class="iconfont icon-dingbugengduoyincang"></i>
          <span class="searchCondition__btnHis--tag" v-if="activeHisName">
            {{ activeHisName }}
            <i class="iconfont icon-guanbi" @click.stop="clearHigh"></i>
          </span>
        </apiot-button>
      </el-popover>

      <condition-input
        class="searchCondition__input"
        :selectArr="configData.searchCompArr"
        :selectValue.sync="selectValue"
        v-model="keywords"
        :showPre="isSidebar ? true : isTree"
        @getList="getList"
        :placeholder="configData.placeholder"
      ></condition-input>
    </section>
    <section class="searchCondition__box" v-else>
      <SearchInput style="width: 80px" placeholder="搜索"></SearchInput>
    </section>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      :delHid="!isSelect"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
      :curCompType="curCompType"
    ></config-manage>
    <apiot-dialog
      class="highSearch"
      :visible.sync="visible1"
      title="高级筛选"
      :isShowFooter="false"
    >
      <div class="searchCondition__high">
        <!-- <header class="searchCondition__high--header"></header> -->
        <el-form
          ref="form"
          class="searchCondition__high--body"
          :model="form"
          label-width="80px"
          label-position="top"
        >
          <HighSearchComp
            ref="highComp"
            class="m-b-10"
            :form="form"
            v-for="comp in highCompArr"
            :key="comp.compId"
            :configData="comp"
            :grandFather="grandFather"
          ></HighSearchComp>
        </el-form>
        <footer class="searchCondition__high--footer">
          <apiot-button style="margin-left: auto" @click="clearHigh"
            >清空</apiot-button
          >
          <apiot-button @click="visible1 = false">取消</apiot-button>
          <apiot-button type="primary" @click="highSearchSure"
            >确定</apiot-button
          >
        </footer>
      </div>
    </apiot-dialog>
  </div>
</template>

<script>
import { insertSearchRecords, listSearchRecords, updateSearchTitle } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  props: {
    isSidebar: {
      type: Boolean,
      default: false
    },
    // 功能区
    featureArr: {
      type: [Object, Array]
    },
    // 全部的
    tableInfo: {
      type: Object
    }
  },
  data() {
    return {
      curCompType: 3,
      selectValue: '', // 下拉得值
      keywords: '', // 关键字
      visible1: false,
      visible2: false,
      form: null, // 表单所有数据
      highCompArr: [], // 高级筛选组件
      hisArr: [],
      activeType: 1, // 1 是普通搜索，2 是高级搜索 ，3 是历史搜索
      activeHisIndex: -1,
      editIndex: -1,
      timer: null,
      activeHisName: ''
    };
  },
  mixins: [compMixin],

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
    showHigh() {
      if (this.isConfig) {
        return this.configData.shouldHigh;
      }
      return this.configData.shouldHigh && this.form;
    }
  },

  mounted() {
    if (!this.isConfig) {
      this.initHighForm();
      if (this.configData.shouldHigh && this.configData.hisSearch) {
        this.listSearchRecords();
      }
    }
  },

  methods: {
    // 初始化高级筛选的form
    initHighForm() {
      if (this.configData.highCompArr) {
        const form = {};
        const highCompArr = [];
        this.configData.highCompArr.forEach((comp) => {
          form[comp.value] = '';
          form[`${comp.value}_`] = '';
          form[`${comp.value}_lambda`] = '=';
          form[`${comp.value}_lambdaLabel`] = '是';
          if (comp.compType === 2) {
            if (comp.dropDownType !== 1) {
              form[comp.value] = [];
            }
          }
          if ([4].includes(comp.compType)) {
            form[comp.value] = [];
          }
          const curComp = this.getComp(comp.value);
          if (curComp) {
            if (comp.panelObj && comp.panelObj.id) {
              curComp.panelObj = comp.panelObj;
            }
            highCompArr.push(curComp);
          }
        });
        this.form = form;
        this.highCompArr = highCompArr;
        // console.log(this.form);
      }
      if (this.configData.searchCompArr && this.configData.searchCompArr.length !== 0) {
        const arr = [];
        const idsArr = [];
        this.configData.searchCompArr.forEach((comp) => {
          const curComp = this.getComp(comp.value);
          if (curComp && !idsArr.includes(comp.value)) {
            idsArr.push(comp.value);
            arr.push(comp);
          }
        });
        this.configData.searchCompArr = arr;
      } else {
        const arr = [];
        const idsArr = [];
        this.featureArr.children.forEach((comp) => {
          // console.log(comp.showTreeText, this.isTree);
          if (
            comp.compType &&
            comp.dataSource.columnName !== 'id' &&
            !idsArr.includes(comp.compId)
          ) {
            // 树的进行显示的过滤
            if (this.isTree) {
              if (!comp.showTreeText) {
                return;
              }
            }
            idsArr.push(comp.compId);
            arr.push({
              name: comp.name,
              value: comp.compId
            });
          }
        });
        this.configData.searchCompArr = arr;
        // console.log(arr);
      }
    },
    // 找到对应的组件
    getComp(compId) {
      const index = this.featureArr.children.findIndex((comp) => comp.compId === compId);
      if (index !== -1) {
        return this.featureArr.children[index];
      }
      return '';
    },
    // 生成搜索结构
    createColumn(comp, flag) {
      // flag 1 普通搜索 flag 2 高级搜索
      const column = {
        dict: 2,
        lambda: 'in',
        name: '',
        value: '',
        compId: ''
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
        if (flag === 2 && this.form[comp.compId]) {
          column.value = this.form[comp.compId].join();
        }
      }

      // lambda的处理
      if (flag === 2) {
        column.lambda = this.form[`${comp.compId}_lambda`];
        column.lambdaLable = this.form[`${comp.compId}_lambdaLabel`];
      }

      // 字段名的处理
      column.name = `${comp.dataSource.tableName}.${comp.dataSource.columnName}`;
      if (comp.dataSource.alias) {
        column.name = `${comp.dataSource.alias}.${comp.dataSource.columnName}`;
      }
      // if (comp.compType === 7 || (comp.compType === 15 && comp.enableMultiColumn)) {
      //   column.name = `${comp.multiTable.table.tableName}.${comp.multiTable.column.columnName}`;
      // }

      column.compId = comp.compId;
      if (comp.compType === 6 || comp.compType === 7) {
        column.compId = `${comp.compId}_`;
      }

      if (flag === 2) {
        // console.log(comp);
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
    // 获取数据
    getList(flag) {
      if (flag === 2) {
        return;
      }
      // console.log(this.tableInfo);
      const searchInfo = {
        searchValue: '',
        searchColumnName: '',
        columnsInfo: []
      };
      searchInfo.searchValue = this.keywords;
      if (this.selectValue) {
        const comp = this.getComp(this.selectValue);
        // console.log(comp);
        searchInfo.searchColumnName = comp.compId;
        if (comp.compType === 6 || comp.compType === 7) {
          searchInfo.searchColumnName = `${comp.compId}_`;
        }
        searchInfo.columnsInfo.push(...this.createColumn(comp, 1));
      } else {
        searchInfo.searchColumnName = 'ALL';
        this.configData.searchCompArr.forEach((obj) => {
          const comp = this.getComp(obj.value);
          searchInfo.columnsInfo.push(...this.createColumn(comp, 1));
        });
      }
      // console.log(searchInfo);
      this.activeType = 1;
      this.activeHisName = '';
      if (this.keywords) {
        this.tableInfo.searchInfo = searchInfo;
      } else {
        this.tableInfo.searchInfo = null;
      }
      this.$bus.$emit('reloadArea', 'searchCurrent', this.onlyFlag(), this.tableInfo.compId);
    },
    // 清空高级搜索
    clearHigh() {
      this.initHighForm();
      this.$nextTick(() => {
        this.activeType = 1;
        this.activeHisName = '';
        this.keywords = '';
        // const searchInfo = {
        //   searchValue: '',
        //   columnsInfo: []
        // };
        this.tableInfo.searchInfo = '';
        if (this.$refs.highComp) {
          this.$refs.highComp.forEach((vm) => {
            vm.initComp();
          });
        }

        this.$bus.$emit('reloadArea', 'searchCurrent', this.onlyFlag(), this.tableInfo.compId);
      });
    },
    // 高级搜索确认
    highSearchSure() {
      this.keywords = '';
      // console.log(this.form);
      const searchInfo = {
        searchValue: '',
        columnsInfo: []
      };
      this.highCompArr.forEach((comp) => {
        searchInfo.columnsInfo.push(...this.createColumn(comp, 2));
      });
      // console.log(searchInfo);
      this.visible1 = false;
      this.activeType = 2;
      this.tableInfo.searchInfo = searchInfo;
      if (searchInfo.columnsInfo.length !== 0) {
        this.insertSearchRecords(searchInfo);
      } else {
        this.activeType = 1;
        if (!searchInfo.searchValue) {
          this.tableInfo.searchInfo = null;
        }
      }
      this.activeHisName = '';
      if (this.tableInfo.searchInfo) {
        this.$bus.$emit('reloadArea', 'searchCurrent', this.onlyFlag(), this.tableInfo.compId);
      }
    },
    // 新增高级搜索历史
    async insertSearchRecords(searchInfo) {
      if (searchInfo && searchInfo.columnsInfo.length) {
        await insertSearchRecords({
          searchTitle: `筛选(包含${searchInfo.columnsInfo.length}个条件)`,
          searchCompId: this.configData.compId,
          searchContent: JSON.stringify(searchInfo),
          sysMenuDesignId: this.sysMenuDesignId(),
          userId: this.$store.state.userCenter.userInfo.id
        });
      }
    },
    // 查询高级搜索历史
    async listSearchRecords() {
      const data = await listSearchRecords({
        searchCompId: this.configData.compId,
        sysMenuDesignId: this.sysMenuDesignId()
      });
      // console.log(data);
      data.forEach((his) => {
        his.searchContent = JSON.parse(his.searchContent);
      });
      this.hisArr = data;
    },
    // 更改激活的历史
    changeActiveHisIndex(i) {
      if (this.activeHisIndex === i) {
        this.activeHisIndex = -1;
      } else {
        this.activeHisIndex = i;
      }
    },
    // 展示编辑框
    showEdit(index) {
      this.editIndex = index;
      this.$nextTick(() => {
        this.$refs[`input_${index}`][0].focus();
      });
    },
    // 备份名称
    backName(his) {
      clearTimeout(this.timer);
      his.backName = his.searchTitle;
    },
    // 更新名称
    updateName(his) {
      if (his.searchTitle) {
        updateSearchTitle({
          id: his.id,
          searchTitle: his.searchTitle
        });
        this.timer = setTimeout(() => {
          this.editIndex = -1;
        }, 200);
      } else {
        his.searchTitle = his.backName;
      }
    },
    // 搜索历史点击
    hisClick(his) {
      // 编辑名称状态
      if (this.editIndex !== -1) {
        return;
      }
      // 处理已经不存在的组件
      const { searchContent } = his;
      searchContent.columnsInfo.reduceRight((total, column, index) => {
        if (column.compId) {
          const compId =
            column.compId.indexOf('_') === -1 ? column.compId : column.compId.slice(0, -1);
          const curComp = this.getComp(compId);
          if (!curComp) {
            searchContent.columnsInfo.splice(index, 1);
          }
        }

        return total;
      }, 0);
      this.visible2 = false;
      this.activeType = 3;
      this.activeHisName = his.searchTitle;
      this.tableInfo.searchInfo = searchContent;
      this.$bus.$emit('reloadArea', 'searchCurrent', this.onlyFlag(), this.tableInfo.compId);
    }
  },

  watch: {
    keywords: {
      handler(v) {
        if (!v) {
          this.tableInfo.searchInfo = null;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
.searchCondition {
  height: 30px;
  position: relative;
  margin-left: 10px;
  max-width: 100%;
  &__box {
    display: flex;
  }
  &__input {
    max-width: 100%;
  }

  &__btn {
    position: relative;
    &:hover {
      z-index: 1;
    }
  }
  &__btnSx {
    &--btn {
      &.noHis {
        border-radius: 4px 4px 4px 4px;
      }
      .iconfont {
        color: $--color-primary;
      }
      border-radius: 4px 0 0 4px;
      &.isActive {
        color: #4689f5;
        border-color: #c8dcfc;
        background-color: #edf3fe;
      }
    }
  }
  &__btnHis {
    margin-left: -1px;
    .iconfont {
      font-size: 16px;
      color: #bbc3cd;
      &:hover {
        color: #4689f6;
      }
    }
    &--btn {
      border-radius: 0 4px 4px 0;
      padding: 0 6px 0 6px;
      &.hasTag {
        background: #e5f0ff;
        padding-right: 4px;
      }
    }
    &--tag {
      height: 22px;
      line-height: 22px;
      border-radius: 4px;
      padding: 0 6px 0 10px;
      margin-right: 2px;
      color: #4689f6;
      .iconfont {
        font-size: 10px;
        color: #bbc3cd;
        margin-left: 2px;
        &:hover {
          color: #4689f6;
        }
      }
    }
  }
  ::v-deep {
    .el-dialog__body {
      padding: 0;
    }
  }
  &__high {
    overflow: auto;
    height: 100%;
    &--header {
      box-sizing: border-box;
      height: 54px;
      line-height: 53px;
      border-bottom: 1px solid #e9e9e9;
      padding-left: 20px;
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
    &--footer {
      padding: 0 20px;
      box-sizing: border-box;
      height: 64px;
      border-top: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
    }
    &--body {
      padding: 10px 20px 0;
      box-sizing: border-box;
      height: calc(100% - 64px);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
  &__his {
    width: 540px;
    max-height: 580px;
    &--header {
      box-sizing: border-box;
      height: 54px;
      line-height: 53px;
      border-bottom: 1px solid #e9e9e9;
      padding-left: 20px;
      font-size: 16px;
      font-weight: 600;
      color: #333333;
    }
    &--body {
      box-sizing: border-box;
      padding-top: 14px;
      padding-bottom: 14px;
      height: calc(100% - 54px);
      overflow-x: hidden;
      overflow-y: auto;
    }
    &--ul {
      // border-left: 1px solid #e9e9e9;
      // padding-left: 14px;
      margin: 0 20px;
      &.apiotNoData {
        min-height: 180px;
        margin: 0;
        opacity: 1 !important;
      }
    }
    &--li {
      // height: 156px;
      position: relative;
      margin-bottom: 4px;
      padding: 0px 10px;
      cursor: pointer;
      &:hover {
        background-color: #f6f6f8;
        border-radius: 4px;
        .iconfont {
          color: $--color-primary;
        }
        .searchCondition__his--headIcon {
          visibility: visible;
        }
        .icon-bianji {
          visibility: visible;
        }
      }
      // &:before {
      //   content: '';
      //   position: absolute;
      //   left: -20px;
      //   top: 6px;
      //   width: 10px;
      //   height: 10px;
      //   border-radius: 50%;
      //   background-color: $--color-primary;
      // }
      // &:after {
      //   content: '';
      //   position: absolute;
      //   left: -17px;
      //   top: 9px;
      //   width: 4px;
      //   height: 4px;
      //   border-radius: 50%;
      //   background-color: #fff;
      // }
    }
    &--liHead {
      font-size: 13px;
      height: 36px;
      font-weight: 400;
      color: #666666;
      display: flex;
      align-items: center;
      font-size: 13px;
      .iconfont {
        color: #bbc3cd;
        font-size: 16px;
      }
    }
    &--headName {
      font-weight: 600;
      color: #333333;
      flex: 1;
      line-height: 20px;
      &.edit {
        color: #fff;
      }
      .iconfont {
        visibility: hidden;
        font-weight: normal;
        vertical-align: top;
        display: inline-block;
        font-size: 16px;
        color: #bbc3cd;
        height: 100%;
        width: 20px;
        &:hover {
          color: $--color-primary;
        }
      }
    }
    &--nameEdit {
      position: absolute;
      left: 0;
    }
    &--headTime {
      font-weight: 400;
      color: #666;
      width: 140px;
      margin-right: 6px;
    }
    &--headIcon {
      visibility: hidden;
      transition: all 0.2s;
      &.iconDec {
        transform: rotate(180deg);
      }
    }
    &--liBody {
      // border: 1px solid #e9e9e9;
      // padding: 13px 10px;
      cursor: pointer;
      padding-bottom: 12px;
    }
    &--p {
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 400;
      line-height: 30px;
    }
    &--left {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &--name {
      color: #808080;
    }
    &--value {
      color: #333;
    }
    &--right {
      width: 70px;
      margin-left: 10px;
      text-align: center;
      color: #aaaaaa;
    }
  }
}
.highSearch {
  ::v-deep {
    & > .el-dialog {
      height: 540px;
      .el-dialog__body {
        padding-top: 0;
        height: calc(100% - 54px);
      }
    }
  }
}
</style>
<style lang='scss'>
.noPadding {
  padding: 0 !important;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.14) !important;
  border-radius: 8px !important;
}
</style>
