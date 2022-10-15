<!-- 知识库 页面 -->
<template>
  <div class="contentWrap">
    <div class="btnWrap" v-if="!isDialog">
      <el-upload
        ref="my-upload"
        style="display: inline-block; margin: 0 10px"
        action=""
        :on-success="handleChange"
        :multiple="true"
        :before-upload="beforeUpload"
        :accept="accept"
        list-type="picture"
        :http-request="doUpload"
      >
        <apiot-button type="primary" v-if="isShowUploadBtn()">
          <i class="icon-shangchuan iconfont" style="margin-right: 4px"></i>
          {{ $t('knowledge.upload') }}
        </apiot-button>
      </el-upload>
      <apiot-button v-if="isShowCancel()" @click="cancelCollect">
        <span class="iconfont icon-fenxiang btnWrap__btnCommon"></span>
        {{ $t('knowledge.Unfavorite') }}
      </apiot-button>
      <apiot-button v-if="isShowAdd()" @click="handleAdd" :loading="loadingBtn">
        <span class="iconfont icon-xinzengwenjianjia btnWrap__btnCommon"></span>
        {{ $t('knowledge.Add_folder') }}
      </apiot-button>
      <apiot-button
        v-if="
          showType === 1 && selectKeys.length && ![7, 8].includes(groupType)
        "
        @click="userDialogVisible = true"
      >
        <span class="iconfont icon-fenxiang btnWrap__btnCommon"></span>
        {{ $t('knowledge.share_it') }}
      </apiot-button>
      <apiot-button
        v-if="[7].includes(groupType) && selectKeys.length && showType === 1"
        @click="doCancelShare"
      >
        <span class="iconfont icon-fenxiang btnWrap__btnCommon"></span>
        {{ $t('knowledge.Unshare') }}
      </apiot-button>
      <apiot-button
        v-if="isShowSetPermissions()"
        @click="authDialogVisible = true"
      >
        <span class="iconfont icon-shezhi btnWrap__btnCommon"></span>
        {{ $t('knowledge.Setting_permissions') }}
      </apiot-button>
      <apiot-button v-if="selectKeys.length" @click="download">
        <span class="iconfont icon-xiazai btnWrap__btnCommon"></span>
        {{ $t('knowledge.download') }}
      </apiot-button>
      <el-dropdown
        trigger="click"
        v-if="
          showType !== 3 && selectKeys.length && ![8, 7].includes(groupType)
        "
        @command="selectBtn"
      >
        <apiot-button
          v-show="
            showType !== 3 && selectKeys.length && ![8, 7].includes(groupType)
          "
        >
          <span class="iconfont icon-qita btnWrap__btnCommon"></span>
          {{ $t('knowledge.More_actions') }}
        </apiot-button>
        <el-dropdown-menu slot="dropdown" style="border: none">
          <el-dropdown-item :command="{ type: 'move' }" v-show="isShowMove()">
            <span class="iconfont icon-qiehuan1" style="color: #4689f5"></span>
            {{ $t('knowledge.moving') }}
          </el-dropdown-item>
          <el-dropdown-item
            :command="{ type: 'collect' }"
            v-show="isShowMove() && groupType !== 9"
          >
            <span class="iconfont icon-shoucang" style="color: #4689f5"></span>
            {{ $t('knowledge.Favorites') }}
          </el-dropdown-item>
          <el-dropdown-item
            :command="{ type: 'rename' }"
            v-show="selectKeys.length === 1 && isShowMove()"
          >
            <span class="iconfont icon-bianji" style="color: #4689f5"></span>
            {{ $t('knowledge.Rename') }}
          </el-dropdown-item>
          <el-dropdown-item :command="{ type: 'del' }" v-show="isShowDel()">
            <span class="iconfont icon-shanchu" style="color: #4689f5"></span>
            {{ $t('knowledge.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="uploadingWrap" v-if="uploadingFiles.length">
        <span class="iconfont icon-gengxin"></span>
        {{ $t('knowledge.File_is_being') }}
        <span style="cursor: pointer" @click="dialogProcessVisible = true">{{
          $t('knowledge.transfer_list')
        }}</span>
      </div>
      <div
        class="btnWrap__ope"
        v-if="showType !== 3 && ![7, 8, 10].includes(groupType)"
      >
        <el-button-group>
          <apiot-button
            :type="active === 2 ? 'primary' : ''"
            @click="changeView(2)"
          >
            <span class="iconfont icon-liebiaozhanshi"></span>
          </apiot-button>
          <apiot-button
            :type="active === 1 ? 'primary' : ''"
            @click="changeView(1)"
          >
            <span class="iconfont icon-juzhenzhanshi"></span>
          </apiot-button>
        </el-button-group>
      </div>
      <search-input
        v-if="showType === 3"
        style="width: 224px"
        @getList="getFileList"
        v-model="keyWord"
      ></search-input>
    </div>
    <div class="pathWrap">
      <file-path :pathArr="pathArr" v-on:changePath="changePath"></file-path>
      <div class="pathWrap__select">
        {{ $t('knowledge.chosen') }}{{ selectKeys.length
        }}{{ $t('knowledge.ge') }}， {{ $t('knowledge.A_total_of')
        }}{{ countTotal() }}{{ $t('knowledge.files_total') }}
      </div>
    </div>
    <div class="contentTypeWrap" v-loading="loading">
      <recently-used
        :edit="edit"
        :selectKeys="selectKeys"
        v-on:checkall="chooseFile"
        :fileUrl="getFileUrl"
        :updateData="updateData"
        v-on:preview="handlePreview"
        v-on:editFileName="editFileName"
        v-on:moveFileToNewFile="moveFilesToNewFile"
        :list="list"
        v-if="groupType === 10"
      >
      </recently-used>
      <block-content
        :list="list"
        :edit="edit"
        :loading="loading"
        :selectKeys="selectKeys"
        v-if="active === 1 && showType !== 3 && ![7, 8, 10].includes(groupType)"
        v-on:checkall="chooseFile"
        :fileUrl="getFileUrl"
        :updateData="updateData"
        v-on:preview="handlePreview"
        v-on:editFileName="editFileName"
        v-on:moveFileToNewFile="moveFilesToNewFile"
        @scroll="scroll"
      >
      </block-content>
      <list-content
        ref="listContent"
        :edit="edit"
        :groupType="String(groupType)"
        :selectKeys="selectKeys"
        :list="list"
        :fileUrl="getFileUrl"
        :selectList="selectList"
        :updateData="updateData"
        :isDialog="isDialog"
        :getFilterIds="getFilterIds"
        v-on:preview="handlePreview"
        v-on:editFileName="editFileName"
        v-on:showShareUserList="showShareUserList"
        v-if="isShowListContent()"
      >
      </list-content>
      <bussiness-list
        ref="bussinessList"
        :selectKeys="selectKeys"
        :list="list"
        :fileUrl="getFileUrl"
        :selectList="selectList"
        :updateData="updateData"
        v-on:preview="handlePreview"
        v-if="showType === 3"
        :total="total"
        :size="size"
        :current="current"
        isolationSign="knowledge"
        :fetchList="this.getBussinessFiles"
      >
      </bussiness-list>
    </div>
    <user-dialog
      ref="selectDialog"
      v-if="userDialogVisible"
      :visible.sync="userDialogVisible"
      :title="$t('knowledge.Set_up_sharing')"
      :close-on-click-modal="false"
      :before-close="hide"
      :leaders="checkeduser.shareUserList"
      v-on:updateUser="handleSelectUser"
      v-on:handle-cancel="hide"
    >
    </user-dialog>
    <apiot-dialog
      class="moveWrap"
      :visible.sync="dialogVisible"
      :title="$t('knowledge.move_to')"
      :before-close="clearFiles"
      v-on:sure-click="handleSubmit"
      v-on:cancle-click="cancel"
    >
      <move-path
        v-if="dialogVisible"
        ref="moveList"
        :showType="showType"
        :fileUrl="getFileUrl"
      ></move-path>
    </apiot-dialog>
    <apiot-dialog
      class="moveWrap"
      :visible.sync="dialogProcessVisible"
      :title="$t('knowledge.transfer_list')"
      :isShowSure="false"
      :isShowFooter="false"
    >
      <progress-bar
        :updateData="updateData"
        :fileUrl="getFileUrl"
        :uploadingFiles="uploadingFiles"
        :fileList="fileList"
      >
      </progress-bar>
    </apiot-dialog>
    <auth-design
      v-if="authDialogVisible"
      :showTabs.sync="authDialogVisible"
      :selectedKeys="selectKeys"
    ></auth-design>
    <image-zoom
      v-if="previewVisible"
      :previewObj="previewObj"
      :picList="picList"
      v-on:doPreviewShare="doPreviewShare"
      v-on:hideImgPreview="hideImgPreview"
      v-on:doPreviewDel="doPreviewDel"
      :isShowDelBtn="isShowImageDel()"
      :isShowShareBtn="isShowShare()"
    ></image-zoom>
    <music-progress
      v-if="musicVisible"
      :previewObj="previewObj"
      v-on:close-audio="handleCloseAudio"
    >
    </music-progress>
    <apiot-dialog
      width="68%"
      :title="videoTitle"
      :visible.sync="videoVisible"
      :isShowSure="false"
      v-on:cancle-click="cancelPreview"
    >
      <video-preview
        :previewObj="previewObj"
        v-if="videoVisible"
      ></video-preview>
    </apiot-dialog>
    <PdfPreview
      :title="previewObj.sysKlTree ? previewObj.sysKlTree.name : ''"
      :visible.sync="pdfVisible"
      v-if="pdfVisible"
      :isShowSure="false"
      :previewObj="previewObj"
      :isBigDialog="true"
    ></PdfPreview>
  </div>
</template>

<script>
import axios from 'axios';
// import mugenScroll from 'vue-mugen-scroll';
import { Decrypt, getBlob, saveAs } from '_u/utils';
import {
  downloadSingle,
  addFolder,
  delFiles,
  doCancelShareFiles,
  doCollect,
  doUpdateShareUser,
  editFolder,
  fetchBusList,
  // eslint-disable-next-line import/named
  getBussinessList,
  getCollectList,
  getCommonList,
  getFileList,
  getKonwledgeList,
  getOthersShareFiles,
  getShareFiles,
  moveFiles,
  shareFiles,
  unCollect,
  visitFiles
} from '@/api/knowledge';
import ajax from '@/api/axiosConfig';
import query from '@/api/query';
import audioFiile from '@/assets/img/audioFile.svg';
import doc from '@/assets/img/DOC.svg';
import elseFile from '@/assets/img/else.svg';
import filesSvg from '@/assets/img/files.svg';
import imageFile from '@/assets/img/imageFile.svg';
import pdf from '@/assets/img/PDF.svg';
import ppt from '@/assets/img/PPT.svg';
import txt from '@/assets/img/TXT.svg';
import vedio from '@/assets/img/vedio.svg';
import xls from '@/assets/img/XLS.svg';
import zipFile from '@/assets/img/zipFile.svg';
import { allowFileType } from '@/config/index';
import FilePath from './FilePath';

const BlockContent = () => import('./BlockContent/index');
const ListContent = () => import('./ListContent/index');
const userDialog = () => import('@/views/orgManage/components/detail/components/userDialog/index');
const MovePath = () => import('./Move/index');
const AuthDesign = () => import('./AuthDesign/index');
const ProgressBar = () => import('./ProgressBar/index');
const RecentlyUsed = () => import('./RecentlyUsed/index');
const ImageZoom = () => import('./ImageZoom/index');
const BussinessList = () => import('./BussinessList/index');
const VideoPreview = () => import('./VideoPreview/index');
const MusicProgress = () => import('./MusicProgressBar/index');

const initPath = { name: '全部', id: 'all' };
export default {
  name: 'knowledgeContent',
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    selectedList: {
      type: Array
    },
    getFilterIds: {
      type: Array
    }
  },
  data() {
    return {
      loadingBtn: false, // 按钮loading
      musicVisible: false, // 音频
      videoVisible: false, // 视频弹框
      videoTitle: '', // 视频名称
      doUploadFile: false, // 表示是否是其他页面的上传
      accept: allowFileType,
      pathArr: [initPath],
      loading: false,
      fileList: [], // 能够正常上传的文件
      resolveFileList: [], // 统计在该页面能正常上传的文件
      rejectFileList: [], // 不能正常上传的文件
      uploadingFiles: [], // 正在上传的文件
      cacheFiles: [], // 缓存文件列表，用于缓存文件列表，没有进行上传的时候进行清空操作
      edit: false,
      groupType: 'all',
      keyWord: '',
      showType: 1,
      active: 2, //
      total: 0,
      selectKeys: [],
      userDialogVisible: false,
      dialogVisible: false,
      authDialogVisible: false,
      list: [],
      dialogProcessVisible: false, // 显示文件进度条
      userInfo: {}, // 用户信息
      checkeduser: {},
      previewObj: {}, // 预览对象
      previewVisible: false,
      shareObj: {}, // 要分享的对象
      businessTreeNode: {}, // 业务树节点
      size: 10,
      current: 1,
      picList: [], // 文件列表
      pdfVisible: false
    };
  },

  components: {
    FilePath,
    BlockContent,
    ListContent,
    userDialog,
    MovePath,
    AuthDesign,
    ProgressBar,
    RecentlyUsed,
    ImageZoom,
    BussinessList,
    VideoPreview,
    MusicProgress,
    // mugenScroll
  },

  computed: {
    isShowShare() {
      return function () {
        if (this.groupType !== 8 && this.showType === 1) {
          return true;
        }
        if (this.showType === 3) return false;
        return false;
      };
    },
    isShowImageDel() {
      return function () {
        if (this.showType === 1) return true;
        if (this.showType === 3) return false; // 业务不显示删除
        if (this.showType === 2) {
          // 企业并且判断选中的文件是否有编辑权限
          if (this.isManage()) return true;
          if (this.previewObj.sysKlEmpower && this.previewObj.sysKlEmpower.deleteAllow) {
            return true;
          }
          if (this.previewObj.sysKlEmpower && !this.previewObj.sysKlEmpower.deleteAllow) {
            return false;
          }
          return true;
        }
      };
    },
    getEnterpriseRights() {
      // 获取企业的编辑权限
      return function () {
        if (this.isManage()) {
          // 如果存在就是超管,上传按钮一直存在
          return true;
        }
        // 不是超管，初始化数据的时候是没有上传按钮的，
        if (this.pathArr.length === 1) {
          // 长度1时是初始化的数据，不需要上传按钮
          return false;
        }
        const auth = this.pathArr[this.pathArr.length - 1]; // 找到进入的文件夹，查看文件夹权限
        const {
          sysKlEmpower: { editAllow }
        } = auth;
        if (editAllow) return true;
        return false;
      };
    },
    isShowUploadBtn() {
      // 是否显示上传按钮，上传按钮只存在文件夹中，由编辑权限控制
      return function () {
        if (this.showType === 1) {
          // 如果是我的 显示上传按钮
          return true;
        }
        if (this.showType === 2) {
          // 如果是企业，需要区分超管用户和普通用户
          return this.getEnterpriseRights();
        }
        if (this.showType === 3) {
          // 业务，没有上传按钮
          return false;
        }
      };
    },
    isShowAdd() {
      // 是否显示新增文件按钮
      return function () {
        if (this.showType === 1 && this.groupType === 'all') {
          // 只有我的并且是全部才显示新增文件夹按钮
          return true;
        }
        if (this.showType === 3) return false; // 业务不显示新增文件夹
        if (this.showType === 2) {
          // 企业
          if (this.groupType === 'all') {
            return this.getEnterpriseRights();
          }
          return false;
        }
      };
    },
    isShowCancel() {
      return function () {
        if (this.showType === 1) {
          if (this.groupType === 9) {
            if (this.selectKeys.length && this.pathArr.length === 1) return true;
            return false;
          }
          return false;
        } // 只有我的并且是全部才显示新增文件夹按钮
        if (this.showType === 3) return false; // 业务不显示新增文件夹
        if (this.showType === 2 && this.groupType === 9) {
          // 企业并且判断选中的文件是否有编辑权限
          if (this.selectKeys.length) {
            if (this.isManage() && this.pathArr.length === 1) return true;
            if (!this.isManage()) {
              // eslint-disable-next-line max-len
              const arr = this.selectKeys.filter(
                (item) => !!item.sysKlEmpower && !!item.sysKlEmpower.editAllow
              );
              if (this.selectKeys.length === arr.length) return true;
            }
            return false;
          }
        }
      };
    },
    isShowMove() {
      // 是否显示移动按钮
      return function () {
        if (this.showType === 1) return true;
        // 只有我的并且是全部才显示新增文件夹按钮
        if (this.showType === 3) return false; // 业务不显示新增文件夹
        if (this.showType === 2) {
          // 企业并且判断选中的文件是否有编辑权限
          if (this.isManage()) return true;
          if (
            this.selectKeys.length === 1 &&
            this.selectKeys[0].sysKlEmpower &&
            this.selectKeys[0].sysKlEmpower.editAllow
          ) return true;
          if (this.selectKeys.length > 1) {
            const arr = this.selectKeys.filter(
              (item) => !!item.sysKlEmpower && !!item.sysKlEmpower.editAllow
            );
            if (this.selectKeys.length === arr.length) return true;
            return false;
          }
        }
      };
    },
    isShowDel() {
      return function () {
        if (this.showType === 1) return true; // 只有我的并且是全部才显示新增文件夹按钮
        if (this.showType === 3) return false; // 业务不显示新增文件夹
        if (this.showType === 2) {
          // 企业并且判断选中的文件是否有编辑权限
          if (this.isManage()) return true;
          if (
            this.selectKeys.length === 1 &&
            this.selectKeys[0].sysKlEmpower &&
            this.selectKeys[0].sysKlEmpower.deleteAllow
          ) return true;
          if (this.selectKeys.length > 1) {
            const arr = this.selectKeys.filter(
              (item) => !!item.sysKlEmpower && !!item.sysKlEmpower.deleteAllow
            );
            if (this.selectKeys.length === arr.length) return true;
            return false;
          }
        }
      };
    },
    isManage() {
      // 是否是超管角色
      return function () {
        const { roleIds = [] } = this.userInfo;
        const manage = roleIds.find((item) => item === 1);
        if (manage) {
          // 如果存在就是超管,上传按钮一直存在
          return true;
        }
        return false;
      };
    },
    isShowSetPermissions() {
      // 是否显示设置权限按钮
      return function () {
        if (this.showType === 1 || this.showType === 3) return false; // 我的和业务是没有设置权限按钮
        if (this.showType === 2 && this.selectKeys.length === 1 && this.groupType === 'all') {
          // 只有超管权限才有
          if (this.isManage()) {
            // 如果存在就是超管,上传按钮一直存在
            return true;
          }
          return false;
        }
        return false;
      };
    },
    isShowListContent() {
      return function () {
        if (
          ((this.active === 2 && this.groupType !== 10) ||
            ([7, 8].includes(this.groupType) && this.active === 1)) &&
          this.showType !== 3
        ) {
          return true;
        }
        return false;
      };
    },
    isChecked() {
      return function () {
        return this.selectKeys.length === this.list.length;
      };
    },
    countTotal() {
      return function () {
        if (this.groupType === 10) {
          const arr = Object.keys(this.list);
          if (arr.length) {
            return arr.reduce((init, cur) => init + this.list[cur].length, 0);
          }
          return 0;
        }
        return this.list.length;
      };
    }
  },

  mounted() {
    this.$bus.$off('showType').$on('showType', (message) => {
      this.showType = message;
      this.selectKeys = [];
    });
    this.$bus.$off('group__type').$on('group__type', (message) => {
      this.groupType = message;
      this.selectKeys = [];
    });
    this.$bus.$off('doSearch').$on('doSearch', (message) => {
      this.doSearch(message);
    });
    this.$bus.$off('selectMenu_knowledge').$on('selectMenu_knowledge', (message) => {
      this.businessTreeNode = message;
      this.current = 1;
      this.getBussinessFiles();
    });
    setTimeout(() => {
      this.userInfo = this.$store.state.userCenter.userInfo;
    }, 500);
    if (this.isDialog) {
      this.initDialog();
    }
  },
  beforeDestroy() {
    this.$bus.$off('showType');
    this.$bus.$off('group__type');
    this.$bus.$off('doSearch');
    this.$bus.$off('selectMenu_knowledge');
  },
  watch: {
    groupType: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.groupType = newValue;
        this.keyWord = '';
        if (this.showType !== 3) {
          if (this.isDialog) {
            this.showType = 2;
          }
          this.init();
        }
      }
    },
    showType: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.showType = newValue;
        this.keyWord = '';
        if (this.showType !== 3 && !this.isDialog) {
          this.init();
        }
        if (this.showType === 3) {
          this.list = [];
          this.pathArr = [initPath];
        }
      }
    },
    selectKeys(v) {
      if (this.isDialog) {
        this.$emit('update:selectedList', v);
      }
    }
  },

  methods: {
    fetchData() {
      console.log('加载');
    },
    // 初始化dialog的数据
    initDialog() {
      this.changeView(2);
    },
    handleCloseAudio() {
      this.previewObj = {};
      this.musicVisible = false;
    },
    cancelPreview() {
      this.previewObj = {};
    },
    async getBussinessFiles() {
      // 获取业务数据
      this.loading = true;
      const len = this.pathArr.length;
      let params = null;
      let api = getBussinessList;
      if (len === 1) {
        params = {
          menuId: this.businessTreeNode.id,
          current: this.current,
          size: this.size,
          searchKey: this.keyWord
        };
        api = getBussinessList;
      } else {
        params = {
          parentId: this.pathArr[len - 1].id,
          menuId: this.businessTreeNode.id,
          current: this.current,
          size: this.size,
          keywords: this.keyWord
        };
        api = fetchBusList;
      }

      try {
        const res = await api(params);
        const list = res.records || [];
        const newListData = list.map((item) => ({ ...item, showIndex: true }));
        this.list = newListData;
        this.total = res.total || 0;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async download() {
      // 下载文件
      this.loading = true;
      if (
        this.selectKeys.length === 1 &&
        ((this.selectKeys[0].sysKlTree && this.selectKeys[0].sysKlTree.treeType !== 1) ||
          (this.selectKeys[0].treeType && this.selectKeys[0].treeType !== 1))
      ) {
        const fileObj = this.selectKeys[0].sysKlTree || this.selectKeys[0]; // 单个文件的下载
        // getBlob({ url: fileObj.url }, (blob) => {
        //   saveAs(blob, fileObj.name);
        //   this.loading = false;
        // });
        const data = await downloadSingle({ url: fileObj.url });
        saveAs(data, fileObj.name);
        this.loading = false;
        return;
      }
      const arr = this.selectKeys.map((item) => {
        if (item.sysKlTree) {
          return item.sysKlTree.id;
        }
        return item.id;
      });
      try {
        const url = `${query.DO_KNOWLEDGE_DOWNLOAD}?ids=${arr.join(',')}`;
        getBlob({ url, token: Decrypt(localStorage.getItem('token') || '') }, (blob) => {
          saveAs(blob, '文件.zip');
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    hideImgPreview() {
      // 关闭预览
      this.previewVisible = false;
      this.shareObj = {};
    },
    doPreviewShare(obj) {
      // 预览进行分享
      this.userDialogVisible = true;
      this.shareObj = obj;
    },
    async doPreviewDel(obj) {
      // 进行文件删除
      try {
        await this.$confirm(this.$t('knowledge.delete_files'), this.$t('common.tip'), {
          type: 'warning'
        });
        const params = {
          ids: obj.sysKlTree.id
        };
        await this.doDel(params);
        this.hideImgPreview();
      } catch (err) {
        // this.isSelectdEdit = false;
      }
    },
    init() {
      // 初始化
      this.list = [];
      this.pathArr = [initPath];
      if (this.groupType === 'all') {
        // 全部
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: 0,
          isFolder: 0
        };
        this.initKonwledge(params);
        return;
      }
      if (this.groupType === 9) {
        // 收藏
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          userId: this.userInfo.id
        };
        this.initKonwledge(params);
        return;
      }
      if (this.groupType === 10) {
        // 最近常用
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          userId: this.userInfo.id
        };
        this.list = {};
        this.initKonwledge(params);
        return;
      }
      if (this.groupType === 7 || this.groupType === 8) {
        this.initKonwledge({});
        return;
      }
      if (this.groupType !== 'all') {
        // 分
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          fileType: this.groupType,
          current: 1,
          size: 99999999
        };
        this.initKonwledge(params);
      }
    },
    async doCancelShare() {
      // 取消分享文件
      try {
        await this.$confirm(this.$t('knowledge.cancel_show'), this.$t('common.tip'), {
          type: 'warning'
        });
        const idsArr = this.selectKeys.map((item) => {
          if (item.sysKlTree) {
            return item.sysKlTree.id;
          }
          return item.id;
        });
        const params = {
          classId: this.showType,
          ids: idsArr.join(','),
          ownid: this.userInfo.id,
          shareType: 1
        };
        await doCancelShareFiles(params);
        this.selectKeys = [];
        this.initKonwledge({});
      } catch (e) {
        this.selectKeys = [];
      }
    },
    async doUpload(param) {
      // 上传
      const { file } = param;
      this.cacheFiles = []; // 每次点击上传的时候把缓存文件清空
      await this.beforeUpload(file);
    },
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        const newSize = size / 1024 < 3000000;
        console.log(type, '111', this.accept);
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: this.$t('knowledge.error_files')
          });
          this.rejectFileList.push(file);
          reject(file);
          return;
        }
        if (!newSize) {
          this.$message({
            type: 'warning',
            message: this.$t('knowledge.size_more')
          });
          this.rejectFileList.push(file);
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    handleChange(response, file, fileList) {
      this.resolveFileList.push(file);
      this.cacheFiles.push(file);
      const total = this.resolveFileList.length + this.rejectFileList.length;
      this.fileList.push(file);
      const successFilesList = fileList.length + this.rejectFileList.length;
      if (successFilesList === total) {
        this.uploadFile();
      }
    },
    getFileType(suffix) {
      const type = suffix.toLowerCase();
      if ('.png, .jpg,.gif, .jpeg'.indexOf(type) > -1) {
        return 3;
      }
      if (
        '.txt, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .vsdx, .zip, .rar, .xmind, .emmx, .log, .chm'.indexOf(
          type
        ) > -1
      ) {
        return 2;
      }
      if ('.mp3'.indexOf(type) > -1) {
        return 5;
      }
      if ('.mp4, .avi, .m4a'.indexOf(type) > -1) {
        return 4;
      }
      return 6;
    },
    doUploadFiles(pid) {
      // 上传文件
      this.fileList.forEach((item, index) => {
        const i = this.uploadingFiles.findIndex((obj) => obj.uid === item.uid);
        if (i === -1) {
          this.relationsFile(item, index, pid);
        }
      });
      this.cacheFiles = [];
      this.dialogProcessVisible = true;
    },
    uploadFile() {
      // 开始上传文件，如果文件在全部里面，就直接上传，如果在其他的类型里面，需要选择上传的目录
      //  如果有正在上传的文件，先把this.fileList中正在上传的文件剔除出来
      if (this.groupType === 'all' && this.fileList.length) {
        this.doUploadFiles();
      } else {
        this.dialogVisible = true;
        this.doUploadFile = true;
      }
    },
    async relationsFile(item, index, pid) {
      // 并发进行上传文件，上传的时候要进行管理，如果上传的过程中已经有文件还在上传，就不需要重新上传
      const { name, uid } = item;
      const suffixArr = name.split('.');
      const treeType = this.getFileType(suffixArr[suffixArr.length - 1]);
      const formData = new FormData();
      const current = this.pathArr[this.pathArr.length - 1];
      const parentId = current.id === 'all' ? 0 : current.id;
      console.log(this.doUploadFile, this.doUploadFile ? pid : parentId);
      formData.append('file', item.raw);
      formData.append('parentId', this.doUploadFile ? pid : parentId);
      formData.append('treeClass', this.showType);
      formData.append('treeType', treeType);
      formData.append('name', name);
      formData.append('uploadUserName', this.userInfo.username);
      this.uploadingFiles.push(item); // 放入上传中进行管理
      const source = axios.CancelToken.source();
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: Decrypt(localStorage.getItem('token') || '')
        },
        cancelToken: source.token
      };
      // eslint-disable-next-line no-shadow
      const fetch = axios.create({
        withCredentials: true,
        ...config,
        onUploadProgress: (progressEvent) => {
          // 对原生进度事件的处理
          // eslint-disable-next-line no-mixed-operators
          const upload = (progressEvent.loaded / progressEvent.total) * 100 || 0;
          const pr = upload.toFixed();
          const realIndex = this.fileList.findIndex((obj) => obj.uid === uid);
          if (realIndex === -1) return;
          this.$set(this.fileList, realIndex, { ...item, upload: Number(pr), source, treeType });
        }
      });
      // 添加响应拦截器
      fetch.interceptors.response.use(
        (res) => {
          const codeNumber = res.data.code;
          if (codeNumber === '00000') {
            return res.data.data;
          }
          return Promise.reject(res.data);
        },
        (error) => Promise.reject(error)
      );
      fetch
        .post(`${ajax.baseURL}system/knowledge/saveFile`, formData, config)
        .then(() => {
          this.delFileFromUploadingFiles(item);
          this.initKonwledge({});
        })
        .catch(() => {
          this.delFileFromUploadingFiles(item);
        });
    },
    delFileFromUploadingFiles(file) {
      // 无论上传成功或者是失败，都需要充管理的数组进行删除
      const index1 = this.uploadingFiles.findIndex((items) => items.uid === file.uid);
      if (index1 !== -1) {
        this.uploadingFiles.splice(index1, 1);
      }
      if (this.dialogProcessVisible && !this.uploadingFiles.length) {
        this.dialogProcessVisible = false;
      }
      const index = this.fileList.findIndex((items) => items.uid === file.uid);
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
    },
    doSearch(message) {
      this.keyWord = message;
      this.selectKeys = [];
      let params = {};
      if (this.groupType === 9) {
        params = {
          classId: this.showType,
          keywords: this.keyWord,
          userId: this.userInfo.id
        };
      }
      this.initKonwledge(params);
    },
    hide() {
      // 关闭
      this.userDialogVisible = false;
      this.checkeduser = {};
    },
    showShareUserList(message) {
      this.checkeduser = message;
      this.userDialogVisible = true;
    },
    async editFileName(name, fId) {
      //  编辑文件名称
      if (!name) {
        this.$message({
          type: 'warning',
          message: this.$t('knowledge.error_empty')
        });
        return;
      }
      // console.log(this.groupType);
      if (this.groupType !== 10) {
        const sortName = this.list.filter(
          (item) => item.sysKlTree.name === name && item.sysKlTree.id !== fId
        );
        if (sortName.length) {
          this.$message({
            type: 'warning',
            message: this.$t('knowledge.error_same_name')
          });
          return;
        }
      }
      const { id } = this.selectKeys[0].sysKlTree;
      try {
        await editFolder({ id, name });
        if (this.groupType === 'all') {
          // 如果是全部，需要看路径进行刷新
          const pid = this.pathArr[this.pathArr.length - 1].id;
          const params = {
            classId: this.showType,
            keywords: this.keyWord,
            parentId: pid === 'all' ? 0 : pid,
            isFolder: 0
          };
          await this.initKonwledge(params);
          this.selectKeys = [];
          this.edit = false;
        } else {
          await this.initKonwledge({});
          this.selectKeys = [];
          this.edit = false;
        }
      } catch (e) {
        this.edit = false;
      }
    },
    changePath(item) {
      // 更改路径
      const index = this.pathArr.findIndex((obj) => obj.id === item.id);
      if (!['all', 9, 7, 8].includes(this.groupType)) return;
      let params = {};
      if (!index || index === -1) {
        this.pathArr = [initPath];
        if (this.showType === 3) {
          this.getBussinessFiles();
          return;
        }
        params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: 0,
          isFolder: 0
        };
        if ([7, 8, 9].includes(this.groupType)) {
          params = {
            classId: this.showType,
            keywords: this.keyWord,
            userId: this.userInfo.id
          };
        }
      } else {
        this.pathArr = this.pathArr.slice(0, index + 1);
        params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: item.id,
          isFolder: 0
        };
      }
      this.selectKeys = [];
      this.initKonwledge(params);
    },
    async handlePreview(item) {
      // 如果是文件夹类型，就进入下个文件夹，如果是文件，则预览
      if (this.showType === 3 || !item.sysKlTree) {
        item = {
          sysKlTree: {
            ...item
          }
        };
      }
      const { treeType, id, name } = item.sysKlTree || item;
      if (treeType === 1 && this.showType !== 3) {
        this.selectKeys = [];
        this.pathArr.push({ id, name, sysKlEmpower: item.sysKlEmpower });
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: id
        };
        this.initKonwledge(params);
        return false;
      }
      if (treeType === 1 && this.showType === 3) {
        // 文件夹进入下一个页面
        this.selectKeys = [];
        this.pathArr.push({ id, name, sysKlEmpower: item.sysKlEmpower });
        this.getBussinessFiles();
        return false;
      }
      if (treeType === 2) {
        const arr = name.split('.');
        if (arr[1] && arr[1] === 'pdf') {
          this.previewObj = item;
          this.pdfVisible = true;
        }
      }
      if (treeType === 3) {
        // 图片预览
        this.previewObj = item;
        this.picList = this.list.filter((liObj) => {
          const { treeType: imageType } = liObj.sysKlTree || liObj;
          return imageType === 3;
        });
        this.picList = this.picList.map((item1) => {
          if (item1.sysKlTree) return item1;
          return {
            sysKlTree: {
              ...item1
            }
          };
        });
        if (this.$store.state.globalConfig.waterConfig.enableWaterMask === '1') {
          const index = this.picList.findIndex((file) => file.sysKlTree.id === item.sysKlTree.id);
          if (index !== -1) {
            this.loading = true;
            const data = await downloadSingle({ url: this.picList[index].sysKlTree.url });
            this.loading = false;
            this.picList[index].sysKlTree.blob = data;
          }
        }
        this.previewVisible = true;
      }
      if (treeType === 4) {
        // 视频预览
        this.videoTitle = name;
        this.videoVisible = true;
        this.previewObj = item;
      }
      if (treeType === 5) {
        // 歌曲试听
        this.previewObj = item;
        this.musicVisible = true;
      }
      visitFiles({ classId: this.showType, userId: this.userInfo.id, id });
    },
    async initKonwledge(params) {
      // 获取数据
      this.loading = true;
      try {
        let api = getKonwledgeList;
        if (this.groupType === 'all') {
          api = getKonwledgeList;
        } else if ([2, 3, 4, 5, 6].includes(this.groupType)) {
          api = getFileList;
        } else if (this.groupType === 9) {
          api = getCollectList;
        } else if (this.groupType === 10) {
          api = getCommonList;
        } else if (this.groupType === 7) {
          api = getShareFiles;
        } else if (this.groupType === 8) {
          api = getOthersShareFiles;
        }
        let data = {};
        if (this.groupType === 'all') {
          const pid = this.pathArr[this.pathArr.length - 1].id;
          const param = {
            classId: this.showType,
            keywords: this.keyWord,
            parentId: pid === 'all' ? 0 : pid,
            isFolder: 0
          };
          data = { ...data, ...param, ...params };
        } else if (this.groupType === 9) {
          const pid = this.pathArr[this.pathArr.length - 1].id;
          if (pid === 'all') {
            data = {
              classId: this.showType,
              keywords: this.keyWord,
              userId: this.userInfo.id,
              ...params
            };
          } else {
            data = {
              classId: this.showType,
              keywords: this.keyWord,
              parentId: pid === 'all' ? 0 : pid,
              isFolder: 0
            };
            api = getKonwledgeList;
          }
        } else if (this.groupType === 10) {
          data = {
            classId: this.showType,
            keywords: this.keyWord,
            userId: this.userInfo.id
          };
        } else if (this.groupType === 7 || this.groupType === 8) {
          const pid = this.pathArr[this.pathArr.length - 1].id;
          if (pid === 'all') {
            data = {
              classId: this.showType,
              keywords: this.keyWord,
              userId: this.userInfo.id
            };
          } else {
            data = {
              classId: this.showType,
              keywords: this.keyWord,
              parentId: pid === 'all' ? 0 : pid,
              isFolder: 0
            };
            api = getKonwledgeList;
          }
        } else {
          data = {
            ...params,
            classId: this.showType,
            fileType: this.groupType,
            current: 1,
            keywords: this.keyWord,
            size: 99999999
          };
        }
        this.list = [];
        const treeData = await api(data);
        const newTreeData = ['all', 9, 10, 7, 8].includes(this.groupType)
          ? treeData
          : treeData.records || [];
        this.loading = false;
        if (this.groupType === 10) {
          this.list = newTreeData;
        } else {
          const newListData = newTreeData.map((item) => ({ ...item, showIndex: true }));
          // console.log(newListData, 'newListData');
          this.list = newListData.sort((a, b) => {
            if (a.sysKlTree && b.sysKlTree) {
              return a.sysKlTree.treeType - b.sysKlTree.treeType;
            }
            return a.treeType - b.treeType;
          });
        }
      } catch (e) {
        this.loading = false;
      }
    },
    updateData(key, value) {
      this[key] = value;
    },
    getFileList() {
      this.current = 1;
      this.getBussinessFiles();
    },
    cancel() {
      this.clearFiles();
    },
    clearFiles() {
      // 取消选择位置的时候，把文件缓存给清除
      this.dialogVisible = false;
      this.doUploadFile = false;
      this.cacheFiles.forEach((item) => {
        const index = this.fileList.findIndex((obj) => obj.uid === item.uid);
        this.fileList.splice(index, 1);
      });
    },
    async handleSubmit() {
      // 移动位置提交
      const { selectKeys } = this.$refs.moveList;
      if (!selectKeys.length) {
        this.$message({
          type: 'warning',
          message: this.$t('knowledge.error_right_files')
        });
        return;
      }
      const pid = selectKeys[0].sysKlTree.id;
      if (this.doUploadFile) {
        this.doUploadFiles(pid);
        this.dialogVisible = false;
        this.doUploadFile = false;
        return;
      }
      try {
        await moveFiles({
          parentId: pid,
          ids: this.selectKeys.map((item) => item.sysKlTree.id).join(',')
        });
        await this.initKonwledge({});
        this.dialogVisible = false;
        this.selectKeys = [];
      } catch (e) {
        this.dialogVisible = false;
      }
    },
    scroll() { // 滚动
      console.log('滚动');
    },
    async moveFilesToNewFile({ dom, chooseItemId }) {
      const id = dom.related.getAttribute('data-id');
      const dragFile = this.list.find((item) => {
        if (item.sysKlTree) {
          return item.sysKlTree.id === Number(chooseItemId);
        }
        if (!item.sysKlTree) {
          return item.id === Number(chooseItemId);
        }
        return false;
      });
      const basetype = dom.related.getAttribute('data-treeType');
      if (Number(basetype) !== 1) {
        this.$message({
          type: 'warning',
          message: this.$t('knowledge.error_right_files')
        });
        return;
      }
      if (this.isManage() || this.showType === 1) {
        // 是管理员直接操作
        const params = {
          parentId: id,
          ids: chooseItemId
        };
        this.move(params);
        return;
      }
      if (
        dragFile &&
        this.showType === 2 &&
        dragFile.sysKlEmpower &&
        !dragFile.sysKlEmpower.editAllow
      ) {
        this.$message({
          type: 'warning',
          message: this.$t('knowledge.error_no_premiss')
        });
        return false;
      }
      if (this.showType === 2) {
        if (this.pathArr.length === 1 && !this.isManage()) {
          // 长度1时是初始化的数据，不需要上传按钮
          return false;
        }
        const auth = this.pathArr[this.pathArr.length - 1]; // 找到进入的文件夹，查看文件夹权限
        if (auth.sysKlEmpower && !auth.sysKlEmpower.editAllow) return false;
      }
      const params = {
        parentId: id,
        ids: chooseItemId
      };
      this.move(params);
    },
    async move(params) {
      try {
        await moveFiles(params);
        this.selectKeys = [];
        await this.initKonwledge({});
      } catch (e) {
        this.dialogVisible = false;
      }
    },
    async selectBtn({ type }) {
      // 按钮操作
      // console.log(type);
      if (type === 'collect') {
        this.handleCollect();
      }
      if (type === 'move') {
        this.dialogVisible = true;
      }
      if (type === 'rename') {
        this.edit = true;
      }
      if (type === 'del') {
        try {
          await this.$confirm(this.$t('knowledge.delete_files'), this.$t('common.tip'), {
            type: 'warning'
          });
          const params = {
            ids: this.selectKeys.map((item) => item.sysKlTree.id).join(',')
          };
          this.doDel(params);
        } catch (err) {
          // this.isSelectdEdit = false;
        }
      }
    },
    async handleCollect() {
      // 收藏
      const idArr = this.selectKeys.map((item) => {
        if (item.sysKlTree) {
          return item.sysKlTree.id;
        }
        return item.id;
      });
      const params = {
        classId: this.showType,
        userId: this.userInfo.id,
        ids: idArr.join(',')
      };
      try {
        await doCollect(params);
        this.$message({
          type: 'success',
          message: this.$t('knowledge.success_collect')
        });
        this.selectKeys = [];
      } catch (e) {
        // console.log(e);
      }
    },
    async doDel(params) {
      this.loading = true;
      try {
        await delFiles(params);
        this.loading = false;
        this.selectKeys = [];
        this.initKonwledge({});
      } catch (e) {
        this.loading = false;
      }
    },
    async handleSelectUser(userList) {
      // 分享文件
      if (!userList.length) {
        this.$message({
          type: 'warning',
          message: this.$t('knowledge.error_choose_users')
        });
        return;
      }
      const idArr = this.selectKeys.map((item) => item.sysKlTree.id);
      const useridsArr = userList.map((item) => item.id);
      let params = {};
      const isTrue = JSON.stringify(this.checkeduser) !== '{}';
      const data = {
        classId: this.showType,
        ownid: this.userInfo.id,
        shareType: 1,
        userids: useridsArr.join(',')
      };
      if (isTrue) {
        // 设置分享人
        params = {
          id: this.checkeduser.row.id || this.checkeduser.row.sysKlTree.id,
          userId: this.userInfo.id,
          beSharedIds: useridsArr.join(',')
        };
      } else if (JSON.stringify(this.previewObj) === '{}' && !this.previewVisible) {
        // 正常分享
        params = {
          ids: idArr.join(','),
          ...data
        };
      } else {
        // 属于预览分享
        params = {
          ids: this.previewObj.sysKlTree.id,
          ...data
        };
      }
      try {
        const api = isTrue ? doUpdateShareUser : shareFiles;
        await api(params);
        this.$message({
          type: 'success',
          message: this.$t('knowledge.success_show_files')
        });
        this.userDialogVisible = false;
        this.selectKeys = [];
        this.checkeduser = {};
      } catch (e) {
        this.userDialogVisible = false;
        this.selectKeys = [];
        this.checkeduser = {};
      }
    },
    selectList(row) {
      this.selectKeys = row;
    },
    changeView(type) {
      this.active = type;
    },
    async handleAdd() {
      // 新增文件夹
      const arr = this.list.filter(
        (item) => item.sysKlTree.name.indexOf(this.$t('knowledge.no_name_file')) > -1
      );
      const len = arr.length;
      const name = `${this.$t('knowledge.no_name_file')}${len < 1 ? '' : len + 1}`;
      if (this.edit === true) {
        return;
        // this.edit = false;
        // this.selectKeys = [];
      }
      try {
        const currentFolder = this.pathArr[this.pathArr.length - 1];
        const id = currentFolder.id === 'all' ? 0 : currentFolder.id;
        const res = await addFolder({
          name,
          parentId: id,
          treeClass: this.showType,
          treeType: 1,
          uploadUserName: this.userInfo.username
        });
        this.list.unshift({ sysKlTree: res });
        this.edit = true;
        this.selectKeys = [{ sysKlTree: res }];
      } catch (e) {
        // console.log(e);
      }
    },
    getFileUrl(obj) {
      if ((obj.sysKlTree && obj.sysKlTree.treeType === 2) || obj.treeType === 2) {
        let url = '';
        if (obj.sysKlTree && obj.sysKlTree.url) {
          url = obj.sysKlTree.url;
        } else {
          url = obj.url;
        }
        if (!url) return xls;
        const suffixArr = url.split('.');
        if (!suffixArr.length) return txt;
        const suffix = suffixArr[suffixArr.length - 1].toLowerCase();
        if (suffix === 'txt') return txt;
        if (['xls', 'xlsx'].includes(suffix)) return xls;
        if (['ppt', 'pptx'].includes(suffix)) return ppt;
        if (suffix === 'pdf') return pdf;
        if (['docx', 'doc'].includes(suffix)) return doc;
        if (['zip', 'rar'].includes(suffix)) return zipFile;
        if (['vsdx', 'xmind', 'emmx', 'log', 'chm'].includes(suffix)) return elseFile;
        return xls;
      }
      if ((obj.sysKlTree && obj.sysKlTree.treeType === 3) || obj.treeType === 3) {
        return imageFile;
      }
      if ((obj.sysKlTree && obj.sysKlTree.treeType === 4) || obj.treeType === 4) {
        return vedio;
      }
      if ((obj.sysKlTree && obj.sysKlTree.treeType === 5) || obj.treeType === 5) {
        return audioFiile;
      }
      if ((obj.sysKlTree && obj.sysKlTree.treeType === 6) || obj.treeType === 6) {
        return elseFile;
      }
      if ((obj.sysKlTree && obj.sysKlTree.treeType === 1) || obj.treeType === 1) {
        return filesSvg;
      }
    },
    chooseFile(value) {
      // 分组中的全部选择
      if (value) {
        this.selectKeys = JSON.parse(JSON.stringify(this.list));
      } else {
        this.selectKeys = [];
      }
    },
    async cancelCollect() {
      // 取消收藏
      try {
        await this.$confirm(this.$t('knowledge.cancel_collect'), this.$t('common.tip'), {
          type: 'warning'
        });
        const idArr = this.selectKeys.map((item) => item.sysKlTree.id);
        await unCollect({
          classId: this.showType,
          userId: this.userInfo.id,
          ids: idArr.join(',')
        });
        this.initKonwledge({
          classId: this.showType,
          keywords: this.keyWord,
          userId: this.userInfo.id
        });
        this.selectKeys = [];
      } catch (err) {
        this.selectKeys = [];
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .btnWrap {
    position: relative;
    height: 42px;
    width: 100%;
    padding: 6px 10px 6px 0;
    overflow: hidden;
    box-sizing: border-box;

    .btnWrap__btnCommon {
      margin-right: 3px;
      color: #4689f5;
      font-size: 16px;
    }
    .uploadingWrap {
      width: 248px;
      height: 30px;
      position: absolute;
      top: 6px;
      right: 80px;
      font-size: 13px;
      line-height: 30px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      background: #f1f3f6;
      border-radius: 4px;
      text-align: center;
      & > span {
        color: #4689f5;
      }
      .icon-gengxin {
        display: inline-block;
        vertical-align: middle;
        color: #4689f5;
        animation: clockwise 5s linear infinite;
      }
    }
    .btnWrap__ope {
      position: absolute;
      right: 10px;
      top: 6px;

      ::v-deep {
        .el-button {
          padding: 0 4px;
        }

        .el-button--primary .iconfont {
          color: #ffffff;
        }
      }

      .iconfont {
        font-size: 20px;
        color: #bbc3cd;
      }
    }

    .btnWrap__search {
    }

    ::v-deep {
      .el-dropdown {
        margin-left: 10px;
      }
      .el-upload-list--picture {
        display: none;
      }
    }
  }

  .pathWrap {
    height: 36px;
    width: 100%;
    padding: 0 10px;
    position: relative;
    line-height: 36px;
    border-top: 1px solid #e9e9e9;
    overflow: hidden;
    box-sizing: border-box;

    .pathWrap__select {
      float: right;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
    }
  }

  .contentTypeWrap {
    width: 100%;
    height: calc(100% - 36px - 42px);
    //overflow: auto;
    overflow: hidden;
  }

  .moveWrap {
    ::v-deep {
      .el-dialog__body {
        padding: 0 10px;
      }
    }
  }
}
</style>
