<template>
  <view class="dayTable">
	<view class="header">
		<view class="month">{{month}}月</view>
		<view class="week">
			<lxCalendar></lxCalendar>
		</view>
	</view>
	<view class="allDay" v-if="allDay" >
		<view class="title">全天</view>
		<view class="allDay_box" v-for="(item,index) in allDay" :key="index" :style="item.style">
		  <view class="allDay_name">{{item.name}}</view>
		</view>
	</view>
    <scroll-view class="calendar_body" :style="scrollHeight" :scroll-y="isScroll" :scroll-top="scrollTop" @scroll="scroll">
      <!-- 默认底色表格 -->
      <!-- @touchstart="touchSt(index,$event)" @touchend="touchEn(index)" -->
      <view class="calendar_table" @click="touchSt($event)">
        <view v-for="(item,index) in defaultList" :key="index" :ref='index' class="cal_tr" :class="item.trClass" :style="{'height':unitHeight+'px;'+item.hidClass}">
          <view class="left_time">{{item.timeTitle}}</view>
          <view class="right_content"></view>
        </view>
      </view>

      <!-- 会议区域 -->
      <view class="calendar_meeting">
        <!-- 已创建的会议 -->
        <view v-for="(item,index) in meetingList" :key="index" :style="item.style" class="meeting_a" :class="item.bgClass"
          @click="showDetail(index,$event)">
          <view class="create_content_box">
            <view class="meeting_content_name">{{item.name}}</view>
          </view>
        </view>

        <view v-if="meetingDetail" class='meeting_detail' :class="meetingDetail.class" :style="meetingDetail.style" id="myId">
          <view class="time">{{meetingDetail.time}}</view>
          <view class="name">{{meetingDetail.name}}</view>
          <view class="detalied">{{meetingDetail.detail}}</view>
		  <button type="warn" class="btn" @click="deleteSchedule(meetingDetail.name)">删除</button>
        </view>

        <!-- 创建会议 -->
        <view v-if='isCreate' class="meeting_create" :style="createMeet.style" @click="creat()">
          <view class="radius_first radius" >
            <view></view>
          </view>
          <view class="radius_second radius">
            <view></view>
          </view>

          <view :style='createMeet.trueStyle' class="meeting_left_time">
            <view class="left_Time_show ">{{createMeet.startTimeShow}}</view>
            <view class="left_Time_show endTimeText">{{createMeet.endTimeShow}}</view>
          </view>
          <view class="create_content_box">

            <!-- <view class="meeting_content">{{createMeet.startTime}} - {{createMeet.endTime}}</view> -->
            <text class="meeting_content">{{createMeet.name}}</text>
          </view>
        </view>
      </view>
      <!-- 时间线刻度 -->
      <view v-if="isToday==0" class="time_now" :style="nowTime.line">
        <view class="left_text_red">{{nowTime.text}}</view>
        <view class="left_text_radio"></view>
        <view class="time_line"></view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations
  } from 'vuex'
  import lxCalendar from '../lx-calendar/lx-calendar.vue'
  let timeOutEvent = 0;
  let scrollYtop = 0;
  let hidID = -1;
  function vibrate(){
    uni.vibrateShort();
  };

  export default {
	components:{
		lxCalendar,
	},
    props: {
      chooseDate: String,
      hourHeight: Number, //表格单元高度
      // uMinute: Number, //表格单元时长
      // showMin: Number, //显示单元时长
      defaultChooseLong: Number, //默认点击所占时长
      scrollHeight: String,
    },
    data() {
      return {
		allDay: [],
		month:"",
        unitHeight: 8,
        unitMinute: 15,
        showMinute: 60,
        defaultChoose: 8,
        scale: 0,
        minRatio: 0,
        minAll: 0,
        defaultList: [],
        meetingList: [],
        nowLine: "",
        startId: 0,
        isCreate: false,
        createMeet: "",
        isScroll: true,
        nowTime: {},
        scrollTop: 0,
        timeId: -1,
        isToday: 0,
        meetingDetail: "",
		schedule: [],
		index: 0
      };
    },
	computed: {
	  user() {
	    return this.$store.getters.user;
	  }
	},
    //如果将chooseDate放入vuex 监听可使用下面方法
    // watch: {
    //   chooseDate: function(n, o) {
    //     if (hidID > -1) {
    //       this.defaultList[hidID].hidClass = "font-size:12px;"
    //     }
    //     this.isCreate = false;
    //     this.createMeet = "";
    //     this.getMeetingList();
    //     this.isTodayFun(n);
    //   },
    // },
    // computed: {
    //   ...mapState([
    //     'chooseDate'
    //   ]),

    // },
    created() {
	  this.init();
	  let now = new Date();
	  this.month = now.getMonth()+1
      this.unitHeight = parseInt(this.hourHeight / 4) || 11; //16px
      // this.unitMinute = parseInt(this.uMinute) || 15; //15分钟
      // this.showMinute = parseInt(this.showMin) || 60; //60分钟
      this.defaultChoose = parseInt(this.defaultChooseLong/15) || 8; //120分钟
      this.minMute=parseInt(this.showMin) || 1;

      this.minRatio = this.showMinute / this.unitMinute; //4
      this.minAll = 1440 / this.unitMinute; //96
      //后续修改
      this.scrollTop = this.unitHeight * 28.8;
      this.getDefaultTable();
	  let that = this
	  		setTimeout(function() {
	  			that.getMeetingList();
	  		}, 0)
		this.isTodayFun(this.chooseDate)
    },
    methods: {
      showError(message) {
      	uni.showToast({
      		title: message,
      		icon: 'none',
      		duration: 2000
      	})
      },
      scroll(e) {
        //手机端区别手指滚动和点击操作
        clearTimeout(timeOutEvent);
        scrollYtop = e.detail.scrollTop;
      },
      //判断是否为今天
      isTodayFun(d) {
        let isToday;
        let td = new Date();
        td = new Date(td.getFullYear(), td.getMonth(), td.getDate());
        let od = new Date(d);
        od = new Date(od.getFullYear(), od.getMonth(), od.getDate());
        let xc = od - td;
        let result = "";
        if (xc < 0) {
          isToday = -1
        } else if (xc == 0) {
          isToday = 0;
        } else {
          isToday = 1;
        }
        this.isToday = isToday;
        if (this.isToday == 0) {
          this.getTimeNow();
        }
      },
      //获取当前时间imeNow
      getTimeNow() {
        let self = this;
        let hidId = -1;
        let nowDate = new Date();
        let hour = nowDate.getHours(); //获取当前小时数(0-23)
        let min = nowDate.getMinutes(); //获取当前分钟数(0-59)
		self.month = nowDate.getMonth()+1
        let top = (hour * self.minRatio + min / self.unitMinute) * self.unitHeight - 1;
        let timeLine = "top:" + top + "px;";
        let text = nowDate.toString().substring(15, 21);
        //是否隐藏上下时间线
        if (min < 15) {
          hidId = hour * self.minRatio;
        } else if (min > 45) {
          hidId = (hour + 1) * self.minRatio;
        }
        self.nowLine = timeLine;
        self.nowTime = {
          line: timeLine,
          text: text
        };
        if (hidId > -1) {
          self.defaultList[hidId].hidClass = "font-size:0;"
        };
        hidID = hidId;
        let timeId = hour * self.minRatio + Math.floor(min / self.unitMinute);

        self.timeId = timeId;
        this.scrollTop = timeId * this.unitHeight - 50;
      },
      //获取表格默认数据
      getDefaultTable() {
        let self = this;
        let list = [],
          // all = self.minAll,
          rat = this.minRatio;
        for (let i = 0; i < 97; i++) {
          let time = "",
            timeClass = "";
          let hour = Math.floor(i / rat);
          hour = hour < 10 ? '0' + hour : hour;

          if (i % rat === 0) {
            time = hour + ":00";
            timeClass = "hasTime"
          } else {
            time = hour + ':' + i % rat * self.unitMinute;
          }
          list.push({
            trClass: timeClass,
            timeTitle: time,
          })
        };
        this.defaultList = list;
      },
      //整理会议列表数据
      getMeetingList() {
		  const { windowWidth, windowHeight } = uni.getSystemInfoSync();
		  let meetingList = this.schedule
		  console.log(meetingList)
        /* let meetingList = [{
            name: "网页设计",
            startTime: "2019-07-31 14:00:00",
            endTime: "2019-07-31 15:30:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
          }, {
            name: "升旗仪式",
            startTime: "2019-07-31 09:15:00",
            endTime: "2019-07-31 10:30:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
          },
		  {
		    name: "运动会",
		    startTime: "2019-07-31 09:15:00",
		    endTime: "2019-07-31 22:30:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
		  },
          {
            name: "打篮球",
            startTime: "2019-08-01 16:15:00",
            endTime: "2019-08-01 16:50:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
          },
          {
            name: "测试",
            startTime: "2019-07-30 08:15:00",
            endTime: "2019-07-30 10:50:02"
          },
          {
            name: "测试",
            startTime: "2019-07-29 10:15:00",
            endTime: "2019-07-29 11:50:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
          },
          {
            name: "测试",
            startTime: "2019-07-28 13:15:00",
            endTime: "2019-07-28 14:50:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
          },
		  {
		    name: "aaaaaa",
		    startTime: "2019-07-28 09:15:00",
		    endTime: "2019-07-28 12:50:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
		  },
          {
            name: "测试",
            startTime: "2019-07-27 09:15:00",
            endTime: "2019-07-27 07:50:02",
			detail:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"
          }
        ]; */
        let list = [];
        for (let i = 0; i < meetingList.length; i++) {
		  let day = meetingList[i].startTime.substring(0, 10)
          let start = meetingList[i].startTime.substring(11, 16).split(":");
          let end = meetingList[i].endTime.substring(11, 16).split(":");
		  let allDay = end[0] - start[0]

          let st = parseInt(start[0] * this.minRatio) + parseInt(start[1] / this.unitMinute);
          let ed = parseInt(end[0] * this.minRatio) + parseInt(end[1] / this.unitMinute);

          let height = "height:" + ((ed - st) * this.unitHeight) + "px;";
          let top = "top:" + ((st * this.unitHeight)) + "px;";
		  let left = "left: "+ (56 + (new Date(day).getDay()) * (windowWidth - 64)/7) + "px;"
		  let marginLeft = "margin-left: "+ (56 + (new Date(day).getDay()) * (windowWidth - 64)/7) + "px;"
          let isFlex = "";
		  let bgArr = ["blurBg","redBg","greenBg","aBg","bBg"]
          let bgClass = bgArr[Math.floor(Math.random()*bgArr.length)];
          // if ((ed - st) < 2) {
          //   isFlex = "isFlex "
          // }
		  if(allDay > 10){
			  this.allDay.push({
				  name: meetingList[i].name,
				  marginLeft: (56 + (new Date(day).getDay()) * (windowWidth - 64)/7),
				  style: marginLeft,
			  })
		  }
          else{
			  list.push({
			    top: st * this.unitHeight,
			  	left: (56 + (new Date(day).getDay()) * (windowWidth - 64)/7),
			    style: height + top + left,
			    name: meetingList[i].name,
			    time: meetingList[i].startTime.substring(11, 16) + '-' + meetingList[i].endTime.substring(11, 16),
			    isFlex: isFlex,
			    startId: st,
			    endId: ed,
			    bgClass: bgClass,
				detail:meetingList[i].detail,
			  })
		  } 
        }
        this.meetingList = list;
      },
      //点击会议列表
      showDetail(index, e) {
		  this.index = index
		  const { windowWidth, windowHeight } = uni.getSystemInfoSync();
        this.scrollTop = scrollYtop;

        if (!!this.isCreate) {
          this.isCreate = false;
          this.createMeet = "";
          return;
        }
        if(this.meetingDetail!=""&&this.meetingDetail.index==index){
          this.meetingDetail="";
          return;
        }

        let y = e.touches[0].clientY;
		let x = e.touches[0].clientX;
        let newShow = this.meetingList[index],detailClass="",top="";
		let width = 'width: ' + (windowWidth - 170) + 'px;';
		let left='left:'+(newShow.left-(windowWidth - 170)/2 + (windowWidth - 64)/14) +'px;';
		if(x<80){
			width = 'width: ' + (windowWidth - 280) + 'px;';
			left='left:'+(newShow.left-(windowWidth - 280)/2 + (windowWidth - 64)/14) +'px;';
		}
        if (y > 450) {
          detailClass= 'meeting_detail_top';
          top='top:'+(newShow.top-112) +'px;'
        } else {
          detailClass= 'meeting_detail_bottom';
          top='top:'+(newShow.endId*this.unitHeight+12) +'px;'
        }
        this.meetingDetail={
          index:index,
          class:detailClass,
          style:top + left + width,
          name: newShow.name,
          time:newShow.time,
		  detail: newShow.detail,
        }
      },

      //是否隐藏时间
      isHidTime(id) {
        let timeId = this.timeId;
        if (id == timeId || id == timeId + 1) {
          return true;
        } else {
          return false;
        }
      },
      //会议是否冲突
      hasMeeting(idSt, idEnd) {
        let hasMeeting = this.meetingList.some(function(item) {
          return (idSt > item.startId - 0.1 && idSt < item.endId) || (idEnd > item.startId && idEnd < item.endId +
            0.1) || (idSt < item.startId && idEnd > item.endId)
        });
        return hasMeeting;
      },
      //判断是否为过去时间
      isOldtime(startId, touchid) {
        let nowDate = new Date();
        let timeNowId = nowDate.getHours() * 4 + Math.ceil(nowDate.getMinutes() / 15);
        if (touchid < timeNowId) {
          return -1; //过去时间不能预定
        } else {
          if (startId < timeNowId) {
            return timeNowId; //开始时间为timeNowId
          }
          return 0; //开始时间不变
        };
      },
      //创建会议渲染
      createMeeting(e) {  
		const { windowWidth, windowHeight } = uni.getSystemInfoSync();
		let num = Math.floor((e.touches[0].clientX-56)/((windowWidth - 64)/7))
        let self = this;
        let id = parseInt(this.startId);
		let left = "left: "+ (56 + num * (windowWidth - 64)/7) + "px;"
        let top = "",
          stId = 0,
          endId = 0,
          height = "";
        let startTime = "";
        let endTime = "";
        if (id < 2) {
          id = 2;
        } else if (id > 89) {
          // endId = 96;
          id = 90;
          stId = 88;
        } else {
          stId = id - 2;
          // endId = id + 6;
        };

        //当前建会判断；
        if (this.isToday === 0) {
          let isOld = this.isOldtime(stId, id);
          if (isOld === -1) {
            this.showError("过去时间不可预订");
            timeOutEvent = 1;
            return;
          } else if (isOld > 0) {
            stId = isOld;
            id = stId + 2;
          }
        }
        endId = stId+this.defaultChoose;
        let test=this.defaultChoose -1.9;
        this.meetingList.forEach(function(item) {
          if (id - item.endId < 2.1 && id - item.endId > -0.1) {
            stId = item.endId;
          }
          // if (item.startId - id < 6.1 && item.startId - id > -0.1) {
          //   endId = item.startId;
          // }
          if (item.startId -id  < test && item.startId - id > -0.1) {
            endId = item.startId;
          }

        });
        top = (stId * self.unitHeight);
        startTime = self.defaultList[stId].timeTitle;
        endTime = self.defaultList[endId].timeTitle;
        height = self.unitHeight * (endId - stId);
        let startTimeShow = startTime,
          endTimeShow = endTime;

        if (!!self.isHidTime(stId) && self.isToday == 0) {
          startTimeShow = '';
        };

        let meeting = {
          isFlex: '',
          trueStyle: 'top:0;height:' + height + "px;",
          style: 'top:' + top + 'px;height:' + height + "px;" + left,
          name: '再次点击新建日程',
          time: startTime + ' - ' + endTime,
          length: endId - stId,
          idSt: stId,
          idEnd: endId,
          height: height,
          top: top,
          startTime: startTime,
          endTime: endTime,
          startTimeShow: startTimeShow,
          endTimeShow: endTimeShow
        };
        this.isCreate = true;
        this.createMeet = meeting;
        this.startTop = top;
      },
      //点击开始
      touchSt(e) {
        this.scrollTop = scrollYtop;
        let self = this;
        if (e.target.offsetLeft < 50) {
          return;
        }
        if(this.meetingDetail!=""){
          this.meetingDetail="";
          return;
        }
        let item = e.target.offsetTop / self.unitHeight;
        self.startId = item;
        clearTimeout(timeOutEvent);
        if (self.isToday == -1) {
          this.showError("过去时间不可预订");
          timeOutEvent = 1;
          return;
        }
        timeOutEvent = setTimeout(function() {
          //长按要执行的内容
          timeOutEvent = 0;
          //显示方块
          self.startY = e.touches[0].clientY;
          if (!!self.isCreate) {
            self.isCreate = false;
            self.createMeet = "";
            return;
          }
          self.createMeeting(e);
        }, 50) //设置定时如果点击创会30-60之间，长按创会则设置300-600之间

      },
	  creat(){
		  uni.navigateTo({
		      url: '../../pages/creat/creat?start='+ this.createMeet.startTimeShow + '&end=' + this.createMeet.endTimeShow
		  });
	  },
	  deleteSchedule(name){
		  uni.request({
		      url: 'http://192.168.43.251:5001/api/userSchedule/delSchedule', 
		      data: {userId: this.user.userId,
					 name: name
					},
		  			 method:"DELETE",
		      success: (res) => {
					if(res.statusCode == 200){
						this.meetingList.splice(this.index,1) 
						this.meetingDetail = ''
						uni.showToast({
							title: "删除成功"
						});
					}
		      }
		  });
	  }, 
	  init(){
		  uni.request({
				url: 'http://192.168.43.251:5001/api/userSchedule/getSchedule', 
				data: {userId: this.user.userId},
						  method:"POST",
				success: (res) => {
						this.schedule = res.data
						
				}
			});
		  
	  }
    }
  }
