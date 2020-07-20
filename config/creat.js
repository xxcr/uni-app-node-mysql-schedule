const code = [{
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
			valueCode: "1"
		}, {
			valueName: "女",
			valueCode: "2"
		}]
	}]
}];

export default code;
