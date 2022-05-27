<!--
 * @Author: sss
 * @Date: 2021-11-18 09:29:10
 * @Last Modified by: sss
 * @Last Modified time: 2021-11-18 09:29:10
 * @Desc: 定位地图
-->
<template>
  <view class="apiotFixed">
    <view class="apiotFixed__address" @click="openMap">{{
      location.name || '正在定位'
    }}</view>
  </view>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {
    location() {
      return this.$store.state.map.location;
    }
  },

  methods: {
    // 打开地图
    openMap() {
      console.log('openMap......................');
      // uni.openLocation({
      //   ...this.location,
      //   success() {
      //     console.log('success');
      //   }
      // });
      uni.navigateTo({
        url: '/globalComponents/ApiotFixed/mapSearch'
      });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotFixed {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
