<template>
	<view >
		<div class="test-component" v-for="(item,i) in group" :key="item.id" >
		  <hm-sms-list-card :options="item"></hm-sms-list-card>
		</div>
		<div class="test-component"  >
		  <hm-sms-list-card :options="options"></hm-sms-list-card>
		</div>
	</view>
  
</template>

<script>
	import HmSmsListCard from '@/components/hm-sms-list-card/index.vue';
	
	export default {
	  components: { HmSmsListCard },
	  data() {
	    return {
			g: [],
			group: [],
			options: {
			    xueshengdangan:
			      '/static/image/logo.png',
			    paybak: '考研小组',
			    company: '',
			    txt: '15:25',
			    desc: 'aaaaaaaaaaaaaa',
			    side:
			      '/static/hm-sms-list-card/images/img_25832_0_0.png'
			  }
	    };
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
					this.g = res.data
					for(let i = 0; i < this.g.length-1; i++){
						this.group.push({
							xueshengdangan:
							  '/static/hm-sms-list-card/images/img_25832_0_1.png',
							primary:
							  '/static/hm-sms-list-card/images/img_25832_0_2.png',
							paybak: this.g[i].groupName,
							company: '',
							txt: '12:15',
							desc: this.g[i].detail,
							side:
							  '/static/hm-sms-list-card/images/img_25832_0_0.png'
						})
					}
			}
		});
	  },
	  methods: {
	    onClick: function(e) {
	      console.log('onClick');
	    }
	  }
	};
</script>

<style>

</style>
