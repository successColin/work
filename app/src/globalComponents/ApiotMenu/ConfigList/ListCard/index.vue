<!--
 * @Author: sss
 * @Date: 2021-12-09 19:21:47
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-09 19:21:47
 * @Desc: 卡片
-->
<template>
  <u-transition mode="fade" :show="show" :duration="300">
    <view class="transition">
      <view class="listCard" @click.stop="clickCard">
        <view v-if="hasCardIcon" class="listCard__left">
          <label-icon
            v-if="getCardIcon && getCardIcon.icon"
            :name="getCardIcon.icon"
            :color="getCardIcon.color"
            customPrefix="iconfont"
            :size="31"
          ></label-icon>
        </view>
        <view class="listCard__right">
          <view
            class="listCard__item"
            :class="[el.width === '50%' ? 'half' : 'full']"
            :style="[fontStyle(el)]"
            v-for="el in elementsShow"
            :key="el.compId"
          >
            <view
              class="label"
              :class="[el.alignStyle === 2 ? 'labelRight' : '']"
            >
              <span
                class="label__icon"
                v-if="el.enableIcon && (el.icon.icon || el.icon.imageUrl)"
                :style="{
                  width: `${el.font.size + 6}px`,
                  height: `${el.font.size + 6}px`,
                }"
              >
                <label-icon
                  :name="el.icon.icon || el.icon.imageUrl"
                  :color="el.icon.color"
                  customPrefix="iconfont"
                  :size="el.font.size + 6"
                ></label-icon>
              </span>
              <span class="label__title" v-if="el.showLabelTitle"
                >{{ el.name }}：</span
              >
              <types-column
                v-if="el.enableDict"
                :value="value[el.compId] || ''"
                :typesPropName="el.dataSource.dictObj.dictKey"
                :hornType="el.labelBg.style"
                :size="el.font.size + 6"
                :enableDictIcon="el.enableDictIcon"
              ></types-column>
              <span class="label__value" v-else>{{
                value | filterValue(el)
              }}</span>
            </view>
          </view>
        </view>
        <i
          v-if="canDesign"
          class="listCard__checkbox"
          :class="[
            checked
              ? `appIcon appIcon-a-fuxuankuangxuanzhong themeColor__font-${getThemeIndex}`
              : 'nochecked',
          ]"
          @click.stop="checkedItem"
        ></i>
      </view>
      <view class="btnsArea" v-if="btnsElement">
        <card-btn :btnObj="btnsElement" :featureArr="featureObj"></card-btn>
      </view>
    </view>
  </u-transition>
</template>

<script>
import LabelIcon from '../../Common/LabelIcon';
import TypesColumn from './TypesColumn';
import CardBtn from '../CardBtn';

