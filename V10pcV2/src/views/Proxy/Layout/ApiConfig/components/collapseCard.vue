/**
* @name: formCard
* @author: DELL
* @date: 2023/2/21 10:55
* @description：formCard
* @update: 2023/2/21 10:55
*/
<!-- 页面 -->
<template>
  <el-collapse v-model="activeNames" class="myCollapse">
    <el-collapse-item :name="1">
      <template slot="title">
        <slot name="title"></slot>
      </template>
      <slot></slot>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  data() {
    return {
      activeNames: 1
    };
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'formCard',
};
</script>

<style lang='scss' scoped>
.myCollapse {
  border-top: none !important;
  border-bottom: none !important;

  ::v-deep {
    .el-collapse-item__content{
      padding-bottom: 0;
    }
    .el-collapse-item__header {
      height: 40px;
      padding-left: 10px;
      background: #FAFAFA;
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      border-radius: 4px;
      //border-bottom: none;
      &.is-active{
        border-radius: 4px 4px 0 0;
        border-bottom: 1px solid #EBEBEB;
      }
    }
    .el-collapse-item__wrap {
      border-radius: 4px;
    }

    .el-collapse-item:last-child {
      border-top: 1px solid #EBEBEB;
      border-left: 1px solid #EBEBEB;
      border-right: 1px solid #EBEBEB;
      border-radius: 4px;
    }
    .el-collapse-item__arrow {
      color: #BBC3CD;
    }
  }

}
</style>
