<!--
 * @Author: sss
 * @Date: 2022-02-22 10:19:30
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-22 10:19:30
 * @Desc: 树label
-->
<template>
  <view class="nodeLabel">
    <div class="nodeLabel__left" @click.stop="checkedItem">
      <i
        v-if="canSel"
        class="nodeLabel__left--checkbox"
        :class="[
          isChecked
            ? `appIcon appIcon-a-fuxuankuangxuanzhong themeColor__font-${getThemeIndex}`
            : 'nochecked',
        ]"
      ></i>
      <span class="nodeLabel__left--treeIcon" v-if="icon.name">
        <label-icon
          :customPrefix="customPrefix"
          :name="icon.name"
          :color="icon.color"
          :size="30"
        ></label-icon>
      </span>
      <span class="name 111">{{ showContent || '' }}</span>
    </div>
    <i
      v-if="value.childCount !== 0"
      class="appIcon appIcon-a-shujuxuanzejinru"
      @click.stop="clickNode()"
    ></i>
  </view>
</template>

<script>
import LabelIcon from '@/menuConfigure/components/MenuMain/LabelIcon';
import mpMixin from '@/mixin/mpMixin';

export default {
  components: { LabelIcon },

  mixins: [mpMixin],

  props: {
    // 序号
    index: Number,
    value: Object,
    showContent: String,
    // 已经选中的列表
    checkList: Array,
    // 唯一标识字段，用于选中判断时对应的字段
    flag: {
      type: String,
      default: 'id'
    },
    // 节点图标
    icon: Object,
    // 是否能进行选择
    canSel: Boolean,
    // 图标的前缀
    customPrefix: {
      type: String,
      default: 'iconfont'
    }
  },

  data() {
    return {};
  },

  computed: {
    isChecked() {
      if (this.canSel) {
        const { value, checkList, flag } = this;
        const index = checkList.findIndex((item) => `${item[flag]}` === `${value[flag]}`);
        return index !== -1;
      }
      return false;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    // 选中节点
    checkedItem() {
      if (!this.canSel) return;
      if (this.isChecked) this.$emit('unChecked', this.value, this.index);
      else this.$emit('checked', this.value, this.index);
    },
    // 点击
    clickNode() {
      this.$emit('click', this.value, this.showContent);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.nodeLabel {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  font-size: 16px;
  font-family: $--font-family;
  color: #333333;
  &__left {
    flex: 1;
    display: flex;
    align-items: center;

    &--treeIcon,
    &--checkbox {
      flex-shrink: 0;
      padding-right: 20rpx;
    }

    &--checkbox {
      font-size: 16px;
      &.nochecked {
        box-sizing: border-box;
        height: 16px;
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

    .name {
      flex: 1;
      overflow: hidden;
    }
  }

  .appIcon-a-shujuxuanzejinru {
    flex-shrink: 0;
    font-size: 24px;
    color: #bbc3cd;
  }
}
</style>
