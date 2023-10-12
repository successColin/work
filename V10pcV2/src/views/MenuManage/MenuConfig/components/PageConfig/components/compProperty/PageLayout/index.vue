<template>
  <div class="config pageLayout">
    <h1 class="pageLayout__title">布局</h1>
    <section class="pageLayout__layout">
      <h1 class="pageLayout__layout--title triangle open">布局样式</h1>
      <ul class="pageLayout__layout--list">
        <li
          class="pageLayout__layout--item"
          :class="[
            {
              active: layout.compName === activeObj.compName,
            },
          ]"
          v-for="(layout, index) in layoutData[0].children"
          :key="layout.compName"
          @click="changeLayout(index)"
        >
          <img
            :class="[
              { isRotate: layout.compName === 'LeftAndRightNoSiderbar' },
            ]"
            :src="
              require(`@/assets/img/menu_images/pageLayout/${layout.imgUrl}`)
            "
          />
          <p>
            {{ layout.name }}
          </p>
        </li>
      </ul>
      <el-form
        label-position="top"
        :model="activeObj"
        v-if="activeObj.compName !== 'LeftCenterRight'"
      >
        <el-form-item
          label="宽度占比"
          v-if="activeObj.leftWidth"
          v-show="activeObj.compName !== 'LeftAndRightNoSiderbar'"
        >
          <el-select
            v-model="activeObj.leftWidth"
            placeholder="请选择宽度"
            @change="activeObj.rightWidth = 100 - activeObj.leftWidth"
          >
            <el-option label="16%" :value="16"></el-option>
            <el-option label="18%" :value="18"></el-option>
            <el-option label="20%" :value="20"></el-option>
            <el-option label="22%" :value="22"></el-option>
            <el-option label="24%" :value="24"></el-option>
            <el-option label="26%" :value="26"></el-option>
            <el-option label="28%" :value="28"></el-option>
            <el-option label="30%" :value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="宽度占比"
          v-if="activeObj.rightWidth && activeObj.compName !== 'ThreeRegional'"
          v-show="activeObj.compName !== 'LeftAndRightNoSiderbar'"
        >
          <el-select
            v-model="activeObj.rightWidth"
            placeholder="请选择宽度"
            @change="activeObj.leftWidth = 100 - activeObj.rightWidth"
          >
            <el-option label="84%" :value="84"></el-option>
            <el-option label="82%" :value="82"></el-option>
            <el-option label="80%" :value="80"></el-option>
            <el-option label="78%" :value="78"></el-option>
            <el-option label="76%" :value="76"></el-option>
            <el-option label="74%" :value="74"></el-option>
            <el-option label="72%" :value="72"></el-option>
            <el-option label="70%" :value="70"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="宽度占比"
          v-if="activeObj.leftWidth"
          v-show="activeObj.compName === 'LeftAndRightNoSiderbar'"
        >
          <el-select
            v-model="activeObj.leftWidth"
            placeholder="请选择宽度"
            @change="activeObj.rightWidth = 100 - activeObj.leftWidth"
          >
            <el-option label="10%" :value="10"></el-option>
            <el-option label="20%" :value="20"></el-option>
            <el-option label="30%" :value="30"></el-option>
            <el-option label="40%" :value="40"></el-option>
            <el-option label="50%" :value="50"></el-option>
            <el-option label="60%" :value="60"></el-option>
            <el-option label="70%" :value="70"></el-option>
            <el-option label="80%" :value="80"></el-option>
            <el-option label="90%" :value="90"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="宽度占比"
          v-if="activeObj.rightWidth && activeObj.compName !== 'ThreeRegional'"
          v-show="activeObj.compName === 'LeftAndRightNoSiderbar'"
        >
          <el-select
            v-model="activeObj.rightWidth"
            placeholder="请选择宽度"
            @change="activeObj.leftWidth = 100 - activeObj.rightWidth"
          >
            <el-option label="10%" :value="10"></el-option>
            <el-option label="20%" :value="20"></el-option>
            <el-option label="30%" :value="30"></el-option>
            <el-option label="40%" :value="40"></el-option>
            <el-option label="50%" :value="50"></el-option>
            <el-option label="60%" :value="60"></el-option>
            <el-option label="70%" :value="70"></el-option>
            <el-option label="80%" :value="80"></el-option>
            <el-option label="90%" :value="90"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="高度占比" v-if="activeObj.topHeight">
          <el-select
            v-model="activeObj.topHeight"
            placeholder="请选择高度"
            @change="activeObj.bottomHeight = 100 - activeObj.topHeight"
          >
            <el-option label="30%" :value="30"></el-option>
            <el-option label="40%" :value="40"></el-option>
            <el-option label="50%" :value="50"></el-option>
            <el-option label="60%" :value="60"></el-option>
            <el-option label="70%" :value="70"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="高度占比" v-if="activeObj.bottomHeight">
          <el-select
            v-model="activeObj.bottomHeight"
            placeholder="请选择高度"
            @change="activeObj.topHeight = 100 - activeObj.bottomHeight"
          >
            <el-option label="30%" :value="30"></el-option>
            <el-option label="40%" :value="40"></el-option>
            <el-option label="50%" :value="50"></el-option>
            <el-option label="60%" :value="60"></el-option>
            <el-option label="70%" :value="70"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form
        label-position="top"
        :model="activeObj"
        v-if="activeObj.compName === 'LeftCenterRight'"
      >
        <el-form-item label="左侧宽度占比" v-if="activeObj.leftWidth">
          <el-select
            v-model="activeObj.leftWidth"
            placeholder="请选择宽度"
            @change="
              activeObj.centerWidth =
                100 - activeObj.rightWidth - activeObj.leftWidth
            "
          >
            <el-option label="16%" :value="16"></el-option>
            <el-option label="18%" :value="18"></el-option>
            <el-option label="20%" :value="20"></el-option>
            <el-option label="22%" :value="22"></el-option>
            <el-option label="24%" :value="24"></el-option>
            <el-option label="26%" :value="26"></el-option>
            <el-option label="28%" :value="28"></el-option>
            <el-option label="30%" :value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="中间宽度占比">
          <el-select
            v-model="activeObj.centerWidth"
            placeholder="请选择宽度"
            disabled
          >
            <el-option
              :label="`${num}%`"
              :value="num"
              v-for="num in 100"
              :key="num"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="右侧宽度占比">
          <el-select
            v-model="activeObj.rightWidth"
            placeholder="请选择宽度"
            @change="
              activeObj.centerWidth =
                100 - activeObj.rightWidth - activeObj.leftWidth
            "
          >
            <el-option label="16%" :value="16"></el-option>
            <el-option label="18%" :value="18"></el-option>
            <el-option label="20%" :value="20"></el-option>
            <el-option label="22%" :value="22"></el-option>
            <el-option label="24%" :value="24"></el-option>
            <el-option label="26%" :value="26"></el-option>
            <el-option label="28%" :value="28"></el-option>
            <el-option label="30%" :value="30"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';

