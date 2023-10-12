/**
 * @description 高级接口
 * @autor shishanshan
 * @update 2019/12/26
 */
import * as Path from './interface.js'


let commonApi = {
	seniorFilterRelationGet(_this, params){//获取高级筛选配置
		return _this.$http.post(Path.seniorFilterRelationGet, params)
		.then(res => {
			const result = res.data
			return result
		})
		.catch(err => {
			console.error(err)
		})
	}
}

export default commonApi