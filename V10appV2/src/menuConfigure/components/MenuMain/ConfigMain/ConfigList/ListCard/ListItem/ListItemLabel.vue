<!--
 * @Author: sss
 * @Date: 2022-10-26 14:11:55
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-26 14:11:55
 * @Desc: 列表-label控件
-->
<template>
  <view
    class="listLabel"
    :class="[
      element.alignStyle === 3 ? 'labelRight' : '',
      ellipsis ? 'ellipsis' : onlyValue ? 'wrap' : '',
    ]"
    :style="[labelStyle]"
  >
    <span
      v-if="canShowLableIcon"
      class="listLabel__icon"
      :style="{
        width: `${labelSize + 6}px`,
        height: `${labelSize + 6}px`,
      }"
    >
      <label-icon
        :name="canShowLableIcon"
        :color="element.icon.color"
        customPrefix="iconfont"
        :size="labelSize + 6"
      ></label-icon>
    </span>

    <span class="listLabel__title" v-if="element.showLabelTitle"
      >{{ element.name }}：</span
    >

    <span
      v-for="(item, index) in showVFormat"
      :key="index"
      class="listLabel__value"
      :class="[
        onlyValue && element.labelBg.style !== 0 && item.color ? 'valueBg' : '',
      ]"
      :style="[
        onlyValue ? labelStyle : {},
        {
          backgroundColor:
            element.labelBg.style !== 0 && element.dropDownStyle !== 4
              ? item.color
              : '',
          color: element.labelBg.style !== 0 ? item.fontColor : '',
          padding:
            element.labelBg.style !== 0 &&
            item.color &&
            element.dropDownStyle !== 4
              ? '8rpx 14rpx'
              : '',
        },
      ]"
    >
      <span
        v-if="element.dropDownStyle === 4"
        class="dot"
        :style="[
          {
            backgroundColor: element.dropDownStyle === 4 ? item.color : '',
          },
        ]"
      ></span>
      <span
        class="listLabel__icon"
        v-if="element.enableDictIcon && item.icon && item.icon.icon"
      >
        <label-icon
          :name="item.icon.icon"
          :color="item.icon.color"
          customPrefix="iconfont"
          :size="labelSize + 6"
        ></label-icon>
      </span>
      {{ item.label }}
      <span v-if="index < showVFormat.length - 1">,</span>
    </span>
  </view>
</template>

<script>
import LabelIcon from '@/menuConfigure/components/MenuMain/LabelIcon';
import indexMixin from './indexMixin';

export default {
  components: { LabelIcon },

  mixins: [indexMixin],

  props: {
    showValue: [Object, Number, String, Boolean],
    // 是否溢出隐藏
    ellipsis: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {
    // 是否展示lable图标
    canShowLableIcon() {
      const { enableIcon, icon = {} } = this.element;
      if (!enableIcon) return;

      return icon.icon || icon.imageUrl;
    },
    // 是否仅包裹值,如果是字典或者多选，只包裹值
    onlyValue() {
      const { enableDict, enableMultiColumn, dropDownStyle } = this.element;
      if (dropDownStyle === 4) return false;
      return enableDict || enableMultiColumn;
    },
    labelSize() {
      const { size } = this.element.font;
      return size === 0 ? 14 : size;
    },
    // 是否为字典
    isDict() {
      return this.element.enableDict;
    },
    // 字典
    dictObj() {
      const { dictObj = {} } = this.element.dataSource;
      const dictName = dictObj.dictKey;

      const obj = {};
      if (this.isDict && dictName) {
        const list = this.$store.getters.getCurDict(dictName);
        list.forEach((item) => {
          obj[item.value] = item;
        });
      }
      return obj;
    },
    // 展示风格 1=正常；2=yyyy-MM-dd；3=yyyy-MM-dd hh:mm；4=千分位
    showType() {
      const { dataSource, timeShowType, numberShowType } = this.element;

      const { columnTypeDict } = dataSource;
      // 如果是时间类型的，并且有时间格式
      if (+columnTypeDict === 3 && timeShowType === 1) return 2;
      if (+columnTypeDict === 3 && timeShowType === 3) return 3;

      // 如果是整数或者小数类型，并且为千分位的
      if ([1, 4].includes(+columnTypeDict) && numberShowType === 2) return 4;

      return 1;
    },
    // 需要显示的值
    showV() {
      const { showValue, value } = this;
      const { dataSource, enableMultiColumn } = this.element;
      let V = value;
      // 是否要  || V
      if (dataSource.mainColumnInfo || enableMultiColumn) V = showValue;
      if (typeof V === 'number') V = `${V}`;

      // 如果是字典并且存在','，就认为是字典多选功能，需要分割
      const { isDict } = this;
      if (isDict && V && typeof V === 'string' && V.indexOf(',')) {
        V = V.split(',');
      }
      // 如果是多选值
      if (V && enableMultiColumn && typeof V === 'string') V = V.split(',');

      if (V && !Array.isArray(V)) V = [V];

      return V || [];
    },
    // 根据需要格式化显示值
    showVFormat() {
      const { showV = [], showType, isDict, dictObj } = this;

      const showArray =
        showV.length === 0 && this.isPreview ? [{ value: '', label: '模拟数据' }] : [];

      showV.forEach((v) => {
        let show = v;
        let vobj = { value: v };

        // 如果是字典并且为0，不显示
        if (isDict && +v === 0) return;

        // 如果是字典
        if (isDict) {
          const obj = dictObj[v] || {};
          vobj = { ...vobj, ...obj };
          show = obj.name || '';
        }

        if (showType === 2) show = v.toString().slice(0, 10);
        else if (showType === 3) show = v.toString().slice(0, 16);
        else if (showType === 4) {
          let inputValue = show.toString();
          const index = inputValue.indexOf('.');
          if (index !== -1) {
            const intNum = inputValue.substring(0, index).replace(/\B(?=(?:\d{3})+$)/g, ',');
            const dot = inputValue.substring(index, inputValue.length);
            inputValue = intNum + dot;
          } else {
            inputValue = inputValue
              .substring(0, inputValue.length)
              .replace(/\B(?=(?:\d{3})+$)/g, ',');
          }
          show = inputValue;
        }
        vobj.value = v;
        vobj.label = show || v;
        showArray.push(vobj);
      });

      return showArray;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.listLabel {
  .valueBg {
    padding: 8rpx 10rpx;
  }
  .dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
  }
  &.ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .listLabel__value {
      white-space: nowrap;
      text-overflow: ellipsis;
      display: inline-block;
      overflow: hidden;
    }
  }
  &.wrap {
    flex-wrap: wrap;
    .listLabel__value {
      word-wrap: break-word;
      overflow: hidden;
    }
  }
  &__icon {
    margin-right: 14rpx;
    flex-shrink: 0;
  }

  &__value {
    // line-height: 18px;
    display: inline-flex;
    align-items: center;
  }

  .type {
    display: flex;
    align-items: center;
    &__icon {
      margin-right: 14rpx;
      flex-shrink: 0;
    }
  }
}
</style>
