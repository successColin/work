<template name="mSelect">
  <!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
  <view v-if="element.visiabled">
    <view
      class="formElemets"
      :class="[
        element.labletPositon || 'left',
        element.readonly ? 'readonly' : '',
      ]"
    >
      <label
        class="text"
        :class="selectLabel || element.readonly ? '' : 'drakcolor'"
      >
        {{ element.label }}
        <span
          v-if="element.requisite"
          class="icon iconfont iconmust-fill2 requisite"
        ></span>
      </label>
      <view
        class="content"
        :class="{ hasrelationTab: element.relationTabId }"
        @tap="showPicker"
      >
        <input
          class="input"
          :value="selectLabel"
          :placeholder="element.placeholderText"
          disabled="true"
					:style="{color: fontColor}"
        />
        <m-button class="normalbutton" :isFontBtn="true" :style="{ display: this.element.readonly === 1 ? 'none' : ''}">
          <block slot="buttonIcon" style="display: inline-block">
            <m-normal-icon
              icon="APP_31"
              :iconSize="36"
              color="rgba(0, 0, 0, 0.25)"
            ></m-normal-icon>
          </block>
        </m-button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
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
		color: {
			type: String,
			default: ''
		}
  },
  computed: {
    ...mapState('form', ['selectOptions']),
    elementOption() {
      const dropDownValue1 = this.selectOptions[this.element.elementId] || [];
      let dropDownValue = [...dropDownValue1];
      dropDownValue.unshift({ value: '', label: this.$t('formTip-select') });
      return (
        dropDownValue.find((item) => item.value == this.value) || {
          value: '',
          lable: this.$t('formTip-select'),
        }
      ); // 中文：请选择数据
    },
    selectLabel() {
      return this.elementOption.label;
    },
		fontColor() {
			return this.elementOption.colorcode;
		}
  },
  methods: {
    showPicker() {
      //如果为只读
      if (this.element.readonly) return;
      this.$emit('select');
    },
  }
};
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
