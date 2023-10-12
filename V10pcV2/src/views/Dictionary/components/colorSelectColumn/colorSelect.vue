<!--
 * @Descripttion: 颜色下拉框
 * @Author: sss
 * @Date: 2021-04-12 11:25:37
 * @LastEditors: sss
 * @LastEditTime: 2021-04-22 16:25:19
-->
<template>
  <el-popover
    v-on="$listeners"
    v-bind="$attrs"
    v-model="visible"
    width="294"
    popper-class="fillet-big"
  >
    <section class="color__box">
      <div
        class="color__box__item"
        v-for="item in colorArr"
        :key="item"
        :style="`backgroundColor:${item}`"
        @click="selectColor(item)"
      >
        <i
          class="el-icon-check"
          :style="`color:${isChecked(item) ? '#fff' : item}`"
        ></i>
      </div>
      <apiot-input
        class="color__box--input"
        slotType="prepend"
        :placeholder="
          $t('placeholder.pleaseEnterAny', { any: $t('menu.color') })
        "
        v-model="curColor"
      >
        <template slot="prepend">#</template>
      </apiot-input>
      <div class="color__box--footer">
        <apiot-button size="small" @click="visible = false"
          >{{ $t('common.cancle') }}
        </apiot-button>
        <apiot-button type="primary" size="small" @click="sureClick"
          >{{ $t('common.sure') }}
        </apiot-button>
      </div>
    </section>
    <div :class="{ colorSelect: color }" slot="reference">
      <div v-if="color" class="colorSelect__div">
        <span
          class="colorSelect__colorblock"
          :style="`backgroundColor:${color}`"
        ></span>
        {{ color }}
      </div>

      <apiot-input
        v-else
        size="small"
        readonly
        :placeholder="
          $t('placeholder.pleaseSelect', {
            any: '颜色',
          })
        "
      ></apiot-input>
    </div>
  </el-popover>
</template>

<script>
export default {
  inheritAttrs: false,
  name: 'colorSelect',
  props: {
    // 默认颜色
    color: {
      type: String,
      default: ''
    },
    colorArr: {
      // 可以选择的颜色
      type: Array,
      default() {
        return [
          '#5A80ED',
          '#EE5E5E',
          '#FAB71C',
          '#FC8256',
          '#34C7BE',
          '#1CA6FF',
          '#10B98A',
          '#A853F2',
          '#708DB7',
          '#BBC3CD'
        ];
      }
    }
  },
  data() {
    return {
      visible: false,
      // 显示值
      curColor: ''
    };
  },
  computed: {
    // 填写的值是否在颜色数组中
    isChecked() {
      return function(itemColor) {
        const { realColor } = this;
        return realColor.toUpperCase() === itemColor.toUpperCase();
      };
    },
    realColor() {
      const { curColor } = this;
      // 是否有#号
      const isHas = curColor.indexOf('#');
      return curColor && isHas === -1 ? `#${curColor}` : curColor;
    }
  },
  methods: {
    selectColor(item) {
      let color = item;
      const isHas = color.indexOf('#');
      // 如果有值，并且有#号，将#号去掉
      if (color && isHas !== -1) {
        const colorArry = color.split('#');
        const [, showColor] = colorArry;
        color = showColor;
      }
      this.curColor = color;
    },
    sureClick() {
      const { realColor } = this;
      this.$emit('update:color', realColor);
      this.$emit('selectColor', realColor);
      this.visible = false;
    }
  },
  created() {
    // 是否有#号
    let { color } = this;
    const isHas = color.indexOf('#');
    // 如果有值，并且有#号，将#号去掉
    if (color && isHas !== -1) {
      const colorArry = color.split('#');
      const [, showColor] = colorArry;
      color = showColor;
    }
    this.curColor = color;
  }
};
</script>

<style lang='scss' scoped>
.colorSelect {
  padding: 0 12px;
  width: 100%;
  height: 32px;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e9e9e9;
  &__div {
    display: flex;
    align-items: center;
    height: 100%;
  }
  &__colorblock {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
}
.color__box {
  padding: 10px 20px 8px 20px;
  display: flex;
  flex-wrap: wrap;
  &__item {
    margin: 8px 2.7px;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
  }
  &--input {
    ::v-deep {
      .el-input-group__prepend {
        padding: 0 9px;
      }
      .el-input__inner {
        height: 28px;
        line-height: 28px;
        padding: 0 10px;
      }
    }
  }
  &--footer {
    margin-top: 8px;
    width: 100%;
    text-align: right;
    height: 22px;
    ::v-deep {
      .button {
        height: 100%;
      }
    }
  }
}
</style>
