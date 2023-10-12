/**
 * @description 图片上传
 * @autor shishanshan
 * @update 2019/08/27
 */
import store from '@/store/index'
import * as Path from './interface.js'
import $http from '@/common/utils/request/index.js' 

let formApi = {
	fileUploadBase64(param){//文件关联关系删除
		return $http.post(Path.fileUploadBase64,param)
		.then(res => {
			const result = res.data
			return result
		})
		.catch(err => {
			console.log(err)
		})
	},
	fileDelete(param){//文档删除
		return $http.post(Path.fileDelete, { 
		  "filesJson": JSON.stringify(param)
		})
		.then(res => {
			const result = res.data
			if(result.success){
				return result.data
			}else{
				return []
			}
		})
		.catch(err => {
			console.log(err)
		})
	},
	filesRelationDel(param){//文件关联关系删除
		return $http.del(`${Path.filesRelationDel}/${param}`)
		.then(res => {
			console.log(res)
		})
		.catch(err => {
			console.log(err)
		})
	},
	getRelationFile(params){//获取业务关联的图片
		return $http.post(Path.getRelationFile, params,{
			noLoading:true
		})
		.then(res => {
			const result = res.data
			if(result.success){
				let pics = []
				result.data.map( item => {
					const {id,url,relationId,displayFileName,fileLength,name,mainId} = item
					pics.push({
						mainId, id, url, relationId, displayFileName,fileLength,name,upload_percent:"100"
					})
				})
				return pics
			}else{
				return []
			}
		})
		.catch(err => {
			console.log(err)
		})
	}
}

export default formApi