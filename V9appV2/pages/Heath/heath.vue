<template>
	<view class="formTemplate checkbg" style="background: #F5F5F5;">
		<m-back-bar-nol>
			<block slot="barTitle">健康度检查</block>
		</m-back-bar-nol>
		<view class="health-top">
			<view class="health-bg">
				<view class="ricle">
					<view class="big item" :class="{'fast':fast}"></view>
					<view class="lint item" :class="{'fast':fast}"></view>
					<view class="mark item">
						<span><countup :num="health" color="#FFFFFF" width='66' height='110' fontSize='110'></countup></span><span class="feng">分</span>
					</view>
				</view>
				<button class="checkBtn" @click="checkHealth(false)" :disabled="loading" :loading="loading">一键检查</button>
			</view>
		</view>
		<view class="health-content">
			<view class="healthCheck">
				<view class="check-item halfrow" v-for="(item, index) in checkData" :key='index' @click="handleDeatil(index)">
					<m-font-icon class="item-icon" :icon="item.iconName" :iconSize="60" :color="item.color"></m-font-icon>
					<view>
						<view>{{item.title}}</view>
						<view class="subtitle">{{randoms[index]}}条超时未完成</view>
					</view>
				</view>
			</view>
			<view class="healthCheck">
				<view class="check-item fullrow" v-for="(item, index) in checkDataBottom" :key='index' @click="handleDeatil(index + 4)">
					<view class="svgicon" :class="[item.iconPosition]"></view>
					<view class="checkLeft">
						<view class="leftcontent">
							<view>{{item.title}}</view>
							<view class="subtitle2">{{item.subTile}}<span style="color: #4689F5;">{{randoms[index+4]}}</span></view>
						</view>
						<button class="lookBtn" @click="checkHealth">立即查看</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {checkData, checkDataBottom} from './json/checkData.js'
	import MBackBarNol from '@/components/bar/MBackBarNol.vue'
	import countup  from '@/components/p-countUp/countUp.vue'
	// import './js/iconfont.js' 
	export default {
		components:{MBackBarNol,countup},
		data() {
			return {
				checkData,
				checkDataBottom,
				randoms:uni.getStorageSync('HealthRandoms') || [2,2,1,3,"86%","38H","89H/次"],
				loading:false,
				health:uni.getStorageSync('health') || 86,
				angle:0,
				rotateInt:0,
				fast: false
			}
		},
		methods:{
			getRandom(isStart){//获随机数
				let random = []
				for(let i=0;i<4;i++) random.push(Math.floor(Math.random()*9))
				//健康度
				let health = Math.floor(Math.random()*5) + 85
				random.push(`${health}%`)
				//停机时长
				random.push(`${Math.floor(Math.random()*100)}H`)
				//停机频率
				random.push(`${Math.floor(Math.random()*100)}H/次`)
				
				this.randoms = [...random]
				uni.setStorageSync("HealthRandoms",random)
				uni.setStorageSync("health",health)
				//分值
				if(!isStart)
					setTimeout( () => {
						this.loading = false
						this.health = health
						this.fast = false;
					}, 4000)
			},
			checkHealth(isStart){//点击检查
				if(!isStart) {
					this.loading = true
					this.fast = true;
				}
				this.getRandom(isStart)
			},
			handleDeatil(index){//跳转
				let num = this.randoms[index];
				let urlArry = [
					"故障工单",
					"计划/保养工单",
					"点巡检",
					"信息不完整工单",
					"设备异常",
					"设备停机时长",
					"设备故障列表",
				] // name：名称；num：几条数据；index：第几页
				uni.navigateTo({
					url: `/pages/Heath/HealthyJump/healthJump?num=${num}&name=${urlArry[index]}&index=${index}`
				});
			}
		}
	}
</script>

