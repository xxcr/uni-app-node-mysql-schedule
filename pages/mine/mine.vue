<template>
	<view class="bgcolor">
		<view class="container">
			<view class="status_bar">
				<!-- 这里是状态栏 -->
			</view>
			<view class="nav">
				<view class="iconfont icon-settings icon">
				</view>
			</view>
			<view class="card-1">
				<uni-card is-shadow note="true">
					<view class="imgShadow">
					</view>
					<image class="headerImg" :src=headerImg @error="imageError"></image>
					<view class="info">
						<view class="name">{{user.name}}</view>
						<view class="major">{{grade}}级&nbsp&nbsp&nbsp{{user.major}}</view>
					</view>
					<template v-slot:footer>
						<view class="footerTitle">数据中心</view>
						<view class="footer-box">
							<view class="foterItem">
								<view class="itemBox">
									<view class="iconfont icon-tongbu icon" style="color: #4876FF;"></view>
								</view>
								数据同步</view>
							<view class="foterItem">
								<view class="itemBox">
									<view class="iconfont icon-beifenhuifu icon" style="color: 	#B23AEE;"></view>
								</view>
								备份恢复</view>
							<view class="foterItem">
								<view class="itemBox">
									<view class="iconfont icon-qunzu icon" style="color: #9AFF9A; font-size: 44px;"></view>
								</view>
								加入的群</view>
							<view class="foterItem" @click="ownerGroup()">
								<view class="itemBox">
									<view class="iconfont icon-guanliyuan icon" style="color: 	#EE7621;"></view>
								</view>
								管理的群</view>
						</view>
					</template>
				</uni-card>
			</view>
			<view class="card-2">
				<uni-card is-shadow title="定制服务" >
					<uni-list>
					    <uni-list-item title="提醒定制" thumb="../../static/image/naozhong.png"></uni-list-item>
						<uni-list-item title="个性定制" thumb="../../static/image/gexing.png"></uni-list-item>
					</uni-list>
				</uni-card>
			</view>
			<view class="card-3">
				<uni-card is-shadow >
					<uni-list>
					    <uni-list-item title="实名认证" thumb="../../static/image/shiming.png" @click="realname()"></uni-list-item>
						<uni-list-item title="邀请好友" thumb="../../static/image/fenxiang.png"></uni-list-item>
						<uni-list-item title="关于我们" thumb="../../static/image/banben.png"></uni-list-item>
					</uni-list>
				</uni-card>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
	    data() {
			return {
				headerImg:"../../static/online/headerImg.jpg",
				college: "软件学院",
				name: "徐旭",
				major: "数字媒体技术",
				grade: "2016"
			}
		},
		computed: {
		  user() {
		    return this.$store.getters.user;
		  }
		},
		created() {
		},
	    methods: {
	        imageError(e) {
	            console.error('image发生error事件，携带值为' + e.detail.errMsg)
	        },
			realname(){
				uni.navigateTo({
				    url: '../realname/realname'
				});
			},
			ownerGroup(){
				uni.navigateTo({
				    url: '../ownerGroup/ownerGroup'
				});
			}
	    },
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
			.status_bar {
			      height: var(--status-bar-height);
			      width: 100%;
			  }
			.nav{
				height: 40px;
				position: relative;
				.icon{
					font-size: 26px;
					color: #FFFFFF;
					position: absolute;
					right: 12px;
					top: 50%;
					transform: translate(0,-30%);
				}
			}
			.card-1{
				position: relative;
				/deep/{
					.uni-card__footer{
						border-top: 0;
						padding: 15px;
						padding-top: 0;
					}
					.uni-card{
						overflow: visible;
					}
				}
				.imgShadow, .headerImg {
					width: 60px;
					height: 60px;
					border-radius: 50%;
					position: absolute;
					top: 0;
					left: 50%;
					transform: translate(-50%,-50%);
				}
				.imgShadow{
					width: 70px;
					height: 70px;
					background-color: $uni-color-theme;
					opacity: 0.2;
				}
				.info{
					margin-top:24px;
					text-align: center;
					.name{
						font-size: 18px;
						line-height: 34px;
					}
					.major{
						font-size: 14px;
					}
				}
				.footerTitle{
					font-size: 17px;
					margin-top: 6px;
					margin-bottom: 0px;
				}
				.footer-box{
					display: flex;
					.foterItem{
						width: 25%;
						font-size: 13px;
						text-align: center;
						.itemBox{
							width: 50px;
							height: 50px;
							line-height: 50px;
							border-radius: 50%;
							box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.1);;
							margin: 15px auto;
							.icon{
								font-size: 35px;
							}
						}
					}
				}
			}
			.card-2{
				/deep/{
					.uni-card__header{
						border: 0;
						padding-bottom: 3px;
					}
					.uni-card__content{
						padding-top: 4px;
						padding-bottom: 6px;
						.uni-list-item__container{
							padding: 10px 0px;
							.uni-list-item__icon{
								margin-right: 10px;
							}
						}
					}
					.uni-list-item__container::after{
						opacity: 0.5;
					}
				}
			}
			.card-3{
				/deep/{
					.uni-card__header{
						border: 0;
					}
					.uni-card__content{
						padding-top: 4px;
						padding-bottom: 6px;
						.uni-list-item__container{
							padding: 11px 0px;
							.uni-list-item__icon{
								margin-right: 10px;
							}
						}
					}
					.uni-list-item__container::after{
						opacity: 0.5;
					}
				}
			}
		}
	}
</style>
