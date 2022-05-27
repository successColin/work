<template>
  <div
    class="funcArea comp"
    @click.stop="selectActive"
    :class="[
      { borderLight: config.compId === activeObj.compId },
      { isFooter: config.isFooter },
    ]"
  >
    <ul class="funcArea__ul" v-if="config.groupArr.length">
      <li
        class="funcArea__li"
        v-for="item in config.groupArr"
        :key="item.compId"
      >
        <h2 class="funcArea__li--title" v-if="!config.isFooter">
          {{ item.name }}
        </h2>
        <func-group :config="item" :activeObj="activeObj"></func-group>
      </li>
    </ul>
    <p v-else>功能区</p>
  </div>
</template>

<script>
import compMixin from '../comp';
import FuncGroup from '../FuncGroup';

export default {
  mixins: [compMixin],
  data() {
    return {};
  },

  components: {
    FuncGroup
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../comp.scss';
.funcArea {
  &.isFooter {
    border: 0;
  }
  p {
    text-align: center;
    height: 178px;
    line-height: 178px;
    font-size: 13px;
    font-weight: 400;
    color: #aaaaaa;
  }
  &__li {
    border-bottom: 1px solid #e9e9e9;
    &--title {
      padding-left: 16px;
      height: 44px;
      line-height: 44px;
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
  }
}
</style>
