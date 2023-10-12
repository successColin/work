<template>
  <section class="menuBox">
    <transition-group name="slide-left">
      <ApiotMenu
        v-for="(configData, key) in allConfigObj"
        :key="configData[0].id"
        :curConfigData="configData"
        v-show="+key === +$route.params.id"
      ></ApiotMenu
    ></transition-group>
  </section>
</template>

<script>
import { getDesignMenu } from '@/api/menuConfig';
import ApiotMenu from '../ApiotMenu';

export default {
  name: 'MneuBox',
  data() {
    return {
      allConfigObj: {},
      showSkeleton: false
    };
  },
  components: {
    ApiotMenu
  },
  mounted() {
    if (!this.allConfigObj[this.$route.params.id || this.$route.query.menuId]) {
      this.getDesignMenu(this.$route.params.id || this.$route.query.menuId);
    }
  },
  methods: {
    // 获取所有设计
    async getDesignMenu(menuId) {
      const data = await getDesignMenu({ sysMenuId: menuId });
      // this.allConfigObj[menuId] = data;
      this.$set(this.allConfigObj, menuId, data);
      console.log(this.allConfigObj, this.$route.params.id);
    }
  },
  watch: {
    $route(v) {
      if (!this.allConfigObj[v.params.id || v.query.menuId]) {
        this.getDesignMenu(v.params.id || v.query.menuId);
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.menuBox {
  position: relative;
}
</style>
