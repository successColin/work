<template>
  <section class="menuConfig config">
    <div class="config__header">行业资讯</div>
    <div class="config__body">
      <h2 class="config__body--head">名称</h2>
      <apiot-input
        v-model="activeObj.name"
        @focus="nameFocus"
        @blur="nameBlur"
      ></apiot-input>
      <h2 class="config__body--head">筛选</h2>
      <el-select class="config__body--select" v-model="activeObj.term">
        <el-option :value="1" label="全部资讯"></el-option>
      </el-select>
      <h2 class="config__body--head">时间区间</h2>
      <el-select class="config__body--select" v-model="activeObj.time">
        <el-option :value="1" label="近一个月"></el-option>
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

  methods: {
    nameFocus() {
      this.activeObj.backName = this.activeObj.name;
    },
    nameBlur() {
      if (!this.activeObj.name) {
        this.activeObj.name = this.activeObj.backName;
      }
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../config.scss';
</style>
