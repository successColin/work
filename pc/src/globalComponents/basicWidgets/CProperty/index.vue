/**
* @name: CPropertyTabs
* @author: DELL
* @date: 2021/11/29 15:38
* @description：CPropertyTabs
* @update: 2021/11/29 15:38
*/
<!-- 页面 -->
<template>
  <el-radio-group
    class="alignWrap1"
    v-on="$listeners"
    v-bind="$attrs"
    size="mini"
  >
    <el-radio-button
      :style="getStyles"
      :label="item.key"
      v-for="item in tabArr"
      :key="item.key"
    >
      {{ item.label }}
    </el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    tabArr: {
      type: Array,
      default() {
        return [
          {
            label: '配置',
            key: 'propertyConfig',
            compName: 'propertyConfig'
          },
          {
            label: '数据',
            key: 'dataConfig',
            compName: 'dataConfig'
          },
          {
            label: '动效',
            key: 'animationConfig',
            compName: 'animationConfig'
          }
        ];
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getStyles() {
      const n = this.tabArr.length;
      return `width: calc(100% / ${n});`;
    }
  },

  mounted() {},

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.alignWrap1 {
  width: 100%;
  display: flex;

  ::v-deep {
    .el-radio-button {
      &.is-active {
        .el-radio-button__inner {
          background: $component-borderFocus-color !important;
          border-color: $component-borderFocus-color !important;
        }
      }

      .el-radio-button__inner {
        width: 100%;
        padding: 8px 15px;
        font-size: 13px;
        border-radius: 0;
        color: #333;
        border-color: #e9e9e9;
        background: $component-background-color;
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: $component-background-color;
        font-size: 13px;
        color: #ffffff;
        opacity: 1;
      }

      .el-radio-button__inner:hover {
        background: #edf3fe;
        border-color: #c8dcfc;
      }
      &:first-child {
        .el-radio-button__inner{
          border-bottom-left-radius: 4px;
          border-top-left-radius: 4px;
        }
      }
      &:last-child .el-radio-button__inner {
        border-radius: 0 4px 4px 0;
      }
    }
  }
}
</style>
