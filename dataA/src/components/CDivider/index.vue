/**
* @name: index
* @author: DELL
* @date: 2022/1/25 16:23
* @description：index
* @update: 2022/1/25 16:23
*/
<!-- 页面 -->
<template>
  <div class="cDividerWrap" :class="{[type]:true}">
    <el-divider
        v-bind="$attrs"
        v-on="$listeners"
    >{{ text }}
    </el-divider>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default() {
        return '';
      }
    },
    type: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.dashed {
  ::v-deep {
    .el-divider--horizontal {
      display: block;
      width: 100%;
      margin: 8px 0;
      background: 0 0;
      border-top: 1px dashed #2F437F;

    }
  }
}
</style>
