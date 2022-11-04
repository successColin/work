<!--
 * @Author: sss
 * @Date: 2022-05-07 13:35:40
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-07 13:35:40
 * @Desc: 服务器地址
-->
<template>
  <div class="serverAddress" :class="[{ animateListClick: isClick }]">
    <header class="serverAddress__header" @click.stop="checkAddress">
      <span>{{ value.name }}</span>
      <span
        class="serverAddress__btn"
        :class="[
          value.isCheck ? `check themeColor__bg-${getThemeIndex}` : 'noCheck',
        ]"
      >
        <i
          class="appIcon"
          :class="[
            value.isCheck
              ? 'appIcon-xialagouxuan'
              : 'appIcon-a-shujuxuanzejinru',
          ]"
        ></i>
      </span>
    </header>
    <div class="serverAddress__address">
      <apiot-input
        v-model="address"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: $t('loginServeAddress.address'),
          })
        "
      ></apiot-input>
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      isClick: false,
      address: ''
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  watch: {
    address(newV) {
      this.$store.commit('setServerInfoOther', newV);
    }
  },

  methods: {
    checkAddress() {
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
        const obj = { ...this.value, url: this.address };
        this.$emit('checkAddress', obj);
      }, 200);
    }
  },

  mounted() {},

  created() {
    this.address = this.value.url;
  }
};
</script>

<style lang='scss' scoped>
.serverAddress {
  padding: 30rpx 30rpx 20rpx 30rpx;
  background: #ffffff;
  box-shadow: 0 2rpx 4rpx 0 rgba(0, 0, 0, 0.08);
  border-radius: 12rpx;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 34rpx;
    font-family: $--font-family;
    color: #333333;
    letter-spacing: 1;
  }
  &__btn {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 48rpx;
    &.noCheck {
      background: #f1f3f6;
      color: #bbc3cd;
      i {
        font-size: 38rpx;
      }
    }
    &.check {
      color: #ffffff;
      i {
        font-size: 22rpx;
      }
    }
  }
  &__address {
    margin-top: 7rpx;
  }
}
</style>
