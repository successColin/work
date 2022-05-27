<!--
 * @Descripttion: 故障树
 * @Author: ytx
 * @Date: 2022-02-15 14:39:40
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-15 14:39:40
-->
<template>
  <div class="contentConfig">
    <header class="contentConfig__title">
      <h1>{{ isBtnArea ? '按钮区' : getCurrentTab.name }}</h1>
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
      <div class="contentConfig__box" style="margin: 0 10px">
        <h2 style="padding-left: 0">标题</h2>
        <apiot-input
          v-model="getCurrentTab.name"
          placeholder="请输入标题"
          @focus="nameFocus"
          @blur="nameBlur"
        ></apiot-input>
      </div>
      <div class="contentConfig__box contentConfig__dataSource" v-if="false">
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
          :isTree="true"
          @selectRes="selectTable"
        ></filterable-input>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="false">
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
      <div class="contentConfig__box">
        <h2>链接符</h2>
        <el-select
          v-model="getCurrentTab.linkSymbol"
          class="contentConfig__select"
        >
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="item in linkSymbolArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="contentConfig__box">
        <h2 class="contentConfig__hasTab--switchBox">
          是否关联
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showAdd"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <h2 class="contentConfig__hasTab--switchBox">
          是否解绑
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showDel"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2>
        <!-- <h2 class="contentConfig__hasTab--switchBox">
          是否移动
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.showTransfer"
            active-text="是"
            inactive-text="否"
          >
          </el-switch>
        </h2> -->
      </div>
      <div class="contentConfig__box" v-if="false">
        <h2>包含组件</h2>
        <draggable
          v-model="getCardArea.children"
          group="tabs"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group class="contentConfig__hasTab--list" tag="ul">
            <li
              class="contentConfig__hasTab--tab"
              v-for="(child, index) in getCardArea.children"
              :key="child.compId"
              @click="changeTab(child)"
              v-show="child.compName !== 'BtnsArea'"
            >
              <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-6"></i>
              <span class="input">{{
                child.dataSource.columnName || child.name
              }}</span>
              <el-tooltip
                effect="dark"
                content="隐藏"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-mimaxianshi m-r-12"
                  @click="child.showTreeText = false"
                  v-show="
                    child.dataSource.columnName !== 'id' &&
                    child.compName !== 'BtnsArea' &&
                    child.showTreeText
                  "
                ></i
              ></el-tooltip>
              <el-tooltip
                effect="dark"
                content="显示"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-yincang m-r-12"
                  @click="child.showTreeText = true"
                  v-show="
                    child.dataSource.columnName !== 'id' &&
                    child.compName !== 'BtnsArea' &&
                    !child.showTreeText
                  "
                ></i
              ></el-tooltip>
              <el-tooltip
                effect="dark"
                content="删除"
                :enterable="false"
                placement="bottom"
              >
                <i
                  class="iconfont icon-shanchu"
                  @click="deleteLabel(index)"
                  v-show="
                    child.dataSource.columnName !== 'id' &&
                    child.compName !== 'BtnsArea'
                  "
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="false">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用节点图标
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.hasTreeIcon"
            active-text="是"
            inactive-text="否"
            @change="getCurrentTab.hasCardIcon = false"
          >
          </el-switch>
        </h2>
      </div>
      <div class="contentConfig__box contentConfig__hasTab" v-if="false">
        <h2 class="contentConfig__hasTab--switchBox">
          是否启用组件字典图标
          <el-switch
            class="contentConfig__hasTab--switch"
            v-model="getCurrentTab.hasCardIcon"
            active-text="是"
            inactive-text="否"
            @change="getCurrentTab.hasTreeIcon = false"
          >
          </el-switch>
        </h2>
      </div>
      <div
        class="contentConfig__box iconSelect"
        v-if="getCurrentTab.hasTreeIcon"
      >
        <IconSelect
          :shouldScale="true"
          @iconSelected="iconSelected"
          :item="curItem"
          :iconType="2"
        ></IconSelect>
        <p class="iconSelect__tip">提示：请添加一个识别度高的图标</p>
      </div>
      <div class="contentConfig__box" v-if="getCurrentTab.hasCardIcon">
        <h2>图标来源</h2>
        <el-select v-model="getCurrentTab.iconId" class="contentConfig__select">
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getDictLable"
            :key="item.compId"
          ></el-option>
        </el-select>
      </div>
      <div class="contentConfig__box" v-if="getCurrentTab.hasCardIcon">
        <h2>图标颜色来源</h2>
        <el-select
          v-model="getCurrentTab.iconColorId"
          class="contentConfig__select"
        >
          <el-option
            :label="item.name"
            :value="item.compId"
            v-for="item in getDictLable"
            :key="item.compId"
          ></el-option>
        </el-select>
      </div>
    </section>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import propertyMixin from '../propertyMixin';
