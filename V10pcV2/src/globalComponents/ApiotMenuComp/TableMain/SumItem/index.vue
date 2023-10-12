<template>
  <div
    class="sumItem"
    :class="[
      { type1: sumType === 1 },
      { type1Spilt: sumType === 1 && index !== length - 1 },
      { type2: sumType === 2 },
      { type2Spilt: sumType === 2 && index !== length - 1 },
      { active: index === activeSumIndex },
    ]"
    @click="selectItem"
  >
    <p class="type1__name" v-if="sumType === 1">{{ item.name }}</p>
    <p class="type1__num" v-if="sumType === 1" :style="`color:${item.color}`">
      {{ item.value || 0 }}
    </p>
    <p class="type2__content" v-if="sumType === 2">
      {{ item.name }}(<span :style="`color:${item.color}`">{{
        item.value || 0
      }}</span
      >)
    </p>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    sumType: {
      type: Number,
    },
    item: {
      type: Object,
    },
    index: {
      type: Number,
    },
    length: {
      type: Number,
    },
    activeSumIndex: {
      type: Number,
    },
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    selectItem() {
      this.$emit('update:activeSumIndex', this.index);
      this.$emit('selectSumItem', this.item);
    },
  },
};
</script>

<style lang="scss" scoped>
.sumItem {
  color: #666666;
  font-size: 13px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 18px;
  cursor: pointer;
  &:hover {
    background-color: $--hover-color !important;
  }
  &.active {
    color: $--color-primary;
    background-color: $--hover-color !important;
  }
  &.type1 {
    height: 46px;
    padding: 0 27px;
    border-radius: 4px;
    &.type1Spilt {
      margin-right: 21px;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        width: 1px;
        height: 30px;
        right: -10px;
        top: 8px;
        background-color: #e9e9e9;
      }
    }
    .type1__name {
      margin-top: 5px;
    }
    .type1__name,
    .type1__num {
      text-align: center;
    }
  }
  &.type2 {
    height: 36px;
    padding: 9px 18px;
    background: #f6f6f8;
    border-radius: 21px;
    box-sizing: border-box;
    &.type2Spilt {
      margin-right: 10px;
    }
  }
}
</style>
