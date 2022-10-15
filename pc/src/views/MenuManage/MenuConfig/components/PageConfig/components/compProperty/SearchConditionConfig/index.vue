<template>
  <div class="config searchConfig">
    <h1 class="config__h1">搜索组件</h1>
    <el-form label-position="top" :model="activeObj">
      <el-form-item label="占位提示">
        <apiot-input
          v-model="activeObj.placeholder"
          placeholder="请输入关键字"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="搜索组件">
        <draggable
          v-model="activeObj.searchCompArr"
          group="area"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group tag="ul">
            <li
              class="searchConfig__compItem"
              v-for="(child, index) in activeObj.searchCompArr"
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
                  @click="activeObj.searchCompArr.splice(index, 1)"
                ></i
              ></el-tooltip>
            </li>
          </transition-group>
        </draggable>
        <apiot-button
          class="searchConfig__btn"
          @click="
            activeArr = activeObj.searchCompArr;
            showCompTree = true;
          "
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>添加搜索组件
        </apiot-button>
      </el-form-item>
      <p class="switchBox m-b-16" v-if="$route.query.isApp === '1'">
        是否启用扫描功能
        <el-switch
          v-model="activeObj.enableScan"
          class="switchBox__switch"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </p>
      <p class="switchBox m-b-16">
        启用高级搜索
        <el-switch
          v-model="activeObj.shouldHigh"
          class="switchBox__switch"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </p>
      <el-form-item label="展示风格" v-if="activeObj.shouldHigh">
        <el-select v-model="activeObj.highStyle" placeholder="请选择按钮样式">
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in buttonFormArr"
            :key="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包含组件" v-if="activeObj.shouldHigh">
        <draggable
          v-model="activeObj.highCompArr"
          group="area"
          animation="300"
          handle=".icon-zongxiangtuodong"
        >
          <transition-group tag="ul">
            <li
              class="searchConfig__compItem high"
              v-for="(child, index) in activeObj.highCompArr"
              :key="child.value"
            >
              <div class="searchConfig__compItem--content">
                <i class="iconfont icon-zongxiangtuodong m-l-14 m-r-18"></i>
                <span
                  class="searchConfig__compItem--name"
                  :title="child.name"
                  >{{ child.name }}</span
                >
                <el-tooltip
                  effect="dark"
                  content="删除"
                  :enterable="false"
                  placement="bottom"
                >
                  <i
                    class="iconfont icon-shanchu m-r-15"
                    @click="activeObj.highCompArr.splice(index, 1)"
                  ></i
                ></el-tooltip>
              </div>
              <div
                class="searchConfig__compItem--panel"
                v-if="showPanle(child)"
              >
                <filterable-input
                  placeholder="请选择面板"
                  :hasPagination="true"
                  :showInfo="child.panelObj"
                  :dialogType="4"
                  :isSelPanel="true"
                  @selectRes="selectPane($event, child)"
                ></filterable-input>
              </div>
            </li>
          </transition-group>
        </draggable>
        <apiot-button
          class="searchConfig__btn"
          @click="
            activeArr = activeObj.highCompArr;
            showCompTree = true;
          "
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>添加包含组件
        </apiot-button>
      </el-form-item>
      <p class="switchBox m-b-16" v-if="activeObj.shouldHigh">
        启用高级搜索历史
        <el-switch
          v-model="activeObj.hisSearch"
          class="switchBox__switch"
          active-text="是"
          inactive-text="否"
        >
        </el-switch>
      </p>
    </el-form>
    <transition name="slide-bottom">
      <comp-tree
        :visible.sync="showCompTree"
        v-if="showCompTree"
        :configData="getCurTree"
        :filterList="filterList"
        :isMulti="true"
        @getSelectComp="getSelectComp"
      ></comp-tree>
    </transition>
  </div>
</template>

<script>
import propertyMixin from '../propertyMixin';
import CompTree from '../GlobalConfig/components/AddAction/components/CompTree';

export default {
  mixins: [propertyMixin],
  props: {
    activeObj: {
      type: Object
    },
    configData: {
      type: Array
    }
  },
  data() {
    return {
      showCompTree: false,
      activeArr: [],
      buttonFormArr: [
        {
          label: '文字按钮',
          value: 1
        },
        {
          label: '图标文字按钮',
          value: 2
        },
        {
          label: '图标按钮',
          value: 3
        }
      ]
    };
  },

  components: {
    CompTree
  },

  computed: {
    // 能否展示选择面板
    showPanle() {
      return (comp) => {
        console.log(comp);
        if ([6, 7, 15].includes(comp.compType)) {
          if (comp.compType === 15 && comp.dataSource) {
            if (comp.dataSource.relateName === '主表') {
              if (!comp.enableMultiColumn) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      };
    },
    getCurTree() {
      const i = this.relateObj.pageType === 2 ? 1 : 0;
      const arr = this.relateObj.children[i].children.filter(
        (comp) => comp.compType && comp.dataSource.columnName !== 'id'
      );
      // console.log(arr);
      return arr;
    },
    getCompidsArr() {
      const arr = [];
      this.getCurTree.forEach((comp) => {
        arr.push(comp.compId);
      });
      return arr;
    },
    filterList() {
      const arr = [];
      this.activeArr.forEach((comp) => {
        arr.push(comp.value);
      });
      return arr;
    }
  },

  mounted() {
    // console.log(this.relateObj);
    // 初始化searchCompArr跟highCompArr
    this.initArr(this.activeObj.searchCompArr);
    this.initArr(this.activeObj.highCompArr);
  },

  methods: {
    initArr(arr) {
      if (!arr) {
        return;
      }
      const len = arr.length;
      for (let i = len - 1; i >= 0; i -= 1) {
        const index = this.getCompidsArr.indexOf(arr[i].value);
        if (index === -1) {
          arr.splice(i, 1);
        } else {
          arr[i].name = this.getCurTree[index].name;
        }
      }
    },
    getSelectComp(compArr) {
      compArr.forEach((comp) => {
        this.activeArr.push({
          name: comp.name,
          value: comp.compId,
          compType: comp.compType,
          panelObj: {
            id: '', // 面板id
            panelName: '', // 面板名称
            sysMenuDesignId: '', // 设计组id
            relationMenuDesignId: '', // 外层设计组id
            panelType: '', // 类型
            panelClassify: 1,
            panelData: [], // 面板传递参数
            panelFilter: [] // 面板过滤条件
          },
          dataSource: comp.dataSource,
          enableMultiColumn: comp.enableMultiColumn
        });
      });
    },
    async selectPane(pane, child) {
      console.log(pane, child);
      if (!pane) {
        child.panelObj = {
          id: ''
        };
        return;
      }
      if (child.panelObj.id !== pane.id) {
        child.panelObj.id = pane.id;
        child.panelObj.panelName = pane.panelName;
        child.panelObj.sysMenuDesignId = pane.sysMenuDesignId;
        child.panelObj.relationMenuDesignId = pane.relationMenuDesignId;
        child.panelObj.panelType = pane.panelType;
        child.panelObj.panelData = [];
        child.panelObj.panelFilter = [];
        child.panelObj.panelClassify = pane.panelClassify;
      }
      console.log(child);
    }
  },

  watch: {}
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
