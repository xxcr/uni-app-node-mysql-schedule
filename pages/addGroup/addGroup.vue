<template>
	<view class="content">
		<view class="title">上传群头像</view>
		<view class="box">
			<avatar class="ava"
			    selWidth="200px" selHeight="400upx" @upload="myUpload" :avatarSrc="url"
			    avatarStyle="width: 150upx; height: 150upx; border-radius: 100%;">
			</avatar>
		</view>
		
		<view class="uni-form-item uni-column">
			<text style="width: 100px;">群名称</text><input type="string" class="uni-input" v-model="group.name" name="" placeholder="请输入" />
		</view>
		<view class="uni-form-item uni-column">
			<text style="width: 100px;">群描述</text><input type="string" class="uni-input" v-model="group.detail" name="" placeholder="" />
		</view>
		<button type="primary" @tap="addGroup()">创建</button>
	</view>
		
</template>

<script>
	import avatar from "../../components/yq-avatar/yq-avatar.vue";
	    export default {
	        data() {
	            return {
	                url: "../../static/image/logo.png",
					group:{
						name: '',
						detail: ''
					}
	            }
	        },
			computed: {
			  user() {
			    return this.$store.getters.user;
			  }
			},
	        methods: {
	            myUpload(rsp) {
	                this.url = rsp.path; //更新头像方式一
	                //rsp.avatar.imgSrc = rsp.path; //更新头像方式二
	            },
				addGroup(){
					uni.request({
					    url: 'http://192.168.43.251:5001/api/group/creatGroup', 
					    data: Object.assign({userId: this.user.userId}, this.group),
						 method:"POST",
					    success: (res) => {
							if(res.statusCode == 200){
								uni.showToast({
									title: "创建成功"
								});
								setTimeout( () => {
									uni.switchTab({url: '../home/home'});
								},1000);
							}
					    }
					});
				}
	        },
	        components: {
	            avatar
	        }
	    }
</script>

<style lang="scss" scoped>
	$color-primary: #b49950;
	.content{
		padding: 50upx;
	}
	.box{
		width: 150upx; 
		height: 150upx; 
		border-radius: 100%;
		border: #000000;
		margin-bottom: 15px;
		margin-top: 8px;
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
		display: flex;
		flex-direction: row;
		margin-bottom: 40upx;
			padding: 3px 0;
			overflow: hidden;
		.uni-input{
			margin-left: 15px;
			font-size: 36upx;
			border-bottom: 1px solid #e3e3e3;
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
