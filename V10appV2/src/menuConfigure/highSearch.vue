<!--
 * @Author: sss
 * @Date: 2022-03-15 10:14:25
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-15 10:14:25
 * @Desc: 配置界面-高级筛选
-->
<template>
  <view>
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="$t('common.filter')"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar" v-if="config.showRecode">
      <section class="filterRecord">
        <header class="filterRecord__header">
          <span class="title">最近筛选记录</span>
          <p
            class="btn"
            :class="[`themeColor__font-${getThemeIndex}`]"
            @click="insetForm"
          >
            填入表单
          </p>
        </header>
        <div class="filterRecord__content">
          <div
            class="filterRecord__content--item"
            v-for="(item, index) in lastFilterSeachEle.formArray"
            :key="index"
          >
            <span class="subtitle left">{{ item.name }}:</span>
            <span class="title">{{ item.value }}</span>
            <span class="subtitle">{{ item.lambdaLabel }}</span>
          </div>
        </div>
      </section>
    </u-sticky>
    <high-search-form
      ref="highForm"
      :featureArr="featureArr"
    ></high-search-form>
    <div style="height: 140rpx"></div>
    <footer class="highSearch__footer">
      <div class="btn">
        <apiot-button
          type="secondary"
          :custom-style="{
            width: '100%',
            border: 'none',
          }"
          @click="clear"
          >重置</apiot-button
        >
      </div>
      <div class="btn">
        <apiot-button
          :custom-style="{
            width: '100%',
          }"
          type="primary"
          @click="sure"
          >确定</apiot-button
        >
      </div>
    </footer>
  </view>
</template>

<script>
import HighSearchForm from './components/MenuMain/ConfigMain/ConfigForm/HighSearchForm';

export default {
  components: { HighSearchForm },

  data() {
    return {
      config: {
        showRecode: false // 是否需要显示最近一次搜索记录
      },
      lastForm: {}
    };
  },

  computed: {
    lastFilterSeachEle() {
      const { lastForm, featureArr, config } = this;
      if (!config.showRecode) return;
      const { children } = featureArr;
      const formArray = [];
      const form = {};
      children.forEach((element) => {
        const { compId, name } = element;
        if (!lastForm[`${compId}_lambda`]) return;
        form[compId] = lastForm[compId];
        form[`${compId}_lambda`] = lastForm[`${compId}_lambda`];
        form[`${compId}_lambdaLabel`] = lastForm[`${compId}_lambdaLabel`];
        formArray.push({
          name,
          compId,
          value: lastForm[compId],
          lambda: lastForm[`${compId}_lambda`],
          lambdaLabel: lastForm[`${compId}_lambdaLabel`]
        });
      });
      return { form, formArray };
    },
    featureArr() {
      return this.$store.state.menu.highSearchConfig;
    },
    // 顶部固定高度
    customBar() {
      const { systemInfo } = this.$store.state.base;
      let height = systemInfo.customBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    insetForm() {
      this.$refs.highForm.resetForm(this.lastFilterSeachEle.form);
    },
    clear() {
      const featureArr = { ...this.featureArr };
      featureArr.form = {};
      this.$store.commit('setMunuHighSearch', featureArr);
      this.$bus.$emit(this.config.flag, { form: featureArr.form });
      uni.navigateBack();
    },
    sure() {
      if (JSON.stringify(this.$refs.highForm.configForm) !== '{}') {
        const featureArr = { ...this.featureArr };
        featureArr.form = this.$refs.highForm.configForm;
        this.$store.commit('setMunuHighSearch', featureArr);

        // 是否需要记录高级筛选的值
        if (this.config.showRecode) {
          this.$store.commit('setSearchFilter', {
            searchFlag: this.config.highSearchFlag,
            form: featureArr.form
          });
        }
        this.$bus.$emit(this.config.flag, { form: featureArr.form });
      }
      uni.navigateBack();
    }
  },

  onLoad(option = {}) {
    // 是否需要记录最近一次查询记录
    if (option.hisSearch === '1') option.showRecode = true;
    else option.showRecode = false;

    this.config = option;
    // eslint-disable-next-line max-len
    if (option.highSearchFlag && option.showRecode) this.lastForm = this.$store.state.search.lastFilterSeach[option.highSearchFlag] || {};
  },

  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('common.filter')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.highSearch__footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 19rpx 33rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 24rpx;
  background: #fff;
}
.filterRecord {
  background: #fff;
  padding: 0 30rpx 30rpx 30rpx;
  border-radius: 0 0 20rpx 20rpx;
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.2);

  &__header {
    display: flex;
    justify-content: space-between;
    height: 85rpx;
    line-height: 85rpx;
    .title {
      font-size: 32rpx;
      @include fontBlob(500);
    }
    .btn {
      font-size: 28rpx;
    }
  }

  &__content {
    padding: 20rpx 30rpx;

    border-radius: 14rpx;
    background: #f6f6f8;
    font-size: 28rpx;
    font-family: $--font-family;
    color: #808080;
    &--item {
      display: flex;
      line-height: 40rpx;
      .left {
        width: 174rpx;
      }
      .subtitle {
        flex-shrink: 0;
      }
      .title {
        flex: 1;
        color: #333333;
      }
    }
  }
}
</style>
