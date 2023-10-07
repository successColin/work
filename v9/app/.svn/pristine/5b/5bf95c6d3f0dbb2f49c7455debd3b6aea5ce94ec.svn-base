// 常量配置文件
//组件基础类型，具体看语雀
const elementType = {
	1: 'input',
	2: 'select',
	3: 'searchSelect',
	4: 'addBtn',//列表右上角新增按钮
	5: 'editBtn',
	6: 'delBtn',//删除按钮
	7: 'saveBtn',//保存按钮
	8: 'upload',//图片上传
	9: 'datePicker',
	10: 'textArea',//文本域
	11: 'splitLine',
	12: 'scanSearchSelect',
	13: 'imageText',
	14: 'inputSearch',//模糊搜索框
	15: 'radio',
	17: 'label',
	18: 'relationAddBtn',//关联面板-新增按钮
	19: 'comboBox',//下拉菜单
	20: 'stateSelect',//状态下拉框
	21: 'prioritySelect',//优先级下拉框
	22: 'typeSelect',//类型下拉框
	23: 'searchBtn',//查询按钮
	24: 'normalBtn',//普通按钮
	25: 'scan',//扫描框
	26: 'archiveBtn',//归档按钮（带周期）
	27: 'sqlEditor',//SQL编辑器
	28: 'normalArchiveBtn',//普通归档按钮（不带周期）
	29: 'batchSaveBtn',//批量保存
	31: 'dateRangePicker',//时间区间
	32: 'image',//图片展示
	33: 'seniorFilter',//批量保存
	34: 'batchArchiveBtn',//批量归档按钮(带周期）
	35: 'batchNormalArchiveBtn',//批量普通归档按钮(不带周期）
	36: 'rate',//星级评价
	43: 'jumpMenuBtn',//跳转多个菜单按钮
	44: 'jumpTabBtn',//跳转多个面板
}
//框架类型
const templateType = {
	1:'frames/UBPFramework',//1-通用业务处理框架对应主页为列表
	2:'frames/inspection/download/download',//2-数据下载框架 点巡检下载
	3:'frames/inspection/inspection/route',// 3-离线点巡检框架
	4:'frames/FormFramework',//4-表单框架
	7:'frames/echartFramework',//7-首页报表框架
	8:'frames/ListFramework',//8-全列表框架
	9:'frames/ScanFramework',//9-扫描框架
	10:'Heath/heath'//9-扫描框架
}
//面板类型
const mobileTabType = {
	1:'nomal',//普通列表
	2:'eject'//弹出面板
}
//面板显示类型
const mobileTabShowType = {
	1:'templates/listTemplate',//列表类型
	2:'templates/formTemplate',//表单类型
	3:'templates/listTemplate',//框架-左侧列表
	4:'templates/BRATemplate',//业务关联面板类型
	5:'templates/DSTemplate',//数据选择类型
	6:'templates/formTemplate',//批量面板
	7:'templates/relationFileTab',//关联面板
}

//事件
const eventType = {
	1:'click',
	2:'change'
}
//按钮样式
const static_btnColors = {
	0:"whiteColor",
	1:"mainColor", 
	2:"yellowColor"
}
//触发器类型
const triggerType = {
	1:"前端触发器",
	2:"后端触发器"
}
//按钮控件
const static_btnElementsInfo = [{
	basetype:4,//新增
	btnStyleType:1,
	iconfont:"iconguanliantianjia",
	positon:"top",
	permissiones:{
		canadd:1
	},
},{
	basetype:5,//编辑
	btnStyleType:2,
	positon:"bottom",
	permissiones:{
		canmodify:1
	},
	noPermissiones:["addBtn"]
},{
	basetype:6,//删除
	btnStyleType:0,
	iconfont:"iconqingkonglishi",
	positon:"bottom",
	permissiones:{
		candelete:1
	},
	noPermissiones:["addBtn"]
},{
	basetype:7,//保存
	btnStyleType:1,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canmodify:1,
		canadd:1
	}
},{
	basetype:18,//关联新增
	btnStyleType:1,
	iconfont:"iconguanliantianjia",
	positon:"top",
	permissiones:{
		canadd:1
	},
},{
	basetype:24,//普通按钮
	btnStyleType:2,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canview:1
	},
},{
	basetype:26,//归档按钮（带周期）
	btnStyleType:1,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canmodify:1
	},
	noPermissiones:["addBtn"]
},{
	basetype:28,//普通归档按钮（不带周期）
	btnStyleType:1,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canmodify:1
	},
	noPermissiones:["addBtn"]
},{
	basetype:29,//批量保存
	btnStyleType:1,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canmodify:1,
		canadd:1
	}
},{
	basetype:34,//批量归档按钮(带周期）
	btnStyleType:1,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canmodify:1
	},
	noPermissiones:["addBtn"]
},{
	basetype:35,//批量普通归档按钮(不带周期）
	btnStyleType:1,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canmodify:1
	},
	noPermissiones:["addBtn"]
},{
	basetype:43,//多菜单跳转
	btnStyleType:2,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canview:1
	},
},{
	basetype:44,//多面板跳转
	btnStyleType:2,
	iconfont:"",
	positon:"bottom",
	permissiones:{
		canview:1
	}
}]
const advancedFilterCondition = [{
	value:1,
	label:">"
},{
	value:2,
	label:"<"
},{
	value:3,
	label:"="
},{
	value:4,
	label:">="
},{
	value:5,
	label:"<="
},{
	value:6,
	label:"!="
}]
const static_basicDatas = [{
	elmentType: [2,3,12,20,21,22,25],
	basicData: 0
},{
	elmentType: [8],
	basicData: []
},{
	elmentType: [9,31],
	basicData: "1970-01-01,1970-01-01 00:00:00"
}]
export {
	elementType,
	static_btnColors,
	templateType,
	mobileTabType,
	mobileTabShowType,
	static_btnElementsInfo,
	advancedFilterCondition,
	static_basicDatas
}