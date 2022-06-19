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
    <select-people
      :show.sync="isShowSelectPeople"
      :classId="classId"
      :currentId="currentId"
    ></select-people>
    <!-- 重命名 -->
    <rename-list
      :show.sync="isShowRenameList"
      :obj="renameObj"
      @ok="handleRenameOk"
      @close="isShowRenameList = false"
    ></rename-list>
    <!-- 移动 -->
    <move-file
      :show.sync="isMoveFile"
      :classId="classId"
      :currentId="currentId"
      :renameObj="renameObj"
      :tipObj.sync="tipObj"
      @refreshFun="refreshFun"
    ></move-file>
    <!-- 提示 -->
    <apiot-point :obj="tipObj"></apiot-point>
  </div>
</template>

<script>
import SelectPeople from './components/SelectPeople';
import RenameList from './components/RenameList';
import MoveFile from './components/MoveFile';
import { PREVIEW_DOWNLOAD_FILE } from '@/utils/preview.js';
// 接口
import { collectFile, updateFolder, deleteFile, cancelCollect } from '@/api/knowledgeBase';

export default {
  props: {
    isShowMoreOper: {
      type: Boolean,
      default: false
    },
    classId: {
      type: Number,
      default: 1
    },
    currentObj: {
      type: Object,
      default: () => {}
    },
    videoPreviewUrl: {
      type: String,
      default: ''
    },
    isCollect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moreOper: [],
      isShowSelectPeople: false, // 分享
      isShowRenameList: false, // 重命名
      isMoveFile: false,
      delectShow: false, // 删除
      tipObj: {}
    };
  },
  components: {
    SelectPeople,
    RenameList,
    MoveFile
  },
  computed: {
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    },
    currentId() {
      return this.currentObj && this.currentObj.sysKlTree && this.currentObj.sysKlTree.id;
    },
    renameObj() {
      const { sysKlTree } = this.currentObj;
      return {
        name: (sysKlTree && sysKlTree.name) || '',
        type: (sysKlTree && sysKlTree.treeType) || ''
      };
    }
  },
  watch: {
    isShowMoreOper(v) {
      this.moreOper = [
        // { name: '分享', methods: this.handleShare },
        // { name: '收藏', methods: this.handleCollection },
        { name: '重命名', methods: this.handleRename },
        { name: '移动', methods: this.handleMobile },
        { name: '下载', methods: this.handleDownload },
        // { name: '更新版本', methods: this.handleUpdateV },
        { name: '删除', methods: this.handleDelete }
      ];
      if (v) {
        if (!this.isCollect) {
          this.moreOper.splice(0, 0, {
            name: '收藏',
            methods: this.handleCollection
          });
        } else if (this.currentObj.collect) {
          this.moreOper.splice(0, 0, {
            name: '取消收藏',
            methods: this.handleCancelCollect
          });
        }
      }
    },
    isShowSelectPeople(v) {
      this.$store.commit('setIsMask', v);
    },
    isShowRenameList(v) {
      this.$store.commit('setIsMask', v);
    },
    isMoveFile(v) {
      this.$store.commit('setIsMask', v);
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:isShowMoreOper', false);
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
    async handleCollection() {
      console.log('收藏');
      try {
        await collectFile({
          classId: this.classId,
          userId: this.getUserId,
          ids: this.currentId
        });
        this.tipObj = {
          type: 'success',
          message: '收藏成功'
        };
      } catch (error) {
        this.tipObj = {
          type: 'error',
          message: error.message
        };
      }
    },
    // 取消收藏
    async handleCancelCollect() {
      const _this = this;
      uni.showModal({
        title: '提示',
        content: '是否取消收藏？',
        async success(res) {
          if (res.confirm) {
            await cancelCollect({
              classId: _this.classId,
              userId: _this.getUserId,
              ids: _this.currentId
            });
            _this.tipObj = {
              type: 'success',
              message: '取消收藏成功'
            };
            _this.$emit('refreshFun');
          }
        }
      });
    },
    // 重命名
    handleRename() {
      this.isShowRenameList = true;
    },
    async handleRenameOk(v) {
      await updateFolder({
        id: this.currentId,
        name: v
      });
      this.tipObj = {
        type: 'success',
        message: '修改成功'
      };
      this.isShowRenameList = false;
      this.$emit('refreshFun');
    },
    // 移动
    handleMobile() {
      this.isMoveFile = true;
    },
    // 下载
    handleDownload() {
      console.log('下载');
      // app文件下载
      uni.showModal({
        title: '提示',
        content: '是否下载',
        success: (res) => {
          if (res.confirm) {
            console.log(this.currentObj, res);
            const { id, name, url } = this.currentObj && this.currentObj.sysKlTree;
            PREVIEW_DOWNLOAD_FILE({ id, name, url }, this);
          }
        }
      });
    },
    refreshFun() {
      this.$emit('refreshFun');
    },
    // // 更新版本
    // handleUpdateV() {
    //   console.log('更新版本');
    // },
    // 删除
    handleDelete() {
      const _this = this;
      uni.showModal({
        title: '提示',
        content: '是否确定删除？',
        async success(res) {
          console.log(res, _this.currentId);
          if (res.confirm) {
            await deleteFile({
              ids: _this.currentId
            });
            _this.tipObj = {
              type: 'success',
              message: '删除成功'
            };
            _this.$emit('refreshFun');
          }
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
