<!--
 * @Author: sss
 * @Date: 2022-03-15 16:31:52
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-15 16:31:52
 * @Desc: 高级筛选条件
-->
<template>
  <view class="condition" :style="conditionStyle">
    <section
      class="condition__value"
      :class="[`themeColor__bg-font-${getThemeIndex}`]"
      @click="() => (show = true)"
    >
      <span>{{ checkedV.label }}</span>
      <i class="appIcon appIcon-xialasanjiao"></i>
    </section>
    <pop-small v-model="show">
      <section class="condition__list">
        <div
          class="condition__list--item"
          v-for="(item, index) in showList"
          :key="index"
          @click="selectCondition(item.value)"
        >
          {{ item.label }}
        </div>
      </section>
    </pop-small>
  </view>
</template>

<script>
import PopSmall from '@/globalComponents/ApiotPop/PopSmall';

export default {
  components: { PopSmall },

  props: {
    value: [String, Number],
    // 用于存放一些基本信息，数据变化时会回传
    element: Object,
    // 条件框样式
    conditionStyle: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      current: null,
      show: false,
      lambdaArr: {
        1: [
          { label: '模糊匹配', value: 'LIKE' },
          { label: '是', value: '=' },
          { label: '否', value: '<>' }
        ],
        2: [
          { label: '包含', value: 'IN' },
          { label: '不包含', value: 'NOT IN' },
          { label: '是', value: '=' },
          { label: '否', value: '<>' }
        ],
        3: [
          { label: '包含', value: 'IN' },
          { label: '不包含', value: 'NOT IN' },
          { label: '是', value: '=' },
          { label: '否', value: '<>' }
        ],
        4: [
          { label: '日期范围内', value: 'IN' },
          { label: '日期范围外', value: 'NOT IN' }
        ],
        5: [
          { label: '=', value: '=' },
          { label: '!=', value: '<>' },
          { label: '>', value: '>' },
          { label: '<', value: '<' },
          { label: '>=', value: '>=' },
          { label: '<=', value: '<=' }
        ]
      }
    };
  },

  computed: {
    // 条件框类型
    mode() {
      const { element } = this;
      const { compType } = element;
      let mode = null;
      // 单行文本，多行文本
      if ([1, 11].includes(compType)) mode = 1;
      // 下拉，单选，多选
      else if ([2, 3, 4].includes(compType)) mode = 2;
      // 数据单选，多选
      else if ([6, 7].includes(compType)) mode = 3;
      // 时间
      else if ([8, 9].includes(compType)) mode = 4;
      // 数字
      else if ([10].includes(compType)) mode = 5;
      return mode;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    showList() {
      return this.lambdaArr[this.mode];
    },
    checkedV() {
      return this.showList.find((item) => item.value === this.current) || this.showList[0];
    }
  },

  watch: {
    checkedV(newV) {
      this.$emit('change', { ...newV, element: this.element });
    }
  },

  methods: {
    selectCondition(e) {
      this.current = e;
      this.show = false;
    }
  },

  mounted() {
    this.current = this.value;
    if (!this.value) {
      this.$emit('change', { ...this.checkedV, element: this.element });
    }
  }
};
</script>

<style lang='scss' scoped>
.condition {
  &__value {
    padding: 6rpx 20rpx;
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-family: $--font-family;
    border-radius: 8rpx;
    .appIcon {
      margin-left: 10rpx;
      font-size: 24rpx;
      color: #bbc3cd;
    }
  }

  &__list {
    background: #fff;
    &--item {
      height: 98rpx;
      line-height: 98rpx;
      text-align: center;
      box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
      font-size: 16px;
      font-family: $--font-family;
      color: #333333;
    }
  }
}
</style>
