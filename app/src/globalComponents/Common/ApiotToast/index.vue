<!--
 * @Author: sss
 * @Date: 2022-03-29 15:24:25
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-29 15:24:25
 * @Desc: 提示框
-->
<template>
  <section
    class="apiotToast"
    :class="[
      mode === 'loadBox' && status === 'loading' && isFull ? 'full' : '',
    ]"
  >
    <div
      class="apiotToast__content"
      :class="[mode === 'loadBox' && status === 'loading' ? 'loading' : '']"
    >
      <uni-load-more
        v-if="mode === 'loadBox'"
        :color="status === 'loading' ? '#FFFFFF' : ''"
        :status="status"
        @clickLoadMore="clickLoadMore"
      ></uni-load-more>
    </div>
  </section>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {},

  mixins: [mpMixin],

  props: {
    mode: {
      type: String,
      default: 'loadBox'
    },
    status: {
      type: String,
      default: 'loading'
    },
    // 是否可以点击loading框
    canClick: {
      type: Boolean,
      default: true
    },
    // 是否满铺
    isFull: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    clickLoadMore() {
      if (this.canClick) this.$emit('clickLoadMore');
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotToast {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  text-align: center;
  &.full {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .apiotToast__content.loading {
      margin: 0;
    }
  }

  &__content {
    &.loading {
      margin-top: 32rpx;
      padding: 0 32rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 12rpx;
    }
  }
}
</style>
