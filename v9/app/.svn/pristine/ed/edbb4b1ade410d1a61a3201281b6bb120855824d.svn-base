<template>
	<view class="mniPager">
		<view class="prev">
			<button class="btn" @tap="prevClick">上一页</button>
		</view>
		<view class="content">
			<text class="currentText">{{current}}</text>/<text>{{total}}</text>
		</view>
		<view class="next">
			<button class="btn" @tap="nextClick">下一页</button>
		</view>
	</view>
</template>

<script>
	export default {
		name:'mniPager',//分页器
		props:{
			total:{
				type:Number,
				default: 1
			}
		},
		data(){
			return {
				current:1
			}
		},
		methods:{
			setCurrent(current = 0){
				if( !current) return
				this.current = current
			},
			prevClick(){//向前
				if(this.current<=1){
					return
				} 
				this.current--
				this.$emit("prev",{
					page:this.current
				})
			},
			nextClick(){//向后
				if(this.current >= this.total) {
					this.Static_GlobalFucs.showToast({title:'最后一页~'})
					return
				} 
				this.current++
				this.$emit("next",{
					page:this.current
				})
			}
		}
	}
</script>

<style lang="scss">
	.mniPager{
		padding: 10rpx 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size:28rpx;
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(51,51,51,1);
		background-color: #fff;
		.content{
			flex: 1;
			text-align: center;
			line-height:36px;
			.currentText{
				color: #C62127;
			}
		}
		.btn{
			flex-shrink: 0;
			width: 168rpx;
			height: 78rpx;
			line-height: 78rpx;
			font-size:28rpx;
			font-family:PingFangSC-Regular,PingFang SC;
			font-weight:400;
			color:rgba(51,51,51,1);
			background-color: #fff;
		}
	}
</style>
