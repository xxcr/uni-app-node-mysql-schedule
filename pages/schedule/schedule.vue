<template>
	<view class="container">
		<hx-navbar
		    :back="false" 
		    :fixed="true"
			color="#ffffff"
			:background-color="[[0, 240, 240],[0, 240, 200]]">
		    <view class="weekBox">
		        <ms-dropdown-menu>
		        	<ms-dropdown-item v-model="value1" :list="list"></ms-dropdown-item>
		        </ms-dropdown-menu>
		    </view>
			<block slot="left">
				<text class="btn_switch">月视图</text>	
			</block>
		</hx-navbar>
		<day-table v-on:bookMeeting='bookMeeting($event)'></day-table>
	</view>
</template>

<script>
	import hxNavbar from "@/components/hx-navbar/hx-navbar.vue"
	import msDropdownMenu from '@/components/ms-dropdown/dropdown-menu.vue'
	import msDropdownItem from '@/components/ms-dropdown/dropdown-item.vue'
	import dayTable from "../../components/dayTable/dayTable.vue";

	export default {
	    components: {
			hxNavbar,
			msDropdownMenu,
			msDropdownItem,
			dayTable,
		},
		data() {
		    return {
		        month:"4",
				list: [
					{
						text: '第十一周',
						value: 0
					},
					{
						text: 'item2',
						value: 1
					},
					{
						text: 'item3',
						value: 2
					}
				],
				value1: 0,
		    }
		},
		methods: {
			bookMeeting(e) {
			        params = e;
			        console.log(params)
			      }
		}
	}
</script>

<style lang="scss">
	.container{
		.weekBox{
			display: flex;
			flex-direction: row;
			justify-content: center;
			width: 100%;
			margin-left: 8px;
			white-space: nowrap;
			/deep/{
				.dropdown-item__selected{
					background: none;
					padding: 0;
				}
				.list{
					color: black;
					.list__option{
						padding: 0 13px;
					}
				}
				.dropdown-item__content{
				}
			}
		}
		.btn_switch{
			font-size: 14px;
			margin-left: 10px;
			/deep/{
				span{
					border: 1px solid #8a8a8a;
					padding: 5px;
					border-radius: 5px;
				}
			}
		}
	}
</style>
