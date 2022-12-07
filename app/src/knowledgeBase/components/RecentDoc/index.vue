<!--
 * @Descripttion: 最近文件
 * @Author: ytx
 * @Date: 2022-01-05 14:20:42
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:20:42
-->
<template>
  <div class="recentDoc">
    <!-- 吸顶 -->
    <u-sticky :customNavHeight="customBar">
      <div class="recentDoc__sticky">
        <!-- 点击遮罩层 -->
        <div class="recentDoc__mask" @click="handleJump"></div>
        <apiot-input
          class="recentDoc__search"
          prefixIcon="appIcon-sousuo"
          placeholder="在全部文件中搜索"
          :isTheme="false"
        ></apiot-input>
        <section class="recentDoc__nav">
          <div>最近</div>
          <i class="appIcon appIcon-shaixuan" @click="isShowPopup = true"></i>
        </section>
      </div>
    </u-sticky>
    <list-data
      class="recentDoc__list"
      :dataArr="dataArr"
      :isShowMoreOper.sync="isShowMoreOper"
    ></list-data>

    <upload-file></upload-file>

    <!-- 筛选 -->
    <div @touchmove.stop.prevent>
      <u-popup
        mode="bottom"
        :show="isShowPopup"
        :round="10"
        @close="isShowPopup = false"
      >
        <section class="recentDoc__popup">
          <div class="recentDoc__popup--title margTop">筛选</div>
          <popup-line :arr="screenArr1"></popup-line>
          <div class="recentDoc__popup--title margTop">来源</div>
          <popup-line :arr="screenArr2"></popup-line>
          <div class="recentDoc__popup--title margTop">排序</div>
          <popup-line :arr="screenArr3"></popup-line>

          <footer>
            <u-button
              class="recentDoc__popup--reset"
              text="重置"
              @click="handleReset"
            ></u-button>
            <u-button
              class="recentDoc__popup--ok"
              type="primary"
              text="确定"
              @click="handleOk"
            ></u-button>
          </footer>
        </section>
      </u-popup>
    </div>

    <!-- 更多操作弹窗 -->
    <more-oper :isShowMoreOper.sync="isShowMoreOper"></more-oper>
  </div>
</template>

<script>
import PopupLine from '../components/PopupLine';
import ListData from '../components/ListData';
import MoreOper from '../components/MoreOper';
import UploadFile from '../components/UploadFile';

export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShowPopup: false, // 筛选
      isShowMoreOper: false, // 更多操作
      dataArr: [],
      screenArr1: [
        {
          name: '全部类型',
          state: false
        },
        {
          name: '文档',
          url: 'appIcon-DOC',
          state: false
        },
        {
          name: '图片',
          url: 'appIcon-tupianwenjian',
          state: false
        },
        {
          name: '视频',
          url: 'appIcon-shipinwenjian',
          state: false
        },
        {
          name: '音频',
          url: 'appIcon-yuyinwenjian',
          state: false
        },
        {
          name: '其他',
          url: 'appIcon-qitawenjian',
          state: false
        }
      ],
      screenArr2: [
        {
          name: '全部来源',
          state: false
        },
        {
          name: '我的创建',
          state: false
        },
        {
          name: '他人创建',
          state: false
        }
      ],
      screenArr3: [
        {
          name: '时间降序',
          state: false
        },
        {
          name: '时间升序',
          state: false
        },
        // 占位
        {
          name: ''
        }
      ]
    };
  },
  components: {
    ListData,
    PopupLine,
    MoreOper,
    UploadFile
  },
  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    customBar() {
      let height = 0;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      // #ifndef MP-ALIPAY
      height = this.systemInfo.customBar || 0;
      // #endif
      return height;
    }
  },
  watch: {
    isShowPopup(v) {
      this.$store.commit('setIsMask', v);
    }
  },
  mounted() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.title
    });
    // #endif
  },
  methods: {
    handleJump() {
      uni.navigateTo({
        animationType: 'pop-in',
        url: 'components/SearchPage/index'
      });
    },
    getList() {
      console.log(11111111);
    },
    // 筛选
    handleReset() {
      this.screenArr1.forEach((item) => {
        item.state = false;
      });
      this.screenArr2.forEach((item) => {
        item.state = false;
      });
      this.screenArr3.forEach((item) => {
        item.state = false;
      });
    },
    handleOk() {
      console.log('确定');
      this.isShowPopup = false;
    }
  },
  // 上拉加载
  onReachBottom() {
    console.log('上拉加载');
  }
};
</script>
<style lang='scss' scoped>
@import '../index.scss';

// class 变量名
$--name: 'recentDoc';

@include setSearch($--name);
</style>
