<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:16:47
 * @Des: 表格__(1.字体颜色，背景色淡化字体颜色。2.字体颜色为白色，背景色为自定义颜色。3.多个类型字段显示列。4.无背景色)
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="prop"
  >
    <template slot-scope="scope">
      <div
        :class="
          isNeedBg
            ? 'noColor'
            : `type type--${
                Array.isArray(colorIndex)
                  ? colorIndex[scope.row[prop] - 1] || 0
                  : colorIndex
              }`
        "
        :style="getStyle(scope.row)"
        v-if="getValuesArr(scope.row).length === 0"
      >
        {{ getObj(scope.row[prop]).name }}
      </div>
      <section v-else class="type__more">
        <div
          class="font-overflow"
          :class="`type type--${colorIndex} m-r-4`"
          v-for="(item, index) in getValuesArr(scope.row)"
          :key="index"
          :title="getObj(item).name || item"
        >
          {{ getObj(item).name || item }}
          <span class="separator">,</span>
        </div>
      </section>
    </template>
  </el-table-column>
</template>

<script>
import { lighten } from '@/utils/varyColor';

export default {
  inheritAttrs: false,
  props: {
    // 当前作用的字段名
    prop: {
      type: String,
      default: ''
    },
    // 字段名对应的转换文案
    typesPropName: {
      type: String,
      default: ''
    },
    colorIndex: {
      type: [Number, Array],
      default: 1 // 指定单独颜色下标
    },
    // 是否需要背景色，字体色等
    isNeedBg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 转换类型的下标
      dataIndex: 0
    };
  },
  computed: {
    // 获取显示列表是多个还是单个
    getValuesArr() {
      return function (row) {
        // 传入转换数组说明只显示单个
        const valueArr = row[this.prop];
        if (typeof valueArr === 'string') {
          return valueArr.split(',');
        }
        if (Array.isArray(valueArr)) {
          return valueArr;
        }
        return [];
      };
    },
    typesPropArr() {
      return this.$store.getters.getCurDict(this.typesPropName);
    },
    getObj() {
      return function (temp) {
        if (this.typesPropArr && this.typesPropArr.length) {
          // const temp = row[this.prop];
          const index = this.typesPropArr.findIndex((item) => +item.value === +temp);
          return this.typesPropArr[index] || {};
        }
        return {};
      };
    },
    getStyle() {
      return function (row) {
        const obj = this.getObj(row);
        if (obj && obj.color) {
          return `color: ${obj.color};backgroundColor:${lighten(obj.color, 0.9)}`;
        }
        return '';
      };
    }
  }
};
</script>

<style lang='scss' scoped>
.separator {
  display: inline-block;
  width: 0;
  height: 0;
  overflow: hidden;
}
.font-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
}
.noColor {
  color: #333;
}
.type {
  padding: 0 12px;
  line-height: 24px;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
  width: min-content;
  border-radius: 4px;
  &--0 {
    background: #ffeaeb;
    color: #e73c3c;
  }

  &--1 {
    background: #e5f0ff;
    color: #4689f6;
  }

  &--2 {
    background: #e7f8f7;
    color: #26c4bb;
  }

  &--3 {
    background: #fff2d4;
    color: #fa9d0b;
  }

  &--4 {
    background: #ffede1;
    color: #fa6400;
  }

  &--5 {
    background: #ffeaeb;
    color: #e73c3c;
  }
  &--100 {
    background: #bbc3cd;
    color: #fff;
  }
  &--101 {
    background: #4689f6;
    color: #fff;
  }
  &--103 {
    background: #fff;
    color: #333;
  }

  &__more {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    .type {
      vertical-align: middle;
      display: inline-block;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
