/**
* @name: index
* @author: DELL
* @date: 2022/6/15 9:12
* @description：index
* @update: 2022/6/15 9:12
*/
<!-- 页面 -->
<template>
  <div class="breadcrumbWrap">
    <div
        v-for="(item, index) in pathArr"
        :key="index"
        :style="renderColor(index)"
        @click="change(item, index)"
    >
      <span>{{item.path_name}}</span>
      <i v-if="pathArr.length !== index + 1" class="el-icon-arrow-right
"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    pathArr: {
      type: Array,
      default() {
        return [];
      }
    },
    color: { // 颜色值
      type: String,
      default() {
        return '#666666';
      }
    }
  },
  components: {},

  computed: {
    renderColor() {
      return function (index) {
        const n = this.pathArr.length;
        if (n !== index + 1) {
          return {
            color: this.color,
            cursor: 'pointer'
          };
        }
        return {
          color: this.color,
          opacity: 0.65,
          cursor: 'pointer'
        };
      };
    }
  },

  mounted() {},

  methods: {
    change(item, index) {
      this.$emit('change', item, index);
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.breadcrumbWrap{
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
