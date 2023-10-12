<template>
  <div
    class="funcGroup comp"
    @click.stop="selectActive"
    :class="[{ borderLight: config.compId === activeObj.compId }]"
  >
    <ul class="funcGroup__ul" v-if="config.menuArr.length">
      <AppMenu
        :class="`funcGroup__li funcGroup__li--${config.rowNum} ${
          config.isFooter ? 'isFooter' : ''
        }`"
        :activeObj="activeObj"
        :configData="configData"
        :parentKey="parentKey"
        :config="menu"
        :groupObj="config"
        :i="i"
        v-for="(menu, i) in config.menuArr"
        :key="menu.compId"
      ></AppMenu>
    </ul>
    <p v-else>分组区</p>
  </div>
</template>

<script>
import compMixin from '../comp';
import AppMenu from '../AppMenu';

export default {
  mixins: [compMixin],
  data() {
    return {};
  },

  components: {
    AppMenu,
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../comp.scss';
.funcGroup {
  p {
    text-align: center;
    height: 134px;
    line-height: 134px;
    font-size: 13px;
    font-weight: 400;
    color: #aaaaaa;
  }
  &__ul {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 14px;
  }
  &__li {
    height: 80px;
  }
  &__li--1 {
    flex: 0 0 100%;
  }
  &__li--2 {
    flex: 0 0 50%;
  }
  &__li--3 {
    flex: 0 0 33.33%;
  }
  &__li--4 {
    flex: 0 0 25%;
    width: 25%;
  }
  &__li--5 {
    flex: 0 0 20%;
    width: 20%;
  }
  .isFooter {
    flex: 1;
    height: 68px;
  }
}
</style>
