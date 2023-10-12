<template>
  <el-form-item label="状态">
    <el-button-group>
      <el-button
        v-if="showArr[0]"
        :class="[{ active: activeObj.singleStatus === 1 }]"
        @click="activeObj.singleStatus = 1"
        >普通</el-button
      >
      <el-button
        v-if="showArr[1]"
        :class="[{ active: activeObj.singleStatus === 2 }]"
        @click="activeObj.singleStatus = 2"
        >只读</el-button
      >
      <!-- <el-button
        v-if="false"
        :class="[{ active: activeObj.singleStatus === 3 }]"
        @click="activeObj.singleStatus = 3"
        >只读</el-button
      > -->
      <el-button
        v-if="showArr[2]"
        :class="[{ active: activeObj.singleStatus === 4 }]"
        @click="activeObj.singleStatus = 4"
        >隐藏</el-button
      >
    </el-button-group>
  </el-form-item>
</template>

<script>
export default {
  name: '',
  props: {
    activeObj: {
      type: Object
    },
    showArr: {
      type: Array,
      default: () => [true, true, true]
    }
  },
  data() {
    return {};
  },
  components: {}
};
</script>

<style lang='scss' scoped>
</style>
