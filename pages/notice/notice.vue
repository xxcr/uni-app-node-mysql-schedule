<template>
	<view class="bgcolor">
		<view class="container">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem"
				style-type="text" active-color="#407dff"></uni-segmented-control>
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
			                @scroll="scroll">
				<view v-show="current === 0">
					<timelineItem class="card" v-for="(item,i) in schedule" :key="item.id" :leftTime="item.time" >
					                <view is-shadow class="card_content">
					                	<view class="title">
					                		<text class="source">{{item.source}}</text>
					                	</view>
					                	<view class="content"><text class="text">增加一个日程：{{item.scheduleContent}}</text></view>
					                	<view class="schedule_Time">时间：{{item.scheduleTime}}</view>
					                </view>
					            </timelineItem>
					<!-- <view class="card" v-for="(item,i) in schedule" :key="item.id">
						<uni-card is-shadow class="card_content">
							<view class="title">
								<text class="iconfont icon-tongzhi icon"></text>
								<text class="source">{{item.source}}</text>
								<text class="time">{{item.time}}</text>
							</view>
							<view class="content"><text class="text">增加一个日程：{{item.scheduleContent}}</text></view>
							<view class="schedule_Time">时间：{{item.scheduleTime}}</view>
						</uni-card>
					</view> -->
				</view>
				<view v-show="current === 1">
					选项卡2的内容
				</view>
			</scroll-view>
		</view>
    </view>
</template>

<script>
	import uniSegmentedControl from "@/components/uni-segmented-control/uni-segmented-control.vue"
	import timeline from '../../components/chenbin-timeline/timeLine.vue'
	import timelineItem from '../../components/chenbin-timeline/timelineItem.vue'
	export default {
    components: {
			uniSegmentedControl,
			timeline,
			timelineItem
		},
	    data() {
	        return {
	            items: ['群通知','系统通知'],
	            current: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				schedule:[{
					source: "考研小组",
					time: "05/22 08:12",
					scheduleContent: "答辩",
					scheduleTime: "05/22 18:00"
				},{
					source: "数字媒体技术",
					time: "04/01 12:12",
					scheduleContent: "开班会",
					scheduleTime: "04/02 12:20"
				},{
					source: "数字媒体技术",
					time: "04/01 12:12",
					scheduleContent: "开班会",
					scheduleTime: "04/02 12:20"
				},{
					source: "数字媒体技术",
					time: "04/01 12:12",
					scheduleContent: "开班会",
					scheduleTime: "04/02 12:20"
				},{
					source: "数字媒体技术",
					time: "04/01 12:12",
					scheduleContent: "开班会",
					scheduleTime: "04/02 12:20"
				},{
					source: "数字媒体技术",
					time: "04/01 12:12",
					scheduleContent: "开班会",
					scheduleTime: "04/03 12:20"
				}]
	        }
	    },
	    methods: {
	        onClickItem(e) {
	            if (this.current !== e.currentIndex) {
	                this.current = e.currentIndex;
	            }
	        },
			upper: function(e) {
			            console.log(e)
			        },
			        lower: function(e) {
			            console.log(e)
			        },
			        scroll: function(e) {
			            console.log(e)
			            this.old.scrollTop = e.detail.scrollTop
			        },
			        goTop: function(e) {
			            this.scrollTop = this.old.scrollTop
			            this.$nextTick(function() {
			                this.scrollTop = 0
			            });
			            uni.showToast({
			                icon:"none",
			                title:"纵向滚动 scrollTop 值已被修改为 0"
			            })
			        }
	    }
	}
</script>

<style lang="scss">
	.bgcolor{
		background: $uni-color-theme;
		.container{
			margin-top: -12px;
			padding-top: 12px;
			margin-bottom: -12px;
			padding-bottom: 12px;
			/deep/{
				.segmented-control{
					padding: 0 12px;
					padding-top: 8px;
					.segmented-control__item {
						border-bottom-width: 0;
						.segmented-control__text{
							font-size: 14px;
							border-bottom-style: solid;
							padding-bottom: 6px;
							border-bottom-width: 2px;
							
						}
					}
				}
			}
			.scroll-Y{
				width: 706rpx;
				height: 90vh;
				margin: 12px;
			}
			.card{
				.card_content{
					padding: 0 8px;
					font-size: 14px;
					box-sizing: border-box;
					background:rgba(255,255,255,1);
					box-shadow:0px 0px 20px 0px rgba(0,0,0,0.08);
					border-radius:10px;
					margin-bottom: 30rpx;
					padding: 10px;
					.title{
						margin-bottom: 10px;
						.source{
							font-size: 15px;
							font-weight: bold;
						}
					}
					.content{
						height: 60px;
						margin-left: 5px;
						.text{
							line-height: 23px;
						}
					}
					.schedule_Time{
						margin-left: 5px;
					}
				}
			}
		}
	}
</style>
