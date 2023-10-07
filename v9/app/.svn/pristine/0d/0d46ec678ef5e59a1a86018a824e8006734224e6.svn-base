<template>
	<view class="newsDetail_page ">
		<m-back-bar>
			<block slot="barTitle">{{barTitle}}</block>
			<block slot="barRight">
				<m-button>
					<block slot="buttonIcon" style="display: inline-block;">
						<m-font-icon iconSize="40"></m-font-icon>
					</block>
				</m-button>
			</block>
		</m-back-bar>
		<view class="">
			<view class="newsDetail_top">
				<view class="head_tag" :style="{'background-color':themeColorCode}">{{groupName}}</view>
				<view class="head_time">{{detailData.pubDate}}</view>
				<view class="head_title">{{detailData.name}} | {{detailData.remark}}</view>
				<view class="uparse_img" v-html="detailData.content"></view>
				 <view class="">
				 	<view class="detail_editor">作者编辑：{{detailData.editorName}}</view>
				 	
				 </view>
				
				<view style="margin-top: .2rem;margin-bottom: -1rem;position: relative;">
					<view class="head_saw">{{detailData.readNum}}  看过</view>
					<view class="thumpsUp"  @click="clickLiked(detailData.id)">
						 <m-font-icon icon="iconweidianzan" size="30"  style="display: inline-block;"></m-font-icon>
						 <view class="thumpsUp_num">{{detailData.likesNum}}</view>
					</view>
					
				</view>
			</view>
			<view class="hr"></view>
			<view>
				<view class="discuss_container" v-for="item in commentData" :key="item.id">
					<view class="discuss_pho">
						<image src="../../static/images/shareShow.jpg" alt="">
					</view>
					<view class="discuss_inner">
						<view class="discuss_name">{{item.userName}}</view>
						<view class="discuss_nr">{{item.description}}</view>
						<view class="discuss_time">{{item.createTime}} <view class="discuss_del" v-if="item.canDelete == 1" @click="deleComment(item.id)">删除</view></view>
					</view>
				</view>
				<view >
					<view class="showNoData" v-show="showMore === false ">没有更多评论信息</view>
					<view class="getMore" v-show="showMore" @click="getMoreData" :style="{'color':themeColorCode,'border-color':themeColorCode}">
						查看更多
					</view>
				</view>
				
			</view>
			
		</view>
		<view class="newsDetail_option" :style="discussPop?'height:auto;line-height:1.3rem':''">
				<view class="newsDetail_option_input">
					 <textarea  class="discuss_write" @blur="onBlurEvent" @click="onKeyInput" type="text" placeholder="写评论" v-model="searchCont"  :style="discussPop ?'height:7rem;line-height:1.3rem':''"/>
					 
				</view>
				<view v-show="discussPop" style=" flex: 2;">
					<m-font-icon  icon="APP_31" :iconSize="40" class="close_icon" @click="pollDown"></m-font-icon>
					<view  class="commentBtn" @click="commentClick" :style="{'border-color':themeColorCode,'background-color':themeColorCode}">提交</view>
				</view>
				
				<!-- <view v-show="!discussPop" class="newsDetail_option_msg" @click="shareBtn">
					<m-font-icon  icon="iconshare" :iconSize="60"></m-font-icon>
				</view> -->
				<!-- <view class="newsDetail_option_msg">
					<m-font-icon  icon="iconpinglun" :iconSize="60"></m-font-icon>
					<span class="newsDetail_option_msgNum">{{detailData.comments}}</span>
				</view> -->
				<view v-show="!discussPop" class="newsDetail_option_thumpsUp" @click="clickLiked(detailData.id)">
					<m-font-icon  icon="iconweidianzan" :color="detailData.hasLiked == 1?'#C62127' : '#696969'" :iconSize="60"  ></m-font-icon>
				</view>
			
		</view>
		<!-- 分享选择 -->
		<view class="share_select">
			<view class="drawer ">
			<view class="setbox" :class="{show: isshow}">
			<view class="header">
				<view class="drawer-list-item">
				分享至
				</view>
				<view class="select_way">
					<view class="share_part" @click="shareToWeinxin">
						<m-font-icon  icon="iconweixin" color="#59bc37"  :iconSize="80"  ></m-font-icon>
						<view class="share_word" >微信</view>
					</view>
					<view class="share_part" @click="shareToPengyouquan">
						<m-font-icon  icon="iconpengyouquan" color="#59bc37"  :iconSize="80"  ></m-font-icon>
						<view class="share_word">朋友圈</view>
					</view>
				</view>
				<view class="drawer-item">
					<view @click="cancelPop">取消</view>
				</view>
			</view>
			</view>
			</view>
		</view>
			
	</view>
	
</template>

