<template>
	<block>
		<view
			class="showToast"
			:class="'move-' + moveType"
			:style="{'top': getWindowTop}"
			@touchstart.stop="moveStart"
			@touchmove.stop.prevent="moveM"
			@touchend.stop="moveEnd"
		>
			<text class="iconfont icon-tishi icon" :class="'type-' + type"></text>
			{{msg}}
		</view>
	</block>
</template>

<script>
	import cys from './config.js'
	export default {
		data() {
			return {
				getWindowTop: 0,
				moveType: '',
				touchObj: {
					startX: 0,
					startY: 0,
					moveX: 0,
					moveY: 0
				}
			}
		},
		props: {
			msg: {
				type: String,
				default() {
					return '成功'
				}
			},
			type: {
				type: String,
				default() {
					return 'success'
				}
			},
			moveTypes: {
				type: String,
				default() {
					return ''
				}
			}
		},
		watch: {
			moveTypes(str) {
				this.moveType = str
			}
		},
		created() {
			let that = this
			// #ifdef H5
			that.getWindowTop = 44 + 10 + 'px'
			// #endif
			uni.getSystemInfo({
				success: function(res) {
					if (res.model.indexOf('iPhone') !== -1) {
						// #ifdef MP
						that.getWindowTop = 10 + 'px'
						// #endif
					} else {
						// #ifdef MP
						that.getWindowTop = 10 + 'px'
						// #endif
					}
				}
			})
		},
		methods: {
			moveStart(e) {
				this.touchObj.startY = e.touches[0].pageY
				this.touchObj.startX = e.touches[0].pageX
				
				// cys.log(this.touchObj)
			},
			moveM(e) {
				let that = this
				that.touchObj.moveY = e.touches[0].pageY
				that.touchObj.moveX = e.touches[0].pageX
				
				if ((e.touches[0].pageX - that.touchObj.startX) > 10) {
					that.moveType = 'right'
				} else if ((e.touches[0].pageX - that.touchObj.startX) < -10) {
					that.moveType = 'left'
				} else {
					that.moveType = 'top'
				}
				
				setTimeout(function() {
					that.$emit('reduction')
				}, 500)
				
				// cys.log(this.touchObj)
			},
			moveEnd(e) {
				cys.log(this.touchObj)
				// if (this.touchObj.startY > )
			}
		}
	}
</script>

<style lang="less" scoped>
	.showToast {
		position: fixed;
		width: 90%;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: #fff;
		left: 5%;
		box-shadow: 0px 0px 10rpx 0px rgba(0,0,0,0.2);
		border-radius: 12rpx;
		transition: all .5s;
		color: #000;
		font-size: 36rpx;
		transform: translateY(-300%);
		.icon {
			margin-right: 10rpx;
			font-size: 38rpx;
		}
		.type-success {
			color: #00c300;
		}
		.type-fail {
			color: red;
		}
		&.move-bottom {
			transform: translateY(0);
		}
		&.move-top {
			transform: translateY(-300%);
		}
		&.move-right {
			transform: translateX(200%);
		}
		&.move-left {
			transform: translateX(-200%);
		}
	}
</style>