</script>

<style lang="less">
  @timeSize: 12px;
  @borderColor: #ddd;

  .create_content_box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .dayTable {
    border-top: 1px solid @borderColor;
    width: 100%;
    background-color: #ffffff;
  }

  .calendar_body::-webkit-scrollbar {
    display: none;
  }

  .calendar_body {
    height: calc(100vh - 148px);
    width: calc(100vw - 8px);
    position: relative;
    overflow-x: hidden;

    .calendar_table {
      margin-top: 15px;
      position: absolute;
      top: 0;
      // z-index: 10;

      .cal_tr {
        width: 100%;
        height: 11px;
        display: flex;
        font-size: 0;
        color: #808080;
      }

      .left_time {
        line-height: 0;
        width: 50px;
        text-align: center;
		margin-right: 6px;
      }

      .right_content {
        border-top: 1px solid #ffffff;
        height: 15px;
        width: calc(100vw - 50px);
      }

      .hasTime {
        font-size: @timeSize;
      }

      .hasTime .right_content {
        border-color: @borderColor;
      }
    }

    .calendar_meeting {
      margin-top: 15px;
      position: absolute;
      top: 0;
      // height: 100%;
      width: 100%;

      .redBg {
        background-color: rgba(254, 222, 224, 1);
        color: #F65B67;
        // border-left: 4px solid #F65B67;
      }

      .blurBg {
        // border-left: 4px solid #34BDA0;
        color: #34BDA0;
        background-color: rgba(222, 248, 234, 1);
      }
	  
	  .greenBg {
	    // border-left: 4px solid #34BDA0;
	    color: #007AFF;
	    background-color: #4CD964;
	  }
	  
	  .bBg {
	    // border-left: 4px solid #34BDA0;
	    color: #4CD964;
	    background-color: #795DA3;
	  }
	  
	  .aBg {
	    // border-left: 4px solid #34BDA0;
	    color: #9A6E3A;
	    background-color: #00F0F0;
	  }

      .meeting_a {
        font-size: @timeSize;
        /* left: 41px; */
        right: 0px;
        position: absolute;
        cursor: pointer;
        border-radius: 4px;
		width: calc((100vw - 64px)/7);
      }

      .meeting_detail {
        // width: calc(100% - 150px);
        left: 50px;
        // width: 99%;
        font-size: @timeSize;
        position: absolute;
        background-color: #ffffff;
        height: 100px;
        border-radius: 4px;
        box-shadow: 0 0 5px #999999;
        z-index: 999;
        box-sizing: border-box;
        padding: 10px;
		.detalied{
			text-overflow: -o-ellipsis-lastline;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		}
		.name{
			line-height: 20px;
			font-weight: bold;
		}
		.btn{
			font-size: @timeSize;
			padding: 2px;
			width: 50px;
			height: 20px;
			position: absolute;
			bottom: 2px;
			right: 10px;
			line-height: 20px;
		}
      }

      .meeting_detail_top {
        // top: -114px;
      }

      .meeting_detail_bottom {
        // bottom: -114px;
      }

      .meeting_detail_top ::before {
        content: "";
        width: 0;
        height: 0;
        position: absolute;
        bottom: -7px;
        left: calc(50% - 6px);
        border-style: solid;
        border-width: 8px;
        border-color: #ffffff #ffffff transparent transparent;
        transform: rotate(135deg);
        box-shadow: 2px -2px 3px -1px #cccccf;

      }

      // 向上的气泡
      .meeting_detail_bottom:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        top: -7px;
        left: calc(50% - 6px);
        border-style: solid;
        border-width: 8px;
        border-color: transparent transparent #fff #fff;
        transform: rotate(135deg);
        box-shadow: -2px 2px 3px 0 rgba(0, 0, 0, 0.2);
      }
	  
	  .meeting_content_time {
	    margin-left: 5px;
	    min-width: 135px;
	  }

      .meeting_content_name {
        width: calc((100vw - 64px)/7);
        overflow: hidden;
        text-overflow: ellipsis;
		text-align: center;
		line-height: 18px;
		height: 100%;
      }

      .isFlex {
        align-items: center;
        display: flex;

        .meeting_content_name {
          width: 135px;
        }
      }

      .meeting_create {
        left: 50px;
		width: calc((100vw - 64px)/7);
        height: 63px;
        position: absolute;
        border-radius: 3px;
        background-color: #3788c8;
        z-index: 990;
        font-size: @timeSize;

        .meeting_content {
          color: #ffffff;
          margin-left: 5px;
          // line-height: 100%;
        }

        .radius {
          width: 80px;
          height: 80px;
          position: absolute;
          z-index: 999;
          cursor: pointer;

          display: flex;
          justify-content: center;
          align-items: center;

          view {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: 1rpx solid #3788c8;
            background-color: #ffffff;
          }
        }

        .radius_first {
          top: -40px;
          left: 0;
        }

        .radius_second {
          bottom: -40px;
          right: 0;
        }

        .meeting_left_time {
          position: absolute;
          left: -50px;
        }

        .left_Time_show {
          background-color: #ffffff;
          width: 50px;
          position: absolute;
          font-size: @timeSize;
          text-align: center;
          color: #1994FD;
          line-height: 0;
        }

        .endTimeText {
          bottom: 0;
        }
      }
    }

    .time_now {
      margin-top: 15px;
      display: flex;
      align-items: center;
      width: 100vw;
      height: 0.5px;
      position: absolute;
      z-index: 50;

      .left_text_red {
        text-align: center;
        width: 50px;
        color: #FF0000;
        font-size: @timeSize;
        line-height: 0;
      }

      .left_text_radio {
        width: 4px;
        height: 4px;
        background-color: #FF0000;
        border: 1rpx solid #ffffff;
        border-radius: 50%;
        line-height: 0;
        margin-left: -3px;
      }

      .time_line {
        flex-grow: 1;
        border: 0.5px solid red;
      }
    }
  }
  .header{
	  display: flex;
	  .month{
		  font-size: 12px;
		  margin-left: 10px;
		  transform: translate(2px, 5px);
		  width: 10px;
		  text-align: center;
		  line-height: 21px;
	  }
	  .week{
	  	  margin-left: 21px;
	  	  /deep/.date{
	  	  	width: calc(100vw - 41px);
	  	  	height: 58px;
	  		.dd{
	  			height: 25px;
	  			.num {
	  			    width: 25px;
	  			    height: 25px;
	  			    border-radius: 50%;
	  			    line-height: 25px;
	  			}
	  		}
	  	  }
	  	  /deep/.head{
	  			  display: none;
	  		  }
	  		/deep/  .retract{
	  			  display: none;
	  		  }
	  }
  }
  .allDay{
	  height: 18px;
	  display: flex;
	  margin-bottom: 5px;
	  .title{
		  font-size: @timeSize;
		  width: 50px;
		  text-align: center;
		  margin-right: 6px;
		  color: #808080;
	  }
	  .allDay_box{
		  height: 100%;
		  overflow: hidden;
		  width: calc((100vw - 64px)/7);
		  font-size: @timeSize;
		  cursor: pointer;
		  border-radius: 4px;
		  background-color: #00F0F0;
		  .allDay_name{
			  width: calc((100vw - 64px)/7);
			  overflow: hidden;
			  text-overflow: ellipsis;
			  text-align: center;
			  line-height: 18px;
			  height: 100%;
		  }
	  }
  }
</style>
