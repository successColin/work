'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	// 获取真实手机号
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__C408ADE',
		provider: 'univerify',
		apiKey: '95311f321aebc73ab5fe5e50e3606413',
		apiSecret: '567fa6d948c3f8405616c0a0ebd2a215',
		access_token: event.access_token,
		openid: event.openid
	})
	console.log(res)
	return res
};
