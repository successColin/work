<!--
 * @Author: cmk
 * @Date: 2021-04-08 20:08:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-08 10:13:39
 * @Des: 分页器封装
-->
<template>
  <section class="pagination">
    <div class="pagination__selectedNum" v-show="selectedNum">
      <!-- 已选 {{ selectedNum }} 项 -->
      {{ $t('common.selectedNum', { num: selectedNum }) }}
      <span class="pagination__cancle" @click="handleCancle">{{
        $t('common.cancle')
      }}</span>
    </div>
    <el-pagination
      v-on="$listeners"
      v-bind="$attrs"
      background
      :layout="layout"
      :page-sizes="pageSizes"
      :page-size="size"
      @size-change="sizeChange"
    ></el-pagination>
  </section>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    selectedNum: {
      type: Number,
      default: 0
    },
    layout: {
      type: String,
      default: 'total,  prev, pager, next, sizes, jumper'
    },
    // 分页规则是否按照全局规则
    isSystem: {
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40]
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    // 是否需要遵守全局分页逻辑
    if (this.isSystem) {
      // 全局分页规则
      // 列表默认显示条数可以进行在全局进行设置，也可以手动调整（手动调整后会进行前端缓存记录）；优先级：手动调整>默认设置>10（如果没有设置，默认10）
      // todo 还未完成
      const size = 20;
      this.$emit('update:size', size);
    }
  },

  methods: {
    handleCancle() {
      this.$emit('handle-cancel');
    },
    sizeChange(size) {
      this.$emit('update:size', size);
      this.$emit('sizeChange', size);
    }
  }
};
</script>

<style lang='scss' scoped>
.pagination {
  position: relative;
  height: $--pagination--height;
  border-top: 1px solid #e9e9e9;
  box-shadow: 0px 1px 0px 0px #e9e9e9;
  box-sizing: border-box;
  background: #ffffff;
  z-index: 3;
  &__selectedNum {
    position: absolute;
    left: 36px;
    top: 0;
    bottom: 0;
    font-size: 13px;
    color: #666666;
    line-height: 41px;

    &::before {
      content: '';
      position: absolute;
      left: -24px;
      top: 12px;
      width: 16px;
      height: 16px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.15);
    }

    &::after {
      content: '';
      position: absolute;
      left: -20px;
      top: 16px;
      width: 8px;
      height: 8px;
      background: #4689f5;
    }
  }

  &__cancle {
    color: #4689f5;
    margin-left: 6px;
    cursor: pointer;
  }

  ::v-deep {
    .el-pagination {
      position: absolute;
      right: 0;
      padding: 6px 10px;
    }

    .el-pagination span:not([class*='suffix']),
    .el-pagination button {
      font-size: 13px;
      color: #666666;
    }

    .el-pagination__total {
      margin-right: 8px;
    }

    .el-pagination.is-background .btn-prev,
    .el-pagination.is-background .btn-next,
    .el-pagination.is-background .el-pager li {
      margin: 0 10px 0 0;
      width: 30px;
      height: 30px;
      box-sizing: border-box;
      background: #ffffff;
      border-radius: 2px;
      border: 1px solid #e9e9e9;
      font-weight: normal;
    }

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #fff;
      border-color: $--color-primary;
      color: $--color-primary;
    }

    .el-pagination .el-select .el-input {
      margin: 0;
    }

    .el-pagination__jump {
      margin-left: 6px;
    }
  }
}
</style>
