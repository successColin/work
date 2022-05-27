<!--
 * @Descripttion: 更多操作
 * @Author: ytx
 * @Date: 2022-01-08 09:29:19
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 09:29:19
-->
<template>
  <div class="moreOper">
    <apiot-actionsheet
      :actions="moreOper"
      :show="isShowMoreOper"
      @select="handleMoreOpen"
      @close="handleClose"
    ></apiot-actionsheet>

    <!-- 分享 -->
    <select-people :show.sync="isShowSelectPeople"></select-people>
    <!-- 收藏 -->
    <rename-list :show.sync="isShowRenameList"></rename-list>
    <!-- 重命名 -->
    <!-- 移动 -->
    <!-- 下载 -->
    <!-- 更新版本 -->
    <!-- 删除 -->
    <apiot-modal
      :showModal="delectShow"
      @confirm="delectConfirm"
      @cancel="
        () => {
          delectShow = false;
        }
      "
    ></apiot-modal>
  </div>
</template>

<script>
import SelectPeople from './components/SelectPeople';
import RenameList from './components/RenameList';

export default {
  props: {
    isShowMoreOper: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moreOper: [
        { name: '分享', methods: this.handleShare },
        { name: '收藏', methods: this.handleCollection },
        { name: '重命名', methods: this.handleRename },
        { name: '移动', methods: this.handleMobile },
        { name: '下载', methods: this.handleDownload },
        { name: '更新版本', methods: this.handleUpdateV },
        { name: '删除', methods: this.handleDelete }
      ],
      isShowSelectPeople: false, // 分享
      isShowRenameList: false, // 重命名
      delectShow: false // 删除
    };
  },
  components: {
    SelectPeople,
    RenameList
  },
  computed: {},
  watch: {
    isShowSelectPeople(v) {
      this.$store.commit('setIsMask', v);
    },
    isShowRenameList(v) {
      this.$store.commit('setIsMask', v);
    }
  },
  mounted() {},
  methods: {
    handleClose(v) {
      this.$emit('update:isShowMoreOper', v);
    },
    // 更多
    handleMoreOpen(v) {
      v.methods();
    },
    // 分享
    handleShare() {
      this.isShowSelectPeople = true;
    },
    // 收藏
    handleCollection() {
      console.log('收藏');
    },
    // 重命名
    handleRename() {
      this.isShowRenameList = true;
    },
    // 移动
    handleMobile() {
      console.log('移动');
    },
    // 下载
    handleDownload() {
      console.log('下载');
    },
    // 更新版本
    handleUpdateV() {
      console.log('更新版本');
    },
    // 删除
    handleDelete() {
      console.log('删除');
      this.delectShow = true;
    },
    // 删除确定
    delectConfirm() {
      setTimeout(() => {
        // 3秒后自动关闭
        this.delectShow = false;
      }, 3000);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
