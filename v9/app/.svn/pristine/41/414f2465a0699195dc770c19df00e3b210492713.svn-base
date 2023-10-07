<template name="mImage">
	<!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
	<view v-if="element.visiabled && showUrl.length>0">
		<swiper class="swiper"  :style="{height: listHeight, width: '95%', margin: '0 auto'}">
			<swiper-item v-for="(item,index) in showUrl" :key="index" style="display: flex; justify-content: center;align-items: center;background: #fff;">
				<image :src="item" :style="{height: imgHeight(imgInfo[index])}" mode="heightFix" ref="proImg" @load="getImgHeight(index, $event)"></image>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import {fileApi} from '@/common/request/api.js'
	export default {
		name:"mImage",
		props:{
			element:{type:Object,default(){return {}}},
			relationId:{type:[Number,String],default:""},
			currentFormData: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapState(["token"]),
			showUrl() {
				return this.swiperUrl.length > 0 ? this.swiperUrl : (this.currentFormData ? [this.currentFormData] : [`${this.element.url}`]);
			},
			imgHeight() {
				return function(v) {
					if (v) {
						return `calc(100vw / ${v.detail.width} * ${v.detail.height})`;
					}
					return '';
				}
			}
		},
		data() {
			return{
				swiperUrl:[],
				listHeight: '150px',
				imgInfo: []
			}
		},
		methods:{
			getImgHeight(index ,v) {
				this.imgInfo[index] = v;
				if (index === 0) {
					this.listHeight = `calc(100vw / ${v.detail.width} * ${v.detail.height})`;
				}
			},
			getImage(){
				if(!this.relationId) return 
				fileApi.getRelationFile({
					relationId:this.relationId,
					relationTableName:this.element.relationTableName,
				})
				.then(pics => {
					this.swiperUrl = pics.map( function(item){return item.url} )
				})
			}
		},
		created(){
			this.getImage()
		}
	}
</script>
<style scoped>
	.swiper{
		width: 100%;
		/* height: 680upx; */
		background: #FFFFFF;
	}
</style>
