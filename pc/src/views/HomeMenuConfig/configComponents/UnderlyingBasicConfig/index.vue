/**
* @name: index
* @author: DELL
* @date: 2022/4/2 9:13
* @description：页面基础属性
* @update: 2022/4/2 9:13
*/
<!-- 页面 -->
<template>
  <div class="config">
    <div class="config__title">
      全局配置
    </div>
    <div class="config__content">
      <div class="singleLineTextConfig">
        <el-form label-position="top" :model="config">
          <el-form-item label="尺寸">
            <div class="tile">
              <div class="tile--item">
                <span>宽</span>
                <el-input-number
                    :min="0"
                    v-model="config.width"
                    controls-position="right"
                ></el-input-number>
              </div>
              <div class="tile--item">
                <span>高</span>
                <el-input-number
                    :min="0"
                    v-model="config.height"
                    controls-position="right"
                ></el-input-number>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <p class="switchBox">
              启用删格
              <el-switch
                  v-model="config.enable"
                  class="switchBox__switch"
                  active-text="是"
                  inactive-text="否"
              >
              </el-switch>
            </p>
          </el-form-item>
          <el-form-item label="栅格大小">
            <el-input-number
                :min="0"
                v-model="config.gridSize"
                controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="背景色">
            <CColorPicker v-model="config.bgColor"></CColorPicker>
          </el-form-item>
          <el-form-item label="页面展示方式">
            <el-select v-model="config.showType" placeholder="请选择类型">
              <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in Options"
                  :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CColorPicker from '../../basicWidgets/CColorPicker/index';

export default {
  props: {
    config: {
      type: Object
    }
  },
  data() {
    return {
      Options: [
        {
          label: '全屏铺满',
          value: 1
        }, {
          label: '等比例缩放宽度铺满',
          value: 2
        }, {
          label: '等比例缩放高度铺满',
          value: 3
        }, {
          label: '按设计图比例显示',
          value: 4
        }
      ]
    };
  },
  components: {
    CColorPicker
  },

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'index',
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
    background: #FFFFFF;
    box-shadow: inset 0px -1px 0px 0px #E9E9E9;
    box-sizing: border-box;
  }

  &__content {
    width: 100%;
    height: calc(100% - 46px);
    padding: 12px 10px;
    box-sizing: border-box;

    .tile {
      display: flex;
      justify-content: space-between;

      &--item {
        display: flex;

        &:last-child {
          margin-left: 20px;
        }

        ::v-deep {
          .el-input-number {
            margin-left: 5px;
          }

          .el-input-number.is-controls-right .el-input__inner {
            padding-right: 0;
          }
        }
      }
    }
  }
}
</style>
