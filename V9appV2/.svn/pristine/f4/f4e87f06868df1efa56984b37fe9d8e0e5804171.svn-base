<template>
  <view class="searchTemplate fileList">
    <m-back-bar>
      <block slot="barTitle">{{ $t('page-searchTitle') }}</block>
    </m-back-bar>
    <view class="search">
      <input
        v-model="searchText"
        type="text"
        focus
        :placeholder="placeholder"
        confirm-type="search"
        @confirm="handleSearch()"
      />
      <m-button
        class="search-btn"
        :isFontBtn="true"
        key="searchBtn"
        :btnClass="searchText ? 'mainColor' : 'searchColor'"
        @elementClick="handleSearch()"
      >
        <block slot="buttonIcon" style="display: inline-block">
          <m-font-icon icon="iconsousuo" :iconSize="34"></m-font-icon>
        </block>
      </m-button>
    </view>
    <!-- <view class="seaech-item seaech-history">
      <view class="title">
        <view class="content">{{ $t('page-searchHistory') }}</view>
        <m-button
          class="clearBtn"
          :isFontBtn="true"
          key="clearBtn"
          @elementClick="clearHistory"
        >
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon
              icon="iconqingkonglishi"
              :iconSize="34"
              color="#9B9B9B"
            ></m-font-icon>
          </block>
        </m-button>
      </view> -->