<style lang="scss">
	@import "@/static/scss/common/_function.scss"; 
	@keyframes myfirst1 {
		0% {
			transform:rotate(0deg);
			// box-shadow:0px 0px 10px #fff;
		}
		100% {
			transform:rotate(3600deg);
			// box-shadow:0px 0px 10px #fff;
		}
	}
	.svgicon{
		margin: 0 34rpx;
		width: pxToREM(60);
		height:pxToREM(60);
		background:url(./img/icon.png) no-repeat;
		background-size: cover;
	}
	.zhongjian{
		background-position: pxToREM(-84)
	}
	.iconright{
		background-position: pxToREM(-164)
	}
	.health-top{
		background:linear-gradient(180deg, #3F85F8 0%, #106AF7 100%);
	}
	.health-bg{
		padding-top: var(--status-bar-height);  
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 750rpx;
		background:url(./img/HealthBg.png) no-repeat;
		background-size: 100% 100%;
	}
	.ricle{
		position: relative;
		height:320rpx;
		width: 320rpx;
		
		.big{
			border-radius:50%;
			background:url(./img/rang1.png) no-repeat;
			animation: myfirst1 30s linear infinite;
			&::after{
				content: '';
				height:280rpx;
				width: 280rpx;
				display: block;
				border: solid 20rpx rgba(255,255,255,0.3);
				border-radius: 50%;
				box-shadow: 0 0 8rpx 0 rgba(21, 63, 129, 0.2);
			}
		}
		.lint{
			border-radius:50%;
			background:url(./img/rang2.png) no-repeat;
			animation: myfirst1 30s linear infinite;
			&::after{
				content: '';
				height:306rpx;
				width: 306rpx;
				display: block;
				border: solid 8rpx rgba(255,255,255,0.4);
				border-radius: 50%;
				box-shadow: 0 0 8rpx 0 rgba(21, 63, 129, 0.2);
			}
		}
		.fast{
			animation-duration: 6s;
			// animation-timing-function: cubic-bezier(0.35, 0.01, 0.49, 0.46);
		}
		.low{animation:myfirst1 30s linear infinite;}
		.quick {animation:myfirst1 5s linear infinite;}
		.mark{
			display: flex;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 110rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;
			span.feng{
				margin: 40rpx 0 0 2px;
				font-size: 48rpx;
			}
		}
		.item{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background-size: 100% 100%;
		}
	}
	
	.checkBtn{
		margin-top: 30rpx;
		width: 220rpx;
		height: 80rpx;
		border-radius: 40rpx !important;
		box-shadow: 0px 2px 10px 0px rgba(44, 157, 168, 0.38);
		font-size: 32rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #4689F5;
	}
	.lookBtn{
		margin-right: 35rpx;
		width: 144rpx;
		height: 60rpx;
		background: #FFFFFF;
		border-radius: 30rpx;
		border: 1px solid #FAA431;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #FAA431;
	}
	.health-content{
		position: absolute;
		// 751-（160-98）
		top: 688rpx;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 0 24rpx;
		.healthCheck{
			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			.check-item{
				display: flex;
				align-items: center;
				// padding: 0 pxToREM(37);
				// line-height: pxToREM(160);
				background: #FFFFFF;
				font-size: 32rpx;
				font-weight: 400;
				font-family: PingFangSC-Regular, PingFang SC;
				color: #333333;
				.subtitle{
					font-size: 26rpx;
					color: #FAA431;
				}
				.subtitle2{
					font-size: 24rpx;
					color: #AAAAAA;
				}
				.item-icon{padding: 0 34rpx;}
				.checkLeft{
					flex: 1;
					height: 160rpx;
					display: flex;
					align-items: center;
					border-bottom: solid 1px #EBEBEB;
					.leftcontent{
						flex: 1;
					}
				}
			}
			.halfrow{
				margin-bottom: 18rpx;
				flex: 0 0 48.5%;
				height: 160rpx;
				border-radius: 8rpx;
				box-shadow: 0px 2px 10px 0px rgba(46, 92, 167, 0.1);
			}
			.fullrow{
				flex: 0 0 100%;
				height: 160rpx;
			}
		}
	}
</style>
