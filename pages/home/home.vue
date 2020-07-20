<template>
	<view class="bgcolor">
		<view class="container">
			<view class="card_1">
				<view class="text">环境永远不会十全十美，消极的人受环境控制，积极的人却控制环境。</view>
			</view>
			<view class="card_2">
				<uni-card is-shadow>
					<view class="title"><image src="../../static/image/yndx.png" ></image></view>
					<view class="itemBox">
						<view class="item new" @click="creat()">
							<view class="iconfont icon-xinjian icon" style="color: #EE9900;"></view>
							<view class="text">新建日程</view>
						</view>
						<view class="item check">
							<view class="iconfont icon-xiaoli icon" style="color: #FF0000;"></view>
							<view class="text">学校校历</view>
						</view>
						<view class="item join" @click="joinGroup()">
							<view class="iconfont icon-jiaru icon" style="color: #0077AA;"></view>
							<view class="text">加入群</view>
						</view>
						<view class="item creat" @click="addGroup()">
							<view class="iconfont icon-xinjianqun icon" style="color: #669900;"></view>
							<view class="text">新建群</view>
						</view>
						<view class="item countdown">
							<view class="iconfont icon-daojishi icon" style="color: #4CD964;"></view>
							<view class="text">日程倒计时</view>
						</view>
						<view class="item note">
							<view class="iconfont icon-biji icon" style="font-weight: bold; color: #007AFF;"></view>
							<view class="text">笔记</view>
						</view>
						<view class="item statistics" @click="statistics()">
							<view class="iconfont icon-tongji icon" style="font-weight: bold; color: #DD4A68;"></view>
							<view class="text">群课程统计</view>
						</view>
						<view class="item more">
							<view class="iconfont icon-gengduo icon" style="font-weight: bold; color: #B3D4FC;"></view>
							<view class="text">更多</view>
						</view>
					</view>
				</uni-card>
			</view>
			<view class="card_3">
				<uni-card is-shadow >
					<text class="tit">1</text>
					<text class="title">{{today}}</text>
					<text>第{{weekday}}周</text>
					<view class="total">
						<view>
							今天有{{total}}个日程
						</view>
					</view>
					<view class="scheduleBox">
						<view class="schedule" v-for="(item,i) in schedule" :key="item.id" v-if="item.isComplete">
							<text class="iconfont icon-quan icon uncomplete" @click="complete(i)"></text>
							<text class="time">{{item.time}}</text>
							<text class="content">{{item.scheduleContent}}</text>
						</view>
						<view class="schedule" v-for="(item,i) in schedule" :key="item.id" v-if="item.isComplete == false">
							<text class="iconfont icon-dui icon complete"></text>
							<text class="time">{{item.time}}</text>
							<text class="content">{{item.scheduleContent}}</text>
						</view>
					</view>
				</uni-card>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				today:"星期五",
				weekday: "13",
				total:"5",
				schedule:[{
					time:"08:00-10:00",
					scheduleContent:"数据库",
					isComplete:false
				},{
					time:"10:00-12:00",
					scheduleContent:"网页设计",
					isComplete:true
				},{
					time:"13:00-14:00",
					scheduleContent:"看书",
					isComplete:true
				},{
					time:"14:30-15:20",
					scheduleContent:"考研学习",
					isComplete:true
				},{
					time:"16:00-17:00",
					scheduleContent:"开会",
					isComplete:true
				}]
			}
		},
		created() {
			this.total = this.schedule.length
		},
		methods: {
			complete(i){
				this.schedule[i].isComplete = false
			},
			creat(){
			  uni.navigateTo({
				  url: '../creat/creat'
			  });
			},
			statistics(){
				uni.navigateTo({
					url: '../statistics/statistics'
				});
			},
			addGroup(){
				uni.navigateTo({
					url: '../addGroup/addGroup'
				});
			},
			joinGroup(){
				uni.navigateTo({
					url: '../joinGroup/joinGroup'
				});
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
			.card_1{
				position: relative;
				height: 150px;
				.text{
					color: #FFFFFF;
					font-size: 15px;
					position: absolute;
					top: 22%;
					left: 15px;
					line-height: 30px;
					width: 240px;
					text-indent: 2em
				}
			}
			.card_1::after {
			  content: "";
			  background: url(../../static/image/bg.png) no-repeat;
			  background-size: 750rpx 150px;
			  opacity: 0.5;
			  top: 0;
			  left: 0;
			  bottom: 0;
			  right: 0;
			  position: absolute;  
			}
			.card_2{
				.title{
					image{
						width: 125px;
						height: 35px;
					}
				}
				.itemBox{
					display: flex;
					flex-wrap: wrap;
					text-align: center;
					.item{
						width: 25%;
						font-size: 15px;
						margin-top: 15px;
						margin-bottom: 15px;
						.icon{
							font-size: 30px;
							margin-bottom: 8px;
						}
					}
				}
			}
			.card_3{
				font-size: 21px;
				.tit{
					width: 3px;
					height: 12px;
					background-color: #00b7ff;
					color: #00b7ff;
					margin-right: 10px;
				}
				.title{
					margin-right: 12px;
				}
				.total{
					float: right;
					font-size: 12px;
					border: 1px solid #b4b4b4;
					border-radius: 13px;
					padding: 5px 5px 0px 5px;
				}
				.scheduleBox{
					padding-left: 5px;
					font-size: 17px;
					.schedule{
						margin-top: 8px;
						margin-bottom: 8px;
						display: flex;
						align-items: center;
						.uncomplete{
							color: #4CD964;
						}
						.complete{
							color: #DD4A68;
						}
						.icon{
							margin-right: 8px;
							font-size: 20px;
							transform: translate(0,-10%);
						}
						.time{
							margin-right: 30px;
						}
					}
				}
			}
		}
	}
</style>
