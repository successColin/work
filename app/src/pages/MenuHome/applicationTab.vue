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
      ></sys-tabnav-home>
    </view>
  </view>
</template>

<script>
import SysTabnavHome from './components/SysTabnavHome';

export default {
  components: { SysTabnavHome },

  props: {},

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
      pageType: 'home'
    };
  },

  computed: {
    // 是否为超级用户
    supper() {
      return this.$store.state.menu.supper;
    },
    // 应用中的配置
    configData() {
      const { areaType, menu, groupCompId } = this.applicationInfo;
      if (!groupCompId) return {};
      let groupList = [];
      // 如果不是从底部跳转过来
      if (areaType === 'funcArea') {
        groupList = this.$store.getters.getFuncArea;
      } else {
        groupList = this.$store.getters.getFooterArea;
      }
      const group = groupList.find((item) => `${item.compId}` === groupCompId);
      return group.menuArr.find((item) => `${item.id}` === menu).childPageConfig;
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
