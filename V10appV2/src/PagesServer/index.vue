<!--
 * @Author: sss
 * @Date: 2022-05-07 11:50:34
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-07 11:50:34
 * @Desc: 服务器切换
-->
<template>
  <view class="servers">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar title="切换地址"></apiot-navbar>
    <!-- #endif -->
    <section class="servers__content">
      <div
        class="servers__content--item"
        v-for="(item, index) in servers"
        :key="index"
      >
        <server-address-other
          v-if="item.type === 1"
          :value="item"
          @checkAddress="checkAddress"
        ></server-address-other>
        <server-address
          :value="item"
          v-else-if="item.type === 2 && item.url"
          @checkAddress="checkAddress"
        ></server-address>
      </div>
    </section>
  </view>
</template>

<script>
import ServerAddress from './components/ServerAddress';
import ServerAddressOther from './components/ServerAddressOther';

export default {
  components: {
    ServerAddress,
    ServerAddressOther
  },

  props: {},

  data() {
    return {};
  },

  computed: {
    servers() {
      const { serverAddress, customAdress } = this.$store.state.serverInfo;
      return [customAdress].concat(serverAddress);
    }
  },

  methods: {
    checkAddress(value) {
      const { type, flag, url } = value;
      this.$store.commit('setServerCheck', {
        type,
        flag,
        url
      });
      uni.reLaunch({ url: '/pages/index/index' });
    }
  },

  onLoad() {}
};
</script>

<style lang='scss' scoped>
.servers {
  &__content {
    margin: 0 30rpx;
    &--item {
      margin-top: 20rpx;
    }
  }
}
</style>
