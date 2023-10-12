<!--
 * @Author: sss
 * @Date: 2021-05-28 10:37:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-28 10:37:44
 * @Desc: None
-->
<template>
  <section class="detail">
    <header class="detail__header">{{ detail.serviceUrl }}</header>
    <div class="detail__content">
      <div class="detail__content--item">
        <label class="item--title">输入参数</label>
        <p class="item--contain">{{ detail.parameter }}</p>
      </div>
      <div class="detail__content--item">
        <label class="item--title">异常信息</label>
        <p class="item--contain">{{ detail.exceptionContent }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    detail: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  &__header {
    flex: 0 0 48px;
    padding-left: 14px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    line-height: 48px;
    border-bottom: 1px solid #e9e9e9;
    // box-shadow: 0px -1px 0px 0px #e9e9e9;
  }
  &__content {
    overflow: auto;
    padding: 10px;
    flex: 1;
    font-size: 13px;
    font-weight: 400;
    color: #333333;

    &--item {
      display: flex;
      border: 1px solid #e9e9e9;
      align-content: center;
      &:last-child {
        border-top: none;
      }
      .item--title {
        padding: 30px;
        flex: 0 0 140px;
        background: #fafafa;
        border-right: 1px solid #e9e9e9;
      }
      .item--contain {
        padding: 14px;
        flex: 1;
        white-space: pre-wrap;
        word-break: break-all;
      }
    }
  }
}
</style>
