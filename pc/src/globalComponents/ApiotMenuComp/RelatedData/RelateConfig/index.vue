<template>
  <div class="relateConfig" @click.stop="changeCurActiveObj">
    <div class="relateConfig__btn borderType">
      <apiot-button
        class="relateConfig__btn--1"
        :style="getStyle"
        @mouseenter.native="isHover = true"
        @mouseleave.native="isHover = false"
        type="primary"
      >
        <i class="iconfont icon-guanxiguanlian"></i>
        关联知识库
      </apiot-button>
      <apiot-button class="relateConfig__btn--2" type="primary">
        <i class="iconfont icon-shangchuan"></i>
        上传文件
      </apiot-button>
      <apiot-button class="relateConfig__btn--3">
        <i class="iconfont icon-xinzengwenjianjia"></i>
        新建文件夹
      </apiot-button>
      <SearchInput style="margin-left: auto"></SearchInput>
      <div class="btnMask"></div>
    </div>
    <div
      class="relateConfig__table borderType"
      :class="[{ highBorder: activeObj.compId === configData.compId }]"
    >
      <ul class="table">
        <li
          class="table__li"
          v-for="item in configData.tableColumn"
          :key="item.column"
        >
          <p class="table__name">{{ textObj[item.column] }}</p>
          <p class="table__zw">数据占位</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { lighten } from '@/utils/varyColor';

export default {
  name: '',
  props: {
    showType: {
      type: Object,
      default: () => {}
    },
    configData: {
      type: [Array, Object]
    },
    activeObj: {
      type: [Array, Object]
    },
    hasTriggerComp: {
      type: Object
    },
    isSidebar: {
      type: Boolean,
      default: false
    },
    pos: {
      type: Number
    }
  },
  data() {
    return {
      isHover: false,
      textObj: {
        RelateName: '文件名称',
        RelateUserName: '创建人',
        RelateCreateTime: '创建时间',
        RelateModifyTime: '更新时间',
        RelateSize: '大小',
        RelateType: '文件来源'
      }
    };
  },
  components: {},
  mounted() {
    // console.log(this.configData);
  },
  computed: {
    getBtnBg() {
      return this.isHover ? lighten('#FAB71C', 0.2) : '#FAB71C';
    },
    getStyle() {
      return `background:${this.getBtnBg};border-color:${this.getBtnBg}`;
    }
  },
  methods: {
    changeCurActiveObj() {
      this.$bus.$emit('changeCurActiveObj', this.configData);
    }
  }
};
</script>

<style lang='scss' scoped>
.relateConfig {
  height: 198px;
  margin: 10px;
  &__btn {
    position: relative;
    padding: 0 6px;
    height: 40px;
    box-sizing: border-box;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .iconfont {
      margin-right: 4px;
    }
    &--3 {
      i {
        color: $--color-primary;
      }
    }
    .btnMask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 1;
      background: rgba(233, 233, 233, 0.5);
    }
  }
  &__table {
    height: 148px;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    align-items: center;
    &:hover {
      border-width: 1px !important;
      border-style: solid !important;
      border-image: url(../../../../assets/img/border-blue.svg) 1 round !important;
    }
    .table {
      text-align: center;
      line-height: 40px;
      display: flex;
      width: 100%;
      &__li {
        flex: 1;
        border: 1px solid #e9e9e9;
        border-right: 0 none;
        &:last-child {
          border-right: 1px solid #e9e9e9;
        }
      }
      p {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #808080;
        height: 40px;
        box-sizing: border-box;
      }
      p:nth-child(2) {
        color: #333;
        border-top: 1px solid #e9e9e9;
      }
    }
  }
}
</style>
