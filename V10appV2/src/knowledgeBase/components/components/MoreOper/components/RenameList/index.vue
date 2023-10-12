<!--
 * @Descripttion: 重命名
 * @Author: ytx
 * @Date: 2022-02-21 09:01:36
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-21 09:01:36
-->
<template>
  <apiot-popup :show="show" @close="handleClose">
    <section class="rename">
      <div class="rename__title">{{ title }}</div>
      <apiot-input
        class="rename__search"
        placeholder="请输入重命名"
        v-model="keyword"
        focus
      ></apiot-input>
      <footer>
        <apiot-button class="rename__cancel m-r-12" @click="handleClose">
          取消
        </apiot-button>
        <apiot-button class="rename__ok" type="primary" @click="handleOk">
          确定
        </apiot-button>
      </footer>
    </section>
  </apiot-popup>
</template>

<script>
export default {
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '文件重命名'
    }
  },
  data() {
    return {
      keyword: '',
      endName: ''
    };
  },
  components: {},
  computed: {},
  watch: {
    obj(v) {
      console.log(v);
      this.endName = '';
      this.keyword = '';
      if (v.type === 1) {
        this.keyword = v.name;
      } else {
        const index = v.name.lastIndexOf('.');
        this.keyword = v.name.slice(0, index);
        this.endName = v.name.slice(index);
      }
    },
    show(v) {
      console.log(v);
    }
  },
  mounted() {},
  methods: {
    // 取消、关闭
    handleClose() {
      this.$emit('close');
    },
    // 按钮__确定
    handleOk() {
      this.$emit('ok', `${this.keyword}${this.endName}`);
    }
  }
};
</script>
<style lang='scss' scoped>
.rename {
  margin: 0 30rpx;
  &__title {
    margin-top: 30rpx;
    line-height: 80rpx;
  }
  &__search {
    margin: 20rpx 0 40rpx;
    ::v-deep {
      .u-input {
        background: #fafafa;
      }
      .u-border {
        border-color: #fff !important;
      }
    }
  }
  footer {
    display: flex;
    padding: 19rpx 3rpx;
    background: #ffffff;
    .rename__cancel {
      background: #f1f3f6;
    }
  }
}
</style>
