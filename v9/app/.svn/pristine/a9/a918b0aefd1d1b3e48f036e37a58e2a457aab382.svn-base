<template name="news">
  <view class="listCreateTemplate fileList news_page" :class="[themeClass_]">
    <m-back-bar backStyle="backStyleNoBack">
      <!-- 顶部返回组件，已经作为全局组件可以直接调用 class="calendar-page-header" -->
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight">
        <view class="header">
          <view class="list-search">
            <view class="search-wrap">
              <view class="search-view">
                <input
                  v-model="searchListInfo.searchKey"
                  @confirm="searchFiles()"
                  name="keywords"
                  type="text"
                  confirm-type="search"
                  class="keywords"
                  :placeholder="$t('formTip-placeholder')"
                  placeholder-class="placeholderSearch"
                />
                <!-- 中文：请输入关键字搜索 -->
              </view>
              <m-font-icon
                icon="iconsousuo"
                :iconSize="30"
                class="sousuo"
              ></m-font-icon>
            </view>
          </view>
        </view>
      </block>
    </m-back-bar>
    <!-- 	<view class="header">
			<view class="templateTitle">{{$t('page-infoShow')}}</view>
			<view class="list-search">
				<view class="search-wrap">
					<view class="search-view">
						<input v-model="searchListInfo.searchKey" @confirm="searchFiles()" name="keywords" type="text" confirm-type="search" class="keywords" :placeholder="$t('formTip-placeholder')" placeholder-class="placeholderSearch" /> 
					</view>
					<m-font-icon  icon="iconsousuo" :iconSize="30" class="sousuo"></m-font-icon>
				</view>
			</view>
		</view> -->
    <!-- <view class="">
				<view class="list-search news_search">
					<view class="search-wrap search_input">
						<view class="search-view">
							<input v-model="searchListInfo.searchKey" name="keywords" class="keywords" placeholder="请输入关键字搜索" />
						</view>
						<m-font-icon  icon="iconsousuo" :iconSize="30" class="sousuo" @click="searchFiles()"></m-font-icon>
					</view>
				</view>
			</view> -->

    <view class="">
      <scroll-view class="scroll-view_H" scroll-x="true">
        <view
          class="scroll-view-item_H"
          :class="tabIndex == item.id && !showSearch ? 'on' : ''"
          @click="changeTab(item.id, item.name)"
          v-for="item in tabList"
          :key="item.id"
          :style="[
            tabIndex == item.id && !showSearch ? { color: themeColorCode } : '',
          ]"
        >
          <span class="scroll-view-item">{{ item.name }}</span>
          <hr
            class="tab_item_hr"
            :style="[
              tabIndex == item.id && !showSearch
                ? {
                    'background-color': themeColorCode,
                    'border-color': themeColorCode,
                    opacity: '1',
                  }
                : '',
            ]"
          />
        </view>
      </scroll-view>
    </view>

    <view class="" v-for="item in tabList" :key="item.id">
      <view
        class="news_container"
        v-show="contentList.length > 0"
        v-if="tabIndex === item.id"
      >
        <view v-for="item in contentList" :key="item.id">
          <navigator
            v-if="item.showType === 1"
            open-type="navigate"
            :url="`/pages/news/newsDetail?id=${item.id}&groupName=${groupName}`"
          >
            <view class="news_wrap">
              <view class="news_title"
                >{{ item.name }} | {{ item.remark }}</view
              >
              <view class="news_img">
                <img
                  v-if="item.picturePath1"
                  :src="item.picturePath1"
                  alt=""
                  class=""
                />
                <img
                  v-if="item.picturePath2"
                  :src="item.picturePath2"
                  alt=""
                  class="mgl"
                />
                <img
                  v-if="item.picturePath3"
                  :src="item.picturePath3"
                  alt=""
                  class="mgl"
                />
              </view>
              <view class="news_tips"
                >{{ item.pubDate }}　　{{ item.comments }} 评论
              </view>
            </view>
          </navigator>
          <navigator
            v-if="item.showType === 2"
            open-type="navigate"
            class="news_item"
            :url="`/pages/news/newsDetail?id=${item.id}&groupName=${groupName}`"
          >
            <view class="news_wrap news_layout2">
              <view class="news_layout2_left">
                <view class="news_title"
                  >{{ item.name }} | {{ item.remark }}</view
                >

                <view class="news_tips2"
                  >{{ item.pubDate }}　　{{ item.comments }} 评论
                </view>
              </view>
              <view class="news_layout2_right news_layout2_img">
                <view class="news_img">
                  <img :src="item.picturePath1" alt="" class="" />
                </view>
              </view>
            </view>
          </navigator>
        </view>
        <view> </view>
      </view>
    </view>
    <view>
      <view class="showNoData" v-show="showMore === false && waitShow"
        >没有更多信息了</view
      >
      <view
        class="getMore"
        v-show="showMore"
        @click="getMoreData"
        :style="{ color: themeColorCode, 'border-color': themeColorCode }"
      >
        查看更多
      </view>
    </view>
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { mapState } from 'vuex';
export default {
  name: 'news',
  data() {
    return {
      keywords: '',
      tabIndex: 1,
      tabList: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 10,
        contentGroupId: '0',
      },
      contentList: [],
      showMore: false,
      waitShow: false,
      searchListInfo: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '',
      },
      showSearch: false,
      groupName: '',
    };
  },
  props: {
    barTitle: {
      type: String,
      default: '内容展示',
    },
  },
  computed: {
    ...mapState(['themeColorCode', 'themeColor']),
    themeClass_() {
      //与主题she检修关联
      const mainColor = ['mainColor', 'whiteColor'];
      return this.themeColor !== 'red'
        ? 'mainColor-' + this.themeColor
        : 'mainColor';
    },
  },
  methods: {
    //点击搜索
    searchFiles() {
      let _me = this;
      _me.searchListInfo.pageNum = 1;

      if (_me.searchListInfo.searchKey) {
        _me.showSearch = true;
        _me.contentList = [];
        _me.searchList();
      } else {
        uni.showToast({
          title: '请输入关键字',
          duration: 2000,
        });
      }
    },
    //搜索获取列表
    searchList() {
      let _me = this;
      _me.$http
        .post('content/searchContentList', _me.searchListInfo)
        .then((res) => {
          console.log(res.data.data);
          if (res.data.success) {
            /* _me.contentList=res.data.data.list; */
            res.data.data.list.forEach(function (item, index) {
              _me.contentList.push(item);
            });
            _me.waitShow = true;
            if (res.data.data.total > _me.contentList.length) {
              _me.showMore = true;
            } else {
              _me.showMore = false;
            }
            uni.hideLoading();
            console.log(_me.contentList);
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    //点击跳转详情
    /* turnDetail(id){
				console.log(this.groupName)
				const url='/pages/news/newsDetail?id='+id+'&groupName='+this.groupName
				uni.navigateTo({ url:url});
			}, */
    changeTab(v, groupName) {
      console.log(v, groupName);
      uni.showLoading({
        title: '加载中',
      });
      this.pageInfo.pageNum = 1;
      this.tabIndex = v;
      this.pageInfo.contentGroupId = v;
      this.getContentList();
      this.contentList = [];
      this.showMore = false;
      this.waitShow = false;
      this.searchListInfo.searchKey = '';
      this.showSearch = false;
      this.groupName = groupName;
    },
    /* 获取内容管理tab内容 */
    getContentList() {
      let _me = this;
      _me.$http
        .post('content/getContentListByContentGroupId', _me.pageInfo)
        .then((res) => {
          console.log(res.data.data.total);
          if (res.data.success) {
            /* _me.contentList=res.data.data.list; */
            res.data.data.list.forEach(function (item, index) {
              _me.contentList.push(item);
            });
            _me.waitShow = true;
            if (res.data.data.total > _me.contentList.length) {
              _me.showMore = true;
            } else {
              _me.showMore = false;
            }
            uni.hideLoading();
            console.log(_me.contentList);
          }
        })
        .catch((err) => {
          uni.hideLoading();
          _me.showMore = false;
          _me.waitShow = true;
        });
    },
    /* 获取Tab */
    getTabList() {
      let _me = this;
      _me.$http
        .post('contentGroup/getContentGroupListByOrgId')
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            _me.tabList = res.data.data;
            console.log(_me.tabList);
            _me.tabIndex = _me.tabList[0].id;
            _me.groupName = _me.tabList[0].name;
            _me.pageInfo.contentGroupId = _me.tabIndex;
            _me.getContentList();
            /* res.data.data.forEach(function(val,index){
							
							if(val.contentGroupIndex =="1"){
								_me.tabIndex=val.id
								_me.pageInfo.contentGroupId=val.id;
								_me.groupName=val.name;
								_me.getContentList()
							}
						}) */
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    /* 获取更多信息 */
    getMoreData() {
      let _me = this;
      if (_me.searchListInfo.searchKey) {
        _me.searchListInfo.pageNum++;
        _me.searchList();
      } else {
        _me.pageInfo.pageNum++;
        _me.getContentList();
      }

      uni.showLoading({
        title: '加载中',
      });
    },
  },
  mounted() {
    let _this = this;
    _this.tabList = [];
    _this.contentList = [];
    _this.getTabList();
    bus.$on('refresh', (params) => {
      //reload
      _this.tabList = [];
      _this.contentList = [];
      _this.getTabList();
    });
  },
};
</script>
