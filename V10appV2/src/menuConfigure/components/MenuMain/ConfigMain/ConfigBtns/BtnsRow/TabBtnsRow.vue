<!--
 * @Author: sss
 * @Date: 2021-12-22 16:29:08
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-22 16:29:08
 * @Desc: 按钮-横排
-->
<template>
  <view class="tabBtns">
    <section
      v-if="isShowBtn"
      class="tabBtnsRow"
      :class="[
        btnRadiusClass,
        type === 2 ? `themeColor__bg-${getThemeIndex}` : '',
        type === 3 ? 'hasPadding' : '',
      ]"
      ref="tabBtnsRow"
      :style="isProcess ? 'padding: 0 6px !important' : ''"
    >
      <view
        class="btns"
        :class="[type !== 3 ? 'big' : '']"
        :style="{
          gridTemplateColumns: getGridTemplateColumns,
        }"
      >
        <template v-for="(item, index) in showBtns">
          <view :key="item.compId" class="btns__item">
            <apiot-button
              :type="type === 2 ? 'primary' : ''"
              :btnClass="type === 3 ? '' : 'sys_btnSize'"
              size="medium"
              :shape="btnRadius"
              :hair-line="false"
              :custom-style="{
                background: item.iconColor,
                color: item.fontColor,
              }"
              :loading="loadingList[item.compId]"
              :disabled="item.canReadonly"
              :style="isProcess ? 'height: 34px !important' : ''"
              @click="clickBtn(item, 'showBtn')"
            >
              <view class="btns__title">
                <i
                  v-if="item.buttonForm !== 1 && item.iconFont"
                  :class="[
                    item.iconType === 1 ? 'appIcon' : 'iconfont',
                    item.iconFont,
                    item.isTheme ? `themeColor__font-${getThemeIndex}` : '',
                  ]"
                ></i>
                <span class="btns__name">{{ item.name }}</span>
              </view>
            </apiot-button>
          </view>
          <template v-if="btnRadiusClass === 'oval'">
            <div
              v-if="index !== btnList.showBtns.length - 1"
              :key="index"
              :class="!isProcess || type === 2 ? 'btns__line' : ''"
            ></div>
          </template>
        </template>
        <!-- -->
      </view>
      <section class="hiddenBtns" v-if="btnList.hideBtns.length > 0">
        <div
          class="animate__animated hiddenBtns__btn animate__fadeInRight"
          v-show="show"
          v-for="(item, index) in btnList.hideBtns"
          :key="index"
        >
          <apiot-button
            :type="type === 2 ? 'primary' : ''"
            btnClass="noSize"
            size="medium"
            :shape="btnRadius"
            :hair-line="false"
            :custom-style="{
              background: item.iconColor,
              color: item.fontColor,
            }"
            :loading="loadingList[item.compId]"
            :disabled="item.canReadonly"
            @click="clickBtn(item, 'hideBtn')"
          >
            <view class="btns__title">
              <i
                v-if="item.buttonForm !== 1 && item.iconFont"
                :class="[
                  item.iconType === 1 ? 'appIcon' : 'iconfont',
                  item.iconFont,
                  item.isTheme ? `themeColor__font-${getThemeIndex}` : '',
                ]"
              ></i>
              <span class="btns__name">{{ item.name }}</span>
            </view>
          </apiot-button>
        </div>
      </section>
    </section>
    <div class="processBtns" v-if="processBtns.length > 0 && !isNullConfigBtn">
      <section
        class="processBtns__content scale-animate scale-animate-right"
        :class="{ 'scale-animate-show': showProcess }"
      >
        <p
          class="processBtns__content--item"
          v-for="(item, index) in processBtns"
          :key="index"
          :style="{ background: item.iconColor }"
          @click="clickBtn(item, 'showBtn')"
        >
          <i class="appIcon" :class="[item.iconFont]"></i>
        </p>
      </section>
      <div
        class="processBtns__icon"
        :class="[`themeColor__bg-${getThemeIndex}`]"
        @click="handleShow"
      >
        <i class="appIcon appIcon-shenpi"></i>
      </div>
    </div>
  </view>
