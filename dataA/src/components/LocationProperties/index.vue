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
    <p class="setTitle">{{title}}</p>
    <div class="InputWrap">
      <c-input
          lable="宽:"
          type="number"
          :numberValue="widthValue"
          @Input-Change="(value) => changeTitle(Number(value), widthKey)"/>
      <c-input
          lable="高:"
          type="number"
          :numberValue="heightValue"
          @Input-Change="(value) => changeTitle(Number(value), heightKey)"/>
    </div>
    <div class="InputWrap">
      <c-input
          lable="左:"
          type="number"
          :numberValue="leftValue"
          @Input-Change="(value) => changeTitle(Number(value), leftKey)"/>
      <c-input
          lable="上:"
          type="number"
          :numberValue="topValue"
          @Input-Change="(value) => changeTitle(Number(value), topKey)"/>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    widthKey: {
      type:String,
      default: 'width'
    },
    heightKey: {
      type:String,
      default: 'height'
    },
    leftKey: {
      type: String,
      default: 'left'
    },
    topKey: {
      type: String,
      default: 'top'
    },
    title: {
      type:String,
      default: '位置属性'
    },
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
      this.$emit('changeTitle', {value, key});
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.propsSetting {
  margin-bottom: 10px;
  .setTitle {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 30px;
    text-align: left;
    opacity: .7;
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

            .el-input-number__decrease, .el-input-number__increase {
              width: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
