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
          <el-form-item label="常用尺寸" v-if="isApp">
            <el-select
                :value="computedSize"
                @change="changeSize"
                placeholder="请选择尺寸">
              <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="item in appSizeOptions"
                  :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
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
          <el-form-item label="背景色" style="height: 51px;">
            <CColorPicker v-model="config.bgColor"></CColorPicker>
          </el-form-item>
          <el-form-item>
            <p class="switchBox">
              启用阴影
              <el-switch
                  v-model="config.enableShadows"
                  class="switchBox__switch"
                  active-text="是"
                  inactive-text="否"
              >
              </el-switch>
            </p>
          </el-form-item>
          <el-form-item label="水平阴影" v-if="config.enableShadows">
            <el-input-number
                v-model="config.xShadow"
                controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="垂直阴影" v-if="config.enableShadows">
            <el-input-number
                v-model="config.yShadow"
                controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="阴影距离" v-if="config.enableShadows">
            <el-input-number
                v-model="config.shadowDistance"
                controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="模糊半径" v-if="config.enableShadows">
            <el-input-number
                :min="0"
                v-model="config.blurRadius"
                controls-position="right"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="阴影颜色" v-if="config.enableShadows">
            <CColorPicker v-model="config.shadowColor"></CColorPicker>
          </el-form-item>
          <el-form-item label="背景图片">
            <c-upload
                :before-upload="beforeAvatarUpload"
                @changeScreenBg="changeScreenBgUrl"
                accept=".png,.jpg,.jpeg"
                :url="config.bgImage"
            >
              <template v-slot:tip>
                <div class="el-upload__tip">
                  只能上传png,jpg,jpeg图片，且不超过5MB
                </div>
              </template>
            </c-upload>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CColorPicker from '../../basicWidgets/CColorPicker/index';
import CUpload from '../../basicWidgets/CUpload/index';

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
      ],
      appSizeOptions: [
        {
          label: '自定义',
          value: ''
        },
        {
          label: '360*640',
          value: '360*640'
        },
        {
          label: '360*720',
          value: '360*720'
        },
        {
          label: '360*760',
          value: '360*760'
        },
        {
          label: '375*667',
          value: '375*667'
        },
        {
          label: '375*812',
          value: '375*812'
        },
        {
          label: '414*736',
          value: '414*736'
        },
        {
          label: '414*896',
          value: '414*896'
        }
      ]
    };
  },
  components: {
    CColorPicker,
    CUpload
  },

  computed: {
    isApp() {
      const { clientType } = sessionStorage;
      return +clientType === 2;
    },
    computedSize() {
      const { width, height } = this.config;
      const v = `${width}*${height}`;
      const current = this.appSizeOptions.find((item) => item.value === v);
      if (current) return v;
      return '';
    }
  },

  mounted() {
  },

  methods: {
    changeSize(v) { // 选择尺寸
      if (!v) return;
      const arr = v.split('*');
      this.config.width = +arr[0];
      this.config.height = +arr[1];
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 5;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG, png, jpeg,svg 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 5MB!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
    changeScreenBgUrl(url) {
      // 修改背景图片
      this.config.bgImage = url;
    },
  },
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
    //padding: 12px 10px;
    overflow: auto;
    box-sizing: border-box;
    .singleLineTextConfig {
      height: calc(100% - 24px);
      width: calc(100% - 20px);
      margin: 12px 10px
    }
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
