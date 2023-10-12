/**
* @name: index
* @author: DELL
* @date: 2021/12/8 13:49
* @description：index
* @update: 2021/12/8 13:49
*/
<!-- 页面 -->
<template>
  <div>
    <div class="propsSetting">
      <p class="setTitle">{{ title }}</p>
      <c-select
        :options="fontFamilyOptions"
        :value="fontFamilyValue"
        @change="(value) => changeStyles(value, 'FontFamily')"
      >
      </c-select>
      <div class="fontSizeWrap">
        <c-select
          :options="boldTypeOptions"
          :value="fontWeightValue"
          @change="(value) => changeStyles(value, 'FontWeight')"
        ></c-select>
        <el-input-number
          controls-position="right"
          :value="fontSizeValue"
          @change="(value) => changeStyles(value, 'FontSize')"
        />
      </div>
    </div>
    <div class="propsSetting" v-if="isNeed">
      <p class="setTitle">{{ title1 }}</p>
      <div>
        <c-color-picker
          style="margin-right: 10px"
          size="small"
          v-model="color"
          show-alpha
          @change="(value) => changeStyles(value, 'Color')"
          :predefine="predefineColors"
        >
        </c-color-picker>
      </div>
    </div>
  </div>
</template>

<script>
import { predefineColors } from '../../constants/global';
import CColorPicker from '../../basicWidgets/CColorPicker';
import CSelect from '../../basicWidgets/CSelect/index';

export default {
  props: {
    fontFamilyValue: {
      type: String,
      default: '微软雅黑'
    },
    fontWeightValue: {
      type: String,
      default: 'normal'
    },
    fontSizeValue: {
      type: Number
    },
    colorValue: {
      type: String
    },
    title: {
      type: String,
      default: '文本样式'
    },
    title1: {
      type: String,
      default: '文本颜色'
    },
    isNeed: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      color: '',
      predefineColors,
      fontFamilyOptions: [
        {
          label: '微软雅黑',
          value: '微软雅黑'
        },
        {
          label: '苹方',
          value: 'PingFangSC-Regular,PingFang SC'
        },
        {
          label: '思源黑体',
          value: 'Source Han Sans CN'
        }
      ],
      boldTypeOptions: [
        {
          label: '常规体',
          value: 'normal'
        },
        {
          label: '加粗',
          value: 'bold'
        }
      ]
    };
  },

  components: {
    CColorPicker,
    CSelect
  },

  computed: {},

  mounted() {
    this.color = this.colorValue;
  },
  watch: {
    colorValue: {
      handler() {
        this.color = this.colorValue;
      }
    }
  },
  methods: {
    changeStyles(value, key) {
      console.log(value, key);
      this.$emit('change', {
        value,
        key
      });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.propsSetting {
  margin-bottom: 10px;

  .fontSizeWrap {
    display: flex;
    align-items: center;
    margin-top: 6px;

    ::v-deep {
      .selectWrap {
        flex: 0 0 155px;
        margin-right: 10px;

        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
      }
      .el-input-number.is-controls-right .el-input__inner {
        padding-left: 10px;
        padding-right: 0;
      }

      .CInputWrap {
        .el-input-number.is-controls-right .el-input__inner {
          padding-right: 23px;
        }
      }
    }
  }

  .setTitle {
    margin: 0;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 500;
    color: #333;
    line-height: 30px;
    text-align: left;
  }

  .wrap {
    display: flex;
    text-align: left;
    align-items: center;
    line-height: 35px;

    & > span {
      margin-right: 10px;
      color: #ffffff;
      font-size: 13px;
    }
  }
}
</style>
