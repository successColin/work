<!--
 * @Author: sss
 * @Date: 2022-02-22 08:46:38
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-22 08:46:38
 * @Desc: 树节点
-->
<template>
  <view>
    <view v-for="(item, index) in list" :key="index" class="treeItem">
      <normal-node
        :value="item | nodeFormat(elements)"
        :icon="item | treeIcon"
        :showContent="item | nodeName(linkSymbol)"
        :checkList="checkList"
        :flag="getFlag"
        :canSel="item.dataType !== '1'"
        customPrefix="appIcon"
        @checked="checkedNode"
        @unChecked="unCheckedNode"
        @click="clickItem"
      ></normal-node>
    </view>
  </view>
</template>

<script>
import NormalNode from '../NormalNode';

export default {
  components: { NormalNode },
  inject: ['selectDataConfig'],

  filters: {
    // 树图标
    treeIcon(value) {
      const { dataType } = value;
      const icon = {
        name: 'appIcon-shebei',
        color: '#34C7BE'
      };
      // 如果是位置
      if (dataType === '1') {
        icon.name = 'appIcon-weizhi';
        icon.color = '#5A80ED';
      }
      return icon;
    },
    nodeName(value, linkSymbol) {
      const cloumns = ['name', 'keycode'];
      let str = '';
      cloumns.forEach((key) => {
        if (!str) str = `${value[key]}`;
        else str += `${linkSymbol}${value[key]}`;
      });
      return str;
    },
    nodeFormat(value, elements) {
      const obj = {};
      elements.forEach((comp) => {
        obj[comp.compId] = value[comp.dataSource.columnName];
      });

      return { ...value, ...obj };
    }
  },

  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    // 连接符
    linkSymbol: {
      type: String,
      default: '-'
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
    canDesign: Boolean,
    elements: Array
  },

  data() {
    return {};
  },

  computed: {
    // 获取唯一标识，用于选中状态的确认
    getFlag() {
      const comp = this.elements.find((el) => el.dataSource.columnName === this.checkFlagId) || {};
      return comp.compId;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
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
  &__left {
    margin-right: 20rpx;
  }
  &__right {
    flex: 1;
  }
}
</style>
