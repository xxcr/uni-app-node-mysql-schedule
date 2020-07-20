<template>
	<view :class="cstyle">
		<view class="flex justify-between margin-lr padding-tb-sm solid-bottom align-center">
			<view class="text-lg">
				<view>{{title}}</view>
				<view>{{subTitle}}</view>
			</view>
			<view class="action">
				{{cimgs.length}}/{{imgL}}
			</view>
		</view>
		<view class="cu-form-group">
			<view class="grid col-4 grid-square flex-sub padding-top-sm solid-bottom">
				<view class="bg-img" v-for="(item,index) in cimgs" :key="index" @tap="ViewImage(index)" >
					<image :src="cimgs[index]" mode="aspectFill"></image>
					<view v-if="type != 'show'" class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<view class="solids" @tap="ChooseImage" v-if="cimgs.length<imgL && type != 'show'">
					<text class='cuIcon-cameraadd'></text>
				</view>
			</view>
		</view>
		<cpImg ref="cpimg" @result="cpimgOk" @err="cpimgErr" :number="cpimgNumber" :fixOrientation="cpimgFixOrientation" :size="cpimgSize" :maxWidth="cpimgMaxWidth" :ql="cpimgQl" :type="cpimgType"  />
	</view>
</template>

<script>
	import cpImg from "./cpimg.vue"
	export default{
		components:{cpImg},
		name:'c-upload',
		props:{
			type:{  				//shou -展示  add - 正常添加  edit-修改
				type:String,
				default:'add',
			},
			cstyle:{		
				type:String,
				default:'',
			},
			title:{
				type:String,
				default:'',
			},
			subTitle:{
				type:String,
				default:'',
			},
			imgL:{
				type:Number,
				default:9,
			},
			imgs:{
				type:Array,
				default:()=>[]
			},
			cpimgSize:{		//照片大小超过此值就压缩，且最大宽高等于maxWidth
				type:Number,
				default:500
			},				
			cpimgMaxWidth:{//照片宽高超过此值就压缩，且最大宽高等于此值
				type:Number,
				default:750
			},			
			cpimgQl:{//照片压缩比 0-1	
				type:Number,
				default:0.92
			},				
			cpimgType:{
				type:String,
				default:'url'
			},				//照片压缩后返回的格式  base64	
			cpimgFixOrientation:{
				type:Boolean,
				default:true
			},	//是否修正图片方向（暂时只支持H5）
			cpimgNumber:{
				type:Number,
				default:1
			}				//一次压缩图片数量（不支持H5）
		},
		data(){
			return{
				cimgs:this.imgs,				
			}
		},
		methods:{
			// 图片选择
			ChooseImage() {
				this.$refs.cpimg._changImg()
			},
			// 
			cpimgOk(val){
				if(val){
					this.cimgs = this.cimgs.length != 0 ? this.cimgs.concat(val) : val;
					this.$emit('getImg',this.cimgs)
				}
			},
			cpimgErr(val){
				console.log(val)
			},
			// 删除图片
			DelImg(e) {
				uni.showModal({
					title: '提示',
					content: '确定要删除该项吗？',
					cancelText: '再看看',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.cimgs.splice(e.currentTarget.dataset.index, 1)
							this.$emit('getImg',this.cimgs)
						}
					}
				})
			},
			// 预览图片
			ViewImage(e) {
				uni.previewImage({
					urls: this.cimgs,
					current: e
				});
			},
		}
	}
</script>
