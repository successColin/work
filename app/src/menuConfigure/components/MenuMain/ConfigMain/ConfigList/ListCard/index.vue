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
            v-for="(el, index) in elementsShow"
            class="listCard__item"
            :class="[
              el.width === '50%' ? 'half' : 'full',
              noMarginEL.indexOf(index) !== -1 ? 'noMargin' : '',
            ]"
            :key="el.compId"
          >
            <list-item-label
              v-if="el.compType === 15"
              :element="el"
              :value="value[el.compId]"
              :showValue="value[`${el.compId}_`]"
            ></list-item-label>
            <list-item-progress-bar
              v-else-if="el.compType === 22"
              :element="el"
              :value="value[el.compId]"
            ></list-item-progress-bar>
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
import LabelIcon from '../../../LabelIcon';
import CardBtn from '../CardBtn';
import ListItemLabel from './ListItem/ListItemLabel';
import ListItemProgressBar from './ListItem/ListItemProgressBar';

export default {
  inject: ['selectDataConfig', 'getTriggers', 'initCardStart'],
  components: { LabelIcon, CardBtn, ListItemLabel, ListItemProgressBar },

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
      const { compId, dataSource, timeShowType, numberShowType } = el;
      let value = data[compId];
      if (dataSource.mainColumnInfo) value = data[`${compId}_`];
      // 如果是时间类型的，并且有时间格式
      if (+dataSource.columnTypeDict === 3 && value) {
        if (timeShowType === 1) value = value.toString().slice(0, 10);
        else if (timeShowType === 3) value = value.toString().slice(0, 16);
      }

      // 如果是整数或者小数类型，并且为千分位的
      if ([1, 4].includes(+dataSource.columnTypeDict) && numberShowType === 2) {
        let inputValue = value.toString();
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
        value = inputValue;
      }
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
    // 判断没有margin的控件
    noMarginEL() {
      const { elementsShow } = this;
      const len = elementsShow.length;
      if (len <= 1) return [len - 1];
      const lastObj = elementsShow[len - 2];
      const secondObj = elementsShow[len - 2];
      if (lastObj.width === '50%' && secondObj.width === '50%') return [len - 1, len - 2];
      return [len - 1];
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
      if (JSON.stringify(triggers) !== '{}') {
        res = this.initCardStart(triggers, value, formId, elementsObj);
      }
      const { form, compObj: children } = res;
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
    color: #333333;
    font-size: $list-fontSize;
    width: 100%;
    margin-bottom: 12rpx;
    &.noMargin {
      margin-bottom: 0;
    }
    &.half {
      width: 50%;
    }
    &.full {
      flex: 0 0 calc(100%);
    }
  }
}
</style>
