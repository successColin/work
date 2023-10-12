<template>
	<!-- 多选框-数据选择框 -->
	<view class="formElemets m-multiple">
		<label class="text multiple-label">
			<view>{{ element.label }}<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span></view>
			<!-- 扫描按钮 -->
			<!-- #ifndef H5 -->
			<m-button class="saomiaoBtn" v-if="!element.readonly" :isFontBtn="true" btnClass="mainColor"  key="scan" 
			 @elementClick="handleScan">
				<block slot="buttonIcon" style="display: inline-block;">
					<m-normal-icon icon="iconsaoma1" :iconSize="38"></m-normal-icon>
				</block>
			</m-button>
			<!-- #endif -->
		</label>
		<view class="content">
			<view class="multiple-list">
				<m-button class="addBtn addSlot" v-if="!element.readonly" :isFontBtn="true" btnClass="mainColor" key="add"
				 @elementClick="showPanel">
					<block slot="buttonIcon">
						<m-normal-icon icon="icontianjiatupian" :iconSize="24" style="display: inline-block;"></m-normal-icon>
						<text class="addBtn-title">添加</text>
					</block>
				</m-button>
				<view class="multiple-value" v-for="(item, index) in multipleValue" :key="index">
					<label class="vlaue">{{item.label}}</label>
					<label class="delete" v-if="!element.readonly" @click="delect(item, index)">×</label>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		name:'m-multiple-searchSelect',
		props:{
			element:{type:Object,default(){return {}}},
			isEllipsis:{type:Boolean,default: false},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Array]},//值
		},
		data(){
			return {
				multipleValue:[],
				isInit:true,
			}
		},
		watch:{
			value(newVal,oldVal){
				if(this.sourceType !== 'list'){
					this.multipleValue = newVal
				} 
			}
		},
		methods:{
			showPanel(){this.$emit("select")},
			handleScan() {this.$emit("selectScan")},
			delect(e, index){
				this.multipleValue.splice(index, 1)
				let values = []
				for(let i = 0,len=this.multipleValue.length;i<len;i++){
					let item = this.multipleValue[i]
					values.push(item.value)
				}
				this.$emit("changeValue",{ 
					triggerBaseType:3,
					element:this.element,
					value:values.join(",")
				})
			}
		},
		created(){
			this.multipleValue = [...this.value]
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/scss/common/_function.scss";
	.multiple-label{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.addSlot{
		margin:0 0 pxToREM(19) 0;
		padding: 0 pxToREM(24);
		border-radius:pxToREM(24);
		border:2rpx solid rgba(235,235,235,1);
		.addBtn-title{
			font-size:pxToREM(26);
			color:rgba(68,68,68,1);
			font-weight:400;
			line-height:pxToREM(40);
		}
	}
	.multiple-list{
		display: flex;
		align-items: center;
		flex-wrap:wrap;
	}
	.multiple-value{
		margin:0 pxToREM(20) pxToREM(19) 0;
		padding: pxToREM(5) pxToREM(17);
		
		font-size:pxToREM(26);
		font-family:PingFangSC-Regular,PingFang SC;
		font-weight:400;
		color:rgba(250,100,0,1);
		background:rgba(255,241,231,1);
		border-radius:pxToREM(26);
		line-height:pxToREM(40);
		.delete{
			padding-left: pxToREM(10);
		}
	}
</style>
