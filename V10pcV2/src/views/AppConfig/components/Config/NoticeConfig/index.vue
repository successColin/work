<template>
  <section class="menuConfig config">
    <div class="config__header">公告配置</div>
    <div class="config__body">
      <h2 class="config__body--head">滚动速度</h2>
      <el-select class="config__body--select" v-model="activeObj.rotateSpeed">
        <el-option :value="3" label="3s"></el-option>
        <el-option :value="4" label="4s"></el-option>
        <el-option :value="5" label="5s"></el-option>
        <el-option :value="6" label="6s"></el-option>
        <el-option :value="7" label="7s"></el-option>
      </el-select>
      <h2 class="config__body--head">滚动类型</h2>
      <el-select class="config__body--select" v-model="activeObj.rotateType">
        <el-option :value="1" label="横向滚动"></el-option>
        <el-option :value="2" label="纵向滚动"></el-option>
      </el-select>
      <h2 class="config__body--head">展示风格</h2>
      <el-select class="config__body--select" v-model="activeObj.style">
        <el-option :value="1" label="普通风格"></el-option>
      </el-select>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    activeObj: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  created() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
</style>
