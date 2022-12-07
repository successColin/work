/**
* @name: index
* @author: DELL
* @date: 2021/12/22 14:34
* @description：index
* @update: 2021/12/22 14:34
*/
<!-- 页面 -->
<template>
  <div class="cSliderWrap">
    <div class="sliderWrap">
      <el-slider
          v-bind="$attrs"
          :value="value"
          @input="change"
      >
      </el-slider>
    </div>
    <div class="inputWrap">
      <c-input
          v-bind="$attrs"
          type="number"
          :numberValue="value"
          @Input-Change="(val) => change(val)"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number
    }
  },
  data() {
    return {
      newValue: null
    };
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    change(value) {
      this.$emit('change', value);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.cSliderWrap {
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sliderWrap {
    flex: 0 0 160px;
    margin: 0 10px;
  }

  .inputWrap {
    flex: 1;

    ::v-deep {
      .el-input-number.is-controls-right .el-input__inner {
        padding-right: 0;
      }
    }
  }
}
</style>
