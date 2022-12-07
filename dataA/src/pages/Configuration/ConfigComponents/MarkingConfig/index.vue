/**
* @name: index
* @author: DELL
* @date: 2022/10/29 17:15
* @description：index
* @update: 2022/10/29 17:15
*/
<!-- 页面 -->
<template>
  <div>
    <div class="flex markWrap">
      <div class="ellipsisWrap flex propsSetting mark">
        <span class="setTitle">标记最大值</span>
        <el-switch
            :value="enableMarkMax"
            @change="(value) => changeStyles(value, 'enableMarkMax')"
            active-color="#4689F5"
            inactive-color="#183472">
        </el-switch>
      </div>
      <div class="ellipsisWrap flex propsSetting mark">
        <span class="setTitle">标记最小值</span>
        <el-switch
            :value="enableMarkMin"
            @change="(value) => changeStyles(value, 'enableMarkMin')"
            active-color="#4689F5"
            inactive-color="#183472">
        </el-switch>
      </div>
    </div>
    <div class="flex markWrap" v-if="isShowMark">
      <div class="propsSetting mark">
        <p class="setTitle">标记背景颜色</p>
        <div>
          <c-color-picker
              size="small"
              :value="markBgColor"
              show-alpha
              @change="(value) => changeStyles(value, 'markBgColor')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="propsSetting mark">
        <p class="setTitle">标记字体颜色</p>
        <div>
          <c-color-picker
              size="small"
              :value="markerColor"
              show-alpha
              @change="(value) => changeStyles(value, 'markerColor')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>

    </div>
    <div class="flex markWrap" v-if="isShowMark">
      <div class="propsSetting mark">
        <p class="setTitle">标记图标</p>
        <div>
          <c-select
              :options="symbolOptions"
              :value="symbolIcon"
              @change="(value) => changeStyles(value, 'symbolIcon')"
          ></c-select>
        </div>
      </div>
      <div class="propsSetting mark">
        <p class="setTitle">标记大小</p>
        <div>
          <c-input
              type="number"
              :numberValue="symbolSize"
              @Input-Change="(value) => changeStyles(Number(value), 'symbolSize')"/>
        </div>
      </div>

    </div>
    <div class="ellipsisWrap flex propsSetting">
      <span class="setTitle">启用均值线</span>
      <el-switch
          :value="enableMean"
          @change="(value) => changeStyles(value, 'enableMean')"
          active-color="#4689F5"
          inactive-color="#183472">
      </el-switch>
    </div>
    <div class="flex markWrap" v-if="enableMean">
      <div class="propsSetting mark">
        <p class="setTitle">均值线颜色</p>
        <div>
          <c-color-picker
              size="small"
              :value="meanColor"
              show-alpha
              @change="(value) => changeStyles(value, 'meanColor')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="propsSetting mark">
        <p class="setTitle">均值线类型</p>
        <div>
          <c-select
              :options="solidOptions"
              :value="meanType"
              @change="(value) => changeStyles(value, 'meanType')"
          ></c-select>
        </div>
      </div>

    </div>
    <div class="flex markWrap" v-if="enableMean">
      <div class="propsSetting mark">
        <p class="setTitle">启用均值线标签</p>
        <div>
          <el-switch
              :value="enableMeanLabel"
              @change="(value) => changeStyles(value, 'enableMeanLabel')"
              active-color="#4689F5"
              inactive-color="#183472">
          </el-switch>
        </div>
      </div>
      <div class="propsSetting mark">
        <p class="setTitle">均值线标签位置</p>
        <div>
          <c-select
              :options="meanOptions"
              :value="meanLabelPosition"
              @change="(value) => changeStyles(value, 'meanLabelPosition')"
          ></c-select>
        </div>
      </div>

    </div>
    <div class="flex markWrap" v-if="enableMean">
      <div class="propsSetting mark">
        <p class="setTitle">均值线标签颜色</p>
        <div>
          <c-color-picker
              size="small"
              :value="meanLabelColor"
              show-alpha
              @change="(value) => changeStyles(value, 'meanLabelColor')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="propsSetting mark">
        <p class="setTitle">均值线标签大小</p>
        <div>
          <c-input
              type="number"
              :numberValue="meanLabelSize"
              @Input-Change="(value) => changeStyles(Number(value), 'meanLabelSize')"/>
        </div>
      </div>

    </div>
    <div class="propsSetting">
      <p class="setTitle">高级设置</p>
      <div>
        <MarkAdvanceConfig v-bind="$attrs" v-on="$listeners"></MarkAdvanceConfig>
      </div>
    </div>
  </div>
</template>

<script>
import {predefineColors, Line_TYPE, MARK_LINE_LABEL_POS } from '@/constants/global'
import MarkAdvanceConfig from './MarkAdvanceConfig/index';

export default {
  props: {
    enableMeanLabel: {
      type: Boolean,
      default: true
    },
    enableMean: {
      type: Boolean,
      default: false
    },
    enableMarkMax: {
      type: Boolean,
      default: false
    },
    enableMarkMin: {
      type: Boolean,
      default: false
    },
    markBgColor: {
      type: String,
      default: '#4689F5'
    },
    meanLabelColor: {
      type: String,
      default: '#ffffff'
    },
    markerColor: {
      type: String,
      default: '#fff'
    },
    symbolIcon: {
      type: String,
      default: 'pin'
    },
    symbolSize: {
      type: Number,
      default: 50
    },
    meanLabelSize: {
      type: Number,
      default: 12
    },
    meanColor: {
      type: String,
      default: '#4689F5'
    },
    meanType: {
      type: String,
      default: 'dashed'
    },
    meanLabelPosition: {
      type: String,
      default: 'end'
    }
  },
  data() {
    return {
      predefineColors,
      symbolOptions: [
        {
          label: '不显示',
          value: 'none'
        },
        {
          label: '圆形',
          value: 'circle'
        }, {
          label: '长方形',
          value: 'rect'
        }, {
          label: '圆矩形',
          value: 'roundRect'
        }, {
          label: '三角形',
          value: 'triangle'
        }, {
          label: '菱形',
          value: 'diamond'
        }, {
          label: '气泡',
          value: 'pin'
        }, {
          label: '箭头',
          value: 'arrow'
        }
      ],
      meanOptions: MARK_LINE_LABEL_POS,
      solidOptions: Line_TYPE
    };
  },

  components: {
    MarkAdvanceConfig
  },

  computed: {
    isShowMark() {
      return this.enableMarkMax || this.enableMarkMin;
    }
  },

  mounted() {},

  methods: {
    changeStyles(v, key) {
      this.$emit('change', {value: v, key});
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
}

.ellipsisWrap {
  justify-content: space-between;
  align-items: center;

  ::v-deep {
    .el-slider {
      width: 200px;
      margin: 0 auto;
    }
  }
}

.markWrap {
  justify-content: space-between;
  align-items: center;
}

.mark {
  width: 120px;
}
</style>
