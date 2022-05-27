<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ isBtnArea ? '按钮区' : '表单区' }}</h1>
    </header>
    <section class="contentConfig__wrapper" v-if="!isBtnArea">
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          显示标题
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showTitle"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box contentConfig__areaShow">
        <h2>区域展示</h2>
        <ul class="contentConfig__areaShow--box">
          <li
            class="contentConfig__areaShow--item"
            v-for="(item, index) in areaArr"
            :class="[
              {
                active: item.pageType === getCurPageType,
              },
            ]"
            :key="index"
            @click.stop="changeActive(index)"
          >
            <img
              :src="
                require(`@/assets/img/menu_images/displayType/${item.imgUrl}`)
              "
            />
            <p>
              {{ item.name }}
            </p>
          </li>
        </ul>
      </div>
      <div
        class="contentConfig__box contentConfig__dataSource"
        v-if="$route.query.isApp === '1'"
      >
        <h2>布局样式</h2>
        <el-select
          placeholder="请选择布局样式"
          v-model="getCurrentTab.layoutStyle"
          class="contentConfig__dataSource--select"
        >
          <el-option label="上下布局" :value="1"></el-option>
          <el-option label="左右布局" :value="2"></el-option>
        </el-select>
      </div>
      <div
        class="contentConfig__box contentConfig__dataSource"
        v-if="getCurrentTab.children.length"
      >
        <h2>关联数据源</h2>
        <el-select
          :disabled="true"
          placeholder="请选择数据源"
          :value="1"
          class="contentConfig__dataSource--select"
        >
          <el-option label="数据库" :value="1"></el-option>
        </el-select>
        <h2 class="contentConfig__dataSource--h2">
          业务表<el-tooltip
            content="当业务表被关系关联，或者被组件使用时不允许更改"
            placement="top"
            ><i class="iconfont icon-bangzhu"
          /></el-tooltip>
        </h2>
        <filterable-input
          placeholder="请选择关联表"
          title="关联表"
          :dialogType="1"
          :disabled="canChangeTable"
          :showInfo="getCurrentTab.tableInfo"
          @selectRes="selectTable"
        ></filterable-input>
        <h2 v-if="getCurrentTab && getCurrentTab.tableInfo.tableName">
          关联表
        </h2>
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          style="margin-bottom: 10px"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName"
          @click="
            currentRadioObj = null;
            relateDialog = true;
          "
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>配置关联表
        </apiot-button>
        <br />
        <apiot-button
          class="contentConfig__dataSource--addRelate"
          v-if="getCurrentTab && getCurrentTab.tableInfo.tableName"
          @click="
            currentRadioObj = null;
            filterDialog = true;
          "
        >
          <i class="iconfont icon-shaixuan m-r-4"></i>设置过滤条件
        </apiot-button>
      </div>
      <div class="contentConfig__box contentConfig__hasTab">
        <h2 class="contentConfig__hasTab--switchBox">
          是否初始化
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.shouldInit"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box">
        <h2>之后加载</h2>
        <el-select
          v-model="getCurrentTab.reloadArea"
          multiple
          collapse-tags
          class="contentConfig__select"
        >
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getArea"
            :key="item.compId"
          ></el-option>
        </el-select>
      </div>
    </section>
    <!-- 按钮区 -->
    <BtnsAreaConfig
      v-if="isBtnArea"
      :getBtnsArea="getBtnsArea"
      :isBtnArea="isBtnArea"
    ></BtnsAreaConfig>
    <!-- 配置关联表弹窗 -->
    <RelateTableDialog
      :visible.sync="relateDialog"
      :getCurrentTab="getCurrentTab"
    ></RelateTableDialog>
    <!-- 筛选条件 -->
    <FilterTerm
      :visible.sync="filterDialog"
      v-if="filterDialog"
      :configData="configData"
      :triggerCompMap="triggerCompMap"
      :getCurrentTab="getCurrentTab"
    ></FilterTerm>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import RelateTableDialog from '../ContentConfig/RelateTableDialog';
