<template name="mLabel">
  <!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
  <view
    v-if="element.visiabled"
    :class="[
      element.labletPositon || 'left',
      sourceType !== 'list' ? 'formElemets' : '',
      isFocus ? inputFocusClass : '',
      element.readonly ? 'readonly' : '',
      isEllipsis ? 'ellipsis' : '',
    ]"
  >
    <block v-if="sourceType === 'list'">
      <!-- {{ element.canDisplayName ? `${element.label}:${value}`:value}} -->
      <!-- 列表的lable -->
      <!-- 如果label没有值，显示一行 -->
      <view
        class="listShow"
        :style="{
          // justifyContent: element.alignment === 2 ? 'flex-end' : 'flex-start',
          alignItems: 'center',
          background: element.backgroundColor,
          padding: element.backgroundColor ? '8rpx 10rpx' : '',
          textAlign:
            element.alignment === 3
              ? 'right'
              : element.alignment === 2
              ? 'center'
              : 'left',
        }"
      >
        <view style="display: flex; alignitems: center">
          <m-font-icon
            :icon="icon"
            :iconSize="40"
            :style="{
              color: color,
            }"
            v-if="indexKey === 1 && iconDisplayStyle === 1"
            style="margin-right: 5px"
          ></m-font-icon>
          <m-font-icon
            :icon="element.labelIcon"
            :iconSize="40"
            :style="{
              color: element.labelIconColour,
            }"
            style="margin-right: 5px"
          ></m-font-icon>
          <view
            v-if="element.canDisplayName"
            :style="{
              fontSize: pxToREM(element.labelFont || fontSize),
              color: element.fontColor,
              fontWeight: element.bold === 1 ? 'bold' : 'normal',
            }"
          >
            {{ element.label }} :
          </view>
        </view>
        <div
          :style="{
            fontSize: pxToREM(element.labelFont || fontSize),
            marginLeft: element.canDisplayName && element.label ? '14rpx' : '0',
            fontWeight: element.bold === 1 ? 'bold' : 'normal',
            color: element.fontColor,
            width: 0,
            flex: 1,
            wordWrap: 'break-word',
          }"
        >
          <div v-if="element.displayShowStyle === 1 && element.baseType === 20">
            {{ value }}
          </div>
          <div
            v-else-if="
              element.displayShowStyle === 2 && element.baseType === 20
            "
            :style="{
              padding: '8rpx 24rpx',
              background: backColor(iconColor),
              borderRadius: '40rpx',
              width: 'max-content',
            }"
          >
            {{ value }}
          </div>
          <div
            v-else-if="
              element.displayShowStyle === 3 && element.baseType === 20
            "
          >
            <div
              class="listStateCircle"
              :style="{ background: iconColor }"
            ></div>
            {{ value }}
          </div>
          <div v-else>
            {{ value }}
          </div>
        </div>
      </view>
    </block>
    <block v-else>
      <!-- 如果label没有值，显示一行 -->
      <view
        :class="[element.readonly === 1 ? 'readOnly' : '']"
        :style="{
          justifyContent: element.alignment === 2 ? 'flex-end' : 'flex-start',
          background: element.backgroundColor,
          padding: element.backgroundColor ? '0 10rpx' : '',
          margin: '10rpx 0',
          borderRadius: '8rpx',
          display: 'flex',
          flex: '1',
        }"
      >
        <label :class="[!element.label ? 'text1' : 'text mLabel__label']">
          <m-font-icon
            :icon="element.labelIcon"
            :iconSize="40"
            :style="{ color: element.labelIconColour }"
            :class="{ labelIconClass: !!element.label }"
          ></m-font-icon>
          <view
            v-if="element.label"
            :class="[
              element.readonly === 1 ? 'readOnly' : 'normal',
              'mLabel__labelName',
            ]"
            :style="{
              fontSize: pxToREM(element.labelFont || fontSize),
              color: element.fontColor + ' !important',
              fontWeight: element.bold === 1 ? 'bold' : 'normal',
            }"
            >{{ element.label }}</view
          >
        </label>
        <view
          class="contentValue"
          :style="{
            fontSize: pxToREM(element.labelFont || fontSize),

            fontWeight: element.bold === 1 ? 'bold' : 'normal',
            color: this.element.relationTabId
              ? ''
              : element.fontColor + ' !important',
          }"
          @tap="clickInput"
          :class="[
            element.label
              ? element.readonly === 1
                ? 'readOnly'
                : 'normal'
              : '',
            element.relationTabId ? 'hasrelationTab' : '',
          ]"
        >
          {{ showContent }}
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import { lighten } from '@/common/utils/varyColor.js';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'mSearchSelect',
  props: {
    element: {
      type: Object,
      default() {
        return {};
      },
    },
    isEllipsis: { type: Boolean, default: false },
    sourceType: { type: String, default: 'list' }, //来源 list forme advancedFilter
    value: { type: [Number, String] }, //值
    inputFocusClass: { type: String, default: 'inputFocus-red' },
    iconColor: { type: String, default: '' },
    icon: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    indexKey: {
      type: Number,
      default: 0,
    },
    iconDisplayStyle: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showContent: '',
      isFocus: false,
      isInit: true,
      isLabel: false,
    };
  },
  computed: {
    fontSize() {
      return 30;
    },
    backColor() {
      return function (color) {
        return lighten(color, 0.9);
      };
    },
  },
  watch: {
    value(newVal, oldVal) {
      if (this.sourceType !== 'list') {
        this.showContent = newVal;
      }
    },
    showContent(newVal) {
      if (this.sourceType !== 'list' && !this.isInit) {
        this.$emit('changeValue', {
          triggerBaseType: 2,
          element: this.element,
          value: this.showContent,
        });
      }
      this.isInit = false;
    },
  },
  methods: {
    ...mapMutations(['STATE_formElementFocus']),
    clickInput() {
      if (this.element.relationTabId) this.$emit('showRelationTab'); //关联弹出面板
    },
    inputFocus() {
      //设置聚焦
      this.isFocus = true;
      this.STATE_formElementFocus(true);
    },
    inputBlur(e) {
      //失焦
      this.isInit = false;
      this.$nextTick(() => {
        this.isFocus = false;
        this.showContent = e.target.value;
      });
    },
    changeLabelColor(event) {
      this.isLabel = event.detail.value ? true : false;
    },
  },
  created() {
    if (this.sourceType !== 'list') this.showContent = this.value;
  },
};
</script>
<style lang="scss" scoped>
@charset "utf-8";
@import '@/static/scss/common/_function.scss';
@import '@/static/scss/common/_variable.scss';
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.labelIconClass {
  padding-right: pxToREM(15);
}
.mLabel__labelName {
  display: inline-block;
}
.mLabel__label {
  display: flex;
  align-items: center;
}

.contentValue {
  // color: #9b9b9b;
  flex: 1;
  display: flex;
  align-items: center;
  padding: pxToREM(19) 0 pxToREM(19) 0; // pxToREM(15) 工单基本详情删除左边的
}
.text1 {
  flex-shrink: 0;
  padding: pxToREM(19) 0;
  display: flex;
  align-items: center;
}
.readOnly {
  color: #9b9b9b !important;
}
.normal {
  color: #000 !important;
}
.hasrelationTab {
  color: #1890ff !important;
}

.listShow {
  display: flex;
  border-radius: 8rpx;
}
.listStateCircle {
  width: 9px;
  height: 9px;
  margin-bottom: 1px;
  border-radius: 50%;
  margin-right: 9rpx;
  display: inline-block;
}
</style>
