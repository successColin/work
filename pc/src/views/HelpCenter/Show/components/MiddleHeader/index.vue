<!--
 * @Descripttion: 内容头部
 * @Author: ytx
 * @Date: 2021-06-29 18:00:15
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:00:15
-->
<template>
  <header class="middleHeader">
    <div class="middleHeader__titel font__ellipsis" :title="currentObj.name">
      {{ currentObj.name }}
    </div>
    <div class="middleHeader__dec">
      <div class="middleHeader__time">
        {{ $t('helpCenter.updateOn')
        }}{{
          currentObj.modifyTime ? currentObj.updateTime : currentObj.createTime
        }}
      </div>
      <div class="middleHeader__num">
        {{ currentObj.clickTimes }}{{ rightTitle }}
      </div>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    currentObj: {
      type: Object,
      default: () => ({
        name: '',
        createTime: '',
        clickTimes: 0
      })
    },
    rightTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.middleHeader {
  // 头部
  &__titel {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    padding-top: 14px;
  }
  &__dec {
    display: flex;
    justify-content: space-between;
    padding: 11px 0 13px 0;
    border-bottom: 1px solid #e9e9e9;
  }
  &__time {
    font-size: 12px;
    color: #808080;
  }
  &__num {
    font-size: 12px;
    color: #808080;
  }
}
</style>
