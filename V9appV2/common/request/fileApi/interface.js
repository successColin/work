/**
 * @description 文件上传相关接口定义
 * @author shishanshan
 * @update 2019/08/24
 */
const fileUpload = 'file/fileUpload'
const fileDelete1 = 'file/fileDelete'//废弃
const filesRelationDel = 'filesrelations/delete'
const getRelationFile = 'filesrelations/getRelationFile'
const fileDelete = 'file/fileDeleteByAPP'
const fileUploadBase64 = 'file/ByeUpload'
const textEditorUpload = 'file/textEditorUpload'


export {
	fileUpload,//文档类新增接口
	fileDelete,//文档类删除接口
	filesRelationDel,//文档业务关联关系删除
	getRelationFile,//获取业务关联的图片
	fileUploadBase64,
	textEditorUpload//访问时不用token
}