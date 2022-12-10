<template>
  <div class="page">
    <div class="page__content">
      <header>头</header>
      <div class="content">
        <template v-for="(item, index) in list">
          <list-item
            v-if="index < notI && notI !== -1"
            :key="index"
            :value="item"
            :index="index"
            @cannotContent="cannotContent"
          ></list-item>
        </template>
      </div>
      <footer>未必</footer>
    </div>
    <template></template>
  </div>
</template>

<script>
import listItem from './listItem.vue';

export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 不能容纳的行数
      notI: -1
    };
  },
  components: {
    listItem
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    cannotContent({ i }) {
      this.notI = i;
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
