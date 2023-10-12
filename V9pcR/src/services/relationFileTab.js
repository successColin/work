/*
 * @Author: Tjf
 * @Date:   2019-12-16 09:07:24
 * @Last Modified by: ytx
 * @Last Modified time: 2023-06-30 08:50:06
 * @Desc: 关联文档
 */
import query from '../constants/query';
import fetch from '../utils/fetch';

// 新增业务关联文档
export function insertFilesRelations(params) {
  return fetch(query.INSERT_FILESRELATIONS, {
    method: 'post',
    params,
  });
}

/**
 * 删除业务关联文档
 * @param id
 * @returns {*|Promise|Promise<unknown>}
 */
export function deleteFilesRelations(params) {
  return fetch(`${query.RELETE_FILESRELATIONS}/${params.id}`, {
    method: 'delete',
  });
}

/**
 * 批量新增业务关联文档
 * @param id
 * @returns {*|Promise|Promise<unknown>}
 */
export function batchInsertFilesRelations(params) {
  return fetch(query.BATCH_INSERT_FILESRELATIONS, {
    method: 'post',
    params,
    contentType: 'login',
    isNeedTooken: true,
  });
}

/**
 * 获取业务关联文档
 * @param id
 * @returns {*|Promise|Promise<unknown>}
 */
export function getRelationFiles(params) {
  return fetch(query.GET_RELATIONFILES, {
    method: 'post',
    params,
  });
}

/**
 * 获取业务关联文档
 * @param id
 * @returns {*|Promise|Promise<unknown>}
 */
export function getFileGroupTree(params) {
  return fetch(query.GET_FILDGROUP_TREE, {
    method: 'post',
    params,
  });
}

/**
 * 获取业务关联文档
 * @param id
 * @returns {*|Promise|Promise<unknown>}
 */
export function getRelationFileTree(params) {
  return fetch(query.RELATION_FILE_TREE, {
    method: 'post',
    params,
  });
}
