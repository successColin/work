<!-- 页面 -->
<template>
  <div class="pathAllWrap">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item v-for="item in pathArr" :key="item.id">
        <span
          class="pathAllWrap__path"
          :class="{ active: item.id === pathArr[pathArr.length - 1].id }"
          @click="changes(item)"
          >{{ item.id === 'all' ? $t('knowledge.all') : item.name }}</span
        >
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: {
    pathArr: {
      type: Array,
      defalut: [
        {
          name: '全部',
          id: 'all'
        }
      ]
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    changes(item) {
      this.$emit('changePath', item);
    }
  },
  name: 'filePath'
};
</script>

<style lang='scss' scoped>
.pathAllWrap {
  float: left;
  margin-top: 11px;

  .pathAllWrap__path {
    cursor: pointer;
  }

  .active {
    color: #aaaaaa;
  }

  ::v-deep {
    .el-breadcrumb__inner {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }
    .el-breadcrumb .el-breadcrumb__item:not(.el-breadcrumb__item:last-child):hover
    .el-breadcrumb__inner{
      color: #333333;
    }
  }
}
</style>
