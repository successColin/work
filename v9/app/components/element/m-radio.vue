<template name="mRadio">
  <!-- 单选框-->
  <view v-if="element.visiabled">
    <view
      class="formElemets"
      :class="['top', element.readonly ? 'readonly' : '']"
    >
      <label class="text" :class="isLabelColor ? '' : 'drakcolor'">
        {{ element.label }}
        <span
          v-if="element.requisite"
          class="icon iconfont iconmust-fill2 requisite"
        ></span>
      </label>
      <view class="content" :class="{ hasrelationTab: element.relationTabId }">
        <radio-group @change="radioChange" style="width: 100%">
          <label class="radio" v-for="item in elementOptions" :key="item.value">
            <radio
              :value="`${item.value}`"
              :color="checkColor"
              :checked="item.value == value"
              :disabled="element.readonly ? true : false"
            />
            <view>{{ item.label }}</view>
          </label>
        </radio-group>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { THEME_COLOR_RADIO } from '@/common/constant/themeColor.js';
export default {
  props: {
    element: {
      type: Object,
      default() {
        return {};
      },
    },
    isEllipsis: { type: Boolean, default: false },
    sourceType: { type: String, default: 'form' }, //来源 list forme advancedFilter
    value: { type: [Number, String] }, //值
  },
  computed: {
    ...mapState(['themeColorCode', 'themeColor']),
    ...mapState('form', ['selectOptions']),
    elementOptions() {
      return this.selectOptions[this.element.elementId] || [];
    },
    isLabelColor() {
      //控制label颜色
      //可编辑并且没有值的时候，颜色变深
      if (!this.element.readonly && !this.showContent) return false;
      else return true;
    },
    checkColor() {
      return this.element.readonly
        ? THEME_COLOR_RADIO[this.themeColor]
        : this.themeColorCode;
    },
  },
  data() {
    return {
      showContent: '',
    };
  },
  watch: {
    showContent(newVal) {
      if (this.sourceType !== 'list') {
        this.$emit('changeValue', {
          triggerBaseType: 2,
          element: this.element,
          value: this.showContent,
        });
      }
    },
  },
  methods: {
    radioChange(e) {
      const currentValue = e.detail || {};
      this.showContent = currentValue.value || '';
    },
  },
  mounted() {
    this.elementOptions.forEach((item) => {
      if (item.value == this.value) {
        this.showContent = item.value;
      }
    });
  },
};
</script>
<style lang="scss" scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.formElemets {
  ::v-deep {
    .uni-radio-input {
      width: 32upx;
      height: 32upx;
    }
  }
}
</style>