<script> 
	import bus from '@/static/js/bus'
	import beijing from "@/static/images/shareShow.jpg"
	import state from "@/store/state.js"
	import { mapState } from 'vuex'
	import uParse from "@/components/feng-parse/parse.vue"
	export default {
		components:{
		            uParse
		        },
		data() {
			return {
				beijing:beijing,
				barTitle:'详情',
				editName:state.userName,
				listId:'',
				groupName:'',
				detailData:{},
				commentInfo:{
					pageNum: 1,
					pageSize: 10,
					id:'0'
				},
				commentData:[],
				showMore:false,
				searchCont:'',
				discussPop:false,
				isshow:false,
				
				
			}
		},
		computed:{
			...mapState(["defaultUrl","shareBaseUrl","themeColorCode"]),
		},
		methods: {
			
			onKeyInput(){
				this.discussPop=true
			},
			pollDown(){
				this.discussPop=false
			},
			onBlurEvent(){
				/* this.discussPop=false */
			},
			/* 分享 */
			cancelPop(){
				this.isshow=false
			},
			shareBtn(){
				this.isshow=true
				console.log(this.shareBaseUrl)
			},
			shareToWeinxin(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: this.shareBaseUrl+"/#/pages/news/newsDetail?id="+this.listId+"&groupName="+this.groupName,
				    title: "分享测试",
				    summary: "分享测试",
				    imageUrl: beijing,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
			shareToPengyouquan(){
				uni.share({
				    provider: "weixin",
				    scene: "WXSenceTimeline",
				    type: 0,
				    href: this.shareBaseUrl+"/#/pages/news/newsDetail?id="+this.listId+"&groupName="+this.groupName,
				    title: "分享测试",
				    summary: "分享测试正文",
				    imageUrl: beijing,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			},
			/* 提交评论 */
			commentClick(){
				var _me=this
				
				
				if(_me.searchCont){
					_me.commentData=[]
					var params={
						id:_me.listId,
						description:_me.searchCont,
						isRoot:0,
						baseState:0
						
					}
					_me.$http.post('contentComment/createContentComment',params)
					.then(res => {
						console.log(res);
						if(res.data.success){
							uni.showLoading({
								title:"加载中"
							})
							_me.commentInfo.pageNum=1
							_me.getComment()
							_me.discussPop=false
							_me.searchCont=''
							
							bus.$emit('refresh', '12啊大苏打撒旦3')
						}
						
					})
					.catch(err => {
						console.log(JSON.stringify(err))
					})
				}else{
					uni.showToast({
						title: '请填写评论！',
						duration: 2000
					})
					return
				}
				
			},
			/* 根据内容id获取详情 */
			getContentDetail(){
				let _me = this;
				var params={
					id:_me.listId
				}
				_me.$http.post('content/getContentById',params)
				.then(res => {
					console.log(res);
					if(res.data.success){
						_me.detailData=res.data.data
					}
					console.log(_me.detailData);
				})
				.catch(err => {
					console.log(JSON.stringify(err))
				})
			},
			/* 喜欢点赞取消点赞 */
			clickLiked(liestId){
				let _me = this;
				var params={
					id:liestId
				}
				if(_me.detailData.hasLiked == 0){
					_me.$http.post('contentLike/doLikeAction',params)
					.then(res => {
						console.log(res);
						if(res.data.success){
							_me.detailData.hasLiked = 1
							_me.detailData.likesNum ++
							uni.showToast({
								title: '点赞成功！',
								duration: 2000
							})
						}
						
					})
					.catch(err => {
						console.log(JSON.stringify(err))
					})
				} else{
					_me.$http.post('contentLike/doUnLikeAction',params)
					.then(res => {
						console.log(res);
						if(res.data.success){
							_me.detailData.hasLiked = 0
							_me.detailData.likesNum --
							uni.showToast({
								title: '点赞已取消！',
								duration: 2000
							})
						}
						
					})
					.catch(err => {
						console.log(JSON.stringify(err))
					})
				}
				
			},
			/* 获取评论信息 */
			getComment(){
				let _me = this;
				_me.commentInfo.id=_me.listId
				_me.$http.post('contentComment/getContentCommentListByContentId',_me.commentInfo)
				.then(res => {
					console.log(res.data.data.total);
					if(res.data.success){
						res.data.data.list.forEach(function(item,index){
							_me.commentData.push(item)
						})
						if(res.data.data.total > _me.commentData.length){
							_me.showMore=true
						}else{
							_me.showMore=false
						}
						
						uni.hideLoading();
					}
					
				})
				.catch(err => {
					console.log(JSON.stringify(err))
				})
			},
			/* 获取更多评论信息 */
			getMoreData(){
				this.commentInfo.pageNum++
				this.getComment()
				uni.showLoading({
					title:"加载中"
				})
			},
			/* 删除评论 */
			deleComment(id){
				let _me=this;
				var params={
					id:id
				}
				uni.showModal({
				    title: '提示',
				    content: '确认删除此条评论？',
				    success: function (e) {
				        if (e.confirm) {
				            _me.$http.post('contentComment/deleteContentComment',params)
				            .then(res => {
				            	console.log(res);
				            	if(res.data.success){
									_me.commentData=[]
									_me.getComment()
									bus.$emit('refresh', '123')
				            		/* var arr=[]
				            		_me.commentData.forEach(function(item,index){
				            			if(item.id != id){
				            				
				            				arr.push(item)
				            			}
				            			_me.commentData=arr
				            			console.log(_me.commentData)
				            		})
									uni.showToast({
										title: '删除成功！',
										duration: 2000
									}) */
				            	}
				            	
				            })
				            .catch(err => {
				            	console.log(JSON.stringify(err))
				            })
				        } else if (e.cancel) {
				            
				        }
				    }
				});
				
			},

		},
		onLoad(options){
			console.log(options.id)
			this.listId=options.id
			this.groupName=options.groupName
			this.getComment()
			/* this.commentData=[] */
		},
		onShow(){
			var self=this;
			self.detailData={}
			self.getContentDetail();
		}
	}
</script>