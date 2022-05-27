<!--
 * @Descripttion: 表格__用户角色（左边人icon图标，右边人名）
 * @Author: ytx
 * @Date: 2021-04-25 15:17:14
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 16:10:48
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
      <div class="container">
        <section v-for="(item, i) in getNameValue(scope.row)" :key="i">
          <div
            :class="`role role--${
              Array.isArray(colorIndex)
                ? colorIndex[scope.row[prop] - 1]
                : colorIndex
            }`"
            v-if="item[objName] || getObj(scope.row)[item]"
          >
            <i :class="`iconfont ${iconCon}`"></i>
            <span class="role__font--color m-l-2">
              {{ objName ? item[objName] : getObj(scope.row)[item] }}
            </span>
          </div>
        </section>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
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
    iconCon: {
      type: String,
      default: 'icon-jiaose'
    },
    // string 单个值下面的数组或字段，Array 数组
    nameValue: {
      type: [Array, String],
      default: () => ['name']
    },
    // nameValue 和 objName 配合使用
    objName: {
      type: String,
      default: ''
    }
  },
  computed: {
    getNameValue() {
      // 如果不是数组，取列表中的值，循环数组
      return function(row) {
        if (!Array.isArray(this.nameValue)) {
          return this.getObj(row)[this.nameValue];
        }
        return this.nameValue;
      };
    },
    typesPropArr() {
      return this.typesPropName && this.$store.getters.getCurDict(this.typesPropName);
    },
    getObj() {
      return function(row) {
        if (!this.typesPropName) {
          return row;
        }
        if (this.typesPropArr.length) {
          const temp = row[this.prop];
          const index = this.typesPropArr.findIndex((item) => item.value === temp);
          return this.typesPropArr[index] || {};
        }
        return {};
      };
    }
  }
};
</script>

<style lang='scss' scoped>
.container {
  display: flex;
}
.role {
  padding: 0 8px;
  line-height: 24px;
  font-size: 13px;
  text-align: center;
  width: min-content;
  border-radius: 4px;
  display: flex;
  &--1 {
    background: #ffeaeb;
    color: #ee5e5e;
  }

  &--2 {
    background: #e5f0ff;
    color: #4689f5;
  }

  &--3 {
    background: #ebfcf7;
    color: #34c7be;
  }

  &__font--color {
    color: #333333 !important;
  }
}
.role {
  margin-right: 10px;
}
</style>
