<template>
	<view>
		<gpp-configuration-form ref="form" type="fill" :formTemplate="formTemplate" :formValue="formValue" :isCard="true"></gpp-configuration-form>
		<button class="button" @click="save">保 存</button>
		<button class="button button_quxiao" >取消</button>
		<cys-toast :moveTypes="moveTypes" @reduction="reduction" :type="type" :msg="msg"></cys-toast>
	</view>
</template>

<script>
	import template from "@/config/realname.js";
	import gppConfigurationForm from '@/components/gpp-configurationForm/gpp-configurationForm.vue';
	import CysToast from '@/components/showToast/showToast.vue'
	export default {
		components: {
			gppConfigurationForm,
			CysToast
		},
		onLoad(register){
			this.register = register
		},
		data() {
			return {
				register:{
				},
				registerUser:{},
				formTemplate: template,
				formValue: {
				},
				msg: '',
				type: '',
				moveTypes: ''
			}
		},
		methods: {
			save(){
				let result = this.$refs.form.submit();
				if(result.checkFlag){
					this.registerUser = Object.assign(result.value, this.register);
					//console.log(this.registerUser);
					uni.request({
					    url: 'http://localhost:5001/api/user/register', 
					    data: this.registerUser,
						method:"POST",
					    success: (res) => {
							if(res.statusCode == 200){
								uni.showToast({
									title: "保存成功"
								}),
								setInterval( () => {
									uni.navigateTo({
										url: '../login/login',
									})
								},1000);	
							}
							else if(res.statusCode == 400){
								this.moveTypes = 'bottom'
								this.type = 'fail'
								this.msg = res.data
								let that = this
								setTimeout(function() {
									that.moveTypes = ''
								}, 2000)
							}
					    }
					});
				}else{
					uni.showToast({
						title: result.message,
						icon: "none"
					})
				}
			},
			
			reduction() {
				this.moveTypes = ''
			},
			/* clickBtn(type) {
				this.moveTypes = 'bottom'
				if (type === 'fail') {
					this.type = 'fail'
					this.msg = '失败'
				} else {
					this.msg = '成功'
					this.type = 'success'
				}
				setTimeout(function() {
					this.moveTypes = ''
				}, 500)
			} */
		}
	}
</script>

<style>
	.button{
		margin: 14px 10px 10px 10px;
		background-color: #6BA1FF;
		color: #FFFFFF;
	}
	.button_quxiao{
		background-color: #DD524D;
	}
</style>
