<template name="mMap">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view class="formElemets" v-if="element.visiabled"
	 :class="[element.labletPositon || 'left',
	  element.readonly?'readonly':'']">
		<label class="text" :class="value || element.readonly?'':'drakcolor'">
			{{ element.label }}
			<span v-if="element.requisite" class="icon iconfont iconmust-fill2 requisite"></span>
		</label>
		<view class="content">
			<input class="input" :class="{hasrelationTab:element.relationTabId}" :value="valueName" :placeholder="element.placeholderText" disabled="true" style="display: inline-block"/>
			<!-- 扫描按钮 -->
			<!-- #ifndef H5 -->
			<m-button v-if="!element.readonly" class="button" :isFontBtn="true" btnClass="mainColor"  key="map"
				@elementClick="showPosition">
				<block slot="buttonIcon" style="display: inline-block;">
					<m-font-icon icon="icondiliweizhi" :iconSize="38"></m-font-icon>
				</block>
			</m-button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>	
	export default {
		name:"mMap",
		props:{
			element:{type:Object,default(){return {}}},
			sourceType:{type:String,default: "list"},//来源 list forme advancedFilter
			value:{type:[Number,String],default: ''},//值
		},
		data() {
			return {
        valueSync: "",
				valueName: "",
				elementId: "",
			};
		},
		methods:{
      showPosition() {
        uni.navigateTo({
					url:'/pages/map/map?elementId='+ this.elementId + "&latLon=" + this.valueSync
				})
      }
		},
		created() {
			this.elementId = this.element.elementId;
			console.log(this.elementId);
      if(this.sourceType !== 'list') {
        this.valueSync = this.value;
        this.valueName = this.value.split(',')[0];
			}
      uni.$on(String(this.elementId), (data) => {
        this.valueSync = data.data;
				this.valueName = this.valueSync.split(',')[0];
        // if (this.element.readonly) return
				this.$emit("changeValue",{
					triggerBaseType:2,
					element:this.element,
					value:this.valueSync
				})
			}) 
		}
	}
</script>
<style scoped>
	.listElemets{
		height: 46upx;
		display: flex;
		align-items: center;
	}
	.star-content{
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>
