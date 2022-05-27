<template>
  <el-dropdown class="moreFormButton m-l-10">
    <apiot-button>
      <i class="iconfont icon-qita m-r-4"></i>更多操作</apiot-button
    >
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item
        v-for="child in moreOperateArr"
        :key="child.compId"
        class="moreFormButton__dropdown"
        ><component
          :key="child.compId"
          :is="child.compName"
          :configData="child"
          v-bind="$attrs"
        ></component
      ></el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    moreOperateArr: {
      type: Array
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.moreFormButton {
  .icon-qita {
    color: $--color-primary;
  }
}
</style>
<style lang='scss'>
.moreFormButton__dropdown {
  margin-top: 8px;
  &:first-child {
    margin-top: 0px;
  }
  .formButton {
    margin-left: 0;
    display: flex;
    align-items: center;
  }
}
</style>
