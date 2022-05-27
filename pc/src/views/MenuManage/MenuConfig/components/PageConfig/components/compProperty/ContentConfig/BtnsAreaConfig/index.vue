<template>
  <section
    class="btnArea__wrapper"
    :class="[{ config: activeObj && activeObj.showH1 }]"
    v-if="isBtnArea"
  >
    <h1 class="config__h1" v-if="activeObj && activeObj.showH1">tab按钮区</h1>
    <h2 v-if="$route.query.isApp !== '1'">按钮排序</h2>
    <div class="btnArea__box m-b-10" v-if="$route.query.isApp !== '1'">
      <p v-if="!isCard">
        <i class="iconfont icon-juzuo"></i>
        居左排序
      </p>
      <ul class="btnArea__box--list">
        <draggable v-model="leftBtnArr" group="btnArr" animation="300">
          <li
            class="btnArea__box--li"
            v-for="(item, i) in leftBtnArr"
            :key="item.compId"
          >
            <i class="iconfont icon-zongxiangtuodong"></i>
            <span class="btnArea__box--name" :title="item.name">{{
              item.name
            }}</span>
            <i
              class="iconfont icon-shanchu"
              @click="leftBtnArr.splice(i, 1)"
            ></i></li
        ></draggable>
      </ul>
    </div>
    <div class="btnArea__box" v-if="!isCard && $route.query.isApp !== '1'">
      <p>
        <i class="iconfont icon-juyou" style="background: #34c7be"></i>
        居右排序
      </p>
      <ul class="btnArea__box--list">
        <draggable v-model="rightBtnArr" group="btnArr" animation="300">
          <li
            class="btnArea__box--li"
            v-for="(item, i) in rightBtnArr"
            :key="item.compId"
          >
            <i class="iconfont icon-zongxiangtuodong"></i>
            <span class="btnArea__box--name" :title="item.name">{{
              item.name
            }}</span>
            <i
              class="iconfont icon-shanchu"
              @click="rightBtnArr.splice(i, 1)"
            ></i>
          </li>
        </draggable>
      </ul>
    </div>
    <div
      v-if="$route.query.isApp === '1' && getBtnsArr.tabBtnArea"
      class="btnArea__pBox m-b-10"
    >
      <p class="btnArea__p">排列方式</p>
      <el-select
        class="btnArea__select"
        placeholder="请选择类型"
        v-model="getBtnsArr.appSort"
      >
        <el-option label="横向排列" :value="1"></el-option>
        <el-option label="纵向排列" :value="2"></el-option>
      </el-select>
    </div>
    <div class="btnArea__pBox m-b-10" v-if="$route.query.isApp === '1'">
      <p class="btnArea__p">按钮区风格</p>
      <el-select
        class="btnArea__select"
        placeholder="请选择类型"
        v-model="getBtnsArr.appStyle"
      >
        <el-option label="无背景色" :value="1"></el-option>
        <el-option label="主题背景色" :value="2"></el-option>
        <el-option label="按钮颜色自定义" :value="3"></el-option>
      </el-select>
    </div>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    activeObj: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    },
    isBtnArea: {
      type: Boolean,
      default: true
    },
    getBtnsArea: {
      type: Object
    },
    // 是不是卡片区的按钮
    isCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      leftBtnArr: [],
      rightBtnArr: []
    };
  },
  computed: {
    getBtnsArr() {
      if (this.getBtnsArea) {
        return this.getBtnsArea;
      }
      return this.activeObj;
    }
    // 是不是卡片区的按钮
  },
  mounted() {},
  components: {},
  methods: {
    // 初始化左右数组
    initLeftAndRightArr() {
      if (this.isBtnArea) {
        const { length } = this.getBtnsArr.children;
        this.leftBtnArr = this.getBtnsArr.children.slice(0, length - this.getBtnsArr.rightIndex);
        this.rightBtnArr = this.getBtnsArr.children.slice(
          length - this.getBtnsArr.rightIndex,
          length
        );
      }
    }
  },
  watch: {
    'getBtnsArea.children.length': function() {
      this.initLeftAndRightArr();
    },
    rightBtnArr: {
      handler(v) {
        this.getBtnsArr.rightIndex = v.length;
        this.getBtnsArr.children = [...this.leftBtnArr, ...v];
      },
      deep: true
    },
    leftBtnArr: {
      handler(v) {
        this.getBtnsArr.children = [...v, ...this.rightBtnArr];
      },
      deep: true
    },
    isBtnArea: {
      handler(v) {
        if (v) {
          this.initLeftAndRightArr();
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../../commonConfig';

.btnArea {
  &__wrapper {
    height: calc(100% - 46px);
    box-sizing: border-box;
    padding: 12px 10px 0;
    h2 {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
      line-height: 18px;
      margin-bottom: 6px;
    }
  }
  &__box {
    min-height: 154px;
    max-height: 262px;
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    p {
      display: flex;
      align-items: center;
      height: 36px;
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      background: #fafafa;
      padding-left: 10px;
      i {
        width: 18px;
        height: 18px;
        line-height: 18px;
        font-size: 12px;
        text-align: center;
        color: #fff;
        background-color: #5a80ed;
        border-radius: 2px;
        margin-right: 4px;
      }
    }
    &--list {
      height: calc(100% - 36px);
      min-height: 118px;
      max-height: 226px;
      overflow: auto;
      & > div {
        min-height: 118px;
      }
    }
    &--li {
      height: 36px;
      padding: 0 15px 0 12px;
      display: flex;
      align-items: center;
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      &:hover {
        background: #f1f7ff;
        border-radius: 2px;
        .iconfont {
          color: $--color-primary;
        }
      }
      .iconfont {
        font-size: 16px;
        color: #bbc3cd;
      }
      .icon-zongxiangtuodong {
        margin-right: 10px;
        cursor: move;
      }
      .icon-shanchu {
        margin-left: auto;
      }
    }
    &--name {
      width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  &__pBox {
    // padding: 0 10px;
  }
  &__p {
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }
  &__select {
    width: 100%;
  }
}
.config {
  padding-top: 0px;
}
</style>
