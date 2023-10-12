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
			<view>
				<view class="discuss_container">

				</view>
				
			</view>
			
		</view>
		<view class="newsDetail_option">
			<view class="newsDetail_option_input">
				 <input class="discuss_write"  placeholder="写评论" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				barTitle:'更多评论   '
			}
		},
		methods: {
			
		}
	}
</script>

