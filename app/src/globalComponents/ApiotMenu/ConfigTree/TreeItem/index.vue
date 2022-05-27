<!--
 * @Author: sss
 * @Date: 2022-02-22 08:46:38
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-22 08:46:38
 * @Desc: 树节点1
-->
<template>
  <view>
    <view v-for="(item, index) in list" :key="index" class="treeItem">
      <normal-node
        :value="item"
        :icon="getCardIcon(item)"
        :showContent="item | nodeName(elementsShow, linkSymbol)"
        :checkList="checkList"
        :canSel="canDesign"
        :flag="getFlag"
        @checked="checkedNode"
        @unChecked="unCheckedNode"
        @click="clickItem"
      ></normal-node>
    </view>
  </view>
</template>

<script>
import NormalNode from '../../Common/NormalNode';

export default {
  components: { NormalNode },

  inject: ['selectDataConfig'],

  filters: {
    nodeName(value, elementsShow, linkSymbol) {
      let str = '';
      elementsShow.forEach((el) => {
        if (!str) str = `${value[el.compId]}`;
        else str += `${linkSymbol}${value[el.compId]}`;
      });
      return str;
    }
  },

  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    elements: Array,
    linkSymbol: {
      type: String,
      default: '-'
    },
    // 是否启用卡片图标
    canShowMainIcon: {
      type: Boolean,
      default: false
    },
    // 是否为卡片图标
    isDictIcon: {
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
    // 选择列表
    checkList: {
      type: Array,
      default() {
        return [];
      }
    },
    checkFlagId: String,
    // 是否可以编辑
    canDesign: Boolean
  },

  data() {
    return {};
  },

  computed: {
    // 筛选出显示的控件
    elementsShow() {
      const { elements } = this;
      return elements.filter((el) => el.singleStatus !== 4 && el.compName !== 'BtnsArea') || [];
    },
    getCardIcon() {
      return function (value) {
        const { icon = {}, elements, isDictIcon } = this;
        if (!isDictIcon) return { name: icon.icon || icon.imageUrl, color: icon.color };
        const { icon: iconCompId, color } = icon;

        if (!iconCompId) return;
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
        return { name: iconDictValue.icon.icon, color: colorDictValue.icon.color };
      };
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 获取唯一标识，用于选中状态的确认
    getFlag() {
      const comp = this.elements.find((el) => el.dataSource.columnName === this.checkFlagId) || {};
      return comp.compId;
    }
  },

  methods: {
    unCheckedNode(node, index) {
      const check = [...this.checkList];
      check.splice(index, 1);
      this.$emit('update:checkList', check);
      this.$emit('checkedCard', node, check);
    },
    checkedNode(node) {
      let check = [...this.checkList];
      const selectDataConfig = this.selectDataConfig();
      if (selectDataConfig.multiple) check.push(node);
      else check = [node];
      this.$emit('update:checkList', check);
      this.$emit('checkedCard', node, check);
    },
    // 点击
    clickItem(node, nodeName) {
      if (node.childCount === 0) return false;
      this.$emit('click', node, nodeName);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.treeItem {
  display: flex;
  align-items: center;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  margin: 0 30rpx;
}
</style>
