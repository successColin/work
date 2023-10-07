/*
 * @Author: Shishans
 * @Date: 2020/04/21
 * @Desc: 触发器
*/
//触发器条件类型
export const TRIGGER_METHODTYPE = {
	1:'method.AND',
	2:'method.OR'
}
//触发器条件
export const TRIGGER_Conditions = [{
	type:"Number",
	name:'>',
	value:1
},{
	type:"Number",
	name:'<',
	value:2
},{
	type:"String",
	name:'=',
	value:3
},{
	type:"Number",
	name:'>=',
	value:4
},{
	type:"Number",
	name:'<=',
	value:5
},{
	type:"String",
	name:'!=',
	value:6
},{
	type:"Boolean",
	name:'null',
	value:7
},{
	type:"Boolean",
	name:'!null',
	value:8
},{
	type:"Function",
	value:9//多条件
}]