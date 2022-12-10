<template>
  <!-- 预览 -->
  <apiot-tabs
    class="printTemplate__tabs"
    :showTabs.sync="showTabs"
    v-if="showTabs"
    :tabsArr="tabsArr"
    value="ContentPreview"
  >
    <apiot-button
      slot="button"
      class="printTemplate__tabs--button"
      type="primary"
      @click="handlePrintFun"
    >
      打印
    </apiot-button>
    <template slot="ContentPreview">
      <content-preview
        v-if="showTabs"
        ref="printShow"
        :isConfig="false"
        :printParams="printParams"
      ></content-preview>
    </template>
  </apiot-tabs>
</template>

<script>
import ContentPreview from '@/views/PrintTemplate/components/ContentPreview';

export default {
  inject: ['getAllForm'],
  props: {
    printParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showTabs: false
    };
  },
  components: { ContentPreview },
  computed: {
    // tabs标题
    tabsArr() {
      const { name } = this.printParams.globalConfig;
      return [
        {
          label: `${name || ''}打印模板`,
          compName: 'ContentPreview',
          key: 'ContentPreview'
        }
      ];
    }
  },
  watch: {
    printParams(v) {
      console.log(v);
      if (JSON.stringify(v) !== '{}') {
        this.showTabs = true;
        console.log(this.printParams);
      } else {
        this.showTabs = false;
      }
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    // 按钮打印
    handlePrintFun() {
      this.$refs.printShow.$refs.printPre.print();
    }
  }
};
</script>
<style lang='scss' scoped>
.printTemplate__tabs {
  &--button {
    position: absolute;
    z-index: 1;
    top: 258px;
    right: 10px;
  }
  ::v-deep {
    .el-tabs__content {
      margin-right: 0;
      background-color: transparent !important;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item.is-active {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC !important;
      font-weight: 400 !important;
      color: #333333 !important;
    }
    .el-tabs__nav-scroll {
      height: 46px;
    }
    .el-tabs__nav {
      position: absolute;
      top: 0;
      left: 120px;
    }
    .el-tabs__header {
      display: block !important;
    }
  }
}
</style>
