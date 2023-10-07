<template>
	<view>
		<view v-for="(val, i) in listDate" :key="i" @click="childMethod({msgIds:val.id, i:i})" @longpress="childLongPressClick">
			<view class="time">
				<span>
					{{val.createDate}}
				</span>
			</view>
			<view class="message">
				<view class="title">
					<m-font-icon icon="tongzhi" :iconSize="40" class="myIcon" :style="{color:themeColorCode}"></m-font-icon>
					<view class="titleName">
						<!-- stateid=0 已读；=1未读  -->
						<view class="circle" v-show="val.stateid === 0"></view>
						<view :class="val.stateid === 0 ? 'noReadName' : 'readName'">{{val.title}}</view>
					</view>
					<view v-show="isShowOperation">
						<view
							class="list-item-check checked"
							:style="{color:themeColorCode}"
							v-if="isCheckedOk(val)"
							@tap.stop="handleSwitch(val.id)">
							<m-font-icon icon="checkbox_app" :iconSize="32"></m-font-icon>
						</view>
						<view class="list-item-check" @tap.stop="handleSwitch(val.id)" v-else >
							<m-font-icon icon="unCheckbox_app" :iconSize="32"></m-font-icon>
						</view>
					</view>
				</view>
				<view class="info" v-html="val.content">
					<!-- {{removeHTMLTagAndEscape2Html(val.content)}} -->
					<!-- {{val.content}} -->
					<!-- hi，您有一条
					<span class="point">
						【名称：发动机故障；编码：0890】
					</span>
					待接修，请尽快处理。 -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	export default {
		props: {
			listDate: {
				type: Array,
				default: () => []
			},
			handleClick: {
				type: Function,
				default: null
			},
			longPressClick: {
				type: Function,
				default: null
			},
			isShowOperation: {
				type:Boolean,
				default: false
			},
			msgIds: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				// msgIds: []
			}
		},
		methods: {
			childMethod({msgIds, i}) {
				this.handleSwitch(msgIds)
				if (this.handleClick) {
					this.handleClick({msgIds, i});
				}
			},
			childLongPressClick() {
				if (this.longPressClick) {
					this.longPressClick();
				}
			},
			handleSwitch(id) {
				let nowId = String(id);
				let index = this.msgIds.indexOf(nowId);
				console.log(this.msgIds, nowId, index === -1);
				if (index === -1) {
					this.msgIds.push(nowId);
				} else {
					let index = this.msgIds.indexOf(nowId);
					this.msgIds.splice(index, 1);
				}
				this.$emit('giveMsgIds', this.msgIds)
			},
			isCheckedOk(val) {
				return this.msgIds.join(',').indexOf(val.id) > -1;
			},
			// html 转义
			removeHTMLTagAndEscape2Html(str) {
				// str = str.replace(/<\/?[^>]*>/g, ); //去除HTML tag
				str = str.replace(/<\/?[^>]*>/g, '<br>'); //去除HTML tag
				str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
				//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
				str=str.replace(/ /ig,'');//去掉 
				var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}; 
				return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
			}
		},
		computed: {
			...mapState(["themeColorCode"]),
		},
	}
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import "@/static/scss/common/_function.scss";
@import "@/static/scss/common/_variable.scss";

.time {
	display: flex;
	span {
		display: inline-block;
		margin: pxToREM(30) auto;
		background: rgba(170, 170, 170, 0.5);
		border-radius: 5px;
		text-align: center;
		padding: pxToREM(5) pxToREM(22);
		font-size: pxToREM(20);
		color: #FFFFFF;
	};
}
.message {
	background: #FFFFFF;
	border-radius: 8px;
	padding: pxToREM(30) pxToREM(30);
	margin-bottom: pxToREM(20);
	.title {
		display: flex;
		align-items: center;
		position: relative;
		.myIcon {	
			color: #4689F5;
		}
		// 多选框
		.list-item-check {
			text-align: right;
			color: #D9D9D9;
			&.checked{color: $main-color;}
		}
		.titleName {
			width: 100%;
			display: flex;
			align-items: center;
			.circle {
				width: pxToREM(10);
				height: pxToREM(10);
				margin-left: pxToREM(10);
				background: #E02020;
				border-radius: 50%;
			}
			.readName, .noReadName {
				margin-left: pxToREM(10);
				font-size: pxToREM(30);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.readName {
				color: #808080;
				font-weight: 400;
			}
			.noReadName {
				color: #333333;
				font-weight: 500;
				font-family: PingFangSC-Medium, PingFang SC;
			}
		}
		.checkClass {
			position: absolute;
			right: 0;
		}
	}
	.info {
		margin-top: pxToREM(10);
		font-size: pxToREM(24);
		word-wrap: break-word;
		white-space: normal;
		word-break:break-all;
		color: #808080;
		.point {
			color: #333333;
		}
	}
	::v-deep{
		p {
			min-height: pxToREM(18);
		}
	}
}
</style>