</template>

<script>
import rowMixin from './rowMixin';

export default {
  name: 'tabBtnsRow',
  components: {},
  mixins: [rowMixin],
  inject: ['getMenuPane'],

  props: {
    // 是否有流程按钮
    isProcess: {
      type: Boolean,
      default: false
    },
    // 流程按钮
    processBtns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否是流程中的抄送给我
    isCcTom: {
      type: Boolean,
      default: false
    },
    // 是否有配置
    isNullConfigBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showProcess: false,
      relevanceBtn: {}
    };
  },

  computed: {
    isShowBtn() {
      if (this.isCcTom || (this.isProcess && this.processBtns.length === 0)) return false;
      return true;
    },
    showBtns() {
      const { showBtns } = this.btnList;
      return showBtns;
    }
  },

  methods: {
    handleShow() {
      this.showProcess = !this.showProcess;
    },

    async clickBtn(e, type) {
      console.log('clickBtn', e, type);
      // 如果是更多按钮
      if (e.compId === 'more') {
        this.show = !this.show;
        return;
      }
      // 如果是流程按钮
      if (e.isProcess) {
        this.showProcess = !this.showProcess;
      }
      if (type === 'hideBtn') this.show = false;
      const obj = {};
      obj[e.compId] = true;
      this.loadingList = { ...this.loadingList, ...obj };

      this.getProcessBtn(e);
      // 不能过滤掉流程转审和加签
      if (e.isProcess && e.compId === 'static_tongguo' && this.relevanceBtn.pass) {
        this.loadingList.static_tongguo = false;
        this.$emit('verifyFun', {
          btn: this.relevanceBtn.pass,
          btnOk: e,
          callback: this.callbackFun
        });
      } else if (e.isProcess && e.compId === 'static_bohui' && this.relevanceBtn.reject) {
        this.loadingList.static_bohui = false;
        this.$emit('verifyFun', {
          btn: this.relevanceBtn.reject,
          btnOk: e,
          callback: this.callbackFun
        });
      } else {
        this.$emit('click', e);
      }
    },
    callbackFun(e) {
      this.$emit('click', e);
    },
    getProcessBtn(e) {
      const { processNodeId, isProcess } = e;
      if (isProcess) {
        const { processConfigs } = this.$store.state.process;
        const config = processConfigs[processNodeId] || {};
        const { appCheckFormConfig = [] } = config;
        appCheckFormConfig.forEach((item) => {
          const comp = this.getMenuPane().compObj[item.compId];
          if (item.isRelationPass) {
            this.relevanceBtn.pass = comp;
          }
          if (item.isRelationReject) {
            this.relevanceBtn.reject = comp;
          }
        });
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'tabBtnsRow';
$--gridColumns: 4;
$--gridSize: 1fr;
$--gridRowGap: 12rpx;
$--gridColumnGap: 6rpx;
@include setRowBtnStyle(
  $--name,
  $--gridColumns,
  $--gridSize,
  $--gridRowGap,
  $--gridColumnGap
);

.tabBtns {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  position: relative;
  .tabBtnsRow {
    flex: 1;
  }
  .processBtns {
    position: absolute;
    right: 0;
    top: -110rpx;
    border-radius: 50%;

    &__icon {
      width: 88rpx;
      height: 88rpx;
      line-height: 88rpx;
      border-radius: 50%;
      text-align: center;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.2);
      .appIcon-shenpi {
        font-size: 38rpx;
        color: #ffffff;
      }
    }

    &__content {
      position: absolute;
      width: 100%;
      bottom: 96rpx;
      &--item {
        margin: 0 auto 16rpx auto;
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        box-shadow: 0 4rpx 11rpx 0 rgba(0, 0, 0, 0.2);
        border-radius: 50%;

        .appIcon {
          font-size: 38rpx;
          color: #fff;
        }
      }
    }
  }
}
.btns__item {
  display: flex;
  align-items: center;
}
</style>