<!--      <view class="content-block">
        <view
          class="item"
          v-for="(item, index) in searchHistory"
          :key="index"
          @tap.stop="handleClickHistory(item)"
          >{{ item }}</view
        >
      </view>
    </view> -->
	<view class="filepath" :class="[themeClass_]">
	  <view class="path-wrap">
	    <view class="path"
	      v-for="(item, index) in filePath"
	      :key="`filePath${index}`"
	      @click="goToStep(item, index)"
	    >
	      <m-font-icon
	        icon="iconzhishikuweizhihuidaodiyiji"
	        :iconSize="iconSize"
	        v-if="index == 0"
	      ></m-font-icon
	      >{{ item.name }}<span v-if="index < filePath.length - 1">></span>
	    </view>
	  </view>
	</view>
	<!-- 内部文档 -->
	<scroll-view scroll-y class="list-wrap" @scrolltolower="scrolltolower">
	  <!-- #ifdef APP-PLUS -->
	  <view v-for="(item, index) in getFileData" :key="`fileIconAPP${index}`">
		<view class="fileItem" v-if="item.basetype == 1" @click="getFiles(item, item.id)">
		  <view class="icon-box"
		    ><image src="@/static/images/imgwenjianjia.png"></image
		  ></view>
		  <view class="folder">
		    <p class="title">{{ item.name }}</p>
		    <p class="date">{{ formatDate(item.createDate) }}</p>
		  </view>
		  <!-- <view class="fileSize">{{item.pageNum}}项</view> -->
		  <view class="arrow-right"><span></span></view>
		</view>
	    <view class="fileItem" v-else>
	      <view
	        class="icon-box fileicon"
	        @click="previewFile(item.id, item.displayFileName, item.url)"
	      >
	        <m-font-icon
	          color="#4E94D9"
	          v-if="formatIcon(item.displayFileName) == 'png'"
	          icon="APP_40"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#FF8102"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'jpg' ||
	            formatIcon(item.displayFileName) == 'jpeg'
	          "
	          icon="APP_39"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#FF933D"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'doc' ||
	            formatIcon(item.displayFileName) == 'docx'
	          "
	          icon="APP_37"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#47C69A"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'ppt' ||
	            formatIcon(item.displayFileName) == 'pptx'
	          "
	          icon="APP_34"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#B9C1CF"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'zip' ||
	            formatIcon(item.displayFileName) == 'rar'
	          "
	          icon="APP_36"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#F15643"
	          v-else-if="formatIcon(item.displayFileName) == 'pdf'"
	          icon="APP_35"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#F15643"
	          v-else-if="formatIcon(item.displayFileName) == 'txt'"
	          icon="APP_41"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#FF932F"
	          v-else-if="formatIcon(item.displayFileName) == 'mp3'"
	          icon="APP_42"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#4E7DD9"
	          v-else-if="formatIcon(item.displayFileName) == 'mp4'"
	          icon="APP_43"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#B9C1CF"
	          v-else
	          icon="APP_38"
	          :iconSize="64"
	        ></m-font-icon>
	      </view>
	      <view
	        class="file"
	        @click="previewFile(item.id, item.displayFileName, item.url)"
	      >
	        <p class="title">{{ item.displayFileName }}</p>
	        <p class="date">
	          {{ formatDate(item.updateDate) }}
	          <view class="fileSize">{{ formatSize(item.fileLength) }}</view>
	        </p>
	      </view>
	      <view class="downloadIcon">
	        <m-font-icon
	          icon="APP_44"
	          :iconSize="30"
	          class="xiazai"
	          @click="
	            downloadFile(item.id, item.displayFileName, item.fileLength)
	          "
	        ></m-font-icon>
	      </view>
	    </view>
	  </view>
	  <!-- #endif -->
	
	  <!-- h5版本下载 -->
	  <!-- #ifdef H5 -->
	  <view v-for="(item, index) in getFileData" :key="`uploadH5${index}`">
	  <view class="fileItem" v-if="item.basetype == 1" @click="getFiles(item, item.id)">
		<view class="icon-box"
		  ><image src="@/static/images/imgwenjianjia.png"></image
		></view>
		<view class="folder">
		  <p class="title">{{ item.name }}</p>
		  <p class="date">{{ formatDate(item.createDate) }}</p>
		</view>
		<view class="arrow-right"><span></span></view>
	  </view>
	    <view class="fileItem" v-else>
	      <view
	        class="icon-box fileicon"
	        @click="previewFile(item.id, item.displayFileName, item.url)"
	      >
	        <m-font-icon
	          color="#4E94D9"
	          v-if="formatIcon(item.displayFileName,) == 'png'"
	          icon="APP_40"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#FF8102"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'jpg' ||
	            formatIcon(item.displayFileName) == 'jpeg'
	          "
	          icon="APP_39"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#FF933D"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'doc' ||
	            formatIcon(item.displayFileName) == 'docx'
	          "
	          icon="APP_37"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#47C69A"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'ppt' ||
	            formatIcon(item.displayFileName) == 'pptx'
	          "
	          icon="APP_34"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#B9C1CF"
	          v-else-if="
	            formatIcon(item.displayFileName) == 'zip' ||
	            formatIcon(item.displayFileName) == 'rar'
	          "
	          icon="APP_36"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#F15643"
	          v-else-if="formatIcon(item.displayFileName) == 'pdf'"
	          icon="APP_35"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#F15643"
	          v-else-if="formatIcon(item.displayFileName) == 'txt'"
	          icon="APP_41"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#FF932F"
	          v-else-if="formatIcon(item.displayFileName) == 'mp3'"
	          icon="APP_42"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#4E7DD9"
	          v-else-if="formatIcon(item.displayFileName) == 'mp4'"
	          icon="APP_43"
	          :iconSize="64"
	        ></m-font-icon>
	        <m-font-icon
	          color="#B9C1CF"
	          v-else
	          icon="APP_38"
	          :iconSize="64"
	        ></m-font-icon>
	      </view>
	      <view
	        class="file"
	        @click="previewFile(item.id, item.displayFileName, item.url)"
	        style="width: 85%"
	      >
	        <p class="title">{{ item.displayFileName }}</p>
	        <p class="date">
	          {{ formatDate(item.updateDate) }}
	          <view class="fileSize">{{ formatSize(item.fileLength) }}</view>
	        </p>
	      </view>
	    </view>
	  </view>
	  <!-- #endif -->
	</scroll-view>
	<view class="downloadPro" v-if="isLoading">
	  <view class="downloadBox">
	    <p class="downname i18n">
	      <span>{{ downFileName }}</span
	      >{{ $t('pageTip-downloading') }}...
	    </p>
	    <!--中文：文件下载中-->
	    <view class="progress-box progressBox">
	      <view class="progressState" :style="{ width: percent + '%' }"></view>
	    </view>
	    <p class="downpro">{{ percent }}%</p>
	  </view>
	  <button type="default" class="abort-download" @click="cancleDownload">
	    {{ $t('page-cancelDownload') }}</button
	  ><!-- 中文：取消下载 -->
	</view>
	<!-- 视频预览 -->
	<view v-if="isPreviewVideo" class="previewVideoBox">
	  <video id="previewVideo" :src="videoUrl" controls></video>
	  <m-font-icon
	    class="closeVideo"
	    icon="iconqingchu"
	    :iconSize="32"
	    @click="shopPreviewVideo"
	  ></m-font-icon>
	</view>
	<!-- 音频预览 -->
	<view v-if="isPreviewSound" class="previewSoundBox">
	  <!-- <video id="previewVideo" :src="videoUrl" enable-danmu danmu-btn controls></video> -->
	  <view class="soundPanel">
	    <view class="currentTime">{{ formatTime(currentTime, 2) }}</view>
	    <view class="progressBar"
	      ><view :style="{ width: durationWidth }"></view
	    ></view>
	    <view class="surplusTime">{{ formatTime(surplusTime, 1) }}</view>
	  </view>
	  <m-font-icon
	    class="closeSound"
	    icon="iconqingchu"
	    :iconSize="32"
	    @click="stopPreviewSound"
	  ></m-font-icon>
	</view>
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { mapState } from 'vuex';
import nodataImg from '@/static/images/nodata.png';
export default {
  data() {
    return {
      placeholder: this.$t('formTip-placeholder'),
      searchText: '',
      onKey: '',
      searchHistory: [],
      hotSearch: [
        this.$t('lang-searchTemplate-fault-repair-order'),
        this.$t('lang-searchTemplate-plan-repair-order'),
        this.$t('lang-searchTemplate-inspection'),
        this.$t('page-knowledge'),
      ], //中文：["故障工单","计划工单","点检","知识库"]
	  iconSize: 32,
	  iconSizeFolder: 66,
	  iconSizeFile: 74,
	  id: '',
	  userInfo: {
	    userName: '',
	    id: '12',
	  },
	  fileData: [], //文件夹
	  fileAllData: [],
	  getFileData: [], //文件
	  cloudFileData: [], //专家文库文件夹
	  getCloudFileData: [], //专家文库文件
	  tabIndex: 1,
	  tabList: [
	    {
	      name: this.$t('page-internalDocument'),
	      value: 1,
	    }, //中文：'内部文档'
	    {
	      name: this.$t('page-expertLibrary'), // 中文：'专家文库'
	      value: 2,
	      icon: 'iconzhuanjiawenku',
	      iconSize: 24,
	    },
	  ],
	  filePath: [{ name: '全部', id: 1 }], // 中文：'知识库'
	  tempFilePath: '',
	  downFileName: '',
	  downFileProsess: '',
	  isLoading: false,
	  percent: 1,
	  nodataImg: nodataImg,
	  fileLength: 0,
	  keywords: '',
	  groupId: 1,
	  downloadUrl: '',
	  isPreviewVideo: '',
	  isPreviewSound: '',
	  innerAudioContext: '', //音频播放
	  videoUrl: '', //视频播放
	  currentTime: 0,
	  surplusTime: 0,
	  duration: 0,
	  durationWidth: '',
	  allFiles: [],
	  pages: 0,
	  currentPage: 1,
	  size: 20
    };
  },
  computed: {
    ...mapState(['baseUrl', 'defaultUrl', 'token', 'themeColor']),
    themeClass_() {
      //与主题she检修关联
      const mainColor = ['mainColor', 'whiteColor'];
      return this.themeColor !== 'red'
        ? 'mainColor-' + this.themeColor
        : 'mainColor';
    },
  },
  methods: {
	handleSearch() {
	  this.getFileData = [];
	  this.currentPage = 1
	  this.filePath = [{ name: '全部', id: 1 }]
	  this.searchFiles();
	},
    searchFiles() {
      let _this = this;
		console.log(this.currentPage)
      _this.$http
        .post('file/searchFiles', { pageNum: _this.currentPage, pageSize: _this.size, name: _this.searchText })
        .then((res) => {
			_this.getFileData = [..._this.getFileData, ...res.data.data.list];
			_this.pages = res.data.data.pages
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    handleClickHistory(history) {
      this.searchText = history;
    },
    clearHistory() {
      this.searchHistory = [];
      uni.removeStorageSync('searchHistory');
    },
	getFiles(item, groupId, arr) {
	  let _this = this;
	  if (groupId) {
	    _this.groupId = groupId;
	  } else {
	    _this.groupId = 1;
	  }
	  if (_this.searchText) {
		  _this.searchText = '';
	  }
	  _this.$http
	    .post('file/getFiles', { groupId: groupId || 1 })
	    .then((res) => {
			_this.getFileData = [...res.data.data.filegroupList, ...res.data.data.fileList];
	      if (groupId && !arr) {
	        _this.filePath.push(item);
	      } else if (!arr) {
	        _this.filePath = [{ name: '全部', id: 1 }]; // 中文：'知识库'
	      }
	      uni.setStorageSync('filePath', _this.filePath);
	    })
	    .catch((err) => {
	      console.log(JSON.stringify(err));
	    });
	},
	goToStep(e, index) {
	  if (index != undefined && index != 'undefined') {
	    let arr = [];
	    arr = this.filePath.slice(0, index + 1);
	    uni.setStorageSync('filePath', this.filePath);
	    this.filePath = arr;
	    if (!e || e.id == 1) {
	      // 中文：'知识库'
	      this.getFiles();
	    } else {
	      this.getFiles(e, e.id, arr);
	    }
	  }
	},
	downloadFile(id, name, fileLength) {
	  let _this = this;
	  var FileSystemURL = '_downloads/' + name;
	  this.fileLength = fileLength;
	  plus.io.resolveLocalFileSystemURL(
	    FileSystemURL,
	    function (entry) {
	      if (entry.isFile) {
	        uni.showModal({
	          title: _this.$t('basic-modalTip'), // 中文：'提示'
	          content:
	            _this.$t('choiceTip-whetherOpen') +
	            name +
	            _this.$t('page-attachmentView'), // 中文：'是否打开XX附件查看?'
	          confirmText: _this.$t('basic-confirm'),
	          cancelText: _this.$t('basic-cancel'),
	          success: function (res) {
	            if (res.confirm) {
	              plus.runtime.openFile(FileSystemURL, {}, function (e) {
	                plus.nativeUI.alert(
	                  _this.$t('pageTip-unableOpenFile') +
	                    '：entry' +
	                    entry.toLocalURL() +
	                    'symurl' +
	                    FileSystemURL
	                ); //中文：无法打开此文件
	              });
	            }
	          },
	        });
	      }
	    },
	    function () {
	      _this.dowload(id, name, fileLength);
	    }
	  );
	},
	dowload(id, name, fileLength) {
	  let _this = this;
	  var options = {
	    method: 'GET',
	    filename: '_downloads/' + name,
	  };
	  let baseUrl = this.baseUrl || this.defaultUrl;
	  var url = baseUrl + 'file/fileDownload?id=' + id + '&token=' + this.token;
	  var dtask = plus.downloader.createDownload(
	    url,
	    options,
	    function (d, status) {
	      if (status != 200) {
	        _this.isLoading = false;
	        return;
	      }
	    }
	  );
	  _this.percent = 0;
	  dtask.start();
	  dtask.addEventListener(
	    'statechanged',
	    function (task, status) {
	      if (status === 401) {
	        _this.isLoading = false;
	        return;
	      } else {
	        _this.isLoading = true;
	      }
	      switch (task.state) {
	        case 1:
	          console.log('开始下载...');
	          break;
	        case 2:
	          console.log('链接到服务器...');
	          break;
	        case 3:
	          console.log('已接受到数据');
	          var a = Math.floor(task.downloadedSize / fileLength / 10.24) || 0;
	          _this.percent = a;
	          console.log(_this.percent);
	          break;
	        case 4:
	          console.log('下载完成！');
	          console.log(JSON.stringify(task));
	          _this.isLoading = false;
	          uni.showModal({
	            title: _this.$t('basic-modalTip'), // 中文：'提示'
	            content:
	              _this.$t('choiceTip-whetherOpen') +
	              name +
	              _this.$t('page-attachmentView') +
	              '?',
	            confirmText: _this.$t('basic-confirm'),
	            cancelText: _this.$t('basic-cancel'),
	            success: function (res) {
	              if (res.confirm) {
	                plus.runtime.openFile(task.filename, {}, function (e) {
	                  plus.nativeUI.alert(
	                    _this.$t('pageTip-unableOpenFile') + '：' + e.message
	                  );
	                });
	              }
	            },
	          });
	          break;
	      }
	    },
	    false
	  );
	},
	cancleDownload() {
	  this.isLoading = false;
	  console.log(this.isLoading)
	  plus.downloader.clear();
	},
	formatDate(value) {
	  let date = new Date(value);
	  let y = date.getFullYear();
	  let MM = date.getMonth() + 1;
	  MM = MM < 10 ? '0' + MM : MM;
	  let d = date.getDate();
	  d = d < 10 ? '0' + d : d;
	  let h = date.getHours();
	  h = h < 10 ? '0' + h : h;
	  let m = date.getMinutes();
	  m = m < 10 ? '0' + m : m;
	  let s = date.getSeconds();
	  s = s < 10 ? '0' + s : s;
	  return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
	},
	formatSize(length) {
	  if (length > 1024) {
	    return parseInt(length / 10.24) / 100 + 'M';
	  } else {
	    return length + 'K';
	  }
	},
	formatIcon(name) {
	  let names = name.split('.');
	  name = names[names.length - 1];
	  return name;
	},
	previewFile(id, name, url) {
	  const fileName = this.formatIcon(name);
	  if (fileName == 'jpg' || fileName == 'jpeg' || fileName == 'png') {
	    this.previewImage(url);
	  } else if (fileName == 'mp3') {
	    this.previewSound(url);
	  } else if (fileName == 'mp4') {
	    this.previerVideo(url);
	  } else if (fileName == 'pdf') {
	    this.previerPdf(id, name, url);
	  } else {
	    this.downloadFile(id, name, url);
	  }
	},
	previewImage(url) {
	  uni.previewImage({
	    urls: [url],
	    longPressActions: {
	      success: function (data) {},
	      fail: function (err) {
	        console.log(err.errMsg);
	      },
	    },
	  });
	},
	previewSound(url) {
	  if (this.innerAudioContext.src == url) {
	  }
	  this.innerAudioContext = uni.createInnerAudioContext();
	  this.innerAudioContext.src = url;
	  // this.innerAudioContext.play()
	  this.innerAudioContext.onPlay(() => {
	    this.duration = this.innerAudioContext.duration;
	  });
	  this.innerAudioContext.autoplay = true;
	  this.isPreviewSound = true;
	  // this.isPreviewSound = true;
	  this.innerAudioContext.onTimeUpdate((res) => {
	    this.currentTime = this.innerAudioContext.currentTime;
	    this.surplusTime = this.duration - this.currentTime;
	    this.durationWidth =
	      parseInt((this.currentTime * 10000) / this.duration) / 100 + '%';
	  });
	},
	stopPreviewSound() {
	  this.innerAudioContext.destroy();
	  this.isPreviewSound = false;
	  this.durationWidth = 0;
	  this.currentTime = 0;
	  this.surplusTime = 0;
	},
	previerVideo(url) {
	  this.videoContext = uni.createVideoContext('previerVideo');
	  this.isPreviewVideo = true;
	  this.videoUrl = url;
	},
	shopPreviewVideo() {
	  this.isPreviewVideo = false;
	},
	previerPdf(id, name, url) {
	  // #ifdef H5
	  url = '/pages/common/preview?url=' + url;
	  setTimeout(() => {
	    uni.navigateTo({
	      url: url,
	    });
	  }, 100);
	  // #endif
	  // #ifdef APP-PLUS
	  this.downloadFile(id, name, url);
	  // #endif
	},
	formatTime(time, type) {
	  time = parseInt(time);
	  let m = time > 60 ? parseInt(time / 60) : 0;
	  let s = time % 60 >= 10 ? time % 60 : '0' + (time % 60);
	  if (type == 1) {
	    return m + ':' + s;
	  } else {
	    return '-' + m + ':' + s;
	  }
	},
	scrolltolower(){
		console.log(this.pages)
	  if (this.pages > this.currentPage) {
		this.currentPage += 1
		console.log(this.currentPage)
		this.searchFiles();
	  }
	}
  },
  onLoad(options) {
    this.searchHistory = uni.getStorageSync('searchHistory') || [];
    this.downloadUrl = this.baseUrl || this.defaultUrl;
	this.handleSearch();
  },
  onBackPress() {
	  let filePath = this.filePath;
	  if (filePath.length > 1) {
		let e = filePath[filePath.length - 2];
		this.goToStep(e, filePath.length - 2);
		return true;
	  }
  },
};
</script>

<style>
</style>
