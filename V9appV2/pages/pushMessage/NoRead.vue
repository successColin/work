<!-- 没有读消息推送 -->
<template>
	<view class="pushMessage">
		<!-- 导航栏 -->
		<m-back-bar>
			<block slot="barTitle">消息通知</block>
			<block slot="barRight">
				<m-font-icon icon="yidu" :iconSize="40" @click="handleClick({isAllMsg:1})"></m-font-icon>
			</block>
		</m-back-bar>
		<no-data v-if="listDate.length ===0 && isGetData"></no-data>
		<view :class="['content', isShowOperation?'marginBtn':'']" v-else>
			<!-- list -->
			<message-content
				:listDate="listDate"
				:handleClick="handleClick" 
				:longPressClick="longPressClick" 
				:isShowOperation="isShowOperation"
				:msgIds="getMsgIds"
				@giveMsgIds="giveMsgIds"
			>
			</message-content>
			<!-- 分页 -->
			<view class="loadingText" v-show="listDate.length !==0">
				{{loadingType === 0 ? contentText.contentdown : (loadingType === 1 ? '' : contentText.contentnomore)}}
				<mLodingSvg v-show="loadingType === 1"></mLodingSvg>
			</view>
			<!-- footer -->
			<view class="footer" v-show="isShowOperation">
				<view class="cancel" :style="{color:themeColorCode}" @click="handleCancel">取消</view>
				<view class="del" :style="{background:themeColorCode, borderColor: themeColorCode}" @click="handleDel">
					删除
					<span v-show="getMsgIds.length !== 0">
						（{{getMsgIds.length}}）
					</span>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import store from '@/store/index'
	import MessageContent from '@/components/push-message/MessageContent'
	import NoData from '@/components/noData/noData'
	export default {
		components: {
			MessageContent,
			NoData,
		},
		data(){
			return {
				pageSize: 10,
				pageNum: 1,
				listDate: [], // 获取未读数据
				isGetData: false, // 是否拿到数据
				/* 
					上拉刷新 
					0：上拉显示更多
					1：加载中....
					2：~End~
				*/
				loadingType: 0,
				contentText: {
					contentdown: "上拉显示更多", // 0
					// ~End~
					contentnomore: "", // 2
				},
				isShowOperation: false, // 是否显示删除和取消
				getMsgIds: [], // 子组件传过来的msgIds
			};
		},
		mounted(){
			this.getList();
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.pageSize = 10;
			this.pageNum = 1;
			this.getList();
		},
		// 上拉刷新
		onReachBottom(){
			this.getMoreList()
		},
		methods:{
			...mapMutations([ "UPDATE_MESSAGE_NUM" ]),
			// 获取数据
			getList(isMore=false) {
				let params = {
					userId: store.state.userId,
					pageSize: this.pageSize,
					pageNum: this.pageNum,
					filterRead: 0, // 查询消息类型 0: 全部 1: 已读 2: 未读
				};
				// uni.showLoading({
				// 	title:'加载中...',
				// 		mask: true	
				// })
				this.$http.post('messageHistory/getAllMessage', params).then(res => {
					// uni.hideLoading();
					this.isGetData = true;
					if(res.data.success){
						let dataList = res.data.data.list;
						if (isMore) {
							if(this.listDate.length == res.data.data.total){ //当之前的数据长度等于count时跳出函数，不继续执行下面语句
								this.loadingType = 2;
								uni.hideNavigationBarLoading();//关闭加载动画
								return false;
							}
							this.listDate = this.listDate.concat(dataList)
							this.loadingType = 0; //将loadingType归0重置
							uni.hideNavigationBarLoading(); //关闭加载动画
						} else {
							this.listDate = dataList;
							if (dataList.length < 10) {
								this.loadingType = 2;
							} else {
								this.loadingType = 0;
							}
							uni.hideNavigationBarLoading(); // 隐藏导航条加载动画
							uni.stopPullDownRefresh();	//得到数据后停止下拉刷新
						}
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取更多数据
			getMoreList() {
				this.pageNum ++;
				if (this.loadingType != 0) {
					return false; //loadingType!=0;直接返回
				}
				this.loadingType = 1;
				this.getList(true);
			},
			/*
				点击行，修改状态
				id: msgIds
				isDelete: isDelete
				isAllMsg: isAllMsg
				默认：已读和不是所有数据
				删除，单个已读，全部已读
			*/
			handleClick({msgIds='', isDelete=0, isAllMsg=0, i}) {
				let _this = this;
				let params = {
					userId: store.state.userId,
					msgIds, // 消息id列表
					isDelete, // 是否删除;1: 删除 ;0: 设置为已读;
					isAllMsg, // 是否针对用户下的所有; 1: 是; 0: 否
				};
				this.$http.post('messageHistory/readMessageDetail', params).then(res => {
					if(res.data.success){
						if (i>-1) {
							this.listDate[i].stateid = 1;
							this.UPDATE_MESSAGE_NUM(this.messageNum - 1);
						} else {
							if (isAllMsg === 1) {
								uni.showToast({
									title: '全部已读',
									icon: "none",
								});
								this.UPDATE_MESSAGE_NUM(0);
							} else if (isDelete === 1) {
								uni.showToast({
									title: '已删除',
									icon: "none",
								});
								this.getMsgIds = [];
							}
							setTimeout(() => {
								this.pageSize = 10;
								this.pageNum = 1;
								this.getList();
							}, 500)
						}
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 是否显示操作
			longPressClick() {
				this.isShowOperation = true;
			},
			// 取消按钮
			handleCancel() {
				this.isShowOperation = false;
				this.getMsgIds = [];
			},
			// 删除按钮
			handleDel() {
				let _this = this;
				if (!this.getMsgIds.join(',')) {
					uni.showToast({
						title: '请选择数据',
						icon: "none"
					});
					return;
				}
				uni.showModal({
					title: '提示',
					content: '是否确认删除？',
					// showCancel: false,
					success: (res) => {
						if (res.confirm) {
							this.handleClick({
								msgIds: this.getMsgIds.join(','),
								isDelete: 1,
							});
						}
					}
				})
			},
			// 子传父
			giveMsgIds(val) {
				this.getMsgIds = val;
			}
		},
		computed: {
			...mapState(["themeColorCode", "messageNum"]),
		},
		watch: {
			messageNum(now, old) {
				if (now !== 0 && (old - now !== 1)) {
					this.pageSize = 10;
					this.pageNum = 1;
					this.getList();
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import "@/static/scss/common/_function.scss";
@import "@/static/scss/common/_variable.scss";
.pushMessage {
	width: 100%;
	background: #F5F5F5;
	font-family: PingFangSC-Regular, PingFang SC;
	.content {
		margin: 0 pxToREM(30);
		.loadingText{
			text-align: center;
			color: #808080;
			font-size: pxToREM(20);
			margin-bottom: pxToREM(20);
		}
		.footer {
			width: 100%;
			position: fixed;
			bottom: - pxToREM(3);
			left: 0;
			.cancel, .del {
				width: 50%;
				text-align: center;
				display: inline-block;
				height: pxToREM(85);
				line-height: pxToREM(85);
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				font-size: pxToREM(24);
			}
			.cancel {
				background: #FFFFFF;
				border: 1px solid #E6E6E6;
				color: $main-color;
			}
			.del {
				background: $main-color;
				border: 1px solid $main-color;
				color: #FFFFFF;
			}
		}
	}
	.marginBtn {
		margin-bottom: pxToREM(85);
	}
}
</style>
