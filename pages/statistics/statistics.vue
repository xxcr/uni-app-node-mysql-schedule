<template>
	<view>
		<view>
			<gpp-configuration-form ref="form" type="fill" :formTemplate="formTemplate" :formValue="formValue" :isCard="false"></gpp-configuration-form>
		</view>
		<view>
			<histogram-chart
				:dataAs="histogramData2"
				canvasId="ht1"
				labelKey="label"
				valueKey="value"
				:yAxisAs="{
					formatter: {
						type: 'number' //type:number percent String,额外参数:fixed:NUmber,name:String
					}
				}"
			/>
		</view>
	</view>
</template>

<script>
	import HistogramChart from '@/components/stan-ucharts/HistogramChart.vue';
	import gppConfigurationForm from '@/components/gpp-configurationForm/gpp-configurationForm.vue';
	export default {
	    components: {
	        HistogramChart,
			gppConfigurationForm
	    },
	    data() {
	        return {
				formTemplate: [{
					formTitle: "群课程统计",
					id: "469823830580379648",
					object: [{
						textName: "group",
						subject: "选择查看的群",
						controlType: "select",
						isMustfill: true,
						values: []
					},
					{
						textName: "date",
						subject: "日期",
						controlType: "date",
						isMustfill: true
					}]
				}],
				formValue: {
					group: "1"
				},
	            histogramData2: {
	                //柱状图Compent  //label应为series value 应为
	                label: ['1-2', '3-4', '5-6', '7-8', '9-10'],
	                value: [
	                    {
	                        name: '有课人数',
	                        data: [10, 20, 16, 2, 5]
	                    }
	                ]
	            },
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
							this.formTemplate[0].object[0].values.push({
								valueName: res.data[i].groupName,
								valueCode: res.data[i].groupId
							})
						}
						console.log(this.formTemplate)
				}
			});
		}
	}
</script>

<style lang="scss">

</style>