import IconSelect from '../../../../../../components/IconSelect';

export default {
  mixins: [propertyMixin],
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
      currentRadioObj: null,
      currentColumnObj: null,
      filterDialog: false,
      curPaneConfig: [],
      curItem: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      linkSymbolArr: [
        {
          name: '无',
          value: ''
        },
        {
          name: '-',
          value: '-'
        },
        {
          name: '_',
          value: '_'
        },
        {
          name: '/',
          value: '/'
        }
      ]
    };
  },

  components: {
    IconSelect
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
      if (!this.getCurrentTab.children.length) {
        return flag;
      }
      if (this.getCurrentTab.relateTableArr && this.getCurrentTab.relateTableArr.length) {
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
    // 获取功能组件
    getCardArea() {
      if (this.activeObj.children.length) {
        const index = this.activeObj.children.findIndex((child) => child.areaType === 1);
        if (index !== -1) {
          return this.activeObj.children[index];
        }
      }
      return {
        children: []
      };
    },
    // 获取开启了字典的label
    getDictLable() {
      // console.log();
      return this.getCardArea.children.filter((child) => child.enableDict);
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
    this.resetCardIcon();
    this.resetReloadArea();
    this.initIcon();
    // console.log(this.getCardArea.children);
  },

  methods: {
    initIcon() {
      if (this.getCurrentTab.hasTreeIcon) {
        this.curItem.icon = this.getCurrentTab.icon.icon;
        this.curItem.color = this.getCurrentTab.icon.color;
        this.curItem.imageUrl = this.getCurrentTab.icon.imageUrl;
      }
    },
    // 重置选中的图标跟颜色来源
    resetCardIcon() {
      if (this.getDictLable.length === 0) {
        this.getCurrentTab.iconId = '';
        this.getCurrentTab.iconColorId = '';
      } else {
        const index1 = this.getDictLable.findIndex(
          (label) => label.compId === this.getCurrentTab.iconId
        );
        if (index1 === -1) {
          this.getCurrentTab.iconId = '';
        }
        const index2 = this.getDictLable.findIndex(
          (label) => label.compId === this.getCurrentTab.iconColorId
        );
        if (index2 === -1) {
          this.getCurrentTab.iconColorId = '';
        }
      }
    },
    // 重置触发的区域
    resetReloadArea() {
      const arr = [];
      this.getArea.forEach((comp) => {
        this.getAllcheck[`${comp.compId}_`].isTree = false;
        if (this.getCurrentTab.reloadArea.includes(comp.compId)) {
          this.getAllcheck[`${comp.compId}_`].isTree = true;
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
      this.activeObj.pageType = index + 1;
      this.activeObj.children = tempData.children;
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
    },
    // 删除label
    deleteLabel(index) {
      this.getCardArea.children.splice(index, 1);
    },
    iconSelected(obj) {
      this.getCurrentTab.treeIcon.icon = obj.icon;
      this.getCurrentTab.treeIcon.color = obj.color;
      this.getCurrentTab.treeIcon.imageUrl = obj.imageUrl;
    },
    compDictChange(v) {
      console.log(1111);
      if (v) {
        console.log(this.getCurrentTab.hasTreeIcon);
        this.getCurrentTab.hasTreeIcon = false;
      }
    }
  },

  watch: {
    'getCurrentTab.reloadArea': function(v, v1) {
      if (v && v1 && v.length !== v1.length) {
        this.resetReloadArea();
      }
    },
    filterDialog(v) {
      if (!v) {
        this.$bus.$emit('addHasTriggerComp');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.contentConfig {
  box-sizing: border-box;
  height: 100%;
  padding-bottom: 10px;
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
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        flex: 1;
      }
      .columnName {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        &__sort {
          width: 80px;
          margin-left: auto;
          margin-right: 8px;
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
    &--addArea {
      margin-left: 10px;
      width: calc(100% - 20px);
      .icon-xinzeng {
        color: $--color-primary;
      }
    }
    &--addArea {
      margin-bottom: 10px;
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
  .iconSelect {
    display: flex;
    align-items: center;
    padding: 0 10px;
    &__tip {
      margin-left: 10px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aaaaaa;
    }
  }
}
</style>
