<!-- 知识库 页面 -->
<template>
  <div class="contentWrap" v-loading="loading">
    <div class="btnWrap">
      <apiot-button
        :style="getStyle"
        @mouseenter.native="isHover = true"
        @mouseleave.native="isHover = false"
        type="primary"
        @click="doRelateKnowledge"
        v-if="showRelateBtn && !this.keyWord && relateDataComp.value"
      >
        <i class="iconfont icon-guanxiguanlian"></i>
        {{ $t('knowledge.relateK') }}
      </apiot-button>
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
        <apiot-button
          type="primary"
          v-if="
            configData.showUploadBtn &&
            canShowBtn &&
            !this.keyWord &&
            relateDataComp.value
          "
        >
          <i class="icon-shangchuan iconfont" style="margin-right: 4px"></i>
          {{ $t('knowledge.upload') }}
        </apiot-button>
      </el-upload>
      <apiot-button
        @click="handleAdd"
        v-if="
          configData.showNewBtn &&
          canShowBtn &&
          !this.keyWord &&
          relateDataComp.value
        "
      >
        <span class="iconfont icon-xinzengwenjianjia btnWrap__btnCommon"></span>
        {{ $t('knowledge.Add_folder') }}
      </apiot-button>
      <apiot-button
        v-if="showReplaceBtn && !this.keyWord"
        @click="replaceNewClick"
      >
        <span class="iconfont icon-shangchuan btnWrap__btnCommon"></span>
        {{ $t('knowledge.uploadNew') }}
      </apiot-button>
      <apiot-button v-if="showDisassociate && !this.keyWord" @click="unbindKl">
        <span class="iconfont icon-jiechuguanlian btnWrap__btnCommon"></span>
        {{ $t('knowledge.disassociate') }}
      </apiot-button>
      <apiot-button v-if="showDownload" @click="download">
        <span class="iconfont icon-xiazai btnWrap__btnCommon"></span>
        {{ $t('knowledge.download') }}
      </apiot-button>
      <el-dropdown
        trigger="click"
        @command="selectBtn"
        v-if="(showDel || showRename) && !this.keyWord"
      >
        <apiot-button>
          <span class="iconfont icon-qita btnWrap__btnCommon"></span>
          {{ $t('knowledge.More_actions') }}
        </apiot-button>
        <el-dropdown-menu slot="dropdown" style="border: none">
          <el-dropdown-item :command="{ type: 'rename' }" v-show="showRename">
            <span class="iconfont icon-bianji rename"></span>
            {{ $t('knowledge.Rename') }}
          </el-dropdown-item>
          <el-dropdown-item :command="{ type: 'del' }" v-show="showDel">
            <span class="iconfont icon-shanchu delete"></span>
            {{ $t('knowledge.delete') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <div class="btnWrap__ope">
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
        class="knowledgeSearch"
        v-if="configData.showSearch"
        @getList="getFileList"
        v-model="keyWord"
      ></search-input>
    </div>
    <input
      ref="replaceNewFile"
      type="file"
      :accept="replaceNewAccept"
      style="display: none"
      @change="inputChange"
    />
    <div class="pathWrap">
      <file-path :pathArr="pathArr" v-on:changePath="changePath"></file-path>
      <div class="pathWrap__select">
        {{ $t('knowledge.chosen') }}{{ selectKeys.length
        }}{{ $t('knowledge.ge') }}， {{ $t('knowledge.A_total_of')
        }}{{ countTotal() }}{{ $t('knowledge.files_total') }}
      </div>
    </div>
    <div class="contentTypeWrap">
      <block-content
        :list="list"
        :edit="edit"
        :loading="loading"
        :selectKeys="selectKeys"
        v-if="active === 1 && showType !== 3 && ![7, 8, 10].includes(groupType)"
        v-on:checkall="chooseFile"
        :fileUrl="getFileUrl"
        :updateData="updateData"
        @showHisList="showHisList"
        v-on:preview="handlePreview"
        v-on:editFileName="editFileName"
        v-on:loadMore="loadMore"
        v-on:moveFileToNewFile="moveFilesToNewFile"
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
        @showHisList="showHisList"
        :configData="configData"
        v-on:preview="handlePreview"
        v-on:editFileName="editFileName"
        v-on:showShareUserList="showShareUserList"
        v-on:loadMore="loadMore"
        v-if="isShowListContent()"
      >
      </list-content>
    </div>
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
    <RelateKnowledge
      :visible.sync="knowledgeShow"
      :knowledgeShow="knowledgeShow"
      :getRelateIds="getRelateIds"
      @knowledgeSelected="knowledgeSelected"
    ></RelateKnowledge>
    <ReplaceNewVersion
      :visible.sync="showReplaceDialog"
      :showReplaceDialog="showReplaceDialog"
      :selectKeys="selectKeys"
      :fileUrl="getFileUrl"
      :curFile="curFile"
      @replaceSureClick="replaceSureClick"
    ></ReplaceNewVersion>
    <KnowHisDialog
      :visible.sync="showHis"
      :showHis="showHis"
      :hisObj="hisObj"
      :fileUrl="getFileUrl"
    ></KnowHisDialog>
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
import { Decrypt, saveAs, createUnique } from '_u/utils';
import axios from 'axios';
import { lighten } from '@/utils/varyColor';
import {
  downloadSingle,
  // getKonwledgeList,
  getAllFileList,
  saveFolder,
  updateFolder,
  deleteFile,
  moveFiles,
  doCollect,
  visitFiles,
  getBussinessList,
  fetchBusList,
  listFiles,
  bindKl,
  unbindKl,
  downFiles,
  searchFiles
  // eslint-disable-next-line import/named
} from '@/api/knowledge';
import ajax from '@/api/axiosConfig';
import xls from '@/assets/img/XLS.svg';
import zipFile from '@/assets/img/zipFile.svg';
import txt from '@/assets/img/TXT.svg';
import ppt from '@/assets/img/PPT.svg';
import pdf from '@/assets/img/PDF.svg';
import doc from '@/assets/img/DOC.svg';
import imageFile from '@/assets/img/imageFile.svg';
import vedio from '@/assets/img/vedio.svg';
import audioFiile from '@/assets/img/audioFile.svg';
import elseFile from '@/assets/img/else.svg';
import filesSvg from '@/assets/img/files.svg';
import { allowFileType } from '@/config/index';
import FilePath from './FilePath';

const BlockContent = () => import('./BlockContent/index');
const ListContent = () => import('./ListContent/index');
const ProgressBar = () => import('./ProgressBar/index');
const ImageZoom = () => import('./ImageZoom/index');
const VideoPreview = () => import('./VideoPreview/index');
const MusicProgress = () => import('./MusicProgressBar/index');

const initPath = { name: '全部', id: 'all' };
export default {
  name: 'knowledgeContent',
  props: {
    configData: {
      type: [Array, Object]
    },
    activeObj: {
      type: [Array, Object]
    },
    hasTriggerComp: {
      type: Object
    },
    isSidebar: {
      type: Boolean,
      default: false
    },
    // 爹
    parent: {
      type: Object
    }
  },
  data() {
    return {
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
      showType: 2,
      active: 2, // 用户状态枚举
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
      size: 100,
      current: 1,
      requestType: 1, // 1 代表关联资料 2 代表 知识库
      isHover: false, // 按钮是否悬浮
      knowledgeShow: false, // 关联知识库弹窗
      replaceNewAccept: '*', // 上传新版本接收类型
      curFile: null, // 上传新版本文件
      showReplaceDialog: false, // 上传新版本弹窗
      relateDataComp: {
        value: '',
        tableName: ''
      },
      relateBusiComp: {
        value: '',
        tableName: ''
      },
      showHis: false, // 历史版本是否显示
      hisObj: null,
      picList: [], // 图片集合
      listTotal: 0, // 所有文件数量总数
      pdfVisible: false // Pdf 预览
    };
  },

  components: {
    FilePath,
    BlockContent,
    ListContent,
    ProgressBar,
    ImageZoom,
    VideoPreview,
    MusicProgress
  },

  computed: {
    // 能否展示按钮
    canShowBtn() {
      if (this.pathArr.length) {
        const current = this.pathArr[this.pathArr.length - 1];
        if (current.id === 'all' || current.materialType === 1) {
          return true;
        }
      }
      return false;
    },
    // 是否显示关联
    showRelateBtn() {
      if (this.pathArr.length) {
        const current = this.pathArr[this.pathArr.length - 1];
        if (current.id === 'all') {
          return this.configData.showRelateBtn;
        }
      }
      return false;
    },
    getRelateIds() {
      const ids = [];
      this.list.forEach((item) => {
        if (item.sysKlTree.klTreeId) {
          ids.push(item.sysKlTree.klTreeId);
        }
      });
      return ids;
    },
    // 是否显示解除关联
    showDisassociate() {
      if (this.showRelateBtn && this.selectKeys.length) {
        const index = this.selectKeys.findIndex((item) => {
          if (item.sysKlTree.materialType !== 2) {
            return true;
          }
          return false;
        });
        if (index === -1) {
          return true;
        }
      }
      return false;
    },
    // 是否显示重命名
    showRename() {
      console.log(this.selectKeys);
      if (this.selectKeys.length === 1) {
        if (this.selectKeys[0].sysKlTree.materialType === 1) {
          return true;
        }
      }
      return false;
    },
    // 是否显示删除
    showDel() {
      if (this.configData.showDeleteBtn && this.selectKeys.length) {
        const index = this.selectKeys.findIndex((item) => {
          if (item.sysKlTree.materialType !== 1) {
            return true;
          }
          return false;
        });
        if (index === -1) {
          return true;
        }
      }
      return false;
    },
    // 是否显示替换文件
    showReplaceBtn() {
      if (this.configData.showReplaceBtn && this.canShowBtn && this.selectKeys.length === 1) {
        const item = this.selectKeys[0].sysKlTree || this.selectKeys[0];
        if (item.materialType === 1 && item.treeType !== 1) {
          return true;
        }
      }
      return false;
    },
    // 是否显示下载
    showDownload() {
      if (this.configData.showDownload && this.canShowBtn) {
        if (this.keyWord && this.selectKeys.length === 1) {
          return true;
        }
        if (!this.keyWord && this.selectKeys.length) {
          return true;
        }
      }
      return false;
    },
    getBtnBg() {
      return this.isHover ? lighten('#FAB71C', 0.2) : '#FAB71C';
    },
    getStyle() {
      return `background:${this.getBtnBg};border-color:${this.getBtnBg};margin-left:10px;`;
    },
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
          (this.active === 2 && this.groupType !== 10) ||
          ([7, 8].includes(this.groupType) && this.active === 1)
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
          let total = 0;
          if (arr.length) {
            arr.forEach((item) => {
              // eslint-disable-next-line no-const-assign
              total += this.list[item].length;
            });
            return total;
          }
          return 0;
        }
        return this.list.length;
      };
    }
  },

  mounted() {
    this.pathArr = [initPath];
    if (!this.getNotInitArr().includes(this.configData.compId)) {
      this.init();
    }
    this.$bus.$on('reloadArea', this.reloadArea);
    this.$bus.$on(`loadSomeArea_${this.parent.compId}`, this.loadArea);

    setTimeout(() => {
      this.userInfo = this.$store.state.userCenter.userInfo;
    }, 500);
  },
  beforeDestroy() {
    if (this.getFatherPanel) {
      // 在最外层的数据上才销毁
      if (!this.getFatherPanel()) {
        this.$bus.$off(this.getEventName, this.reloadArea);
        this.$bus.$off(`loadSomeArea_${this.parent.compId}`);
      }
    } else {
      this.$bus.$off(this.getEventName, this.reloadArea);
      this.$bus.$off(`loadSomeArea_${this.parent.compId}`);
    }
  },
  inject: [
    'isConfig',
    'getAllForm',
    'sysMenuDesignId',
    'getFatherPanel',
    'onlyFlag',
    'getNotInitArr',
    'isSelect'
  ],
  methods: {
    loadMore() {
      // 下拉加载
      if (this.list.length >= this.listTotal) {
        // 不允许加载
        return;
      }
      this.current += 1;
      this.loading = true;
      if (this.keyWord) {
        this.fetchFilesByKeywords();
      } else {
        this.init();
      }
    },
    doRelateKnowledge() {
      // 关联资料
      this.knowledgeShow = true;
    },
    // 刚打开tab的时候如果不是初始化的，则加载一次
    loadArea(compId) {
      // 代表刚打开的tab
      if (this.parent.compId === compId) {
        // 加载的列表里包含该id
        if (this.getNotInitArr().includes(this.configData.compId)) {
          this.pathArr = [initPath];
          this.current = 1;
          this.list = [];
          this.listTotal = 0;
          this.init('change');
        }
      }
    },
    // 处理过滤条件
    initTable() {
      if (this.configData.relateDataComp) {
        this.relateDataComp.value = this.getAllForm()[this.configData.relateDataComp.compId];
        this.relateDataComp.tableName = this.configData.relateDataComp.tableName;
      }
      if (this.configData.relateBusiComp) {
        this.relateBusiComp.value = this.getAllForm()[this.configData.relateBusiComp.compId];
        this.relateBusiComp.tableName = this.configData.relateBusiComp.tableName;
      }
      console.log(this.relateBusiComp.value);
      if (this.getFatherPanel()) {
        const { relateDataComp } = this.getFatherPanel();
        const { relateBusiComp } = this.getFatherPanel();
        if (relateDataComp && relateDataComp[this.configData.compId]) {
          if (
            relateDataComp[this.configData.compId].value &&
            relateDataComp[this.configData.compId].tableName
          ) {
            this.relateDataComp.value = relateDataComp[this.configData.compId].value;
            this.relateDataComp.tableName = relateDataComp[this.configData.compId].tableName;
          }
        }
        if (relateBusiComp && relateBusiComp[this.configData.compId]) {
          if (
            relateBusiComp[this.configData.compId].value &&
            relateBusiComp[this.configData.compId].tableName
          ) {
            this.relateBusiComp.value = relateBusiComp[this.configData.compId].value;
            this.relateBusiComp.tableName = relateBusiComp[this.configData.compId].tableName;
          }
        }
      }
    },
    // 替换文件点击
    replaceNewClick() {
      const { treeType } = this.selectKeys[0].sysKlTree;
      switch (treeType) {
        case 2:
          this.replaceNewAccept = '.txt, .doc, .xls, .xlsx, .ppt, .pdf';
          break;
        case 3:
          this.replaceNewAccept = '.png, .jpg,.gif, .jpeg';
          break;
        case 4:
          this.replaceNewAccept = '.mp4, .avi';
          break;
        case 5:
          this.replaceNewAccept = '.mp3';
          break;
        default:
          this.replaceNewAccept = '*';
      }
      this.$nextTick(() => {
        this.$refs.replaceNewFile.click();
      });
    },
    inputChange() {
      const resultFile = this.$refs.replaceNewFile.files[0];
      const newSize = resultFile.size / 1024 < 3000000;
      if (!newSize) {
        this.$message({
          type: 'warning',
          message: this.$t('knowledge.size_more')
        });
        return;
      }
      this.curFile = resultFile;
      this.showReplaceDialog = true;
    },
    replaceSureClick() {
      this.$refs.replaceNewFile.value = '';
      this.curFile = null;
      this.selectKeys = [];
      // todo 数据方式重置
      // this.init();
      this.specialInit();
    },
    // 关联知识库
    async knowledgeSelected(list) {
      const ids = list.map((item) => item.sysKlTree.id).join(',');
      const params = {
        klTreeIds: ids,
        tableId: this.relateDataComp.value,
        tableName: this.relateDataComp.tableName
      };
      await bindKl(params);
      // todo 数据方式重置
      // this.init();
      this.specialInit();
      this.knowledgeShow = false;
    },
    // 解绑知识库
    async unbindKl() {
      const ids = this.selectKeys.map((item) => item.sysKlTree.id).join(',');
      const params = {
        sysRelatedMaterialsIds: ids,
        tableId: this.relateDataComp.value,
        tableName: this.relateDataComp.tableName
      };
      await unbindKl(params);
      this.selectKeys = [];
      // todo 数据获取方式重置
      // this.init();
      this.specialInit();
    },
    // 更新该区域
    reloadArea(areaArr, onlyFlag, compId) {
      // 按钮全部刷新
      if (areaArr === 'all' && onlyFlag === this.onlyFlag()) {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.pathArr = [initPath];
          this.current = 1;
          this.listTotal = 0;
          this.list = [];
          this.init('change');
        }
        return;
      }
      // 刷新当前区域
      if (
        (areaArr === 'current' || areaArr === 'searchCurrent') &&
        onlyFlag === this.onlyFlag() &&
        compId === this.configData.compId
      ) {
        this.pathArr = [initPath];
        this.current = 1;
        this.listTotal = 0;
        this.list = [];
        this.init('change');
        return;
      }
      if (areaArr.includes(this.configData.compId) && onlyFlag === this.onlyFlag()) {
        this.pathArr = [initPath];
        this.current = 1;
        this.listTotal = 0;
        this.list = [];
        this.init('change');
      }
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
        const res = item.sysKlTree || item;
        return {
          id: res.id,
          type: res.materialType
        };
      });
      try {
        const data = await downFiles({ list: arr });
        saveAs(data, '文件.zip');
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
    init(changeType) {
      this.initTable();
      // 初始化
      const current = this.pathArr.at(-1);

      if (this.requestType === 2) {
        const parentId = current.id === 'all' ? 0 : current.klTreeId;
        // 全部
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId,
          isFolder: 0,
          current: this.current,
          size: this.size
        };
        this.initKonwledge(params, changeType);
      } else {
        const parentId = current.id === 'all' ? 0 : current.id;
        const params = {
          parentId,
          current: this.current,
          size: this.size
        };
        this.listFiles(params, changeType);
      }
    },
    specialInit() {
      this.initTable();
      // 初始化
      const current = this.pathArr.at(-1);

      if (this.requestType === 2) {
        const parentId = current.id === 'all' ? 0 : current.klTreeId;
        // 全部
        const params = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId,
          isFolder: 0,
          current: 1,
          size: this.current * this.size
        };
        this.initKonwledge(params, 'change');
      } else {
        const parentId = current.id === 'all' ? 0 : current.id;
        const params = {
          parentId,
          current: 1,
          size: this.current * this.size
        };
        this.listFiles(params, 'change');
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
      formData.append('file', item.raw);
      formData.append('parentId', this.doUploadFile ? pid : parentId);
      formData.append('treeType', treeType);
      formData.append('name', name.replace(/\s+/g, ''));
      formData.append('tableId', this.relateDataComp.value);
      formData.append('tableName', this.relateDataComp.tableName);
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
        .post(`${ajax.baseURL}system/materials/saveFile`, formData, config)
        .then(() => {
          this.delFileFromUploadingFiles(item);
          // todo 数据获取方式调整
          // this.init();
          this.specialInit();
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
        await updateFolder({ id, name });
        // 如果是全部，需要看路径进行刷新
        // todo 这里数据重新获取
        // await this.init();
        this.specialInit();
        this.selectKeys = [];
        this.edit = false;
      } catch (e) {
        this.edit = false;
      }
    },
    changePath(item) {
      // 更改路径
      const index = this.pathArr.findIndex((obj) => obj.id === item.id);
      if (!['all', 9, 7, 8].includes(this.groupType)) return;
      if (!index || index === -1) {
        this.pathArr = [initPath];
      } else {
        this.pathArr = this.pathArr.slice(0, index + 1);
      }
      this.selectKeys = [];
      this.getRequestType(item);
      this.current = 1;
      this.listTotal = 0;
      this.list = [];
      this.init();
    },
    getRequestType(item) {
      if (item.materialType === 1) {
        this.requestType = 1;
      } else if (item.materialType === 2) {
        this.requestType = 2;
      } else if (item.childMaterialType === 1) {
        this.requestType = 1;
      } else if (item.childMaterialType === 2) {
        this.requestType = 2;
      } else {
        this.requestType = 1;
      }
    },
    showHisList(item) {
      if (!item.sysKlTree) {
        item = {
          sysKlTree: {
            ...item
          }
        };
      }
      this.showHis = true;
      this.hisObj = item;
    },
    async handlePreview(item) {
      // 如果是文件夹类型，就进入下个文件夹，如果是文件，则预览
      if (!item.sysKlTree) {
        item = {
          sysKlTree: {
            ...item
          }
        };
      }
      const { treeType, id, name, klTreeId, materialType, childMaterialType } =
        item.sysKlTree || item;
      if (treeType === 1) {
        this.keyWord = '';
        this.selectKeys = [];
        this.pathArr.push({
          id,
          name,
          klTreeId,
          sysKlEmpower: item.sysKlEmpower,
          materialType,
          childMaterialType
        });
        this.getRequestType(item.sysKlTree || item);
        this.current = 1;
        this.listTotal = 0;
        this.list = [];
        this.init('change');
        return false;
      }
      if (!this.configData.showPreview) {
        return;
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
    async listFiles(params, changeType) {
      console.log(this.relateDataComp.value);
      if (!this.relateDataComp.value) {
        return;
      }
      const param = {
        keywords: '',
        relationTableId: this.relateBusiComp.value,
        relationTableName: this.relateBusiComp.tableName,
        tableId: this.relateDataComp.value,
        tableName: this.relateDataComp.tableName,
        ...params
      };
      this.loading = true;
      try {
        const data = await listFiles(param);
        const { records = [], total = 0 } = data;
        this.listTotal = total;
        const newListData = records.map((item) => ({
          sysKlTree: {
            ...item
          },
          showIndex: true
        }));
        const lastListData = newListData.sort((a, b) => {
          if (a.sysKlTree && b.sysKlTree) {
            return a.sysKlTree.treeType - b.sysKlTree.treeType;
          }
          return a.treeType - b.treeType;
        });
        this.list = changeType ? lastListData : this.list.concat(lastListData);
        this.$bus.$emit('changeShowSkeleton');
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.$bus.$emit('changeShowSkeleton');
        this.loading = false;
      }
    },
    async initKonwledge(params, changeType) {
      // 获取数据
      this.loading = true;
      try {
        // const api = getKonwledgeList;
        const api = getAllFileList;
        let data = {};
        const pid = this.pathArr[this.pathArr.length - 1].id;
        const param = {
          classId: this.showType,
          keywords: this.keyWord,
          parentId: pid === 'all' ? 0 : pid,
          isFolder: 0
        };
        data = { ...data, ...param, ...params };
        const treeData = await api(data);
        const { records = [], total = 0 } = treeData;
        this.listTotal = total;
        const newTreeData = records;
        this.loading = false;
        const newListData = newTreeData.map((item) => ({ ...item, showIndex: true }));
        const lastListData = newListData.sort((a, b) => {
          if (a.sysKlTree && b.sysKlTree) {
            return a.sysKlTree.treeType - b.sysKlTree.treeType;
          }
          return a.treeType - b.treeType;
        });
        this.list = changeType ? lastListData : this.list.concat(lastListData);
      } catch (e) {
        this.loading = false;
      }
    },
    updateData(key, value) {
      this[key] = value;
    },
    async fetchFilesByKeywords() {
      const params = {
        current: this.current,
        size: this.size,
        keywords: this.keyWord,
        relationTableId: this.relateBusiComp.value,
        relationTableName: this.relateBusiComp.tableName,
        tableId: this.relateDataComp.value,
        tableName: this.relateDataComp.tableName
      };
      try {
        this.loading = true;
        const data = await searchFiles(params);
        const { records = [], total } = data;
        this.listTotal = total;
        const lastData = this.reduceFiles(records);
        this.list = this.list.concat(lastData);
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    reduceFiles(list = []) {
      // 处理数据
      const newListData = list.map((item) => {
        if (!item.id) {
          item.id = createUnique();
        }
        return {
          sysKlTree: {
            ...item
          },
          showIndex: true
        };
      });
      const lastData = newListData.sort((a, b) => {
        if (a.sysKlTree && b.sysKlTree) {
          return a.sysKlTree.treeType - b.sysKlTree.treeType;
        }
        return a.treeType - b.treeType;
      });
      return lastData;
    },
    async getFileList() {
      this.pathArr = [initPath];
      this.current = 1;
      this.listTotal = 0;
      this.list = [];
      if (!this.keyWord) {
        this.init('change');
        return;
      }
      const params = {
        current: this.current,
        size: this.size,
        keywords: this.keyWord,
        relationTableId: this.relateBusiComp.value,
        relationTableName: this.relateBusiComp.tableName,
        tableId: this.relateDataComp.value,
        tableName: this.relateDataComp.tableName
      };
      try {
        this.loading = true;
        const data = await searchFiles(params);
        const { records = [], total } = data;
        this.listTotal = total;
        const lastData = this.reduceFiles(records);
        this.list = lastData;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
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
        await deleteFile(params);
        this.loading = false;
        this.selectKeys = [];
        // todo 获取方式重写
        // this.init();
        this.specialInit();
      } catch (e) {
        this.loading = false;
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
        this.edit = false;
        this.selectKeys = [];
      }
      try {
        const currentFolder = this.pathArr[this.pathArr.length - 1];
        const id = currentFolder.id === 'all' ? 0 : currentFolder.id;
        const res = await saveFolder({
          name,
          parentId: id,
          treeClass: this.showType,
          treeType: 1,
          uploadUserName: this.userInfo.username,
          tableId: this.relateDataComp.value,
          tableName: this.relateDataComp.tableName
        });
        this.list.unshift({ sysKlTree: res });
        this.edit = true;
        this.selectKeys = [{ sysKlTree: res }];
      } catch (e) {
        // console.log(e);
      }
    },
    getFileUrl(obj) {
      if (!obj.sysKlTree) {
        obj = {
          sysKlTree: {
            ...obj
          }
        };
      }
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
    }
  }
};
</script>

<style lang='scss' scoped>
.rename,
.delete {
  color: $--color-primary;
}
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

    .knowledgeSearch {
      width: 224px;
      position: absolute;
      right: 78px;
      top: 6px;
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
