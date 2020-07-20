<template>
	<view>
		<gpp-configuration-form ref="form" type="fill" :formTemplate="formTemplate" :formValue="formValue" :isCard="true" :time = "time"></gpp-configuration-form>
		<button class="button" @click="save">保 存</button>
	</view>
	
</template>

<script>
	import gppConfigurationForm from '@/components/gpp-configurationForm/gpp-configurationForm.vue';
	export default {
		components: {
			gppConfigurationForm
		},
		onLoad(time){
			this.time = time
		},
		data() {
			return {
				formTemplate: [{
					formTitle: "基本信息",
					id: "469823830580379648",
					object: [{
						textName: "scheduleName",
						subject: "日程名称",
						controlType: "text",
						isMustfill: true,
						maxlength: 12
					}, {
						textName: "date",
						subject: "开始日期",
						controlType: "date",
						isMustfill: true
					}, {
						textName: "startTime",
						subject: "开始时间",
						controlType: "startTime",
						isMustfill: true
					}, {
						textName: "date",
						subject: "结束日期",
						controlType: "date",
						isMustfill: true
					}, {
						textName: "endtTime",
						subject: "结束时间",
						controlType: "endTime",
						isMustfill: true
					},{
						textName: "detailed",
						subject: "日程详细",
						controlType: "textarea",
						placeholder: ""
					},
					{
						textName: "other",
						subject: "为谁创建",
						controlType: "select",
						isMustfill: true,
						values: [{
							valueName: "自己",
							valueCode: "0"
						}]
					}]
				}],
				formValue: {
					other: "0"
				},
				time: '12:01'
			}
		},
		computed: {
		  user() {
		    return this.$store.getters.user;
		  }
		},
		created() {
			uni.request({
				url: 'http://192.168.43.251:5001/api/group/getOwnerGroup', 
				data: {userId: this.user.userId},
						  method:"POST",
				success: (res) => {
					console.log(res.data)
						for(let i = 0; i < res.data.length; i++){
							this.formTemplate[0].object[6].values.push({
								valueName: res.data[i].groupName,
								valueCode: res.data[i].groupId
							})
						}
						console.log(this.formTemplate)
				}
			});
		},
		methods: {
			save(){
				let result = this.$refs.form.submit();
				if(result.checkFlag){
					
					uni.request({
					    url: 'http://192.168.43.251:5001/api/userSchedule/addSchedule', 
					    data: Object.assign({userId: this.user.userId}, result.value),
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
				}else{
					uni.showToast({
						title: result.message,
						icon: "none"
					})
				}
			}
		}
	}
</script>

<style>
	.button{
		margin: 14px 10px 10px 10px;
		background-color: #6BA1FF;
		color: #FFFFFF;
	}
</style>
