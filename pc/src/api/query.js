/*
 * @Descripttion:
 * @version:
 * @Author: tjf
 * @Date: 2021-04-20 17:15:39
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-25 17:25:53
 */
// const PREFIX = '/api'; // 前缀
// const VERSION = 'v1'; // 版本号，默认为1，后续有其他接口版本号是其他值
import { PREFIX, VERSION } from '@/config';

export default {
  // 角色管理
  GET_ORG_LIST: '/system/org/listSysOrg', // 获取组织列表
  ADD_ORG: '/system/org/addSysOrg', // 新增组织
  DO_UPDATE_ORG: '/system/org/modifySysOrg', // 修改组织
  DELETE_ORG: '/system/org/batchDeleteOrg', // 删除组织
  GET_ROLE_GROUP: '/system/roleGroup/listSysRoleGroup', // 获取角色分组
  DELETE_ROLE_GROUP: '/system/roleGroup/deleteRoleGroup', // 删除角色分组
  ADD_ROLE_GROUP: '/system/roleGroup/add', // 新增角色分组
  DO_UPDATE_ROLE_GROUP: '/system/roleGroup/edit', // 修改角色分组
  DO_SWITCH_ROLE_LOCATION: '/system/roleGroup/switchLocation', // 切换角色分组位置
  DO_GET_ROLE_LIIST: '/system/role/listSysRole', // 角色列表
  DO_ADD_ROLE: '/system/role/addSysRole', // 新增角色
  DO_UPDATE_ROLE: '/system/role/modifySysRole', // 修改角色system/role/batchDeleteRole
  DO_BATCH_DELETE_ROLE: '/system/role/batchDeleteRole', // 批量删除角色system/role/switchLocation
  DO_SWITCH_ROLE: '/system/role/switchLocation', // 切换角色
  DO_GET_ORG_TREE: '/system/org/listSysOrg', // 获取组织
  DO_EDIT_ROLE_AUTH: '/system/role/modifySysRoleAuthority', // 修改角色权限
  DO_FETCH_AUTH_LIST: '/system/role/listDefaultSysRoleAuthority', // 获取权限
  DO_GET_ROLE_DATA_LIST: '/system/dict/listDict', // 获取数据权限
  D0_EDIT_ROLE_DATA_AUTH: '/system/role/modifySysRoleDataAuthority', // 修改角色数据权限
  DO_COPY_ROLE: '/system/role/copyRole', // 复制角色
  DO_GET_BATCH_AUTH: '/system/role/listSysPermissionItem', // 获取批量操作权限项
  GET_USER_PAGE: '/system/user/pageSysUser', // 根据条件获取用户
  GET_ORG_TREE: '/system/role/listDataOrg', // 获取菜单组织
  GET_FUNCTION_BY_MODULES: '/system/role/listSysRoleAuthority', // 根据模块id获取菜单权限
  GET_ROLE_TREE: '/system/role/listSysRoleTree', // 获取角色树
  GET_POSITION_TREE: '/system/userPost/listSysUserPost', // 获取职位树

  // 用户管理
  GET_USER_LIST: '/system/user/pageSysUser', // 条件查询用户列表
  DO_ADD_USER: '/system/user/addSysUser', // 新增用户
  DO_UPDATE_USER: '/system/user/modifySysUser', // 修改用户
  DO_DELETE_USER: '/system/user/batchDeleteUser', // 批量删除用户
  DO_UPDATE_USER_STATE: '/system/user/modifyResign', // 转离职
  DO_RESET_PASSWORD: '/system/user/resetPassword', // 重置密码
  DO_UPDATE_USER_DATA_AUTH: '/system/user/modifySysUserDataAuthority', // 修改用户数据权限
  DO_UPDATE_USER_FUNCTION_AUTH: '/system/user/modifySysUserAuthority', // 修改用户权限
  FETCH_USER_DEFAULT_FUNCTION_AUTH: '/system/user/listDefaultSysUserAuthority', // 获取用户默认权限
  FETCH_USER_FUNCTION_AUTH_BY_ID: '/system/user/listSysUserAuthority', // 根据用户id,一级菜单id查询权限信息
  GET_USER_DATA_ORG: '/system/user/listDataOrg', // 查询用户数据权限
  UPDATE_INHERIT_AUTH: '/system/user/inheritAuthority', // 修改继承权限

  // 职位管理
  ADD_USER_POST: '/system/userPost/addSysUserPost', // 新增职位
  BATCH_DELETE_USER_POST: '/system/userPost/batchDeleteUserPost', // 批量删除职位
  GET_USER_POST: '/system/userPost/getSysUserPost', // 根据id查询职位
  GET_USER_POST_LIST: '/system/userPost/listSysUserPost', // 职位列表
  MODIFY_USER_POST: '/system/userPost/modifySysUserPost', // 职位列表

  // 用户收藏
  ADD_COLLECTION_USER: '/system/org/addCollectionUser', // 收藏用户
  DELETE_COLLECTION_USER: '/system/org/deleteCollectionUser', // 收藏用户
  GET_LIST_COLLECTION_USER: '/system/org/listCollectionUser', // 收藏用户列表

  // 个人中心
  GET_PERSONAL_CENTER_USER: '/system/personalCenter/getSysUser', // 获取用户信息
  SWITCH_PERSONAL_CENTER_TENANT: '/system/personalCenter/switchTenant', // 切换租户
  GET_PERSONAL_CENTER_TENANT_LIST: '/system/personalCenter/listTenantByUserId', // 查询租户列表
  GET_PERSONAL_CENTER_TENANT_INFO: '/system/personalCenter/getTenantInfo', // 查询租户详情
  MODIFY_PERSONAL_CENTER_AVATAR: '/system/personalCenter/modifyAvatar', // 修改头像
  MODIFY_PERSONAL_CENTER_EMAIL: '/system/personalCenter/modifyEmail', // 修改邮箱
  MODIFY_PERSONAL_CENTER_PASSWORD: '/system/personalCenter/modifyPassword', // 修改密码
  MODIFY_PERSONAL_CENTER_SIGNATURE: '/system/personalCenter/modifySignature', // 修改签名
  MODIFY_PERSONAL_CENTER_TELPHONE: '/system/personalCenter/modifyTelephone', // 修改手机号
  MODIFY_PERSONAL_CENTER_NAME: '/system/personalCenter/modifyUsername', // 修改用户名
  BIND_PERSONAL_CENTER_EMAIL: '/system/personalCenter/bindEmail', // 绑定邮箱
  DO_LOGOUT: '/logout', // 退出登录

  // 图标管理
  GET_ICON_LIST: '/system/icon/listIcon', // 获取图标列表
  DELETE_ICON_BY_BATCH: '/system/icon/batchDeleteIcon', //  批量删除图标
  BATCH_UPLOAD_INCON: '/system/icon/batchUpload', // 批量上传图标

  // 知识库
  GET_MENU_CENTER: '/system/sysMenu/menuCenter', // 菜单中心
  GET_KNOWLEDGE_ALL: '/system/knowledge/listFiles', // 获取全部的文件
  ADD_KNOWLEDGE_FOLDER: '/system/knowledge/saveFolder', // 新增文件夹
  EDIT_KNOWLEDGE_FOLDER: '/system/knowledge/updateFolder', // 编辑文件文件夹名称
  GET_KNOWLEDGE_LIST_BY_PAGE: '/system/knowledge/pageFiles', // 分页查询列表
  DEL_KNOWLEDGE_FILES: '/system/knowledge/deleteFile', // 删除文件
  MOVE_KNOWLEDGE_FILES: '/system/knowledge/moveFolder', // 移动文件
  GET_COLLECT_FILES_LIST: '/system/knowledge/listCollection', // 获取收藏列表
  COLLECT_FILES: '/system/knowledge/collect', // 文件收藏
  UNCOLLECT_FILES: '/system/knowledge/cancelCollect', // 取消文件收藏
  VISIT_KNOWLEDGE_FILE: '/system/knowledge/visitRecord', // 访问文件
  LAST_KNOWLEDGE_FILE_LIST: '/system/knowledge/listVisitRecords', // 最新常用列表接口
  SHARE_KNOWLEDGE_FILES: '/system/knowledge/fileShare', // 分享的文件
  GET_SHARE_KNOWLEDGE_FILES_LIST: '/system/knowledge/listShare', // 获取分享的文件
  CANCEL_SHARE_KNOWLEDGE_FILES: '/system/knowledge/cancelShare', // 取消分享
  GET_OTHERS_SHARE_KNOWLEDGE_FILES: '/system/knowledge/listOtherShare', // 获取他人的分享
  DO_SET_KNOWLEDGE_USER: '/system/knowledge/sharedSet', // 修改文件的被分享人
  DO_GET_KNOWLEDGE_SHARE: '/system/knowledge/listSharedUser', // 获取被分享人列表
  GET_KNOWLEDGE_USER_LIST: '/system/knowledge/pageEmpower', // 根据组织职位角色获取用户列表
  DO_KNOWLEDGE_DOWNLOAD: `${PREFIX}/${VERSION}/system/knowledge/downFiles`, // 文件下载
  DO_UPDATE_KNOWLEDGE_AUTH: '/system/knowledge/empowerUpdate', // 修改知识库权限
  DO_FETCH_BUSSINESS: '/system/knowledge/pageBusinessFile', // 获取业务列表
  DO_SEARCH_BUSSINESS: '/system/knowledge/pageBusinessFiles', // 获取业务子文件里面的文件

  // 导入模板配置
  DO_Import_Config: `${PREFIX}/${VERSION}/system/sysImportConfig/downloadTemplate`, // 文件下载

  // 配置通用导出按钮
  DO_Export_Template: `${PREFIX}/${VERSION}/system/sysImportExport/exportTemplate`, // 根据模板导出
  DO_Export_Interface: `${PREFIX}/${VERSION}/system/sysImportExport/exportInterface`, // 根据页面导出

  // 通用导入导出
  GET_IMPORT_TEMPLATE: `${PREFIX}/${VERSION}/system/sysImportExport/downloadTemplate`, // 通用导入获取模板
  GET_TEMPLATE_DESCRIPTION: '/system/sysImportExport/getRemarks', // 模板备注
  UPLOAD_IMPORT_FILE: '/system/sysImportExport/importTemplate', // 导入
  DO_PROCESSING_CHECK: '/system/sysImportExport/getCheckProgress', // 导入校验
  DO_PROCESSING_IMPORT: '/system/sysImportExport/getUploadProgress', // 导入进度
  DO_PROCESSING_IMPORT_START: '/system/sysImportExport/importTemplateStart', // 开起导入动作
  DO_CHECK_TEMPLATE: '/system/sysImportExport/checkTemplate', // 校验模板是否正确

  // 导出错误信息
  EXPORT_ERROR_MESSAGE: `${PREFIX}/${VERSION}/system/sysImportExport/exportErrorMessage`, // 常规导出
  EXPORT_ERROR_TREE_MESSAGE: `${PREFIX}/${VERSION}/system/treeImport/exportErrorMessage`, // 树导出
  EXPORT_ERROR_SPCIAL_MESSAGE: `${PREFIX}/${VERSION}/system/special/exportErrorMessage`, // 特殊表导出

  // 流程
  GET_TABLE_FIELDS: '/system/column/listSysEntityColumns', // 获取表字段
  GET_FLOW_LIST: '/workflow/list', // 获取流程列表
  ADD_FLOW: '/workflow/add', // 新增流程
  EDIT_FLOW: '/workflow/edit', // 编辑流程
  ADD_FLOW_VERSION: '/workflow/addVersion', // 新增流程版本
  DELETE_FLOW: '/workflow/deleteById', // 删除工作流
  GET_FLOW_VERSION_LIST: '/workflow/version/list', // 查询流程的版本列表
  DELETE_FLOW_VERSION: '/workflow/deleteVersion', // 删除流程版本
  UPDATE_FLOW_VERSION: '/workflow/enableVersion', // 启用流程版本
  DISABLED_FLOW_VERSION: '/workflow/disableVersion', // 禁止流程版本
  ADD_VERSION_NODE: '/workflowNode/add', // 新增版本节点
  UPDATE_VERSION_NODE_TREE: '/workflow/updateVersion', // 更改版本中的流程树
  DEL_VERSION_NODE_IN_TREE: '/workflowNode/delete', // 删除流程树上的节点
  GET_FLOW_NODE_INFO: '/workflowNode/getNodeAttr', // 获取节点信息详情
  UPDATE_FLOW_NODE_INFO: '/workflowNode/editWithAttr', // 修改节点信息
  GET_I_INITIATED: '/workflowTask/launchByme', // 获取我发起的任务列表
  GET_MY_TODO_LIST: '/workflowTask/mytodo', // 获取带我处理的任务列表
  GET_MY_COMPLETED_TASKS_LIST: '/workflowTask/complated', // 获取已完成的任务列表
  FLOW_AGREE: '/workflowTask/agree', // 流程审批同意
  FLOW_SUBMIT: '/workflowTask/submit ', // 流程审批同意
  FLOW_REJECT: '/workflowTask/reject', // 流程审批驳回
  FLOW_NODE_EDIT: '/workflowNode/edit', // 修改节点
  GET_TASK_FLOW_LIST: '/workflowTask/instance/taskSite', // 任务待办中的流程
  GET_TASK_FLOW_REJECTNODES: '/workflowTask/rejectNodes', // 获取可驳回节点
  DO_TASK_FLOW_REFERRAL: '/workflowTask/referral', // 转审
  DO_TASK_FLOW_COUNTERSIGN: '/workflowTask/endorsement', // 加签
  DO_RESET_LAUNCH: '/workflowTask/relaunch', // 重新发起流程
  DO_REVOKE_FLOW: '/workflowTask/revoke', // 流程撤回
  GET_BEFORE_FLOW_NODE: '/workflowNode/getNodeListBeforeThis', // 获取当前节点的前面节点
  GET_FLOW_GROUP_LIST: '/workflowGroup/list', // 流程分组列表
  ADD_FLOW_GROUP: '/workflowGroup/add', // 新增流程分组
  DELETE_FLOW_GROUP: '/workflowGroup/logicDel', // 新增流程分组
  UPDATE_FLOW_GROUP: '/workflowGroup/edit', // 修改流程分组属性
  SWITCH_FLOW_GROUP: '/system/sysMenu/switchLocation', // 修改流程分组排序
  GET_API_LIST: '/workflowNode/getWebHookList', // 获取代理接口列表

  // 主页配置
  GET_HOME_PAGE_LIST: '/system/homepage/listSysHomepageConfig', // 主页列表
  SAVE_HOME_PAGE: '/system/homepage/insertSysHomepageConfig', // 新增主页
  EDIT_HOME_PAGE: '/system/homepage/modifySysHomepageConfig', // 编辑自定义菜单
  DEL_HOME_PAGE: '/system/homepage/deleteSysHomepageConfig', // 删除主页配置
  ASYNC_HOME_DATA: '/system/homepage/getSysHomepageDynamicData', // 动态获取数据
  INSERT_ELEMENT_LIST: '/system/homepage/insertSysHomepageElementRealtime', // 新增控件
  DEL_ELEMENT_LIST: '/system/homepage/deleteSysHomepageElement', // 删除控件
  GET_HOME_FILTER: '/system/homepage/listSysHomepageDataFilters', // 获取过滤器
  INSERT_HOME_FILTER: '/system/homepage/insertDvDataFilters', // 新增过滤器
  UPDATE_HOME_FILTER: '/system/homepage/modifyDvDataFilters', // 编辑过滤器
  DEL_HOME_FILTER: '/system/homepage/deleteDvDataFilters', // 删除过滤器
  BATCH_UPDATE_ELEMENT_LIST: '/system/homepage/insertSysHomepageElement', // 批量新增编辑控件列表
  COPY_HOME_PAGE: '/system/homepage/copySysHomepageConfig', // 复制菜单
  SWITCH_HOME_PAGE_SNO: '/system/homepage/modifySysHomepageConfigSno', // 调整主页sno排序
  GET_ELEMENT_ELEMENT_LIST: '/system/homepage/listSysHomepageElement', // 获取该菜单的所有控件
  GET_ELEMENTT_DATA_BY_REALLY: '/system/homepage/getSysHomepageData', // 获取真实数据
  GET_HOME_ROUTE: '/system/sysMenu/listHomePageMenu', // 获取主页的路由配置

  GET_PAGE_INNER_MAIL: 'innerMail/pageInnerMail', // 查询我的站内信分页
  MARK_MAIL_READ: 'innerMail/read', // 设置我的站内信已读
  MARK_MAIL_ALL_READ: 'innerMail/readMyAll', // 设置我的所有站内信已读
  GET_MAIL_COUNT: 'innerMail/queryCount', // 查询当前时间登录用户的站内信数量
  DOWNlOAD_RELATIONS_Files: `${PREFIX}/${VERSION}/system/materials/downloadRelationFiles`, // 导出关联资料
};