import BtnsAreaConfig from '../ContentConfig/BtnsAreaConfig';
import FilterTerm from '../ContentConfig/FilterTerm';

export default {
  props: {
    activeObj: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    },
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    // 所有组件平坦化
    getAllcheck: {
      type: Object
    }
  },
  data() {
    return {
      areaArr: [
        {
          name: '全功能区',
          compName: 'MenuMain',
          propertyCompName: 'ContentConfig',
          pageType: 1,
          shouldTab: true,
          imgUrl: 'FullFeatArea.svg',
          compId: 0,
          areaType: 1,
          tableInfo: {
            tableName: '',
            id: 0,
            nameAlias: ''
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '功能区',
              compId: 0,
              form: {
                id: ''
              },
              rules: {},
              children: [],
              areaType: 1
            }
          ]
        },
        {
          name: '按钮功能区',
          compName: 'MenuMain',
          propertyCompName: 'ContentConfig',
          pageType: 2,
          shouldTab: true,
          imgUrl: 'BtnsFeatArea.svg',
          compId: 0,
          areaType: 1,
          tableInfo: {
            tableName: '',
            id: 0,
            nameAlias: ''
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '按钮区',
              compId: 0,
              children: [],
              areaType: 2,
              rightIndex: 0,
              appSort: 1, // 按钮区排列
              appStyle: 1 // 按钮区风格
            },
            {
              name: '功能区',
              compId: 0,
              form: {
                id: ''
              },
              rules: {},
              children: [],
              areaType: 1
            }
          ]
        },
        {
          name: '功能按钮区',
          compName: 'MenuMain',
          propertyCompName: 'ContentConfig',
          pageType: 3,
          shouldTab: true,
          imgUrl: 'FeatBtnsArea.svg',
          compId: 0,
          areaType: 1,
          tableInfo: {
            tableName: '',
            id: 0,
            nameAlias: ''
          },
          relateTableArr: [],
          relateTableIndex: 0,
          children: [
            {
              name: '功能区',
              compId: 0,
              form: {
                id: ''
              },
              rules: {},
              children: [],
              areaType: 1
            },
            {
              name: '按钮区',
              compId: 0,
              children: [],
              areaType: 2,
              rightIndex: 0,
              appSort: 1, // 按钮区排列
              appStyle: 1 // 按钮区风格
            }
          ]
        }
      ],
      relateDialog: false,
      dialogVisible: false,
      filterDialog: false,
      currentRadioObj: null
    };
  },

  components: {
    RelateTableDialog,
    BtnsAreaConfig,
    FilterTerm
  },

  computed: {
    // 获取当前页面的类型
    getCurPageType() {
      if (this.getCurrentTab) {
        return this.getCurrentTab.pageType;
      }
      return -1;
    },
    // 获取当前的tab
    getCurrentTab() {
      return this.activeObj;
    },
    // 是否可以更改主表
    canChangeTable() {
      let flag = false;
      // 默认有一个id组件
      if (!this.getCurrentTab.children.length) {
        return flag;
      }
      if (this.getCurrentTab.relateTableArr.length) {
        flag = true;
      } else {
        this.getCurrentTab.children.forEach((child) => {
          child.children.forEach((comp) => {
            if (
              comp.dataSource &&
              comp.dataSource.relateName === '主表' &&
              comp.dataSource.tableName &&
              comp.dataSource.columnName !== 'id'
            ) {
              flag = true;
            }
          });
        });
      }
      return flag;
    },
    // 是不是按钮区
    isBtnArea() {
      return this.activeObj.shouldTab && this.activeObj.areaType === 2;
    },
    // 获取按钮数组
    getBtnsArea() {
      if (this.activeObj.children.length) {
        const index = this.activeObj.children.findIndex((child) => child.areaType === 2);
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {
        children: []
      };
    },
    // 获取所有的区域
    getArea() {
      const curInfo = [];
      const keys = Object.keys(this.getAllcheck);
      keys.forEach((key) => {
        const curComp = this.getAllcheck[key];
        if (curComp.compType === 'AREA' && this.activeObj.compId !== curComp.compId) {
          curInfo.push(curComp);
        }
      });
      return curInfo;
    }
  },

  mounted() {
    this.resetReloadArea();
  },

  methods: {
    // 重置触发的区域
    resetReloadArea() {
      const arr = [];
      this.getArea.forEach((comp) => {
        if (this.getCurrentTab.reloadArea.includes(comp.compId)) {
          arr.push(comp.compId);
        }
      });
      this.getCurrentTab.reloadArea = arr;
    },
    // 选中表格
    selectTable(table) {
      // console.log(table);
      this.getCurrentTab.tableInfo.tableName = table.tableName;
      this.getCurrentTab.tableInfo.id = table.id;
      this.getCurrentTab.tableInfo.nameAlias = table.tableName;
      // 更改id组件的表名
      this.getCurrentTab.children.forEach((child) => {
        child.children.forEach((comp) => {
          // console.log(comp);
          if (
            comp.dataSource &&
            comp.dataSource.relateName === '主表' &&
            comp.dataSource.columnName === 'id'
          ) {
            comp.dataSource.tableName = table.tableName;
          }
        });
      });
    },
    // 更改当前活跃的tab
    changeActive(index) {
      // 判断是否打开tab
      if (this.activeObj.children.length) {
        this.changeChilren(this.activeObj, index);
        // 判断没有打开tab的情况下是否有子节点
      } else {
        this.addTab(index);
      }
    },
    // 切换视图
    async changeChilren(obj, index) {
      const newPageType = index + 1;
      if (obj.pageType === newPageType) {
        return;
      }
      if (obj.pageType !== 1 && newPageType === 1) {
        const i = this.getBtnsArea.children.findIndex((btn) => {
          if (this.hasTriggerComp[btn.compId]) {
            return true;
          }
          return false;
        });
        // console.log(i);
        if (i !== -1) {
          return this.$message({
            type: 'warning',
            message: '该按钮区存在触发器配置，请先删除相关的触发器配置'
          });
        }
        try {
          await this.$confirm('将清空按钮区的内容，是否继续', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          });
        } catch (error) {
          return;
        }
      }
      if (obj.pageType === 1) {
        if (newPageType === 2) {
          obj.children.unshift({
            name: '按钮区',
            compId: createUnique(),
            children: [],
            areaType: 2,
            rightIndex: 0,
            appSort: 1, // 按钮区排列
            appStyle: 1 // 按钮区风格
          });
        } else if (newPageType === 3) {
          obj.children.push({
            name: '按钮区',
            compId: createUnique(),
            children: [],
            areaType: 2,
            rightIndex: 0,
            appSort: 1, // 按钮区排列
            appStyle: 1 // 按钮区风格
          });
        }
      } else if (obj.pageType === 2) {
        if (newPageType === 1) {
          obj.children.shift();
        } else if (newPageType === 3) {
          const temp = obj.children.shift();
          obj.children.push(JSON.parse(JSON.stringify(temp)));
        }
      } else if (obj.pageType === 3) {
        if (newPageType === 2) {
          const temp = obj.children.shift();
          obj.children.push(JSON.parse(JSON.stringify(temp)));
        } else if (newPageType === 1) {
          obj.children.pop();
        }
      }
      obj.pageType = newPageType;
    },
    // 添加tab
    addTab(index) {
      const tempData = JSON.parse(JSON.stringify(this.areaArr[index]));
      tempData.children.forEach((child) => {
        child.compId = createUnique();
      });
      // this.activeObj.curCompId = tempData.compId;
      // tempData.name = `Tab${this.activeObj.children.length + 1}`;
      // if (this.activeObj.children.length === 0) {
      //   this.activeObj.firstShowTabId = tempData.compId;
      // }
      // this.activeObj.children.push(tempData);
      // console.log(index, this.activeObj);
      this.activeObj.pageType = index + 1;
      this.activeObj.children = tempData.children;
    },
    // 是否打开tab切换
    async switchChange() {
      // console.log(this.activeObj.showTab);
      if (this.activeObj.showTab) {
        try {
          await this.$confirm('将关闭除当前tab内容外的其他tab', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          });
          this.activeObj.showTab = false;
        } catch (error) {
          // console.log(error);
        }
      } else {
        try {
          await this.$confirm('将打开tab，若之前未配置tab页，当前配置默认为第一个tab的配置', {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          });
          if (this.activeObj.children.length === 0) {
            this.addTab(1);
          }
          this.activeObj.showTab = true;
        } catch (error) {
          // console.log(error);
        }
      }
    },
    // 切换tab
    changeTab(child) {
      this.activeObj.curCompId = child.compId;
    },
    // 设置名称备注
    setBackName(child) {
      child.backName = child.name;
    },
    // 还原名称备注
    resetBackName(child) {
      if (!child.name) {
        child.name = child.backName;
      }
    }
  },

  watch: {
    filterDialog(v) {
      // console.log(v);
      if (!v) {
        this.$bus.$emit('addHasTriggerComp');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.contentConfig {
  height: 100%;
  &__title {
    height: 46px;
    line-height: 46px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding-left: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
  }
  &__wrapper {
    height: calc(100% - 46px);
    overflow: auto;
  }
  &__box {
    h2 {
      padding-left: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      height: 40px;
      line-height: 40px;
    }
  }
  &__hasTab {
    &--switchBox {
      position: relative;
      ::v-deep {
        .el-switch__label {
          position: absolute;
          margin: 0;
          color: #ffffff !important;
        }
        .el-switch__label--left {
          display: none;
          left: 22px;
          &.is-active {
            display: block;
            z-index: 1;
          }
          span {
            font-size: 12px;
          }
        }
        .el-switch__label--right {
          display: none;
          left: 6px;
          &.is-active {
            display: block;
          }
          span {
            font-size: 12px;
          }
        }
      }
    }
    &--switch {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
    &--list {
      padding: 0 10px;
    }
    &--tab {
      height: 36px;
      display: flex;
      align-items: center;
      margin: 0 10px;
      .iconfont {
        font-size: 16px;
        color: #bbc3cd;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
      .icon-zongxiangtuodong {
        cursor: move;
      }
      .icon-sheweimoren {
        visibility: hidden;
        &.active {
          color: $--color-primary;
          visibility: visible;
        }
      }
      .input {
        width: 148px;
        ::v-deep {
          .el-input__inner {
            height: 28px;
            line-height: 28px;
          }
        }
      }
      &.active,
      &:hover {
        background: $--hover-color;
        .icon-sheweimoren {
          visibility: visible;
        }
      }
    }
    &--addTab {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
  }
  &__select {
    margin-left: 10px;
    width: calc(100% - 20px);
  }
  &__areaShow {
    &--box {
      display: flex;
    }
    &--item {
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      height: 80px;
      width: 80px;
      margin-left: 10px;
      cursor: pointer;
      &:hover,
      &.active {
        background: #fafafa;
        border: 1px solid #e9e9e9;
      }
      img {
        display: block;
        margin: 14px auto 0;
      }
      p {
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }
    }
  }
  &__dataSource {
    padding-left: 10px;
    padding-right: 10px;
    h2 {
      padding-left: 0;
    }
    &--select {
      width: 100%;
    }
    &--h2 {
      display: flex;
      align-items: center;
      .iconfont {
        color: #aaaaaa;
        font-weight: normal;
        margin-left: 5px;
      }
    }
    &--addRelate {
      width: 100%;
      i {
        color: $--color-primary;
      }
    }
  }
}
</style>
