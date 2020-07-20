<template>
	<view class="content">
		<view class="logo"><image src="../../static/image/logo.png" mode=""></image></view>
		<view class="uni-form-item uni-column">
			<input type="tel" class="uni-input" v-model="loginUser.tel" name="" placeholder="请输入手机号" />
		</view>
		<view class="uni-form-item uni-column">
			<input type="password" class="uni-input" v-model="loginUser.password" name="" placeholder="请输入密码" />
		</view>
		<button type="primary" @tap="login()">登陆</button>
		<view class="links"><view @tap="gotoForgetPassword">忘记密码？</view><view>|</view><view class="link-highlight" @tap="gotoRegistration">注册账号</view></view>
		
		<cys-toast :moveTypes="moveTypes" @reduction="reduction" :type="type" :msg="msg"></cys-toast>
	</view>
</template>

<script>
	import jwt_decode from "jwt-decode";
	import CysToast from '@/components/showToast/showToast.vue'
	export default {
		components: {
			CysToast
		},
		data() {
			return {
				loginUser:{
					tel:"",
					password:""
				},
				msg: '',
				type: '',
				moveTypes: ''
			}
		},
		onLoad() {
			
		},
		methods: {
			gotoRegistration: function () {
				uni.navigateTo({url: '../registration/registration'});
			},
			gotoForgetPassword: function () {
				uni.navigateTo({url: '../forget-password/forget-password'});
			},
			login(){
				uni.request({
				    url: 'http://192.168.43.251:5001/api/user/login', 
				    data: this.loginUser,
					method:"POST",
				    success: (res) => {
						if(res.statusCode == 200){
							uni.showToast({
								title: "登陆成功"
							});
							const { token } = res.data;
							uni.setStorage({
							    key: 'scheduleToken',
							    data: token
							});
											
							// 解析token
							const decode = jwt_decode(token);
											
							// 存储数据
							this.$store.dispatch("setIsAutnenticated", !this.isEmpty(decode));
							this.$store.dispatch("setUser", decode);
							setTimeout( () => {
								uni.switchTab({url: '../home/home'});
							},1000);
						}
						else if(res.statusCode == 400 || res.statusCode == 404){
							this.moveTypes = 'bottom'
							this.type = 'fail'
							this.msg = res.data
							let that = this
							setTimeout(function() {
								that.moveTypes = ''
							}, 1500)
						}
				    }
				});
			},
			isEmpty(value) {
			  return (
			    value === undefined ||
			    value === null ||
			    (typeof value === "object" && Object.keys(value).length === 0) ||
			    (typeof value === "string" && value.trim().length === 0)
			  );
			},
			reduction() {
				this.moveTypes = ''
			},
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #b49950;
	.content{
		padding: 100upx;
	}
	.logo{
	    text-align: center;
		image{
		    height: 280upx;
		    width: 400upx;
		    margin: 0 0 60upx;
		}
	}
	.uni-form-item{
		margin-bottom: 40upx;
		padding: 0;
		border-bottom: 1px solid #e3e3e3;
		.uni-input{
			font-size: 30upx;
			padding: 7px 0;
		}
	}
	button[type="primary"]{
		background-color: $color-primary;
		border-radius: 0;
		font-size: 34upx;
		margin-top: 60upx;
	}
	.links{
		text-align: center;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999;
		view{
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}
		.link-highlight{
			color: $color-primary
		}
	}
</style>
