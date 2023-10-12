<!--
 * @Author: sss
 * @Date: 2022-06-29 10:39:25
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-29 10:39:25
 * @Desc: 选中数据显示界面
-->
<template>
  <section v-if="show" :style="checkedtListStyle" class="checkedList">
    <div class="checkedList__content">
      <P
        v-for="(item, index) in list"
        :key="index"
        class="checkedList__content--item"
      >
        <span class="title">{{ item[getCheckShowComp.compId] }}</span>
        <span
          class="delete"
          :class="[`themeColor__font-${getThemeIndex}`]"
          @click.stop="deleteItem(index)"
        >
          移除
        </span>
      </P>
    </div>
    <footer class="checkedList__footer">
      <div class="checkedList__footer--btns">
        <div class="btn cancel" @click.stop="cancel">取消</div>
        <div class="btn sure" @click.stop="sure">确定</div>
      </div>
    </footer>
  </section>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {},

  mixins: [mpMixin],

  inject: ['selectDataConfig'],

  props: {
    show: Boolean,
    menuHeight: Number,
    featureArr: [Object, Array],
    configData: Object,
    htmlConfig: Object
  },

  data() {
    return {
      list: [],
      isChange: false
    };
  },

  computed: {
    funcCheckObj() {
      if (!this.configData) return {};
      return this.configData.checkList || {};
    },
    funcArea() {
      const { featureArr } = this;
      const { funcAreas } = featureArr;
      return funcAreas.find((item) => item.areaType === 1);
    },
    checkList() {
      const { funcCheckObj, funcArea } = this;
      if (!funcArea) return [];
      return funcCheckObj[funcArea.compId] || [];
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 为了兼容支付宝小程序 支付宝小程序不兼容v-show
    checkedtListStyle() {
      const { show, menuHeight } = this;
      if (show) return { display: 'block', height: `${menuHeight - 41}px` };
      return { display: 'none' };
    },

    elementList() {
      const { funcArea } = this;
      const { children } = funcArea;
      const area = children.find((item) => item.areaType === 1) || {};
      return area.children || [];
    },
    // 获取选中唯一标准控件
    getCheckFlagComp() {
      const { elementList, htmlConfig } = this;
      const checkFlagId = htmlConfig.selectDataBoxRelateColumnName || 'id';
      return elementList.find((item) => item.name === checkFlagId) || '';
    },
    // 获取显示的值
    getCheckShowComp() {
      const { elementList, htmlConfig } = this;

      const checkFlagId = htmlConfig.selectDataBoxShowColumnName || 'name';
      return elementList.find((item) => item.dataSource.columnName === checkFlagId) || '';
    }
  },

  watch: {
    checkList: {
      handler(newV) {
        this.list = [...newV];
      },
      immediate: true
    }
  },

  methods: {
    // 删除
    deleteItem(index) {
      this.isChange = true;
      this.list.splice(index, 1);
    },
    // 取消
    cancel() {
      this.$emit('update:show', false);
    },
    // 确定
    sure() {
      // const funcCheckObj = this.configData.checkList || {};
      const { funcArea } = this;
      if (!funcArea) return;

      if (this.isChange) {
        this.$bus.$emit('configCheckList', { list: this.list, flag: funcArea.compId });
      }
      this.cancel();
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.checkedList {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  background: #fff;
  z-index: 11;
  &__content {
    padding: 0 30rpx;
    &--item {
      padding: 26rpx 0;
      display: flex;
      box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
      .title {
        flex: 1;
        font-size: 32rpx;
        font-family: $--font-family;
        color: #333333;
      }
    }
  }
  &__footer {
    height: 88rpx;
    &--btns {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 19rpx 33rpx;
      display: flex;
      background: #fff;
      .btn {
        display: inline-block;
        flex: 1;
        height: 72rpx;
        line-height: 72rpx;
        border-radius: 12rpx;
        font-size: 30rpx;
        font-family: $--font-family;
        color: #333333;
        text-align: center;
        &.cancel {
          background: #f1f3f6;
        }
        &.sure {
          margin-left: 24rpx;

          background: #4689f5;
          color: #fff;
        }
      }
    }
  }
}
</style>
