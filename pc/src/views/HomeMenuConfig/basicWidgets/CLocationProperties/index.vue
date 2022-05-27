/**
* @name: index
* @author: DELL
* @date: 2021/11/18 14:14
* @description：index
* @update: 2021/11/18 14:14
*/
<!-- 页面 -->
<template>
  <div class="propsSetting">
    <p class="setTitle">位置属性</p>
    <div class="InputWrap">
      <el-input-number
        style="margin-right: 10px"
        lable="宽:"
        controls-position="right"
        :value="widthValue"
        @change="(value) => changeTitle(Number(value), 'width')"
      />
      <el-input-number
        lable="高:"
        controls-position="right"
        :value="heightValue"
        @change="(value) => changeTitle(Number(value), 'height')"
      />
    </div>
    <div class="InputWrap">
      <el-input-number
        style="margin-right: 10px"
        lable="左:"
        controls-position="right"
        :value="leftValue"
        @change="(value) => changeTitle(Number(value), 'left')"
      />
      <el-input-number
        lable="上:"
        controls-position="right"
        :value="topValue"
        @change="(value) => changeTitle(Number(value), 'top')"
      />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    widthValue: {
      type: Number
    },
    heightValue: {
      type: Number
    },
    leftValue: {
      type: Number
    },
    topValue: {
      type: Number
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    changeTitle(value, key) {
      this.$emit('changeTitle', { value, key });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.propsSetting {
  margin-bottom: 10px;
  .setTitle {
    font-size: 13px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 30px;
  }

  .InputWrap {
    display: flex;
    margin-top: 5px;
    align-items: center;
    justify-content: space-between;

    ::v-deep {
      .CInputWrap {
        width: 100%;
        display: flex;
        flex: 0 0 calc(50% - 8px);
        align-items: center;

        .inputBox {
          width: 100px;

          .el-input-number {
            width: 100px;

            .el-input__inner {
              padding-left: 15px;
              padding-right: 20px;
            }

            .el-input-number__decrease,
            .el-input-number__increase {
              width: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
