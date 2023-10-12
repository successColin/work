<template>
  <div class="switchPage">
    <header class="switchPage__header">
      <div class="switchPage__header--back" @click="handleBack">
        <i class="appIcon appIcon-fanhuijiantou m-r-6"></i>
        按角色
      </div>
      <div class="switchPage__header--title switchPage__header--flex">
        角色“维修工”
      </div>
      <div
        class="switchPage__header--select"
        :style="{ visibility: getSelectLeng !== 0 ? '' : 'hidden' }"
      >
        已选择({{ getSelectLeng }})
      </div>
    </header>
    <apiot-input
      class="switchPage__search"
      prefixIcon="appIcon-sousuo"
      placeholder="请输入关键字搜索"
    ></apiot-input>
    <common-user
      class="switchPage__content"
      :height="210"
      @giveSelected="getSelect"
    ></common-user>
    <footer>
      <u-button
        class="allUser__cancel m-r-12"
        text="取消"
        @click="handleBack"
      ></u-button>
      <u-button
        class="recentDoc__ok"
        type="primary"
        text="确定"
        @click="handleOk"
      ></u-button>
    </footer>
  </div>
</template>

<script>
import CommonUser from './components/CommonUser';

export default {
  props: {
    isSwitch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getSelectLeng: 0
    };
  },
  components: {
    CommonUser
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    getSelect(v) {
      this.getSelectLeng = v;
    },
    handleOk() {},
    // 回退
    handleBack() {
      this.$emit('update:isSwitch', true);
    }
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';

// class 变量名
$--name: 'switchPage';

@include setLayout($--name);
.switchPage {
  .appIcon {
    vertical-align: middle;
  }
}
</style>
