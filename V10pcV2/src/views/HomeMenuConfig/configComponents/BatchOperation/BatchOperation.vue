/**
* @name: BatchOperation
* @author: DELL
* @date: 2023/1/10 15:29
* @description：BatchOperation
* @update: 2023/1/10 15:29
*/
<!-- 页面 -->
<template>
  <div class="config">
    <div class="config__title">批量操作</div>
    <div class="config__content">
      <div class="singleLineTextConfig">
        <el-form label-position="top">
          <el-form-item label="位置属性">
            <location-properties
                :widthValue="boxStyles.width"
                :heightValue="boxStyles.height"
                :leftValue="boxStyles.left"
                :topValue="boxStyles.top"
                @changeTitle="({value, key}) => changeTitle(value, key)"
            ></location-properties>
          </el-form-item>
          <el-form-item label="对齐方式">
            <el-radio-group
                class="alignWrap"
                size="mini"
                v-model="value"
            >
              <el-tooltip
                  effect="dark"
                  :content="item.tips"
                  v-for="item in alignIcon"
                  :key="item.eventName"
                  placement="top">
                <el-radio-button
                    :label="item.eventName"
                >
                  <span class="iconfont" :class="{ [item.icon]: true }"></span>
                </el-radio-button>
              </el-tooltip>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="图表操作">
            <apiot-button
                @click="batchDel"
            ><i class="iconfont icon-shanchu"></i> 批量删除
            </apiot-button>
          </el-form-item>
          <CDivider type="dashed"></CDivider>
          <el-form-item>
            <apiot-button
                type="danger"
                @click="layoutBatch"
            ><i class="iconfont icon-daochu"></i> 退出多选状态
            </apiot-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import deepClone from 'lodash/cloneDeep';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';

export default {
  props: {
    config: {
      type: Object
    },
    boxProps: { // 盒子属性
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      value: '',
      boxStyles: {},
      alignIcon: [{
        icon: 'icon-a-zujianzuoduiqi',
        tips: '左对齐',
        eventName: 'doLeft'
      }, {
        icon: 'icon-a-zujianzuoyoujuzhongduiqi',
        tips: '左右居中对齐',
        eventName: 'doAlignLeftAndRight'
      }, {
        icon: 'icon-a-zujianyouduiqi',
        tips: '右对齐',
        eventName: 'doRight'
      }, {
        icon: 'icon-a-zujianshangduiqi',
        tips: '上对齐',
        eventName: 'doAlignTop'
      }, {
        icon: 'icon-a-zujianshangxiaduiqi',
        tips: '上下垂直对齐',
        eventName: 'doAlignUpAndDown'
      }, {
        icon: 'icon-a-zujianxiaduiqi',
        tips: '下对齐',
        eventName: 'doBottomJustify'
      }],
    };
  },
  components: {
    LocationProperties
  },

  computed: {},

  mounted() {
    this.boxStyles = deepClone(this.boxProps);
  },

  watch: {
    boxProps: {
      deep: true,
      handler() {
        this.boxStyles = deepClone(this.boxProps);
      }
    },
    value: {
      handler(v) {
        this.$emit('changeAlignment', v);
      }
    }
  },
  methods: {
    changeTitle(value, key) {
      this.boxStyles[key] = value;
      const obj = {
        width: this.boxStyles.width - this.boxProps.width,
        height: this.boxStyles.height - this.boxProps.height,
        left: this.boxStyles.left - this.boxProps.left,
        top: this.boxStyles.top - this.boxProps.top,
      };
      this.$emit('changeSelected', obj);
    },
    batchDel() {
      this.$emit('batchDel');
    },
    layoutBatch() {
      this.$emit('layoutBatch');
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';

.config {
  width: 100%;
  height: 100%;

  &__title {
    height: 46px;
    padding-left: 10px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    line-height: 46px;
    background: #ffffff;
    box-shadow: inset 0px -1px 0px 0px #e9e9e9;
    box-sizing: border-box;
  }

  &__content {
    width: 100%;
    height: calc(100% - 46px);
    //padding: 12px 10px;
    overflow: auto;
    box-sizing: border-box;

    .singleLineTextConfig {
      //height: calc(100% - 24px);
      //width: calc(100% - 20px);
      height: calc(100%);
      width: calc(100%);
      .alignWrap {
        width: 100%;
        display: flex;

        ::v-deep {
          .el-radio-button {
            width: calc(100% / 6);

            &.is-active {
              .el-radio-button__inner {
                background: #E5F0FF !important;
                border-color: $component-borderFocus-color !important;
                color: #4689f5 !important;
              }

              .iconfont {
                color: #4689f5 !important;
              }
            }

            .el-radio-button__inner {
              width: 100%;
              padding: 5px 15px;
              //border-color: $--hover-iconColor;
              background: $component-background-color;

              .iconfont {
                color: #BBC3CD;
                font-size: 18px;
              }
            }

            .el-radio-button__orig-radio:checked + .el-radio-button__inner {
              background: $component-background-color;
            }
            .el-radio-button__inner{
              color: #333;
            }
          }
        }
      }
      ::v-deep {
        .el-form-item {
          padding: 12px 10px;
          box-sizing: border-box;
        }

        .el-form-item__content .setTitle {
          display: none;
        }
      }
    }
  }
}
</style>
