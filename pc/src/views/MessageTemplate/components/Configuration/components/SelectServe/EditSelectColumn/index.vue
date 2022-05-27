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
    <template slot="header" slot-scope="scope">
      <label>{{ scope.column.label }}</label>
      <span v-if="isRequire" class="is-require"></span>
    </template>

    <template slot-scope="scope">
      <section class="type__more" v-show="!scope.row.edit">
        <div
          class="font-overflow type m-r-4"
          :class="[isNeedBg ? `type--${colorIndex}` : '']"
          v-for="(item, index) in getValue(scope.row)"
          :key="item.value"
          :title="item.name"
        >
          <span class="separator" v-if="index !== 0">,</span>
          {{ item.name }}
        </div>
      </section>
      <el-select
        v-show="scope.row.edit"
        v-model="scope.row[prop]"
        :placeholder="$t('placeholder.pleaseSelect', { any: '' })"
        @change="handleChange(scope)"
      >
        <el-option
          v-for="item in elOption"
          :label="item.name"
          :value="item.value"
          :key="item.value"
          >{{ item.name }}</el-option
        >
      </el-select>
    </template>
  </el-table-column>
</template>

<script>
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
      default: true
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    },
    rules: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return { visible: false };
  },
  computed: {
    isRequire() {
      return this.rules.findIndex((item) => item.required === true) !== -1;
    },
    elOption() {
      if (this.typesPropName) return this.typesPropArr;
      return this.options;
    },
    typesPropArr() {
      return this.$store.getters.getCurDict(this.typesPropName);
    },
    // 获取显示的值
    getValue() {
      return function(row) {
        let temp = `${row[this.prop]}`;
        temp = temp.split(',');
        const values = [];
        temp.forEach((element) => {
          const value = { name: element, value: element };

          // 如果外部有传入typesPropName 字典编码，那么需要转化
          if (this.typesPropName) {
            const dictObj =
              this.typesPropArr.find((item) => `${item.value}` === `${element}`) || {};
            // 如果name为空，默认显示值
            value.name = dictObj.name || element;
          }
          values.push(value);
        });
        return values;
      };
    }
  },
  methods: {
    handleChange(scope) {
      this.$emit('handleEdit', scope.row, scope.$index, this.prop);
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
