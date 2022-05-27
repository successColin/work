<template>
  <div class="">
    水印相关选项

    <el-select v-model="menuType" @change="changeMenuType">
      <el-option label="风格1" :value="1"></el-option>
      <el-option label="风格2" :value="2"></el-option>
      <el-option label="风格3" :value="3"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuType: 1
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    changeMenuType(v) {
      // console.log(v);
      this.$store.commit('changeMenuType', v);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