export default {
  inject: ['selectDataConfig', 'getTriggers', 'initCardStart'],
  components: { LabelIcon, TypesColumn, CardBtn },

  props: {
    // 值
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    functionArea: {
      type: Object,
      default() {
        return {};
      }
    },
    // 控件列表
    elements: {
      type: Array,
      default() {
        return [
          {
            name: '',
            compId: '',
            canShow: true, // 是否可见
            singleStatus: 1, // 1-显示 2-禁用 3-只读 4-隐藏
            showLabelTitle: true, // 是否显示标题
            enableDict: false, // 是否为字典
            enableMultiColumn: false, // 是否多选
            dataSource: {}, // 数据来源
            font: {}, // 字体样式
            labelBg: {} // 背景样式
          }
        ];
      }
    },
    // 是否展示鱼骨架
    showSkeleton: {
      type: Boolean,
      default: true
    },
    // 加载状态
    isLoading: {
      type: Boolean,
      default: true
    },
    // 是否启用卡片图标
    hasCardIcon: {
      type: Boolean,
      default: false
    },
    // 图标来源控件id
    icon: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 0
    },
    // 唯一标识
    checkFlagId: String,
    // 选择列表
    checkList: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否可以编辑
    canDesign: Boolean
  },

  data() {
    return {
      show: false,
      // 初始化的信息
      featureObj: null
    };
  },

  filters: {
    filterValue(data, el) {
      const { compId, dataSource } = el;
      let value = data[compId];
      if (dataSource.mainColumnInfo) value = data[`${compId}_`];
      return value;
    }
  },

  computed: {
    // 控件对象，用于初始化触发器
    elementsObj() {
      const { elements, hasBtnsArea } = this;
      const obj = {};
      elements.forEach((el) => {
        obj[el.compId] = el;
      });
      if (hasBtnsArea) {
        const { btnsElement } = this;
        btnsElement.children.forEach((el) => {
          obj[el.compId] = { ...el };
        });
      }
      return obj;
    },
    triggerMap() {
      return this.getTriggers() || {};
    },
    // 控件对应的各种类型触发器
    elementTrigers() {
      const { triggerMap, elements } = this;
      const initTriggers = triggerMap[1] || {};
      const valueChangeTrigger = triggerMap[2] || {};
      const clickTrigger = triggerMap[3] || {};
      const obj = {
        initTriggers: {},
        valueChangeTrigger: {},
        clickTrigger: {}
      };
      elements.forEach((el) => {
        const { compId } = el;
        if (initTriggers[compId]) obj.initTriggers[compId] = initTriggers[compId];
        if (valueChangeTrigger[compId]) obj.valueChangeTrigger[compId] = valueChangeTrigger[compId];
        if (clickTrigger[compId]) obj.clickTrigger[compId] = clickTrigger[compId];
      });
      return obj;
    },
    // 是否有卡片区按钮
    hasBtnsArea() {
      const { elements } = this;
      const [btnEle] = elements;
      if (btnEle.compName === 'BtnsArea') return true;
      return false;
    },
    // 卡片显示控件
    cardElementList() {
      const { hasBtnsArea } = this;
      if (!hasBtnsArea) return this.elements;
      const elements = [...this.elements];
      elements.splice(0, 1);
      return elements;
    },
    // 按钮控件
    btnsElement() {
      const { hasBtnsArea, featureObj } = this;
      if (!hasBtnsArea) return null;
      const [btnEle] = this.elements;
      if (!featureObj) return { ...btnEle };
      console.log('featureObj===========================');
      console.log(featureObj);
      const btns = { ...btnEle };
      const children = [];
      btns.children.forEach((btn) => {
        let comp = featureObj.children[btn.compId] || {};
        comp = { ...btn, ...comp };
        if (comp.canShow) children.push(comp);
      });
      if (children.length === 0) return null;
      btns.children = children;
      return btns;
    },
    // 筛选出显示的控件
    elementsShow() {
      const { cardElementList: elements, featureObj = {} } = this;
      const { children = {} } = featureObj;
      return (
        elements.filter((el) => {
          let comp = children[el.compId] || {};
          comp = { ...el, ...comp };
          return comp.canShow;
        }) || []
      );
    },
    getComp() {
      const { elements, checkFlagId } = this;
      return elements.find((item) => item.name === checkFlagId);
    },
    checked() {
      if (this.canDesign) {
        const { checkList, value, getComp, checkFlagId } = this;
        if (!checkFlagId) return;
        const { compId } = getComp;
        const index = checkList.findIndex((item) => `${item[compId]}` === `${value[compId]}`);
        return index !== -1;
      }
      return false;
    },
    getCardIcon() {
      if (this.showSkeleton) return;
      const { hasCardIcon, icon = {}, elements, value } = this;
      const { icon: iconCompId, color } = icon;
      if (!hasCardIcon || !iconCompId) return;
      // 如果没有颜色控件的话
      const colorCompId = color || iconCompId;

      const iconEl = elements.find((el) => el.compId === iconCompId) || '';
      const colorEl = elements.find((el) => el.compId === colorCompId) || '';
      if (!iconEl) return;

      const { dictKey: iconDictKey } = iconEl.dataSource.dictObj;
      const { dictKey: colorDictKey } = colorEl.dataSource.dictObj;
      const iconValue = value[iconEl.compId] || '';
      const colorValue = value[colorEl.compId] || '';
      const iconDictValues = this.$store.getters.getCurDict(iconDictKey);
      let colorDictValues = {};
      if (iconDictKey === colorDictKey) colorDictValues = [...iconDictValues];
      else colorDictValues = this.$store.getters.getCurDict(colorDictKey);
      const iconDictValue = iconDictValues.find((dic) => dic.value === iconValue) || { icon: {} };
      const colorDictValue = colorDictValues.find((dic) => dic.value === colorValue) || {
        icon: {}
      };
      return { icon: iconDictValue.icon.icon, color: colorDictValue.icon.color };
    },
    // 字体样式
    fontStyle() {
      return function (el) {
        const { font, labelBg, dataSource, enableDict, enableMultiColumn } = el;
        const { size, color, style } = font;
        const { color: bgColor, style: bgStyle } = labelBg;
        const { relateName } = dataSource;
        const fontWeight = style === 1 ? '' : 'bold';
        // 背景样式
        const bgObj = {};
        // 是否为整行的背景，如果不是主表，或者是枚举，或者是多选都不为整行背景
        let showWoleLine = false;
        if (relateName === '主表' && !enableDict && !enableMultiColumn) showWoleLine = true;
        // bgStyle 0-没有背景 1-圆角 2-椭圆
        if (bgStyle !== 0 && showWoleLine) {
          bgObj.backgroundColor = bgColor;
          bgObj.padding = '8rpx 10rpx';
          if (bgStyle === 1) bgObj.borderRadius = '8rpx';
          else if (bgStyle === 2) bgObj.borderRadius = '100px';
        } else {
          bgObj.paddingLeft = '10rpx';
        }
        return {
          fontSize: `${size}px`,
          color,
          fontWeight,
          ...bgObj
        };
      };
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    // 初始化卡片区，需要判断触发器
    initCard() {
      // 获取触发器
      const { elementTrigers, value, functionArea, elementsObj } = this;
      const { compId: formId } = functionArea;
      // const triggerMap = this.getTriggers();
      const { initTrigger } = elementTrigers;
      const { valueChangeTrigger } = elementTrigers;
      const triggers = { ...initTrigger, ...valueChangeTrigger };
      // 如果没有触发器
      let res = {
        form: value,
        children: {}
      };
      console.log('initCard==========================');
      if (JSON.stringify(triggers) !== '{}') {
        console.log('initCard==========================1');
        res = this.initCardStart(triggers, value, formId, elementsObj);
      }
      const { form, compObj: children } = res;
      console.log(res);
      this.featureObj = {
        form,
        children: children || {},
        formId
      };
    },
    // 点击卡片
    clickCard() {
      this.$emit('clickCard');
    },
    checkedItem() {
      let check = [...this.checkList];
      const { getComp, value } = this;
      const { compId } = getComp;
      const index = check.findIndex((item) => `${item[compId]}` === `${value[compId]}`);
      if (index === -1) {
        const selectDataConfig = this.selectDataConfig();
        // 是否多选
        if (selectDataConfig.multiple) check.push(value);
        else check = [value];
      } else check.splice(index, 1);
      this.$emit('update:checkList', check);
      this.$emit('checkedCard', value, check);
    }
  },

  created() {
    this.initCard();
    // if (this.index) {
    //   const tiemout = setTimeout(() => {
    //     this.show = true;
    //     clearTimeout(tiemout);
    //   }, this.index * 300);
    // } else {
    //   this.show = true;
    // }
    this.show = true;
    if (this.check) this.$emit('update:checkList', this.value);
  }
};
</script>

<style lang='scss' scoped>
.btnsArea {
  padding-bottom: 12rpx;
  box-shadow: inset 0 1rpx 0 0 #e9e9e9;
}
.listCard {
  position: relative;
  // background: #ffffff;

  padding: 30rpx 20rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  &__checkbox {
    position: absolute;
    top: 0;
    right: 0;
    padding: 30rpx;
    font-size: 16px;
    &.nochecked {
      &::after {
        content: '';
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
      }
    }
  }

  &__left {
    flex-shrink: 0;
    width: 31px;
    height: 31px;
    margin-right: 30rpx;
  }

  &__right {
    flex: 1;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
  }
  &__item {
    box-sizing: border-box;
    margin-bottom: 12rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    color: #333333;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
    &.half {
      flex: 0 0 calc(50%);
    }
    &.full {
      flex: 0 0 calc(100%);
    }
    .label {
      width: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &.labelRight {
        justify-content: flex-end;
      }
      &__icon {
        margin-right: 14rpx;
        flex-shrink: 0;
      }
      &____title {
        flex-shrink: 0;
      }
      &__value {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 18px;
      }
    }
  }
}
</style>