export default {
  props: {
    configData: {
      type: Array,
    },
    activeObj: {
      type: Object,
    },
    hasTriggerComp: {
      type: Object,
    },
    hasTriggerCompOnly: {
      type: Object,
    },
  },
  data() {
    return {
      activeIndex: 0,
      layoutData: [
        {
          name: '布局样式',
          isClose: false,
          children: [
            {
              name: '全屏布局',
              compId: createUnique(),
              compName: 'FullScreen',
              propertyCompName: 'PageLayout',
              imgUrl: 'FullScreen.svg',
              dictArr: [],
              paneObj: {},
              menuObj: {}, // 跳转菜单相关
              codeRuleList: [],
              enabledPrototype: false, // 是否启用原型模式
              children: [
                {
                  name: '区域1',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
              ],
            },
            {
              name: '上下布局',
              compId: createUnique(),
              compName: 'TopAndBottom',
              topHeight: 50,
              bottomHeight: 50,
              propertyCompName: 'PageLayout',
              imgUrl: 'TopAndBottom.svg',
              dictArr: [],
              paneObj: {},
              menuObj: {}, // 跳转菜单相关
              codeRuleList: [],
              enabledPrototype: false,
              children: [
                {
                  name: '区域1',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
                {
                  name: '区域2',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
              ],
            },
            {
              name: '侧边布局',
              compId: createUnique(),
              compName: 'LeftAndRight',
              leftWidth: 20,
              rightWidth: 80,
              propertyCompName: 'PageLayout',
              imgUrl: 'LeftAndRight.svg',
              dictArr: [],
              paneObj: {},
              menuObj: {}, // 跳转菜单相关
              codeRuleList: [],
              enabledPrototype: false,
              children: [
                {
                  name: '区域1',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: true,
                },
                {
                  name: '区域2',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
              ],
            },
            {
              name: '三块区域布局',
              compId: createUnique(),
              compName: 'ThreeRegional',
              leftWidth: 20,
              rightWidth: 80,
              topHeight: 50,
              bottomHeight: 50,
              propertyCompName: 'PageLayout',
              imgUrl: 'ThreeRegional.svg',
              dictArr: [],
              paneObj: {},
              menuObj: {}, // 跳转菜单相关
              codeRuleList: [],
              enabledPrototype: false,
              children: [
                {
                  name: '区域1',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: true,
                },
                {
                  name: '区域2',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
                {
                  name: '区域3',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
              ],
            },
            {
              name: '左右布局',
              compId: createUnique(),
              compName: 'LeftAndRightNoSiderbar',
              leftWidth: 50,
              rightWidth: 50,
              propertyCompName: 'PageLayout',
              imgUrl: 'TopAndBottom.svg',
              dictArr: [],
              paneObj: {},
              menuObj: {}, // 跳转菜单相关
              codeRuleList: [],
              enabledPrototype: false,
              children: [
                {
                  name: '区域1',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
                {
                  name: '区域2',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
              ],
            },
            {
              name: '左中右布局',
              compId: createUnique(),
              compName: 'LeftCenterRight',
              leftWidth: 20,
              centerWidth: 60,
              rightWidth: 20,
              propertyCompName: 'PageLayout',
              imgUrl: 'LeftCenterRight.svg',
              dictArr: [],
              paneObj: {},
              menuObj: {}, // 跳转菜单相关
              codeRuleList: [],
              enabledPrototype: false,
              children: [
                {
                  name: '区域1',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: true,
                },
                {
                  name: '区域2',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: false,
                },
                {
                  name: '区域3',
                  showTab: false,
                  compId: createUnique(),
                  shouldTab: false,
                  curCompId: 0,
                  firstShowTabId: 0,
                  children: [],
                  propertyCompName: 'ContentConfig',
                  isSidebar: true,
                },
              ],
            },
          ],
        },
      ],
    };
  },

  components: {},

  computed: {},

  mounted() {
    if (this.configData.length === 0) {
      this.setLayout();
    }
  },

  methods: {
    setLayout() {
      const tempArr = [
        JSON.parse(
          JSON.stringify(this.layoutData[0].children[this.activeIndex]),
        ),
      ];
      tempArr[0].children.forEach((area) => {
        this.addTab(area);
        if (area.children.length === 1) {
          area.firstShowTabId = area.children[0].compId;
        }
      });
      this.$emit('update:configData', tempArr);
      this.$emit('update:activeObj', tempArr[0]);
    },
    // 添加tab
    addTab(area) {
      const compId = createUnique();
      const tempData = {
        compId,
        name: `Tab${area.children.length + 1}`,
        showTabBtn: false,
        tabBtnPos: 1, // 1顶部 2 底部
        canChangeName: true, // 能否修改名字
        children: [],
        hiddenRules: [], // tabs隐藏条件
      };
      if (!area.isSidebar) {
        tempData.children.push({
          name: 'Tab按钮区',
          showH1: true,
          compName: 'BtnsArea',
          propertyCompName: 'BtnsAreaConfig',
          compId: createUnique(),
          children: [],
          areaType: 2,
          rightIndex: 0,
          appSort: 1,
          appRadius: 1, // 按钮区排列
          appStyle: 1, // 按钮区风格
          tabBtnArea: true, // tab 区的按钮区
        });
      }
      area.children.push(tempData);
      area.curCompId = compId;
    },
    async changeLayout(index) {
      const len = Object.keys(this.hasTriggerCompOnly).length;
      if (len > 0) {
        return this.$message({
          type: 'warning',
          message: '该布局存在触发器配置，请先删除所有触发器',
        });
      }
      try {
        await this.$confirm('更改页面布局将清空页面上所有配置', {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning',
        });
        this.activeIndex = index;
        this.setLayout();
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../commonConfig';

.pageLayout {
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
  &__layout {
    margin-top: 12px;
    height: calc(100% - 46px - 12px);
    overflow: auto;
    &--title {
      height: 40px;
      line-height: 40px;
      padding-left: 22px;
      cursor: pointer;
    }
    &--list {
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
    }
    &--item {
      box-sizing: border-box;
      border: 1px solid #e9e9e9;
      width: 125px;
      height: 125px;
      margin-left: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      &:hover,
      &.active {
        background: #fafafa;
        border: 1px solid #e9e9e9;
      }
      img {
        display: block;
        margin: 30px auto 0;
        &.isRotate {
          transform: rotate(-90deg);
        }
      }
      p {
        margin-top: 26px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 16px;
      }
    }
  }
  ::v-deep {
    .el-form {
      padding: 0 10px;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
