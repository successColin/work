<!--
 * @Author: sss
 * @Date: 2021-09-22 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-22 15:38:42
 * @Desc: 应用
-->
<template>
  <view class="applicationTab">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="applicationInfo.name"></apiot-navbar>
    <!-- #endif -->
    <view class="applicationTab__menus">
      <sys-tabnav-home
        :configData="configData"
        :isSuperman="supper"
        :swiperList="swiperList"
        :hornMarkNums="hornMarkNums"
      ></sys-tabnav-home>
    </view>
  </view>
</template>

<script>
import SysTabnavHome from './components/SysTabnavHome';
import hornMarkMixin from './hornMarkMixin';

export default {
  components: { SysTabnavHome },

  props: {},
  mixins: [hornMarkMixin],

  data() {
    return {
      // 应用id
      applicationInfo: {
        // 菜单id
        menu: '',
        // 菜单名称
        name: '',
        // 区域类型 funcArea-中间区域，footerArea-底部区域
        areaType: '',
        // 分组id
        groupCompId: ''
      },
      pageType: 'home',
    };
  },

  computed: {
    // 是否为超级用户
    supper() {
      return this.$store.state.menu.supper;
    },
    menusObj() {
      return this.$store.state.menu.menusObj;
    },
    // 应用中的配置
    configData() {
      const { menu: id } = this.applicationInfo;
      const { menusObj } = this;
      const menu = menusObj[id];
      if (!menu) return {};
      return menu.childPageConfig;
    },
    // 轮播图
    // 首页轮播图
    swiperList() {
      const { rotateImg } = this.configData;
      let imgArr = [];
      if (rotateImg && rotateImg.imgArr) imgArr = rotateImg.imgArr;
      return imgArr;
    }
  },

  methods: {},

  onLoad(application) {
    this.applicationInfo = { ...application };
  },

  onReady() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.applicationInfo.name
    });
    // #endif
  },
  onShow() {
    if (this.initHornMarkNums === true) {
      this.getSubscriptNumberFun();
    } else {
      this.getSubscriptMenu();
    }
  }
};
</script>

<style lang='scss' scoped>
.applicationTab {
  background: #ffffff;
  &__menus {
    padding: 0 30rpx;
  }
}
</style>
