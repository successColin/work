<template>
  <el-form
    @submit.native.prevent
    class="input__search"
    :class="[{ showPre: showPre }]"
  >
    <apiot-input
      ref="input"
      :placeholder="placeholder || $t('placeholder.pleaseEnterkeySearch')"
      v-bind="$attrs"
      v-on="$listeners"
      :slotType="showPre ? '' : 'prepend'"
      @input.native="searchInput"
      @keyup.enter.native="searchBlur"
    >
      <template slot="prepend" v-if="!showPre">
        <el-select
          :value="selectValue"
          placeholder="请选择"
          class="select"
          @change="selectChange"
        >
          <el-option label="全部" value=""></el-option>
          <el-option
            :label="item.name"
            :value="item.value"
            v-for="item in selectArr"
            :key="item.id"
          ></el-option>
        </el-select>
      </template>
    </apiot-input>
    <i
      class="iconfont icon-guanbi"
      @click="searchClearAndBlur"
      v-show="$refs.input && $refs.input.$el.children[getLength - 1].value"
    ></i>
    <i class="iconfont icon-sousuo" @click="searchBlur"></i>
  </el-form>
</template>

<script>
export default {
  props: {
    // 选择数组
    selectArr: {
      type: Array
    },
    // 选择值
    selectValue: {
      type: [Number, String]
    },
    showPre: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getLength() {
      if (this.$refs.input.$el) {
        return this.$refs.input.$el.children.length;
      }
      return 1;
    }
  },

  mounted() {},

  methods: {
    searchClearAndBlur() {
      const len = this.$refs.input.$el.children.length;
      this.$refs.input.$el.children[len - 1].value = '';
      this.$refs.input.$el.children[len - 1].dispatchEvent(new Event('input'));
      this.$parent.current = 1;
      this.$emit('getList', 1);
    },
    searchBlur() {
      this.$parent.current = 1;
      this.$emit('getList', 1);
    },
    searchInput(e) {
      if (!e.target.value) {
        this.$parent.current = 1;
        this.$emit('getList', 1);
      }
    },
    selectChange(v) {
      this.$emit('update:selectValue', v);
      this.$parent.current = 1;
      this.$emit('getList', 2);
    }
  }
};
</script>

<style lang='scss' scoped>
.input__search {
  position: relative;
  width: 288px;
  line-height: 30px;
  float: right;
  &.showPre {
    width: 100%;
  }
  ::v-deep {
    .el-input__inner {
      height: 30px;
      padding-left: 12px;
      padding-right: 48px;
      color: #333 !important;
    }
    .el-input:focus-within + i.icon-sousuo {
      color: $--color-primary;
    }
  }
  .icon-sousuo {
    position: absolute;
    color: #d9d9d9;
    height: 28px;
    top: 50%;
    transform: translateY(-50%);
    right: 1px;
    width: 29px;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
  .icon-guanbi {
    position: absolute;
    color: #d9d9d9;
    height: 28px;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
    width: 29px;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
  .select {
    position: relative;
    width: 102px !important;
  }
}
</style>
