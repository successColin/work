import store from '@/store/index'

import * as Path from './interface.js'
import { elementType } from '@/common/constant/constant.js'
import $http from '@/common/utils/request/index.js'

let currencyApi = {
	getDate(params,vm){//获取数据
		return $http.post(Path.currencyGetPageData, params, 
			{header:{'content-type': 'application/json;charset=UTF-8'}},
		)
		.then(res => {
			const data = res.data.data
			return data.dataList[0]
		})
		.catch(err => {
			console.log(err)
		})
	}
}

export default currencyApi