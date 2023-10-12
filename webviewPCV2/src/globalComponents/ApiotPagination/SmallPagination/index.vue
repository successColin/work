<template>
  <section class="pagination">
    <el-popover
      placement="top"
      trigger="click"
      popper-class="noPadding"
      v-model="show"
    >
      <div class="pagination__content" style="color: #333">
        <div class="pagination__content--item">当前第 {{ current }} 页</div>
        <div class="pagination__content--item">
          <el-select class="m-r-10" :value="+rowNum" @change="sizeChange">
            <el-option value="10">10行</el-option>
            <el-option value="20">20行</el-option>
            <el-option value="30">30行</el-option>
            <el-option value="40">40行</el-option> </el-select
          >/页
        </div>
        <div class="pagination__content--item">
          跳至
          <el-input-number
            :value="current"
            @change="numberInput"
            :min="1"
            :max="getAllPage"
            :controls="false"
            class="m-l-10 m-r-10"
          ></el-input-number
          >页
        </div>
      </div>
      <p class="pagination__text" slot="reference">
        共{{ total }}条，{{ current }}/{{ getAllPage }}页
      </p>
    </el-popover>

    <i
      class="iconfont icon-dingbugengduozhankai rotate1 m-r-6"
      :class="[{ disabled: current === 1 }]"
      @click="current === 1 || $emit('prev-click')"
    ></i>
    <i
      class="iconfont icon-dingbugengduozhankai rotate2"
      :class="[{ disabled: current === getAllPage }]"
      @click="current === getAllPage || $emit('next-click')"
    ></i>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 1,
    },
    rowNum: {
      type: [String, Number],
      default: '10',
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    // 获取所有页码
    getAllPage() {
      return Math.ceil(this.total / this.rowNum);
    },
  },
  components: {},
  methods: {
    sizeChange(v) {
      this.show = false;
      if (+this.rowNum === +v) {
        return;
      }
      this.$emit('sizeChange', v);
    },
    numberInput(v) {
      this.$emit('update:current', v);
      this.show = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  box-sizing: border-box;
  height: 41px !important;
  border-top: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  border-bottom: 0 !important;
  &__content {
    box-sizing: border-box;
    width: 220px;
    padding: 10px 20px;
    line-height: 36px;
    &--item {
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }
  &__text {
    padding: 4px 10px;
    font-size: 13px;
    font-weight: 400;
    color: #666666;
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background-color: #f6f6f8;
    }
  }
  .iconfont {
    color: #bbc3cd;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
    &.disabled {
      cursor: not-allowed;
      &:hover {
        color: #bbc3cd;
      }
    }
  }
  .rotate1 {
    transform: rotate(-90deg);
  }
  .rotate2 {
    transform: rotate(90deg);
  }
}
</style>
