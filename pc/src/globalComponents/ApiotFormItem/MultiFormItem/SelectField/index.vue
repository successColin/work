<!-- 选择字段区域 -->
<template>
  <section class="fieldSelect" @click="focusFunc">
    <transition-group name="el-zoom-in-center">
      <apiot-button
        class="fieldSelect--button"
        @click.stop="multiSelect"
        key="100"
      >
        <i class="iconfont icon-jiahao"></i>{{ $t('common.select') }}
      </apiot-button>
      <apiot-tag
        class="m-r-4"
        @deleteSelf="getCurrntMultiArr = item"
        v-for="item in getCurrntMultiArr"
        :key="item"
        :item="item"
      ></apiot-tag>
    </transition-group>

    <el-input
      ref="searchValue"
      class="fieldSelect--input m-l-6"
      :placeholder="$t('placeholder.pleaseEnterSearchName')"
      v-forbid
      v-model="fieldValue"
      @input="fieldInput"
    ></el-input>
  </section>
</template>

<script>
import bus from '@/utils/bus';
import { debounce } from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {
    searchField: {
      type: String,
      default: ''
    },
    // 子项的icon class
    itemIconClass: {
      type: String,
      default: ''
    },
    // 子项icon 的主题色
    // 1 是黄色 2 红色 3 蓝色
    itemTheme: {
      type: Number,
      default: 1
    },
    multiStr: {
      type: String,
      default: ''
    },
    multiArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      fieldValue: ''
    };
  },

  components: {},

  computed: {
    getCurrntMultiArr: {
      get() {
        return this.multiStr ? this.multiStr.split(',') : [];
      },
      set(value) {
        const tempArr = this.multiStr ? this.multiStr.split(',') : [];
        const tempMultiArr = JSON.parse(JSON.stringify(this.multiArr));
        const index = tempArr.findIndex((item) => item === value);
        tempArr.splice(index, 1);
        tempMultiArr.splice(index, 1);
        // this.multiStr = tmepArr.join(',');
        this.$emit('update:multiStr', tempArr.join(','));
        this.$emit('update:multiArr', tempMultiArr);
      }
    }
  },

  mounted() {
    this.fieldInput = debounce(this.fieldInput);
    bus.$on('selectRes', this.selectRes);
  },

  methods: {
    fieldInput() {
      // 更新搜索数据
      this.$emit('update:searchField', this.fieldValue);
    },
    multiSelect() {
      // 多选 按钮事件
      this.$emit('multiSelect');
    },
    // 点击该组件区域 聚焦搜索input
    focusFunc() {
      this.$refs.searchValue.focus();
    },

    selectRes(value, row) {
      const tmepArr = this.multiStr ? this.multiStr.split(',') : [];
      const index = tmepArr.findIndex((item) => item === value);
      if (index === -1) {
        tmepArr.push(value);
        this.$emit('update:multiStr', tmepArr.join(','));
        const multiTempArr = JSON.parse(JSON.stringify(this.multiArr));
        multiTempArr.push(row);
        this.$emit('update:multiArr', multiTempArr);
      } else {
        this.$message({
          type: 'error',
          message: `${value}已存在`
        });
      }
      this.fieldValue = '';
      this.$emit('update:searchField', this.fieldValue);
    }
  },

  beforeDestroy() {
    bus.$off('selectRes', this.selectRes);
  }
};
</script>

<style lang='scss' scoped>
.fieldSelect {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 28px;
  font-size: 13px;
  &--button {
    width: 66px;
    height: 28px;
    border-style: dashed;
    margin-right: 4px !important;
    i {
      color: #aaaaaa;
    }
    &:hover,
    &:focus {
      border-color: $--color-primary;
      i {
        color: $--color-primary;
      }
    }
  }
  &--item {
    padding: 0 6px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    border: 0 none;
    .icon-guanbi {
      color: #bbc3cd;
      font-size: 12px;
      cursor: pointer;
      margin-left: 4px;
      &:hover {
        color: $--color-primary;
      }
    }
  }
  &--input {
    width: 200px;
    ::v-deep {
      .el-input__inner {
        border: 0 none;
        height: 28px !important;
        padding: 0 !important;
      }
    }
  }
}
// 子项主题色
.item--theme__1 {
  background: #ffede1;
  i:first-child {
    color: #fa6400;
  }
}
.item--theme__2 {
  background: #ffeaeb;
  i:first-child {
    color: #ee5e5e;
  }
}
.item--theme__3 {
  background: #e5f0ff;
  i:first-child {
    color: #4689f6;
  }
}
</style>
